'use client';

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  rank: number;
  teamName: string;
  email: string;
  points: number;
}

interface Round {
  id: string;
  round_number: number;
  start_week: number;
  end_week: number;
  is_active: boolean;
}

export default function LeaderboardPage() {
  const [view, setView] = useState<'weekly' | 'round' | 'season'>('season');
  const [selectedWeek, setSelectedWeek] = useState(8);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [rounds, setRounds] = useState<Round[]>([]);

  useEffect(() => {
    loadRounds();
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [view, selectedWeek, selectedRound]);

  async function loadRounds() {
    try {
      const response = await fetch('/api/rounds');
      if (response.ok) {
        const data = await response.json();
        setRounds(data.rounds || []);
        // Set first round as default
        if (data.rounds?.length > 0) {
          setSelectedRound(data.rounds[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load rounds:', error);
    }
  }

  async function loadLeaderboard() {
    setLoading(true);
    try {
      let url = `/api/leaderboard?view=${view}`;

      if (view === 'weekly') {
        url += `&week=${selectedWeek}`;
      } else if (view === 'round' && selectedRound) {
        url += `&roundId=${selectedRound}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setLeaderboard(data.leaderboard || []);
      } else {
        console.error('Leaderboard error:', data.error);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            🏆 Fantasy Football Leaderboard
          </h1>
          <p className="text-lg text-slate-600">
            XL Benefits 2025 Season
          </p>
        </div>

        {/* View Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* View Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setView('weekly')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  view === 'weekly'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setView('round')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  view === 'round'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Round
              </button>
              <button
                onClick={() => setView('season')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  view === 'season'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Season
              </button>
            </div>

            {/* Filters */}
            {view === 'weekly' && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Week:</label>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 18 }, (_, i) => i + 1).map(week => (
                    <option key={week} value={week}>Week {week}</option>
                  ))}
                </select>
              </div>
            )}

            {view === 'round' && rounds.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Round:</label>
                <select
                  value={selectedRound || ''}
                  onChange={(e) => setSelectedRound(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {rounds.map(round => (
                    <option key={round.id} value={round.id}>
                      Round {round.round_number} (Weeks {round.start_week}-{round.end_week})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-600">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-600 text-lg">No results available yet</p>
              <p className="text-slate-500 text-sm mt-1">Check back after lineups are scored</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Team Name
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {leaderboard.map((entry, index) => {
                    const isTop3 = index < 3;
                    const medalColors = ['text-yellow-500', 'text-slate-400', 'text-amber-600'];

                    return (
                      <tr
                        key={`${entry.email}-${entry.rank}`}
                        className={`hover:bg-slate-50 transition-colors ${
                          isTop3 ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {isTop3 ? (
                              <span className={`text-2xl ${medalColors[index]} mr-2`}>
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                              </span>
                            ) : null}
                            <span className={`text-lg font-bold ${
                              isTop3 ? 'text-slate-800' : 'text-slate-600'
                            }`}>
                              {entry.rank}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`font-semibold ${
                            isTop3 ? 'text-slate-800 text-lg' : 'text-slate-700'
                          }`}>
                            {entry.teamName}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-lg font-bold ${
                            isTop3 ? 'text-blue-600' : 'text-slate-700'
                          }`}>
                            {entry.points.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {!loading && leaderboard.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-slate-600 mb-1">Leader</div>
              <div className="text-xl font-bold text-slate-800">{leaderboard[0]?.teamName}</div>
              <div className="text-sm text-blue-600">{leaderboard[0]?.points.toFixed(2)} pts</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-slate-600 mb-1">Total Teams</div>
              <div className="text-xl font-bold text-slate-800">{leaderboard.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-slate-600 mb-1">Average Score</div>
              <div className="text-xl font-bold text-slate-800">
                {(leaderboard.reduce((sum, e) => sum + e.points, 0) / leaderboard.length).toFixed(2)} pts
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
