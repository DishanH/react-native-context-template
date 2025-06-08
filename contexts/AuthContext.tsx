import { router } from 'expo-router';
import * as React from "react";
import { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../lib/storage';

/**
 * User type definition
 * Contains all essential user information
 */
export type User = {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
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
   * Load user data from storage on app initialization
   * Runs once when the provider mounts
   */
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Try to get stored user data
        const storedUser = await storage.get(USER_STORAGE_KEY, true);
        if (storedUser && storedUser.isAuthenticated) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
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
   * Sign in with email and password
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would validate credentials with your backend
      // For demo purposes, we'll create a dummy user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0], // Use email prefix as name
        isAuthenticated: true
      };
      
      setUser(newUser);
      
      // Navigate to the main app
      router.replace('/tabs' as any);
      return true;
      
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign up with name, email and password
   * 
   * @param name - User's full name
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would register the user with your backend
      // For demo purposes, we'll create a dummy user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        isAuthenticated: true
      };
      
      setUser(newUser);
      
      // Navigate to the main app
      router.replace('/tabs' as any);
      return true;
      
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign in with social providers (Google, Apple)
   * 
   * @param provider - Social provider ('google' | 'apple')
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  const socialSignIn = async (provider: 'google' | 'apple'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would integrate with Google/Apple auth SDKs
      // For demo purposes, we'll create a dummy user
      const newUser: User = {
        id: Date.now().toString(),
        email: `user_${Date.now()}@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        isAuthenticated: true
      };
      
      setUser(newUser);
      
      // Navigate to the main app
      router.replace('/tabs' as any);
      return true;
      
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign out the current user
   * Clears all user data and navigates to sign-in screen
   */
  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Clear user state first
      setUser(null);
      
      // Let the useEffect in RootNavigator handle the navigation
      // based on the updated authentication state
      
    } catch (error) {
      console.error('Sign out error:', error);
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