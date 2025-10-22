/**
 * React Hook for Calculator API Calls
 * Handles CAPTCHA (Cloudflare Turnstile), loading states, and error handling
 */

import { useState, useCallback, useEffect } from 'react';

declare global {
  interface Window {
    turnstile: any;
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
 * Load Cloudflare Turnstile script
 */
function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.turnstile) {
      resolve();
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

/**
 * Get Turnstile token
 */
async function getCaptchaToken(action: string): Promise<string> {
  // Skip in development unless explicitly enabled
  if (process.env.NODE_ENV === 'development' &&
      process.env.NEXT_PUBLIC_ENABLE_CAPTCHA !== 'true') {
    return 'development-token';
  }

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) {
    console.error('NEXT_PUBLIC_TURNSTILE_SITE_KEY not configured');
    throw new Error('Security configuration missing');
  }

  await loadTurnstileScript();

  return new Promise((resolve, reject) => {
    if (!window.turnstile) {
      reject(new Error('Turnstile not loaded'));
      return;
    }

    // Create a container for the widget (invisible mode)
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-1000px';
    container.style.left = '-1000px';
    document.body.appendChild(container);

    // Render the widget
    const widgetId = window.turnstile.render(container, {
      sitekey: siteKey,
      callback: (token: string) => {
        // Clean up the container
        document.body.removeChild(container);
        resolve(token);
      },
      'error-callback': () => {
        // Clean up the container
        document.body.removeChild(container);
        reject(new Error('Turnstile verification failed'));
      },
      action: action,
      execution: 'execute',
      appearance: 'interaction-only'
    });

    // Execute the challenge immediately (for invisible mode)
    window.turnstile.execute(container, {
      sitekey: siteKey,
      action: action
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

  // Load Turnstile on mount
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' ||
        process.env.NEXT_PUBLIC_ENABLE_CAPTCHA === 'true') {
      loadTurnstileScript().catch(console.error);
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