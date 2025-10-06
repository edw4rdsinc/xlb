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

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <p className="text-lg text-xl-grey leading-relaxed text-center">
              Stop-loss expertise isn't just about knowing products—it's about understanding the challenges brokers face, building genuine partnerships, and delivering solutions that actually work. Our team brings decades of combined experience, deep carrier relationships, and a commitment to making your job easier.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Daron Pitts */}
            <AnimatedSection animation="fade-up" delay={100}>
              <FlipCard
                name="Daron Pitts"
                title="President, Founder | CSFS"
                expertise={["20+ Years Self-Funding", "Stop Loss General Agent", "CSFS Designation"]}
                bio="Daron is the founder of XL Benefits and a problem solver at heart. With over 20 years of experience in self-funding, he holds the Certified Self-Funding Specialist (CSFS) designation. He works primarily in the medical stop loss field serving brokers and TPAs. In July of 2014, Daron started XL Benefits with the goal to provide his collective expertise, creative solutions and uncommon service to an industry he loves. You could describe Daron as an avid sports fan, audiobook listening, Fall-loving, board game playing, amateur cooking, dedicated husband, and father of three."
                email="daron@xlbenefits.com"
              />
            </AnimatedSection>

            {/* Steve Caler */}
            <AnimatedSection animation="fade-up" delay={200}>
              <FlipCard
                name="Steve Caler"
                title="Director of Business Development | CSFS"
                expertise={["10+ Years Self-Funding", "CSFS Designation", "Strategic Problem-Solving"]}
                bio="Steve brings over 10 years of experience in self-funding to the XL Benefits team and holds the Certified Self-Funding Specialist (CSFS) designation. His expertise in the medical stop loss arena helps him recognize the true needs of clients and provide strategic problem-solving solutions. Steve is a sports fanatic, a committed bookworm, and has a passion for business development and a good laugh. He can't pass up eating Mexican food or Cold Stone Creamery (Mud Pie Mojo). He loves watching UFC with his four boys and drinking coffee with his wife and two girls."
                email="steve@xlbenefits.com"
              />
            </AnimatedSection>

            {/* Jennifer Baird */}
            <AnimatedSection animation="fade-up" delay={300}>
              <FlipCard
                name="Jennifer Baird"
                title="Stop Loss Sales Consultant"
                expertise={["20+ Years Self-Funding", "TPA Experience", "Broker & Consultant Background"]}
                bio="Jennifer has over 20 years of experience in self-funding, having worked as a TPA professional, employee benefits broker, and now as a stop loss consultant. Her diverse background gives her unique insights into all sides of the self-funding equation. She specializes in helping large companies develop and deploy cost containment strategies including PBM analysis, captive solutions, and risk mitigation. Jennifer joined the XL Benefits team in May 2023 with the goal to become a trusted partner to our broker and TPA communities on the East Coast. She loves most sports, recently became an MLS Soccer fan (Go Charlotte FC), enjoys spending time on the golf course and the lake."
                email="jennifer@xlbenefits.com"
              />
            </AnimatedSection>

            {/* Samuel Edwards */}
            <AnimatedSection animation="fade-up" delay={400}>
              <FlipCard
                name="Samuel Edwards"
                title="Stop Loss Sales Consultant"
                expertise={["20+ Years Insurance Experience", "Agency Owner Background", "Tech Startup Contributor"]}
                bio="Sam brings over 20 years of insurance experience, including a decade running his own agency and most recently contributing to a tech startup. His passion for building relationships, supporting brokers, and improving how we serve our clients makes him a fantastic addition to our team."
                email="sam@xlbenefits.com"
              />
            </AnimatedSection>

            {/* Joe Landziak */}
            <AnimatedSection animation="fade-up" delay={500}>
              <FlipCard
                name="Joe Landziak"
                title="Account Executive"
                expertise={["10+ Years Insurance Industry", "P&C Agent Background", "Analytical Expertise"]}
                bio="Joe has worked in the insurance industry for more than a decade, serving as a property and casualty agent for the first part of his career. Responsible for new business sales of both personal and commercial lines, Joe gained plenty of industry knowledge before transitioning to our world of self-funding. In July of 2015, Joe joined XL Benefits with the goal to apply his analytical mind to the field of medical stop loss. You could describe Joe as an all around great guy. He's our resident fantasy football guru, as well as a garden growing, spicy food eating, deep thinking, board game playing, nature loving, husband of one and father of three."
                email="joe@xlbenefits.com"
              />
            </AnimatedSection>

            {/* Christine Childs */}
            <AnimatedSection animation="fade-up" delay={600}>
              <FlipCard
                name="Christine Childs"
                title="Account Manager"
                expertise={["Account Management", "Client Relations", "Detail-Oriented Service"]}
                bio="Christine brings an unparalleled energy to XL Benefits. She has a knack for account management bolstered by her warm personality and desire to serve others. She has years of experience in managing reports, forecasting, training and serving as a day to day contact for clients. Utilizing her strengths and personality she seeks to build rapport with co-workers and clients establishing trusted, long term relationships. Christine has a love for decorating, cooking and cleaning. She likes to create welcoming spaces for others. Her eye for detail and the joy of caring for others has contributed to the creation of personalized parties and weddings for many."
                email="christine@xlbenefits.com"
              />
            </AnimatedSection>

            {/* Erin Maurer */}
            <AnimatedSection animation="fade-up" delay={700}>
              <FlipCard
                name="Erin Maurer"
                title="Account Executive"
                expertise={["Insurance Since 2004", "Large Self-Funded Groups", "RFP & Renewals Specialist"]}
                bio="Erin joined our team in 2023 with an extensive insurance background that began in 2004, working mainly on large self-funded employer groups, including stop loss insurance. Erin assists with RFP submission, renewals and new business set-up. Erin is bubbly, creative and has a heart for outstanding customer service. When she's not working she is typically out riding horses and camping with her daughter, and enjoys dancing, wine tasting and volunteering at her local school and church events."
                email="erin@xlbenefits.com"
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
