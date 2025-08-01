import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Button from '../../src/shared/components/ui/Button';
import EmailVerificationCard from '../../components/auth/EmailVerificationCard';
import { useAuth, useTheme } from '../../contexts';

const EmailVerificationScreen = () => {
  const { colors } = useTheme();
  const { resendVerificationEmail } = useAuth();
  const params = useLocalSearchParams();
  
  const email = typeof params.email === 'string' ? params.email : '';
  const [lastResendTime, setLastResendTime] = useState<number | null>(null);

  useEffect(() => {
    if (!email) {
      // Redirect back to sign in if no email provided
      router.replace('/auth/sign-in');
    }
  }, [email]);

  const handleBackToSignIn = () => {
    router.replace('/auth/sign-in');
  };

  const handleGoToSignUp = () => {
    router.replace('/auth/sign-up');
  };

  if (!email) {
    return null; // Will redirect via useEffect
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleBackToSignIn} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Email Verification
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <EmailVerificationCard 
            email={email}
            showCloseButton={false}
          />

          {/* Additional Actions */}
          <View style={styles.actions}>
            <Text style={[styles.helpText, { color: colors.textSecondary }]}>
              Already verified your email?
            </Text>
            <Button
              title="Sign In"
              variant="primary"
              onPress={handleBackToSignIn}
              style={styles.actionButton}
            />
            
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
                OR
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <Text style={[styles.helpText, { color: colors.textSecondary }]}>
              Need to create an account?
            </Text>
            <Button
              title="Sign Up"
              variant="outline"
              onPress={handleGoToSignUp}
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Having trouble? Check your spam folder or contact support.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40, // Same as back button to center the title
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  actions: {
    marginTop: 32,
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  actionButton: {
    width: '100%',
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
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
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 16,
  },
});

export default EmailVerificationScreen;