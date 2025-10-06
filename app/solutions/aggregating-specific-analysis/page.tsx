import ProblemStatement from '@/components/shared/ProblemStatement'
import ToolComingSoon from '@/components/shared/ToolComingSoon'

export default function AggregatingSpecificPage() {
  return (
    <div>
      <ProblemStatement
        title="Aggregating Specific Deductible Analysis"
        description="Aggregating specific deductibles can unlock significant savings, but carrier availability and contract nuances make it complex. Our calculator models different scenarios to show you the true ROI compared to traditional specific deductibles."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ToolComingSoon
          toolName="Agg Specific Calculator"
          description="ROI comparison tool for aggregating specific vs traditional specific deductibles with claim scenario modeling."
          expectedDate="Q2 2026"
        />
      </div>
    </div>
  )
}
