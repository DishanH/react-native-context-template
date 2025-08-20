import type { DatabaseResponse } from '../database/core/base-repository';

/**
 * Common error handling utilities for consistent error management across pages
 */

export interface ErrorInfo {
  timestamp: string;
  context: string;
  error: any;
  userId?: string;
  userAgent?: string;
  retryCount?: number;
}

export interface ErrorState {
  message: string;
  isNetworkError: boolean;
  isPermissionError: boolean;
  isNotFoundError: boolean;
  canRetry: boolean;
  suggestedAction?: string;
}

/**
 * Categorizes and formats errors for user-friendly display
 */
export function categorizeError(error: any): ErrorState {
  if (!error) {
    return {
      message: 'An unknown error occurred',
      isNetworkError: false,
      isPermissionError: false,
      isNotFoundError: false,
      canRetry: true
    };
  }

  const message = error.message?.toLowerCase() || error.toString().toLowerCase();

  // Network errors
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return {
      message: 'Network connection issue. Please check your internet connection.',
      isNetworkError: true,
      isPermissionError: false,
      isNotFoundError: false,
      canRetry: true,
      suggestedAction: 'Check your internet connection and try again'
    };
  }

  // Permission errors
  if (message.includes('unauthorized') || message.includes('403') || message.includes('permission')) {
    return {
      message: 'You don\'t have permission to access this content.',
      isNetworkError: false,
      isPermissionError: true,
      isNotFoundError: false,
      canRetry: false,
      suggestedAction: 'Please sign in or contact support'
    };
  }

  // Not found errors
  if (message.includes('not found') || message.includes('404') || message.includes('pgrst116')) {
    return {
      message: 'Content not found or unavailable.',
      isNetworkError: false,
      isPermissionError: false,
      isNotFoundError: true,
      canRetry: false,
      suggestedAction: 'The content may have been moved or deleted'
    };
  }

  // Timeout errors
  if (message.includes('timeout')) {
    return {
      message: 'Request timed out. Please try again.',
      isNetworkError: true,
      isPermissionError: false,
      isNotFoundError: false,
      canRetry: true,
      suggestedAction: 'The server is taking longer than usual to respond'
    };
  }

  // Database "no rows" errors (not really errors)
  if (message.includes('no rows') || message.includes('pgrst116')) {
    return {
      message: 'No data available',
      isNetworkError: false,
      isPermissionError: false,
      isNotFoundError: false,
      canRetry: false,
      suggestedAction: 'There\'s no content to display yet'
    };
  }

  // Generic error
  return {
    message: error.message || 'Something went wrong',
    isNetworkError: false,
    isPermissionError: false,
    isNotFoundError: false,
    canRetry: true,
    suggestedAction: 'Please try again'
  };
}

/**
 * Logs errors with context for debugging and monitoring
 */
export function logError(error: any, context: string, additionalInfo?: Partial<ErrorInfo>): void {
  const errorInfo: ErrorInfo = {
    timestamp: new Date().toISOString(),
    context,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    ...additionalInfo
  };

  console.error(`[ErrorHandler] ${context}:`, errorInfo);

  // In production, send to error tracking service
  // Example: Sentry.captureException(error, { extra: errorInfo });
}

/**
 * Handles database response with proper error categorization
 */
export function handleDatabaseResponse<T>(
  response: DatabaseResponse<T>,
  context: string,
  additionalInfo?: Partial<ErrorInfo>
): {
  data: T | null;
  errorState: ErrorState | null;
  isEmpty: boolean;
} {
  if (response.success && response.data) {
    return {
      data: response.data,
      errorState: null,
      isEmpty: Array.isArray(response.data) ? response.data.length === 0 : false
    };
  }

  if (response.success && !response.data) {
    // Successful but empty response
    return {
      data: null,
      errorState: null,
      isEmpty: true
    };
  }

  // Error case
  if (response.error) {
    logError(response.error, context, additionalInfo);
    const errorState = categorizeError(response.error);
    
    // Don't treat "no data" as an error
    if (errorState.isNotFoundError || errorState.message.includes('No data available')) {
      return {
        data: null,
        errorState: null,
        isEmpty: true
      };
    }

    return {
      data: null,
      errorState,
      isEmpty: false
    };
  }

  // Unknown failure
  const unknownError = new Error('Unknown database error');
  logError(unknownError, context, additionalInfo);
  
  return {
    data: null,
    errorState: categorizeError(unknownError),
    isEmpty: false
  };
}

/**
 * Retry helper with exponential backoff
 */
export function shouldAllowRetry(
  retryCount: number,
  lastRetryTime: number,
  maxRetries: number = 3
): { allowed: boolean; delay: number } {
  if (retryCount >= maxRetries) {
    return { allowed: false, delay: 0 };
  }

  const now = Date.now();
  const minDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff, max 30s
  const timeSinceLastRetry = now - lastRetryTime;

  return {
    allowed: timeSinceLastRetry >= minDelay,
    delay: Math.max(0, minDelay - timeSinceLastRetry)
  };
}
