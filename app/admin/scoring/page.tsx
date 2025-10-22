'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase/client';
import { nflStatsAPI, type NFLPlayerStats } from '@/lib/api/nfl-stats';
import { calculatePlayerPoints } from '@/lib/scoring/calculator';

export default function AdminScoringPage() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [syncing, setSyncing] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [statsData, setStatsData] = useState<NFLPlayerStats[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ provider: string; isConfigured: boolean } | null>(null);

  useEffect(() => {
    // Get API status on component mount
    const status = nflStatsAPI.getAPIStatus();
    setApiStatus(status);
  }, []);

  async function handleSyncStats() {
    setSyncing(true);
    try {
      // Fetch stats from API
      const stats = await nflStatsAPI.fetchWeeklyStats(selectedWeek);
      setStatsData(stats);
      setShowPreview(true);

      const status = nflStatsAPI.getAPIStatus();
      const apiMessage = status.isConfigured
        ? 'Real NFL data from MySportsFeeds'
        : 'Mock data for testing';

      alert(`Successfully synced stats for Week ${selectedWeek}!\n\n` +
            `Source: ${status.provider}\n` +
            `Found ${stats.length} players with stats.\n\n` +
            `${apiMessage}`);
    } catch (error: any) {
      alert(`Failed to sync stats: ${error.message}`);
      console.error(error);
    } finally {
      setSyncing(false);
    }
  }

  async function handleCalculateScores() {
    if (statsData.length === 0) {
      alert('Please sync stats first');
      return;
    }

    setCalculating(true);
    try {
      // Get all players from database
      const { data: dbPlayers } = await supabase
        .from('players')
        .select('*');

      // Get all lineups for all rounds
      const { data: allLineups } = await supabase
        .from('lineups')
        .select('*');

      if (!allLineups || !dbPlayers) {
        throw new Error('Failed to fetch lineups or players');
      }

      // Calculate scores for each lineup
      const weeklyScores = [];

      for (const lineup of allLineups) {
        const positions = ['qb', 'rb1', 'rb2', 'wr1', 'wr2', 'te', 'k', 'def'];
        let totalPoints = 0;
        const positionPoints: any = {};

        for (const pos of positions) {
          const playerId = lineup[`${pos}_id`];
          const player = dbPlayers.find((p: any) => p.id === playerId);

          if (player) {
            // Find stats for this player
            const playerStats = statsData.find(s =>
              s.player_name.toLowerCase() === player.name.toLowerCase() &&
              s.position === player.position
            );

            const points = playerStats ? calculatePlayerPoints(playerStats) : 0;
            positionPoints[`${pos}_points`] = points;
            totalPoints += points;
          } else {
            positionPoints[`${pos}_points`] = 0;
          }
        }

        weeklyScores.push({
          lineup_id: lineup.id,
          week_number: selectedWeek,
          ...positionPoints,
          total_points: totalPoints,
        });
      }

      // Save to database (upsert)
      for (const score of weeklyScores) {
        const { error } = await supabase
          .from('weekly_scores')
          .upsert(score, {
            onConflict: 'lineup_id,week_number'
          });

        if (error) throw error;
      }

      alert(`Successfully calculated scores for ${weeklyScores.length} lineups!`);
    } catch (error: any) {
      alert(`Failed to calculate scores: ${error.message}`);
      console.error(error);
    } finally {
      setCalculating(false);
    }
  }

  async function handlePublishResults() {
    if (!confirm(`Publish results for Week ${selectedWeek}? This will make scores visible to all participants.`)) {
      return;
    }

    setPublishing(true);
    try {
      // In a real implementation, you might:
      // 1. Set a "published" flag on weekly_scores
      // 2. Trigger email notifications
      // 3. Update leaderboards

      // For now, just show success
      alert(`Results for Week ${selectedWeek} have been published!\n\n` +
            `Participants can now view their scores on the results page.`);

      // TODO: Send email notifications here
      // await sendWeeklyScoreEmails(selectedWeek);
    } catch (error: any) {
      alert(`Failed to publish results: ${error.message}`);
      console.error(error);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Scoring</h1>
          <p className="text-slate-600 mt-1">Sync stats from API and calculate weekly scores</p>
        </div>

        {/* Week Selector */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Week
          </label>
          <select
            value={selectedWeek}
            onChange={(e) => {
              setSelectedWeek(Number(e.target.value));
              setShowPreview(false);
              setStatsData([]);
            }}
            className="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: 18 }, (_, i) => i + 1).map(week => (
              <option key={week} value={week}>
                Week {week}
              </option>
            ))}
          </select>
        </div>

        {/* API Sync Section */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Step 1: Sync Stats from API</h2>
              <p className="text-sm text-slate-600 mt-1">
                Pull player statistics from NFL stats API for Week {selectedWeek}
              </p>
            </div>
            {apiStatus && (
              <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                apiStatus.isConfigured
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {apiStatus.provider}
              </div>
            )}
          </div>

          <button
            onClick={handleSyncStats}
            disabled={syncing}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {syncing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing Stats...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync Stats for Week {selectedWeek}
              </>
            )}
          </button>

          {showPreview && statsData.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-slate-800 mb-3">Preview: {statsData.length} Players</h3>
              <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {statsData.slice(0, 10).map((player, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium text-slate-800">{player.player_name}</span>
                        <span className="text-slate-500 ml-2">({player.position} - {player.team})</span>
                      </div>
                      <span className="font-semibold text-blue-600">
                        {calculatePlayerPoints(player).toFixed(2)} pts
                      </span>
                    </div>
                  ))}
                  {statsData.length > 10 && (
                    <p className="text-xs text-slate-500 text-center pt-2">
                      ...and {statsData.length - 10} more players
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Calculate Scores */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Step 2: Calculate Lineup Scores</h2>
          <p className="text-sm text-slate-600 mb-4">
            Apply synced stats to all submitted lineups and calculate total points
          </p>

          <button
            onClick={handleCalculateScores}
            disabled={calculating || !showPreview}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {calculating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calculate All Scores
              </>
            )}
          </button>
        </div>

        {/* Publish Results */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Step 3: Publish Results</h2>
          <p className="text-sm text-slate-600 mb-4">
            Make scores visible to participants and send email notifications
          </p>

          <button
            onClick={handlePublishResults}
            disabled={publishing}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {publishing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Publish Results & Notify
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className={`mt-6 border rounded-lg p-4 ${
          apiStatus?.isConfigured
            ? 'bg-green-50 border-green-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start">
            <svg className={`w-5 h-5 mr-3 mt-0.5 ${
              apiStatus?.isConfigured ? 'text-green-600' : 'text-blue-600'
            }`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className={`text-sm ${
              apiStatus?.isConfigured ? 'text-green-800' : 'text-blue-800'
            }`}>
              {apiStatus?.isConfigured ? (
                <>
                  <p className="font-semibold mb-1">✅ MySportsFeeds API Connected</p>
                  <p>Using MySportsFeeds Unlimited Non-Live tier for weekly NFL player statistics.</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Stats updated Tuesday mornings after Monday Night Football</li>
                    <li>All player stats (passing, rushing, receiving, kicking, defense)</li>
                    <li>Your custom PPR scoring rules will be applied automatically</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="font-semibold mb-1">Using Mock API</p>
                  <p>Currently using mock data for testing. MySportsFeeds API credentials not found.</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Add MySportsFeeds credentials to <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
                    <li>Set <code className="bg-blue-100 px-1 rounded">MYSPORTSFEEDS_API_KEY</code> and <code className="bg-blue-100 px-1 rounded">MYSPORTSFEEDS_PASSWORD</code></li>
                    <li>Restart the dev server to load new environment variables</li>
                  </ol>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
