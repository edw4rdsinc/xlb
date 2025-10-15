'use client';

import { type Player } from '@/lib/supabase/client';

interface ConfirmationModalProps {
  open: boolean;
  formData: {
    name: string;
    email: string;
    phone: string;
    teamName: string;
    qb: string;
    rb1: string;
    rb2: string;
    wr1: string;
    wr2: string;
    te: string;
    k: string;
    def: string;
  };
  getSelectedPlayer: (playerId: string) => Player | undefined;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
}

export function ConfirmationModal({
  open,
  formData,
  getSelectedPlayer,
  onClose,
  onConfirm,
  submitting,
}: ConfirmationModalProps) {
  if (!open) return null;

  const positions = [
    { label: 'QB', value: formData.qb },
    { label: 'RB1', value: formData.rb1 },
    { label: 'RB2', value: formData.rb2 },
    { label: 'WR1', value: formData.wr1 },
    { label: 'WR2', value: formData.wr2 },
    { label: 'TE', value: formData.te },
    { label: 'K', value: formData.k },
    { label: 'DEF', value: formData.def },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 transition-opacity bg-slate-900 bg-opacity-75" onClick={submitting ? undefined : onClose}></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                Confirm Your Lineup
              </h3>
              {!submitting && (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <p className="text-sm text-slate-600 mb-6">
              Please review your lineup carefully. Once submitted, you cannot make changes for this round.
            </p>

            {/* Personal Info */}
            <div className="mb-6 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-800 mb-3">Team Information</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Name:</span>
                  <span className="ml-2 font-medium text-slate-900">{formData.name}</span>
                </div>
                <div>
                  <span className="text-slate-500">Team:</span>
                  <span className="ml-2 font-medium text-slate-900">{formData.teamName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Email:</span>
                  <span className="ml-2 font-medium text-slate-900">{formData.email}</span>
                </div>
                <div>
                  <span className="text-slate-500">Phone:</span>
                  <span className="ml-2 font-medium text-slate-900">{formData.phone}</span>
                </div>
              </div>
            </div>

            {/* Lineup */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Your Lineup</h4>
              <div className="space-y-2">
                {positions.map(pos => {
                  const player = getSelectedPlayer(pos.value);
                  return (
                    <div
                      key={pos.label}
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="w-12 font-bold text-slate-700">{pos.label}</span>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <span className="font-medium text-slate-900">{player?.name || 'Unknown Player'}</span>
                            {player?.team && (
                              <span className="ml-2 text-sm text-slate-500">({player.team})</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {player?.is_elite && (
                          <div className="flex items-center mr-2">
                            <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs font-medium text-yellow-700">Elite</span>
                          </div>
                        )}
                        {player?.is_custom && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                            Custom
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Warning */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-800">
                    <strong>Important:</strong> Your lineup cannot be changed after submission. Make sure all information is correct before confirming.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Confirm & Submit'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
