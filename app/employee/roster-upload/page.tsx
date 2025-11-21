'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Users,
  Check,
  X,
  AlertTriangle,
  ArrowRight
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface Team {
  id: string
  name: string
  company_name: string | null
  member_count: number
}

interface ParsedRecord {
  row_index: number
  participant_name?: string
  team_name?: string
  email?: string
  phone?: string
  submit_by?: string
  lineup?: {
    quarterback?: { player_name: string; team: string; is_elite: boolean }
    running_backs?: Array<{ player_name: string; team: string; is_elite: boolean }>
    wide_receivers?: Array<{ player_name: string; team: string; is_elite: boolean }>
    tight_end?: { player_name: string; team: string; is_elite: boolean }
    defense?: string
    kicker?: string
  }
  raw_data: Record<string, any>
}

interface FuzzyMatch {
  id: string
  parsed_record: ParsedRecord
  parsed_name: string
  existing_member_id: string
  existing_name: string
  match_score: number
  match_reason: string
  status: 'pending' | 'approved' | 'rejected' | 'skipped'
  action: 'update' | 'create_new' | 'skip' | null
}

type Step = 'upload' | 'parsing' | 'preview' | 'matching' | 'approval' | 'importing' | 'complete'

export default function RosterUploadPage() {
  // Step tracking
  const [currentStep, setCurrentStep] = useState<Step>('upload')

  // Upload state
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [teamId, setTeamId] = useState<string>('')
  const [newTeamName, setNewTeamName] = useState('')
  const [teams, setTeams] = useState<Team[]>([])

  // Job state
  const [jobId, setJobId] = useState<string | null>(null)
  const [progress, setProgress] = useState({ step: '', percent: 0 })

  // Parsed data
  const [parsedRecords, setParsedRecords] = useState<ParsedRecord[]>([])
  const [totalRecords, setTotalRecords] = useState(0)

  // Editable lineup state
  const [editableLineup, setEditableLineup] = useState<ParsedRecord | null>(null)

  // Matching state
  const [fuzzyMatches, setFuzzyMatches] = useState<FuzzyMatch[]>([])
  const [exactMatches, setExactMatches] = useState(0)
  const [newRecords, setNewRecords] = useState(0)

  // Import results
  const [importResults, setImportResults] = useState({
    imported: 0,
    updated: 0,
    skipped: 0
  })

  // UI state
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Player options for dropdowns
  const [defenseOptions, setDefenseOptions] = useState<Array<{ id: string; name: string; team: string }>>([])
  const [kickerOptions, setKickerOptions] = useState<Array<{ id: string; name: string; team: string }>>([])

  // Load teams on mount
  useEffect(() => {
    loadTeams()
  }, [])

  // Load player options when entering approval step
  useEffect(() => {
    if (currentStep === 'approval') {
      loadPlayerOptions()
    }
  }, [currentStep])

  const loadPlayerOptions = async () => {
    try {
      // Fetch defenses
      const defRes = await fetch('/api/employee/get-players-by-position?position=DEF')
      if (defRes.ok) {
        const defData = await defRes.json()
        setDefenseOptions(defData.players || [])
      }

      // Fetch kickers
      const kRes = await fetch('/api/employee/get-players-by-position?position=K')
      if (kRes.ok) {
        const kData = await kRes.json()
        setKickerOptions(kData.players || [])
      }
    } catch (err) {
      console.error('Error loading player options:', err)
    }
  }

  // Poll for job status when processing
  useEffect(() => {
    if (!jobId || currentStep === 'complete' || currentStep === 'upload') return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/employee/roster-job-status?jobId=${jobId}`)
        if (!res.ok) return

        const data = await res.json()

        setProgress(data.progress || { step: '', percent: 0 })

        if (data.status === 'awaiting_approval') {
          // Only set these once when first entering approval state
          if (currentStep !== 'approval') {
            setCurrentStep('approval')
            setFuzzyMatches(data.fuzzy_matches_data || [])
            setExactMatches(data.exact_matches || 0)
            setNewRecords(data.new_records || 0)
            setParsedRecords(data.parsed_records || [])
            setTotalRecords(data.total_records || 0)
            // Set the first parsed record as editable lineup (only once!)
            if (data.parsed_records && data.parsed_records.length > 0) {
              setEditableLineup(data.parsed_records[0])
            } else {
              // Create empty editable lineup if parsing failed
              setEditableLineup({
                row_index: 0,
                participant_name: '',
                team_name: '',
                email: '',
                phone: '',
                lineup: {
                  quarterback: { player_name: '', team: '', is_elite: false },
                  running_backs: [
                    { player_name: '', team: '', is_elite: false },
                    { player_name: '', team: '', is_elite: false }
                  ],
                  wide_receivers: [
                    { player_name: '', team: '', is_elite: false },
                    { player_name: '', team: '', is_elite: false }
                  ],
                  tight_end: { player_name: '', team: '', is_elite: false },
                  defense: '',
                  kicker: ''
                },
                raw_data: {}
              })
            }
            // Load player options immediately
            loadPlayerOptions()
          }
        } else if (data.status === 'complete') {
          setCurrentStep('complete')
          setImportResults({
            imported: data.imported_count || 0,
            updated: data.updated_count || 0,
            skipped: data.skipped_count || 0
          })
        } else if (data.status === 'error') {
          setError(data.error_message || 'An error occurred')
          setIsProcessing(false)
        }
      } catch (err) {
        console.error('Error polling job status:', err)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [jobId, currentStep])

  const loadTeams = async () => {
    if (!supabase) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('roster_teams')
      .select('*')
      .eq('created_by', user.id)
      .order('name')

    if (data) {
      setTeams(data)
    }
  }

  const handleSubmit = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF file')
      return
    }
    if (!teamId && !newTeamName.trim()) {
      setError('Please select a team or enter a new team name')
      return
    }

    setIsProcessing(true)
    setError(null)
    setCurrentStep('parsing')

    try {
      // Step 1: Upload PDF to Wasabi
      const formData = new FormData()
      formData.append('file', pdfFile)

      const uploadRes = await fetch('/api/employee/upload-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const uploadData = await uploadRes.json()

      // Step 2: Create roster upload job
      let userId = null
      let userEmail = null

      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          userId = user.id
          userEmail = user.email
        }
      }

      const jobData = {
        user_id: userId,
        user_email: userEmail,
        team_id: teamId || null,
        team_name: newTeamName.trim() || null,
        pdf_url: uploadData.fileUrl,
        pdf_filename: uploadData.fileName,
        file_size: pdfFile.size,
      }

      const jobRes = await fetch('/api/employee/create-roster-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      })

      if (!jobRes.ok) {
        const errorData = await jobRes.json()
        throw new Error(errorData.error || 'Failed to create job')
      }

      const { job } = await jobRes.json()
      setJobId(job.id)
      setCurrentStep('matching')

    } catch (err: any) {
      setError(err.message || 'Failed to process roster')
      setIsProcessing(false)
      setCurrentStep('upload')
    }
  }

  const handleMatchDecision = async (matchId: string, action: 'update' | 'create_new' | 'skip') => {
    setFuzzyMatches(prev => prev.map(m =>
      m.id === matchId
        ? { ...m, status: action === 'update' ? 'approved' : action === 'skip' ? 'skipped' : 'rejected', action }
        : m
    ))
  }

  const handleFinalizeImport = async () => {
    if (!jobId || !editableLineup) return

    setIsProcessing(true)
    setCurrentStep('importing')

    try {
      const res = await fetch('/api/employee/finalize-roster-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId,
          lineup_data: editableLineup
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Import failed')
      }

      // Job status polling will handle the transition to complete
    } catch (err: any) {
      setError(err.message || 'Failed to import roster')
      setIsProcessing(false)
    }
  }

  const allMatchesDecided = fuzzyMatches.every(m => m.action !== null)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/employee/dashboard" className="inline-flex items-center gap-2 text-xl-grey hover:text-xl-dark-blue transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-xl-dark-blue mt-2">
            Fantasy Football Roster Upload
          </h1>
          <p className="text-sm text-xl-grey mt-1">
            Upload PDF fantasy football lineups with AI-powered extraction and review
          </p>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          {['upload', 'parsing', 'matching', 'approval', 'importing', 'complete'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === step
                  ? 'bg-xl-bright-blue text-white'
                  : ['upload', 'parsing', 'matching', 'approval', 'importing', 'complete'].indexOf(currentStep) > index
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {['upload', 'parsing', 'matching', 'approval', 'importing', 'complete'].indexOf(currentStep) > index
                  ? <Check className="w-4 h-4" />
                  : index + 1
                }
              </div>
              {index < 5 && (
                <div className={`w-12 md:w-24 h-1 mx-2 ${
                  ['upload', 'parsing', 'matching', 'approval', 'importing', 'complete'].indexOf(currentStep) > index
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Step: Upload */}
          {currentStep === 'upload' && (
            <>
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-xl-dark-blue mb-4">
                  1. Upload Fantasy Football Lineup PDF
                </h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-xl-bright-blue transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-xl-dark-blue mb-2">
                      {pdfFile ? pdfFile.name : 'Click to upload lineup PDF'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Upload your fantasy football lineup submission form
                    </p>
                  </label>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-xl-dark-blue mb-4">
                  2. Team Information (Optional)
                </h2>

                {teams.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-xl-dark-blue mb-2">
                      Existing Team
                    </label>
                    <select
                      value={teamId}
                      onChange={(e) => {
                        setTeamId(e.target.value)
                        if (e.target.value) setNewTeamName('')
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    >
                      <option value="">Create new team...</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name} ({team.member_count} members)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {!teamId && (
                  <div>
                    <label className="block text-sm font-medium text-xl-dark-blue mb-2">
                      New Team Name
                    </label>
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="ABC Manufacturing"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!pdfFile}
                className="w-full bg-xl-bright-blue hover:bg-xl-dark-blue text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Process Fantasy Lineup
              </button>
            </>
          )}

          {/* Step: Parsing/Matching (Processing) */}
          {(currentStep === 'parsing' || currentStep === 'matching') && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 text-xl-bright-blue animate-spin mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-xl-dark-blue mb-2">
                {currentStep === 'parsing' ? 'Extracting Data from PDF...' : 'Finding Matches...'}
              </h2>
              <p className="text-gray-600 mb-4">
                {progress.step || 'Processing your roster'}
              </p>
              <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
                <div
                  className="bg-xl-bright-blue h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Step: Approval - Fantasy Football Lineup Review */}
          {currentStep === 'approval' && editableLineup && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-xl-dark-blue mb-2">
                  Review Fantasy Football Lineup
                </h2>
                <p className="text-sm text-gray-600">
                  Please verify the extracted lineup below. Pay special attention to Defense and Kicker fields which are write-ins and may need correction.
                </p>
              </div>

              {/* Participant Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Participant Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={editableLineup.participant_name || ''}
                      onChange={(e) => setEditableLineup({ ...editableLineup, participant_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Team Name</label>
                    <input
                      type="text"
                      value={editableLineup.team_name || ''}
                      onChange={(e) => setEditableLineup({ ...editableLineup, team_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={editableLineup.email || ''}
                      onChange={(e) => setEditableLineup({ ...editableLineup, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                    <input
                      type="text"
                      value={editableLineup.phone || ''}
                      onChange={(e) => setEditableLineup({ ...editableLineup, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Lineup Positions */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Lineup Positions</h3>
                <div className="space-y-3">
                  {/* Quarterback */}
                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <span className="text-xs font-bold text-gray-500 w-12">QB</span>
                    <input
                      type="text"
                      value={editableLineup.lineup?.quarterback?.player_name || ''}
                      onChange={(e) => setEditableLineup({
                        ...editableLineup,
                        lineup: {
                          ...editableLineup.lineup,
                          quarterback: {
                            ...editableLineup.lineup?.quarterback,
                            player_name: e.target.value,
                            team: editableLineup.lineup?.quarterback?.team || '',
                            is_elite: editableLineup.lineup?.quarterback?.is_elite || false
                          }
                        }
                      })}
                      placeholder="Player Name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                    <input
                      type="text"
                      value={editableLineup.lineup?.quarterback?.team || ''}
                      onChange={(e) => setEditableLineup({
                        ...editableLineup,
                        lineup: {
                          ...editableLineup.lineup,
                          quarterback: {
                            ...editableLineup.lineup?.quarterback,
                            player_name: editableLineup.lineup?.quarterback?.player_name || '',
                            team: e.target.value,
                            is_elite: editableLineup.lineup?.quarterback?.is_elite || false
                          }
                        }
                      })}
                      placeholder="Team"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Running Back 1 */}
                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <span className="text-xs font-bold text-gray-500 w-12">RB1</span>
                    <input
                      type="text"
                      value={editableLineup.lineup?.running_backs?.[0]?.player_name || ''}
                      onChange={(e) => {
                        const rbs = editableLineup.lineup?.running_backs || []
                        const newRbs = [...rbs]
                        newRbs[0] = { ...newRbs[0], player_name: e.target.value, team: newRbs[0]?.team || '', is_elite: newRbs[0]?.is_elite || false }
                        setEditableLineup({ ...editableLineup, lineup: { ...editableLineup.lineup, running_backs: newRbs } })
                      }}
                      placeholder="Player Name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                    <input
                      type="text"
                      value={editableLineup.lineup?.running_backs?.[0]?.team || ''}
                      onChange={(e) => {
                        const rbs = editableLineup.lineup?.running_backs || []
                        const newRbs = [...rbs]
                        newRbs[0] = { ...newRbs[0], player_name: newRbs[0]?.player_name || '', team: e.target.value, is_elite: newRbs[0]?.is_elite || false }
                        setEditableLineup({ ...editableLineup, lineup: { ...editableLineup.lineup, running_backs: newRbs } })
                      }}
                      placeholder="Team"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Running Back 2 */}
                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <span className="text-xs font-bold text-gray-500 w-12">RB2</span>
                    <input
                      type="text"
                      value={editableLineup.lineup?.running_backs?.[1]?.player_name || ''}
                      onChange={(e) => {
                        const rbs = editableLineup.lineup?.running_backs || []
                        const newRbs = [...rbs]
                        newRbs[1] = { ...newRbs[1], player_name: e.target.value, team: newRbs[1]?.team || '', is_elite: newRbs[1]?.is_elite || false }
                        setEditableLineup({ ...editableLineup, lineup: { ...editableLineup.lineup, running_backs: newRbs } })
                      }}
                      placeholder="Player Name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                    <input
                      type="text"
                      value={editableLineup.lineup?.running_backs?.[1]?.team || ''}
                      onChange={(e) => {
                        const rbs = editableLineup.lineup?.running_backs || []
                        const newRbs = [...rbs]
                        newRbs[1] = { ...newRbs[1], player_name: newRbs[1]?.player_name || '', team: e.target.value, is_elite: newRbs[1]?.is_elite || false }
                        setEditableLineup({ ...editableLineup, lineup: { ...editableLineup.lineup, running_backs: newRbs } })
                      }}
                      placeholder="Team"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Wide Receiver 1 */}
                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <span className="text-xs font-bold text-gray-500 w-12">WR1</span>
                    <input
                      type="text"
                      value={editableLineup.lineup?.wide_receivers?.[0]?.player_name || ''}
                      onChange={(e) => {
                        const wrs = editableLineup.lineup?.wide_receivers || []
                        const newWrs = [...wrs]
                        newWrs[0] = { ...newWrs[0], player_name: e.target.value, team: newWrs[0]?.team || '', is_elite: newWrs[0]?.is_elite || false }
                        setEditableLineup({ ...editableLineup, lineup: { ...editableLineup.lineup, wide_receivers: newWrs } })
                      }}
                      placeholder="Player Name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                    <input
                      type="text"
                      value={editableLineup.lineup?.wide_receivers?.[0]?.team || ''}
                      onChange={(e) => {
                        const wrs = editableLineup.lineup?.wide_receivers || []
                        const newWrs = [...wrs]
                        newWrs[0] = { ...newWrs[0], player_name: newWrs[0]?.player_name || '', team: e.target.value, is_elite: newWrs[0]?.is_elite || false }
                        setEditableLineup({ ...editableLineup, lineup: { ...editableLineup.lineup, wide_receivers: newWrs } })
                      }}
                      placeholder="Team"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Wide Receiver 2 */}
                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <span className="text-xs font-bold text-gray-500 w-12">WR2</span>
                    <input
                      type="text"
                      value={editableLineup.lineup?.wide_receivers?.[1]?.player_name || ''}
                      onChange={(e) => {
                        const wrs = editableLineup.lineup?.wide_receivers || []
                        const newWrs = [...wrs]
                        newWrs[1] = { ...newWrs[1], player_name: e.target.value, team: newWrs[1]?.team || '', is_elite: newWrs[1]?.is_elite || false }
                        setEditableLineup({ ...editableLineup, lineup: { ...editableLineup.lineup, wide_receivers: newWrs } })
                      }}
                      placeholder="Player Name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                    <input
                      type="text"
                      value={editableLineup.lineup?.wide_receivers?.[1]?.team || ''}
                      onChange={(e) => {
                        const wrs = editableLineup.lineup?.wide_receivers || []
                        const newWrs = [...wrs]
                        newWrs[1] = { ...newWrs[1], player_name: newWrs[1]?.player_name || '', team: e.target.value, is_elite: newWrs[1]?.is_elite || false }
                        setEditableLineup({ ...editableLineup, lineup: { ...editableLineup.lineup, wide_receivers: newWrs } })
                      }}
                      placeholder="Team"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Tight End */}
                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <span className="text-xs font-bold text-gray-500 w-12">TE</span>
                    <input
                      type="text"
                      value={editableLineup.lineup?.tight_end?.player_name || ''}
                      onChange={(e) => setEditableLineup({
                        ...editableLineup,
                        lineup: {
                          ...editableLineup.lineup,
                          tight_end: {
                            ...editableLineup.lineup?.tight_end,
                            player_name: e.target.value,
                            team: editableLineup.lineup?.tight_end?.team || '',
                            is_elite: editableLineup.lineup?.tight_end?.is_elite || false
                          }
                        }
                      })}
                      placeholder="Player Name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                    <input
                      type="text"
                      value={editableLineup.lineup?.tight_end?.team || ''}
                      onChange={(e) => setEditableLineup({
                        ...editableLineup,
                        lineup: {
                          ...editableLineup.lineup,
                          tight_end: {
                            ...editableLineup.lineup?.tight_end,
                            player_name: editableLineup.lineup?.tight_end?.player_name || '',
                            team: e.target.value,
                            is_elite: editableLineup.lineup?.tight_end?.is_elite || false
                          }
                        }
                      })}
                      placeholder="Team"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Defense - Dropdown from database */}
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                    <span className="text-xs font-bold text-gray-500 w-12">DEF</span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">
                        Detected: <span className="font-medium text-gray-700">{editableLineup.lineup?.defense || 'None'}</span>
                      </p>
                      <select
                        value={editableLineup.lineup?.defense || ''}
                        onChange={(e) => setEditableLineup({
                          ...editableLineup,
                          lineup: {
                            ...editableLineup.lineup,
                            defense: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-blue-400 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none bg-white"
                      >
                        <option value="">-- Select Defense --</option>
                        {defenseOptions.map((player) => (
                          <option key={player.id} value={player.name}>
                            {player.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Kicker - Dropdown from database */}
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                    <span className="text-xs font-bold text-gray-500 w-12">K</span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">
                        Detected: <span className="font-medium text-gray-700">{editableLineup.lineup?.kicker || 'None'}</span>
                      </p>
                      <select
                        value={editableLineup.lineup?.kicker || ''}
                        onChange={(e) => setEditableLineup({
                          ...editableLineup,
                          lineup: {
                            ...editableLineup.lineup,
                            kicker: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-blue-400 rounded-lg text-sm focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none bg-white"
                      >
                        <option value="">-- Select Kicker --</option>
                        {kickerOptions.map((player) => (
                          <option key={player.id} value={player.name}>
                            {player.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-blue-700 mt-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Select Defense and Kicker from the dropdown to match database values
                </p>
              </div>

              {/* Finalize Button */}
              <button
                onClick={handleFinalizeImport}
                disabled={isProcessing}
                className="w-full bg-xl-bright-blue hover:bg-xl-dark-blue text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting Lineup...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Confirm and Submit Lineup
                  </>
                )}
              </button>
            </>
          )}

          {/* Step: Importing */}
          {currentStep === 'importing' && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 text-xl-bright-blue animate-spin mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-xl-dark-blue mb-2">
                Importing Records...
              </h2>
              <p className="text-gray-600">
                Adding members to your team
              </p>
            </div>
          )}

          {/* Step: Complete */}
          {currentStep === 'complete' && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-xl-dark-blue mb-2">
                Import Complete!
              </h2>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto my-8">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-green-600">{importResults.imported}</p>
                  <p className="text-sm text-gray-600">Imported</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-blue-600">{importResults.updated}</p>
                  <p className="text-sm text-gray-600">Updated</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-600">{importResults.skipped}</p>
                  <p className="text-sm text-gray-600">Skipped</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setCurrentStep('upload')
                    setPdfFile(null)
                    setJobId(null)
                    setFuzzyMatches([])
                    setParsedRecords([])
                    setError(null)
                    loadTeams()
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Upload Another
                </button>
                <Link
                  href="/employee/dashboard"
                  className="px-6 py-3 bg-xl-bright-blue text-white font-semibold rounded-lg hover:bg-xl-dark-blue transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* Info Box */}
          {currentStep === 'upload' && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>How it works:</strong> Upload your fantasy football lineup PDF and we'll extract all player selections using AI.
                You'll then review the extracted lineup (especially Defense and Kicker write-ins) before final submission.
                This ensures accuracy while making submissions fast and easy.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
