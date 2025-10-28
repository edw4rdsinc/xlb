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

    // Send emails sequentially with delays to avoid rate limiting (Resend = 2 emails/second)
    console.log(`Sending conflict report to ${recipients.length} recipients:`, recipients)

    const results = []
    for (const email of recipients) {
      try {
        console.log(`Sending conflict report to ${email}...`)
        const result = await resend.emails.send({
          from: 'XL Benefits Portal <sam@updates.edw4rds.com>',
          to: email,
          subject: `Benefits Alignment Report: ${clientName || 'Client'}`,
          html: reportHTML,
        })

        // Check if Resend returned an error (rate limit, validation, etc.)
        if (result.error) {
          console.error(`❌ Resend returned error for ${email}:`, result.error)
          results.push({
            status: 'rejected',
            value: {
              email,
              status: 'failed',
              error: result.error.message || 'Resend API error',
            }
          })
        } else {
          console.log(`✅ Sent conflict report successfully to ${email} (ID: ${result.data?.id})`)
          results.push({
            status: 'fulfilled',
            value: {
              email,
              status: 'success',
              resendId: result.data?.id
            }
          })
        }

        // Add 1000ms delay between emails to stay safely under 2 emails/second limit
        if (recipients.indexOf(email) < recipients.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (error: any) {
        console.error(`❌ Exception sending to ${email}:`, error)
        results.push({
          status: 'rejected',
          value: {
            email,
            status: 'failed',
            error: error.message
          }
        })
      }
    }

    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    console.log(`Email results: ${successful} successful, ${failed} failed`)

    return NextResponse.json({
      success: true,
      emailsSent: successful,
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
