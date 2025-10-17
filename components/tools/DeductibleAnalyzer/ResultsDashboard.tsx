import { useState } from 'react';
import type { WizardData, AnalyzerResults } from '@/lib/deductible-analyzer/types';

interface ResultsDashboardProps {
  data: WizardData;
  results: AnalyzerResults;
  onReset: () => void;
}

export default function ResultsDashboard({ data, results, onReset }: ResultsDashboardProps) {
  const [showPrintView, setShowPrintView] = useState(false);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadExcel = () => {
    if (results.excelBuffer) {
      const blob = new Blob([results.excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.companyName.replace(/\s+/g, '_')}_ISL_Analysis.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="print:bg-white">
      {/* Header */}
      <div className="mb-8 print:mb-4">
        <h1 className="text-3xl font-bold text-xl-dark-blue mb-2">
          ISL Deductible Analysis Results
        </h1>
        <p className="text-gray-600">
          {data.companyName} • Effective {new Date(data.effectiveDate).toLocaleDateString()}
        </p>
      </div>

      {/* Action Buttons - Hide in print */}
      <div className="mb-6 flex gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-xl-bright-blue text-white px-6 py-2 rounded-md font-semibold hover:bg-xl-dark-blue transition-colors"
        >
          Print Report
        </button>
        <button
          onClick={handleDownloadExcel}
          className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors"
        >
          Download Excel
        </button>
        <button
          onClick={onReset}
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-50 transition-colors"
        >
          Start New Analysis
        </button>
      </div>

      {/* Recommendation Box */}
      <div className="mb-8 bg-green-50 border-2 border-green-500 rounded-lg p-6">
        <h2 className="text-xl font-bold text-green-900 mb-3">Recommendation</h2>
        <p className="text-green-800 leading-relaxed">{results.recommendation.text}</p>
        {results.recommendation.netSavings > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-green-300">
            <div>
              <p className="text-sm text-green-700">Recommended Deductible</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(results.recommendation.optimalDeductible)}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-700">Net Annual Savings</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(results.recommendation.netSavings)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Claims Analysis Table */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-xl-dark-blue mb-4">Claims Analysis by Deductible Level</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-left text-sm md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductible
                </th>
                <th className="px-2 sm:px-4 py-3 text-right text-sm md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                  2022
                </th>
                <th className="px-2 sm:px-4 py-3 text-right text-sm md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                  2023
                </th>
                <th className="px-2 sm:px-4 py-3 text-right text-sm md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                  2024
                </th>
                <th className="px-2 sm:px-4 py-3 text-right text-sm md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                  2025*
                </th>
                <th className="px-2 sm:px-4 py-3 text-right text-sm md:text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                  Avg ISL
                </th>
                <th className="px-2 sm:px-4 py-3 text-right text-sm md:text-xs font-medium text-gray-500 uppercase tracking-wider bg-yellow-50">
                  Additional
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.claimsAnalysis.map((row, index) => (
                <tr key={index} className={index === 0 ? 'bg-gray-50 font-semibold' : ''}>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm">
                    {formatCurrency(row.deductibleAmount)}
                    {index === 0 && <span className="ml-2 text-xs text-gray-500">(Current)</span>}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-right text-sm">
                    {formatCurrency(row.claims2022)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-right text-sm">
                    {formatCurrency(row.claims2023)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-right text-sm">
                    {formatCurrency(row.claims2024)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-right text-gray-500 text-sm">
                    {formatCurrency(row.claims2025)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-right bg-blue-50 font-semibold text-sm">
                    {formatCurrency(row.averageISLClaims)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-right bg-yellow-50 text-sm">
                    {row.additionalClaims > 0 ? (
                      <span className="text-green-600 font-semibold">
                        {formatCurrency(row.additionalClaims)}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          * 2025 data is incomplete and excluded from average calculations
        </p>
      </div>

      {/* Premium Comparison Table */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-xl-dark-blue mb-4">Premium Comparison & Net Savings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carrier
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductible
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premium Quote
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50">
                  Premium Savings
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-red-50">
                  Additional Claims
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                  Net Projected Savings
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-3">Current/Renewal</td>
                <td className="px-4 py-3 text-right">{formatCurrency(data.currentDeductible)}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(data.renewalPremium)}</td>
                <td className="px-4 py-3 text-right bg-green-50">—</td>
                <td className="px-4 py-3 text-right bg-red-50">—</td>
                <td className="px-4 py-3 text-right bg-blue-50">—</td>
              </tr>
              {results.premiumComparison.map((row, index) => {
                const isOptimal = row.deductibleAmount === results.recommendation.optimalDeductible;
                return (
                  <tr key={index} className={isOptimal ? 'bg-yellow-50' : ''}>
                    <td className="px-4 py-3">
                      {row.carrierName}
                      {isOptimal && <span className="ml-2 text-xs text-green-600 font-semibold">★ RECOMMENDED</span>}
                    </td>
                    <td className="px-4 py-3 text-right">{formatCurrency(row.deductibleAmount)}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(row.premiumQuote)}</td>
                    <td className="px-4 py-3 text-right bg-green-50 text-green-600 font-semibold">
                      {formatCurrency(row.premiumSavings)}
                    </td>
                    <td className="px-4 py-3 text-right bg-red-50 text-red-600">
                      ({formatCurrency(row.additionalClaims)})
                    </td>
                    <td className="px-4 py-3 text-right bg-blue-50 font-bold text-lg">
                      {row.netProjectedSavings > 0 ? (
                        <span className="text-green-600">{formatCurrency(row.netProjectedSavings)}</span>
                      ) : (
                        <span className="text-red-600">({formatCurrency(Math.abs(row.netProjectedSavings))})</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-xl-dark-blue mb-4">Key Insights</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-xl-bright-blue mr-2">•</span>
            <span>
              Claims have been trended forward at {(data.medicalTrendRate * 100).toFixed(1)}% annually to project 2026 values
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-xl-bright-blue mr-2">•</span>
            <span>
              Average ISL claims are based on 2022-2024 experience (2025 excluded due to incomplete data)
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-xl-bright-blue mr-2">•</span>
            <span>
              Net savings calculations account for both premium reduction and increased claims liability
            </span>
          </li>
          {results.recommendation.netSavings > 0 && (
            <li className="flex items-start">
              <span className="text-xl-bright-blue mr-2">•</span>
              <span className="font-semibold">
                Moving to the recommended deductible could save {formatCurrency(results.recommendation.netSavings)} annually
              </span>
            </li>
          )}
        </ul>
      </div>

      {/* Footer - Print only */}
      <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-sm text-gray-600">
        <p>Generated by XL Benefits ISL Deductible Analyzer • {new Date().toLocaleDateString()}</p>
        <p className="mt-1">This analysis is based on historical data and projections. Actual results may vary.</p>
      </div>
    </div>
  );
}