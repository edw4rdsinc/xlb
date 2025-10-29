import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createMagicLinksForRound } from '@/lib/auth/magic-link';
import { generateDraftInviteEmail } from '@/lib/email/templates/draft-invite';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/admin/rounds/{roundId}/send-invites
 *
 * Generate magic links and send draft invite emails to all users
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roundId: string }> }
) {
  try {
    const { roundId } = await params;

    // TODO: Add admin authentication check here
    // For now, assuming admin access

    const supabase = await createClient();

    // Get round details
    const { data: round, error: roundError } = await supabase
      .from('rounds')
      .select('*')
      .eq('id', roundId)
      .single();

    if (roundError || !round) {
      return NextResponse.json(
        { error: 'Round not found' },
        { status: 404 }
      );
    }

    // Generate magic links for all users
    const magicLinks = await createMagicLinksForRound(roundId, 7);

    if (magicLinks.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new invites to send (all users already have lineups)',
        sent: 0,
      });
    }

    // Format deadline
    const deadline = new Date(round.start_date);
    deadline.setHours(17, 0, 0, 0); // 5 PM
    const deadlineStr = deadline.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' at 5 PM';

    // Send emails
    const results = [];
    const errors = [];

    for (const link of magicLinks) {
      try {
        const { subject, html, text } = generateDraftInviteEmail({
          teamName: link.teamName,
          magicLinkUrl: link.url,
          roundNumber: round.round_number,
          startWeek: round.start_week,
          endWeek: round.end_week,
          deadline: deadlineStr,
        });

        const { error: sendError } = await resend.emails.send({
          from: 'XL Benefits Fantasy Football <fantasy@xlbenefits.com>',
          to: link.email,
          subject,
          html,
          text,
        });

        if (sendError) {
          errors.push({
            email: link.email,
            error: sendError.message,
          });
        } else {
          results.push({
            email: link.email,
            teamName: link.teamName,
            sent: true,
          });
        }
      } catch (error) {
        errors.push({
          email: link.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Draft invites sent to ${results.length} participants`,
      sent: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Send invites error:', error);
    return NextResponse.json(
      { error: 'Failed to send invites' },
      { status: 500 }
    );
  }
}
