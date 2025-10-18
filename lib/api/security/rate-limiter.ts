/**
 * Rate Limiting for API Routes
 * Protects calculator endpoints from abuse
 */

interface RateLimitConfig {
  windowMs?: number;     // Time window in milliseconds
  maxRequests?: number;  // Max requests per window
  identifier?: string;   // Custom identifier (default: IP)
}

// In-memory store for rate limiting (consider Redis for production scaling)
const rateLimitStore = new Map<string, number[]>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  const maxAge = 5 * 60 * 1000; // Keep 5 minutes of history

  for (const [key, timestamps] of rateLimitStore.entries()) {
    const recent = timestamps.filter(ts => now - ts < maxAge);
    if (recent.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, recent);
    }
  }
}, 60 * 1000); // Clean every minute

/**
 * Check if request should be rate limited
 */
export async function checkRateLimit(
  request: Request,
  config: RateLimitConfig = {}
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const {
    windowMs = 60 * 1000,      // 1 minute default
    maxRequests = 20,           // 20 requests per minute default
    identifier
  } = config;

  // Get identifier (IP address by default)
  const id = identifier ||
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const key = `rate_limit:${id}`;
  const now = Date.now();

  // Get existing timestamps
  const timestamps = rateLimitStore.get(key) || [];

  // Filter to current window
  const recentRequests = timestamps.filter(ts => now - ts < windowMs);

  // Check if limit exceeded
  if (recentRequests.length >= maxRequests) {
    const oldestRequest = recentRequests[0];
    const retryAfter = Math.ceil((oldestRequest + windowMs - now) / 1000);

    return {
      allowed: false,
      retryAfter
    };
  }

  // Add current request
  rateLimitStore.set(key, [...recentRequests, now]);

  return { allowed: true };
}

/**
 * Express-style middleware for rate limiting
 */
export async function rateLimitMiddleware(
  request: Request,
  config?: RateLimitConfig
): Promise<Response | null> {
  const result = await checkRateLimit(request, config);

  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: 'Please slow down your requests',
        retryAfter: result.retryAfter
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(result.retryAfter || 60),
          'X-RateLimit-Limit': String(config?.maxRequests || 20),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + (result.retryAfter || 60) * 1000).toISOString()
        }
      }
    );
  }

  return null; // Request is allowed
}

/**
 * Get rate limit status for monitoring
 */
export function getRateLimitStats(): { totalKeys: number; totalRequests: number } {
  let totalRequests = 0;
  for (const timestamps of rateLimitStore.values()) {
    totalRequests += timestamps.length;
  }

  return {
    totalKeys: rateLimitStore.size,
    totalRequests
  };
}