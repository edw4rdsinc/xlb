import AnimatedSection from '@/components/shared/AnimatedSection'

export default function BlogPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Blog
            </h1>
            <p className="text-xl text-white/90">
              Industry insights and best practices. Coming soon.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
