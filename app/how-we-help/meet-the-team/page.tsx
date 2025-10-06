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
              name="Daron Smith"
              title="Principal, Stop-Loss Specialist"
              expertise={["40-Point Contract Analysis", "RFP Management", "Carrier Negotiations"]}
              bio="With over 15 years in the stop-loss industry, Daron specializes in comprehensive contract analysis and carrier negotiations. He has saved clients millions through meticulous RFP management."
              email="daron@xlbenefits.com"
            />
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <FlipCard
              name="Jennifer Martinez"
              title="Senior Account Manager"
              expertise={["Self-Funding Transitions", "COBRA Compliance", "Client Relations"]}
              bio="Jennifer excels at guiding employers through the transition to self-funding. Her expertise in COBRA compliance ensures clients avoid costly mistakes."
              email="jennifer@xlbenefits.com"
            />
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <FlipCard
              name="Steve Johnson"
              title="Underwriting Specialist"
              expertise={["Risk Assessment", "Deductible Optimization", "Claims Analysis"]}
              bio="Steve's deep understanding of underwriting allows him to optimize deductible levels and identify risk factors that others miss."
              email="steve@xlbenefits.com"
            />
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
            <FlipCard
              name="Joe Chen"
              title="Compliance Expert"
              expertise={["Regulatory Compliance", "State Requirements", "DOL Guidance"]}
              bio="Joe keeps clients ahead of changing regulations. His expertise in state-specific requirements and DOL guidance is invaluable."
              email="joe@xlbenefits.com"
            />
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={500}>
            <FlipCard
              name="Christine Davis"
              title="Marketing Specialist"
              expertise={["Broker Support", "Client Communication", "Market Intelligence"]}
              bio="Christine provides brokers with the marketing support and market intelligence they need to win and retain clients."
              email="christine@xlbenefits.com"
            />
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={600}>
            <FlipCard
              name="Erin Thompson"
              title="Implementation Manager"
              expertise={["Plan Setup", "System Integration", "Training"]}
              bio="Erin ensures smooth plan implementations with comprehensive training and seamless system integrations."
              email="erin@xlbenefits.com"
            />
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={700}>
            <FlipCard
              name="Sam Rodriguez"
              title="Data Analyst"
              expertise={["Claims Analytics", "Trend Analysis", "Reporting"]}
              bio="Sam transforms raw claims data into actionable insights, helping clients make data-driven decisions about their health plans."
              email="sam@xlbenefits.com"
            />
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
