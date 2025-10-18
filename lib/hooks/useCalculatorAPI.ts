/**
 * React Hook for Calculator API Calls
 * Handles CAPTCHA, loading states, and error handling
 */

import { useState, useCallback, useEffect } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface UseCalculatorOptions {
  calculator: 'fie' | 'deductible' | 'assessment';
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface CalculatorState {
  loading: boolean;
  error: string | null;
  data: any | null;
}

/**
 * Load reCAPTCHA script
 */
function loadRecaptchaScript(): Promise<void> {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.grecaptcha) {
      resolve();
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

/**
 * Get reCAPTCHA token
 */
async function getCaptchaToken(action: string): Promise<string> {
  // Skip in development unless explicitly enabled
  if (process.env.NODE_ENV === 'development' &&
      process.env.NEXT_PUBLIC_ENABLE_CAPTCHA !== 'true') {
    return 'development-token';
  }

  await loadRecaptchaScript();

  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error('reCAPTCHA not loaded'));
      return;
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action })
        .then(resolve)
        .catch(reject);
    });
  });
}

/**
 * Custom hook for calculator API calls
 */
export function useCalculatorAPI(options: UseCalculatorOptions) {
  const [state, setState] = useState<CalculatorState>({
    loading: false,
    error: null,
    data: null
  });

  // Load reCAPTCHA on mount
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' ||
        process.env.NEXT_PUBLIC_ENABLE_CAPTCHA === 'true') {
      loadRecaptchaScript().catch(console.error);
    }
  }, []);

  const calculate = useCallback(async (input: any) => {
    setState({ loading: true, error: null, data: null });

    try {
      // Get CAPTCHA token
      let captchaToken: string | undefined;
      try {
        captchaToken = await getCaptchaToken(`${options.calculator}_calculate`);
      } catch (error) {
        console.error('Failed to get CAPTCHA token:', error);
        // Continue without token in development
        if (process.env.NODE_ENV === 'production') {
          throw new Error('Security verification failed. Please refresh and try again.');
        }
      }

      // Make API call
      const response = await fetch(`/api/calculators/${options.calculator}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add development bypass header if needed
          ...(process.env.NODE_ENV === 'development' && {
            'x-skip-captcha': 'development'
          })
        },
        body: JSON.stringify({
          ...input,
          captchaToken
        })
      });

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const message = retryAfter
          ? `You are making requests too quickly. Please wait ${retryAfter} seconds and try again.`
          : 'You are making requests too quickly. Please wait a moment and try again.';

        setState({ loading: false, error: message, data: null });
        options.onError?.(message);
        return;
      }

      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || errorData.error || 'Calculation failed. Please try again.';

        setState({ loading: false, error: message, data: null });
        options.onError?.(message);
        return;
      }

      // Success
      const result = await response.json();

      if (result.success && result.data) {
        setState({ loading: false, error: null, data: result.data });
        options.onSuccess?.(result.data);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'An unexpected error occurred. Please try again.';

      setState({ loading: false, error: message, data: null });
      options.onError?.(message);
    }
  }, [options]);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  return {
    calculate,
    reset,
    loading: state.loading,
    error: state.error,
    data: state.data
  };
}

/**
 * Specific hooks for each calculator
 */
export function useFIECalculator(options?: Omit<UseCalculatorOptions, 'calculator'>) {
  return useCalculatorAPI({ ...options, calculator: 'fie' });
}

export function useDeductibleAnalyzer(options?: Omit<UseCalculatorOptions, 'calculator'>) {
  return useCalculatorAPI({ ...options, calculator: 'deductible' });
}

export function useAssessment(options?: Omit<UseCalculatorOptions, 'calculator'>) {
  return useCalculatorAPI({ ...options, calculator: 'assessment' });
}