import React from 'react'
import Link from 'next/link'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  asLink?: string
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  asLink,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all rounded-md disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-xl-bright-blue text-white hover:bg-xl-dark-blue',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-xl-bright-blue text-xl-bright-blue hover:bg-xl-bright-blue hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  }

  const widthClass = fullWidth ? 'w-full' : ''

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`

  // If asLink is provided, render as a Link component
  if (asLink) {
    return (
      <Link href={asLink} className={combinedClassName}>
        {children}
      </Link>
    )
  }

  return (
    <button
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  )
}

// Export a convenience component for primary CTA buttons
export function CTAButton({ children, ...props }: Omit<ButtonProps, 'variant' | 'size'>) {
  return <Button variant="primary" size="lg" {...props}>{children}</Button>
}