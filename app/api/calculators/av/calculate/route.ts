import { NextRequest, NextResponse } from 'next/server';
import type { PlanInputs, AVCalculationResult } from '@/types/av-calculator';
import { getMetalTierFromAV, AV_TIER_RANGES } from '@/types/av-calculator';

/**
 * AV Calculator API Endpoint
 *
 * Calculates actuarial value using simplified methodology
 * In production, this would use the HHS AV Calculator methodology
 *
 * POST /api/calculators/av/calculate
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, brokerage, planInputs } = body;

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'User information is required' },
        { status: 400 }
      );
    }

    if (!planInputs) {
      return NextResponse.json(
        { error: 'Plan inputs are required' },
        { status: 400 }
      );
    }

    // Calculate AV using simplified methodology
    const result = calculateActuarialValue(planInputs);

    // Log the calculation (in production, save to database)
    console.log('AV Calculation:', {
      email,
      firstName,
      lastName,
      brokerage,
      planName: planInputs.planName,
      av: result.actuarialValue,
      metalTier: result.metalTier,
      timestamp: new Date().toISOString(),
    });

    // TODO: In production, implement:
    // 1. Save calculation to database
    // 2. Send email with results
    // 3. Generate PDF report
    // 4. Log to analytics

    return NextResponse.json(result);
  } catch (error) {
    console.error('AV Calculation Error:', error);
    return NextResponse.json(
      { error: 'Calculation failed. Please check your inputs and try again.' },
      { status: 500 }
    );
  }
}

/**
 * Simplified AV Calculation
 *
 * NOTE: This is a simplified calculation for demonstration purposes.
 * In production, implement the full HHS AV Calculator methodology which includes:
 * - Standard population claims distribution
 * - Detailed service category weighting
 * - De minimis variation allowances
 * - Actuarial certification requirements
 *
 * Reference: CMS AV Calculator Methodology
 * https://www.cms.gov/cciio/resources/regulations-and-guidance/index.html
 */
function calculateActuarialValue(planInputs: PlanInputs): AVCalculationResult {
  const {
    individualDeductible,
    individualMOOP,
    medicalCoinsurance,
    drugCoinsurance,
    primaryCareCopay,
    specialistCopay,
    erCopay,
    urgentCareCopay,
    inpatientCoinsurance,
    imagingCoinsurance,
    labCopay,
    genericCopay,
    preferredBrandCopay,
    hsaContribution = 0,
  } = planInputs;

  // Simplified AV calculation using weighted cost-sharing
  // This approximates the plan's generosity across major service categories

  // Define standard population utilization (simplified)
  const standardCosts = {
    primaryCare: 5000,      // Annual primary care costs
    specialty: 8000,         // Specialist visits
    emergency: 2000,         // ER visits
    inpatient: 15000,        // Hospital stays
    outpatient: 10000,       // Outpatient procedures
    imaging: 3000,           // Imaging services
    lab: 1500,               // Lab tests
    pharmacy: 6000,          // Prescription drugs
    preventive: 1000,        // Preventive care (ACA mandates 100% coverage)
  };

  const totalStandardCosts = Object.values(standardCosts).reduce((a, b) => a + b, 0);

  // Calculate enrollee cost-sharing for each category
  let totalEnrolleeCosts = 0;
  let deductibleRemaining = individualDeductible;

  // Helper function to apply deductible and coinsurance
  const calculateEnrolleeCost = (
    cost: number,
    copay: number,
    coinsurance: number,
    subjectToDeductible: boolean
  ): number => {
    if (copay > 0) {
      // Copay structure (simplified: assume average number of visits)
      return copay;
    }

    if (subjectToDeductible && deductibleRemaining > 0) {
      const deductiblePortion = Math.min(cost, deductibleRemaining);
      deductibleRemaining -= deductiblePortion;
      const remainingCost = cost - deductiblePortion;
      return deductiblePortion + (remainingCost * coinsurance);
    }

    return cost * coinsurance;
  };

  // Primary Care (average 4 visits/year)
  const primaryCareCost = calculateEnrolleeCost(
    standardCosts.primaryCare,
    primaryCareCopay * 4,
    medicalCoinsurance,
    planInputs.primaryCareSubjectToDeductible
  );
  totalEnrolleeCosts += primaryCareCost;

  // Specialty (average 3 visits/year)
  const specialtyCost = calculateEnrolleeCost(
    standardCosts.specialty,
    specialistCopay * 3,
    medicalCoinsurance,
    planInputs.specialistSubjectToDeductible
  );
  totalEnrolleeCosts += specialtyCost;

  // Emergency (average 0.5 visits/year)
  const emergencyCost = calculateEnrolleeCost(
    standardCosts.emergency,
    erCopay * 0.5,
    medicalCoinsurance,
    true
  );
  totalEnrolleeCosts += emergencyCost;

  // Inpatient (subject to deductible and coinsurance)
  const inpatientCost = standardCosts.inpatient * inpatientCoinsurance;
  totalEnrolleeCosts += inpatientCost;

  // Outpatient (subject to deductible and coinsurance)
  const outpatientCost = standardCosts.outpatient * medicalCoinsurance;
  totalEnrolleeCosts += outpatientCost;

  // Imaging (coinsurance)
  const imagingCost = standardCosts.imaging * imagingCoinsurance;
  totalEnrolleeCosts += imagingCost;

  // Lab (copay or free)
  const labCostEnrollee = labCopay > 0 ? labCopay * 3 : 0; // Average 3 lab tests/year
  totalEnrolleeCosts += labCostEnrollee;

  // Pharmacy (average utilization: 20 generic, 5 preferred brand, 2 non-preferred)
  const pharmacyCost =
    (genericCopay * 20) +
    (preferredBrandCopay * 5) +
    (planInputs.nonPreferredBrandCopay * 2);
  totalEnrolleeCosts += pharmacyCost;

  // Preventive is 100% covered (ACA requirement)
  // No enrollee cost

  // Apply MOOP cap (simplified)
  totalEnrolleeCosts = Math.min(totalEnrolleeCosts, individualMOOP);

  // Adjust for HSA contribution (reduces enrollee burden)
  totalEnrolleeCosts = Math.max(0, totalEnrolleeCosts - hsaContribution);

  // Calculate AV
  const actuarialValue = 1 - (totalEnrolleeCosts / totalStandardCosts);

  // Ensure AV is between 0 and 1
  const finalAV = Math.max(0, Math.min(1, actuarialValue));

  // Determine metal tier
  const metalTier = getMetalTierFromAV(finalAV);

  // Compliance checks
  const compliance = performComplianceChecks(planInputs, finalAV, metalTier);

  // Category breakdown (simplified)
  const categoryBreakdown = {
    primaryCare: 1 - (primaryCareCost / standardCosts.primaryCare),
    specialty: 1 - (specialtyCost / standardCosts.specialty),
    emergency: 1 - (emergencyCost / standardCosts.emergency),
    inpatient: 1 - (inpatientCost / standardCosts.inpatient),
    outpatient: 1 - (outpatientCost / standardCosts.outpatient),
    pharmacy: 1 - (pharmacyCost / standardCosts.pharmacy),
    preventive: 1.0, // ACA requires 100% coverage
  };

  return {
    actuarialValue: finalAV,
    metalTier,
    planPaysPercentage: finalAV,
    enrolleePaysPercentage: 1 - finalAV,
    tierRanges: AV_TIER_RANGES,
    categoryBreakdown,
    compliance,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Perform ACA compliance checks
 */
function performComplianceChecks(
  planInputs: PlanInputs,
  calculatedAV: number,
  metalTier: string
): {
  isACACompliant: boolean;
  issues?: string[];
  warnings?: string[];
} {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check MOOP limits (2025 limits)
  const MAX_INDIVIDUAL_MOOP = 9450;
  const MAX_FAMILY_MOOP = 18900;

  if (planInputs.individualMOOP > MAX_INDIVIDUAL_MOOP) {
    issues.push(`Individual MOOP exceeds 2025 limit of $${MAX_INDIVIDUAL_MOOP.toLocaleString()}`);
  }

  if (planInputs.familyMOOP > MAX_FAMILY_MOOP) {
    issues.push(`Family MOOP exceeds 2025 limit of $${MAX_FAMILY_MOOP.toLocaleString()}`);
  }

  // Check deductible reasonableness
  if (planInputs.individualDeductible > planInputs.individualMOOP) {
    issues.push('Individual deductible cannot exceed individual MOOP');
  }

  if (planInputs.familyDeductible > planInputs.familyMOOP) {
    issues.push('Family deductible cannot exceed family MOOP');
  }

  // Check family deductible structure
  if (planInputs.familyDeductible < planInputs.individualDeductible * 2) {
    warnings.push('Family deductible is less than 2x individual deductible - verify this is intentional');
  }

  // Check AV falls within metal tier range
  const tierRange = AV_TIER_RANGES[metalTier.toLowerCase() as keyof typeof AV_TIER_RANGES];
  if (tierRange && (calculatedAV < tierRange.min || calculatedAV > tierRange.max)) {
    warnings.push(`AV of ${(calculatedAV * 100).toFixed(2)}% is outside the standard ${metalTier} range`);
  }

  // Check for de minimis variation (±2% for most tiers)
  if (metalTier !== 'Unknown' && metalTier !== 'Catastrophic') {
    const expectedAV = (tierRange.min + tierRange.max) / 2;
    const variation = Math.abs(calculatedAV - expectedAV);
    if (variation > 0.02) {
      warnings.push(`AV varies by more than 2% from ${metalTier} tier target - may require actuarial certification`);
    }
  }

  return {
    isACACompliant: issues.length === 0,
    issues: issues.length > 0 ? issues : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}
