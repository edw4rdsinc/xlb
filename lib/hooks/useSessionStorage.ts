/**
 * useSessionStorage Hook
 * A reusable hook for managing session storage with automatic serialization and hydration
 *
 * @example
 * const [data, setData, clearData] = useSessionStorage('my-key', { count: 0 });
 */

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((prevValue: T) => T);

/**
 * Custom hook for managing session storage
 * @param key - The session storage key
 * @param initialValue - The initial value if no stored value exists
 * @param options - Optional configuration
 * @returns [value, setValue, remove] tuple
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    syncAcrossTabs?: boolean;
  }
): [T, (value: SetValue<T>) => void, () => void] {
  const serialize = options?.serialize || JSON.stringify;
  const deserialize = options?.deserialize || JSON.parse;

  // Initialize state with value from session storage or initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.error(`Error loading session storage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update session storage when state changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.sessionStorage.setItem(key, serialize(storedValue));
    } catch (error) {
      console.error(`Error saving to session storage key "${key}":`, error);
    }
  }, [key, storedValue, serialize]);

  // Setter function that updates both state and session storage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        setStoredValue((prevValue) => {
          const valueToStore = value instanceof Function ? value(prevValue) : value;
          return valueToStore;
        });
      } catch (error) {
        console.error(`Error setting session storage key "${key}":`, error);
      }
    },
    [key]
  );

  // Remove function that clears both state and session storage
  const remove = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing session storage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Optional: Sync across tabs/windows (if using localStorage instead)
  useEffect(() => {
    if (!options?.syncAcrossTabs || typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(deserialize(e.newValue));
        } catch (error) {
          console.error(`Error syncing session storage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserialize, options?.syncAcrossTabs]);

  return [storedValue, setValue, remove];
}

/**
 * Utility function to clear all session storage (use with caution)
 */
export function clearAllSessionStorage(): void {
  if (typeof window !== 'undefined') {
    window.sessionStorage.clear();
  }
}

/**
 * Utility function to get all session storage keys
 */
export function getAllSessionStorageKeys(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const keys: string[] = [];
  for (let i = 0; i < window.sessionStorage.length; i++) {
    const key = window.sessionStorage.key(i);
    if (key) keys.push(key);
  }
  return keys;
}

/**
 * Utility function to get session storage size in bytes
 */
export function getSessionStorageSize(): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  let size = 0;
  for (const key in window.sessionStorage) {
    if (window.sessionStorage.hasOwnProperty(key)) {
      size += key.length + window.sessionStorage[key].length;
    }
  }
  return size * 2; // Multiply by 2 for UTF-16 encoding
}