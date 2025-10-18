/**
 * FIE Calculator API Endpoint
 * Protected server-side calculation logic
 */

import { createSecureHandler } from '@/lib/api/security/api-handler';
import { fieCalculatorSchema } from '@/lib/api/security/validation';
import { calculateFIERates } from '@/lib/fie-calculator/calculations';
import type { z } from 'zod';

// Type for validated input
type FIECalculatorInput = z.infer<typeof fieCalculatorSchema>;

/**
 * Business logic handler for FIE calculations
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