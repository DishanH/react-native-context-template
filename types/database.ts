// Database schema types generated for React Native Context Template
// Based on Supabase tables: profiles, user_preferences, subscriptions

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: 'free' | 'pro' | 'premium'
          status: 'active' | 'cancelled' | 'expired' | 'trial'
          start_date: string
          end_date: string
          auto_renew: boolean
          trial_end_date: string | null
          payment_method: string | null
          next_billing_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan?: 'free' | 'pro' | 'premium'
          status?: 'active' | 'cancelled' | 'expired' | 'trial'
          start_date?: string
          end_date?: string
          auto_renew?: boolean
          trial_end_date?: string | null
          payment_method?: string | null
          next_billing_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: 'free' | 'pro' | 'premium'
          status?: 'active' | 'cancelled' | 'expired' | 'trial'
          start_date?: string
          end_date?: string
          auto_renew?: boolean
          trial_end_date?: string | null
          payment_method?: string | null
          next_billing_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_profile: {
        Args: {
          user_uuid?: string
        }
        Returns: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }[]
      }
      get_user_preferences: {
        Args: {
          user_uuid?: string
        }
        Returns: {
          id: string
          user_id: string
          preferences: Json
          created_at: string
          updated_at: string
        }[]
      }
      get_user_subscription: {
        Args: {
          user_uuid?: string
        }
        Returns: {
          id: string
          user_id: string
          plan: string
          status: string
          start_date: string
          end_date: string
          auto_renew: boolean
          trial_end_date: string | null
          payment_method: string | null
          next_billing_date: string | null
          created_at: string
          updated_at: string
        }[]
      }
      update_user_profile: {
        Args: {
          profile_data: Json
        }
        Returns: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
      }
      update_user_preferences: {
        Args: {
          new_preferences: Json
        }
        Returns: {
          id: string
          user_id: string
          preferences: Json
          created_at: string
          updated_at: string
        }
      }
    }
    Enums: {
      subscription_plan: 'free' | 'pro' | 'premium'
      subscription_status: 'active' | 'cancelled' | 'expired' | 'trial'
    }
  }
}

// Type aliases for easier use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
export type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert']
export type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update']

export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']

export type SubscriptionPlan = Database['public']['Enums']['subscription_plan']
export type SubscriptionStatus = Database['public']['Enums']['subscription_status']

// User preferences structure type
export interface UserPreferencesData {
  theme: 'light' | 'dark' | 'system'
  notifications: {
    push: boolean
    email: boolean
    sms: boolean
    marketing: boolean
  }
  privacy: {
    analytics: boolean
    crashReporting: boolean
    dataSharing: boolean
  }
  accessibility: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large'
    highContrast: boolean
    reduceMotion: boolean
    voiceOver: boolean
  }
  language: string
  region: string
  currency: string
  autoLock: boolean
  biometricAuth: boolean
}

// Enhanced user type that combines auth user with profile data
export interface AppUser {
  id: string
  email: string
  name: string
  isAuthenticated: boolean
  avatar_url?: string
  bio?: string
  full_name?: string
  supabaseUser?: any
  profile?: Profile
}

// Database operation response types
// Use DatabaseResponse from `lib/database/core/base-repository` to avoid duplication

// Query filter types for database operations
export interface ProfileFilters {
  id?: string
  email?: string
}

export interface SubscriptionFilters {
  user_id?: string
  plan?: SubscriptionPlan
  status?: SubscriptionStatus
}

export interface UserPreferencesFilters {
  user_id?: string
}