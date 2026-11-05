import React, { useState } from 'react';
import { X, Lock, Mail, Key, ShieldCheck, Database, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured, saveSupabaseCredentials, activeSupabaseUrl, activeSupabaseAnonKey } from '../../lib/supabase.ts';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'auth' | 'config'>('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Supabase Connection Settings
  const [customUrl, setCustomUrl] = useState(activeSupabaseUrl);
  const [customKey, setCustomKey] = useState(activeSupabaseAnonKey);
  const [configSuccess, setConfigSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // If Supabase is configured, attempt real authentication
    if (supabase && isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          // If Supabase auth failed, check if master emergency passcode matches
          if (password === 'ismail2026' || password === 'admin') {
            onLoginSuccess();
            onClose();
            return;
          }
          setErrorMessage(error.message || 'Invalid email or password');
          setIsLoading(false);
          return;
        }

        onLoginSuccess();
        onClose();
        return;
      } catch (err: unknown) {
        console.warn('Supabase auth error:', err);
      }
    }

    // Default emergency access for portfolio owner Ismail
    if (
      (email.trim().toLowerCase() === 'hossenmeismail@gmail.com' || email.trim().toLowerCase() === 'admin@ismailsarder.com') &&
      (password === 'ismail2026' || password === 'admin')
    ) {
      onLoginSuccess();
      onClose();
    } else if (password === 'ismail2026') {
      onLoginSuccess();
      onClose();
    } else {
      setErrorMessage(
        isSupabaseConfigured()
          ? 'Invalid credentials. Enter your Supabase admin user credentials or master studio passcode.'
          : 'Invalid credentials. (Hint for demo: use email hossenmeismail@gmail.com and studio passcode: ismail2026)'
      );
    }
    setIsLoading(false);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim() || !customKey.trim()) {
      setErrorMessage('Please provide both Supabase Project URL and Anon Key');
      return;
    }
    saveSupabaseCredentials(customUrl.trim(), customKey.trim());
    setConfigSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-[#111514] border border-[#2A332B] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A332B] bg-[#090A0B]/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[#171C19] text-[#C7F36B] border border-[#2A332B]">
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold font-heading text-[#F5F5F0]">
              Studio CMS & Admin Access
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#A0A89F] hover:text-[#F5F5F0] rounded-md transition-colors cursor-pointer"
            aria-label="Close admin modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-[#2A332B] bg-[#171C19]/50 text-xs font-heading">
          <button
            onClick={() => setActiveTab('auth')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer font-semibold ${
              activeTab === 'auth'
                ? 'text-[#C7F36B] border-b-2 border-[#C7F36B] bg-[#171C19]'
                : 'text-[#A0A89F] hover:text-[#F5F5F0]'
            }`}
          >
            Admin Sign In
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer font-semibold flex items-center justify-center gap-1.5 ${
              activeTab === 'config'
                ? 'text-[#C7F36B] border-b-2 border-[#C7F36B] bg-[#171C19]'
                : 'text-[#A0A89F] hover:text-[#F5F5F0]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Setup</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'auth' ? (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="text-xs text-[#A0A89F] leading-relaxed">
                Enter your administrative credentials to manage portfolio projects, upload videos, and edit strategy blueprints.
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A0A89F] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hossenmeismail@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] placeholder-[#A0A89F]/40 focus:outline-none focus:border-[#C7F36B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                  Password or Studio Passcode
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#A0A89F] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] placeholder-[#A0A89F]/40 focus:outline-none focus:border-[#C7F36B]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-[#090A0B] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authenticate & Open Dashboard</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-3 border-t border-[#2A332B] flex items-center justify-between text-[11px] text-[#A0A89F]">
                <span>Status:</span>
                <span className="flex items-center gap-1.5 font-mono">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSupabaseConfigured() ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {isSupabaseConfigured() ? 'Supabase Live Connected' : 'Local Fallback Mode'}
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="text-xs text-[#A0A89F] leading-relaxed">
                Connect your Supabase project directly. This allows real-time cloud storage for videos, thumbnails, and portfolio projects.
              </div>

              {configSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                  Credentials saved! Reloading connection...
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  required
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] placeholder-[#A0A89F]/40 focus:outline-none focus:border-[#C7F36B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                  Supabase Anon Key
                </label>
                <textarea
                  rows={3}
                  required
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs font-mono text-[#F5F5F0] placeholder-[#A0A89F]/40 focus:outline-none focus:border-[#C7F36B] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-lg transition-all cursor-pointer shadow-md"
                >
                  Save & Connect Supabase
                </button>
              </div>

              <div className="text-[11px] text-[#A0A89F] bg-[#171C19] p-3 rounded-lg border border-[#2A332B] leading-relaxed">
                Tip: Run the SQL script located in <span className="text-[#C7F36B] font-mono">/supabase/schema.sql</span> in your Supabase SQL editor to bootstrap the table and storage buckets in 5 seconds.
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
