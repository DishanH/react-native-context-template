import { router } from 'expo-router';
import * as React from "react";
import { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../lib/storage';
import { database } from '../lib/database';

/**
 * User type definition
 * Contains all essential user information
 */
export type User = {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
  avatar_url?: string;
  supabaseUser?: any; // Store Supabase user object for additional data
};

/**
 * Authentication context type definition
 * Defines all available authentication methods and state
 */
type AuthContextType = {
  // Current user state
  user: User | null;
  isLoading: boolean;
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  socialSignIn: (provider: 'google' | 'apple') => Promise<boolean>;
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
  // User state - null means not authenticated
  const [user, setUser] = useState<User | null>(null);
  // Loading state for async operations
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize auth state and listen for changes
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing Supabase session
        const session = await database.getSession();
        
        if (session?.user) {
          // Create user object from Supabase session
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            isAuthenticated: true,
            avatar_url: session.user.user_metadata?.avatar_url,
            supabaseUser: session.user,
          };
          
          setUser(userData);
          await storage.set(USER_STORAGE_KEY, userData);
          await storage.setAuthStatus(true);
        } else {
          // Try to get stored user data as fallback
          const storedUser = await storage.get(USER_STORAGE_KEY, true);
          if (storedUser && storedUser.isAuthenticated) {
            setUser(storedUser);
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Fallback to stored user data
        try {
          const storedUser = await storage.get(USER_STORAGE_KEY, true);
          if (storedUser && storedUser.isAuthenticated) {
            setUser(storedUser);
          }
        } catch (storageError) {
          console.error('Failed to load user from storage:', storageError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = database.onAuthStateChange(async (event, session) => {
  
      if (event === 'SIGNED_IN' && session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          isAuthenticated: true,
          avatar_url: session.user.user_metadata?.avatar_url,
          supabaseUser: session.user,
        };

        setUser(userData);
        await storage.set(USER_STORAGE_KEY, userData);
        await storage.setAuthStatus(true);
        // Navigate to main app
        router.replace('/tabs' as any);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        await storage.remove(USER_STORAGE_KEY);
        await storage.setAuthStatus(false);
      }
    });

    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

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
      const { user: supabaseUser, session } = await database.signUpWithEmail(email, password, name);
      
      if (supabaseUser) {
        // For email signup, user might need to verify email
        if (session) {
          // User is immediately signed in (auto-confirm enabled)
          return true;
        } else {
          // User needs to verify email
          // You might want to show a message to check email
          console.log('Please check your email to verify your account');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign in with social providers (Google, Apple) using Supabase
   * 
   * @param provider - Social provider ('google' | 'apple')
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  const socialSignIn = async (provider: 'google' | 'apple'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await database.signInWithProvider(provider);
      
      // For web OAuth, this will redirect to the provider
      // The auth state change will handle the user login after redirect
      console.log('OAuth redirect initiated for:', provider);
      return true;
      
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign out the current user using Supabase
   * Clears all user data and navigates to sign-in screen
   */
  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await database.signOut();
      // User state will be cleared via auth state change listener
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback: clear user state manually
      setUser(null);
      await storage.remove(USER_STORAGE_KEY);
      await storage.setAuthStatus(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Context value object
   * Contains all state and methods available to consumers
   */
  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    socialSignIn
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