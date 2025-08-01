import React, { useEffect, useState } from 'react';
import { router } from "expo-router";
import { useAuth } from '../../contexts';
import { storage } from '../../lib/storage';
import { LoadingScreen } from '../shared/components/feedback';
import { AuthenticatedLayout, UnauthenticatedLayout } from './layouts';

// Main navigation component that handles authentication state
export function RootNavigator() {
  const { user, isLoading: authLoading } = useAuth();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check onboarding status when app loads
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingStatus = await storage.getOnboardingStatus();
        setIsOnboardingComplete(onboardingStatus);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsOnboardingComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  // Handle navigation based on auth and onboarding state
  useEffect(() => {
    if (isLoading || authLoading) return;
    if (!isOnboardingComplete) {
      // User hasn't completed onboarding
      router.replace('/onboarding' as any);
    } else if (!user?.isAuthenticated) {
      // User completed onboarding but not authenticated
      router.replace('/auth' as any);
    } else {
      // User is authenticated, go to main app
      router.replace('/tabs' as any);
    }
  }, [user, isOnboardingComplete, isLoading, authLoading]);

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