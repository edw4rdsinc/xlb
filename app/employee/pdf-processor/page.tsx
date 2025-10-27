'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, FileText, Mail, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react'

interface FileProgress {
  file: File
  status: 'pending' | 'uploading' | 'extracting' | 'emailing' | 'complete' | 'error'
  message: string
  extractedText?: string
  fileName?: string
  fileUrl?: string
}

export default function PDFProcessorPage() {
  const [files, setFiles] = useState<File[]>([])
  const [teamEmails, setTeamEmails] = useState<string>('')
  const [fileProgress, setFileProgress] = useState<FileProgress[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

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

      if (!uploadRes.ok) throw new Error('Upload failed')

      const uploadData = await uploadRes.json()
      const { fileUrl, fileName } = uploadData

      // Step 2: Extract text
      updateFileProgress(index, { status: 'extracting', message: 'Extracting text...', fileName, fileUrl })

      const extractRes = await fetch('/api/employee/process-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl, fileName }),
      })

      if (!extractRes.ok) throw new Error('Extraction failed')

      const extractData = await extractRes.json()
      const { text } = extractData

      // Step 3: Send emails
      updateFileProgress(index, { status: 'emailing', message: 'Sending emails...', extractedText: text })

      const emailRes = await fetch('/api/employee/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails,
          fileName,
          text,
          fileUrl,
        }),
      })

      if (!emailRes.ok) throw new Error('Email failed')

      // Complete
      updateFileProgress(index, { status: 'complete', message: `Sent to ${emails.length} recipient(s)` })

    } catch (error: any) {
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

    // Process all files in parallel
    await Promise.all(
      files.map((file, index) => processSingleFile(file, index, emails))
    )

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
            Upload PDF documents and extract text automatically
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

              <div className="space-y-2 max-h-96 overflow-y-auto">
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
                      {(progress.status === 'uploading' || progress.status === 'extracting' || progress.status === 'emailing') && (
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

                        {/* Show preview for completed files */}
                        {progress.status === 'complete' && progress.extractedText && (
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
