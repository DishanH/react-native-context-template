import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../lib/storage';

// Define the shape of user preferences
type UserPreferences = {
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReporting: boolean;
    dataSharing: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    highContrast: boolean;
    reduceMotion: boolean;
    voiceOver: boolean;
  };
  language: string;
  region: string;
  currency: string;
  autoLock: boolean;
  biometricAuth: boolean;
};

// Define the shape of the settings context
type SettingsContextType = {
  // User preferences
  preferences: UserPreferences;
  isLoading: boolean;
  
  // Notification settings
  updateNotificationSettings: (notifications: Partial<UserPreferences['notifications']>) => Promise<void>;
  
  // Privacy settings
  updatePrivacySettings: (privacy: Partial<UserPreferences['privacy']>) => Promise<void>;
  
  // Accessibility settings
  updateAccessibilitySettings: (accessibility: Partial<UserPreferences['accessibility']>) => Promise<void>;
  
  // General settings
  updateLanguage: (language: string) => Promise<void>;
  updateRegion: (region: string) => Promise<void>;
  updateCurrency: (currency: string) => Promise<void>;
  updateAutoLock: (autoLock: boolean) => Promise<void>;
  updateBiometricAuth: (biometricAuth: boolean) => Promise<void>;
  
  // Utility methods
  resetToDefaults: () => Promise<void>;
  exportSettings: () => Promise<string>;
  importSettings: (settings: string) => Promise<void>;
};

// Default preferences
const defaultPreferences: UserPreferences = {
  notifications: {
    push: true,
    email: true,
    sms: false,
    marketing: false,
  },
  privacy: {
    analytics: true,
    crashReporting: true,
    dataSharing: false,
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    voiceOver: false,
  },
  language: 'en',
  region: 'US',
  currency: 'USD',
  autoLock: true,
  biometricAuth: false,
};

// Create the context with a default value
const SettingsContext = createContext<SettingsContextType>({
  preferences: defaultPreferences,
  isLoading: false,
  updateNotificationSettings: async () => {},
  updatePrivacySettings: async () => {},
  updateAccessibilitySettings: async () => {},
  updateLanguage: async () => {},
  updateRegion: async () => {},
  updateCurrency: async () => {},
  updateAutoLock: async () => {},
  updateBiometricAuth: async () => {},
  resetToDefaults: async () => {},
  exportSettings: async () => '',
  importSettings: async () => {},
});

// Hook to use the settings context
export const useSettings = () => useContext(SettingsContext);

// Provider component to wrap the app
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedPreferences = await storage.getUserPreferences();
        if (savedPreferences) {
          setPreferences({ ...defaultPreferences, ...savedPreferences });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        setPreferences(defaultPreferences);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to storage
  const savePreferences = async (updatedPreferences: UserPreferences) => {
    try {
      await storage.setUserPreferences(updatedPreferences);
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  // Update notification settings
  const updateNotificationSettings = async (notifications: Partial<UserPreferences['notifications']>) => {
    const updatedPreferences = {
      ...preferences,
      notifications: { ...preferences.notifications, ...notifications },
    };
    await savePreferences(updatedPreferences);
  };

  // Update privacy settings
  const updatePrivacySettings = async (privacy: Partial<UserPreferences['privacy']>) => {
    const updatedPreferences = {
      ...preferences,
      privacy: { ...preferences.privacy, ...privacy },
    };
    await savePreferences(updatedPreferences);
  };

  // Update accessibility settings
  const updateAccessibilitySettings = async (accessibility: Partial<UserPreferences['accessibility']>) => {
    const updatedPreferences = {
      ...preferences,
      accessibility: { ...preferences.accessibility, ...accessibility },
    };
    await savePreferences(updatedPreferences);
  };

  // Update language
  const updateLanguage = async (language: string) => {
    const updatedPreferences = { ...preferences, language };
    await savePreferences(updatedPreferences);
  };

  // Update region
  const updateRegion = async (region: string) => {
    const updatedPreferences = { ...preferences, region };
    await savePreferences(updatedPreferences);
  };

  // Update currency
  const updateCurrency = async (currency: string) => {
    const updatedPreferences = { ...preferences, currency };
    await savePreferences(updatedPreferences);
  };

  // Update auto lock
  const updateAutoLock = async (autoLock: boolean) => {
    const updatedPreferences = { ...preferences, autoLock };
    await savePreferences(updatedPreferences);
  };

  // Update biometric auth
  const updateBiometricAuth = async (biometricAuth: boolean) => {
    const updatedPreferences = { ...preferences, biometricAuth };
    await savePreferences(updatedPreferences);
  };

  // Reset to defaults
  const resetToDefaults = async () => {
    await savePreferences(defaultPreferences);
  };

  // Export settings as JSON string
  const exportSettings = async (): Promise<string> => {
    try {
      return JSON.stringify(preferences, null, 2);
    } catch (error) {
      console.error('Error exporting settings:', error);
      throw new Error('Failed to export settings');
    }
  };

  // Import settings from JSON string
  const importSettings = async (settingsJson: string) => {
    try {
      const importedSettings = JSON.parse(settingsJson) as UserPreferences;
      
      // Validate imported settings structure
      const validatedSettings = {
        ...defaultPreferences,
        ...importedSettings,
        notifications: { ...defaultPreferences.notifications, ...importedSettings.notifications },
        privacy: { ...defaultPreferences.privacy, ...importedSettings.privacy },
        accessibility: { ...defaultPreferences.accessibility, ...importedSettings.accessibility },
      };
      
      await savePreferences(validatedSettings);
    } catch (error) {
      console.error('Error importing settings:', error);
      throw new Error('Failed to import settings. Please check the format.');
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        preferences,
        isLoading,
        updateNotificationSettings,
        updatePrivacySettings,
        updateAccessibilitySettings,
        updateLanguage,
        updateRegion,
        updateCurrency,
        updateAutoLock,
        updateBiometricAuth,
        resetToDefaults,
        exportSettings,
        importSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}; 