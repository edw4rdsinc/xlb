'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatCurrency, formatPercentage, getTierConfig } from '@/lib/fie-calculator/calculations';
import type { CalculationResults } from '@/lib/fie-calculator/calculations';
import type { WizardData } from '../FIECalculator';
import CalculationBreakdown from './CalculationBreakdown';

interface ResultsDashboardProps {
  wizardData: WizardData;
  results: CalculationResults;
}

export default function ResultsDashboard({ wizardData, results }: ResultsDashboardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const tierConfig = getTierConfig(wizardData.numberOfTiers);
  const tierCodes = tierConfig.map(t => t.code);
  const tierLabelMap = tierConfig.reduce((acc, tier) => {
    acc[tier.code] = tier.label;
    return acc;
  }, {} as Record<string, string>);

  const isPositiveSavings = results.savingsPercentage > 0;

  // Prepare data for bar chart (rates comparison)
  const ratesComparisonData = wizardData.plans.map((plan, index) => {
    const planAllocation = results.planAllocations[index];

    return tierCodes.map(tier => ({
      tier: tier,
      plan: plan.name,
      current: plan.currentRates[tier] || 0,
      fie: planAllocation.fieRates[tier] || 0
    }));
  }).flat();

  // Prepare data for pie chart (cost breakdown)
  const costBreakdownData = [
    { name: 'Admin Costs', value: results.adminCosts, color: '#003366' },
    { name: 'Specific Premium', value: results.specificPremium, color: '#0099CC' },
    { name: 'Aggregate Premium', value: results.aggregatePremium, color: '#66B2CC' },
    { name: 'Laser Liability', value: results.laserLiability, color: '#99CCDD' }
  ].filter(item => item.value > 0);

  // Calculate PEPM comparison
  const currentPEPM = results.currentAnnualCost / calculateTotalEmployees() / 12;
  const fiePEPM = results.fieAnnualCost / calculateTotalEmployees() / 12;

  function calculateTotalEmployees() {
    return wizardData.plans.reduce((total, plan) => {
      return total + tierCodes.reduce((sum, tier) => {
        return sum + (plan.census[tier] || 0);
      }, 0);
    }, 0);
  }

  const handleDownloadPDF = () => {
    // This would trigger PDF generation
    // For now, we'll show an alert
    alert('PDF generation would be triggered here. This requires additional setup with @react-pdf/renderer.');
  };

  return (
    <div className="space-y-8">
      {/* Header with Savings Highlight */}
      <div className="bg-gradient-to-r from-xl-dark-blue to-xl-bright-blue rounded-lg p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">FIE Rate Analysis Results</h2>
            <p className="text-xl opacity-90">
              {wizardData.groupName} - Effective {new Date(wizardData.effectiveDate).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <div className="text-4xl font-bold">
              {formatPercentage(Math.abs(results.savingsPercentage))}
            </div>
            <p className="text-lg opacity-90">
              {isPositiveSavings ? 'Potential Savings' : 'Rate Increase'}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Current Annual Cost
          </h3>
          <p className="text-2xl font-bold text-xl-dark-blue">
            {formatCurrency(results.currentAnnualCost)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Based on current rates
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            FIE Annual Cost
          </h3>
          <p className="text-2xl font-bold text-xl-bright-blue">
            {formatCurrency(results.fieAnnualCost)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Self-funded equivalent
          </p>
        </div>

        <div className={`rounded-lg shadow-md p-6 ${
          isPositiveSavings ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Annual Difference
          </h3>
          <p className={`text-2xl font-bold ${
            isPositiveSavings ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(Math.abs(results.annualSavings))}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {isPositiveSavings ? 'Lower with self-funding' : 'Higher with self-funding'}
          </p>
        </div>
      </div>

      {/* PEPM Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-xl-dark-blue mb-4">PEPM Cost Breakdown</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Component Analysis</h4>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Administrative</span>
                <span className="font-semibold">{formatCurrency(results.pepmBreakdown.admin)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Specific Stop-Loss</span>
                <span className="font-semibold">{formatCurrency(results.pepmBreakdown.specific)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Aggregate Stop-Loss</span>
                <span className="font-semibold">{formatCurrency(results.pepmBreakdown.aggregate)}</span>
              </div>
              {results.pepmBreakdown.laser > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Laser Liability</span>
                  <span className="font-semibold">{formatCurrency(results.pepmBreakdown.laser)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 font-bold text-xl-dark-blue">
                <span>Total PEPM</span>
                <span>{formatCurrency(results.pepmBreakdown.total)}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Cost Distribution</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {costBreakdownData.map(item => (
                <div key={item.name} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rates Comparison by Plan */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-xl-dark-blue mb-4">Rate Comparison by Plan</h3>

        {/* Toggle for detailed view */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mb-4 text-xl-bright-blue hover:text-xl-dark-blue font-semibold flex items-center"
        >
          <svg
            className={`w-5 h-5 mr-2 transform transition-transform ${showDetails ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {showDetails ? 'Hide' : 'Show'} Detailed Rates
        </button>

        {showDetails && (
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left">Plan</th>
                  {tierCodes.map(tier => (
                    <th key={tier} className="border border-gray-300 bg-gray-50 px-4 py-2 text-center" colSpan={2}>
                      {tierLabelMap[tier]}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="border border-gray-300 bg-gray-100 px-4 py-1"></th>
                  {tierCodes.map(tier => (
                    <>
                      <th key={`${tier}-current`} className="border border-gray-300 bg-gray-100 px-4 py-1 text-center text-xs">Current</th>
                      <th key={`${tier}-fie`} className="border border-gray-300 bg-gray-100 px-4 py-1 text-center text-xs">FIE</th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wizardData.plans.map((plan, index) => {
                  const allocation = results.planAllocations[index];
                  return (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{plan.name}</td>
                      {tierCodes.map(tier => (
                        <>
                          <td key={`${index}-${tier}-current`} className="border border-gray-300 px-4 py-2 text-center">
                            {formatCurrency(plan.currentRates[tier] || 0)}
                          </td>
                          <td key={`${index}-${tier}-fie`} className="border border-gray-300 px-4 py-2 text-center font-semibold">
                            {formatCurrency(allocation.fieRates[tier] || 0)}
                          </td>
                        </>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Comparison */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Average Current PEPM</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(currentPEPM)}</p>
            </div>
            <div className="text-center">
              <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">FIE PEPM</p>
              <p className="text-xl font-bold text-xl-bright-blue">{formatCurrency(fiePEPM)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownloadPDF}
          className="px-8 py-3 bg-xl-bright-blue text-white rounded-md font-semibold hover:bg-xl-dark-blue transition-all flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF Report
        </button>

        <button
          onClick={() => window.print()}
          className="px-8 py-3 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700 transition-all flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Results
        </button>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">Next Steps</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zm-8-5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 012 13zm0-4a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 012 9zm0-4a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H2.75A.75.75 0 012 5z" clipRule="evenodd" />
            </svg>
            <p>Review the detailed analysis with your team to understand the cost implications</p>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zm-8-5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 012 13zm0-4a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 012 9zm0-4a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H2.75A.75.75 0 012 5z" clipRule="evenodd" />
            </svg>
            <p>Consider factors beyond price, such as cash flow requirements and risk tolerance</p>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zm-8-5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 012 13zm0-4a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 012 9zm0-4a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H2.75A.75.75 0 012 5z" clipRule="evenodd" />
            </svg>
            <p>Schedule a consultation with our stop-loss experts for personalized guidance</p>
          </div>
        </div>
      </div>

      {/* Calculation Breakdown Toggle */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between text-left"
        >
          <div>
            <h3 className="text-lg font-semibold text-xl-dark-blue">View Detailed Calculation Breakdown</h3>
            <p className="text-sm text-gray-600 mt-1">
              See step-by-step how we calculated your FIE rates
            </p>
          </div>
          <svg
            className={`w-6 h-6 text-xl-bright-blue transition-transform ${showBreakdown ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showBreakdown && (
          <div className="mt-6">
            <CalculationBreakdown wizardData={wizardData} results={results} />
          </div>
        )}
      </div>
    </div>
  );
}