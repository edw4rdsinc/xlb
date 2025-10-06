import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function HowWeHelpPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              How We Help Brokers Win
            </h1>
            <p className="text-xl text-white/90">
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
