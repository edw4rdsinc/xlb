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
      {/* Hero Section with Phone Parallax */}
      <section
        className="relative text-white py-32 min-h-[700px] flex items-center"
        style={{
          backgroundImage: 'url("/images/parallax/contact.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>Contact Us</h1>
            <p className="text-xl drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
              Ready to discuss your stop-loss needs? We're here to help.
            </p>
          </div>
        </div>
      </section>

      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Your Territory Specialist */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-xl-dark-blue mb-2">
              Your Territory Specialist
            </h2>
            {loading ? (
              <p className="text-xl-grey">Connecting you with the right specialist...</p>
            ) : (
              <>
                {location && location.state && (
                  <p className="text-sm text-xl-grey mb-4">
                    Based on your location
                  </p>
                )}
                <div className="bg-xl-light-grey rounded-lg p-6 my-6">
                  <h3 className="text-2xl font-bold text-xl-dark-blue mb-2">{displayRep.name}</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 text-xl-bright-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${displayRep.email}`} className="text-xl-bright-blue font-semibold hover:text-xl-dark-blue">
                        {displayRep.email}
                      </a>
                    </div>

                    {displayRep.phone && (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 text-xl-bright-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <a href={`tel:${displayRep.phone}`} className="text-xl-bright-blue font-semibold hover:text-xl-dark-blue">
                          {displayRep.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {displayRep.bookingUrl ? (
                    <div className="mt-6">
                      <a
                        href={displayRep.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-xl-bright-blue text-white px-8 py-3 rounded-md font-semibold hover:bg-xl-dark-blue transition-all hover:scale-105"
                      >
                        Schedule a Meeting
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-xl-grey mt-4">
                      Reach out via email or phone to schedule a consultation
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* All Team Members */}
        <div className="bg-xl-light-grey rounded-lg p-8">
          <h3 className="text-2xl font-bold text-xl-dark-blue mb-6 text-center">
            Or Connect With Any Team Member
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {getAllSalesReps().map((rep) => (
              <div key={rep.email} className="bg-white rounded-lg p-6 text-center">
                <h4 className="text-lg font-bold text-xl-dark-blue mb-2">{rep.name}</h4>
                <p className="text-sm text-xl-grey mb-3">Territory: {rep.territory.length} states</p>
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
