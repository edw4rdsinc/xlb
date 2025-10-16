'use client';

import { formatNumber, parseFormattedNumber } from '@/lib/fie-calculator/validation';
import { getTierConfig } from '@/lib/fie-calculator/calculations';
import type { PlanData } from '@/lib/fie-calculator/calculations';

interface CensusGridProps {
  plans: PlanData[];
  numberOfTiers: number;
  planNames: string[];
  onUpdate: (plans: PlanData[]) => void;
  errors: Record<string, string>;
}

export default function CensusGrid({ plans, numberOfTiers, planNames, onUpdate, errors }: CensusGridProps) {
  const tierConfig = getTierConfig(numberOfTiers);
  const tierCodes = tierConfig.map(t => t.code);
  const tierLabelMap = tierConfig.reduce((acc, tier) => {
    acc[tier.code] = tier.label;
    return acc;
  }, {} as Record<string, string>);

  const handleCensusChange = (planIndex: number, tier: string, value: string) => {
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
        name: planNames[planIndex] || `Plan ${planIndex + 1}`,
        differential: 1.0,
        census,
        currentRates
      };
    }

    newPlans[planIndex].census[tier] = numValue;
    onUpdate(newPlans);
  };

  // Calculate totals
  const tierTotals = tierCodes.reduce((acc, tier) => {
    acc[tier] = plans.reduce((sum, plan) => {
      return sum + (plan?.census?.[tier] || 0);
    }, 0);
    return acc;
  }, {} as Record<string, number>);

  const planTotals = plans.map(plan => {
    return tierCodes.reduce((sum, tier) => {
      return sum + (plan?.census?.[tier] || 0);
    }, 0);
  });

  const grandTotal = Object.values(tierTotals).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-xl-dark-blue mb-4">Census Data</h2>
        <p className="text-gray-600 mb-6">
          Enter the number of employees enrolled in each tier for each plan. Minimum 10 total employees required.
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
              <th className="border border-gray-300 bg-xl-dark-blue text-white px-4 py-2 text-center font-semibold">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {tierCodes.map((tier, tierIndex) => (
              <tr key={tier}>
                <td className="border border-gray-300 bg-gray-50 px-4 py-2 font-medium text-gray-700">
                  {tierLabelMap[tier]}
                </td>
                {plans.map((plan, planIndex) => (
                  <td key={planIndex} className="border border-gray-300 px-2 py-1">
                    <input
                      type="text"
                      tabIndex={(planIndex * tierCodes.length) + tierIndex + 1}
                      value={(plan?.census?.[tier] || 0) === 0 ? '' : formatNumber(plan?.census?.[tier] || 0)}
                      onChange={(e) => handleCensusChange(planIndex, tier, e.target.value)}
                      className="w-full px-2 py-1 text-center border-0 focus:ring-2 focus:ring-xl-bright-blue"
                      placeholder="0"
                    />
                  </td>
                ))}
                <td className="border border-gray-300 bg-gray-100 px-4 py-2 text-center font-semibold">
                  {formatNumber(tierTotals[tier])}
                </td>
              </tr>
            ))}
            <tr>
              <td className="border border-gray-300 bg-xl-dark-blue text-white px-4 py-2 font-semibold">
                Total
              </td>
              {planTotals.map((total, index) => (
                <td key={index} className="border border-gray-300 bg-gray-100 px-4 py-2 text-center font-semibold">
                  {formatNumber(total)}
                </td>
              ))}
              <td className="border border-gray-300 bg-xl-dark-blue text-white px-4 py-2 text-center font-bold text-lg">
                {formatNumber(grandTotal)}
              </td>
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
              {tierCodes.map(tier => (
                <div key={tier} className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    {tierLabelMap[tier]}
                  </label>
                  <input
                    type="text"
                    value={(plan?.census?.[tier] || 0) === 0 ? '' : formatNumber(plan?.census?.[tier] || 0)}
                    onChange={(e) => handleCensusChange(planIndex, tier, e.target.value)}
                    className="w-24 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-xl-bright-blue"
                    placeholder="0"
                  />
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center font-semibold">
                  <span>Plan Total</span>
                  <span className="text-xl-dark-blue">{formatNumber(planTotals[planIndex])}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Grand Total Card */}
        <div className="bg-xl-dark-blue text-white rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Grand Total Employees</span>
            <span className="text-2xl font-bold">{formatNumber(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Validation Error */}
      {errors.census && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800">{errors.census}</p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <strong>Note:</strong> Enter whole numbers only. The calculator requires at least 10 total employees
            across all plans to provide accurate FIE rate calculations.
          </div>
        </div>
      </div>
    </div>
  );
}