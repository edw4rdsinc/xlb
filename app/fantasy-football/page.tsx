import Link from 'next/link';
import AnimatedSection from '@/components/shared/AnimatedSection';

export default function FantasyFootballPage() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative text-white py-20 md:py-32 min-h-[600px] flex items-center"
        style={{
          backgroundImage: 'url("/images/parallax/fantasy-football.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection animation="fade-up" className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
              XL Benefits Fantasy Football Challenge
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-lg"
               style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
              18 weeks. 3 rounds. Over $1,000 in prizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/fantasy-football/submit"
                className="bg-xl-bright-blue text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-white hover:text-xl-dark-blue transition-all hover:scale-105 shadow-lg"
              >
                Submit Your Lineup
              </Link>
              <Link
                href="/fantasy-football/results"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-white hover:text-xl-dark-blue transition-all hover:scale-105"
              >
                View Results
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Current Week/Round Banner */}
      <section className="bg-xl-dark-blue text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-2">
            <div>
              <span className="font-semibold">Current Round:</span> Round 1 (Weeks 1-6)
            </div>
            <div>
              <span className="font-semibold">Current Week:</span> Week 1
            </div>
            <div className="bg-green-500 px-4 py-2 rounded-full text-sm font-bold">
              ✓ Submissions Open
            </div>
          </div>
        </div>
      </section>

      {/* Prize Structure */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              Prize Structure
            </h2>
            <p className="text-xl text-gray-600">
              Multiple ways to win throughout the season
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Weekly Prizes */}
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 h-full border-2 border-blue-200">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Weekly Winner</h3>
                <div className="text-3xl font-bold text-xl-bright-blue mb-2">$25</div>
                <p className="text-gray-700 text-sm">
                  Amazon gift card for highest single-week score
                </p>
                <div className="mt-4 text-xs text-gray-600">
                  18 opportunities to win!
                </div>
              </div>
            </AnimatedSection>

            {/* Round Prizes */}
            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 h-full border-2 border-green-200">
                <div className="text-4xl mb-4">🥇</div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Round Winners</h3>
                <div className="space-y-1 mb-2">
                  <div className="font-bold text-lg">🥇 1st: $75</div>
                  <div className="font-bold text-lg">🥈 2nd: $50</div>
                  <div className="font-bold text-lg">🥉 3rd: $25</div>
                </div>
                <p className="text-gray-700 text-sm">
                  Cumulative 6-week totals
                </p>
              </div>
            </AnimatedSection>

            {/* Grand Prize */}
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 h-full border-2 border-yellow-300">
                <div className="text-4xl mb-4">👑</div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Grand Prize</h3>
                <div className="space-y-1 mb-2">
                  <div className="font-bold text-lg">🥇 1st: $400</div>
                  <div className="font-bold text-lg">🥈 2nd: $300</div>
                  <div className="font-bold text-lg">🥉 3rd: $200</div>
                  <div className="font-bold text-lg">4th: $100</div>
                </div>
                <p className="text-gray-700 text-sm">
                  Full season cumulative
                </p>
              </div>
            </AnimatedSection>

            {/* Total Prizes */}
            <AnimatedSection animation="fade-up" delay={400}>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 h-full border-2 border-purple-200">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Total Pool</h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">$1,450+</div>
                <p className="text-gray-700 text-sm mb-4">
                  In prizes this season
                </p>
                <div className="text-xs text-gray-600">
                  * Winners receiving $600+ will receive W-9 form for IRS reporting
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
                    <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Win Prizes</h3>
                    <p className="text-gray-700">
                      Win weekly, round, and grand prizes based on your performance. The more weeks you compete,
                      the more chances you have to win!
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
          <div className="grid md:grid-cols-3 gap-6">
            <AnimatedSection animation="fade-up" delay={100}>
              <Link href="/fantasy-football/submit" className="block">
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow h-full text-center">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Submit Lineup</h3>
                  <p className="text-gray-600 text-sm">
                    Enter your team for the current round
                  </p>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <Link href="/fantasy-football/results" className="block">
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow h-full text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-bold text-xl-dark-blue mb-2">View Results</h3>
                  <p className="text-gray-600 text-sm">
                    Check weekly, round, and season standings
                  </p>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <Link href="/fantasy-football/rosters" className="block">
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow h-full text-center">
                  <div className="text-4xl mb-4">👥</div>
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

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Join the Competition?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Submit your lineup now and compete for over $1,000 in prizes!
            </p>
            <Link
              href="/fantasy-football/submit"
              className="inline-flex items-center bg-white text-xl-dark-blue px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-xl"
            >
              Submit Your Lineup
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
