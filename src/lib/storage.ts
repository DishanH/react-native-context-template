import { Platform } from 'react-native';

// Storage keys
export const STORAGE_KEYS = {
  HAS_COMPLETED_ONBOARDING: 'hasCompletedOnboarding',
  USER_THEME: 'userTheme',
  USER_PREFERENCES: 'userPreferences',
};

/**
 * Safe web localStorage wrapper to prevent errors
 */
const webStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.error(`Error accessing localStorage for ${key}:`, error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`Error setting localStorage for ${key}:`, error);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage for ${key}:`, error);
    }
  },
  clear: (): void => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

/**
 * Simple in-memory storage fallback
 */
const memoryStorage = new Map<string, string>();

/**
 * Cross-platform storage utility that uses:
 * - localStorage for web
 * - In-memory storage for native platforms
 */
export const AppStorage = {
  /**
   * Store a value
   * @param key Storage key
   * @param value Value to store (will be stringified if not a string)
   */
  async set(key: string, value: any): Promise<void> {
    const stringValue = typeof value !== 'string' ? JSON.stringify(value) : value;
    
    try {
      // For web, use localStorage
      if (Platform.OS === 'web') {
        webStorage.setItem(key, stringValue);
        return;
      }
      
      // For native platforms, use in-memory storage for now
      memoryStorage.set(key, stringValue);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
    }
  },
  
  /**
   * Retrieve a value
   * @param key Storage key
   * @param parse Whether to parse the value as JSON
   */
  async get(key: string, parse = false): Promise<any> {
    try {
      let value: string | null = null;
      
      // For web, use localStorage
      if (Platform.OS === 'web') {
        value = webStorage.getItem(key);
      }
      // For native platforms, use in-memory storage for now
      else {
        value = memoryStorage.get(key) || null;
      }
      
      if (value === null) return null;
      
      return parse ? JSON.parse(value) : value;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  },
  
  /**
   * Remove a value
   * @param key Storage key
   */
  async remove(key: string): Promise<void> {
    try {
      // For web, use localStorage
      if (Platform.OS === 'web') {
        webStorage.removeItem(key);
        return;
      }
      
      // For native platforms, use in-memory storage for now
      memoryStorage.delete(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },
  
  /**
   * Clear all stored values
   */
  async clear(): Promise<void> {
    try {
      // For web, use localStorage
      if (Platform.OS === 'web') {
        webStorage.clear();
      }
      
      // For native platforms, clear in-memory storage
      memoryStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};

/**
 * Check if the user has completed the onboarding process
 * @returns Promise<boolean> true if onboarding has been completed, false otherwise
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  const value = await AppStorage.get(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
  return value === 'true';
}

/**
 * Set onboarding as completed
 */
export async function setOnboardingCompleted(): Promise<void> {
  await AppStorage.set(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, 'true');
}

/**
 * Reset onboarding status (for testing purposes)
 */
export async function resetOnboardingStatus(): Promise<void> {
  await AppStorage.remove(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
} 