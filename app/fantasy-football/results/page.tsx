'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { WeeklyResults } from '@/components/fantasy-football/WeeklyResults';
import { RoundResults } from '@/components/fantasy-football/RoundResults';
import { SeasonResults } from '@/components/fantasy-football/SeasonResults';

type Tab = 'weekly' | 'round' | 'season';

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('weekly');
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentRoundId, setCurrentRoundId] = useState<string>('');
  const [rounds, setRounds] = useState<any[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setLoading(true);

      // Get all rounds
      const { data: roundsData, error: roundsError } = await supabase
        .from('rounds')
        .select('*')
        .order('round_number', { ascending: true });

      if (roundsError) throw roundsError;
      setRounds(roundsData || []);

      // Find the active round and set it as current
      const activeRound = roundsData?.find((r: any) => r.is_active);
      if (activeRound) {
        setCurrentRoundId(activeRound.id);
      } else if (roundsData && roundsData.length > 0) {
        // Fallback to first round if no active round
        setCurrentRoundId(roundsData[0].id);
      }

      // Get the most recent week with scores
      const { data: latestScore, error: scoreError } = await supabase
        .from('weekly_scores')
        .select('week_number')
        .order('week_number', { ascending: false })
        .limit(1)
        .single();

      if (!scoreError && latestScore) {
        // Set to the most recent week that has scores
        setCurrentWeek(latestScore.week_number);
      } else {
        // Fallback: use active round's start week if no scores found
        const { data: activeRound } = await supabase
          .from('rounds')
          .select('*')
          .eq('is_active', true)
          .single();

        if (activeRound) {
          setCurrentWeek(activeRound.start_week);
        }
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: 'weekly' as Tab, label: 'Weekly Results', icon: '📅' },
    { id: 'round' as Tab, label: 'Round Standings', icon: '🏆' },
    { id: 'season' as Tab, label: 'Season Leaderboard', icon: '👑' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Results & Standings
          </h1>
          <p className="text-lg text-slate-600">
            Track your performance and see where you rank
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="border-b border-slate-200">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-max px-6 py-4 text-center font-semibold transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'weekly' && (
              <WeeklyResults currentWeek={currentWeek} rounds={rounds} />
            )}
            {activeTab === 'round' && (
              <RoundResults rounds={rounds} currentRoundId={currentRoundId} />
            )}
            {activeTab === 'season' && (
              <SeasonResults />
            )}
          </div>
        </div>

        {/* View Rosters Button */}
        <div className="text-center mb-6">
          <Link
            href="/fantasy-football/rosters"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            View Rosters
          </Link>
        </div>

        {/* Prize Reminder */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">Prize Structure</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-yellow-800">Weekly Winners</p>
                  <p className="text-yellow-700">$25 per week (18 weeks)</p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-800">Round Winners</p>
                  <p className="text-yellow-700">1st: $150 | 2nd: $100 | 3rd: $50</p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-800">Season Champions</p>
                  <p className="text-yellow-700">1st: $400 | 2nd: $250 | 3rd: $100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
