/**
 * Deductible Analyzer API Endpoint
 * Protected server-side calculation logic for optimizing insurance deductibles
 *
 * @route POST /api/calculators/deductible/calculate
 * @rateLimit 10 requests per minute per IP
 * @security CAPTCHA verification (when enabled), input validation, output sanitization
 *
 * @example Request body:
 * ```json
 * {
 *   "companyName": "Example Corp",
 *   "effectiveDate": "2024-01-01",
 *   "numberOfEmployees": 150,
 *   "currentDeductible": 5000,
 *   "deductibleOptions": [2500, 5000, 7500, 10000],
 *   "medicalTrendRate": 7.5,
 *   "claimsHistory": [
 *     {
 *       "year": 2023,
 *       "totalClaims": 450000,
 *       "largeClaims": 3,
 *       "maxClaim": 75000
 *     }
 *   ],
 *   "email": "user@example.com"
 * }
 * ```
 *
 * @example Success Response (200):
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "recommendations": [
 *       {
 *         "deductible": 7500,
 *         "expectedSavings": 25000,
 *         "riskScore": 0.72,
 *         "confidence": 0.85
 *       }
 *     ],
 *     "analysis": {
 *       "currentRisk": {...},
 *       "projectedClaims": {...},
 *       "savingsBreakdown": {...}
 *     },
 *     "calculatedAt": "2024-01-15T12:00:00Z",
 *     "calculator": "deductible",
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
 *     "deductibleOptions": ["At least 2 deductible options required"]
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
import { deductibleAnalyzerSchema } from '@/lib/api/security/validation';
import { ExcelProcessor } from '@/lib/deductible-analyzer/excel-processor';
import type { z } from 'zod';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs/promises';

// Type for validated input
type DeductibleAnalyzerInput = z.infer<typeof deductibleAnalyzerSchema>;

/**
 * Load the Excel template for deductible analysis
 * @returns ArrayBuffer containing the Excel template
 */
async function loadTemplate(): Promise<ArrayBuffer> {
  // In production, store this in a secure location
  // For now, we'll create a blank template structure
  const workbook = XLSX.utils.book_new();

  // Create Sheet 1: ISL Analsys - Historical Claims
  const sheet1Data = [
    ['Company Name', '', '', '', '', '', '', '', '', 'Effective Date:', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', 'Medical Trend Rate:'],
    // ... Add more template structure as needed
  ];
  const sheet1 = XLSX.utils.aoa_to_sheet(sheet1Data);
  XLSX.utils.book_append_sheet(workbook, sheet1, 'ISL Analsys - Historical Claims');

  // Create Sheet 2: ISL Analysis - Premium v Claims
  const sheet2Data = [
    ['ISL Analysis - Premium vs Claims Comparison'],
    // ... Add more template structure as needed
  ];
  const sheet2 = XLSX.utils.aoa_to_sheet(sheet2Data);
  XLSX.utils.book_append_sheet(workbook, sheet2, 'ISL Analysis - Premium v Claims');

  // Convert to buffer
  const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  return buffer;
}

/**
 * Business logic handler for Deductible Analysis
 */
async function handleDeductibleAnalysis(input: DeductibleAnalyzerInput) {
  try {
    // Load the Excel template
    const templateBuffer = await loadTemplate();

    // Create processor instance
    const processor = new ExcelProcessor(templateBuffer);

    // Write inputs to Excel
    processor.writeInputs({
      companyName: input.companyName,
      effectiveDate: input.effectiveDate,
      medicalTrendRate: input.medicalTrendRate,
      currentDeductible: input.currentDeductible,
      renewalPremium: input.renewalPremium,
      claimants: input.claimants,
      deductibleOptions: input.deductibleOptions
    });

    // Read calculated results
    const results = processor.readResults();

    // Return analysis results (without exposing the Excel logic)
    return {
      // Summary metrics
      recommendation: results.recommendation,

      // Claims analysis by deductible level
      claimsAnalysis: results.claimsAnalysis.map(row => ({
        deductibleAmount: row.deductibleAmount,
        averageISLClaims: row.averageISLClaims,
        additionalClaims: row.additionalClaims,
        yearlyBreakdown: {
          year2022: row.claims2022,
          year2023: row.claims2023,
          year2024: row.claims2024,
          year2025: row.claims2025
        }
      })),

      // Premium comparison
      premiumComparison: results.premiumComparison.map(row => ({
        carrierName: row.carrierName,
        deductibleAmount: row.deductibleAmount,
        premiumQuote: row.premiumQuote,
        premiumSavings: row.premiumSavings,
        additionalClaims: row.additionalClaims,
        netProjectedSavings: row.netProjectedSavings
      })),

      // Best option summary
      optimalOption: {
        deductible: results.recommendation.optimalDeductible,
        netSavings: results.recommendation.netSavings,
        carrier: results.premiumComparison.find(
          p => p.deductibleAmount === results.recommendation.optimalDeductible
        )?.carrierName || 'Current'
      },

      // Metadata
      calculatedAt: new Date().toISOString(),
      calculator: 'deductible',
      version: '1.0',

      // Excel download (base64 encoded for transport)
      excelDownload: results.excelBuffer ?
        Buffer.from(results.excelBuffer).toString('base64') :
        undefined
    };
  } catch (error) {
    console.error('Deductible analysis error:', error);
    throw new Error('Failed to complete deductible analysis');
  }
}

/**
 * POST /api/calculators/deductible/calculate
 * Analyze deductible options with full security
 */
export const POST = createSecureHandler({
  calculator: 'deductible',
  schema: deductibleAnalyzerSchema,
  rateLimit: {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 10        // 10 calculations per minute (more lenient than FIE)
  },
  requireCaptcha: false,  // Disabled for now, enable when reCAPTCHA keys are added
  handler: handleDeductibleAnalysis
});

/**
 * GET /api/calculators/deductible/calculate
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