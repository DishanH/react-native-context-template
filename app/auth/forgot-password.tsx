import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
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
import { useAuth, useTheme } from '../../contexts';

const ForgotPasswordScreen = () => {
  const { colors } = useTheme();
  const { resetPassword, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSendResetEmail = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Email Required',
        text2: 'Please enter your email address',
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
      });
      return;
    }

    try {
      const success = await resetPassword(email);
      if (success) {
        setIsEmailSent(true);
        Toast.show({
          type: 'success',
          text1: 'Reset Email Sent!',
          text2: 'Check your inbox for password reset instructions',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to Send Email',
          text2: 'Please try again later or contact support',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send reset email. Please try again.',
      });
    }
  };

  const handleBackToSignIn = () => {
    router.back();
  };

  const handleResendEmail = () => {
    setIsEmailSent(false);
    handleSendResetEmail();
  };

  if (isEmailSent) {
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
            <View style={styles.content}>
              {/* Success Header */}
              <View style={styles.header}>
                <View style={[styles.logoContainer, { backgroundColor: colors.success + '20' }]}>
                  <Ionicons name="mail" size={32} color={colors.success} />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>
                  Check Your Email
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  We've sent password reset instructions to{'\n'}
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>{email}</Text>
                </Text>
              </View>

              {/* Instructions */}
              <View style={styles.instructions}>
                <Text style={[styles.instructionTitle, { color: colors.text }]}>
                  What's next?
                </Text>
                <View style={styles.instructionItem}>
                  <View style={[styles.instructionDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                    Check your email inbox (and spam folder)
                  </Text>
                </View>
                <View style={styles.instructionItem}>
                  <View style={[styles.instructionDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                    Click the password reset link
                  </Text>
                </View>
                <View style={styles.instructionItem}>
                  <View style={[styles.instructionDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                    Create a new password
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actions}>
                <Button
                  title="Resend Email"
                  variant="secondary"
                  onPress={handleResendEmail}
                  disabled={isLoading}
                  loading={isLoading}
                  style={styles.button}
                />
                
                <TouchableOpacity onPress={handleBackToSignIn} style={styles.backButton}>
                  <Text style={[styles.backButtonText, { color: colors.primary }]}>
                    Back to Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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
          <View style={styles.content}>
            {/* Header Section */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBackToSignIn} style={styles.backIconButton}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              
              <View style={[styles.logoContainer, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="heart" size={32} color={colors.primary} />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>
                Forgot Password?
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Don't worry! We'll help you get back to your journey
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
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Send Reset Email Button */}
              <Button
                title="Send Reset Instructions"
                variant="primary"
                onPress={handleSendResetEmail}
                disabled={isLoading}
                loading={isLoading}
                style={styles.button}
              />
            </View>

            {/* Footer Section */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Remember your password?
              </Text>
              <TouchableOpacity onPress={handleBackToSignIn}>
                <Text style={[styles.footerLink, { color: colors.primary }]}>
                  Sign In
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
    position: 'relative',
  },
  backIconButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
    lineHeight: 22,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 24,
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
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    marginBottom: 36,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  instructionText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  actions: {
    gap: 16,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
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

export default ForgotPasswordScreen;
