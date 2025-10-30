'use client';

import { useState, useEffect } from 'react';
import { supabase, type Player, type Round } from '@/lib/supabase/client';
import { LineupForm } from '@/components/fantasy-football/LineupForm';
import { SuccessScreen } from '@/components/fantasy-football/SuccessScreen';

export default function SubmitLineupPage() {
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [existingLineup, setExistingLineup] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    loadData();
    checkForExistingLineup();
  }, []);

  async function checkForExistingLineup() {
    try {
      // Get token from URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) return;

      // Get magic link data
      const { data: magicLinkData, error: magicLinkError } = await supabase
        .from('magic_links')
        .select(`
          user_id,
          round_id,
          users (
            id,
            name,
            email,
            team_name
          )
        `)
        .eq('token', token)
        .single();

      if (magicLinkError || !magicLinkData) return;

      setUserData(magicLinkData.users);

      // Check for existing lineup
      const { data: lineupData, error: lineupError } = await supabase
        .from('lineups')
        .select(`
          *,
          lineup_players (
            position,
            player_id,
            players (
              id,
              name,
              position,
              team
            )
          )
        `)
        .eq('user_id', magicLinkData.user_id)
        .eq('round_id', magicLinkData.round_id)
        .single();

      if (lineupError || !lineupData) return;

      setExistingLineup(lineupData);
    } catch (error) {
      console.error('Error checking for existing lineup:', error);
    }
  }

  async function loadData() {
    try {
      setLoading(true);

      // Get active round
      const { data: roundData, error: roundError} = await supabase
        .from('rounds')
        .select('*')
        .eq('is_active', true)
        .single();

      if (roundError) throw roundError;
      setCurrentRound(roundData);

      // Determine current NFL week and if we should show scores
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 2 = Tuesday
      const showWeeklyScores = dayOfWeek >= 2; // Show on Tuesday (2) or later

      // Calculate current week (simplified - assumes season started Sept 4, 2025)
      const seasonStart = new Date('2025-09-04');
      const daysSinceStart = Math.floor((today.getTime() - seasonStart.getTime()) / (1000 * 60 * 60 * 24));
      const currentWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, 18); // Cap at week 18

      // Get players with stats, limit to top 40 per position, elites first
      const { data: allPlayersData, error: playersError } = await supabase
        .from('players')
        .select(`
          *,
          player_weekly_stats(calculated_points)
        `)
        .order('is_elite', { ascending: false })
        .order('name', { ascending: true });

      if (playersError) throw playersError;

      // Filter and rank by position
      const playersByPosition: Record<string, Player[]> = {};
      const positions = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'];

      // Group by position and calculate total points
      for (const player of (allPlayersData || [])) {
        const weeklyStats = (player as any).player_weekly_stats || [];

        const totalPoints = weeklyStats.reduce(
          (sum: number, stat: any) => sum + (parseFloat(stat.calculated_points) || 0),
          0
        ) || 0;

        // Find this week's points if we should show scores
        let weekPoints = null;
        if (showWeeklyScores) {
          const thisWeekStat = weeklyStats.find((stat: any) => stat.week_number === currentWeek);
          if (thisWeekStat) {
            weekPoints = parseFloat(thisWeekStat.calculated_points) || 0;
          }
        }

        if (positions.includes(player.position)) {
          if (!playersByPosition[player.position]) {
            playersByPosition[player.position] = [];
          }
          playersByPosition[player.position].push({
            ...player,
            total_points: totalPoints,
            week_points: weekPoints
          } as Player);
        }
      }

      // Sort each position by: elite first, then by total points, limit to top 20
      const topPlayers: Player[] = [];
      for (const position of positions) {
        const posPlayers = playersByPosition[position] || [];
        posPlayers.sort((a: any, b: any) => {
          // Elite players first
          if (a.is_elite !== b.is_elite) {
            return a.is_elite ? -1 : 1;
          }
          // Then by total points
          return (b.total_points || 0) - (a.total_points || 0);
        });

        // Take top 40
        topPlayers.push(...posPlayers.slice(0, 40));
      }

      setPlayers(topPlayers);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSuccess(data: any) {
    setSubmittedData(data);
    setSubmitted(true);
  }

  function handleNewSubmission() {
    setSubmitted(false);
    setSubmittedData(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading lineup form...</p>
        </div>
      </div>
    );
  }

  if (!currentRound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">No Active Round</h1>
          <p className="text-slate-600 mb-6">
            There is no active round at this time. Please check back later or contact the administrator.
          </p>
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

  if (submitted && submittedData) {
    return (
      <SuccessScreen
        data={submittedData}
        currentRound={currentRound}
        onNewSubmission={handleNewSubmission}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Submit Your Lineup
          </h1>
          <p className="text-lg text-slate-600">
            Round {currentRound.round_number} • Weeks {currentRound.start_week}-{currentRound.end_week}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Deadline: {new Date(currentRound.end_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Elite Player Reminder */}
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
                You may select a maximum of 2 elite players in your lineup. Elite players are shown in <span className="font-bold text-amber-600">gold text</span> with an <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded uppercase">Elite</span> badge.
              </p>
            </div>
          </div>
        </div>

        {/* Player Not Listed Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Player Not Listed?</h3>
              <p className="text-sm text-blue-700 mt-1">
                Each position shows the top 40 players. If your preferred player isn't listed, please email the XL Benefits team and we can make a manual update to your lineup.
              </p>
            </div>
          </div>
        </div>

        {/* Lineup Form */}
        <LineupForm
          players={players}
          currentRound={currentRound}
          existingLineup={existingLineup}
          userData={userData}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
