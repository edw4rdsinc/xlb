import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/leaderboard?view=weekly&week=8
 * GET /api/leaderboard?view=round&roundId=uuid
 * GET /api/leaderboard?view=season
 *
 * Get leaderboard data with different views
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const view = searchParams.get('view') || 'season';
    const week = searchParams.get('week');
    const roundId = searchParams.get('roundId');

    const supabase = await createClient();

    if (view === 'weekly' && week) {
      // Weekly leaderboard
      const { data, error } = await supabase
        .from('weekly_scores')
        .select(`
          week_number,
          total_points,
          lineups!inner(
            users!inner(
              id,
              email,
              team_name
            )
          )
        `)
        .eq('week_number', parseInt(week))
        .order('total_points', { ascending: false });

      if (error) {
        console.error('Weekly leaderboard error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch weekly leaderboard' },
          { status: 500 }
        );
      }

      // Format response
      const leaderboard = data.map((entry: any, index: number) => ({
        rank: index + 1,
        teamName: entry.lineups.users.team_name,
        email: entry.lineups.users.email,
        points: entry.total_points,
        week: entry.week_number,
      }));

      return NextResponse.json({
        success: true,
        view: 'weekly',
        week: parseInt(week),
        leaderboard,
      });
    } else if (view === 'round' && roundId) {
      // Round leaderboard - sum all weekly scores for the round
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

      const { data, error } = await supabase
        .from('weekly_scores')
        .select(`
          lineup_id,
          total_points,
          week_number,
          lineups!inner(
            round_id,
            users!inner(
              id,
              email,
              team_name
            )
          )
        `)
        .eq('lineups.round_id', roundId)
        .gte('week_number', round.start_week)
        .lte('week_number', round.end_week);

      if (error) {
        console.error('Round leaderboard error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch round leaderboard' },
          { status: 500 }
        );
      }

      // Aggregate points by team
      const teamTotals = new Map<string, { teamName: string; email: string; points: number }>();

      for (const entry of data as any[]) {
        const user = entry.lineups.users;
        const userId = user.id;

        if (!teamTotals.has(userId)) {
          teamTotals.set(userId, {
            teamName: user.team_name,
            email: user.email,
            points: 0,
          });
        }

        const team = teamTotals.get(userId)!;
        team.points += entry.total_points || 0;
      }

      // Sort by points
      const leaderboard = Array.from(teamTotals.values())
        .sort((a, b) => b.points - a.points)
        .map((team, index) => ({
          rank: index + 1,
          ...team,
        }));

      return NextResponse.json({
        success: true,
        view: 'round',
        roundNumber: round.round_number,
        roundWeeks: `${round.start_week}-${round.end_week}`,
        leaderboard,
      });
    } else {
      // Season leaderboard - sum ALL weekly scores
      const { data, error } = await supabase
        .from('weekly_scores')
        .select(`
          lineup_id,
          total_points,
          week_number,
          lineups!inner(
            users!inner(
              id,
              email,
              team_name
            )
          )
        `);

      if (error) {
        console.error('Season leaderboard error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch season leaderboard' },
          { status: 500 }
        );
      }

      // Aggregate points by team across all weeks
      const teamTotals = new Map<string, { teamName: string; email: string; points: number }>();

      for (const entry of data as any[]) {
        const user = entry.lineups.users;
        const userId = user.id;

        if (!teamTotals.has(userId)) {
          teamTotals.set(userId, {
            teamName: user.team_name,
            email: user.email,
            points: 0,
          });
        }

        const team = teamTotals.get(userId)!;
        team.points += entry.total_points || 0;
      }

      // Sort by points
      const leaderboard = Array.from(teamTotals.values())
        .sort((a, b) => b.points - a.points)
        .map((team, index) => ({
          rank: index + 1,
          ...team,
        }));

      return NextResponse.json({
        success: true,
        view: 'season',
        leaderboard,
      });
    }
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
