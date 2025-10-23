'use client'

import { useGeolocation } from '@/lib/routing/useGeolocation'
import { getAllSalesReps } from '@/lib/routing/salesRepMapping'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ContactPageContent() {
  const { salesRep, location, loading } = useGeolocation()
  const searchParams = useSearchParams()
  const repEmail = searchParams.get('rep')

  // If a specific rep is requested via URL param, show that rep
  const displayRep = repEmail
    ? getAllSalesReps().find(r => r.email === repEmail) || salesRep
    : salesRep

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-6 md:py-9 lg:py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Hero Image */}
            <div className="order-2 md:order-1">
              <div className="relative w-full h-[225px] sm:h-[300px] md:h-[375px] lg:h-[450px] xl:h-[525px]">
                <img
                  src="/images/parallax/contact.jpg"
                  alt="Contact us for stop-loss guidance"
                  className="w-full h-full object-cover rounded-lg"
                  loading="eager"
                />
              </div>
            </div>

            {/* Right Side - Content and Territory Specialist */}
            <div className="order-1 md:order-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Contact Us
              </h1>
              <p className="text-xl sm:text-2xl mb-8 text-white/90">
                Ready to discuss your stop-loss needs? We're here to help.
              </p>

              {/* Territory Specialist Card */}
              {!loading && (
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6">
                  <h2 className="text-lg font-bold text-xl-dark-blue mb-2 text-center">
                    Your Territory Specialist
                  </h2>
                  {location && location.state && (
                    <p className="text-xs text-xl-grey mb-3 text-center">
                      Based on your location
                    </p>
                  )}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-xl-dark-blue mb-2">{displayRep.name}</h3>
                    <a href={`mailto:${displayRep.email}`} className="block text-sm text-xl-bright-blue hover:text-xl-dark-blue mb-1">
                      {displayRep.email}
                    </a>
                    {displayRep.phone && (
                      <a href={`tel:${displayRep.phone}`} className="block text-sm text-xl-bright-blue hover:text-xl-dark-blue mb-3">
                        {displayRep.phone}
                      </a>
                    )}
                    {!displayRep.bookingUrl && (
                      <p className="text-xs text-xl-grey mt-3">
                        Reach out via email or phone to schedule a consultation
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* All Team Members */}
        <div className="bg-xl-light-grey rounded-lg p-8">
          <h3 className="text-2xl font-bold text-xl-dark-blue mb-6 text-center">
            Or Connect With Any Team Member
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {getAllSalesReps().map((rep) => (
              <div key={rep.email} className="bg-white rounded-lg p-6 text-center">
                <h4 className="text-lg font-bold text-xl-dark-blue mb-3">{rep.name}</h4>
                <a
                  href={`mailto:${rep.email}`}
                  className="text-xl-bright-blue text-sm hover:text-xl-dark-blue"
                >
                  {rep.email}
                </a>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/how-we-help/meet-the-team"
              className="text-xl-bright-blue font-semibold hover:text-xl-dark-blue inline-flex items-center"
            >
              Learn more about our team
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Office Information */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold text-xl-dark-blue mb-4 text-center">Office Information</h3>
          <div className="space-y-2 text-xl-grey text-center">
            <p>Hours: Monday - Friday, 8:00 AM - 5:00 PM CST</p>
            <p>General Inquiries: <a href="mailto:info@xlbenefits.com" className="text-xl-bright-blue hover:text-xl-dark-blue">info@xlbenefits.com</a></p>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xl-grey">Loading contact information...</p>
        </div>
      </div>
    }>
      <ContactPageContent />
    </Suspense>
  )
}
