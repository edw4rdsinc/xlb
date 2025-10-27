import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface ConflictAnalysisRequest {
  spdText: string
  handbookText: string
  focusAreas: string[]
  clientName?: string
}

export async function POST(request: Request) {
  try {
    const { spdText, handbookText, focusAreas, clientName } = await request.json() as ConflictAnalysisRequest

    if (!spdText || !handbookText) {
      return NextResponse.json(
        { error: 'Both SPD and Handbook text required' },
        { status: 400 }
      )
    }

    // Step 1: Extract relevant sections from both documents
    const sectionExtractionPrompt = `You are analyzing benefits documents. Extract only the sections related to these topics: ${focusAreas.join(', ')}.

For each document, identify and extract relevant sections with their content and approximate page references.

Return a JSON object with this structure:
{
  "spd_sections": [
    {
      "topic": "Short-Term Disability",
      "content": "Full text of the section...",
      "page_reference": "Page 47"
    }
  ],
  "handbook_sections": [
    {
      "topic": "Short-Term Disability",
      "content": "Full text of the section...",
      "page_reference": "Page 12"
    }
  ]
}

SPD Document:
${spdText.substring(0, 100000)}

Handbook Document:
${handbookText.substring(0, 100000)}
`

    const extractionResponse = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
      messages: [{ role: 'user', content: sectionExtractionPrompt }],
    })

    const extractionContent = extractionResponse.content[0]
    if (extractionContent.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    const jsonMatch = extractionContent.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse section extraction response')
    }

    const sections = JSON.parse(jsonMatch[0])

    // Step 2: Analyze conflicts between extracted sections
    const conflictAnalysisPrompt = `You are a benefits compliance expert analyzing conflicts between an SPD (Summary Plan Description - what is actually insured) and an Employee Handbook (what employees are promised).

CRITICAL RULES:
1. A CONFLICT exists when the Handbook promises MORE than the SPD covers
2. Focus on: duration, coverage amounts, eligibility, waiting periods, benefit percentages
3. Categorize severity:
   - CRITICAL: Material differences that create legal/financial exposure
   - MEDIUM: Ambiguous language or minor discrepancies
   - LOW: Wording differences with no material impact

4. For each conflict, provide:
   - Exact quotes from both documents
   - Page references
   - Risk analysis (financial exposure if possible)
   - Specific recommendations

5. Also identify ALIGNMENTS where documents match correctly

Return JSON:
{
  "conflicts": [
    {
      "topic": "Short-Term Disability Duration",
      "severity": "CRITICAL",
      "spd_text": "Exact quote from SPD",
      "spd_page": "Page 47",
      "handbook_text": "Exact quote from handbook",
      "handbook_page": "Page 12",
      "issue": "Clear description of the conflict",
      "risk_analysis": "Financial and legal implications",
      "recommendations": ["Specific action 1", "Specific action 2"]
    }
  ],
  "alignments": [
    {
      "topic": "Long-Term Disability",
      "description": "Both documents correctly state 180-day waiting period and 60% benefit"
    }
  ],
  "executive_summary": {
    "total_conflicts": 4,
    "critical": 2,
    "medium": 1,
    "low": 1,
    "overall_risk": "HIGH|MEDIUM|LOW",
    "key_findings": "Brief summary"
  }
}

Extracted Sections:
${JSON.stringify(sections, null, 2)}
`

    const analysisResponse = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
      messages: [{ role: 'user', content: conflictAnalysisPrompt }],
    })

    const analysisContent = analysisResponse.content[0]
    if (analysisContent.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    const analysisJsonMatch = analysisContent.text.match(/\{[\s\S]*\}/)
    if (!analysisJsonMatch) {
      throw new Error('Could not parse conflict analysis response')
    }

    const analysis = JSON.parse(analysisJsonMatch[0])

    return NextResponse.json({
      success: true,
      sections,
      analysis,
    })
  } catch (error: any) {
    console.error('Conflict analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze conflicts', details: error.message },
      { status: 500 }
    )
  }
}
