-- Row Level Security (RLS) Policies for React Native Context Template
-- This script sets up security policies to ensure users can only access their own data

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;

DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscription" ON subscriptions;

-- Profiles table policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User preferences table policies
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions table policies
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Additional policies for service accounts or admin access
-- These policies allow authenticated users to manage their own data
-- and can be extended for admin functionality if needed

-- Grant usage on sequences (if needed for manual inserts)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_preferences TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON subscriptions TO authenticated;

-- Allow authenticated users to call the update function
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO authenticated;

-- Create helper functions for common operations

-- Function to get user profile
CREATE OR REPLACE FUNCTION get_user_profile(user_uuid UUID DEFAULT auth.uid())
RETURNS TABLE(
  id UUID,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT p.id, p.email, p.full_name, p.avatar_url, p.bio, p.created_at, p.updated_at
  FROM profiles p
  WHERE p.id = user_uuid;
$$;

-- Function to get user preferences
CREATE OR REPLACE FUNCTION get_user_preferences(user_uuid UUID DEFAULT auth.uid())
RETURNS TABLE(
  id UUID,
  user_id UUID,
  preferences JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT up.id, up.user_id, up.preferences, up.created_at, up.updated_at
  FROM user_preferences up
  WHERE up.user_id = user_uuid;
$$;

-- Function to get user subscription
CREATE OR REPLACE FUNCTION get_user_subscription(user_uuid UUID DEFAULT auth.uid())
RETURNS TABLE(
  id UUID,
  user_id UUID,
  plan TEXT,
  status TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  auto_renew BOOLEAN,
  trial_end_date TIMESTAMPTZ,
  payment_method TEXT,
  next_billing_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT s.id, s.user_id, s.plan, s.status, s.start_date, s.end_date, 
         s.auto_renew, s.trial_end_date, s.payment_method, s.next_billing_date,
         s.created_at, s.updated_at
  FROM subscriptions s
  WHERE s.user_id = user_uuid;
$$;

-- Function to update user profile
CREATE OR REPLACE FUNCTION update_user_profile(
  profile_data JSONB
)
RETURNS profiles
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  updated_profile profiles;
BEGIN
  UPDATE profiles 
  SET 
    full_name = COALESCE(profile_data->>'full_name', full_name),
    avatar_url = COALESCE(profile_data->>'avatar_url', avatar_url),
    bio = COALESCE(profile_data->>'bio', bio),
    updated_at = NOW()
  WHERE id = auth.uid()
  RETURNING * INTO updated_profile;
  
  RETURN updated_profile;
END;
$$;

-- Function to update user preferences
CREATE OR REPLACE FUNCTION update_user_preferences(
  new_preferences JSONB
)
RETURNS user_preferences
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  updated_prefs user_preferences;
BEGIN
  INSERT INTO user_preferences (user_id, preferences)
  VALUES (auth.uid(), new_preferences)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    preferences = new_preferences,
    updated_at = NOW()
  RETURNING * INTO updated_prefs;
  
  RETURN updated_prefs;
END;
$$;

-- Function to manually trigger user creation (for fallback scenarios)
CREATE OR REPLACE FUNCTION handle_new_user_manual(
  user_id UUID,
  user_email TEXT,
  user_full_name TEXT DEFAULT NULL
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create profile (with error handling)
  BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
      user_id, 
      user_email, 
      COALESCE(user_full_name, split_part(user_email, '@', 1))
    );
  EXCEPTION WHEN others THEN
    -- Log error but don't fail the function
    RAISE WARNING 'Failed to create profile for user %: %', user_id, SQLERRM;
  END;
  
  -- Create default subscription (1 year free plan)
  BEGIN
    INSERT INTO public.subscriptions (user_id, plan, status, start_date, end_date)
    VALUES (user_id, 'free', 'active', NOW(), NOW() + INTERVAL '1 year');
  EXCEPTION WHEN others THEN
    RAISE WARNING 'Failed to create subscription for user %: %', user_id, SQLERRM;
  END;
  
  -- Create default preferences
  BEGIN
    INSERT INTO public.user_preferences (user_id, preferences)
    VALUES (user_id, '{
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
    RAISE WARNING 'Failed to create preferences for user %: %', user_id, SQLERRM;
  END;
END;
$$;

-- Grant execute permissions on helper functions
GRANT EXECUTE ON FUNCTION get_user_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_preferences(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_subscription(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_profile(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_preferences(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user_manual(UUID, TEXT, TEXT) TO authenticated;