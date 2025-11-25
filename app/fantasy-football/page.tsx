'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import AnimatedSection from '@/components/shared/AnimatedSection';

export default function FantasyFootballPage() {
  const [currentRound, setCurrentRound] = useState<any>(null);
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentState();
  }, []);

  async function loadCurrentState() {
    try {
      // Get active round
      const { data: activeRound } = await supabase
        .from('rounds')
        .select('*')
        .eq('is_active', true)
        .single();

      if (activeRound) {
        setCurrentRound(activeRound);
      }

      // Get the most recent week with scores to determine current week
      const { data: latestScore } = await supabase
        .from('weekly_scores')
        .select('week_number')
        .order('week_number', { ascending: false })
        .limit(1)
        .single();

      if (latestScore) {
        // Current week is the latest scored week + 1 (upcoming week)
        setCurrentWeek(latestScore.week_number);
      } else if (activeRound) {
        // No scores yet, use start week of active round
        setCurrentWeek(activeRound.start_week);
      }
    } catch (error) {
      console.error('Error loading current state:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Extended Background Container */}
      <div className="relative">
        {/* Desktop Background */}
        <div
          className="hidden md:block absolute inset-0"
          style={{
            backgroundImage: 'url(/images/parallax/fantasy-football.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Mobile Background - adjusted positioning */}
        <div
          className="md:hidden absolute inset-0"
          style={{
            backgroundImage: 'url(/images/parallax/fantasy-football.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Hero Section */}
        <section className="relative text-white min-h-[50vh] flex items-center">
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Overlaid Content - Centered */}
          <div className="relative w-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 text-white drop-shadow-2xl">
              FANTASY FOOTBALL CHALLENGE
            </h1>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-10 md:mb-12 text-white/95 drop-shadow-lg whitespace-nowrap">
              18 weeks. 3 rounds. Track your results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <Link
                href="/fantasy-football/results"
                className="bg-white text-xl-dark-blue px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-2xl text-center"
              >
                View Results
              </Link>
            </div>
          </div>
          </div>
        </section>

        {/* Current Week/Round Banner - Frosted */}
        <section className="relative bg-xl-dark-blue/60 backdrop-blur-sm text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-2">
              <div>
                <span className="font-semibold">Current Round:</span>{' '}
                {currentRound
                  ? `Round ${currentRound.round_number} (Weeks ${currentRound.start_week}-${currentRound.end_week})`
                  : 'Loading...'}
              </div>
              <div>
                <span className="font-semibold">Current Week:</span> Week {currentWeek || '...'}
              </div>
              <div className="bg-green-500 px-4 py-2 rounded-full text-sm font-bold">
                ✓ Submissions Open
              </div>
            </div>
          )}
        </div>
      </section>
      </div>

      {/* Results Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              View Your Results
            </h2>
            <p className="text-xl text-gray-600">
              Track standings across the entire season
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Weekly Results */}
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="bg-white rounded-lg p-6 h-full border-2 border-xl-bright-blue">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Weekly Results</h3>
                <p className="text-gray-700 text-sm mb-4">
                  See how every team performed each week with detailed position-by-position scoring breakdowns.
                </p>
                <div className="text-xs text-gray-600">
                  18 weeks of results
                </div>
              </div>
            </AnimatedSection>

            {/* Round Results */}
            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-white rounded-lg p-6 h-full border-2 border-xl-bright-blue">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Round Standings</h3>
                <p className="text-gray-700 text-sm mb-4">
                  View cumulative totals for each 6-week round and see who's leading the pack.
                </p>
                <div className="text-xs text-gray-600">
                  3 rounds per season
                </div>
              </div>
            </AnimatedSection>

            {/* Season Results */}
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="bg-white rounded-lg p-6 h-full border-2 border-xl-bright-blue">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Season Leaderboard</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Track the overall season standings with full cumulative scores across all 18 weeks.
                </p>
                <div className="text-xs text-gray-600">
                  Full season championship
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              How It Works
            </h2>
          </AnimatedSection>

          <div className="space-y-6">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-xl-bright-blue text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Submit Your Lineup</h3>
                    <p className="text-gray-700">
                      Select 8 players (1 QB, 2 RB, 2 WR, 1 TE, 1 K, 1 DEF) at the start of each 6-week round.
                      Your lineup is locked for all 6 weeks of the round.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-xl-bright-blue text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Follow Elite Player Rules</h3>
                    <p className="text-gray-700">
                      You can select a maximum of 2 "elite" players per lineup. Elite players are the top 3-6 ranked players
                      at each position. Choose wisely!
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-xl-bright-blue text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Score Points Weekly</h3>
                    <p className="text-gray-700">
                      Points are calculated based on real NFL stats each week using PPR scoring. Check the results
                      page to see how you stack up!
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={400}>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-xl-bright-blue text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Track Your Standings</h3>
                    <p className="text-gray-700">
                      Check the results page to see weekly, round, and season standings. Compare your performance
                      against other teams throughout the season!
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Scoring Rules */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              Scoring Rules
            </h2>
            <p className="text-gray-600">
              Point-Per-Reception (PPR) scoring system
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Offensive Scoring */}
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-4">Offensive Players</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Passing TD</span>
                    <span className="font-semibold">6 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Rushing TD</span>
                    <span className="font-semibold">6 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Receiving TD</span>
                    <span className="font-semibold">6 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Each Reception</span>
                    <span className="font-semibold">1 pt</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">25 Passing Yards</span>
                    <span className="font-semibold">1 pt</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">10 Rushing Yards</span>
                    <span className="font-semibold">1 pt</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">10 Receiving Yards</span>
                    <span className="font-semibold">1 pt</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">2-Point Conversion</span>
                    <span className="font-semibold">2 pts</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Kicker & Defense Scoring */}
            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-4">Kicker</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Field Goal</span>
                    <span className="font-semibold">3 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">PAT (Extra Point)</span>
                    <span className="font-semibold">1 pt</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-xl-dark-blue mb-4">Team Defense</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Defensive TD</span>
                    <span className="font-semibold">6 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Interception</span>
                    <span className="font-semibold">2 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Safety</span>
                    <span className="font-semibold">2 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Sack</span>
                    <span className="font-semibold">3 pts</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Tie-breakers */}
          <AnimatedSection animation="fade-up" delay={300} className="mt-8">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Tie-Breakers</h3>
              <p className="text-gray-700 mb-2">
                If two or more teams have the same total points:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>Higher Team Defense scoring wins</li>
                <li>Higher Kicker scoring wins</li>
              </ol>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <AnimatedSection animation="fade-up" delay={100} className="h-full">
              <Link href="/fantasy-football/results" className="block h-full">
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow h-full text-center border-2 border-xl-bright-blue">
                  <h3 className="text-xl font-bold text-xl-dark-blue mb-2">View Results</h3>
                  <p className="text-gray-600 text-sm">
                    Check weekly, round, and season standings
                  </p>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200} className="h-full">
              <Link href="/fantasy-football/rosters" className="block h-full">
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow h-full text-center border-2 border-xl-bright-blue">
                  <h3 className="text-xl font-bold text-xl-dark-blue mb-2">View Rosters</h3>
                  <p className="text-gray-600 text-sm">
                    See all submitted lineups
                  </p>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Promotion Disclaimer Footer */}
      <section className="py-8 bg-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <details className="group">
            <summary className="flex items-center justify-center cursor-pointer text-sm text-slate-600 hover:text-slate-800 transition-colors">
              <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Promotion Disclaimer</span>
              <svg className="w-4 h-4 ml-2 transform transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-4 text-xs text-slate-600 text-center leading-relaxed max-w-3xl mx-auto">
              <p>
                This Fantasy Football promotion is for entertainment purposes only and is not affiliated with or endorsed by the NFL or any team. Participation is by invitation only. No purchase necessary. Any prizes offered comply with applicable laws. Personal data collected will be used solely for contest administration and handled in accordance with our{' '}
                <Link href="/privacy" className="text-xl-bright-blue hover:underline">Privacy Policy</Link>
                {' '}and applicable law. This promotion does not impact any insurance products or services and cannot be used to bind, amend, or cancel coverage.
              </p>
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
