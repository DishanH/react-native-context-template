import { BaseRepository, DatabaseResponse } from '../core/base-repository';
import { storage } from '../../storage';
import type { Profile, ProfileInsert, ProfileUpdate } from '../../../types/database';

export class ProfileRepository extends BaseRepository {
  constructor() {
    super('profiles');
  }

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<DatabaseResponse<Profile>> {
    return this.executeWithFallback(
      // Online operation
      async () => {
        const supabase = this.client.getClient();
        if (!supabase) throw new Error('Supabase client not available');

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        return data;
      },
      // Offline fallback
      async () => {
        const localData = await storage.getUserData();
        return localData as Profile;
      }
    );
  }

  /**
   * Create a new profile
   */
  async createProfile(userId: string, profileInput: Partial<ProfileInsert>): Promise<DatabaseResponse<Profile>> {
    const newProfile: ProfileInsert = {
      id: userId,
      email: profileInput.email || '',
      full_name: profileInput.full_name || null,
      avatar_url: profileInput.avatar_url || null,
      bio: profileInput.bio || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return this.executeWithFallback(
      // Online operation
      async () => {
        const supabase = this.client.getClient();
        if (!supabase) throw new Error('Supabase client not available');

        // Try using the RPC function first
        try {
          const { error: rpcError } = await supabase
            .rpc('handle_new_user_manual', {
              user_id: userId,
              user_email: profileInput.email || '',
              user_full_name: profileInput.full_name || profileInput.email?.split('@')[0] || 'User'
            });

          if (rpcError) throw rpcError;

          // Get the created profile
          const { data: fetchedProfile, error: getError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (getError) throw getError;
          return fetchedProfile;
        } catch {
          // Fallback to direct insert
          const { data, error } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

          if (error) throw error;
          return data;
        }
      },
      // Offline fallback
      async () => {
        // Store locally for sync later
        await storage.setUserData(newProfile as any);
        return newProfile as Profile;
      },
      // Sync data
      { recordId: userId, operation: 'insert', data: newProfile }
    );
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<ProfileUpdate>): Promise<DatabaseResponse<Profile>> {
    return this.executeWithFallback(
      // Online operation
      async () => {
        const supabase = this.client.getClient();
        if (!supabase) throw new Error('Supabase client not available');

        // Try using the RPC function first
        try {
          const { data, error } = await supabase
            .rpc('update_user_profile', {
              profile_data: updates as any
            });

          if (error) throw error;
          return data;
        } catch {
          // Fallback to direct update
          const { data, error } = await supabase
            .from('profiles')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();

          if (error) throw error;
          return data;
        }
      },
      // Offline fallback
      async () => {
        // Update local data
        const currentData = await storage.getUserData() || {};
        const updatedData = { ...currentData, ...updates };
        await storage.setUserData(updatedData);
        return updatedData as Profile;
      },
      // Sync data
      { recordId: userId, operation: 'update', data: updates }
    );
  }

  /**
   * Delete user profile
   */
  async deleteProfile(userId: string): Promise<DatabaseResponse<boolean>> {
    return this.executeWithFallback(
      // Online operation
      async () => {
        const supabase = this.client.getClient();
        if (!supabase) throw new Error('Supabase client not available');

        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (error) throw error;
        return true;
      },
      // Offline fallback
      async () => {
        await storage.remove('userData');
        return true;
      },
      // Sync data
      { recordId: userId, operation: 'delete', data: {} }
    );
  }

  /**
   * Subscribe to profile changes
   */
  subscribeToProfileChanges(userId: string, callback: (payload: any) => void) {
    return this.subscribeToChanges(`id=eq.${userId}`, callback);
  }
}
