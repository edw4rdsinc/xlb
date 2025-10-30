/**
 * Standardized API response utilities
 * Provides consistent response formats across all API routes
 */

import { NextResponse } from 'next/server';
import { logger } from '@/lib/utils/logger';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export class ApiResponses {
  /**
   * Success response
   */
  static success<T>(data?: T, message?: string, status = 200): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString()
      },
      { status }
    );
  }

  /**
   * Error response
   */
  static error(error: string | Error | ApiError, status = 500): NextResponse<ApiResponse> {
    let errorMessage: string;
    let errorCode: string | undefined;
    let details: any;

    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
      details = process.env.NODE_ENV === 'development' ? error.stack : undefined;
    } else {
      errorMessage = error.message;
      errorCode = error.code;
      status = error.statusCode || status;
      details = error.details;
    }

    logger.error(`API Error: ${errorMessage}`, error, { status });

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        ...(errorCode && { code: errorCode }),
        ...(details && { details }),
        timestamp: new Date().toISOString()
      },
      { status }
    );
  }

  /**
   * Bad request response
   */
  static badRequest(message = 'Bad Request', details?: any): NextResponse<ApiResponse> {
    return this.error(
      {
        message,
        code: 'BAD_REQUEST',
        statusCode: 400,
        details
      },
      400
    );
  }

  /**
   * Unauthorized response
   */
  static unauthorized(message = 'Unauthorized'): NextResponse<ApiResponse> {
    return this.error(
      {
        message,
        code: 'UNAUTHORIZED',
        statusCode: 401
      },
      401
    );
  }

  /**
   * Forbidden response
   */
  static forbidden(message = 'Forbidden'): NextResponse<ApiResponse> {
    return this.error(
      {
        message,
        code: 'FORBIDDEN',
        statusCode: 403
      },
      403
    );
  }

  /**
   * Not found response
   */
  static notFound(message = 'Not Found'): NextResponse<ApiResponse> {
    return this.error(
      {
        message,
        code: 'NOT_FOUND',
        statusCode: 404
      },
      404
    );
  }

  /**
   * Method not allowed response
   */
  static methodNotAllowed(allowedMethods: string[]): NextResponse<ApiResponse> {
    const response = this.error(
      {
        message: `Method Not Allowed. Allowed methods: ${allowedMethods.join(', ')}`,
        code: 'METHOD_NOT_ALLOWED',
        statusCode: 405
      },
      405
    );

    response.headers.set('Allow', allowedMethods.join(', '));
    return response;
  }

  /**
   * Rate limit exceeded response
   */
  static rateLimitExceeded(retryAfter?: number): NextResponse<ApiResponse> {
    const response = this.error(
      {
        message: 'Too Many Requests',
        code: 'RATE_LIMIT_EXCEEDED',
        statusCode: 429
      },
      429
    );

    if (retryAfter) {
      response.headers.set('Retry-After', retryAfter.toString());
    }

    return response;
  }

  /**
   * Internal server error response
   */
  static serverError(error?: Error | string): NextResponse<ApiResponse> {
    const message = error instanceof Error ? error.message : error || 'Internal Server Error';
    return this.error(
      {
        message,
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500
      },
      500
    );
  }

  /**
   * Service unavailable response
   */
  static serviceUnavailable(message = 'Service Unavailable'): NextResponse<ApiResponse> {
    return this.error(
      {
        message,
        code: 'SERVICE_UNAVAILABLE',
        statusCode: 503
      },
      503
    );
  }
}

// Export type for consistency
export type { ApiResponse, ApiError };