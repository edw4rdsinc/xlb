/**
 * Input Validation for Calculator APIs
 * Protects against malicious inputs and ensures data integrity
 */

import { z } from 'zod';

// Common validation schemas
const emailSchema = z.string().email().max(255);
const companyNameSchema = z.string().min(1).max(100);
const phoneSchema = z.string().regex(/^[\d\s\-\(\)\+]+$/).max(20).optional();

/**
 * FIE Calculator Input Validation
 */
export const fieCalculatorSchema = z.object({
  // Email capture (required)
  email: emailSchema,
  companyName: companyNameSchema.optional(),

  // Number of tiers (2, 3, or 4)
  numberOfTiers: z.number().int().min(2).max(4),

  // Plans array
  plans: z.array(z.object({
    name: z.string().min(1).max(50),
    differential: z.number().min(0.5).max(2.0),
    census: z.record(z.string(), z.number().int().min(0).max(10000)),
    currentRates: z.record(z.string(), z.number().min(0).max(10000))
  })).min(1).max(10), // Max 10 plans

  // Cost components
  costs: z.object({
    adminCostMode: z.enum(['simple', 'detailed']),
    adminPEPM: z.number().min(0).max(1000).optional(),
    detailedAdminCosts: z.object({
      tpaFees: z.number().min(0).max(100000),
      brokerage: z.number().min(0).max(100000),
      compliance: z.number().min(0).max(100000),
      telemedicine: z.number().min(0).max(100000),
      ppoFees: z.number().min(0).max(100000),
      other1: z.number().min(0).max(100000),
      other2: z.number().min(0).max(100000)
    }).optional(),
    specificDeductible: z.number().min(50000).max(500000),
    specificRates: z.record(z.string(), z.number().min(0).max(1000)),
    aggregateCorridor: z.number().min(1.2).max(1.3),
    aggregateRate: z.number().min(0).max(100),
    aggregateFactors: z.record(z.string(), z.number().min(0).max(100)),
    lasers: z.array(z.object({
      memberId: z.string().max(50),
      amount: z.number().min(50000).max(1000000),
      planIndex: z.number().int().min(0).max(9)
    })).max(20) // Max 20 lasers
  }),

  // CAPTCHA token
  captchaToken: z.string().optional()
});

/**
 * Deductible Analyzer Input Validation
 */
export const deductibleAnalyzerSchema = z.object({
  // Email capture
  email: emailSchema,

  // Basic info
  companyName: companyNameSchema,
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  medicalTrendRate: z.number().min(0).max(0.5), // Max 50% trend

  // Current setup
  currentDeductible: z.number().min(10000).max(1000000),
  renewalPremium: z.number().min(0).max(10000000),

  // Historical claims
  claimants: z.array(z.object({
    name: z.string().max(100),
    claims: z.object({
      year2022: z.number().min(0).max(10000000).optional(),
      year2023: z.number().min(0).max(10000000).optional(),
      year2024: z.number().min(0).max(10000000).optional(),
      year2025: z.number().min(0).max(10000000).optional()
    })
  })).max(35), // Max 35 claimants

  // Deductible options
  deductibleOptions: z.array(z.object({
    amount: z.number().min(10000).max(1000000),
    carrierName: z.string().max(100),
    premium: z.number().min(0).max(10000000)
  })).max(4), // Max 4 alternatives

  // CAPTCHA token
  captchaToken: z.string().optional()
});

/**
 * Self-Funding Assessment Input Validation
 */
export const assessmentSchema = z.object({
  // Email capture
  email: emailSchema,
  companyName: companyNameSchema.optional(),

  // Quiz answers
  answers: z.record(z.string(), z.union([
    z.string(),
    z.number(),
    z.boolean()
  ])),

  // CAPTCHA token
  captchaToken: z.string().optional()
});

/**
 * Validate and sanitize input
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.parse(input);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });
      return { success: false, errors };
    }
    return { success: false, errors: ['Invalid input format'] };
  }
}

/**
 * Additional security checks beyond schema validation
 */
export function performSecurityChecks(input: any): {
  passed: boolean;
  reason?: string;
} {
  // Check for SQL injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)/gi,
    /(--|\||;|\/\*|\*\/)/g,
    /(\bOR\b\s*\d+\s*=\s*\d+)/gi
  ];

  const inputString = JSON.stringify(input);
  for (const pattern of sqlPatterns) {
    if (pattern.test(inputString)) {
      console.warn('Potential SQL injection detected:', pattern);
      return { passed: false, reason: 'Invalid characters detected' };
    }
  }

  // Check for XSS patterns
  const xssPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(inputString)) {
      console.warn('Potential XSS detected:', pattern);
      return { passed: false, reason: 'Invalid HTML detected' };
    }
  }

  // Check for excessive data size (prevent DoS)
  if (inputString.length > 100000) { // 100KB max
    return { passed: false, reason: 'Request too large' };
  }

  // Check for deeply nested objects (prevent prototype pollution)
  function checkDepth(obj: any, maxDepth: number = 10, currentDepth: number = 0): boolean {
    if (currentDepth > maxDepth) return false;

    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (!checkDepth(obj[key], maxDepth, currentDepth + 1)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  if (!checkDepth(input)) {
    return { passed: false, reason: 'Data structure too complex' };
  }

  return { passed: true };
}

/**
 * Sanitize output before sending to client
 */
export function sanitizeOutput(data: any): any {
  // Remove any internal fields
  const cleaned = { ...data };
  delete cleaned._internal;
  delete cleaned.debug;
  delete cleaned.stackTrace;

  // Round numbers to reasonable precision
  function roundNumbers(obj: any): any {
    if (typeof obj === 'number') {
      return Math.round(obj * 100) / 100;
    }
    if (Array.isArray(obj)) {
      return obj.map(roundNumbers);
    }
    if (typeof obj === 'object' && obj !== null) {
      const result: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          result[key] = roundNumbers(obj[key]);
        }
      }
      return result;
    }
    return obj;
  }

  return roundNumbers(cleaned);
}