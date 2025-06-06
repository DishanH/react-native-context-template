import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '../utils/storage';
import colors from './colors';
import { ThemeContextType, ThemeType } from './types';

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: colors.light,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await storage.getTheme();
        if (savedTheme) {
          setThemeState(savedTheme);
        } else {
          // If no saved theme, use device color scheme
          const initialTheme = (deviceColorScheme as ThemeType) || 'light';
          setThemeState(initialTheme);
          await storage.setTheme(initialTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        setThemeState('light');
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [deviceColorScheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    await storage.setTheme(newTheme);
  };

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    await storage.setTheme(newTheme);
  };

  const themeColors = colors[theme];

  // Don't render children until theme is loaded
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
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