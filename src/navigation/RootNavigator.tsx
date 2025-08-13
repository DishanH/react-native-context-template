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

  // Check onboarding status when app loads
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Validate and clean up any corrupted auth data first
        await storage.validateAndCleanAuthData();

        // Then check onboarding status
        const onboardingStatus = await storage.getOnboardingStatus();
        setIsOnboardingComplete(onboardingStatus);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsOnboardingComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Handle navigation based on auth and onboarding state
  useEffect(() => {
    if (isLoading || authLoading) return;

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('fromLogin') === 'true') return;

    // Check current path to avoid redirecting from email verification page
    if (window.location.pathname === '/auth/email-verification') {
      return;
    }

    if (!isOnboardingComplete) {
      // User hasn't completed onboarding
      router.push('/onboarding' as any);
    } else if (user?.isAuthenticated) {
      // User is authenticated, go to main app
      router.push('/tabs' as any);
    } else if (pendingVerificationEmail) {
      // User is pending email verification - allow them to stay on verification page
      return; // Explicitly return to prevent any further navigation
    } else {
      // User completed onboarding but not authenticated and no pending verification
      router.push('/auth' as any);
    }
  }, [user, isOnboardingComplete, isLoading, authLoading, pendingVerificationEmail]);

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