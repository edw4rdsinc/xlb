import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: Request) {
  try {
    const { recipients, clientName, reportHTML, spdFilename, handbookFilename } = await request.json()

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: 'No email addresses provided' },
        { status: 400 }
      )
    }

    if (!reportHTML) {
      return NextResponse.json(
        { error: 'No report HTML provided' },
        { status: 400 }
      )
    }

    // Send email to all recipients
    const results = await Promise.all(
      recipients.map(email =>
        resend.emails.send({
          from: 'XL Benefits Portal <sam@updates.edw4rds.com>',
          to: email,
          subject: `Benefits Alignment Report: ${clientName || 'Client'}`,
          html: reportHTML,
        })
      )
    )

    return NextResponse.json({
      success: true,
      emailsSent: results.length,
      results,
    })
  } catch (error: any) {
    console.error('Email error:', error)
    return NextResponse.json(
      { error: 'Failed to send emails', details: error.message },
      { status: 500 }
    )
  }
}
