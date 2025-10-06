import Link from 'next/link'
import ExpertBio from '@/components/shared/ExpertBio'
import AnimatedSection from '@/components/shared/AnimatedSection'
import StatsTicker from '@/components/shared/StatsTicker'

export default function HomePage() {
  const stats = [
    { value: '500+', label: 'Brokers Served' },
    { value: '95%', label: 'Client Retention' },
    { value: '$2.1B', label: 'Annual Premium Analyzed' },
    { value: '40-Point', label: 'Contract Analysis' },
    { value: '24/7', label: 'Expert Support' },
  ];

  return (
    <div>
      {/* Hero Section with Parallax */}
      <section
        className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-32 parallax-bg overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 51, 102, 0.9), rgba(0, 51, 102, 0.85)), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%230099CC\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Your Sidekick for Stop-Loss Success
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-primary-100">
              Interactive tools and expert guidance to help insurance brokers navigate stop-loss challenges with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/toolkit"
                className="bg-white text-primary-600 px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-lg"
              >
                Explore Toolkit
              </Link>
              <Link
                href="/contact"
                className="bg-primary-800 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-primary-900 transition-all hover:scale-105 border-2 border-white"
              >
                Talk to an Expert
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Ticker */}
      <StatsTicker stats={stats} />

      {/* Featured Tools */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Interactive Tools Built for Brokers
            </h2>
            <p className="text-xl text-gray-600">
              Stop guessing. Start calculating with confidence.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tool 1: COBRA Calculator */}
            <AnimatedSection animation="fade-up" delay={100}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">COBRA Calculator</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Calculate accurate COBRA rates for self-funded groups with state-specific compliance built in.
              </p>
              <Link
                href="/solutions/cobra-calculation-challenges"
                className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center"
              >
                Try Now
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            </AnimatedSection>

            {/* Tool 2: Deductible Analyzer */}
            <AnimatedSection animation="fade-up" delay={200}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Deductible Analyzer</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Optimize stop-loss deductibles with side-by-side comparison of specific and aggregate options.
              </p>
              <Link
                href="/solutions/deductible-optimization"
                className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center"
              >
                Try Now
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            </AnimatedSection>

            {/* Tool 3: Self-Funding Quiz */}
            <AnimatedSection animation="fade-up" delay={300}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Self-Funding Quiz</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Assess whether your client is ready to transition from fully-insured to self-funding in 5 minutes.
              </p>
              <Link
                href="/solutions/self-funding-feasibility"
                className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center"
              >
                Try Now
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            </AnimatedSection>

            {/* Tool 4: Agg Specific Calculator */}
            <AnimatedSection animation="fade-up" delay={400}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Agg Specific Analysis</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Compare aggregating specific deductibles vs traditional specific with ROI modeling.
              </p>
              <Link
                href="/solutions/aggregating-specific-analysis"
                className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center"
              >
                Try Now
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            </AnimatedSection>

            {/* Tool 5: Vendor Directory */}
            <AnimatedSection animation="fade-up" delay={500}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Vendor Directory</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Searchable directory of cost containment vendors with specialties and integration details.
              </p>
              <Link
                href="/solutions/cost-containment-solutions"
                className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center"
              >
                Try Now
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Broker Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Brokers Nationwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4 italic">
                "XL Benefits helped us navigate a complex renewal with multiple high claimants. Their 40-point inspection caught issues our previous MGU missed."
              </p>
              <p className="font-semibold text-gray-900">Sarah M.</p>
              <p className="text-sm text-gray-600">Benefits Broker, Texas</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4 italic">
                "The COBRA calculator alone has saved me hours every month. Having tools like this makes my job so much easier."
              </p>
              <p className="font-semibold text-gray-900">Mike R.</p>
              <p className="text-sm text-gray-600">Independent Broker, California</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4 italic">
                "They don't just quote rates - they truly analyze the contracts and find savings opportunities we wouldn't have seen on our own."
              </p>
              <p className="font-semibold text-gray-900">Jennifer L.</p>
              <p className="text-sm text-gray-600">Agency Principal, Florida</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Team Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Experts
            </h2>
            <p className="text-xl text-gray-600">
              Decades of combined stop-loss experience at your service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <ExpertBio
              name="Daron Smith"
              title="Principal, Stop-Loss Specialist"
              expertise={[
                "40-Point Contract Analysis",
                "RFP Management",
                "Carrier Negotiations"
              ]}
            />
            <ExpertBio
              name="Jennifer Martinez"
              title="Senior Account Manager"
              expertise={[
                "Self-Funding Transitions",
                "COBRA Compliance",
                "Client Relations"
              ]}
            />
            <ExpertBio
              name="Steve Johnson"
              title="Underwriting Specialist"
              expertise={[
                "Risk Assessment",
                "Deductible Optimization",
                "Claims Analysis"
              ]}
            />
          </div>

          <div className="text-center">
            <Link
              href="/how-we-help/meet-the-team"
              className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 text-lg"
            >
              Meet the Full Team
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Latest Resources
            </h2>
            <p className="text-xl text-gray-600">
              Stay informed with industry insights and best practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-sm text-primary-600 font-semibold mb-2">WHITE PAPER</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Stop-Loss 101: A Broker's Complete Guide
              </h3>
              <p className="text-gray-600 mb-4">
                Everything you need to know about stop-loss insurance, from basics to advanced strategies.
              </p>
              <Link href="/resources/white-papers" className="text-primary-600 font-semibold hover:text-primary-700">
                Download PDF →
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-sm text-primary-600 font-semibold mb-2">BLOG POST</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                5 Red Flags in Stop-Loss Contracts
              </h3>
              <p className="text-gray-600 mb-4">
                Learn what to watch for during contract reviews to protect your clients from unexpected costs.
              </p>
              <Link href="/resources/blog" className="text-primary-600 font-semibold hover:text-primary-700">
                Read More →
              </Link>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/resources"
              className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 text-lg"
            >
              View All Resources
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
