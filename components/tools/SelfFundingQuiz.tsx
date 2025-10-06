'use client';

import { useState, useMemo } from 'react';

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
}

interface ScoreBreakdown {
  financial: number;
  claims: number;
  administrative: number;
  company: number;
  total: number;
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
};

export default function SelfFundingQuiz() {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showResults, setShowResults] = useState(false);

  const totalSections = 4;

  // Calculate score breakdown
  const scoreBreakdown: ScoreBreakdown = useMemo(() => {
    let financial = 0;
    let claims = 0;
    let administrative = 0;
    let company = 0;

    // Section 1: Company Info (20 points)
    const employeeCountScores: { [key: string]: number } = {
      '1-50': 5,
      '51-100': 10,
      '101-500': 15,
      '500+': 20,
    };
    company += employeeCountScores[formData.employeeCount] || 0;

    // Section 2: Financial Health (40 points)
    const financialStabilityScores: { [key: string]: number } = {
      'very-stable': 15,
      'stable': 10,
      'moderate': 5,
      'unstable': 0,
    };
    financial += financialStabilityScores[formData.financialStability] || 0;

    const cashReservesScores: { [key: string]: number } = {
      '6-months': 10,
      '3-6-months': 7,
      '1-3-months': 4,
      'less-1-month': 0,
    };
    financial += cashReservesScores[formData.cashReserves] || 0;

    const riskToleranceScores: { [key: string]: number } = {
      'high': 10,
      'moderate': 7,
      'low': 4,
      'very-low': 0,
    };
    financial += riskToleranceScores[formData.riskTolerance] || 0;

    const budgetFlexibilityScores: { [key: string]: number } = {
      'high': 5,
      'moderate': 3,
      'low': 1,
      'none': 0,
    };
    financial += budgetFlexibilityScores[formData.budgetFlexibility] || 0;

    // Section 3: Claims History (20 points)
    const claimsPatternScores: { [key: string]: number } = {
      'stable': 10,
      'decreasing': 10,
      'increasing': 5,
      'unknown': 5,
    };
    claims += claimsPatternScores[formData.claimsPattern] || 0;

    const largeClaimsScores: { [key: string]: number } = {
      'none': 5,
      '1-2': 3,
      '3-5': 1,
      '5+': 0,
    };
    claims += largeClaimsScores[formData.largeClaimsHistory] || 0;

    const chronicConditionsScores: { [key: string]: number } = {
      'low': 5,
      'moderate': 3,
      'high': 1,
      'unknown': 3,
    };
    claims += chronicConditionsScores[formData.chronicConditions] || 0;

    // Section 4: Administrative Readiness (20 points)
    const hrCapacityScores: { [key: string]: number } = {
      'dedicated': 6,
      'shared': 4,
      'limited': 2,
      'none': 0,
    };
    administrative += hrCapacityScores[formData.hrCapacity] || 0;

    const vendorScores: { [key: string]: number } = {
      'excellent': 6,
      'good': 4,
      'fair': 2,
      'poor': 0,
    };
    administrative += vendorScores[formData.vendorRelationships] || 0;

    const dataAnalyticsScores: { [key: string]: number } = {
      'advanced': 4,
      'moderate': 3,
      'basic': 2,
      'none': 0,
    };
    administrative += dataAnalyticsScores[formData.dataAnalytics] || 0;

    const communicationScores: { [key: string]: number } = {
      'excellent': 4,
      'good': 3,
      'fair': 2,
      'poor': 0,
    };
    administrative += communicationScores[formData.employeeCommunication] || 0;

    const total = financial + claims + administrative + company;

    return { financial, claims, administrative, company, total };
  }, [formData]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isCurrentSectionComplete = (): boolean => {
    switch (currentSection) {
      case 1:
        return !!(formData.employeeCount && formData.industry && formData.currentFunding);
      case 2:
        return !!(
          formData.financialStability &&
          formData.cashReserves &&
          formData.riskTolerance &&
          formData.budgetFlexibility
        );
      case 3:
        return !!(formData.claimsPattern && formData.largeClaimsHistory && formData.chronicConditions);
      case 4:
        return !!(
          formData.hrCapacity &&
          formData.vendorRelationships &&
          formData.dataAnalytics &&
          formData.employeeCommunication
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleRestart = () => {
    setFormData(initialFormData);
    setCurrentSection(1);
    setShowResults(false);
  };

  const getRecommendation = () => {
    const score = scoreBreakdown.total;

    if (score >= 80) {
      return {
        title: 'Excellent Candidate for Self-Funding',
        message:
          'Your organization demonstrates strong financial health, favorable claims patterns, and robust administrative capabilities. You are well-positioned to benefit from self-funding.',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      };
    } else if (score >= 60) {
      return {
        title: 'Good Candidate with Some Considerations',
        message:
          'Your organization shows solid fundamentals for self-funding, but there are areas that may need attention. With the right stop-loss protection and vendor support, self-funding could be beneficial.',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
      };
    } else if (score >= 40) {
      return {
        title: 'Proceed with Caution',
        message:
          'Self-funding may be challenging for your organization at this time. Consider strengthening your financial position, claims management, or administrative capabilities before transitioning.',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
      };
    } else {
      return {
        title: 'Not Recommended at This Time',
        message:
          'Based on your responses, self-funding carries significant risk for your organization. Focus on building financial reserves, stabilizing claims, and developing administrative capabilities.',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    }
  };

  const getStopLossRecommendation = () => {
    const employeeCount = formData.employeeCount;
    const riskTolerance = formData.riskTolerance;

    if (employeeCount === '1-50') {
      return 'Given your small group size, consider specific stop-loss coverage starting at $10,000-$25,000 with robust aggregating specific coverage.';
    } else if (employeeCount === '51-100') {
      return 'For your group size, specific deductibles of $25,000-$50,000 with appropriate aggregating protection are typical.';
    } else if (employeeCount === '101-500') {
      return 'Mid-sized groups like yours often use specific deductibles of $50,000-$100,000 with aggregate attachment points at 120-125% of expected claims.';
    } else if (employeeCount === '500+') {
      return 'Large groups typically carry specific deductibles of $100,000+ with customized aggregate corridors. Lasering high-risk individuals may be appropriate.';
    }

    if (riskTolerance === 'low' || riskTolerance === 'very-low') {
      return 'Given your conservative risk profile, consider lower specific deductibles and tighter aggregate corridors for maximum protection.';
    }

    return 'Work with your stop-loss carrier to determine optimal deductible levels based on your specific risk profile and financial objectives.';
  };

  if (showResults) {
    const recommendation = getRecommendation();
    const score = scoreBreakdown.total;
    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-xl-dark-blue mb-6 text-center">
            Your Self-Funding Readiness Assessment
          </h2>

          {/* Score Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="54"
                  stroke="#F0F0F0"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="54"
                  stroke="#0099CC"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-xl-dark-blue">{score}</span>
                <span className="text-sm text-xl-grey">out of 100</span>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-xl-light-grey rounded-lg">
              <div className="text-2xl font-bold text-xl-dark-blue">{scoreBreakdown.company}</div>
              <div className="text-sm text-xl-grey">Company Size</div>
              <div className="text-xs text-gray-500">/ 20 pts</div>
            </div>
            <div className="text-center p-4 bg-xl-light-grey rounded-lg">
              <div className="text-2xl font-bold text-xl-dark-blue">{scoreBreakdown.financial}</div>
              <div className="text-sm text-xl-grey">Financial Health</div>
              <div className="text-xs text-gray-500">/ 40 pts</div>
            </div>
            <div className="text-center p-4 bg-xl-light-grey rounded-lg">
              <div className="text-2xl font-bold text-xl-dark-blue">{scoreBreakdown.claims}</div>
              <div className="text-sm text-xl-grey">Claims History</div>
              <div className="text-xs text-gray-500">/ 20 pts</div>
            </div>
            <div className="text-center p-4 bg-xl-light-grey rounded-lg">
              <div className="text-2xl font-bold text-xl-dark-blue">{scoreBreakdown.administrative}</div>
              <div className="text-sm text-xl-grey">Admin Readiness</div>
              <div className="text-xs text-gray-500">/ 20 pts</div>
            </div>
          </div>

          {/* Recommendation */}
          <div className={`p-6 rounded-lg border-2 mb-8 ${recommendation.bgColor} ${recommendation.borderColor}`}>
            <h3 className={`text-2xl font-bold mb-3 ${recommendation.color}`}>
              {recommendation.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">{recommendation.message}</p>
          </div>

          {/* Stop-Loss Recommendation */}
          <div className="bg-xl-dark-blue text-white p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-3">Stop-Loss Insurance Recommendation</h3>
            <p className="leading-relaxed">{getStopLossRecommendation()}</p>
          </div>

          {/* Next Steps */}
          <div className="bg-xl-light-grey p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold text-xl-dark-blue mb-4">Recommended Next Steps</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-xl-bright-blue mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xl-grey">
                  Request a detailed self-funding feasibility analysis from XL Benefits
                </span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-xl-bright-blue mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xl-grey">
                  Review stop-loss insurance options and get competitive quotes
                </span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-xl-bright-blue mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xl-grey">
                  Analyze your claims data for the past 24-36 months
                </span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-xl-bright-blue mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xl-grey">
                  Evaluate TPA (Third-Party Administrator) options for claims processing
                </span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-xl-bright-blue mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xl-grey">
                  Develop a multi-year financial projection for self-funded costs vs. fully-insured premiums
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-white text-xl-bright-blue border-2 border-xl-bright-blue font-semibold rounded-lg hover:bg-xl-light-grey transition-colors"
            >
              Retake Assessment
            </button>
            <a
              href="/contact"
              className="px-6 py-3 bg-xl-bright-blue text-white font-semibold rounded-lg hover:bg-xl-dark-blue transition-colors text-center"
            >
              Schedule Consultation
            </a>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Section 1: Basic Company Info */}
        {currentSection === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-xl-dark-blue mb-6">
              Basic Company Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-xl-grey mb-2">
                How many employees does your company have?
              </label>
              <select
                value={formData.employeeCount}
                onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select employee count</option>
                <option value="1-50">1-50 employees</option>
                <option value="51-100">51-100 employees</option>
                <option value="101-500">101-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-xl-grey mb-2">
                What industry is your company in?
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select industry</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="healthcare">Healthcare</option>
                <option value="technology">Technology</option>
                <option value="retail">Retail</option>
                <option value="construction">Construction</option>
                <option value="professional-services">Professional Services</option>
                <option value="hospitality">Hospitality</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-xl-grey mb-2">
                What is your current health insurance funding model?
              </label>
              <select
                value={formData.currentFunding}
                onChange={(e) => handleInputChange('currentFunding', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select funding model</option>
                <option value="fully-insured">Fully Insured</option>
                <option value="level-funded">Level Funded</option>
                <option value="self-funded">Already Self-Funded</option>
                <option value="unsure">Not Sure</option>
              </select>
            </div>
          </div>
        )}

        {/* Section 2: Financial Health */}
        {currentSection === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-xl-dark-blue mb-6">
              Financial Health Assessment
            </h2>

            <div>
              <label className="block text-sm font-medium text-xl-grey mb-2">
                How would you describe your company's financial stability?
              </label>
              <select
                value={formData.financialStability}
                onChange={(e) => handleInputChange('financialStability', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select stability level</option>
                <option value="very-stable">Very Stable - Consistent revenue, strong growth</option>
                <option value="stable">Stable - Predictable revenue, steady operations</option>
                <option value="moderate">Moderate - Some fluctuations in revenue</option>
                <option value="unstable">Unstable - Significant revenue variability</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-xl-grey mb-2">
                How many months of operating expenses can your company cover with cash reserves?
              </label>
              <select
                value={formData.cashReserves}
                onChange={(e) => handleInputChange('cashReserves', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select cash reserve level</option>
                <option value="6-months">6+ months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="1-3-months">1-3 months</option>
                <option value="less-1-month">Less than 1 month</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-xl-grey mb-2">
                What is your organization's risk tolerance for healthcare costs?
              </label>
              <select
                value={formData.riskTolerance}
                onChange={(e) => handleInputChange('riskTolerance', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select risk tolerance</option>
                <option value="high">High - Comfortable with month-to-month variability</option>
                <option value="moderate">Moderate - Some variability is acceptable</option>
                <option value="low">Low - Prefer predictable costs</option>
                <option value="very-low">Very Low - Need maximum cost certainty</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-xl-grey mb-2">
                How flexible is your budget to handle unexpected healthcare costs?
              </label>
              <select
                value={formData.budgetFlexibility}
                onChange={(e) => handleInputChange('budgetFlexibility', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select budget flexibility</option>
                <option value="high">High - Can absorb 20%+ cost increases</option>
                <option value="moderate">Moderate - Can handle 10-20% increases</option>
                <option value="low">Low - Can manage 5-10% increases</option>
                <option value="none">Very Limited - Budget is fixed</option>
              </select>
            </div>
          </div>
        )}

        {/* Section 3: Claims History */}
        {currentSection === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-xl-dark-blue mb-6">
              Claims History & Risk Profile
            </h2>

            <div>
              <label className="block text-sm font-medium text-xl-grey mb-2">
                How have your healthcare claims trended over the past 2-3 years?
              </label>
              <select
                value={formData.claimsPattern}
                onChange={(e) => handleInputChange('claimsPattern', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select claims pattern</option>
                <option value="stable">Stable - Consistent year over year</option>
                <option value="decreasing">Decreasing - Getting better</option>
                <option value="increasing">Increasing - Growing costs</option>
                <option value="unknown">Unknown - Don't have claims data</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-xl-grey mb-2">
                How many large claims (over $50,000) have you experienced in the past 3 years?
              </label>
              <select
                value={formData.largeClaimsHistory}
                onChange={(e) => handleInputChange('largeClaimsHistory', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select large claims count</option>
                <option value="none">None</option>
                <option value="1-2">1-2 claims</option>
                <option value="3-5">3-5 claims</option>
                <option value="5+">More than 5 claims</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-xl-grey mb-2">
                What is the prevalence of chronic conditions in your employee population?
              </label>
              <select
                value={formData.chronicConditions}
                onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select prevalence level</option>
                <option value="low">Low - Few chronic conditions</option>
                <option value="moderate">Moderate - Average for our industry</option>
                <option value="high">High - Above average chronic conditions</option>
                <option value="unknown">Unknown - Haven't analyzed this</option>
              </select>
            </div>
          </div>
        )}

        {/* Section 4: Administrative Readiness */}
        {currentSection === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-xl-dark-blue mb-6">
              Administrative Readiness
            </h2>

            <div>
              <label className="block text-sm font-medium text-xl-grey mb-2">
                What is your HR team's capacity to manage a self-funded plan?
              </label>
              <select
                value={formData.hrCapacity}
                onChange={(e) => handleInputChange('hrCapacity', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select HR capacity</option>
                <option value="dedicated">Dedicated benefits team with experience</option>
                <option value="shared">Shared responsibilities, some benefits experience</option>
                <option value="limited">Limited HR staff, minimal benefits experience</option>
                <option value="none">No dedicated HR resources</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-xl-grey mb-2">
                How would you rate your current vendor relationships (TPA, brokers, etc.)?
              </label>
              <select
                value={formData.vendorRelationships}
                onChange={(e) => handleInputChange('vendorRelationships', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select vendor relationship quality</option>
                <option value="excellent">Excellent - Strong partnerships, very responsive</option>
                <option value="good">Good - Reliable service, generally responsive</option>
                <option value="fair">Fair - Adequate but room for improvement</option>
                <option value="poor">Poor - Frequent issues or unresponsive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-xl-grey mb-2">
                What level of data analytics and reporting do you currently have?
              </label>
              <select
                value={formData.dataAnalytics}
                onChange={(e) => handleInputChange('dataAnalytics', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select analytics level</option>
                <option value="advanced">Advanced - Real-time dashboards, predictive analytics</option>
                <option value="moderate">Moderate - Regular reports, some analysis</option>
                <option value="basic">Basic - Annual reports only</option>
                <option value="none">None - No analytics currently</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-xl-grey mb-2">
                How effective is your employee communication about benefits?
              </label>
              <select
                value={formData.employeeCommunication}
                onChange={(e) => handleInputChange('employeeCommunication', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              >
                <option value="">Select communication effectiveness</option>
                <option value="excellent">Excellent - High engagement, multiple channels</option>
                <option value="good">Good - Regular communications, decent engagement</option>
                <option value="fair">Fair - Minimum communications, low engagement</option>
                <option value="poor">Poor - Employees often confused about benefits</option>
              </select>
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
            {currentSection === totalSections ? 'See Results' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
