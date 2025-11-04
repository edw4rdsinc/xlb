import React from 'react'

interface ResponsiveHeroProps {
  /** Desktop background image path */
  backgroundImage: string
  /** Optional mobile background image path (defaults to desktop image) */
  mobileBackgroundImage?: string
  /** Background position for desktop (default: 'center') */
  backgroundPosition?: string
  /** Background position for mobile (default: 'center top') */
  mobileBackgroundPosition?: string
  /** Overlay opacity (0-100, default: 40) */
  overlayOpacity?: number
  /** Minimum height (default: '50vh') */
  minHeight?: string
  /** Children content */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * Responsive hero section with mobile-optimized background images
 *
 * Features:
 * - Different background positioning for mobile/desktop
 * - Optional separate mobile background image
 * - Configurable overlay opacity
 * - Better mobile display of hero images
 */
export default function ResponsiveHero({
  backgroundImage,
  mobileBackgroundImage,
  backgroundPosition = 'center',
  mobileBackgroundPosition = 'center top',
  overlayOpacity = 40,
  minHeight = '50vh',
  children,
  className = '',
}: ResponsiveHeroProps) {
  return (
    <section
      className={`relative text-white flex items-center ${className}`}
      style={{ minHeight }}
    >
      {/* Desktop Background */}
      <div
        className="hidden md:block absolute inset-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: backgroundPosition,
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Mobile Background - optimized positioning */}
      <div
        className="md:hidden absolute inset-0"
        style={{
          backgroundImage: `url(${mobileBackgroundImage || backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: mobileBackgroundPosition,
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }}
      />

      {/* Content */}
      <div className="relative w-full">
        {children}
      </div>
    </section>
  )
}
