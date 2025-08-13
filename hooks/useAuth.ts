import { useState, useEffect } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { database } from '../lib/database';

/**
 * Core authentication hook that manages Supabase auth state
 * This is a simplified, focused hook that handles the essential auth state
 */
export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const session = await database.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
  
        // If there's a session/token error (like refresh token not found),
        // clear any stale auth data to prevent repeated errors
        if (error && typeof error === 'object' && 'message' in error) {
          const errorMessage = (error as any).message?.toLowerCase() || '';
          if (errorMessage.includes('refresh') || 
              errorMessage.includes('token') || 
              errorMessage.includes('session')) {
            console.log('Clearing stale auth data due to token error');
            const { storage } = await import('../lib/storage');
            await storage.clearSupabaseAuthData();
          }
        }
        
        // Ensure clean state
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = database.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  return { 
    session, 
    user, 
    loading,
    isAuthenticated: !!session
  };
};