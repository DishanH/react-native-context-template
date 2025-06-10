import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserData, useUserPreferences, useSyncManager, useDashboardData } from '../lib/useData';
import { useAuth } from './AuthContext';

/**
 * Data configuration for the app
 * You can enable/disable remote sync as needed
 */
const DATA_CONFIG = {
  enableRemoteSync: process.env.EXPO_PUBLIC_ENABLE_REMOTE_SYNC === 'true',
  syncOnMount: true,
  syncInterval: parseInt(process.env.EXPO_PUBLIC_SYNC_INTERVAL || '300000'), // 5 minutes default
};

/**
 * Data Context Type Definition
 */
type DataContextType = {
  // Data states
  userData: any;
  preferences: any;
  dashboardStats: any;
  
  // Loading states
  isUserDataLoading: boolean;
  isPreferencesLoading: boolean;
  isDashboardLoading: boolean;
  
  // Sync status
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  queueSize: number;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  
  // Data operations
  updateUserData: (updates: any) => Promise<void>;
  updatePreferences: (updates: any) => Promise<void>;
  refreshAllData: () => Promise<void>;
  
  // Sync operations
  processQueue: () => Promise<void>;
  clearQueue: () => Promise<void>;
  
  // Utility
  isOnlineMode: boolean;
};

/**
 * Create the Data Context
 */
const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * Data Provider Component
 * This wraps your app and provides centralized data management
 */
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isOnlineMode, setIsOnlineMode] = useState(DATA_CONFIG.enableRemoteSync);

  // Use the data hooks
  const {
    userData,
    isLoading: isUserDataLoading,
    syncStatus: userSyncStatus,
    updateUserData,
    refreshData: refreshUserData,
  } = useUserData(DATA_CONFIG);

  const {
    preferences,
    isLoading: isPreferencesLoading,
    syncStatus: preferencesSyncStatus,
    updatePreferences,
    refreshData: refreshPreferences,
  } = useUserPreferences(DATA_CONFIG);

  const {
    dashboardStats,
    isLoading: isDashboardLoading,
  } = useDashboardData(DATA_CONFIG);

  const {
    queueSize,
    isSyncing,
    lastSyncTime,
    processQueue,
    clearQueue,
  } = useSyncManager();

  // Determine overall sync status
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  useEffect(() => {
    if (userSyncStatus === 'syncing' || preferencesSyncStatus === 'syncing' || isSyncing) {
      setSyncStatus('syncing');
    } else if (userSyncStatus === 'error' || preferencesSyncStatus === 'error') {
      setSyncStatus('error');
    } else if (userSyncStatus === 'synced' && preferencesSyncStatus === 'synced') {
      setSyncStatus('synced');
    } else {
      setSyncStatus('idle');
    }
  }, [userSyncStatus, preferencesSyncStatus, isSyncing]);

  // Refresh all data
  const refreshAllData = async () => {
    await Promise.all([
      refreshUserData(),
      refreshPreferences(),
    ]);
  };

  // Auto-sync when user logs in
  useEffect(() => {
    if (user?.isAuthenticated && isOnlineMode) {
      refreshAllData();
    }
  }, [user?.isAuthenticated, isOnlineMode]);

  // Auto-process sync queue periodically
  useEffect(() => {
    if (isOnlineMode && queueSize > 0) {
      const interval = setInterval(() => {
        processQueue();
      }, 30000); // Try to sync every 30 seconds when there are pending items

      return () => clearInterval(interval);
    }
  }, [isOnlineMode, queueSize, processQueue]);

  /**
   * Context value
   */
  const value: DataContextType = {
    // Data states
    userData,
    preferences,
    dashboardStats,
    
    // Loading states
    isUserDataLoading,
    isPreferencesLoading,
    isDashboardLoading,
    
    // Sync status
    syncStatus,
    queueSize,
    isSyncing,
    lastSyncTime,
    
    // Data operations
    updateUserData,
    updatePreferences,
    refreshAllData,
    
    // Sync operations
    processQueue,
    clearQueue,
    
    // Utility
    isOnlineMode,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

/**
 * Hook for using the Data Context
 * Must be used within a DataProvider
 */
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  
  return context;
};

/**
 * HOC for components that need data
 * Provides loading states and error handling
 */
export function withData<T extends object>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return function DataWrappedComponent(props: T) {
    const { isUserDataLoading, isPreferencesLoading, isDashboardLoading } = useData();
    
    const isLoading = isUserDataLoading || isPreferencesLoading || isDashboardLoading;
    
    if (isLoading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%' 
        }}>
          <div>Loading...</div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}

/**
 * Example usage in a component:
 * 
 * ```typescript
 * import { useData } from '../contexts/DataContext';
 * 
 * export function MyComponent() {
 *   const { 
 *     userData, 
 *     updateUserData, 
 *     syncStatus, 
 *     queueSize,
 *     processQueue 
 *   } = useData();
 *   
 *   return (
 *     <div>
 *       <h1>Welcome, {userData?.name}</h1>
 *       {syncStatus === 'syncing' && <div>Syncing...</div>}
 *       {queueSize > 0 && (
 *         <button onClick={processQueue}>
 *           Sync {queueSize} pending items
 *         </button>
 *       )}
 *       <button 
 *         onClick={() => updateUserData({ name: 'New Name' })}
 *       >
 *         Update Name
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */ 