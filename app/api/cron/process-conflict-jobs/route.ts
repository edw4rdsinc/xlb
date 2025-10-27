import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// This endpoint is called by Vercel Cron every minute
export async function GET(request: Request) {
  try {
    // Verify this is called by Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find pending jobs (limit to 5 per run to avoid timeout)
    const { data: jobs, error } = await supabase
      .from('conflict_analysis_jobs')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(5)

    if (error) {
      console.error('Error fetching jobs:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ message: 'No pending jobs', processed: 0 })
    }

    console.log(`Found ${jobs.length} pending jobs`)

    // Process each job
    const results = await Promise.allSettled(
      jobs.map(job => processJob(job))
    )

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

async function processJob(job: any) {
  const startTime = Date.now()

  try {
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
    const spdExtraction = await extractPDFText(job.spd_url, job.spd_filename)

    await supabase
      .from('conflict_analysis_jobs')
      .update({
        spd_text: spdExtraction.text,
        spd_pages: spdExtraction.pages,
        progress: { step: 'extracting_handbook', percent: 30 },
      })
      .eq('id', job.id)

    // Step 2: Extract Handbook text
    const handbookExtraction = await extractPDFText(job.handbook_url, job.handbook_filename)

    await supabase
      .from('conflict_analysis_jobs')
      .update({
        handbook_text: handbookExtraction.text,
        handbook_pages: handbookExtraction.pages,
        progress: { step: 'analyzing_conflicts', percent: 60 },
      })
      .eq('id', job.id)

    // Step 3: Analyze conflicts
    const analysisRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/employee/analyze-conflicts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        spdText: spdExtraction.text,
        handbookText: handbookExtraction.text,
        focusAreas: job.focus_areas || [],
        clientName: job.client_name,
      }),
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

    // Step 4: Generate HTML report
    const reportHTML = await generateReport({
      job,
      analysis: analysisData.analysis,
      spdPages: spdExtraction.pages,
      handbookPages: handbookExtraction.pages,
    })

    await supabase
      .from('conflict_analysis_jobs')
      .update({
        report_html: reportHTML,
        progress: { step: 'sending_email', percent: 90 },
      })
      .eq('id', job.id)

    // Step 5: Send email
    await sendReportEmail({
      recipients: job.email_recipients,
      clientName: job.client_name,
      reportHTML,
      spdFilename: job.spd_filename,
      handbookFilename: job.handbook_filename,
    })

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

async function extractPDFText(pdfUrl: string, fileName: string): Promise<{ text: string; pages: number }> {
  // Call the existing Python PDF extraction endpoint
  const extractUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/extract-pdf`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/api/extract-pdf`

  const response = await fetch(extractUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pdf_url: pdfUrl }),
  })

  if (!response.ok) {
    throw new Error(`PDF extraction failed for ${fileName}`)
  }

  const data = await response.json()
  return {
    text: data.text,
    pages: data.pages || 0,
  }
}

async function generateReport(data: any): Promise<string> {
  // Generate branded HTML report
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/employee/generate-conflict-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
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
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/employee/send-conflict-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Email sending failed')
  }
}

// Disable caching for cron endpoints
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes max for Pro plan
