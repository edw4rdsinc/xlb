/**
 * Centralized constants for the application
 * Eliminates magic numbers and strings throughout the codebase
 */

// API Related Constants
export const API_CONSTANTS = {
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  RATE_LIMIT_WINDOW: 60000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 60,
  MAX_PAYLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  CACHE_DURATION: 3600, // 1 hour in seconds
} as const;

// Fantasy Football Constants
export const FANTASY_CONSTANTS = {
  MIN_LINEUP_SIZE: 8,
  MAX_ELITE_PLAYERS: 2,
  POSITIONS: ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'] as const,
  WEEKS_IN_SEASON: 18,
  ROSTER_POSITIONS: {
    QB: 1,
    RB: 2,
    WR: 2,
    TE: 1,
    K: 1,
    DEF: 1,
  },
  SCORING: {
    PASSING_TD: 6,
    PASSING_YARD: 0.04,
    RUSHING_TD: 6,
    RUSHING_YARD: 0.1,
    RECEIVING_TD: 6,
    RECEIVING_YARD: 0.1,
    RECEPTION: 1, // PPR
    FIELD_GOAL: 3,
    PAT: 1,
    DEFENSE_TD: 6,
    INTERCEPTION: 2,
    SAFETY: 2,
    SACK: 1,
    TWO_POINT_CONVERSION: 2,
  },
} as const;

// Form Validation Constants
export const VALIDATION_CONSTANTS = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s-()]+$/,
  ZIP_REGEX: /^\d{5}(-\d{4})?$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_COMPANY_NAME_LENGTH: 2,
  MAX_COMPANY_NAME_LENGTH: 200,
  MAX_MESSAGE_LENGTH: 1000,
} as const;

// UI Constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300, // ms
  DEBOUNCE_DELAY: 500, // ms
  THROTTLE_DELAY: 200, // ms
  TOAST_DURATION: 5000, // ms
  MODAL_Z_INDEX: 1000,
  LOADING_DELAY: 200, // ms
  PAGE_SIZE: 20,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
  FILE_TOO_LARGE: 'File size exceeds maximum allowed size.',
  INVALID_FILE_TYPE: 'Invalid file type.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH} characters long.`,
  PASSWORD_TOO_LONG: `Password must be no more than ${VALIDATION_CONSTANTS.MAX_PASSWORD_LENGTH} characters long.`,
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully.',
  SUBMITTED: 'Form submitted successfully.',
  DELETED: 'Deleted successfully.',
  UPDATED: 'Updated successfully.',
  CREATED: 'Created successfully.',
  COPIED: 'Copied to clipboard.',
  EMAIL_SENT: 'Email sent successfully.',
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logout successful.',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  SOLUTIONS: '/solutions',
  RESOURCES: '/resources',
  TOOLKIT: '/toolkit',
  PRIVACY: '/privacy-policy',
  TERMS: '/terms',
  FANTASY: {
    HOME: '/fantasy-football',
    SUBMIT: '/fantasy-football/submit',
    RESULTS: '/fantasy-football/results',
    LEADERBOARD: '/fantasy-football/leaderboard',
    ROSTERS: '/fantasy-football/rosters',
    LINEUP: '/fantasy-football/lineup',
  },
  ADMIN: {
    HOME: '/admin',
    DASHBOARD: '/admin/dashboard',
    SCORING: '/admin/scoring',
    FANTASY: '/admin/fantasy-football',
  },
  EMPLOYEE: {
    LOGIN: '/employee/login',
    DASHBOARD: '/employee/dashboard',
    PDF_PROCESSOR: '/employee/pdf-processor',
    CONFLICT_ANALYZER: '/employee/conflict-analyzer',
  },
  API: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      MAGIC_LINK: '/api/auth/magic-link',
    },
    FANTASY: {
      SUBMIT_LINEUP: '/api/lineup/submit',
      LEADERBOARD: '/api/leaderboard',
      ROUNDS: '/api/rounds',
    },
    CALCULATORS: {
      DEDUCTIBLE: '/api/calculators/deductible/calculate',
      FIE: '/api/calculators/fie/calculate',
    },
  },
} as const;

// Environment Variables
export const ENV = {
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
  IS_CLIENT: typeof window !== 'undefined',
  IS_SERVER: typeof window === 'undefined',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY h:mm A',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
  RELATIVE: 'relative', // for use with date libraries that support relative time
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  FORM_DRAFT: 'form_draft',
  THEME: 'theme',
  ANALYTICS_CONSENT: 'analytics_consent',
  ONBOARDING_COMPLETE: 'onboarding_complete',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export type FantasyPosition = typeof FANTASY_CONSTANTS.POSITIONS[number];
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];