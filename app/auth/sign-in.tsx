import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Button from '../../src/shared/components/ui/Button';
import { SocialAuthButtons } from '../../components/auth/SocialAuthButtons';
import AuthErrorCard from '../../components/auth/AuthErrorCard';
import { useAuth, useTheme } from '../../contexts';
import { AuthError } from '../../contexts/AuthContext';

const SignInScreen = () => {
  const { colors } = useTheme();
  const { signIn, isLoading, resendVerificationEmail, authError, setAuthError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  const handleSignIn = async () => {
    if (!email || !password) {
      setAuthError({
        type: 'generic',
        message: 'Please enter both email and password'
      });
      return;
    }

    // Clear previous errors
    setAuthError(null);

    const result = await signIn(email, password);

    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'You have been signed in successfully',
      });
    } else if (result.error) {
      // For email verification errors, navigate to dedicated screen
      if (result.error.type === 'email_not_confirmed') {
        router.push(`/auth/email-verification?email=${encodeURIComponent(email)}`);
        return;

      } else {
        // Handle cases where result.error might be empty or malformed
        const errorType = result.error?.type || 'generic';
        const errorMessage = result.error?.message || 'An error occurred. Please try again.';
        



        setAuthError({
          type: errorType,
          message: errorMessage,
          originalError: result.error?.originalError,
        });
        return;
      }
    }
  };

  const handleSocialAuthComplete = (success: boolean) => {
    if (!success) {
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    }
    // Navigation is handled automatically in the auth context
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const navigateToSignUp = () => {
    router.push('/auth/sign-up' as any);
  };

  const handleResendVerification = async () => {
    if (email) {
      const success = await resendVerificationEmail(email);
      if (success) {
        Toast.show({
          type: 'success',
          text1: 'Email sent!',
          text2: 'Please check your inbox for the verification link',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to send email',
          text2: 'Please try again later',
        });
      }
    }
  };

  const handleRetrySignIn = () => {
    setAuthError(null);
  };

  const handleCloseError = () => {
    setAuthError(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {authError && (
            <AuthErrorCard
              error={authError}
              email={authError.type === 'email_not_confirmed' ? email : undefined}
              onRetry={handleRetrySignIn}
              onResendVerification={authError.type === 'email_not_confirmed' ? handleResendVerification : undefined}
              onClose={handleCloseError}
              showCloseButton={true}
            />
          )}

          <View style={styles.content}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={[styles.logoContainer, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="rocket" size={32} color={colors.primary} />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>
                Welcome Back
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Sign in to continue your journey
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={[
                styles.inputContainer,
                { backgroundColor: colors.surfaceVariant }
              ]}>
                <Ionicons name="mail-outline" size={22} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text }
                  ]}
                  placeholder="Email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Password Input */}
              <View style={[
                styles.inputContainer,
                { backgroundColor: colors.surfaceVariant }
              ]}>
                <Ionicons name="lock-closed-outline" size={22} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text }
                  ]}
                  placeholder="Password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!isPasswordVisible}
                  autoComplete="password"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.visibilityToggle}>
                  <Ionicons
                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Sign In Button - Using new semantic variant */}
              <Button
                title="Sign In"
                variant="primary"
                onPress={handleSignIn}
                disabled={isLoading}
                loading={isLoading}
                style={styles.button}
              />

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
                  OR
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              {/* Social Sign In Buttons */}
              <SocialAuthButtons onAuthComplete={handleSocialAuthComplete} />
            </View>

            {/* Footer Section */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Don&apos;t have an account?
              </Text>
              <TouchableOpacity onPress={navigateToSignUp}>
                <Text style={[styles.footerLink, { color: colors.primary }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 36,
    alignItems: 'center',
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  visibilityToggle: {
    padding: 8,
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    opacity: 0.5,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    marginRight: 4,
    fontSize: 14,
  },
  footerLink: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default SignInScreen; 