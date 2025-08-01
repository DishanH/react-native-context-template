# Database Trigger Debugging Guide

This guide helps you debug and verify that the `handle_new_user()` trigger is working correctly when users sign up.

## Quick Setup Check

### 1. Verify Tables Exist

Run this query in your Supabase SQL editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'user_preferences', 'subscriptions');
```

You should see all three tables listed.

### 2. Check if Trigger Function Exists

```sql
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';
```

Should return one row with `handle_new_user` function.

### 3. Check if Trigger is Active

```sql
SELECT trigger_name, event_manipulation, action_timing, action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

Should show the trigger with `AFTER INSERT` timing.

## Testing the Trigger

### 1. Manual Test

Create a test user manually to see if the trigger fires:

```sql
-- Insert a test user (this simulates what happens during signup)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Test User"}',
  NOW(),
  NOW(),
  '',
  ''
);
```

**⚠️ Warning**: Only use this for testing. Delete the test user afterwards:

```sql
-- Clean up test user
DELETE FROM auth.users WHERE email = 'test@example.com';
```

### 2. Check if Data was Created

After the test, check if the trigger created the related records:

```sql
-- Check profiles
SELECT id, email, full_name, created_at 
FROM profiles 
WHERE email = 'test@example.com';

-- Check subscriptions  
SELECT user_id, plan, status, start_date, end_date
FROM subscriptions 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'test@example.com');

-- Check preferences
SELECT user_id, preferences->>'language' as language
FROM user_preferences 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'test@example.com');
```

## Common Issues and Fixes

### Issue 1: Trigger Not Firing

**Symptoms**: No profile/subscription/preferences created after signup.

**Solution**: Recreate the trigger:

```sql
-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Issue 2: Function Errors

**Symptoms**: Users are created but related data is missing.

**Check Logs**: Look at Supabase logs for any error messages.

**Solution**: Update the function with better error handling:

```sql
-- The function has been updated with better error handling
-- Re-run the database-setup-user-management.sql script
```

### Issue 3: Permission Issues

**Symptoms**: "permission denied" errors in logs.

**Solution**: Ensure RLS policies are correct:

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'user_preferences', 'subscriptions');

-- Re-run the RLS policies script if needed
```

### Issue 4: Timing Issues

**Symptoms**: Sometimes works, sometimes doesn't.

**Solution**: The app now has fallback logic that creates missing profiles automatically.

## Real-World Testing

### Test Signup Flow

1. **Create a new account** through your app
2. **Check the database** immediately after:

```sql
-- Replace 'your-email@example.com' with the email you used
SELECT 
  u.id,
  u.email,
  u.created_at as user_created,
  p.full_name,
  p.created_at as profile_created,
  s.plan,
  s.status,
  up.preferences->>'language' as language
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN subscriptions s ON u.id = s.user_id  
LEFT JOIN user_preferences up ON u.id = up.user_id
WHERE u.email = 'your-email@example.com';
```

### Expected Results

For a successful signup, you should see:
- `user_created`: Timestamp when user was created
- `full_name`: User's name or email prefix
- `profile_created`: Should be same or very close to user_created
- `plan`: 'free'
- `status`: 'active'
- `language`: 'en'

### If Data is Missing

The app has fallback logic that will:
1. **Detect missing profile** when user signs in
2. **Automatically create** the missing profile
3. **Log messages** to console (check browser/app logs)

You'll see messages like:
```
Profile not found, creating fallback profile...
Fallback profile created successfully
```

## Supabase Dashboard Checks

### 1. Check Authentication Settings

- Go to **Authentication > Settings**
- Ensure **Enable email confirmations** matches your needs
- Check **Site URL** is correct

### 2. Check Database Logs

- Go to **Logs > Database**
- Look for any error messages around user creation time
- Filter by timestamp when you tested signup

### 3. Check Auth Logs

- Go to **Logs > Auth**
- Verify signup attempts are successful
- Check for any authentication errors

## Environment Verification

### Check Environment Variables

Ensure these are set correctly in your `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Test Database Connection

Add this to your app for debugging:

```javascript
// Add to your signup flow temporarily
console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('Database available:', database.getSupabaseClient() !== null);
```

## Troubleshooting Steps

1. **Run all SQL scripts** in this order:
   - `database-setup-user-management.sql`
   - `rls-policies-user-management.sql`

2. **Test manually** with the SQL test above

3. **Test through app** with a new email

4. **Check logs** for any error messages

5. **Verify fallback** logic works (should create profile even if trigger fails)

## Getting Help

If you're still having issues:

1. **Check Supabase logs** for specific error messages
2. **Enable verbose logging** in your app
3. **Test with a fresh user** (new email address)
4. **Verify database permissions** in Supabase dashboard

The fallback logic should ensure users can always use the app, even if the trigger has issues.