import type { Metadata } from 'next'
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
  trustmarkStandards: {
    group: string
    percent: string
  }[]
}

const stateData: StateData[] = [
  {
    state: 'Alabama',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
    trustmarkStandards: [
      { group: '5-9', percent: '130%' },
      { group: '10+', percent: '115%' },
    ],
  },
  {
    state: 'Alaska',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'Up to 50 paid employees: (1) $4,000 times the number of individuals covered under the health benefit plan; (2) 120% of the expected claims for the health benefit plan; (3) the greater amount by the plan sponsor or (4) $20,000 times the number of aggregate deductibles. 51 or more paid employees: At least 110% of expected claims',
    minAttachment: '$20,000',
    trustmarkStandards: [
      { group: '5-9', percent: '130%' },
      { group: '10-50', percent: '120%' },
      { group: '51+', percent: '115%' },
    ],
  },
  {
    state: 'Arizona',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
    trustmarkStandards: [
      { group: '5-9', percent: '130%' },
      { group: '10+', percent: '115%' },
    ],
  },
  {
    state: 'Arkansas',
    specificDeductible: '$20,000',
    aggregateAttachmentPoint: 'Up to 50 paid employees: (1) $4,000 times the number of enrolled employees; (2) 120% of expected claims, or (3) $20,000, whichever is greater',
    minAttachment: '$20,000',
    trustmarkStandards: [
      { group: '5-9', percent: '130%' },
      { group: '10-50', percent: '120%' },
      { group: '51+', percent: '115%' },
    ],
  },
  {
    state: 'California',
    specificDeductible: 'Up to 100 full-time equivalent employees (FTE): $40,000\n101 or more FTE: $20,000',
    aggregateAttachmentPoint: 'Up to 100 FTE: (1) $5,000 times the number of individuals covered under the health benefit plan; (2) 120% of expected claims; or (3) $20,000 times the number of aggregate deductibles. 101 or more FTE: At least 120% of expected claims',
    minAttachment: 'Up to 100 FTE: $40,000\n101 or more FTE: $20,000',
    trustmarkStandards: [
      { group: '5-9', percent: '130%' },
      { group: '10-100', percent: '120%' },
      { group: '100+', percent: '115%' },
    ],
  },
  {
    state: 'Colorado',
    specificDeductible: 'Up to 100 employees: $20,000\n101 or more employees: $15,000',
    aggregateAttachmentPoint: 'Up to 100 employees: (1) 120% of expected claims or (2) $20,000, whichever is greater\n101 or more employees: At least 120% of expected claims',
    minAttachment: 'Up to 100 employees: $20,000\n101 or more employees: $15,000',
    trustmarkStandards: [
      { group: '5-9', percent: '130%' },
      { group: '10+', percent: '120%' },
    ],
  },
  {
    state: 'Connecticut',
    specificDeductible: '$20,000',
    aggregateAttachmentPoint: 'Up to 50 employees: (1) $4,000 times the number of enrolled employees; (2) 120% of expected claims; or (3) $20,000, whichever is greater\n51 or more employees: At least 110% of expected claims',
    minAttachment: '$20,000',
    trustmarkStandards: [
      { group: '5-9', percent: '130%' },
      { group: '10-50', percent: '120%' },
      { group: '51+', percent: '115%' },
    ],
  },
  {
    state: 'Delaware',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
    trustmarkStandards: [
      { group: '15+', percent: '115%' },
    ],
  },
  {
    state: 'District of Columbia',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
    trustmarkStandards: [
      { group: '51+', percent: '115%' },
    ],
  },
  {
    state: 'Florida',
    specificDeductible: '$20,000',
    aggregateAttachmentPoint: 'Up to 50 employees: (1) $2,000 times the number of enrolled employees; (2) 120% of expected claims; or (3) $20,000, whichever is greater\n51 or more employees: At least 110% of expected claims',
    minAttachment: '$20,000',
    trustmarkStandards: [
      { group: '5-9', percent: '130%' },
      { group: '10-50', percent: '120%' },
      { group: '51+', percent: '115%' },
    ],
  },
  {
    state: 'Georgia',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
    trustmarkStandards: [
      { group: '5-9', percent: '130%' },
      { group: '10+', percent: '115%' },
    ],
  },
  {
    state: 'Idaho',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
    trustmarkStandards: [
      { group: '5-9', percent: '130%' },
      { group: '10+', percent: '115%' },
    ],
  },
  {
    state: 'Illinois',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
    trustmarkStandards: [
      { group: '5-9', percent: '130%' },
      { group: '10+', percent: '115%' },
    ],
  },
  {
    state: 'Indiana',
    specificDeductible: '$10,000',
    aggregateAttachmentPoint: 'No minimum',
    minAttachment: 'No minimum',
    trustmarkStandards: [
      { group: '5-9', percent: '130%' },
      { group: '10+', percent: '115%' },
    ],
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
                    <th className="px-6 py-4 text-left font-bold border-r border-white/20">Minimum Attachment Point Before "Aggregate Only" May Apply</th>
                    <th className="px-6 py-4 text-left font-bold">Trustmark Life Insurance Company Standard Percent of Expected Claims<br/><span className="text-sm font-normal">Group Size | Percent</span></th>
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
                      <td className="px-6 py-4 text-sm text-xl-grey border-r border-gray-200 whitespace-pre-line">
                        {data.minAttachment}
                      </td>
                      <td className="px-6 py-4 text-sm text-xl-grey">
                        {data.trustmarkStandards.map((standard, i) => (
                          <div key={i} className="flex justify-between gap-4 py-1">
                            <span className="font-medium">{standard.group}</span>
                            <span>{standard.percent}</span>
                          </div>
                        ))}
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
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-2">State Regulations</h3>
                <p className="text-sm text-xl-grey mb-4">
                  Detailed information about specific state requirements
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-2">ERISA Guidance</h3>
                <p className="text-sm text-xl-grey mb-4">
                  Understanding federal preemption and compliance
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-xl-bright-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-xl-bright-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-xl-dark-blue mb-2">Expert Support</h3>
                <p className="text-sm text-xl-grey mb-4">
                  Connect with our team for personalized guidance
                </p>
              </div>
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
