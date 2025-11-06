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
  chunkIndex?: number
  totalChunks?: number
}

// Break documents into 30k character chunks for efficient processing
const CHUNK_SIZE = 30000
const MAX_CHUNKS_PER_RUN = 1 // Reduced from 3 to prevent Vercel timeout (5min limit)

export async function POST(request: Request) {
  try {
    const { jobId, chunkIndex = 0, totalChunks } = await request.json() as ConflictAnalysisRequest

    console.log(`Processing job ${jobId}, chunk ${chunkIndex + 1}/${totalChunks || '?'}`)

    // Get job details from database
    const { data: job, error: jobError } = await supabase
      .from('conflict_analysis_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Initialize processing state if first chunk
    if (chunkIndex === 0) {
      const spdChunks = chunkText(job.spd_text || '', CHUNK_SIZE)
      const handbookChunks = chunkText(job.handbook_text || '', CHUNK_SIZE)

      await supabase
        .from('conflict_analysis_jobs')
        .update({
          processing_state: {
            spdChunks: spdChunks.length,
            handbookChunks: handbookChunks.length,
            totalChunks: Math.max(spdChunks.length, handbookChunks.length),
            processedChunks: 0,
            extractedSections: [],
            conflicts: [],
            alignments: []
          }
        })
        .eq('id', jobId)

      // Update total chunks for this run
      job.processing_state = {
        totalChunks: Math.max(spdChunks.length, handbookChunks.length),
        spdChunks: spdChunks.length,
        handbookChunks: handbookChunks.length,
        processedChunks: 0,
        extractedSections: [],
        conflicts: [],
        alignments: []
      }
    }

    const state = job.processing_state || {}
    const spdChunks = chunkText(job.spd_text || '', CHUNK_SIZE)
    const handbookChunks = chunkText(job.handbook_text || '', CHUNK_SIZE)

    // Process up to MAX_CHUNKS_PER_RUN chunks in this execution
    const endChunk = Math.min(chunkIndex + MAX_CHUNKS_PER_RUN, state.totalChunks)
    let allSections = state.extractedSections || []

    for (let i = chunkIndex; i < endChunk; i++) {
      const spdChunk = spdChunks[i] || ''
      const handbookChunk = handbookChunks[i] || ''

      if (spdChunk || handbookChunk) {
        console.log(`Processing chunk ${i + 1}: SPD ${spdChunk.length} chars, Handbook ${handbookChunk.length} chars`)

        // Extract sections from this chunk
        const sections = await extractSectionsFromChunk(
          spdChunk,
          handbookChunk,
          job.focus_areas || [],
          i + 1,
          state.totalChunks
        )

        allSections = [...allSections, ...sections]

        // Update progress
        await supabase
          .from('conflict_analysis_jobs')
          .update({
            processing_state: {
              ...state,
              processedChunks: i + 1,
              extractedSections: allSections
            },
            progress: {
              step: 'extracting_sections',
              percent: Math.floor(((i + 1) / state.totalChunks) * 60) // 60% for extraction
            }
          })
          .eq('id', jobId)
      }
    }

    // If all chunks are processed, analyze conflicts
    if (endChunk >= state.totalChunks) {
      console.log(`All chunks processed. Analyzing ${allSections.length} extracted sections...`)

      const analysis = await analyzeConflicts(allSections, job.focus_areas || [])

      // Save final results
      await supabase
        .from('conflict_analysis_jobs')
        .update({
          conflicts: analysis.conflicts,
          alignments: analysis.alignments,
          executive_summary: analysis.executive_summary,
          processing_state: {
            ...state,
            processedChunks: state.totalChunks,
            extractedSections: allSections,
            complete: true
          },
          progress: { step: 'analysis_complete', percent: 100 }
        })
        .eq('id', jobId)

      return NextResponse.json({
        success: true,
        complete: true,
        analysis,
        sectionsAnalyzed: allSections.length
      })
    }

    // Schedule next chunk processing
    const nextChunk = endChunk
    console.log(`Scheduling next chunk: ${nextChunk + 1}/${state.totalChunks}`)

    // Return partial results and next chunk info
    return NextResponse.json({
      success: true,
      complete: false,
      processedChunks: endChunk,
      totalChunks: state.totalChunks,
      nextChunk,
      sectionsExtracted: allSections.length
    })

  } catch (error: any) {
    console.error('Conflict analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze conflicts', details: error.message },
      { status: 500 }
    )
  }
}

function chunkText(text: string, chunkSize: number): string[] {
  const chunks: string[] = []
  let currentPos = 0

  while (currentPos < text.length) {
    // Try to find a natural break point (paragraph or sentence end)
    let endPos = currentPos + chunkSize

    if (endPos < text.length) {
      // Look for paragraph break first
      const paragraphBreak = text.lastIndexOf('\n\n', endPos)
      if (paragraphBreak > currentPos + chunkSize * 0.8) {
        endPos = paragraphBreak
      } else {
        // Look for sentence end
        const sentenceEnd = text.lastIndexOf('. ', endPos)
        if (sentenceEnd > currentPos + chunkSize * 0.8) {
          endPos = sentenceEnd + 1
        }
      }
    }

    chunks.push(text.slice(currentPos, endPos))
    currentPos = endPos
  }

  return chunks
}

async function extractSectionsFromChunk(
  spdChunk: string,
  handbookChunk: string,
  focusAreas: string[],
  chunkNumber: number,
  totalChunks: number
): Promise<any[]> {
  if (!spdChunk && !handbookChunk) return []

  const prompt = `You are analyzing chunk ${chunkNumber} of ${totalChunks} from benefits documents.
Extract any sections related to these topics: ${focusAreas.join(', ')}.

Return a JSON array of extracted sections:
[
  {
    "source": "spd" or "handbook",
    "topic": "Topic name",
    "content": "Extracted content",
    "chunk": ${chunkNumber}
  }
]

If no relevant sections found, return empty array [].

SPD Chunk:
${spdChunk}

Handbook Chunk:
${handbookChunk}`

  let response
  try {
    response = await anthropic.messages.create({
      model: 'claude-haiku-3-20240307', // Use faster model for extraction
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })
  } catch (apiError: any) {
    console.error('Claude Haiku API error during extraction:', {
      error: apiError.message,
      status: apiError.status,
      type: apiError.error?.type,
      message: apiError.error?.message,
      chunkNumber
    })
    // Return empty array to continue processing other chunks
    return []
  }

  const content = response.content[0]
  if (content.type !== 'text') return []

  try {
    const jsonMatch = content.text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return []
    return JSON.parse(jsonMatch[0])
  } catch (e) {
    console.error('Failed to parse extraction response:', e)
    return []
  }
}

async function analyzeConflicts(sections: any[], focusAreas: string[]): Promise<any> {
  // Group sections by topic
  const spdSections = sections.filter(s => s.source === 'spd')
  const handbookSections = sections.filter(s => s.source === 'handbook')

  const prompt = `You are a benefits compliance expert analyzing extracted sections for conflicts.

CRITICAL RULES:
1. A CONFLICT exists when the Handbook promises MORE than the SPD covers
2. Focus on: duration, coverage amounts, eligibility, waiting periods, benefit percentages
3. Categorize severity: CRITICAL, MEDIUM, or LOW

Analyze these sections and return JSON:
{
  "conflicts": [
    {
      "topic": "Topic",
      "severity": "CRITICAL|MEDIUM|LOW",
      "spd_text": "Quote from SPD",
      "handbook_text": "Quote from handbook",
      "issue": "Description of conflict",
      "risk_analysis": "Financial/legal implications",
      "recommendations": ["Action 1", "Action 2"]
    }
  ],
  "alignments": [
    {
      "topic": "Topic",
      "description": "How they align"
    }
  ],
  "executive_summary": {
    "total_conflicts": 0,
    "critical": 0,
    "medium": 0,
    "low": 0,
    "overall_risk": "HIGH|MEDIUM|LOW",
    "key_findings": "Summary"
  }
}

SPD Sections:
${JSON.stringify(spdSections, null, 2)}

Handbook Sections:
${JSON.stringify(handbookSections, null, 2)}`

  let response
  try {
    response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
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

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    console.error('Failed to parse Claude response:', content.text.substring(0, 500))
    throw new Error('Could not parse analysis response')
  }

  try {
    return JSON.parse(jsonMatch[0])
  } catch (parseError: any) {
    console.error('JSON parse error:', parseError.message)
    console.error('Attempted to parse:', jsonMatch[0].substring(0, 500))
    throw new Error(`Failed to parse JSON response: ${parseError.message}`)
  }
}