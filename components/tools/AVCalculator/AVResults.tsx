'use client';

import type { WizardData, AVCalculationResult } from '@/types/av-calculator';
import { formatAVPercentage, formatCurrency, METAL_TIER_COLORS } from '@/types/av-calculator';
import TierRangeChart from './TierRangeChart';

interface AVResultsProps {
  planData: WizardData;
  results: AVCalculationResult;
  onReset: () => void;
}

export default function AVResults({ planData, results, onReset }: AVResultsProps) {
  const tierColor = METAL_TIER_COLORS[results.metalTier];

  const handleDownloadPDF = async () => {
    // TODO: Implement PDF generation
    alert('PDF download will be implemented in the API');
  };

  const handleEmailResults = async () => {
    // TODO: Implement email functionality
    alert('Email functionality will be implemented in the API');
  };

  return (
    <div className="space-y-8">
      {/* Main Result Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-xl-dark-blue mb-4">
            Actuarial Value Result
          </h2>
          {planData.planName && (
            <p className="text-lg text-xl-grey">
              {planData.planName}
            </p>
          )}
        </div>

        {/* Large AV Display */}
        <div className="flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-br from-xl-light-grey to-white rounded-lg mb-8">
          <div className="text-6xl sm:text-7xl font-bold mb-4" style={{ color: tierColor }}>
            {formatAVPercentage(results.actuarialValue)}
          </div>
          <div
            className="px-6 py-3 rounded-full text-white font-bold text-xl"
            style={{ backgroundColor: tierColor }}
          >
            {results.metalTier} Tier
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-xl-bright-blue/10 rounded-lg p-6">
            <div className="text-center">
              <p className="text-sm text-xl-grey mb-2">Plan Pays</p>
              <p className="text-3xl font-bold text-xl-bright-blue">
                {formatAVPercentage(results.planPaysPercentage)}
              </p>
              <p className="text-sm text-xl-grey mt-2">of covered costs</p>
            </div>
          </div>

          <div className="bg-xl-grey/10 rounded-lg p-6">
            <div className="text-center">
              <p className="text-sm text-xl-grey mb-2">Enrollee Pays</p>
              <p className="text-3xl font-bold text-xl-grey">
                {formatAVPercentage(results.enrolleePaysPercentage)}
              </p>
              <p className="text-sm text-xl-grey mt-2">through cost-sharing</p>
            </div>
          </div>
        </div>

        {/* Metal Tier Range Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-xl-dark-blue mb-4">
            Metal Tier Ranges (ACA Standard)
          </h3>
          <TierRangeChart currentAV={results.actuarialValue} />
        </div>

        {/* Plan Details Summary */}
        <div className="bg-xl-light-grey/50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-xl-dark-blue mb-4">
            Plan Cost-Sharing Summary
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Individual Deductible</p>
              <p className="font-semibold text-xl-dark-blue">
                {formatCurrency(planData.individualDeductible)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Family Deductible</p>
              <p className="font-semibold text-xl-dark-blue">
                {formatCurrency(planData.familyDeductible)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Individual MOOP</p>
              <p className="font-semibold text-xl-dark-blue">
                {formatCurrency(planData.individualMOOP)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Family MOOP</p>
              <p className="font-semibold text-xl-dark-blue">
                {formatCurrency(planData.familyMOOP)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Medical Coinsurance</p>
              <p className="font-semibold text-xl-dark-blue">
                {formatAVPercentage(planData.medicalCoinsurance)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Primary Care Copay</p>
              <p className="font-semibold text-xl-dark-blue">
                {formatCurrency(planData.primaryCareCopay)}
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Check */}
        <div className={`rounded-lg p-6 mb-8 ${
          results.compliance.isACACompliant
            ? 'bg-green-50 border border-green-200'
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {results.compliance.isACACompliant ? (
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${
                results.compliance.isACACompliant ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {results.compliance.isACACompliant ? 'ACA Compliant' : 'Compliance Check'}
              </h3>
              {results.compliance.issues && results.compliance.issues.length > 0 && (
                <div className="mb-2">
                  <p className="font-medium text-red-800 mb-1">Issues:</p>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {results.compliance.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              {results.compliance.warnings && results.compliance.warnings.length > 0 && (
                <div>
                  <p className="font-medium text-yellow-800 mb-1">Warnings:</p>
                  <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                    {results.compliance.warnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              {results.compliance.isACACompliant && (
                <p className="text-sm text-green-700">
                  This plan meets ACA requirements for {results.metalTier} tier classification.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Category Breakdown (if available) */}
        {results.categoryBreakdown && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-xl-dark-blue mb-4">
              AV Breakdown by Category
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Primary Care</p>
                <p className="text-2xl font-bold text-xl-dark-blue">
                  {formatAVPercentage(results.categoryBreakdown.primaryCare)}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Specialty Care</p>
                <p className="text-2xl font-bold text-xl-dark-blue">
                  {formatAVPercentage(results.categoryBreakdown.specialty)}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Emergency</p>
                <p className="text-2xl font-bold text-xl-dark-blue">
                  {formatAVPercentage(results.categoryBreakdown.emergency)}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Inpatient</p>
                <p className="text-2xl font-bold text-xl-dark-blue">
                  {formatAVPercentage(results.categoryBreakdown.inpatient)}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Outpatient</p>
                <p className="text-2xl font-bold text-xl-dark-blue">
                  {formatAVPercentage(results.categoryBreakdown.outpatient)}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Pharmacy</p>
                <p className="text-2xl font-bold text-xl-dark-blue">
                  {formatAVPercentage(results.categoryBreakdown.pharmacy)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-6 py-3 bg-xl-dark-blue text-white rounded-lg font-semibold hover:bg-xl-bright-blue transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF Report
          </button>

          <button
            onClick={handleEmailResults}
            className="flex items-center px-6 py-3 bg-xl-bright-blue text-white rounded-lg font-semibold hover:bg-xl-dark-blue transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Results
          </button>

          <button
            onClick={onReset}
            className="flex items-center px-6 py-3 border-2 border-xl-dark-blue text-xl-dark-blue rounded-lg font-semibold hover:bg-xl-light-grey transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Calculate Another Plan
          </button>
        </div>

        {/* Timestamp */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Calculated: {new Date(results.calculatedAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-xl-dark-blue mb-4">
          Understanding Your Results
        </h3>

        <div className="space-y-4 text-gray-700">
          <div>
            <h4 className="font-semibold text-xl-dark-blue mb-2">What is Actuarial Value?</h4>
            <p>
              Actuarial Value (AV) represents the percentage of total average healthcare costs that this plan
              will cover for a standard population. An AV of {formatAVPercentage(results.actuarialValue)} means
              the plan pays approximately {formatAVPercentage(results.planPaysPercentage)} of covered healthcare
              costs, while enrollees pay {formatAVPercentage(results.enrolleePaysPercentage)} through deductibles,
              copays, and coinsurance.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xl-dark-blue mb-2">Metal Tier Classification</h4>
            <p>
              Under the Affordable Care Act, health plans are categorized into metal tiers based on their actuarial
              value. Your plan qualifies as {results.metalTier} tier, which means it provides approximately{' '}
              {formatAVPercentage(results.actuarialValue)} coverage for a standard population's healthcare costs.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xl-dark-blue mb-2">How to Use This Information</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Compare plans with similar actuarial values to find the best value</li>
              <li>Ensure marketplace plans meet metal tier requirements</li>
              <li>Help clients understand their true out-of-pocket exposure</li>
              <li>Validate carrier-provided AV calculations</li>
              <li>Design new plans to meet specific metal tier targets</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
