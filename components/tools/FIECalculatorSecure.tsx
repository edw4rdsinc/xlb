'use client';

import { useState, useEffect } from 'react';
import { useFIECalculator } from '@/lib/hooks/useCalculatorAPI';
import { saveToSession, getFromSession, clearSession } from '@/lib/fie-calculator/validation';
import { getTierConfig } from '@/lib/fie-calculator/calculations';
import type { TierConfig } from '@/lib/fie-calculator/calculations';

// Import wizard step components (these stay the same)
import GroupSetup from './FIECalculator/GroupSetup';
import CensusGrid from './FIECalculator/CensusGrid';
import RatesInput from './FIECalculator/RatesInput';
import CostsInput from './FIECalculator/CostsInput';
import EmailGate from './FIECalculator/EmailGate';
import ResultsDashboard from './FIECalculator/ResultsDashboard';
import ProgressBar from './FIECalculator/ProgressBar';

// Note: We keep the same data structure for the UI
// But calculation logic is now on the server
export interface WizardData {
  // Step 1: Group Setup
  groupName: string;
  effectiveDate: string;
  currentFundingType: 'Fully-Insured' | 'Self-Funded';
  numberOfPlans: number;
  numberOfTiers: number;
  planNames: string[];

  // Step 2: Census
  plans: any[]; // Using any to avoid importing server-side types

  // Step 3: Rates (included in plans)

  // Step 4: Costs
  costs: any; // Using any to avoid importing server-side types

  // Step 5: Email
  contactInfo?: {
    name: string;
    email: string;
    company: string;
    phone?: string;
  };

  // Results (from API)
  results?: any;
}

const initialWizardData: WizardData = {
  groupName: '',
  effectiveDate: '',
  currentFundingType: 'Fully-Insured',
  numberOfPlans: 4,
  numberOfTiers: 4,
  planNames: ['Base Plan', 'Buy-Up Plan 1', 'Buy-Up Plan 2', 'Buy-Up Plan 3'],
  plans: [],
  costs: {
    adminCostMode: 'simple',
    adminPEPM: 35,
    specificDeductible: 100000,
    specificRates: { EO: 45, ES: 95, EC: 75, F: 125 },
    aggregateCorridor: 1.25,
    aggregateRate: 15,
    aggregateFactors: { EO: 15, ES: 32, EC: 25, F: 41 },
    lasers: []
  }
};

const STEP_TITLES = [
  'Group Setup',
  'Census Data',
  'Current Rates',
  'Cost Components',
  'Get Results'
];

/**
 * FIE Calculator with Protected Backend Logic
 * All calculations happen server-side via API
 */
export default function FIECalculatorSecure() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Use the protected API hook
  const { calculate, loading: isCalculating, error: apiError, data: apiResults } = useFIECalculator({
    onSuccess: (results) => {
      console.log('Calculation successful');
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

  // Load saved session data on mount
  useEffect(() => {
    const savedData = getFromSession();
    if (savedData) {
      setWizardData(savedData);
    }
  }, []);

  // Save to session whenever wizard data changes (except results)
  useEffect(() => {
    if (wizardData.groupName) {
      const dataToSave = { ...wizardData };
      delete dataToSave.results; // Don't cache results
      saveToSession(dataToSave);
    }
  }, [wizardData]);

  // Initialize plans when number of plans or tiers changes
  useEffect(() => {
    const tierConfig = getTierConfig(wizardData.numberOfTiers);
    const shouldReinitialize =
      wizardData.plans.length !== wizardData.numberOfPlans ||
      Object.keys(wizardData.plans[0]?.census || {}).length !== tierConfig.length;

    if (shouldReinitialize) {
      const newPlans = Array.from({ length: wizardData.numberOfPlans }, (_, i) => {
        const existingPlan = wizardData.plans[i];
        const census: Record<string, number> = {};
        const currentRates: Record<string, number> = {};

        tierConfig.forEach(tier => {
          census[tier.code] = 0;
          currentRates[tier.code] = 0;
        });

        return {
          name: wizardData.planNames[i] || `Plan ${i + 1}`,
          differential: 1.0,
          census,
          currentRates
        };
      });

      setWizardData(prev => ({ ...prev, plans: newPlans }));
    }
  }, [wizardData.numberOfPlans, wizardData.numberOfTiers]);

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const handleStepValidation = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1: // Group Setup
        if (!wizardData.groupName) errors.groupName = 'Group name is required';
        if (!wizardData.effectiveDate) errors.effectiveDate = 'Effective date is required';
        break;

      case 2: // Census
        const hasCensusData = wizardData.plans.some(plan =>
          Object.values(plan.census || {}).some((count: any) => count > 0)
        );
        if (!hasCensusData) errors.census = 'Please enter census data for at least one plan';
        break;

      case 3: // Rates
        const hasRatesData = wizardData.plans.some(plan =>
          Object.values(plan.currentRates || {}).some((rate: any) => rate > 0)
        );
        if (!hasRatesData) errors.rates = 'Please enter current rates for at least one plan';
        break;

      case 4: // Costs
        if (!wizardData.costs.specificDeductible) errors.specificDeductible = 'Specific deductible is required';
        break;

      case 5: // Email
        if (!emailSubmitted && !wizardData.contactInfo?.email) {
          errors.email = 'Please submit your contact information';
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (handleStepValidation(currentStep)) {
      if (currentStep === 5 && emailSubmitted) {
        handleCalculate();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleCalculate = async () => {
    // Prepare data for API
    const apiPayload = {
      email: wizardData.contactInfo?.email || '',
      companyName: wizardData.groupName,
      numberOfTiers: wizardData.numberOfTiers,
      plans: wizardData.plans,
      costs: wizardData.costs
    };

    // Call protected API
    await calculate(apiPayload);
  };

  const handleStartOver = () => {
    clearSession();
    setWizardData(initialWizardData);
    setCurrentStep(1);
    setEmailSubmitted(false);
    setValidationErrors({});
  };

  // Show loading state
  if (isCalculating) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-xl-bright-blue border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-xl-grey">Calculating your FIE rates securely...</p>
          <p className="text-sm text-xl-grey/70 mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // Show results if we have them
  if (currentStep === 6 && wizardData.results) {
    return (
      <ResultsDashboard
        wizardData={wizardData}
        results={wizardData.results}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ProgressBar
        currentStep={currentStep}
        totalSteps={5}
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
        {currentStep === 1 && (
          <GroupSetup
            data={wizardData}
            onUpdate={updateWizardData}
            errors={validationErrors}
          />
        )}

        {currentStep === 2 && (
          <CensusGrid
            plans={wizardData.plans}
            planNames={wizardData.planNames}
            numberOfTiers={wizardData.numberOfTiers}
            onUpdate={(plans) => updateWizardData({ plans })}
            errors={validationErrors}
          />
        )}

        {currentStep === 3 && (
          <RatesInput
            plans={wizardData.plans}
            numberOfTiers={wizardData.numberOfTiers}
            onUpdate={(plans) => updateWizardData({ plans })}
            errors={validationErrors}
          />
        )}

        {currentStep === 4 && (
          <CostsInput
            costs={wizardData.costs}
            numberOfTiers={wizardData.numberOfTiers}
            onUpdateCosts={(costs) => updateWizardData({ costs })}
            errors={validationErrors}
          />
        )}

        {currentStep === 5 && (
          <EmailGate
            onSubmit={(contactInfo) => {
              updateWizardData({ contactInfo });
              setEmailSubmitted(true);
              handleCalculate();
            }}
            isCalculating={isCalculating}
          />
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Your calculations are processed securely on our servers.</p>
        <p>All proprietary formulas and logic remain protected.</p>
      </div>
    </div>
  );
}