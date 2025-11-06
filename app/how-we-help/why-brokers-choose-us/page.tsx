import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function WhyBrokersChooseUsPage() {
  return (
    <div>
      {/* Extended Background Container */}
      <div className="relative">
        {/* Desktop Background */}
        <div
          className="hidden md:block absolute inset-0"
          style={{
            backgroundImage: 'url(/images/parallax/why-choose-us.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Mobile Background - adjusted positioning */}
        <div
          className="md:hidden absolute inset-0"
          style={{
            backgroundImage: 'url(/images/parallax/why-choose-us.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Hero Section */}
        <section className="relative text-white min-h-[50vh] flex items-center">
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Overlaid Content - Centered */}
          <div className="relative w-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <AnimatedSection animation="fade-up">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 text-white drop-shadow-2xl">
                WHY BROKERS CHOOSE XL BENEFITS
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-white/95 drop-shadow-lg max-w-2xl mx-auto">
                What sets us apart: meticulous process, genuine partnership, and 25+ carrier relationships.
              </p>
            </AnimatedSection>
          </div>
          </div>
        </section>

        {/* Intro Section - Frosted */}
        <section className="py-16 bg-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-lg text-xl-grey leading-relaxed text-center">
                In an industry full of general agents claiming expertise, brokers need to know what actually makes a partner worth working with. Here's what sets XL Benefits apart—and why brokers continue to trust us with their most challenging cases.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
      </div>

      {/* Section: RFPs That Carriers Love */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-6">
              RFPs That Carriers Love to Quote
            </h2>
            <p className="text-lg text-xl-grey leading-relaxed mb-6">
              Our RFPs are legendary among carriers and underwriters. Clean data, comprehensive documentation, and organized presentation materials make underwriting easier—which means better quotes for your clients.
            </p>
            <div className="bg-white rounded-lg p-6 shadow-md mb-8">
              <h3 className="text-xl font-bold text-xl-dark-blue mb-4">What makes our RFPs different:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Complete claims data properly formatted and analyzed</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">All plan documents reviewed and reconciled</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Census data verified and scrubbed for accuracy</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Clear case summary highlighting key opportunities and risks</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Professional presentation that reflects well on you and your practice</span>
                </li>
              </ul>
            </div>
            <p className="text-lg text-xl-grey leading-relaxed">
              The result? Carriers respond faster, quote more competitively, and give your cases the attention they deserve.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials 1 */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <AnimatedSection animation="fade-up">
              <div className="bg-xl-light-grey rounded-lg p-8 shadow-md">
                <svg className="w-12 h-12 text-xl-bright-blue mb-6" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-xl text-xl-grey italic leading-relaxed mb-6">
                  "I love your RFPs. The material you send over is so nice… they are like perfect little packages!"
                </p>
                <div className="border-t border-gray-300 pt-4">
                  <p className="font-bold text-xl-dark-blue">Account Manager</p>
                  <p className="text-sm text-xl-grey">Stop-Loss Carrier</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up">
              <div className="bg-xl-light-grey rounded-lg p-8 shadow-md">
                <svg className="w-12 h-12 text-xl-bright-blue mb-6" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-xl text-xl-grey italic leading-relaxed mb-6">
                  "XL Benefits' thorough understanding of self-funding and stop loss pricing consistently delivers us the detailed information that we need to provide our best quote or best renewal."
                </p>
                <div className="border-t border-gray-300 pt-4">
                  <p className="font-bold text-xl-dark-blue">Regional Sales Manager</p>
                  <p className="text-sm text-xl-grey">Direct Writing Carrier</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section: 25+ Carrier Relationships */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-6">
              25+ Carrier Relationships That Work For You
            </h2>
            <p className="text-lg text-xl-grey leading-relaxed mb-6">
              Access matters. We maintain strong relationships with more than 25 stop-loss carriers—from household names to specialty markets. This breadth gives us options other MGAs can't match.
            </p>
            <div className="bg-white rounded-lg p-6 shadow-md mb-8">
              <h3 className="text-xl font-bold text-xl-dark-blue mb-4">Our carrier network includes:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Large national carriers for standard cases</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Regional specialists with competitive appetites</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Niche markets for challenging placements</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Direct relationships with underwriting leadership</span>
                </li>
              </ul>
            </div>
            <p className="text-lg text-xl-grey leading-relaxed">
              We know which carriers excel in specific situations, which have appetite for your client's profile, and how to position cases for success. You get market access without the carrier management headache.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Section: Extension of Your Team */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-6">
              An Extension of Your Team, Not Just a Vendor
            </h2>
            <p className="text-lg text-xl-grey leading-relaxed mb-6">
              We don't disappear after placement. Throughout the year, we're available for plan design questions, claims issues, and strategic planning. Our goal is for you to be more successful—period.
            </p>
            <div className="bg-xl-light-grey rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-xl-dark-blue mb-4">What partnership looks like:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Proactive renewal planning and timeline management</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Year-round support for client questions and issues</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Educational resources and market intelligence</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Honest recommendations even when it means less from a case for us</span>
                </li>
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials 2 */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <AnimatedSection animation="fade-up">
              <div className="bg-white rounded-lg p-8 shadow-md">
                <svg className="w-12 h-12 text-xl-bright-blue mb-6" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-xl text-xl-grey italic leading-relaxed mb-6">
                  "We consider XL Benefits an extension of our team. From the initial marketing to the final presentation their help is invaluable to our overall success. On more than one occasion they've helped us secure new business via broker of record and transition some of our fully insured clients to self-funding."
                </p>
                <div className="border-t border-gray-300 pt-4">
                  <p className="font-bold text-xl-dark-blue">Vice President, Benefits</p>
                  <p className="text-sm text-xl-grey">Regional Firm (Fresno, CA)</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up">
              <div className="bg-white rounded-lg p-8 shadow-md">
                <svg className="w-12 h-12 text-xl-bright-blue mb-6" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-xl text-xl-grey italic leading-relaxed mb-6">
                  "As a TPA we've been approached by a number of stop loss general agents through the years. Recently we were introduced to the XL Benefits team and they have exceeded our expectations, setting a new standard for stop loss marketing. Their carrier relationships, expertise, responsiveness, and flexibility have freed us up to focus on what we do best – plan administration."
                </p>
                <div className="border-t border-gray-300 pt-4">
                  <p className="font-bold text-xl-dark-blue">Regional Sales Manager</p>
                  <p className="text-sm text-xl-grey">Third-Party Administrator (Northern California)</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section: Objective Expertise */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-6">
              Objective Expertise You Can Trust
            </h2>
            <p className="text-lg text-xl-grey leading-relaxed mb-6">
              Sometimes the right answer is "don't self-fund yet." Or "stay with your incumbent." We've walked away from revenue when it was the right thing for the client—and brokers remember that integrity.
            </p>
            <div className="bg-xl-light-grey rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-xl-dark-blue mb-4">Our commitment:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Honest assessments based on data, not commission potential</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Recommendations that prioritize your client's best interests</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Transparency about market conditions and carrier appetite</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Expertise that helps you make confident decisions</span>
                </li>
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials 3 */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <AnimatedSection animation="fade-up">
              <div className="bg-white rounded-lg p-8 shadow-md">
                <svg className="w-12 h-12 text-xl-bright-blue mb-6" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-xl text-xl-grey italic leading-relaxed mb-6">
                  "Another client was seriously considering going self-funded. Daron Pitts provided a detailed analysis with a final recommendation of remaining fully-insured. Daron could have persuaded the client to take the risk of self-insurance but truly believed it was not the right time for them when considering utilization patterns and the success of their fully insured model. The client was grateful for his objective expertise and drawing his conclusion based on what was best for them as our client."
                </p>
                <div className="border-t border-gray-300 pt-4">
                  <p className="font-bold text-xl-dark-blue">Benefit Consultant</p>
                  <p className="text-sm text-xl-grey">National Firm (San Diego, CA)</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up">
              <div className="bg-white rounded-lg p-8 shadow-md">
                <svg className="w-12 h-12 text-xl-bright-blue mb-6" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-xl text-xl-grey italic leading-relaxed mb-6">
                  "Many general agents claim to know the excess loss business, but none truly know the nuances of stop loss quite like XL Benefit Insurance Services. We have worked with several general agents over the last ten years and the service and expertise from XL is unmatched. The peace of mind we get from XL is business done right."
                </p>
                <div className="border-t border-gray-300 pt-4">
                  <p className="font-bold text-xl-dark-blue">Jenni Villane, Senior Vice President</p>
                  <p className="text-sm text-xl-grey">Relation Insurance Services</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section: Responsiveness */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-6">
              Responsiveness When You Need It
            </h2>
            <p className="text-lg text-xl-grey leading-relaxed">
              Stop-loss questions don't wait for business hours. Claims issues don't follow a schedule. When you need an answer, we're available—not next week, not when it's convenient, but when you need us.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonial 4 */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <svg className="w-12 h-12 text-xl-bright-blue mb-6" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="text-xl text-xl-grey italic leading-relaxed mb-6">
                "There are many reasons why we consider XL Benefits to be a trusted business partner. One of our first encounters was when XL Benefits provided a solution for a complicated stop loss placement. We had recently been named broker for a large employer (1,200 employees) whose stop-loss had expired. Daron Pitts worked tirelessly and was able to obtain competitive pricing. This was a notable achievement considering there was minimal competition within the marketplace and the client did not have any leverage from an incumbent carrier as they were uninsured at the time."
              </p>
              <div className="border-t border-gray-300 pt-4">
                <p className="font-bold text-xl-dark-blue">Benefit Consultant</p>
                <p className="text-sm text-xl-grey">National Firm (San Diego, CA)</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Experience what genuine partnership looks like.
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Let's discuss your next stop-loss challenge and how we can support your success.
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
