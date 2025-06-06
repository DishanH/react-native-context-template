import { FontAwesome5 } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import colors from './theme/colors';
import { useTheme } from './theme/ThemeContext';
import { useAuth } from './utils/authContext';

// Ensure authentication redirect is handled properly
WebBrowser.maybeCompleteAuthSession();

// Define custom colors for login screen
const LOGIN_COLORS = {
  primary: '#52616B',
  secondary: '#1E2022',
  background: '#FFFFFF',
  surface: '#F0F5F9',
  accent: '#C9D6DF',
  text: '#1E2022',
  textSecondary: '#52616B',
  border: '#C9D6DF',
};

export default function LoginScreen() {
  const { colors: themeColors, setTheme } = useTheme();
  const { login, loginWithGoogle, loginWithApple, register, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Force light theme for login screen
  useEffect(() => {
    setTheme('light');
  }, []);
  
  // Use light theme colors directly
  const lightColors = colors.light;

  // Handle Email/Password Sign In or Sign Up
  const handleEmailAuth = () => {
    if (isSignUp) {
      register(name, email, password);
    } else {
      login(email, password);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: LOGIN_COLORS.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={LOGIN_COLORS.background} />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidContainer}
        >
          <View style={styles.headerContainer}>
            <View style={[styles.logoContainer, { backgroundColor: 'rgba(82, 97, 107, 0.1)' }]}>
              <FontAwesome5 name="rocket" size={40} color={LOGIN_COLORS.primary} />
            </View>
            <Text style={[styles.title, { color: LOGIN_COLORS.text }]}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={[styles.subtitle, { color: LOGIN_COLORS.textSecondary }]}>
              {isSignUp 
                ? 'Sign up to get started with all our features' 
                : 'Log in to continue your journey'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            {isSignUp && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: LOGIN_COLORS.textSecondary }]}>Full Name</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: LOGIN_COLORS.surface,
                      borderColor: LOGIN_COLORS.border,
                      color: LOGIN_COLORS.text
                    }
                  ]}
                  placeholder="Enter your full name"
                  placeholderTextColor={LOGIN_COLORS.accent}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: LOGIN_COLORS.textSecondary }]}>Email</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: LOGIN_COLORS.surface,
                    borderColor: LOGIN_COLORS.border,
                    color: LOGIN_COLORS.text
                  }
                ]}
                placeholder="Enter your email"
                placeholderTextColor={LOGIN_COLORS.accent}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: LOGIN_COLORS.textSecondary }]}>Password</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: LOGIN_COLORS.surface,
                    borderColor: LOGIN_COLORS.border,
                    color: LOGIN_COLORS.text
                  }
                ]}
                placeholder="Enter your password"
                placeholderTextColor={LOGIN_COLORS.accent}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {!isSignUp && (
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={[styles.forgotPasswordText, { color: LOGIN_COLORS.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: LOGIN_COLORS.primary },
                (!email || !password || (isSignUp && !name)) && styles.disabledButton
              ]}
              onPress={handleEmailAuth}
              disabled={!email || !password || (isSignUp && !name) || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isSignUp ? 'Sign Up' : 'Log In'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.separatorContainer}>
            <View style={[styles.separator, { backgroundColor: LOGIN_COLORS.border }]} />
            <Text style={[styles.separatorText, { color: LOGIN_COLORS.textSecondary }]}>
              OR CONTINUE WITH
            </Text>
            <View style={[styles.separator, { backgroundColor: LOGIN_COLORS.border }]} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.socialButton,
                { 
                  borderColor: LOGIN_COLORS.border, 
                  backgroundColor: LOGIN_COLORS.surface 
                }
              ]}
              onPress={loginWithGoogle}
              disabled={isLoading}
            >
              <FontAwesome5 name="google" size={20} color="#DB4437" />
              <Text style={[styles.socialButtonText, { color: LOGIN_COLORS.text }]}>
                Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.socialButton,
                { 
                  borderColor: LOGIN_COLORS.border, 
                  backgroundColor: LOGIN_COLORS.surface 
                }
              ]}
              onPress={loginWithApple}
              disabled={isLoading}
            >
              <FontAwesome5 name="apple" size={20} color="#000000" />
              <Text style={[styles.socialButtonText, { color: LOGIN_COLORS.text }]}>
                Apple
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchContainer}>
            <Text style={[styles.switchText, { color: LOGIN_COLORS.textSecondary }]}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={[styles.switchActionText, { color: LOGIN_COLORS.primary }]}>
                {isSignUp ? 'Log In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  keyboardAvoidContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 500,
    alignSelf: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    maxWidth: 300,
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  primaryButton: {
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
  },
  separator: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    fontSize: 12,
    marginHorizontal: 10,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 8,
    width: '48%',
    borderWidth: 1,
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  switchText: {
    fontSize: 14,
  },
  switchActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
}); 