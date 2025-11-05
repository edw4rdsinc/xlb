import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const wasabiClient = new S3Client({
  endpoint: process.env.WASABI_ENDPOINT || 'https://s3.us-west-1.wasabisys.com',
  region: process.env.WASABI_REGION || 'us-west-1',
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY!,
    secretAccessKey: process.env.WASABI_SECRET_KEY!,
  },
})

// This endpoint is called by Vercel Cron every minute
export async function GET(request: Request) {
  try {
    // Verify this is called by Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.log('Cron auth failed:', {
        hasAuthHeader: !!authHeader,
        hasCronSecret: !!process.env.CRON_SECRET,
        authHeader: authHeader?.substring(0, 20) + '...',
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First, reset any jobs stuck in processing for more than 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    const { error: resetError } = await supabase
      .from('conflict_analysis_jobs')
      .update({
        status: 'pending',
        error_message: 'Reset from stuck processing state',
        progress: { step: 'pending', percent: 0 }
      })
      .eq('status', 'processing')
      .lt('updated_at', tenMinutesAgo)

    if (resetError) {
      console.error('Error resetting stuck jobs:', resetError)
    }

    // Find pending jobs (limit to 2 per run to avoid timeout)
    const { data: jobs, error } = await supabase
      .from('conflict_analysis_jobs')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(2)

    if (error) {
      console.error('Error fetching jobs:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ message: 'No pending jobs', processed: 0 })
    }

    console.log(`Found ${jobs.length} pending jobs`)

    // Process jobs sequentially to avoid overwhelming the system
    const results = []
    for (const job of jobs) {
      try {
        // Create AbortController for proper timeout handling
        const abortController = new AbortController()

        // Process job with a longer timeout (4 minutes for large PDFs)
        let timeoutId: NodeJS.Timeout | null = null
        let jobCompleted = false

        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            console.log(`Job ${job.id} timing out after 4 minutes`)
            abortController.abort() // Abort all fetch requests
            reject(new Error('Job processing timeout after 4 minutes'))
          }, 240000)
        })

        const result = await Promise.race([
          processJob(job, abortController.signal).then(res => {
            jobCompleted = true
            if (timeoutId) clearTimeout(timeoutId)
            return res
          }),
          timeoutPromise
        ])

        results.push({ status: 'fulfilled' })
      } catch (error: any) {
        console.error(`Job ${job.id} failed:`, error.message)
        console.error('Full error:', error)
        results.push({ status: 'rejected', error })

        // Mark job as error if it failed
        await supabase
          .from('conflict_analysis_jobs')
          .update({
            status: 'error',
            error_message: error.message || 'Processing failed',
            error_details: {
              stack: error.stack,
              message: error.message,
              timestamp: new Date().toISOString(),
              aborted: error.name === 'AbortError'
            },
            completed_at: new Date().toISOString()
          })
          .eq('id', job.id)
      }
    }

    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    return NextResponse.json({
      message: 'Job processing complete',
      processed: jobs.length,
      successful,
      failed,
    })
  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    )
  }
}

async function processJob(job: any, signal?: AbortSignal) {
  const startTime = Date.now()

  try {
    // Check if already aborted
    if (signal?.aborted) {
      throw new Error('Job aborted before starting')
    }

    console.log(`Processing job ${job.id}`)

    // Update status to processing
    await supabase
      .from('conflict_analysis_jobs')
      .update({
        status: 'processing',
        progress: { step: 'extracting_spd', percent: 10 },
      })
      .eq('id', job.id)

    // Step 1: Extract SPD text
    const spdExtraction = await extractPDFText(job.spd_url, job.spd_filename, signal)

    await supabase
      .from('conflict_analysis_jobs')
      .update({
        spd_text: spdExtraction.text,
        spd_pages: spdExtraction.pages,
        progress: { step: 'extracting_handbook', percent: 30 },
      })
      .eq('id', job.id)

    // Check if aborted before continuing
    if (signal?.aborted) {
      throw new Error('Job aborted during SPD extraction')
    }

    // Step 2: Extract Handbook text
    const handbookExtraction = await extractPDFText(job.handbook_url, job.handbook_filename, signal)

    await supabase
      .from('conflict_analysis_jobs')
      .update({
        handbook_text: handbookExtraction.text,
        handbook_pages: handbookExtraction.pages,
        progress: { step: 'analyzing_conflicts', percent: 60 },
      })
      .eq('id', job.id)

    // Check if aborted before continuing
    if (signal?.aborted) {
      throw new Error('Job aborted during handbook extraction')
    }

    // Step 3: Analyze conflicts
    const analysisUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/employee/analyze-conflicts`
      : `${process.env.NEXT_PUBLIC_SITE_URL}/api/employee/analyze-conflicts`

    const analysisRes = await fetch(analysisUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        spdText: spdExtraction.text,
        handbookText: handbookExtraction.text,
        focusAreas: job.focus_areas || [],
        clientName: job.client_name,
      }),
      signal, // Pass abort signal to fetch
    })

    if (!analysisRes.ok) {
      throw new Error('Conflict analysis failed')
    }

    const analysisData = await analysisRes.json()

    await supabase
      .from('conflict_analysis_jobs')
      .update({
        conflicts: analysisData.analysis.conflicts,
        alignments: analysisData.analysis.alignments,
        progress: { step: 'generating_report', percent: 80 },
      })
      .eq('id', job.id)

    // Check if aborted before continuing
    if (signal?.aborted) {
      throw new Error('Job aborted during analysis')
    }

    // Step 4: Generate HTML report
    const reportHTML = await generateReport({
      job,
      analysis: analysisData.analysis,
      spdPages: spdExtraction.pages,
      handbookPages: handbookExtraction.pages,
    }, signal)

    await supabase
      .from('conflict_analysis_jobs')
      .update({
        report_html: reportHTML,
        progress: { step: 'sending_email', percent: 90 },
      })
      .eq('id', job.id)

    // Check if aborted before continuing
    if (signal?.aborted) {
      throw new Error('Job aborted during report generation')
    }

    // Step 5: Send email
    await sendReportEmail({
      recipients: job.email_recipients,
      clientName: job.client_name,
      reportHTML,
      spdFilename: job.spd_filename,
      handbookFilename: job.handbook_filename,
    }, signal)

    // Mark as complete
    const processingTime = Math.floor((Date.now() - startTime) / 1000)
    await supabase
      .from('conflict_analysis_jobs')
      .update({
        status: 'complete',
        completed_at: new Date().toISOString(),
        processing_time_seconds: processingTime,
        progress: { step: 'complete', percent: 100 },
      })
      .eq('id', job.id)

    console.log(`Job ${job.id} completed in ${processingTime}s`)

    // Update broker profile usage
    if (job.broker_profile_id) {
      await supabase
        .from('broker_profiles')
        .update({
          last_used: new Date().toISOString(),
          use_count: supabase.rpc('increment', { row_id: job.broker_profile_id }),
        })
        .eq('id', job.broker_profile_id)
    }

  } catch (error: any) {
    console.error(`Job ${job.id} failed:`, error)

    // Mark as error
    await supabase
      .from('conflict_analysis_jobs')
      .update({
        status: 'error',
        error_message: error.message,
        error_details: { stack: error.stack },
        completed_at: new Date().toISOString(),
      })
      .eq('id', job.id)

    throw error
  }
}

async function extractPDFText(pdfUrl: string, fileName: string, signal?: AbortSignal): Promise<{ text: string; pages: number }> {
  // Check if already aborted
  if (signal?.aborted) {
    throw new Error('PDF extraction aborted')
  }

  // Extract the S3 key from the URL (handle both full URLs and paths)
  // URLs can be like:
  // - "https://s3.us-west-1.wasabisys.com/xl-benefits/pdf-uploads/xxx.pdf"
  // - "/xl-benefits/pdf-uploads/xxx.pdf"
  // - "pdf-uploads/xxx.pdf"
  let s3Key = fileName

  if (pdfUrl.includes('pdf-uploads/')) {
    // Extract just the key part after the bucket name
    const match = pdfUrl.match(/pdf-uploads\/.*\.pdf/)
    if (match) {
      s3Key = match[0]
    }
  }

  console.log(`Extracting PDF: ${fileName}`)
  console.log(`Original URL: ${pdfUrl}`)
  console.log(`S3 Key: ${s3Key}`)

  // Generate signed URL for Wasabi (valid for 15 minutes)
  const command = new GetObjectCommand({
    Bucket: process.env.WASABI_BUCKET || 'xl-benefits',
    Key: s3Key,
  })

  const signedUrl = await getSignedUrl(wasabiClient, command, { expiresIn: 900 })
  console.log(`Generated signed URL (first 100 chars): ${signedUrl.substring(0, 100)}...`)

  // Call the Python PDF extraction endpoint
  const extractUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/extract-pdf`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/api/extract-pdf`

  console.log(`Extract endpoint: ${extractUrl}`)

  const response = await fetch(extractUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pdf_url: signedUrl }),
    signal, // Pass abort signal to fetch
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    const errorMsg = data.error || 'Unknown error'
    console.error(`PDF extraction error for ${fileName}:`, errorMsg)
    console.error(`Response status: ${response.status}`)
    console.error(`Full response:`, data)
    throw new Error(`PDF extraction failed for ${fileName}: ${errorMsg}`)
  }

  console.log(`Successfully extracted ${data.pages} pages from ${fileName}`)

  return {
    text: data.text,
    pages: data.pages || 0,
  }
}

async function generateReport(data: any, signal?: AbortSignal): Promise<string> {
  // Check if already aborted
  if (signal?.aborted) {
    throw new Error('Report generation aborted')
  }

  // Generate branded HTML report
  console.log('Passing to report generator:', {
    client_name: data.job.client_name,
    client_logo_url: data.job.client_logo_url,
    branding: data.job.branding,
  })

  const reportUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/employee/generate-conflict-report`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/api/employee/generate-conflict-report`

  const response = await fetch(reportUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal, // Pass abort signal to fetch
  })

  if (!response.ok) {
    throw new Error('Report generation failed')
  }

  const result = await response.json()
  return result.html
}

async function sendReportEmail(data: {
  recipients: string[]
  clientName: string
  reportHTML: string
  spdFilename: string
  handbookFilename: string
}, signal?: AbortSignal) {
  // Check if already aborted
  if (signal?.aborted) {
    throw new Error('Email sending aborted')
  }

  const emailUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/employee/send-conflict-report`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/api/employee/send-conflict-report`

  const response = await fetch(emailUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal, // Pass abort signal to fetch
  })

  if (!response.ok) {
    throw new Error('Email sending failed')
  }
}

// Disable caching for cron endpoints
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes max for Pro plan
