import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Solutions | XL Benefits',
  description: 'Interactive tools to solve your stop-loss challenges: COBRA calculators, deductible analysis, self-funding assessments, and more.',
}

export default function SolutionsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-50 to-primary-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Problem-Solving Tools for Brokers
            </h1>
            <p className="text-xl text-gray-700">
              Every challenge has a solution. Find the right tool for your stop-loss needs.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/solutions/cobra-calculation-challenges" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600">
                  COBRA Calculator
                </h2>
                <p className="text-gray-600 mb-4">
                  Calculate accurate COBRA rates with state-specific compliance built in.
                </p>
                <span className="text-primary-600 font-semibold inline-flex items-center">
                  Use Tool
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link href="/solutions/deductible-optimization" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600">
                  Deductible Optimizer
                </h2>
                <p className="text-gray-600 mb-4">
                  Find the optimal deductible structure with scenario analysis.
                </p>
                <span className="text-primary-600 font-semibold inline-flex items-center">
                  Use Tool
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link href="/solutions/self-funding-feasibility" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600">
                  Self-Funding Readiness
                </h2>
                <p className="text-gray-600 mb-4">
                  Assess if your client is ready to transition to self-funding.
                </p>
                <span className="text-primary-600 font-semibold inline-flex items-center">
                  Use Tool
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link href="/solutions/aggregating-specific-analysis" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600">
                  Agg Specific Analysis
                </h2>
                <p className="text-gray-600 mb-4">
                  Compare aggregating specific vs traditional specific deductibles.
                </p>
                <span className="text-primary-600 font-semibold inline-flex items-center">
                  Use Tool
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link href="/solutions/cost-containment-solutions" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600">
                  Vendor Directory
                </h2>
                <p className="text-gray-600 mb-4">
                  Find the right cost containment vendors for your clients.
                </p>
                <span className="text-primary-600 font-semibold inline-flex items-center">
                  Browse Directory
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
