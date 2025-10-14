import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resources | XL Benefits',
  description: 'White papers, blog posts, glossary, state guides, and carrier information for insurance brokers.',
}

export default function ResourcesPage() {
  return (
    <div>
      <section
        className="relative bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white py-16"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 51, 102, 0.85)), url("/images/parallax/resources.JPG")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Resources for Brokers
            </h1>
            <p className="text-xl text-white/90">
              White papers, guides, and insights to help you serve your clients better.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/resources/white-papers" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600">
                  White Papers
                </h2>
                <p className="text-gray-600">
                  In-depth guides on stop-loss fundamentals, self-funding strategies, and market trends.
                </p>
              </div>
            </Link>

            <Link href="/resources/blog" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600">
                  Blog
                </h2>
                <p className="text-gray-600">
                  Industry news, best practices, and case study previews.
                </p>
              </div>
            </Link>

            <Link href="/resources/faq" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600">
                  FAQ
                </h2>
                <p className="text-gray-600">
                  Expert answers to your stop-loss and self-funding questions.
                </p>
              </div>
            </Link>

            <Link href="/resources/glossary" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600">
                  Glossary
                </h2>
                <p className="text-gray-600">
                  Searchable definitions for stop-loss terminology and concepts.
                </p>
              </div>
            </Link>

            <Link href="/resources/state-guides" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600">
                  State Guides
                </h2>
                <p className="text-gray-600">
                  State-specific regulations, carriers, and compliance requirements.
                </p>
              </div>
            </Link>

            <Link href="/resources/carrier-directory" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600">
                  Carrier Directory
                </h2>
                <p className="text-gray-600">
                  Carrier ratings, specialties, and group size focus areas.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
