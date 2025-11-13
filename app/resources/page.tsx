import Link from 'next/link'
import type { Metadata } from 'next'
import AnimatedSection from '@/components/shared/AnimatedSection'

export const metadata: Metadata = {
  title: 'Resources | XL Benefits',
  description: 'White papers, blog posts, glossary, state guides, and carrier information for insurance brokers.',
}

export default function ResourcesPage() {
  return (
    <div>
      {/* Extended Background Container */}
      <div className="relative">
        {/* Desktop Background */}
        <div
          className="hidden md:block absolute inset-0"
          style={{
            backgroundImage: 'url(/images/parallax/resources.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Mobile Background - adjusted positioning */}
        <div
          className="md:hidden absolute inset-0"
          style={{
            backgroundImage: 'url(/images/parallax/resources.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Hero Section */}
        <section className="relative text-white min-h-[50vh] flex items-center">
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Overlaid Content - Centered */}
          <div className="relative w-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <AnimatedSection animation="fade-up">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 text-white drop-shadow-2xl">
                RESOURCES
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-white/95 drop-shadow-lg max-w-2xl mx-auto">
                White papers, guides, and insights to help you serve your clients better
              </p>
            </AnimatedSection>
          </div>
          </div>
        </section>

        {/* Resources Grid - Frosted */}
        <section className="py-16 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* White Papers - Premium Purple with Crisp Shadow */}
            <Link href="/resources/white-papers" className="group">
              <div className="bg-white rounded-lg shadow-xl-crisp p-8 hover:shadow-xl-deep hover:-translate-y-2 hover:scale-105 transition-all duration-300 h-full border-2 border-transparent hover:border-xl-premium-purple group-hover:bg-xl-premium-purple">
                <div className="w-14 h-14 bg-xl-premium-purple/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <svg className="w-7 h-7 text-xl-premium-purple group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors">
                  White Papers
                </h2>
                <p className="text-gray-600 group-hover:text-white/90 transition-colors">
                  In-depth guides on stop-loss fundamentals, self-funding strategies, and market trends.
                </p>
              </div>
            </Link>

            {/* Blog - Success Green with Bold Shadow */}
            <Link href="/resources/blog" className="group">
              <div className="bg-white rounded-lg shadow-xl-bold p-8 hover:shadow-xl-deep hover:-translate-y-2 hover:scale-105 transition-all duration-300 h-full border-2 border-transparent hover:border-xl-success-green group-hover:bg-xl-success-green">
                <div className="w-14 h-14 bg-xl-success-green/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <svg className="w-7 h-7 text-xl-success-green group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors">
                  Blog
                </h2>
                <p className="text-gray-600 group-hover:text-white/90 transition-colors">
                  Industry news, best practices, and case study previews.
                </p>
              </div>
            </Link>

            {/* FAQ - Warning Orange with Crisp Shadow */}
            <Link href="/resources/faq" className="group">
              <div className="bg-white rounded-lg shadow-xl-crisp p-8 hover:shadow-xl-deep hover:-translate-y-2 hover:scale-105 transition-all duration-300 h-full border-2 border-transparent hover:border-xl-warning-orange group-hover:bg-xl-warning-orange">
                <div className="w-14 h-14 bg-xl-warning-orange/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <svg className="w-7 h-7 text-xl-warning-orange group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors">
                  FAQ
                </h2>
                <p className="text-gray-600 group-hover:text-white/90 transition-colors">
                  Expert answers to your stop-loss and self-funding questions.
                </p>
              </div>
            </Link>

            {/* Glossary - Primary Blue with Bold Shadow */}
            <Link href="/resources/glossary" className="group">
              <div className="bg-white rounded-lg shadow-xl-bold p-8 hover:shadow-xl-deep hover:-translate-y-2 hover:scale-105 transition-all duration-300 h-full border-2 border-transparent hover:border-xl-bright-blue group-hover:bg-xl-bright-blue">
                <div className="w-14 h-14 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <svg className="w-7 h-7 text-xl-bright-blue group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors">
                  Glossary
                </h2>
                <p className="text-gray-600 group-hover:text-white/90 transition-colors">
                  Searchable definitions for stop-loss terminology and concepts.
                </p>
              </div>
            </Link>

            {/* State Guides - Dark Blue with Crisp Shadow */}
            <Link href="/resources/state-guides" className="group">
              <div className="bg-white rounded-lg shadow-xl-crisp p-8 hover:shadow-xl-deep hover:-translate-y-2 hover:scale-105 transition-all duration-300 h-full border-2 border-transparent hover:border-xl-dark-blue group-hover:bg-xl-dark-blue">
                <div className="w-14 h-14 bg-xl-dark-blue/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <svg className="w-7 h-7 text-xl-dark-blue group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors">
                  State Guides
                </h2>
                <p className="text-gray-600 group-hover:text-white/90 transition-colors">
                  State-specific regulations, carriers, and compliance requirements.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
      </div>
    </div>
  )
}
