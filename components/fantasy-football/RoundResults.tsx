'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface RoundResultsProps {
  rounds: any[];
}

interface RoundScore {
  user_id: string;
  lineup_id: string;
  team_name: string;
  name: string;
  round_total: number;
  def_total: number;
  k_total: number;
  weeks_played: number;
}

export function RoundResults({ rounds }: RoundResultsProps) {
  const [selectedRound, setSelectedRound] = useState(rounds[0]?.id || '');
  const [scores, setScores] = useState<RoundScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (selectedRound) {
      loadRoundScores();
    }
  }, [selectedRound]);

  async function loadRoundScores() {
    try {
      setLoading(true);

      const round = rounds.find(r => r.id === selectedRound);
      if (!round) return;

      // Get all lineups for this round
      const { data: lineups, error: lineupsError } = await supabase
        .from('lineups')
        .select(`
          id,
          user_id,
          user:users!inner(
            name,
            team_name
          )
        `)
        .eq('round_id', selectedRound);

      if (lineupsError) throw lineupsError;

      // Get weekly scores for each lineup in this round
      const roundScores: RoundScore[] = [];

      for (const lineup of lineups || []) {
        const user = Array.isArray(lineup.user) ? lineup.user[0] : lineup.user;
        const { data: weeklyScores, error: scoresError } = await supabase
          .from('weekly_scores')
          .select('*')
          .eq('lineup_id', lineup.id)
          .gte('week_number', round.start_week)
          .lte('week_number', round.end_week);

        if (scoresError) throw scoresError;

        const roundTotal = weeklyScores?.reduce((sum, score) => sum + score.total_points, 0) || 0;
        const defTotal = weeklyScores?.reduce((sum, score) => sum + score.def_points, 0) || 0;
        const kTotal = weeklyScores?.reduce((sum, score) => sum + score.k_points, 0) || 0;

        roundScores.push({
          user_id: lineup.user_id,
          lineup_id: lineup.id,
          team_name: user.team_name,
          name: user.name,
          round_total: roundTotal,
          def_total: defTotal,
          k_total: kTotal,
          weeks_played: weeklyScores?.length || 0,
        });
      }

      // Sort by round_total (desc), then def_total (desc), then k_total (desc)
      roundScores.sort((a, b) => {
        if (a.round_total !== b.round_total) {
          return b.round_total - a.round_total;
        }
        if (a.def_total !== b.def_total) {
          return b.def_total - a.def_total;
        }
        return b.k_total - a.k_total;
      });

      setScores(roundScores);
    } catch (error) {
      console.error('Error loading round scores:', error);
      setScores([]);
    } finally {
      setLoading(false);
    }
  }

  const selectedRoundData = rounds.find(r => r.id === selectedRound);

  const filteredScores = scores.filter(score =>
    score.team_name.toLowerCase().includes(search.toLowerCase()) ||
    score.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Round Selector */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Select Round
          </label>
          <select
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {rounds.map(round => (
              <option key={round.id} value={round.id}>
                Round {round.round_number} (Weeks {round.start_week}-{round.end_week})
                {round.is_active ? ' - Active' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex-1">
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
      </div>

      {/* Round Info */}
      {selectedRoundData && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            Round {selectedRoundData.round_number} Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-blue-700">Weeks:</span>
              <span className="ml-2 font-medium text-blue-900">
                {selectedRoundData.start_week} - {selectedRoundData.end_week}
              </span>
            </div>
            <div>
              <span className="text-blue-700">Dates:</span>
              <span className="ml-2 font-medium text-blue-900">
                {new Date(selectedRoundData.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(selectedRoundData.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div>
              <span className="text-blue-700">Status:</span>
              <span className={`ml-2 font-medium ${selectedRoundData.is_active ? 'text-green-700' : 'text-slate-700'}`}>
                {selectedRoundData.is_active ? 'Active' : 'Completed'}
              </span>
            </div>
            <div>
              <span className="text-blue-700">Prizes:</span>
              <span className="ml-2 font-medium text-blue-900">
                $150 / $100 / $50
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-slate-600">Loading standings...</p>
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
          <h3 className="text-lg font-semibold text-slate-800 mb-1">No Standings Yet</h3>
          <p className="text-slate-600">
            Round standings will appear once scores are posted.
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
                  Round Total
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Avg Per Week
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Weeks Played
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
                  ? score.round_total / score.weeks_played
                  : 0;

                let prize = '';
                let prizeColor = '';
                if (rank === 1) {
                  prize = '$150';
                  prizeColor = 'text-yellow-700 font-bold';
                } else if (rank === 2) {
                  prize = '$100';
                  prizeColor = 'text-slate-600 font-semibold';
                } else if (rank === 3) {
                  prize = '$50';
                  prizeColor = 'text-amber-700 font-semibold';
                }

                return (
                  <tr
                    key={score.lineup_id}
                    className={`hover:bg-slate-50 transition-colors ${
                      rank === 1 ? 'bg-yellow-50' : rank <= 3 ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {rank === 1 && (
                          <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className={`font-semibold text-lg ${rank <= 3 ? 'text-blue-600' : 'text-slate-600'}`}>
                          #{rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-slate-900">{score.team_name}</div>
                        <div className="text-sm text-slate-500">{score.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold text-lg ${rank === 1 ? 'text-yellow-700' : 'text-slate-900'}`}>
                        {score.round_total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      {avgPerWeek.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                        {score.weeks_played}
                      </span>
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
    </div>
  );
}
