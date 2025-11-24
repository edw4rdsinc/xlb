'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, UserPlus, Save } from 'lucide-react'
import Link from 'next/link'
import { PlayerAutocomplete } from '@/components/employee/PlayerAutocomplete'

interface Round {
  id: string
  round_number: number
  start_week: number
  end_week: number
}

interface Player {
  id: string
  name: string
  position: string
  team?: string
  is_elite?: boolean
}

export default function CreateTeamPage() {
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [rounds, setRounds] = useState<Round[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    team_name: '',
    round_id: ''
  })
  const [lineup, setLineup] = useState({
    qb: '',
    rb1: '',
    rb2: '',
    wr1: '',
    wr2: '',
    te: '',
    k: '',
    def: ''
  })
  const [draftPool, setDraftPool] = useState<{ [key: string]: Player[] }>({})
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadRounds()
  }, [])

  useEffect(() => {
    if (formData.round_id) {
      loadDraftPool(formData.round_id)
    }
  }, [formData.round_id])

  async function loadRounds() {
    try {
      const { data, error } = await supabase
        .from('rounds')
        .select('id, round_number, start_week, end_week')
        .order('round_number', { ascending: true })

      if (error) throw error
      setRounds(data || [])

      // Select the first round by default if available
      if (data && data.length > 0) {
        setFormData(prev => ({ ...prev, round_id: data[0].id }))
      }
    } catch (err: any) {
      console.error('Error loading rounds:', err)
      setError('Failed to load rounds')
    } finally {
      setLoading(false)
    }
  }

  async function loadDraftPool(roundId: string) {
    try {
      // Try to load from draft_pools first
      const { data: draftPoolData, error: draftPoolError } = await supabase
        .from('draft_pools')
        .select(`
          player_id,
          position,
          players!inner(
            id,
            name,
            position,
            team,
            is_elite
          )
        `)
        .eq('round_id', roundId)

      let playersByPosition: { [key: string]: Player[] } = {}

      if (draftPoolData && draftPoolData.length > 0) {
        // Use draft pool data
        draftPoolData.forEach((item: any) => {
          const player = item.players as any
          if (!playersByPosition[player.position]) {
            playersByPosition[player.position] = []
          }
          playersByPosition[player.position].push(player)
        })
      } else {
        // Fallback to top 40 players per position
        const positions = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF']

        for (const position of positions) {
          const { data: players } = await supabase
            .from('players')
            .select('*')
            .eq('position', position)
            .order('name')
            .limit(40)

          if (players) {
            playersByPosition[position] = players
          }
        }
      }

      setDraftPool(playersByPosition)
    } catch (err: any) {
      console.error('Error loading draft pool:', err)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setCreating(true)

    try {
      // Validate personal info
      if (!formData.name.trim()) {
        throw new Error('Name is required')
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required')
      }
      if (!formData.team_name.trim()) {
        throw new Error('Team name is required')
      }
      if (!formData.round_id) {
        throw new Error('Please select a round')
      }

      // Validate all positions are filled
      const positions = ['qb', 'rb1', 'rb2', 'wr1', 'wr2', 'te', 'k', 'def']
      for (const pos of positions) {
        if (!lineup[pos as keyof typeof lineup]) {
          throw new Error(`Please select a player for ${pos.toUpperCase()}`)
        }
      }

      // Count elite players
      const selectedPlayerIds = Object.values(lineup)
      const { data: selectedPlayers } = await supabase
        .from('players')
        .select('id, is_elite')
        .in('id', selectedPlayerIds)

      const eliteCount = selectedPlayers?.filter((p: any) => p.is_elite).length || 0
      if (eliteCount > 2) {
        throw new Error('Maximum 2 elite players allowed per lineup')
      }

      // Check if user with this email already exists
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id, team_name')
        .eq('email', formData.email.trim().toLowerCase())
        .single()

      let userId: string

      if (existingUser) {
        // User exists, use their ID
        userId = existingUser.id

        // Check if they already have a lineup for this round
        const { data: existingLineup } = await supabase
          .from('lineups')
          .select('id')
          .eq('user_id', userId)
          .eq('round_id', formData.round_id)
          .single()

        if (existingLineup) {
          throw new Error(`User already has a lineup for this round. Edit it instead.`)
        }
      } else {
        // Create new user
        const { data: newUser, error: createUserError } = await supabase
          .from('users')
          .insert({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            team_name: formData.team_name.trim()
          })
          .select('id')
          .single()

        if (createUserError) {
          console.error('Create user error:', createUserError)
          throw new Error('Failed to create user: ' + createUserError.message)
        }

        userId = newUser.id
      }

      // Create lineup with all players filled in
      const { data: newLineup, error: createLineupError } = await supabase
        .from('lineups')
        .insert({
          user_id: userId,
          round_id: formData.round_id,
          is_locked: false,
          qb_id: lineup.qb,
          rb1_id: lineup.rb1,
          rb2_id: lineup.rb2,
          wr1_id: lineup.wr1,
          wr2_id: lineup.wr2,
          te_id: lineup.te,
          k_id: lineup.k,
          def_id: lineup.def,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (createLineupError) {
        console.error('Create lineup error:', createLineupError)
        throw new Error('Failed to create lineup: ' + createLineupError.message)
      }

      // Redirect back to admin page (lineup is already complete)
      router.push('/employee/fantasy-football')

    } catch (err: any) {
      console.error('Error creating team:', err)
      setError(err.message || 'Failed to create team')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-xl-bright-blue mb-4"></div>
          <p className="text-xl-grey">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/employee/fantasy-football"
              className="text-xl-grey hover:text-xl-dark-blue transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-xl-dark-blue">
                Create New Team
              </h1>
              <p className="text-sm text-xl-grey mt-1">
                Add a new team and create their lineup
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* User Info */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-xl-dark-blue mb-4">User Information</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  If email exists, lineup will be added to existing user
                </p>
              </div>
            </div>
          </div>

          {/* Team Info */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-xl-dark-blue mb-4">Team Information</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={formData.team_name}
                  onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                  placeholder="The Thunderbolts"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Round *
                </label>
                <select
                  value={formData.round_id}
                  onChange={(e) => setFormData({ ...formData, round_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none bg-white"
                  required
                >
                  <option value="">Select a round</option>
                  {rounds.map((round) => (
                    <option key={round.id} value={round.id}>
                      Round {round.round_number} (Weeks {round.start_week}-{round.end_week})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Player Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-xl-dark-blue mb-4">Lineup Selection</h2>
            <div className="grid md:grid-cols-2 gap-4">

              {/* QB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quarterback (QB) *
                </label>
                <PlayerAutocomplete
                  position="QB"
                  players={draftPool['QB'] || []}
                  value={lineup.qb}
                  onChange={(playerId) => setLineup({ ...lineup, qb: playerId })}
                  placeholder="Select QB"
                  showTeamInput={false}
                />
              </div>

              {/* RB1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Running Back 1 (RB1) *
                </label>
                <PlayerAutocomplete
                  position="RB"
                  players={draftPool['RB'] || []}
                  value={lineup.rb1}
                  onChange={(playerId) => setLineup({ ...lineup, rb1: playerId })}
                  placeholder="Select RB1"
                  showTeamInput={false}
                />
              </div>

              {/* RB2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Running Back 2 (RB2) *
                </label>
                <PlayerAutocomplete
                  position="RB"
                  players={draftPool['RB'] || []}
                  value={lineup.rb2}
                  onChange={(playerId) => setLineup({ ...lineup, rb2: playerId })}
                  placeholder="Select RB2"
                  showTeamInput={false}
                />
              </div>

              {/* WR1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wide Receiver 1 (WR1) *
                </label>
                <PlayerAutocomplete
                  position="WR"
                  players={draftPool['WR'] || []}
                  value={lineup.wr1}
                  onChange={(playerId) => setLineup({ ...lineup, wr1: playerId })}
                  placeholder="Select WR1"
                  showTeamInput={false}
                />
              </div>

              {/* WR2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wide Receiver 2 (WR2) *
                </label>
                <PlayerAutocomplete
                  position="WR"
                  players={draftPool['WR'] || []}
                  value={lineup.wr2}
                  onChange={(playerId) => setLineup({ ...lineup, wr2: playerId })}
                  placeholder="Select WR2"
                  showTeamInput={false}
                />
              </div>

              {/* TE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tight End (TE) *
                </label>
                <PlayerAutocomplete
                  position="TE"
                  players={draftPool['TE'] || []}
                  value={lineup.te}
                  onChange={(playerId) => setLineup({ ...lineup, te: playerId })}
                  placeholder="Select TE"
                  showTeamInput={false}
                />
              </div>

              {/* K */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kicker (K) *
                </label>
                <PlayerAutocomplete
                  position="K"
                  players={draftPool['K'] || []}
                  value={lineup.k}
                  onChange={(playerId) => setLineup({ ...lineup, k: playerId })}
                  placeholder="Select K"
                  showTeamInput={false}
                />
              </div>

              {/* DEF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Defense (DEF) *
                </label>
                <PlayerAutocomplete
                  position="DEF"
                  players={draftPool['DEF'] || []}
                  value={lineup.def}
                  onChange={(playerId) => setLineup({ ...lineup, def: playerId })}
                  placeholder="Select DEF"
                  showTeamInput={false}
                />
              </div>
            </div>

            {/* Elite Player Counter */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Elite Players Selected: {
                  Object.values(lineup).filter(playerId => {
                    if (!playerId) return false
                    const allPlayers = Object.values(draftPool).flat()
                    const player = allPlayers.find(p => p.id === playerId)
                    return player?.is_elite
                  }).length
                } / 2
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Link
              href="/employee/fantasy-football"
              className="px-6 py-3 text-xl-grey hover:text-xl-dark-blue transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={creating}
              className="flex items-center gap-2 px-8 py-3 bg-xl-bright-blue text-white font-semibold rounded-lg hover:bg-xl-dark-blue disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Complete Lineup
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
