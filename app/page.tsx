import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section with Hero Image */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8 md:py-12 lg:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="grid md:grid-cols-2 gap-8 items-center h-full">
            {/* Left Side - Hero Image */}
            <AnimatedSection animation="slide-right" className="order-2 md:order-1">
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] parallax-bg">
                <img
                  src="/images/other-images/xlb-hero.png"
                  alt="Your Sidekick for Stop-Loss Success"
                  className="w-full h-full object-contain"
                />
              </div>
            </AnimatedSection>

            {/* Right Side - Content */}
            <AnimatedSection animation="slide-left" className="order-1 md:order-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Your Sidekick for Stop-Loss Success
              </h1>
              <p className="text-xl sm:text-2xl mb-8 text-white/90">
                Expert guidance and interactive tools designed exclusively for insurance brokers navigating stop-loss challenges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/toolkit"
                  className="bg-white text-primary-600 px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-lg text-center"
                >
                  Explore the Toolkit
                </Link>
                <Link
                  href="/contact"
                  className="bg-primary-800 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-primary-900 transition-all hover:scale-105 border-2 border-white text-center"
                >
                  Talk to an Expert
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Brokers Choose XL Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-6">
              Why Brokers Choose XL Benefits
            </h2>
            <p className="text-lg text-xl-grey leading-relaxed">
              When your clients need stop-loss solutions, you need a partner who understands the complexities you face every day. XL Benefits brings deep carrier relationships, meticulous RFP management, and genuine expertise to every placement—from straightforward renewals to the most challenging cases.
            </p>
            <p className="text-lg text-xl-grey leading-relaxed mt-4">
              We don't just find coverage. We help you present solutions with confidence.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              Your Complete Stop-Loss Toolkit
            </h2>
            <p className="text-xl text-xl-grey">
              Interactive tools built for brokers who need accurate answers fast
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tool 1: COBRA Calculator */}
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-xl-dark-blue">TrueCost: Fully Insured Equivalent Calculator</h3>
                </div>
                <p className="text-xl-grey mb-6 flex-grow">
                  Accurately project fully insured equivalent rates for self-funded groups with state-specific compliance considerations. Get calculations you can confidently share with clients.
                </p>
                <Link
                  href="/solutions/truecost-calculator"
                  className="text-xl-bright-blue font-semibold hover:text-xl-dark-blue inline-flex items-center transition-colors"
                >
                  Try This Tool
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>

            {/* Tool 2: Deductible Analyzer */}
            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-xl-dark-blue">Stop-Loss Deductible Analyzer</h3>
                </div>
                <p className="text-xl-grey mb-6 flex-grow">
                  Compare specific and aggregate deductible structures to identify optimal cost-savings strategies. Make data-driven recommendations for every client scenario.
                </p>
                <Link
                  href="/solutions/deductible-optimization"
                  className="text-xl-bright-blue font-semibold hover:text-xl-dark-blue inline-flex items-center transition-colors"
                >
                  Try This Tool
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>

            {/* Tool 3: Self-Funding Assessment */}
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-xl-dark-blue">Self-Funding Readiness Assessment</h3>
                </div>
                <p className="text-xl-grey mb-6 flex-grow">
                  Evaluate whether your client is truly prepared for self-funding with our comprehensive feasibility quiz. Identify risks before they become problems.
                </p>
                <Link
                  href="/solutions/self-funding-feasibility"
                  className="text-xl-bright-blue font-semibold hover:text-xl-dark-blue inline-flex items-center transition-colors"
                >
                  Try This Tool
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>

            {/* Tool 4: Agg Specific Calculator */}
            <AnimatedSection animation="fade-up" delay={400}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-xl-dark-blue">Aggregating Specific Calculator</h3>
                </div>
                <p className="text-xl-grey mb-6 flex-grow">
                  Analyze the ROI potential of aggregating specific deductibles versus traditional structures. Discover opportunities your clients might be missing.
                </p>
                <Link
                  href="/solutions/aggregating-specific-analysis"
                  className="text-xl-bright-blue font-semibold hover:text-xl-dark-blue inline-flex items-center transition-colors"
                >
                  Try This Tool
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>

            {/* Tool 5: Vendor Directory */}
            <AnimatedSection animation="fade-up" delay={500}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-xl-dark-blue">Cost Containment Vendor Directory</h3>
                </div>
                <p className="text-xl-grey mb-6 flex-grow">
                  Access our curated directory of vetted cost containment vendors, filterable by specialty and integration requirements. Connect clients with the right partners.
                </p>
                <Link
                  href="/solutions/cost-containment-solutions"
                  className="text-xl-bright-blue font-semibold hover:text-xl-dark-blue inline-flex items-center transition-colors"
                >
                  Try This Tool
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>

            {/* Tool 6: Smart Share Calculator */}
            <AnimatedSection animation="fade-up" delay={600}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-xl-dark-blue">Smart Share: ER/EE Contribution Calculator</h3>
                </div>
                <p className="text-xl-grey mb-6 flex-grow">
                  Calculate optimal employer and employee contribution splits for health insurance premiums. Model different scenarios to find the right balance for your client's budget and employee satisfaction.
                </p>
                <Link
                  href="/solutions/smart-share-calculator"
                  className="text-xl-bright-blue font-semibold hover:text-xl-dark-blue inline-flex items-center transition-colors"
                >
                  Try This Tool
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
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              What Brokers Are Saying
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="bg-xl-light-grey rounded-lg p-8 h-full">
                <p className="text-xl-grey mb-6 italic leading-relaxed">
                  "Daron Pitts of XL Benefits knowledge of the reinsurance industry is exemplary. He and his firm provides phenomenal service and handles all matters timely and with a sense of professionalism. I believe that XL Benefits would be an excellent partner with any group client and their benefits."
                </p>
                <p className="font-semibold text-xl-dark-blue">Gina Cuttone</p>
                <p className="text-sm text-xl-grey">President, Barthuli & Associates Insurance Services, Inc.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-xl-light-grey rounded-lg p-8 h-full">
                <p className="text-xl-grey mb-6 italic leading-relaxed">
                  "As a TPA we've been approached by a number of stop loss general agents through the years. Recently we were introduced to the XL Benefits team and they have exceeded our expectations, setting a new standard for stop loss marketing. Their carrier relationships, expertise, responsiveness, and flexibility have freed us up to focus on what we do best – plan administration."
                </p>
                <p className="font-semibold text-xl-dark-blue">Regional Sales Manager</p>
                <p className="text-sm text-xl-grey">Third-Party Administrator (Northern California)</p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div className="bg-xl-light-grey rounded-lg p-8 h-full">
                <p className="text-xl-grey mb-6 italic leading-relaxed">
                  "We consider XL Benefits an extension of our team. From the initial marketing to the final presentation their help is invaluable to our overall success. On more than one occasion they've helped us secure new business via broker of record and transition some of our fully insured clients to self-funding."
                </p>
                <p className="font-semibold text-xl-dark-blue">Vice President, Benefits</p>
                <p className="text-sm text-xl-grey">Regional Firm (Fresno, CA)</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Meet Our Expert Team - Updated */}
      <section className="py-16 bg-xl-dark-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Meet Our Expert Team
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 mx-auto border-4 border-white/20">
                  <Image
                    src="/images/team/daron-headshot.jpeg"
                    alt="Daron Pitts"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Daron Pitts</h3>
                <p className="text-white/80 text-sm mb-4">President, Founder | CSFS</p>
                <p className="text-white/90 leading-relaxed text-sm">
                  Daron is the founder of XL Benefits and a problem solver at heart. With over 20 years of experience in self-funding, he holds the Certified Self-Funding Specialist (CSFS) designation. He works primarily in the medical stop-loss field serving brokers and TPAs, providing creative solutions and uncommon service to an industry he loves.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 mx-auto border-4 border-white/20">
                  <Image
                    src="/images/team/jennifer-headshot.jpeg"
                    alt="Jennifer Baird"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Jennifer Baird</h3>
                <p className="text-white/80 text-sm mb-4">Stop Loss Sales Consultant</p>
                <p className="text-white/90 leading-relaxed text-sm">
                  Jennifer has over 20 years of experience in self-funding, having worked as a TPA professional, employee benefits broker, and now as a stop loss consultant. Her diverse background gives her unique insights into all sides of the self-funding equation, serving as a trusted partner to brokers and TPAs on the East Coast since joining XL Benefits in May 2023.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 mx-auto border-4 border-white/20">
                  <Image
                    src="/images/team/steve-headshot.jpeg"
                    alt="Steve Caler"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Steve Caler</h3>
                <p className="text-white/80 text-sm mb-4">Stop Loss Sales Consultant</p>
                <p className="text-white/90 leading-relaxed text-sm">
                  Steve brings over 10 years of experience in self-funding to the XL Benefits team and holds the Certified Self-Funding Specialist (CSFS) designation. His expertise in the medical stop-loss arena helps him recognize the true needs of clients and provide strategic problem-solving solutions.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={400}>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 mx-auto border-4 border-white/20">
                  <Image
                    src="/images/team/sam-headshot.jpeg"
                    alt="Samuel Edwards"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Samuel Edwards</h3>
                <p className="text-white/80 text-sm mb-4">Stop Loss Sales Consultant</p>
                <p className="text-white/90 leading-relaxed text-sm">
                  Sam brings a unique combination of technical expertise and industry knowledge to XL Benefits. With experience in both technology and stop-loss consulting, he helps brokers leverage innovative solutions while providing expert guidance on complex self-funding scenarios across the Mountain, Plains, and Midwest regions.
                </p>
              </div>
            </AnimatedSection>
          </div>

          <div className="text-center">
            <Link
              href="/how-we-help/meet-the-team"
              className="inline-flex items-center bg-white text-xl-dark-blue px-8 py-4 rounded-md font-semibold text-lg hover:bg-xl-bright-blue hover:text-white transition-all hover:scale-105 shadow-lg"
            >
              Meet the Full Team
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-6">
              How We Work With You
            </h2>
            <p className="text-lg text-xl-grey leading-relaxed mb-4">
              XL Benefits handles the complexity so you can focus on your client relationships. Our 40-point inspection process ensures nothing gets overlooked—from gathering clean data to presenting competitive options with complete transparency.
            </p>
            <p className="text-lg text-xl-grey leading-relaxed mb-8">
              Whether you're managing a straightforward renewal or navigating a challenging placement, we provide the expertise and carrier access you need to deliver exceptional results.
            </p>
            <Link
              href="/how-we-help/our-process"
              className="inline-flex items-center text-xl-bright-blue font-semibold hover:text-xl-dark-blue text-lg transition-colors"
            >
              Learn About Our Process
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to tackle your next stop-loss challenge?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Connect with our team to discuss your specific situation.
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
