import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function OurProcessPage() {
  return (
    <div>
      {/* Extended Background Container */}
      <div className="relative">
        {/* Desktop Background */}
        <div
          className="hidden md:block absolute inset-0"
          style={{
            backgroundImage: 'url(/images/parallax/40pt.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Mobile Background - adjusted positioning */}
        <div
          className="md:hidden absolute inset-0"
          style={{
            backgroundImage: 'url(/images/parallax/40pt.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 text-white drop-shadow-lg">
                OUR PROCESS: The 40 Point Inspection
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/95 drop-shadow-md max-w-2xl mx-auto">
                Meticulous analysis and expert RFP management that gives you confidence in every presentation
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
              <p className="text-lg text-xl-grey leading-relaxed mb-4">
                Stop-loss placements fail when critical details get overlooked. A missing contract provision. An incorrectly structured deductible. An SPD that doesn't mirror the policy. These aren't small issues—they're the difference between a solution that works and one that creates problems down the road.
              </p>
              <p className="text-lg text-xl-grey leading-relaxed">
                Our 40-point inspection ensures nothing gets missed. From stop-loss contract analysis to pharmacy benefits evaluation to financial reserve planning, we can examine every element that impacts your client's success. The result? Clean RFPs, competitive quotes, and presentations you can deliver with complete confidence.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
      </div>

      {/* What We Examine */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-12 text-center">
              What We Examine
            </h2>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Stop Loss Contract Analysis */}
            <AnimatedSection animation="fade-up">
              <div className="bg-white rounded-lg p-8 shadow-md">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-xl-dark-blue">
                    Stop Loss Contract Analysis
                  </h3>
                </div>
                <p className="text-xl-grey mb-6 leading-relaxed">
                  We analyze every aspect of your client's stop-loss coverage to identify opportunities and risks:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Coverages</span><span className="text-xl-grey"> - Comprehensive review of what's included and excluded</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Specific Deductible Analysis</span><span className="text-xl-grey"> - Optimal deductible selection for client's risk profile</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Aggregating Specific Analysis</span><span className="text-xl-grey"> - Evaluation of aggregating specific structures</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Specific Advance Analysis</span><span className="text-xl-grey"> - Review of advance funding provisions</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Ratings and Financials</span><span className="text-xl-grey"> - Carrier financial strength and stability assessment</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Lasering at Renewal</span><span className="text-xl-grey"> - Strategic approach to individual high-cost claimants</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Second Year Rate Cap</span><span className="text-xl-grey"> - Protection against excessive renewal increases</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Minimum Attachment</span><span className="text-xl-grey"> - Aggregate attachment point analysis</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Plan Mirroring</span><span className="text-xl-grey"> - Ensuring policy matches plan design exactly</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">IRO Provision</span><span className="text-xl-grey"> - Independent Review Organization language review</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Never Events</span><span className="text-xl-grey"> - Coverage for preventable medical errors</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Run-in Limitations</span><span className="text-xl-grey"> - Pre-effective date claim liability review</span></div></div>
                </div>
              </div>
            </AnimatedSection>

            {/* Plan Document Review */}
            <AnimatedSection animation="fade-up">
              <div className="bg-white rounded-lg p-8 shadow-md">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-xl-dark-blue">
                    Plan Document Review
                  </h3>
                </div>
                <p className="text-xl-grey mb-6 leading-relaxed">
                  Your client's plan documents must be accurate, compliant, and properly executed:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">SPD: Eligibility Review</span><span className="text-xl-grey"> - Comparison against personnel policies for consistency</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">SPD: Signed and Approved</span><span className="text-xl-grey"> - Proper execution and approval documentation</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Amendments: Signed and Approved</span><span className="text-xl-grey"> - Proper amendment documentation and execution</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Extraneous Personnel Policies/Procedures</span><span className="text-xl-grey"> - Comparison with SPD for alignment</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">SPD/Policy: Exclusions</span><span className="text-xl-grey"> - Alignment between SPD and policy exclusions</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">SPD/Policy: Usual and Customary Language</span><span className="text-xl-grey"> - Clarity on reimbursement methodology</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">SPD/Policy: Clinical Trials/E&I Language</span><span className="text-xl-grey"> - Experimental and investigational coverage terms</span></div></div>
                </div>
              </div>
            </AnimatedSection>

            {/* Network & Cost Containment */}
            <AnimatedSection animation="fade-up">
              <div className="bg-white rounded-lg p-8 shadow-md">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-xl-dark-blue">
                    Network & Cost Containment
                  </h3>
                </div>
                <p className="text-xl-grey mb-6 leading-relaxed">
                  We evaluate the full ecosystem of vendors supporting your client's plan:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">PPO Evaluation</span><span className="text-xl-grey"> - Network adequacy and discount performance</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">In-Network Utilization</span><span className="text-xl-grey"> - Analysis of network steerage effectiveness</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Out-of-Network Pricing</span><span className="text-xl-grey"> - Review of OON reimbursement methodology and costs</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Bill Audit/Review</span><span className="text-xl-grey"> - Claims audit process and recovery potential</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Utilization Review</span><span className="text-xl-grey"> - Pre-certification and medical necessity review effectiveness</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Disease Management</span><span className="text-xl-grey"> - Chronic condition management program evaluation</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Dialysis Cost Containment Language</span><span className="text-xl-grey"> - Specialty cost management provisions</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Transplant Carve-Out Evaluation</span><span className="text-xl-grey"> - High-cost procedure management strategy</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Telemedicine Analysis</span><span className="text-xl-grey"> - Virtual care utilization</span></div></div>
                </div>
              </div>
            </AnimatedSection>

            {/* Pharmacy Benefit Analysis */}
            <AnimatedSection animation="fade-up">
              <div className="bg-white rounded-lg p-8 shadow-md">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-xl-dark-blue">
                    Pharmacy Benefit Analysis
                  </h3>
                </div>
                <p className="text-xl-grey mb-6 leading-relaxed">
                  Pharmacy costs require specialized attention:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">PBM Contract Analysis</span><span className="text-xl-grey"> - Transparency, rebates, and pricing structure review</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Generic Drug Utilization</span><span className="text-xl-grey"> - Generic substitution rates and opportunities</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Specialty Drug Utilization</span><span className="text-xl-grey"> - High-cost specialty medication management and alternatives</span></div></div>
                </div>
              </div>
            </AnimatedSection>

            {/* Financial Planning & Reserves */}
            <AnimatedSection animation="fade-up">
              <div className="bg-white rounded-lg p-8 shadow-md">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-xl-bright-blue/10 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-xl-dark-blue">
                    Financial Planning & Reserves
                  </h3>
                </div>
                <p className="text-xl-grey mb-6 leading-relaxed">
                  Sound financial planning prevents cash flow problems:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Illustrative Fully Insured Equivalent Rates</span><span className="text-xl-grey"> - Cost comparison to fully-insured alternatives</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Illustrative Continuation Coverage Rates</span><span className="text-xl-grey"> - Accurate continuation coverage premium calculations</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Plan Funding Methodology</span><span className="text-xl-grey"> - Optimal funding approach for client's cash flow</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">IBNR Reserves</span><span className="text-xl-grey"> - Incurred But Not Reported liability estimation</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Stabilization Reserves</span><span className="text-xl-grey"> - Reserve requirements for claim volatility</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Fee Based Versus Commission Analysis</span><span className="text-xl-grey"> - Evaluation of fee-based and commission structures</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Contribution Strategy</span><span className="text-xl-grey"> - Employer/employee cost-sharing optimization</span></div></div>
                  <div className="flex items-start"><svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><div><span className="font-semibold text-xl-dark-blue">Tax Savings Estimates</span><span className="text-xl-grey"> - State premium tax savings quantification</span></div></div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* What Brokers Can Expect */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-12 text-center">
              What Brokers Can Expect
            </h2>

            <div className="space-y-8">
              <div className="border-l-4 border-xl-bright-blue pl-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">
                  Week 1: Data Collection & Initial Analysis
                </h3>
                <p className="text-xl-grey leading-relaxed">
                  We gather all necessary information—claims data, plan documents, census, and current contracts. Our team conducts the initial 40-point inspection to identify issues requiring immediate attention.
                </p>
              </div>

              <div className="border-l-4 border-xl-bright-blue pl-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">
                  Week 2: RFP Development & Carrier Selection
                </h3>
                <p className="text-xl-grey leading-relaxed">
                  We develop comprehensive RFPs and select the optimal carrier mix based on your client's needs, risk profile, and market conditions. Our carrier relationships ensure your case gets proper attention.
                </p>
              </div>

              <div className="border-l-4 border-xl-bright-blue pl-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">
                  Throughout the Process:
                </h3>
                <ul className="space-y-2 text-xl-grey">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Regular updates on quote status and timeline
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Clear communication about any issues or opportunities discovered
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Proactive problem-solving when challenges arise
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Clean, organized presentation materials ready for your client meeting
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-xl-bright-blue pl-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-3">
                  Result:
                </h3>
                <ul className="space-y-2 text-xl-grey">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    RFPs that carriers love to quote
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Presentations you can deliver with confidence
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-xl-bright-blue mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Solutions that actually work
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <svg className="w-12 h-12 text-xl-bright-blue mb-6" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="text-xl text-xl-grey italic leading-relaxed mb-6">
                "I love your RFPs. The material you send over is so nice… they are like perfect little packages!"
              </p>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-bold text-xl-dark-blue">Account Manager</p>
                <p className="text-sm text-xl-grey">Stop-Loss Carrier</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">
              Experience the difference meticulous preparation makes.
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center bg-white text-xl-dark-blue px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105"
            >
              Let's Discuss Your Next Case
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
