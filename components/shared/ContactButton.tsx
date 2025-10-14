'use client'

import { useGeolocation } from '@/lib/routing/useGeolocation'
import Link from 'next/link'

interface ContactButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}

/**
 * Smart contact button that routes to the appropriate sales rep based on user location
 * Falls back to general contact page if booking URL is not available
 */
export default function ContactButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children = 'Contact Us'
}: ContactButtonProps) {
  const { salesRep, loading } = useGeolocation()

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-xl-bright-blue text-white hover:bg-xl-dark-blue'
      case 'secondary':
        return 'bg-white text-xl-dark-blue hover:bg-gray-100'
      case 'outline':
        return 'bg-transparent border-2 border-white text-white hover:bg-white/10'
      default:
        return 'bg-xl-bright-blue text-white hover:bg-xl-dark-blue'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm'
      case 'md':
        return 'px-6 py-3 text-base'
      case 'lg':
        return 'px-8 py-4 text-lg'
      default:
        return 'px-6 py-3 text-base'
    }
  }

  // If booking URL is available, link directly to it
  // Otherwise, link to contact page with rep info in query params
  const contactUrl = salesRep.bookingUrl
    ? salesRep.bookingUrl
    : `/contact?rep=${encodeURIComponent(salesRep.email)}`

  const baseClasses = `rounded-md font-semibold transition-all hover:scale-105 hover:shadow-lg inline-flex items-center justify-center`

  if (loading) {
    return (
      <div
        className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${className} opacity-70 cursor-wait`}
      >
        {children}
      </div>
    )
  }

  return (
    <Link
      href={contactUrl}
      className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      title={`Contact ${salesRep.name}`}
    >
      {children}
    </Link>
  )
}
