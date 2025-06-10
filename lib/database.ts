import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { storage } from './storage';

// Supabase configuration
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Database table names
export const TABLES = {
  USERS: 'users',
  USER_PREFERENCES: 'user_preferences',
  SUBSCRIPTIONS: 'subscriptions',
  USER_DATA: 'user_data',
  SYNC_QUEUE: 'sync_queue',
} as const;

// Sync status enum
export enum SyncStatus {
  PENDING = 'pending',
  SYNCED = 'synced',
  FAILED = 'failed',
}

// Database interfaces
export interface DatabaseUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_seen: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  preferences: any;
  sync_status: SyncStatus;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  payment_method?: string;
  sync_status: SyncStatus;
  created_at: string;
  updated_at: string;
}

export interface SyncQueueItem {
  id: string;
  table_name: string;
  record_id: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  sync_status: SyncStatus;
  attempts: number;
  created_at: string;
  updated_at: string;
}

/**
 * Database Manager - Handles both local storage and Supabase operations
 * This creates a hybrid system that works offline and syncs when online
 */
class DatabaseManager {
  private supabase: SupabaseClient | null = null;
  private isOnline: boolean = true;
  private syncQueue: SyncQueueItem[] = [];

  constructor() {
    this.initializeSupabase();
    this.setupNetworkListener();
  }

  /**
   * Initialize Supabase client
   */
  private initializeSupabase() {
    try {
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
          },
          realtime: {
            params: {
              eventsPerSecond: 10,
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to initialize Supabase:', error);
    }
  }

  /**
   * Setup network connectivity listener
   */
  private setupNetworkListener() {
    // In a real app, you'd use @react-native-community/netinfo
    // For now, we'll assume online status
    this.isOnline = true;
  }

  /**
   * Check if Supabase is available
   */
  private isSupabaseAvailable(): boolean {
    return this.supabase !== null && this.isOnline;
  }

  /**
   * Get current user from Supabase session
   */
  async getCurrentUser() {
    if (!this.isSupabaseAvailable()) {
      // Fallback to local storage
      return await storage.getUserData();
    }

    try {
      const { data: { user } } = await this.supabase!.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return await storage.getUserData();
    }
  }

  /**
   * User Operations
   */
  async createUser(userData: Partial<DatabaseUser>) {
    const localData = { ...userData, id: userData.id || Date.now().toString() };
    
    // Always save locally first
    await storage.setUserData(localData);

    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.supabase!
          .from(TABLES.USERS)
          .insert([localData])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error creating user in Supabase:', error);
        await this.addToSyncQueue(TABLES.USERS, localData.id!, 'insert', localData);
      }
    } else {
      await this.addToSyncQueue(TABLES.USERS, localData.id!, 'insert', localData);
    }

    return localData;
  }

  async updateUser(userId: string, updates: Partial<DatabaseUser>) {
    // Update locally first
    const currentUser = await storage.getUserData();
    const updatedUser = { ...currentUser, ...updates, updated_at: new Date().toISOString() };
    await storage.setUserData(updatedUser);

    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.supabase!
          .from(TABLES.USERS)
          .update(updates)
          .eq('id', userId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error updating user in Supabase:', error);
        await this.addToSyncQueue(TABLES.USERS, userId, 'update', updates);
      }
    } else {
      await this.addToSyncQueue(TABLES.USERS, userId, 'update', updates);
    }

    return updatedUser;
  }

  async getUser(userId: string) {
    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.supabase!
          .from(TABLES.USERS)
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        
        // Update local cache
        await storage.setUserData(data);
        return data;
      } catch (error) {
        console.error('Error fetching user from Supabase:', error);
      }
    }

    // Fallback to local storage
    return await storage.getUserData();
  }

  /**
   * User Preferences Operations
   */
  async updateUserPreferences(userId: string, preferences: any) {
    const localData = {
      user_id: userId,
      preferences,
      sync_status: SyncStatus.PENDING,
      updated_at: new Date().toISOString(),
    };

    // Update locally first
    await storage.setUserPreferences(preferences);

    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.supabase!
          .from(TABLES.USER_PREFERENCES)
          .upsert([{ ...localData, sync_status: SyncStatus.SYNCED }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error updating preferences in Supabase:', error);
        await this.addToSyncQueue(TABLES.USER_PREFERENCES, userId, 'update', localData);
      }
    } else {
      await this.addToSyncQueue(TABLES.USER_PREFERENCES, userId, 'update', localData);
    }

    return localData;
  }

  async getUserPreferences(userId: string) {
    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.supabase!
          .from(TABLES.USER_PREFERENCES)
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
        
        if (data) {
          // Update local cache
          await storage.setUserPreferences(data.preferences);
          return data;
        }
      } catch (error) {
        console.error('Error fetching preferences from Supabase:', error);
      }
    }

    // Fallback to local storage
    const localPreferences = await storage.getUserPreferences();
    return localPreferences ? { user_id: userId, preferences: localPreferences } : null;
  }

  /**
   * Subscription Operations
   */
  async updateSubscription(userId: string, subscription: any) {
    const localData = {
      user_id: userId,
      ...subscription,
      sync_status: SyncStatus.PENDING,
      updated_at: new Date().toISOString(),
    };

    // Update locally first
    await storage.set('user_subscription', subscription);

    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.supabase!
          .from(TABLES.SUBSCRIPTIONS)
          .upsert([{ ...localData, sync_status: SyncStatus.SYNCED }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error updating subscription in Supabase:', error);
        await this.addToSyncQueue(TABLES.SUBSCRIPTIONS, userId, 'update', localData);
      }
    } else {
      await this.addToSyncQueue(TABLES.SUBSCRIPTIONS, userId, 'update', localData);
    }

    return localData;
  }

  async getSubscription(userId: string) {
    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.supabase!
          .from(TABLES.SUBSCRIPTIONS)
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          // Update local cache
          await storage.set('user_subscription', data);
          return data;
        }
      } catch (error) {
        console.error('Error fetching subscription from Supabase:', error);
      }
    }

    // Fallback to local storage
    return await storage.get('user_subscription', true);
  }

  /**
   * Sync Queue Operations
   */
  private async addToSyncQueue(tableName: string, recordId: string, operation: 'insert' | 'update' | 'delete', data: any) {
    const queueItem: SyncQueueItem = {
      id: `${tableName}_${recordId}_${Date.now()}`,
      table_name: tableName,
      record_id: recordId,
      operation,
      data,
      sync_status: SyncStatus.PENDING,
      attempts: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store in local sync queue
    const currentQueue = await storage.get('sync_queue', true) || [];
    currentQueue.push(queueItem);
    await storage.set('sync_queue', currentQueue);
  }

  /**
   * Process sync queue - call this when network is available
   */
  async processSyncQueue() {
    if (!this.isSupabaseAvailable()) return;

    const queue = await storage.get('sync_queue', true) || [];
    const pendingItems = queue.filter((item: SyncQueueItem) => 
      item.sync_status === SyncStatus.PENDING && item.attempts < 3
    );

    for (const item of pendingItems) {
      try {
        await this.syncQueueItem(item);
        
        // Remove successful item from queue
        const updatedQueue = queue.filter((q: SyncQueueItem) => q.id !== item.id);
        await storage.set('sync_queue', updatedQueue);
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
        
        // Update attempts
        item.attempts += 1;
        item.sync_status = item.attempts >= 3 ? SyncStatus.FAILED : SyncStatus.PENDING;
        
        const updatedQueue = queue.map((q: SyncQueueItem) => 
          q.id === item.id ? item : q
        );
        await storage.set('sync_queue', updatedQueue);
      }
    }
  }

  private async syncQueueItem(item: SyncQueueItem) {
    if (!this.supabase) throw new Error('Supabase not available');

    switch (item.operation) {
      case 'insert':
        const { error: insertError } = await this.supabase
          .from(item.table_name)
          .insert([item.data]);
        if (insertError) throw insertError;
        break;

      case 'update':
        const { error: updateError } = await this.supabase
          .from(item.table_name)
          .update(item.data)
          .eq('id', item.record_id);
        if (updateError) throw updateError;
        break;

      case 'delete':
        const { error: deleteError } = await this.supabase
          .from(item.table_name)
          .delete()
          .eq('id', item.record_id);
        if (deleteError) throw deleteError;
        break;
    }
  }

  /**
   * Real-time subscriptions for live data updates
   */
  subscribeToUserChanges(userId: string, callback: (payload: any) => void) {
    if (!this.isSupabaseAvailable()) return null;

    return this.supabase!
      .channel(`user_${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: TABLES.USERS,
          filter: `id=eq.${userId}` 
        }, 
        callback
      )
      .subscribe();
  }

  subscribeToPreferencesChanges(userId: string, callback: (payload: any) => void) {
    if (!this.isSupabaseAvailable()) return null;

    return this.supabase!
      .channel(`preferences_${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: TABLES.USER_PREFERENCES,
          filter: `user_id=eq.${userId}` 
        }, 
        callback
      )
      .subscribe();
  }

  /**
   * Cleanup and logout
   */
  async signOut() {
    if (this.supabase) {
      await this.supabase.auth.signOut();
    }
    
    // Clear local data
    await storage.clearAll();
  }

  /**
   * Get Supabase instance for direct access if needed
   */
  getSupabaseClient() {
    return this.supabase;
  }
}

// Export singleton instance
export const database = new DatabaseManager(); 