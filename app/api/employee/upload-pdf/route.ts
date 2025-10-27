import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

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
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Read file as buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `pdf-uploads/${timestamp}-${file.name}`

    // Upload to Wasabi
    const command = new PutObjectCommand({
      Bucket: process.env.WASABI_BUCKET || 'xl-benefits',
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    })

    await wasabiClient.send(command)

    const fileUrl = `${process.env.WASABI_ENDPOINT}/${process.env.WASABI_BUCKET || 'xl-benefits'}/${fileName}`

    return NextResponse.json({
      success: true,
      fileName,
      fileUrl,
      bucket: process.env.WASABI_BUCKET || 'xl-benefits',
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file', details: error.message },
      { status: 500 }
    )
  }
}
