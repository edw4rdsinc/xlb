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
              title="President, Founder"
              expertise={["Stop Loss General Agent", "Self-Funded Consulting", "Creative Solutions"]}
              bio="Daron is the founder of XL Benefits and a problem solver at heart. He joined the insurance industry more than twelve years ago, working primarily in the medical stop loss field serving brokers and TPAs. In July of 2014, Daron started XL Benefits with the goal to provide his collective expertise, creative solutions and uncommon service to an industry he loves. You could describe Daron as an avid sports fan, audiobook listening, Fall-loving, board game playing, amateur cooking, dedicated husband, and father of three."
              email="daron@xlbenefits.com"
            />
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <FlipCard
              name="Jennifer Baird"
              title="Stop Loss Sales Consultant"
              expertise={["Self-Funded Health Plans", "Cost Containment", "PBM Analysis"]}
              bio="Jennifer has over 20 years of experience working alongside employers helping manage their benefit offerings. She spent the last 4½ years as an employee benefits consultant and prior to that worked for a TPA for 19 years, supporting large companies to develop and deploy cost containment strategies. Jennifer joined the XL Benefits team in May 2023 as a stop loss sales consultant with the goal to become a trusted partner to our broker and TPA communities on the East Coast. She loves most sports, recently became an MLS Soccer fan (Go Charlotte FC), enjoys spending time on the golf course and the lake."
              email="jennifer@xlbenefits.com"
            />
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <FlipCard
              name="Steve Caler"
              title="Director of Business Development"
              expertise={["Management Experience", "Strategic Problem-Solving", "Client Needs Assessment"]}
              bio="Steve joined XL Benefits with a background in real estate sales and management, as well as years of leading family ministries. He now contributes his more than twenty years of management and personal development experience to the Medical Stop Loss arena. His combined experience leads him to recognize the true needs of others and provide strategic problem-solving solutions. Steve is a sports fanatic, a committed bookworm, and has a passion for business development and a good laugh. He can't pass up eating Mexican food or Cold Stone Creamery (Mud Pie Mojo)."
              email="steve@xlbenefits.com"
            />
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
