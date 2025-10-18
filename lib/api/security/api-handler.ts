/**
 * Secure API Handler Wrapper
 * Combines all security layers for calculator endpoints
 */

import { rateLimitMiddleware } from './rate-limiter';
import { captchaMiddleware, CAPTCHA_CONFIGS } from './captcha';
import { validateInput, performSecurityChecks, sanitizeOutput } from './validation';
import { logCalculatorRequest, extractRequestMetadata, sanitizeInputForLog } from './audit-logger';
import { z } from 'zod';

export type CalculatorType = 'fie' | 'deductible' | 'assessment';

interface HandlerConfig<T> {
  calculator: CalculatorType;
  schema: z.ZodSchema<T>;
  rateLimit?: {
    windowMs?: number;
    maxRequests?: number;
  };
  requireCaptcha?: boolean;
  handler: (validatedInput: T) => Promise<any>;
}

/**
 * Create a secure API handler with all protection layers
 */
export function createSecureHandler<T>(config: HandlerConfig<T>) {
  return async function handler(request: Request): Promise<Response> {
    const startTime = Date.now();
    const metadata = extractRequestMetadata(request);

    // Initialize audit log
    const auditLog = {
      timestamp: new Date(),
      calculator: config.calculator,
      action: 'calculate',
      ...metadata,
      success: false
    } as any;

    try {
      // Layer 1: Rate Limiting
      const rateLimitResponse = await rateLimitMiddleware(request, config.rateLimit);
      if (rateLimitResponse) {
        auditLog.errorMessage = 'Rate limited';
        await logCalculatorRequest(auditLog);
        return rateLimitResponse;
      }

      // Parse request body
      let body: any;
      try {
        const text = await request.text();
        body = JSON.parse(text);
      } catch (error) {
        auditLog.errorMessage = 'Invalid JSON';
        await logCalculatorRequest(auditLog);
        return new Response(
          JSON.stringify({ error: 'Invalid request format' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Layer 2: CAPTCHA Verification (if required)
      if (config.requireCaptcha && process.env.NODE_ENV === 'production') {
        const captchaConfig = CAPTCHA_CONFIGS[config.calculator];
        const captchaResponse = await captchaMiddleware(
          new Request(request.url, {
            method: 'POST',
            headers: request.headers,
            body: JSON.stringify(body)
          }),
          captchaConfig
        );

        if (captchaResponse) {
          auditLog.errorMessage = 'CAPTCHA failed';
          auditLog.captchaScore = body.captchaScore;
          await logCalculatorRequest(auditLog);
          return captchaResponse;
        }
      }

      // Layer 3: Input Validation
      const validation = validateInput(config.schema, body);
      if (!validation.success) {
        auditLog.errorMessage = `Validation failed: ${validation.errors.join(', ')}`;
        await logCalculatorRequest(auditLog);
        return new Response(
          JSON.stringify({
            error: 'Invalid input',
            details: validation.errors
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Layer 4: Security Checks
      const securityCheck = performSecurityChecks(validation.data);
      if (!securityCheck.passed) {
        auditLog.errorMessage = `Security check failed: ${securityCheck.reason}`;
        await logCalculatorRequest(auditLog);
        return new Response(
          JSON.stringify({
            error: 'Security validation failed',
            message: securityCheck.reason
          }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Store sanitized input in audit log
      auditLog.inputSummary = sanitizeInputForLog(validation.data);
      auditLog.email = (validation.data as any).email;

      // Layer 5: Execute Business Logic
      let result: any;
      try {
        result = await config.handler(validation.data);
      } catch (error) {
        console.error(`${config.calculator} calculation error:`, error);
        auditLog.errorMessage = error instanceof Error ? error.message : 'Calculation failed';
        await logCalculatorRequest(auditLog);
        return new Response(
          JSON.stringify({
            error: 'Calculation error',
            message: 'An error occurred during calculation'
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Sanitize output
      const sanitizedResult = sanitizeOutput(result);

      // Success - log and return
      auditLog.success = true;
      auditLog.responseTime = Date.now() - startTime;
      auditLog.resultSummary = {
        // Log key metrics without exposing formulas
        ...(sanitizedResult.annualSavings && { annualSavings: sanitizedResult.annualSavings }),
        ...(sanitizedResult.savingsPercentage && { savingsPercentage: sanitizedResult.savingsPercentage }),
        ...(sanitizedResult.recommendation && { hasRecommendation: true })
      };
      await logCalculatorRequest(auditLog);

      return new Response(
        JSON.stringify({
          success: true,
          data: sanitizedResult
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'X-Response-Time': `${Date.now() - startTime}ms`
          }
        }
      );

    } catch (error) {
      // Unexpected error
      console.error('Unexpected API error:', error);
      auditLog.errorMessage = 'Unexpected error';
      await logCalculatorRequest(auditLog);

      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: 'An unexpected error occurred'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

/**
 * Health check endpoint for monitoring
 */
export async function healthCheckHandler(request: Request): Promise<Response> {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      calculators: ['fie', 'deductible', 'assessment']
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}