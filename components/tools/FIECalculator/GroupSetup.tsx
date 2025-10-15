'use client';

import type { WizardData } from '../FIECalculator';

interface GroupSetupProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  errors: Record<string, string>;
}

export default function GroupSetup({ data, onUpdate, errors }: GroupSetupProps) {
  const handlePlanNameChange = (index: number, value: string) => {
    const newPlanNames = [...data.planNames];
    newPlanNames[index] = value;
    onUpdate({ planNames: newPlanNames });
  };

  const handleNumberOfPlansChange = (value: number) => {
    const newPlanNames = [...data.planNames];

    // Adjust plan names array size
    if (value > newPlanNames.length) {
      for (let i = newPlanNames.length; i < value; i++) {
        newPlanNames.push(`Plan ${i + 1}`);
      }
    } else {
      newPlanNames.splice(value);
    }

    onUpdate({
      numberOfPlans: value,
      planNames: newPlanNames
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-xl-dark-blue mb-4">Group Setup</h2>
        <p className="text-gray-600 mb-6">
          Enter basic information about the group to get started with your FIE rate calculation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Group Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Group Name *
          </label>
          <input
            type="text"
            value={data.groupName}
            onChange={(e) => onUpdate({ groupName: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue ${
              errors.groupName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter group name"
          />
          {errors.groupName && (
            <p className="mt-1 text-sm text-red-600">{errors.groupName}</p>
          )}
        </div>

        {/* Effective Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Effective Date *
          </label>
          <input
            type="date"
            value={data.effectiveDate}
            onChange={(e) => onUpdate({ effectiveDate: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue ${
              errors.effectiveDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.effectiveDate && (
            <p className="mt-1 text-sm text-red-600">{errors.effectiveDate}</p>
          )}
        </div>

        {/* Current Funding Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Funding Type
          </label>
          <select
            value={data.currentFundingType}
            onChange={(e) => onUpdate({ currentFundingType: e.target.value as 'Fully-Insured' | 'Self-Funded' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
          >
            <option value="Fully-Insured">Fully-Insured</option>
            <option value="Self-Funded">Self-Funded</option>
          </select>
        </div>

        {/* Number of Plans */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Number of Plans
          </label>
          <select
            value={data.numberOfPlans}
            onChange={(e) => handleNumberOfPlansChange(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Number of Tiers */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Number of Tiers
          </label>
          <select
            value={data.numberOfTiers}
            onChange={(e) => onUpdate({ numberOfTiers: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue"
          >
            <option value={2}>2 Tiers (Employee Only, Family)</option>
            <option value={3}>3 Tiers (Employee Only, Employee + 1, Family)</option>
            <option value={4}>4 Tiers (Employee Only, Employee + Spouse, Employee + Child(ren), Family)</option>
          </select>
        </div>
      </div>

      {/* Plan Names */}
      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Plan Names *
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          {data.planNames.slice(0, data.numberOfPlans).map((name, index) => (
            <div key={index}>
              <input
                type="text"
                value={name}
                onChange={(e) => handlePlanNameChange(index, e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-xl-bright-blue focus:border-xl-bright-blue ${
                  errors.planNames ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={`Plan ${index + 1} name`}
              />
            </div>
          ))}
        </div>
        {errors.planNames && (
          <p className="mt-1 text-sm text-red-600">{errors.planNames}</p>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <strong>Tip:</strong> The FIE Calculator helps you compare fully-insured equivalent rates to your current rates.
            Make sure to have your current plan information and stop-loss quotes ready for the most accurate results.
          </div>
        </div>
      </div>
    </div>
  );
}