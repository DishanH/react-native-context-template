import { Stack } from 'expo-router';
import React from 'react';
import { ThemeProvider } from '../theme/ThemeContext';

export default function OnboardingLayout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' }
        }}
      />
    </ThemeProvider>
  );
} 