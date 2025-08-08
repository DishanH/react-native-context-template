import { Stack } from 'expo-router';
import React from 'react';
import { useTheme } from '../../contexts';

/**
 * Authentication Stack Layout
 * 
 * This layout provides a stack navigator for the authentication flow,
 * preventing authenticated users from accessing auth screens via gestures or back navigation.
 */
export default function AuthLayout() {
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

      <Stack.Screen 
        name="sign-in" 
        options={{
          title: 'Sign In',
        }}
      />
      <Stack.Screen 
        name="sign-up" 
        options={{
          title: 'Sign Up',
        }}
      />
      <Stack.Screen 
        name="email-verification" 
        options={{
          title: 'Email Verification',
        }}
      />
      <Stack.Screen 
        name="callback" 
        options={{
          title: 'Auth Callback',
        }}
      />
    </Stack>
  );
} 