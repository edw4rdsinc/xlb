/**
 * FIE Calculator Client Component
 * Uses protected API endpoint for calculations
 */

'use client';

import { useState } from 'react';
import { useFIECalculator } from '@/lib/hooks/useCalculatorAPI';
import { AlertCircle, Calculator, Shield, TrendingDown } from 'lucide-react';

// This component only handles UI and state management
// All calculation logic is protected on the server

interface FIECalculatorProps {
  onComplete?: (results: any) => void;
}

export default function FIECalculatorClient({ onComplete }: FIECalculatorProps) {
  // Form state (what the user inputs)
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    numberOfTiers: 4,
    plans: [
      {
        name: 'Plan A',
        differential: 1.0,
        census: { EO: 0, ES: 0, EC: 0, F: 0 },
        currentRates: { EO: 0, ES: 0, EC: 0, F: 0 }
      }
    ],
    costs: {
      adminCostMode: 'simple' as const,
      adminPEPM: 45,
      specificDeductible: 100000,
      specificRates: { EO: 30, ES: 65, EC: 50, F: 85 },
      aggregateCorridor: 1.25,
      aggregateRate: 25,
      aggregateFactors: { EO: 15, ES: 32, EC: 25, F: 41 },
      lasers: []
    }
  });

  // Use the protected API hook
  const { calculate, loading, error, data } = useFIECalculator({
    onSuccess: (results) => {
      console.log('Calculation successful:', results);
      onComplete?.(results);
    },
    onError: (error) => {
      console.error('Calculation error:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation (basic checks only)
    if (!formData.email) {
      alert('Please enter your email');
      return;
    }

    // Send to protected API for calculation
    await calculate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">Secure Calculation</h3>
            <p className="text-sm text-blue-700 mt-1">
              Your data is processed securely on our servers. Calculations are protected
              with rate limiting and CAPTCHA verification to ensure accuracy and prevent abuse.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Capture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="broker@company.com"
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="ABC Corporation"
          />
        </div>

        {/* Simplified form inputs */}
        {/* In production, this would be a multi-step wizard */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Configure your plans, census data, and stop-loss parameters...
          </p>
          {/* Form fields would go here */}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Calculation Error</h4>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold text-white
            flex items-center justify-center space-x-2
            ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }
          `}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Calculating...</span>
            </>
          ) : (
            <>
              <Calculator className="w-5 h-5" />
              <span>Calculate FIE Rates</span>
            </>
          )}
        </button>
      </form>

      {/* Results Display */}
      {data && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <TrendingDown className="w-6 h-6 text-green-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-900">
                Calculation Complete!
              </h3>

              {data.annualSavings > 0 ? (
                <div className="mt-4 space-y-2">
                  <p className="text-2xl font-bold text-green-700">
                    ${data.annualSavings.toLocaleString()} Annual Savings
                  </p>
                  <p className="text-lg text-green-600">
                    {data.savingsPercentage.toFixed(1)}% reduction in costs
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-gray-700">
                    Current rates are optimized. Consider reviewing other plan options.
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-green-200">
                <h4 className="font-semibold text-gray-900 mb-2">Cost Breakdown:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Annual Cost:</span>
                    <span className="font-medium">${data.currentAnnualCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">FIE Annual Cost:</span>
                    <span className="font-medium">${data.fieAnnualCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-green-700">
                    <span>Projected Savings:</span>
                    <span>${data.annualSavings.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Plan-specific rates would be displayed here */}
              {data.planAllocations && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-2">FIE Rates by Plan:</h4>
                  {/* Rate tables would go here */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* reCAPTCHA Badge Notice */}
      <div className="mt-6 text-xs text-gray-500 text-center">
        This site is protected by reCAPTCHA and the Google{' '}
        <a href="https://policies.google.com/privacy" className="underline" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>{' '}
        and{' '}
        <a href="https://policies.google.com/terms" className="underline" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </a>{' '}
        apply.
      </div>
    </div>
  );
}