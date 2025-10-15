'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface WeeklyResultsProps {
  currentWeek: number;
  rounds: any[];
}

interface WeeklyScore {
  id: string;
  lineup_id: string;
  week_number: number;
  total_points: number;
  qb_points: number;
  rb1_points: number;
  rb2_points: number;
  wr1_points: number;
  wr2_points: number;
  te_points: number;
  k_points: number;
  def_points: number;
  user: {
    name: string;
    team_name: string;
  };
}

type SortField = 'rank' | 'team_name' | 'total_points' | 'qb_points' | 'rb1_points' | 'rb2_points' | 'wr1_points' | 'wr2_points' | 'te_points' | 'k_points' | 'def_points';
type SortDirection = 'asc' | 'desc';

export function WeeklyResults({ currentWeek, rounds }: WeeklyResultsProps) {
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [scores, setScores] = useState<WeeklyScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    loadWeeklyScores();
  }, [selectedWeek]);

  async function loadWeeklyScores() {
    try {
      setLoading(true);

      // Get weekly scores with user info
      const { data: scoresData, error: scoresError } = await supabase
        .from('weekly_scores')
        .select(`
          *,
          lineup:lineups!inner(
            user:users!inner(
              name,
              team_name
            )
          )
        `)
        .eq('week_number', selectedWeek)
        .order('total_points', { ascending: false });

      if (scoresError) throw scoresError;

      // Transform data
      const transformedScores: WeeklyScore[] = (scoresData || []).map((score: any) => ({
        id: score.id,
        lineup_id: score.lineup_id,
        week_number: score.week_number,
        total_points: score.total_points,
        qb_points: score.qb_points,
        rb1_points: score.rb1_points,
        rb2_points: score.rb2_points,
        wr1_points: score.wr1_points,
        wr2_points: score.wr2_points,
        te_points: score.te_points,
        k_points: score.k_points,
        def_points: score.def_points,
        user: {
          name: score.lineup.user.name,
          team_name: score.lineup.user.team_name,
        },
      }));

      // Apply tie-breaker sorting (DEF points, then K points)
      const sortedScores = transformedScores.sort((a, b) => {
        if (a.total_points !== b.total_points) {
          return b.total_points - a.total_points;
        }
        if (a.def_points !== b.def_points) {
          return b.def_points - a.def_points;
        }
        return b.k_points - a.k_points;
      });

      setScores(sortedScores);
    } catch (error) {
      console.error('Error loading weekly scores:', error);
      setScores([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredScores = scores.filter(score =>
    score.user.team_name.toLowerCase().includes(search.toLowerCase()) ||
    score.user.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedScores = [...filteredScores].sort((a, b) => {
    let comparison = 0;

    if (sortField === 'rank') {
      // Rank is based on position in array (already sorted by total_points with tie-breakers)
      return 0;
    } else if (sortField === 'team_name') {
      comparison = a.user.team_name.localeCompare(b.user.team_name);
    } else {
      const aValue = a[sortField] || 0;
      const bValue = b[sortField] || 0;
      comparison = aValue - bValue;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'team_name' ? 'asc' : 'desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Week Selector */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Select Week
          </label>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: 18 }, (_, i) => i + 1).map(week => (
              <option key={week} value={week}>
                Week {week}
                {week === currentWeek ? ' (Current)' : ''}
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-slate-600">Loading results...</p>
        </div>
      )}

      {/* No Results */}
      {!loading && sortedScores.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">No Results Yet</h3>
          <p className="text-slate-600">
            Scores for Week {selectedWeek} haven't been posted yet. Check back soon!
          </p>
        </div>
      )}

      {/* Results Table */}
      {!loading && sortedScores.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('rank')}
                    className="flex items-center space-x-1 hover:text-blue-600"
                  >
                    <span>Rank</span>
                    <SortIcon field="rank" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('team_name')}
                    className="flex items-center space-x-1 hover:text-blue-600"
                  >
                    <span>Team</span>
                    <SortIcon field="team_name" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('total_points')}
                    className="flex items-center justify-end space-x-1 hover:text-blue-600 ml-auto"
                  >
                    <span>Total</span>
                    <SortIcon field="total_points" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('qb_points')}
                    className="flex items-center justify-end space-x-1 hover:text-blue-600 ml-auto"
                  >
                    <span>QB</span>
                    <SortIcon field="qb_points" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('rb1_points')}
                    className="flex items-center justify-end space-x-1 hover:text-blue-600 ml-auto"
                  >
                    <span>RB1</span>
                    <SortIcon field="rb1_points" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('rb2_points')}
                    className="flex items-center justify-end space-x-1 hover:text-blue-600 ml-auto"
                  >
                    <span>RB2</span>
                    <SortIcon field="rb2_points" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('wr1_points')}
                    className="flex items-center justify-end space-x-1 hover:text-blue-600 ml-auto"
                  >
                    <span>WR1</span>
                    <SortIcon field="wr1_points" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('wr2_points')}
                    className="flex items-center justify-end space-x-1 hover:text-blue-600 ml-auto"
                  >
                    <span>WR2</span>
                    <SortIcon field="wr2_points" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('te_points')}
                    className="flex items-center justify-end space-x-1 hover:text-blue-600 ml-auto"
                  >
                    <span>TE</span>
                    <SortIcon field="te_points" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('k_points')}
                    className="flex items-center justify-end space-x-1 hover:text-blue-600 ml-auto"
                  >
                    <span>K</span>
                    <SortIcon field="k_points" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('def_points')}
                    className="flex items-center justify-end space-x-1 hover:text-blue-600 ml-auto"
                  >
                    <span>DEF</span>
                    <SortIcon field="def_points" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedScores.map((score, index) => {
                const rank = index + 1;
                const isWinner = rank === 1;
                const isTopThree = rank <= 3;

                return (
                  <tr
                    key={score.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isWinner ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {isWinner && (
                          <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        )}
                        <span className={`font-semibold ${isTopThree ? 'text-blue-600' : 'text-slate-600'}`}>
                          #{rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-slate-900">{score.user.team_name}</div>
                        <div className="text-sm text-slate-500">{score.user.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold text-lg ${isWinner ? 'text-yellow-700' : 'text-slate-900'}`}>
                        {score.total_points.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">{score.qb_points.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{score.rb1_points.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{score.rb2_points.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{score.wr1_points.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{score.wr2_points.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{score.te_points.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{score.k_points.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{score.def_points.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Results Count */}
      {!loading && sortedScores.length > 0 && (
        <div className="mt-4 text-center text-sm text-slate-600">
          Showing {sortedScores.length} {sortedScores.length === 1 ? 'result' : 'results'}
          {search && ` for "${search}"`}
        </div>
      )}
    </div>
  );
}
