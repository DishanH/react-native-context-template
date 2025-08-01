import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GoogleAuthService, AppleAuthService } from '../../lib/auth';
import { useTheme } from '../../contexts';

interface SocialAuthButtonsProps {
  onAuthStart?: () => void;
  onAuthComplete?: (success: boolean) => void;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onAuthStart,
  onAuthComplete,
}) => {
  const { colors } = useTheme();
  const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(false);
  const [loading, setLoading] = useState<'google' | 'apple' | null>(null);

  useEffect(() => {
    AppleAuthService.isAvailable().then(setIsAppleAuthAvailable);
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading('google');
    onAuthStart?.();
    
    try {
      const success = await GoogleAuthService.signInWithGoogle();
      onAuthComplete?.(success);
    } catch (error) {
      console.error('Google sign in error:', error);
      onAuthComplete?.(false);
    } finally {
      setLoading(null);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading('apple');
    onAuthStart?.();
    
    try {
      const success = await AppleAuthService.signInWithApple();
      onAuthComplete?.(success);
    } catch (error) {
      console.error('Apple sign in error:', error);
      onAuthComplete?.(false);
    } finally {
      setLoading(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Google Sign In Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={handleGoogleSignIn}
        disabled={loading !== null}
      >
        {loading === 'google' ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} color="#EA4335" />
            <Text style={[styles.buttonText, { color: colors.text }]}>
              Continue with Google
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Apple Sign In Button - Only show on iOS */}
      {isAppleAuthAvailable && (
        <TouchableOpacity
          style={[styles.button, styles.appleButton, { backgroundColor: colors.text }]}
          onPress={handleAppleSignIn}
          disabled={loading !== null}
        >
          {loading === 'apple' ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <>
              <Ionicons name="logo-apple" size={22} color={colors.background} />
              <Text style={[styles.buttonText, styles.appleButtonText, { color: colors.background }]}>
                Continue with Apple
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  appleButton: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  appleButtonText: {
    fontWeight: '700',
  },
});