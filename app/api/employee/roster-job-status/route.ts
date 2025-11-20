import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID required' },
        { status: 400 }
      )
    }

    // Get job details
    const { data: job, error: jobError } = await supabaseAdmin
      .from('roster_upload_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Get fuzzy matches if awaiting approval
    let fuzzyMatches: any[] = []
    if (job.status === 'awaiting_approval') {
      const { data: matches } = await supabaseAdmin
        .from('roster_pending_matches')
        .select('*')
        .eq('job_id', jobId)
        .order('match_score', { ascending: false })

      fuzzyMatches = matches || []
    }

    return NextResponse.json({
      id: job.id,
      status: job.status,
      progress: job.progress,
      total_records: job.total_records,
      exact_matches: job.exact_matches,
      fuzzy_matches: job.fuzzy_matches,
      new_records: job.new_records,
      imported_count: job.imported_count,
      updated_count: job.updated_count,
      skipped_count: job.skipped_count,
      parsed_records: job.parsed_records,
      fuzzy_matches_data: fuzzyMatches,
      error_message: job.error_message,
    })
  } catch (error: any) {
    console.error('Roster job status error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
