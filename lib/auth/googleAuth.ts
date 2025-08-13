// lib/auth/googleAuth.ts
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { database } from '../database';
import { Alert, Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export class GoogleAuthService {
  private static redirectUri = AuthSession.makeRedirectUri({
    scheme: process.env.EXPO_PUBLIC_APP_SCHEME || 'rn-context-template', // Updated to match app.json scheme
    path: 'auth/callback',
  });

  /**
   * Initiate Google OAuth sign-in
   * Works on both development builds and web
   */
  static async signInWithGoogle(): Promise<boolean> {
    try {
      // For web, use Supabase's built-in OAuth
      if (Platform.OS === 'web') {
        await database.signInWithProvider('google');
        return true;
      }

      // For mobile, use AuthSession for better control
      const supabaseClient = database.getSupabaseClient();
      if (!supabaseClient) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: this.redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      // Open auth session
      const result = await WebBrowser.openAuthSessionAsync(
        data?.url ?? '',
        this.redirectUri
      );

      if (result.type === 'success') {
        const { url } = result;
        return await this.handleCallback(url);
      }

      return false;
    } catch (error) {
      console.error('Error during Google sign in:', error);
      Alert.alert('Authentication Error', 'Failed to sign in with Google');
      return false;
    }
  }

  /**
   * Handle the OAuth callback URL
   * Extracts tokens and sets the session
   */
  private static async handleCallback(url: string): Promise<boolean> {
    try {
      const params = this.extractParamsFromUrl(url);
      
      if (params.access_token && params.refresh_token) {
        const supabaseClient = database.getSupabaseClient();
        if (!supabaseClient) {
          throw new Error('Supabase client not available');
        }
        const { error } = await supabaseClient.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        });

        if (error) throw error;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      return false;
    }
  }

  /**
   * Extract parameters from OAuth callback URL
   */
  private static extractParamsFromUrl(url: string): Record<string, string> {
    const params: Record<string, string> = {};
    const queryString = url.split('#')[1];
    
    if (queryString) {
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          params[key] = decodeURIComponent(value);
        }
      });
    }
    
    return params;
  }
}