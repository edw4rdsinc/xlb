import ProblemStatement from '@/components/shared/ProblemStatement'
import ToolComingSoon from '@/components/shared/ToolComingSoon'

export default function DeductibleOptimizationPage() {
  return (
    <div>
      <ProblemStatement
        title="Optimize Stop-Loss Deductibles for Maximum Savings"
        description="Finding the sweet spot between risk and cost isn't guesswork. Our deductible analyzer helps you model different scenarios, compare specific vs aggregate strategies, and identify the optimal structure for your client's risk profile and budget."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ToolComingSoon
          toolName="Deductible Optimization Calculator"
          description="Side-by-side comparison of deductible strategies with ROI modeling and carrier-specific provisions analysis."
          expectedDate="Q2 2025"
        />
      </div>
    </div>
  )
}
