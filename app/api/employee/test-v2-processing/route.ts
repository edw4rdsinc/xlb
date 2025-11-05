import { NextResponse } from 'next/server'

// Manual endpoint to test V2 processing without cron authentication
export async function GET(request: Request) {
  try {
    // Call the V2 processing logic directly
    const v2Url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/cron/process-conflict-jobs-v2`
      : `${process.env.NEXT_PUBLIC_SITE_URL}/api/cron/process-conflict-jobs-v2`

    // Add the required authorization header
    const response = await fetch(v2Url, {
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET || 'test'}`
      }
    })

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: 'V2 processing triggered',
      v2Response: result
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}