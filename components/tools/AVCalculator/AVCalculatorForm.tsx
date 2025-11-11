'use client';

import { useState } from 'react';
import type { PlanInputs, MetalTier, DeductibleType } from '@/types/av-calculator';

interface AVCalculatorFormProps {
  initialData: PlanInputs;
  onCalculate: (data: PlanInputs) => void;
  isCalculating: boolean;
}

export default function AVCalculatorForm({
  initialData,
  onCalculate,
  isCalculating,
}: AVCalculatorFormProps) {
  const [formData, setFormData] = useState<PlanInputs>(initialData);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof PlanInputs, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.individualDeductible || formData.individualDeductible < 0) {
      newErrors.individualDeductible = 'Individual deductible is required';
    }
    if (!formData.familyDeductible || formData.familyDeductible < 0) {
      newErrors.familyDeductible = 'Family deductible is required';
    }
    if (!formData.individualMOOP || formData.individualMOOP < 0) {
      newErrors.individualMOOP = 'Individual MOOP is required';
    }
    if (!formData.familyMOOP || formData.familyMOOP < 0) {
      newErrors.familyMOOP = 'Family MOOP is required';
    }

    // Logical validations
    if (formData.individualDeductible > formData.individualMOOP) {
      newErrors.individualDeductible = 'Deductible cannot exceed MOOP';
    }
    if (formData.familyDeductible > formData.familyMOOP) {
      newErrors.familyDeductible = 'Deductible cannot exceed MOOP';
    }

    // Coinsurance validations
    if (formData.medicalCoinsurance < 0 || formData.medicalCoinsurance > 1) {
      newErrors.medicalCoinsurance = 'Must be between 0 and 100%';
    }
    if (formData.drugCoinsurance < 0 || formData.drugCoinsurance > 1) {
      newErrors.drugCoinsurance = 'Must be between 0 and 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onCalculate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      {/* Section 1: Plan Basics */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-xl-dark-blue mb-4 pb-2 border-b border-gray-200">
          1. Plan Basics (Optional)
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="planName" className="block text-sm font-medium text-gray-700 mb-1">
              Plan Name
            </label>
            <input
              type="text"
              id="planName"
              value={formData.planName || ''}
              onChange={(e) => handleChange('planName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
              placeholder="e.g., Gold PPO 2000"
            />
          </div>

          <div>
            <label htmlFor="metalTierHint" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Metal Tier
            </label>
            <select
              id="metalTierHint"
              value={formData.metalTierHint || ''}
              onChange={(e) => handleChange('metalTierHint', e.target.value as MetalTier)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="Bronze">Bronze (~60% AV)</option>
              <option value="Silver">Silver (~70% AV)</option>
              <option value="Gold">Gold (~80% AV)</option>
              <option value="Platinum">Platinum (~90% AV)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Deductibles & MOOP */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-xl-dark-blue mb-4 pb-2 border-b border-gray-200">
          2. Deductibles & Maximum Out-of-Pocket
        </h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="individualDeductible" className="block text-sm font-medium text-gray-700 mb-1">
                Individual Deductible <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="individualDeductible"
                  value={formData.individualDeductible}
                  onChange={(e) => handleChange('individualDeductible', parseFloat(e.target.value) || 0)}
                  className={`w-full pl-7 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent ${
                    errors.individualDeductible ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="2000"
                  min="0"
                  required
                />
              </div>
              {errors.individualDeductible && (
                <p className="mt-1 text-sm text-red-600">{errors.individualDeductible}</p>
              )}
            </div>

            <div>
              <label htmlFor="familyDeductible" className="block text-sm font-medium text-gray-700 mb-1">
                Family Deductible <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="familyDeductible"
                  value={formData.familyDeductible}
                  onChange={(e) => handleChange('familyDeductible', parseFloat(e.target.value) || 0)}
                  className={`w-full pl-7 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent ${
                    errors.familyDeductible ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="4000"
                  min="0"
                  required
                />
              </div>
              {errors.familyDeductible && (
                <p className="mt-1 text-sm text-red-600">{errors.familyDeductible}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="individualMOOP" className="block text-sm font-medium text-gray-700 mb-1">
                Individual MOOP <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="individualMOOP"
                  value={formData.individualMOOP}
                  onChange={(e) => handleChange('individualMOOP', parseFloat(e.target.value) || 0)}
                  className={`w-full pl-7 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent ${
                    errors.individualMOOP ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="6000"
                  min="0"
                  required
                />
              </div>
              {errors.individualMOOP && (
                <p className="mt-1 text-sm text-red-600">{errors.individualMOOP}</p>
              )}
            </div>

            <div>
              <label htmlFor="familyMOOP" className="block text-sm font-medium text-gray-700 mb-1">
                Family MOOP <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="familyMOOP"
                  value={formData.familyMOOP}
                  onChange={(e) => handleChange('familyMOOP', parseFloat(e.target.value) || 0)}
                  className={`w-full pl-7 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent ${
                    errors.familyMOOP ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="12000"
                  min="0"
                  required
                />
              </div>
              {errors.familyMOOP && (
                <p className="mt-1 text-sm text-red-600">{errors.familyMOOP}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deductible Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deductibleType"
                  value="integrated"
                  checked={formData.deductibleType === 'integrated'}
                  onChange={(e) => handleChange('deductibleType', e.target.value as DeductibleType)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Integrated (Medical + Drug)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deductibleType"
                  value="separate"
                  checked={formData.deductibleType === 'separate'}
                  onChange={(e) => handleChange('deductibleType', e.target.value as DeductibleType)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Separate Deductibles</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Coinsurance */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-xl-dark-blue mb-4 pb-2 border-b border-gray-200">
          3. Coinsurance Rates
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="medicalCoinsurance" className="block text-sm font-medium text-gray-700 mb-1">
              Medical Coinsurance
            </label>
            <div className="relative">
              <input
                type="number"
                id="medicalCoinsurance"
                value={(formData.medicalCoinsurance * 100).toFixed(0)}
                onChange={(e) => handleChange('medicalCoinsurance', parseFloat(e.target.value) / 100 || 0)}
                className="w-full pr-8 pl-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                placeholder="20"
                min="0"
                max="100"
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Enrollee's share after deductible</p>
          </div>

          <div>
            <label htmlFor="drugCoinsurance" className="block text-sm font-medium text-gray-700 mb-1">
              Drug Coinsurance
            </label>
            <div className="relative">
              <input
                type="number"
                id="drugCoinsurance"
                value={(formData.drugCoinsurance * 100).toFixed(0)}
                onChange={(e) => handleChange('drugCoinsurance', parseFloat(e.target.value) / 100 || 0)}
                className="w-full pr-8 pl-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                placeholder="20"
                min="0"
                max="100"
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Enrollee's share for prescriptions</p>
          </div>
        </div>
      </div>

      {/* Section 4: Office Visits */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-xl-dark-blue mb-4 pb-2 border-b border-gray-200">
          4. Office Visit Copays
        </h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="primaryCareCopay" className="block text-sm font-medium text-gray-700 mb-1">
                Primary Care Copay
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="primaryCareCopay"
                  value={formData.primaryCareCopay}
                  onChange={(e) => handleChange('primaryCareCopay', parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                  placeholder="25"
                  min="0"
                />
              </div>
              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={formData.primaryCareSubjectToDeductible}
                  onChange={(e) => handleChange('primaryCareSubjectToDeductible', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Subject to deductible</span>
              </label>
            </div>

            <div>
              <label htmlFor="specialistCopay" className="block text-sm font-medium text-gray-700 mb-1">
                Specialist Copay
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="specialistCopay"
                  value={formData.specialistCopay}
                  onChange={(e) => handleChange('specialistCopay', parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                  placeholder="50"
                  min="0"
                />
              </div>
              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={formData.specialistSubjectToDeductible}
                  onChange={(e) => handleChange('specialistSubjectToDeductible', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Subject to deductible</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Emergency & Hospital */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-xl-dark-blue mb-4 pb-2 border-b border-gray-200">
          5. Emergency & Hospital Services
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="erCopay" className="block text-sm font-medium text-gray-700 mb-1">
              ER Copay
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="erCopay"
                value={formData.erCopay}
                onChange={(e) => handleChange('erCopay', parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                placeholder="500"
                min="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="urgentCareCopay" className="block text-sm font-medium text-gray-700 mb-1">
              Urgent Care Copay
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="urgentCareCopay"
                value={formData.urgentCareCopay}
                onChange={(e) => handleChange('urgentCareCopay', parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                placeholder="75"
                min="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="inpatientCoinsurance" className="block text-sm font-medium text-gray-700 mb-1">
              Inpatient Coinsurance
            </label>
            <div className="relative">
              <input
                type="number"
                id="inpatientCoinsurance"
                value={(formData.inpatientCoinsurance * 100).toFixed(0)}
                onChange={(e) => handleChange('inpatientCoinsurance', parseFloat(e.target.value) / 100 || 0)}
                className="w-full pr-8 pl-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                placeholder="20"
                min="0"
                max="100"
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Imaging & Tests */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-xl-dark-blue mb-4 pb-2 border-b border-gray-200">
          6. Imaging & Lab Services
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="imagingCoinsurance" className="block text-sm font-medium text-gray-700 mb-1">
              Imaging Coinsurance
            </label>
            <div className="relative">
              <input
                type="number"
                id="imagingCoinsurance"
                value={(formData.imagingCoinsurance * 100).toFixed(0)}
                onChange={(e) => handleChange('imagingCoinsurance', parseFloat(e.target.value) / 100 || 0)}
                className="w-full pr-8 pl-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                placeholder="20"
                min="0"
                max="100"
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">MRI, CT, PET scans</p>
          </div>

          <div>
            <label htmlFor="labCopay" className="block text-sm font-medium text-gray-700 mb-1">
              Lab Copay
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="labCopay"
                value={formData.labCopay}
                onChange={(e) => handleChange('labCopay', parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Blood work, tests</p>
          </div>

          <div>
            <label htmlFor="xrayCoinsurance" className="block text-sm font-medium text-gray-700 mb-1">
              X-ray Coinsurance
            </label>
            <div className="relative">
              <input
                type="number"
                id="xrayCoinsurance"
                value={(formData.xrayCoinsurance * 100).toFixed(0)}
                onChange={(e) => handleChange('xrayCoinsurance', parseFloat(e.target.value) / 100 || 0)}
                className="w-full pr-8 pl-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                placeholder="20"
                min="0"
                max="100"
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: Prescription Drugs */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-xl-dark-blue mb-4 pb-2 border-b border-gray-200">
          7. Prescription Drug Copays
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="genericCopay" className="block text-sm font-medium text-gray-700 mb-1">
              Generic Copay
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="genericCopay"
                value={formData.genericCopay}
                onChange={(e) => handleChange('genericCopay', parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                placeholder="10"
                min="0"
              />
            </div>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={formData.genericSubjectToDeductible}
                onChange={(e) => handleChange('genericSubjectToDeductible', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Subject to deductible</span>
            </label>
          </div>

          <div>
            <label htmlFor="preferredBrandCopay" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Brand Copay
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="preferredBrandCopay"
                value={formData.preferredBrandCopay}
                onChange={(e) => handleChange('preferredBrandCopay', parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                placeholder="40"
                min="0"
              />
            </div>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={formData.preferredBrandSubjectToDeductible}
                onChange={(e) => handleChange('preferredBrandSubjectToDeductible', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Subject to deductible</span>
            </label>
          </div>

          <div>
            <label htmlFor="nonPreferredBrandCopay" className="block text-sm font-medium text-gray-700 mb-1">
              Non-Preferred Brand Copay
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="nonPreferredBrandCopay"
                value={formData.nonPreferredBrandCopay}
                onChange={(e) => handleChange('nonPreferredBrandCopay', parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                placeholder="75"
                min="0"
              />
            </div>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={formData.nonPreferredBrandSubjectToDeductible}
                onChange={(e) => handleChange('nonPreferredBrandSubjectToDeductible', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Subject to deductible</span>
            </label>
          </div>

          <div>
            <label htmlFor="specialtyCopay" className="block text-sm font-medium text-gray-700 mb-1">
              Specialty Copay
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="specialtyCopay"
                value={formData.specialtyCopay}
                onChange={(e) => handleChange('specialtyCopay', parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                placeholder="150"
                min="0"
              />
            </div>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={formData.specialtySubjectToDeductible}
                onChange={(e) => handleChange('specialtySubjectToDeductible', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Subject to deductible</span>
            </label>
          </div>
        </div>
      </div>

      {/* Section 8: Advanced (Collapsible) */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xl font-bold text-xl-dark-blue mb-4 pb-2 border-b border-gray-200 hover:text-xl-bright-blue transition-colors"
        >
          <span>8. Advanced Options (Optional)</span>
          <svg
            className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hsaContribution" className="block text-sm font-medium text-gray-700 mb-1">
                  HSA Employer Contribution
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="hsaContribution"
                    value={formData.hsaContribution || 0}
                    onChange={(e) => handleChange('hsaContribution', parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Annual employer HSA contribution</p>
              </div>

              <div>
                <label className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    checked={formData.multiTierNetwork || false}
                    onChange={(e) => handleChange('multiTierNetwork', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Multi-tier network (PPO with tiered cost-sharing)</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isCalculating}
          className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${
            isCalculating
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-xl-bright-blue text-white hover:bg-xl-dark-blue hover:scale-105'
          }`}
        >
          {isCalculating ? 'Calculating...' : 'Calculate Actuarial Value'}
        </button>
      </div>
    </form>
  );
}
