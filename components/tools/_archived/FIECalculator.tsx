'use client';

import { useState, useEffect } from 'react';
import { saveToSession, getFromSession, clearSession } from '@/lib/fie-calculator/validation';
import { calculateFIERates, getTierConfig } from '@/lib/fie-calculator/calculations';
import type { PlanData, CostComponents, CalculationResults, TierConfig } from '@/lib/fie-calculator/calculations';

// Import wizard step components
import GroupSetup from './FIECalculator/GroupSetup';
import CensusGrid from './FIECalculator/CensusGrid';
import RatesInput from './FIECalculator/RatesInput';
import CostsInput from './FIECalculator/CostsInput';
import EmailGate from './FIECalculator/EmailGate';
import ResultsDashboard from './FIECalculator/ResultsDashboard';
import ProgressBar from './FIECalculator/ProgressBar';

export interface WizardData {
  // Step 1: Group Setup
  groupName: string;
  effectiveDate: string;
  currentFundingType: 'Fully-Insured' | 'Self-Funded';
  numberOfPlans: number;
  numberOfTiers: number;
  planNames: string[];

  // Step 2: Census
  plans: PlanData[];

  // Step 3: Rates (included in plans)

  // Step 4: Costs
  costs: CostComponents;

  // Step 5: Email
  contactInfo?: {
    name: string;
    email: string;
    company: string;
    phone?: string;
  };

  // Results
  results?: CalculationResults;
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
    aggregateFactors: { EO: 1.0, ES: 2.1, EC: 1.65, F: 2.75 },
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

export default function FIECalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load saved session data on mount
  useEffect(() => {
    const savedData = getFromSession();
    if (savedData) {
      setWizardData(savedData as any);
    }
  }, []);

  // Save to session whenever wizard data changes
  useEffect(() => {
    if (wizardData.groupName) {
      saveToSession(wizardData as any);
    }
  }, [wizardData]);

  // Initialize plans when number of plans or tiers changes
  useEffect(() => {
    const tierConfig = getTierConfig(wizardData.numberOfTiers);
    const shouldReinitialize =
      wizardData.plans.length !== wizardData.numberOfPlans ||
      (wizardData.plans.length > 0 && Object.keys(wizardData.plans[0].census).length !== tierConfig.length);

    if (shouldReinitialize) {
      const newPlans: PlanData[] = [];
      for (let i = 0; i < wizardData.numberOfPlans; i++) {
        const existingPlan = wizardData.plans[i];

        // Initialize census and rates with dynamic tier codes
        const census: Record<string, number> = {};
        const currentRates: Record<string, number> = {};
        tierConfig.forEach(tier => {
          census[tier.code] = existingPlan?.census?.[tier.code] || 0;
          currentRates[tier.code] = existingPlan?.currentRates?.[tier.code] || 0;
        });

        newPlans.push({
          name: wizardData.planNames[i] || `Plan ${i + 1}`,
          differential: i === 0 ? 1.0 : 1.1, // Base plan = 1.0, others slightly higher
          census,
          currentRates
        });
      }
      setWizardData(prev => ({ ...prev, plans: newPlans }));
    }
  }, [wizardData.numberOfPlans, wizardData.numberOfTiers, wizardData.planNames]);

  const handleNext = () => {
    // Validate current step before proceeding
    const errors = validateCurrentStep();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    // Calculate results before step 5
    if (currentStep === 4) {
      calculateResults();
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setValidationErrors({});
    }
  };

  const validateCurrentStep = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!wizardData.groupName) errors.groupName = 'Group name is required';
        if (!wizardData.effectiveDate) errors.effectiveDate = 'Effective date is required';
        if (wizardData.planNames.some(name => !name)) errors.planNames = 'All plan names are required';
        break;

      case 2:
        const tierConfig = getTierConfig(wizardData.numberOfTiers);
        const totalEmployees = wizardData.plans.reduce((sum, plan) => {
          return sum + tierConfig.reduce((tierSum, tier) => {
            return tierSum + (plan.census[tier.code] || 0);
          }, 0);
        }, 0);
        if (totalEmployees < 10) errors.census = 'Minimum 10 total employees required';
        break;

      case 3:
        // Skip validation if all rates are 0 (skip rates mode)
        const allRatesZero = wizardData.plans.every(plan =>
          Object.values(plan.currentRates).every(rate => rate === 0)
        );

        if (!allRatesZero) {
          const hasZeroRates = wizardData.plans.some(plan =>
            Object.values(plan.currentRates).some(rate => rate <= 0)
          );
          if (hasZeroRates) errors.rates = 'All rates must be positive numbers (or check "Skip Rate Input" to proceed without rates)';
        }
        break;

      case 4:
        if (wizardData.costs.adminCostMode === 'simple' && (!wizardData.costs.adminPEPM || wizardData.costs.adminPEPM <= 0)) {
          errors.adminPEPM = 'Admin cost must be positive';
        }
        if (wizardData.costs.specificDeductible < 50000 || wizardData.costs.specificDeductible > 500000) {
          errors.specificDeductible = 'Deductible must be between $50,000 and $500,000';
        }
        break;
    }

    return errors;
  };

  const calculateResults = () => {
    setIsCalculating(true);

    // Perform calculations
    const results = calculateFIERates(
      wizardData.plans,
      wizardData.costs,
      wizardData.numberOfTiers
    );

    setWizardData(prev => ({ ...prev, results }));
    setIsCalculating(false);
  };

  const handleEmailSubmit = (contactInfo: any) => {
    setWizardData(prev => ({ ...prev, contactInfo }));
    setEmailSubmitted(true);

    // Clear session after successful submission
    clearSession();
  };

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GroupSetup
            data={wizardData}
            onUpdate={updateWizardData}
            errors={validationErrors}
          />
        );

      case 2:
        return (
          <CensusGrid
            plans={wizardData.plans}
            numberOfTiers={wizardData.numberOfTiers}
            planNames={wizardData.planNames}
            onUpdate={(plans) => updateWizardData({ plans })}
            errors={validationErrors}
          />
        );

      case 3:
        return (
          <RatesInput
            plans={wizardData.plans}
            numberOfTiers={wizardData.numberOfTiers}
            onUpdate={(plans) => updateWizardData({ plans })}
            errors={validationErrors}
          />
        );

      case 4:
        return (
          <CostsInput
            costs={wizardData.costs}
            numberOfTiers={wizardData.numberOfTiers}
            onUpdateCosts={(costs) => updateWizardData({ costs })}
            errors={validationErrors}
          />
        );

      case 5:
        // Email gate muted for testing - directly show results
        return (
          <ResultsDashboard
            wizardData={wizardData}
            results={wizardData.results!}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={5}
          stepTitles={STEP_TITLES}
        />
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 min-h-[500px]">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      {currentStep < 5 && (
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-md font-semibold transition-all ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-3 bg-xl-bright-blue text-white rounded-md font-semibold hover:bg-xl-dark-blue transition-all"
          >
            {currentStep === 4 ? 'Calculate Results' : 'Next'}
          </button>
        </div>
      )}

      {/* Back button for results page */}
      {currentStep === 5 && (
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gray-500 text-white rounded-md font-semibold hover:bg-gray-600 transition-all"
          >
            Back to Costs
          </button>
          <button
            onClick={() => {
              setCurrentStep(1);
              setWizardData(initialWizardData);
              setEmailSubmitted(false);
              clearSession();
            }}
            className="px-6 py-3 bg-xl-bright-blue text-white rounded-md font-semibold hover:bg-xl-dark-blue transition-all"
          >
            Start New Calculation
          </button>
        </div>
      )}
    </div>
  );
}