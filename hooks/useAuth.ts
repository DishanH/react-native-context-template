import { useState, useEffect, useRef } from 'react';
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
  const lastEventRef = useRef<{ event: string; userId?: string; timestamp: number } | null>(null);

  useEffect(() => {
    // Get initial session with better error handling
    const getInitialSession = async () => {
      try {
        const session = await database.getSession();
        
        if (session) {
          // Only log if this is a different user or first time
          const currentUserId = session.user?.id;
          const lastEvent = lastEventRef.current;
          
          if (!lastEvent || lastEvent.userId !== currentUserId) {
            console.log('useAuth: Found valid session for user:', currentUserId);
          }
          
          setSession(session);
          setUser(session.user);
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('useAuth: Error getting initial session:', error);
        
        // Only clear storage for specific token-related errors
        if (error && typeof error === 'object' && 'message' in error) {
          const errorMessage = (error as any).message?.toLowerCase() || '';
          if (errorMessage.includes('refresh_token_not_found') || 
              errorMessage.includes('invalid_token') ||
              errorMessage.includes('jwt malformed')) {
            console.log('useAuth: Clearing stale auth data due to specific token error');
            try {
              const { storage } = await import('../lib/storage');
              await storage.clearSupabaseAuthData();
            } catch (clearError) {
              console.error('useAuth: Error clearing auth data:', clearError);
            }
          }
        }
        
        // Ensure clean state but don't clear everything aggressively
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to allow Supabase to initialize properly
    const initializeWithDelay = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      await getInitialSession();
    };

    initializeWithDelay();

    // Listen for auth changes with debouncing
    const { data: { subscription } } = database.onAuthStateChange(
      (event, session) => {
        const currentUserId = session?.user?.id;
        const now = Date.now();
        const lastEvent = lastEventRef.current;
        
        // Debounce rapid successive events for the same user
        const shouldLog = !lastEvent || 
          lastEvent.userId !== currentUserId || 
          lastEvent.event !== event ||
          now - lastEvent.timestamp > 2000; // 2 second cooldown
        
        if (shouldLog) {
          console.log('useAuth: Auth state changed:', event, currentUserId);
          lastEventRef.current = { event, userId: currentUserId, timestamp: now };
        }
        
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