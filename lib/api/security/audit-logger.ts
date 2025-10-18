/**
 * Audit Logging for Calculator API Usage
 * Tracks all calculation requests for security and analytics
 */

export interface AuditLog {
  timestamp: Date;
  calculator: 'fie' | 'deductible' | 'assessment';
  action: string;
  ip?: string;
  userAgent?: string;
  email?: string;
  success: boolean;
  errorMessage?: string;
  responseTime?: number;
  captchaScore?: number;
  inputSummary?: Record<string, any>; // Sanitized input data
  resultSummary?: Record<string, any>; // Key results (not full calculation)
}

// In-memory storage for development (use database in production)
const auditLogs: AuditLog[] = [];

/**
 * Log a calculator API request
 */
export async function logCalculatorRequest(log: AuditLog): Promise<void> {
  try {
    // Add to in-memory store
    auditLogs.push(log);

    // In production, save to database
    if (process.env.NODE_ENV === 'production') {
      // TODO: Save to Supabase
      // await supabase.from('audit_logs').insert(log);
    }

    // Keep only last 1000 logs in memory
    if (auditLogs.length > 1000) {
      auditLogs.shift();
    }

    // Log suspicious activity
    if (log.captchaScore && log.captchaScore < 0.3) {
      console.warn('⚠️ Low CAPTCHA score detected:', {
        ip: log.ip,
        score: log.captchaScore,
        calculator: log.calculator
      });
    }

    // Log errors
    if (!log.success) {
      console.error('❌ Calculator API error:', {
        calculator: log.calculator,
        error: log.errorMessage,
        ip: log.ip
      });
    }
  } catch (error) {
    console.error('Failed to write audit log:', error);
    // Don't throw - logging failure shouldn't break the API
  }
}

/**
 * Get audit logs for monitoring
 */
export function getAuditLogs(filters?: {
  calculator?: string;
  since?: Date;
  limit?: number;
}): AuditLog[] {
  let logs = [...auditLogs];

  if (filters?.calculator) {
    logs = logs.filter(log => log.calculator === filters.calculator);
  }

  if (filters?.since) {
    const sinceTime = filters.since;
    logs = logs.filter(log => log.timestamp > sinceTime);
  }

  if (filters?.limit) {
    logs = logs.slice(-filters.limit);
  }

  return logs;
}

/**
 * Get usage statistics
 */
export function getUsageStats(): {
  totalRequests: number;
  requestsByCalculator: Record<string, number>;
  successRate: number;
  averageResponseTime: number;
  suspiciousActivity: number;
} {
  const stats = {
    totalRequests: auditLogs.length,
    requestsByCalculator: {} as Record<string, number>,
    successRate: 0,
    averageResponseTime: 0,
    suspiciousActivity: 0
  };

  if (auditLogs.length === 0) return stats;

  let successCount = 0;
  let totalResponseTime = 0;
  let responseTimeCount = 0;

  for (const log of auditLogs) {
    // Count by calculator
    stats.requestsByCalculator[log.calculator] =
      (stats.requestsByCalculator[log.calculator] || 0) + 1;

    // Count successes
    if (log.success) successCount++;

    // Sum response times
    if (log.responseTime) {
      totalResponseTime += log.responseTime;
      responseTimeCount++;
    }

    // Count suspicious activity
    if (log.captchaScore && log.captchaScore < 0.5) {
      stats.suspiciousActivity++;
    }
  }

  stats.successRate = (successCount / auditLogs.length) * 100;
  stats.averageResponseTime = responseTimeCount > 0
    ? totalResponseTime / responseTimeCount
    : 0;

  return stats;
}

/**
 * Sanitize input data for logging (remove sensitive info)
 */
export function sanitizeInputForLog(input: any): Record<string, any> {
  const sanitized: Record<string, any> = {};

  // For FIE Calculator
  if (input.plans) {
    sanitized.numberOfPlans = input.plans.length;
    sanitized.totalEmployees = input.plans.reduce((sum: number, plan: any) => {
      const censusValues = Object.values(plan.census || {}) as number[];
      return sum + censusValues.reduce((a: number, b: number) => a + b, 0);
    }, 0);
  }

  // For Deductible Analyzer
  if (input.currentDeductible) {
    sanitized.currentDeductible = input.currentDeductible;
    sanitized.numberOfOptions = input.deductibleOptions?.length || 0;
  }

  // For Assessment
  if (input.answers) {
    sanitized.numberOfAnswers = Object.keys(input.answers).length;
  }

  // Never log personal data
  delete sanitized.email;
  delete sanitized.companyName;
  delete sanitized.phone;

  return sanitized;
}

/**
 * Extract request metadata
 */
export function extractRequestMetadata(request: Request): {
  ip?: string;
  userAgent?: string;
} {
  return {
    ip: request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        undefined,
    userAgent: request.headers.get('user-agent') || undefined
  };
}