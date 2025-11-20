'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface BrandingData {
  clientName: string;
  clientLogo: string | null;
  brokerName: string;
  brokerLogo: string | null;
}

interface FormData {
  // Q1: Current Funding Model
  currentFunding: string;
  // Q2: State of Domicile (not scored)
  stateDomicile: string;
  // Q3: Industry (not scored)
  industry: string;
  // Q4: Group Size
  groupSize: string;
  // Q5: Recent Renewal
  recentRenewal: string;
  // Q6: Avg Renewal
  avgRenewal: string;
  // Q7: Claims Access
  claimsAccess: string;
  // Q8: Single Premium
  singlePremium: string;
  // Q9: PPO Mix
  ppoMix: string;
  // Q10: Financial Stability
  financialStability: string;
  // Q11: Risk Tolerance
  riskTolerance: string;
  // Q12: HR Capacity
  hrCapacity: string;
  // Q13: Broker Experience (not scored)
  brokerExperience: string;

  // Contact info
  email: string;
  companyName: string;
}

const initialFormData: FormData = {
  currentFunding: '',
  stateDomicile: '',
  industry: '',
  groupSize: '',
  recentRenewal: '',
  avgRenewal: '',
  claimsAccess: '',
  singlePremium: '',
  ppoMix: '',
  financialStability: '',
  riskTolerance: '',
  hrCapacity: '',
  brokerExperience: '',
  email: '',
  companyName: '',
};

export default function SelfFundingQuizClient() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBranding, setShowBranding] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  const [branding, setBranding] = useState<BrandingData>({
    clientName: '',
    clientLogo: null,
    brokerName: '',
    brokerLogo: null,
  });

  const clientLogoRef = useRef<HTMLInputElement>(null);
  const brokerLogoRef = useRef<HTMLInputElement>(null);

  const totalSections = 4;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const isCurrentSectionComplete = (): boolean => {
    switch (currentSection) {
      case 1:
        return !!(formData.currentFunding && formData.stateDomicile && formData.industry && formData.groupSize);
      case 2:
        return !!(formData.recentRenewal && formData.avgRenewal && formData.claimsAccess);
      case 3:
        return !!(formData.singlePremium && formData.ppoMix);
      case 4:
        return !!(formData.financialStability && formData.riskTolerance && formData.hrCapacity && formData.brokerExperience);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/calculators/assessment/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email || undefined,
          companyName: formData.companyName || undefined,
          answers: {
            currentFunding: formData.currentFunding,
            stateDomicile: formData.stateDomicile,
            industry: formData.industry,
            groupSize: formData.groupSize,
            recentRenewal: formData.recentRenewal,
            avgRenewal: formData.avgRenewal,
            claimsAccess: formData.claimsAccess,
            singlePremium: formData.singlePremium,
            ppoMix: formData.ppoMix,
            financialStability: formData.financialStability,
            riskTolerance: formData.riskTolerance,
            hrCapacity: formData.hrCapacity,
            brokerExperience: formData.brokerExperience,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Assessment calculation failed');
      }

      const data = await response.json();

      // Store results and show branding screen
      setAssessmentResults(data.data);
      setShowBranding(true);
      setLoading(false);
    } catch (err) {
      setError('Failed to calculate assessment. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  const handleLogoUpload = (type: 'client' | 'broker', file: File | null) => {
    if (!file) {
      setBranding(prev => ({
        ...prev,
        [type === 'client' ? 'clientLogo' : 'brokerLogo']: null
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setBranding(prev => ({
        ...prev,
        [type === 'client' ? 'clientLogo' : 'brokerLogo']: e.target?.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleViewResults = () => {
    // Combine assessment results with branding data
    const resultsWithBranding = {
      ...assessmentResults,
      branding: {
        clientName: branding.clientName || null,
        clientLogo: branding.clientLogo || null,
        brokerName: branding.brokerName || null,
        brokerLogo: branding.brokerLogo || null,
      }
    };

    // Store in sessionStorage to avoid URL length limits with base64 images
    sessionStorage.setItem('assessmentResults', JSON.stringify(resultsWithBranding));
    window.location.href = `/solutions/self-funding-feasibility/results`;
  };

  const handleSkipBranding = () => {
    // Store in sessionStorage
    sessionStorage.setItem('assessmentResults', JSON.stringify(assessmentResults));
    window.location.href = `/solutions/self-funding-feasibility/results`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-xl-bright-blue border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-xl-grey">Analyzing your readiness...</p>
        </div>
      </div>
    );
  }

  // Branding screen - shown after assessment is complete
  if (showBranding) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-xl-dark-blue mb-2">
              Assessment Complete!
            </h2>
            <p className="text-xl-grey">
              Personalize your report with client and broker branding (optional)
            </p>
          </div>

          <div className="space-y-6">
            {/* Client Branding */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-xl-dark-blue mb-4">Client Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-xl-grey mb-2">
                    Client Company Name
                  </label>
                  <input
                    type="text"
                    value={branding.clientName}
                    onChange={(e) => setBranding(prev => ({ ...prev, clientName: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
                    placeholder="Enter client company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-xl-grey mb-2">
                    Client Logo
                  </label>
                  <input
                    ref={clientLogoRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload('client', e.target.files?.[0] || null)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue text-sm"
                  />
                  {branding.clientLogo && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={branding.clientLogo}
                        alt="Client logo preview"
                        className="h-12 object-contain"
                      />
                      <button
                        onClick={() => {
                          setBranding(prev => ({ ...prev, clientLogo: null }));
                          if (clientLogoRef.current) clientLogoRef.current.value = '';
                        }}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Broker Branding */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-xl-dark-blue mb-4">Broker Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-xl-grey mb-2">
                    Broker/Agency Name
                  </label>
                  <input
                    type="text"
                    value={branding.brokerName}
                    onChange={(e) => setBranding(prev => ({ ...prev, brokerName: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
                    placeholder="Enter broker or agency name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-xl-grey mb-2">
                    Broker Logo
                  </label>
                  <input
                    ref={brokerLogoRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload('broker', e.target.files?.[0] || null)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue text-sm"
                  />
                  {branding.brokerLogo && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={branding.brokerLogo}
                        alt="Broker logo preview"
                        className="h-12 object-contain"
                      />
                      <button
                        onClick={() => {
                          setBranding(prev => ({ ...prev, brokerLogo: null }));
                          if (brokerLogoRef.current) brokerLogoRef.current.value = '';
                        }}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSkipBranding}
              className="px-6 py-3 bg-white text-xl-grey border border-gray-300 font-semibold rounded-lg hover:bg-xl-light-grey transition-colors"
            >
              Skip Branding
            </button>
            <button
              onClick={handleViewResults}
              className="px-6 py-3 bg-xl-bright-blue text-white font-semibold rounded-lg hover:bg-xl-dark-blue transition-colors"
            >
              View Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results are now shown on a separate page - this component just handles the quiz

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-xl-grey">
              Section {currentSection} of {totalSections}
            </span>
            <span className="text-sm font-medium text-xl-grey">
              {Math.round((currentSection / totalSections) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-xl-light-grey rounded-full h-2">
            <div
              className="bg-xl-bright-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentSection / totalSections) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Section 1: Basics */}
        {currentSection === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-xl-dark-blue mb-6">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-semibold text-xl-dark-blue mb-2">
                Current Funding Model
              </label>
              <p className="text-sm text-xl-grey mb-2">What is the group's current health insurance funding model?</p>
              <select
                value={formData.currentFunding}
                onChange={(e) => handleInputChange('currentFunding', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select one</option>
                <option value="fully-insured">Fully Insured</option>
                <option value="level-funded">Level Funded</option>
                <option value="already-self-funded">Already Self-Funded</option>
                <option value="not-sure">Not Sure</option>
                <option value="trust-peo-mewa">Trust / PEO / MEWA</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-xl-dark-blue mb-2">
                State of Domicile
              </label>
              <p className="text-sm text-xl-grey mb-2">What state is the group located in (if multiple, please select headquarters)?</p>
              <select
                value={formData.stateDomicile}
                onChange={(e) => handleInputChange('stateDomicile', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select state</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
                <option value="DC">Washington DC</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-xl-dark-blue mb-2">
                Industry
              </label>
              <p className="text-sm text-xl-grey mb-2">What industry is the company in?</p>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select industry</option>
                <option value="agriculture">Agriculture</option>
                <option value="construction">Construction</option>
                <option value="education">Education</option>
                <option value="government">Government / Municipality</option>
                <option value="healthcare">Healthcare</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="nonprofit">Nonprofit</option>
                <option value="professional-services">Professional Services</option>
                <option value="retail-hospitality">Retail / Hospitality</option>
                <option value="technology">Technology</option>
                <option value="transportation">Transportation / Logistics</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-xl-dark-blue mb-2">
                Group Size (Enrolled, all plans)
              </label>
              <p className="text-sm text-xl-grey mb-2">How many employees are currently enrolled in all company-sponsored health plans?</p>
              <select
                value={formData.groupSize}
                onChange={(e) => handleInputChange('groupSize', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select one</option>
                <option value="under-50">&lt;50</option>
                <option value="50-99">50–99</option>
                <option value="100-199">100–199</option>
                <option value="200-499">200–499</option>
                <option value="500-plus">500+</option>
              </select>
            </div>
          </div>
        )}

        {/* Section 2: Renewal & Claims */}
        {currentSection === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-xl-dark-blue mb-6">
              Renewal History & Claims Data
            </h2>

            <div>
              <label className="block text-sm font-semibold text-xl-dark-blue mb-2">
                Most Recent Medical Renewal Increase
              </label>
              <p className="text-sm text-xl-grey mb-2">What was the increase negotiated for the company's most recent health insurance renewal?</p>
              <p className="text-xs text-xl-grey mb-2 italic">Why it matters: Recent renewal performance signals urgency and potential for improvement.</p>
              <select
                value={formData.recentRenewal}
                onChange={(e) => handleInputChange('recentRenewal', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select one</option>
                <option value="reduction">Reduction in rates</option>
                <option value="0-7">0–7%</option>
                <option value="8-12">8–12%</option>
                <option value="13-17">13–17%</option>
                <option value="18-25">18–25%</option>
                <option value="26-40">26–40%</option>
                <option value="over-40">40%+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-xl-dark-blue mb-2">
                Average Medical Renewal Increase (last 3–4 years)
              </label>
              <p className="text-sm text-xl-grey mb-2">What is the average health insurance renewal increase for the company over the last 3–4 years?</p>
              <p className="text-xs text-xl-grey mb-2 italic">Why it matters: A lower long-term average indicates pricing stability and better risk.</p>
              <select
                value={formData.avgRenewal}
                onChange={(e) => handleInputChange('avgRenewal', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select one</option>
                <option value="0-7">0–7%</option>
                <option value="8-12">8–12%</option>
                <option value="13-17">13–17%</option>
                <option value="18-25">18–25%</option>
                <option value="over-25">25%+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-xl-dark-blue mb-2">
                Access to Claims Experience
              </label>
              <p className="text-sm text-xl-grey mb-2">Does the group have access to claims experience (at least with their annual renewal)?</p>
              <p className="text-xs text-xl-grey mb-2 italic">Why it matters: Claims data is essential for accurate stop-loss underwriting and modeling.</p>
              <select
                value={formData.claimsAccess}
                onChange={(e) => handleInputChange('claimsAccess', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select one</option>
                <option value="both-monthly-and-large">Yes, both monthly claims and large claims</option>
                <option value="large-claims-only">Yes, but large claims only</option>
                <option value="monthly-claims-only">Yes, but monthly claims only</option>
                <option value="no-access">No, claims experience is not available</option>
              </select>
            </div>
          </div>
        )}

        {/* Section 3: Plan Design */}
        {currentSection === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-xl-dark-blue mb-6">
              Plan Design & Enrollment
            </h2>

            <div>
              <label className="block text-sm font-semibold text-xl-dark-blue mb-2">
                Single Premium (Employee Only) on Base Plan
              </label>
              <p className="text-sm text-xl-grey mb-2">What is the current monthly rate for the employee-only plan? If more than one plan, please use the base/lowest cost plan.</p>
              <p className="text-xs text-xl-grey mb-2 italic">Why it matters: Higher single premiums often indicate more room for improvement under self-funding.</p>
              <select
                value={formData.singlePremium}
                onChange={(e) => handleInputChange('singlePremium', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select one</option>
                <option value="age-banded">It depends… we are age-banded</option>
                <option value="under-500">&lt;$500</option>
                <option value="500-649">$500–$649</option>
                <option value="650-799">$650–$799</option>
                <option value="800-999">$800–$999</option>
                <option value="1000-plus">$1,000+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-xl-dark-blue mb-2">
                PPO/EPO Enrollment Mix
              </label>
              <p className="text-sm text-xl-grey mb-2">What percentage of enrolled employees are in PPO plans?</p>
              <p className="text-xs text-xl-grey mb-2 italic">Note: HMO-heavy groups can still transition, but execution is more complex.</p>
              <select
                value={formData.ppoMix}
                onChange={(e) => handleInputChange('ppoMix', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select one</option>
                <option value="90-100">90–100% PPO</option>
                <option value="60-89">60–89% PPO</option>
                <option value="40-59">40–59% PPO</option>
                <option value="10-39">10–39% PPO</option>
                <option value="0-9">0–9% PPO</option>
              </select>
            </div>
          </div>
        )}

        {/* Section 4: Organizational Readiness */}
        {currentSection === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-xl-dark-blue mb-6">
              Organizational Readiness
            </h2>

            <div>
              <label className="block text-sm font-semibold text-xl-dark-blue mb-2">
                Financial Stability / Cash Flow Readiness
              </label>
              <p className="text-sm text-xl-grey mb-2">How would you describe the company's financial stability?</p>
              <p className="text-xs text-xl-grey mb-2 italic">Rule of thumb: Can the group fund monthly claims with normal variance? Are reserves maintained?</p>
              <select
                value={formData.financialStability}
                onChange={(e) => handleInputChange('financialStability', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select one</option>
                <option value="very-stable">Very Stable – Consistent revenue, strong growth</option>
                <option value="stable">Stable – Predictable revenue, steady operation</option>
                <option value="moderate">Moderate – Some fluctuations in revenue</option>
                <option value="unstable">Unstable – Significant revenue variability</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-xl-dark-blue mb-2">
                Leadership Risk Tolerance
              </label>
              <p className="text-sm text-xl-grey mb-2">How would you describe the company's risk tolerance?</p>
              <select
                value={formData.riskTolerance}
                onChange={(e) => handleInputChange('riskTolerance', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select one</option>
                <option value="high">High – Very comfortable budgeting for month-to-month variability</option>
                <option value="moderate">Moderate – Some variability is acceptable</option>
                <option value="low">Low – Prefer predictable costs</option>
                <option value="very-low">Very Low – Need maximum cost certainty</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-xl-dark-blue mb-2">
                HR Team Capacity
              </label>
              <p className="text-sm text-xl-grey mb-2">How would you describe the HR team's capacity to manage a self-funded plan?</p>
              <select
                value={formData.hrCapacity}
                onChange={(e) => handleInputChange('hrCapacity', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select one</option>
                <option value="dedicated-experienced">Dedicated benefits team with experience</option>
                <option value="shared-some-experience">Shared responsibilities, some benefits experience</option>
                <option value="limited-minimal-experience">Limited HR staff, minimal benefits experience</option>
                <option value="no-dedicated">No dedicated HR resources</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-xl-dark-blue mb-2">
                Broker Experience with Self-Funding
              </label>
              <p className="text-sm text-xl-grey mb-2">How would you describe your experience helping a group transition to self-funding?</p>
              <p className="text-xs text-xl-grey mb-2 italic">Used to tailor XLB education, resources, and implementation support.</p>
              <select
                value={formData.brokerExperience}
                onChange={(e) => handleInputChange('brokerExperience', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select one</option>
                <option value="extensive">Extensive experience</option>
                <option value="some">Some experience</option>
                <option value="none">No experience</option>
              </select>
            </div>

            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-xl-dark-blue">Your Contact Information (Optional)</h3>

              <div>
                <label className="block text-sm font-medium text-xl-grey mb-2">
                  Company/Brokerage Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
                  placeholder="Your Company Name (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-xl-grey mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
                  placeholder="your@email.com (optional)"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            disabled={currentSection === 1}
            className="px-6 py-3 bg-white text-xl-grey border border-gray-300 font-semibold rounded-lg hover:bg-xl-light-grey transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!isCurrentSectionComplete()}
            className="px-6 py-3 bg-xl-bright-blue text-white font-semibold rounded-lg hover:bg-xl-dark-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentSection === totalSections ? 'Calculate Score' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
