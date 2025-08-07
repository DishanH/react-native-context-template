import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { storage } from '../../storage';
import type { Database } from '../../../types/database';

// Supabase configuration
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Centralized Supabase client with proper configuration
 */
class DatabaseClient {
  private static instance: DatabaseClient;
  private supabase: SupabaseClient<Database> | null = null;

  private constructor() {
    this.initializeClient();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  /**
   * Initialize Supabase client
   */
  private initializeClient() {
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
   * Get Supabase client instance
   */
  getClient(): SupabaseClient<Database> | null {
    return this.supabase;
  }

  /**
   * Check if client is available and online
   */
  isAvailable(): boolean {
    return this.supabase !== null;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const { data: { user } } = await this.supabase!.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    if (!this.isAvailable()) {
      return null;
    }

    const { data: { session } } = await this.supabase!.auth.getSession();
    return session;
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!this.isAvailable()) {
      return { data: { subscription: null } };
    }

    return this.supabase!.auth.onAuthStateChange(callback);
  }
}

// Export singleton instance
export const databaseClient = DatabaseClient.getInstance();
export type { Database };
