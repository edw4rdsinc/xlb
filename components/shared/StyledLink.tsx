import React from 'react'
import Link from 'next/link'

interface StyledLinkProps {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'light' | 'dark'
  external?: boolean
  className?: string
  underline?: boolean
  [key: string]: any // Allow additional props
}

/**
 * Reusable styled link component for consistent link styling across the site
 */
export function StyledLink({
  href,
  children,
  variant = 'primary',
  external = false,
  className = '',
  underline = true,
  ...props
}: StyledLinkProps) {
  const variants = {
    primary: 'text-xl-bright-blue hover:text-xl-dark-blue',
    light: 'text-white hover:text-xl-bright-blue',
    dark: 'text-xl-dark-blue hover:text-xl-bright-blue'
  }

  const underlineClass = underline ? 'hover:underline' : ''
  const combinedClassName = `${variants[variant]} ${underlineClass} transition-colors ${className}`

  // For external links, use anchor tag
  if (external || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        className={combinedClassName}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    )
  }

  // For internal links, use Next.js Link
  return (
    <Link href={href} className={combinedClassName} {...props}>
      {children}
    </Link>
  )
}

/**
 * Email link component with mailto
 */
export function EmailLink({ email, children, ...props }: Omit<StyledLinkProps, 'href'> & { email: string }) {
  return (
    <StyledLink href={`mailto:${email}`} {...props}>
      {children || email}
    </StyledLink>
  )
}

/**
 * Phone link component with tel
 */
export function PhoneLink({ phone, children, ...props }: Omit<StyledLinkProps, 'href'> & { phone: string }) {
  // Remove formatting from phone number for tel: link
  const phoneRaw = phone.replace(/[^\d]/g, '')
  return (
    <StyledLink href={`tel:${phoneRaw}`} {...props}>
      {children || phone}
    </StyledLink>
  )
}