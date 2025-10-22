import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function HowWeHelpPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative py-24 min-h-[600px] flex items-center"
        style={{
          backgroundImage: 'url("/images/parallax/how-we-help.jpg")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <AnimatedSection animation="fade-up" className="ml-auto max-w-2xl text-right">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 drop-shadow-lg" style={{ color: '#ebc583', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
              How We Help Brokers Win
            </h1>
            <p className="text-xl drop-shadow-lg" style={{ color: '#ebc583', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
              Expert stop-loss guidance, market access, and tools to serve your clients better.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <p className="text-lg text-xl-grey leading-relaxed mb-4">
              The difference between a good stop-loss placement and a great one often comes down to the details most people miss. XL Benefits exists to handle that complexity for you—bringing meticulous analysis, deep carrier relationships, and genuine partnership to every case.
            </p>
            <p className="text-lg text-xl-grey leading-relaxed">
              Whether you're managing a straightforward renewal or navigating a challenging placement, we provide the expertise and access you need to present confident solutions to your clients.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              Our Services
            </h2>
            <p className="text-xl text-xl-grey max-w-3xl mx-auto">
              Comprehensive support across every aspect of self-funding
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-8">

            <AnimatedSection animation="fade-up" delay={100}>
              <div className="bg-white rounded-lg shadow-md p-8 h-full">
                <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-xl-dark-blue mb-4">
                  Stop Loss Marketing
                </h3>
                <p className="text-xl-grey mb-4 leading-relaxed">
                  Your team is busy and stop loss probably isn't your core business. We simplify the process and provide access to more markets through our streamlined approach.
                </p>
                <ul className="space-y-2 text-xl-grey">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Strategic planning</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Data collection & evaluation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Comprehensive market analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Expert proposal presentation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Coverage finalization</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ongoing monitoring</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-white rounded-lg shadow-md p-8 h-full">
                <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-xl-dark-blue mb-4">
                  Self-Funded Consulting
                </h3>
                <p className="text-xl-grey mb-4 leading-relaxed">
                  Because there's more to self-funding than just stop loss marketing. We provide comprehensive guidance across all aspects of your self-funded programs.
                </p>
                <ul className="space-y-2 text-xl-grey">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Fully insured analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Self-funding education</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>PBM evaluation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Claims analysis & oversight</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>SPD & contract evaluation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Cost containment advice</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div className="bg-white rounded-lg shadow-md p-8 h-full">
                <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-xl-dark-blue mb-4">
                  Financial Forecasting
                </h3>
                <p className="text-xl-grey mb-4 leading-relaxed">
                  While we haven't found a crystal ball that can predict future claims and costs, we subscribe to actuarial principles that get us close.
                </p>
                <ul className="space-y-2 text-xl-grey">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Claim projections</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Fully insured equivalent rates</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>COBRA calculations</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Actuarial principle-based analysis</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={400}>
              <div className="bg-white rounded-lg shadow-md p-8 h-full">
                <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-xl-dark-blue mb-4">
                  Education & Training
                </h3>
                <p className="text-xl-grey mb-4 leading-relaxed">
                  Daron is a nationally recognized educator on stop-loss and self-funding strategy. Whether you're new to self-funding or looking to deepen your team's expertise, we offer flexible training options.
                </p>
                <ul className="space-y-2 text-xl-grey">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Live webinars on specific topics</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Multi-day training programs</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>In-person & virtual options</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Custom curriculum for your team</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Continuing education credits</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* Tools & Solutions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              Tools & Solutions for Common Challenges
            </h2>
            <p className="text-xl text-xl-grey max-w-3xl mx-auto">
              Expert solutions for the stop-loss challenges brokers face every day
            </p>
          </AnimatedSection>

          <div className="space-y-12">

            {/* Challenge 1: COBRA Calculation */}
            <AnimatedSection animation="fade-up">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-block bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    COMMON CHALLENGE
                  </div>
                  <h3 className="text-3xl font-bold text-xl-dark-blue mb-4">
                    "How do I calculate fully insured equivalent rates accurately?"
                  </h3>
                  <p className="text-xl-grey mb-4 leading-relaxed">
                    Fully insured equivalent rates for self-funded plans are notoriously complex. State-specific rules, administrative fee caps, coverage tier variations, and monthly adjustments create a compliance minefield.
                  </p>
                  <p className="text-xl-grey mb-6 leading-relaxed">
                    Let us help.
                  </p>
                  <Link
                    href="/toolkit#cobra-calculator"
                    className="inline-flex items-center bg-xl-bright-blue px-6 py-3 rounded-md font-semibold hover:bg-xl-dark-blue transition-colors"
                    style={{ color: 'white' }}
                  >
                    Try the TrueCost Calculator
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-xl-light-grey rounded-lg p-8">
                  <h4 className="text-xl font-bold text-xl-dark-blue mb-4">Our Solution:</h4>
                  <ul className="space-y-3 text-xl-grey">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>State-specific compliance rules built in</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Automatic administrative fee calculations (2% cap compliance)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Coverage tier breakdowns (employee, spouse, children, family)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Client-ready PDF reports you can share with confidence</span>
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            <hr className="border-xl-light-grey" />

            {/* Challenge 2: Deductible Optimization */}
            <AnimatedSection animation="fade-up">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="md:order-2">
                  <div className="inline-block bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    COMMON CHALLENGE
                  </div>
                  <h3 className="text-3xl font-bold text-xl-dark-blue mb-4">
                    "Which deductible structure will actually save my client money?"
                  </h3>
                  <p className="text-xl-grey mb-4 leading-relaxed">
                    Specific deductibles, aggregate deductibles, aggregating specific deductibles—the options multiply quickly, and so does the confusion.
                  </p>
                  <p className="text-xl-grey mb-6 leading-relaxed">
                    Without side-by-side scenario analysis, you're making recommendations based on gut feel instead of data.
                  </p>
                  <Link
                    href="/toolkit#deductible-analyzer"
                    className="inline-flex items-center bg-xl-bright-blue px-6 py-3 rounded-md font-semibold hover:bg-xl-dark-blue transition-colors"
                    style={{ color: 'white' }}
                  >
                    Try the Deductible Analyzer
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-xl-light-grey rounded-lg p-8 md:order-1">
                  <h4 className="text-xl font-bold text-xl-dark-blue mb-4">Our Solution:</h4>
                  <ul className="space-y-3 text-xl-grey">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Compare multiple deductible structures side-by-side</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Model different claims scenarios (best case, worst case, expected)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>See total cost impact with premium + out-of-pocket breakdowns</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Data-driven recommendations you can defend</span>
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            <hr className="border-xl-light-grey" />

            {/* Challenge 3: Self-Funding Readiness */}
            <AnimatedSection animation="fade-up">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-block bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    COMMON CHALLENGE
                  </div>
                  <h3 className="text-3xl font-bold text-xl-dark-blue mb-4">
                    "Is my client really ready to self-fund, or am I setting them up for disaster?"
                  </h3>
                  <p className="text-xl-grey mb-4 leading-relaxed">
                    Self-funding isn't right for every group. Cash flow constraints, administrative capacity, claims volatility, and risk tolerance all factor in—but most brokers only evaluate one or two of these.
                  </p>
                  <p className="text-xl-grey mb-6 leading-relaxed">
                    Transitioning the wrong client to self-funding can damage your reputation and your relationship.
                  </p>
                  <Link
                    href="/toolkit#readiness-assessment"
                    className="inline-flex items-center bg-xl-bright-blue px-6 py-3 rounded-md font-semibold hover:bg-xl-dark-blue transition-colors"
                    style={{ color: 'white' }}
                  >
                    Try the Readiness Assessment
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-xl-light-grey rounded-lg p-8">
                  <h4 className="text-xl font-bold text-xl-dark-blue mb-4">Our Solution:</h4>
                  <ul className="space-y-3 text-xl-grey">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Comprehensive 4-section assessment (financial, claims, admin, risk)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Scored results with clear go/no-go recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Identifies risks before they become problems</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Customized stop-loss recommendations based on group size</span>
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            <hr className="border-xl-light-grey" />

            {/* Challenge 4: Aggregating Specific Deductibles */}
            <AnimatedSection animation="fade-up">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="md:order-2">
                  <div className="inline-block bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    COMMON CHALLENGE
                  </div>
                  <h3 className="text-3xl font-bold text-xl-dark-blue mb-4">
                    "Should my client consider aggregating specific deductibles?"
                  </h3>
                  <p className="text-xl-grey mb-4 leading-relaxed">
                    Aggregating specific deductibles can offer significant cost savings for the right groups, but calculating the actual ROI requires complex modeling that most brokers don't have time for.
                  </p>
                  <p className="text-xl-grey mb-6 leading-relaxed">
                    Without accurate analysis, you might miss opportunities to save clients thousands—or recommend a structure that costs them more.
                  </p>
                  <Link
                    href="/solutions/aggregating-specific-analysis"
                    className="inline-flex items-center bg-xl-bright-blue px-6 py-3 rounded-md font-semibold hover:bg-xl-dark-blue transition-colors"
                    style={{ color: 'white' }}
                  >
                    Try the Aggregating Specific Calculator
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-xl-light-grey rounded-lg p-8 md:order-1">
                  <h4 className="text-xl font-bold text-xl-dark-blue mb-4">Our Solution:</h4>
                  <ul className="space-y-3 text-xl-grey">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Compare traditional vs. aggregating specific structures</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Calculate potential savings based on claims history</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Model different claim scenarios to assess risk vs. reward</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Clear ROI analysis to support your recommendations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* Three Cards Section */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">

            <AnimatedSection animation="fade-up" delay={100}>
              <Link href="/how-we-help/our-process">
                <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col group">
                  <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-xl-dark-blue mb-3 group-hover:text-xl-bright-blue transition-colors">
                    Our Process
                  </h2>
                  <p className="text-xl-grey mb-6 flex-grow leading-relaxed">
                    Meticulous 40-point inspection, expert RFP management, and what to expect when partnering with us.
                  </p>
                  <span className="text-xl-bright-blue font-semibold inline-flex items-center group-hover:text-xl-dark-blue transition-colors">
                    Learn About Our Process
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <Link href="/how-we-help/meet-the-team">
                <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col group">
                  <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-xl-dark-blue mb-3 group-hover:text-xl-bright-blue transition-colors">
                    Meet the Team
                  </h2>
                  <p className="text-xl-grey mb-6 flex-grow leading-relaxed">
                    Meet our specialists, their areas of expertise, and how to connect with the right person for your needs.
                  </p>
                  <span className="text-xl-bright-blue font-semibold inline-flex items-center group-hover:text-xl-dark-blue transition-colors">
                    Meet the Team
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <Link href="/how-we-help/why-brokers-choose-us">
                <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col group">
                  <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-xl-dark-blue mb-3 group-hover:text-xl-bright-blue transition-colors">
                    Why Choose Us
                  </h2>
                  <p className="text-xl-grey mb-6 flex-grow leading-relaxed">
                    What sets us apart: our approach, proven results, and 25+ carrier relationships.
                  </p>
                  <span className="text-xl-bright-blue font-semibold inline-flex items-center group-hover:text-xl-dark-blue transition-colors">
                    See Why Brokers Choose Us
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to experience the XL Benefits difference?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Let's discuss your next stop-loss challenge.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-white text-xl-dark-blue px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105"
            >
              Schedule a Conversation
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
