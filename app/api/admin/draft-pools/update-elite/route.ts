import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminAuth, logAdminAction } from '@/lib/auth/admin-auth';

/**
 * PATCH /api/admin/draft-pools/update-elite
 *
 * Manually adjust elite status for a player in a draft pool
 *
 * Body:
 * {
 *   playerId: string,
 *   roundId: string,
 *   isElite: boolean
 * }
 */
export async function PATCH(request: NextRequest) {
  try {
    // Check admin authentication
    const auth = await requireAdminAuth(request);
    if (!auth.authorized) {
      return auth.response!;
    }

    const body = await request.json();
    const { playerId, roundId, isElite } = body;

    if (!playerId || !roundId || typeof isElite !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: playerId, roundId, isElite' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current draft pool entry
    const { data: draftEntry, error: fetchError } = await supabase
      .from('draft_pools')
      .select('*, players!inner(name, position)')
      .eq('player_id', playerId)
      .eq('round_id', roundId)
      .single();

    if (fetchError || !draftEntry) {
      return NextResponse.json(
        { error: 'Player not found in draft pool' },
        { status: 404 }
      );
    }

    const player = draftEntry.players as any;

    // Check elite limits per position
    if (isElite) {
      const eliteLimits: Record<string, number> = {
        QB: 3,
        TE: 3,
        RB: 6,
        WR: 6,
      };

      const limit = eliteLimits[draftEntry.position];

      // Count current elite players in this position for this round
      const { data: elitePlayers, error: countError } = await supabase
        .from('draft_pools')
        .select('id')
        .eq('round_id', roundId)
        .eq('position', draftEntry.position)
        .eq('is_elite', true)
        .neq('player_id', playerId); // Exclude the player we're updating

      if (countError) {
        return NextResponse.json(
          { error: 'Failed to check elite count' },
          { status: 500 }
        );
      }

      const currentEliteCount = elitePlayers?.length || 0;

      if (currentEliteCount >= limit) {
        return NextResponse.json(
          {
            error: `Elite limit reached for ${draftEntry.position}. Maximum ${limit} elite players allowed.`,
            currentEliteCount,
            limit,
          },
          { status: 400 }
        );
      }
    }

    // Update elite status
    const { error: updateError } = await supabase
      .from('draft_pools')
      .update({ is_elite: isElite })
      .eq('player_id', playerId)
      .eq('round_id', roundId);

    if (updateError) {
      console.error('Error updating elite status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update elite status' },
        { status: 500 }
      );
    }

    // Log admin action
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                request.headers.get('x-real-ip') || 'unknown';

    await logAdminAction(
      auth.userId!,
      'update_elite_status',
      {
        playerId,
        roundId,
        playerName: player.name,
        position: player.position,
        isElite,
        previousEliteStatus: draftEntry.is_elite,
      },
      ip
    );

    return NextResponse.json({
      success: true,
      message: `${player.name} (${player.position}) elite status updated`,
      player: {
        id: playerId,
        name: player.name,
        position: player.position,
        isElite,
        rank: draftEntry.rank,
        totalPoints: draftEntry.total_points,
      },
    });
  } catch (error) {
    console.error('Update elite status error:', error);
    return NextResponse.json(
      { error: 'Failed to update elite status' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/draft-pools/update-elite?roundId={roundId}
 *
 * Get current draft pool with elite status for a round
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const auth = await requireAdminAuth(request);
    if (!auth.authorized) {
      return auth.response!;
    }

    const searchParams = request.nextUrl.searchParams;
    const roundId = searchParams.get('roundId');

    if (!roundId) {
      return NextResponse.json(
        { error: 'Missing roundId parameter' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get all draft pool entries for this round
    const { data: draftPool, error } = await supabase
      .from('draft_pools')
      .select('*, players!inner(name, team)')
      .eq('round_id', roundId)
      .order('position')
      .order('rank');

    if (error) {
      console.error('Error fetching draft pool:', error);
      return NextResponse.json(
        { error: 'Failed to fetch draft pool' },
        { status: 500 }
      );
    }

    // Group by position for easier display
    const byPosition: Record<string, any[]> = {
      QB: [],
      RB: [],
      WR: [],
      TE: [],
    };

    for (const entry of draftPool || []) {
      const player = entry.players as any;
      if (byPosition[entry.position]) {
        byPosition[entry.position].push({
          id: entry.player_id,
          name: player.name,
          team: player.team,
          position: entry.position,
          rank: entry.rank,
          totalPoints: entry.total_points,
          isElite: entry.is_elite,
        });
      }
    }

    return NextResponse.json({
      success: true,
      roundId,
      draftPool: byPosition,
    });
  } catch (error) {
    console.error('Get draft pool error:', error);
    return NextResponse.json(
      { error: 'Failed to get draft pool' },
      { status: 500 }
    );
  }
}
