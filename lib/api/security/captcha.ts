/**
 * CAPTCHA Verification for Calculator Protection
 * Uses Google reCAPTCHA v3 for invisible bot protection
 */

interface RecaptchaResponse {
  success: boolean;
  score: number;       // 0.0 - 1.0 (1.0 is very likely human)
  action: string;      // The action name from the request
  hostname: string;
  challenge_ts: string;
  'error-codes'?: string[];
}

interface CaptchaConfig {
  minScore?: number;   // Minimum score to pass (0.0 - 1.0)
  action?: string;     // Expected action name
}

/**
 * Verify reCAPTCHA v3 token with Google
 */
export async function verifyRecaptcha(
  token: string,
  config: CaptchaConfig = {}
): Promise<{ success: boolean; score?: number; reason?: string }> {
  const {
    minScore = 0.5,  // Default: moderate security (0.5 score)
    action
  } = config;

  // Get secret key from environment
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY not configured');
    return { success: false, reason: 'Server configuration error' };
  }

  if (!token) {
    return { success: false, reason: 'No CAPTCHA token provided' };
  }

  try {
    // Verify with Google
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token
      })
    });

    if (!response.ok) {
      throw new Error(`reCAPTCHA API error: ${response.status}`);
    }

    const data: RecaptchaResponse = await response.json();

    // Check basic success
    if (!data.success) {
      console.warn('reCAPTCHA verification failed:', data['error-codes']);
      return {
        success: false,
        reason: 'CAPTCHA verification failed',
        score: data.score
      };
    }

    // Check score threshold
    if (data.score < minScore) {
      console.warn(`reCAPTCHA score too low: ${data.score} < ${minScore}`);
      return {
        success: false,
        score: data.score,
        reason: 'Suspicious activity detected'
      };
    }

    // Verify action matches (if specified)
    if (action && data.action !== action) {
      console.warn(`reCAPTCHA action mismatch: expected ${action}, got ${data.action}`);
      return {
        success: false,
        score: data.score,
        reason: 'Invalid request context'
      };
    }

    // All checks passed
    return {
      success: true,
      score: data.score
    };

  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return {
      success: false,
      reason: 'Verification service unavailable'
    };
  }
}

/**
 * Middleware for CAPTCHA verification
 */
export async function captchaMiddleware(
  request: Request,
  config?: CaptchaConfig
): Promise<Response | null> {
  try {
    const body = await request.json();
    const captchaToken = body.captchaToken;

    // For development, allow bypass with special header or when CAPTCHA is disabled
    if (process.env.NODE_ENV === 'development' &&
        (request.headers.get('x-skip-captcha') === 'development' ||
         process.env.NEXT_PUBLIC_ENABLE_CAPTCHA !== 'true')) {
      console.log('CAPTCHA bypassed in development');
      return null;
    }

    const result = await verifyRecaptcha(captchaToken, config);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'CAPTCHA verification failed',
          message: result.reason || 'Please verify you are human',
          score: result.score
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Log score for monitoring
    if (result.score !== undefined) {
      console.log(`CAPTCHA score: ${result.score}`);
    }

    return null; // Verification passed
  } catch (error) {
    console.error('CAPTCHA middleware error:', error);
    return new Response(
      JSON.stringify({
        error: 'CAPTCHA verification error',
        message: 'Unable to verify CAPTCHA'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

/**
 * Different security levels for different calculators
 */
export const CAPTCHA_CONFIGS = {
  // Highest protection for FIE Calculator
  fie: {
    minScore: 0.7,
    action: 'fie_calculate'
  },

  // Medium protection for Deductible Analyzer
  deductible: {
    minScore: 0.5,
    action: 'deductible_analyze'
  },

  // Lower threshold for Assessment (it's a quiz)
  assessment: {
    minScore: 0.3,
    action: 'assessment_submit'
  }
} as const;