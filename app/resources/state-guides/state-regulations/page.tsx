import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'State-by-State Stop-Loss Regulations | XL Benefits',
  description: 'Comprehensive state-specific stop-loss insurance regulations including minimum deductibles, aggregate attachment points, employer size requirements, and regulatory contacts.',
}

interface StateRegulation {
  state: string
  citation?: string
  employerSize?: string
  minSpecificDeductible?: string
  minAggregateAttachment?: string
  specificRestrictions?: string
  aggregateRestrictions?: string
  guaranteedIssue?: 'Yes' | 'No' | 'N/A'
  otherNotes?: string
  department: string
  website: string
  phone: string
  email?: string
}

const stateRegulations: StateRegulation[] = [
  {
    state: 'Alabama',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Alabama Department of Insurance',
    website: 'https://www.aldoi.gov/',
    phone: '1-334-269-3550',
  },
  {
    state: 'Alaska',
    citation: '§ 21.42.145',
    employerSize: '2-50 Employees',
    minSpecificDeductible: '$10,000',
    specificRestrictions: 'Prohibits specific deductible limits below $10,000',
    aggregateRestrictions: 'Prohibits aggregate coverage attachment points of less than $4,000 per person, or 120% of expected claims or $20,000, whichever is greater',
    guaranteedIssue: 'No',
    otherNotes: 'Prohibits direct payment to covered individuals',
    minAggregateAttachment: '$4,000 per person or 120% of expected claims',
    department: 'Alaska Division of Insurance',
    website: 'https://www.commerce.alaska.gov/web/ins/',
    phone: '1-907-269-7900',
  },
  {
    state: 'Arizona',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Arizona Department of Insurance',
    website: 'https://insurance.az.gov/',
    phone: '1-602-364-3100',
  },
  {
    state: 'Arkansas',
    citation: '§ 23-62-111',
    employerSize: 'All employers',
    minSpecificDeductible: '$20,000',
    specificRestrictions: 'Prohibits specific deductible limits below $20,000',
    aggregateRestrictions: 'For employers with 50 or fewer covered employees, prohibits aggregate coverage attachment points of less than $4,000 per employee per year, 120% of expected claims or $20,000, whichever is greater. For employers with more than 50 covered employees, prohibits aggregate coverage attachment points of lower than 110% of expected claims',
    guaranteedIssue: 'No',
    otherNotes: 'Requires stop-loss applications to disclose that purchase of stop-loss insurance does not relieve employer of all risks and that it does not make the stop-loss carrier a fiduciary. Prohibits direct payment to covered individuals',
    minAggregateAttachment: '$4,000 per employee or 120% of expected claims (≤50 employees); 110% of expected claims (>50 employees)',
    department: 'Arkansas Insurance Department',
    website: 'https://insurance.arkansas.gov/',
    phone: '1-800-852-5494',
  },
  {
    state: 'California',
    citation: 'Ins. Code § 10752-10752.8',
    employerSize: 'Up to 100 FTE: $40,000; 101+ FTE: $15,000',
    minSpecificDeductible: 'Up to 100 FTE: $40,000; 101+ FTE: $15,000',
    specificRestrictions: 'Prohibits specific deductible limits below $40,000 (effective 2016)',
    aggregateRestrictions: 'Prohibits aggregate coverage attachment points of less than $5,000 per person, 120% of expected claims or $40,000, whichever is greater',
    guaranteedIssue: 'Yes',
    otherNotes: 'Guaranteed renewable. Prohibits direct payment to covered individuals',
    minAggregateAttachment: 'Up to 100 FTE: $40,000; 101+ FTE: $10,000',
    department: 'California Department of Insurance',
    website: 'https://www.insurance.ca.gov/',
    phone: '1-800-927-4357',
  },
  {
    state: 'Colorado',
    minSpecificDeductible: 'Up to 100 employees: $20,000; 101+ employees: $15,000',
    minAggregateAttachment: 'Up to 100 employees: $20,000; 101+ employees: $15,000',
    department: 'Colorado Division of Insurance',
    website: 'https://doi.colorado.gov/',
    phone: '1-303-894-7499',
  },
  {
    state: 'Connecticut',
    minSpecificDeductible: '$20,000',
    minAggregateAttachment: '$20,000',
    department: 'Connecticut Insurance Department',
    website: 'https://portal.ct.gov/cid',
    phone: '1-860-297-3800',
  },
  {
    state: 'Delaware',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Delaware Department of Insurance',
    website: 'https://insurance.delaware.gov/',
    phone: '1-302-674-7300',
  },
  {
    state: 'District of Columbia',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'DC Department of Insurance, Securities and Banking',
    website: 'https://disb.dc.gov/',
    phone: '1-202-727-8000',
  },
  {
    state: 'Florida',
    minSpecificDeductible: '$20,000',
    minAggregateAttachment: '$20,000',
    department: 'Florida Office of Insurance Regulation',
    website: 'https://www.floir.com/',
    phone: '850-413-3140',
  },
  {
    state: 'Georgia',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Georgia Office of Commissioner of Insurance',
    website: 'https://oci.georgia.gov/',
    phone: '404-656-2070 or 800-656-2298',
    email: '[email protected]',
  },
  {
    state: 'Idaho',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Idaho Department of Insurance',
    website: 'https://doi.idaho.gov/',
    phone: '1-208-334-4250',
  },
  {
    state: 'Illinois',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Illinois Department of Insurance',
    website: 'https://idoi.illinois.gov/',
    phone: 'Chicago: 312-814-2420, Springfield: 217-782-4515',
  },
  {
    state: 'Indiana',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Indiana Department of Insurance',
    website: 'https://www.in.gov/idoi/',
    phone: '1-317-232-2385',
  },
  {
    state: 'Iowa',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Iowa Insurance Division',
    website: 'https://iid.iowa.gov/',
    phone: '1-515-654-6600',
  },
  {
    state: 'Kansas',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Kansas Insurance Department',
    website: 'https://insurance.kansas.gov/',
    phone: '1-785-296-3071',
  },
  {
    state: 'Kentucky',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Kentucky Department of Insurance',
    website: 'https://insurance.ky.gov/',
    phone: '1-800-595-6053',
  },
  {
    state: 'Louisiana',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Louisiana Department of Insurance',
    website: 'https://www.ldi.la.gov/',
    phone: '1-800-259-5300',
  },
  {
    state: 'Maine',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Maine Bureau of Insurance',
    website: 'https://www.maine.gov/pfr/insurance',
    phone: '1-800-300-5000',
  },
  {
    state: 'Maryland',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Maryland Insurance Administration',
    website: 'https://insurance.maryland.gov/',
    phone: '1-800-492-6116',
  },
  {
    state: 'Massachusetts',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Massachusetts Division of Insurance',
    website: 'https://www.mass.gov/orgs/division-of-insurance',
    phone: '1-617-521-7794',
  },
  {
    state: 'Michigan',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Michigan Department of Insurance and Financial Services',
    website: 'https://www.michigan.gov/difs',
    phone: '1-877-999-6442',
  },
  {
    state: 'Minnesota',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Minnesota Department of Commerce',
    website: 'https://mn.gov/commerce/',
    phone: '1-651-539-1500',
  },
  {
    state: 'Mississippi',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Mississippi Insurance Department',
    website: 'https://www.mid.ms.gov/',
    phone: '1-800-562-2957',
  },
  {
    state: 'Missouri',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Missouri Department of Commerce and Insurance',
    website: 'https://insurance.mo.gov/',
    phone: '1-800-726-7390',
  },
  {
    state: 'Montana',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Montana Commissioner of Securities and Insurance',
    website: 'https://csi.mt.gov/',
    phone: '1-800-332-6148',
  },
  {
    state: 'Nebraska',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Nebraska Department of Insurance',
    website: 'https://doi.nebraska.gov/',
    phone: '1-877-564-7323',
  },
  {
    state: 'Nevada',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Nevada Division of Insurance',
    website: 'https://doi.nv.gov/',
    phone: '1-775-687-0700',
  },
  {
    state: 'New Hampshire',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'New Hampshire Insurance Department',
    website: 'https://www.nh.gov/insurance/',
    phone: '1-603-271-2261',
  },
  {
    state: 'New Jersey',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'New Jersey Department of Banking and Insurance',
    website: 'https://www.state.nj.us/dobi/',
    phone: '1-609-292-7272',
  },
  {
    state: 'New Mexico',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'New Mexico Office of Superintendent of Insurance',
    website: 'https://www.osi.state.nm.us/',
    phone: '1-855-427-5674',
  },
  {
    state: 'New York',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'New York Department of Financial Services',
    website: 'https://www.dfs.ny.gov/',
    phone: '1-800-342-3736',
  },
  {
    state: 'North Carolina',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'North Carolina Department of Insurance',
    website: 'https://www.ncdoi.gov/',
    phone: '919-807-6800 or 855-408-1212',
  },
  {
    state: 'North Dakota',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'North Dakota Insurance Department',
    website: 'https://www.insurance.nd.gov/',
    phone: '1-800-247-0560',
  },
  {
    state: 'Ohio',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Ohio Department of Insurance',
    website: 'https://insurance.ohio.gov/',
    phone: '1-800-686-1526',
  },
  {
    state: 'Oklahoma',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Oklahoma Insurance Department',
    website: 'https://www.oid.ok.gov/',
    phone: '1-800-522-0071',
  },
  {
    state: 'Oregon',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Oregon Division of Financial Regulation',
    website: 'https://dfr.oregon.gov/',
    phone: '1-888-877-4894',
  },
  {
    state: 'Pennsylvania',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Pennsylvania Insurance Department',
    website: 'https://www.pa.gov/en/agencies/insurance.html',
    phone: '1-877-881-6388',
  },
  {
    state: 'Rhode Island',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Rhode Island Department of Business Regulation',
    website: 'https://dbr.ri.gov/',
    phone: '1-401-462-9520',
  },
  {
    state: 'South Carolina',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'South Carolina Department of Insurance',
    website: 'https://doi.sc.gov/',
    phone: '1-803-737-6160',
  },
  {
    state: 'South Dakota',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'South Dakota Division of Insurance',
    website: 'https://dlr.sd.gov/insurance/',
    phone: '1-605-773-3563',
  },
  {
    state: 'Tennessee',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Tennessee Department of Commerce and Insurance',
    website: 'https://www.tn.gov/commerce/insurance.html',
    phone: '1-800-342-4029',
  },
  {
    state: 'Texas',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Texas Department of Insurance',
    website: 'https://www.tdi.texas.gov/',
    phone: '512-676-6000 or 800-578-4677',
  },
  {
    state: 'Utah',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Utah Insurance Department',
    website: 'https://insurance.utah.gov/',
    phone: '1-800-439-3805',
  },
  {
    state: 'Vermont',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Vermont Department of Financial Regulation',
    website: 'https://dfr.vermont.gov/',
    phone: '1-802-828-3301',
  },
  {
    state: 'Virginia',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Virginia Bureau of Insurance',
    website: 'https://scc.virginia.gov/pages/Insurance',
    phone: '1-804-371-9741',
  },
  {
    state: 'Washington',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Washington Office of the Insurance Commissioner',
    website: 'https://www.insurance.wa.gov/',
    phone: '1-800-562-6900',
  },
  {
    state: 'West Virginia',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'West Virginia Offices of the Insurance Commissioner',
    website: 'https://www.wvinsurance.gov/',
    phone: '1-888-879-9842',
  },
  {
    state: 'Wisconsin',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Wisconsin Office of the Commissioner of Insurance',
    website: 'https://oci.wi.gov/',
    phone: '1-800-236-8517',
  },
  {
    state: 'Wyoming',
    minSpecificDeductible: '$10,000',
    minAggregateAttachment: 'No minimum',
    department: 'Wyoming Department of Insurance',
    website: 'https://doi.wyo.gov/',
    phone: '1-800-438-5768',
  },
]

export default function StateRegulationsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-xl-dark-blue to-xl-bright-blue py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#e5bf64' }}>
            State-by-State Stop-Loss Regulations
          </h1>
          <p className="text-xl text-white max-w-3xl">
            Comprehensive reference guide for stop-loss insurance requirements across all 50 states and DC
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-l-4 border-xl-bright-blue p-6 rounded-r-lg">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-xl-bright-blue mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-xl-dark-blue mb-2">Important Notice for Brokers</p>
                <p className="text-xl-grey mb-3">
                  State stop-loss regulations change frequently. This reference guide is based on industry sources and should be verified with your state department of insurance before quoting.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Treatment self-funded health plans may not be available for all states listed. Check product availability at TrustmarkSSB.com
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Last updated: October 2025 | Sources: NABIP, Trustmark, state insurance departments
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* States with Specific Regulations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-xl-dark-blue mb-6">
            States with Specific Stop-Loss Regulations
          </h2>

          <p className="text-xl-grey mb-8">
            The following states have enacted specific minimum deductible or aggregate attachment point requirements for stop-loss insurance:
          </p>

          {/* Alaska */}
          <div className="mb-8 bg-gray-50 rounded-lg p-6 border-l-4 border-xl-bright-blue">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-xl-dark-blue">Alaska</h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                REGULATED
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-xl-dark-blue mb-3">Regulatory Requirements</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Legal Citation:</dt>
                    <dd className="text-xl-grey">Alaska Stat. § 21.42.145</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Applies to:</dt>
                    <dd className="text-xl-grey">Employers with 2-50 employees</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Minimum Specific Deductible:</dt>
                    <dd className="text-xl-grey font-semibold">$10,000</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Minimum Aggregate Attachment:</dt>
                    <dd className="text-xl-grey font-semibold">$4,000 per person or 120% of expected claims or $20,000 (whichever is greater)</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Guaranteed Issue:</dt>
                    <dd className="text-xl-grey">No</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-semibold text-xl-dark-blue mb-3">Additional Requirements</h4>
                <ul className="space-y-2 text-xl-grey">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Prohibits direct payment to covered individuals</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Prohibits specific deductible limits below $10,000</span>
                  </li>
                </ul>

                <h4 className="font-semibold text-xl-dark-blue mb-3 mt-4">State Contact</h4>
                <p className="text-sm text-gray-700">Alaska Division of Insurance</p>
                <p className="text-sm text-xl-grey">Phone: 1-907-269-7900</p>
                <a href="https://www.commerce.alaska.gov/web/ins/" target="_blank" rel="noopener noreferrer" className="text-sm text-xl-bright-blue hover:underline">
                  www.commerce.alaska.gov/web/ins/
                </a>
              </div>
            </div>
          </div>

          {/* Arkansas */}
          <div className="mb-8 bg-gray-50 rounded-lg p-6 border-l-4 border-xl-bright-blue">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-xl-dark-blue">Arkansas</h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                REGULATED
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-xl-dark-blue mb-3">Regulatory Requirements</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Legal Citation:</dt>
                    <dd className="text-xl-grey">Ark. Code § 23-62-111</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Applies to:</dt>
                    <dd className="text-xl-grey">All employers</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Minimum Specific Deductible:</dt>
                    <dd className="text-xl-grey font-semibold">$20,000</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Minimum Aggregate Attachment:</dt>
                    <dd className="text-xl-grey font-semibold">
                      • ≤50 employees: $4,000 per employee or 120% of expected claims or $20,000 (whichever is greater)<br/>
                      • &gt;50 employees: 110% of expected claims
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Guaranteed Issue:</dt>
                    <dd className="text-xl-grey">No</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-semibold text-xl-dark-blue mb-3">Additional Requirements</h4>
                <ul className="space-y-2 text-xl-grey">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Requires stop-loss applications to disclose that purchase does not relieve employer of all risks</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Must disclose that stop-loss carrier is not a fiduciary</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Prohibits direct payment to covered individuals</span>
                  </li>
                </ul>

                <h4 className="font-semibold text-xl-dark-blue mb-3 mt-4">State Contact</h4>
                <p className="text-sm text-gray-700">Arkansas Insurance Department</p>
                <p className="text-sm text-xl-grey">Phone: 1-800-852-5494</p>
                <a href="https://insurance.arkansas.gov/" target="_blank" rel="noopener noreferrer" className="text-sm text-xl-bright-blue hover:underline">
                  insurance.arkansas.gov
                </a>
              </div>
            </div>
          </div>

          {/* California */}
          <div className="mb-8 bg-gray-50 rounded-lg p-6 border-l-4 border-xl-bright-blue">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-xl-dark-blue">California</h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                HIGHLY REGULATED
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-xl-dark-blue mb-3">Regulatory Requirements</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Legal Citation:</dt>
                    <dd className="text-xl-grey">Cal. Ins. Code § 10752-10752.8</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Applies to:</dt>
                    <dd className="text-xl-grey">All employers (thresholds vary by FTE)</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Minimum Specific Deductible:</dt>
                    <dd className="text-xl-grey font-semibold">
                      • Up to 100 FTE: $40,000<br/>
                      • 101+ FTE: $15,000
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Minimum Aggregate Attachment:</dt>
                    <dd className="text-xl-grey font-semibold">
                      • Up to 100 FTE: $40,000<br/>
                      • 101+ FTE: $10,000
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Guaranteed Issue:</dt>
                    <dd className="text-xl-grey font-semibold">Yes</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-semibold text-xl-dark-blue mb-3">Additional Requirements</h4>
                <ul className="space-y-2 text-xl-grey">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Guaranteed renewable coverage</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Prohibits direct payment to covered individuals</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Specific deductible limits below $40,000 prohibited (effective 2016)</span>
                  </li>
                </ul>

                <h4 className="font-semibold text-xl-dark-blue mb-3 mt-4">State Contact</h4>
                <p className="text-sm text-gray-700">California Department of Insurance</p>
                <p className="text-sm text-xl-grey">Phone: 1-800-927-4357</p>
                <a href="https://www.insurance.ca.gov/" target="_blank" rel="noopener noreferrer" className="text-sm text-xl-bright-blue hover:underline">
                  www.insurance.ca.gov
                </a>
              </div>
            </div>
          </div>

          {/* Colorado */}
          <div className="mb-8 bg-gray-50 rounded-lg p-6 border-l-4 border-xl-bright-blue">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-xl-dark-blue">Colorado</h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                REGULATED
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-xl-dark-blue mb-3">Regulatory Requirements</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Minimum Specific Deductible:</dt>
                    <dd className="text-xl-grey font-semibold">
                      • Up to 100 employees: $20,000<br/>
                      • 101+ employees: $15,000
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Minimum Aggregate Attachment:</dt>
                    <dd className="text-xl-grey font-semibold">
                      • Up to 100 employees: $20,000<br/>
                      • 101+ employees: $15,000
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-semibold text-xl-dark-blue mb-3">State Contact</h4>
                <p className="text-sm text-gray-700">Colorado Division of Insurance</p>
                <p className="text-sm text-xl-grey">Phone: 1-303-894-7499</p>
                <a href="https://doi.colorado.gov/" target="_blank" rel="noopener noreferrer" className="text-sm text-xl-bright-blue hover:underline">
                  doi.colorado.gov
                </a>
              </div>
            </div>
          </div>

          {/* Connecticut */}
          <div className="mb-8 bg-gray-50 rounded-lg p-6 border-l-4 border-xl-bright-blue">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-xl-dark-blue">Connecticut</h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                REGULATED
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-xl-dark-blue mb-3">Regulatory Requirements</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Minimum Specific Deductible:</dt>
                    <dd className="text-xl-grey font-semibold">$20,000</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Minimum Aggregate Attachment:</dt>
                    <dd className="text-xl-grey font-semibold">$20,000</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-semibold text-xl-dark-blue mb-3">State Contact</h4>
                <p className="text-sm text-gray-700">Connecticut Insurance Department</p>
                <p className="text-sm text-xl-grey">Phone: 1-860-297-3800</p>
                <a href="https://portal.ct.gov/cid" target="_blank" rel="noopener noreferrer" className="text-sm text-xl-bright-blue hover:underline">
                  portal.ct.gov/cid
                </a>
              </div>
            </div>
          </div>

          {/* Florida */}
          <div className="mb-8 bg-gray-50 rounded-lg p-6 border-l-4 border-xl-bright-blue">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-xl-dark-blue">Florida</h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                REGULATED
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-xl-dark-blue mb-3">Regulatory Requirements</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Minimum Specific Deductible:</dt>
                    <dd className="text-xl-grey font-semibold">$20,000</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700">Minimum Aggregate Attachment:</dt>
                    <dd className="text-xl-grey font-semibold">$20,000</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-semibold text-xl-dark-blue mb-3">State Contact</h4>
                <p className="text-sm text-gray-700">Florida Office of Insurance Regulation</p>
                <p className="text-sm text-xl-grey">Phone: 850-413-3140</p>
                <a href="https://www.floir.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-xl-bright-blue hover:underline">
                  www.floir.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All States Table */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-xl-dark-blue mb-6">
            Complete State Reference Table
          </h2>

          <p className="text-xl-grey mb-6">
            Comprehensive listing of all 50 states and DC with minimum requirements and regulatory contact information.
          </p>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-xl-dark-blue">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      State
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Min Specific Deductible
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Min Aggregate Attachment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Department Contact
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stateRegulations.map((state, index) => (
                    <tr key={state.state} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="font-medium text-xl-dark-blue">{state.state}</div>
                          {state.citation && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Regulated
                            </span>
                          )}
                        </div>
                        {state.employerSize && (
                          <div className="text-xs text-gray-500 mt-1">{state.employerSize}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-xl-grey whitespace-normal">{state.minSpecificDeductible}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-xl-grey whitespace-normal">{state.minAggregateAttachment}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-xl-dark-blue text-xs">{state.department}</div>
                          <div className="text-xs text-xl-grey mt-1">{state.phone}</div>
                          <a
                            href={state.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-xl-bright-blue hover:underline mt-1 inline-block"
                          >
                            Website
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Legend:</strong>
            </p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>• <strong>"No minimum"</strong> indicates the state has not enacted specific minimum attachment point requirements</li>
              <li>• <strong>FTE</strong> = Full-Time Equivalent employees</li>
              <li>• States with "Regulated" badge have specific statutory requirements beyond the standard $10,000 minimum</li>
              <li>• Always verify current requirements with the state department of insurance before quoting</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-xl-dark-blue to-xl-bright-blue py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#e5bf64' }}>
            Need Help Navigating State Regulations?
          </h2>
          <p className="text-xl text-white mb-6 max-w-3xl mx-auto">
            Our team stays current on all 50 states' stop-loss requirements and can help you quote compliant coverage for any group.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center bg-white text-xl-dark-blue px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us for State-Specific Guidance
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  )
}
