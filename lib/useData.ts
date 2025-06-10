import { useEffect, useState, useCallback } from 'react';
import { storage } from './storage';
// import { database } from './database'; // Uncomment when Supabase is added

/**
 * Data sync configuration
 */
interface DataConfig {
  enableRemoteSync: boolean;
  syncOnMount: boolean;
  syncInterval?: number; // in milliseconds
}

/**
 * Hook for managing user data with optional remote sync
 */
export function useUserData(config: DataConfig = { enableRemoteSync: false, syncOnMount: true }) {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  // Load data from local storage or remote
  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Always load from local first for immediate display
      const localData = await storage.getUserData();
      if (localData) {
        setUserData(localData);
      }

      // If remote sync is enabled, try to fetch fresh data
      if (config.enableRemoteSync) {
        setSyncStatus('syncing');
        try {
          // Uncomment when database is integrated:
          // const remoteData = await database.getUser(localData?.id);
          // if (remoteData) {
          //   setUserData(remoteData);
          //   setSyncStatus('synced');
          // }
          setSyncStatus('synced'); // Temporary
        } catch (error) {
          console.error('Failed to sync user data:', error);
          setSyncStatus('error');
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [config.enableRemoteSync]);

  // Update user data
  const updateUserData = useCallback(async (updates: any) => {
    try {
      const updatedData = { ...userData, ...updates };
      
      // Update local storage immediately
      await storage.setUserData(updatedData);
      setUserData(updatedData);

      // If remote sync is enabled, queue for sync
      if (config.enableRemoteSync) {
        setSyncStatus('syncing');
        try {
          // Uncomment when database is integrated:
          // await database.updateUser(userData.id, updates);
          setSyncStatus('synced');
        } catch (error) {
          console.error('Failed to sync user data update:', error);
          setSyncStatus('error');
        }
      }
    } catch (error) {
      console.error('Failed to update user data:', error);
    }
  }, [userData, config.enableRemoteSync]);

  // Initial load
  useEffect(() => {
    if (config.syncOnMount) {
      loadUserData();
    }
  }, [loadUserData, config.syncOnMount]);

  // Set up sync interval if specified
  useEffect(() => {
    if (config.syncInterval && config.enableRemoteSync) {
      const interval = setInterval(loadUserData, config.syncInterval);
      return () => clearInterval(interval);
    }
  }, [loadUserData, config.syncInterval, config.enableRemoteSync]);

  return {
    userData,
    isLoading,
    syncStatus,
    updateUserData,
    refreshData: loadUserData,
  };
}

/**
 * Hook for managing user preferences with optional remote sync
 */
export function useUserPreferences(config: DataConfig = { enableRemoteSync: false, syncOnMount: true }) {
  const [preferences, setPreferences] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const localPreferences = await storage.getUserPreferences();
      if (localPreferences) {
        setPreferences(localPreferences);
      }

      if (config.enableRemoteSync) {
        setSyncStatus('syncing');
        try {
          // Uncomment when database is integrated:
          // const remotePreferences = await database.getUserPreferences(userId);
          // if (remotePreferences) {
          //   setPreferences(remotePreferences.preferences);
          //   setSyncStatus('synced');
          // }
          setSyncStatus('synced'); // Temporary
        } catch (error) {
          console.error('Failed to sync preferences:', error);
          setSyncStatus('error');
        }
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, [config.enableRemoteSync]);

  const updatePreferences = useCallback(async (updates: any) => {
    try {
      const updatedPreferences = { ...preferences, ...updates };
      
      await storage.setUserPreferences(updatedPreferences);
      setPreferences(updatedPreferences);

      if (config.enableRemoteSync) {
        setSyncStatus('syncing');
        try {
          // Uncomment when database is integrated:
          // await database.updateUserPreferences(userId, updatedPreferences);
          setSyncStatus('synced');
        } catch (error) {
          console.error('Failed to sync preferences update:', error);
          setSyncStatus('error');
        }
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  }, [preferences, config.enableRemoteSync]);

  useEffect(() => {
    if (config.syncOnMount) {
      loadPreferences();
    }
  }, [loadPreferences, config.syncOnMount]);

  return {
    preferences,
    isLoading,
    syncStatus,
    updatePreferences,
    refreshData: loadPreferences,
  };
}

/**
 * Hook for managing subscription data with optional remote sync
 */
export function useSubscriptionData(config: DataConfig = { enableRemoteSync: false, syncOnMount: true }) {
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  const loadSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const localSubscription = await storage.get('user_subscription', true);
      if (localSubscription) {
        setSubscription(localSubscription);
      }

      if (config.enableRemoteSync) {
        setSyncStatus('syncing');
        try {
          // Uncomment when database is integrated:
          // const remoteSubscription = await database.getSubscription(userId);
          // if (remoteSubscription) {
          //   setSubscription(remoteSubscription);
          //   setSyncStatus('synced');
          // }
          setSyncStatus('synced'); // Temporary
        } catch (error) {
          console.error('Failed to sync subscription:', error);
          setSyncStatus('error');
        }
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setIsLoading(false);
    }
  }, [config.enableRemoteSync]);

  const updateSubscription = useCallback(async (updates: any) => {
    try {
      const updatedSubscription = { ...subscription, ...updates };
      
      await storage.set('user_subscription', updatedSubscription);
      setSubscription(updatedSubscription);

      if (config.enableRemoteSync) {
        setSyncStatus('syncing');
        try {
          // Uncomment when database is integrated:
          // await database.updateSubscription(userId, updatedSubscription);
          setSyncStatus('synced');
        } catch (error) {
          console.error('Failed to sync subscription update:', error);
          setSyncStatus('error');
        }
      }
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  }, [subscription, config.enableRemoteSync]);

  useEffect(() => {
    if (config.syncOnMount) {
      loadSubscription();
    }
  }, [loadSubscription, config.syncOnMount]);

  return {
    subscription,
    isLoading,
    syncStatus,
    updateSubscription,
    refreshData: loadSubscription,
  };
}

/**
 * Hook for managing general app data with caching and sync
 */
export function useAppData<T>(
  key: string, 
  defaultValue: T | null = null,
  config: DataConfig = { enableRemoteSync: false, syncOnMount: true }
) {
  const [data, setData] = useState<T | null>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const localData = await storage.get(key, true);
      if (localData !== null) {
        setData(localData);
      }

      if (config.enableRemoteSync) {
        setSyncStatus('syncing');
        // Add custom remote sync logic here based on data type
        setSyncStatus('synced');
      }
    } catch (error) {
      console.error(`Failed to load data for key ${key}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key, config.enableRemoteSync]);

  const updateData = useCallback(async (newData: T) => {
    try {
      await storage.set(key, newData);
      setData(newData);

      if (config.enableRemoteSync) {
        setSyncStatus('syncing');
        // Add custom remote sync logic here
        setSyncStatus('synced');
      }
    } catch (error) {
      console.error(`Failed to update data for key ${key}:`, error);
    }
  }, [key, config.enableRemoteSync]);

  const removeData = useCallback(async () => {
    try {
      await storage.remove(key);
      setData(null);
    } catch (error) {
      console.error(`Failed to remove data for key ${key}:`, error);
    }
  }, [key]);

  useEffect(() => {
    if (config.syncOnMount) {
      loadData();
    }
  }, [loadData, config.syncOnMount]);

  return {
    data,
    isLoading,
    syncStatus,
    updateData,
    removeData,
    refreshData: loadData,
  };
}

/**
 * Hook for managing sync queue and offline capabilities
 */
export function useSyncManager() {
  const [queueSize, setQueueSize] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const checkQueueSize = useCallback(async () => {
    try {
      const queue = await storage.get('sync_queue', true) || [];
      setQueueSize(Array.isArray(queue) ? queue.length : 0);
    } catch (error) {
      console.error('Failed to check sync queue size:', error);
    }
  }, []);

  const processQueue = useCallback(async () => {
    try {
      setIsSyncing(true);
      
      // Uncomment when database is integrated:
      // await database.processSyncQueue();
      
      setLastSyncTime(new Date());
      await checkQueueSize();
    } catch (error) {
      console.error('Failed to process sync queue:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [checkQueueSize]);

  const clearQueue = useCallback(async () => {
    try {
      await storage.set('sync_queue', []);
      setQueueSize(0);
    } catch (error) {
      console.error('Failed to clear sync queue:', error);
    }
  }, []);

  useEffect(() => {
    checkQueueSize();
  }, [checkQueueSize]);

  return {
    queueSize,
    isSyncing,
    lastSyncTime,
    processQueue,
    clearQueue,
    refreshQueueSize: checkQueueSize,
  };
}

/**
 * Hook for dashboard data that aggregates multiple data sources
 */
export function useDashboardData(config: DataConfig = { enableRemoteSync: false, syncOnMount: true }) {
  const { userData, isLoading: userLoading } = useUserData(config);
  const { preferences, isLoading: preferencesLoading } = useUserPreferences(config);
  const { subscription, isLoading: subscriptionLoading } = useSubscriptionData(config);
  
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate dashboard statistics
  useEffect(() => {
    if (!userLoading && !preferencesLoading && !subscriptionLoading) {
      const stats = {
        user: userData,
        preferences,
        subscription,
        lastLogin: userData?.lastLogin,
        totalFeatures: subscription?.plan === 'premium' ? 15 : subscription?.plan === 'pro' ? 10 : 5,
        syncStatus: 'online', // This would be dynamic based on network status
      };
      
      setDashboardStats(stats);
      setIsLoading(false);
    }
  }, [userData, preferences, subscription, userLoading, preferencesLoading, subscriptionLoading]);

  return {
    dashboardStats,
    isLoading,
    userData,
    preferences,
    subscription,
  };
} 