/**
 * CAPTCHA Verification for Calculator Protection
 * Uses Cloudflare Turnstile for privacy-friendly bot protection
 */

interface TurnstileResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
  action?: string;
  cdata?: string;
}

interface CaptchaConfig {
  minScore?: number;   // Kept for compatibility (Turnstile doesn't use scores)
  action?: string;     // Kept for compatibility (Turnstile uses 'cdata' instead)
}

/**
 * Verify Turnstile token with Cloudflare
 * More privacy-friendly than reCAPTCHA, no tracking or profiling
 */
export async function verifyTurnstile(
  token: string,
  config: CaptchaConfig = {}
): Promise<{ success: boolean; score?: number; reason?: string }> {
  // Get secret key from environment
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY not configured');
    return { success: false, reason: 'Server configuration error' };
  }

  if (!token) {
    return { success: false, reason: 'No CAPTCHA token provided' };
  }

  try {
    // Verify with Cloudflare
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: secretKey,
        response: token
      })
    });

    if (!response.ok) {
      throw new Error(`Turnstile API error: ${response.status}`);
    }

    const data: TurnstileResponse = await response.json();

    // Check basic success
    if (!data.success) {
      console.warn('Turnstile verification failed:', data['error-codes']);
      return {
        success: false,
        reason: data['error-codes']?.[0] || 'CAPTCHA verification failed',
        // Turnstile doesn't provide scores, but we return 0 for compatibility
        score: 0
      };
    }

    // All checks passed
    // Turnstile doesn't provide a score, but we return 1.0 for compatibility
    return {
      success: true,
      score: 1.0
    };

  } catch (error) {
    console.error('Turnstile verification error:', error);
    return {
      success: false,
      reason: 'Verification service unavailable'
    };
  }
}

/**
 * Legacy function name for backward compatibility
 * @deprecated Use verifyTurnstile instead
 */
export const verifyRecaptcha = verifyTurnstile;

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

    const result = await verifyTurnstile(captchaToken, config);

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

    // Log success (Turnstile doesn't have scores to log)
    console.log('Turnstile verification successful');

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
 * Security configurations for different calculators
 * Note: Turnstile doesn't use scores, but we keep the structure for compatibility
 */
export const CAPTCHA_CONFIGS = {
  // FIE Calculator
  fie: {
    minScore: 0.7,  // Ignored by Turnstile
    action: 'fie_calculate'
  },

  // Deductible Analyzer
  deductible: {
    minScore: 0.5,  // Ignored by Turnstile
    action: 'deductible_analyze'
  },

  // Assessment (quiz)
  assessment: {
    minScore: 0.3,  // Ignored by Turnstile
    action: 'assessment_submit'
  },

  // Fantasy Football
  fantasy: {
    minScore: 0.5,  // Ignored by Turnstile
    action: 'fantasy_lineup'
  }
} as const;