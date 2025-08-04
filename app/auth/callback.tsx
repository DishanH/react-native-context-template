import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../contexts';
import { useAuth } from '../../hooks/useAuth';
import { router, useLocalSearchParams } from 'expo-router';
import { database } from '../../lib/database';
import Toast from 'react-native-toast-message';

/**
 * Auth Callback Page
 * Handles OAuth redirects, email verification, and waits for auth state to update
 */
export default function AuthCallback() {
  const { colors } = useTheme();
  const { isAuthenticated, loading } = useAuth();
  const params = useLocalSearchParams();
  const [processingVerification, setProcessingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('Completing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if this is an email verification callback
        const accessToken = params.access_token as string;
        const refreshToken = params.refresh_token as string;
        const type = params.type as string;
        
        if (type === 'signup' && accessToken && refreshToken) {
          console.log('Processing email verification...');
          setProcessingVerification(true);
          setVerificationMessage('Verifying your email...');
          
          // Set the session with the tokens from the email verification link
          const supabaseClient = database.getSupabaseClient();
          if (!supabaseClient) {
            throw new Error('Supabase client not available');
          }

          const { error } = await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting session from email verification:', error);
            Toast.show({
              type: 'error',
              text1: 'Verification Failed',
              text2: 'Failed to verify your email. Please try again.',
            });
            router.replace('/auth/sign-in');
            return;
          }

          Toast.show({
            type: 'success',
            text1: 'Email Verified!',
            text2: 'Your email has been successfully verified.',
          });

          // Wait a moment for the auth state to update
          setTimeout(() => {
            router.replace('/tabs');
          }, 1000);
          return;
        }

        // Handle OAuth social login callbacks
        if (accessToken && refreshToken && !type) {
          console.log('Processing OAuth callback...');
          setVerificationMessage('Completing OAuth authentication...');
          
          const supabaseClient = database.getSupabaseClient();
          if (!supabaseClient) {
            throw new Error('Supabase client not available');
          }

          const { error } = await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting OAuth session:', error);
            Toast.show({
              type: 'error',
              text1: 'Authentication Failed',
              text2: 'Failed to complete authentication. Please try again.',
            });
            router.replace('/auth/sign-in');
            return;
          }

          // Wait for auth state to update
          setTimeout(() => {
            router.replace('/tabs');
          }, 1000);
          return;
        }

        // For web, check URL hash for tokens (fallback)
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          const hash = window.location.hash;
          if (hash.includes('access_token')) {
            console.log('Processing web hash tokens...');
            setVerificationMessage('Processing authentication...');
            // Let Supabase handle this automatically via detectSessionInUrl
            setTimeout(() => {
              // Check auth state after a delay
              if (!loading && isAuthenticated) {
                router.replace('/tabs');
              } else if (!loading) {
                router.replace('/auth/sign-in');
              }
            }, 2000);
            return;
          }
        }

        // Default behavior - wait for auth state
        if (!loading) {
          if (isAuthenticated) {
            console.log('Authentication success, redirecting to app...');
            router.replace('/tabs');
          } else {
            console.log('Authentication failed, redirecting to sign in...');
            router.replace('/auth/sign-in');
          }
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        Toast.show({
          type: 'error',
          text1: 'Authentication Error',
          text2: 'Something went wrong. Please try again.',
        });
        router.replace('/auth/sign-in');
      } finally {
        setProcessingVerification(false);
      }
    };

    handleAuthCallback();
  }, [loading, isAuthenticated, params]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.text, { color: colors.text }]}>
        {verificationMessage}
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