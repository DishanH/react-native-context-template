import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  IS_AUTHENTICATED: 'isAuthenticated',
  ONBOARDING_COMPLETE: 'onboardingComplete',
  USER_DATA: 'userData',
  THEME: 'theme',
} as const;

// Storage utility functions
export const storage = {
  // Get authentication status
  async getAuthStatus(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
      return value === 'true';
    } catch (error) {
      console.error('Error getting auth status:', error);
      return false;
    }
  },

  // Set authentication status
  async setAuthStatus(isAuthenticated: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, isAuthenticated.toString());
    } catch (error) {
      console.error('Error setting auth status:', error);
    }
  },

  // Get onboarding completion status
  async getOnboardingStatus(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
      return value === 'true';
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      return false;
    }
  },

  // Set onboarding completion status
  async setOnboardingStatus(isComplete: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, isComplete.toString());
    } catch (error) {
      console.error('Error setting onboarding status:', error);
    }
  },

  // Get theme preference
  async getTheme(): Promise<'light' | 'dark' | null> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      return value as 'light' | 'dark' | null;
    } catch (error) {
      console.error('Error getting theme:', error);
      return null;
    }
  },

  // Set theme preference
  async setTheme(theme: 'light' | 'dark'): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  },

  // Get user data
  async getUserData(): Promise<any> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Set user data
  async setUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  },

  // Clear all storage
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.IS_AUTHENTICATED,
        STORAGE_KEYS.ONBOARDING_COMPLETE,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.THEME,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  // Reset onboarding (for testing)
  async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  },
}; 