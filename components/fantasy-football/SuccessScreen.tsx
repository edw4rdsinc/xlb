'use client';

import { type Round, type Player } from '@/lib/supabase/client';

interface SuccessScreenProps {
  data: {
    name: string;
    email: string;
    teamName: string;
    lineupId: string;
    players: {
      qb?: Player;
      rb1?: Player;
      rb2?: Player;
      wr1?: Player;
      wr2?: Player;
      te?: Player;
      k?: Player;
      def?: Player;
    };
  };
  currentRound: Round;
  onNewSubmission: () => void;
}

export function SuccessScreen({ data, currentRound, onNewSubmission }: SuccessScreenProps) {
  const positions = [
    { label: 'QB', player: data.players.qb },
    { label: 'RB1', player: data.players.rb1 },
    { label: 'RB2', player: data.players.rb2 },
    { label: 'WR1', player: data.players.wr1 },
    { label: 'WR2', player: data.players.wr2 },
    { label: 'TE', player: data.players.te },
    { label: 'K', player: data.players.k },
    { label: 'DEF', player: data.players.def },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Lineup Submitted Successfully!
          </h1>
          <p className="text-lg text-slate-600">
            Good luck, <span className="font-semibold text-blue-600">{data.teamName}</span>!
          </p>
        </div>

        {/* Confirmation Details */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start mb-6 pb-6 border-b border-slate-200">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-1">Confirmation Email Sent</h3>
              <p className="text-slate-600">
                We've sent a confirmation email to <span className="font-medium text-slate-900">{data.email}</span> with your complete lineup details.
              </p>
            </div>
          </div>

          {/* Round Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Round {currentRound.round_number} Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-blue-700">Weeks:</span>
                <span className="ml-2 font-medium text-blue-900">{currentRound.start_week} - {currentRound.end_week}</span>
              </div>
              <div>
                <span className="text-blue-700">Dates:</span>
                <span className="ml-2 font-medium text-blue-900">
                  {new Date(currentRound.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(currentRound.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Lineup Summary */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3">Your Lineup</h4>
            <div className="space-y-2">
              {positions.map(pos => (
                <div
                  key={pos.label}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="w-12 font-bold text-slate-700">{pos.label}</span>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <span className="font-medium text-slate-900">{pos.player?.name || 'Unknown'}</span>
                        {pos.player?.team && (
                          <span className="ml-2 text-sm text-slate-500">({pos.player.team})</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {pos.player?.is_elite && (
                      <div className="flex items-center mr-2">
                        <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-medium text-yellow-700">Elite</span>
                      </div>
                    )}
                    {pos.player?.is_custom && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                        Custom
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lineup ID */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-700">Lineup ID:</span>{' '}
              <code className="ml-2 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800">
                {data.lineupId}
              </code>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Save this ID for your records. You can use it to reference your lineup with support.
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">What's Next?</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="font-bold text-blue-600">1</span>
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-slate-800">Track Your Progress</h4>
                <p className="text-sm text-slate-600">
                  Check the results page weekly to see how your lineup is performing and where you rank.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="font-bold text-blue-600">2</span>
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-slate-800">Weekly Prizes</h4>
                <p className="text-sm text-slate-600">
                  The highest scorer each week wins $25! Check your email for weekly updates.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="font-bold text-blue-600">3</span>
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-slate-800">Round Prizes</h4>
                <p className="text-sm text-slate-600">
                  At the end of the round, top performers win prizes ranging from $50 to $150!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/fantasy-football/results"
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            View Results
          </a>
          <a
            href="/fantasy-football/rosters"
            className="flex-1 px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors text-center"
          >
            View All Rosters
          </a>
          <a
            href="/fantasy-football"
            className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-center"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
