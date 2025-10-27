import { NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const runtime = 'nodejs' // Force Node.js runtime instead of Edge

const wasabiClient = new S3Client({
  endpoint: process.env.WASABI_ENDPOINT || 'https://s3.us-west-1.wasabisys.com',
  region: process.env.WASABI_REGION || 'us-west-1',
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY!,
    secretAccessKey: process.env.WASABI_SECRET_KEY!,
  },
})

export async function POST(request: Request) {
  try {
    const { fileName } = await request.json()

    if (!fileName) {
      return NextResponse.json(
        { error: 'No file name provided' },
        { status: 400 }
      )
    }

    // Generate signed URL for Wasabi (valid for 15 minutes)
    const command = new GetObjectCommand({
      Bucket: process.env.WASABI_BUCKET || 'xl-benefits',
      Key: fileName,
    })

    const signedUrl = await getSignedUrl(wasabiClient, command, { expiresIn: 900 })

    // Call Python serverless function to extract text
    const extractUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/extract-pdf`
      : 'http://localhost:3000/api/extract-pdf'

    const extractRes = await fetch(extractUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdf_url: signedUrl }),
    })

    if (!extractRes.ok) {
      const errorText = await extractRes.text()
      throw new Error(`PDF extraction failed: ${errorText}`)
    }

    const result = await extractRes.json()

    if (!result.success) {
      throw new Error(result.error)
    }

    return NextResponse.json({
      success: true,
      text: result.text,
      pages: result.pages,
      metadata: {},
    })
  } catch (error: any) {
    console.error('PDF processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process PDF', details: error.message },
      { status: 500 }
    )
  }
}
