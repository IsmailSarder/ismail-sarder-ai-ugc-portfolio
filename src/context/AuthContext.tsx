import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase.ts';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Configurable Admin UUID via environment variable (defense-in-depth route protection;
// primary data & storage security is enforced server-side via Supabase RLS auth.uid()).
const RAW_ADMIN_UUID = (
  import.meta.env.VITE_ADMIN_UUID ||
  import.meta.env.VITE_SUPABASE_ADMIN_UUID ||
  ''
)
  .trim()
  .toLowerCase();

export const CONFIGURED_ADMIN_UUID = UUID_REGEX.test(RAW_ADMIN_UUID) ? RAW_ADMIN_UUID : '';
export const IS_ADMIN_UUID_CONFIGURED = Boolean(CONFIGURED_ADMIN_UUID);

// Authorized studio admin email allowlist
const RAW_ADMIN_EMAILS = [
  'hossenmeismail@gmail.com',
  import.meta.env.VITE_ADMIN_EMAIL || '',
]
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const AUTHORIZED_ADMIN_EMAILS = Array.from(new Set(RAW_ADMIN_EMAILS));

export function isAuthorizedAdminUser(candidate: User | null | undefined): boolean {
  if (!candidate || !candidate.id) return false;

  const userUuid = candidate.id.trim().toLowerCase();
  if (IS_ADMIN_UUID_CONFIGURED) {
    return userUuid === CONFIGURED_ADMIN_UUID;
  }

  // Fallback allowlist only when VITE_ADMIN_UUID is not yet configured in environment
  const email = (candidate.email || '').trim().toLowerCase();
  return Boolean(email) && AUTHORIZED_ADMIN_EMAILS.includes(email);
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  authError: string | null;
  adminUuidConfigured: boolean;
  configuredAdminUuid: string | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Ensure legacy mock/localStorage auth keys are permanently removed
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ismail_studio_admin_auth');
    }

    let mounted = true;

    const verifyAndApplySession = async (nextSession: Session | null) => {
      if (!mounted) return;

      if (!nextSession || !nextSession.user) {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      // Server-side JWT verification via Supabase Auth before trusting session
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (!mounted) return;

        const verifiedUser = userData?.user ?? null;
        if (userError || !verifiedUser) {
          await supabase.auth.signOut().catch(() => {});
          if (!mounted) return;
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }

        if (!isAuthorizedAdminUser(verifiedUser)) {
          await supabase.auth.signOut().catch(() => {});
          if (!mounted) return;
          setAuthError(
            'Access denied: this Supabase user UUID is not authorized to access the Admin Dashboard.'
          );
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }

        setAuthError(null);
        setSession(nextSession);
        setUser(verifiedUser);
        setLoading(false);
      } catch {
        if (!mounted) return;
        setSession(null);
        setUser(null);
        setLoading(false);
      }
    };

    supabase.auth
      .getSession()
      .then(({ data: { session: activeSession } }) => {
        verifyAndApplySession(activeSession);
      })
      .catch(() => {
        if (mounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      verifyAndApplySession(activeSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setAuthError(null);
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail || !password) {
        return { error: new Error('Please enter both your admin email and password.') };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        return { error: new Error(error.message || 'Invalid email or password.') };
      }

      if (!data.user || !data.session || !isAuthorizedAdminUser(data.user)) {
        await supabase.auth.signOut().catch(() => {});
        const deniedMsg =
          'Access denied. This account UUID is not authorized to access the studio admin dashboard.';
        setAuthError(deniedMsg);
        setUser(null);
        setSession(null);
        return { error: new Error(deniedMsg) };
      }

      setUser(data.user);
      setSession(data.session);
      setAuthError(null);
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Authentication service error.'),
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Signout error:', e);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ismail_studio_admin_auth');
    }
    setUser(null);
    setSession(null);
    setAuthError(null);
  };

  const resetPassword = async (email: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (!AUTHORIZED_ADMIN_EMAILS.includes(normalizedEmail)) {
        return { error: new Error('Password recovery is restricted to the registered admin email.') };
      }
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/#admin`,
      });
      return { error: error ? new Error(error.message) : null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to send reset link.'),
      };
    }
  };

  const isAdmin = Boolean(user && session && isAuthorizedAdminUser(user));

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        authError,
        adminUuidConfigured: IS_ADMIN_UUID_CONFIGURED,
        configuredAdminUuid: IS_ADMIN_UUID_CONFIGURED ? CONFIGURED_ADMIN_UUID : null,
        signIn,
        signOut,
        resetPassword,
        clearAuthError: () => setAuthError(null),
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
