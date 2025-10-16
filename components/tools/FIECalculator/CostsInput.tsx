'use client';

import { useState } from 'react';
import { formatNumber, parseFormattedNumber } from '@/lib/fie-calculator/validation';
import { getTierConfig } from '@/lib/fie-calculator/calculations';
import type { CostComponents } from '@/lib/fie-calculator/calculations';

interface CostsInputProps {
  costs: CostComponents;
  numberOfTiers: number;
  onUpdateCosts: (costs: CostComponents) => void;
  errors: Record<string, string>;
}

export default function CostsInput({
  costs,
  numberOfTiers,
  onUpdateCosts,
  errors
}: CostsInputProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const tierConfig = getTierConfig(numberOfTiers);
  const tierCodes = tierConfig.map(t => t.code);
  const tierLabelMap = tierConfig.reduce((acc, tier) => {
    acc[tier.code] = tier.label;
    return acc;
  }, {} as Record<string, string>);

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

  const handleAdminModeChange = (mode: 'simple' | 'detailed') => {
    if (mode === 'simple') {
      onUpdateCosts({
        ...costs,
        adminCostMode: mode,
        adminPEPM: costs.adminPEPM || 35,
        detailedAdminCosts: undefined
      });
    } else {
      onUpdateCosts({
        ...costs,
        adminCostMode: mode,
        detailedAdminCosts: {
          tpaFees: 0,
          brokerage: 0,
          compliance: 0,
          telemedicine: 0,
          ppoFees: 0,
          other1: 0,
          other2: 0
        }
      });
    }
  };

  const handleDetailedAdminChange = (field: string, value: number) => {
    if (costs.detailedAdminCosts) {
      onUpdateCosts({
        ...costs,
        detailedAdminCosts: {
          ...costs.detailedAdminCosts,
          [field]: value
        }
      });
    }
  };

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

      {/* Admin Cost Mode Toggle */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="block text-sm font-semibold text-blue-900 mb-3">
          Admin Cost Entry Mode
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              checked={costs.adminCostMode === 'simple'}
              onChange={() => handleAdminModeChange('simple')}
              className="mr-2 h-4 w-4 text-xl-bright-blue focus:ring-xl-bright-blue"
            />
            <span className={`text-sm ${costs.adminCostMode === 'simple' ? 'font-semibold text-blue-900' : 'text-blue-700'}`}>
              Simple (Single PEPM)
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              checked={costs.adminCostMode === 'detailed'}
              onChange={() => handleAdminModeChange('detailed')}
              className="mr-2 h-4 w-4 text-xl-bright-blue focus:ring-xl-bright-blue"
            />
            <span className={`text-sm ${costs.adminCostMode === 'detailed' ? 'font-semibold text-blue-900' : 'text-blue-700'}`}>
              Detailed (Line Item Breakdown)
            </span>
          </label>
        </div>
      </div>

      {/* Admin Costs Section */}
      {costs.adminCostMode === 'simple' ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Admin Cost (PEPM) *
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">$</span>
              <input
                type="number"
                step="0.01"
                value={costs.adminPEPM || 0}
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
            <p className="mt-1 text-xs text-gray-500">
              Combined monthly admin cost per employee
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-xl-dark-blue mb-3">Detailed Admin Costs (PEPM)</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TPA Fees
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={costs.detailedAdminCosts?.tpaFees || 0}
                  onChange={(e) => handleDetailedAdminChange('tpaFees', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brokerage & Consulting Fees
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={costs.detailedAdminCosts?.brokerage || 0}
                  onChange={(e) => handleDetailedAdminChange('brokerage', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compliance/COBRA
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={costs.detailedAdminCosts?.compliance || 0}
                  onChange={(e) => handleDetailedAdminChange('compliance', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telemedicine
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={costs.detailedAdminCosts?.telemedicine || 0}
                  onChange={(e) => handleDetailedAdminChange('telemedicine', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PPO Network Fees
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={costs.detailedAdminCosts?.ppoFees || 0}
                  onChange={(e) => handleDetailedAdminChange('ppoFees', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other 1
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={costs.detailedAdminCosts?.other1 || 0}
                  onChange={(e) => handleDetailedAdminChange('other1', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other 2
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={costs.detailedAdminCosts?.other2 || 0}
                  onChange={(e) => handleDetailedAdminChange('other2', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          {costs.detailedAdminCosts && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center font-semibold text-gray-700">
                <span>Total Admin PEPM:</span>
                <span className="text-xl-dark-blue">
                  ${(
                    (costs.detailedAdminCosts.tpaFees || 0) +
                    (costs.detailedAdminCosts.brokerage || 0) +
                    (costs.detailedAdminCosts.compliance || 0) +
                    (costs.detailedAdminCosts.telemedicine || 0) +
                    (costs.detailedAdminCosts.ppoFees || 0) +
                    (costs.detailedAdminCosts.other1 || 0) +
                    (costs.detailedAdminCosts.other2 || 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stop-Loss Basic Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Specific Deductible */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Specific Deductible *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              value={costs.specificDeductible.toLocaleString()}
              onChange={(e) => {
                const value = parseFormattedNumber(e.target.value);
                if (!isNaN(value) && value >= 0) {
                  onUpdateCosts({ ...costs, specificDeductible: value });
                }
              }}
              className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue ${
                errors.specificDeductible ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="50000"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Enter any amount (e.g., 65000, 82500)</p>
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
      </div>

      {/* Specific Rates by Tier */}
      <div>
        <h3 className="text-lg font-semibold text-xl-dark-blue mb-3">Specific Stop-Loss Rates (Monthly)</h3>
        <div className={`grid gap-4 ${numberOfTiers === 2 ? 'md:grid-cols-2' : numberOfTiers === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
          {tierCodes.map(tier => (
            <div key={tier}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tierLabelMap[tier]}
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={costs.specificRates[tier] || 0}
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

      {/* Aggregate Factors by Tier */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-xl-dark-blue">Aggregate Factors by Tier (Per Member)</h3>
          <button
            type="button"
            onClick={() => {
              const defaultFactors = tierConfig.reduce((acc, tier) => {
                acc[tier.code] = tier.aggregateFactor;
                return acc;
              }, {} as Record<string, number>);
              onUpdateCosts({ ...costs, aggregateFactors: defaultFactors });
            }}
            className="text-sm text-xl-bright-blue hover:underline"
          >
            Reset to Defaults
          </button>
        </div>
        <div className={`grid gap-4 ${numberOfTiers === 2 ? 'md:grid-cols-2' : numberOfTiers === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
          {tierCodes.map(tier => {
            const defaultFactor = tierConfig.find(t => t.code === tier)?.aggregateFactor || 1.0;
            return (
              <div key={tier}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tierLabelMap[tier]}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={costs.aggregateFactors[tier] || defaultFactor}
                    onChange={(e) => onUpdateCosts({
                      ...costs,
                      aggregateFactors: {
                        ...costs.aggregateFactors,
                        [tier]: parseFloat(e.target.value) || defaultFactor
                      }
                    })}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
                    placeholder={defaultFactor.toFixed(0)}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Default: ${defaultFactor.toFixed(0)}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Enter the expected aggregate claims liability per member for each tier. This represents the dollar amount used to calculate aggregate attachment points based on tier composition and family sizes.
        </p>
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
          <p className="text-sm text-gray-500 italic">
            No lasers added. Click "Add Laser" to include individual large claim accommodations.
          </p>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <strong>Cost Components:</strong> These values should come from your stop-loss quotes and vendor proposals.
            Admin costs include TPA fees, banking, compliance, and other operational expenses. Specific and aggregate rates
            are from your stop-loss carrier proposals.
          </div>
        </div>
      </div>
    </div>
  );
}
