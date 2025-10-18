import type { WizardData } from '@/lib/deductible-analyzer/types';

interface CurrentSetupProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
}

export default function CurrentSetup({ data, updateData, onNext, onBack, errors }: CurrentSetupProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-xl-dark-blue mb-6">Current Stop-Loss Setup</h2>
      <p className="text-gray-600 mb-8">
        Enter your current stop-loss deductible and renewal premium for comparison.
      </p>

      <div className="space-y-6">
        <div>
          <label htmlFor="currentDeductible" className="block text-sm font-medium text-gray-700 mb-2">
            Current Specific Deductible *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              inputMode="decimal"
              id="currentDeductible"
              value={data.currentDeductible || ''}
              onChange={(e) => {
                const cleanValue = e.target.value.replace(/[^0-9.]/g, '');
                const parts = cleanValue.split('.');
                const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts[1].slice(0, 2) : '');
                updateData({ currentDeductible: formattedValue ? parseFloat(formattedValue) : 0 });
              }}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              required
              placeholder="225000.00"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Your current individual stop-loss (specific) deductible
          </p>
        </div>

        <div>
          <label htmlFor="renewalPremium" className="block text-sm font-medium text-gray-700 mb-2">
            Annual Renewal Premium *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              inputMode="decimal"
              id="renewalPremium"
              value={data.renewalPremium || ''}
              onChange={(e) => {
                const cleanValue = e.target.value.replace(/[^0-9.]/g, '');
                const parts = cleanValue.split('.');
                const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts[1].slice(0, 2) : '');
                updateData({ renewalPremium: formattedValue ? parseFloat(formattedValue) : 0 });
              }}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              required
              placeholder="5000000.00"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Your renewal premium at the current deductible level
          </p>
        </div>

        {/* Preview Box */}
        {data.currentDeductible > 0 && data.renewalPremium > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Current Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Specific Deductible</p>
                <p className="text-lg font-semibold text-xl-dark-blue">
                  {formatCurrency(data.currentDeductible)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Annual Premium</p>
                <p className="text-lg font-semibold text-xl-dark-blue">
                  {formatCurrency(data.renewalPremium)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Premium</p>
                <p className="text-lg font-semibold text-xl-dark-blue">
                  {formatCurrency(data.renewalPremium / 12)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Per Employee Per Month</p>
                <p className="text-lg font-semibold text-xl-dark-blue">
                  <span className="text-sm text-gray-500">(Estimated based on 500 EE)</span><br />
                  {formatCurrency(data.renewalPremium / 12 / 500)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Why This Matters</h3>
          <p className="text-sm text-blue-700">
            Your current setup serves as the baseline for comparison. The analyzer will show how alternative
            deductible levels compare to these values, helping you identify potential savings opportunities
            while understanding the additional risk exposure.
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Previous Step
        </button>
        <button
          type="submit"
          className="bg-xl-bright-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-xl-dark-blue transition-colors"
        >
          Next Step
        </button>
      </div>
    </form>
  );
}