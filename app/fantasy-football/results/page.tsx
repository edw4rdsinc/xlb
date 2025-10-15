'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { WeeklyResults } from '@/components/fantasy-football/WeeklyResults';
import { RoundResults } from '@/components/fantasy-football/RoundResults';
import { SeasonResults } from '@/components/fantasy-football/SeasonResults';

type Tab = 'weekly' | 'round' | 'season';

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('weekly');
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(1);
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

      // Get active round to determine current week
      const { data: activeRound } = await supabase
        .from('rounds')
        .select('*')
        .eq('is_active', true)
        .single();

      if (activeRound) {
        // In a real app, you'd calculate current week based on today's date
        // For now, we'll use the start week of the active round
        setCurrentWeek(activeRound.start_week);
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
              <RoundResults rounds={rounds} />
            )}
            {activeTab === 'season' && (
              <SeasonResults />
            )}
          </div>
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
