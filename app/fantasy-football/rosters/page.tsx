'use client';

import { useState, useEffect } from 'react';
import { supabase, type Player } from '@/lib/supabase/client';
import { RosterGrid } from '@/components/fantasy-football/RosterGrid';
import { RosterList } from '@/components/fantasy-football/RosterList';

interface Lineup {
  id: string;
  user: {
    name: string;
    team_name: string;
    email: string;
  };
  players: {
    qb: Player;
    rb1: Player;
    rb2: Player;
    wr1: Player;
    wr2: Player;
    te: Player;
    k: Player;
    def: Player;
  };
  submitted_at: string;
}

export default function RostersPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [rounds, setRounds] = useState<any[]>([]);
  const [selectedRound, setSelectedRound] = useState('');
  const [lineups, setLineups] = useState<Lineup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadRounds();
  }, []);

  useEffect(() => {
    if (selectedRound) {
      loadLineups();
    }
  }, [selectedRound]);

  async function loadRounds() {
    try {
      const { data: roundsData, error } = await supabase
        .from('rounds')
        .select('*')
        .order('round_number', { ascending: true });

      if (error) throw error;
      setRounds(roundsData || []);

      // Set active round as default, or first round if none active
      const activeRound = roundsData?.find((r: any) => r.is_active);
      setSelectedRound(activeRound?.id || roundsData?.[0]?.id || '');
    } catch (error) {
      console.error('Error loading rounds:', error);
    }
  }

  async function loadLineups() {
    try {
      setLoading(true);

      // Get all lineups for the selected round with user and player data
      const { data: lineupsData, error: lineupsError } = await supabase
        .from('lineups')
        .select(`
          id,
          submitted_at,
          user:users!inner(
            name,
            team_name,
            email
          ),
          qb:qb_id(id, name, position, team, is_elite, is_custom),
          rb1:rb1_id(id, name, position, team, is_elite, is_custom),
          rb2:rb2_id(id, name, position, team, is_elite, is_custom),
          wr1:wr1_id(id, name, position, team, is_elite, is_custom),
          wr2:wr2_id(id, name, position, team, is_elite, is_custom),
          te:te_id(id, name, position, team, is_elite, is_custom),
          k:k_id(id, name, position, team, is_elite, is_custom),
          def:def_id(id, name, position, team, is_elite, is_custom)
        `)
        .eq('round_id', selectedRound)
        .order('submitted_at', { ascending: true });

      if (lineupsError) throw lineupsError;

      const transformedLineups: Lineup[] = (lineupsData || []).map((lineup: any) => ({
        id: lineup.id,
        submitted_at: lineup.submitted_at,
        user: {
          name: lineup.user.name,
          team_name: lineup.user.team_name,
          email: lineup.user.email,
        },
        players: {
          qb: lineup.qb,
          rb1: lineup.rb1,
          rb2: lineup.rb2,
          wr1: lineup.wr1,
          wr2: lineup.wr2,
          te: lineup.te,
          k: lineup.k,
          def: lineup.def,
        },
      }));

      setLineups(transformedLineups);
    } catch (error) {
      console.error('Error loading lineups:', error);
      setLineups([]);
    } finally {
      setLoading(false);
    }
  }

  const selectedRoundData = rounds.find(r => r.id === selectedRound);

  const filteredLineups = lineups.filter(lineup =>
    lineup.user.team_name.toLowerCase().includes(search.toLowerCase()) ||
    lineup.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Team Rosters
          </h1>
          <p className="text-lg text-slate-600">
            View all submitted lineups for the current round
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
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

            {/* View Toggle */}
            <div className="lg:w-auto">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                View
              </label>
              <div className="flex border border-slate-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`px-4 py-2 flex items-center space-x-2 transition-colors ${
                    view === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Grid</span>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 flex items-center space-x-2 transition-colors ${
                    view === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span>List</span>
                </button>
              </div>
            </div>
          </div>

          {/* Round Info */}
          {selectedRoundData && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Round {selectedRoundData.round_number}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {new Date(selectedRoundData.start_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric'
                    })} - {new Date(selectedRoundData.end_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-700">Lineups Submitted</p>
                  <p className="text-2xl font-bold text-blue-900">{lineups.length}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600">Loading rosters...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredLineups.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">No Rosters Found</h3>
            <p className="text-slate-600">
              {search
                ? `No rosters match your search "${search}"`
                : 'No lineups have been submitted for this round yet.'
              }
            </p>
          </div>
        )}

        {/* Rosters Display */}
        {!loading && filteredLineups.length > 0 && (
          <>
            {view === 'grid' ? (
              <RosterGrid lineups={filteredLineups} />
            ) : (
              <RosterList lineups={filteredLineups} />
            )}

            {/* Results Count */}
            <div className="mt-6 text-center text-sm text-slate-600">
              Showing {filteredLineups.length} {filteredLineups.length === 1 ? 'roster' : 'rosters'}
              {search && ` for "${search}"`}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
