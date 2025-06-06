import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from './storage';

// Define the shape of the authentication context
type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  loginWithGoogle: async () => {},
  loginWithApple: async () => {},
  register: async () => {},
  logout: () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authStatus = await storage.getAuthStatus();
        setIsAuthenticated(authStatus);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login with email and password
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would authenticate with your backend
      // For this demo, we'll just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save auth status to storage
      await storage.setAuthStatus(true);
      setIsAuthenticated(true);
      
      // Navigate to the home screen
      router.replace('/tabs' as any);
    } catch (error) {
      console.error('Login Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would authenticate with Google
      // For this demo, we'll just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save auth status to storage
      await storage.setAuthStatus(true);
      setIsAuthenticated(true);
      
      // Navigate to the home screen
      router.replace('/tabs' as any);
    } catch (error) {
      console.error('Google Login Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Apple
  const loginWithApple = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would authenticate with Apple
      // For this demo, we'll just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save auth status to storage
      await storage.setAuthStatus(true);
      setIsAuthenticated(true);
      
      // Navigate to the home screen
      router.replace('/tabs' as any);
    } catch (error) {
      console.error('Apple Login Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register a new user
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would register the user with your backend
      // For this demo, we'll just simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save auth status to storage
      await storage.setAuthStatus(true);
      setIsAuthenticated(true);
      
      // Navigate to the home screen
      router.replace('/tabs' as any);
    } catch (error) {
      console.error('Registration Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Clear auth status from storage
      await storage.setAuthStatus(false);
      setIsAuthenticated(false);
      
      // Navigate to the login screen
      router.replace('/login' as any);
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        loginWithApple,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 