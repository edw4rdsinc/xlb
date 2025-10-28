'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  const isTeamPage = pathname === '/how-we-help/meet-the-team'

  return (
    <footer className="bg-gray-700 text-white">
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
            <p className="text-gray-300 text-sm">
              Your sidekick for stop-loss success. Expert guidance and interactive tools for insurance brokers.
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/solutions/truecost-calculator" className="text-gray-300 hover:text-xl-bright-blue transition-colors">
                  TrueCost Calculator
                </Link>
              </li>
              <li>
                <Link href="/solutions/deductible-optimization" className="text-gray-300 hover:text-xl-bright-blue transition-colors">
                  Deductible Analyzer
                </Link>
              </li>
              <li>
                <Link href="/solutions/self-funding-feasibility" className="text-gray-300 hover:text-xl-bright-blue transition-colors">
                  Self-Funding Quiz
                </Link>
              </li>
              <li>
                <Link href="/toolkit" className="text-gray-300 hover:text-xl-bright-blue transition-colors">
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
                <Link href="/resources/white-papers" className="text-gray-300 hover:text-xl-bright-blue transition-colors">
                  White Papers
                </Link>
              </li>
              <li>
                <Link href="/resources/blog" className="text-gray-300 hover:text-xl-bright-blue transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/resources/glossary" className="text-gray-300 hover:text-xl-bright-blue transition-colors">
                  Glossary
                </Link>
              </li>
              <li>
                <Link href="/resources/carrier-directory" className="text-gray-300 hover:text-xl-bright-blue transition-colors">
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
                <Link href="/how-we-help/meet-the-team" className="text-gray-300 hover:text-xl-bright-blue transition-colors">
                  Our Team
                </Link>
              </li>
              {isTeamPage && (
                <li>
                  <Link href="/employee/login" className="text-gray-300 hover:text-xl-bright-blue transition-colors">
                    EE Toolkit
                  </Link>
                </li>
              )}
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-xl-bright-blue transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-8 pt-8 border-t border-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
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
