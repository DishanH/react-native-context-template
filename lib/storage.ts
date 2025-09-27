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
 * 
 * CHUNKING SYSTEM:
 * To handle the 2048-byte limit in Expo SecureStore, this system automatically
 * chunks large data (especially auth tokens) into smaller pieces:
 * 
 * - Data > 2048 bytes is split into ~1800-byte chunks
 * - Each chunk is stored with a key like "originalkey_chunk_0", "originalkey_chunk_1", etc.
 * - Metadata is stored in "originalkey_chunks" with chunk count and info
 * - When reading, chunks are automatically reassembled
 * - Cleanup methods handle orphaned chunks
 * 
 * This ensures auth tokens exceeding the limit work seamlessly without breaking functionality.
 */
const StorageHelper = {
  /**
   * Get item from storage with automatic chunking support
   */
  getItem: async (key: string): Promise<string | null> => {
    try {
      // Web environment
      if (Platform.OS === 'web') {
        const value = webStorage.getItem(key);
        return Promise.resolve(value);
      }
      
      // React Native environment with SecureStore
      // First try to get the value normally
      const value = await SecureStore.getItemAsync(key);
      
      // Check if this might be chunked data
      if (value === null) {
        // Try to get chunked data
        const chunkInfo = await SecureStore.getItemAsync(`${key}_chunks`);
        if (chunkInfo) {
          const { totalChunks } = JSON.parse(chunkInfo);
          const chunks: string[] = [];
          
          for (let i = 0; i < totalChunks; i++) {
            const chunkKey = `${key}_chunk_${i}`;
            const chunk = await SecureStore.getItemAsync(chunkKey);
            if (chunk) {
              chunks.push(chunk);
            } else {
              console.error(`Missing chunk ${i} for key ${key}`);
              return null;
            }
          }
          
          return chunks.join('');
        }
      }
      
      return value;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  },

  /**
   * Set item in storage with automatic chunking for large values
   */
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      // Check if the value is too large for SecureStore (2048 bytes limit)
      const valueSize = new Blob([value]).size;
      
      // Web environment
      if (Platform.OS === 'web') {
        webStorage.setItem(key, value);
        return Promise.resolve();
      }
      
      // React Native environment with SecureStore
      if (valueSize > 2048) {
        // console.log(`Value for key "${key}" is ${valueSize} bytes, using chunking to handle SecureStore's 2048-byte limit.`);
        
        // Calculate chunk size (leave some buffer for metadata)
        const chunkSize = 1800; // Safe size under 2048 bytes
        const chunks: string[] = [];
        
        // Split the value into chunks
        for (let i = 0; i < value.length; i += chunkSize) {
          chunks.push(value.slice(i, i + chunkSize));
        }
        
        // Clear any existing chunked data for this key first
        await StorageHelper.clearChunkedData(key);
        
        // Store each chunk
        for (let i = 0; i < chunks.length; i++) {
          const chunkKey = `${key}_chunk_${i}`;
          await SecureStore.setItemAsync(chunkKey, chunks[i]);
          await StorageHelper.recordKey(chunkKey);
        }
        
        // Store chunk metadata
        const chunkInfo = {
          totalChunks: chunks.length,
          originalSize: valueSize,
          timestamp: Date.now()
        };
        
        const chunkInfoKey = `${key}_chunks`;
        await SecureStore.setItemAsync(chunkInfoKey, JSON.stringify(chunkInfo));
        await StorageHelper.recordKey(chunkInfoKey);
        
        // Record the main key as well
        await StorageHelper.recordKey(key);
        
        // console.log(`Successfully chunked ${key} into ${chunks.length} pieces`);
      } else {
        // Value is small enough, store normally
        await SecureStore.setItemAsync(key, value);
        await StorageHelper.recordKey(key);
      }

      return Promise.resolve();
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  },

  /**
   * Clear chunked data for a specific key
   */
  clearChunkedData: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') return;
      
      const chunkInfoKey = `${key}_chunks`;
      const chunkInfo = await SecureStore.getItemAsync(chunkInfoKey);
      
      if (chunkInfo) {
        const { totalChunks } = JSON.parse(chunkInfo);
        
        // Remove all chunks
        for (let i = 0; i < totalChunks; i++) {
          const chunkKey = `${key}_chunk_${i}`;
          try {
            await SecureStore.deleteItemAsync(chunkKey);
            await StorageHelper.removeKeyFromRegistry(chunkKey);
          } catch (error) {
            // Chunk might not exist, continue
          }
        }
        
        // Remove chunk info
        try {
          await SecureStore.deleteItemAsync(chunkInfoKey);
          await StorageHelper.removeKeyFromRegistry(chunkInfoKey);
        } catch (error) {
          // Info might not exist, continue
        }
      }
    } catch (error) {
      console.error('Error clearing chunked data:', error);
    }
  },

  /**
   * Remove item from storage (handles both regular and chunked data)
   */
  removeItem: async (key: string): Promise<void> => {
    try {
      // Web environment
      if (Platform.OS === 'web') {
        webStorage.removeItem(key);
        return Promise.resolve();
      }
      
      // React Native environment with SecureStore
      
      // First, try to clear chunked data if it exists
      await StorageHelper.clearChunkedData(key);
      
      // Then remove the main key
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (error) {
        // Key might not exist, that's okay
      }

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
   * Get all storage keys
   */
  getAllKeys: async (): Promise<string[]> => {
    try {
      // Web environment
      if (Platform.OS === 'web') {
        return Promise.resolve(webStorage.getAllKeys());
      }

      // React Native environment with SecureStore
      const allKeysJson = await SecureStore.getItemAsync(STORAGE_KEYS.ALL_SECURE_STORE_KEYS);
      if (allKeysJson) {
        return JSON.parse(allKeysJson) as string[];
      }
      return [];
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
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
    
    // Remove explicitly excluded keys first
    excludeKeys.forEach(key => delete optimized[key]);

    // Remove undefined values to reduce size
    Object.keys(optimized).forEach(key => {
      if (optimized[key] === undefined) {
        delete optimized[key];
      }
    });

    // Remove large nested objects that aren't needed for storage
    const largeObjectKeys = ['supabaseUser', 'profile', 'user_metadata', 'app_metadata'];
    largeObjectKeys.forEach(key => {
      if (optimized[key] && typeof optimized[key] === 'object') {
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
    if (optimized.name && optimized.name.length > 100) {
      optimized.name = optimized.name.substring(0, 100);
    }
    if (optimized.full_name && optimized.full_name.length > 100) {
      optimized.full_name = optimized.full_name.substring(0, 100);
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

      // Special handling for userData if it's too large
      if (key === STORAGE_KEYS.USER_DATA && size > 2048) {
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

          // Debug: Log the actual size and content being stored for userData
      if (key === STORAGE_KEYS.USER_DATA) {
        console.log(`Storing ${key}: ${size} bytes`);
        if (size > 1500) { // Log details if approaching the limit
          console.log('User data content approaching size limit');
          //console.log('User data content:', JSON.stringify(JSON.parse(stringValue), null, 2));
        }
      }

      // Debug: Log chunking for auth-related keys
      if (key.startsWith('sb-') || key.startsWith('supabase.')) {
        console.log(`Storing auth data for ${key}: ${size} bytes`);
        if (size > 2048) {
          console.log(`Auth token will be chunked (${size} bytes > 2048 byte limit)`);
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
  },

  /**
   * Clear all Supabase auth-related storage keys
   * This ensures complete cleanup of auth tokens and prevents stale token errors
   */
  async clearSupabaseAuthData(): Promise<void> {
    try {
      console.log('Clearing Supabase auth data...');

      const allKeys = await StorageHelper.getAllKeys();
      const supabaseKeys = allKeys.filter(key =>
        key.startsWith('sb-') ||
        key.startsWith('supabase.') ||
        key.includes('auth-token') ||
        key.includes('session') ||
        key.includes('refresh') ||
        // Also include chunked data related to auth
        key.includes('_chunk_') ||
        key.includes('_chunks')
      );

      console.log('Found Supabase auth keys:', supabaseKeys);

      // Get unique main keys (excluding chunk keys) to ensure proper cleanup
      const mainKeys = new Set<string>();
      supabaseKeys.forEach(key => {
        if (key.includes('_chunk_')) {
          // Extract main key from chunk key (format: mainkey_chunk_0)
          const mainKey = key.replace(/_chunk_\d+$/, '');
          mainKeys.add(mainKey);
        } else if (key.includes('_chunks')) {
          // Extract main key from chunks info key (format: mainkey_chunks)
          const mainKey = key.replace(/_chunks$/, '');
          mainKeys.add(mainKey);
        } else {
          mainKeys.add(key);
        }
      });

      // Remove all Supabase-related keys (this will handle both regular and chunked data)
      const removePromises = Array.from(mainKeys).map(key => StorageHelper.removeItem(key));
      await Promise.all(removePromises);

      console.log('Cleared Supabase auth data successfully');
    } catch (error) {
      console.error('Error clearing Supabase auth data:', error);
    }
  },

  /**
   * Enhanced clear all with proper auth cleanup
   */
  async clearAuthData(): Promise<void> {
    try {
      // Clear app-specific auth data
      await this.remove(STORAGE_KEYS.USER_DATA);
      await this.setAuthStatus(false);

      // Clear Supabase auth tokens
      await this.clearSupabaseAuthData();

      console.log('Auth data cleared successfully');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },

  /**
   * Check and clean up potentially corrupted auth data on app startup
   * This helps prevent issues with stale or partial token data
   * NOTE: This is now much less aggressive and gives Supabase time to restore session
   */
  async validateAndCleanAuthData(): Promise<{ shouldSignOut: boolean }> {
    try {
      const isAuthenticated = await this.getAuthStatus();

      // If user is not marked as authenticated locally, skip validation
      // Let Supabase handle session restoration naturally
      if (!isAuthenticated) {
        return { shouldSignOut: false };
      }

      // Get all keys to check for specific token corruption issues
      const allKeys = await StorageHelper.getAllKeys();
      const supabaseKeys = allKeys.filter(key =>
        key.startsWith('sb-') ||
        key.startsWith('supabase.')
      );

      // Only clear if we have obvious signs of corruption:
      // 1. Many stale Supabase keys but no current auth status
      // 2. Specific error patterns that indicate token corruption
      if (supabaseKeys.length > 5 && !isAuthenticated) {
        console.log('Found many orphaned auth tokens without auth status, cleaning up');
        await this.clearSupabaseAuthData();
        return { shouldSignOut: true };
      }

      // Check for specific corruption patterns (malformed tokens, etc.)
      // This is much more conservative than before
      for (const key of supabaseKeys) {
        try {
          const value = await StorageHelper.getItem(key);
          if (value && value.includes('undefined') || value === 'null') {
            console.log(`Found corrupted token at ${key}, clearing auth data`);
            await this.clearSupabaseAuthData();
            return { shouldSignOut: true };
          }
        } catch (error) {
          // Skip individual key errors
          continue;
        }
      }

      return { shouldSignOut: false };
    } catch (error) {
      console.error('Error validating auth data:', error);
      // Don't clear everything on validation errors - be more conservative
      return { shouldSignOut: false };
    }
  },

  /**
   * Get storage statistics including chunked data information
   * Useful for debugging storage issues
   */
  async getStorageStats(): Promise<{
    totalKeys: number;
    chunkedKeys: number;
    totalEstimatedSize: number;
    authRelatedKeys: number;
  }> {
    try {
      const allKeys = await StorageHelper.getAllKeys();
      let chunkedKeys = 0;
      let totalEstimatedSize = 0;
      let authRelatedKeys = 0;

      for (const key of allKeys) {
        if (key.includes('_chunks') || key.includes('_chunk_')) {
          chunkedKeys++;
        }
        
        if (key.startsWith('sb-') || key.startsWith('supabase.') || key.includes('auth') || key.includes('session')) {
          authRelatedKeys++;
        }

        // Estimate size (this is rough since we'd need to read each key for exact size)
        if (!key.includes('_chunk_') && !key.includes('_chunks')) {
          try {
            const value = await this.get(key, false);
            if (value) {
              totalEstimatedSize += new Blob([value]).size;
            }
          } catch (error) {
            // Skip errors for individual keys
          }
        }
      }

      return {
        totalKeys: allKeys.length,
        chunkedKeys,
        totalEstimatedSize,
        authRelatedKeys
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        totalKeys: 0,
        chunkedKeys: 0,
        totalEstimatedSize: 0,
        authRelatedKeys: 0
      };
    }
  },

  /**
   * Check if a specific key is using chunked storage
   */
  async isKeyChunked(key: string): Promise<boolean> {
    try {
      if (Platform.OS === 'web') return false;
      
      const chunkInfo = await StorageHelper.getItem(`${key}_chunks`);
      return chunkInfo !== null;
    } catch (error) {
      return false;
    }
  },

  /**
   * Manually trigger cleanup of orphaned chunk data
   * This can help if chunked data gets corrupted
   */
  async cleanupOrphanedChunks(): Promise<number> {
    try {
      if (Platform.OS === 'web') return 0;

      const allKeys = await StorageHelper.getAllKeys();
      const chunkKeys = allKeys.filter(key => key.includes('_chunk_'));
      const chunkInfoKeys = allKeys.filter(key => key.includes('_chunks'));
      let cleanedCount = 0;

      // Check for chunk keys without corresponding chunk info
      for (const chunkKey of chunkKeys) {
        const mainKey = chunkKey.replace(/_chunk_\d+$/, '');
        const chunkInfoKey = `${mainKey}_chunks`;
        
        if (!chunkInfoKeys.includes(chunkInfoKey)) {
          console.log(`Cleaning orphaned chunk: ${chunkKey}`);
          await StorageHelper.removeItem(chunkKey);
          cleanedCount++;
        }
      }

      // Check for chunk info without corresponding chunks
      for (const chunkInfoKey of chunkInfoKeys) {
        const mainKey = chunkInfoKey.replace(/_chunks$/, '');
        try {
          const chunkInfo = await StorageHelper.getItem(chunkInfoKey);
          if (chunkInfo) {
            const { totalChunks } = JSON.parse(chunkInfo);
            let hasAllChunks = true;
            
            for (let i = 0; i < totalChunks; i++) {
              const chunkKey = `${mainKey}_chunk_${i}`;
              if (!allKeys.includes(chunkKey)) {
                hasAllChunks = false;
                break;
              }
            }
            
            if (!hasAllChunks) {
              console.log(`Cleaning orphaned chunk info: ${chunkInfoKey}`);
              await StorageHelper.removeItem(chunkInfoKey);
              cleanedCount++;
            }
          }
        } catch (error) {
          // Invalid chunk info, remove it
          console.log(`Cleaning invalid chunk info: ${chunkInfoKey}`);
          await StorageHelper.removeItem(chunkInfoKey);
          cleanedCount++;
        }
      }

      console.log(`Cleaned up ${cleanedCount} orphaned chunk entries`);
      return cleanedCount;
    } catch (error) {
      console.error('Error cleaning up orphaned chunks:', error);
      return 0;
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