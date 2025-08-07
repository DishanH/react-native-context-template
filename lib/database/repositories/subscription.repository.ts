import { BaseRepository, DatabaseResponse } from '../core/base-repository';
import { storage } from '../../storage';
import type { Subscription, SubscriptionInsert, SubscriptionUpdate } from '../../../types/database';

export class SubscriptionRepository extends BaseRepository {
  constructor() {
    super('subscriptions');
  }

  /**
   * Get user subscription
   */
  async getSubscription(userId: string): Promise<DatabaseResponse<Subscription>> {
    return this.executeWithFallback(
      // Online operation
      async () => {
        const supabase = this.client.getClient();
        if (!supabase) throw new Error('Supabase client not available');

        const { data, error } = await supabase
          .rpc('get_user_subscription', { user_uuid: userId });

        if (error) throw error;
        
        if (data && data.length > 0) {
          const subscription = data[0] as Subscription;
          // Update local cache
          await storage.set('user_subscription', subscription);
          return subscription;
        }
        
        throw new Error('No subscription found');
      },
      // Offline fallback
      async () => {
        const localSubscription = await storage.get('user_subscription', true);
        return localSubscription as Subscription;
      }
    );
  }

  /**
   * Create a new subscription
   */
  async createSubscription(userId: string, subscriptionData: Partial<SubscriptionInsert>): Promise<DatabaseResponse<Subscription>> {
    const newSubscription: SubscriptionInsert = {
      user_id: userId,
      plan: subscriptionData.plan || 'free',
      status: subscriptionData.status || 'active',
      start_date: subscriptionData.start_date || new Date().toISOString(),
      end_date: subscriptionData.end_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      auto_renew: subscriptionData.auto_renew || false,
      trial_end_date: subscriptionData.trial_end_date || null,
      payment_method: subscriptionData.payment_method || null,
      next_billing_date: subscriptionData.next_billing_date || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return this.executeWithFallback(
      // Online operation
      async () => {
        const supabase = this.client.getClient();
        if (!supabase) throw new Error('Supabase client not available');

        const { data, error } = await supabase
          .from('subscriptions')
          .insert([newSubscription])
          .select()
          .single();

        if (error) throw error;
        
        // Update local cache
        await storage.set('user_subscription', data);
        return data;
      },
      // Offline fallback
      async () => {
        // Store locally for sync later
        await storage.set('user_subscription', newSubscription);
        return newSubscription as Subscription;
      },
      // Sync data
      { recordId: userId, operation: 'insert', data: newSubscription }
    );
  }

  /**
   * Update user subscription
   */
  async updateSubscription(userId: string, updates: Partial<SubscriptionUpdate>): Promise<DatabaseResponse<Subscription>> {
    return this.executeWithFallback(
      // Online operation
      async () => {
        const supabase = this.client.getClient();
        if (!supabase) throw new Error('Supabase client not available');

        const { data, error } = await supabase
          .from('subscriptions')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        
        // Update local cache
        await storage.set('user_subscription', data);
        return data;
      },
      // Offline fallback
      async () => {
        // Update local data
        const currentData = await storage.get('user_subscription', true) || {};
        const updatedData = { ...currentData, ...updates };
        await storage.set('user_subscription', updatedData);
        return updatedData as Subscription;
      },
      // Sync data
      { recordId: userId, operation: 'update', data: updates }
    );
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string): Promise<DatabaseResponse<Subscription>> {
    return this.updateSubscription(userId, {
      status: 'cancelled',
      auto_renew: false
    });
  }

  /**
   * Reactivate subscription
   */
  async reactivateSubscription(userId: string): Promise<DatabaseResponse<Subscription>> {
    return this.updateSubscription(userId, {
      status: 'active',
      auto_renew: true
    });
  }

  /**
   * Upgrade subscription plan
   */
  async upgradePlan(userId: string, newPlan: 'free' | 'pro' | 'premium'): Promise<DatabaseResponse<Subscription>> {
    const planEndDates = {
      free: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      pro: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),   // 1 month
      premium: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 1 month
    };

    return this.updateSubscription(userId, {
      plan: newPlan,
      status: 'active',
      end_date: planEndDates[newPlan].toISOString(),
      auto_renew: newPlan !== 'free'
    });
  }

  /**
   * Subscribe to subscription changes
   */
  subscribeToSubscriptionChanges(userId: string, callback: (payload: any) => void) {
    return this.subscribeToChanges(`user_id=eq.${userId}`, callback);
  }
}
