import ProblemStatement from '@/components/shared/ProblemStatement'
import SelfFundingQuiz from '@/components/tools/SelfFundingQuiz'

export default function SelfFundingFeasibilityPage() {
  return (
    <div>
      <ProblemStatement
        title="Is Your Client Ready for Self-Funding?"
        description="Not every group is ready to take on the risk of self-funding. Our assessment quiz evaluates cash flow, claims history, administrative capacity, and risk tolerance to give you a clear recommendation backed by data."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SelfFundingQuiz />
      </div>
    </div>
  )
}
