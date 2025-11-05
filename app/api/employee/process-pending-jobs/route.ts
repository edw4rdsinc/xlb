import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Manual endpoint to check and process pending conflict analysis jobs
// This can be called directly to debug processing issues
export async function GET(request: Request) {
  try {
    console.log('Checking for pending conflict analysis jobs...')

    // Find pending jobs
    const { data: jobs, error } = await supabase
      .from('conflict_analysis_jobs')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching jobs:', error)
      return NextResponse.json({
        error: 'Failed to fetch jobs',
        details: error.message
      }, { status: 500 })
    }

    const pendingCount = jobs?.length || 0
    console.log(`Found ${pendingCount} pending jobs`)

    // Get jobs in processing state (might be stuck)
    const { data: processingJobs, error: processingError } = await supabase
      .from('conflict_analysis_jobs')
      .select('*')
      .eq('status', 'processing')
      .order('created_at', { ascending: true })

    const processingCount = processingJobs?.length || 0

    // Get recent completed jobs
    const { data: completedJobs } = await supabase
      .from('conflict_analysis_jobs')
      .select('id, created_at, completed_at, client_name, status, error_message')
      .eq('status', 'complete')
      .order('completed_at', { ascending: false })
      .limit(5)

    // Get recent failed jobs
    const { data: failedJobs } = await supabase
      .from('conflict_analysis_jobs')
      .select('id, created_at, client_name, status, error_message')
      .eq('status', 'error')
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      success: true,
      summary: {
        pending: pendingCount,
        processing: processingCount,
        totalJobs: pendingCount + processingCount
      },
      pendingJobs: jobs?.map(j => ({
        id: j.id,
        created_at: j.created_at,
        client_name: j.client_name,
        status: j.status,
        email_recipients: j.email_recipients
      })),
      processingJobs: processingJobs?.map(j => ({
        id: j.id,
        created_at: j.created_at,
        client_name: j.client_name,
        status: j.status,
        progress: j.progress
      })),
      recentCompleted: completedJobs,
      recentFailed: failedJobs,
      instructions: "To process pending jobs, the cron job should run automatically. Check Vercel logs for cron execution."
    })
  } catch (error: any) {
    console.error('Check jobs error:', error)
    return NextResponse.json(
      { error: 'Failed to check jobs', details: error.message },
      { status: 500 }
    )
  }
}

// POST endpoint to manually trigger processing (for emergency use)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { jobId, forceProcess } = body

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID required' },
        { status: 400 }
      )
    }

    // Get the specific job
    const { data: job, error } = await supabase
      .from('conflict_analysis_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error || !job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    if (job.status === 'complete') {
      return NextResponse.json({
        message: 'Job already completed',
        job: {
          id: job.id,
          status: job.status,
          completed_at: job.completed_at
        }
      })
    }

    if (job.status === 'processing' && !forceProcess) {
      return NextResponse.json({
        message: 'Job is currently processing',
        job: {
          id: job.id,
          status: job.status,
          progress: job.progress
        },
        hint: 'Add forceProcess: true to retry'
      })
    }

    // Reset job to pending to be picked up by cron
    const { error: updateError } = await supabase
      .from('conflict_analysis_jobs')
      .update({
        status: 'pending',
        error_message: null,
        error_details: null,
        progress: { step: 'pending', percent: 0 }
      })
      .eq('id', jobId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to reset job', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Job reset to pending status',
      job: {
        id: job.id,
        client_name: job.client_name,
        status: 'pending',
        note: 'Job will be processed by the next cron run'
      }
    })
  } catch (error: any) {
    console.error('Manual trigger error:', error)
    return NextResponse.json(
      { error: 'Failed to trigger processing', details: error.message },
      { status: 500 }
    )
  }
}