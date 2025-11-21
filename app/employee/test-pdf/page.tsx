'use client'

import { useState } from 'react'
import { Upload, FileText, AlertCircle } from 'lucide-react'

export default function TestPDFPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Upload PDF first
      const formData = new FormData()
      formData.append('file', pdfFile)

      const uploadRes = await fetch('/api/employee/upload-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        throw new Error('Upload failed')
      }

      const uploadData = await uploadRes.json()

      // Test extraction
      const testRes = await fetch('/api/employee/test-pdf-extraction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: uploadData.fileName }),
      })

      const testData = await testRes.json()
      setResult(testData)
    } catch (err: any) {
      setError(err.message || 'Test failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">PDF Extraction Test</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="hidden"
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium">
                {pdfFile ? pdfFile.name : 'Click to upload PDF'}
              </p>
            </label>
          </div>

          <button
            onClick={handleTest}
            disabled={!pdfFile || loading}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Extraction'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Extraction Results</h2>

            <div className="space-y-3">
              <div>
                <span className="font-medium">Success:</span> {result.success ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-medium">Text Length:</span> {result.text_length} characters
              </div>
              <div>
                <span className="font-medium">Pages:</span> {result.pages}
              </div>
              <div>
                <span className="font-medium">Has Tables:</span> {result.has_tables ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-medium">Has Checkboxes:</span> {result.has_checkboxes ? 'Yes' : 'No'}
              </div>

              {result.first_1000_chars && (
                <div>
                  <h3 className="font-medium mb-2">First 1000 characters:</h3>
                  <pre className="bg-gray-100 p-3 rounded text-xs whitespace-pre-wrap">
                    {result.first_1000_chars}
                  </pre>
                </div>
              )}

              {result.full_text && (
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium">Full Extracted Text</summary>
                  <pre className="bg-gray-100 p-3 rounded text-xs whitespace-pre-wrap mt-2 max-h-96 overflow-y-auto">
                    {result.full_text}
                  </pre>
                </details>
              )}

              {result.error && (
                <div className="bg-red-50 p-3 rounded">
                  <span className="font-medium">Error:</span> {result.error}
                  {result.details && (
                    <pre className="text-xs mt-2">{JSON.stringify(result.details, null, 2)}</pre>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}