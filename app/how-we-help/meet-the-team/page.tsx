import ExpertBio from '@/components/shared/ExpertBio'

export default function MeetTheTeamPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Meet Our Team</h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Decades of combined stop-loss expertise at your service.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ExpertBio
            name="Daron Smith"
            title="Principal, Stop-Loss Specialist"
            expertise={["40-Point Contract Analysis", "RFP Management", "Carrier Negotiations"]}
          />
          <ExpertBio
            name="Jennifer Martinez"
            title="Senior Account Manager"
            expertise={["Self-Funding Transitions", "COBRA Compliance", "Client Relations"]}
          />
          <ExpertBio
            name="Steve Johnson"
            title="Underwriting Specialist"
            expertise={["Risk Assessment", "Deductible Optimization", "Claims Analysis"]}
          />
          <ExpertBio
            name="Joe Chen"
            title="Compliance Expert"
            expertise={["Regulatory Compliance", "State Requirements", "DOL Guidance"]}
          />
          <ExpertBio
            name="Christine Davis"
            title="Marketing Specialist"
            expertise={["Broker Support", "Client Communication", "Market Intelligence"]}
          />
          <ExpertBio
            name="Erin Thompson"
            title="Implementation Manager"
            expertise={["Plan Setup", "System Integration", "Training"]}
          />
          <ExpertBio
            name="Sam Rodriguez"
            title="Data Analyst"
            expertise={["Claims Analytics", "Trend Analysis", "Reporting"]}
          />
        </div>
      </div>
    </div>
  )
}
