import Link from 'next/link'
import type { Metadata } from 'next'
import AnimatedSection from '@/components/shared/AnimatedSection'
import AVCalculatorSecure from '@/components/tools/AVCalculatorSecure'
import FeaturedExpertRotator from '@/components/shared/FeaturedExpertRotator'
import LinkedInShareButton from '@/components/shared/LinkedInShareButton'
import StructuredData from '@/components/seo/StructuredData'

export const metadata: Metadata = {
  title: 'Actuarial Value Calculator | XL Benefits',
  description: 'Calculate the actuarial value of health insurance plans. Determine metal tier classification (Bronze, Silver, Gold, Platinum) for ACA compliance and accurate plan comparison.',
  openGraph: {
    title: 'Actuarial Value Calculator | XL Benefits',
    description: 'Calculate plan AV and determine metal tier classification. Ensure ACA compliance and compare plan values accurately.',
    url: 'https://xlbenefits.com/toolkit/av-calculator',
    siteName: 'XL Benefits',
    type: 'website',
    images: [
      {
        url: '/images/og/av-calculator.png',
        width: 1200,
        height: 630,
        alt: 'Actuarial Value Calculator Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Actuarial Value Calculator - Determine Metal Tier',
    description: 'Calculate AV percentage and metal tier classification for health plans.',
    images: ['/images/og/av-calculator.png'],
  },
  alternates: {
    canonical: 'https://xlbenefits.com/toolkit/av-calculator',
  },
}

export default function AVCalculatorPage() {
  return (
    <div>
      <StructuredData
        type="software"
        name="Actuarial Value Calculator"
        description="Calculate the actuarial value percentage and metal tier classification for health insurance plans. Ensures ACA compliance and accurate plan comparison."
        category="FinanceApplication"
      />
      <StructuredData
        type="breadcrumb"
        items={[
          { name: 'Home', url: 'https://xlbenefits.com' },
          { name: 'Toolkit', url: 'https://xlbenefits.com/toolkit' },
          { name: 'AV Calculator', url: 'https://xlbenefits.com/toolkit/av-calculator' },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              Actuarial Value Calculator
            </h1>
            <div className="text-lg text-white/90 leading-relaxed space-y-4">
              <p>
                Actuarial Value (AV) is a key metric that determines how much of total healthcare costs
                a health plan covers versus what enrollees pay through deductibles, copays, and coinsurance.
                Under the Affordable Care Act, plans must fall within specific AV ranges to qualify for
                Bronze, Silver, Gold, or Platinum metal tier classification.
              </p>
              <p>
                Our calculator uses plan cost-sharing details to compute the precise AV percentage and
                automatically determines the appropriate metal tier. Whether you're designing new plans,
                ensuring ACA compliance, or helping clients compare coverage options, this tool provides
                the accurate calculations you need.
              </p>
              <p>
                Input deductibles, copays, coinsurance rates, and other cost-sharing parameters to instantly
                see the plan's actuarial value and metal tier designation. Perfect for brokers, consultants,
                and plan designers working with ACA-compliant health insurance.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              Calculate Your Plan's Actuarial Value
            </h2>
            <p className="text-lg text-xl-grey max-w-3xl mx-auto">
              Enter your plan's cost-sharing details to calculate the actuarial value percentage
              and determine the appropriate metal tier classification.
            </p>
          </AnimatedSection>

          <AVCalculatorSecure />
        </div>
      </section>

      {/* Share This Tool */}
      <section className="py-12 bg-xl-light-grey">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <LinkedInShareButton
            url="https://xlbenefits.com/toolkit/av-calculator"
            title="Actuarial Value Calculator"
            description="I just used the Actuarial Value Calculator from XL Benefits to determine metal tier classifications. This tool makes AV calculations and ACA compliance checks so much easier. Check it out:"
          />
        </div>
      </section>

      {/* Featured Expert - Rotating based on IP */}
      <FeaturedExpertRotator />

      {/* What is Actuarial Value? */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-8 text-center">
              Understanding Actuarial Value
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-xl-dark-blue mb-3">
                  What is Actuarial Value?
                </h3>
                <p className="text-xl-grey">
                  Actuarial Value represents the percentage of total average healthcare costs that a health plan
                  will cover for a standard population. For example, a plan with 70% AV means the plan pays 70%
                  of covered healthcare costs, while enrollees pay 30% through cost-sharing (deductibles, copays,
                  and coinsurance).
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-xl-dark-blue mb-3">
                  Metal Tier Classifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-32 font-semibold text-xl-dark-blue flex-shrink-0">
                      Bronze (60%)
                    </div>
                    <p className="text-xl-grey">
                      Plan pays approximately 60% of costs. AV range: 58-62%
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-32 font-semibold text-xl-dark-blue flex-shrink-0">
                      Silver (70%)
                    </div>
                    <p className="text-xl-grey">
                      Plan pays approximately 70% of costs. AV range: 68-72%
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-32 font-semibold text-xl-dark-blue flex-shrink-0">
                      Gold (80%)
                    </div>
                    <p className="text-xl-grey">
                      Plan pays approximately 80% of costs. AV range: 78-82%
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-32 font-semibold text-xl-dark-blue flex-shrink-0">
                      Platinum (90%)
                    </div>
                    <p className="text-xl-grey">
                      Plan pays approximately 90% of costs. AV range: 88-92%
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-xl-dark-blue mb-3">
                  Why AV Matters for Brokers
                </h3>
                <ul className="space-y-2 text-xl-grey">
                  <li className="flex items-start">
                    <span className="text-xl-bright-blue mr-2">•</span>
                    <span>Ensures ACA compliance for marketplace and group health plans</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl-bright-blue mr-2">•</span>
                    <span>Enables accurate plan-to-plan comparisons beyond just premium costs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl-bright-blue mr-2">•</span>
                    <span>Helps clients understand true out-of-pocket exposure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl-bright-blue mr-2">•</span>
                    <span>Required for subsidy eligibility determinations in exchanges</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl-bright-blue mr-2">•</span>
                    <span>Validates carrier-provided metal tier classifications</span>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-4">
              Calculator Features
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="text-center">
                <div className="w-16 h-16 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Comprehensive Inputs</h3>
                <p className="text-xl-grey">
                  Captures all cost-sharing parameters including deductibles, copays, coinsurance, and MOOPs
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="text-center">
                <div className="w-16 h-16 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-2">ACA Compliance Check</h3>
                <p className="text-xl-grey">
                  Validates metal tier classification and identifies any compliance issues
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div className="text-center">
                <div className="w-16 h-16 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Visual Results</h3>
                <p className="text-xl-grey">
                  Clear display of AV percentage, metal tier, and breakdown showing plan vs. enrollee costs
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-8 text-center">
              How to Use the Calculator
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-xl-bright-blue text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-xl-dark-blue mb-1">Enter Plan Basics</h3>
                  <p className="text-xl-grey">
                    Optionally provide a plan name and estimated metal tier for reference.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-xl-bright-blue text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-xl-dark-blue mb-1">Input Deductibles & MOOPs</h3>
                  <p className="text-xl-grey">
                    Enter individual and family deductibles and maximum out-of-pocket limits. Specify whether deductibles are integrated (medical + drug) or separate.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-xl-bright-blue text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-xl-dark-blue mb-1">Add Cost-Sharing Details</h3>
                  <p className="text-xl-grey">
                    Input copays and coinsurance rates for office visits, emergency services, hospital care, imaging, labs, and prescription drugs.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-xl-bright-blue text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-xl-dark-blue mb-1">Calculate & Review Results</h3>
                  <p className="text-xl-grey">
                    Submit the form to calculate the actuarial value. Review the AV percentage, metal tier classification, cost breakdown, and compliance status.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-4">
              Need Help with Plan Design?
            </h2>
            <p className="text-lg text-xl-grey mb-8">
              Our team can help you design ACA-compliant health plans, optimize cost-sharing structures,
              and ensure accurate metal tier classifications for your clients.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-xl-bright-blue text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-xl-dark-blue transition-all hover:scale-105"
            >
              Contact Our Experts
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
