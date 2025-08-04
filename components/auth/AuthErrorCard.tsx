import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Button from '../../src/shared/components/ui/Button';
import { useTheme } from '../../contexts';
import { AuthError } from '../../contexts/AuthContext';

interface AuthErrorCardProps {
  error: AuthError;
  email?: string;
  onRetry?: () => void;
  onResendVerification?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
  onCustomAction?: () => void;
  customActionTitle?: string;
}

const AuthErrorCard: React.FC<AuthErrorCardProps> = ({
  error,
  email,
  onRetry,
  onResendVerification,
  onClose,
  showCloseButton = false,
  onCustomAction,
  customActionTitle,
}) => {
  const { colors } = useTheme();

  console.log('error', error);

  const getIconName = () => {
    switch (error.type) {
      case 'email_not_confirmed':
        return 'mail-unread';
      case 'invalid_credentials':
        return 'lock-closed';
      case 'user_not_found':
        return 'person-remove';
      case 'email_already_exists':
        return 'person-add';
      case 'weak_password':
        return 'shield-half';
      case 'rate_limit':
        return 'time';
      default:
        return 'alert-circle';
    }
  };

  const getIconColor = () => {
    switch (error.type) {
      case 'email_not_confirmed':
        return colors.warning;
      case 'rate_limit':
        return colors.warning;
      default:
        return colors.error;
    }
  };

  const showRetryButton = () => {
    return onRetry && error.type !== 'email_not_confirmed' && error.type !== 'rate_limit';
  };

  const showResendButton = () => {
    return onResendVerification && error.type === 'email_not_confirmed' && email;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
          <Ionicons name={getIconName()} size={24} color={getIconColor()} />
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
          {error.type === 'email_not_confirmed' ? 'Email Verification Required' : 'Authentication Error'}
        </Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {error.message}
        </Text>
        {email && error.type === 'email_not_confirmed' && (
          <Text style={[styles.email, { color: colors.primary }]}>
            {email}
          </Text>
        )}
      </View>

      {/* Actions */}
      {(showRetryButton() || showResendButton()) && (
        <View style={styles.actions}>
          {showResendButton() && (
            <Button
              title="Resend Verification Email"
              variant="primary"
              onPress={onResendVerification!}
              style={styles.actionButton}
            />
          )}
          {showRetryButton() && (
            <Button
              title="Try Again"
              variant="outline"
              onPress={onRetry!}
              style={[styles.actionButton, styles.secondaryAction]}
            />
          )}
        </View>
      )}
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    marginTop: 0,
  },
  secondaryAction: {
    marginTop: 8,
  },
});

export default AuthErrorCard;