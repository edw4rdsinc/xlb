import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">XL Benefits</h3>
            <p className="text-gray-400 text-sm">
              Your sidekick for stop-loss success. Expert guidance and interactive tools for insurance brokers.
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/solutions/cobra-calculation-challenges" className="text-gray-400 hover:text-white">
                  COBRA Calculator
                </Link>
              </li>
              <li>
                <Link href="/solutions/deductible-optimization" className="text-gray-400 hover:text-white">
                  Deductible Analyzer
                </Link>
              </li>
              <li>
                <Link href="/solutions/self-funding-feasibility" className="text-gray-400 hover:text-white">
                  Self-Funding Quiz
                </Link>
              </li>
              <li>
                <Link href="/toolkit" className="text-gray-400 hover:text-white">
                  Broker Toolkit
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/resources/white-papers" className="text-gray-400 hover:text-white">
                  White Papers
                </Link>
              </li>
              <li>
                <Link href="/resources/blog" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/resources/glossary" className="text-gray-400 hover:text-white">
                  Glossary
                </Link>
              </li>
              <li>
                <Link href="/resources/carrier-directory" className="text-gray-400 hover:text-white">
                  Carrier Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-we-help/meet-the-team" className="text-gray-400 hover:text-white">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {currentYear} XL Benefits. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms of Use
              </Link>
              <Link href="/accessibility" className="hover:text-white">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
