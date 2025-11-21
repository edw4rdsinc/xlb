'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Upload, Settings, LogOut, Scale, Trophy, BookOpen } from 'lucide-react'
import VendorLibraryModal from '@/components/employee/VendorLibraryModal'

export default function EmployeeDashboard() {
  const [showVendorLibrary, setShowVendorLibrary] = useState(false)

  const handleLogout = () => {
    // Clear session and redirect
    window.location.href = '/employee/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-xl-dark-blue">
                Employee Portal
              </h1>
              <p className="text-sm text-xl-grey mt-1">
                XL Benefits Internal Tools
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-xl-grey hover:text-xl-dark-blue transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-xl-dark-blue mb-2">
            Welcome Back!
          </h2>
          <p className="text-xl-grey">
            Select a tool below to get started
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* PDF Processor */}
          <Link href="/employee/pdf-processor">
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-xl-bright-blue p-6 transition-all hover:shadow-lg group cursor-pointer">
              <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-xl-bright-blue/20 transition-colors">
                <FileText className="w-6 h-6 text-xl-bright-blue" />
              </div>
              <h3 className="text-xl font-bold text-xl-dark-blue mb-2 group-hover:text-xl-bright-blue transition-colors">
                PDF Text Extractor
              </h3>
              <p className="text-sm text-xl-grey mb-4">
                Upload PDF documents and extract text automatically. Processed documents are emailed to your team.
              </p>
              <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">
                Ready to Use
              </span>
            </div>
          </Link>

          {/* Document Conflict Analyzer */}
          <Link href="/employee/conflict-analyzer">
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-xl-bright-blue p-6 transition-all hover:shadow-lg group cursor-pointer">
              <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-xl-bright-blue/20 transition-colors">
                <Scale className="w-6 h-6 text-xl-bright-blue" />
              </div>
              <h3 className="text-xl font-bold text-xl-dark-blue mb-2 group-hover:text-xl-bright-blue transition-colors">
                Document Conflict Analyzer
              </h3>
              <p className="text-sm text-xl-grey mb-4">
                Compare SPD vs Employee Handbook to identify benefits misalignments. Get branded reports via email.
              </p>
              <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">
                Ready to Use
              </span>
            </div>
          </Link>

          {/* Fantasy Football Admin */}
          <Link href="/employee/fantasy-football">
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-xl-bright-blue p-6 transition-all hover:shadow-lg group cursor-pointer">
              <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-xl-bright-blue/20 transition-colors">
                <Trophy className="w-6 h-6 text-xl-bright-blue" />
              </div>
              <h3 className="text-xl font-bold text-xl-dark-blue mb-2 group-hover:text-xl-bright-blue transition-colors">
                Fantasy Football Admin
              </h3>
              <p className="text-sm text-xl-grey mb-4">
                Manage fantasy football lineups, lock/unlock submissions, and view participant details.
              </p>
              <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">
                Ready to Use
              </span>
            </div>
          </Link>

          {/* Roster Upload */}
          <Link href="/employee/roster-upload">
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-xl-bright-blue p-6 transition-all hover:shadow-lg group cursor-pointer">
              <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-xl-bright-blue/20 transition-colors">
                <Upload className="w-6 h-6 text-xl-bright-blue" />
              </div>
              <h3 className="text-xl font-bold text-xl-dark-blue mb-2 group-hover:text-xl-bright-blue transition-colors">
                Fantasy Football Lineup Upload
              </h3>
              <p className="text-sm text-xl-grey mb-4">
                Upload PDF fantasy football lineups with AI-powered extraction and review before submission.
              </p>
              <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">
                Ready to Use
              </span>
            </div>
          </Link>

          {/* Vendor Library Chatbot */}
          <div
            onClick={() => setShowVendorLibrary(true)}
            className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-xl-bright-blue p-6 transition-all hover:shadow-lg group cursor-pointer"
          >
            <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-xl-bright-blue/20 transition-colors">
              <BookOpen className="w-6 h-6 text-xl-bright-blue" />
            </div>
            <h3 className="text-xl font-bold text-xl-dark-blue mb-2 group-hover:text-xl-bright-blue transition-colors">
              Vendor Knowledge Library
            </h3>
            <p className="text-sm text-xl-grey mb-4">
              Search and interact with our comprehensive healthcare vendor research library covering 15 tiers and 45+ vendor categories.
            </p>
            <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">
              Ready to Use
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6 opacity-60">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-500 mb-2">
              Team Settings
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Manage team members and notification preferences
            </p>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-xl-dark-blue mb-4">
            Recent Activity
          </h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-xl-grey text-center py-8">
              No recent activity to display
            </p>
          </div>
        </div>
      </main>

      {/* Vendor Library Modal */}
      <VendorLibraryModal
        isOpen={showVendorLibrary}
        onClose={() => setShowVendorLibrary(false)}
      />
    </div>
  )
}
