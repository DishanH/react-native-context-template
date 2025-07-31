import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../src/shared/components/ui/Button';
import { useAuth, useTheme } from '../../contexts';

const SignUpScreen = () => {
  const { colors } = useTheme();
  const { signUp, socialSignIn, isLoading } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const success = await signUp(fullName, email, password);
    
    if (!success) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
    // Navigation is handled automatically in the auth context
  };

  const handleSocialSignUp = async (provider: 'google' | 'apple') => {
    const success = await socialSignIn(provider);
    
    if (!success) {
      Alert.alert('Error', `Failed to sign up with ${provider}. Please try again.`);
    }
    // Navigation is handled automatically in the auth context
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const navigateToSignIn = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: colors.accent + '20' }]}>
              <Ionicons name="person-add" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign up to start your journey
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            {/* Full Name Input */}
            <View style={[
              styles.inputContainer,
              { backgroundColor: colors.surfaceVariant }
            ]}>
              <Ionicons name="person-outline" size={22} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  { color: colors.text }
                ]}
                placeholder="Full Name"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoComplete="name"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

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
                autoComplete="password-new"
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

            {/* Sign Up Button - Using semantic variant */}
            <Button
              title="Create Account"
              variant="primary"
              onPress={handleSignUp}
              disabled={isLoading}
              loading={isLoading}
              style={styles.button}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
                OR
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Social Sign Up Buttons */}
            <TouchableOpacity
              style={[
                styles.socialButton,
                { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1
                }
              ]}
              onPress={() => handleSocialSignUp('google')}
              disabled={isLoading}
            >
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text
                style={[
                  styles.socialButtonText,
                  { color: colors.text }
                ]}
              >
                Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.socialButton,
                { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1
                }
              ]}
              onPress={() => handleSocialSignUp('apple')}
              disabled={isLoading}
            >
              <Ionicons name="logo-apple" size={22} color={colors.text} />
              <Text
                style={[
                  styles.socialButtonText,
                  { color: colors.text }
                ]}
              >
                Continue with Apple
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Section */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={navigateToSignIn}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terms Text */}
          <Text style={[styles.termsText, { color: colors.textSecondary }]}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
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
  socialButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialButtonText: {
    fontWeight: '500',
    marginLeft: 12,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    marginRight: 4,
    fontSize: 14,
  },
  footerLink: {
    fontWeight: '600',
    fontSize: 14,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 16,
  },
});

export default SignUpScreen; 