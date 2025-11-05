import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Unlock a specific lineup for manual editing
 * POST /api/admin/lineups/[lineupId]/unlock
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ lineupId: string }> }
) {
  try {
    const { lineupId } = await params;
    const supabase = await createClient();

    // Check if lineup exists and is locked
    const { data: lineup, error: fetchError } = await supabase
      .from('lineups')
      .select('id, is_locked, user_id, users!user_id(name, team_name)')
      .eq('id', lineupId)
      .single();

    if (fetchError || !lineup) {
      return NextResponse.json(
        { error: 'Lineup not found' },
        { status: 404 }
      );
    }

    if (!lineup.is_locked) {
      return NextResponse.json({
        success: true,
        message: 'Lineup is already unlocked',
        lineup
      });
    }

    // Unlock the lineup
    const { data: updatedLineup, error: updateError } = await supabase
      .from('lineups')
      .update({
        is_locked: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lineupId)
      .select('id, is_locked, user_id')
      .single();

    if (updateError) {
      console.error('Error unlocking lineup:', updateError);
      return NextResponse.json(
        { error: 'Failed to unlock lineup', details: updateError },
        { status: 500 }
      );
    }

    // Get user info for the message
    const userInfo = lineup.users as any;
    const teamName = userInfo?.team_name || 'user';

    return NextResponse.json({
      success: true,
      message: `Successfully unlocked lineup for ${teamName}`,
      lineup: updatedLineup,
    });
  } catch (error: any) {
    console.error('Error in unlock lineup:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
