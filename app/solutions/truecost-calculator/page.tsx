import Link from 'next/link'
import type { Metadata } from 'next'
import AnimatedSection from '@/components/shared/AnimatedSection'
import FIECalculatorSecure from '@/components/tools/FIECalculatorSecure'
import FeaturedExpertRotator from '@/components/shared/FeaturedExpertRotator'
import StructuredData from '@/components/seo/StructuredData'

export const metadata: Metadata = {
  title: 'TrueCost: Fully Insured Equivalent Rate Calculator | XL Benefits',
  description: 'Calculate accurate fully insured equivalent rates for self-funded groups. Compare stop-loss costs to current premiums and identify potential savings with our comprehensive FIE calculator.',
  openGraph: {
    title: 'TrueCost: Fully Insured Equivalent Rate Calculator | XL Benefits',
    description: 'Calculate accurate fully insured equivalent rates for self-funded groups. Compare stop-loss costs to current premiums and identify potential savings.',
    url: 'https://xlbenefits.com/solutions/truecost-calculator',
    siteName: 'XL Benefits',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrueCost Calculator - Fully Insured Equivalent Rates',
    description: 'Calculate accurate FIE rates for self-funded groups with our comprehensive calculator.',
  },
  alternates: {
    canonical: 'https://xlbenefits.com/solutions/truecost-calculator',
  },
}

export default function TrueCostCalculatorPage() {
  return (
    <div>
      <StructuredData
        type="software"
        name="TrueCost Calculator"
        description="Calculate accurate fully insured equivalent rates for self-funded groups with tier ratio calculations, plan differential weighting, and aggregate corridor analysis."
        category="FinanceApplication"
      />
      <StructuredData
        type="breadcrumb"
        items={[
          { name: 'Home', url: 'https://xlbenefits.com' },
          { name: 'Solutions', url: 'https://xlbenefits.com/solutions' },
          { name: 'TrueCost Calculator', url: 'https://xlbenefits.com/solutions/truecost-calculator' },
        ]}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              TrueCost: Fully Insured Equivalent Rate Calculator
            </h1>
            <div className="text-lg text-white/90 leading-relaxed space-y-4">
              <p>
                Understanding the true cost of self-funding requires more than adding up stop-loss premiums and admin fees.
                Brokers need accurate, client-ready rate comparisons that account for tier structures, plan differentials,
                and proper cost allocation across multiple benefit options.
              </p>
              <p>
                The challenge isn't just the math—it's presenting FIE rates in a format your clients can understand and trust.
                Without a systematic approach, you risk underestimating costs, misallocating expenses across tiers, or creating
                rate structures that don't reflect actual liability.
              </p>
              <p>
                Our TrueCost Calculator handles the complexity: tier ratio calculations, plan differential weighting, aggregate
                corridor analysis, and laser liability allocation. In 10 minutes, you'll have professional-grade FIE rates
                ready to present to clients with confidence.
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
              Calculate Your FIE Rates
            </h2>
            <p className="text-lg text-xl-grey max-w-3xl mx-auto">
              Follow the step-by-step wizard to input your census, current rates, and stop-loss costs.
              Get instant FIE rate calculations with detailed cost breakdowns.
            </p>
          </AnimatedSection>

          <FIECalculatorSecure />
        </div>
      </section>

      {/* What Your Calculation Might Miss */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              What Your Calculation Might Miss
            </h2>
            <p className="text-lg text-xl-grey max-w-3xl mx-auto">
              Even accurate FIE rates don't tell the complete self-funding story. Here are the complexities
              brokers often overlook when presenting cost comparisons:
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="bg-xl-light-grey rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Plan Design Impact on Liability</h3>
                <p className="text-xl-grey leading-relaxed">
                  FIE rates assume your plan design stays constant. But changes to deductibles, copays, or network
                  structures can dramatically shift claims liability—and those changes don't show up in static FIE
                  calculations until it's too late.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-xl-light-grey rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Stop-Loss Contract Variations</h3>
                <p className="text-xl-grey leading-relaxed">
                  Not all stop-loss quotes are apples-to-apples. Contract provisions like terminal liability,
                  12/12 vs. 12/15 contracts, and laser carve-outs can change your effective cost by 10-15%
                  without appearing in headline rates.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div className="bg-xl-light-grey rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Mid-Year Enrollment Changes</h3>
                <p className="text-xl-grey leading-relaxed">
                  FIE calculations use static census data, but real groups add employees, change tiers, and
                  experience life events throughout the year. Budget accuracy requires modeling these dynamics—
                  something standard FIE formulas can't do.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={400}>
              <div className="bg-xl-light-grey rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Administrative Overhead Reality</h3>
                <p className="text-xl-grey leading-relaxed">
                  The $35 PEPM admin fee in your quote might not include COBRA administration, Form 5500 filing,
                  ACA compliance support, or audit assistance. Hidden admin costs can add $10-20 PEPM to your
                  true self-funding expense.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={500}>
              <div className="bg-xl-light-grey rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Cash Flow Timing Mismatches</h3>
                <p className="text-xl-grey leading-relaxed">
                  Even if annual costs match your FIE calculation, monthly volatility can create cash flow problems.
                  Fully-insured rates spread costs evenly; self-funding creates peaks and valleys that strain
                  smaller employers' working capital.
                </p>
              </div>
            </AnimatedSection>
          </div>

          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex items-center bg-xl-bright-blue text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-xl-dark-blue transition-all hover:scale-105"
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
              Real-World FIE Analysis Success Stories
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="bg-xl-light-grey rounded-lg p-8 h-full">
                <div className="inline-block bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  23% First-Year Savings
                </div>
                <h3 className="text-2xl font-bold text-xl-dark-blue mb-4">
                  Regional Healthcare Provider Uncovers Hidden Savings
                </h3>
                <p className="text-xl-grey leading-relaxed mb-4">
                  <strong>Challenge:</strong> A 180-employee healthcare provider was quoted fully-insured renewal
                  rates 18% higher than the previous year. Their broker suspected self-funding could save money but
                  needed accurate FIE calculations to present a compelling case.
                </p>
                <p className="text-xl-grey leading-relaxed mb-4">
                  <strong>Solution:</strong> Using our TrueCost Calculator, the broker created detailed FIE rate
                  comparisons across four plan tiers. The analysis revealed that even with conservative stop-loss
                  coverage and high admin fees, self-funding would save 23% compared to the renewal.
                </p>
                <p className="text-xl-grey leading-relaxed">
                  <strong>Result:</strong> The client moved to self-funding and saved $340,000 in year one. The
                  detailed FIE analysis gave leadership confidence to make the switch, and the broker strengthened
                  their advisory relationship by demonstrating sophisticated cost modeling.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-xl-light-grey rounded-lg p-8 h-full">
                <div className="inline-block bg-xl-bright-blue text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Avoided $180K Mistake
                </div>
                <h3 className="text-2xl font-bold text-xl-dark-blue mb-4">
                  Manufacturing Firm Stays Fully-Insured After FIE Analysis
                </h3>
                <p className="text-xl-grey leading-relaxed mb-4">
                  <strong>Challenge:</strong> A 95-employee manufacturer wanted to self-fund after hearing success
                  stories from peers. Initial rough calculations suggested 15% savings, but the broker wanted to
                  verify before recommending the switch.
                </p>
                <p className="text-xl-grey leading-relaxed mb-4">
                  <strong>Solution:</strong> The TrueCost Calculator revealed that once proper tier ratios, lasers
                  for two high-risk employees, and realistic admin costs were included, self-funding would actually
                  cost 8% more than their current fully-insured rates.
                </p>
                <p className="text-xl-grey leading-relaxed">
                  <strong>Result:</strong> The client stayed fully-insured, avoiding a $180,000 mistake and
                  significant operational burden. The broker's credibility soared by preventing a costly error,
                  and they used the FIE analysis to negotiate a better fully-insured renewal instead.
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
                <div className="text-sm text-xl-bright-blue font-semibold mb-2">TOOL</div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">
                  Self-Funding Readiness Assessment
                </h3>
                <p className="text-xl-grey mb-4 flex-grow">
                  Evaluate whether your client is prepared for self-funding beyond just the cost analysis.
                </p>
                <Link href="/solutions/self-funding-feasibility" className="text-xl-bright-blue font-semibold hover:text-xl-dark-blue inline-flex items-center">
                  Take Assessment
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
                  Stop-Loss Deductible Analyzer
                </h3>
                <p className="text-xl-grey mb-4 flex-grow">
                  Optimize specific and aggregate deductibles to fine-tune your self-funding strategy.
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
                <div className="text-sm text-xl-bright-blue font-semibold mb-2">RESOURCE</div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">
                  Stop-Loss Glossary
                </h3>
                <p className="text-xl-grey mb-4 flex-grow">
                  Understand key self-funding and stop-loss terms to communicate effectively with clients.
                </p>
                <Link href="/resources/glossary" className="text-xl-bright-blue font-semibold hover:text-xl-dark-blue inline-flex items-center">
                  Browse Terms
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
              Questions about your FIE analysis?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Our stop-loss experts can review your results and provide personalized guidance for your specific situation.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-white text-xl-dark-blue px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-xl"
            >
              Schedule a Consultation
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}