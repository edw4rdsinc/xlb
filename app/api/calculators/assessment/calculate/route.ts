/**
 * Self-Funding Assessment API Endpoint
 * Protected server-side scoring logic
 */

import { createSecureHandler } from '@/lib/api/security/api-handler';
import { assessmentSchema } from '@/lib/api/security/validation';
import type { z } from 'zod';

// Type for validated input
type AssessmentInput = z.infer<typeof assessmentSchema>;

interface ScoreBreakdown {
  financial: number;
  claims: number;
  administrative: number;
  company: number;
  total: number;
  maxScores: {
    financial: number;
    claims: number;
    administrative: number;
    company: number;
    total: number;
  };
}

/**
 * Calculate assessment scores server-side
 * This protects the scoring algorithm from being reverse-engineered
 */
function calculateScores(answers: Record<string, any>): ScoreBreakdown {
  let financial = 0;
  let claims = 0;
  let administrative = 0;
  let company = 0;

  // Section 1: Company Info (20 points max)
  const employeeCountScores: Record<string, number> = {
    '1-50': 5,
    '51-100': 10,
    '101-500': 15,
    '500+': 20,
  };
  company += employeeCountScores[answers.employeeCount] || 0;

  // Section 2: Financial Health (40 points max)
  const financialStabilityScores: Record<string, number> = {
    'very-stable': 15,
    'stable': 10,
    'moderate': 5,
    'unstable': 0,
  };
  financial += financialStabilityScores[answers.financialStability] || 0;

  const cashReservesScores: Record<string, number> = {
    '6-months': 10,
    '3-6-months': 7,
    '1-3-months': 4,
    'less-1-month': 0,
  };
  financial += cashReservesScores[answers.cashReserves] || 0;

  const riskToleranceScores: Record<string, number> = {
    'high': 10,
    'moderate': 7,
    'low': 4,
    'very-low': 0,
  };
  financial += riskToleranceScores[answers.riskTolerance] || 0;

  const budgetFlexibilityScores: Record<string, number> = {
    'high': 5,
    'moderate': 3,
    'low': 1,
    'none': 0,
  };
  financial += budgetFlexibilityScores[answers.budgetFlexibility] || 0;

  // Section 3: Claims History (20 points max)
  const claimsPatternScores: Record<string, number> = {
    'stable': 10,
    'decreasing': 10,
    'increasing': 5,
    'unknown': 5,
  };
  claims += claimsPatternScores[answers.claimsPattern] || 0;

  const largeClaimsScores: Record<string, number> = {
    'none': 5,
    '1-2': 3,
    '3-5': 1,
    '5+': 0,
  };
  claims += largeClaimsScores[answers.largeClaimsHistory] || 0;

  const chronicConditionsScores: Record<string, number> = {
    'low': 5,
    'moderate': 3,
    'high': 1,
    'unknown': 3,
  };
  claims += chronicConditionsScores[answers.chronicConditions] || 0;

  // Section 4: Administrative Readiness (20 points max)
  const hrCapacityScores: Record<string, number> = {
    'dedicated': 6,
    'shared': 4,
    'limited': 2,
    'none': 0,
  };
  administrative += hrCapacityScores[answers.hrCapacity] || 0;

  const vendorScores: Record<string, number> = {
    'excellent': 6,
    'good': 4,
    'fair': 2,
    'poor': 0,
  };
  administrative += vendorScores[answers.vendorRelationships] || 0;

  const dataAnalyticsScores: Record<string, number> = {
    'advanced': 4,
    'basic': 2,
    'minimal': 1,
    'none': 0,
  };
  administrative += dataAnalyticsScores[answers.dataAnalytics] || 0;

  const communicationScores: Record<string, number> = {
    'excellent': 4,
    'good': 3,
    'fair': 1,
    'poor': 0,
  };
  administrative += communicationScores[answers.employeeCommunication] || 0;

  // Calculate total
  const total = financial + claims + administrative + company;

  return {
    financial,
    claims,
    administrative,
    company,
    total,
    maxScores: {
      financial: 40,
      claims: 20,
      administrative: 20,
      company: 20,
      total: 100
    }
  };
}

/**
 * Generate personalized recommendations based on scores
 */
function generateRecommendations(scores: ScoreBreakdown): {
  readinessLevel: 'ready' | 'conditional' | 'not-ready';
  primaryRecommendation: string;
  keyStrengths: string[];
  areasForImprovement: string[];
  nextSteps: string[];
} {
  const { total, financial, claims, administrative, company } = scores;
  const percentages = {
    total: (total / scores.maxScores.total) * 100,
    financial: (financial / scores.maxScores.financial) * 100,
    claims: (claims / scores.maxScores.claims) * 100,
    administrative: (administrative / scores.maxScores.administrative) * 100,
    company: (company / scores.maxScores.company) * 100
  };

  // Determine readiness level
  let readinessLevel: 'ready' | 'conditional' | 'not-ready';
  let primaryRecommendation: string;

  if (percentages.total >= 75 && percentages.financial >= 70) {
    readinessLevel = 'ready';
    primaryRecommendation = 'Your organization appears well-positioned for self-funding. The financial stability, claims history, and administrative infrastructure suggest you can successfully manage the risks and responsibilities of a self-funded plan.';
  } else if (percentages.total >= 60 || (percentages.total >= 50 && percentages.financial >= 60)) {
    readinessLevel = 'conditional';
    primaryRecommendation = 'Your organization shows potential for self-funding but should address key areas before transitioning. Consider a phased approach or level-funded arrangement as an intermediate step.';
  } else {
    readinessLevel = 'not-ready';
    primaryRecommendation = 'Based on current indicators, your organization would benefit from remaining fully-insured while building the necessary infrastructure and financial reserves for future self-funding consideration.';
  }

  // Identify strengths
  const keyStrengths: string[] = [];
  if (percentages.financial >= 75) keyStrengths.push('Strong financial foundation and risk tolerance');
  if (percentages.claims >= 75) keyStrengths.push('Favorable claims history and predictability');
  if (percentages.administrative >= 75) keyStrengths.push('Robust administrative capabilities');
  if (company >= 15) keyStrengths.push('Sufficient employee base for risk pooling');

  // Identify improvements needed
  const areasForImprovement: string[] = [];
  if (percentages.financial < 50) areasForImprovement.push('Build stronger cash reserves and financial stability');
  if (percentages.claims < 50) areasForImprovement.push('Analyze and address claims volatility patterns');
  if (percentages.administrative < 50) areasForImprovement.push('Strengthen HR capacity and vendor partnerships');
  if (company < 10) areasForImprovement.push('Consider waiting until employee base grows');

  // Generate next steps
  const nextSteps: string[] = [];
  if (readinessLevel === 'ready') {
    nextSteps.push('Request stop-loss quotes from multiple carriers');
    nextSteps.push('Evaluate TPA options and administrative platforms');
    nextSteps.push('Develop 12-month cash flow projections');
    nextSteps.push('Create employee communication strategy');
  } else if (readinessLevel === 'conditional') {
    nextSteps.push('Consider level-funded arrangement as transition strategy');
    nextSteps.push('Address identified gaps in administrative infrastructure');
    nextSteps.push('Build cash reserves to 3-6 months of expected claims');
    nextSteps.push('Implement claims management and wellness programs');
  } else {
    nextSteps.push('Focus on building financial reserves');
    nextSteps.push('Implement cost containment strategies in current plan');
    nextSteps.push('Develop HR and administrative capabilities');
    nextSteps.push('Re-assess readiness in 12-18 months');
  }

  return {
    readinessLevel,
    primaryRecommendation,
    keyStrengths,
    areasForImprovement,
    nextSteps
  };
}

/**
 * Business logic handler for Assessment
 */
async function handleAssessment(input: AssessmentInput) {
  // Calculate scores (protected algorithm)
  const scores = calculateScores(input.answers);

  // Generate recommendations
  const recommendations = generateRecommendations(scores);

  // Return assessment results
  return {
    // Readiness summary
    readinessLevel: recommendations.readinessLevel,
    readinessScore: scores.total,
    readinessPercentage: Math.round((scores.total / scores.maxScores.total) * 100),

    // Score breakdown (percentages only, not raw scoring algorithm)
    scoreBreakdown: {
      financial: {
        score: scores.financial,
        maxScore: scores.maxScores.financial,
        percentage: Math.round((scores.financial / scores.maxScores.financial) * 100)
      },
      claims: {
        score: scores.claims,
        maxScore: scores.maxScores.claims,
        percentage: Math.round((scores.claims / scores.maxScores.claims) * 100)
      },
      administrative: {
        score: scores.administrative,
        maxScore: scores.maxScores.administrative,
        percentage: Math.round((scores.administrative / scores.maxScores.administrative) * 100)
      },
      company: {
        score: scores.company,
        maxScore: scores.maxScores.company,
        percentage: Math.round((scores.company / scores.maxScores.company) * 100)
      }
    },

    // Personalized insights
    primaryRecommendation: recommendations.primaryRecommendation,
    keyStrengths: recommendations.keyStrengths,
    areasForImprovement: recommendations.areasForImprovement,
    nextSteps: recommendations.nextSteps,

    // Risk indicators
    riskFactors: {
      financialRisk: scores.financial < 20 ? 'high' : scores.financial < 30 ? 'moderate' : 'low',
      claimsRisk: scores.claims < 10 ? 'high' : scores.claims < 15 ? 'moderate' : 'low',
      operationalRisk: scores.administrative < 10 ? 'high' : scores.administrative < 15 ? 'moderate' : 'low'
    },

    // Metadata
    calculatedAt: new Date().toISOString(),
    calculator: 'assessment',
    version: '1.0'
  };
}

/**
 * POST /api/calculators/assessment/calculate
 * Evaluate self-funding readiness with full security
 */
export const POST = createSecureHandler({
  calculator: 'assessment',
  schema: assessmentSchema,
  rateLimit: {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 20        // 20 assessments per minute (it's just a quiz)
  },
  requireCaptcha: false,  // Disabled for now, enable when reCAPTCHA keys are added
  handler: handleAssessment
});

/**
 * GET /api/calculators/assessment/calculate
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