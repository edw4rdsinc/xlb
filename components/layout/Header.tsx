'use client'

import Link from 'next/link'
import Image from 'next/image'
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
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logos/xl-logo-icon.png"
                alt="XL Benefits"
                width={40}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/how-we-help" className="text-xl-dark-blue hover:text-xl-bright-blue transition-colors font-medium">
              How We Help
            </Link>
            <Link href="/toolkit" className="text-xl-dark-blue hover:text-xl-bright-blue transition-colors font-medium">
              Toolkit
            </Link>
            <Link href="/resources" className="text-xl-dark-blue hover:text-xl-bright-blue transition-colors font-medium">
              Resources
            </Link>
            <Link href="/fantasy-football" className="text-xl-dark-blue hover:text-xl-bright-blue transition-colors font-medium">
              Fantasy Football
            </Link>
            <Link href="/employee/login" className="text-xl-dark-blue hover:text-xl-bright-blue transition-colors font-medium">
              Employee Portal
            </Link>
            <Link
              href="/contact"
              className="rounded-md bg-xl-bright-blue px-6 py-3 md:px-4 md:py-2 text-sm font-semibold shadow-sm hover:bg-xl-dark-blue transition-colors"
              style={{ color: 'white' }}
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
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
