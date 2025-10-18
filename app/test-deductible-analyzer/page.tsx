'use client';

export default function TestDeductibleAnalyzer() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Deductible Analyzer Input Test</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Tab Navigation</h2>
        <p className="text-gray-600 mb-4">
          Press Tab to navigate through the inputs. Tab should move DOWN the columns, not across rows.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">2022</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">2023</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">2024</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3].map((row) => (
                <tr key={row}>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder={`Name ${row}`}
                      tabIndex={row}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="0.00"
                      tabIndex={3 + row}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="0.00"
                      tabIndex={6 + row}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="0.00"
                      tabIndex={9 + row}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">
            <strong>Tab Order:</strong> Name 1 → Name 2 → Name 3 → 2022 Col 1 → 2022 Col 2 → 2022 Col 3 → 2023 Col 1 → etc.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Test Decimal Input</h2>
        <p className="text-gray-600 mb-4">
          All number fields should accept decimal values with up to 2 decimal places. No toggle/spinner buttons should appear.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Amount (allows 2 decimals)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                inputMode="decimal"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md"
                placeholder="12345.67"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Percentage (allows 2 decimals)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="7.25"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded">
          <p className="text-sm text-green-800">
            <strong>Expected Behavior:</strong>
            <br />• No up/down arrow buttons (spinners)
            <br />• Can type any number with up to 2 decimal places
            <br />• Mobile devices show decimal keyboard
          </p>
        </div>
      </div>
    </div>
  );
}