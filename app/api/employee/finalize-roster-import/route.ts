import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface MatchDecision {
  match_id: string
  action: 'update' | 'create_new' | 'skip'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { job_id, decisions } = body as {
      job_id: string
      decisions: MatchDecision[]
    }

    if (!job_id) {
      return NextResponse.json(
        { error: 'Job ID required' },
        { status: 400 }
      )
    }

    // Get job details
    const { data: job, error: jobError } = await supabaseAdmin
      .from('roster_upload_jobs')
      .select('*')
      .eq('id', job_id)
      .single()

    if (jobError || !job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Update job status to importing
    await supabaseAdmin
      .from('roster_upload_jobs')
      .update({
        status: 'importing',
        progress: { step: 'Applying your decisions', percent: 85 },
      })
      .eq('id', job_id)

    // Process decisions
    let imported = job.imported_count || 0
    let updated = job.updated_count || 0
    let skipped = job.skipped_count || 0

    for (const decision of decisions) {
      // Get the pending match
      const { data: match } = await supabaseAdmin
        .from('roster_pending_matches')
        .select('*')
        .eq('id', decision.match_id)
        .single()

      if (!match) continue

      // Update the match record with decision
      await supabaseAdmin
        .from('roster_pending_matches')
        .update({
          status: decision.action === 'update' ? 'approved' :
            decision.action === 'skip' ? 'skipped' : 'rejected',
          action: decision.action,
          decision_at: new Date().toISOString(),
        })
        .eq('id', decision.match_id)

      const record = match.parsed_record

      if (decision.action === 'update') {
        // Update existing member
        await supabaseAdmin
          .from('roster_members')
          .update({
            first_name: record.first_name,
            last_name: record.last_name,
            full_name: record.full_name,
            email: record.email,
            date_of_birth: record.date_of_birth,
            hire_date: record.hire_date,
            department: record.department,
            job_title: record.job_title,
            salary: record.salary,
            coverage_tier: record.coverage_tier,
            gender: record.gender,
            raw_data: record.raw_data,
            source_job_id: job_id,
          })
          .eq('id', match.existing_member_id)
        updated++
      } else if (decision.action === 'create_new') {
        // Create new member
        await supabaseAdmin
          .from('roster_members')
          .insert({
            team_id: job.team_id,
            employee_id: record.employee_id,
            first_name: record.first_name,
            last_name: record.last_name,
            full_name: record.full_name,
            email: record.email,
            date_of_birth: record.date_of_birth,
            hire_date: record.hire_date,
            department: record.department,
            job_title: record.job_title,
            salary: record.salary,
            coverage_tier: record.coverage_tier,
            gender: record.gender,
            raw_data: record.raw_data,
            source_job_id: job_id,
          })
        imported++
      } else {
        // Skip
        skipped++
      }
    }

    // Now import records that weren't fuzzy matches
    const parsedRecords = job.parsed_records || []

    // Get all pending match names to exclude
    const { data: allMatches } = await supabaseAdmin
      .from('roster_pending_matches')
      .select('parsed_name')
      .eq('job_id', job_id)

    const matchedNames = new Set(allMatches?.map(m => m.parsed_name) || [])

    // Get existing members for exact matching
    const { data: existingMembers } = await supabaseAdmin
      .from('roster_members')
      .select('*')
      .eq('team_id', job.team_id)

    for (const record of parsedRecords) {
      const recordName = record.full_name ||
        `${record.first_name || ''} ${record.last_name || ''}`.trim()

      // Skip if this was a fuzzy match (already handled above)
      if (matchedNames.has(recordName)) continue

      // Check for exact match
      const exactMatch = existingMembers?.find(m =>
        (record.email && m.email && record.email.toLowerCase() === m.email.toLowerCase()) ||
        (record.employee_id && m.employee_id && record.employee_id === m.employee_id)
      )

      if (exactMatch) {
        // Update existing
        await supabaseAdmin
          .from('roster_members')
          .update({
            first_name: record.first_name || exactMatch.first_name,
            last_name: record.last_name || exactMatch.last_name,
            full_name: record.full_name || exactMatch.full_name,
            department: record.department || exactMatch.department,
            job_title: record.job_title || exactMatch.job_title,
            salary: record.salary || exactMatch.salary,
            coverage_tier: record.coverage_tier || exactMatch.coverage_tier,
            raw_data: record.raw_data,
            source_job_id: job_id,
          })
          .eq('id', exactMatch.id)
        updated++
      } else {
        // Create new
        await supabaseAdmin
          .from('roster_members')
          .insert({
            team_id: job.team_id,
            employee_id: record.employee_id,
            first_name: record.first_name,
            last_name: record.last_name,
            full_name: record.full_name,
            email: record.email,
            date_of_birth: record.date_of_birth,
            hire_date: record.hire_date,
            department: record.department,
            job_title: record.job_title,
            salary: record.salary,
            coverage_tier: record.coverage_tier,
            gender: record.gender,
            raw_data: record.raw_data,
            source_job_id: job_id,
          })
        imported++
      }
    }

    // Calculate processing time
    const startTime = new Date(job.created_at).getTime()
    const endTime = Date.now()
    const processingTimeSeconds = Math.round((endTime - startTime) / 1000)

    // Update job with final results
    await supabaseAdmin
      .from('roster_upload_jobs')
      .update({
        imported_count: imported,
        updated_count: updated,
        skipped_count: skipped,
        status: 'complete',
        completed_at: new Date().toISOString(),
        processing_time_seconds: processingTimeSeconds,
        progress: { step: 'Complete', percent: 100 },
      })
      .eq('id', job_id)

    return NextResponse.json({
      success: true,
      imported,
      updated,
      skipped,
    })
  } catch (error: any) {
    console.error('Finalize roster import error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
