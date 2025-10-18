'use client';

import { useState, useEffect } from 'react';
import { useDeductibleAnalyzer } from '@/lib/hooks/useCalculatorAPI';
import type { WizardData, ClaimantData, DeductibleOption } from '@/lib/deductible-analyzer/types';

// Import wizard step components (reuse existing ones)
import BasicInfo from './DeductibleAnalyzer/BasicInfo';
import CurrentSetup from './DeductibleAnalyzer/CurrentSetup';
import ClaimsEntry from './DeductibleAnalyzer/ClaimsEntry';
import DeductibleOptions from './DeductibleAnalyzer/DeductibleOptions';
import ReviewCalculate from './DeductibleAnalyzer/ReviewCalculate';
import ResultsDashboard from './DeductibleAnalyzer/ResultsDashboard';
import ProgressBar from './DeductibleAnalyzer/ProgressBar';

const STEP_TITLES = [
  'Basic Information',
  'Current Setup',
  'Historical Claims',
  'Deductible Options',
  'Review & Calculate',
  'Results'
];

const initialWizardData: WizardData = {
  companyName: '',
  effectiveDate: '',
  medicalTrendRate: 0.07, // Default 7%
  currentDeductible: 225000,
  renewalPremium: 0,
  claimants: [],
  deductibleOptions: [
    { amount: 300000, carrierName: '', premium: 0 },
    { amount: 350000, carrierName: '', premium: 0 },
    { amount: 400000, carrierName: '', premium: 0 },
    { amount: 450000, carrierName: '', premium: 0 },
  ],
};

/**
 * Deductible Analyzer with Protected Backend Logic
 * Excel processing and calculations happen server-side
 */
export default function DeductibleAnalyzerSecure() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [userEmail, setUserEmail] = useState('');

  // Use the protected API hook
  const { calculate, loading: isCalculating, error: apiError, data: apiResults } = useDeductibleAnalyzer({
    onSuccess: (results) => {
      console.log('Deductible analysis successful');
      // Update wizard data with results
      setWizardData(prev => ({
        ...prev,
        results
      }));
      // Move to results step
      setCurrentStep(6);
    },
    onError: (error) => {
      console.error('API Error:', error);
      setValidationErrors({ api: error });
    }
  });

  // Save to session storage
  useEffect(() => {
    if (wizardData.companyName) {
      const dataToSave = { ...wizardData };
      delete dataToSave.results; // Don't cache results
      sessionStorage.setItem('deductibleAnalyzerData', JSON.stringify(dataToSave));
    }
  }, [wizardData]);

  // Load from session storage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('deductibleAnalyzerData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setWizardData(parsed);
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  const handleNext = () => {
    // Validate current step
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 1: // Basic Info
        if (!wizardData.companyName) errors.companyName = 'Company name is required';
        if (!wizardData.effectiveDate) errors.effectiveDate = 'Effective date is required';
        break;

      case 2: // Current Setup
        if (!wizardData.currentDeductible) errors.currentDeductible = 'Current deductible is required';
        if (!wizardData.renewalPremium) errors.renewalPremium = 'Renewal premium is required';
        break;

      case 3: // Claims
        if (wizardData.claimants.length === 0) {
          errors.claimants = 'Please add at least one claimant';
        }
        break;

      case 4: // Deductible Options
        const validOptions = wizardData.deductibleOptions.filter(opt =>
          opt.amount && opt.carrierName && opt.premium > 0
        );
        if (validOptions.length === 0) {
          errors.options = 'Please add at least one deductible option';
        }
        break;

      case 5: // Review
        if (!userEmail) {
          errors.email = 'Email is required to receive results';
        }
        break;
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      if (currentStep === 5) {
        // Time to calculate
        handleCalculate();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCalculate = async () => {
    // Filter out empty deductible options
    const validOptions = wizardData.deductibleOptions.filter(opt =>
      opt.amount && opt.carrierName && opt.premium > 0
    );

    // Prepare data for API
    const apiPayload = {
      email: userEmail,
      companyName: wizardData.companyName,
      effectiveDate: wizardData.effectiveDate,
      medicalTrendRate: wizardData.medicalTrendRate,
      currentDeductible: wizardData.currentDeductible,
      renewalPremium: wizardData.renewalPremium,
      claimants: wizardData.claimants,
      deductibleOptions: validOptions
    };

    // Call protected API
    await calculate(apiPayload);
  };

  const handleStartOver = () => {
    sessionStorage.removeItem('deductibleAnalyzerData');
    setWizardData(initialWizardData);
    setCurrentStep(1);
    setUserEmail('');
    setValidationErrors({});
  };

  // Show loading state
  if (isCalculating) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-xl-bright-blue border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-xl-grey">Analyzing deductible options securely...</p>
          <p className="text-sm text-xl-grey/70 mt-2">Processing claims data and calculating projections</p>
        </div>
      </div>
    );
  }

  // Show results if we have them
  if (currentStep === 6 && wizardData.results) {
    return (
      <>
        <ResultsDashboard
          data={wizardData}
          results={wizardData.results}
          onReset={handleStartOver}
        />
        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Analysis performed using proprietary algorithms on secure servers.</p>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <ProgressBar
        currentStep={currentStep}
        totalSteps={6}
        stepTitles={STEP_TITLES}
      />

      {/* Error Display */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error:</p>
          <p className="text-red-600">{apiError}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <BasicInfo
            data={wizardData}
            updateData={(updates) => setWizardData({ ...wizardData, ...updates })}
            onNext={handleNext}
            errors={validationErrors}
          />
        )}

        {/* Step 2: Current Setup */}
        {currentStep === 2 && (
          <CurrentSetup
            data={wizardData}
            updateData={(updates) => setWizardData({ ...wizardData, ...updates })}
            onNext={handleNext}
            onBack={handleBack}
            errors={validationErrors}
          />
        )}

        {/* Step 3: Historical Claims */}
        {currentStep === 3 && (
          <ClaimsEntry
            data={wizardData}
            updateData={(updates) => setWizardData({ ...wizardData, ...updates })}
            onNext={handleNext}
            onBack={handleBack}
            errors={validationErrors}
          />
        )}

        {/* Step 4: Deductible Options */}
        {currentStep === 4 && (
          <DeductibleOptions
            data={wizardData}
            updateData={(updates) => setWizardData({ ...wizardData, ...updates })}
            onNext={handleNext}
            onBack={handleBack}
            errors={validationErrors}
          />
        )}

        {/* Step 5: Review & Calculate */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <ReviewCalculate
              data={wizardData}
              onCalculate={handleCalculate}
              onBack={handleBack}
              isCalculating={isCalculating}
              errors={validationErrors}
            />

            {/* Email Gate */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-xl-dark-blue mb-4">
                Contact Information
              </h3>
              <p className="text-sm text-xl-grey mb-4">
                Please provide your email to receive the analysis results.
              </p>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                  placeholder="broker@company.com"
                />
                {validationErrors.email && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 text-xl-dark-blue border border-xl-dark-blue rounded-lg hover:bg-xl-light-grey"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!userEmail || isCalculating}
                  className={`px-6 py-3 rounded-lg font-semibold text-white ${
                    !userEmail || isCalculating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-xl-bright-blue hover:bg-xl-dark-blue'
                  }`}
                >
                  {isCalculating ? 'Analyzing...' : 'Analyze Options'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Your claims data is processed securely on our servers.</p>
        <p>All Excel processing and calculations remain protected.</p>
      </div>
    </div>
  );
}