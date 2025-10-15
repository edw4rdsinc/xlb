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

export function SuccessScreen({ data, currentRound }: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-slate-800 mb-3">
          Lineup Submitted!
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Good luck this round, <span className="font-semibold text-blue-600">{data.teamName}</span>!
        </p>

        {/* Quick Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-900 mb-1">
            <strong>Round {currentRound.round_number}</strong> • Weeks {currentRound.start_week}-{currentRound.end_week}
          </p>
          <p className="text-xs text-blue-700">
            We'll send updates to <strong>{data.email}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href="/fantasy-football/results"
            className="block w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Results
          </a>
          <a
            href="/fantasy-football/rosters"
            className="block w-full px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
          >
            View All Rosters
          </a>
          <a
            href="/fantasy-football"
            className="block w-full px-6 py-3 text-slate-600 font-medium hover:text-slate-800 transition-colors"
          >
            Back to Home
          </a>
        </div>

        {/* Help Text */}
        <p className="text-xs text-slate-500 mt-8">
          Need to make a change? Email us at <a href="mailto:jlandziak@xlbenefits.com" className="text-blue-600 hover:underline">jlandziak@xlbenefits.com</a>
        </p>
      </div>
    </div>
  );
}
