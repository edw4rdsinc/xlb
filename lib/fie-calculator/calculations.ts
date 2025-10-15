// FIE Calculator - Core Calculation Logic

export interface TierRatios {
  EO: number;
  ES: number;
  EC: number;
  F: number;
}

export interface PlanData {
  name: string;
  differential: number;
  census: {
    EO: number;
    ES: number;
    EC: number;
    F: number;
  };
  currentRates: {
    EO: number;
    ES: number;
    EC: number;
    F: number;
  };
}

export interface CostComponents {
  adminPEPM: number;
  specificDeductible: number;
  specificRates: {
    EO: number;
    ES: number;
    EC: number;
    F: number;
  };
  aggregateCorridor: number;
  aggregateRate: number;
  aggregateFactor: number;
  lasers: Array<{
    memberId: string;
    amount: number;
    planIndex: number;
  }>;
}

export interface CalculationResults {
  totalAnnualLiability: number;
  adminCosts: number;
  specificPremium: number;
  aggregatePremium: number;
  laserLiability: number;
  planAllocations: Array<{
    planName: string;
    allocation: number;
    fieRates: {
      EO: number;
      ES: number;
      EC: number;
      F: number;
    };
  }>;
  currentAnnualCost: number;
  fieAnnualCost: number;
  annualSavings: number;
  savingsPercentage: number;
  pepmBreakdown: {
    admin: number;
    specific: number;
    aggregate: number;
    laser: number;
    total: number;
  };
}

// Default tier ratios
export const DEFAULT_TIER_RATIOS: TierRatios = {
  EO: 1.00,
  ES: 2.15,
  EC: 1.70,
  F: 2.85
};

// Calculate total employees across all plans
export function calculateTotalEmployees(plans: PlanData[]): number {
  return plans.reduce((total, plan) => {
    return total + plan.census.EO + plan.census.ES + plan.census.EC + plan.census.F;
  }, 0);
}

// Calculate total lives (including dependents)
export function calculateTotalLives(plans: PlanData[]): number {
  return plans.reduce((total, plan) => {
    // EO = 1 life, ES = 2 lives, EC = 2.5 lives (avg), F = 3.5 lives (avg)
    return total +
      plan.census.EO * 1 +
      plan.census.ES * 2 +
      plan.census.EC * 2.5 +
      plan.census.F * 3.5;
  }, 0);
}

// Main calculation function
export function calculateFIERates(
  plans: PlanData[],
  costs: CostComponents,
  tierRatios: TierRatios = DEFAULT_TIER_RATIOS
): CalculationResults {
  const totalEmployees = calculateTotalEmployees(plans);
  const totalLives = calculateTotalLives(plans);

  // Step 1: Calculate Total Annual Liability
  const adminCosts = costs.adminPEPM * totalEmployees * 12;

  // Calculate stop-loss specific premium
  let specificPremium = 0;
  plans.forEach(plan => {
    specificPremium +=
      costs.specificRates.EO * plan.census.EO * 12 +
      costs.specificRates.ES * plan.census.ES * 12 +
      costs.specificRates.EC * plan.census.EC * 12 +
      costs.specificRates.F * plan.census.F * 12;
  });

  // Calculate aggregate premium
  const aggregatePremium = costs.aggregateRate * totalEmployees * costs.aggregateFactor * 12;

  // Calculate laser liability
  const laserLiability = costs.lasers.reduce((total, laser) => total + laser.amount, 0);

  // Total annual liability
  const totalAnnualLiability = adminCosts + specificPremium + aggregatePremium + laserLiability;

  // Step 2: Distribute to Plans
  const planWeights = plans.map((plan, index) => {
    const weight =
      (plan.census.EO * tierRatios.EO +
       plan.census.ES * tierRatios.ES +
       plan.census.EC * tierRatios.EC +
       plan.census.F * tierRatios.F) * plan.differential;

    return { planIndex: index, weight };
  });

  const totalWeight = planWeights.reduce((sum, pw) => sum + pw.weight, 0);

  // Step 3: Calculate rates by tier within each plan
  const planAllocations = plans.map((plan, index) => {
    const planWeight = planWeights[index].weight;
    const planAllocation = totalWeight > 0 ? totalAnnualLiability * (planWeight / totalWeight) : 0;

    // Calculate single equivalent rate for this plan
    const planTierUnits =
      plan.census.EO * tierRatios.EO +
      plan.census.ES * tierRatios.ES +
      plan.census.EC * tierRatios.EC +
      plan.census.F * tierRatios.F;

    const singleEquivalentRate = planTierUnits > 0 ? planAllocation / planTierUnits / 12 : 0;

    // Calculate FIE rates for each tier
    const fieRates = {
      EO: singleEquivalentRate * tierRatios.EO,
      ES: singleEquivalentRate * tierRatios.ES,
      EC: singleEquivalentRate * tierRatios.EC,
      F: singleEquivalentRate * tierRatios.F
    };

    return {
      planName: plan.name,
      allocation: planAllocation,
      fieRates
    };
  });

  // Step 4: Calculate current annual cost
  const currentAnnualCost = plans.reduce((total, plan) => {
    return total +
      plan.currentRates.EO * plan.census.EO * 12 +
      plan.currentRates.ES * plan.census.ES * 12 +
      plan.currentRates.EC * plan.census.EC * 12 +
      plan.currentRates.F * plan.census.F * 12;
  }, 0);

  // Calculate savings
  const fieAnnualCost = totalAnnualLiability;
  const annualSavings = currentAnnualCost - fieAnnualCost;
  const savingsPercentage = currentAnnualCost > 0 ? (annualSavings / currentAnnualCost) * 100 : 0;

  // Calculate PEPM breakdown
  const pepmBreakdown = {
    admin: costs.adminPEPM,
    specific: specificPremium / totalEmployees / 12,
    aggregate: costs.aggregateRate * costs.aggregateFactor,
    laser: laserLiability / totalEmployees / 12,
    total: totalAnnualLiability / totalEmployees / 12
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

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Validate census data
export function validateCensus(plans: PlanData[]): { isValid: boolean; error?: string } {
  const totalEmployees = calculateTotalEmployees(plans);

  if (totalEmployees < 10) {
    return { isValid: false, error: 'Minimum 10 total employees required' };
  }

  const hasNegativeValues = plans.some(plan =>
    plan.census.EO < 0 || plan.census.ES < 0 ||
    plan.census.EC < 0 || plan.census.F < 0
  );

  if (hasNegativeValues) {
    return { isValid: false, error: 'Census values cannot be negative' };
  }

  return { isValid: true };
}

// Validate rates
export function validateRates(plans: PlanData[]): { isValid: boolean; error?: string } {
  const hasInvalidRates = plans.some(plan =>
    plan.currentRates.EO <= 0 || plan.currentRates.ES <= 0 ||
    plan.currentRates.EC <= 0 || plan.currentRates.F <= 0
  );

  if (hasInvalidRates) {
    return { isValid: false, error: 'All rates must be positive numbers' };
  }

  return { isValid: true };
}

// Validate cost components
export function validateCosts(costs: CostComponents): { isValid: boolean; error?: string } {
  if (costs.adminPEPM <= 0) {
    return { isValid: false, error: 'Admin cost must be positive' };
  }

  if (costs.specificDeductible < 50000 || costs.specificDeductible > 500000) {
    return { isValid: false, error: 'Specific deductible must be between $50,000 and $500,000' };
  }

  if (costs.aggregateCorridor < 1.2 || costs.aggregateCorridor > 1.3) {
    return { isValid: false, error: 'Aggregate corridor must be between 120% and 130%' };
  }

  const hasInvalidSpecificRates =
    costs.specificRates.EO <= 0 || costs.specificRates.ES <= 0 ||
    costs.specificRates.EC <= 0 || costs.specificRates.F <= 0;

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