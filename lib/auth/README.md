# Google OAuth with Supabase (Native + Web)

This template uses Supabase as the OAuth client and Expo AuthSession for native apps. You authenticate with Google → Supabase → redirect back to your app (native deep link) or your web route.

## TL;DR

- Configure Google in Supabase using a single Google OAuth 2.0 “Web application” client.
- Do NOT create separate Android/iOS OAuth clients unless you switch to the native Google SDK. Supabase is the OAuth client here.
- Add your app deep link and web callback URLs to Supabase “Additional Redirect URLs”.
- Ensure your Expo scheme matches what the app uses when building redirect URIs.

## How the flow works

- Native (iOS/Android)
  - App builds a deep link: `rn-context-template://auth/callback` via `AuthSession.makeRedirectUri()`.
  - App calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })` and opens an in-app browser session.
  - Supabase redirects back to your deep link with tokens (hash params). The app reads tokens and calls `supabase.auth.setSession()`.

- Web
  - App calls `supabase.auth.signInWithOAuth(...)` with `redirectTo` set to `https://YOUR_WEB_ORIGIN/auth/callback`.
  - Supabase redirects back to `/auth/callback`, which completes the session and routes into the app.

## Required configuration

1) Environment variables (Expo)

- EXPO_PUBLIC_SUPABASE_URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY

These are consumed in `lib/database/core/client.ts` when creating the Supabase client.

2) Supabase → Authentication → URL Configuration

- Site URL
  - Dev web: `http://localhost:8081` (or your dev origin)
  - Prod web: `https://your-domain.com`

- Additional Redirect URLs (add all that apply)
  - Native deep link: `rn-context-template://auth/callback`
  - Dev web: `http://localhost:8081/auth/callback`
  - Prod web: `https://your-domain.com/auth/callback`

3) Supabase → Authentication → Providers → Google

- In Google Cloud Console, create an OAuth 2.0 Client ID of type “Web application”.
- Authorized redirect URIs: ONLY set Supabase’s callback:
  - `https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback`
- Copy the Client ID/Secret into Supabase Google provider.

4) Expo app.json

- `scheme`: must match your deep link scheme (default: `rn-context-template`).
- iOS `bundleIdentifier` and Android `package`: set to your app identifiers.
- Use an EAS Dev Client build (not Expo Go) for testing deep links.

## Where redirects are defined in code

- Native Google OAuth redirect construction:
  - `lib/auth/googleAuth.ts` uses `AuthSession.makeRedirectUri({ scheme: 'rn-context-template', path: 'auth/callback' })`.

- Web and email link redirects:
  - `lib/database/index.ts` builds `http(s)://<origin>/auth/callback` on web and `rn-context-template://auth/callback` on native.

Tip: To avoid hardcoding the scheme in multiple places, you can compute the redirect dynamically:

```ts
// Example (native + web safe)
import * as AuthSession from 'expo-auth-session';

const redirectUri = AuthSession.makeRedirectUri({ path: 'auth/callback' });
```

Then ensure the scheme in `app.json` matches your app.

## FAQ

Q: Do I need separate Android and iOS OAuth clients in Google Cloud?

- A: No, not for this template’s flow. Supabase acts as the OAuth client using a single Google “Web application” client. You only add Supabase’s callback URL in Google, and you only configure your deep links in Supabase.
- You would only need Android/iOS clients if you switch to the native Google Sign-In SDK (`@react-native-google-signin/google-signin`) and authenticate directly with Google outside of Supabase.

Q: After login it sometimes opens in the browser instead of the app.

- Ensure your deep link (`<scheme>://auth/callback`) is added to Supabase “Additional Redirect URLs”.
- Confirm the scheme in `app.json` matches what code uses.
- Use EAS Dev Client (Expo Go won’t register your custom scheme).
- Verify “Site URL” points to your dev origin so Supabase doesn’t fall back to an unexpected domain.

## Rebranding checklist

- Update `app.json`: `name`, `slug`, `scheme`, `ios.bundleIdentifier`, `android.package`.
- Update Supabase URL settings: site URL + additional redirects (replace scheme and domains).
- Set your Supabase env vars (URL and anon key).
- Optional: replace hardcoded scheme occurrences with `AuthSession.makeRedirectUri({ path: 'auth/callback' })`.


