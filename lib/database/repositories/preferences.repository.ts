import { BaseRepository, DatabaseResponse } from '../core/base-repository';
import { storage } from '../../storage';
import type { UserPreferences, UserPreferencesData } from '../../../types/database';

export class PreferencesRepository extends BaseRepository {
  constructor() {
    super('user_preferences');
  }

  /**
   * Get user preferences
   */
  async getPreferences(userId: string): Promise<DatabaseResponse<UserPreferencesData>> {
    return this.executeWithFallback(
      // Online operation
      async () => {
        const supabase = this.client.getClient();
        if (!supabase) throw new Error('Supabase client not available');

        const { data, error } = await supabase
          .rpc('get_user_preferences', { user_uuid: userId });

        if (error) throw error;
        
        if (data && data.length > 0) {
          const preferences = data[0].preferences as UserPreferencesData;
          // Update local cache
          await storage.setUserPreferences(preferences);
          return preferences;
        }
        
        throw new Error('No preferences found');
      },
      // Offline fallback
      async () => {
        const localPreferences = await storage.getUserPreferences();
        return localPreferences as UserPreferencesData;
      }
    );
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId: string, preferences: UserPreferencesData): Promise<DatabaseResponse<UserPreferences>> {
    return this.executeWithFallback(
      // Online operation
      async () => {
        const supabase = this.client.getClient();
        if (!supabase) throw new Error('Supabase client not available');

        const { data, error } = await supabase
          .rpc('update_user_preferences', {
            new_preferences: preferences as any
          });

        if (error) throw error;
        
        // Update local cache on success
        await storage.setUserPreferences(preferences);
        return data;
      },
      // Offline fallback
      async () => {
        // Update locally
        await storage.setUserPreferences(preferences);
        
        // Return a mock UserPreferences object
        return {
          id: `temp_${Date.now()}`,
          user_id: userId,
          preferences: preferences as any,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserPreferences;
      },
      // Sync data
      { recordId: userId, operation: 'update', data: { preferences } }
    );
  }

  /**
   * Create default preferences for new user
   */
  async createDefaultPreferences(userId: string): Promise<DatabaseResponse<UserPreferences>> {
    const defaultPreferences: UserPreferencesData = {
      theme: 'system',
      notifications: {
        push: true,
        email: true,
        sms: false,
        marketing: false
      },
      privacy: {
        analytics: true,
        crashReporting: true,
        dataSharing: false
      },
      accessibility: {
        fontSize: 'medium',
        highContrast: false,
        reduceMotion: false,
        voiceOver: false
      },
      language: 'en',
      region: 'US',
      currency: 'USD',
      autoLock: true,
      biometricAuth: false
    };

    return this.updatePreferences(userId, defaultPreferences);
  }

  /**
   * Subscribe to preferences changes
   */
  subscribeToPreferencesChanges(userId: string, callback: (payload: any) => void) {
    return this.subscribeToChanges(`user_id=eq.${userId}`, callback);
  }
}
