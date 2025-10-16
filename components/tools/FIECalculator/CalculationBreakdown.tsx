'use client';

import type { WizardData } from '../FIECalculator';
import type { CalculationResults } from '@/lib/fie-calculator/calculations';
import { getTierConfig } from '@/lib/fie-calculator/calculations';

interface CalculationBreakdownProps {
  wizardData: WizardData;
  results: CalculationResults;
}

export default function CalculationBreakdown({ wizardData, results }: CalculationBreakdownProps) {
  const tierConfig = getTierConfig(wizardData.numberOfTiers);
  const { plans, costs } = wizardData;

  // Recalculate step by step for display
  const totalEmployees = plans.reduce((sum: number, plan: any) => {
    return sum + tierConfig.reduce((planSum: number, tier: any) => {
      return planSum + (plan.census[tier.code] || 0);
    }, 0);
  }, 0);

  // Calculate admin costs breakdown
  let adminCostsTotal = 0;
  let adminCostsBreakdown = '';

  if (costs.adminCostMode === 'simple') {
    adminCostsTotal = (costs.adminPEPM || 0) * totalEmployees * 12;
    adminCostsBreakdown = `${costs.adminPEPM || 0} PEPM × ${totalEmployees} employees × 12 months = $${adminCostsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (costs.detailedAdminCosts) {
    const monthlyTotal =
      (costs.detailedAdminCosts.tpaFees || 0) +
      (costs.detailedAdminCosts.brokerage || 0) +
      (costs.detailedAdminCosts.compliance || 0) +
      (costs.detailedAdminCosts.telemedicine || 0) +
      (costs.detailedAdminCosts.ppoFees || 0) +
      (costs.detailedAdminCosts.other1 || 0) +
      (costs.detailedAdminCosts.other2 || 0);
    adminCostsTotal = monthlyTotal * totalEmployees * 12;
    adminCostsBreakdown = `${monthlyTotal} PEPM × ${totalEmployees} employees × 12 months = $${adminCostsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Calculate specific premium breakdown
  const specificPremiumDetails: Array<{ plan: string; tier: string; census: number; rate: number; annual: number }> = [];
  let specificPremiumTotal = 0;

  plans.forEach((plan: any) => {
    tierConfig.forEach((tier: any) => {
      const census = plan.census[tier.code] || 0;
      const rate = costs.specificRates[tier.code] || 0;
      const annual = rate * census * 12;
      if (census > 0) {
        specificPremiumDetails.push({
          plan: plan.name,
          tier: tier.label,
          census,
          rate,
          annual
        });
        specificPremiumTotal += annual;
      }
    });
  });

  // Calculate aggregate premium (Step 4A) - Simple calculation
  // Formula: Total Enrollment × Aggregate Rate PEPM × 12
  const aggregatePremiumTotal = totalEmployees * (costs.aggregateRate || 0) * 12;

  // Calculate aggregate attachment point (Step 4B) - Maximum claims threshold
  // Formula: Sum of (census × aggregate factor × 12) for each tier
  const aggregateAttachmentDetails: Array<{ plan: string; tier: string; census: number; factor: number; annual: number }> = [];
  let aggregateAttachmentTotal = 0;

  plans.forEach((plan: any) => {
    tierConfig.forEach((tier: any) => {
      const census = plan.census[tier.code] || 0;
      const factor = costs.aggregateFactors[tier.code] || 0;
      const annual = census * factor * 12;
      if (census > 0) {
        aggregateAttachmentDetails.push({
          plan: plan.name,
          tier: tier.label,
          census,
          factor,
          annual
        });
        aggregateAttachmentTotal += annual;
      }
    });
  });

  // Laser liability
  const laserLiability = costs.lasers.reduce((total: number, laser: any) => total + laser.amount, 0);

  // Total annual liability (including aggregate attachment point as maximum liability)
  const totalAnnualLiability = adminCostsTotal + specificPremiumTotal + aggregatePremiumTotal + aggregateAttachmentTotal + laserLiability;

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-xl-dark-blue">Calculation Breakdown</h2>
      <p className="text-gray-600">Step-by-step breakdown of how the FIE rates are calculated</p>

      {/* Step 1: Total Employees */}
      <div className="border-l-4 border-blue-500 pl-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 1: Total Employees</h3>
        <div className="bg-gray-50 p-3 rounded">
          <p className="font-mono text-sm">Total Employees: {totalEmployees}</p>
          <div className="mt-2 space-y-1">
            {plans.map((plan: any, idx: number) => (
              <div key={idx} className="text-sm text-gray-600">
                {plan.name}: {tierConfig.map((tier: any) => `${tier.label}: ${plan.census[tier.code] || 0}`).join(', ')}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step 2: Admin Costs */}
      <div className="border-l-4 border-green-500 pl-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 2: Annual Admin Costs</h3>
        <div className="bg-gray-50 p-3 rounded">
          <p className="font-mono text-sm mb-2">{adminCostsBreakdown}</p>
          {costs.adminCostMode === 'detailed' && costs.detailedAdminCosts && (
            <div className="mt-2 text-xs text-gray-600 space-y-1">
              <p>TPA Fees: ${costs.detailedAdminCosts.tpaFees || 0}</p>
              <p>Brokerage & Consulting: ${costs.detailedAdminCosts.brokerage || 0}</p>
              <p>Compliance/COBRA: ${costs.detailedAdminCosts.compliance || 0}</p>
              <p>Telemedicine: ${costs.detailedAdminCosts.telemedicine || 0}</p>
              <p>PPO Network Fees: ${costs.detailedAdminCosts.ppoFees || 0}</p>
              <p>Other 1: ${costs.detailedAdminCosts.other1 || 0}</p>
              <p>Other 2: ${costs.detailedAdminCosts.other2 || 0}</p>
            </div>
          )}
          <p className="font-bold mt-2">Total: ${adminCostsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Step 3: Specific Premium */}
      <div className="border-l-4 border-purple-500 pl-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 3: Annual Specific Stop-Loss Premium</h3>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600 mb-2">Formula: Rate × Census × 12 months</p>
          <div className="space-y-2 text-xs">
            {specificPremiumDetails.map((detail: any, idx: number) => (
              <div key={idx} className="font-mono">
                {detail.plan} - {detail.tier}: ${detail.rate} × {detail.census} × 12 = ${detail.annual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            ))}
          </div>
          <p className="font-bold mt-3">Total: ${specificPremiumTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Step 4A: Aggregate Premium */}
      <div className="border-l-4 border-orange-500 pl-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 4A: Annual Aggregate Stop-Loss Premium</h3>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600 mb-2">Formula: Total Enrollment × Aggregate Rate PEPM × 12 months</p>
          <div className="font-mono text-sm">
            {totalEmployees} employees × ${costs.aggregateRate?.toFixed(2)} PEPM × 12 months = ${aggregatePremiumTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="font-bold mt-3">Total Premium: ${aggregatePremiumTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Step 4B: Aggregate Attachment Point */}
      <div className="border-l-4 border-amber-500 pl-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 4B: Aggregate Attachment Point (Maximum Claims)</h3>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600 mb-2">Formula: Census × Aggregate Factor × 12 months (per tier)</p>
          <p className="text-sm text-gray-600 mb-3">This is the claims threshold where aggregate coverage begins</p>
          <div className="space-y-2 text-xs">
            {aggregateAttachmentDetails.map((detail: any, idx: number) => (
              <div key={idx} className="font-mono">
                {detail.plan} - {detail.tier}: {detail.census} × ${detail.factor.toFixed(2)} × 12 = ${detail.annual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            ))}
          </div>
          <p className="font-bold mt-3">Total Attachment Point: ${aggregateAttachmentTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Step 5: Laser Liability */}
      {laserLiability > 0 && (
        <div className="border-l-4 border-red-500 pl-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 5: Laser Liability</h3>
          <div className="bg-gray-50 p-3 rounded">
            <div className="space-y-1 text-sm">
              {costs.lasers.map((laser: any, idx: number) => (
                <p key={idx}>Member {laser.memberId}: ${laser.amount.toLocaleString()}</p>
              ))}
            </div>
            <p className="font-bold mt-2">Total: ${laserLiability.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Step 6: Total Annual Liability (Maximum Liability) */}
      <div className="border-l-4 border-xl-dark-blue pl-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 6: Total Annual Liability (Maximum Liability)</h3>
        <div className="bg-gray-50 p-3 rounded">
          <div className="space-y-1 text-sm font-mono">
            <p>Admin Costs: ${adminCostsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>Specific Premium: ${specificPremiumTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>Aggregate Premium: ${aggregatePremiumTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>Aggregate Attachment Point: ${aggregateAttachmentTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            {laserLiability > 0 && <p>Laser Liability: ${laserLiability.toLocaleString()}</p>}
            <div className="border-t border-gray-300 mt-2 pt-2">
              <p className="font-bold text-lg text-xl-dark-blue">
                MAXIMUM LIABILITY: ${totalAnnualLiability.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 7: Distribution to Plans */}
      <div className="border-l-4 border-teal-500 pl-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 7: Distribution to Plans (Using Tier Ratios & Differentials)</h3>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600 mb-3">
            Each plan gets a portion of the total liability based on its weight (census × tier ratios × plan differential)
          </p>

          {plans.map((plan: any, idx: number) => {
            const tierRatios = tierConfig.reduce((acc: any, tier: any) => {
              acc[tier.code] = tier.ratio;
              return acc;
            }, {} as Record<string, number>);

            let weight = 0;
            tierConfig.forEach((tier: any) => {
              const census = plan.census[tier.code] || 0;
              const ratio = tierRatios[tier.code] || 1.0;
              weight += census * ratio;
            });
            weight *= plan.differential;

            return (
              <div key={idx} className="mb-3 text-sm">
                <p className="font-semibold">{plan.name}</p>
                <div className="ml-4 mt-1 space-y-1 font-mono text-xs">
                  {tierConfig.map((tier: any) => {
                    const census = plan.census[tier.code] || 0;
                    const ratio = tierRatios[tier.code] || 1.0;
                    const units = census * ratio;
                    return (
                      <p key={tier.code}>
                        {tier.label}: {census} × {ratio} = {units.toFixed(2)} units
                      </p>
                    );
                  })}
                  <p className="text-gray-600">Subtotal units: {(weight / plan.differential).toFixed(2)}</p>
                  <p className="text-gray-600">× Plan Differential: {plan.differential.toFixed(2)}</p>
                  <p className="font-semibold">= {weight.toFixed(2)} weighted units</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 8: Calculate Monthly Rates */}
      <div className="border-l-4 border-pink-500 pl-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 8: Calculate Annual Allocation & Monthly FIE Rates per Tier</h3>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600 mb-3">
            <strong>Annual Allocation Formula:</strong> Total Annual Liability × (Plan Weight ÷ Total Weight)
          </p>
          <p className="text-sm text-gray-600 mb-3">
            <strong>Monthly Rate Formula:</strong> (Plan Allocation ÷ Plan Tier Units ÷ 12) × Tier Ratio
          </p>

          {results.planAllocations.map((planResult: any, idx: number) => {
            // Recalculate plan weight for display
            const tierRatios = tierConfig.reduce((acc: any, tier: any) => {
              acc[tier.code] = tier.ratio;
              return acc;
            }, {} as Record<string, number>);

            const plan = plans[idx];
            let planWeight = 0;
            let planTierUnits = 0;
            tierConfig.forEach((tier: any) => {
              const census = plan.census[tier.code] || 0;
              const ratio = tierRatios[tier.code] || 1.0;
              planTierUnits += census * ratio;
            });
            planWeight = planTierUnits * plan.differential;

            // Calculate total weight
            let totalWeight = 0;
            plans.forEach((p: any) => {
              let pWeight = 0;
              tierConfig.forEach((tier: any) => {
                const census = p.census[tier.code] || 0;
                const ratio = tierRatios[tier.code] || 1.0;
                pWeight += census * ratio;
              });
              totalWeight += pWeight * p.differential;
            });

            const weightPercentage = totalWeight > 0 ? (planWeight / totalWeight) * 100 : 0;

            return (
              <div key={idx} className="mb-4 border-b border-gray-200 pb-3 last:border-0">
                <p className="font-semibold text-base">{planResult.planName}</p>

                <div className="ml-4 mt-2 space-y-1 text-xs">
                  <p className="text-gray-600">
                    Plan Weight: {planWeight.toFixed(2)} units ({weightPercentage.toFixed(2)}% of total)
                  </p>
                  <p className="text-gray-600">
                    Calculation: ${totalAnnualLiability.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ({planWeight.toFixed(2)} ÷ {totalWeight.toFixed(2)})
                  </p>
                  <p className="font-semibold text-sm text-xl-dark-blue">
                    = Annual Allocation: ${planResult.allocation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="ml-4 mt-3">
                  <p className="text-xs text-gray-600 mb-2">Monthly FIE Rates:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(planResult.fieRates).map(([tierCode, rate]: [string, any]) => {
                      const tierLabel = tierConfig.find((t: any) => t.code === tierCode)?.label || tierCode;
                      return (
                        <div key={tierCode} className="font-mono">
                          {tierLabel}: ${rate.toFixed(2)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
