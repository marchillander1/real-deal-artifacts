
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle successful login redirect
        if (event === 'SIGNED_IN' && session) {
          // Defer navigation to avoid conflicts
          setTimeout(async () => {
            // Only redirect from auth page based on user type
            const currentPath = window.location.pathname;
            if (currentPath === '/auth') {
              try {
                // Check if admin
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('role')
                  .eq('id', session.user.id)
                  .maybeSingle();

                if (profile?.role === 'admin') {
                  window.location.href = '/admin';
                  return;
                }

                // Check if consultant
                const { data: consultant } = await supabase
                  .from('consultants')
                  .select('id')
                  .eq('user_id', session.user.id)
                  .maybeSingle();

                if (consultant) {
                  window.location.href = '/my-profile';
                  return;
                }

                // Business user - redirect to their allowed service
                const { data: userMgmt } = await supabase
                  .from('user_management')
                  .select('access_matchwiseai, access_talent_activation')
                  .eq('email', session.user.email)
                  .maybeSingle();

                if (userMgmt?.access_matchwiseai) {
                  window.location.href = '/matchwiseai';
                } else if (userMgmt?.access_talent_activation) {
                  window.location.href = '/talent-activation';
                } else {
                  window.location.href = '/matchwiseai'; // fallback
                }
              } catch (error) {
                console.log('Error determining user type, using fallback');
                window.location.href = '/matchwiseai';
              }
            }
          }, 100);
        }
      }
    );

    // THEN get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        }
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        // Success will be handled by onAuthStateChange
        console.log('Sign in successful');
      }
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/my-profile`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      
      // Redirect to auth page after sign out
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
