'use client';

import { useState, useEffect } from 'react';
import type { WizardData, AVCalculationResult, PlanInputs } from '@/types/av-calculator';
import AVCalculatorForm from './AVCalculator/AVCalculatorForm';
import AVResults from './AVCalculator/AVResults';
import EmailCapture from './EmailCapture';

const initialPlanData: PlanInputs = {
  // Deductibles & MOOP
  individualDeductible: 0,
  familyDeductible: 0,
  individualMOOP: 0,
  familyMOOP: 0,
  deductibleType: 'integrated',

  // Coinsurance
  medicalCoinsurance: 0.20,
  drugCoinsurance: 0.20,

  // Office Visits
  primaryCareCopay: 0,
  primaryCareSubjectToDeductible: false,
  specialistCopay: 0,
  specialistSubjectToDeductible: false,

  // Emergency & Hospital
  erCopay: 0,
  urgentCareCopay: 0,
  inpatientCoinsurance: 0.20,

  // Imaging & Tests
  imagingCoinsurance: 0.20,
  labCopay: 0,
  xrayCoinsurance: 0.20,

  // Prescription Drugs
  genericCopay: 0,
  genericSubjectToDeductible: false,
  preferredBrandCopay: 0,
  preferredBrandSubjectToDeductible: false,
  nonPreferredBrandCopay: 0,
  nonPreferredBrandSubjectToDeductible: false,
  specialtyCopay: 0,
  specialtySubjectToDeductible: false,

  // Advanced (Optional)
  hsaContribution: 0,
  multiTierNetwork: false,
  additionalServices: [],
};

/**
 * AV Calculator with Email Gate
 * Users must provide email before accessing the calculator
 */
export default function AVCalculatorSecure() {
  const [hasEmailAccess, setHasEmailAccess] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>(initialPlanData);
  const [isCalculating, setIsCalculating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load from session storage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('avCalculatorData');
    const savedEmail = sessionStorage.getItem('avCalculatorEmail');

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setWizardData(parsed);
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }

    if (savedEmail) {
      setHasEmailAccess(true);
    }
  }, []);

  // Save to session storage
  useEffect(() => {
    if (wizardData.email) {
      const dataToSave = { ...wizardData };
      delete dataToSave.results; // Don't cache results
      sessionStorage.setItem('avCalculatorData', JSON.stringify(dataToSave));
    }
  }, [wizardData]);

  const handleEmailSuccess = (data: { email: string; firstName: string; lastName: string; brokerage?: string }) => {
    setHasEmailAccess(true);
    setWizardData(prev => ({
      ...prev,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      brokerage: data.brokerage,
    }));
    sessionStorage.setItem('avCalculatorEmail', data.email);
  };

  const handleCalculate = async (planData: PlanInputs) => {
    setIsCalculating(true);
    setApiError(null);

    try {
      const response = await fetch('/api/calculators/av/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: wizardData.email,
          firstName: wizardData.firstName,
          lastName: wizardData.lastName,
          brokerage: wizardData.brokerage,
          planInputs: planData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Calculation failed');
      }

      const results: AVCalculationResult = await response.json();

      setWizardData(prev => ({
        ...prev,
        ...planData,
        results,
      }));
    } catch (error) {
      console.error('Calculation error:', error);
      setApiError(error instanceof Error ? error.message : 'An error occurred during calculation');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleStartOver = () => {
    sessionStorage.removeItem('avCalculatorData');
    setWizardData(initialPlanData);
    setApiError(null);
  };

  // Show email gate if no access
  if (!hasEmailAccess) {
    return (
      <EmailCapture
        toolName="AV Calculator"
        onSuccess={handleEmailSuccess}
        title="Access the AV Calculator"
        description="Enter your information to calculate actuarial values and determine metal tier classifications."
      />
    );
  }

  // Show loading state
  if (isCalculating) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-xl-bright-blue border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-xl-grey">Calculating actuarial value...</p>
          <p className="text-sm text-xl-grey/70 mt-2">Processing plan cost-sharing parameters</p>
        </div>
      </div>
    );
  }

  // Show results if we have them
  if (wizardData.results) {
    return (
      <AVResults
        planData={wizardData}
        results={wizardData.results}
        onReset={handleStartOver}
      />
    );
  }

  // Show form
  return (
    <div className="max-w-7xl mx-auto">
      {/* Error Display */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error:</p>
          <p className="text-red-600">{apiError}</p>
        </div>
      )}

      <AVCalculatorForm
        initialData={wizardData}
        onCalculate={handleCalculate}
        isCalculating={isCalculating}
      />

      {/* Privacy Notice */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Your plan data is processed securely and never shared with third parties.</p>
        <p>AV calculations follow ACA regulatory standards.</p>
      </div>
    </div>
  );
}
