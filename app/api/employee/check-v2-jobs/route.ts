import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Check jobs in new V2 statuses
    const { data: extractingJobs } = await supabase
      .from('conflict_analysis_jobs')
      .select('id, client_name, status, progress, processing_state, updated_at')
      .eq('status', 'extracting')

    const { data: analyzingJobs } = await supabase
      .from('conflict_analysis_jobs')
      .select('id, client_name, status, progress, processing_state, updated_at')
      .eq('status', 'analyzing')

    // Check specific job
    const { data: specificJob } = await supabase
      .from('conflict_analysis_jobs')
      .select('*')
      .eq('id', 'bf2d7a01-ab0b-4779-98e6-c02e61da1627')
      .single()

    // Get recent jobs with any status
    const { data: recentJobs } = await supabase
      .from('conflict_analysis_jobs')
      .select('id, client_name, status, progress, updated_at')
      .order('updated_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      extracting: extractingJobs || [],
      analyzing: analyzingJobs || [],
      specificJob,
      recentJobs: recentJobs || [],
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}