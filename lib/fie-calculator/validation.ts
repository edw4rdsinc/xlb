// FIE Calculator - Validation Utilities

import { z } from 'zod';

// Email validation schema
export const emailSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name is required'),
  phone: z.string().optional(),
});

// Group setup validation
export const groupSetupSchema = z.object({
  groupName: z.string().min(2, 'Group name is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  currentFundingType: z.enum(['Fully-Insured', 'Self-Funded']),
  numberOfPlans: z.number().min(1).max(8),
  numberOfTiers: z.number().min(2).max(4),
  planNames: z.array(z.string().min(1, 'Plan name is required')),
});

// Census validation
export const censusSchema = z.object({
  plans: z.array(z.object({
    name: z.string(),
    census: z.object({
      EO: z.number().min(0),
      ES: z.number().min(0),
      EC: z.number().min(0),
      F: z.number().min(0),
    }),
  })),
}).refine((data) => {
  const total = data.plans.reduce((sum, plan) => {
    return sum + plan.census.EO + plan.census.ES + plan.census.EC + plan.census.F;
  }, 0);
  return total >= 10;
}, {
  message: 'Minimum 10 total employees required across all plans',
});

// Rates validation
export const ratesSchema = z.object({
  plans: z.array(z.object({
    name: z.string(),
    currentRates: z.object({
      EO: z.number().positive('Rate must be positive'),
      ES: z.number().positive('Rate must be positive'),
      EC: z.number().positive('Rate must be positive'),
      F: z.number().positive('Rate must be positive'),
    }),
  })),
});

// Cost components validation
export const costComponentsSchema = z.object({
  adminPEPM: z.number().positive('Admin cost must be positive'),
  specificDeductible: z.number().min(50000).max(500000),
  specificRates: z.object({
    EO: z.number().positive('Rate must be positive'),
    ES: z.number().positive('Rate must be positive'),
    EC: z.number().positive('Rate must be positive'),
    F: z.number().positive('Rate must be positive'),
  }),
  aggregateCorridor: z.number().min(1.2).max(1.3),
  aggregateRate: z.number().positive('Rate must be positive'),
  aggregateFactor: z.number().positive('Factor must be positive'),
  lasers: z.array(z.object({
    memberId: z.string().min(1, 'Member ID is required'),
    amount: z.number().positive('Amount must be positive'),
    planIndex: z.number().min(0),
  })),
});

// Format number with commas
export function formatNumber(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

// Parse formatted number
export function parseFormattedNumber(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Format phone number
export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return value;
}

// Session storage helpers
export const SESSION_KEY = 'fie-calculator-session';

export function saveToSession(data: any): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  }
}

export function getFromSession(): any | null {
  if (typeof window !== 'undefined') {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

// Debounce function for input handling
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}