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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      // Get active round
      const { data: roundData, error: roundError } = await supabase
        .from('rounds')
        .select('*')
        .eq('is_active', true)
        .single();

      if (roundError) throw roundError;
      setCurrentRound(roundData);

      // Get all players
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .order('name', { ascending: true });

      if (playersError) throw playersError;
      setPlayers(playersData || []);
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
                You may select a maximum of 2 elite players in your lineup. Elite players are marked with a star badge.
              </p>
            </div>
          </div>
        </div>

        {/* Lineup Form */}
        <LineupForm
          players={players}
          currentRound={currentRound}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
