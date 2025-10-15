'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalLineups: 0,
    activeRound: null as any,
    recentSubmissions: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  async function loadDashboardStats() {
    try {
      setLoading(true);

      // Get total users
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get total lineups
      const { count: lineupCount } = await supabase
        .from('lineups')
        .select('*', { count: 'exact', head: true });

      // Get active round
      const { data: activeRound } = await supabase
        .from('rounds')
        .select('*')
        .eq('is_active', true)
        .single();

      // Get recent submissions
      const { data: recentLineups } = await supabase
        .from('lineups')
        .select(`
          id,
          submitted_at,
          user:users!inner(name, team_name)
        `)
        .order('submitted_at', { ascending: false })
        .limit(5);

      setStats({
        totalParticipants: userCount || 0,
        totalLineups: lineupCount || 0,
        activeRound,
        recentSubmissions: recentLineups || [],
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600 mt-1">Overview of your fantasy football league</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Participants</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{stats.totalParticipants}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Lineups</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{stats.totalLineups}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {stats.activeRound && (
                <>
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Active Round</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">Round {stats.activeRound.round_number}</p>
                        <p className="text-xs text-slate-500 mt-1">Weeks {stats.activeRound.start_week}-{stats.activeRound.end_week}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Ends On</p>
                        <p className="text-lg font-bold text-slate-800 mt-2">
                          {new Date(stats.activeRound.end_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(stats.activeRound.end_date).toLocaleDateString('en-US', {
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Recent Submissions */}
            <div className="bg-white rounded-xl shadow">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">Recent Submissions</h2>
              </div>
              <div className="p-6">
                {stats.recentSubmissions.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No submissions yet</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentSubmissions.map((submission: any) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-slate-800">{submission.user.team_name}</p>
                          <p className="text-sm text-slate-600">{submission.user.name}</p>
                        </div>
                        <p className="text-sm text-slate-500">
                          {new Date(submission.submitted_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <a
                href="/admin/players"
                className="block p-6 bg-white rounded-xl shadow hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Manage Players</h3>
                <p className="text-sm text-slate-600">Add, edit, or remove players from the league</p>
              </a>

              <a
                href="/admin/scoring"
                className="block p-6 bg-white rounded-xl shadow hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Enter Scores</h3>
                <p className="text-sm text-slate-600">Sync stats and calculate weekly scores</p>
              </a>

              <a
                href="/admin/emails"
                className="block p-6 bg-white rounded-xl shadow hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Send Emails</h3>
                <p className="text-sm text-slate-600">Notify participants about scores and updates</p>
              </a>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
