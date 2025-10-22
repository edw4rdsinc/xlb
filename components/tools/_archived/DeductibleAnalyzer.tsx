'use client';

import { useState, useEffect } from 'react';
import type { WizardData, AnalyzerInputs, ClaimantData } from '@/lib/deductible-analyzer/types';
import { ExcelProcessor } from '@/lib/deductible-analyzer/excel-processor';

// Import wizard step components
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

export default function DeductibleAnalyzer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);
  const [isCalculating, setIsCalculating] = useState(false);
  const [templateBuffer, setTemplateBuffer] = useState<ArrayBuffer | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load the Excel template on component mount
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const response = await fetch('/ISL Ded Analysis.xlsx');
        const buffer = await response.arrayBuffer();
        setTemplateBuffer(buffer);
      } catch (error) {
        console.error('Failed to load Excel template:', error);
        setValidationErrors({ template: 'Failed to load analyzer template' });
      }
    };
    loadTemplate();
  }, []);

  // Save to session storage
  useEffect(() => {
    if (wizardData.companyName) {
      sessionStorage.setItem('deductibleAnalyzerData', JSON.stringify(wizardData));
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
    if (currentStep < STEP_TITLES.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCalculate = async () => {
    if (!templateBuffer) {
      setValidationErrors({ template: 'Excel template not loaded' });
      return;
    }

    setIsCalculating(true);
    setValidationErrors({});

    try {
      // Create Excel processor with template
      const processor = new ExcelProcessor(templateBuffer);

      // Prepare inputs
      const inputs: AnalyzerInputs = {
        companyName: wizardData.companyName,
        effectiveDate: wizardData.effectiveDate,
        medicalTrendRate: wizardData.medicalTrendRate,
        currentDeductible: wizardData.currentDeductible,
        renewalPremium: wizardData.renewalPremium,
        claimants: wizardData.claimants,
        deductibleOptions: wizardData.deductibleOptions.filter(opt => opt.premium > 0),
      };

      // Write inputs to Excel
      processor.writeInputs(inputs);

      // Read calculated results
      const results = processor.readResults();

      // Update wizard data with results
      setWizardData(prev => ({ ...prev, results }));

      // Move to results step
      setCurrentStep(6);
    } catch (error) {
      console.error('Calculation error:', error);
      setValidationErrors({
        calculation: error instanceof Error ? error.message : 'Failed to calculate results'
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setWizardData(initialWizardData);
    setCurrentStep(1);
    setValidationErrors({});
    sessionStorage.removeItem('deductibleAnalyzerData');
  };

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfo
            data={wizardData}
            updateData={updateWizardData}
            onNext={handleNext}
            errors={validationErrors}
          />
        );
      case 2:
        return (
          <CurrentSetup
            data={wizardData}
            updateData={updateWizardData}
            onNext={handleNext}
            onBack={handleBack}
            errors={validationErrors}
          />
        );
      case 3:
        return (
          <ClaimsEntry
            data={wizardData}
            updateData={updateWizardData}
            onNext={handleNext}
            onBack={handleBack}
            errors={validationErrors}
          />
        );
      case 4:
        return (
          <DeductibleOptions
            data={wizardData}
            updateData={updateWizardData}
            onNext={handleNext}
            onBack={handleBack}
            errors={validationErrors}
          />
        );
      case 5:
        return (
          <ReviewCalculate
            data={wizardData}
            onCalculate={handleCalculate}
            onBack={handleBack}
            isCalculating={isCalculating}
            errors={validationErrors}
          />
        );
      case 6:
        return wizardData.results ? (
          <ResultsDashboard
            data={wizardData}
            results={wizardData.results}
            onReset={handleReset}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Progress Bar */}
      {currentStep < 6 && (
        <ProgressBar
          currentStep={currentStep}
          totalSteps={5}
          stepTitles={STEP_TITLES.slice(0, 5)}
        />
      )}

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {renderStep()}
      </div>

      {/* Error Display */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Please correct the following:</h3>
          <ul className="list-disc list-inside text-red-600">
            {Object.values(validationErrors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}