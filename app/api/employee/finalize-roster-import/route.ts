import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { job_id, lineup_data } = body as {
      job_id: string
      lineup_data: any
    }

    if (!job_id || !lineup_data) {
      return NextResponse.json(
        { error: 'Job ID and lineup data required' },
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
        progress: { step: 'Creating fantasy football lineup', percent: 85 },
      })
      .eq('id', job_id)

    // Get the current active round
    const { data: activeRound, error: roundError } = await supabaseAdmin
      .from('rounds')
      .select('id')
      .eq('is_active', true)
      .single()

    if (roundError || !activeRound) {
      await supabaseAdmin
        .from('roster_upload_jobs')
        .update({
          status: 'error',
          error_message: 'No active fantasy football round found',
        })
        .eq('id', job_id)

      return NextResponse.json(
        { error: 'No active fantasy football round found' },
        { status: 400 }
      )
    }

    // Create or find user by email
    let userId = job.user_id
    if (!userId && lineup_data.email) {
      // Try to find existing user by email
      const { data: existingUser } = await supabaseAdmin
        .from('auth.users')
        .select('id')
        .eq('email', lineup_data.email)
        .single()

      if (existingUser) {
        userId = existingUser.id
      }
    }

    // Create lineup entry
    const { data: lineup, error: lineupError } = await supabaseAdmin
      .from('lineups')
      .insert({
        user_id: userId,
        round_id: activeRound.id,
        team_name: lineup_data.team_name || 'Team',
        qb: lineup_data.lineup?.quarterback?.player_name || null,
        rb1: lineup_data.lineup?.running_backs?.[0]?.player_name || null,
        rb2: lineup_data.lineup?.running_backs?.[1]?.player_name || null,
        wr1: lineup_data.lineup?.wide_receivers?.[0]?.player_name || null,
        wr2: lineup_data.lineup?.wide_receivers?.[1]?.player_name || null,
        te: lineup_data.lineup?.tight_end?.player_name || null,
        def: lineup_data.lineup?.defense || null,
        k: lineup_data.lineup?.kicker || null,
        is_locked: false,
      })
      .select()
      .single()

    if (lineupError) {
      console.error('Lineup creation error:', lineupError)

      await supabaseAdmin
        .from('roster_upload_jobs')
        .update({
          status: 'error',
          error_message: `Failed to create lineup: ${lineupError.message}`,
        })
        .eq('id', job_id)

      return NextResponse.json(
        { error: `Failed to create lineup: ${lineupError.message}` },
        { status: 500 }
      )
    }

    // Calculate processing time
    const startTime = new Date(job.created_at).getTime()
    const endTime = Date.now()
    const processingTimeSeconds = Math.round((endTime - startTime) / 1000)

    // Update job to complete
    await supabaseAdmin
      .from('roster_upload_jobs')
      .update({
        status: 'complete',
        imported_count: 1,
        updated_count: 0,
        skipped_count: 0,
        completed_at: new Date().toISOString(),
        processing_time_seconds: processingTimeSeconds,
        progress: { step: 'Lineup created successfully', percent: 100 },
      })
      .eq('id', job_id)

    return NextResponse.json({
      success: true,
      lineup_id: lineup.id,
      imported: 1,
      updated: 0,
      skipped: 0,
    })
  } catch (error: any) {
    console.error('Finalize roster import error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
