/**
 * Self-Funding Assessment API Endpoint
 * Protected server-side scoring logic
 */

import { createSecureHandler } from '@/lib/api/security/api-handler';
import { assessmentSchema } from '@/lib/api/security/validation';
import Anthropic from '@anthropic-ai/sdk';
import type { z } from 'zod';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Type for validated input
type AssessmentInput = z.infer<typeof assessmentSchema>;

interface ScoreBreakdown {
  q1_currentFunding: number;
  q4_groupSize: number;
  q5_recentRenewal: number;
  q6_avgRenewal: number;
  q7_claimsAccess: number;
  q8_singlePremium: number;
  q9_ppoMix: number;
  q10_financialStability: number;
  q11_riskTolerance: number;
  q12_hrCapacity: number;
  total: number;
  maxScores: {
    q1_currentFunding: number;
    q4_groupSize: number;
    q5_recentRenewal: number;
    q6_avgRenewal: number;
    q7_claimsAccess: number;
    q8_singlePremium: number;
    q9_ppoMix: number;
    q10_financialStability: number;
    q11_riskTolerance: number;
    q12_hrCapacity: number;
    total: number;
  };
}

/**
 * Calculate assessment scores server-side
 * This protects the scoring algorithm from being reverse-engineered
 */
function calculateScores(answers: Record<string, any>): ScoreBreakdown {
  let q1_currentFunding = 0;
  let q4_groupSize = 0;
  let q5_recentRenewal = 0;
  let q6_avgRenewal = 0;
  let q7_claimsAccess = 0;
  let q8_singlePremium = 0;
  let q9_ppoMix = 0;
  let q10_financialStability = 0;
  let q11_riskTolerance = 0;
  let q12_hrCapacity = 0;

  // Q1: Current Funding Model (Max 4 points)
  const currentFundingScores: Record<string, number> = {
    'fully-insured': 2,
    'level-funded': 3,
    'already-self-funded': 4,
    'not-sure': 2,
    'trust-peo-mewa': 0,
  };
  q1_currentFunding = currentFundingScores[answers.currentFunding] || 0;

  // Q4: Group Size (Max 20 points) - BIGGEST FACTOR
  const groupSizeScores: Record<string, number> = {
    'under-50': 0,
    '50-99': 8,
    '100-199': 14,
    '200-499': 17,
    '500-plus': 20,
  };
  q4_groupSize = groupSizeScores[answers.groupSize] || 0;

  // Q5: Most Recent Medical Renewal Increase (Max 15 points)
  const recentRenewalScores: Record<string, number> = {
    'reduction': 15,
    '0-7': 15,
    '8-12': 12,
    '13-17': 10,
    '18-25': 7,
    '26-40': 4,
    'over-40': 0,
  };
  q5_recentRenewal = recentRenewalScores[answers.recentRenewal] || 0;

  // Q6: Average Medical Renewal Increase (last 3-4 years) (Max 10 points)
  const avgRenewalScores: Record<string, number> = {
    '0-7': 10,
    '8-12': 8,
    '13-17': 6,
    '18-25': 3,
    'over-25': 0,
  };
  q6_avgRenewal = avgRenewalScores[answers.avgRenewal] || 0;

  // Q7: Access to Claims Experience (Max 15 points)
  const claimsAccessScores: Record<string, number> = {
    'both-monthly-and-large': 15,
    'large-claims-only': 11,
    'monthly-claims-only': 7,
    'no-access': 0,
  };
  q7_claimsAccess = claimsAccessScores[answers.claimsAccess] || 0;

  // Q8: Single Premium (Employee Only) on Base Plan (Max 10 points)
  const singlePremiumScores: Record<string, number> = {
    'age-banded': 0,
    'under-500': 0,
    '500-649': 4,
    '650-799': 6,
    '800-999': 8,
    '1000-plus': 10,
  };
  q8_singlePremium = singlePremiumScores[answers.singlePremium] || 0;

  // Q9: PPO/EPO Enrollment Mix (Max 6 points)
  const ppoMixScores: Record<string, number> = {
    '90-100': 6,
    '60-89': 4,
    '40-59': 3,
    '10-39': 1,
    '0-9': 0,
  };
  q9_ppoMix = ppoMixScores[answers.ppoMix] || 0;

  // Q10: Financial Stability / Cash Flow Readiness (Max 7 points)
  const financialStabilityScores: Record<string, number> = {
    'very-stable': 7,
    'stable': 5,
    'moderate': 3,
    'unstable': 0,
  };
  q10_financialStability = financialStabilityScores[answers.financialStability] || 0;

  // Q11: Leadership Risk Tolerance (Max 8 points)
  const riskToleranceScores: Record<string, number> = {
    'high': 8,
    'moderate': 6,
    'low': 4,
    'very-low': 0,
  };
  q11_riskTolerance = riskToleranceScores[answers.riskTolerance] || 0;

  // Q12: HR Team Capacity (Max 5 points)
  const hrCapacityScores: Record<string, number> = {
    'dedicated-experienced': 5,
    'shared-some-experience': 3,
    'limited-minimal-experience': 1,
    'no-dedicated': 0,
  };
  q12_hrCapacity = hrCapacityScores[answers.hrCapacity] || 0;

  // Calculate total
  const total =
    q1_currentFunding +
    q4_groupSize +
    q5_recentRenewal +
    q6_avgRenewal +
    q7_claimsAccess +
    q8_singlePremium +
    q9_ppoMix +
    q10_financialStability +
    q11_riskTolerance +
    q12_hrCapacity;

  return {
    q1_currentFunding,
    q4_groupSize,
    q5_recentRenewal,
    q6_avgRenewal,
    q7_claimsAccess,
    q8_singlePremium,
    q9_ppoMix,
    q10_financialStability,
    q11_riskTolerance,
    q12_hrCapacity,
    total,
    maxScores: {
      q1_currentFunding: 4,
      q4_groupSize: 20,
      q5_recentRenewal: 15,
      q6_avgRenewal: 10,
      q7_claimsAccess: 15,
      q8_singlePremium: 10,
      q9_ppoMix: 6,
      q10_financialStability: 7,
      q11_riskTolerance: 8,
      q12_hrCapacity: 5,
      total: 100,
    },
  };
}

/**
 * Generate personalized recommendations based on scores
 */
function generateRecommendations(
  scores: ScoreBreakdown,
  answers: Record<string, any>
): {
  readinessLevel: 'excellent' | 'good' | 'caution' | 'not-ready';
  primaryRecommendation: string;
  keyStrengths: string[];
  areasForImprovement: string[];
  nextSteps: string[];
  guardrails: string[];
} {
  const { total } = scores;

  // Determine readiness level based on new thresholds
  let readinessLevel: 'excellent' | 'good' | 'caution' | 'not-ready';
  let primaryRecommendation: string;

  if (total >= 80) {
    readinessLevel = 'excellent';
    primaryRecommendation =
      'Ready to explore self-funding at next renewal. Your organization demonstrates strong fundamentals across all key indicators.';
  } else if (total >= 60) {
    readinessLevel = 'good';
    primaryRecommendation =
      'Good Candidate with Guidance. Solid fundamentals; may need support in key areas.';
  } else if (total >= 40) {
    readinessLevel = 'caution';
    primaryRecommendation =
      'Proceed with Caution. May benefit from phased approach or preparation.';
  } else {
    readinessLevel = 'not-ready';
    primaryRecommendation =
      'Not Ready. Focus on readiness steps; reassess in 6-12 months.';
  }

  // Identify strengths
  const keyStrengths: string[] = [];
  if (scores.q4_groupSize >= 17) keyStrengths.push('Excellent group size for risk pooling');
  if (scores.q5_recentRenewal >= 12) keyStrengths.push('Strong recent renewal performance');
  if (scores.q7_claimsAccess >= 11) keyStrengths.push('Good access to claims data');
  if (scores.q10_financialStability >= 5) keyStrengths.push('Strong financial foundation');
  if (scores.q11_riskTolerance >= 6) keyStrengths.push('Appropriate risk tolerance');

  // Identify improvements needed
  const areasForImprovement: string[] = [];
  if (scores.q4_groupSize < 14) areasForImprovement.push('Consider waiting for group to grow');
  if (scores.q7_claimsAccess < 7) areasForImprovement.push('Negotiate access to claims data at renewal');
  if (scores.q10_financialStability < 5) areasForImprovement.push('Build stronger cash reserves');
  if (scores.q12_hrCapacity < 3) areasForImprovement.push('Strengthen HR capacity for benefits management');

  // Add guardrails based on specific conditions
  const guardrails: string[] = [];

  if (scores.q4_groupSize < 14) {
    guardrails.push(
      'Group Size <150: Given the lack of credible claims data, member-level census may allow AI underwriting models to support feasibility.'
    );
  }

  if (scores.q7_claimsAccess === 0) {
    guardrails.push(
      'Claims Experience = None: Consider negotiating access to claims data at next renewal to improve modeling and stop-loss pricing.'
    );
  }

  if (scores.q8_singlePremium === 0 && answers.singlePremium === 'under-500') {
    guardrails.push(
      'Single Premium <$500: Current pricing appears efficient; self-funding may offer more control than cost savings.'
    );
  }

  // Generate next steps
  const nextSteps: string[] = [];
  if (readinessLevel === 'excellent') {
    nextSteps.push('Request stop-loss quotes from multiple carriers');
    nextSteps.push('Evaluate TPA options and administrative platforms');
    nextSteps.push('Develop 12-month cash flow projections');
    nextSteps.push('Create employee communication strategy');
  } else if (readinessLevel === 'good') {
    nextSteps.push('Consider level-funded arrangement as transition strategy');
    nextSteps.push('Address identified gaps in administrative infrastructure');
    nextSteps.push('Build cash reserves to support claims variability');
    nextSteps.push('Obtain detailed claims reporting from current carrier');
  } else if (readinessLevel === 'caution') {
    nextSteps.push('Focus on building financial reserves');
    nextSteps.push('Negotiate access to claims data');
    nextSteps.push('Consider growth strategies to reach optimal group size');
    nextSteps.push('Develop HR and administrative capabilities');
  } else {
    nextSteps.push('Remain fully-insured while building readiness');
    nextSteps.push('Implement cost containment strategies in current plan');
    nextSteps.push('Focus on growing employee base');
    nextSteps.push('Re-assess readiness in 6-12 months');
  }

  return {
    readinessLevel,
    primaryRecommendation,
    keyStrengths,
    areasForImprovement,
    nextSteps,
    guardrails,
  };
}

/**
 * Generate a professional narrative using Claude API
 */
async function generateNarrative(
  scores: ScoreBreakdown,
  recommendations: {
    readinessLevel: string;
    primaryRecommendation: string;
    keyStrengths: string[];
    areasForImprovement: string[];
    nextSteps: string[];
    guardrails: string[];
  },
  answers: Record<string, any>
): Promise<string> {
  try {
    const readinessLabels: Record<string, string> = {
      'excellent': 'Excellent Candidate (80-100 points)',
      'good': 'Good Candidate with Guidance (60-79 points)',
      'caution': 'Proceed with Caution (40-59 points)',
      'not-ready': 'Not Ready (below 40 points)',
    };

    const groupSizeLabels: Record<string, string> = {
      'under-50': 'fewer than 50 employees',
      '50-99': '50-99 employees',
      '100-199': '100-199 employees',
      '200-499': '200-499 employees',
      '500-plus': '500+ employees',
    };

    const prompt = `You are a senior benefits consultant writing a professional executive summary for a Self-Funding Readiness Assessment. Write a cohesive, flowing narrative (approximately 3-4 paragraphs, about one page) that synthesizes all the assessment findings into actionable guidance.

ASSESSMENT DATA:
- Overall Score: ${scores.total}/100
- Readiness Level: ${readinessLabels[recommendations.readinessLevel] || recommendations.readinessLevel}
- Group Size: ${groupSizeLabels[answers.groupSize] || answers.groupSize}
- Current Funding: ${answers.currentFunding}
- Industry: ${answers.industry}

KEY STRENGTHS:
${recommendations.keyStrengths.length > 0 ? recommendations.keyStrengths.map(s => `• ${s}`).join('\n') : '• No major strengths identified at this time'}

AREAS FOR IMPROVEMENT:
${recommendations.areasForImprovement.length > 0 ? recommendations.areasForImprovement.map(a => `• ${a}`).join('\n') : '• No critical gaps identified'}

RECOMMENDED NEXT STEPS:
${recommendations.nextSteps.map(s => `• ${s}`).join('\n')}

IMPORTANT CONSIDERATIONS (GUARDRAILS):
${recommendations.guardrails.length > 0 ? recommendations.guardrails.map(g => `• ${g}`).join('\n') : '• No special considerations'}

WRITING GUIDELINES:
1. Use second person ("Your organization...")
2. Open with the overall assessment and what it means for their self-funding journey
3. Discuss strengths as opportunities and frame improvements constructively
4. Connect the dots between findings - show how factors relate to each other
5. End with clear, prioritized guidance on next steps
6. Maintain a professional, consultative tone - advisory but not alarmist
7. Be specific and actionable, not generic
8. Do NOT use bullet points - write in flowing paragraphs
9. Do NOT include headers or section titles - just flowing prose

Write the executive summary now:`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    return content.text;
  } catch (error: any) {
    console.error('Narrative generation error:', error);
    // Return a fallback narrative if Claude fails
    return `Your organization scored ${scores.total} out of 100 on the Self-Funding Readiness Assessment, placing you in the "${recommendations.readinessLevel}" category. ${recommendations.primaryRecommendation}\n\nBased on your responses, we recommend reviewing the detailed findings below and scheduling a consultation with our team to discuss your specific situation and develop a customized transition strategy.`;
  }
}

/**
 * Business logic handler for Assessment
 */
async function handleAssessment(input: AssessmentInput) {
  // Calculate scores (protected algorithm)
  const scores = calculateScores(input.answers);

  // Generate recommendations
  const recommendations = generateRecommendations(scores, input.answers);

  // Generate professional narrative using Claude
  const narrativeRecommendation = await generateNarrative(scores, recommendations, input.answers);

  // Return assessment results
  return {
    // Readiness summary
    readinessLevel: recommendations.readinessLevel,
    readinessScore: scores.total,
    readinessPercentage: Math.round((scores.total / scores.maxScores.total) * 100),

    // Score breakdown (percentages only, not raw scoring algorithm)
    scoreBreakdown: {
      currentFunding: {
        score: scores.q1_currentFunding,
        maxScore: scores.maxScores.q1_currentFunding,
        percentage: Math.round((scores.q1_currentFunding / scores.maxScores.q1_currentFunding) * 100),
      },
      groupSize: {
        score: scores.q4_groupSize,
        maxScore: scores.maxScores.q4_groupSize,
        percentage: Math.round((scores.q4_groupSize / scores.maxScores.q4_groupSize) * 100),
      },
      renewalPerformance: {
        score: scores.q5_recentRenewal + scores.q6_avgRenewal,
        maxScore: scores.maxScores.q5_recentRenewal + scores.maxScores.q6_avgRenewal,
        percentage: Math.round(
          ((scores.q5_recentRenewal + scores.q6_avgRenewal) /
            (scores.maxScores.q5_recentRenewal + scores.maxScores.q6_avgRenewal)) *
            100
        ),
      },
      claimsAndData: {
        score: scores.q7_claimsAccess,
        maxScore: scores.maxScores.q7_claimsAccess,
        percentage: Math.round((scores.q7_claimsAccess / scores.maxScores.q7_claimsAccess) * 100),
      },
      planDesign: {
        score: scores.q8_singlePremium + scores.q9_ppoMix,
        maxScore: scores.maxScores.q8_singlePremium + scores.maxScores.q9_ppoMix,
        percentage: Math.round(
          ((scores.q8_singlePremium + scores.q9_ppoMix) /
            (scores.maxScores.q8_singlePremium + scores.maxScores.q9_ppoMix)) *
            100
        ),
      },
      organizationalReadiness: {
        score: scores.q10_financialStability + scores.q11_riskTolerance + scores.q12_hrCapacity,
        maxScore:
          scores.maxScores.q10_financialStability +
          scores.maxScores.q11_riskTolerance +
          scores.maxScores.q12_hrCapacity,
        percentage: Math.round(
          ((scores.q10_financialStability + scores.q11_riskTolerance + scores.q12_hrCapacity) /
            (scores.maxScores.q10_financialStability +
              scores.maxScores.q11_riskTolerance +
              scores.maxScores.q12_hrCapacity)) *
            100
        ),
      },
    },

    // Personalized insights
    primaryRecommendation: recommendations.primaryRecommendation,
    narrativeRecommendation,
    keyStrengths: recommendations.keyStrengths,
    areasForImprovement: recommendations.areasForImprovement,
    nextSteps: recommendations.nextSteps,
    guardrails: recommendations.guardrails,

    // Risk indicators
    riskFactors: {
      groupSize: scores.q4_groupSize < 8 ? 'high' : scores.q4_groupSize < 14 ? 'moderate' : 'low',
      claimsAccess: scores.q7_claimsAccess === 0 ? 'high' : scores.q7_claimsAccess < 7 ? 'moderate' : 'low',
      financialReadiness:
        scores.q10_financialStability < 3
          ? 'high'
          : scores.q10_financialStability < 5
          ? 'moderate'
          : 'low',
    },

    // Metadata
    calculatedAt: new Date().toISOString(),
    calculator: 'assessment',
    version: '2.0',
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
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20, // 20 assessments per minute (it's just a quiz)
  },
  requireCaptcha: false, // Disabled for now, enable when reCAPTCHA keys are added
  handler: handleAssessment,
});

/**
 * GET /api/calculators/assessment/calculate
 * Return method not allowed
 */
export async function GET(request: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json',
      Allow: 'POST',
    },
  });
}
