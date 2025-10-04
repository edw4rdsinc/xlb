interface CaseStudyCardProps {
  problem: string
  action: string
  result: string
  savings?: string
}

export default function CaseStudyCard({ problem, action, result, savings }: CaseStudyCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Problem</h4>
          <p className="text-gray-900">{problem}</p>
        </div>

        <div className="border-l-4 border-primary-500 pl-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">XL Action</h4>
          <p className="text-gray-900">{action}</p>
        </div>

        <div className="bg-green-50 rounded-md p-4">
          <h4 className="text-sm font-semibold text-green-800 uppercase mb-2">Result</h4>
          <p className="text-gray-900 mb-2">{result}</p>
          {savings && (
            <p className="text-2xl font-bold text-green-700">{savings}</p>
          )}
        </div>
      </div>
    </div>
  )
}
