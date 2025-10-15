'use client';

import { formatNumber, parseFormattedNumber } from '@/lib/fie-calculator/validation';
import type { PlanData } from '@/lib/fie-calculator/calculations';

interface RatesInputProps {
  plans: PlanData[];
  numberOfTiers: number;
  onUpdate: (plans: PlanData[]) => void;
  errors: Record<string, string>;
}

export default function RatesInput({ plans, numberOfTiers, onUpdate, errors }: RatesInputProps) {
  const tierLabels = {
    EO: 'Employee Only',
    ES: 'Employee + Spouse',
    EC: 'Employee + Children',
    F: 'Family'
  };

  const visibleTiers = numberOfTiers === 2 ? ['EO', 'F'] :
                       numberOfTiers === 3 ? ['EO', 'ES', 'F'] :
                       ['EO', 'ES', 'EC', 'F'];

  const handleRateChange = (planIndex: number, tier: string, value: string) => {
    const newPlans = [...plans];
    const numValue = parseFormattedNumber(value);

    if (!newPlans[planIndex]) {
      newPlans[planIndex] = {
        name: `Plan ${planIndex + 1}`,
        differential: 1.0,
        census: { EO: 0, ES: 0, EC: 0, F: 0 },
        currentRates: { EO: 0, ES: 0, EC: 0, F: 0 }
      };
    }

    newPlans[planIndex].currentRates[tier as keyof typeof newPlans[0]['currentRates']] = numValue;
    onUpdate(newPlans);
  };

  const handleDifferentialChange = (planIndex: number, value: string) => {
    const newPlans = [...plans];
    const numValue = parseFloat(value) || 1.0;

    if (!newPlans[planIndex]) {
      newPlans[planIndex] = {
        name: `Plan ${planIndex + 1}`,
        differential: 1.0,
        census: { EO: 0, ES: 0, EC: 0, F: 0 },
        currentRates: { EO: 0, ES: 0, EC: 0, F: 0 }
      };
    }

    newPlans[planIndex].differential = numValue;
    onUpdate(newPlans);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-xl-dark-blue mb-4">Current Monthly Rates</h2>
        <p className="text-gray-600 mb-6">
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
            {visibleTiers.map(tier => (
              <tr key={tier}>
                <td className="border border-gray-300 bg-gray-50 px-4 py-2 font-medium text-gray-700">
                  {tierLabels[tier as keyof typeof tierLabels]}
                </td>
                {plans.map((plan, planIndex) => (
                  <td key={planIndex} className="border border-gray-300 px-2 py-1">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">$</span>
                      <input
                        type="text"
                        value={formatNumber(plan?.currentRates?.[tier as keyof typeof plan.currentRates] || 0)}
                        onChange={(e) => handleRateChange(planIndex, tier, e.target.value)}
                        className="w-full px-2 py-1 text-center border-0 focus:ring-2 focus:ring-xl-bright-blue"
                        placeholder="0"
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="border border-gray-300 bg-gray-50 px-4 py-2 font-medium text-gray-700">
                Plan Differential
              </td>
              {plans.map((plan, planIndex) => (
                <td key={planIndex} className="border border-gray-300 px-2 py-1">
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="2.0"
                    value={plan?.differential || 1.0}
                    onChange={(e) => handleDifferentialChange(planIndex, e.target.value)}
                    className="w-full px-2 py-1 text-center border-0 focus:ring-2 focus:ring-xl-bright-blue"
                    placeholder="1.0"
                  />
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
              {visibleTiers.map(tier => (
                <div key={tier} className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    {tierLabels[tier as keyof typeof tierLabels]}
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">$</span>
                    <input
                      type="text"
                      value={formatNumber(plan?.currentRates?.[tier as keyof typeof plan.currentRates] || 0)}
                      onChange={(e) => handleRateChange(planIndex, tier, e.target.value)}
                      className="w-24 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-xl-bright-blue"
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Plan Differential</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="2.0"
                    value={plan?.differential || 1.0}
                    onChange={(e) => handleDifferentialChange(planIndex, e.target.value)}
                    className="w-24 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-xl-bright-blue"
                    placeholder="1.0"
                  />
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
              <strong>Plan Differential:</strong> This multiplier represents the relative richness of each plan.
              Base plans typically use 1.0, while richer plans might be 1.1-1.2. This affects how costs are allocated across plans.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}