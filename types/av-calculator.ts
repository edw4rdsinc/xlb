// Type definitions for the Actuarial Value Calculator

export type MetalTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Catastrophic' | 'Unknown';

export type DeductibleType = 'integrated' | 'separate';

export interface ServiceCopay {
  name: string;
  amount: number;
  subjectToDeductible: boolean;
}

export interface DrugTierCopay {
  tier: 'generic' | 'preferred_brand' | 'non_preferred_brand' | 'specialty';
  copay: number;
  subjectToDeductible: boolean;
}

export interface PlanInputs {
  // Plan Basics
  planName?: string;
  metalTierHint?: MetalTier;

  // Deductibles & MOOP
  individualDeductible: number;
  familyDeductible: number;
  individualMOOP: number;
  familyMOOP: number;
  deductibleType: DeductibleType;

  // Coinsurance
  medicalCoinsurance: number; // as decimal (0.20 for 20%)
  drugCoinsurance: number; // as decimal (0.20 for 20%)

  // Office Visits
  primaryCareCopay: number;
  primaryCareSubjectToDeductible: boolean;
  specialistCopay: number;
  specialistSubjectToDeductible: boolean;

  // Emergency & Hospital
  erCopay: number;
  urgentCareCopay: number;
  inpatientCoinsurance: number; // as decimal

  // Imaging & Tests
  imagingCoinsurance: number; // as decimal
  labCopay: number;
  xrayCoinsurance: number; // as decimal

  // Prescription Drugs
  genericCopay: number;
  genericSubjectToDeductible: boolean;
  preferredBrandCopay: number;
  preferredBrandSubjectToDeductible: boolean;
  nonPreferredBrandCopay: number;
  nonPreferredBrandSubjectToDeductible: boolean;
  specialtyCopay: number;
  specialtySubjectToDeductible: boolean;

  // Advanced (Optional)
  hsaContribution?: number;
  multiTierNetwork?: boolean;
  additionalServices?: ServiceCopay[];
}

export interface AVCalculationResult {
  // Primary result
  actuarialValue: number; // as decimal (0.7227 for 72.27%)
  metalTier: MetalTier;

  // Breakdown
  planPaysPercentage: number;
  enrolleePaysPercentage: number;

  // Metal tier thresholds
  tierRanges: {
    catastrophic: { min: number; max: number };
    bronze: { min: number; max: number };
    silver: { min: number; max: number };
    gold: { min: number; max: number };
    platinum: { min: number; max: number };
  };

  // Detailed breakdown by category
  categoryBreakdown?: {
    primaryCare: number;
    specialty: number;
    emergency: number;
    inpatient: number;
    outpatient: number;
    pharmacy: number;
    preventive: number;
  };

  // Compliance check
  compliance: {
    isACACompliant: boolean;
    issues?: string[];
    warnings?: string[];
  };

  // Timestamp
  calculatedAt: string;
}

export interface AVCalculatorFormData {
  email: string;
  firstName: string;
  lastName: string;
  brokerage?: string;
  planInputs: PlanInputs;
}

export interface WizardData extends PlanInputs {
  // User info for results delivery
  email?: string;
  firstName?: string;
  lastName?: string;
  brokerage?: string;

  // Results
  results?: AVCalculationResult;
}

// Form validation errors
export interface AVFormErrors {
  [key: string]: string;
}

// Metal tier color mappings
export const METAL_TIER_COLORS: Record<MetalTier, string> = {
  Bronze: '#CD7F32',
  Silver: '#C0C0C0',
  Gold: '#FFD700',
  Platinum: '#E5E4E2',
  Catastrophic: '#8B4513',
  Unknown: '#9CA3AF',
};

// AV tier ranges (ACA standard)
export const AV_TIER_RANGES = {
  catastrophic: { min: 0, max: 0.60 },
  bronze: { min: 0.58, max: 0.62 },
  silver: { min: 0.68, max: 0.72 },
  gold: { min: 0.78, max: 0.82 },
  platinum: { min: 0.88, max: 0.92 },
};

// Helper function to determine metal tier from AV
export function getMetalTierFromAV(av: number): MetalTier {
  if (av >= AV_TIER_RANGES.platinum.min && av <= AV_TIER_RANGES.platinum.max) {
    return 'Platinum';
  }
  if (av >= AV_TIER_RANGES.gold.min && av <= AV_TIER_RANGES.gold.max) {
    return 'Gold';
  }
  if (av >= AV_TIER_RANGES.silver.min && av <= AV_TIER_RANGES.silver.max) {
    return 'Silver';
  }
  if (av >= AV_TIER_RANGES.bronze.min && av <= AV_TIER_RANGES.bronze.max) {
    return 'Bronze';
  }
  if (av < AV_TIER_RANGES.bronze.min) {
    return 'Catastrophic';
  }
  return 'Unknown';
}

// Helper function to format AV percentage
export function formatAVPercentage(av: number): string {
  return `${(av * 100).toFixed(2)}%`;
}

// Helper function to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
