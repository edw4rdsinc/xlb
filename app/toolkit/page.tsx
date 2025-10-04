import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Broker Toolkit | Free Stop-Loss Calculators & Resources',
  description: 'Access our suite of interactive tools: COBRA calculators, deductible analyzers, self-funding quizzes, and more.',
}

export default function ToolkitPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Your Complete Stop-Loss Toolkit
            </h1>
            <p className="text-xl text-primary-100">
              Free interactive tools designed specifically for insurance brokers managing stop-loss challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Available Tools */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Now</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Link href="/solutions/cobra-calculation-challenges" className="group">
              <div className="bg-white border-2 border-primary-500 rounded-lg p-6 hover:shadow-xl transition-all h-full">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600">
                      COBRA Calculator
                    </h3>
                    <span className="text-sm text-green-600 font-semibold">✓ AVAILABLE</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Calculate accurate COBRA rates for self-funded groups with state-specific compliance, administrative fee calculations, and coverage tier variations built in.
                </p>
                <span className="text-primary-600 font-semibold inline-flex items-center group-hover:text-primary-700">
                  Use Tool Now
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-8">Coming Soon</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Deductible Analyzer</h3>
                  <span className="text-sm text-gray-500 font-semibold">Q2 2025</span>
                </div>
              </div>
              <p className="text-gray-600">
                Optimize stop-loss deductibles with side-by-side scenario comparison.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Self-Funding Quiz</h3>
                  <span className="text-sm text-gray-500 font-semibold">Q2 2025</span>
                </div>
              </div>
              <p className="text-gray-600">
                Assess client readiness for self-funding transition in 5 minutes.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Agg Specific Calculator</h3>
                  <span className="text-sm text-gray-500 font-semibold">Q3 2025</span>
                </div>
              </div>
              <p className="text-gray-600">
                ROI comparison for aggregating specific vs traditional deductibles.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Vendor Directory</h3>
                  <span className="text-sm text-gray-500 font-semibold">Q3 2025</span>
                </div>
              </div>
              <p className="text-gray-600">
                Searchable directory of cost containment vendors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How to Use These Tools Effectively
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border-l-4 border-primary-500">
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. Access is Free (with Email Verification)</h3>
              <p className="text-gray-700">
                All tools require a quick email verification to ensure we're serving real brokers. You'll get instant access after verification.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border-l-4 border-primary-500">
              <h3 className="text-xl font-bold text-gray-900 mb-2">2. Results Display Instantly</h3>
              <p className="text-gray-700">
                Get your calculations on-screen immediately, plus the option to email a detailed PDF report for client presentations.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border-l-4 border-primary-500">
              <h3 className="text-xl font-bold text-gray-900 mb-2">3. Expert Guidance Available</h3>
              <p className="text-gray-700">
                Every tool includes "What You Might Miss" complexity reveals and direct access to talk with our experts about your specific situation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
