import Link from 'next/link'
import type { Metadata } from 'next'
import AnimatedSection from '@/components/shared/AnimatedSection'

export const metadata: Metadata = {
  title: 'Solutions for Common Stop-Loss Challenges | XL Benefits',
  description: 'Expert solutions for the stop-loss challenges brokers face every day: COBRA complexity, deductible optimization, self-funding transitions, and cost containment.',
}

export default function SolutionsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Every Stop-Loss Challenge Has a Solution
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              You know the pain points: complex COBRA calculations, deductible confusion, risky self-funding transitions, and cost containment pressure. We've built expert solutions for each one.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Problem-Solution Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">

            {/* Challenge 1: COBRA Calculation */}
            <AnimatedSection animation="fade-up">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-block bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    COMMON CHALLENGE
                  </div>
                  <h2 className="text-3xl font-bold text-xl-dark-blue mb-4">
                    "How do I calculate COBRA rates without risking compliance errors?"
                  </h2>
                  <p className="text-xl-grey mb-4 leading-relaxed">
                    COBRA rate calculations for self-funded plans are notoriously complex. State-specific rules, administrative fee caps, coverage tier variations, and monthly adjustments create a compliance minefield.
                  </p>
                  <p className="text-xl-grey mb-6 leading-relaxed">
                    One miscalculation can expose your client to penalties—or leave money on the table.
                  </p>
                  <Link
                    href="/solutions/cobra-calculation-challenges"
                    className="inline-flex items-center bg-xl-bright-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-xl-dark-blue transition-colors"
                  >
                    Try the COBRA Calculator
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-xl-light-grey rounded-lg p-8">
                  <h3 className="text-xl font-bold text-xl-dark-blue mb-4">Our Solution:</h3>
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
                  <h2 className="text-3xl font-bold text-xl-dark-blue mb-4">
                    "Which deductible structure will actually save my client money?"
                  </h2>
                  <p className="text-xl-grey mb-4 leading-relaxed">
                    Specific deductibles, aggregate deductibles, aggregating specific deductibles—the options multiply quickly, and so does the confusion.
                  </p>
                  <p className="text-xl-grey mb-6 leading-relaxed">
                    Without side-by-side scenario analysis, you're making recommendations based on gut feel instead of data.
                  </p>
                  <Link
                    href="/solutions/deductible-optimization"
                    className="inline-flex items-center bg-xl-bright-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-xl-dark-blue transition-colors"
                  >
                    Try the Deductible Analyzer
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-xl-light-grey rounded-lg p-8 md:order-1">
                  <h3 className="text-xl font-bold text-xl-dark-blue mb-4">Our Solution:</h3>
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
                  <h2 className="text-3xl font-bold text-xl-dark-blue mb-4">
                    "Is my client really ready to self-fund, or am I setting them up for disaster?"
                  </h2>
                  <p className="text-xl-grey mb-4 leading-relaxed">
                    Self-funding isn't right for every group. Cash flow constraints, administrative capacity, claims volatility, and risk tolerance all factor in—but most brokers only evaluate one or two of these.
                  </p>
                  <p className="text-xl-grey mb-6 leading-relaxed">
                    Transitioning the wrong client to self-funding can damage your reputation and your relationship.
                  </p>
                  <Link
                    href="/solutions/self-funding-feasibility"
                    className="inline-flex items-center bg-xl-bright-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-xl-dark-blue transition-colors"
                  >
                    Try the Readiness Assessment
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-xl-light-grey rounded-lg p-8">
                  <h3 className="text-xl font-bold text-xl-dark-blue mb-4">Our Solution:</h3>
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

            {/* Challenge 4: Aggregating Specific */}
            <AnimatedSection animation="fade-up">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="md:order-2">
                  <div className="inline-block bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    COMMON CHALLENGE
                  </div>
                  <h2 className="text-3xl font-bold text-xl-dark-blue mb-4">
                    "Should I recommend aggregating specific deductibles, or stick with traditional?"
                  </h2>
                  <p className="text-xl-grey mb-4 leading-relaxed">
                    Aggregating specific deductibles can unlock significant savings—but only if the math works out for your client's specific situation.
                  </p>
                  <p className="text-xl-grey mb-6 leading-relaxed">
                    Without ROI analysis, you're either missing opportunities or recommending unnecessary complexity.
                  </p>
                  <Link
                    href="/solutions/aggregating-specific-analysis"
                    className="inline-flex items-center bg-xl-bright-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-xl-dark-blue transition-colors"
                  >
                    Try the Agg Specific Calculator
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-xl-light-grey rounded-lg p-8 md:order-1">
                  <h3 className="text-xl font-bold text-xl-dark-blue mb-4">Our Solution:</h3>
                  <ul className="space-y-3 text-xl-grey">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>ROI comparison: agg specific vs. traditional specific</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Models different claims volume scenarios</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Break-even analysis with clear thresholds</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Visual charts that help clients understand the opportunity</span>
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            <hr className="border-xl-light-grey" />

            {/* Challenge 5: Vendor Selection */}
            <AnimatedSection animation="fade-up">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-block bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    COMMON CHALLENGE
                  </div>
                  <h2 className="text-3xl font-bold text-xl-dark-blue mb-4">
                    "How do I find the right cost containment vendors for my client's needs?"
                  </h2>
                  <p className="text-xl-grey mb-4 leading-relaxed">
                    The cost containment vendor landscape is crowded and confusing. PBMs, reference-based pricing, medical management, network optimization—dozens of vendors claim they can save your client money.
                  </p>
                  <p className="text-xl-grey mb-6 leading-relaxed">
                    Without vetted recommendations, you waste hours researching vendors that may not even integrate with your client's TPA.
                  </p>
                  <Link
                    href="/solutions/cost-containment-solutions"
                    className="inline-flex items-center bg-xl-bright-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-xl-dark-blue transition-colors"
                  >
                    Browse the Vendor Directory
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-xl-light-grey rounded-lg p-8">
                  <h3 className="text-xl font-bold text-xl-dark-blue mb-4">Our Solution:</h3>
                  <ul className="space-y-3 text-xl-grey">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Curated directory of vetted cost containment vendors</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Filterable by specialty (PBM, RBP, medical management, etc.)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>TPA integration compatibility noted for each vendor</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Direct contact info and intro support from XL Benefits</span>
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Need help with a specific challenge?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Our team has seen it all. Let's talk through your situation.
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
