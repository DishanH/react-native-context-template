import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Storage keys
const STORAGE_KEYS = {
  IS_AUTHENTICATED: 'isAuthenticated',
  ONBOARDING_COMPLETE: 'onboardingComplete',
  USER_DATA: 'userData',
  USER_PREFERENCES: 'userPreferences',
  // Keys registry for SecureStore
  ALL_SECURE_STORE_KEYS: 'all_secure_store_keys',
} as const;

// For web platform
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
  getAllKeys: (): string[] => {
    const keys: string[] = [];
    try {
      if (typeof localStorage !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) keys.push(key);
        }
      }
    } catch (error) {
      console.error('Error getting all localStorage keys:', error);
    }
    return keys;
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
 * Storage helper for cross-platform compatibility
 * This handles both Expo SecureStore and web localStorage
 */
const StorageHelper = {
  /**
   * Get item from storage
   */
  getItem: async (key: string): Promise<string | null> => {
    try {
      // Web environment
      if (Platform.OS === 'web') {
        const value = webStorage.getItem(key);
        return Promise.resolve(value);
      }
      // React Native environment with SecureStore
      const value = await SecureStore.getItemAsync(key);
      return value;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  },

  /**
   * Set item in storage
   */
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      // Check if the value is too large for SecureStore (2048 bytes limit)
      const valueSize = new Blob([value]).size;
      if (Platform.OS !== 'web' && valueSize > 2048) {
        console.warn(`Warning: Value for key "${key}" is ${valueSize} bytes, which exceeds SecureStore's 2048-byte limit. Consider optimizing the data structure.`);
        
        // For very large data, we could implement chunking or use AsyncStorage instead
        // For now, we'll continue with SecureStore but log the warning
      }

      // Web environment
      if (Platform.OS === 'web') {
        webStorage.setItem(key, value);
        return Promise.resolve();
      }
      // React Native environment with SecureStore
      await SecureStore.setItemAsync(key, value);
      
      // Record the key for tracking
      await StorageHelper.recordKey(key);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  },

  /**
   * Remove item from storage
   */
  removeItem: async (key: string): Promise<void> => {
    try {
      // Web environment
      if (Platform.OS === 'web') {
        webStorage.removeItem(key);
        return Promise.resolve();
      }
      // React Native environment with SecureStore
      await SecureStore.deleteItemAsync(key);
      
      // Remove key from registry
      await StorageHelper.removeKeyFromRegistry(key);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  },

  /**
   * Clear all items with a certain prefix
   */
  clearItemsWithPrefix: async (prefix: string): Promise<void> => {
    try {
      // Web environment
      if (Platform.OS === 'web') {
        const keysToRemove = webStorage.getAllKeys().filter(key => key.startsWith(prefix));
        keysToRemove.forEach(key => webStorage.removeItem(key));
        return Promise.resolve();
      } 
      
      // React Native environment with SecureStore
      const allKeysJson = await SecureStore.getItemAsync(STORAGE_KEYS.ALL_SECURE_STORE_KEYS);
      if (allKeysJson) {
        const allKeys = JSON.parse(allKeysJson) as string[];
        const keysToRemove = allKeys.filter(key => key.startsWith(prefix));
        
        // Delete each key
        for (const key of keysToRemove) {
          await SecureStore.deleteItemAsync(key);
        }
        
        // Update the record of keys
        const updatedKeys = allKeys.filter(key => !key.startsWith(prefix));
        await SecureStore.setItemAsync(STORAGE_KEYS.ALL_SECURE_STORE_KEYS, JSON.stringify(updatedKeys));
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error clearing items with prefix:', error);
    }
  },
  
  /**
   * Helper to record a new key in the keys registry
   * This is needed for SecureStore to keep track of all keys
   */
  recordKey: async (key: string): Promise<void> => {
    if (Platform.OS === 'web' || key === STORAGE_KEYS.ALL_SECURE_STORE_KEYS) return;
    
    try {
      const allKeysJson = await SecureStore.getItemAsync(STORAGE_KEYS.ALL_SECURE_STORE_KEYS);
      const allKeys = allKeysJson ? JSON.parse(allKeysJson) as string[] : [];
      
      if (!allKeys.includes(key)) {
        allKeys.push(key);
        await SecureStore.setItemAsync(STORAGE_KEYS.ALL_SECURE_STORE_KEYS, JSON.stringify(allKeys));
      }
    } catch (error) {
      console.error('Error recording key:', error);
    }
  },

  /**
   * Helper to remove a key from the keys registry
   */
  removeKeyFromRegistry: async (key: string): Promise<void> => {
    if (Platform.OS === 'web' || key === STORAGE_KEYS.ALL_SECURE_STORE_KEYS) return;
    
    try {
      const allKeysJson = await SecureStore.getItemAsync(STORAGE_KEYS.ALL_SECURE_STORE_KEYS);
      if (allKeysJson) {
        const allKeys = JSON.parse(allKeysJson) as string[];
        const updatedKeys = allKeys.filter(k => k !== key);
        await SecureStore.setItemAsync(STORAGE_KEYS.ALL_SECURE_STORE_KEYS, JSON.stringify(updatedKeys));
      }
    } catch (error) {
      console.error('Error removing key from registry:', error);
    }
  },

  /**
   * Clear all storage
   */
  clearAll: async (): Promise<void> => {
    try {
      // Web environment
      if (Platform.OS === 'web') {
        webStorage.clear();
        return Promise.resolve();
      }
      
      // React Native environment with SecureStore
      const allKeysJson = await SecureStore.getItemAsync(STORAGE_KEYS.ALL_SECURE_STORE_KEYS);
      if (allKeysJson) {
        const allKeys = JSON.parse(allKeysJson) as string[];
        
        // Delete each key
        for (const key of allKeys) {
          await SecureStore.deleteItemAsync(key);
        }
        
        // Clear the keys registry
        await SecureStore.deleteItemAsync(STORAGE_KEYS.ALL_SECURE_STORE_KEYS);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error clearing all storage:', error);
    }
  }
};

// Storage utility functions with typed methods
export const storage = {
  // Utility: Get the byte size of a string
  getByteSize: (str: string): number => {
    return new Blob([str]).size;
  },

  // Utility: Optimize object for storage by removing unnecessary fields
  optimizeForStorage: (obj: any, excludeKeys: string[] = []): any => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const optimized = { ...obj };
    excludeKeys.forEach(key => delete optimized[key]);
    
    // Remove undefined values to reduce size
    Object.keys(optimized).forEach(key => {
      if (optimized[key] === undefined) {
        delete optimized[key];
      }
    });
    
    // Additional optimization: truncate long string fields
    if (optimized.bio && optimized.bio.length > 100) {
      optimized.bio = optimized.bio.substring(0, 100);
    }
    if (optimized.email && optimized.email.length > 100) {
      optimized.email = optimized.email.substring(0, 100);
    }
    
    return optimized;
  },

  // Get authentication status
  async getAuthStatus(): Promise<boolean> {
    try {
      const value = await StorageHelper.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
      return value === 'true';
    } catch (error) {
      console.error('Error getting auth status:', error);
      return false;
    }
  },

  // Set authentication status
  async setAuthStatus(isAuthenticated: boolean): Promise<void> {
    try {
      await StorageHelper.setItem(STORAGE_KEYS.IS_AUTHENTICATED, isAuthenticated.toString());
    } catch (error) {
      console.error('Error setting auth status:', error);
    }
  },

  // Get onboarding completion status
  async getOnboardingStatus(): Promise<boolean> {
    try {
      const value = await StorageHelper.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
      return value === 'true';
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      return false;
    }
  },

  // Set onboarding completion status
  async setOnboardingStatus(isComplete: boolean): Promise<void> {
    try {
      await StorageHelper.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, isComplete.toString());
    } catch (error) {
      console.error('Error setting onboarding status:', error);
    }
  },



  // Get user data
  async getUserData(): Promise<any> {
    try {
      const value = await StorageHelper.getItem(STORAGE_KEYS.USER_DATA);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Set user data
  async setUserData(userData: any): Promise<void> {
    try {
      await StorageHelper.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  },

  // Get user preferences
  async getUserPreferences(): Promise<any> {
    try {
      const value = await StorageHelper.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  },

  // Set user preferences
  async setUserPreferences(preferences: any): Promise<void> {
    try {
      await StorageHelper.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error setting user preferences:', error);
    }
  },

  // Clear all storage
  async clearAll(): Promise<void> {
    try {
      await StorageHelper.clearAll();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  // Reset onboarding (for testing)
  async resetOnboarding(): Promise<void> {
    try {
      await StorageHelper.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  },

  // Generic methods for flexible usage
  async get(key: string, parse = false): Promise<any> {
    try {
      const value = await StorageHelper.getItem(key);
      if (value === null) return null;
      return parse ? JSON.parse(value) : value;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  },

  async set(key: string, value: any): Promise<void> {
    try {
      let stringValue = typeof value !== 'string' ? JSON.stringify(value) : value;
      let size = new Blob([stringValue]).size;
      
      // Special handling for user_data if it's too large
      if (key === 'user_data' && size > 2048) {
        console.warn(`User data is ${size} bytes, applying aggressive optimization...`);
        
        // Store only essential fields for user_data
        const essentialData = {
          id: value.id,
          email: value.email ? value.email.substring(0, 50) : '',
          name: value.name ? value.name.substring(0, 50) : '',
          isAuthenticated: value.isAuthenticated
        };
        
        stringValue = JSON.stringify(essentialData);
        size = new Blob([stringValue]).size;
        console.log(`Optimized user data to ${size} bytes (essential fields only)`);
      }
      
      // Debug: Log the actual size and content being stored for user_data
      if (key === 'user_data') {
        console.log(`Storing ${key}: ${size} bytes`);
        if (size > 1500) { // Log details if approaching the limit
          console.log('User data content');
          //console.log('User data content:', JSON.stringify(JSON.parse(stringValue), null, 2));
        }
      }
      
      await StorageHelper.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await StorageHelper.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }
};

// Legacy compatibility functions for existing code
export async function hasCompletedOnboarding(): Promise<boolean> {
  return storage.getOnboardingStatus();
}

export async function setOnboardingCompleted(): Promise<void> {
  return storage.setOnboardingStatus(true);
}

export async function resetOnboardingStatus(): Promise<void> {
  return storage.resetOnboarding();
}

// Export storage keys for external usage
export { STORAGE_KEYS };

// Export the StorageHelper for advanced usage
export { StorageHelper };

// Default export
export default storage; 