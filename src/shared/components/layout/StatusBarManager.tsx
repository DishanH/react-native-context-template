import React from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../../../contexts';

// Status bar manager component that responds to theme changes
export function StatusBarManager() {
  const { theme, colors } = useTheme();
  
  // Update toast colors when theme changes and on initial load
  React.useEffect(() => {
    const { setToastColors } = require("../../../../lib/feedback");
    if (colors) {
      setToastColors(colors);
    }
  }, [colors]);
  
  // Set initial colors immediately
  React.useLayoutEffect(() => {
    const { setToastColors } = require("../../../../lib/feedback");
    if (colors) {
      setToastColors(colors);
    }
  }, []);
  
  // Determine status bar style based on theme
  const getStatusBarStyle = () => {
    if (theme === 'system') {
      return 'auto'; // Light content (white text/icons) on dark background
    }
    return theme === 'dark' ? 'light' : 'dark'; // Dark content (black text/icons) on light background
  };

  // Platform-specific background color handling
  const getBackgroundColor = () => {
    if (Platform.OS === 'android') {
      // For Android, use the actual background color instead of transparent
      // This helps with visibility especially in dark mode
      return theme === 'dark' ? colors.background : colors.background;
    }
    return 'transparent'; // iOS handles this better with transparent
  };

  return (
    <StatusBar 
      style={getStatusBarStyle()}
      backgroundColor={getBackgroundColor()}
      translucent={Platform.OS === 'android'} // Only translucent on Android
    />
  );
} 