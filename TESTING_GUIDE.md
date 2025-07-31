# Supabase Authentication Testing Guide

This guide will help you test the Supabase Google authentication integration.

## Prerequisites

Before testing, ensure you have completed the setup in `SUPABASE_SETUP.md`:

1. ✅ Created Supabase project
2. ✅ Configured Google OAuth in Google Cloud Console
3. ✅ Set up environment variables
4. ✅ Enabled Google provider in Supabase

## Quick Setup Checklist

### 1. Environment Configuration
Create a `.env` file in your project root:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Google OAuth URLs
Make sure these URLs are added to your Google OAuth client:
- **Authorized JavaScript origins**: `http://localhost:8081`
- **Authorized redirect URIs**: `https://your-project-ref.supabase.co/auth/v1/callback`

### 3. Supabase Auth Settings
In your Supabase dashboard (Authentication > Settings):
- ✅ Google provider enabled
- ✅ Google Client ID and Secret configured
- ✅ Site URL set to `http://localhost:8081` (for testing)

## Testing Steps

### 1. Start the Development Server
```bash
npm run web
# or
npx expo start --web
```
The app should open at `http://localhost:8081`

### 2. Test Email Authentication

#### Sign Up with Email
1. Navigate to the sign-up page
2. Fill in the form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Create Account"
4. Check the browser console for authentication logs
5. If email confirmation is disabled, you should be redirected to the main app

#### Sign In with Email
1. Navigate to the sign-in page
2. Use the same credentials from sign-up
3. Click "Sign In"
4. You should be redirected to the main app

### 3. Test Google Authentication

#### Sign In with Google
1. Navigate to the sign-in page
2. Click "Continue with Google"
3. You should be redirected to Google's OAuth page
4. Sign in with your Google account
5. Grant permissions to your app
6. You should be redirected back to `http://localhost:8081/auth/callback`
7. Then automatically redirected to the main app

### 4. Test Session Persistence

#### Page Refresh Test
1. After signing in, refresh the page
2. You should remain signed in
3. Check browser dev tools > Application > Local Storage for session data

#### Sign Out Test
1. Navigate to settings or profile page
2. Click sign out
3. You should be redirected to the auth page
4. Session data should be cleared

## Debugging Common Issues

### 1. Google OAuth Not Working

**Error: "Invalid redirect URI"**
- Check that your redirect URIs in Google Console match exactly
- Verify the Supabase URL is correct

**Error: "Client ID not found"**
- Ensure your Google Client ID is correctly set in Supabase
- Make sure you're using the web client ID, not the Android/iOS one

### 2. Email Auth Not Working

**Error: "Invalid email or password"**
- Check if the user exists in Supabase Auth > Users
- Verify that email confirmation is disabled for testing

**Error: "Email not confirmed"**
- Either disable email confirmation in Supabase
- Or check your email for the confirmation link

### 3. Session Not Persisting

**User gets signed out on refresh**
- Check that `persistSession: true` is set in Supabase config
- Verify that the auth state change listener is working
- Check browser console for any errors

### 4. Redirect Issues

**Stuck on callback page**
- Check that `app/auth/callback.tsx` exists
- Verify the callback page logic is working
- Check browser console for navigation errors

## Browser Developer Tools

### Useful Console Commands
```javascript
// Check current session
supabase.auth.getSession()

// Check current user
supabase.auth.getUser()

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session)
})
```

### Network Tab
Monitor the Network tab for:
- OAuth redirect requests
- Supabase API calls
- Authentication tokens

### Application Tab
Check Local Storage for:
- Supabase session data
- User data persistence

## Testing Checklist

- [ ] Email sign-up works
- [ ] Email sign-in works
- [ ] Google sign-in redirects to Google
- [ ] Google OAuth completes and redirects back
- [ ] User is signed in after OAuth
- [ ] Session persists on page refresh
- [ ] Sign out works
- [ ] Session is cleared on sign out
- [ ] Auth state changes are handled properly
- [ ] Navigation works correctly

## Production Deployment

### Before deploying to production:

1. **Update OAuth URLs**
   - Add production domain to Google OAuth settings
   - Update Supabase site URL to production domain

2. **Environment Variables**
   - Set production environment variables
   - Ensure secrets are secure

3. **Security Settings**
   - Enable email confirmation if desired
   - Set up Row Level Security (RLS) policies
   - Configure proper CORS settings

4. **Test on Production**
   - Verify all authentication flows work
   - Test with different browsers
   - Check mobile web experience

## Next Steps

After authentication is working:

1. **User Profiles**: Set up user profile tables in Supabase
2. **Data Sync**: Implement user data synchronization
3. **Security**: Add Row Level Security policies
4. **Analytics**: Add authentication analytics
5. **Error Handling**: Improve error messages and handling

## Support

If you encounter issues:

1. Check the browser console for errors
2. Review the setup steps in `SUPABASE_SETUP.md`
3. Consult the [Supabase documentation](https://supabase.com/docs)
4. Check the in-app setup guide at `/supabase-setup`