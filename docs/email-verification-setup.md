# Email Verification with Magic Links - Setup Guide

## Overview

This guide explains how the email verification system now works with magic links and deep linking in your React Native app.

## What Was Fixed

### 1. Email Signup with Proper Redirect URL
- Updated `signUpWithEmail` method in `lib/database.ts` to include `emailRedirectTo` option
- Configured different redirect URLs for web and mobile platforms
- Web: `http://localhost:8081/auth/callback` (dev) or your domain (production)
- Mobile: `rn-context-template://auth/callback`

### 2. Enhanced Auth Callback Handler
- Updated `app/auth/callback.tsx` to handle email verification tokens
- Added specific logic for processing `type=signup` callbacks
- Improved error handling and user feedback
- Added Toast notifications for verification success/failure

### 3. Email Verification Navigation
- Enabled automatic navigation to email verification screen when sign-in fails due to unverified email
- Fixed the commented-out navigation in `app/auth/sign-in.tsx`

### 4. Resend Verification Email
- Added `resendVerificationEmail` method to database layer with proper redirect URLs
- Updated AuthContext to use the new database method

## How It Works Now

### Sign-Up Flow
1. User signs up with email/password
2. Supabase sends verification email with magic link
3. Magic link includes: `your-redirect-url?access_token=xxx&refresh_token=xxx&type=signup`
4. App redirects to sign-in screen or email verification screen

### Email Verification Flow
1. User clicks magic link in email
2. Browser/app opens the callback URL with tokens
3. `app/auth/callback.tsx` detects `type=signup` and processes verification
4. Sets the Supabase session with provided tokens
5. Shows success message and redirects to main app

### Sign-In with Unverified Email
1. User tries to sign in with unverified email
2. Supabase returns "email not confirmed" error
3. App automatically navigates to email verification screen
4. User can resend verification email from there

## Configuration Requirements

### 1. Supabase Dashboard Settings
Make sure these are configured in your Supabase project:

#### Authentication Settings
1. Go to Authentication > Settings
2. Enable "Enable email confirmations"
3. Set up email templates if needed

#### URL Configuration
Add these URLs to your Supabase auth settings:
- **Development (Web)**: `http://localhost:8081/auth/callback`
- **Production (Web)**: `https://your-domain.com/auth/callback`
- **Mobile**: `rn-context-template://auth/callback`

### 2. App Configuration (Already Set)
The app is configured with:
- URL Scheme: `rn-context-template://` (in `app.json`)
- Deep linking enabled for auth callbacks
- Proper intent filters for Android

## Testing the Implementation

### Web Testing
1. Start development server: `npm run web`
2. Navigate to sign-up page
3. Create account with valid email
4. Check email for verification link
5. Click link - should redirect to app and authenticate

### Mobile Testing
1. Create development build (not Expo Go)
2. Install on device/simulator
3. Follow same sign-up flow
4. Click email verification link
5. Should open app and complete authentication

### Testing Resend Functionality
1. Sign up but don't verify email
2. Try to sign in - should redirect to verification screen
3. Click "Resend Verification Email"
4. Should receive new email with verification link

## Troubleshooting

### Common Issues

#### Email Link Not Opening App
- Ensure URL scheme matches in `app.json` and Supabase settings
- For mobile, make sure you're using development build, not Expo Go
- Check that redirect URLs are exactly the same in Supabase dashboard

#### Verification Failing
- Check browser/app console for error messages
- Verify tokens are being passed correctly in URL parameters
- Ensure Supabase client is properly initialized

#### Web Deep Linking Issues
- Make sure `detectSessionInUrl: true` is set in Supabase client config (already done)
- Check that callback page is accessible at the redirect URL

### Debug Steps

#### Check URL Parameters
In `app/auth/callback.tsx`, add logging to see what parameters are received:
```typescript
console.log('Callback params:', params);
console.log('Access token:', params.access_token);
console.log('Type:', params.type);
```

#### Check Supabase Session
Verify session is being set correctly:
```typescript
const session = await database.getSession();
console.log('Current session:', session);
```

## Production Deployment

### Update Redirect URLs
When deploying to production:

1. **Update Supabase Settings**
   - Add your production domain to allowed redirect URLs
   - Update email templates with production URLs

2. **Update App Configuration**
   - Set proper production URL scheme if different
   - Configure production environment variables

3. **Test Email Flow**
   - Test email verification in production environment
   - Verify deep linking works with production URLs

## Additional Notes

- Email verification tokens expire after a certain time (configurable in Supabase)
- Users can request new verification emails if tokens expire
- The system handles both OAuth social login and email verification through the same callback endpoint
- Email verification works on both web and mobile platforms with proper deep linking setup

## Security Considerations

- Email verification tokens are single-use
- Tokens have expiration times
- Deep linking URLs should use HTTPS in production
- Consider implementing rate limiting for verification email requests (already done - 1 minute cooldown) 