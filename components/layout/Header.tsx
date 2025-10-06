'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import MobileNav from './MobileNav'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-md'
          : 'bg-white shadow-sm'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-xl-dark-blue hover:text-xl-bright-blue transition-colors">
              XL Benefits
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/solutions" className="text-xl-grey hover:text-xl-bright-blue transition-colors">
              Solutions
            </Link>
            <Link href="/toolkit" className="text-xl-grey hover:text-xl-bright-blue transition-colors">
              Toolkit
            </Link>
            <Link href="/resources" className="text-xl-grey hover:text-xl-bright-blue transition-colors">
              Resources
            </Link>
            <Link href="/how-we-help" className="text-xl-grey hover:text-xl-bright-blue transition-colors">
              How We Help
            </Link>
            <Link href="/fantasy-football" className="text-xl-grey hover:text-xl-bright-blue transition-colors">
              Fantasy Football
            </Link>
            <Link
              href="/contact"
              className="rounded-md bg-xl-bright-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-xl-dark-blue transition-colors"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  )
}
