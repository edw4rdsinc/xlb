import type { WizardData } from '@/lib/deductible-analyzer/types';

interface BasicInfoProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  errors: Record<string, string>;
}

export default function BasicInfo({ data, updateData, onNext, errors }: BasicInfoProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-xl-dark-blue mb-6">Basic Information</h2>
      <p className="text-gray-600 mb-8">
        Let's start with some basic information about the group and analysis parameters.
      </p>

      <div className="space-y-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            id="companyName"
            value={data.companyName}
            onChange={(e) => updateData({ companyName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-xl-bright-blue focus:border-xl-bright-blue"
            required
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-2">
            Effective Date *
          </label>
          <input
            type="date"
            id="effectiveDate"
            value={data.effectiveDate}
            onChange={(e) => updateData({ effectiveDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-xl-bright-blue focus:border-xl-bright-blue"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            The effective date for the new stop-loss coverage
          </p>
        </div>

        <div>
          <label htmlFor="medicalTrendRate" className="block text-sm font-medium text-gray-700 mb-2">
            Medical Trend Rate (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              id="medicalTrendRate"
              value={(data.medicalTrendRate * 100).toFixed(1)}
              onChange={(e) => updateData({ medicalTrendRate: parseFloat(e.target.value) / 100 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-xl-bright-blue focus:border-xl-bright-blue"
              required
              min="0"
              max="20"
              step="0.1"
              placeholder="7.0"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Annual medical inflation rate used to trend claims forward (typically 5-10%)
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">About Medical Trend</h3>
          <p className="text-sm text-blue-700">
            The medical trend rate adjusts historical claims to future dollars. For example, a 7% trend rate means
            medical costs are expected to increase 7% annually. This ensures your analysis reflects projected costs
            at the effective date rather than historical values.
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
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