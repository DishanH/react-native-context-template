import { useSubscription } from '../contexts';

/**
 * Custom hook for feature access control based on subscription
 */
export const useFeatureAccess = () => {
  const { subscription, hasFeature, isPremiumUser, isTrialActive } = useSubscription();

  // Feature access checks
  const canAccessFeature = (feature: string): boolean => {
    return hasFeature(feature);
  };

  const canCreateUnlimitedGroups = (): boolean => {
    return subscription?.plan !== 'free' || isTrialActive();
  };

  const canExportData = (): boolean => {
    return hasFeature('export') || isPremiumUser();
  };

  const canAccessAdvancedAnalytics = (): boolean => {
    return hasFeature('analytics') || isPremiumUser();
  };

  const canUseApiAccess = (): boolean => {
    return hasFeature('api') || subscription?.plan === 'premium';
  };

  const canAccessPrioritySupport = (): boolean => {
    return isPremiumUser();
  };

  const canUseCustomCategories = (): boolean => {
    return subscription?.plan === 'premium';
  };

  const canUseMultiCurrency = (): boolean => {
    return subscription?.plan === 'premium';
  };

  const canUseTeamCollaboration = (): boolean => {
    return subscription?.plan === 'premium';
  };

  const canUseAIInsights = (): boolean => {
    return subscription?.plan === 'premium';
  };

  // Limit checks
  const getGroupsLimit = (): number => {
    if (subscription?.plan === 'free' && !isTrialActive()) {
      return 3;
    }
    return -1; // Unlimited
  };

  const getStorageLimit = (): number => {
    if (subscription?.plan === 'free' && !isTrialActive()) {
      return 500; // 500MB
    }
    return -1; // Unlimited
  };

  const getHistoryLimit = (): number => {
    if (subscription?.plan === 'free' && !isTrialActive()) {
      return 30; // 30 days
    }
    return -1; // Unlimited
  };

  const getApiCallsLimit = (): number => {
    if (subscription?.plan === 'free' && !isTrialActive()) {
      return 1000;
    }
    return -1; // Unlimited
  };

  // Premium status checks
  const isFreePlan = (): boolean => {
    return subscription?.plan === 'free' && !isTrialActive();
  };

  const isProPlan = (): boolean => {
    return subscription?.plan === 'pro' && (subscription.status === 'active' || isTrialActive());
  };

  const isPremiumPlan = (): boolean => {
    return subscription?.plan === 'premium' && (subscription.status === 'active' || isTrialActive());
  };

  // UI helpers
  const showUpgradePrompt = (feature: string): boolean => {
    return isFreePlan() && !canAccessFeature(feature);
  };

  const getUpgradeMessage = (feature: string): string => {
    const featureMap: Record<string, string> = {
      'unlimited groups': 'Upgrade to Pro or Premium to create unlimited groups',
      'export': 'Upgrade to Pro or Premium to export your data',
      'analytics': 'Upgrade to Pro or Premium for advanced analytics',
      'api': 'Upgrade to Premium for API access',
      'custom categories': 'Upgrade to Premium for custom categories',
      'multi-currency': 'Upgrade to Premium for multi-currency support',
      'team collaboration': 'Upgrade to Premium for team collaboration',
      'ai insights': 'Upgrade to Premium for AI-powered insights',
    };

    return featureMap[feature.toLowerCase()] || 'Upgrade to access this premium feature';
  };

  const getRecommendedPlan = (feature: string): 'pro' | 'premium' => {
    const premiumFeatures = ['api', 'custom categories', 'multi-currency', 'team collaboration', 'ai insights'];
    
    if (premiumFeatures.some(f => feature.toLowerCase().includes(f))) {
      return 'premium';
    }
    
    return 'pro';
  };

  return {
    // Feature access
    canAccessFeature,
    canCreateUnlimitedGroups,
    canExportData,
    canAccessAdvancedAnalytics,
    canUseApiAccess,
    canAccessPrioritySupport,
    canUseCustomCategories,
    canUseMultiCurrency,
    canUseTeamCollaboration,
    canUseAIInsights,
    
    // Limits
    getGroupsLimit,
    getStorageLimit,
    getHistoryLimit,
    getApiCallsLimit,
    
    // Plan status
    isFreePlan,
    isProPlan,
    isPremiumPlan,
    isPremiumUser,
    isTrialActive,
    
    // UI helpers
    showUpgradePrompt,
    getUpgradeMessage,
    getRecommendedPlan,
    
    // Raw subscription data
    subscription,
  };
}; 