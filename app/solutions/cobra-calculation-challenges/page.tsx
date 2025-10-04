import ProblemStatement from '@/components/shared/ProblemStatement'
import ToolComingSoon from '@/components/shared/ToolComingSoon'

export default function CobraCalculationPage() {
  return (
    <div>
      <ProblemStatement
        title="COBRA Rate Calculations for Self-Funded Groups"
        description="Calculating accurate COBRA rates isn't just about adding 2% to the premium. State-specific requirements, carrier variations, and qualifying event nuances can create compliance headaches and unexpected costs for your clients. Get it right the first time with our comprehensive COBRA calculator built specifically for brokers managing self-funded groups."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ToolComingSoon
          toolName="COBRA Calculator"
          description="Comprehensive COBRA rate calculator with state-specific compliance, administrative fee calculations, coverage tier variations, and stop-loss carrier-specific provisions. Tool is far more complex than a simple 2% calculation and requires integration with carrier systems and state regulation databases."
          expectedDate="Q2 2025"
        />
      </div>
    </div>
  )
}
