/**
 * Input Sanitization Utilities
 * Prevents XSS, SQL injection, and other injection attacks
 */

import type { JSONValue } from '@/lib/types/common';

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize string input to prevent SQL injection
 * Escapes special characters and validates input
 */
export function sanitizeForSQL(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length to prevent overflow attacks
  const MAX_LENGTH = 255;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH);
  }

  // Escape SQL special characters for LIKE queries
  // Note: Supabase/PostgreSQL handles parameterization, but extra safety for LIKE patterns
  sanitized = sanitized
    .replace(/[%_]/g, '\\$&') // Escape LIKE wildcards
    .replace(/['";]/g, ''); // Remove quotes and semicolons

  return sanitized;
}

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHTML(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Configure DOMPurify
  const config = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false,
  };

  return DOMPurify.sanitize(input, config);
}

/**
 * Sanitize and validate email addresses
 */
export function sanitizeEmail(email: string): string | null {
  if (typeof email !== 'string') {
    return null;
  }

  // Convert to lowercase and trim
  const sanitized = email.toLowerCase().trim();

  // Basic email validation regex
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  if (!emailRegex.test(sanitized)) {
    return null;
  }

  // Additional checks
  if (sanitized.length > 254) { // Max email length per RFC
    return null;
  }

  return sanitized;
}

/**
 * Sanitize player names for database storage
 */
export function sanitizePlayerName(name: string): string {
  if (typeof name !== 'string') {
    return '';
  }

  // Remove any HTML tags
  let sanitized = name.replace(/<[^>]*>/g, '');

  // Allow only letters, numbers, spaces, hyphens, apostrophes, and periods
  sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-'.]/g, '');

  // Normalize multiple spaces to single space
  sanitized = sanitized.replace(/\s+/g, ' ');

  // Trim and limit length
  sanitized = sanitized.trim();
  const MAX_NAME_LENGTH = 100;
  if (sanitized.length > MAX_NAME_LENGTH) {
    sanitized = sanitized.substring(0, MAX_NAME_LENGTH);
  }

  return sanitized;
}

/**
 * Validate and sanitize UUID
 */
export function sanitizeUUID(uuid: string): string | null {
  if (typeof uuid !== 'string') {
    return null;
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  const trimmed = uuid.trim().toLowerCase();

  if (!uuidRegex.test(trimmed)) {
    return null;
  }

  return trimmed;
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(input: any, options?: {
  min?: number;
  max?: number;
  allowDecimals?: boolean;
}): number | null {
  const num = Number(input);

  if (isNaN(num) || !isFinite(num)) {
    return null;
  }

  if (options) {
    if (options.min !== undefined && num < options.min) {
      return null;
    }
    if (options.max !== undefined && num > options.max) {
      return null;
    }
    if (!options.allowDecimals && num % 1 !== 0) {
      return null;
    }
  }

  return num;
}

/**
 * Sanitize URL to prevent open redirect vulnerabilities
 */
export function sanitizeURL(url: string, allowedHosts?: string[]): string | null {
  if (typeof url !== 'string') {
    return null;
  }

  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    // Check against allowed hosts if provided
    if (allowedHosts && !allowedHosts.includes(parsed.hostname)) {
      return null;
    }

    // Remove any credentials from URL
    parsed.username = '';
    parsed.password = '';

    return parsed.toString();
  } catch {
    // If it's a relative URL, validate it
    if (url.startsWith('/') && !url.startsWith('//')) {
      // Remove any potentially dangerous characters
      return url.replace(/[<>'"]/g, '');
    }
    return null;
  }
}

/**
 * Sanitize JSON data
 */
export function sanitizeJSON(data: JSONValue): JSONValue {
  if (data === null || data === undefined) {
    return null;
  }

  if (typeof data === 'string') {
    return sanitizeForSQL(data);
  }

  if (typeof data === 'number') {
    return sanitizeNumber(data);
  }

  if (typeof data === 'boolean') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeJSON(item));
  }

  if (typeof data === 'object') {
    const sanitized: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Sanitize the key as well
        const sanitizedKey = sanitizeForSQL(key);
        sanitized[sanitizedKey] = sanitizeJSON(data[key]);
      }
    }
    return sanitized;
  }

  // For any other types, return null for safety
  return null;
}

/**
 * Validate and sanitize file uploads
 */
export function sanitizeFileName(filename: string): string {
  if (typeof filename !== 'string') {
    return 'file';
  }

  // Remove path components
  let name = filename.split(/[/\\]/).pop() || 'file';

  // Remove dangerous characters
  name = name.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Ensure it has a safe extension
  const parts = name.split('.');
  if (parts.length > 1) {
    const ext = parts.pop()!.toLowerCase();
    const safeExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'txt', 'csv', 'xlsx', 'docx'];
    if (!safeExtensions.includes(ext)) {
      name = parts.join('.') + '.txt'; // Default to .txt for safety
    }
  }

  // Limit length
  if (name.length > 255) {
    name = name.substring(0, 255);
  }

  return name;
}

/**
 * Strip all HTML tags for plain text output
 */
export function stripHTML(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  // Use DOMPurify to convert to plain text
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
}