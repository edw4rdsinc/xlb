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
  employee_id?: string
  first_name?: string
  last_name?: string
  full_name?: string
  email?: string
  date_of_birth?: string
  hire_date?: string
  department?: string
  job_title?: string
  salary?: number
  coverage_tier?: string
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

  // Load teams on mount
  useEffect(() => {
    loadTeams()
  }, [])

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
          setCurrentStep('approval')
          setFuzzyMatches(data.fuzzy_matches_data || [])
          setExactMatches(data.exact_matches || 0)
          setNewRecords(data.new_records || 0)
          setParsedRecords(data.parsed_records || [])
          setTotalRecords(data.total_records || 0)
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
    if (!jobId) return

    setIsProcessing(true)
    setCurrentStep('importing')

    try {
      const decisions = fuzzyMatches.map(m => ({
        match_id: m.id,
        action: m.action || 'skip'
      }))

      const res = await fetch('/api/employee/finalize-roster-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId,
          decisions
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
            Roster Upload
          </h1>
          <p className="text-sm text-xl-grey mt-1">
            Upload PDF rosters to populate team members with intelligent matching
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
                  1. Upload Roster PDF
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
                      {pdfFile ? pdfFile.name : 'Click to upload roster PDF'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports employee census, enrollment forms, and benefit rosters
                    </p>
                  </label>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-xl-dark-blue mb-4">
                  2. Select or Create Team
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
                disabled={!pdfFile || (!teamId && !newTeamName.trim())}
                className="w-full bg-xl-bright-blue hover:bg-xl-dark-blue text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Process Roster
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

          {/* Step: Approval */}
          {currentStep === 'approval' && (
            <>
              {/* Summary */}
              <div className="mb-8 grid grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-xl-dark-blue">{totalRecords}</p>
                  <p className="text-sm text-gray-600">Total Records</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{exactMatches}</p>
                  <p className="text-sm text-gray-600">Exact Matches</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{fuzzyMatches.length}</p>
                  <p className="text-sm text-gray-600">Need Review</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{newRecords}</p>
                  <p className="text-sm text-gray-600">New Records</p>
                </div>
              </div>

              {/* Fuzzy Matches for Approval */}
              {fuzzyMatches.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-xl-dark-blue mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Review Potential Matches
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    These records have similar but not exact matches. Please decide how to handle each one.
                  </p>

                  <div className="space-y-4">
                    {fuzzyMatches.map((match) => (
                      <div
                        key={match.id}
                        className={`border rounded-lg p-4 ${
                          match.action ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">From PDF</p>
                                <p className="font-semibold text-xl-dark-blue">{match.parsed_name}</p>
                                {match.parsed_record.email && (
                                  <p className="text-sm text-gray-600">{match.parsed_record.email}</p>
                                )}
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Existing Member</p>
                                <p className="font-semibold text-xl-dark-blue">{match.existing_name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                match.match_score >= 0.9
                                  ? 'bg-green-100 text-green-700'
                                  : match.match_score >= 0.8
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                              }`}>
                                {Math.round(match.match_score * 100)}% match
                              </span>
                              <span className="text-gray-500">{match.match_reason}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleMatchDecision(match.id, 'update')}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                match.action === 'update'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              Update Existing
                            </button>
                            <button
                              onClick={() => handleMatchDecision(match.id, 'create_new')}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                match.action === 'create_new'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              }`}
                            >
                              Create New
                            </button>
                            <button
                              onClick={() => handleMatchDecision(match.id, 'skip')}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                match.action === 'skip'
                                  ? 'bg-gray-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              Skip
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Finalize Button */}
              <button
                onClick={handleFinalizeImport}
                disabled={!allMatchesDecided || isProcessing}
                className="w-full bg-xl-bright-blue hover:bg-xl-dark-blue text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Finalize Import ({fuzzyMatches.length > 0 && !allMatchesDecided
                      ? `${fuzzyMatches.filter(m => m.action).length}/${fuzzyMatches.length} decided`
                      : 'Ready'
                    })
                  </>
                )}
              </button>

              {fuzzyMatches.length > 0 && !allMatchesDecided && (
                <p className="text-sm text-yellow-600 text-center mt-2">
                  Please make a decision for all {fuzzyMatches.length} potential matches before importing
                </p>
              )}
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
                <strong>How it works:</strong> Upload a PDF roster and we'll extract employee data using AI.
                When we find potential matches with existing team members, you'll be asked to review and approve them.
                This ensures data accuracy while making imports fast and easy.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
