'use client';

import { useState, useRef, useEffect } from 'react';
import { type Player } from '@/lib/supabase/client';

interface PlayerSelectProps {
  label: string;
  position: string;
  players: Player[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  canSelectPlayer: (playerId: string) => boolean;
  excludePlayerIds?: string[];
  onAddCustom: () => void;
}

export function PlayerSelect({
  label,
  position,
  players,
  value,
  onChange,
  error,
  canSelectPlayer,
  excludePlayerIds = [],
  onAddCustom,
}: PlayerSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedPlayer = players.find(p => p.id === value);

  // Filter players based on search and exclusions
  const filteredPlayers = players.filter(player => {
    if (excludePlayerIds.includes(player.id)) return false;
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      player.name.toLowerCase().includes(searchLower) ||
      player.team?.toLowerCase().includes(searchLower)
    );
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const handleSelect = (playerId: string) => {
    if (!canSelectPlayer(playerId)) {
      alert('You have already selected 2 elite players. Please deselect an elite player first.');
      return;
    }
    onChange(playerId);
    setOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>

      {/* Selected Player Display / Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full px-4 py-3 border rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between ${
          error ? 'border-red-500' : 'border-slate-300'
        } ${!selectedPlayer ? 'text-slate-400' : 'text-slate-900'}`}
      >
        {selectedPlayer ? (
          <div className="flex items-center">
            <span className="font-medium">{selectedPlayer.name}</span>
            {selectedPlayer.team && (
              <span className="ml-2 text-sm text-slate-500">({selectedPlayer.team})</span>
            )}
            {selectedPlayer.is_elite && (
              <svg className="w-4 h-4 ml-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
            {selectedPlayer.is_custom && (
              <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Custom</span>
            )}
          </div>
        ) : (
          <span>Select {position}...</span>
        )}
        <svg className={`w-5 h-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-slate-200">
            <input
              type="text"
              placeholder={`Search ${position}s...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Player List */}
          <div className="overflow-y-auto max-h-60">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map(player => {
                const isDisabled = !canSelectPlayer(player.id) && player.is_elite;
                return (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => handleSelect(player.id)}
                    disabled={isDisabled}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between ${
                      player.id === value ? 'bg-blue-50' : ''
                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{player.name}</span>
                      {player.team && (
                        <span className="ml-2 text-sm text-slate-500">({player.team})</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      {player.is_elite && (
                        <svg className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      )}
                      {player.is_custom && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Custom</span>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-slate-500">
                No players found
              </div>
            )}
          </div>

          {/* Add Custom Player */}
          <div className="border-t border-slate-200 p-3">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onAddCustom();
              }}
              className="w-full px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded hover:bg-purple-200 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Custom Player
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
