import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stop-Loss Insurance State Guides | XL Benefits',
  description: 'State-specific stop-loss insurance regulations, contact information, ERISA preemption guidance, and ACA compliance requirements for self-funded health plans.',
}

const states = [
  {
    name: 'California',
    department: 'California Department of Insurance',
    website: 'https://www.insurance.ca.gov/',
    phone: '1-800-927-4357',
    resources: 'Laws & Regulations section, Commissioner\'s Bulletins'
  },
  {
    name: 'Texas',
    department: 'Texas Department of Insurance',
    website: 'https://www.tdi.texas.gov/',
    phone: '512-676-6000 or 800-578-4677',
    resources: 'TDI regulations and bulletins'
  },
  {
    name: 'Florida',
    department: 'Florida Office of Insurance Regulation',
    website: 'https://www.floir.com/',
    phone: '850-413-3140',
    resources: 'Office of Insurance Regulation guidance'
  },
  {
    name: 'New York',
    department: 'New York Department of Financial Services',
    website: 'https://www.dfs.ny.gov/',
    phone: '1-800-342-3736',
    resources: 'Industry Guidance section, NYCRR'
  },
  {
    name: 'Illinois',
    department: 'Illinois Department of Insurance',
    website: 'https://idoi.illinois.gov/',
    phone: 'Chicago: 312-814-2420, Springfield: 217-782-4515',
    resources: 'Illinois insurance regulations'
  },
  {
    name: 'Pennsylvania',
    department: 'Pennsylvania Insurance Department',
    website: 'https://www.pa.gov/en/agencies/insurance.html',
    phone: '1-877-881-6388',
    resources: 'Pennsylvania insurance regulations'
  },
  {
    name: 'Ohio',
    department: 'Ohio Department of Insurance',
    website: 'https://insurance.ohio.gov/',
    phone: '1-800-686-1526',
    resources: 'Ohio Department of Insurance resources'
  },
  {
    name: 'Georgia',
    department: 'Georgia Office of Commissioner of Insurance',
    website: 'https://oci.georgia.gov/',
    phone: '404-656-2070 or 800-656-2298',
    email: '[email protected]',
    resources: 'Georgia insurance regulations'
  },
  {
    name: 'North Carolina',
    department: 'North Carolina Department of Insurance',
    website: 'https://www.ncdoi.gov/',
    phone: '919-807-6800 or 855-408-1212',
    resources: 'NC Department of Insurance guidance'
  },
  {
    name: 'Michigan',
    department: 'Michigan Department of Insurance and Financial Services',
    website: 'https://www.michigan.gov/difs',
    phone: '1-877-999-6442',
    resources: 'DIFS regulations and bulletins'
  }
]

export default function StateGuidesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-xl-dark-blue to-xl-bright-blue py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#e5bf64' }}>
            Stop-Loss Insurance State Guides
          </h1>
          <p className="text-xl text-white max-w-3xl">
            Navigate state-specific regulations, understand ERISA preemption, and ensure ACA compliance for self-funded health plans.
          </p>
        </div>
      </section>

      {/* ERISA Preemption Explainer */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-6">
              Understanding ERISA Preemption for Self-Funded Plans
            </h2>

            <div className="bg-blue-50 border-l-4 border-xl-bright-blue p-6 mb-8">
              <p className="text-lg font-semibold text-xl-dark-blue mb-2">
                Quick Answer:
              </p>
              <p className="text-xl-grey">
                Self-funded health plans sponsored by private employers are exempt from state insurance laws under ERISA Section 514(a). However, stop-loss insurance contracts ARE considered insurance and are subject to state regulation.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-xl-dark-blue mb-4">
              What Does ERISA Preemption Mean for Brokers?
            </h3>

            <div className="space-y-4 mb-8">
              <p className="text-xl-grey leading-relaxed">
                The Employee Retirement Income Security Act (ERISA) creates a dual regulatory environment that every broker needs to understand:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-bold text-xl-dark-blue mb-3 flex items-center">
                    <svg className="w-6 h-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Exempt from State Laws
                  </h4>
                  <ul className="space-y-2 text-xl-grey">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Self-funded health plan benefits</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Plan design and coverage requirements</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>State-mandated benefits</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Premium taxes</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-red-50 rounded-lg p-6">
                  <h4 className="font-bold text-xl-dark-blue mb-3 flex items-center">
                    <svg className="w-6 h-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Subject to State Regulation
                  </h4>
                  <ul className="space-y-2 text-xl-grey">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Stop-loss insurance contracts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Carrier licensing requirements</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Rate and form filings (varies by state)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Minimum attachment points (in some states)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-xl-dark-blue mb-4">
              Practical Implications for Insurance Brokers
            </h3>

            <div className="space-y-4 mb-8">
              <div className="border-l-4 border-xl-bright-blue pl-4">
                <p className="font-semibold text-xl-dark-blue mb-2">Plan Design Flexibility</p>
                <p className="text-xl-grey">
                  Self-funded plans can be customized without state-mandated benefit requirements, giving employers more control over coverage and costs.
                </p>
              </div>

              <div className="border-l-4 border-xl-bright-blue pl-4">
                <p className="font-semibold text-xl-dark-blue mb-2">Stop-Loss Compliance</p>
                <p className="text-xl-grey">
                  While the self-funded plan is exempt, the stop-loss policy must comply with your state's insurance regulations, including carrier licensing and any attachment point minimums.
                </p>
              </div>

              <div className="border-l-4 border-xl-bright-blue pl-4">
                <p className="font-semibold text-xl-dark-blue mb-2">Regulatory Dual Tracking</p>
                <p className="text-xl-grey">
                  Brokers must monitor both federal requirements (ERISA, ACA) and state stop-loss regulations to ensure complete compliance.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Authoritative Sources:</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• U.S. Department of Labor, Employee Benefits Security Administration (EBSA)</li>
                <li>• ERISA Section 514(a) - Preemption of State Laws</li>
                <li>• Self-Insurance Institute of America (SIIA)</li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">Last verified: October 2025</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* State Regulatory Contact Directory */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-xl-dark-blue mb-6">
            State Regulatory Contact Directory
          </h2>

          <div className="bg-blue-50 border-l-4 border-xl-bright-blue p-6 mb-8 max-w-4xl">
            <p className="text-lg font-semibold text-xl-dark-blue mb-2">
              Need State-Specific Regulations?
            </p>
            <p className="text-xl-grey">
              Contact your state department of insurance directly to verify stop-loss carrier licensing, minimum attachment point requirements, rate/form filing procedures, and recent regulatory guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {states.map((state) => (
              <div key={state.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-4">{state.name}</h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Department:</p>
                    <p className="text-xl-grey">{state.department}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">Website:</p>
                    <a
                      href={state.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl-bright-blue hover:underline break-all"
                    >
                      {state.website}
                    </a>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">Phone:</p>
                    <p className="text-xl-grey">{state.phone}</p>
                  </div>

                  {state.email && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Email:</p>
                      <a
                        href={`mailto:${state.email}`}
                        className="text-xl-bright-blue hover:underline"
                      >
                        {state.email}
                      </a>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold text-gray-700">Key Resources:</p>
                    <p className="text-sm text-xl-grey">{state.resources}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg p-6 max-w-4xl">
            <h3 className="text-xl font-bold text-xl-dark-blue mb-4">
              What to Ask Your State Department of Insurance
            </h3>
            <ul className="space-y-2 text-xl-grey">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-xl-bright-blue mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Are there minimum specific attachment point requirements?</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-xl-bright-blue mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Which stop-loss carriers are licensed in this state?</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-xl-bright-blue mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Are rate and form filings required for stop-loss policies?</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-xl-bright-blue mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Have there been recent bulletins or guidance on self-funded plans?</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-xl-bright-blue mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Are there specific producer licensing requirements for stop-loss?</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 mt-6 max-w-4xl">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> Contact information verified October 2025. State regulations change frequently. Always verify current requirements directly with the state department of insurance.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ACA Compliance Checklist */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-xl-dark-blue mb-6">
              ACA Compliance Checklist for Self-Funded Plans
            </h2>

            <div className="bg-blue-50 border-l-4 border-xl-bright-blue p-6 mb-8">
              <p className="text-lg font-semibold text-xl-dark-blue mb-2">
                Important:
              </p>
              <p className="text-xl-grey">
                While self-funded plans are exempt from state insurance laws, they must comply with federal Affordable Care Act (ACA) requirements. Use this checklist to ensure your clients meet all applicable mandates.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-4 flex items-center">
                  <div className="w-8 h-8 bg-xl-bright-blue rounded-full flex items-center justify-center text-white font-bold mr-3">
                    1
                  </div>
                  Employer Shared Responsibility (Employer Mandate)
                </h3>
                <div className="ml-11">
                  <p className="text-xl-grey mb-3">
                    <strong>Applies to:</strong> Employers with 50+ full-time equivalent employees
                  </p>
                  <ul className="space-y-2 text-xl-grey">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Offer minimum essential coverage to 95% of full-time employees</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Coverage must be affordable (employee cost ≤ 9.12% of household income for 2025)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Coverage must provide minimum value (≥ 60% actuarial value)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>File Form 1094-C and 1095-C annually with the IRS</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-4 flex items-center">
                  <div className="w-8 h-8 bg-xl-bright-blue rounded-full flex items-center justify-center text-white font-bold mr-3">
                    2
                  </div>
                  Preventive Care Coverage (No Cost-Sharing)
                </h3>
                <div className="ml-11">
                  <p className="text-xl-grey mb-3">
                    <strong>Applies to:</strong> Non-grandfathered plans
                  </p>
                  <ul className="space-y-2 text-xl-grey">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Cover USPSTF Grade A and B preventive services at 100%</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Include immunizations recommended by ACIP</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Cover preventive care for infants, children, and adolescents</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Cover women's preventive services (including contraceptives)</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-4 flex items-center">
                  <div className="w-8 h-8 bg-xl-bright-blue rounded-full flex items-center justify-center text-white font-bold mr-3">
                    3
                  </div>
                  Emergency Services Coverage
                </h3>
                <div className="ml-11">
                  <p className="text-xl-grey mb-3">
                    <strong>Applies to:</strong> Non-grandfathered plans
                  </p>
                  <ul className="space-y-2 text-xl-grey">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Cover emergency services without prior authorization</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Apply in-network cost-sharing even when out-of-network</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>No requirement to seek plan approval before receiving care</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-4 flex items-center">
                  <div className="w-8 h-8 bg-xl-bright-blue rounded-full flex items-center justify-center text-white font-bold mr-3">
                    4
                  </div>
                  Internal Claims and Appeals Procedures
                </h3>
                <div className="ml-11">
                  <p className="text-xl-grey mb-3">
                    <strong>Applies to:</strong> Non-grandfathered plans
                  </p>
                  <ul className="space-y-2 text-xl-grey">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Provide detailed adverse benefit determination notices</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Allow claimants to review claim files and present evidence</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Ensure decisions on appeal are made by individuals not involved in initial decision</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Meet strict timeframes for urgent and non-urgent claims</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-4 flex items-center">
                  <div className="w-8 h-8 bg-xl-bright-blue rounded-full flex items-center justify-center text-white font-bold mr-3">
                    5
                  </div>
                  External Review Requirements
                </h3>
                <div className="ml-11">
                  <p className="text-xl-grey mb-3">
                    <strong>Applies to:</strong> Non-grandfathered plans
                  </p>
                  <ul className="space-y-2 text-xl-grey">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Provide access to independent external review after exhausting internal appeals</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Use accredited independent review organization (IRO)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>External review decision is binding on the plan</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>No cost to claimant for external review process</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-4 flex items-center">
                  <div className="w-8 h-8 bg-xl-bright-blue rounded-full flex items-center justify-center text-white font-bold mr-3">
                    6
                  </div>
                  Summary of Benefits and Coverage (SBC)
                </h3>
                <div className="ml-11">
                  <p className="text-xl-grey mb-3">
                    <strong>Applies to:</strong> All group health plans
                  </p>
                  <ul className="space-y-2 text-xl-grey">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Provide SBC at enrollment, renewal, and upon request</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Use DOL/CMS template and uniform glossary</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Include coverage examples showing how plan pays for common scenarios</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Notice of material modifications required within 60 days of changes</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-4 flex items-center">
                  <div className="w-8 h-8 bg-xl-bright-blue rounded-full flex items-center justify-center text-white font-bold mr-3">
                    7
                  </div>
                  Mental Health Parity
                </h3>
                <div className="ml-11">
                  <p className="text-xl-grey mb-3">
                    <strong>Applies to:</strong> Plans offering mental health/substance use disorder benefits
                  </p>
                  <ul className="space-y-2 text-xl-grey">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Financial requirements and treatment limitations cannot be more restrictive than medical/surgical benefits</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Deductibles, copays, coinsurance, and out-of-pocket maximums must be comparable</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Non-quantitative treatment limitations (NQTLs) must be comparable</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-xl-dark-blue mb-4 flex items-center">
                  <div className="w-8 h-8 bg-xl-bright-blue rounded-full flex items-center justify-center text-white font-bold mr-3">
                    8
                  </div>
                  HIPAA Privacy and Security
                </h3>
                <div className="ml-11">
                  <p className="text-xl-grey mb-3">
                    <strong>Applies to:</strong> All group health plans
                  </p>
                  <ul className="space-y-2 text-xl-grey">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Provide Notice of Privacy Practices</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Protect participant protected health information (PHI)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Implement security safeguards for electronic PHI</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Execute Business Associate Agreements (BAAs) with TPAs and vendors</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold text-xl-dark-blue mb-4">Additional Compliance Considerations</h3>
              <ul className="space-y-2 text-xl-grey">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>COBRA:</strong> Continuation coverage requirements for qualifying events</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>ERISA Reporting:</strong> Form 5500 annual filing requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Newborns' and Mothers' Health Protection Act:</strong> Minimum maternity stay requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Women's Health and Cancer Rights Act:</strong> Mastectomy coverage requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Michelle's Law:</strong> Coverage for medically necessary leave of absence for students</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Genetic Information Nondiscrimination Act (GINA):</strong> Prohibition on genetic information discrimination</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 mt-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Authoritative Sources:</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Internal Revenue Service (IRS) - Employer Shared Responsibility Provisions</li>
                <li>• Centers for Medicare & Medicaid Services (CMS) - ACA Implementation FAQs</li>
                <li>• U.S. Department of Labor (DOL) - ERISA and Employee Benefits Security Administration</li>
                <li>• Healthcare.gov - ACA Regulations and Guidance</li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">Last verified: October 2025. Regulations change frequently. Consult legal counsel for current requirements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-xl-dark-blue to-xl-bright-blue py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#e5bf64' }}>
            Need Help with Compliance or Stop-Loss Quoting?
          </h2>
          <p className="text-xl text-white mb-6 max-w-3xl mx-auto">
            Our team stays current on federal and state regulations to help you navigate the complex landscape of self-funded health plans.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-white text-xl-dark-blue px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us Today
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
