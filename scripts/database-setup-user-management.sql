-- Database Setup Script for React Native Context Template
-- This script creates the required tables, triggers, and functions for user management

-- First, ensure we have the necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_user_preferences UNIQUE(user_id)
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan TEXT CHECK (plan IN ('free', 'pro', 'premium')) DEFAULT 'free',
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired', 'trial')) DEFAULT 'active',
  start_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  auto_renew BOOLEAN DEFAULT FALSE,
  trial_end_date TIMESTAMPTZ,
  payment_method TEXT,
  next_billing_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_user_subscription UNIQUE(user_id)
);

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at 
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile (with error handling)
  BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
      NEW.id, 
      NEW.email, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
  EXCEPTION WHEN others THEN
    -- Log error but don't fail the trigger
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  END;
  
  -- Create default subscription (1 year free plan)
  BEGIN
    INSERT INTO public.subscriptions (user_id, plan, status, start_date, end_date)
    VALUES (NEW.id, 'free', 'active', NOW(), NOW() + INTERVAL '1 year');
  EXCEPTION WHEN others THEN
    RAISE WARNING 'Failed to create subscription for user %: %', NEW.id, SQLERRM;
  END;
  
  -- Create default preferences
  BEGIN
    INSERT INTO public.user_preferences (user_id, preferences)
    VALUES (NEW.id, '{
      "theme": "system",
      "notifications": {
        "push": true,
        "email": true,
        "sms": false,
        "marketing": false
      },
      "privacy": {
        "analytics": true,
        "crashReporting": true,
        "dataSharing": false
      },
      "accessibility": {
        "fontSize": "medium",
        "highContrast": false,
        "reduceMotion": false,
        "voiceOver": false
      },
      "language": "en",
      "region": "US",
      "currency": "USD",
      "autoLock": true,
      "biometricAuth": false
    }'::jsonb);
  EXCEPTION WHEN others THEN
    RAISE WARNING 'Failed to create preferences for user %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to handle new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan);

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profiles extending auth.users with additional information';
COMMENT ON TABLE user_preferences IS 'User preferences and settings stored as JSONB';
COMMENT ON TABLE subscriptions IS 'User subscription information and billing details';

COMMENT ON COLUMN profiles.avatar_url IS 'URL to user profile picture';
COMMENT ON COLUMN profiles.bio IS 'User biography/description';
COMMENT ON COLUMN user_preferences.preferences IS 'JSONB containing all user preferences';
COMMENT ON COLUMN subscriptions.plan IS 'Subscription plan: free, pro, or premium';
COMMENT ON COLUMN subscriptions.status IS 'Subscription status: active, cancelled, expired, or trial';