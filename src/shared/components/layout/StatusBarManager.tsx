import React from 'react';
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
  
  return (
    <StatusBar 
      style={theme === 'dark' ? 'light' : 'dark'}
      backgroundColor="transparent"
      translucent={true}
    />
  );
} 