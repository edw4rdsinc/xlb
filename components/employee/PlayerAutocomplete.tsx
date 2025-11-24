'use client'

import { useState, useEffect, useRef } from 'react'

interface Player {
  id: string
  name: string
  team: string
  position: string
  is_elite: boolean
}

interface PlayerAutocompleteProps {
  value: string
  onChange: (name: string, team: string) => void
  position?: string // Optional: filter by position (QB, RB, WR, TE, K, DEF)
  placeholder?: string
  className?: string
  teamValue?: string
  onTeamChange?: (team: string) => void
  showTeamInput?: boolean
  // For ID-based selection (used by edit-lineup)
  onSelectPlayer?: (player: Player) => void
  canSelectPlayer?: (player: Player) => boolean
}

export function PlayerAutocomplete({
  value,
  onChange,
  position,
  placeholder = 'Player Name',
  className = '',
  teamValue = '',
  onTeamChange,
  showTeamInput = true,
  onSelectPlayer,
  canSelectPlayer
}: PlayerAutocompleteProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<Player[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>(undefined)

  // Sync external value changes
  useEffect(() => {
    console.log('PlayerAutocomplete: syncing query with value prop', { value, currentQuery: query })
    setQuery(value)
  }, [value])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch suggestions with debounce
  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const params = new URLSearchParams({ q: searchQuery })
      if (position) {
        params.append('position', position)
      }

      const res = await fetch(`/api/employee/search-players?${params}`)
      if (res.ok) {
        const data = await res.json()
        setSuggestions(data.players || [])
        setIsOpen(data.players?.length > 0)
        setSelectedIndex(-1)
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)
    onChange(newValue, teamValue)

    // Debounce the API call
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(newValue)
    }, 200)
  }

  const handleSelect = (player: Player) => {
    // Check if selection is allowed (for elite player limits)
    if (canSelectPlayer && !canSelectPlayer(player)) {
      return
    }

    console.log('PlayerAutocomplete: handleSelect called with', player.name)

    // Update internal state FIRST
    setQuery(player.name)

    // Close dropdown and clear suggestions
    setIsOpen(false)
    setSuggestions([])

    // Call the appropriate callback AFTER updating internal state
    if (onSelectPlayer) {
      console.log('PlayerAutocomplete: calling onSelectPlayer')
      onSelectPlayer(player)
      // Don't call onChange when using onSelectPlayer to avoid conflicts
    } else {
      // Only call onChange if onSelectPlayer is not provided
      onChange(player.name, player.team)
      if (onTeamChange) {
        onTeamChange(player.team)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  return (
    <div ref={wrapperRef} className={`relative flex gap-2 ${className}`}>
      {/* Player Name Input */}
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true)
          }}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
          autoComplete="off"
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-xl-bright-blue rounded-full animate-spin" />
          </div>
        )}

        {/* Suggestions Dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {suggestions.map((player, index) => {
              const canSelect = !canSelectPlayer || canSelectPlayer(player)
              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => handleSelect(player)}
                  disabled={!canSelect}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between ${
                    index === selectedIndex ? 'bg-blue-50' : ''
                  } ${canSelect ? 'hover:bg-blue-50' : 'opacity-50 cursor-not-allowed bg-gray-50'}`}
                >
                  <div>
                    <span className="font-medium text-gray-900">{player.name}</span>
                    {!canSelect && (
                      <div className="text-xs text-red-600">Elite limit reached</div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded">{player.team}</span>
                    {player.is_elite && (
                      <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-xs">Elite</span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Team Input */}
      {showTeamInput && (
        <input
          type="text"
          value={teamValue}
          onChange={(e) => onTeamChange?.(e.target.value)}
          placeholder="Team"
          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
        />
      )}
    </div>
  )
}
