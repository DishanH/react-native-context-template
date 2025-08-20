import React, { useEffect, useState } from 'react';
import { router } from "expo-router";
import { useAuth } from '../../contexts';
import { storage } from '../../lib/storage';
import { LoadingScreen } from '../shared/components/feedback';
import { AuthenticatedLayout, UnauthenticatedLayout } from './layouts';

// Main navigation component that handles authentication state
export function RootNavigator() {
  const { user, isLoading: authLoading, pendingVerificationEmail } = useAuth();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialValidationDone, setInitialValidationDone] = useState(false);

  // Check onboarding status and validate auth data when app loads
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // First, just check onboarding status
        const onboardingStatus = await storage.getOnboardingStatus();
        setIsOnboardingComplete(onboardingStatus);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsOnboardingComplete(false);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Delayed auth validation - only after Supabase has had time to restore session
  useEffect(() => {
    if (!authLoading && !initialValidationDone) {
      const validateAuth = async () => {
        try {
          // Wait a bit for Supabase session restoration to complete
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Now run validation, but much less aggressively
          const { shouldSignOut } = await storage.validateAndCleanAuthData();
          
          // If auth data was corrupted and cleared, trigger sign out in auth context
          if (shouldSignOut) {
            console.log('Auth validation determined sign out is needed');
            // Import the database client and clear the session
            const { database } = await import('../../lib/database');
            try {
              await database.signOut();
            } catch (error) {
              console.error('Error signing out during auth cleanup:', error);
            }
          }
        } catch (error) {
          console.error('Error in delayed auth validation:', error);
        } finally {
          setInitialValidationDone(true);
        }
      };

      validateAuth();
    }
  }, [authLoading, initialValidationDone]);

  // Handle navigation based on auth and onboarding state
  useEffect(() => {
    // Wait for all loading states to complete, including auth validation
    if (isLoading || authLoading || !initialValidationDone) return;

    // Check for web-specific navigation parameters (for web compatibility)
    let shouldSkipNavigation = false;
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('fromLogin') === 'true') shouldSkipNavigation = true;
      
      // Check current path to avoid redirecting from email verification page
      if (window.location.pathname === '/auth/email-verification') {
        shouldSkipNavigation = true;
      }
    }
    
    if (shouldSkipNavigation) return;

    // Add small delay to prevent navigation conflicts during auth state transitions
    const navigateWithDelay = (path: string) => {
      setTimeout(() => {
        router.push(path as any);
      }, 100);
    };

    if (!isOnboardingComplete) {
      // User hasn't completed onboarding
      navigateWithDelay('/onboarding');
    } else if (user?.isAuthenticated) {
      // User is authenticated, go to main app
      navigateWithDelay('/tabs');
    } else if (pendingVerificationEmail) {
      // User is pending email verification - allow them to stay on verification page
      return; // Explicitly return to prevent any further navigation
    } else {
      // User completed onboarding but not authenticated and no pending verification
      navigateWithDelay('/auth');
    }
  }, [user, isOnboardingComplete, isLoading, authLoading, pendingVerificationEmail, initialValidationDone]);

  // Show loading screen while determining initial route
  if (isLoading || authLoading) {
    return <LoadingScreen />;
  }

  // Show appropriate layout based on authentication state
  if (user?.isAuthenticated) {
    return <AuthenticatedLayout />;
  } else {
    return <UnauthenticatedLayout />;
  }
} 