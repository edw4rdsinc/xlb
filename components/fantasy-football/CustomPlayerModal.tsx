'use client';

import { useState } from 'react';
import { type Player } from '@/lib/supabase/client';

type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';

interface CustomPlayerModalProps {
  open: boolean;
  position: Position;
  onClose: () => void;
  onSubmit: (player: Player) => void;
}

export function CustomPlayerModal({ open, position, onClose, onSubmit }: CustomPlayerModalProps) {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [isElite, setIsElite] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Player name is required');
      return;
    }

    const customPlayer: Player = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      position,
      team: team.trim() || undefined,
      is_elite: isElite,
      is_custom: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSubmit(customPlayer);

    // Reset form
    setName('');
    setTeam('');
    setIsElite(false);
  };

  const handleClose = () => {
    setName('');
    setTeam('');
    setIsElite(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 transition-opacity bg-slate-900 bg-opacity-75" onClick={handleClose}></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Add Custom {position}
                </h3>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-4">
              <p className="text-sm text-slate-600">
                Can't find the player you're looking for? Add a custom player to your lineup. This is useful for rookies or players not yet in our database.
              </p>

              {/* Player Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Player Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={`e.g., ${position === 'QB' ? 'Patrick Mahomes' : position === 'RB' ? 'Christian McCaffrey' : position === 'WR' ? 'Tyreek Hill' : position === 'TE' ? 'Travis Kelce' : position === 'K' ? 'Justin Tucker' : 'San Francisco 49ers'}`}
                  autoFocus
                />
              </div>

              {/* Team */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Team (Optional)
                </label>
                <input
                  type="text"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., KC, SF, DAL"
                />
              </div>

              {/* Elite Player Toggle */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="is-elite"
                    type="checkbox"
                    checked={isElite}
                    onChange={(e) => setIsElite(e.target.checked)}
                    className="w-4 h-4 text-yellow-600 border-slate-300 rounded focus:ring-yellow-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="is-elite" className="font-medium text-slate-700 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Mark as Elite Player
                  </label>
                  <p className="text-slate-500">Elite players count toward your 2-player limit</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Player
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
