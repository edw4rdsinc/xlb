'use client';

import { useState, useEffect } from 'react';

interface Round {
  id: string;
  round_number: number;
  start_week: number;
  end_week: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface DraftPlayer {
  id: string;
  name: string;
  team: string;
  position: string;
  rank: number;
  totalPoints: number;
  isElite: boolean;
}

export default function FantasyFootballAdminPage() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [draftPool, setDraftPool] = useState<Record<string, DraftPlayer[]>>({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadRounds();
  }, []);

  useEffect(() => {
    if (selectedRound) {
      loadDraftPool();
    }
  }, [selectedRound]);

  async function loadRounds() {
    try {
      const response = await fetch('/api/rounds');
      const data = await response.json();

      if (response.ok) {
        setRounds(data.rounds || []);
        if (data.rounds?.length > 0) {
          setSelectedRound(data.rounds[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load rounds:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadDraftPool() {
    if (!selectedRound) return;

    try {
      const response = await fetch(`/api/admin/draft-pools/update-elite?roundId=${selectedRound}`);
      const data = await response.json();

      if (response.ok) {
        setDraftPool(data.draftPool || {});
      }
    } catch (error) {
      console.error('Failed to load draft pool:', error);
    }
  }

  async function generateDraftPool() {
    if (!selectedRound) return;

    if (!confirm('Generate draft pool for this round? This will overwrite any existing draft pool.')) {
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch(`/api/admin/rounds/${selectedRound}/generate-draft-pool`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Draft pool generated successfully!\n\n${JSON.stringify(data.summary, null, 2)}`);
        await loadDraftPool();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Failed to generate draft pool: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  }

  async function sendInvites() {
    if (!selectedRound) return;

    if (!confirm('Send draft invites to all participants for this round?')) {
      return;
    }

    setSending(true);

    try {
      const response = await fetch(`/api/admin/rounds/${selectedRound}/send-invites`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Invites sent!\n\nSent: ${data.sent}\nFailed: ${data.failed}`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Failed to send invites: ${error.message}`);
    } finally {
      setSending(false);
    }
  }

  async function toggleEliteStatus(playerId: string, currentStatus: boolean) {
    if (!selectedRound) return;

    try {
      const response = await fetch('/api/admin/draft-pools/update-elite', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          roundId: selectedRound,
          isElite: !currentStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await loadDraftPool();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Failed to update elite status: ${error.message}`);
    }
  }

  const currentRound = rounds.find(r => r.id === selectedRound);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Fantasy Football Admin Dashboard
          </h1>
          <p className="text-slate-600">
            Manage draft pools, elite status, and send invites
          </p>
        </div>

        {/* Round Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700">Select Round:</label>
              <select
                value={selectedRound || ''}
                onChange={(e) => setSelectedRound(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {rounds.map(round => (
                  <option key={round.id} value={round.id}>
                    Round {round.round_number} (Weeks {round.start_week}-{round.end_week})
                    {round.is_active ? ' - ACTIVE' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={generateDraftPool}
                disabled={generating || !selectedRound}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                {generating ? 'Generating...' : 'Generate Draft Pool'}
              </button>
              <button
                onClick={sendInvites}
                disabled={sending || !selectedRound}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? 'Sending...' : 'Send Invites'}
              </button>
            </div>
          </div>

          {currentRound && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-600">Round Number</div>
                <div className="text-lg font-bold text-slate-800">{currentRound.round_number}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-600">Weeks</div>
                <div className="text-lg font-bold text-slate-800">{currentRound.start_week}-{currentRound.end_week}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-600">Start Date</div>
                <div className="text-lg font-bold text-slate-800">
                  {new Date(currentRound.start_date).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-600">Status</div>
                <div className={`text-lg font-bold ${currentRound.is_active ? 'text-green-600' : 'text-slate-600'}`}>
                  {currentRound.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Draft Pool */}
        {Object.keys(draftPool).length > 0 ? (
          <div className="space-y-6">
            {(['QB', 'RB', 'WR', 'TE'] as const).map(position => {
              const players = draftPool[position] || [];
              if (players.length === 0) return null;

              const eliteLimits: Record<string, number> = {
                QB: 3,
                TE: 3,
                RB: 6,
                WR: 6,
              };
              const eliteCount = players.filter(p => p.isElite).length;
              const eliteLimit = eliteLimits[position];

              return (
                <div key={position} className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-800">{position}</h2>
                      <div className="text-sm text-slate-600">
                        Elite: <span className={`font-bold ${eliteCount >= eliteLimit ? 'text-red-600' : 'text-blue-600'}`}>
                          {eliteCount}/{eliteLimit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Rank</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Player</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Team</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Points</th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Elite</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {players.map(player => (
                          <tr key={player.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-bold text-slate-700">{player.rank}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-slate-800">{player.name}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-slate-600">{player.team}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className="text-sm font-semibold text-slate-700">{player.totalPoints.toFixed(2)}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <button
                                onClick={() => toggleEliteStatus(player.id, player.isElite)}
                                disabled={!player.isElite && eliteCount >= eliteLimit}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                                  player.isElite ? 'bg-blue-600' : 'bg-slate-300'
                                }`}
                                title={!player.isElite && eliteCount >= eliteLimit ? 'Elite limit reached' : 'Toggle elite status'}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    player.isElite ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Draft Pool Generated</h3>
            <p className="text-slate-600 mb-4">
              Generate a draft pool for this round to start managing elite status
            </p>
            <button
              onClick={generateDraftPool}
              disabled={generating}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              {generating ? 'Generating...' : 'Generate Draft Pool'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
