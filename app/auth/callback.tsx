import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts';
import { database } from '../../lib/database';
import { router } from 'expo-router';

/**
 * Auth Callback Page
 * Handles OAuth redirects from Supabase (Google, Apple, etc.)
 * This page processes the auth tokens and redirects to the appropriate screen
 */
export default function AuthCallback() {
  const { colors } = useTheme();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have a session after OAuth callback
        const session = await database.getSession();
        
        if (session?.user) {
          // User is successfully authenticated
          console.log('OAuth success, redirecting to app...');
          router.replace('/tabs' as any);
        } else {
          // No session found, redirect to sign in
          console.log('No session found, redirecting to sign in...');
          router.replace('/auth' as any);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        // On error, redirect to sign in
        router.replace('/auth' as any);
      }
    };

    // Small delay to allow auth state to settle
    const timer = setTimeout(handleAuthCallback, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.text, { color: colors.text }]}>
        Completing authentication...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});