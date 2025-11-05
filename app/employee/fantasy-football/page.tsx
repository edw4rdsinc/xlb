'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock, Unlock, RefreshCw, Users, CheckCircle2, XCircle, Pencil } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface Lineup {
  id: string
  user_id: string
  round_id: string
  is_locked: boolean
  submitted_at: string
  updated_at: string
  users: {
    team_name: string
    email: string
    name: string
  }
  rounds: {
    round_number: number
    start_week: number
    end_week: number
  }
}

interface LockStatus {
  total: number
  locked: number
  unlocked: number
  allLocked: boolean
}

export default function FantasyFootballAdminPage() {
  const [lineups, setLineups] = useState<Lineup[]>([])
  const [lockStatus, setLockStatus] = useState<LockStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    await Promise.all([
      loadLineups(),
      loadLockStatus()
    ])
    setLoading(false)
  }

  async function loadLineups() {
    try {
      const { data, error } = await supabase
        .from('lineups')
        .select(`
          *,
          users:user_id (team_name, email, name),
          rounds:round_id (round_number, start_week, end_week)
        `)
        .order('submitted_at', { ascending: false })

      if (error) throw error
      setLineups(data || [])
    } catch (error) {
      console.error('Error loading lineups:', error)
      alert('Failed to load lineups')
    }
  }

  async function loadLockStatus() {
    try {
      const response = await fetch('/api/admin/lock-all-lineups')
      if (response.ok) {
        const data = await response.json()
        setLockStatus(data)
      }
    } catch (error) {
      console.error('Error loading lock status:', error)
    }
  }

  async function lockAllLineups() {
    if (!confirm('Lock ALL lineups? Users will not be able to edit their submissions.')) {
      return
    }

    setActionLoading('lock-all')
    try {
      const response = await fetch('/api/admin/lock-all-lineups', {
        method: 'POST'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to lock lineups')
      }

      alert(`Success! Locked ${data.lockedCount} lineup(s).`)
      await loadData()
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  async function unlockAllLineups() {
    if (!confirm('Unlock ALL lineups? Users will be able to edit their submissions again.')) {
      return
    }

    setActionLoading('unlock-all')
    try {
      const { error } = await supabase
        .from('lineups')
        .update({ is_locked: false, updated_at: new Date().toISOString() })
        .eq('is_locked', true)

      if (error) throw error

      alert('Success! All lineups unlocked.')
      await loadData()
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  async function toggleLineupLock(lineup: Lineup) {
    const newLockState = !lineup.is_locked
    const action = newLockState ? 'Lock' : 'Unlock'

    if (!confirm(`${action} lineup for ${lineup.users.team_name}?`)) {
      return
    }

    setActionLoading(lineup.id)
    try {
      if (newLockState) {
        // Locking: use direct update (simpler for now)
        const { error } = await supabase
          .from('lineups')
          .update({ is_locked: true, updated_at: new Date().toISOString() })
          .eq('id', lineup.id)

        if (error) throw error
      } else {
        // Unlocking: use API route for proper permissions
        const response = await fetch(`/api/admin/lineups/${lineup.id}/unlock`, {
          method: 'POST'
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to unlock lineup')
        }
      }

      await loadData()
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-xl-bright-blue mb-4"></div>
          <p className="text-xl-grey">Loading lineups...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/employee/dashboard"
                className="text-xl-grey hover:text-xl-dark-blue transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-xl-dark-blue">
                  Fantasy Football Admin
                </h1>
                <p className="text-sm text-xl-grey mt-1">
                  Manage lineup locks and view submissions
                </p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 text-xl-grey hover:text-xl-dark-blue transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-xl-bright-blue" />
              <h3 className="font-semibold text-xl-dark-blue">Total Lineups</h3>
            </div>
            <p className="text-3xl font-bold text-xl-dark-blue">{lockStatus?.total || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-xl-dark-blue">Locked</h3>
            </div>
            <p className="text-3xl font-bold text-red-600">{lockStatus?.locked || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Unlock className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-xl-dark-blue">Unlocked</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{lockStatus?.unlocked || 0}</p>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-xl-dark-blue mb-4">Bulk Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={lockAllLineups}
              disabled={actionLoading === 'lock-all' || lockStatus?.allLocked}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {actionLoading === 'lock-all' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Lock All Lineups
            </button>

            <button
              onClick={unlockAllLineups}
              disabled={actionLoading === 'unlock-all' || lockStatus?.unlocked === lockStatus?.total}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {actionLoading === 'unlock-all' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
              Unlock All Lineups
            </button>
          </div>
          <p className="text-xs text-xl-grey mt-3">
            <strong>Lock All:</strong> Prevents all users from editing their lineups. Use when a round has started.
            <br />
            <strong>Unlock All:</strong> Allows all users to edit their lineups. Use when accepting late submissions.
          </p>
        </div>

        {/* Lineups Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-xl-dark-blue">All Lineups</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Round
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lineups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-xl-grey">
                      No lineups found
                    </td>
                  </tr>
                ) : (
                  lineups.map((lineup) => (
                    <tr key={lineup.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-xl-dark-blue">{lineup.users.team_name}</div>
                        <div className="text-sm text-xl-grey">{lineup.users.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-xl-grey">
                        {lineup.users.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-xl-grey">
                        Round {lineup.rounds.round_number} (Weeks {lineup.rounds.start_week}-{lineup.rounds.end_week})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-xl-grey">
                        {new Date(lineup.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lineup.is_locked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                            <Lock className="w-3 h-3" />
                            Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                            <Unlock className="w-3 h-3" />
                            Unlocked
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/employee/fantasy-football/edit-lineup/${lineup.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-xl-bright-blue hover:bg-xl-dark-blue text-white transition-colors"
                          >
                            <Pencil className="w-3 h-3" />
                            Edit
                          </Link>
                          <button
                            onClick={() => toggleLineupLock(lineup)}
                            disabled={actionLoading === lineup.id}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded ${
                              lineup.is_locked
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            } disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors`}
                          >
                            {actionLoading === lineup.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : lineup.is_locked ? (
                              <Unlock className="w-3 h-3" />
                            ) : (
                              <Lock className="w-3 h-3" />
                            )}
                            {lineup.is_locked ? 'Unlock' : 'Lock'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
