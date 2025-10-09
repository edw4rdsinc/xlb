'use client'

import Link from 'next/link'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null

  return (
    <div className="md:hidden">
      <div className="space-y-1 px-2 pb-3 pt-2">
        <Link
          href="/how-we-help"
          className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
          onClick={onClose}
        >
          How We Help
        </Link>
        <Link
          href="/toolkit"
          className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
          onClick={onClose}
        >
          Toolkit
        </Link>
        <Link
          href="/resources"
          className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
          onClick={onClose}
        >
          Resources
        </Link>
        <Link
          href="/fantasy-football"
          className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
          onClick={onClose}
        >
          Fantasy Football
        </Link>
        <Link
          href="/contact"
          className="block rounded-md bg-primary-600 px-3 py-2 text-base font-medium text-white hover:bg-primary-500"
          onClick={onClose}
        >
          Contact Us
        </Link>
      </div>
    </div>
  )
}
