import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { markMagicLinkUsed } from '@/lib/auth/magic-link';
import { cookies } from 'next/headers';
import { ApiResponses } from '@/lib/api/utils/responses';
import { logger } from '@/lib/utils/logger';

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
      return ApiResponses.unauthorized('No active session. Please use your magic link.');
    }

    const session = JSON.parse(sessionCookie.value);
    const { userId, roundId, token } = session;

    // Parse request body
    const body: LineupSubmission = await request.json();

    // Validate lineup has all required positions
    const requiredPositions = ['qb', 'rb1', 'rb2', 'wr1', 'wr2', 'te', 'k', 'def'];
    for (const position of requiredPositions) {
      if (!body[position as keyof LineupSubmission]) {
        return ApiResponses.badRequest(`Missing ${position}`);
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
        return ApiResponses.notFound(`Player not found: ${playerName} (${dbPosition})`);
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
      logger.error('Lineup submission error', lineupError);
      return ApiResponses.serverError('Failed to save lineup');
    }

    // Mark magic link as used (first submission only)
    try {
      await markMagicLinkUsed(token);
    } catch (error) {
      // Non-fatal - link might already be marked as used
      logger.debug('Magic link already marked as used', { error });
    }

    return ApiResponses.success(null, 'Lineup submitted successfully');
  } catch (error) {
    logger.error('Lineup submission error', error);
    return ApiResponses.serverError('Failed to submit lineup');
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
      return ApiResponses.unauthorized('No active session');
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
      return ApiResponses.success({ lineup: null });
    }

    return ApiResponses.success({ lineup });
  } catch (error) {
    logger.error('Get lineup error', error);
    return ApiResponses.serverError('Failed to get lineup');
  }
}
