import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { markMagicLinkUsed } from '@/lib/auth/magic-link';
import { cookies } from 'next/headers';

interface LineupSubmission {
  qb: string;
  rb1: string;
  rb2: string;
  wr1: string;
  wr2: string;
  te: string;
  k: string;
  def: string;
}

/**
 * POST /api/lineup/submit
 *
 * Submit or update a lineup for the current round
 * Requires valid session from magic link authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Get session from cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('ff_session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No active session. Please use your magic link.' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    const { userId, roundId, token } = session;

    // Parse request body
    const body: LineupSubmission = await request.json();

    // Validate lineup has all required positions
    const requiredPositions = ['qb', 'rb1', 'rb2', 'wr1', 'wr2', 'te', 'k', 'def'];
    for (const position of requiredPositions) {
      if (!body[position as keyof LineupSubmission]) {
        return NextResponse.json(
          { error: `Missing ${position}` },
          { status: 400 }
        );
      }
    }

    const supabase = await createClient();

    // Get or create player IDs for each selected player
    const playerIds: Record<string, string> = {};

    for (const [position, playerName] of Object.entries(body)) {
      // Map position names to database field names
      const positionMap: Record<string, string> = {
        qb: 'QB',
        rb1: 'RB',
        rb2: 'RB',
        wr1: 'WR',
        wr2: 'WR',
        te: 'TE',
        k: 'K',
        def: 'DEF',
      };

      const dbPosition = positionMap[position];

      // Find player by name and position
      const { data: players, error: playerError } = await supabase
        .from('players')
        .select('id')
        .ilike('name', playerName)
        .eq('position', dbPosition)
        .limit(1);

      if (playerError || !players || players.length === 0) {
        return NextResponse.json(
          { error: `Player not found: ${playerName} (${dbPosition})` },
          { status: 404 }
        );
      }

      playerIds[`${position}_id`] = players[0].id;
    }

    // Upsert lineup (insert or update if exists)
    const lineupData = {
      user_id: userId,
      round_id: roundId,
      ...playerIds,
      submitted_at: new Date().toISOString(),
    };

    const { error: lineupError } = await supabase
      .from('lineups')
      .upsert(lineupData, {
        onConflict: 'user_id,round_id',
      });

    if (lineupError) {
      console.error('Lineup submission error:', lineupError);
      return NextResponse.json(
        { error: 'Failed to save lineup' },
        { status: 500 }
      );
    }

    // Mark magic link as used (first submission only)
    try {
      await markMagicLinkUsed(token);
    } catch (error) {
      // Non-fatal - link might already be marked as used
      console.log('Magic link already marked as used:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Lineup submitted successfully',
    });
  } catch (error) {
    console.error('Lineup submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit lineup' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/lineup/submit
 *
 * Get current lineup for the authenticated user's round
 */
export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('ff_session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    const { userId, roundId } = session;

    const supabase = await createClient();

    // Get lineup with player names
    const { data: lineup, error } = await supabase
      .from('lineups')
      .select(`
        *,
        qb:qb_id(name),
        rb1:rb1_id(name),
        rb2:rb2_id(name),
        wr1:wr1_id(name),
        wr2:wr2_id(name),
        te:te_id(name),
        k:k_id(name),
        def:def_id(name)
      `)
      .eq('user_id', userId)
      .eq('round_id', roundId)
      .single();

    if (error || !lineup) {
      return NextResponse.json({ lineup: null });
    }

    return NextResponse.json({ lineup });
  } catch (error) {
    console.error('Get lineup error:', error);
    return NextResponse.json(
      { error: 'Failed to get lineup' },
      { status: 500 }
    );
  }
}
