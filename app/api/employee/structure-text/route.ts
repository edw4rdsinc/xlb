import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: Request) {
  try {
    const { text, fileName } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      )
    }

    // Use Claude to identify sections and add proper spacing
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are analyzing a corporate quote document. Your job is to identify distinct sections and format them with proper spacing for easy copy/paste.

RULES:
- Identify logical sections (client info, quote details, line items, pricing, terms, etc.)
- Add clear section headers
- Add blank lines between sections for spacing
- Preserve all original content
- DO NOT summarize or omit information
- DO NOT add commentary or analysis
- Format for professional copy/paste into other applications

Return a JSON object with this structure:
{
  "sections": [
    {
      "title": "Section Name",
      "content": "Formatted section content with proper line breaks"
    }
  ]
}

Document to format:
${text}`,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    // Parse the JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse structured response')
    }

    const structured = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      success: true,
      sections: structured.sections,
      fileName,
    })
  } catch (error: any) {
    console.error('Text structuring error:', error)
    return NextResponse.json(
      { error: 'Failed to structure text', details: error.message },
      { status: 500 }
    )
  }
}
