import { Platform } from 'react-native';
import { storage } from '../storage';
import { databaseClient } from './core/client';
import { ProfileRepository, PreferencesRepository, SubscriptionRepository } from './repositories';
import { ProfileService, SyncService } from './services';

// Core database exports
export { BaseRepository } from './core/base-repository';
export type { DatabaseResponse, SyncQueueItem } from './core/base-repository';
export { ProfileRepository, PreferencesRepository, SubscriptionRepository } from './repositories';
export { ProfileService, SyncService } from './services';
export { databaseClient };

// Convenience instances - ready to use
export const profileService = new ProfileService();
export const syncService = new SyncService();

// You can also export repository instances if needed
export const profileRepository = new ProfileRepository();
export const preferencesRepository = new PreferencesRepository();
export const subscriptionRepository = new SubscriptionRepository();

// Compatibility layer: expose a `database` API matching the previous monolithic interface
export const database = {
  // Profiles
  async getProfile(userId: string) {
    return profileRepository.getProfile(userId);
  },
  async createProfile(userId: string, profileInput: any) {
    return profileRepository.createProfile(userId, profileInput);
  },
  async updateProfile(userId: string, updates: any) {
    return profileRepository.updateProfile(userId, updates);
  },

  // Preferences
  async getUserPreferences(userId: string) {
    return preferencesRepository.getPreferences(userId);
  },
  async updateUserPreferences(userId: string, preferences: any) {
    return preferencesRepository.updatePreferences(userId, preferences);
  },

  // Subscriptions
  async getSubscription(userId: string) {
    return subscriptionRepository.getSubscription(userId);
  },
  async updateSubscription(userId: string, subscription: any) {
    return subscriptionRepository.updateSubscription(userId, subscription);
  },

  // Auth
  async signInWithEmail(email: string, password: string) {
    const supabase = databaseClient.getClient();
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
  async resendVerificationEmail(email: string) {
    const supabase = databaseClient.getClient();
    if (!supabase) throw new Error('Supabase not initialized');

    const getEmailRedirectUrl = () => {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && (window as any).location && (window as any).location.origin) {
          return `${(window as any).location.origin}/auth/callback`;
        }
        return 'http://localhost:8081/auth/callback';
      }
      return 'rn-context-template://auth/callback';
    };

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: getEmailRedirectUrl() },
    });
    if (error) throw error;
    return true;
  },
  async signUpWithEmail(email: string, password: string, name: string) {
    const supabase = databaseClient.getClient();
    if (!supabase) throw new Error('Supabase not initialized');

    const getEmailRedirectUrl = () => {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && (window as any).location && (window as any).location.origin) {
          return `${(window as any).location.origin}/auth/callback`;
        }
        return 'http://localhost:8081/auth/callback';
      }
      return 'rn-context-template://auth/callback';
    };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: getEmailRedirectUrl(),
      },
    });
    if (error) throw error;
    return data;
  },
  async signInWithProvider(provider: 'google' | 'apple') {
    const supabase = databaseClient.getClient();
    if (!supabase) throw new Error('Supabase not initialized');

    const getRedirectUrl = () => {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && (window as any).location && (window as any).location.origin) {
          return `${(window as any).location.origin}/auth/callback`;
        }
        return 'http://localhost:8081/auth/callback';
      }
      return 'rn-context-template://auth/callback';
    };

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: getRedirectUrl() },
    });
    if (error) throw error;
    return data;
  },
  async getSession() {
    return databaseClient.getSession();
  },
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return databaseClient.onAuthStateChange(callback);
  },
  async signOut() {
    const supabase = databaseClient.getClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    await storage.remove('userData');
    await storage.setAuthStatus(false);
  },
  getSupabaseClient() {
    return databaseClient.getClient();
  },
  async processSyncQueue() {
    return syncService.processSyncQueue();
  },
};
