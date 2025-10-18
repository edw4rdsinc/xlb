'use client';

import { useState, useMemo } from 'react';
import { useAssessment } from '@/lib/hooks/useCalculatorAPI';

interface FormData {
  // Section 1: Basic Company Info
  employeeCount: string;
  industry: string;
  currentFunding: string;

  // Section 2: Financial Health
  financialStability: string;
  cashReserves: string;
  riskTolerance: string;
  budgetFlexibility: string;

  // Section 3: Claims History
  claimsPattern: string;
  largeClaimsHistory: string;
  chronicConditions: string;

  // Section 4: Administrative Readiness
  hrCapacity: string;
  vendorRelationships: string;
  dataAnalytics: string;
  employeeCommunication: string;

  // Contact Info
  email: string;
  companyName: string;
}

const initialFormData: FormData = {
  employeeCount: '',
  industry: '',
  currentFunding: '',
  financialStability: '',
  cashReserves: '',
  riskTolerance: '',
  budgetFlexibility: '',
  claimsPattern: '',
  largeClaimsHistory: '',
  chronicConditions: '',
  hrCapacity: '',
  vendorRelationships: '',
  dataAnalytics: '',
  employeeCommunication: '',
  email: '',
  companyName: '',
};

/**
 * Self-Funding Assessment Quiz with Protected Backend Scoring
 * All scoring algorithms run server-side
 */
export default function SelfFundingQuizSecure() {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showResults, setShowResults] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const totalSections = 4;

  // Use the protected API hook
  const { calculate, loading: isCalculating, error: apiError, data: assessmentResults } = useAssessment({
    onSuccess: (results) => {
      console.log('Assessment completed');
      setShowResults(true);
    },
    onError: (error) => {
      console.error('API Error:', error);
      setValidationErrors({ api: error });
    }
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
  };

  const validateSection = (section: number): boolean => {
    const errors: Record<string, string> = {};

    switch (section) {
      case 1:
        if (!formData.employeeCount) errors.employeeCount = 'Please select employee count';
        if (!formData.industry) errors.industry = 'Please enter your industry';
        if (!formData.currentFunding) errors.currentFunding = 'Please select current funding type';
        break;

      case 2:
        if (!formData.financialStability) errors.financialStability = 'Please rate financial stability';
        if (!formData.cashReserves) errors.cashReserves = 'Please select cash reserves level';
        if (!formData.riskTolerance) errors.riskTolerance = 'Please select risk tolerance';
        if (!formData.budgetFlexibility) errors.budgetFlexibility = 'Please rate budget flexibility';
        break;

      case 3:
        if (!formData.claimsPattern) errors.claimsPattern = 'Please describe claims pattern';
        if (!formData.largeClaimsHistory) errors.largeClaimsHistory = 'Please select large claims history';
        if (!formData.chronicConditions) errors.chronicConditions = 'Please rate chronic conditions';
        break;

      case 4:
        if (!formData.hrCapacity) errors.hrCapacity = 'Please describe HR capacity';
        if (!formData.vendorRelationships) errors.vendorRelationships = 'Please rate vendor relationships';
        if (!formData.dataAnalytics) errors.dataAnalytics = 'Please describe data analytics capabilities';
        if (!formData.employeeCommunication) errors.employeeCommunication = 'Please rate communication';
        if (!formData.email) errors.email = 'Email is required to receive results';
        if (!formData.companyName) errors.companyName = 'Company name is required';
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      if (currentSection === totalSections) {
        handleSubmit();
      } else {
        setCurrentSection(currentSection + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    // Prepare answers object (excluding email and company name which go separately)
    const answers: Record<string, any> = { ...formData };
    const email = answers.email;
    const companyName = answers.companyName;
    delete answers.email;
    delete answers.companyName;

    // Call protected API
    await calculate({
      email,
      companyName,
      answers
    });
  };

  const handleStartOver = () => {
    setFormData(initialFormData);
    setCurrentSection(1);
    setShowResults(false);
    setValidationErrors({});
  };

  // Show loading state
  if (isCalculating) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-xl-bright-blue border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-xl-grey">Analyzing your readiness...</p>
          <p className="text-sm text-xl-grey/70 mt-2">Evaluating all factors for self-funding success</p>
        </div>
      </div>
    );
  }

  // Show results
  if (showResults && assessmentResults) {
    const { readinessLevel, readinessPercentage, scoreBreakdown,
            primaryRecommendation, keyStrengths, areasForImprovement, nextSteps } = assessmentResults;

    const readinessColors: Record<string, string> = {
      'ready': 'text-green-600 bg-green-50 border-green-200',
      'conditional': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'not-ready': 'text-red-600 bg-red-50 border-red-200'
    };

    const readinessLabels: Record<string, string> = {
      'ready': 'Ready for Self-Funding',
      'conditional': 'Conditionally Ready',
      'not-ready': 'Not Yet Ready'
    };

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Overall Readiness */}
        <div className={`p-6 rounded-lg border-2 ${readinessColors[readinessLevel]}`}>
          <h2 className="text-2xl font-bold mb-2">
            {readinessLabels[readinessLevel]}
          </h2>
          <p className="text-lg mb-4">
            Overall Readiness Score: <strong>{readinessPercentage}%</strong>
          </p>
          <p className="text-base">{primaryRecommendation}</p>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-xl-dark-blue mb-4">Score Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(scoreBreakdown).map(([category, data]: [string, any]) => (
              <div key={category}>
                <div className="flex justify-between mb-1">
                  <span className="capitalize">{category}</span>
                  <span className="font-medium">{data.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-xl-bright-blue h-2 rounded-full"
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        {keyStrengths.length > 0 && (
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-800 mb-3">Key Strengths</h3>
            <ul className="list-disc list-inside space-y-1 text-green-700">
              {keyStrengths.map((strength: string, index: number) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Improvement */}
        {areasForImprovement.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-800 mb-3">Areas for Improvement</h3>
            <ul className="list-disc list-inside space-y-1 text-yellow-700">
              {areasForImprovement.map((area: string, index: number) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-xl-dark-blue mb-3">Recommended Next Steps</h3>
          <ol className="list-decimal list-inside space-y-2 text-xl-grey">
            {nextSteps.map((step: string, index: number) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStartOver}
            className="px-6 py-3 bg-xl-bright-blue text-white rounded-lg hover:bg-xl-dark-blue"
          >
            Start New Assessment
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 border border-xl-dark-blue text-xl-dark-blue rounded-lg hover:bg-xl-light-grey"
          >
            Print Results
          </button>
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500">
          <p>Assessment scoring performed using proprietary algorithms on secure servers.</p>
        </div>
      </div>
    );
  }

  // Show form
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
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
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-xl-bright-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentSection / totalSections) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Display */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error:</p>
          <p className="text-red-600">{apiError}</p>
        </div>
      )}

      {/* Section 1: Company Info */}
      {currentSection === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-xl-dark-blue">Basic Company Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Employees *
            </label>
            <select
              value={formData.employeeCount}
              onChange={(e) => handleInputChange('employeeCount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select employee count</option>
              <option value="1-50">1-50</option>
              <option value="51-100">51-100</option>
              <option value="101-500">101-500</option>
              <option value="500+">500+</option>
            </select>
            {validationErrors.employeeCount && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.employeeCount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry *
            </label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Manufacturing, Technology, Healthcare"
            />
            {validationErrors.industry && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.industry}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Funding Type *
            </label>
            <select
              value={formData.currentFunding}
              onChange={(e) => handleInputChange('currentFunding', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select funding type</option>
              <option value="fully-insured">Fully Insured</option>
              <option value="level-funded">Level Funded</option>
              <option value="self-funded">Self-Funded</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {validationErrors.currentFunding && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.currentFunding}</p>
            )}
          </div>
        </div>
      )}

      {/* Section 2: Financial Health */}
      {currentSection === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-xl-dark-blue">Financial Health</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Financial Stability *
            </label>
            <select
              value={formData.financialStability}
              onChange={(e) => handleInputChange('financialStability', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select stability level</option>
              <option value="very-stable">Very Stable - Strong cash flow, profitable for 3+ years</option>
              <option value="stable">Stable - Consistent revenue, modest growth</option>
              <option value="moderate">Moderate - Some fluctuations, but manageable</option>
              <option value="unstable">Unstable - Significant revenue variations</option>
            </select>
            {validationErrors.financialStability && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.financialStability}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cash Reserves *
            </label>
            <select
              value={formData.cashReserves}
              onChange={(e) => handleInputChange('cashReserves', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select reserves level</option>
              <option value="6-months">6+ months of claims</option>
              <option value="3-6-months">3-6 months of claims</option>
              <option value="1-3-months">1-3 months of claims</option>
              <option value="less-1-month">Less than 1 month</option>
            </select>
            {validationErrors.cashReserves && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.cashReserves}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risk Tolerance *
            </label>
            <select
              value={formData.riskTolerance}
              onChange={(e) => handleInputChange('riskTolerance', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select risk tolerance</option>
              <option value="high">High - Can absorb significant variations</option>
              <option value="moderate">Moderate - Can handle some fluctuations</option>
              <option value="low">Low - Prefer predictability</option>
              <option value="very-low">Very Low - Need stable costs</option>
            </select>
            {validationErrors.riskTolerance && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.riskTolerance}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Flexibility *
            </label>
            <select
              value={formData.budgetFlexibility}
              onChange={(e) => handleInputChange('budgetFlexibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select flexibility level</option>
              <option value="high">High - Can adjust quickly to cost changes</option>
              <option value="moderate">Moderate - Some room for adjustments</option>
              <option value="low">Low - Limited ability to adjust</option>
              <option value="none">None - Fixed budget constraints</option>
            </select>
            {validationErrors.budgetFlexibility && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.budgetFlexibility}</p>
            )}
          </div>
        </div>
      )}

      {/* Section 3: Claims History */}
      {currentSection === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-xl-dark-blue">Claims History</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Claims Pattern (Last 3 Years) *
            </label>
            <select
              value={formData.claimsPattern}
              onChange={(e) => handleInputChange('claimsPattern', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select pattern</option>
              <option value="stable">Stable - Consistent year over year</option>
              <option value="decreasing">Decreasing - Trending downward</option>
              <option value="increasing">Increasing - Trending upward</option>
              <option value="unknown">Unknown - Limited data available</option>
            </select>
            {validationErrors.claimsPattern && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.claimsPattern}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Large Claims History (Over $50k) *
            </label>
            <select
              value={formData.largeClaimsHistory}
              onChange={(e) => handleInputChange('largeClaimsHistory', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select frequency</option>
              <option value="none">None in past 3 years</option>
              <option value="1-2">1-2 in past 3 years</option>
              <option value="3-5">3-5 in past 3 years</option>
              <option value="5+">More than 5 in past 3 years</option>
            </select>
            {validationErrors.largeClaimsHistory && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.largeClaimsHistory}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chronic Conditions Prevalence *
            </label>
            <select
              value={formData.chronicConditions}
              onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select prevalence</option>
              <option value="low">Low - Below industry average</option>
              <option value="moderate">Moderate - At industry average</option>
              <option value="high">High - Above industry average</option>
              <option value="unknown">Unknown - No data available</option>
            </select>
            {validationErrors.chronicConditions && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.chronicConditions}</p>
            )}
          </div>
        </div>
      )}

      {/* Section 4: Administrative Readiness */}
      {currentSection === 4 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-xl-dark-blue">Administrative Readiness</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HR/Benefits Team Capacity *
            </label>
            <select
              value={formData.hrCapacity}
              onChange={(e) => handleInputChange('hrCapacity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select capacity level</option>
              <option value="dedicated">Dedicated - Full-time benefits team</option>
              <option value="shared">Shared - HR handles benefits part-time</option>
              <option value="limited">Limited - Minimal internal resources</option>
              <option value="none">None - Outsourced or no dedicated staff</option>
            </select>
            {validationErrors.hrCapacity && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.hrCapacity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vendor Relationships *
            </label>
            <select
              value={formData.vendorRelationships}
              onChange={(e) => handleInputChange('vendorRelationships', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select relationship quality</option>
              <option value="excellent">Excellent - Strong partnerships in place</option>
              <option value="good">Good - Established relationships</option>
              <option value="fair">Fair - Some relationships, needs work</option>
              <option value="poor">Poor - Limited vendor experience</option>
            </select>
            {validationErrors.vendorRelationships && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.vendorRelationships}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Analytics Capabilities *
            </label>
            <select
              value={formData.dataAnalytics}
              onChange={(e) => handleInputChange('dataAnalytics', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select capabilities</option>
              <option value="advanced">Advanced - Sophisticated reporting tools</option>
              <option value="basic">Basic - Standard reporting available</option>
              <option value="minimal">Minimal - Limited reporting</option>
              <option value="none">None - No analytics tools</option>
            </select>
            {validationErrors.dataAnalytics && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.dataAnalytics}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee Communication *
            </label>
            <select
              value={formData.employeeCommunication}
              onChange={(e) => handleInputChange('employeeCommunication', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select communication level</option>
              <option value="excellent">Excellent - Regular, clear communication</option>
              <option value="good">Good - Consistent communication</option>
              <option value="fair">Fair - Occasional updates</option>
              <option value="poor">Poor - Minimal communication</option>
            </select>
            {validationErrors.employeeCommunication && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.employeeCommunication}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-xl-dark-blue">Contact Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Your Company Name"
              />
              {validationErrors.companyName && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.companyName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="broker@company.com"
              />
              {validationErrors.email && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        {currentSection > 1 && (
          <button
            onClick={handlePrevious}
            className="px-6 py-2 text-xl-dark-blue border border-xl-dark-blue rounded-lg hover:bg-xl-light-grey"
          >
            Previous
          </button>
        )}
        <button
          onClick={handleNext}
          className={`px-6 py-3 rounded-lg font-semibold text-white ml-auto ${
            currentSection === totalSections ? 'bg-green-600 hover:bg-green-700' : 'bg-xl-bright-blue hover:bg-xl-dark-blue'
          }`}
        >
          {currentSection === totalSections ? 'Submit Assessment' : 'Next'}
        </button>
      </div>

      {/* Security Notice */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Your assessment data is processed securely. Scoring algorithms remain protected.</p>
      </div>
    </div>
  );
}