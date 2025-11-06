import type { Metadata } from 'next'
import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'

export const metadata: Metadata = {
  title: 'Stop-Loss Insurance State Guides | XL Benefits',
  description: 'State-by-state stop-loss insurance regulations, specific deductibles, aggregate attachment points, and Trustmark life insurance standards.',
}

interface StateData {
  state: string
  specificDeductible: string
  aggregateAttachmentPoint: string
  minAttachment: string
}

const stateData: StateData[] = [
  {
    state: 'Alabama',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
  },
  {
    state: 'Alaska',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'Up to 50 paid employees: (1) $4,000 times the number of individuals covered under the health benefit plan; (2) 120% of the expected claims for the health benefit plan; (3) the greater amount by the plan sponsor or (4) $20,000 times the number of aggregate deductibles. 51 or more paid employees: At least 110% of expected claims',
    minAttachment: '$20,000',
  },
  {
    state: 'Arizona',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
  },
  {
    state: 'Arkansas',
    specificDeductible: '$20,000',
    aggregateAttachmentPoint: 'Up to 50 paid employees: (1) $4,000 times the number of enrolled employees; (2) 120% of expected claims, or (3) $20,000, whichever is greater',
    minAttachment: '$20,000',
  },
  {
    state: 'California',
    specificDeductible: 'Up to 100 full-time equivalent employees (FTE): $40,000\n101 or more FTE: $20,000',
    aggregateAttachmentPoint: 'Up to 100 FTE: (1) $5,000 times the number of individuals covered under the health benefit plan; (2) 120% of expected claims; or (3) $20,000 times the number of aggregate deductibles. 101 or more FTE: At least 120% of expected claims',
    minAttachment: 'Up to 100 FTE: $40,000\n101 or more FTE: $20,000',
  },
  {
    state: 'Colorado',
    specificDeductible: 'Up to 100 employees: $20,000\n101 or more employees: $15,000',
    aggregateAttachmentPoint: 'Up to 100 employees: (1) 120% of expected claims or (2) $20,000, whichever is greater\n101 or more employees: At least 120% of expected claims',
    minAttachment: 'Up to 100 employees: $20,000\n101 or more employees: $15,000',
  },
  {
    state: 'Connecticut',
    specificDeductible: '$20,000',
    aggregateAttachmentPoint: 'Up to 50 employees: (1) $4,000 times the number of enrolled employees; (2) 120% of expected claims; or (3) $20,000, whichever is greater\n51 or more employees: At least 110% of expected claims',
    minAttachment: '$20,000',
  },
  {
    state: 'Delaware',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
  },
  {
    state: 'District of Columbia',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
  },
  {
    state: 'Florida',
    specificDeductible: '$20,000',
    aggregateAttachmentPoint: 'Up to 50 employees: (1) $2,000 times the number of enrolled employees; (2) 120% of expected claims; or (3) $20,000, whichever is greater\n51 or more employees: At least 110% of expected claims',
    minAttachment: '$20,000',
  },
  {
    state: 'Georgia',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
  },
  {
    state: 'Idaho',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
  },
  {
    state: 'Illinois',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
  },
  {
    state: 'Indiana',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
  },
]

export default function StateGuidesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Stop-Loss Insurance State Guides
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              State-specific regulations and attachment point requirements
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* State Reference Table */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-xl-dark-blue text-white">
                    <th className="px-6 py-4 text-left font-bold border-r border-white/20">State</th>
                    <th className="px-6 py-4 text-left font-bold border-r border-white/20">Specific Deductibles<br/><span className="text-sm font-normal">Minimum Specific Deductible</span></th>
                    <th className="px-6 py-4 text-left font-bold border-r border-white/20">Aggregate Attachment Point<br/><span className="text-sm font-normal">State-Defined Minimum Aggregate Attachment Point</span></th>
                    <th className="px-6 py-4 text-left font-bold">Minimum Attachment Point Before "Aggregate Only" May Apply</th>
                  </tr>
                </thead>
                <tbody>
                  {stateData.map((data, index) => (
                    <tr
                      key={data.state}
                      className={`${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      } hover:bg-xl-light-grey/50 transition-colors`}
                    >
                      <td className="px-6 py-4 font-semibold text-xl-dark-blue border-r border-gray-200">
                        {data.state}
                      </td>
                      <td className="px-6 py-4 text-sm text-xl-grey border-r border-gray-200 whitespace-pre-line">
                        {data.specificDeductible}
                      </td>
                      <td className="px-6 py-4 text-sm text-xl-grey border-r border-gray-200 whitespace-pre-line">
                        {data.aggregateAttachmentPoint}
                      </td>
                      <td className="px-6 py-4 text-sm text-xl-grey whitespace-pre-line">
                        {data.minAttachment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>

          {/* Note for additional states */}
          <AnimatedSection animation="fade-up" delay={100}>
            <div className="mt-8 bg-xl-light-grey rounded-lg p-6">
              <p className="text-sm text-xl-grey">
                <strong className="text-xl-dark-blue">Note:</strong> This table shows data for the first 14 states. Additional states follow similar patterns with varying specific deductibles and aggregate attachment point requirements. For complete state-by-state information, please contact your XL Benefits representative.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-xl-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-8 text-center">Need More Information?</h2>
            <div className="flex justify-center">
              <Link href="/contact" className="group">
                <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-16 h-16 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-xl-bright-blue/20 transition-colors">
                    <svg className="w-8 h-8 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-xl-dark-blue mb-2 group-hover:text-xl-bright-blue transition-colors">Expert Support</h3>
                  <p className="text-sm text-xl-grey mb-4">
                    Connect with our team for personalized guidance
                  </p>
                </div>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Reference Attribution */}
      <section className="py-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-xl-grey text-center">
            Reference data compiled from state insurance department regulations and Trustmark Small Business Benefits materials.
            For the most current information, please verify with your state insurance department or contact XL Benefits.
          </p>
        </div>
      </section>
    </div>
  )
}
