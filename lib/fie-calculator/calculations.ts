// FIE Calculator - Core Calculation Logic (V2 - Dynamic Tier Support)

// Tier configuration interface
export interface TierConfig {
  code: string;
  label: string;
  ratio: number;
  aggregateFactor: number;
}

// Tier configurations for 2, 3, and 4 tier systems
// aggregateFactor represents expected claims liability per member (in dollars)
export const TIER_CONFIGURATIONS: Record<number, TierConfig[]> = {
  2: [
    { code: 'EO', label: 'Employee Only', ratio: 1.00, aggregateFactor: 15 },
    { code: 'F', label: 'Family', ratio: 2.50, aggregateFactor: 35 }
  ],
  3: [
    { code: 'EO', label: 'Employee Only', ratio: 1.00, aggregateFactor: 15 },
    { code: 'E1', label: 'Employee + 1', ratio: 1.90, aggregateFactor: 28 },
    { code: 'F', label: 'Family (2+ deps)', ratio: 2.85, aggregateFactor: 40 }
  ],
  4: [
    { code: 'EO', label: 'Employee Only', ratio: 1.00, aggregateFactor: 15 },
    { code: 'ES', label: 'Employee + Spouse', ratio: 2.15, aggregateFactor: 32 },
    { code: 'EC', label: 'Employee + Child(ren)', ratio: 1.70, aggregateFactor: 25 },
    { code: 'F', label: 'Family', ratio: 2.85, aggregateFactor: 41 }
  ]
};

// Get tier configuration by number of tiers
export function getTierConfig(numberOfTiers: number): TierConfig[] {
  return TIER_CONFIGURATIONS[numberOfTiers] || TIER_CONFIGURATIONS[4];
}

// Get tier ratios as Record
export function getTierRatios(numberOfTiers: number): Record<string, number> {
  const config = getTierConfig(numberOfTiers);
  return config.reduce((acc, tier) => {
    acc[tier.code] = tier.ratio;
    return acc;
  }, {} as Record<string, number>);
}

// Get aggregate factors as Record
export function getAggregatFactors(numberOfTiers: number): Record<string, number> {
  const config = getTierConfig(numberOfTiers);
  return config.reduce((acc, tier) => {
    acc[tier.code] = tier.aggregateFactor;
    return acc;
  }, {} as Record<string, number>);
}

// Plan data interface with dynamic tier support
export interface PlanData {
  name: string;
  differential: number;
  census: Record<string, number>;
  currentRates: Record<string, number>;
  actuarialValue?: number; // Optional: for AV-based differential mode
}

// Admin cost modes
export type AdminCostMode = 'simple' | 'detailed';

export interface DetailedAdminCosts {
  tpaFees: number;
  brokerage: number;
  compliance: number;
  telemedicine: number;
  ppoFees: number;
  other1: number;
  other2: number;
}

// Cost components interface with dynamic tier support
export interface CostComponents {
  // Admin costs
  adminCostMode: AdminCostMode;
  adminPEPM?: number; // For simple mode
  detailedAdminCosts?: DetailedAdminCosts; // For detailed mode

  // Stop-loss costs
  specificDeductible: number;
  specificRates: Record<string, number>;
  aggregateCorridor: number;
  aggregateRate: number;
  aggregateFactors: Record<string, number>; // Per-tier aggregate factors

  // Lasers
  lasers: Array<{
    memberId: string;
    amount: number;
    planIndex: number;
  }>;
}

// Calculation results interface
export interface CalculationResults {
  totalAnnualLiability: number;
  adminCosts: number;
  specificPremium: number;
  aggregatePremium: number;
  laserLiability: number;
  planAllocations: Array<{
    planName: string;
    allocation: number;
    fieRates: Record<string, number>;
  }>;
  currentAnnualCost: number;
  fieAnnualCost: number;
  annualSavings: number;
  savingsPercentage: number;
  pepmBreakdown: {
    admin: number;
    specific: number;
    aggregate: number;
    aggregateAttachment: number;
    laser: number;
    total: number;
  };
}

// Calculate total employees across all plans
export function calculateTotalEmployees(plans: PlanData[], tierConfig: TierConfig[]): number {
  return plans.reduce((total, plan) => {
    return total + tierConfig.reduce((sum, tier) => {
      return sum + (plan.census[tier.code] || 0);
    }, 0);
  }, 0);
}

// Calculate total lives (including dependents)
export function calculateTotalLives(plans: PlanData[], tierConfig: TierConfig[]): number {
  // Life multipliers based on tier code
  const lifeMultipliers: Record<string, number> = {
    'EO': 1,
    'ES': 2,
    'EC': 2.5,
    'E1': 2,
    'F': 3.5
  };

  return plans.reduce((total, plan) => {
    return total + tierConfig.reduce((sum, tier) => {
      const census = plan.census[tier.code] || 0;
      const multiplier = lifeMultipliers[tier.code] || 1;
      return sum + (census * multiplier);
    }, 0);
  }, 0);
}

// Calculate admin costs based on mode
function calculateAdminCosts(costs: CostComponents, totalEmployees: number): number {
  if (costs.adminCostMode === 'simple') {
    return (costs.adminPEPM || 0) * totalEmployees * 12;
  } else if (costs.adminCostMode === 'detailed' && costs.detailedAdminCosts) {
    const monthlyTotal =
      costs.detailedAdminCosts.tpaFees +
      costs.detailedAdminCosts.brokerage +
      costs.detailedAdminCosts.compliance +
      costs.detailedAdminCosts.telemedicine +
      costs.detailedAdminCosts.ppoFees +
      costs.detailedAdminCosts.other1 +
      costs.detailedAdminCosts.other2;
    return monthlyTotal * totalEmployees * 12;
  }
  return 0;
}

// Main calculation function with dynamic tier support
export function calculateFIERates(
  plans: PlanData[],
  costs: CostComponents,
  numberOfTiers: number
): CalculationResults {
  const tierConfig = getTierConfig(numberOfTiers);
  const tierRatios = getTierRatios(numberOfTiers);
  const totalEmployees = calculateTotalEmployees(plans, tierConfig);
  const totalLives = calculateTotalLives(plans, tierConfig);

  // Step 1: Calculate Total Annual Liability
  const adminCosts = calculateAdminCosts(costs, totalEmployees);

  // Calculate stop-loss specific premium
  let specificPremium = 0;
  plans.forEach(plan => {
    tierConfig.forEach(tier => {
      const census = plan.census[tier.code] || 0;
      const rate = costs.specificRates[tier.code] || 0;
      specificPremium += rate * census * 12;
    });
  });

  // Calculate aggregate premium (Step 4A formula)
  // Formula: Total Enrollment × Aggregate Rate PEPM × 12
  const aggregatePremium = totalEmployees * costs.aggregateRate * 12;

  // Calculate aggregate attachment point (Step 4B formula)
  // Formula: Sum of (census × aggregate factor × 12) for each tier
  let aggregateAttachmentPoint = 0;
  plans.forEach(plan => {
    tierConfig.forEach(tier => {
      const census = plan.census[tier.code] || 0;
      const factor = costs.aggregateFactors[tier.code] || 0;
      aggregateAttachmentPoint += census * factor * 12;
    });
  });

  // Calculate laser liability
  const laserLiability = costs.lasers.reduce((total, laser) => total + laser.amount, 0);

  // Total annual liability (maximum liability including attachment point)
  const totalAnnualLiability = adminCosts + specificPremium + aggregatePremium + aggregateAttachmentPoint + laserLiability;

  // Step 2: Distribute to Plans
  const planWeights = plans.map((plan, index) => {
    let weight = 0;
    tierConfig.forEach(tier => {
      const census = plan.census[tier.code] || 0;
      const ratio = tierRatios[tier.code] || 1.0;
      weight += census * ratio;
    });
    weight *= plan.differential;

    return { planIndex: index, weight };
  });

  const totalWeight = planWeights.reduce((sum, pw) => sum + pw.weight, 0);

  // Step 3: Calculate rates by tier within each plan
  const planAllocations = plans.map((plan, index) => {
    const planWeight = planWeights[index].weight;
    const planAllocation = totalWeight > 0 ? totalAnnualLiability * (planWeight / totalWeight) : 0;

    // Calculate single equivalent rate for this plan
    let planTierUnits = 0;
    tierConfig.forEach(tier => {
      const census = plan.census[tier.code] || 0;
      const ratio = tierRatios[tier.code] || 1.0;
      planTierUnits += census * ratio;
    });

    const singleEquivalentRate = planTierUnits > 0 ? planAllocation / planTierUnits / 12 : 0;

    // Calculate FIE rates for each tier
    const fieRates: Record<string, number> = {};
    tierConfig.forEach(tier => {
      fieRates[tier.code] = singleEquivalentRate * (tierRatios[tier.code] || 1.0);
    });

    return {
      planName: plan.name,
      allocation: planAllocation,
      fieRates
    };
  });

  // Step 4: Calculate current annual cost
  const currentAnnualCost = plans.reduce((total, plan) => {
    let planTotal = 0;
    tierConfig.forEach(tier => {
      const census = plan.census[tier.code] || 0;
      const rate = plan.currentRates[tier.code] || 0;
      planTotal += rate * census * 12;
    });
    return total + planTotal;
  }, 0);

  // Calculate savings
  const fieAnnualCost = totalAnnualLiability;
  const annualSavings = currentAnnualCost - fieAnnualCost;
  const savingsPercentage = currentAnnualCost > 0 ? (annualSavings / currentAnnualCost) * 100 : 0;

  // Calculate PEPM breakdown
  const pepmBreakdown = {
    admin: totalEmployees > 0 ? adminCosts / totalEmployees / 12 : 0,
    specific: totalEmployees > 0 ? specificPremium / totalEmployees / 12 : 0,
    aggregate: totalEmployees > 0 ? aggregatePremium / totalEmployees / 12 : 0,
    aggregateAttachment: totalEmployees > 0 ? aggregateAttachmentPoint / totalEmployees / 12 : 0,
    laser: totalEmployees > 0 ? laserLiability / totalEmployees / 12 : 0,
    total: totalEmployees > 0 ? totalAnnualLiability / totalEmployees / 12 : 0
  };

  return {
    totalAnnualLiability,
    adminCosts,
    specificPremium,
    aggregatePremium,
    laserLiability,
    planAllocations,
    currentAnnualCost,
    fieAnnualCost,
    annualSavings,
    savingsPercentage,
    pepmBreakdown
  };
}

// Format currency with 2 decimal places
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Validate census data
export function validateCensus(plans: PlanData[], tierConfig: TierConfig[]): { isValid: boolean; error?: string } {
  const totalEmployees = calculateTotalEmployees(plans, tierConfig);

  if (totalEmployees < 10) {
    return { isValid: false, error: 'Minimum 10 total employees required' };
  }

  const hasNegativeValues = plans.some(plan =>
    tierConfig.some(tier => (plan.census[tier.code] || 0) < 0)
  );

  if (hasNegativeValues) {
    return { isValid: false, error: 'Census values cannot be negative' };
  }

  return { isValid: true };
}

// Validate rates
export function validateRates(plans: PlanData[], tierConfig: TierConfig[]): { isValid: boolean; error?: string } {
  const hasInvalidRates = plans.some(plan =>
    tierConfig.some(tier => (plan.currentRates[tier.code] || 0) <= 0)
  );

  if (hasInvalidRates) {
    return { isValid: false, error: 'All rates must be positive numbers' };
  }

  return { isValid: true };
}

// Validate cost components
export function validateCosts(costs: CostComponents, tierConfig: TierConfig[]): { isValid: boolean; error?: string } {
  // Validate admin costs
  if (costs.adminCostMode === 'simple' && (!costs.adminPEPM || costs.adminPEPM <= 0)) {
    return { isValid: false, error: 'Admin cost must be positive' };
  }

  if (costs.adminCostMode === 'detailed' && costs.detailedAdminCosts) {
    const hasNegative = Object.values(costs.detailedAdminCosts).some(v => v < 0);
    if (hasNegative) {
      return { isValid: false, error: 'All detailed admin costs must be non-negative' };
    }
  }

  if (costs.specificDeductible < 50000 || costs.specificDeductible > 500000) {
    return { isValid: false, error: 'Specific deductible must be between $50,000 and $500,000' };
  }

  if (costs.aggregateCorridor < 1.2 || costs.aggregateCorridor > 1.3) {
    return { isValid: false, error: 'Aggregate corridor must be between 120% and 130%' };
  }

  const hasInvalidSpecificRates = tierConfig.some(tier =>
    !costs.specificRates[tier.code] || costs.specificRates[tier.code] <= 0
  );

  if (hasInvalidSpecificRates) {
    return { isValid: false, error: 'All specific rates must be positive' };
  }

  // Validate lasers
  const hasInvalidLasers = costs.lasers.some(laser =>
    laser.amount <= costs.specificDeductible
  );

  if (hasInvalidLasers) {
    return { isValid: false, error: 'Laser amounts must exceed specific deductible' };
  }

  return { isValid: true };
}

// Calculate plan differential from rates (rate-based mode)
export function calculatePlanDifferential(
  planEORate: number,
  basePlanEORate: number
): number {
  if (!basePlanEORate || basePlanEORate === 0) return 1.0;
  if (!planEORate || planEORate === 0) return 1.0;
  return planEORate / basePlanEORate;
}

// Calculate plan differential from actuarial value (AV-based mode)
export function calculateAVDifferential(
  planAV: number,
  basePlanAV: number
): number {
  if (!basePlanAV || basePlanAV === 0) return 1.0;
  if (!planAV || planAV === 0) return 1.0;
  // Higher AV = lower member cost sharing = typically higher premium
  // Direct ratio approach
  return planAV / basePlanAV;
}
