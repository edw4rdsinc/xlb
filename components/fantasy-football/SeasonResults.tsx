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

      // Get all users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, name, team_name');

      if (usersError) throw usersError;

      // Get all rounds
      const { data: rounds, error: roundsError } = await supabase
        .from('rounds')
        .select('*')
        .order('round_number', { ascending: true });

      if (roundsError) throw roundsError;

      const seasonScores: SeasonScore[] = [];

      for (const user of users || []) {
        let seasonTotal = 0;
        let defTotal = 0;
        let kTotal = 0;
        let weeksPlayed = 0;
        const roundTotals = [0, 0, 0];

        // Get all lineups for this user across all rounds
        const { data: lineups, error: lineupsError } = await supabase
          .from('lineups')
          .select('id, round_id')
          .eq('user_id', user.id);

        if (lineupsError) throw lineupsError;

        // Get all weekly scores for these lineups
        for (const lineup of lineups || []) {
          const { data: weeklyScores, error: scoresError } = await supabase
            .from('weekly_scores')
            .select('*')
            .eq('lineup_id', lineup.id);

          if (scoresError) throw scoresError;

          const lineupTotal = weeklyScores?.reduce((sum: number, score: any) => sum + score.total_points, 0) || 0;
          const lineupDefTotal = weeklyScores?.reduce((sum: number, score: any) => sum + score.def_points, 0) || 0;
          const lineupKTotal = weeklyScores?.reduce((sum: number, score: any) => sum + score.k_points, 0) || 0;

          seasonTotal += lineupTotal;
          defTotal += lineupDefTotal;
          kTotal += lineupKTotal;
          weeksPlayed += weeklyScores?.length || 0;

          // Track round totals
          const round = rounds?.find((r: any) => r.id === lineup.round_id);
          if (round) {
            roundTotals[round.round_number - 1] = lineupTotal;
          }
        }

        seasonScores.push({
          user_id: user.id,
          team_name: user.team_name,
          name: user.name,
          season_total: seasonTotal,
          def_total: defTotal,
          k_total: kTotal,
          weeks_played: weeksPlayed,
          round1_total: roundTotals[0],
          round2_total: roundTotals[1],
          round3_total: roundTotals[2],
        });
      }

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
        <p className="text-sm text-blue-700 mb-3">
          The overall season champion is determined by cumulative points across all 18 weeks (3 rounds).
        </p>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-white rounded p-3 border border-yellow-200">
            <div className="flex items-center justify-center mb-1">
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="font-bold text-yellow-700 text-center">1st Place</p>
            <p className="text-2xl font-bold text-yellow-900 text-center">$400</p>
          </div>
          <div className="bg-white rounded p-3 border border-slate-200">
            <div className="flex items-center justify-center mb-1">
              <svg className="w-6 h-6 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="font-bold text-slate-700 text-center">2nd Place</p>
            <p className="text-2xl font-bold text-slate-900 text-center">$250</p>
          </div>
          <div className="bg-white rounded p-3 border border-amber-200">
            <div className="flex items-center justify-center mb-1">
              <svg className="w-6 h-6 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="font-bold text-amber-800 text-center">3rd Place</p>
            <p className="text-2xl font-bold text-amber-900 text-center">$100</p>
          </div>
        </div>
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
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Prize
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredScores.map((score, index) => {
                const rank = index + 1;
                const avgPerWeek = score.weeks_played > 0
                  ? score.season_total / score.weeks_played
                  : 0;

                let prize = '';
                let prizeColor = '';
                let rowBg = '';
                if (rank === 1) {
                  prize = '$400';
                  prizeColor = 'text-yellow-700 font-bold';
                  rowBg = 'bg-gradient-to-r from-yellow-50 to-amber-50';
                } else if (rank === 2) {
                  prize = '$250';
                  prizeColor = 'text-slate-600 font-semibold';
                  rowBg = 'bg-slate-50';
                } else if (rank === 3) {
                  prize = '$100';
                  prizeColor = 'text-amber-700 font-semibold';
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
                    <td className="px-4 py-3 text-right">
                      <span className={prizeColor}>{prize}</span>
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
