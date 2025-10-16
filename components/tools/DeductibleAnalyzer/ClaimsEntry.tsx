import { useState } from 'react';
import type { WizardData, ClaimantData } from '@/lib/deductible-analyzer/types';

interface ClaimsEntryProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
}

export default function ClaimsEntry({ data, updateData, onNext, onBack, errors }: ClaimsEntryProps) {
  const [activeTab, setActiveTab] = useState('manual');
  const [csvError, setCsvError] = useState('');

  // Initialize claimants if empty
  if (data.claimants.length === 0) {
    const initialClaimants: ClaimantData[] = Array(5).fill(null).map((_, i) => ({
      name: `Claimant ${i + 1}`,
      claims: {
        year2022: undefined,
        year2023: undefined,
        year2024: undefined,
        year2025: undefined,
      },
    }));
    updateData({ claimants: initialClaimants });
  }

  const handleClaimantChange = (index: number, field: keyof ClaimantData | string, value: any) => {
    const newClaimants = [...data.claimants];
    if (field === 'name') {
      newClaimants[index].name = value;
    } else if (field.startsWith('year')) {
      const year = field as keyof ClaimantData['claims'];
      newClaimants[index].claims[year] = value ? parseFloat(value) : undefined;
    }
    updateData({ claimants: newClaimants });
  };

  const addClaimant = () => {
    if (data.claimants.length < 35) {
      const newClaimants = [...data.claimants];
      newClaimants.push({
        name: `Claimant ${data.claimants.length + 1}`,
        claims: {
          year2022: undefined,
          year2023: undefined,
          year2024: undefined,
          year2025: undefined,
        },
      });
      updateData({ claimants: newClaimants });
    }
  };

  const removeClaimant = (index: number) => {
    const newClaimants = data.claimants.filter((_, i) => i !== index);
    updateData({ claimants: newClaimants });
  };

  const handlePasteData = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    try {
      const lines = pastedText.trim().split('\n');
      const newClaimants: ClaimantData[] = [];

      lines.forEach((line, index) => {
        if (index >= 35) return; // Max 35 claimants

        const values = line.split('\t'); // Tab-separated values
        const claimant: ClaimantData = {
          name: values[0] || `Claimant ${index + 1}`,
          claims: {
            year2022: values[1] ? parseFloat(values[1].replace(/[$,]/g, '')) : undefined,
            year2023: values[2] ? parseFloat(values[2].replace(/[$,]/g, '')) : undefined,
            year2024: values[3] ? parseFloat(values[3].replace(/[$,]/g, '')) : undefined,
            year2025: values[4] ? parseFloat(values[4].replace(/[$,]/g, '')) : undefined,
          },
        };
        newClaimants.push(claimant);
      });

      updateData({ claimants: newClaimants });
      setCsvError('');
    } catch (error) {
      setCsvError('Invalid paste format. Please paste from Excel with columns: Name, 2022, 2023, 2024, 2025');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const totalsByYear = {
    year2022: data.claimants.reduce((sum, c) => sum + (c.claims.year2022 || 0), 0),
    year2023: data.claimants.reduce((sum, c) => sum + (c.claims.year2023 || 0), 0),
    year2024: data.claimants.reduce((sum, c) => sum + (c.claims.year2024 || 0), 0),
    year2025: data.claimants.reduce((sum, c) => sum + (c.claims.year2025 || 0), 0),
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-xl-dark-blue mb-6">Historical Claims Data</h2>
      <p className="text-gray-600 mb-8">
        Enter high-cost claimant data for the past 4 years. Include claims that exceeded or came close to your specific deductible.
      </p>

      {/* Data Entry Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'manual'
                  ? 'border-xl-bright-blue text-xl-bright-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manual Entry
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'paste'
                  ? 'border-xl-bright-blue text-xl-bright-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Paste from Excel
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'manual' ? (
        <div>
          {/* Claims Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Claimant Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    2022 Claims
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    2023 Claims
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    2024 Claims
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    2025 Claims
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.claimants.map((claimant, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={claimant.name}
                        onChange={(e) => handleClaimantChange(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Claimant name"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={claimant.claims.year2022 || ''}
                        onChange={(e) => handleClaimantChange(index, 'year2022', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="0"
                        min="0"
                        step="1000"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={claimant.claims.year2023 || ''}
                        onChange={(e) => handleClaimantChange(index, 'year2023', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="0"
                        min="0"
                        step="1000"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={claimant.claims.year2024 || ''}
                        onChange={(e) => handleClaimantChange(index, 'year2024', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="0"
                        min="0"
                        step="1000"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={claimant.claims.year2025 || ''}
                        onChange={(e) => handleClaimantChange(index, 'year2025', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="0"
                        min="0"
                        step="1000"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => removeClaimant(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr className="font-semibold">
                  <td className="px-3 py-2">Total</td>
                  <td className="px-3 py-2">{formatCurrency(totalsByYear.year2022)}</td>
                  <td className="px-3 py-2">{formatCurrency(totalsByYear.year2023)}</td>
                  <td className="px-3 py-2">{formatCurrency(totalsByYear.year2024)}</td>
                  <td className="px-3 py-2">{formatCurrency(totalsByYear.year2025)}</td>
                  <td className="px-3 py-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {data.claimants.length < 35 && (
            <button
              type="button"
              onClick={addClaimant}
              className="mt-4 text-xl-bright-blue hover:text-xl-dark-blue font-semibold"
            >
              + Add Claimant
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Paste Instructions:</h3>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Copy data from Excel with columns: Claimant Name, 2022, 2023, 2024, 2025</li>
              <li>Click in the text area below and paste (Ctrl+V or Cmd+V)</li>
              <li>Data will be automatically parsed and loaded</li>
            </ol>
          </div>

          <textarea
            className="w-full h-64 px-4 py-2 border border-gray-300 rounded-md font-mono text-sm"
            placeholder="Paste your Excel data here..."
            onPaste={handlePasteData}
          />

          {csvError && (
            <p className="mt-2 text-red-600 text-sm">{csvError}</p>
          )}

          {data.claimants.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                Successfully loaded {data.claimants.length} claimants
              </p>
            </div>
          )}
        </div>
      )}

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