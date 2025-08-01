import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts';
import { useAuth } from '../../hooks/useAuth';
import { router } from 'expo-router';

/**
 * Auth Callback Page
 * Handles OAuth redirects and waits for auth state to update
 * Much simpler now that useAuth hook handles all the state management
 */
export default function AuthCallback() {
  const { colors } = useTheme();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Wait for auth state to be determined
    if (!loading) {
      if (isAuthenticated) {
        console.log('OAuth success, redirecting to app...');
        router.replace('/tabs' as any);
      } else {
        console.log('Authentication failed, redirecting to sign in...');
        router.replace('/auth' as any);
      }
    }
  }, [loading, isAuthenticated]);

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