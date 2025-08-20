import { useState, useMemo } from 'react';
import type { ErrorState } from './error-handler';

/**
 * Common loading state management for consistent UX across pages
 */

export interface LoadingState {
  isLoading: boolean;
  isRefreshing: boolean;
  error: ErrorState | null;
  retryCount: number;
  lastRetryTime: number;
}

export interface LoadingActions {
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: ErrorState | null) => void;
  incrementRetry: () => void;
  resetRetry: () => void;
  resetState: () => void;
}

/**
 * Hook for managing loading states consistently
 */
export function useLoadingState(initialLoading = true): [LoadingState, LoadingActions] {
  const [state, setState] = useState<LoadingState>({
    isLoading: initialLoading,
    isRefreshing: false,
    error: null,
    retryCount: 0,
    lastRetryTime: 0
  });

  const actions = useMemo<LoadingActions>(() => ({
    setLoading: (loading: boolean) => {
      setState(prev => ({ ...prev, isLoading: loading }));
    },
    setRefreshing: (refreshing: boolean) => {
      setState(prev => ({ ...prev, isRefreshing: refreshing }));
    },
    setError: (error: ErrorState | null) => {
      setState(prev => ({ 
        ...prev, 
        error,
        isLoading: false,
        isRefreshing: false
      }));
    },
    incrementRetry: () => {
      setState(prev => ({ 
        ...prev, 
        retryCount: prev.retryCount + 1,
        lastRetryTime: Date.now()
      }));
    },
    resetRetry: () => {
      setState(prev => ({ 
        ...prev, 
        retryCount: 0,
        lastRetryTime: 0,
        error: null
      }));
    },
    resetState: () => {
      setState({
        isLoading: false,
        isRefreshing: false,
        error: null,
        retryCount: 0,
        lastRetryTime: 0
      });
    }
  }), []);

  return [state, actions];
}

/**
 * Determine which state to show based on current conditions
 */
export function getDisplayState(
  loadingState: LoadingState,
  hasData: boolean,
  isEmpty: boolean
): 'loading' | 'error' | 'empty' | 'content' {
  const { isLoading, error } = loadingState;

  if (isLoading && !hasData) {
    return 'loading';
  }

  if (error && !hasData) {
    return 'error';
  }

  if (!hasData || isEmpty) {
    return 'empty';
  }

  return 'content';
}
