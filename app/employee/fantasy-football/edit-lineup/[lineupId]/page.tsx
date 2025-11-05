'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface DraftPlayer {
  id: string;
  name: string;
  team: string;
  position: string;
  rank: number;
  totalPoints: number;
  isElite: boolean;
}

interface LineupData {
  qb: string;
  rb1: string;
  rb2: string;
  wr1: string;
  wr2: string;
  te: string;
  k: string;
  def: string;
}

interface LineupInfo {
  id: string;
  user_id: string;
  round_id: string;
  is_locked: boolean;
  users: {
    name: string;
    team_name: string;
    email: string;
  };
  rounds: {
    round_number: number;
    start_week: number;
    end_week: number;
  };
}

export default function AdminEditLineupPage({ params }: { params: Promise<{ lineupId: string }> }) {
  const [lineupId, setLineupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lineupInfo, setLineupInfo] = useState<LineupInfo | null>(null);
  const [draftPool, setDraftPool] = useState<Record<string, DraftPlayer[]>>({});
  const [lineup, setLineup] = useState<LineupData>({
    qb: '',
    rb1: '',
    rb2: '',
    wr1: '',
    wr2: '',
    te: '',
    k: '',
    def: '',
  });
  const router = useRouter();

  useEffect(() => {
    params.then(p => {
      setLineupId(p.lineupId);
    });
  }, [params]);

  useEffect(() => {
    if (lineupId) {
      loadLineup();
    }
  }, [lineupId]);

  async function loadLineup() {
    try {
      setLoading(true);

      // Get lineup data
      const { data: lineupData, error: lineupError } = await supabase
        .from('lineups')
        .select(`
          id,
          user_id,
          round_id,
          is_locked,
          qb,
          rb1,
          rb2,
          wr1,
          wr2,
          te,
          k,
          def,
          users!inner(name, team_name, email),
          rounds!inner(round_number, start_week, end_week)
        `)
        .eq('id', lineupId)
        .single();

      if (lineupError) throw lineupError;

      setLineupInfo(lineupData);
      setLineup({
        qb: lineupData.qb || '',
        rb1: lineupData.rb1 || '',
        rb2: lineupData.rb2 || '',
        wr1: lineupData.wr1 || '',
        wr2: lineupData.wr2 || '',
        te: lineupData.te || '',
        k: lineupData.k || '',
        def: lineupData.def || '',
      });

      // Load draft pool for the round
      await loadDraftPool(lineupData.round_id);
    } catch (err: any) {
      console.error('Error loading lineup:', err);
      setError(err.message || 'Failed to load lineup');
    } finally {
      setLoading(false);
    }
  }

  async function loadDraftPool(roundId: string) {
    try {
      // Fetch draft pool directly from Supabase
      const { data: draftPoolData, error } = await supabase
        .from('draft_pools')
        .select(`
          *,
          players!inner(name, team)
        `)
        .eq('round_id', roundId)
        .order('position')
        .order('rank');

      if (error) {
        console.error('Error loading draft pool:', error);
        return;
      }

      // Group by position and add K and DEF options
      const byPosition: Record<string, DraftPlayer[]> = {
        QB: [],
        RB: [],
        WR: [],
        TE: [],
        K: [],
        DEF: [],
      };

      // Process database players
      for (const entry of draftPoolData || []) {
        const player = entry.players as any;
        if (byPosition[entry.position]) {
          byPosition[entry.position].push({
            id: entry.player_id,
            name: player.name,
            team: player.team,
            position: entry.position,
            rank: entry.rank,
            totalPoints: entry.total_points || 0,
            isElite: entry.is_elite || false,
          });
        }
      }

      // Add placeholder kickers if none exist
      if (byPosition.K.length === 0) {
        byPosition.K = [
          { id: 'k1', name: 'Justin Tucker', team: 'BAL', position: 'K', rank: 1, totalPoints: 150, isElite: false },
          { id: 'k2', name: 'Harrison Butker', team: 'KC', position: 'K', rank: 2, totalPoints: 145, isElite: false },
          { id: 'k3', name: 'Tyler Bass', team: 'BUF', position: 'K', rank: 3, totalPoints: 140, isElite: false },
          { id: 'k4', name: 'Jake Elliott', team: 'PHI', position: 'K', rank: 4, totalPoints: 135, isElite: false },
          { id: 'k5', name: 'Daniel Carlson', team: 'LV', position: 'K', rank: 5, totalPoints: 130, isElite: false },
        ];
      }

      // Add placeholder defenses if none exist
      if (byPosition.DEF.length === 0) {
        byPosition.DEF = [
          { id: 'def1', name: 'San Francisco 49ers', team: 'SF', position: 'DEF', rank: 1, totalPoints: 180, isElite: false },
          { id: 'def2', name: 'Baltimore Ravens', team: 'BAL', position: 'DEF', rank: 2, totalPoints: 175, isElite: false },
          { id: 'def3', name: 'Buffalo Bills', team: 'BUF', position: 'DEF', rank: 3, totalPoints: 170, isElite: false },
          { id: 'def4', name: 'Dallas Cowboys', team: 'DAL', position: 'DEF', rank: 4, totalPoints: 165, isElite: false },
          { id: 'def5', name: 'New York Jets', team: 'NYJ', position: 'DEF', rank: 5, totalPoints: 160, isElite: false },
        ];
      }

      setDraftPool(byPosition);
    } catch (err) {
      console.error('Failed to load draft pool:', err);
      setError('Failed to load player options');
    }
  }

  function countElitePlayers(): number {
    const selectedIds = Object.values(lineup).filter(Boolean);
    return selectedIds.filter(id => {
      for (const position of Object.values(draftPool)) {
        const player = position.find(p => p.id === id);
        if (player?.isElite) return true;
      }
      return false;
    }).length;
  }

  function canSelectPlayer(playerId: string, currentPos: string): boolean {
    // Check if this player is elite
    let isElite = false;
    for (const position of Object.values(draftPool)) {
      const player = position.find(p => p.id === playerId);
      if (player?.isElite) {
        isElite = true;
        break;
      }
    }

    if (!isElite) return true;

    // Count elite players excluding the current position
    const selectedIds = Object.entries(lineup)
      .filter(([pos, id]) => pos !== currentPos && id)
      .map(([_, id]) => id);

    const eliteCount = selectedIds.filter(id => {
      for (const position of Object.values(draftPool)) {
        const player = position.find(p => p.id === id);
        if (player?.isElite) return true;
      }
      return false;
    }).length;

    return eliteCount < 2;
  }

  async function handleSave() {
    // Validate all positions filled
    const positions = ['qb', 'rb1', 'rb2', 'wr1', 'wr2', 'te', 'k', 'def'];
    for (const pos of positions) {
      if (!lineup[pos as keyof LineupData]) {
        alert(`Please select a player for ${pos.toUpperCase()}`);
        return;
      }
    }

    // Check elite limit
    if (countElitePlayers() > 2) {
      alert('Maximum 2 elite players allowed');
      return;
    }

    if (!confirm('Save lineup changes?')) {
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('lineups')
        .update({
          qb: lineup.qb,
          rb1: lineup.rb1,
          rb2: lineup.rb2,
          wr1: lineup.wr1,
          wr2: lineup.wr2,
          te: lineup.te,
          k: lineup.k,
          def: lineup.def,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lineupId);

      if (updateError) throw updateError;

      alert('Lineup saved successfully!');
      router.push('/employee/fantasy-football');
    } catch (err: any) {
      alert(err.message || 'Failed to save lineup');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-xl-bright-blue mb-4"></div>
          <p className="text-xl-grey">Loading lineup...</p>
        </div>
      </div>
    );
  }

  if (error || !lineupInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Error</h1>
          <p className="text-slate-600 mb-6">{error || 'Lineup not found'}</p>
          <Link
            href="/employee/fantasy-football"
            className="inline-block px-6 py-3 bg-xl-bright-blue text-white font-semibold rounded-lg hover:bg-xl-dark-blue transition-colors"
          >
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  const eliteCount = countElitePlayers();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 -mt-8 -mx-4 px-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/employee/fantasy-football"
                className="text-xl-grey hover:text-xl-dark-blue transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-xl-dark-blue">
                  Edit Lineup - {lineupInfo.users.team_name}
                </h1>
                <p className="text-sm text-xl-grey mt-1">
                  {lineupInfo.users.name} • Round {lineupInfo.rounds.round_number} (Weeks {lineupInfo.rounds.start_week}-{lineupInfo.rounds.end_week})
                  {lineupInfo.is_locked && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">LOCKED</span>}
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-xl-bright-blue text-white font-semibold rounded-lg hover:bg-xl-dark-blue disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Elite Counter */}
        <div className="mb-6 flex justify-center">
          <div className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold text-lg ${
            eliteCount >= 2 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Elite Players: {eliteCount}/2
          </div>
        </div>

        {/* Positions */}
        <div className="grid md:grid-cols-2 gap-6">
          {(['qb', 'rb1', 'rb2', 'wr1', 'wr2', 'te', 'k', 'def'] as const).map(position => {
            const posLabel = position.toUpperCase();
            const poolKey = position === 'rb1' || position === 'rb2' ? 'RB' :
                          position === 'wr1' || position === 'wr2' ? 'WR' :
                          position.toUpperCase();
            const players = draftPool[poolKey] || [];
            const selectedPlayer = players.find(p => p.id === lineup[position]);

            return (
              <div key={position} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-xl-dark-blue mb-4">{posLabel}</h3>

                {/* Current Selection */}
                {selectedPlayer && (
                  <div className={`mb-4 p-4 rounded-lg border-2 ${
                    selectedPlayer.isElite ? 'border-yellow-400 bg-yellow-50' : 'border-green-400 bg-green-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">{selectedPlayer.name}</div>
                        <div className="text-sm text-slate-600">{selectedPlayer.team} • Rank #{selectedPlayer.rank}</div>
                      </div>
                      {selectedPlayer.isElite && (
                        <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">ELITE</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Player Selection */}
                <select
                  value={lineup[position]}
                  onChange={(e) => setLineup({ ...lineup, [position]: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                >
                  <option value="">Select {posLabel}</option>
                  {players.map(player => {
                    const canSelect = canSelectPlayer(player.id, position);
                    return (
                      <option
                        key={player.id}
                        value={player.id}
                        disabled={!canSelect}
                      >
                        #{player.rank} {player.name} ({player.team}) {player.isElite ? '⭐ ELITE' : ''} - {player.totalPoints.toFixed(1)} pts
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          })}
        </div>

        {/* Warning about locked */}
        {lineupInfo.is_locked && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-900">
              <strong>Note:</strong> This lineup is currently locked. Users cannot edit it until you unlock it from the admin page.
              You can still edit it here as an admin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
