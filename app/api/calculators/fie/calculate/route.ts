/**
 * FIE Calculator API Endpoint
 * Protected server-side calculation logic for Fully Insured Equivalent rates
 *
 * @route POST /api/calculators/fie/calculate
 * @rateLimit 5 requests per minute per IP
 * @security CAPTCHA verification (when enabled), input validation, output sanitization
 *
 * @example Request body:
 * ```json
 * {
 *   "plans": [
 *     {
 *       "name": "Plan A",
 *       "differential": 0,
 *       "census": { "tier1": 10, "tier2": 5 },
 *       "currentRates": { "tier1": 500, "tier2": 1000 }
 *     }
 *   ],
 *   "costs": {
 *     "adminCostMode": "perEmployee",
 *     "adminPEPM": 35,
 *     "specificDeductible": 100000,
 *     "specificRates": { "tier1": 50, "tier2": 100 },
 *     "aggregateCorridor": 1.25,
 *     "aggregateRate": 15,
 *     "aggregateFactors": { "tier1": 1.0, "tier2": 2.0 },
 *     "lasers": []
 *   },
 *   "numberOfTiers": 2,
 *   "email": "user@example.com",
 *   "companyName": "Example Corp"
 * }
 * ```
 *
 * @example Success Response (200):
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "totalAnnualLiability": 1500000,
 *     "currentAnnualCost": 1200000,
 *     "fieAnnualCost": 1100000,
 *     "annualSavings": 100000,
 *     "savingsPercentage": 8.33,
 *     "planAllocations": {...},
 *     "pepmBreakdown": {...},
 *     "costComponents": {...},
 *     "calculatedAt": "2024-01-15T12:00:00Z",
 *     "calculator": "fie",
 *     "version": "2.0"
 *   }
 * }
 * ```
 *
 * @example Error Response (400):
 * ```json
 * {
 *   "error": "Validation failed",
 *   "details": {
 *     "plans": ["At least one plan is required"]
 *   }
 * }
 * ```
 *
 * @example Rate Limit Response (429):
 * ```json
 * {
 *   "error": "Rate limit exceeded. Please wait 60 seconds."
 * }
 * ```
 */

import { createSecureHandler } from '@/lib/api/security/api-handler';
import { fieCalculatorSchema } from '@/lib/api/security/validation';
import { calculateFIERates } from '@/lib/fie-calculator/calculations';
import type { z } from 'zod';

// Type for validated input
type FIECalculatorInput = z.infer<typeof fieCalculatorSchema>;

/**
 * Business logic handler for FIE calculations
 * @param input - Validated input from the request
 * @returns Calculation results with sanitized output
 */
async function handleFIECalculation(input: FIECalculatorInput) {
  // Extract calculation parameters
  const { plans, costs, numberOfTiers } = input;

  // Perform the calculation (logic stays server-side)
  const results = calculateFIERates(plans, costs, numberOfTiers);

  // Return only what the frontend needs for display
  return {
    // Summary metrics
    totalAnnualLiability: results.totalAnnualLiability,
    currentAnnualCost: results.currentAnnualCost,
    fieAnnualCost: results.fieAnnualCost,
    annualSavings: results.annualSavings,
    savingsPercentage: results.savingsPercentage,

    // Plan-specific rates (for display)
    planAllocations: results.planAllocations,

    // PEPM breakdown (for display)
    pepmBreakdown: results.pepmBreakdown,

    // Component costs (for transparency)
    costComponents: {
      adminCosts: results.adminCosts,
      specificPremium: results.specificPremium,
      aggregatePremium: results.aggregatePremium,
      laserLiability: results.laserLiability
    },

    // Metadata
    calculatedAt: new Date().toISOString(),
    calculator: 'fie',
    version: '2.0'
  };
}

/**
 * POST /api/calculators/fie/calculate
 * Calculate FIE rates with full security
 */
export const POST = createSecureHandler({
  calculator: 'fie',
  schema: fieCalculatorSchema,
  rateLimit: {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 5         // Only 5 calculations per minute
  },
  requireCaptcha: false,  // TODO: Enable when reCAPTCHA keys are added
  handler: handleFIECalculation
});

/**
 * GET /api/calculators/fie/calculate
 * Return method not allowed
 */
export async function GET(request: Request): Promise<Response> {
  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'POST'
      }
    }
  );
}