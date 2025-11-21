import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const s3Client = new S3Client({
  endpoint: process.env.WASABI_ENDPOINT,
  region: process.env.WASABI_REGION || 'us-west-1',
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY!,
    secretAccessKey: process.env.WASABI_SECRET_KEY!,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      user_email,
      team_id,
      team_name,
      pdf_url,
      pdf_filename,
      file_size,
    } = body

    // Create or get team
    let finalTeamId = team_id

    if (!finalTeamId && team_name) {
      // Create new team
      const { data: newTeam, error: teamError } = await supabaseAdmin
        .from('roster_teams')
        .insert({
          name: team_name,
          created_by: user_id,
        })
        .select()
        .single()

      if (teamError) {
        console.error('Team creation error:', teamError)
        return NextResponse.json(
          { error: 'Failed to create team', details: teamError.message },
          { status: 500 }
        )
      }

      finalTeamId = newTeam.id
    }

    // Create roster upload job
    const { data: job, error: jobError } = await supabaseAdmin
      .from('roster_upload_jobs')
      .insert({
        user_id,
        user_email,
        team_id: finalTeamId,
        pdf_url,
        pdf_filename,
        file_size,
        status: 'pending',
        progress: { step: 'Queued for processing', percent: 0 },
      })
      .select()
      .single()

    if (jobError) {
      console.error('Job creation error:', jobError)
      return NextResponse.json(
        { error: 'Failed to create job', details: jobError.message },
        { status: 500 }
      )
    }

    // Start background processing
    processRosterJob(job.id).catch(console.error)

    return NextResponse.json({ success: true, job })
  } catch (error: any) {
    console.error('Create roster job error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

async function processRosterJob(jobId: string) {
  try {
    // Get job details
    const { data: job, error: jobError } = await supabaseAdmin
      .from('roster_upload_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      throw new Error('Job not found')
    }

    // Update status to extracting
    await supabaseAdmin
      .from('roster_upload_jobs')
      .update({
        status: 'extracting',
        progress: { step: 'Extracting text from PDF', percent: 10 },
      })
      .eq('id', jobId)

    // Extract text from PDF
    const pdfText = await extractPdfText(job.pdf_url, job.pdf_filename)

    await supabaseAdmin
      .from('roster_upload_jobs')
      .update({
        extracted_text: pdfText,
        status: 'parsing',
        progress: { step: 'Parsing employee data with AI', percent: 30 },
      })
      .eq('id', jobId)

    // Parse fantasy football lineup using Claude
    const parsedRecords = await parseRosterWithAI(pdfText)

    // Stop for user review/approval
    await supabaseAdmin
      .from('roster_upload_jobs')
      .update({
        parsed_records: parsedRecords,
        total_records: parsedRecords.length,
        exact_matches: 0,
        fuzzy_matches: 0,
        new_records: 1,
        status: 'awaiting_approval',
        progress: { step: 'Please review and confirm lineup', percent: 70 },
      })
      .eq('id', jobId)

  } catch (error: any) {
    console.error('Process roster job error:', error)
    await supabaseAdmin
      .from('roster_upload_jobs')
      .update({
        status: 'error',
        error_message: error.message || 'Processing failed',
      })
      .eq('id', jobId)
  }
}

async function extractPdfText(pdfUrl: string, filename: string): Promise<string> {
  const key = filename.startsWith('pdf-uploads/') ? filename : `pdf-uploads/${filename}`

  // Generate signed URL for the PDF
  const command = new GetObjectCommand({
    Bucket: process.env.WASABI_BUCKET,
    Key: key,
  })
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 })

  // Build the correct base URL for Vercel
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    // Call the Python pdfplumber serverless function
    const response = await fetch(`${baseUrl}/api/extract-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pdf_url: signedUrl
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('PDF extraction response error:', errorText)
      throw new Error(`PDF extraction failed: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'PDF extraction failed')
    }

    return data.text || ''
  } catch (error: any) {
    console.error('PDF extraction error:', error)
    throw new Error(`Failed to extract PDF text: ${error.message}`)
  }
}

async function parseRosterWithAI(pdfText: string): Promise<any[]> {
  const prompt = `You are a fantasy football lineup extraction specialist. Parse this fantasy football lineup submission form.

IMPORTANT: This form has CHECKBOXES for most positions and WRITE-IN fields for Defense and Kicker.

Extract the following data structure:

{
  "participant_name": "Full name of participant",
  "team_name": "Fantasy team name",
  "email": "Email address",
  "phone": "Phone number",
  "submit_by": "Submit by date",
  "lineup": {
    "quarterback": {
      "player_name": "Name from CHECKED box (e.g., 'Dak Prescott')",
      "team": "Team abbreviation (e.g., 'DAL')",
      "is_elite": false
    },
    "running_backs": [
      {
        "player_name": "Name from CHECKED box",
        "team": "Team abbreviation",
        "is_elite": false
      },
      {
        "player_name": "Name from CHECKED box",
        "team": "Team abbreviation",
        "is_elite": false
      }
    ],
    "wide_receivers": [
      {
        "player_name": "Name from CHECKED box",
        "team": "Team abbreviation",
        "is_elite": false
      },
      {
        "player_name": "Name from CHECKED box",
        "team": "Team abbreviation",
        "is_elite": false
      }
    ],
    "tight_end": {
      "player_name": "Name from CHECKED box",
      "team": "Team abbreviation",
      "is_elite": false
    },
    "defense": "WRITE-IN team name (e.g., 'Ravens')",
    "kicker": "WRITE-IN team name (e.g., 'Ravens')"
  }
}

CRITICAL INSTRUCTIONS:
1. Look for checkboxes marked with "X" to identify selected players
2. For Defense and Kicker, look for WRITTEN team names (not checkboxes)
3. Players highlighted in orange/yellow (SF, NE, NYG, CAR, NE, TB) are elite players
4. Mark "is_elite": true if the player's team is highlighted
5. Extract the exact player names and team abbreviations

PDF Text:
${pdfText.substring(0, 50000)}

Return ONLY a valid JSON object (not an array), no other text.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  // Parse JSON from response
  let jsonStr = content.text.trim()

  // Try to extract JSON if wrapped in code blocks
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim()
  }

  try {
    const lineup = JSON.parse(jsonStr)

    // Convert single lineup object to array format for compatibility
    // with existing job structure
    return [{
      row_index: 0,
      participant_name: lineup.participant_name,
      team_name: lineup.team_name,
      email: lineup.email,
      phone: lineup.phone,
      submit_by: lineup.submit_by,
      lineup: lineup.lineup,
      raw_data: lineup
    }]
  } catch (error) {
    console.error('JSON parse error:', error, jsonStr.substring(0, 500))
    throw new Error('Failed to parse AI response')
  }
}

async function findMatches(
  parsedRecords: any[],
  existingMembers: any[],
  jobId: string
): Promise<{
  exactMatches: number
  fuzzyMatches: any[]
  newRecords: number
}> {
  let exactMatches = 0
  const fuzzyMatches: any[] = []
  let newRecords = 0

  for (const record of parsedRecords) {
    const recordName = record.full_name || `${record.first_name || ''} ${record.last_name || ''}`.trim()

    let bestMatch = null
    let bestScore = 0

    for (const member of existingMembers) {
      const memberName = member.full_name || `${member.first_name || ''} ${member.last_name || ''}`.trim()

      // Check for exact matches
      if (
        (record.email && member.email && record.email.toLowerCase() === member.email.toLowerCase()) ||
        (record.employee_id && member.employee_id && record.employee_id === member.employee_id)
      ) {
        exactMatches++
        bestMatch = null // Exact match, no approval needed
        break
      }

      // Calculate fuzzy match score
      const score = calculateSimilarity(recordName.toLowerCase(), memberName.toLowerCase())

      if (score > bestScore && score >= 0.7) {
        bestScore = score
        bestMatch = {
          member,
          score,
          reason: generateMatchReason(record, member, score),
        }
      }
    }

    if (bestMatch && bestScore < 0.95) {
      // Fuzzy match needs approval
      fuzzyMatches.push({
        job_id: jobId,
        parsed_record: record,
        parsed_name: recordName,
        existing_member_id: bestMatch.member.id,
        existing_name: bestMatch.member.full_name ||
          `${bestMatch.member.first_name || ''} ${bestMatch.member.last_name || ''}`.trim(),
        match_score: bestMatch.score,
        match_reason: bestMatch.reason,
        status: 'pending',
      })
    } else if (!bestMatch || bestScore < 0.7) {
      // No match found, new record
      newRecords++
    }
  }

  return { exactMatches, fuzzyMatches, newRecords }
}

function calculateSimilarity(str1: string, str2: string): number {
  // Levenshtein distance based similarity
  const len1 = str1.length
  const len2 = str2.length
  const matrix: number[][] = []

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  const maxLen = Math.max(len1, len2)
  if (maxLen === 0) return 1
  return 1 - matrix[len1][len2] / maxLen
}

function generateMatchReason(record: any, member: any, score: number): string {
  const reasons: string[] = []

  const recordName = (record.full_name || `${record.first_name || ''} ${record.last_name || ''}`).trim()
  const memberName = (member.full_name || `${member.first_name || ''} ${member.last_name || ''}`).trim()

  if (recordName !== memberName) {
    reasons.push(`Name similar: "${recordName}" vs "${memberName}"`)
  }

  if (record.department && member.department && record.department !== member.department) {
    reasons.push(`Different departments`)
  }

  return reasons.join('; ') || `${Math.round(score * 100)}% name similarity`
}

async function importFantasyLineup(jobId: string, lineupData: any) {
  try {
    const { data: job } = await supabaseAdmin
      .from('roster_upload_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (!job) throw new Error('Job not found')

    // Get the current active round
    const { data: activeRound } = await supabaseAdmin
      .from('rounds')
      .select('id')
      .eq('is_active', true)
      .single()

    if (!activeRound) {
      throw new Error('No active fantasy football round found')
    }

    // Create or find user by email
    let userId = job.user_id
    if (!userId && lineupData.email) {
      // Try to find existing user by email
      const { data: existingUser } = await supabaseAdmin
        .from('auth.users')
        .select('id')
        .eq('email', lineupData.email)
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
        team_name: lineupData.team_name || 'Team',
        qb: lineupData.lineup?.quarterback?.player_name || null,
        rb1: lineupData.lineup?.running_backs?.[0]?.player_name || null,
        rb2: lineupData.lineup?.running_backs?.[1]?.player_name || null,
        wr1: lineupData.lineup?.wide_receivers?.[0]?.player_name || null,
        wr2: lineupData.lineup?.wide_receivers?.[1]?.player_name || null,
        te: lineupData.lineup?.tight_end?.player_name || null,
        def: lineupData.lineup?.defense || null,
        k: lineupData.lineup?.kicker || null,
        is_locked: false,
      })
      .select()
      .single()

    if (lineupError) {
      console.error('Lineup creation error:', lineupError)
      throw new Error(`Failed to create lineup: ${lineupError.message}`)
    }

    // Update job to complete
    await supabaseAdmin
      .from('roster_upload_jobs')
      .update({
        status: 'complete',
        imported_count: 1,
        completed_at: new Date().toISOString(),
        progress: { step: 'Lineup created successfully', percent: 100 },
      })
      .eq('id', jobId)

  } catch (error: any) {
    console.error('Import fantasy lineup error:', error)
    await supabaseAdmin
      .from('roster_upload_jobs')
      .update({
        status: 'error',
        error_message: error.message || 'Failed to create lineup',
      })
      .eq('id', jobId)
    throw error
  }
}

async function importRecords(jobId: string) {
  const { data: job } = await supabaseAdmin
    .from('roster_upload_jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  if (!job) return

  const parsedRecords = job.parsed_records || []
  let imported = 0
  let updated = 0
  let skipped = 0

  // Get existing members for exact matching
  const { data: existingMembers } = await supabaseAdmin
    .from('roster_members')
    .select('*')
    .eq('team_id', job.team_id)

  for (const record of parsedRecords) {
    // Check if exact match exists
    const exactMatch = existingMembers?.find(m =>
      (record.email && m.email && record.email.toLowerCase() === m.email.toLowerCase()) ||
      (record.employee_id && m.employee_id && record.employee_id === m.employee_id)
    )

    if (exactMatch) {
      // Update existing record
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
          source_job_id: jobId,
        })
        .eq('id', exactMatch.id)
      updated++
    } else {
      // Check if not a fuzzy match (would be handled separately)
      const { data: pendingMatch } = await supabaseAdmin
        .from('roster_pending_matches')
        .select('id')
        .eq('job_id', jobId)
        .eq('parsed_name', record.full_name || `${record.first_name || ''} ${record.last_name || ''}`.trim())
        .single()

      if (!pendingMatch) {
        // Create new record
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
            source_job_id: jobId,
          })
        imported++
      }
    }
  }

  // Update job with final counts
  await supabaseAdmin
    .from('roster_upload_jobs')
    .update({
      imported_count: imported,
      updated_count: updated,
      skipped_count: skipped,
      status: 'complete',
      completed_at: new Date().toISOString(),
      progress: { step: 'Complete', percent: 100 },
    })
    .eq('id', jobId)
}
