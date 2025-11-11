export default function AccessibilityPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Accessibility</h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="mb-6">
            XL Benefits and its agencies are committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Web Content Accessibility Guidelines (WCAG)</h2>
            <p className="mb-4">
              The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
            </p>
            <p className="mb-4">
              <strong>xlbenefits.com</strong> is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Ongoing Efforts</h2>
            <p className="mb-4">
              Website accessibility efforts are an on-going process where all areas of xlbenefits.com are reviewed to ensure that WCAG are met on all pages, content, and elements of the website. We will continue to test the XL Benefits website using assistive technologies in order to ensure we move to full compliance to WCAG 2.0 Level A.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="mb-4">
              Should you have any questions or are experiencing difficulty accessing our website, please email us at{' '}
              <a href="mailto:info@xlbenefits.com" className="text-xl-bright-blue hover:underline">
                info@xlbenefits.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
