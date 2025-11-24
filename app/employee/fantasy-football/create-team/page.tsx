'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, UserPlus } from 'lucide-react'
import Link from 'next/link'

interface Round {
  id: string
  round_number: number
  start_week: number
  end_week: number
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
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadRounds()
  }, [])

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setCreating(true)

    try {
      // Validate
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

      // Create empty lineup for this user and round
      // Using correct column names with _id suffix
      const { data: newLineup, error: createLineupError } = await supabase
        .from('lineups')
        .insert({
          user_id: userId,
          round_id: formData.round_id,
          is_locked: false,
          qb_id: null,
          rb1_id: null,
          rb2_id: null,
          wr1_id: null,
          wr2_id: null,
          te_id: null,
          k_id: null,
          def_id: null,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (createLineupError) {
        console.error('Create lineup error:', createLineupError)
        throw new Error('Failed to create lineup: ' + createLineupError.message)
      }

      // Redirect to edit the new lineup
      router.push(`/employee/fantasy-football/edit-lineup/${newLineup.id}`)

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
                  <UserPlus className="w-4 h-4" />
                  Create Team & Edit Lineup
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
