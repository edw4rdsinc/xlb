'use client';

import { useState } from 'react';
import { formatCurrency, parseFormattedNumber } from '@/lib/fie-calculator/validation';
import { getTierConfig, calculatePlanDifferential } from '@/lib/fie-calculator/calculations';
import type { PlanData } from '@/lib/fie-calculator/calculations';

interface RatesInputProps {
  plans: PlanData[];
  numberOfTiers: number;
  onUpdate: (plans: PlanData[]) => void;
  errors: Record<string, string>;
}

export default function RatesInput({ plans, numberOfTiers, onUpdate, errors }: RatesInputProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  const tierConfig = getTierConfig(numberOfTiers);
  const tierCodes = tierConfig.map(t => t.code);
  const tierLabelMap = tierConfig.reduce((acc, tier) => {
    acc[tier.code] = tier.label;
    return acc;
  }, {} as Record<string, string>);

  // Get base plan (first plan) EO rate for differential calculation
  const basePlanEORate = plans[0]?.currentRates?.['EO'] || 0;

  const handleRateChange = (planIndex: number, tier: string, value: string) => {
    setEditingValue(value);
    const newPlans = [...plans];
    const numValue = parseFormattedNumber(value);

    if (!newPlans[planIndex]) {
      const census: Record<string, number> = {};
      const currentRates: Record<string, number> = {};
      tierCodes.forEach(code => {
        census[code] = 0;
        currentRates[code] = 0;
      });

      newPlans[planIndex] = {
        name: `Plan ${planIndex + 1}`,
        differential: 1.0,
        census,
        currentRates
      };
    }

    newPlans[planIndex].currentRates[tier] = numValue;

    // Recalculate differentials for all plans when any rate changes
    const newBasePlanEORate = newPlans[0]?.currentRates?.['EO'] || 0;
    newPlans.forEach((plan) => {
      const planEORate = plan.currentRates['EO'] || 0;
      plan.differential = calculatePlanDifferential(planEORate, newBasePlanEORate);
    });

    onUpdate(newPlans);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-xl-dark-blue mb-4">Current Monthly Rates</h2>
        <p className="text-gray-600 mb-4">
          Enter your current monthly premium rates for each tier and plan. These will be compared to the calculated FIE rates.
        </p>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                Tier
              </th>
              {plans.map((plan, index) => (
                <th key={index} className="border border-gray-300 bg-gray-50 px-4 py-2 text-center font-semibold text-gray-700">
                  {plan?.name || `Plan ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tierCodes.map((tier, tierIndex) => (
              <tr key={tier}>
                <td className="border border-gray-300 bg-gray-50 px-4 py-2 font-medium text-gray-700">
                  {tierLabelMap[tier]}
                </td>
                {plans.map((plan, planIndex) => {
                  const fieldKey = `${planIndex}-${tier}`;
                  const isEditing = editingField === fieldKey;
                  const currentValue = plan?.currentRates?.[tier] || 0;
                  const displayValue = isEditing
                    ? editingValue
                    : (currentValue === 0 ? '' : formatCurrency(currentValue));

                  return (
                    <td key={planIndex} className="border border-gray-300 px-2 py-1">
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-1">$</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          tabIndex={(planIndex * tierCodes.length) + tierIndex + 1}
                          value={displayValue}
                          onFocus={() => {
                            setEditingField(fieldKey);
                            setEditingValue(currentValue === 0 ? '' : currentValue.toString());
                          }}
                          onBlur={() => {
                            setEditingField(null);
                            setEditingValue('');
                          }}
                          onChange={(e) => handleRateChange(planIndex, tier, e.target.value)}
                          className="w-full px-2 py-1 text-center border-0 focus:ring-2 focus:ring-xl-bright-blue"
                          placeholder="0.00"
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className="border border-gray-300 bg-gray-50 px-4 py-2 font-medium text-gray-700">
                Plan Differential
              </td>
              {plans.map((plan, planIndex) => (
                <td key={planIndex} className="border border-gray-300 px-2 py-1 bg-gray-100">
                  <div className="w-full px-2 py-1 text-center font-semibold text-gray-700">
                    {(plan?.differential || 1.0).toFixed(2)}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden space-y-4">
        {plans.map((plan, planIndex) => (
          <div key={planIndex} className="border border-gray-300 rounded-lg p-4 bg-white">
            <h3 className="font-semibold text-lg text-xl-dark-blue mb-3">
              {plan?.name || `Plan ${planIndex + 1}`}
            </h3>
            <div className="space-y-3">
              {tierCodes.map(tier => {
                const fieldKey = `${planIndex}-${tier}`;
                const isEditing = editingField === fieldKey;
                const currentValue = plan?.currentRates?.[tier] || 0;
                const displayValue = isEditing
                  ? editingValue
                  : (currentValue === 0 ? '' : formatCurrency(currentValue));

                return (
                  <div key={tier} className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">
                      {tierLabelMap[tier]}
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={displayValue}
                        onFocus={() => {
                          setEditingField(fieldKey);
                          setEditingValue(currentValue === 0 ? '' : currentValue.toString());
                        }}
                        onBlur={() => {
                          setEditingField(null);
                          setEditingValue('');
                        }}
                        onChange={(e) => handleRateChange(planIndex, tier, e.target.value)}
                        className="w-24 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-xl-bright-blue"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Plan Differential</label>
                  <div className="w-24 px-2 py-1 text-center bg-gray-100 rounded font-semibold text-gray-700">
                    {(plan?.differential || 1.0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Validation Error */}
      {errors.rates && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800">{errors.rates}</p>
          </div>
        </div>
      )}

      {/* Info Boxes */}
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800">
              <strong>Monthly Rates:</strong> Enter the current monthly premium rates you're paying for each tier.
              These rates will be used to calculate your current annual cost and potential savings.
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-amber-800">
              <strong>Plan Differential:</strong> Auto-calculated based on Employee Only rates. This multiplier represents
              the relative richness of each plan compared to your base plan (first plan). Higher EO rates result in higher
              differentials, which affects how FIE costs are allocated across plans.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}