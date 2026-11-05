import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Logo } from '../components/Logo.tsx';
import { Lock, Mail, ArrowRight, ArrowLeft, KeyRound, AlertCircle, CheckCircle2, Shield, Info } from 'lucide-react';

interface AdminLoginProps {
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToHome }) => {
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot password state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      setErrorMsg(
        error.message || 'Invalid email or password. Please verify your credentials in Supabase.'
      );
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetLoading(true);

    const { error } = await resetPassword(resetEmail.trim());
    setResetLoading(false);

    if (error) {
      setResetError(error.message || 'Failed to send password reset email.');
    } else {
      setResetSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0B] text-[#F5F5F0] flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-[#C7F36B] selection:text-[#090A0B]">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#C7F36B]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-md">
        {/* Top return link */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#A0A89F] hover:text-[#C7F36B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </button>

          <span className="text-[11px] font-mono text-[#A0A89F] bg-[#171C19] border border-[#2A332B] px-2.5 py-1 rounded">
            PORTAL v2.4
          </span>
        </div>

        {/* Card Frame */}
        <div className="bg-[#111514] border border-[#2A332B] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <Logo size="md" showSubtitle={false} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#171C19] border border-[#2A332B] text-[10px] font-mono text-[#C7F36B]">
              <Shield className="w-3 h-3" />
              <span>SUPABASE AUTHENTICATED</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#F5F5F0]">
              Studio CMS Login
            </h1>
            <p className="text-xs text-[#A0A89F] leading-relaxed">
              Authorized admin access to manage AI UGC video portfolio, client inquiries, and media assets.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A0A89F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hossenmeismail@gmail.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] placeholder-[#A0A89F]/50 focus:outline-none focus:border-[#C7F36B] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#F5F5F0]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email || 'hossenmeismail@gmail.com');
                    setShowResetModal(true);
                  }}
                  className="text-[11px] text-[#A0A89F] hover:text-[#C7F36B] transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A0A89F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] placeholder-[#A0A89F]/50 focus:outline-none focus:border-[#C7F36B] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] active:scale-[0.99] rounded-lg transition-all duration-200 shadow-md shadow-[#C7F36B]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[42px]"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#090A0B] border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* First Admin Account Instructions Notice */}
          <div className="pt-4 border-t border-[#2A332B] text-[11px] text-[#A0A89F] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#F5F5F0] font-semibold">
              <Info className="w-3.5 h-3.5 text-[#C7F36B]" />
              <span>First Time Setup Instructions</span>
            </div>
            <p className="leading-relaxed">
              To create your initial admin account securely without public signups:
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-[#A0A89F]">
              <li>Open your <a href="https://supabase.com/dashboard/project/ogzrhiwvgahjnazeuxmg/auth/users" target="_blank" rel="noopener noreferrer" className="text-[#C7F36B] hover:underline">Supabase Auth Dashboard</a>.</li>
              <li>Click <strong>&ldquo;Add user&rdquo;</strong> &gt; <strong>&ldquo;Create user&rdquo;</strong>.</li>
              <li>Enter your email (<code className="text-[#F5F5F0]">hossenmeismail@gmail.com</code>) and set a secure password.</li>
              <li>Auto-confirm user email, then sign in above!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-[#111514] border border-[#2A332B] rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-md bg-[#171C19] border border-[#2A332B] text-[#C7F36B]">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-heading text-[#F5F5F0]">
                Reset Admin Password
              </h3>
            </div>

            {resetSuccess ? (
              <div className="py-4 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#C7F36B]/20 text-[#C7F36B] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-xs text-[#F5F5F0]">
                  Password reset link has been dispatched to{' '}
                  <span className="text-[#C7F36B] font-semibold">{resetEmail}</span>.
                </p>
                <button
                  onClick={() => {
                    setShowResetModal(false);
                    setResetSuccess(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#090A0B] bg-[#C7F36B] rounded-md cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-xs text-[#A0A89F] leading-relaxed">
                  Enter your registered admin email. Supabase will send a secure password recovery link.
                </p>

                {resetError && (
                  <div className="p-2.5 rounded bg-rose-500/10 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{resetError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-3 py-2 text-xs text-[#A0A89F] hover:text-[#F5F5F0] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-4 py-2 text-xs font-bold text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md cursor-pointer disabled:opacity-50"
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
