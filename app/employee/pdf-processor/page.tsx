'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, FileText, Mail, Loader2, CheckCircle, AlertCircle, X, Copy, Check } from 'lucide-react'

interface Section {
  title: string
  content: string
}

interface FileProgress {
  file: File
  status: 'pending' | 'uploading' | 'extracting' | 'structuring' | 'emailing' | 'complete' | 'error'
  message: string
  extractedText?: string
  sections?: Section[]
  fileName?: string
  fileUrl?: string
}

export default function PDFProcessorPage() {
  const [files, setFiles] = useState<File[]>([])
  const [teamEmails, setTeamEmails] = useState<string>('')
  const [fileProgress, setFileProgress] = useState<FileProgress[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)

      // Validate file count
      if (selectedFiles.length > 20) {
        alert('Maximum 20 files allowed at once')
        return
      }

      // Validate all files are PDFs
      const invalidFiles = selectedFiles.filter(f => f.type !== 'application/pdf')
      if (invalidFiles.length > 0) {
        alert(`Please select only PDF files. Found ${invalidFiles.length} non-PDF file(s)`)
        return
      }

      setFiles(selectedFiles)
      setFileProgress([])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const updateFileProgress = (index: number, updates: Partial<FileProgress>) => {
    setFileProgress(prev => {
      const newProgress = [...prev]
      newProgress[index] = { ...newProgress[index], ...updates }
      return newProgress
    })
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(id)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const processSingleFile = async (file: File, index: number, emails: string[]) => {
    try {
      // Step 1: Upload to Wasabi
      updateFileProgress(index, { status: 'uploading', message: 'Uploading...' })

      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/employee/upload-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json()
        console.error(`Upload failed for ${file.name}:`, errorData)
        throw new Error(`Upload failed: ${errorData.error || 'Unknown error'}`)
      }

      const uploadData = await uploadRes.json()
      const { fileUrl, fileName } = uploadData
      console.log(`✅ Uploaded ${file.name} to ${fileUrl}`)

      // Step 2: Extract text
      updateFileProgress(index, { status: 'extracting', message: 'Extracting text...', fileName, fileUrl })

      const extractRes = await fetch('/api/employee/process-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl, fileName }),
      })

      if (!extractRes.ok) {
        const errorData = await extractRes.json()
        console.error(`Extraction failed for ${fileName}:`, errorData)
        throw new Error(`Extraction failed: ${errorData.error || 'Unknown error'}`)
      }

      const extractData = await extractRes.json()
      const { text } = extractData
      console.log(`✅ Extracted ${text.length} characters from ${fileName}`)

      // Step 3: Skip AI structuring (disabled - API key doesn't have model access)
      // TODO: Re-enable when Anthropic API key is configured with correct model access
      const sections: Section[] = []
      console.log(`⏭️  Skipping AI structuring for ${fileName} (feature disabled)`)

      // Step 4: Send emails
      updateFileProgress(index, { status: 'emailing', message: 'Sending emails...', sections })

      const emailRes = await fetch('/api/employee/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails,
          fileName,
          text,
          sections,
          fileUrl,
        }),
      })

      if (!emailRes.ok) {
        const errorData = await emailRes.json()
        console.error(`Email failed for ${fileName}:`, errorData)
        throw new Error(`Email failed: ${errorData.error || 'Unknown error'}`)
      }

      const emailData = await emailRes.json()
      console.log(`✅ Email results for ${fileName}:`, emailData)

      // Complete with detailed status
      const successCount = emailData.emailsSent || 0
      const failedCount = emailData.failed || 0

      if (failedCount > 0) {
        updateFileProgress(index, {
          status: 'complete',
          message: `⚠️ Sent to ${successCount}/${emails.length} recipients (${failedCount} failed)`
        })
        console.warn('Some emails failed to send:', emailData.results)
      } else {
        updateFileProgress(index, {
          status: 'complete',
          message: `✅ Sent to all ${emails.length} recipient(s)`
        })
      }

    } catch (error: any) {
      console.error(`❌ Processing failed for ${file.name}:`, error)
      updateFileProgress(index, { status: 'error', message: error.message || 'Processing failed' })
    }
  }

  const handleProcess = async () => {
    if (files.length === 0) {
      alert('Please select at least one PDF file')
      return
    }

    if (!teamEmails.trim()) {
      alert('Please enter at least one email address')
      return
    }

    setIsProcessing(true)

    // Initialize progress tracking for all files
    const initialProgress: FileProgress[] = files.map(file => ({
      file,
      status: 'pending',
      message: 'Waiting...',
    }))
    setFileProgress(initialProgress)

    // Parse emails
    const emails = teamEmails.split(',').map(e => e.trim()).filter(Boolean)

    // Process files sequentially to avoid Resend rate limiting (2 emails/second)
    // Each PDF sends multiple emails, so we can't process PDFs in parallel
    console.log(`Processing ${files.length} PDFs sequentially...`)
    for (let i = 0; i < files.length; i++) {
      console.log(`Processing PDF ${i + 1} of ${files.length}`)
      await processSingleFile(files[i], i, emails)
    }

    setIsProcessing(false)
  }

  const handleReset = () => {
    setFiles([])
    setTeamEmails('')
    setFileProgress([])
    setIsProcessing(false)
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
            PDF Text Extractor
          </h1>
          <p className="text-sm text-xl-grey mt-1">
            Upload PDF documents and extract text with proper section formatting
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">

          {/* File Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-xl-dark-blue mb-3">
              1. Select PDF Documents (up to 20)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-xl-bright-blue transition-colors">
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
                disabled={isProcessing}
              />
              <label htmlFor="pdf-upload" className={isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-xl-grey mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF files only • Maximum 20 files
                </p>
              </label>
            </div>

            {/* Selected Files List */}
            {files.length > 0 && fileProgress.length === 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-xl-dark-blue">
                  Selected Files ({files.length}/20)
                </p>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-xl-bright-blue" />
                      <span className="text-sm text-xl-dark-blue">{file.name}</span>
                      <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team Emails */}
          <div className="mb-8">
            <label htmlFor="team-emails" className="block text-sm font-medium text-xl-dark-blue mb-3">
              2. Team Email Addresses
            </label>
            <input
              id="team-emails"
              type="text"
              value={teamEmails}
              onChange={(e) => setTeamEmails(e.target.value)}
              placeholder="email1@xlbenefits.com, email2@xlbenefits.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Separate multiple emails with commas
            </p>
          </div>

          {/* Process Button */}
          <button
            onClick={handleProcess}
            disabled={files.length === 0 || !teamEmails.trim() || isProcessing}
            className="w-full bg-xl-bright-blue hover:bg-xl-dark-blue text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing {files.length} file{files.length > 1 ? 's' : ''}...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Process & Email {files.length > 0 && `(${files.length} file${files.length > 1 ? 's' : ''})`}
              </>
            )}
          </button>

          {/* Batch Processing Progress */}
          {fileProgress.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-xl-dark-blue">
                  Processing Progress
                </h3>
                <p className="text-xs text-gray-500">
                  {fileProgress.filter(f => f.status === 'complete').length} / {fileProgress.length} complete
                </p>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {fileProgress.map((progress, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      progress.status === 'error' ? 'bg-red-50 border-red-200' :
                      progress.status === 'complete' ? 'bg-green-50 border-green-200' :
                      'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {progress.status === 'error' && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                      {progress.status === 'complete' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
                      {(progress.status === 'uploading' || progress.status === 'extracting' || progress.status === 'structuring' || progress.status === 'emailing') && (
                        <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
                      )}
                      {progress.status === 'pending' && <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />}

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          progress.status === 'error' ? 'text-red-800' :
                          progress.status === 'complete' ? 'text-green-800' :
                          'text-blue-800'
                        }`}>
                          {progress.file.name}
                        </p>
                        <p className={`text-xs mt-1 ${
                          progress.status === 'error' ? 'text-red-600' :
                          progress.status === 'complete' ? 'text-green-600' :
                          'text-blue-600'
                        }`}>
                          {progress.message}
                        </p>

                        {/* Show sections for completed files */}
                        {progress.status === 'complete' && progress.sections && progress.sections.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {/* Copy All Button */}
                            <button
                              onClick={() => {
                                const allText = progress.sections!
                                  .map(s => `${s.title}\n\n${s.content}`)
                                  .join('\n\n\n')
                                copyToClipboard(allText, `${index}-all`)
                              }}
                              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-xl-bright-blue hover:bg-white rounded-md transition-colors"
                            >
                              {copiedIndex === `${index}-all` ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  Copied All!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  Copy All Sections
                                </>
                              )}
                            </button>

                            {/* Individual Sections */}
                            {progress.sections.map((section, sectionIdx) => (
                              <div key={sectionIdx} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-200">
                                  <h4 className="text-sm font-semibold text-xl-dark-blue">
                                    {section.title}
                                  </h4>
                                  <button
                                    onClick={() => copyToClipboard(section.content, `${index}-${sectionIdx}`)}
                                    className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-xl-bright-blue hover:bg-white rounded transition-colors"
                                  >
                                    {copiedIndex === `${index}-${sectionIdx}` ? (
                                      <>
                                        <Check className="w-3 h-3" />
                                        Copied!
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        Copy
                                      </>
                                    )}
                                  </button>
                                </div>
                                <div className="p-4">
                                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                                    {section.content}
                                  </pre>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Fallback: Show raw text if no sections */}
                        {progress.status === 'complete' && (!progress.sections || progress.sections.length === 0) && progress.extractedText && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-600 cursor-pointer hover:text-xl-bright-blue">
                              View extracted text preview
                            </summary>
                            <div className="mt-2 bg-white border border-gray-200 rounded p-2 max-h-32 overflow-y-auto">
                              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                                {progress.extractedText.substring(0, 300)}
                                {progress.extractedText.length > 300 && '...'}
                              </pre>
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reset Button */}
          {fileProgress.length > 0 && !isProcessing && (
            <button
              onClick={handleReset}
              className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-xl-dark-blue font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Process More Documents
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
