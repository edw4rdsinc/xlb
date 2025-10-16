// Type definitions for the ISL Deductible Analyzer

export interface ClaimantData {
  name: string;
  claims: {
    year2022?: number;
    year2023?: number;
    year2024?: number;
    year2025?: number;
  };
}

export interface DeductibleOption {
  amount: number;
  carrierName: string;
  premium: number;
}

export interface AnalyzerInputs {
  // Basic Info
  companyName: string;
  effectiveDate: string;
  medicalTrendRate: number; // as decimal (0.07 for 7%)

  // Current Deductible
  currentDeductible: number;
  renewalPremium: number;

  // Historical Claims (up to 35 claimants)
  claimants: ClaimantData[];

  // Deductible Options (up to 4 alternatives)
  deductibleOptions: DeductibleOption[];
}

export interface ClaimsAnalysisRow {
  deductibleAmount: number;
  claims2022: number;
  claims2023: number;
  claims2024: number;
  claims2025: number;
  averageISLClaims: number;
  additionalClaims: number;
  estimatedClaimantsAffected: number;
}

export interface PremiumComparisonRow {
  carrierName: string;
  deductibleAmount: number;
  premiumQuote: number;
  premiumSavings: number;
  additionalClaims: number;
  netProjectedSavings: number;
}

export interface AnalyzerResults {
  // Claims Analysis Section
  claimsAnalysis: ClaimsAnalysisRow[];

  // Premium Comparison Section
  premiumComparison: PremiumComparisonRow[];

  // Recommendation
  recommendation: {
    text: string;
    optimalDeductible: number;
    netSavings: number;
  };

  // Raw Excel data for download
  excelBuffer?: ArrayBuffer;
}

export interface WizardData {
  // Step 1: Basic Information
  companyName: string;
  effectiveDate: string;
  medicalTrendRate: number;

  // Step 2: Current Setup
  currentDeductible: number;
  renewalPremium: number;

  // Step 3: Historical Claims
  claimants: ClaimantData[];

  // Step 4: Deductible Options
  deductibleOptions: DeductibleOption[];

  // Step 5: Review & Calculate

  // Results
  results?: AnalyzerResults;
}