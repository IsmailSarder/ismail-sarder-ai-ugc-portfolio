import React, { useState, useEffect } from 'react';
import { X, Database, Check, Copy, CheckCircle2, AlertTriangle, RefreshCw, Mail, MessageSquare } from 'lucide-react';
import { isSupabaseConfigured, fetchRecentInquiries, StoredInquiry } from '../lib/supabase.ts';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'inquiries'>('status');
  const [inquiries, setInquiries] = useState<StoredInquiry[]>([]);
  const [inquirySource, setInquirySource] = useState<'supabase' | 'local'>('local');
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const isConfigured = isSupabaseConfigured();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      loadInquiries();
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen]);

  // Esc listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const loadInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const { inquiries: list, source } = await fetchRecentInquiries();
      setInquiries(list);
      setInquirySource(source);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  const envSnippet = `# Add these to your .env or Netlify Environment Variables:
VITE_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."`;

  const sqlQuickSnippet = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.project_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    website_url TEXT,
    industry TEXT NOT NULL DEFAULT 'Skincare & Beauty',
    budget TEXT NOT NULL,
    selected_services TEXT[] DEFAULT '{}',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new'
);

ALTER TABLE public.project_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public submissions" 
ON public.project_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated read" 
ON public.project_inquiries FOR SELECT TO authenticated USING (true);`;

  const copyToClipboard = (text: string, type: 'env' | 'sql') => {
    navigator.clipboard.writeText(text);
    if (type === 'env') {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    } else {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#111514] border border-[#2A332B] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#2A332B] bg-[#090A0B]/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#171C19] border border-[#2A332B] text-[#C7F36B]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-heading text-[#F5F5F0]">
                Supabase Lead Database & Integration
              </h2>
              <span className="text-[11px] text-[#A0A89F] block">
                Manage client inquiries, credentials, and database schemas
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19] rounded-md transition-colors cursor-pointer"
            aria-label="Close Supabase modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#2A332B] bg-[#111514] text-xs font-heading font-medium">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'status'
                ? 'border-[#C7F36B] text-[#F5F5F0] font-bold'
                : 'border-transparent text-[#A0A89F] hover:text-[#F5F5F0]'
            }`}
          >
            Connection & Setup
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inquiries'
                ? 'border-[#C7F36B] text-[#F5F5F0] font-bold'
                : 'border-transparent text-[#A0A89F] hover:text-[#F5F5F0]'
            }`}
          >
            <span>Inquiries Lead Inbox</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#171C19] border border-[#2A332B] text-[#C7F36B] font-mono">
              {inquiries.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'status' ? (
            <div className="space-y-6">
              
              {/* Connection Status Box */}
              <div className="p-4 rounded-xl bg-[#171C19] border border-[#2A332B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  {isConfigured ? (
                    <div className="p-2 rounded-full bg-[#C7F36B]/15 text-[#C7F36B] border border-[#C7F36B]/30 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-bold font-heading text-[#F5F5F0] block">
                      {isConfigured ? 'Supabase Project Connected' : 'Supabase Credentials Pending'}
                    </span>
                    <p className="text-[11px] text-[#A0A89F] mt-0.5">
                      {isConfigured
                        ? `Connected to ${supabaseUrl}. New inquiries insert into table 'project_inquiries'.`
                        : 'Currently running with resilient local backup mode. Add your Supabase project keys to sync directly to PostgreSQL.'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className={`px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${
                    isConfigured ? 'bg-[#C7F36B] text-[#090A0B]' : 'bg-[#111514] text-amber-400 border border-amber-400/30'
                  }`}>
                    {isConfigured ? 'ONLINE' : 'LOCAL BACKUP'}
                  </span>
                </div>
              </div>

              {/* Step 1: Environment Variables */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#F5F5F0] uppercase tracking-wider font-mono text-[11px]">
                    Step 1: Set Environment Variables
                  </span>
                  <button
                    onClick={() => copyToClipboard(envSnippet, 'env')}
                    className="flex items-center gap-1 text-[#C7F36B] hover:underline cursor-pointer"
                  >
                    {copiedEnv ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEnv ? 'Copied' : 'Copy Variables'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-[#090A0B] rounded-lg border border-[#2A332B] font-mono text-[11px] text-[#A0A89F] overflow-x-auto">
                  {envSnippet}
                </pre>
                <p className="text-[11px] text-[#A0A89F]">
                  In Netlify, add these under <strong>Site configuration &gt; Environment variables</strong>.
                </p>
              </div>

              {/* Step 2: Run SQL Script */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#F5F5F0] uppercase tracking-wider font-mono text-[11px]">
                    Step 2: Initialize Database Table in Supabase
                  </span>
                  <button
                    onClick={() => copyToClipboard(sqlQuickSnippet, 'sql')}
                    className="flex items-center gap-1 text-[#C7F36B] hover:underline cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-[#090A0B] rounded-lg border border-[#2A332B] font-mono text-[10px] text-[#A0A89F] max-h-36 overflow-y-auto">
                  {sqlQuickSnippet}
                </pre>
                <p className="text-[11px] text-[#A0A89F]">
                  A full production script is also saved in your project root at <code>supabase-schema.sql</code> with additional indexes and optional dynamic portfolio tables.
                </p>
              </div>

            </div>
          ) : (
            /* Inquiries List View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#A0A89F]">
                  Source: <strong className="text-[#F5F5F0]">{inquirySource === 'supabase' ? 'Supabase Database' : 'Local Storage Buffer'}</strong>
                </span>
                <button
                  onClick={loadInquiries}
                  disabled={isLoadingInquiries}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#171C19] border border-[#2A332B] text-[#A0A89F] hover:text-[#F5F5F0] cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingInquiries ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-8 text-center bg-[#171C19] border border-[#2A332B] rounded-xl space-y-2">
                  <p className="text-sm font-semibold text-[#F5F5F0]">No inquiries submitted yet</p>
                  <p className="text-[11px] text-[#A0A89F]">
                    When a visitor fills out the contact brief on the website, their message will appear here in real time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-xl bg-[#171C19] border border-[#2A332B] space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2A332B] pb-2">
                        <div>
                          <span className="font-bold font-heading text-sm text-[#F5F5F0]">{inq.name}</span>
                          <span className="text-[#A0A89F] text-xs"> · {inq.brandName}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#C7F36B] bg-[#111514] px-2 py-0.5 rounded border border-[#2A332B]">
                          {new Date(inq.created_at || inq.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-[#A0A89F] block">Work Email:</span>
                          <a href={`mailto:${inq.email}`} className="text-[#F5F5F0] hover:text-[#C7F36B] truncate block">
                            {inq.email}
                          </a>
                        </div>
                        <div>
                          <span className="text-[#A0A89F] block">Budget Tier:</span>
                          <span className="text-[#F5F5F0]">{inq.budget}</span>
                        </div>
                      </div>

                      {inq.selectedServices && inq.selectedServices.length > 0 && (
                        <div className="text-[11px]">
                          <span className="text-[#A0A89F]">Services: </span>
                          <span className="text-[#F5F5F0]">{inq.selectedServices.join(', ')}</span>
                        </div>
                      )}

                      <div className="pt-2 text-[11px] text-[#F5F5F0] bg-[#111514] p-2.5 rounded border border-[#2A332B]">
                        &ldquo;{inq.message}&rdquo;
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2A332B] bg-[#090A0B]/80 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#A0A89F]">
            ISMAIL SARDER · SUPABASE PostgreSQL ENGINE
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
