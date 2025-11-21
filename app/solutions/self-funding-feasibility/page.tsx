import Link from 'next/link'
import type { Metadata } from 'next'
import AnimatedSection from '@/components/shared/AnimatedSection'
import SelfFundingQuizClient from '@/components/tools/SelfFundingQuizClient'
import FeaturedExpertRotator from '@/components/shared/FeaturedExpertRotator'

export const metadata: Metadata = {
  title: 'Self-Funding Readiness Assessment for Group Health Plans',
  description: 'Free 10-minute assessment to evaluate if your client is ready for self-funded health insurance. Get personalized recommendations on financial readiness, claims patterns, and administrative capabilities.',
  openGraph: {
    title: 'Self-Funding Readiness Assessment | XL Benefits',
    description: 'Is your client ready for self-funding? Take our free 10-minute assessment and get personalized recommendations on financial readiness, risk tolerance, and administrative infrastructure.',
    type: 'website',
    url: 'https://xlbenefits.com/solutions/self-funding-feasibility',
    images: [
      {
        url: '/images/og/self-funding-readiness-assessment.png',
        width: 1200,
        height: 630,
        alt: 'Self-Funding Readiness Assessment Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Self-Funding Readiness Assessment | XL Benefits',
    description: 'Free 10-minute quiz: Is your client ready for self-funded health insurance?',
    images: ['/images/og/self-funding-readiness-assessment.png'],
  },
}

export default function SelfFundingFeasibilityPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white min-h-[50vh] flex items-center">
        {/* Desktop Background */}
        <div
          className="hidden md:block absolute inset-0"
          style={{
            backgroundImage: 'url(/images/parallax/self-funding-assessment.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Mobile Background - adjusted positioning */}
        <div
          className="md:hidden absolute inset-0"
          style={{
            backgroundImage: 'url(/images/parallax/self-funding-assessment.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
          <AnimatedSection animation="fade-up">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white drop-shadow-lg">
              Self-Funding Readiness Assessment for Group Health Plans
            </h1>
            <div className="text-lg text-white/90 leading-relaxed space-y-4">
              <p>
                Self-funding can deliver significant savings—but only when the timing is right. Many brokers face clients eager to reduce costs without understanding the financial risks, administrative demands, or operational requirements that make self-funding successful.
              </p>
              <p>
                The challenge isn't just analyzing claims data. It's knowing what questions to ask, which red flags to watch for, and how to objectively assess whether a client has the infrastructure and risk tolerance to handle self-funding responsibly.
              </p>
              <p>
                Our Self-Funding Readiness Assessment evaluates the complete picture: cash flow capacity, claims volatility, administrative infrastructure, and organizational readiness. In 10 minutes, you'll gain clarity on whether your client should proceed, wait, or stay fully-insured.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Video Explainer Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              Understanding Self-Funding: A Quick Guide
            </h2>
            <p className="text-lg text-xl-grey max-w-3xl mx-auto">
              Watch this 3-minute video to understand the key factors that determine self-funding readiness.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up">
            <div className="w-full aspect-video bg-xl-light-grey rounded-lg shadow-xl overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube-nocookie.com/embed/hEDmoBgU3VU?rel=0"
                title="Self-Funding Assessment Explainer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up">
            <div className="mt-8 text-center">
              <p className="text-sm text-xl-grey">
                Want a personalized consultation? Our experts can walk you through the assessment in detail.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Assessment Tool */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              Get Your Personalized Readiness Report
            </h2>
            <p className="text-lg text-xl-grey max-w-3xl mx-auto">
              Complete our comprehensive assessment to receive detailed results and recommendations. A member of our team will follow up to discuss your specific situation.
            </p>
          </AnimatedSection>

          <SelfFundingQuizClient />
        </div>
      </section>

      {/* What Your Assessment Might Miss */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              What Your Assessment Might Miss
            </h2>
            <p className="text-lg text-xl-grey max-w-3xl mx-auto">
              Even a strong assessment score doesn't tell the complete story. Here's what brokers often overlook when evaluating self-funding readiness:
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="bg-xl-light-grey rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Cash Flow Timing Risks</h3>
                <p className="text-xl-grey leading-relaxed">
                  Monthly claim volatility can create unexpected shortfalls even when annual budgets look solid. Understanding payment cycles, claim processing timelines, and reserve requirements is critical to avoiding cash crunches.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-xl-light-grey rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Administrative Infrastructure</h3>
                <p className="text-xl-grey leading-relaxed">
                  Self-funding requires robust TPA capabilities, internal HR capacity for compliance management, and systems to handle ERISA requirements, COBRA administration, and regulatory reporting. Many organizations underestimate these demands.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div className="bg-xl-light-grey rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Stop-Loss Contract Nuances</h3>
                <p className="text-xl-grey leading-relaxed">
                  Selecting the right specific deductible, understanding aggregate attachment points, and navigating laser provisions can make or break a self-funding program. Poor contract structure exposes clients to unnecessary risk.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={400}>
              <div className="bg-xl-light-grey rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Claims Run-Out Liability</h3>
                <p className="text-xl-grey leading-relaxed">
                  Transitioning from fully-insured to self-funded creates financial exposure for claims incurred but not reported. Clients need adequate reserves and clear run-out strategies to avoid unexpected liabilities.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={500}>
              <div className="bg-xl-light-grey rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Vendor Network Quality</h3>
                <p className="text-xl-grey leading-relaxed">
                  Success depends on strong partnerships with the right PBM, PPO network, and cost containment vendors. Weak vendor relationships undermine the savings self-funding should deliver.
                </p>
              </div>
            </AnimatedSection>
          </div>

          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex items-center bg-xl-bright-blue px-8 py-4 rounded-md font-semibold text-lg hover:bg-xl-dark-blue transition-all hover:scale-105 text-white hover:text-white"
              style={{ color: '#FFFFFF' }}
            >
              Talk to an Expert About Your Results
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Expert - Rotating based on IP */}
      <FeaturedExpertRotator />

      {/* Real-World Case Studies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              Real-World Case Studies
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="bg-xl-light-grey rounded-lg p-8 h-full">
                <div className="inline-block bg-xl-bright-blue text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Successful Immediate Transition
                </div>
                <h3 className="text-2xl font-bold text-xl-dark-blue mb-4">
                  Manufacturing Group Saves $180K in Year One
                </h3>
                <p className="text-xl-grey leading-relaxed mb-4">
                  <strong>Challenge:</strong> A 250-employee manufacturing company faced a 22% premium increase on their fully-insured plan renewal. They had stable claims, strong cash reserves, and experienced HR leadership but had never considered self-funding.
                </p>
                <p className="text-xl-grey leading-relaxed mb-4">
                  <strong>Solution:</strong> Our assessment revealed excellent readiness across all categories. We structured a self-funded plan with appropriate stop-loss coverage and connected them with a experienced TPA.
                </p>
                <p className="text-xl-grey leading-relaxed">
                  <strong>Result:</strong> First-year savings of $180,000 with improved plan flexibility. The client maintained $120,000 in surplus reserves and enhanced their wellness programs.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-xl-light-grey rounded-lg p-8 h-full">
                <div className="inline-block bg-yellow-500 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Strategic Delayed Transition
                </div>
                <h3 className="text-2xl font-bold text-xl-dark-blue mb-4">
                  Tech Startup Waits 18 Months, Then Succeeds
                </h3>
                <p className="text-xl-grey leading-relaxed mb-4">
                  <strong>Challenge:</strong> A fast-growing 120-employee tech startup wanted immediate self-funding to control costs. Our assessment revealed inadequate cash reserves and limited HR infrastructure despite strong growth.
                </p>
                <p className="text-xl-grey leading-relaxed mb-4">
                  <strong>Solution:</strong> We recommended waiting 18 months to build reserves, hire dedicated benefits staff, and stabilize their workforce growth. We provided a detailed preparation roadmap.
                </p>
                <p className="text-xl-grey leading-relaxed">
                  <strong>Result:</strong> After following our recommendations, they successfully transitioned to self-funding with $240,000 saved in the first two years and avoided the cash flow problems that derailed a competitor's attempt.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              Related Resources
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="bg-white rounded-lg p-6 h-full flex flex-col hover:shadow-lg transition-shadow">
                <div className="text-sm text-xl-bright-blue font-semibold mb-2">WHITE PAPER</div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">
                  Stop-Loss 101
                </h3>
                <p className="text-xl-grey mb-4 flex-grow">
                  Comprehensive guide to understanding stop-loss insurance fundamentals.
                </p>
                <Link href="/resources/white-papers" className="text-xl-bright-blue font-semibold hover:text-xl-dark-blue inline-flex items-center">
                  Download PDF
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-white rounded-lg p-6 h-full flex flex-col hover:shadow-lg transition-shadow">
                <div className="text-sm text-xl-bright-blue font-semibold mb-2">TOOL</div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">
                  Deductible Optimization Tool
                </h3>
                <p className="text-xl-grey mb-4 flex-grow">
                  Analyze specific vs. aggregate deductible structures for your clients.
                </p>
                <Link href="/solutions/deductible-optimization" className="text-xl-bright-blue font-semibold hover:text-xl-dark-blue inline-flex items-center">
                  Try This Tool
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div className="bg-white rounded-lg p-6 h-full flex flex-col hover:shadow-lg transition-shadow">
                <div className="text-sm text-xl-bright-blue font-semibold mb-2">BLOG POST</div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">
                  Common Self-Funding Mistakes
                </h3>
                <p className="text-xl-grey mb-4 flex-grow">
                  Learn from real-world scenarios where timing and preparation made the difference.
                </p>
                <Link href="/resources/blog" className="text-xl-bright-blue font-semibold hover:text-xl-dark-blue inline-flex items-center">
                  Read More
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Questions about your assessment results?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Schedule a consultation with Jennifer or another member of our team.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-white text-xl-dark-blue px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-xl"
            >
              Schedule a Conversation
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
