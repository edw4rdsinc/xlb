import React from 'react'

interface SectionProps {
  children: React.ReactNode
  background?: 'white' | 'gray' | 'light-gray' | 'dark-blue' | 'gradient' | 'transparent'
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'sm' | 'md' | 'lg'
  className?: string
  id?: string
}

/**
 * Reusable section wrapper component for consistent page sections
 */
export function Section({
  children,
  background = 'white',
  containerSize = 'lg',
  padding = 'md',
  className = '',
  id
}: SectionProps) {
  const backgroundStyles = {
    white: 'bg-white',
    gray: 'bg-gray-100',
    'light-gray': 'bg-xl-light-grey',
    'dark-blue': 'bg-xl-dark-blue text-white',
    gradient: 'bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white',
    transparent: 'bg-transparent'
  }

  const containerSizes = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-7xl',
    xl: 'max-w-screen-xl',
    full: 'max-w-full'
  }

  const paddingSizes = {
    sm: 'py-8',
    md: 'py-16',
    lg: 'py-24'
  }

  return (
    <section
      id={id}
      className={`${paddingSizes[padding]} ${backgroundStyles[background]} ${className}`}
    >
      <div className={`${containerSizes[containerSize]} mx-auto px-4 sm:px-6 lg:px-8`}>
        {children}
      </div>
    </section>
  )
}

/**
 * Hero section variant with special styling
 */
export function HeroSection({
  children,
  backgroundImage,
  overlay = true,
  className = '',
  ...props
}: SectionProps & { backgroundImage?: string; overlay?: boolean }) {
  return (
    <section
      className={`relative min-h-[50vh] flex items-center ${className}`}
      {...props}
    >
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          {overlay && <div className="absolute inset-0 bg-black/40" />}
        </>
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {children}
      </div>
    </section>
  )
}

/**
 * CTA section variant with gradient background
 */
export function CTASection({
  title,
  description,
  children,
  className = ''
}: {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <Section
      background="gradient"
      className={`text-center ${className}`}
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
          {description}
        </p>
      )}
      {children}
    </Section>
  )
}