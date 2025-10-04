import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'White Papers | XL Benefits',
  description: 'Comprehensive guides on stop-loss insurance, self-funding strategies, compliance, and market analysis.',
  robots: 'max-snippet:-1, index, follow',
}

export default function WhitePapersPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">White Papers</h1>
        <p className="text-xl text-gray-600 mb-12">
          In-depth resources to help you master stop-loss insurance. Coming soon.
        </p>
      </div>
    </div>
  )
}
