'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, FileText, Mail, Loader2, CheckCircle, AlertCircle, X, Briefcase } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface BrokerProfile {
  id: string
  broker_name: string
  logo_url: string | null
  primary_color: string
  secondary_color: string
}

export default function ConflictAnalyzerPage() {
  // Form state
  const [spdFile, setSpdFile] = useState<File | null>(null)
  const [handbookFile, setHandbookFile] = useState<File | null>(null)
  const [focusAreas, setFocusAreas] = useState<string[]>(['Short-Term Disability', 'Long-Term Disability'])
  const [clientName, setClientName] = useState('')
  const [clientLogoFile, setClientLogoFile] = useState<File | null>(null)
  const [teamEmails, setTeamEmails] = useState('')

  // Broker branding
  const [brokerProfiles, setBrokerProfiles] = useState<BrokerProfile[]>([])
  const [selectedProfileId, setSelectedProfileId] = useState<string>('')
  const [brokerName, setBrokerName] = useState('XL Benefits')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [primaryColor, setPrimaryColor] = useState('#0066cc')
  const [secondaryColor, setSecondaryColor] = useState('#003d7a')
  const [saveProfile, setSaveProfile] = useState(false)

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const availableFocusAreas = [
    'Short-Term Disability',
    'Long-Term Disability',
    'Life Insurance',
    'Maternity/Parental Leave',
    'FMLA',
    'Bereavement Leave',
    'Medical Benefits',
    'Dental Benefits',
    'Vision Benefits',
    'All Benefits (Comprehensive)',
  ]

  // Load broker profiles on mount
  useEffect(() => {
    loadBrokerProfiles()
  }, [])

  const loadBrokerProfiles = async () => {
    if (!supabase) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('broker_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('last_used', { ascending: false, nullsFirst: false })

    if (data) {
      setBrokerProfiles(data)
    }
  }

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfileId(profileId)
    const profile = brokerProfiles.find(p => p.id === profileId)
    if (profile) {
      setBrokerName(profile.broker_name)
      setPrimaryColor(profile.primary_color)
      setSecondaryColor(profile.secondary_color)
      // Note: logo_url would need to be displayed, not set as file
    }
  }

  const toggleFocusArea = (area: string) => {
    if (focusAreas.includes(area)) {
      setFocusAreas(focusAreas.filter(a => a !== area))
    } else {
      setFocusAreas([...focusAreas, area])
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!spdFile) {
      alert('Please upload an SPD document')
      return
    }
    if (!handbookFile) {
      alert('Please upload an Employee Handbook')
      return
    }
    if (focusAreas.length === 0) {
      alert('Please select at least one focus area')
      return
    }
    if (!teamEmails.trim()) {
      alert('Please enter at least one email address')
      return
    }
    if (!clientName.trim()) {
      alert('Please enter a client name')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      // Step 1: Upload SPD to Wasabi
      const spdFormData = new FormData()
      spdFormData.append('file', spdFile)

      const spdUploadRes = await fetch('/api/employee/upload-pdf', {
        method: 'POST',
        body: spdFormData,
      })

      if (!spdUploadRes.ok) throw new Error('SPD upload failed')
      const spdData = await spdUploadRes.json()

      // Step 2: Upload Handbook to Wasabi
      const handbookFormData = new FormData()
      handbookFormData.append('file', handbookFile)

      const handbookUploadRes = await fetch('/api/employee/upload-pdf', {
        method: 'POST',
        body: handbookFormData,
      })

      if (!handbookUploadRes.ok) throw new Error('Handbook upload failed')
      const handbookData = await handbookUploadRes.json()

      // Step 3: Upload broker logo if provided
      let logoUrl = null
      if (logoFile) {
        const logoFormData = new FormData()
        logoFormData.append('file', logoFile)

        const logoUploadRes = await fetch('/api/employee/upload-pdf', {
          method: 'POST',
          body: logoFormData,
        })

        if (logoUploadRes.ok) {
          const logoData = await logoUploadRes.json()
          logoUrl = logoData.fileUrl
        }
      }

      // Step 4: Upload client logo if provided
      let clientLogoUrl = null
      if (clientLogoFile) {
        const clientLogoFormData = new FormData()
        clientLogoFormData.append('file', clientLogoFile)

        const clientLogoUploadRes = await fetch('/api/employee/upload-pdf', {
          method: 'POST',
          body: clientLogoFormData,
        })

        if (clientLogoUploadRes.ok) {
          const clientLogoData = await clientLogoUploadRes.json()
          clientLogoUrl = clientLogoData.fileUrl
        }
      }

      // Step 5: Create job via API (no client-side auth needed)
      // Try to get user info from session if available
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
        spd_url: spdData.fileUrl,
        spd_filename: spdData.fileName,
        handbook_url: handbookData.fileUrl,
        handbook_filename: handbookData.fileName,
        focus_areas: focusAreas,
        client_name: clientName,
        client_logo_url: clientLogoUrl || null,
        review_date: new Date().toISOString().split('T')[0],
        branding: {
          broker_name: brokerName,
          logo_url: logoUrl || (selectedProfileId ? brokerProfiles.find(p => p.id === selectedProfileId)?.logo_url : null),
          primary_color: primaryColor,
          secondary_color: secondaryColor,
        },
        broker_profile_id: selectedProfileId || null,
        email_recipients: teamEmails.split(',').map(e => e.trim()).filter(Boolean),
        status: 'pending',
      }

      const jobRes = await fetch('/api/employee/create-conflict-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      })

      if (!jobRes.ok) {
        const errorData = await jobRes.json()
        throw new Error(errorData.error || 'Failed to create job')
      }

      const { job } = await jobRes.json()

      // Step 6: Optionally save broker profile
      if (saveProfile && !selectedProfileId && userId && supabase) {
        await supabase.from('broker_profiles').insert([{
          user_id: userId,
          broker_name: brokerName,
          logo_url: logoUrl,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
        }])
      }

      setSubmitStatus({
        type: 'success',
        message: 'Job submitted successfully! You will receive an email with the report in 2-3 minutes.',
      })

      // Reset form
      setSpdFile(null)
      setHandbookFile(null)
      setClientName('')
      setClientLogoFile(null)

    } catch (error: any) {
      console.error('Submission error:', error)
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to submit job. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
            Document Conflict Analyzer
          </h1>
          <p className="text-sm text-xl-grey mt-1">
            Compare SPD vs Employee Handbook to identify benefits misalignments
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">

          {/* Step 1: Upload Documents */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-xl-dark-blue mb-4">
              1. Upload Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SPD Upload */}
              <div>
                <label className="block text-sm font-medium text-xl-dark-blue mb-2">
                  SPD (Summary Plan Description)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-xl-bright-blue transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSpdFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="spd-upload"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="spd-upload" className={isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-xl-grey">
                      {spdFile ? spdFile.name : 'Click to upload SPD'}
                    </p>
                  </label>
                </div>
              </div>

              {/* Handbook Upload */}
              <div>
                <label className="block text-sm font-medium text-xl-dark-blue mb-2">
                  Employee Handbook
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-xl-bright-blue transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setHandbookFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="handbook-upload"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="handbook-upload" className={isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-xl-grey">
                      {handbookFile ? handbookFile.name : 'Click to upload Handbook'}
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Focus Areas */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-xl-dark-blue mb-4">
              2. Select Focus Areas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableFocusAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => toggleFocusArea(area)}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    focusAreas.includes(area)
                      ? 'bg-xl-bright-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Client Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-xl-dark-blue mb-4">
              3. Client Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="client-name" className="block text-sm font-medium text-xl-dark-blue mb-2">
                  Client Name *
                </label>
                <input
                  id="client-name"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="ABC Manufacturing Inc."
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="client-logo" className="block text-sm font-medium text-xl-dark-blue mb-2">
                  Client Logo (Optional)
                </label>
                <input
                  id="client-logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setClientLogoFile(e.target.files?.[0] || null)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none disabled:opacity-50"
                />
                {clientLogoFile && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {clientLogoFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 4: Broker Branding */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-xl-dark-blue mb-4">
              4. Broker Branding
            </h2>

            {brokerProfiles.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-xl-dark-blue mb-2">
                  Use Saved Profile (Optional)
                </label>
                <select
                  value={selectedProfileId}
                  onChange={(e) => handleProfileSelect(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none disabled:opacity-50"
                >
                  <option value="">Custom branding...</option>
                  {brokerProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.broker_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="broker-name" className="block text-sm font-medium text-xl-dark-blue mb-2">
                  Broker Name
                </label>
                <input
                  id="broker-name"
                  type="text"
                  value={brokerName}
                  onChange={(e) => setBrokerName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="primary-color" className="block text-sm font-medium text-xl-dark-blue mb-2">
                  Primary Color
                </label>
                <input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg cursor-pointer disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="secondary-color" className="block text-sm font-medium text-xl-dark-blue mb-2">
                  Secondary Color
                </label>
                <input
                  id="secondary-color"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg cursor-pointer disabled:opacity-50"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-xl-dark-blue mb-2">
                Broker Logo (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none disabled:opacity-50"
              />
            </div>

            {!selectedProfileId && (
              <div className="mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveProfile}
                    onChange={(e) => setSaveProfile(e.target.checked)}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-xl-bright-blue focus:ring-xl-bright-blue border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Save this branding for future use</span>
                </label>
              </div>
            )}
          </div>

          {/* Step 5: Email Recipients */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-xl-dark-blue mb-4">
              5. Email Recipients
            </h2>
            <label htmlFor="team-emails" className="block text-sm font-medium text-xl-dark-blue mb-2">
              Email Addresses *
            </label>
            <input
              id="team-emails"
              type="text"
              value={teamEmails}
              onChange={(e) => setTeamEmails(e.target.value)}
              placeholder="email1@company.com, email2@company.com"
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-2">
              Separate multiple emails with commas
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !spdFile || !handbookFile || focusAreas.length === 0 || !teamEmails.trim() || !clientName.trim()}
            className="w-full bg-xl-bright-blue hover:bg-xl-dark-blue text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting Job...
              </>
            ) : (
              <>
                <Briefcase className="w-5 h-5" />
                Submit Analysis Job
              </>
            )}
          </button>

          {/* Status Message */}
          {submitStatus.type && (
            <div className={`mt-6 p-4 rounded-lg ${
              submitStatus.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {submitStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <p className={`text-sm ${
                  submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {submitStatus.message}
                </p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ How it works:</strong> Your documents will be analyzed in the background.
              You'll receive an email with a detailed, branded HTML report in 2-3 minutes.
              The report will identify conflicts where the handbook promises more than the SPD covers.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
