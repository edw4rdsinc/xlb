import { NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, unlink } from 'fs/promises'
import path from 'path'
import os from 'os'

const execPromise = promisify(exec)

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
  let tempFilePath: string | null = null

  try {
    const { fileName } = await request.json()

    if (!fileName) {
      return NextResponse.json(
        { error: 'No file name provided' },
        { status: 400 }
      )
    }

    // Download PDF from Wasabi
    const command = new GetObjectCommand({
      Bucket: process.env.WASABI_BUCKET || 'xl-benefits',
      Key: fileName,
    })

    const response = await wasabiClient.send(command)

    if (!response.Body) {
      throw new Error('Failed to download file from Wasabi')
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of response.Body as any) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    // Save to temp file
    tempFilePath = path.join(os.tmpdir(), `pdf-${Date.now()}.pdf`)
    await writeFile(tempFilePath, buffer)

    // Call Python script to extract text
    const scriptPath = path.join(process.cwd(), 'scripts', 'extract-pdf-text.py')
    const pythonPath = path.join(process.cwd(), 'pdf_env', 'bin', 'python3')

    const { stdout, stderr } = await execPromise(`${pythonPath} ${scriptPath} "${tempFilePath}"`)

    if (stderr) {
      console.error('Python stderr:', stderr)
    }

    const result = JSON.parse(stdout)

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
  } finally {
    // Clean up temp file
    if (tempFilePath) {
      try {
        await unlink(tempFilePath)
      } catch (err) {
        console.error('Failed to delete temp file:', err)
      }
    }
  }
}
