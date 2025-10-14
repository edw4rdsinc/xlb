import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function FantasyFootballPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative text-white py-32 min-h-[500px] flex items-center"
        style={{
          backgroundImage: 'url("/images/parallax/fantasy-football.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection animation="fade-up" className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
              XL Benefits Fantasy Football Challenge
            </h1>
            <p className="text-xl text-white drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
              Join our friendly competition for brokers and industry partners.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-xl-grey leading-relaxed mb-6">
                Welcome to the XL Benefits Fantasy Football Challenge! Each season, we bring together brokers, TPAs, and industry partners for some friendly competition on the gridiron.
              </p>

              <h2 className="text-2xl font-bold text-xl-dark-blue mt-8 mb-4">League Details</h2>
              <p className="text-xl-grey mb-6">
                Details about the current season, league format, and how to join will be posted here. Check back soon for updates!
              </p>

              <h2 className="text-2xl font-bold text-xl-dark-blue mt-8 mb-4">How to Join</h2>
              <p className="text-xl-grey mb-6">
                Interested in joining the league? Reach out to our team for an invitation link.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-xl-light-grey">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-4">
              Questions About the League?
            </h2>
            <p className="text-xl text-xl-grey mb-8">
              Get in touch with us for more information.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-xl-bright-blue text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-xl-dark-blue transition-all hover:scale-105"
            >
              Contact Us
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
