import Link from 'next/link'
import type { Metadata } from 'next'
import AnimatedSection from '@/components/shared/AnimatedSection'

export const metadata: Metadata = {
  title: 'Broker Toolkit | Free Stop-Loss Calculators & Resources',
  description: 'Quick access to interactive stop-loss tools: COBRA calculators, deductible analyzers, self-funding assessments, and vendor directories.',
  openGraph: {
    title: 'Broker Toolkit | Free Stop-Loss Calculators & Resources',
    description: 'Free interactive tools designed for insurance brokers. COBRA calculators, deductible analyzers, and more.',
    url: 'https://xlbenefits.com/toolkit',
    siteName: 'XL Benefits',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Broker Toolkit - Free Stop-Loss Calculators',
    description: 'Interactive stop-loss tools for insurance brokers. No login required.',
  },
  alternates: {
    canonical: 'https://xlbenefits.com/toolkit',
  },
}

export default function ToolkitPage() {
  return (
    <div>
      {/* Hero - Background Image with Overlay */}
      <section
        className="relative text-white overflow-hidden h-[500px] sm:h-[600px] md:h-[700px]"
        style={{
          backgroundImage: 'url(/images/parallax/toolsresources.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Overlaid Content - Centered */}
        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <AnimatedSection animation="fade-up">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 text-white drop-shadow-2xl">
                YOUR TOOLKIT
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-white/95 drop-shadow-lg max-w-2xl mx-auto">
                Free interactive tools designed for insurance brokers. No login required—just click and use.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Tool Directory */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Tool 1: TrueCost Calculator */}
            <AnimatedSection animation="fade-up" delay={100}>
              <Link href="/solutions/truecost-calculator">
                <div className="bg-white border-2 border-xl-bright-blue rounded-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-xl-dark-blue">
                        TrueCost: FIE Rate Calculator
                      </h3>
                      <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">AVAILABLE</span>
                    </div>
                  </div>
                  <p className="text-xl-grey mb-4 flex-grow text-sm leading-relaxed">
                    Calculate accurate fully insured equivalent rates for self-funded groups with state-specific compliance and administrative fee calculations.
                  </p>
                  <div className="text-xl-bright-blue font-semibold text-sm group-hover:text-xl-dark-blue inline-flex items-center">
                    Launch Tool
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            {/* Tool 2: Deductible Analyzer */}
            <AnimatedSection animation="fade-up" delay={200}>
              <Link href="/solutions/deductible-optimization">
                <div className="bg-white border-2 border-xl-bright-blue rounded-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-xl-dark-blue">
                        Stop-Loss Deductible Analyzer
                      </h3>
                      <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">NEW</span>
                    </div>
                  </div>
                  <p className="text-xl-grey mb-4 flex-grow text-sm leading-relaxed">
                    Analyze historical claims to find optimal deductibles. Compare premium savings against additional liability.
                  </p>
                  <div className="text-xl-bright-blue font-semibold text-sm group-hover:text-xl-dark-blue inline-flex items-center">
                    Launch Tool
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            {/* Tool 3: Self-Funding Assessment */}
            <AnimatedSection animation="fade-up" delay={300}>
              <Link href="/solutions/self-funding-feasibility">
                <div className="bg-white border-2 border-xl-bright-blue rounded-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-xl-dark-blue group-hover:text-xl-bright-blue transition-colors">
                        Self-Funding Readiness Assessment
                      </h3>
                      <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">Available Now</span>
                    </div>
                  </div>
                  <p className="text-xl-grey mb-4 flex-grow text-sm leading-relaxed">
                    Evaluate whether your client is truly prepared for self-funding with a comprehensive feasibility quiz.
                  </p>
                  <div className="text-xl-bright-blue font-semibold inline-flex items-center text-sm group-hover:text-xl-dark-blue transition-colors">
                    Use Tool
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            {/* Tool 4: Agg Specific Calculator */}
            <AnimatedSection animation="fade-up" delay={400}>
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 h-full flex flex-col opacity-75">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Aggregating Specific Calculator
                    </h3>
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Q2 2026</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 flex-grow text-sm leading-relaxed">
                  Analyze the ROI potential of aggregating specific deductibles versus traditional structures.
                </p>
                <div className="text-gray-500 font-semibold text-sm">
                  Coming Soon
                </div>
              </div>
            </AnimatedSection>

            {/* Tool 5: Vendor Directory */}
            <AnimatedSection animation="fade-up" delay={500}>
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 h-full flex flex-col opacity-75">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Cost Containment Vendor Directory
                    </h3>
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Q2 2026</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 flex-grow text-sm leading-relaxed">
                  Access our curated directory of vetted cost containment vendors, filterable by specialty.
                </p>
                <div className="text-gray-500 font-semibold text-sm">
                  Coming Soon
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* Usage Guide */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-8 text-center">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl-bright-blue font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-bold text-xl-dark-blue mb-2">Click & Use</h3>
                <p className="text-xl-grey text-sm">
                  No signup required. Click any tool above and start using it immediately.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl-bright-blue font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-bold text-xl-dark-blue mb-2">Get Results</h3>
                <p className="text-xl-grey text-sm">
                  See calculations instantly. Download or email PDF reports for client presentations.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl-bright-blue font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-bold text-xl-dark-blue mb-2">Get Expert Help</h3>
                <p className="text-xl-grey text-sm">
                  Every tool includes access to our team for complex scenarios and questions.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-8 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-xl-bright-blue pl-6">
                <h3 className="font-bold text-xl-dark-blue mb-2">Do I need to create an account?</h3>
                <p className="text-xl-grey">
                  No. All tools are free and require no login or registration. Just click and use.
                </p>
              </div>

              <div className="border-l-4 border-xl-bright-blue pl-6">
                <h3 className="font-bold text-xl-dark-blue mb-2">Are the calculations accurate?</h3>
                <p className="text-xl-grey">
                  Yes. Our tools are built by stop-loss experts with 20+ years of industry experience and are regularly updated to reflect current regulations and carrier practices.
                </p>
              </div>

              <div className="border-l-4 border-xl-bright-blue pl-6">
                <h3 className="font-bold text-xl-dark-blue mb-2">Can I share results with clients?</h3>
                <p className="text-xl-grey">
                  Absolutely. All tools generate PDF reports you can download or email directly to clients.
                </p>
              </div>

              <div className="border-l-4 border-xl-bright-blue pl-6">
                <h3 className="font-bold text-xl-dark-blue mb-2">What if I have questions about my results?</h3>
                <p className="text-xl-grey">
                  Every tool includes a "Talk to an Expert" button. Our team is available to help you interpret results and handle complex scenarios.
                </p>
              </div>

              <div className="border-l-4 border-xl-bright-blue pl-6">
                <h3 className="font-bold text-xl-dark-blue mb-2">Will you add more tools?</h3>
                <p className="text-xl-grey">
                  Yes. We're continuously building new tools based on broker feedback. If there's a tool you need, <Link href="/contact" className="text-xl-bright-blue hover:underline">let us know</Link>.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Need a custom tool for your specific situation?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              We build custom calculators and analysis tools for complex scenarios.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-white text-xl-dark-blue px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105"
            >
              Contact Our Team
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
