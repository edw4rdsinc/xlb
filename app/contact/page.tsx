export default function ContactPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Contact Us</h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Ready to discuss your stop-loss needs? We're here to help.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Schedule a Consultation</h2>
            <p className="text-gray-600 mb-6">
              Calendly integration coming soon. For now, reach out directly:
            </p>
            <a href="mailto:info@xlbenefits.com" className="text-primary-600 font-semibold text-lg hover:text-primary-700">
              info@xlbenefits.com
            </a>
          </div>

          <div className="border-t pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Office Information</h3>
            <div className="space-y-2 text-gray-700">
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@xlbenefits.com</p>
              <p>Hours: Monday - Friday, 8:00 AM - 5:00 PM CST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
