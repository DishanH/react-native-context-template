import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../lib/storage';
import { useAuth } from './AuthContext';

/**
 * Subscription Plan Types
 */
export type SubscriptionPlan = 'free' | 'pro' | 'premium';

export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'pending' | 'trial';

/**
 * Subscription Plan Details
 */
export interface PlanDetails {
  id: SubscriptionPlan;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
  trialDays?: number;
}

/**
 * User Subscription Information
 */
export interface UserSubscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  trialEndDate?: string;
  paymentMethod?: string;
  nextBillingDate?: string;
}

/**
 * Subscription Context Type
 */
type SubscriptionContextType = {
  // Current subscription state
  subscription: UserSubscription | null;
  isLoading: boolean;
  
  // Available plans
  availablePlans: PlanDetails[];
  
  // Subscription methods
  upgradeToPlan: (planId: SubscriptionPlan) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  renewSubscription: () => Promise<boolean>;
  startFreeTrial: (planId: SubscriptionPlan) => Promise<boolean>;
  
  // Feature access checks
  hasFeature: (feature: string) => boolean;
  isPremiumUser: () => boolean;
  isTrialActive: () => boolean;
  getDaysUntilExpiry: () => number;
  
  // Subscription management
  updatePaymentMethod: (paymentMethod: string) => Promise<boolean>;
  toggleAutoRenew: () => Promise<boolean>;
  getUsageStats: () => Promise<any>;
};

/**
 * Available subscription plans
 */
const SUBSCRIPTION_PLANS: PlanDetails[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Basic dashboard access',
      'Up to 3 groups',
      'Basic expense tracking',
      'Limited history (30 days)',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    features: [
      'Everything in Free',
      'Unlimited groups',
      'Advanced analytics',
      'Full history access',
      'Export to CSV/PDF',
      'Priority support',
    ],
    isPopular: true,
    trialDays: 14,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Advanced AI insights',
      'Custom categories',
      'Multi-currency support',
      'Team collaboration',
      'API access',
      'White-label options',
    ],
    trialDays: 14,
  },
];

/**
 * Storage key for subscription data
 */
const SUBSCRIPTION_STORAGE_KEY = 'user_subscription';

/**
 * Create the subscription context
 */
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

/**
 * Subscription Provider Component
 */
export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load subscription data from storage
   */
  useEffect(() => {
    const loadSubscription = async () => {
      if (!user?.isAuthenticated) {
        setSubscription(null);
        setIsLoading(false);
        return;
      }

      try {
        const storedSubscription = await storage.get(SUBSCRIPTION_STORAGE_KEY, true);
        if (storedSubscription) {
          setSubscription(storedSubscription);
        } else {
          // Create default free subscription for new users
          const defaultSubscription: UserSubscription = {
            plan: 'free',
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
            autoRenew: false,
          };
          setSubscription(defaultSubscription);
          await storage.set(SUBSCRIPTION_STORAGE_KEY, defaultSubscription);
        }
      } catch (error) {
        console.error('Failed to load subscription from storage:', error);
        // Set default free plan on error
        const defaultSubscription: UserSubscription = {
          plan: 'free',
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          autoRenew: false,
        };
        setSubscription(defaultSubscription);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, [user]);

  /**
   * Save subscription data to storage
   */
  const saveSubscription = async (newSubscription: UserSubscription) => {
    try {
      await storage.set(SUBSCRIPTION_STORAGE_KEY, newSubscription);
      setSubscription(newSubscription);
    } catch (error) {
      console.error('Failed to save subscription to storage:', error);
    }
  };

  /**
   * Upgrade to a specific plan
   */
  const upgradeToPlan = async (planId: SubscriptionPlan): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plan not found');
      }

      const newSubscription: UserSubscription = {
        plan: planId,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        autoRenew: true,
        paymentMethod: 'Credit Card',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      await saveSubscription(newSubscription);
      return true;
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Start free trial for a plan
   */
  const startFreeTrial = async (planId: SubscriptionPlan): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan || !plan.trialDays) {
        throw new Error('Trial not available for this plan');
      }

      const trialEndDate = new Date(Date.now() + plan.trialDays * 24 * 60 * 60 * 1000);
      
      const newSubscription: UserSubscription = {
        plan: planId,
        status: 'trial',
        startDate: new Date().toISOString(),
        endDate: trialEndDate.toISOString(),
        trialEndDate: trialEndDate.toISOString(),
        autoRenew: false,
      };

      await saveSubscription(newSubscription);
      return true;
    } catch (error) {
      console.error('Failed to start trial:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cancel subscription
   */
  const cancelSubscription = async (): Promise<boolean> => {
    if (!subscription) return false;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSubscription: UserSubscription = {
        ...subscription,
        status: 'canceled',
        autoRenew: false,
      };

      await saveSubscription(updatedSubscription);
      return true;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Renew subscription
   */
  const renewSubscription = async (): Promise<boolean> => {
    if (!subscription) return false;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSubscription: UserSubscription = {
        ...subscription,
        status: 'active',
        autoRenew: true,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      await saveSubscription(updatedSubscription);
      return true;
    } catch (error) {
      console.error('Failed to renew subscription:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update payment method
   */
  const updatePaymentMethod = async (paymentMethod: string): Promise<boolean> => {
    if (!subscription) return false;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedSubscription: UserSubscription = {
        ...subscription,
        paymentMethod,
      };

      await saveSubscription(updatedSubscription);
      return true;
    } catch (error) {
      console.error('Failed to update payment method:', error);
      return false;
    }
  };

  /**
   * Toggle auto-renew
   */
  const toggleAutoRenew = async (): Promise<boolean> => {
    if (!subscription) return false;
    
    try {
      const updatedSubscription: UserSubscription = {
        ...subscription,
        autoRenew: !subscription.autoRenew,
      };

      await saveSubscription(updatedSubscription);
      return true;
    } catch (error) {
      console.error('Failed to toggle auto-renew:', error);
      return false;
    }
  };

  /**
   * Check if user has a specific feature
   */
  const hasFeature = (feature: string): boolean => {
    if (!subscription) return false;
    
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.plan);
    return plan?.features.some(f => f.toLowerCase().includes(feature.toLowerCase())) || false;
  };

  /**
   * Check if user is a premium user (Pro or Premium plan)
   */
  const isPremiumUser = (): boolean => {
    return subscription?.plan !== 'free' && subscription?.status === 'active';
  };

  /**
   * Check if trial is active
   */
  const isTrialActive = (): boolean => {
    if (!subscription || subscription.status !== 'trial') return false;
    
    const now = new Date();
    const trialEnd = subscription.trialEndDate ? new Date(subscription.trialEndDate) : null;
    
    return trialEnd ? now < trialEnd : false;
  };

  /**
   * Get days until subscription expires
   */
  const getDaysUntilExpiry = (): number => {
    if (!subscription) return 0;
    
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  /**
   * Get usage statistics (placeholder for future implementation)
   */
  const getUsageStats = async (): Promise<any> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock usage data
      return {
        groupsUsed: subscription?.plan === 'free' ? 2 : 10,
        groupsLimit: subscription?.plan === 'free' ? 3 : -1, // -1 means unlimited
        storageUsed: 250, // MB
        storageLimit: subscription?.plan === 'free' ? 500 : -1,
        apiCallsUsed: 450,
        apiCallsLimit: subscription?.plan === 'free' ? 1000 : -1,
      };
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return null;
    }
  };

  /**
   * Context value
   */
  const value: SubscriptionContextType = {
    subscription,
    isLoading,
    availablePlans: SUBSCRIPTION_PLANS,
    upgradeToPlan,
    cancelSubscription,
    renewSubscription,
    startFreeTrial,
    hasFeature,
    isPremiumUser,
    isTrialActive,
    getDaysUntilExpiry,
    updatePaymentMethod,
    toggleAutoRenew,
    getUsageStats,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

/**
 * Hook for using subscription context
 */
export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  
  return context;
}; 