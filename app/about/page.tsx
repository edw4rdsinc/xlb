export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About XL Benefits</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-6">
            XL Benefits is a stop-loss insurance specialist dedicated to helping brokers serve their clients better through expert guidance, market access, and innovative tools.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            To be the trusted sidekick for insurance brokers navigating stop-loss challenges, providing tools, expertise, and market access that makes their jobs easier and their clients more successful.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Makes Us Different</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>25+ carrier relationships for true market access</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Broker-first philosophy with no carrier conflicts</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Free interactive tools designed by brokers, for brokers</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Expert team with decades of combined stop-loss experience</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
