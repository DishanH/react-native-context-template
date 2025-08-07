import { ProfileRepository } from '../repositories/profile.repository';
import type { Profile, ProfileInsert, ProfileUpdate } from '../../../types/database';
import type { DatabaseResponse } from '../core/base-repository';

/**
 * Profile Service - Business logic layer for profile operations
 * This layer handles validation, transformations, and complex business rules
 */
export class ProfileService {
  private repository: ProfileRepository;

  constructor() {
    this.repository = new ProfileRepository();
  }

  /**
   * Get user profile with validation
   */
  async getProfile(userId: string): Promise<DatabaseResponse<Profile>> {
    if (!userId) {
      return {
        data: null,
        error: new Error('User ID is required'),
        success: false
      };
    }

    return this.repository.getProfile(userId);
  }

  /**
   * Create profile with validation and business rules
   */
  async createProfile(userId: string, profileData: Partial<ProfileInsert>): Promise<DatabaseResponse<Profile>> {
    // Validation
    if (!userId) {
      return {
        data: null,
        error: new Error('User ID is required'),
        success: false
      };
    }

    if (!profileData.email) {
      return {
        data: null,
        error: new Error('Email is required'),
        success: false
      };
    }

    // Business rules
    const sanitizedData = this.sanitizeProfileData(profileData);
    
    return this.repository.createProfile(userId, sanitizedData);
  }

  /**
   * Update profile with validation
   */
  async updateProfile(userId: string, updates: Partial<ProfileUpdate>): Promise<DatabaseResponse<Profile>> {
    if (!userId) {
      return {
        data: null,
        error: new Error('User ID is required'),
        success: false
      };
    }

    // Validate email format if provided
    if (updates.email && !this.isValidEmail(updates.email)) {
      return {
        data: null,
        error: new Error('Invalid email format'),
        success: false
      };
    }

    // Sanitize data
    const sanitizedUpdates = this.sanitizeProfileData(updates);
    
    return this.repository.updateProfile(userId, sanitizedUpdates);
  }

  /**
   * Delete profile with confirmation
   */
  async deleteProfile(userId: string, confirmDelete: boolean = false): Promise<DatabaseResponse<boolean>> {
    if (!userId) {
      return {
        data: null,
        error: new Error('User ID is required'),
        success: false
      };
    }

    if (!confirmDelete) {
      return {
        data: null,
        error: new Error('Delete confirmation required'),
        success: false
      };
    }

    return this.repository.deleteProfile(userId);
  }

  /**
   * Update avatar URL with validation
   */
  async updateAvatar(userId: string, avatarUrl: string): Promise<DatabaseResponse<Profile>> {
    if (!this.isValidUrl(avatarUrl)) {
      return {
        data: null,
        error: new Error('Invalid avatar URL'),
        success: false
      };
    }

    return this.repository.updateProfile(userId, { avatar_url: avatarUrl });
  }

  /**
   * Subscribe to profile changes
   */
  subscribeToChanges(userId: string, callback: (profile: Profile) => void) {
    return this.repository.subscribeToProfileChanges(userId, (payload) => {
      if (payload.new) {
        callback(payload.new as Profile);
      }
    });
  }

  /**
   * Private helper methods
   */
  private sanitizeProfileData(data: Partial<ProfileInsert | ProfileUpdate>): typeof data {
    const sanitized = { ...data };
    
    // Trim strings
    if (sanitized.full_name) {
      sanitized.full_name = sanitized.full_name.trim();
    }
    
    if (sanitized.bio) {
      sanitized.bio = sanitized.bio.trim();
      // Limit bio length
      if (sanitized.bio.length > 500) {
        sanitized.bio = sanitized.bio.substring(0, 500);
      }
    }
    
    if (sanitized.email) {
      sanitized.email = sanitized.email.trim().toLowerCase();
    }
    
    return sanitized;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
