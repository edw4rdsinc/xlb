import Link from 'next/link'
import type { Metadata } from 'next'
import AnimatedSection from '@/components/shared/AnimatedSection'
import DeductibleAnalyzerSecure from '@/components/tools/DeductibleAnalyzerSecure'
import FeaturedExpertRotator from '@/components/shared/FeaturedExpertRotator'
import StructuredData from '@/components/seo/StructuredData'

export const metadata: Metadata = {
  title: 'Stop-Loss Deductible Analyzer | XL Benefits',
  description: 'Analyze historical claims data to find the optimal stop-loss deductible. Compare premium savings against additional claims liability to maximize your net savings.',
  openGraph: {
    title: 'Stop-Loss Deductible Analyzer | XL Benefits',
    description: 'Analyze historical claims to find optimal stop-loss deductibles. Compare premium savings vs. claims liability.',
    url: 'https://xlbenefits.com/solutions/deductible-optimization',
    siteName: 'XL Benefits',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deductible Analyzer - Optimize Stop-Loss Coverage',
    description: 'Model different deductible scenarios with actual claims history.',
  },
  alternates: {
    canonical: 'https://xlbenefits.com/solutions/deductible-optimization',
  },
}

export default function DeductibleOptimizationPage() {
  return (
    <div>
      <StructuredData
        type="software"
        name="Stop-Loss Deductible Analyzer"
        description="Analyze historical claims data to find the optimal stop-loss deductible with premium savings comparison and claims liability modeling."
        category="FinanceApplication"
      />
      <StructuredData
        type="breadcrumb"
        items={[
          { name: 'Home', url: 'https://xlbenefits.com' },
          { name: 'Solutions', url: 'https://xlbenefits.com/solutions' },
          { name: 'Deductible Analyzer', url: 'https://xlbenefits.com/solutions/deductible-optimization' },
        ]}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              Stop-Loss Deductible Analyzer
            </h1>
            <div className="text-lg text-white/90 leading-relaxed space-y-4">
              <p>
                Finding the optimal stop-loss deductible requires balancing premium savings against increased claims liability.
                Too low, and you're overpaying for coverage. Too high, and the additional risk exposure could eliminate any savings.
              </p>
              <p>
                Our analyzer uses your actual claims history to model different deductible scenarios, trending data forward
                with medical inflation to show the true financial impact of each option. In minutes, you'll see exactly how
                much you could save—or lose—at each deductible level.
              </p>
              <p>
                This tool processes up to 35 high-cost claimants across 4 years, automatically calculating excess claims
                at multiple deductible thresholds and comparing carrier quotes to identify your optimal strategy.
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
              Analyze Your Deductible Options
            </h2>
            <p className="text-lg text-xl-grey max-w-3xl mx-auto">
              Enter your historical claims data and carrier quotes to see a comprehensive analysis
              of deductible options with net savings projections.
            </p>
          </AnimatedSection>

          <DeductibleAnalyzerSecure />
        </div>
      </section>

      {/* Featured Expert - Rotating based on IP */}
      <FeaturedExpertRotator />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-4">
              What This Tool Does
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="text-center">
                <div className="w-16 h-16 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Trend Historical Claims</h3>
                <p className="text-xl-grey">
                  Applies medical inflation to bring all historical claims to future dollar values for accurate comparison
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="text-center">
                <div className="w-16 h-16 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Calculate Excess Claims</h3>
                <p className="text-xl-grey">
                  Determines claim amounts exceeding each deductible threshold to quantify additional liability
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div className="text-center">
                <div className="w-16 h-16 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Show Net Savings</h3>
                <p className="text-xl-grey">
                  Compares premium savings against increased risk to identify the deductible with maximum net benefit
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-8 text-center">
              How the Analysis Works
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-xl-bright-blue text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-xl-dark-blue mb-1">Input Historical Claims</h3>
                  <p className="text-xl-grey">
                    Enter up to 35 high-cost claimants from the past 4 years. Focus on claims that exceeded or came close to your specific deductible.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-xl-bright-blue text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-xl-dark-blue mb-1">Apply Medical Trend</h3>
                  <p className="text-xl-grey">
                    The tool trends all claims forward using your specified medical inflation rate (typically 5-10% annually) to project future costs.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-xl-bright-blue text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-xl-dark-blue mb-1">Compare Deductible Options</h3>
                  <p className="text-xl-grey">
                    Enter carrier quotes for up to 4 alternative deductibles. The analyzer calculates excess claims at each level.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-xl-bright-blue text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-xl-dark-blue mb-1">Get Net Savings Analysis</h3>
                  <p className="text-xl-grey">
                    See premium savings minus additional claims liability for each option, with a clear recommendation on the optimal deductible.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-4">
              Need Help with Stop-Loss Analysis?
            </h2>
            <p className="text-lg text-xl-grey mb-8">
              Our team can help you evaluate deductible options and develop the optimal stop-loss strategy for your clients.
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