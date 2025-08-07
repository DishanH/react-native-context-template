import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { storage } from './storage';
import type { Database, Profile, UserPreferences as DBUserPreferences, Subscription, UserPreferencesData, DatabaseResponse } from '../types/database';

// Supabase configuration
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Database table names
export const TABLES = {
  PROFILES: 'profiles',
  USER_PREFERENCES: 'user_preferences',
  SUBSCRIPTIONS: 'subscriptions',
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
        this.supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: Platform.OS === 'web',
            storage: Platform.OS === 'web' ? undefined : {
              getItem: (key) => storage.get(key, false),
              setItem: (key, value) => storage.set(key, value),
              removeItem: (key) => storage.remove(key),
            },
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
   * Profile Operations
   */
  async getProfile(userId: string): Promise<DatabaseResponse<Profile>> {
    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.supabase!
          .from(TABLES.PROFILES)
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        
        // Note: User data storage is handled in AuthContext to avoid duplication
        // and optimize for SecureStore size limits
        return { data, error: null, success: true };
      } catch (error) {
        console.error('Error fetching profile from Supabase:', error);
        const localData = await storage.getUserData();
        return { data: localData as Profile, error: error as Error, success: false };
      }
    }

    // Fallback to local storage
    const localData = await storage.getUserData();
    return { data: localData as Profile, error: null, success: true };
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<DatabaseResponse<Profile>> {
    // Note: Local user data storage is handled in AuthContext to optimize for SecureStore limits
    
    if (this.isSupabaseAvailable()) {
      try {
        // First try to update using the function
        const { data, error } = await this.supabase!
          .rpc('update_user_profile', {
            profile_data: updates as any
          });

        if (error) {
          // If the function fails (maybe profile doesn't exist), try direct insert
          const { data: insertData, error: insertError } = await this.supabase!
            .from(TABLES.PROFILES)
            .insert([{
              id: userId,
              email: updates.email || '',
              full_name: updates.full_name,
              avatar_url: updates.avatar_url,
              bio: updates.bio,
              created_at: updates.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }])
            .select()
            .single();

          if (insertError) throw insertError;
          return { data: insertData, error: null, success: true };
        }

        return { data, error: null, success: true };
      } catch (error) {
        console.error('Error updating profile in Supabase:', error);
        await this.addToSyncQueue(TABLES.PROFILES, userId, 'update', updates);
        return { data: null, error: error as Error, success: false };
      }
    } else {
      await this.addToSyncQueue(TABLES.PROFILES, userId, 'update', updates);
    }

    return { data: null, error: null, success: true };
  }

  async createProfile(userId: string, profileInput: Partial<Profile>): Promise<DatabaseResponse<Profile>> {
    // Note: User data storage is handled in AuthContext to optimize for SecureStore limits
    const newProfile: Profile = {
      id: userId,
      email: profileInput.email || '',
      full_name: profileInput.full_name || null,
      avatar_url: profileInput.avatar_url || null,
      bio: profileInput.bio || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (this.isSupabaseAvailable()) {
      try {
        // Call the handle_new_user function directly to create profile, subscription, and preferences
        const { data, error } = await this.supabase!
          .rpc('handle_new_user_manual', {
            user_id: userId,
            user_email: profileInput.email || '',
            user_full_name: profileInput.full_name || profileInput.email?.split('@')[0] || 'User'
          });

        if (error) {
          console.warn('handle_new_user_manual function failed, falling back to direct insert:', error);
          
          // Fallback: create profile directly
          const { data: profileData, error: profileError } = await this.supabase!
            .from(TABLES.PROFILES)
            .insert([newProfile])
            .select()
            .single();

          if (profileError) throw profileError;
          return { data: profileData, error: null, success: true };
        }

        // Get the created profile
        const { data: profileData, error: getError } = await this.supabase!
          .from(TABLES.PROFILES)
          .select('*')
          .eq('id', userId)
          .single();

        if (getError) throw getError;
        return { data: profileData, error: null, success: true };

      } catch (error) {
        console.error('Error creating profile in Supabase:', error);
        await this.addToSyncQueue(TABLES.PROFILES, userId, 'insert', newProfile);
        return { data: newProfile, error: error as Error, success: false };
      }
    } else {
      await this.addToSyncQueue(TABLES.PROFILES, userId, 'insert', newProfile);
    }

    return { data: newProfile, error: null, success: true };
  }



  /**
   * User Preferences Operations
   */
  async updateUserPreferences(userId: string, preferences: UserPreferencesData): Promise<DatabaseResponse<DBUserPreferences>> {
    // Update locally first
    await storage.setUserPreferences(preferences);

    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.supabase!
          .rpc('update_user_preferences', {
            new_preferences: preferences as any
          });

        if (error) throw error;
        return { data, error: null, success: true };
      } catch (error) {
        console.error('Error updating preferences in Supabase:', error);
        await this.addToSyncQueue(TABLES.USER_PREFERENCES, userId, 'update', { preferences });
        return { data: null, error: error as Error, success: false };
      }
    } else {
      await this.addToSyncQueue(TABLES.USER_PREFERENCES, userId, 'update', { preferences });
    }

    return { data: null, error: null, success: true };
  }

  async getUserPreferences(userId: string): Promise<DatabaseResponse<UserPreferencesData>> {
    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.supabase!
          .rpc('get_user_preferences', { user_uuid: userId });

        if (error) throw error;
        
        if (data && data.length > 0) {
          const preferences = data[0].preferences as UserPreferencesData;
          // Update local cache
          await storage.setUserPreferences(preferences);
          return { data: preferences, error: null, success: true };
        }
      } catch (error) {
        console.error('Error fetching preferences from Supabase:', error);
      }
    }

    // Fallback to local storage
    const localPreferences = await storage.getUserPreferences();
    return { 
      data: localPreferences as UserPreferencesData, 
      error: null, 
      success: true 
    };
  }

  /**
   * Subscription Operations
   */
  async updateSubscription(userId: string, subscription: Partial<Subscription>): Promise<DatabaseResponse<Subscription>> {
    // Update locally first
    await storage.set('user_subscription', subscription);

    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.supabase!
          .from(TABLES.SUBSCRIPTIONS)
          .update(subscription)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null, success: true };
      } catch (error) {
        console.error('Error updating subscription in Supabase:', error);
        await this.addToSyncQueue(TABLES.SUBSCRIPTIONS, userId, 'update', subscription);
        return { data: null, error: error as Error, success: false };
      }
    } else {
      await this.addToSyncQueue(TABLES.SUBSCRIPTIONS, userId, 'update', subscription);
    }

    return { data: null, error: null, success: true };
  }

  async getSubscription(userId: string): Promise<DatabaseResponse<Subscription>> {
    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.supabase!
          .rpc('get_user_subscription', { user_uuid: userId });

        if (error) throw error;
        
        if (data && data.length > 0) {
          const subscription = data[0] as Subscription;
          // Update local cache
          await storage.set('user_subscription', subscription);
          return { data: subscription, error: null, success: true };
        }
      } catch (error) {
        console.error('Error fetching subscription from Supabase:', error);
      }
    }

    // Fallback to local storage
    const localSubscription = await storage.get('user_subscription', true);
    return { 
      data: localSubscription as Subscription, 
      error: null, 
      success: true 
    };
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
    
    // Limit queue size to prevent storage overflow (max 100 items)
    const MAX_QUEUE_SIZE = 100;
    if (currentQueue.length >= MAX_QUEUE_SIZE) {
      console.warn(`Sync queue is at maximum size (${MAX_QUEUE_SIZE}). Removing oldest items.`);
      // Remove the oldest items (FIFO)
      currentQueue.splice(0, currentQueue.length - MAX_QUEUE_SIZE + 1);
    }
    
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
  subscribeToProfileChanges(userId: string, callback: (payload: any) => void) {
    if (!this.isSupabaseAvailable()) return null;

    return this.supabase!
      .channel(`profile_${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: TABLES.PROFILES,
          filter: `id=eq.${userId}` 
        }, 
        callback
      )
      .subscribe();
  }

  subscribeToSubscriptionChanges(userId: string, callback: (payload: any) => void) {
    if (!this.isSupabaseAvailable()) return null;

    return this.supabase!
      .channel(`subscription_${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: TABLES.SUBSCRIPTIONS,
          filter: `user_id=eq.${userId}` 
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
   * Authentication methods
   */
  async signInWithEmail(email: string, password: string) {
    if (!this.supabase) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('signInWithEmail', data, error);

    if (error) throw error;
    return data;
  }

  async resendVerificationEmail(email: string) {
    if (!this.supabase) {
      throw new Error('Supabase not initialized');
    }

    // Get redirect URL for email verification
    const getEmailRedirectUrl = () => {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.location && window.location.origin) {
          return `${window.location.origin}/auth/callback`;
        }
        // Fallback for web if window.location.origin is not available
        return 'http://localhost:8081/auth/callback';
      }
      return 'rn-context-template://auth/callback';
    };

    const { error } = await this.supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: getEmailRedirectUrl(),
      },
    });

    if (error) throw error;
    return true;
  }

  async signUpWithEmail(email: string, password: string, name: string) {
    if (!this.supabase) {
      throw new Error('Supabase not initialized');
    }

    // Get redirect URL for email verification
    const getEmailRedirectUrl = () => {
      console.log('getEmailRedirectUrl', Platform.OS);
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.location && window.location.origin) {
          return `${window.location.origin}/auth/callback`;
        }
        // Fallback for web if window.location.origin is not available
        return 'http://localhost:8081/auth/callback';
      }
      return 'rn-context-template://auth/callback';
    };

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: getEmailRedirectUrl(),
      },
    });

    if (error) throw error;
    return data;
  }

  async signInWithProvider(provider: 'google' | 'apple') {
    if (!this.supabase) {
      throw new Error('Supabase not initialized');
    }

    // Get redirect URL safely for web
    const getRedirectUrl = () => {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.location && window.location.origin) {
          return `${window.location.origin}/auth/callback`;
        }
        // Fallback for web if window.location.origin is not available
        return 'http://localhost:8081/auth/callback';
      }
      return 'rn-context-template://auth/callback';
    };

    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getRedirectUrl(),
      },
    });

    if (error) throw error;
    return data;
  }

  async getSession() {
    if (!this.supabase) {
      return null;
    }

    const { data: { session } } = await this.supabase.auth.getSession();
    return session;
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!this.supabase) {
      return { data: { subscription: null } };
    }

    return this.supabase.auth.onAuthStateChange(callback);
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