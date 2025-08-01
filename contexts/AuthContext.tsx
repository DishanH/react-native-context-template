import * as React from "react";
import { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../lib/storage';
import { database } from '../lib/database';
import { useAuth as useSupabaseAuth } from '../hooks/useAuth';
import { GoogleAuthService, AppleAuthService } from '../lib/auth';
import type { AppUser, Profile } from '../types/database';

/**
 * User type definition
 * Contains all essential user information
 */
export type User = AppUser;

/**
 * Authentication context type definition
 * Defines all available authentication methods and state
 */
type AuthContextType = {
  // Current user state
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  socialSignIn: (provider: 'google' | 'apple') => Promise<boolean>;
  
  // Profile methods
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
};

/**
 * Create the authentication context
 * Provides default undefined value to force proper usage with provider
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Storage key for user data persistence
 */
const USER_STORAGE_KEY = 'user_data';

/**
 * Authentication Provider Component
 * Manages user authentication state and provides auth methods to children
 * 
 * @param children - React components that need access to auth context
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our simplified auth hook for Supabase state
  const { session, user: supabaseUser, loading: authLoading } = useSupabaseAuth();
  
  // Enhanced user state with app-specific data
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  /**
   * Convert Supabase user to app user format and handle storage
   */
  useEffect(() => {
    const updateUserState = async () => {
      try {
        if (session?.user) {
          // Fetch the user's profile from the database
          let profileResponse = await database.getProfile(session.user.id);
          let userProfile = profileResponse.data;

          // If profile doesn't exist, create it (fallback for trigger failure)
          if (!userProfile) {
            console.log('Profile not found, creating fallback profile...');
            try {
              const fallbackProfileResponse = await database.createProfile(session.user.id, {
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                avatar_url: session.user.user_metadata?.avatar_url || null,
                bio: null,
              });
              
              if (fallbackProfileResponse.success) {
                userProfile = fallbackProfileResponse.data;
                console.log('Fallback profile created successfully');
              }
            } catch (createError) {
              console.error('Failed to create fallback profile:', createError);
            }
          }

          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: userProfile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            isAuthenticated: true,
            avatar_url: userProfile?.avatar_url || session.user.user_metadata?.avatar_url || undefined,
            bio: userProfile?.bio || undefined,
            full_name: userProfile?.full_name || undefined,
            supabaseUser: session.user,
            profile: userProfile || undefined,
          };
          
          setUser(userData);
          setProfile(userProfile);
          await storage.set(USER_STORAGE_KEY, userData);
          await storage.setAuthStatus(true);
          
          // Note: Navigation is handled by RootNavigator based on auth state
        } else {
          setUser(null);
          setProfile(null);
          await storage.remove(USER_STORAGE_KEY);
          await storage.setAuthStatus(false);
          // Note: Navigation to auth screen is handled by RootNavigator
        }
      } catch (error) {
        console.error('Failed to update user state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only update when auth loading is complete
    if (!authLoading) {
      updateUserState();
    }
  }, [session, supabaseUser, authLoading]);

  /**
   * Save user data to storage whenever user state changes
   * Ensures persistence across app restarts
   */
  useEffect(() => {
    const saveUser = async () => {
      try {
        if (user) {
          // Save user data and update auth status
          await storage.set(USER_STORAGE_KEY, user);
          await storage.setAuthStatus(true);
        } else {
          // Clear user data and auth status
          await storage.remove(USER_STORAGE_KEY);
          await storage.setAuthStatus(false);
        }
      } catch (error) {
        console.error('Failed to save user to storage:', error);
      }
    };

    // Don't save during initial load
    if (!isLoading) {
      saveUser();
    }
  }, [user, isLoading]);

  /**
   * Sign in with email and password using Supabase
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { user: supabaseUser, session } = await database.signInWithEmail(email, password);
      
      if (supabaseUser && session) {
        // User object will be set via auth state change listener
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign up with name, email and password using Supabase
   * 
   * @param name - User's full name
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Starting signup process for:', email, 'with name:', name);
      const { user: supabaseUser, session } = await database.signUpWithEmail(email, password, name);
      
      if (supabaseUser) {
        console.log('Supabase user created:', {
          id: supabaseUser.id,
          email: supabaseUser.email,
          user_metadata: supabaseUser.user_metadata
        });
        
        // For email signup, user might need to verify email
        if (session) {
          // User is immediately signed in (auto-confirm enabled)
          console.log('User signed up and signed in automatically');
          return true;
        } else {
          // User needs to verify email
          console.log('User created but needs email verification');
          return true;
        }
      }
      
      console.log('No Supabase user returned from signup');
      return false;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign in with social providers (Google, Apple) using dedicated auth services
   * 
   * @param provider - Social provider ('google' | 'apple')
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  const socialSignIn = async (provider: 'google' | 'apple'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      let success = false;
      
      if (provider === 'google') {
        success = await GoogleAuthService.signInWithGoogle();
      } else if (provider === 'apple') {
        success = await AppleAuthService.signInWithApple();
      }
      
      // Auth state will be updated via the useAuth hook
      return success;
      
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign out the current user using Supabase
   * Clears all user data and lets RootNavigator handle navigation
   */
  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Clear Supabase session
      await database.signOut();
      // User state will be cleared via auth state change listener
      // Navigation will be handled by RootNavigator
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback: clear user state manually if Supabase signOut fails
      setUser(null);
      setProfile(null);
      await storage.remove(USER_STORAGE_KEY);
      await storage.setAuthStatus(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const response = await database.updateProfile(user.id, updates);
      
      if (response.success && response.data) {
        // Update local state
        setProfile(response.data);
        
        // Update user object with new profile data
        const updatedUser: User = {
          ...user,
          name: response.data.full_name || user.name,
          full_name: response.data.full_name || undefined,
          avatar_url: response.data.avatar_url || undefined,
          bio: response.data.bio || undefined,
          profile: response.data,
        };
        
        setUser(updatedUser);
        await storage.set(USER_STORAGE_KEY, updatedUser);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to update profile:', error);
      return false;
    }
  };

  /**
   * Context value object
   * Contains all state and methods available to consumers
   */
  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    socialSignIn,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook for using authentication context
 * Must be used within an AuthProvider
 * 
 * @returns AuthContextType - Authentication state and methods
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 