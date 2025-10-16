import type { WizardData } from '@/lib/deductible-analyzer/types';

interface ReviewCalculateProps {
  data: WizardData;
  onCalculate: () => void;
  onBack: () => void;
  isCalculating: boolean;
  errors: Record<string, string>;
}

export default function ReviewCalculate({
  data,
  onCalculate,
  onBack,
  isCalculating,
  errors
}: ReviewCalculateProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const activeClaimants = data.claimants.filter(c =>
    c.claims.year2022 || c.claims.year2023 || c.claims.year2024 || c.claims.year2025
  );

  const activeOptions = data.deductibleOptions.filter(opt => opt.premium > 0);

  const totalClaims = {
    year2022: data.claimants.reduce((sum, c) => sum + (c.claims.year2022 || 0), 0),
    year2023: data.claimants.reduce((sum, c) => sum + (c.claims.year2023 || 0), 0),
    year2024: data.claimants.reduce((sum, c) => sum + (c.claims.year2024 || 0), 0),
    year2025: data.claimants.reduce((sum, c) => sum + (c.claims.year2025 || 0), 0),
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-xl-dark-blue mb-6">Review & Calculate</h2>
      <p className="text-gray-600 mb-8">
        Review your inputs below. Click "Calculate Results" to run the deductible analysis.
      </p>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Company Name</p>
              <p className="font-medium">{data.companyName || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Effective Date</p>
              <p className="font-medium">
                {data.effectiveDate ? new Date(data.effectiveDate).toLocaleDateString() : 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Medical Trend Rate</p>
              <p className="font-medium">{formatPercent(data.medicalTrendRate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Analysis Period</p>
              <p className="font-medium">2022-2025 → 2026</p>
            </div>
          </div>
        </div>

        {/* Current Setup */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Current Stop-Loss Setup</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Current Deductible</p>
              <p className="font-medium text-xl">{formatCurrency(data.currentDeductible)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Renewal Premium</p>
              <p className="font-medium text-xl">{formatCurrency(data.renewalPremium)}</p>
            </div>
          </div>
        </div>

        {/* Claims Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Historical Claims Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">2022 Claims</p>
              <p className="font-medium">{formatCurrency(totalClaims.year2022)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">2023 Claims</p>
              <p className="font-medium">{formatCurrency(totalClaims.year2023)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">2024 Claims</p>
              <p className="font-medium">{formatCurrency(totalClaims.year2024)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">2025 Claims</p>
              <p className="font-medium">{formatCurrency(totalClaims.year2025)}</p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-300">
            <p className="text-sm text-gray-600">Total Claimants with Data</p>
            <p className="font-medium text-lg">{activeClaimants.length} claimants</p>
          </div>
        </div>

        {/* Alternative Options */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Alternative Deductible Options</h3>
          {activeOptions.length > 0 ? (
            <div className="space-y-3">
              {activeOptions.map((option, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                  <div>
                    <p className="font-medium">{option.carrierName || `Option ${index + 1}`}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(option.amount)} deductible</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(option.premium)}</p>
                    <p className="text-sm text-green-600">
                      Save {formatCurrency(data.renewalPremium - option.premium)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No alternative options entered</p>
          )}
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-900 mb-2">⚠️ Important</h3>
          <p className="text-sm text-amber-700">
            This analysis trends historical claims forward using your specified medical trend rate and calculates
            the excess claims at each deductible level. The results show net savings after accounting for additional
            claims liability. Results are estimates based on historical data and may not reflect future experience.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={isCalculating}
        >
          Previous Step
        </button>
        <button
          onClick={onCalculate}
          disabled={isCalculating}
          className={`px-8 py-3 rounded-md font-semibold transition-all ${
            isCalculating
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
          }`}
        >
          {isCalculating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calculating...
            </span>
          ) : (
            'Calculate Results'
          )}
        </button>
      </div>
    </div>
  );
}