import Link from 'next/link'
import FlipCard from '@/components/shared/FlipCard'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function MeetTheTeamPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Meet the Team
            </h1>
            <p className="text-xl text-white/90">
              Expert specialists committed to your success and your clients' well-being.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <p className="text-xl text-xl-grey leading-relaxed mb-6 text-center">
              XL Benefits is a stop-loss insurance specialist dedicated to helping brokers serve their clients better through expert guidance, market access, and innovative tools.
            </p>
            <p className="text-lg text-xl-grey leading-relaxed text-center">
              Stop-loss expertise isn't just about knowing products—it's about understanding the challenges brokers face, building genuine partnerships, and delivering solutions that actually work. Our team brings decades of combined experience, deep carrier relationships, and a commitment to making your job easier.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-xl-dark-blue mb-4">
              OUR CORE VALUES
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="bg-white rounded-lg shadow-md p-8 h-full text-center">
                <div className="w-16 h-16 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-2">White Glove Service</h3>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-white rounded-lg shadow-md p-8 h-full text-center">
                <div className="w-16 h-16 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Constant Innovation</h3>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div className="bg-white rounded-lg shadow-md p-8 h-full text-center">
                <div className="w-16 h-16 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Integrity Always</h3>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={400}>
              <div className="bg-white rounded-lg shadow-md p-8 h-full text-center">
                <div className="w-16 h-16 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Excellence in Everything</h3>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={500}>
              <div className="bg-white rounded-lg shadow-md p-8 h-full text-center">
                <div className="w-16 h-16 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Joyful Flexibility</h3>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection animation="fade-up">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
              <p className="text-lg text-xl-grey leading-relaxed">
                If you've done business with XL Benefits, you know that we are a strong friendly team of professionals committed to making your job easier. If you're new to XL Benefits, we invite you to experience our extraordinary knowledge, customized solutions, and outstanding service. We are an industry leader in stop loss negotiation and alternative risk management with an extensive portfolio of "A" rated insurance partners providing excellence in stop loss coverage. Whether you're a local agency or a national firm, you'll find us fast and flexible problem solvers, eager to address your clients' needs with the goal to simplify your stop loss experience. This "customer first" philosophy permeates everything we do and it's responsible for our explosive growth and success.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-6">Our Mission</h2>
            <p className="text-lg text-xl-grey leading-relaxed">
              To be the trusted sidekick for insurance brokers navigating stop-loss challenges, providing tools, expertise, and market access that makes their jobs easier and their clients more successful.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-8">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-6">What Makes Us Different</h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-up">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-xl-bright-blue mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">25+ carrier relationships for true market access</span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-xl-bright-blue mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Broker-first philosophy with no carrier conflicts</span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-xl-bright-blue mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Free interactive tools designed by brokers, for brokers</span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-xl-bright-blue mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl-grey">Expert team with decades of combined stop-loss experience</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top Row - Daron Only */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md">
              <AnimatedSection animation="fade-up" delay={100}>
                <FlipCard
                  name="Daron Pitts"
                  title="President, Founder | CSFS"
                  imageUrl="/images/team/daron-headshot.jpeg"
                  expertise={["20+ Years Self-Funding", "Stop Loss General Agent", "CSFS Designation"]}
                  bio="Daron is the founder of XL Benefits and a problem solver at heart. With over 20 years of experience in self-funding, he holds the Certified Self-Funding Specialist (CSFS) designation. He works primarily in the medical stop loss field serving brokers and TPAs. In July of 2014, Daron started XL Benefits with the goal to provide his collective expertise, creative solutions and uncommon service to an industry he loves. You could describe Daron as an avid sports fan, audiobook listening, Fall-loving, board game playing, amateur cooking, dedicated husband, and father of three."
                  email="daron@xlbenefits.com"
                />
              </AnimatedSection>
            </div>
          </div>

          {/* Second Row - Jennifer, Steve, Samuel */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Jennifer Baird-Flynn */}
            <AnimatedSection animation="fade-up" delay={200}>
              <FlipCard
                name="Jennifer Baird-Flynn"
                title="Stop Loss Sales Consultant"
                imageUrl="/images/team/jennifer-headshot.jpeg"
                expertise={["20+ Years Self-Funding", "TPA Experience", "Broker & Consultant Background"]}
                bio="Jennifer has over 20 years of experience in self-funding, having worked as a TPA professional, employee benefits broker, and now as a stop loss consultant. Her diverse background gives her unique insights into all sides of the self-funding equation. She specializes in helping large companies develop and deploy cost containment strategies including PBM analysis, captive solutions, and risk mitigation. Jennifer joined the XL Benefits team in May 2023 with the goal to become a trusted partner to our broker and TPA communities on the East Coast. She loves most sports, recently became an MLS Soccer fan (Go Charlotte FC), enjoys spending time on the golf course and the lake."
                email="jennifer@xlbenefits.com"
              />
            </AnimatedSection>

            {/* Steve Caler */}
            <AnimatedSection animation="fade-up" delay={300}>
              <FlipCard
                name="Steve Caler"
                title="Stop Loss Sales Consultant"
                expertise={["10+ Years Self-Funding", "CSFS Designation", "Strategic Problem-Solving"]}
                bio="Steve brings over 10 years of experience in self-funding to the XL Benefits team and holds the Certified Self-Funding Specialist (CSFS) designation. His expertise in the medical stop loss arena helps him recognize the true needs of clients and provide strategic problem-solving solutions. Steve is a sports fanatic, a committed bookworm, and has a passion for business development and a good laugh. He can't pass up eating Mexican food or Cold Stone Creamery (Mud Pie Mojo). He loves watching UFC with his four boys and drinking coffee with his wife and two girls."
                email="steve@xlbenefits.com"
              />
            </AnimatedSection>

            {/* Samuel Edwards */}
            <AnimatedSection animation="fade-up" delay={400}>
              <FlipCard
                name="Samuel Edwards"
                title="Stop Loss Sales Consultant"
                imageUrl="/images/team/sam-headshot.jpeg"
                expertise={["20+ Years Insurance Experience", "Agency Owner Background", "Tech Startup Contributor"]}
                bio="Sam brings over 20 years of insurance experience, including a decade running his own agency and most recently contributing to a tech startup. His passion for building relationships, supporting brokers, and improving how we serve our clients makes him a fantastic addition to our team."
                email="sam@xlbenefits.com"
              />
            </AnimatedSection>
          </div>

          {/* Bottom Row - Joe, Erin, Christine */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Joe Landziak */}
            <AnimatedSection animation="fade-up" delay={500}>
              <FlipCard
                name="Joe Landziak"
                title="Account Executive"
                imageUrl="/images/team/joe-headshot.jpeg"
                expertise={["10+ Years Insurance Industry", "P&C Agent Background", "Analytical Expertise"]}
                bio="Joe has worked in the insurance industry for more than a decade, serving as a property and casualty agent for the first part of his career. Responsible for new business sales of both personal and commercial lines, Joe gained plenty of industry knowledge before transitioning to our world of self-funding. In July of 2015, Joe joined XL Benefits with the goal to apply his analytical mind to the field of medical stop loss. You could describe Joe as an all around great guy. He's our resident fantasy football guru, as well as a garden growing, spicy food eating, deep thinking, board game playing, nature loving, husband of one and father of three."
                email="joe@xlbenefits.com"
              />
            </AnimatedSection>

            {/* Erin Maurer */}
            <AnimatedSection animation="fade-up" delay={600}>
              <FlipCard
                name="Erin Maurer"
                title="Account Executive"
                imageUrl="/images/team/erin-headshot-final.png"
                expertise={["Insurance Since 2004", "Large Self-Funded Groups", "RFP & Renewals Specialist"]}
                bio="Erin joined our team in 2023 with an extensive insurance background that began in 2004, working mainly on large self-funded employer groups, including stop loss insurance. Erin assists with RFP submission, renewals and new business set-up. Erin is bubbly, creative and has a heart for outstanding customer service. When she's not working she is typically out riding horses and camping with her daughter, and enjoys dancing, wine tasting and volunteering at her local school and church events."
                email="erin@xlbenefits.com"
              />
            </AnimatedSection>

            {/* Christine Titus */}
            <AnimatedSection animation="fade-up" delay={700}>
              <FlipCard
                name="Christine Titus"
                title="Account Manager"
                expertise={["Account Management", "Client Relations", "Detail-Oriented Service"]}
                bio="Christine brings an unparalleled energy to XL Benefits. She has a knack for account management bolstered by her warm personality and desire to serve others. She has years of experience in managing reports, forecasting, training and serving as a day to day contact for clients. Utilizing her strengths and personality she seeks to build rapport with co-workers and clients establishing trusted, long term relationships. Christine has a love for decorating, cooking and cleaning. She likes to create welcoming spaces for others. Her eye for detail and the joy of caring for others has contributed to the creation of personalized parties and weddings for many."
                email="christine@xlbenefits.com"
              />
            </AnimatedSection>
          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to connect with a specialist?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Reach out to the team member whose expertise matches your needs.
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
