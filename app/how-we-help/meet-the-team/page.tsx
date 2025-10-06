import FlipCard from '@/components/shared/FlipCard'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function MeetTheTeamPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Meet Our Team</h1>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Decades of combined stop-loss expertise at your service. Click any card to learn more.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatedSection animation="fade-up" delay={100}>
            <FlipCard
              name="Daron Pitts"
              title="President, Founder | CSFS"
              expertise={["20+ Years Self-Funding", "Stop Loss General Agent", "CSFS Designation"]}
              bio="Daron is the founder of XL Benefits and a problem solver at heart. With over 20 years of experience in self-funding, he holds the Certified Self-Funding Specialist (CSFS) designation. He works primarily in the medical stop loss field serving brokers and TPAs. In July of 2014, Daron started XL Benefits with the goal to provide his collective expertise, creative solutions and uncommon service to an industry he loves. You could describe Daron as an avid sports fan, audiobook listening, Fall-loving, board game playing, amateur cooking, dedicated husband, and father of three."
              email="daron@xlbenefits.com"
            />
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <FlipCard
              name="Jennifer Baird"
              title="Stop Loss Sales Consultant"
              expertise={["20+ Years Self-Funding", "TPA Experience", "Broker & Consultant Background"]}
              bio="Jennifer has over 20 years of experience in self-funding, having worked as a TPA professional, employee benefits broker, and now as a stop loss consultant. Her diverse background gives her unique insights into all sides of the self-funding equation. She specializes in helping large companies develop and deploy cost containment strategies including PBM analysis, captive solutions, and risk mitigation. Jennifer joined the XL Benefits team in May 2023 with the goal to become a trusted partner to our broker and TPA communities on the East Coast. She loves most sports, recently became an MLS Soccer fan (Go Charlotte FC), enjoys spending time on the golf course and the lake."
              email="jennifer@xlbenefits.com"
            />
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <FlipCard
              name="Steve Caler"
              title="Director of Business Development | CSFS"
              expertise={["10+ Years Self-Funding", "CSFS Designation", "Strategic Problem-Solving"]}
              bio="Steve brings over 10 years of experience in self-funding to the XL Benefits team and holds the Certified Self-Funding Specialist (CSFS) designation. His expertise in the medical stop loss arena helps him recognize the true needs of clients and provide strategic problem-solving solutions. Steve is a sports fanatic, a committed bookworm, and has a passion for business development and a good laugh. He can't pass up eating Mexican food or Cold Stone Creamery (Mud Pie Mojo). He loves watching UFC with his four boys and drinking coffee with his wife and two girls."
              email="steve@xlbenefits.com"
            />
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
