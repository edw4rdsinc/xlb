import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

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
    const { filename } = body

    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 })
    }

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

    console.log('Testing PDF extraction for:', filename)
    console.log('Signed URL generated')
    console.log('Calling pdfplumber at:', `${baseUrl}/api/extract-pdf`)

    // Call the Python pdfplumber serverless function
    const response = await fetch(`${baseUrl}/api/extract-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pdf_url: signedUrl
      }),
    })

    const responseText = await response.text()
    console.log('Raw response:', responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      return NextResponse.json({
        error: 'Failed to parse response',
        raw_response: responseText,
        status: response.status
      }, { status: 500 })
    }

    if (!response.ok) {
      return NextResponse.json({
        error: 'PDF extraction failed',
        details: data,
        status: response.status
      }, { status: 500 })
    }

    // Return the extracted text and debug info
    return NextResponse.json({
      success: true,
      text_length: data.text?.length || 0,
      pages: data.pages || 0,
      first_1000_chars: data.text?.substring(0, 1000) || '',
      last_1000_chars: data.text?.substring(Math.max(0, (data.text?.length || 0) - 1000)) || '',
      has_tables: data.text?.includes('TABLE DATA') || false,
      has_checkboxes: data.text?.includes('X marks') || false,
      full_text: data.text || ''
    })
  } catch (error: any) {
    console.error('Test PDF extraction error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}