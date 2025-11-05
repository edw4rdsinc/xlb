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

// This v2 endpoint processes jobs in stages to avoid timeouts
export async function GET(request: Request) {
  try {
    // Verify this is called by Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Reset jobs stuck in processing for more than 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    await supabase
      .from('conflict_analysis_jobs')
      .update({
        status: 'pending',
        error_message: 'Reset from stuck processing state',
        progress: { step: 'pending', percent: 0 }
      })
      .eq('status', 'processing')
      .lt('updated_at', tenMinutesAgo)

    // Check for jobs in extraction phase that need continuing
    const { data: extractingJobs } = await supabase
      .from('conflict_analysis_jobs')
      .select('*')
      .eq('status', 'extracting')
      .order('updated_at', { ascending: true })
      .limit(1)

    if (extractingJobs && extractingJobs.length > 0) {
      const job = extractingJobs[0]
      console.log(`Continuing extraction for job ${job.id}`)
      await continueExtraction(job)
      return NextResponse.json({ message: 'Continued extraction', jobId: job.id })
    }

    // Check for jobs in analysis phase
    const { data: analyzingJobs } = await supabase
      .from('conflict_analysis_jobs')
      .select('*')
      .eq('status', 'analyzing')
      .order('updated_at', { ascending: true })
      .limit(1)

    if (analyzingJobs && analyzingJobs.length > 0) {
      const job = analyzingJobs[0]
      console.log(`Continuing analysis for job ${job.id}`)
      await continueAnalysis(job)
      return NextResponse.json({ message: 'Continued analysis', jobId: job.id })
    }

    // Find new pending jobs
    const { data: pendingJobs } = await supabase
      .from('conflict_analysis_jobs')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(1)

    if (!pendingJobs || pendingJobs.length === 0) {
      return NextResponse.json({ message: 'No pending jobs', processed: 0 })
    }

    const job = pendingJobs[0]
    console.log(`Starting new job ${job.id}`)

    // Start PDF extraction
    await startExtraction(job)

    return NextResponse.json({ message: 'Started job', jobId: job.id })

  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    )
  }
}

async function startExtraction(job: any) {
  try {
    // Update status to extracting
    await supabase
      .from('conflict_analysis_jobs')
      .update({
        status: 'extracting',
        progress: { step: 'extracting_spd', percent: 5 },
      })
      .eq('id', job.id)

    // Extract SPD text
    const spdExtraction = await extractPDFText(job.spd_url, job.spd_filename)

    await supabase
      .from('conflict_analysis_jobs')
      .update({
        spd_text: spdExtraction.text,
        spd_pages: spdExtraction.pages,
        progress: { step: 'extracting_handbook', percent: 25 },
      })
      .eq('id', job.id)

    // Extract Handbook text
    const handbookExtraction = await extractPDFText(job.handbook_url, job.handbook_filename)

    await supabase
      .from('conflict_analysis_jobs')
      .update({
        handbook_text: handbookExtraction.text,
        handbook_pages: handbookExtraction.pages,
        status: 'analyzing', // Move to analysis phase
        progress: { step: 'analyzing_conflicts', percent: 50 },
      })
      .eq('id', job.id)

    console.log(`Extraction complete for job ${job.id}`)

  } catch (error: any) {
    console.error(`Extraction failed for job ${job.id}:`, error)
    await supabase
      .from('conflict_analysis_jobs')
      .update({
        status: 'error',
        error_message: `Extraction failed: ${error.message}`,
        completed_at: new Date().toISOString()
      })
      .eq('id', job.id)
  }
}

async function continueExtraction(job: any) {
  // Resume extraction if it was interrupted
  if (!job.spd_text) {
    const spdExtraction = await extractPDFText(job.spd_url, job.spd_filename)
    await supabase
      .from('conflict_analysis_jobs')
      .update({
        spd_text: spdExtraction.text,
        spd_pages: spdExtraction.pages,
        progress: { step: 'extracting_handbook', percent: 25 },
      })
      .eq('id', job.id)
  }

  if (!job.handbook_text) {
    const handbookExtraction = await extractPDFText(job.handbook_url, job.handbook_filename)
    await supabase
      .from('conflict_analysis_jobs')
      .update({
        handbook_text: handbookExtraction.text,
        handbook_pages: handbookExtraction.pages,
        status: 'analyzing',
        progress: { step: 'analyzing_conflicts', percent: 50 },
      })
      .eq('id', job.id)
  }
}

async function continueAnalysis(job: any) {
  try {
    const state = job.processing_state || {}
    const nextChunk = state.processedChunks || 0

    console.log(`Processing chunk ${nextChunk + 1} for job ${job.id}`)

    // Call the chunked analysis API
    const analysisUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/employee/analyze-conflicts-v2`
      : `${process.env.NEXT_PUBLIC_SITE_URL}/api/employee/analyze-conflicts-v2`

    const response = await fetch(analysisUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId: job.id,
        chunkIndex: nextChunk,
        totalChunks: state.totalChunks
      }),
    })

    if (!response.ok) {
      throw new Error('Analysis failed')
    }

    const result = await response.json()

    if (result.complete) {
      console.log(`Analysis complete for job ${job.id}`)

      // Generate report and send email
      await generateAndSendReport(job)

      // Mark as complete
      await supabase
        .from('conflict_analysis_jobs')
        .update({
          status: 'complete',
          completed_at: new Date().toISOString(),
          progress: { step: 'complete', percent: 100 },
        })
        .eq('id', job.id)

      // Update broker profile usage
      if (job.broker_profile_id) {
        const { data: profile } = await supabase
          .from('broker_profiles')
          .select('use_count')
          .eq('id', job.broker_profile_id)
          .single()

        await supabase
          .from('broker_profiles')
          .update({
            last_used: new Date().toISOString(),
            use_count: (profile?.use_count || 0) + 1,
          })
          .eq('id', job.broker_profile_id)
      }
    } else {
      // More chunks to process
      console.log(`Processed chunks ${result.processedChunks}/${result.totalChunks} for job ${job.id}`)
    }

  } catch (error: any) {
    console.error(`Analysis failed for job ${job.id}:`, error)
    await supabase
      .from('conflict_analysis_jobs')
      .update({
        status: 'error',
        error_message: `Analysis failed: ${error.message}`,
        completed_at: new Date().toISOString()
      })
      .eq('id', job.id)
  }
}

async function generateAndSendReport(job: any) {
  // Get the latest job data with analysis results
  const { data: updatedJob } = await supabase
    .from('conflict_analysis_jobs')
    .select('*')
    .eq('id', job.id)
    .single()

  if (!updatedJob) return

  // Generate HTML report
  const reportUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/employee/generate-conflict-report`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/api/employee/generate-conflict-report`

  const reportResponse = await fetch(reportUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      job: updatedJob,
      analysis: {
        conflicts: updatedJob.conflicts,
        alignments: updatedJob.alignments,
        executive_summary: updatedJob.executive_summary
      },
      spdPages: updatedJob.spd_pages,
      handbookPages: updatedJob.handbook_pages,
    }),
  })

  if (!reportResponse.ok) {
    throw new Error('Report generation failed')
  }

  const { html: reportHTML } = await reportResponse.json()

  await supabase
    .from('conflict_analysis_jobs')
    .update({
      report_html: reportHTML,
      progress: { step: 'sending_email', percent: 95 },
    })
    .eq('id', job.id)

  // Send email
  const emailUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/employee/send-conflict-report`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/api/employee/send-conflict-report`

  const emailResponse = await fetch(emailUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipients: updatedJob.email_recipients,
      clientName: updatedJob.client_name,
      reportHTML,
      spdFilename: updatedJob.spd_filename,
      handbookFilename: updatedJob.handbook_filename,
    }),
  })

  if (!emailResponse.ok) {
    throw new Error('Email sending failed')
  }
}

async function extractPDFText(pdfUrl: string, fileName: string): Promise<{ text: string; pages: number }> {
  let s3Key = fileName

  if (pdfUrl.includes('pdf-uploads/')) {
    const match = pdfUrl.match(/pdf-uploads\/.*\.pdf/)
    if (match) {
      s3Key = match[0]
    }
  }

  console.log(`Extracting PDF: ${fileName}`)

  // Generate signed URL for Wasabi
  const command = new GetObjectCommand({
    Bucket: process.env.WASABI_BUCKET || 'xl-benefits',
    Key: s3Key,
  })

  const signedUrl = await getSignedUrl(wasabiClient, command, { expiresIn: 900 })

  // Call the Python PDF extraction endpoint
  const extractUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/extract-pdf`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/api/extract-pdf`

  const response = await fetch(extractUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pdf_url: signedUrl }),
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(`PDF extraction failed for ${fileName}: ${data.error || 'Unknown error'}`)
  }

  console.log(`Successfully extracted ${data.pages} pages from ${fileName}`)

  return {
    text: data.text,
    pages: data.pages || 0,
  }
}

// Disable caching for cron endpoints
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes max for Pro plan