# Database Integration Guide

This guide explains how to set up and use the integrated database tables for profiles, user preferences, and subscriptions in your React Native Context Template.

## Overview

The database integration includes three main tables:
- **profiles**: Extended user profile information beyond auth.users
- **user_preferences**: User settings and preferences stored as JSONB
- **subscriptions**: User subscription and billing information

## Setup Instructions

### 1. Database Setup

Run the SQL scripts in your Supabase SQL editor:

1. **Execute the main setup script:**
   ```sql
   -- Copy and paste the contents of scripts/database-setup.sql
   ```

2. **Apply Row Level Security policies:**
   ```sql
   -- Copy and paste the contents of scripts/rls-policies.sql
   ```

### 2. Environment Configuration

Ensure your Supabase environment variables are set in your `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

### Profiles Table

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### User Preferences Table

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### Subscriptions Table

```sql
CREATE TABLE subscriptions (
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
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

## Usage Examples

### 1. Profile Management

The AuthContext now includes profile management:

```typescript
import { useAuth } from './contexts';

function ProfileScreen() {
  const { user, profile, updateProfile } = useAuth();

  const handleUpdateProfile = async () => {
    const success = await updateProfile({
      full_name: 'John Doe',
      bio: 'Software developer and React Native enthusiast',
      avatar_url: 'https://example.com/avatar.jpg'
    });
    
    if (success) {
      console.log('Profile updated successfully');
    }
  };

  return (
    <View>
      <Text>{profile?.full_name || user?.name}</Text>
      <Text>{profile?.bio}</Text>
    </View>
  );
}
```

### 2. User Preferences

Use the SettingsContext for managing user preferences:

```typescript
import { useSettings } from './contexts';

function SettingsScreen() {
  const { preferences, updateNotificationSettings } = useSettings();

  const togglePushNotifications = async () => {
    await updateNotificationSettings({
      push: !preferences.notifications.push
    });
  };

  return (
    <Switch
      value={preferences.notifications.push}
      onValueChange={togglePushNotifications}
    />
  );
}
```

### 3. Subscription Management

Use the SubscriptionContext for subscription handling:

```typescript
import { useSubscription } from './contexts';

function SubscriptionScreen() {
  const { 
    subscription, 
    upgradeToPlan, 
    isPremiumUser,
    getDaysUntilExpiry 
  } = useSubscription();

  const handleUpgrade = async () => {
    const success = await upgradeToPlan('pro');
    if (success) {
      console.log('Upgraded to Pro plan');
    }
  };

  return (
    <View>
      <Text>Current Plan: {subscription?.plan}</Text>
      <Text>Status: {subscription?.status}</Text>
      {isPremiumUser() && (
        <Text>Days until expiry: {getDaysUntilExpiry()}</Text>
      )}
      <Button title="Upgrade to Pro" onPress={handleUpgrade} />
    </View>
  );
}
```

## Database Functions

The setup includes helper functions for common operations:

### Profile Functions
- `get_user_profile(user_uuid)`: Get user profile data
- `update_user_profile(profile_data)`: Update profile information

### Preferences Functions
- `get_user_preferences(user_uuid)`: Get user preferences
- `update_user_preferences(new_preferences)`: Update preferences

### Subscription Functions
- `get_user_subscription(user_uuid)`: Get subscription data

## TypeScript Types

All database types are defined in `types/database.ts`:

```typescript
import type { 
  Profile, 
  UserPreferences, 
  Subscription,
  UserPreferencesData 
} from './types/database';
```

## Row Level Security

All tables have RLS policies ensuring:
- Users can only access their own data
- Authenticated users can perform CRUD operations on their records
- No cross-user data access

## Automatic Data Creation

When a new user signs up, the system automatically creates:
1. A profile record with basic information
2. Default user preferences
3. A free subscription plan

This is handled by the `handle_new_user()` trigger function.

## Offline Support

The database manager includes offline support:
- Local storage fallback when offline
- Sync queue for pending operations
- Automatic sync when connection is restored

## Error Handling

All database operations include comprehensive error handling:
- Graceful degradation to local storage
- Retry mechanisms for failed operations
- User-friendly error messages

## Testing

To test the database integration:

1. Sign up a new user and verify profile creation
2. Update profile information and check database
3. Modify user preferences and verify persistence
4. Test subscription operations

## Migration Notes

If you're migrating from the previous system:

1. Existing user data in local storage will be preserved
2. The system will gradually sync local data to the database
3. Profile information will be extracted from existing user objects
4. Default preferences and subscriptions will be created for existing users

## Support

For issues with the database integration:

1. Check Supabase logs for any errors
2. Verify RLS policies are correctly applied
3. Ensure environment variables are set
4. Check network connectivity for sync operations

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)