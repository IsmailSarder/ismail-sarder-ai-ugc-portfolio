import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase.ts';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check local studio session
    if (typeof window !== 'undefined' && localStorage.getItem('ismail_studio_admin_auth') === 'true') {
      setUser({
        id: 'studio-admin-ismail',
        email: 'hossenmeismail@gmail.com',
        app_metadata: {},
        user_metadata: { name: 'Ismail Sarder' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User);
      setLoading(false);
      return;
    }

    // 2. Get initial active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 3. Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    // Master passcode fallback for Ismail Sarder
    if (password === 'ismail2026' || password === 'admin') {
      const mockUser = {
        id: 'studio-admin-ismail',
        email: email || 'hossenmeismail@gmail.com',
        app_metadata: {},
        user_metadata: { name: 'Ismail Sarder' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem('ismail_studio_admin_auth', 'true');
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error && data.user) {
        setUser(data.user);
        setSession(data.session);
        localStorage.setItem('ismail_studio_admin_auth', 'true');
      }
      return { error: error as Error | null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Signout error:', e);
    }
    localStorage.removeItem('ismail_studio_admin_auth');
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/admin',
      });
      return { error: error as Error | null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
