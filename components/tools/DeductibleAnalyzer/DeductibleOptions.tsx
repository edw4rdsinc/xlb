import type { WizardData, DeductibleOption } from '@/lib/deductible-analyzer/types';

interface DeductibleOptionsProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
}

export default function DeductibleOptions({ data, updateData, onNext, onBack, errors }: DeductibleOptionsProps) {
  const handleOptionChange = (index: number, field: keyof DeductibleOption, value: any) => {
    const newOptions = [...data.deductibleOptions];
    if (field === 'amount' || field === 'premium') {
      // Allow decimal inputs with up to 2 decimal places
      const cleanValue = value.replace(/[^0-9.]/g, '');
      const parts = cleanValue.split('.');
      const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts[1].slice(0, 2) : '');
      newOptions[index][field] = formattedValue ? parseFloat(formattedValue) : 0;
    } else {
      newOptions[index][field] = value;
    }
    updateData({ deductibleOptions: newOptions });
  };

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

  const calculateSavings = (optionPremium: number) => {
    if (data.renewalPremium && optionPremium) {
      return data.renewalPremium - optionPremium;
    }
    return 0;
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-xl-dark-blue mb-6">Alternative Deductible Options</h2>
      <p className="text-gray-600 mb-8">
        Enter up to 4 alternative deductible options with carrier quotes. Leave blank any options you don't have quotes for.
      </p>

      <div className="space-y-6">
        {data.deductibleOptions.map((option, index) => (
          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Option {index + 1}</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deductible Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={option.amount || ''}
                    onChange={(e) => handleOptionChange(index, 'amount', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-xl-bright-blue focus:border-xl-bright-blue"
                    placeholder={`${250000 + (index * 50000)}.00`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carrier Name
                </label>
                <input
                  type="text"
                  value={option.carrierName}
                  onChange={(e) => handleOptionChange(index, 'carrierName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-xl-bright-blue focus:border-xl-bright-blue"
                  placeholder="Carrier name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Premium Quote
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={option.premium || ''}
                    onChange={(e) => handleOptionChange(index, 'premium', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-xl-bright-blue focus:border-xl-bright-blue"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {option.amount > 0 && option.premium > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Deductible Increase</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(option.amount - data.currentDeductible)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Premium Savings</p>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(calculateSavings(option.premium))}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Savings %</p>
                  <p className="font-semibold text-gray-900">
                    {data.renewalPremium > 0
                      ? `${((calculateSavings(option.premium) / data.renewalPremium) * 100).toFixed(1)}%`
                      : '—'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Tip: Deductible Increments</h3>
          <p className="text-sm text-blue-700">
            Common deductible increments are $25,000, $50,000, or $100,000. Typical ranges for mid-size groups
            are $225,000 to $500,000. The analyzer will calculate the additional claims liability at each level
            and show you the net savings after accounting for increased risk.
          </p>
        </div>

        {/* Summary Box */}
        {data.deductibleOptions.some(opt => opt.premium > 0) && (
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Options Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Current Setup</span>
                <span className="font-semibold">{formatCurrency(data.currentDeductible)} / {formatCurrency(data.renewalPremium)}</span>
              </div>
              {data.deductibleOptions.map((option, index) => {
                if (option.premium > 0) {
                  return (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {option.carrierName || `Option ${index + 1}`}
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(option.amount)} / {formatCurrency(option.premium)}
                      </span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
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