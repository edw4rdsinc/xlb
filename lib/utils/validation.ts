/**
 * Common validation utilities
 * Centralizes validation logic for reuse across the application
 */

import { VALIDATION_CONSTANTS, ERROR_MESSAGES } from '@/lib/constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class Validators {
  /**
   * Validate email format
   */
  static email(email: string): ValidationResult {
    if (!email) {
      return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    const isValid = VALIDATION_CONSTANTS.EMAIL_REGEX.test(email.trim());
    return {
      isValid,
      error: isValid ? undefined : ERROR_MESSAGES.INVALID_EMAIL,
    };
  }

  /**
   * Validate phone number format
   */
  static phone(phone: string): ValidationResult {
    if (!phone) {
      return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    const cleaned = phone.replace(/\D/g, '');
    const isValid = cleaned.length >= 10 && cleaned.length <= 15;
    return {
      isValid,
      error: isValid ? undefined : ERROR_MESSAGES.INVALID_PHONE,
    };
  }

  /**
   * Validate ZIP code format
   */
  static zipCode(zip: string): ValidationResult {
    if (!zip) {
      return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    const isValid = VALIDATION_CONSTANTS.ZIP_REGEX.test(zip.trim());
    return {
      isValid,
      error: isValid ? undefined : 'Please enter a valid ZIP code',
    };
  }

  /**
   * Validate password strength
   */
  static password(password: string): ValidationResult {
    if (!password) {
      return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    if (password.length < VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH) {
      return { isValid: false, error: ERROR_MESSAGES.PASSWORD_TOO_SHORT };
    }

    if (password.length > VALIDATION_CONSTANTS.MAX_PASSWORD_LENGTH) {
      return { isValid: false, error: ERROR_MESSAGES.PASSWORD_TOO_LONG };
    }

    // Check for at least one uppercase, one lowercase, one number
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return {
        isValid: false,
        error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      };
    }

    return { isValid: true };
  }

  /**
   * Validate required field
   */
  static required(value: any): ValidationResult {
    const isValid = value !== null && value !== undefined && value !== '';
    return {
      isValid,
      error: isValid ? undefined : ERROR_MESSAGES.REQUIRED_FIELD,
    };
  }

  /**
   * Validate minimum length
   */
  static minLength(value: string, min: number): ValidationResult {
    if (!value) {
      return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    const isValid = value.length >= min;
    return {
      isValid,
      error: isValid ? undefined : `Must be at least ${min} characters long`,
    };
  }

  /**
   * Validate maximum length
   */
  static maxLength(value: string, max: number): ValidationResult {
    const isValid = !value || value.length <= max;
    return {
      isValid,
      error: isValid ? undefined : `Must be no more than ${max} characters long`,
    };
  }

  /**
   * Validate number range
   */
  static numberRange(value: number, min?: number, max?: number): ValidationResult {
    if (min !== undefined && value < min) {
      return { isValid: false, error: `Must be at least ${min}` };
    }

    if (max !== undefined && value > max) {
      return { isValid: false, error: `Must be no more than ${max}` };
    }

    return { isValid: true };
  }

  /**
   * Validate URL format
   */
  static url(url: string): ValidationResult {
    if (!url) {
      return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }

    try {
      new URL(url);
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Please enter a valid URL' };
    }
  }

  /**
   * Validate file size
   */
  static fileSize(file: File, maxSizeInBytes: number): ValidationResult {
    const isValid = file.size <= maxSizeInBytes;
    return {
      isValid,
      error: isValid ? undefined : ERROR_MESSAGES.FILE_TOO_LARGE,
    };
  }

  /**
   * Validate file type
   */
  static fileType(file: File, allowedTypes: string[]): ValidationResult {
    const isValid = allowedTypes.includes(file.type);
    return {
      isValid,
      error: isValid ? undefined : ERROR_MESSAGES.INVALID_FILE_TYPE,
    };
  }

  /**
   * Validate date is in future
   */
  static futureDate(date: Date | string): ValidationResult {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const isValid = dateObj > new Date();
    return {
      isValid,
      error: isValid ? undefined : 'Date must be in the future',
    };
  }

  /**
   * Validate date is in past
   */
  static pastDate(date: Date | string): ValidationResult {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const isValid = dateObj < new Date();
    return {
      isValid,
      error: isValid ? undefined : 'Date must be in the past',
    };
  }

  /**
   * Composite validation - run multiple validators
   */
  static compose(...validators: Array<() => ValidationResult>): ValidationResult {
    for (const validator of validators) {
      const result = validator();
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  }

  /**
   * Sanitize input to prevent XSS
   */
  static sanitizeInput(input: string): string {
    if (!input) return '';

    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Validate and sanitize HTML content
   */
  static sanitizeHtml(html: string, allowedTags: string[] = []): string {
    if (!html) return '';

    // Basic sanitization - in production, use a library like DOMPurify
    let sanitized = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');

    // Remove all tags except allowed ones
    if (allowedTags.length > 0) {
      const allowedPattern = allowedTags.join('|');
      const regex = new RegExp(`<(?!\/?(?:${allowedPattern})\\b)[^>]+>`, 'gi');
      sanitized = sanitized.replace(regex, '');
    }

    return sanitized;
  }

  /**
   * Validate JSON string
   */
  static json(jsonString: string): ValidationResult {
    try {
      JSON.parse(jsonString);
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Invalid JSON format' };
    }
  }

  /**
   * Validate UUID format
   */
  static uuid(uuid: string): ValidationResult {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValid = uuidRegex.test(uuid);
    return {
      isValid,
      error: isValid ? undefined : 'Invalid UUID format',
    };
  }
}

/**
 * Form validation helper
 */
export class FormValidator {
  private errors: Map<string, string> = new Map();

  validate(field: string, value: any, rules: Array<(value: any) => ValidationResult>): boolean {
    this.errors.delete(field);

    for (const rule of rules) {
      const result = rule(value);
      if (!result.isValid) {
        this.errors.set(field, result.error || 'Validation failed');
        return false;
      }
    }

    return true;
  }

  getError(field: string): string | undefined {
    return this.errors.get(field);
  }

  getAllErrors(): Record<string, string> {
    return Object.fromEntries(this.errors);
  }

  hasErrors(): boolean {
    return this.errors.size > 0;
  }

  clearErrors(): void {
    this.errors.clear();
  }

  clearError(field: string): void {
    this.errors.delete(field);
  }
}