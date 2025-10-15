'use client';

import { useState } from 'react';
import { formatNumber, parseFormattedNumber } from '@/lib/fie-calculator/validation';
import type { CostComponents, TierRatios } from '@/lib/fie-calculator/calculations';

interface CostsInputProps {
  costs: CostComponents;
  tierRatios: TierRatios;
  numberOfTiers: number;
  onUpdateCosts: (costs: CostComponents) => void;
  onUpdateRatios: (ratios: TierRatios) => void;
  errors: Record<string, string>;
}

export default function CostsInput({
  costs,
  tierRatios,
  numberOfTiers,
  onUpdateCosts,
  onUpdateRatios,
  errors
}: CostsInputProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const tierLabels = {
    EO: 'Employee Only',
    ES: 'Employee + Spouse',
    EC: 'Employee + Children',
    F: 'Family'
  };

  const visibleTiers = numberOfTiers === 2 ? ['EO', 'F'] :
                       numberOfTiers === 3 ? ['EO', 'ES', 'F'] :
                       ['EO', 'ES', 'EC', 'F'];

  const deductibleOptions = [
    { value: 50000, label: '$50,000' },
    { value: 75000, label: '$75,000' },
    { value: 100000, label: '$100,000' },
    { value: 125000, label: '$125,000' },
    { value: 150000, label: '$150,000' },
    { value: 200000, label: '$200,000' },
    { value: 250000, label: '$250,000' },
    { value: 300000, label: '$300,000' },
    { value: 400000, label: '$400,000' },
    { value: 500000, label: '$500,000' }
  ];

  const corridorOptions = [
    { value: 1.20, label: '120%' },
    { value: 1.25, label: '125%' },
    { value: 1.30, label: '130%' }
  ];

  const handleLaserAdd = () => {
    const newLasers = [...costs.lasers, { memberId: '', amount: 0, planIndex: 0 }];
    onUpdateCosts({ ...costs, lasers: newLasers });
  };

  const handleLaserRemove = (index: number) => {
    const newLasers = costs.lasers.filter((_, i) => i !== index);
    onUpdateCosts({ ...costs, lasers: newLasers });
  };

  const handleLaserChange = (index: number, field: string, value: any) => {
    const newLasers = [...costs.lasers];
    newLasers[index] = { ...newLasers[index], [field]: value };
    onUpdateCosts({ ...costs, lasers: newLasers });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-xl-dark-blue mb-4">Cost Components</h2>
        <p className="text-gray-600 mb-6">
          Enter your stop-loss insurance costs and administrative expenses to calculate FIE rates.
        </p>
      </div>

      {/* Basic Costs */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Admin Cost */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Admin Cost (PEPM) *
          </label>
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">$</span>
            <input
              type="number"
              step="0.01"
              value={costs.adminPEPM}
              onChange={(e) => onUpdateCosts({ ...costs, adminPEPM: parseFloat(e.target.value) || 0 })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue ${
                errors.adminPEPM ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="35"
            />
          </div>
          {errors.adminPEPM && (
            <p className="mt-1 text-sm text-red-600">{errors.adminPEPM}</p>
          )}
        </div>

        {/* Specific Deductible */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Specific Deductible *
          </label>
          <select
            value={costs.specificDeductible}
            onChange={(e) => onUpdateCosts({ ...costs, specificDeductible: parseInt(e.target.value) })}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue ${
              errors.specificDeductible ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {deductibleOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.specificDeductible && (
            <p className="mt-1 text-sm text-red-600">{errors.specificDeductible}</p>
          )}
        </div>

        {/* Aggregate Corridor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Aggregate Corridor
          </label>
          <select
            value={costs.aggregateCorridor}
            onChange={(e) => onUpdateCosts({ ...costs, aggregateCorridor: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
          >
            {corridorOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Aggregate Rate */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Aggregate Rate (PEPM)
          </label>
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">$</span>
            <input
              type="number"
              step="0.01"
              value={costs.aggregateRate}
              onChange={(e) => onUpdateCosts({ ...costs, aggregateRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              placeholder="15"
            />
          </div>
        </div>

        {/* Aggregate Factor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Aggregate Factor
          </label>
          <input
            type="number"
            step="0.01"
            min="0.5"
            max="2.0"
            value={costs.aggregateFactor}
            onChange={(e) => onUpdateCosts({ ...costs, aggregateFactor: parseFloat(e.target.value) || 1.0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
            placeholder="1.0"
          />
        </div>
      </div>

      {/* Specific Rates by Tier */}
      <div>
        <h3 className="text-lg font-semibold text-xl-dark-blue mb-3">Specific Stop-Loss Rates (Monthly)</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleTiers.map(tier => (
            <div key={tier}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tierLabels[tier as keyof typeof tierLabels]}
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={costs.specificRates[tier as keyof typeof costs.specificRates]}
                  onChange={(e) => onUpdateCosts({
                    ...costs,
                    specificRates: {
                      ...costs.specificRates,
                      [tier]: parseFloat(e.target.value) || 0
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
                  placeholder="0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lasers */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-xl-dark-blue">Lasers (Optional)</h3>
          <button
            type="button"
            onClick={handleLaserAdd}
            className="px-4 py-2 bg-xl-bright-blue text-white rounded-md hover:bg-xl-dark-blue transition-colors text-sm font-medium"
          >
            + Add Laser
          </button>
        </div>

        {costs.lasers.length > 0 ? (
          <div className="space-y-3">
            {costs.lasers.map((laser, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={laser.memberId}
                  onChange={(e) => handleLaserChange(index, 'memberId', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue"
                  placeholder="Member ID"
                />
                <div className="flex items-center flex-1">
                  <span className="text-gray-500 mr-2">$</span>
                  <input
                    type="number"
                    value={laser.amount}
                    onChange={(e) => handleLaserChange(index, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue"
                    placeholder="Amount"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleLaserRemove(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">No lasers added. Click "Add Laser" to include laser liabilities.</p>
        )}
      </div>

      {/* Advanced Settings */}
      <div className="border-t pt-6">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-xl-bright-blue hover:text-xl-dark-blue font-semibold"
        >
          <svg
            className={`w-5 h-5 mr-2 transform transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Advanced Settings (Tier Ratios)
        </button>

        {showAdvanced && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-4">
              Adjust tier ratios to customize how costs are distributed across tiers. Default values are industry standard.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {visibleTiers.map(tier => (
                <div key={tier}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tierLabels[tier as keyof typeof tierLabels]} Ratio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="5.0"
                    value={tierRatios[tier as keyof typeof tierRatios]}
                    onChange={(e) => onUpdateRatios({
                      ...tierRatios,
                      [tier]: parseFloat(e.target.value) || 1.0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <strong>Stop-Loss Components:</strong> These costs represent your stop-loss insurance premiums and
            administrative fees. The calculator will combine these with your census data to determine
            fully-insured equivalent rates.
          </div>
        </div>
      </div>
    </div>
  );
}