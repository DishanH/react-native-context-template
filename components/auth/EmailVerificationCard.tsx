import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Button from '../../src/shared/components/ui/Button';
import { useAuth, useTheme } from '../../contexts';

interface EmailVerificationCardProps {
  email: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const EmailVerificationCard: React.FC<EmailVerificationCardProps> = ({
  email,
  onClose,
  showCloseButton = false,
}) => {
  const { colors } = useTheme();
  const { resendVerificationEmail } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [lastResendTime, setLastResendTime] = useState<number | null>(null);

  const handleResendEmail = async () => {
    // Prevent spam by limiting resend attempts
    const now = Date.now();
    if (lastResendTime && (now - lastResendTime) < 60000) { // 1 minute cooldown
      const secondsLeft = Math.ceil((60000 - (now - lastResendTime)) / 1000);
      Toast.show({
        type: 'warning',
        text1: 'Please wait',
        text2: `You can resend the email in ${secondsLeft} seconds`,
      });
      return;
    }

    setIsResending(true);
    
    try {
      const success = await resendVerificationEmail(email);
      
      if (success) {
        setLastResendTime(now);
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
    } catch (error) {
      console.error('Error resending verification email:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to send email',
        text2: 'Please try again later',
      });
    } finally {
      setIsResending(false);
    }
  };

  const getResendButtonText = () => {
    const now = Date.now();
    if (lastResendTime && (now - lastResendTime) < 60000) {
      const secondsLeft = Math.ceil((60000 - (now - lastResendTime)) / 1000);
      return `Resend in ${secondsLeft}s`;
    }
    return lastResendTime ? 'Resend Email' : 'Resend Verification Email';
  };

  const isResendDisabled = () => {
    const now = Date.now();
    return isResending || Boolean(lastResendTime && (now - lastResendTime) < 60000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
          <Ionicons name="mail-unread" size={24} color={colors.warning} />
        </View>
        {showCloseButton && onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Verify Your Email
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          We&apos;ve sent a verification link to:
        </Text>
        <Text style={[styles.email, { color: colors.primary }]}>
          {email}
        </Text>
        <Text style={[styles.instruction, { color: colors.textSecondary }]}>
          Click the link in your email to verify your account. 
          You may need to check your spam folder.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title={getResendButtonText()}
          variant="outline"
          onPress={handleResendEmail}
          disabled={isResendDisabled()}
          loading={isResending}
          style={styles.resendButton}
        />
      </View>

      {/* Footer Note */}
      <Text style={[styles.footerNote, { color: colors.textSecondary }]}>
        Once verified, you can sign in to your account
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 8,
  },
  content: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  actions: {
    marginBottom: 16,
  },
  resendButton: {
    marginTop: 8,
  },
  footerNote: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default EmailVerificationCard;