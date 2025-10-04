export default function AccessibilityPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Accessibility Statement</h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="mb-6">
            XL Benefits is committed to ensuring digital accessibility for all users, including those with disabilities.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Commitment</h2>
          <p className="mb-6">
            We continuously work to improve the accessibility of our website and interactive tools, adhering to WCAG 2.1 Level AA standards.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Accessibility Features</h2>
          <ul className="space-y-2 mb-6">
            <li>• Semantic HTML for screen reader compatibility</li>
            <li>• Keyboard navigation support</li>
            <li>• Sufficient color contrast ratios</li>
            <li>• Responsive design for all device sizes</li>
            <li>• ARIA labels where appropriate</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Feedback</h2>
          <p className="mb-6">
            If you encounter accessibility barriers, please contact us at accessibility@xlbenefits.com
          </p>
        </div>
      </div>
    </div>
  )
}
