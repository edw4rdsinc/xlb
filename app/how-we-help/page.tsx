import Link from 'next/link'

export default function HowWeHelpPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-primary-50 to-primary-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 text-center">
            How We Help Brokers Win
          </h1>
          <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto">
            Expert stop-loss guidance, market access, and tools to serve your clients better.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/how-we-help/our-process">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Process</h2>
                <p className="text-gray-600">
                  40-point inspection, RFP management, and what to expect working with us.
                </p>
              </div>
            </Link>

            <Link href="/how-we-help/meet-the-team">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Meet the Team</h2>
                <p className="text-gray-600">
                  Expert bios, areas of expertise, and how to connect with our specialists.
                </p>
              </div>
            </Link>

            <Link href="/how-we-help/why-brokers-choose-us">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Choose Us</h2>
                <p className="text-gray-600">
                  Value proposition, differentiators, and 25+ carrier relationships.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
