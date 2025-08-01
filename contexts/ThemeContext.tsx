import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { colors, type ThemeContextType, type ThemeType } from '../theme';
import { useSettings } from './SettingsContext';

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: colors.light,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const { preferences, updateTheme, isLoading: settingsLoading } = useSettings();
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Resolve the actual theme based on user preference and device setting
  useEffect(() => {
    if (preferences.theme === 'system') {
      // Use device color scheme when theme is set to 'system'
      const systemTheme = (deviceColorScheme as 'light' | 'dark') || 'light';
      setResolvedTheme(systemTheme);
    } else {
      // Use the explicit theme preference
      setResolvedTheme(preferences.theme as 'light' | 'dark');
    }
  }, [preferences.theme, deviceColorScheme]);

  const toggleTheme = async () => {
    // Toggle between light and dark (skip system)
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    await updateTheme(newTheme);
  };

  const setTheme = async (newTheme: ThemeType) => {
    await updateTheme(newTheme);
  };

  const themeColors = useMemo(() => colors[resolvedTheme], [resolvedTheme]);

  // Don't render children until settings are loaded
  if (settingsLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: preferences.theme,
        colors: themeColors,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext; 