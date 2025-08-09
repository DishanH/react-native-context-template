import { database } from './database';
import * as FileSystem from 'expo-file-system';

/**
 * Supabase Storage Manager for User Avatars
 * Handles uploading, downloading, and managing user profile pictures
 */

const AVATAR_BUCKET = 'user-avatars';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

class StorageBucketManager {
  private supabase = database.getSupabaseClient();

  /**
   * Upload user avatar to Supabase Storage
   * @param userId - User's unique ID
   * @param fileUri - Local file URI from image picker
   * @param fileName - Optional custom filename
   * @returns UploadResult with success status and public URL
   */
  async uploadAvatar(userId: string, fileUri: string, fileName?: string): Promise<UploadResult> {
    if (!this.supabase) {
      return { success: false, error: 'Supabase client not available' };
    }

    try {
      const timestamp = Date.now();
      const finalFileName = fileName || `avatar_${timestamp}.jpg`;
      const filePath = `${userId}/${finalFileName}`;

      // For web, fetch the fileUri and convert to Blob
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const { error } = await this.supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: true,
          contentType: blob.type || 'image/jpeg',
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL for the uploaded file
      const { data: urlData } = this.supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: urlData.publicUrl,
      };

    } catch (error) {
      console.error('Avatar upload failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  /**
   * Alternative upload method for React Native
   * Uses blob/arrayBuffer approach for better compatibility
   */
  async uploadAvatarRN(userId: string, fileUri: string, fileName?: string): Promise<UploadResult> {
    if (!this.supabase) {
      return { success: false, error: 'Supabase client not available' };
    }

    try {
      // Read file as base64 to avoid 0KB blobs in RN fetch -> blob
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const bytes = this.base64ToUint8Array(base64);

      // Validate file size
      if (bytes.byteLength > MAX_FILE_SIZE) {
        return { success: false, error: 'File size too large (max 5MB)' };
      }

      // Create filename
      const timestamp = Date.now();
      const extension = this.getFileExtension(fileUri) || 'jpg';
      const finalFileName = fileName || `avatar_${timestamp}.${extension}`;
      const filePath = `${userId}/${finalFileName}`;

      // Upload to Supabase Storage
      const { error } = await this.supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, bytes, {
          cacheControl: '3600',
          upsert: true,
          contentType: this.getMimeTypeFromExtension(extension),
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: urlData.publicUrl,
      };

    } catch (error) {
      console.error('Avatar upload failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  /**
   * Delete user's avatar from storage
   * @param userId - User's unique ID
   * @param fileName - Filename to delete (optional, deletes all if not provided)
   */
  async deleteAvatar(userId: string, fileName?: string): Promise<boolean> {
    if (!this.supabase) {
      return false;
    }

    try {
      let filesToDelete: string[] = [];

      if (fileName) {
        filesToDelete = [`${userId}/${fileName}`];
      } else {
        // List all files for user and delete them
        const { data: files } = await this.supabase.storage
          .from(AVATAR_BUCKET)
          .list(userId);

        if (files && files.length > 0) {
          filesToDelete = files.map(file => `${userId}/${file.name}`);
        }
      }

      if (filesToDelete.length === 0) {
        return true; // Nothing to delete
      }

      const { error } = await this.supabase.storage
        .from(AVATAR_BUCKET)
        .remove(filesToDelete);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Avatar deletion failed:', error);
      return false;
    }
  }

  /**
   * Get public URL for user's avatar
   * @param userId - User's unique ID
   * @param fileName - Filename to get URL for
   */
  getAvatarUrl(userId: string, fileName: string): string | null {
    if (!this.supabase) {
      return null;
    }

    const filePath = `${userId}/${fileName}`;
    const { data } = this.supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * List all avatars for a user
   * @param userId - User's unique ID
   */
  async listUserAvatars(userId: string) {
    if (!this.supabase) {
      return [];
    }

    try {
      const { data: files, error } = await this.supabase.storage
        .from(AVATAR_BUCKET)
        .list(userId);

      if (error) {
        console.error('List error:', error);
        return [];
      }

      return files || [];
    } catch (error) {
      console.error('Failed to list avatars:', error);
      return [];
    }
  }

  /**
   * Create storage bucket if it doesn't exist
   * Note: This should be done in Supabase dashboard for production
   */
  async createBucketIfNotExists(): Promise<boolean> {
    if (!this.supabase) {
      return false;
    }

    try {
      // Check if bucket exists
      const { data: buckets } = await this.supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === AVATAR_BUCKET);

      if (!bucketExists) {
        // Create bucket
        const { error } = await this.supabase.storage.createBucket(AVATAR_BUCKET, {
          public: true,
          allowedMimeTypes: ALLOWED_TYPES,
          fileSizeLimit: MAX_FILE_SIZE,
        });

        if (error) {
          console.error('Bucket creation error:', error);
          return false;
        }

        console.log(`Created storage bucket: ${AVATAR_BUCKET}`);
      }

      return true;
    } catch (error) {
      console.error('Bucket setup failed:', error);
      return false;
    }
  }

  /**
   * Utility function to get file extension from URI
   */
  private getFileExtension(uri: string): string | null {
    const match = uri.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : null;
  }

  private getMimeTypeFromExtension(extension: string): string {
    switch (extension.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      case 'heic':
        // Map HEIC to JPEG to align with allowed types and broader compatibility
        return 'image/jpeg';
      default:
        return 'image/jpeg';
    }
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let bufferLength = base64.length * 0.75;
    if (base64.endsWith('==')) bufferLength -= 2;
    else if (base64.endsWith('=')) bufferLength -= 1;

    const bytes = new Uint8Array(bufferLength);
    let p = 0;

    for (let i = 0; i < base64.length; i += 4) {
      const encoded1 = base64Chars.indexOf(base64[i]);
      const encoded2 = base64Chars.indexOf(base64[i + 1]);
      const encoded3 = base64Chars.indexOf(base64[i + 2]);
      const encoded4 = base64Chars.indexOf(base64[i + 3]);

      const byte1 = (encoded1 << 2) | (encoded2 >> 4);
      const byte2 = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      const byte3 = ((encoded3 & 3) << 6) | encoded4;

      bytes[p++] = byte1;
      if (encoded3 !== 64) bytes[p++] = byte2;
      if (encoded4 !== 64) bytes[p++] = byte3;
    }

    return bytes;
  }

  /**
   * Validate file type
   */
  private isValidFileType(type: string): boolean {
    return ALLOWED_TYPES.includes(type.toLowerCase());
  }

  /**
   * Generate a unique filename
   */
  generateFileName(userId: string, extension: string = 'jpg'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `avatar_${timestamp}_${random}.${extension}`;
  }
}

// Export singleton instance
export const storageBucket = new StorageBucketManager();

// Export bucket name for reference
export { AVATAR_BUCKET };
