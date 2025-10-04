import Link from 'next/link'

interface ComplexityRevealProps {
  title?: string
  points: string[]
}

export default function ComplexityReveal({
  title = "What Your Calculation Might Miss",
  points
}: ComplexityRevealProps) {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <ul className="space-y-3">
        {points.map((point, index) => (
          <li key={index} className="flex items-start">
            <svg
              className="h-6 w-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-gray-700">{point}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link
          href="/contact"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Talk to an Expert
        </Link>
      </div>
    </div>
  )
}
