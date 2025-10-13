import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-xl-dark-blue text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Image
              src="/images/logos/xl-logo-full.png"
              alt="XL Benefits"
              width={200}
              height={50}
              className="h-12 w-auto mb-4"
            />
            <p className="text-xl-light-grey text-sm">
              Your sidekick for stop-loss success. Expert guidance and interactive tools for insurance brokers.
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/solutions/cobra-calculation-challenges" className="text-xl-light-grey hover:text-xl-bright-blue transition-colors">
                  COBRA Calculator
                </Link>
              </li>
              <li>
                <Link href="/solutions/deductible-optimization" className="text-xl-light-grey hover:text-xl-bright-blue transition-colors">
                  Deductible Analyzer
                </Link>
              </li>
              <li>
                <Link href="/solutions/self-funding-feasibility" className="text-xl-light-grey hover:text-xl-bright-blue transition-colors">
                  Self-Funding Quiz
                </Link>
              </li>
              <li>
                <Link href="/toolkit" className="text-xl-light-grey hover:text-xl-bright-blue transition-colors">
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
                <Link href="/resources/white-papers" className="text-xl-light-grey hover:text-xl-bright-blue transition-colors">
                  White Papers
                </Link>
              </li>
              <li>
                <Link href="/resources/blog" className="text-xl-light-grey hover:text-xl-bright-blue transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/resources/glossary" className="text-xl-light-grey hover:text-xl-bright-blue transition-colors">
                  Glossary
                </Link>
              </li>
              <li>
                <Link href="/resources/carrier-directory" className="text-xl-light-grey hover:text-xl-bright-blue transition-colors">
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
                <Link href="/about" className="text-xl-light-grey hover:text-xl-bright-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-we-help/meet-the-team" className="text-xl-light-grey hover:text-xl-bright-blue transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xl-light-grey hover:text-xl-bright-blue transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-8 pt-8 border-t border-xl-bright-blue/30">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-xl-light-grey">
            <p>&copy; {currentYear} XL Benefits. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="hover:text-xl-bright-blue transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-xl-bright-blue transition-colors">
                Terms of Use
              </Link>
              <Link href="/accessibility" className="hover:text-xl-bright-blue transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
