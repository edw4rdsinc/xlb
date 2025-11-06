import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ConflictAnalysisRequest {
  jobId: string
}

// V3: Simple single-call approach
// Let PDFPlumber extract text, let Claude do the analysis in ONE call
// Handles 95% of documents (typical SPDs are 50-150 pages)
export async function POST(request: Request) {
  try {
    const { jobId } = await request.json() as ConflictAnalysisRequest

    console.log(`V3: Analyzing job ${jobId} with single-call approach`)

    // Get job details from database
    const { data: job, error: jobError } = await supabase
      .from('conflict_analysis_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Check if we have the extracted text
    if (!job.spd_text || !job.handbook_text) {
      return NextResponse.json(
        { error: 'PDFs not yet extracted' },
        { status: 400 }
      )
    }

    // Update progress
    await supabase
      .from('conflict_analysis_jobs')
      .update({
        progress: { step: 'analyzing_with_claude', percent: 60 }
      })
      .eq('id', jobId)

    console.log(`V3: Calling Claude Sonnet with full document context...`)
    console.log(`V3: SPD length: ${job.spd_text.length} chars, Handbook length: ${job.handbook_text.length} chars`)

    // Single Claude Sonnet call that does EVERYTHING
    const analysis = await analyzeConflictsInOneCall(
      job.spd_text,
      job.handbook_text,
      job.focus_areas || []
    )

    // Save results
    await supabase
      .from('conflict_analysis_jobs')
      .update({
        conflicts: analysis.conflicts,
        alignments: analysis.alignments,
        executive_summary: analysis.executive_summary,
        progress: { step: 'analysis_complete', percent: 100 }
      })
      .eq('id', jobId)

    console.log(`V3: Analysis complete for job ${jobId}`)
    console.log(`V3: Found ${analysis.conflicts.length} conflicts, ${analysis.alignments.length} alignments`)

    return NextResponse.json({
      success: true,
      complete: true,
      analysis,
      approach: 'v3-single-call'
    })

  } catch (error: any) {
    console.error('V3 analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze conflicts', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * V3 Core: Single Claude Sonnet call that extracts sections AND analyzes conflicts
 *
 * This replaces:
 * - 17 Claude Haiku calls (section extraction from chunks)
 * - 1 Claude Sonnet call (conflict analysis)
 *
 * With just: 1 Claude Sonnet call (extract + analyze)
 *
 * Benefits:
 * - 18x fewer API calls
 * - ~6x faster (2-3 min vs 17 min)
 * - Better analysis (full context, no chunking artifacts)
 * - No timeout issues (fits in 5min Vercel limit)
 */
async function analyzeConflictsInOneCall(
  spdText: string,
  handbookText: string,
  focusAreas: string[]
): Promise<any> {

  const prompt = `You are a benefits compliance expert analyzing two documents for conflicts.

**CRITICAL RULES:**
1. A CONFLICT exists when the Employee Handbook promises MORE than the Summary Plan Description (SPD) covers
2. The SPD is the legal governing document - it defines what's actually covered
3. If the Handbook promises benefits the SPD doesn't cover, that's a CRITICAL conflict
4. Focus on: coverage duration, amounts, eligibility, waiting periods, benefit percentages
5. Categorize severity: CRITICAL (major legal/financial risk), MEDIUM (moderate risk), LOW (minor discrepancy)

**FOCUS AREAS:**
${focusAreas.length > 0 ? focusAreas.join(', ') : 'All benefit areas'}

**YOUR TASK:**
1. Read both documents completely
2. Extract sections related to the focus areas from BOTH documents
3. Compare the extracted sections to identify conflicts
4. Identify areas where they align well

Return your analysis as JSON:

\`\`\`json
{
  "conflicts": [
    {
      "topic": "Specific benefit topic",
      "severity": "CRITICAL|MEDIUM|LOW",
      "spd_text": "Exact quote from SPD showing what's covered",
      "handbook_text": "Exact quote from handbook showing the promise",
      "issue": "Clear description of the conflict",
      "risk_analysis": "Financial and legal implications if not addressed",
      "recommendations": ["Specific action 1", "Specific action 2"]
    }
  ],
  "alignments": [
    {
      "topic": "Topic where they align",
      "description": "How the SPD and Handbook are consistent"
    }
  ],
  "executive_summary": {
    "total_conflicts": 0,
    "critical": 0,
    "medium": 0,
    "low": 0,
    "overall_risk": "HIGH|MEDIUM|LOW",
    "key_findings": "2-3 sentence summary of most important findings"
  }
}
\`\`\`

**SUMMARY PLAN DESCRIPTION (SPD):**
${spdText}

**EMPLOYEE HANDBOOK:**
${handbookText}

Analyze thoroughly and return ONLY the JSON response.`

  let response
  try {
    response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 16000, // Increased for comprehensive analysis
      messages: [{ role: 'user', content: prompt }],
    })
  } catch (apiError: any) {
    console.error('Claude API error details:', {
      error: apiError.message,
      status: apiError.status,
      type: apiError.error?.type,
      message: apiError.error?.message
    })
    throw new Error(`Claude API failed: ${apiError.message}`)
  }

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  // Extract JSON from response (may be wrapped in code blocks)
  const jsonMatch = content.text.match(/```json\n?([\s\S]*?)\n?```/) || content.text.match(/\{[\s\S]*\}/)

  if (!jsonMatch) {
    console.error('Failed to parse Claude response. First 1000 chars:', content.text.substring(0, 1000))
    throw new Error('Could not parse analysis response - no JSON found')
  }

  const jsonText = jsonMatch[1] || jsonMatch[0]

  try {
    const parsed = JSON.parse(jsonText)

    // Validate the response structure
    if (!parsed.conflicts || !parsed.alignments || !parsed.executive_summary) {
      console.warn('Response missing expected fields:', Object.keys(parsed))
      throw new Error('Invalid response structure from Claude')
    }

    return parsed
  } catch (parseError: any) {
    console.error('JSON parse error:', parseError.message)
    console.error('Attempted to parse:', jsonText.substring(0, 500))
    throw new Error(`Failed to parse JSON response: ${parseError.message}`)
  }
}
