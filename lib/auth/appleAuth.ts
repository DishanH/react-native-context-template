// lib/auth/appleAuth.ts
import * as AppleAuthentication from 'expo-apple-authentication';
import { database } from '../database';
import { Alert, Platform } from 'react-native';
import * as Crypto from 'expo-crypto';

export class AppleAuthService {
  /**
   * Initiate Apple Sign In
   * Only available on iOS
   */
  static async signInWithApple(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      Alert.alert('Not Available', 'Apple Sign In is only available on iOS');
      return false;
    }

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        const { data, error } = await database.getSupabaseClient().auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
          nonce: credential.authorizationCode ? 
            await this.generateNonce(credential.authorizationCode) : 
            undefined,
        });

        if (error) throw error;

        // Update user profile if we got name information
        if (credential.fullName && data.user) {
          const displayName = [
            credential.fullName.givenName,
            credential.fullName.familyName,
          ]
            .filter(Boolean)
            .join(' ');

          if (displayName) {
            await database.getSupabaseClient().auth.updateUser({
              data: { full_name: displayName },
            });
          }
        }

        return true;
      }

      return false;
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        // User canceled the sign-in flow
        return false;
      }
      console.error('Error during Apple sign in:', error);
      Alert.alert('Authentication Error', 'Failed to sign in with Apple');
      return false;
    }
  }

  /**
   * Generate a nonce for Apple authentication
   */
  private static async generateNonce(input: string): Promise<string> {
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      input
    );
    return digest;
  }

  /**
   * Check if Apple Authentication is available
   */
  static async isAvailable(): Promise<boolean> {
    return Platform.OS === 'ios' && 
           await AppleAuthentication.isAvailableAsync();
  }
}