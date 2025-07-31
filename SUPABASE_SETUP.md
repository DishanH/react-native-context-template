# Supabase Google Auth Setup Guide

This guide will help you set up Supabase Google authentication for your React Native app.

## 1. Supabase Project Setup

### Create a Supabase Account and Project
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note down your project URL and anon key from Settings > API

### Update Environment Variables
1. Copy `.env.example` to `.env`
2. Replace the placeholder values with your actual Supabase credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 2. Google OAuth Setup

### In Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API (if not already enabled)
4. Go to "Credentials" and create OAuth 2.0 Client IDs:

#### For Web Testing (localhost)
- **Application Type**: Web application
- **Name**: Your App - Web
- **Authorized JavaScript origins**: 
  - `http://localhost:8081`
  - `https://your-project-ref.supabase.co`
- **Authorized redirect URIs**: 
  - `https://your-project-ref.supabase.co/auth/v1/callback`

#### For Production Web
- **Application Type**: Web application  
- **Name**: Your App - Production
- **Authorized JavaScript origins**: 
  - `https://your-production-domain.com`
  - `https://your-project-ref.supabase.co`
- **Authorized redirect URIs**: 
  - `https://your-project-ref.supabase.co/auth/v1/callback`

### In Supabase Dashboard
1. Go to Authentication > Settings > Auth Providers
2. Enable Google provider
3. Add your Google OAuth Client ID and Client Secret
4. Set redirect URL to: `https://your-project-ref.supabase.co/auth/v1/callback`

## 3. Email Authentication Setup (Optional)

### Enable Email Auth
1. In Supabase Dashboard, go to Authentication > Settings
2. Enable "Enable email confirmations" if you want email verification
3. Configure your email templates under Authentication > Email Templates

### For Testing (Disable Email Confirmation)
For easier testing, you can disable email confirmation:
1. Go to Authentication > Settings
2. Toggle OFF "Enable email confirmations"
3. This allows users to sign up and sign in immediately without email verification

## 4. App Configuration

### URL Scheme Setup
The app is configured with the URL scheme `rn-context-template://` for deep linking.

### Web Testing
For web testing, the app will use:
- Redirect URL: `http://localhost:8081/auth/callback`
- This is handled by the `app/auth/callback.tsx` page

## 5. Testing the Integration

### Start the Development Server
```bash
npm run web
# or
npx expo start --web
```

### Test Google Sign-In
1. Navigate to the sign-in page
2. Click "Continue with Google"
3. You should be redirected to Google's OAuth page
4. After authorization, you'll be redirected back to your app
5. The user should be automatically signed in

### Test Email Sign-Up/Sign-In
1. Use the email form to create an account
2. If email confirmation is enabled, check your email
3. Try signing in with the same credentials

## 6. Production Deployment

### Update Redirect URLs
When deploying to production, make sure to:
1. Update your Google OAuth settings with production URLs
2. Update the Supabase redirect configuration
3. Set the correct environment variables in your production environment

### Security Considerations
- Keep your Supabase service role key secure (never expose in client code)
- Use Row Level Security (RLS) policies in Supabase
- Configure proper CORS settings
- Use HTTPS in production

## 7. Troubleshooting

### Common Issues

#### "Invalid redirect URL" Error
- Make sure your redirect URLs match exactly in both Google Console and Supabase
- Check that your project URL is correct

#### "Client ID not found" Error  
- Verify your Google OAuth Client ID is correctly set in Supabase
- Make sure the Client ID matches your app's origin

#### Authentication Not Persisting
- Check that your Supabase configuration includes `persistSession: true`
- Verify that the auth state change listener is properly set up

#### Web-only Testing
- This setup is optimized for web testing
- For mobile testing, you'll need to set up additional Google OAuth clients for Android/iOS
- Mobile requires additional configuration with redirect schemes

## 8. Next Steps

After authentication is working:
1. Set up user profiles table in Supabase
2. Implement Row Level Security policies
3. Add user data synchronization
4. Set up real-time subscriptions for live updates

For more details, refer to:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Google OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)