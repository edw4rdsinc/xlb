'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  rank: number;
  totalPoints: number;
  isElite: boolean;
}

interface SearchablePlayerDropdownProps {
  players: Player[];
  value: string;
  onChange: (playerId: string) => void;
  position: string;
  canSelectPlayer: (playerId: string) => boolean;
}

export default function SearchablePlayerDropdown({
  players,
  value,
  onChange,
  position,
  canSelectPlayer
}: SearchablePlayerDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter players based on search
  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(search.toLowerCase()) ||
    player.team.toLowerCase().includes(search.toLowerCase())
  );

  const selectedPlayer = players.find(p => p.id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Value Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent bg-white text-left flex items-center justify-between"
      >
        <span className={value ? 'text-slate-900' : 'text-slate-500'}>
          {selectedPlayer
            ? `${selectedPlayer.name} (${selectedPlayer.team}) ${selectedPlayer.isElite ? '⭐' : ''}`
            : `Select ${position.toUpperCase()}`}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search players..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Player List */}
          <div className="max-h-72 overflow-y-auto">
            {/* Clear Selection Option */}
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
                setSearch('');
              }}
              className="w-full px-4 py-2 text-left hover:bg-slate-50 text-sm border-b border-slate-100"
            >
              <span className="text-slate-500">Clear Selection</span>
            </button>

            {filteredPlayers.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-500 text-sm">
                No players found
              </div>
            ) : (
              filteredPlayers.map(player => {
                const canSelect = canSelectPlayer(player.id);
                const isSelected = player.id === value;

                return (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => {
                      if (canSelect) {
                        onChange(player.id);
                        setIsOpen(false);
                        setSearch('');
                      }
                    }}
                    disabled={!canSelect}
                    className={`w-full px-4 py-2 text-left text-sm border-b border-slate-100 transition-colors ${
                      isSelected
                        ? 'bg-xl-bright-blue text-white'
                        : canSelect
                        ? 'hover:bg-slate-50'
                        : 'opacity-50 cursor-not-allowed bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">
                          {player.name}
                        </span>
                        <span className={`ml-2 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                          ({player.team})
                        </span>
                      </div>
                      {player.isElite && (
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          ELITE
                        </span>
                      )}
                    </div>
                    {!canSelect && !isSelected && (
                      <div className="text-xs text-red-600 mt-1">
                        Cannot select - Elite player limit reached
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Player Count */}
          <div className="px-4 py-2 bg-slate-50 text-xs text-slate-600 border-t border-slate-200">
            Showing {filteredPlayers.length} of {players.length} players
          </div>
        </div>
      )}
    </div>
  );
}