/**
 * Centralized logging utility for production-safe logging
 * Replaces direct console.log usage throughout the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const environment = this.isClient ? 'client' : 'server';
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${environment}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message, context));
    }
    // In production, this could send to a logging service
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
    // In production, this could send to a logging service
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error(this.formatMessage('error', message, {
      ...context,
      error: errorMessage,
      stack: errorStack
    }));

    // In production, this could send to an error tracking service like Sentry
  }

  // Performance logging
  performance(label: string, duration: number): void {
    if (this.isDevelopment) {
      this.debug(`Performance: ${label}`, { duration: `${duration}ms` });
    }
  }

  // API logging
  api(method: string, url: string, status?: number, duration?: number): void {
    const level = status && status >= 400 ? 'error' : 'info';
    this[level](`API ${method} ${url}`, {
      status,
      duration: duration ? `${duration}ms` : undefined
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for use in other files
export type { LogLevel, LogContext };