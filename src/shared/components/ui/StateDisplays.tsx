import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import type { ErrorState } from '../../../../lib/utils/error-handler';

interface BaseStateProps {
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    warning: string;
  };
}

interface LoadingStateProps extends BaseStateProps {
  message?: string;
}

interface ErrorStateProps extends BaseStateProps {
  error: ErrorState;
  onRetry?: () => void;
  retryCount?: number;
  isRetrying?: boolean;
}

interface EmptyStateProps extends BaseStateProps {
  title: string;
  message: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

/**
 * Loading state component
 */
export function LoadingDisplay({ colors, message = 'Loading...' }: LoadingStateProps) {
  return (
    <View style={[styles.stateContainer, { backgroundColor: colors.surface }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.stateTitle, { color: colors.text }]}>{message}</Text>
      <Text style={[styles.stateMessage, { color: colors.textSecondary }]}>
        Please wait while we fetch the latest data.
      </Text>
    </View>
  );
}

/**
 * Error state component with retry functionality
 */
export function ErrorDisplay({ 
  colors, 
  error, 
  onRetry, 
  retryCount = 0, 
  isRetrying = false 
}: ErrorStateProps) {
  const getErrorIcon = () => {
    if (error.isNetworkError) return 'wifi';
    if (error.isPermissionError) return 'lock';
    if (error.isNotFoundError) return 'search';
    return 'exclamation-triangle';
  };

  const getErrorTitle = () => {
    if (error.isNetworkError) return 'Connection Issue';
    if (error.isPermissionError) return 'Access Denied';
    if (error.isNotFoundError) return 'Not Found';
    return 'Something Went Wrong';
  };

  return (
    <View style={[styles.stateContainer, { backgroundColor: colors.surface }]}>
      <FontAwesome5 
        name={getErrorIcon()} 
        size={48} 
        color={colors.warning} 
      />
      <Text style={[styles.stateTitle, { color: colors.text }]}>
        {getErrorTitle()}
      </Text>
      <Text style={[styles.stateMessage, { color: colors.textSecondary }]}>
        {error.message}
      </Text>
      {error.suggestedAction && (
        <Text style={[styles.suggestedAction, { color: colors.textSecondary }]}>
          {error.suggestedAction}
        </Text>
      )}
      {error.canRetry && onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={[styles.actionButton, { borderColor: colors.primary }]}
          disabled={isRetrying}
        >
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>
            {isRetrying 
              ? 'Retrying...' 
              : `Retry${retryCount > 0 ? ` (${retryCount})` : ''}`
            }
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/**
 * Empty state component
 */
export function EmptyDisplay({ 
  colors, 
  title, 
  message, 
  icon = 'inbox',
  actionLabel,
  onAction,
  hasFilters = false,
  onClearFilters
}: EmptyStateProps) {
  return (
    <View style={[styles.stateContainer, { backgroundColor: colors.surface }]}>
      <FontAwesome5 
        name={icon} 
        size={48} 
        color={colors.textSecondary} 
      />
      <Text style={[styles.stateTitle, { color: colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.stateMessage, { color: colors.textSecondary }]}>
        {message}
      </Text>
      
      {hasFilters && onClearFilters ? (
        <TouchableOpacity
          onPress={onClearFilters}
          style={[styles.actionButton, { borderColor: colors.primary }]}
        >
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>
            Clear All Filters
          </Text>
        </TouchableOpacity>
      ) : actionLabel && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          style={[styles.actionButton, { 
            backgroundColor: colors.primary, 
            borderColor: colors.primary 
          }]}
        >
          <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stateContainer: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 12,
    marginTop: 8,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  stateMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  suggestedAction: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
