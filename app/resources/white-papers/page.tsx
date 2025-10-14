import type { Metadata } from 'next'
import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { getAllWhitePapers, type WhitePaper } from '@/lib/whitePapers'

export const metadata: Metadata = {
  title: 'White Papers | XL Benefits',
  description: 'Comprehensive guides on stop-loss insurance, self-funding strategies, compliance, and market analysis.',
  robots: 'max-snippet:-1, index, follow',
}

const categoryLabels: Record<WhitePaper['category'], string> = {
  'stop-loss': 'Stop-Loss Insurance',
  'self-funding': 'Self-Funding Strategies',
  'compliance': 'Compliance & Regulations',
  'market-analysis': 'Market Analysis',
  'cost-containment': 'Cost Containment'
}

const categoryColors: Record<WhitePaper['category'], string> = {
  'stop-loss': 'bg-blue-100 text-blue-800',
  'self-funding': 'bg-green-100 text-green-800',
  'compliance': 'bg-purple-100 text-purple-800',
  'market-analysis': 'bg-orange-100 text-orange-800',
  'cost-containment': 'bg-red-100 text-red-800'
}

export default function WhitePapersPage() {
  const whitePapers = getAllWhitePapers()
  const hasWhitePapers = whitePapers.length > 0

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              White Papers & Research
            </h1>
            <p className="text-xl text-white/90">
              In-depth analysis and practical guides to help you master stop-loss insurance and self-funding strategies.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* White Papers Grid or Coming Soon */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!hasWhitePapers && (
            <AnimatedSection animation="fade-up">
              <div className="text-center bg-xl-light-grey rounded-lg p-12">
                <div className="w-20 h-20 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-xl-dark-blue mb-4">
                  White Papers Coming Soon
                </h2>
                <p className="text-lg text-xl-grey max-w-2xl mx-auto mb-8">
                  Our team is working on comprehensive guides covering stop-loss insurance, self-funding strategies, compliance requirements, and market insights. Check back soon for our first publications!
                </p>
                <p className="text-xl-grey mb-6">
                  Want to be notified when new white papers are published?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-xl-bright-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-xl-dark-blue transition-all hover:scale-105"
                >
                  Stay in Touch
                </Link>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Topics We'll Cover */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              Topics We Cover
            </h2>
            <p className="text-lg text-xl-grey max-w-3xl mx-auto">
              Our white papers address the most pressing challenges brokers face in stop-loss and self-funding
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(categoryLabels).map(([category, label]) => (
              <AnimatedSection key={category} animation="fade-up">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-xl-dark-blue mb-2">{label}</h3>
                  <p className="text-sm text-xl-grey">
                    {category === 'stop-loss' && 'Attachment points, contract language, carrier selection, and placement strategies'}
                    {category === 'self-funding' && 'Feasibility analysis, implementation best practices, and success factors'}
                    {category === 'compliance' && 'ERISA, COBRA, ACA requirements, and regulatory updates'}
                    {category === 'market-analysis' && 'Carrier trends, pricing dynamics, and market opportunities'}
                    {category === 'cost-containment' && 'PBM strategies, network optimization, and claims management'}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Have a Specific Research Question?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Our team can provide custom analysis and insights tailored to your unique situation.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-white text-xl-dark-blue px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105"
            >
              Contact Our Experts
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
