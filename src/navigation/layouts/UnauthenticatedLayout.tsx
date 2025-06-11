import React from 'react';
import { Stack } from "expo-router";
import { useTheme } from '../../../contexts';

// Unauthenticated layout with stack navigation for auth and onboarding
export function UnauthenticatedLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="auth" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
} 