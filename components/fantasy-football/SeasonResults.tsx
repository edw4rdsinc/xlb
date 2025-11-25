'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface SeasonScore {
  user_id: string;
  team_name: string;
  name: string;
  season_total: number;
  def_total: number;
  k_total: number;
  weeks_played: number;
  round1_total: number;
  round2_total: number;
  round3_total: number;
}

export function SeasonResults() {
  const [scores, setScores] = useState<SeasonScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadSeasonScores();
  }, []);

  async function loadSeasonScores() {
    try {
      setLoading(true);

      // Get all rounds for week-to-round mapping
      const { data: rounds, error: roundsError } = await supabase
        .from('rounds')
        .select('*')
        .order('round_number', { ascending: true });

      if (roundsError) throw roundsError;

      // Get all weekly scores directly via user_id
      const { data: allScores, error: scoresError } = await supabase
        .from('weekly_scores')
        .select(`
          *,
          user:users!user_id(
            id,
            name,
            team_name
          )
        `);

      if (scoresError) throw scoresError;

      // Aggregate scores by user
      const userScoresMap = new Map<string, SeasonScore>();

      for (const score of allScores || []) {
        const userId = score.user_id;
        const user = score.user;

        if (!userId || !user) continue;

        if (!userScoresMap.has(userId)) {
          userScoresMap.set(userId, {
            user_id: userId,
            team_name: user.team_name || 'Unknown',
            name: user.name || 'Unknown',
            season_total: 0,
            def_total: 0,
            k_total: 0,
            weeks_played: 0,
            round1_total: 0,
            round2_total: 0,
            round3_total: 0,
          });
        }

        const userScore = userScoresMap.get(userId)!;
        userScore.season_total += score.total_points || 0;
        userScore.def_total += score.def_points || 0;
        userScore.k_total += score.k_points || 0;
        userScore.weeks_played += 1;

        // Track round totals based on week number
        const weekNum = score.week_number;
        const round = rounds?.find((r: any) => weekNum >= r.start_week && weekNum <= r.end_week);
        if (round) {
          if (round.round_number === 1) {
            userScore.round1_total += score.total_points || 0;
          } else if (round.round_number === 2) {
            userScore.round2_total += score.total_points || 0;
          } else if (round.round_number === 3) {
            userScore.round3_total += score.total_points || 0;
          }
        }
      }

      const seasonScores = Array.from(userScoresMap.values());

      // Sort by season_total (desc), then def_total (desc), then k_total (desc)
      seasonScores.sort((a, b) => {
        if (a.season_total !== b.season_total) {
          return b.season_total - a.season_total;
        }
        if (a.def_total !== b.def_total) {
          return b.def_total - a.def_total;
        }
        return b.k_total - a.k_total;
      });

      setScores(seasonScores.filter((s: any) => s.weeks_played > 0));
    } catch (error) {
      // Silently handle error - scores will be empty array
      setScores([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredScores = scores.filter((score: any) =>
    score.team_name.toLowerCase().includes(search.toLowerCase()) ||
    score.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Search Teams
        </label>
        <input
          type="text"
          placeholder="Search by team name or player..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Season Info */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">
          Season Championship
        </h3>
        <p className="text-sm text-blue-700">
          The overall season champion is determined by cumulative points across all 18 weeks (3 rounds).
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-slate-600">Loading leaderboard...</p>
        </div>
      )}

      {/* No Results */}
      {!loading && filteredScores.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">No Data Yet</h3>
          <p className="text-slate-600">
            The season leaderboard will appear once scores are posted.
          </p>
        </div>
      )}

      {/* Results Table */}
      {!loading && filteredScores.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Season Total
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Round 1
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Round 2
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Round 3
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Avg Per Week
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredScores.map((score, index) => {
                const rank = index + 1;
                const avgPerWeek = score.weeks_played > 0
                  ? score.season_total / score.weeks_played
                  : 0;

                let rowBg = '';
                if (rank === 1) {
                  rowBg = 'bg-gradient-to-r from-yellow-50 to-amber-50';
                } else if (rank === 2) {
                  rowBg = 'bg-slate-50';
                } else if (rank === 3) {
                  rowBg = 'bg-amber-50';
                }

                return (
                  <tr
                    key={score.user_id}
                    className={`hover:bg-slate-100 transition-colors ${rowBg}`}
                  >
                    <td className="px-4 py-3">
                      <span className={`font-semibold text-xl ${rank <= 3 ? 'text-blue-600' : 'text-slate-600'}`}>
                        #{rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 text-lg">{score.team_name}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold text-xl ${rank === 1 ? 'text-yellow-700' : 'text-slate-900'}`}>
                        {score.season_total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      {score.round1_total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      {score.round2_total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      {score.round3_total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {avgPerWeek.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Results Count */}
      {!loading && filteredScores.length > 0 && (
        <div className="mt-4 text-center text-sm text-slate-600">
          Showing {filteredScores.length} {filteredScores.length === 1 ? 'team' : 'teams'}
          {search && ` for "${search}"`}
        </div>
      )}

      {/* Tie-Breaker Info */}
      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h4 className="font-semibold text-slate-800 mb-2">Tie-Breaker Rules</h4>
        <p className="text-sm text-slate-600">
          In the event of a tie in total points, rankings are determined by:
        </p>
        <ol className="list-decimal list-inside text-sm text-slate-600 mt-2 space-y-1">
          <li>Highest cumulative Defense (DEF) points</li>
          <li>If still tied, highest cumulative Kicker (K) points</li>
        </ol>
      </div>
    </div>
  );
}
