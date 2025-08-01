# Authentication Guide

This guide explains the improved authentication system that combines the best of both hook-based and context-based approaches.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   useAuth Hook  │───▶│   AuthContext    │───▶│  Auth Services  │
│ (Supabase State)│    │ (App State &     │    │ (Google/Apple)  │
│                 │    │  Navigation)     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Key Benefits

✅ **Simplified State Management**: `useAuth` hook handles core Supabase auth state  
✅ **Better OAuth Support**: Dedicated services for Google and Apple auth  
✅ **Cross-Platform**: Works on web, iOS, and Android (including dev builds)  
✅ **Type Safety**: Full TypeScript support  
✅ **Storage Persistence**: Automatic user data persistence  
✅ **Navigation Integration**: Seamless routing on auth state changes  

## Quick Start

### 1. Using the Auth Hook (Simple)

For components that just need auth state:

```tsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, session, loading, isAuthenticated } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <SignInPrompt />;
  
  return <AuthenticatedContent user={user} />;
}
```

### 2. Using the Auth Context (Full Features)

For components that need auth actions:

```tsx
import { useAuth } from '../contexts/AuthContext';

function SignInScreen() {
  const { signIn, socialSignIn, isLoading } = useAuth();
  
  const handleEmailSignIn = async () => {
    const success = await signIn(email, password);
    if (!success) {
      // Handle error
    }
  };
  
  const handleGoogleSignIn = async () => {
    const success = await socialSignIn('google');
    if (!success) {
      // Handle error
    }
  };
}
```

### 3. Using Social Auth Services Directly

For maximum control:

```tsx
import { GoogleAuthService, AppleAuthService } from '../lib/auth';

function CustomAuthComponent() {
  const handleGoogleAuth = async () => {
    const success = await GoogleAuthService.signInWithGoogle();
    // Auth state will automatically update via useAuth hook
  };
}
```

## Social Authentication Setup

### Google OAuth

1. **Configure your app scheme** in `app.json`:
```json
{
  "expo": {
    "scheme": "your-app-scheme"
  }
}
```

2. **Update the redirect URI** in `lib/auth/googleAuth.ts`:
```tsx
private static redirectUri = AuthSession.makeRedirectUri({
  scheme: 'your-app-scheme', // Match your app.json scheme
  path: 'auth/callback',
});
```

3. **Set up Google OAuth** in your Supabase dashboard:
   - Add your app's bundle ID/package name
   - Configure OAuth redirect URLs

### Apple Sign In

1. **Enable Apple Sign In** capability in your iOS project
2. **Configure Apple OAuth** in Supabase dashboard
3. Apple auth will automatically be available on iOS devices

## File Structure

```
├── hooks/
│   └── useAuth.ts              # Core Supabase auth state hook
├── lib/auth/
│   ├── index.ts               # Export all auth services
│   ├── googleAuth.ts          # Google OAuth service
│   └── appleAuth.ts           # Apple Sign In service
├── contexts/
│   └── AuthContext.tsx        # Enhanced auth context with app features
├── components/auth/
│   └── SocialAuthButtons.tsx  # Reusable social auth UI
└── app/auth/
    └── callback.tsx           # Simplified OAuth callback handler
```

## Migration from Old System

If you're migrating from the previous auth system:

1. **Replace direct Supabase calls** with auth services:
   ```tsx
   // Old
   await supabase.auth.signInWithOAuth({ provider: 'google' });
   
   // New
   await GoogleAuthService.signInWithGoogle();
   ```

2. **Update auth state usage**:
   ```tsx
   // Old
   const { user } = useAuth(); // From context
   
   // New
   const { user, session, isAuthenticated } = useAuth(); // From hook
   // OR use context for auth actions
   const { signIn, signOut, socialSignIn } = useAuth(); // From context
   ```

## Best Practices

1. **Use the hook for state**, context for actions
2. **Handle loading states** properly in your UI
3. **Test OAuth flows** on actual devices for mobile
4. **Configure proper redirect URLs** for production
5. **Handle auth errors** gracefully with user feedback

## Troubleshooting

### OAuth not working on mobile
- Ensure your app scheme is correctly configured
- Check that redirect URLs match in Supabase dashboard
- Test on development builds, not Expo Go

### Auth state not persisting
- Check that storage permissions are granted
- Verify Supabase session is being properly restored

### Apple Sign In not available
- Only works on iOS devices
- Requires proper Apple Developer setup
- Use `AppleAuthService.isAvailable()` to check

## Environment Setup

Make sure these environment variables are set:

```bash
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Testing

The new auth system supports testing on:
- ✅ Web browsers
- ✅ iOS simulators and devices  
- ✅ Android emulators and devices
- ✅ Development builds
- ❌ Expo Go (OAuth limitations)

For full OAuth testing, use development builds or publish to stores.