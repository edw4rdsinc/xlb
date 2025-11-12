/**
 * Common type definitions used across the application
 */

// FIE Calculator Types
export interface FIEWizardData {
  // Step 1: Group Setup
  groupName: string;
  effectiveDate: string;
  currentFundingType: 'Fully-Insured' | 'Self-Funded';
  numberOfPlans: number;
  numberOfTiers: number;
  planNames: string[];

  // Step 2: Census
  plans: PlanData[];

  // Step 3: Costs
  costs: CostData;

  // Step 4: Contact Info
  contactInfo?: ContactInfo;

  // Results (from API)
  results?: CalculationResults;
}

export interface PlanData {
  name: string;
  census: {
    EO: number;
    ES: number;
    EC: number;
    F: number;
  };
  currentRates?: {
    EO: number;
    ES: number;
    EC: number;
    F: number;
  };
}

export interface CostData {
  adminCostMode: 'simple' | 'detailed';
  adminPEPM?: number;
  adminCosts?: DetailedAdminCosts;
  stopLossPremium: number;
  expectedClaims: number;
  specificDeductible: number;
  aggregateDeductible: number;
  aggregateCorridor: number;
  claimsMargin: number;
  tpaFees?: number;
  consultingFees?: number;
  otherFees?: number;
  networkAccessFees?: number;
  careManagementFees?: number;
}

export interface DetailedAdminCosts {
  tpaFees: number;
  consultingFees: number;
  otherFees: number;
  networkAccessFees?: number;
  careManagementFees?: number;
}

export interface ContactInfo {
  name: string;
  email: string;
  company: string;
  phone?: string;
}

export interface CalculationResults {
  totalFIERate: number;
  adminRate: number;
  stopLossRate: number;
  expectedClaimsRate: number;
  claimsMarginRate: number;
  breakdown: any;
}

// Security Types
export interface SecurityCheckResult {
  isValid: boolean;
  issues: string[];
  sanitized?: any;
}

export interface AuditLogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  action: string;
  userId?: string;
  data?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

// Generic JSON type for better type safety than 'any'
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[];

export interface JSONObject {
  [key: string]: JSONValue;
}