import FeaturedExpertRotator from '@/components/shared/FeaturedExpertRotator'

export default function TestRotationPage() {
  // State assignments for reference
  const stateAssignments = {
    'Steve Caler (CA-based)': {
      region: 'Southwest/South Region',
      states: ['CA', 'NV', 'AZ', 'TX', 'OK', 'AR', 'LA', 'MS', 'AL', 'KY', 'TN']
    },
    'Sam (OR-based)': {
      region: 'Mountain/Plains/Midwest Region',
      states: ['OR', 'WA', 'ID', 'MT', 'WY', 'CO', 'UT', 'NM', 'ND', 'SD', 'NE', 'KS', 'MN', 'WI', 'IA', 'MO', 'IL', 'IN', 'MI', 'OH', 'AK', 'HI']
    },
    'Jennifer Baird (NC-based)': {
      region: 'Eastern Seaboard Region',
      states: ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'DE', 'MD', 'DC', 'VA', 'NC', 'SC', 'GA', 'FL', 'WV']
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-4">Geographic Sales Territory Test</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>The system detects your location from your IP address</li>
            <li>Based on your state, it assigns the appropriate regional sales consultant</li>
            <li>Visitors from unassigned territories see Daron Pitts (President & Founder)</li>
            <li>The same specialist appears consistently across all calculator pages</li>
          </ol>
        </div>

        {/* Live detection based on visitor's actual IP */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-center">Your Assigned Regional Specialist</h2>
          <p className="text-center mb-6 text-gray-600">
            Based on your detected location, you'll be connected with:
          </p>
          <FeaturedExpertRotator />
        </div>

        {/* State assignments table */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h2 className="text-xl font-semibold mb-4">Territory Assignments</h2>
          <div className="space-y-6">
            {Object.entries(stateAssignments).map(([name, data]) => (
              <div key={name} className="border-b pb-4 last:border-0">
                <h3 className="font-semibold text-lg mb-2">{name}</h3>
                <p className="text-sm text-gray-600 mb-2">{data.region}</p>
                <div className="flex flex-wrap gap-2">
                  {data.states.map(state => (
                    <span key={state} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {state}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test specific states */}
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-center mb-6">Test Specific State Assignments</h2>

          <div>
            <p className="text-center text-sm text-gray-500 mb-2">California (CA) - Should show Steve Caler</p>
            <FeaturedExpertRotator forceState="CA" />
          </div>

          <div>
            <p className="text-center text-sm text-gray-500 mb-2">Texas (TX) - Should show Steve Caler</p>
            <FeaturedExpertRotator forceState="TX" />
          </div>

          <div>
            <p className="text-center text-sm text-gray-500 mb-2">Colorado (CO) - Should show Sam</p>
            <FeaturedExpertRotator forceState="CO" />
          </div>

          <div>
            <p className="text-center text-sm text-gray-500 mb-2">Illinois (IL) - Should show Sam</p>
            <FeaturedExpertRotator forceState="IL" />
          </div>

          <div>
            <p className="text-center text-sm text-gray-500 mb-2">New York (NY) - Should show Jennifer Baird</p>
            <FeaturedExpertRotator forceState="NY" />
          </div>

          <div>
            <p className="text-center text-sm text-gray-500 mb-2">Florida (FL) - Should show Jennifer Baird</p>
            <FeaturedExpertRotator forceState="FL" />
          </div>

          <div>
            <p className="text-center text-sm text-gray-500 mb-2">International/Unknown - Should show Daron Pitts</p>
            <FeaturedExpertRotator forceState={null as any} />
          </div>
        </div>

        {/* Note about API usage */}
        <div className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This uses free IP geolocation APIs (ipapi.co and ip-api.com).
            For production, consider using a paid service for better reliability and accuracy.
          </p>
        </div>
      </div>
    </div>
  )
}