import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    }
  }
)

export async function POST(request: Request) {
  try {
    const jobData = await request.json()

    console.log('Creating conflict analysis job:', {
      client_name: jobData.client_name,
      client_logo_url: jobData.client_logo_url,
      focus_areas: jobData.focus_areas,
      email_recipients: jobData.email_recipients,
      branding: jobData.branding,
      broker_profile_id: jobData.broker_profile_id,
    })

    // Insert job using service role (bypasses RLS)
    const { data: job, error } = await supabase
      .from('conflict_analysis_jobs')
      .insert([jobData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create job', details: error.message },
        { status: 500 }
      )
    }

    console.log('Job created successfully:', job.id)

    return NextResponse.json({
      success: true,
      job,
    })
  } catch (error: any) {
    console.error('Create job error:', error)
    return NextResponse.json(
      { error: 'Failed to create job', details: error.message },
      { status: 500 }
    )
  }
}
