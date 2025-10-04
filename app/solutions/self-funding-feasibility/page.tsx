import ProblemStatement from '@/components/shared/ProblemStatement'
import ToolComingSoon from '@/components/shared/ToolComingSoon'

export default function SelfFundingFeasibilityPage() {
  return (
    <div>
      <ProblemStatement
        title="Is Your Client Ready for Self-Funding?"
        description="Not every group is ready to take on the risk of self-funding. Our assessment quiz evaluates cash flow, claims history, administrative capacity, and risk tolerance to give you a clear recommendation backed by data."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ToolComingSoon
          toolName="Self-Funding Readiness Assessment"
          description="15-question assessment with scored results and personalized recommendations for transitioning to self-funding."
          expectedDate="Q2 2025"
        />
      </div>
    </div>
  )
}
