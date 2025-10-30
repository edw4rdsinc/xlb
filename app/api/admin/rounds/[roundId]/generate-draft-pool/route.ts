import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminAuth, logAdminAction } from '@/lib/auth/admin-auth';

/**
 * POST /api/admin/rounds/{roundId}/generate-draft-pool
 *
 * Generate draft pool for a round based on previous round's fantasy points
 *
 * Logic:
 * 1. Get previous round's week range
 * 2. Calculate total fantasy points for each player from previous round
 * 3. Rank by position: Top 12 QBs, Top 10 TEs, Top 20 RBs/WRs
 * 4. Mark elite: Top 3 QBs/TEs, Top 6 RBs/WRs by fantasy points
 * 5. Save to draft_pools table
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roundId: string }> }
) {
  try {
    const { roundId } = await params;

    // Check admin authentication
    const auth = await requireAdminAuth(request);
    if (!auth.authorized) {
      return auth.response!;
    }

    const supabase = await createClient();

    // Get current round details
    const { data: currentRound, error: roundError } = await supabase
      .from('rounds')
      .select('*')
      .eq('id', roundId)
      .single();

    if (roundError || !currentRound) {
      return NextResponse.json(
        { error: 'Round not found' },
        { status: 404 }
      );
    }

    // Get previous round (draft pool is based on previous round's performance)
    const { data: previousRound, error: prevRoundError } = await supabase
      .from('rounds')
      .select('*')
      .eq('round_number', currentRound.round_number - 1)
      .single();

    if (prevRoundError || !previousRound) {
      return NextResponse.json(
        { error: 'Previous round not found. Cannot generate draft pool for Round 1.' },
        { status: 400 }
      );
    }

    console.log(`Generating draft pool for Round ${currentRound.round_number} based on Round ${previousRound.round_number} (Weeks ${previousRound.start_week}-${previousRound.end_week})`);

    // Clear existing draft pool for this round (if re-generating)
    await supabase
      .from('draft_pools')
      .delete()
      .eq('round_id', roundId);

    // Get all player stats from previous round and calculate totals
    const { data: playerStats, error: statsError } = await supabase
      .from('player_weekly_stats')
      .select('player_id, fantasy_points, players!inner(id, name, position, team)')
      .gte('week_number', previousRound.start_week)
      .lte('week_number', previousRound.end_week);

    if (statsError) {
      console.error('Error fetching player stats:', statsError);
      return NextResponse.json(
        { error: 'Failed to fetch player stats' },
        { status: 500 }
      );
    }

    if (!playerStats || playerStats.length === 0) {
      return NextResponse.json(
        { error: 'No player stats found for previous round' },
        { status: 400 }
      );
    }

    // Aggregate total points per player
    const playerTotals = new Map<string, {
      playerId: string;
      name: string;
      position: string;
      team: string;
      totalPoints: number;
    }>();

    for (const stat of playerStats) {
      const player = stat.players as any;
      const playerId = player.id;

      if (!playerTotals.has(playerId)) {
        playerTotals.set(playerId, {
          playerId,
          name: player.name,
          position: player.position,
          team: player.team,
          totalPoints: 0,
        });
      }

      const playerData = playerTotals.get(playerId)!;
      playerData.totalPoints += stat.fantasy_points || 0;
    }

    // Group by position
    const byPosition: Record<string, Array<typeof playerTotals extends Map<string, infer T> ? T : never>> = {
      QB: [],
      RB: [],
      WR: [],
      TE: [],
    };

    for (const player of playerTotals.values()) {
      if (byPosition[player.position]) {
        byPosition[player.position].push(player);
      }
    }

    // Sort each position by total points (descending)
    for (const position of Object.keys(byPosition)) {
      byPosition[position].sort((a, b) => b.totalPoints - a.totalPoints);
    }

    // Define draft pool sizes and elite thresholds
    const poolSizes: Record<string, number> = {
      QB: 12,
      TE: 10,
      RB: 20,
      WR: 20,
    };

    const eliteThresholds: Record<string, number> = {
      QB: 3,
      TE: 3,
      RB: 6,
      WR: 6,
    };

    // Build draft pool entries
    const draftPoolEntries: Array<{
      round_id: string;
      player_id: string;
      position: string;
      rank: number;
      total_points: number;
      is_elite: boolean;
    }> = [];
    const summary: Record<string, { total: number; elite: number }> = {};

    for (const [position, players] of Object.entries(byPosition)) {
      const poolSize = poolSizes[position];
      const eliteThreshold = eliteThresholds[position];
      const topPlayers = players.slice(0, poolSize);

      summary[position] = {
        total: topPlayers.length,
        elite: Math.min(eliteThreshold, topPlayers.length),
      };

      topPlayers.forEach((player, index) => {
        const rank = index + 1;
        const isElite = rank <= eliteThreshold;

        draftPoolEntries.push({
          round_id: roundId,
          player_id: player.playerId,
          position: position,
          rank: rank,
          total_points: player.totalPoints,
          is_elite: isElite,
        });
      });
    }

    // Insert into draft_pools table
    const { error: insertError } = await supabase
      .from('draft_pools')
      .insert(draftPoolEntries);

    if (insertError) {
      console.error('Error inserting draft pool:', insertError);
      return NextResponse.json(
        { error: 'Failed to create draft pool' },
        { status: 500 }
      );
    }

    // Log admin action
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                request.headers.get('x-real-ip') || 'unknown';

    await logAdminAction(
      auth.userId!,
      'generate_draft_pool',
      {
        roundId,
        roundNumber: currentRound.round_number,
        basedOnRound: previousRound.round_number,
        playersGenerated: draftPoolEntries.length,
        summary,
      },
      ip
    );

    return NextResponse.json({
      success: true,
      message: `Draft pool generated for Round ${currentRound.round_number}`,
      round: {
        number: currentRound.round_number,
        startWeek: currentRound.start_week,
        endWeek: currentRound.end_week,
      },
      basedOn: {
        roundNumber: previousRound.round_number,
        startWeek: previousRound.start_week,
        endWeek: previousRound.end_week,
      },
      summary,
      totalPlayers: draftPoolEntries.length,
    });
  } catch (error) {
    console.error('Generate draft pool error:', error);
    return NextResponse.json(
      { error: 'Failed to generate draft pool' },
      { status: 500 }
    );
  }
}
