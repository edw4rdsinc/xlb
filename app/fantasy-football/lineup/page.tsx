'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface DraftPlayer {
  id: string;
  name: string;
  team: string;
  position: string;
  rank: number;
  totalPoints: number;
  isElite: boolean;
}

interface Session {
  userId: string;
  roundId: string;
  userEmail: string;
  teamName: string;
  token: string;
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

function LineupSubmissionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
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
  const [customPlayers, setCustomPlayers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, [searchParams]);

  async function initializeAuth() {
    try {
      setLoading(true);
      const token = searchParams.get('token');

      if (token) {
        // Validate magic link token
        const response = await fetch(`/api/auth/magic-link?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Invalid or expired link');
          return;
        }

        setSession(data.user);
        await loadDraftPool(data.user.roundId);
      } else {
        // Check for existing session
        const response = await fetch('/api/lineup/submit');
        if (response.ok) {
          const data = await response.json();
          if (data.lineup) {
            // User has existing session and lineup
            setLineup(data.lineup);
            setSubmitted(true);
          }
          // Get session info from cookie (we'd need an endpoint for this)
          // For now, redirect to magic link if no token
          setError('Please use your magic link to access this page');
        } else {
          setError('No active session. Please use your magic link.');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError('Failed to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function loadDraftPool(roundId: string) {
    try {
      const response = await fetch(`/api/admin/draft-pools/update-elite?roundId=${roundId}`);
      const data = await response.json();

      if (response.ok) {
        setDraftPool(data.draftPool);
      }
    } catch (err) {
      console.error('Failed to load draft pool:', err);
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

  function canSelectPlayer(playerId: string): boolean {
    for (const position of Object.values(draftPool)) {
      const player = position.find(p => p.id === playerId);
      if (player?.isElite && countElitePlayers() >= 2) {
        return false;
      }
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate all positions filled
    const positions = ['qb', 'rb1', 'rb2', 'wr1', 'wr2', 'te', 'k', 'def'];
    for (const pos of positions) {
      if (!lineup[pos as keyof LineupData] && !customPlayers[pos]) {
        alert(`Please select a player for ${pos.toUpperCase()}`);
        return;
      }
    }

    // Check elite limit
    if (countElitePlayers() > 2) {
      alert('Maximum 2 elite players allowed');
      return;
    }

    setSubmitting(true);

    try {
      // Build submission with custom players as names
      const submission = { ...lineup };
      for (const [pos, customName] of Object.entries(customPlayers)) {
        if (customName) {
          submission[pos as keyof LineupData] = customName;
        }
      }

      const response = await fetch('/api/lineup/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit lineup');
      }

      setSubmitted(true);
      alert('Lineup submitted successfully!');
      router.push('/fantasy-football/leaderboard');
    } catch (err: any) {
      alert(err.message || 'Failed to submit lineup');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading your draft...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Authentication Error</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <a
            href="/fantasy-football"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const eliteCount = countElitePlayers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Welcome, {session?.teamName}!
          </h1>
          <p className="text-lg text-slate-600">
            Set your lineup for the current round
          </p>
        </div>

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

        {/* Elite Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Elite Player Limit</h3>
              <p className="text-sm text-amber-700 mt-1">
                You may select a maximum of 2 elite players. Elite players are shown in gold text with an ELITE badge.
              </p>
            </div>
          </div>
        </div>

        {/* Lineup Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Lineup</h2>

          <div className="space-y-4">
            {/* QB */}
            <PlayerSelectField
              label="Quarterback (QB)"
              position="QB"
              value={lineup.qb}
              players={draftPool.QB || []}
              onChange={(value) => setLineup(prev => ({ ...prev, qb: value }))}
              onCustomChange={(value) => setCustomPlayers(prev => ({ ...prev, qb: value }))}
              canSelectPlayer={canSelectPlayer}
              customValue={customPlayers.qb}
            />

            {/* RBs */}
            <div className="grid md:grid-cols-2 gap-4">
              <PlayerSelectField
                label="Running Back 1 (RB)"
                position="RB"
                value={lineup.rb1}
                players={draftPool.RB || []}
                onChange={(value) => setLineup(prev => ({ ...prev, rb1: value }))}
                onCustomChange={(value) => setCustomPlayers(prev => ({ ...prev, rb1: value }))}
                canSelectPlayer={canSelectPlayer}
                excludeIds={[lineup.rb2]}
                customValue={customPlayers.rb1}
              />
              <PlayerSelectField
                label="Running Back 2 (RB)"
                position="RB"
                value={lineup.rb2}
                players={draftPool.RB || []}
                onChange={(value) => setLineup(prev => ({ ...prev, rb2: value }))}
                onCustomChange={(value) => setCustomPlayers(prev => ({ ...prev, rb2: value }))}
                canSelectPlayer={canSelectPlayer}
                excludeIds={[lineup.rb1]}
                customValue={customPlayers.rb2}
              />
            </div>

            {/* WRs */}
            <div className="grid md:grid-cols-2 gap-4">
              <PlayerSelectField
                label="Wide Receiver 1 (WR)"
                position="WR"
                value={lineup.wr1}
                players={draftPool.WR || []}
                onChange={(value) => setLineup(prev => ({ ...prev, wr1: value }))}
                onCustomChange={(value) => setCustomPlayers(prev => ({ ...prev, wr1: value }))}
                canSelectPlayer={canSelectPlayer}
                excludeIds={[lineup.wr2]}
                customValue={customPlayers.wr1}
              />
              <PlayerSelectField
                label="Wide Receiver 2 (WR)"
                position="WR"
                value={lineup.wr2}
                players={draftPool.WR || []}
                onChange={(value) => setLineup(prev => ({ ...prev, wr2: value }))}
                onCustomChange={(value) => setCustomPlayers(prev => ({ ...prev, wr2: value }))}
                canSelectPlayer={canSelectPlayer}
                excludeIds={[lineup.wr1]}
                customValue={customPlayers.wr2}
              />
            </div>

            {/* TE */}
            <PlayerSelectField
              label="Tight End (TE)"
              position="TE"
              value={lineup.te}
              players={draftPool.TE || []}
              onChange={(value) => setLineup(prev => ({ ...prev, te: value }))}
              onCustomChange={(value) => setCustomPlayers(prev => ({ ...prev, te: value }))}
              canSelectPlayer={canSelectPlayer}
              customValue={customPlayers.te}
            />

            {/* K */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Kicker (K) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customPlayers.k || ''}
                onChange={(e) => setCustomPlayers(prev => ({ ...prev, k: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter kicker name (e.g., Brandon Aubrey)"
              />
              <p className="text-xs text-slate-500 mt-1">Write-in only (no dropdown)</p>
            </div>

            {/* DEF */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Defense (DEF) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customPlayers.def || ''}
                onChange={(e) => setCustomPlayers(prev => ({ ...prev, def: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter team defense (e.g., Baltimore Ravens)"
              />
              <p className="text-xs text-slate-500 mt-1">Write-in only (no dropdown)</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Lineup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface PlayerSelectFieldProps {
  label: string;
  position: string;
  value: string;
  players: DraftPlayer[];
  onChange: (value: string) => void;
  onCustomChange: (value: string) => void;
  canSelectPlayer: (id: string) => boolean;
  excludeIds?: string[];
  customValue?: string;
}

function PlayerSelectField({
  label,
  position,
  value,
  players,
  onChange,
  onCustomChange,
  canSelectPlayer,
  excludeIds = [],
  customValue,
}: PlayerSelectFieldProps) {
  const [useCustom, setUseCustom] = useState(false);

  const availablePlayers = players.filter(p => !excludeIds.includes(p.id));

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>

      {!useCustom ? (
        <>
          <select
            value={value}
            onChange={(e) => {
              if (e.target.value === '__custom__') {
                setUseCustom(true);
              } else {
                onChange(e.target.value);
              }
            }}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a player...</option>
            {availablePlayers.map(player => {
              const disabled = player.isElite && !canSelectPlayer(player.id);
              return (
                <option key={player.id} value={player.id} disabled={disabled}>
                  {player.isElite ? '⭐ ' : ''}{player.name} ({player.team}) - {player.totalPoints} pts
                  {disabled ? ' (Elite limit reached)' : ''}
                </option>
              );
            })}
            <option value="__custom__">➕ Write in custom player</option>
          </select>
        </>
      ) : (
        <>
          <input
            type="text"
            value={customValue || ''}
            onChange={(e) => onCustomChange(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter custom ${position} name`}
          />
          <button
            type="button"
            onClick={() => {
              setUseCustom(false);
              onCustomChange('');
            }}
            className="text-xs text-blue-600 hover:text-blue-700 mt-1"
          >
            ← Back to dropdown
          </button>
        </>
      )}
    </div>
  );
}

export default function LineupSubmissionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading draft...</p>
        </div>
      </div>
    }>
      <LineupSubmissionContent />
    </Suspense>
  );
}
