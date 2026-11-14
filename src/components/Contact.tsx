import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Mail, MessageSquare, Linkedin, Send, Copy, Check, Clock, Globe, AlertCircle, Database, CheckCircle2, Sparkles, Tag, DollarSign, Calendar, Layers, X } from 'lucide-react';
import { submitProjectInquiry, isSupabaseConfigured } from '../lib/supabase.ts';

export interface ContactRef {
  setService: (serviceName: string) => void;
  setProjectInterest: (projectTitle: string) => void;
  setPackageInterest: (packageName: string, isNegotiation?: boolean) => void;
}

interface ContactProps {
  initialService?: string;
  onOpenSupabaseModal?: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  brandName?: string;
  message?: string;
}

export const Contact = forwardRef<ContactRef, ContactProps>(({ initialService = '', onOpenSupabaseModal }, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    brandName: '',
    websiteUrl: '',
    selectedPackage: 'GROWTH — $89',
    videoCount: '2 Videos',
    timeline: '1-Day Delivery (Express 24h)',
    budget: '$89 (Growth Tier)',
    customBudget: '',
    isNegotiation: false,
    industry: 'Skincare & Beauty',
    selectedServices: initialService ? [initialService] : ['AI UGC Video Ads'],
    message: '',
  });

  const [highlightNotice, setHighlightNotice] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [supabaseSynced, setSupabaseSynced] = useState<boolean>(false);

  const isSupabaseReady = isSupabaseConfigured();

  useImperativeHandle(ref, () => ({
    setService: (serviceName: string) => {
      setFormData((prev) => ({
        ...prev,
        selectedServices: prev.selectedServices.includes(serviceName)
          ? prev.selectedServices
          : [...prev.selectedServices, serviceName],
      }));
      setHighlightNotice(`Selected Service: ${serviceName}`);
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },

    setProjectInterest: (projectTitle: string) => {
      setFormData((prev) => ({
        ...prev,
        message: `Hi Ismail, I saw the concept demonstration "${projectTitle}" on your portfolio and would like to explore a tailored AI UGC video ad batch for our brand.`,
      }));
      setHighlightNotice(`Project Reference: "${projectTitle}"`);
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },

    setPackageInterest: (packageName: string, isNegotiation?: boolean) => {
      const isCustom = Boolean(
        isNegotiation ||
        packageName.toLowerCase().includes('custom') ||
        packageName.toLowerCase().includes('negotiat') ||
        packageName.toLowerCase().includes('budget')
      );

      let targetPackage = packageName;
      let targetBudget = '$89 (Growth Tier)';
      let targetVideos = '2 Videos';

      if (packageName.includes('39') || packageName.toUpperCase().includes('STARTER')) {
        targetPackage = 'STARTER — $39';
        targetBudget = '$39 (Starter Tier)';
        targetVideos = '1 Video';
      } else if (packageName.includes('89') || packageName.toUpperCase().includes('GROWTH')) {
        targetPackage = 'GROWTH — $89';
        targetBudget = '$89 (Growth Tier)';
        targetVideos = '2 Videos';
      } else if (packageName.includes('179') || packageName.toUpperCase().includes('PRO') || packageName.toUpperCase().includes('SCALE')) {
        targetPackage = 'PRO / SCALE — $179';
        targetBudget = '$179 (Pro / Scale Tier)';
        targetVideos = '4 Videos';
      } else if (isCustom) {
        targetPackage = 'Custom Package / Price Negotiation';
        targetBudget = 'Custom / Open to Negotiation';
        targetVideos = 'Custom Batch';
      }

      setFormData((prev) => ({
        ...prev,
        selectedPackage: targetPackage,
        budget: targetBudget,
        videoCount: targetVideos,
        timeline: '1-Day Delivery (Express 24h)',
        isNegotiation: isCustom,
        message: isCustom && !prev.message
          ? "Hi Ismail, I'd like to discuss a custom video package and negotiate pricing tailored to our video quantity, creative specifications, and budget."
          : prev.message,
      }));

      setHighlightNotice(
        isCustom
          ? 'Custom Price Negotiation Active — Propose your target budget and scope below'
          : `Selected Package: ${targetPackage} — Feel free to adjust or negotiate below`
      );

      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },
  }));

  const packagesList = [
    {
      id: 'STARTER — $39',
      name: 'STARTER — $39',
      videos: '1 Video (15–20s)',
      defaultBudget: '$39 (Starter Tier)',
      defaultCount: '1 Video',
      tag: 'Fast Test',
    },
    {
      id: 'GROWTH — $89',
      name: 'GROWTH — $89',
      videos: '2 Videos (20–30s each)',
      defaultBudget: '$89 (Growth Tier)',
      defaultCount: '2 Videos',
      tag: 'MOST POPULAR',
      isPopular: true,
    },
    {
      id: 'PRO / SCALE — $179',
      name: 'PRO / SCALE — $179',
      videos: '4 Videos (4 Angles)',
      defaultBudget: '$179 (Pro / Scale Tier)',
      defaultCount: '4 Videos',
      tag: 'Scale Campaign',
    },
    {
      id: 'Custom Package / Price Negotiation',
      name: 'Custom Package / Price Negotiation',
      videos: 'Tailored Quantity & Scope',
      defaultBudget: 'Custom / Open to Negotiation',
      defaultCount: 'Custom Batch',
      tag: 'Flexible Budget',
      isNegotiation: true,
    },
  ];

  const videoCountOptions = [
    '1 Video',
    '2 Videos',
    '3–5 Videos',
    '6–10 Videos',
    '10+ Batch / Monthly Retainer',
    'Custom Batch',
  ];

  const timelineOptions = [
    '1-Day Delivery (Express 24h)',
    '2–3 Days',
    'Flexible Timeline',
  ];

  const budgetOptions = [
    '$39 (Starter Tier)',
    '$89 (Growth Tier)',
    '$179 (Pro / Scale Tier)',
    '$200 – $500 (Multi-Video Batch)',
    '$500 – $1,500 (Scale Testing)',
    '$1,500+ (Monthly Creative Retainer)',
    'Custom / Open to Negotiation',
  ];

  const industries = [
    'Skincare & Beauty',
    'Fashion & Lifestyle',
    'Gadgets & Consumer Technology',
    'E-commerce Products',
    'SaaS & Digital Products',
    'Other Industry',
  ];

  const availableServices = [
    'AI UGC Ads Creation',
    'AI Video Ads Creation',
    'AI UGC Video Ads',
    'AI Spokesperson Videos',
    'Product Demonstration Videos',
    'E-commerce Video Creatives',
    'Ad Hooks & Scriptwriting',
    'Multiple Creative Variations',
    'Product B-roll & Lifestyle',
    'Social Media Ad Creatives',
  ];

  const handlePackageSelect = (pkg: typeof packagesList[0]) => {
    setFormData((prev) => ({
      ...prev,
      selectedPackage: pkg.name,
      budget: pkg.defaultBudget,
      videoCount: pkg.defaultCount,
      isNegotiation: Boolean(pkg.isNegotiation),
      message: pkg.isNegotiation && !prev.message
        ? "Hi Ismail, I'd like to discuss a custom package and negotiate pricing tailored to our video quantity, creative specifications, and budget."
        : prev.message,
    }));
    setHighlightNotice(
      pkg.isNegotiation
        ? 'Custom Price Negotiation Mode Active — Propose your target budget below'
        : `Selected: ${pkg.name}`
    );
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hossenmeismail@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const toggleService = (srv: string) => {
    setFormData((prev) => {
      const exists = prev.selectedServices.includes(srv);
      if (exists) {
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter((s) => s !== srv),
        };
      } else {
        return {
          ...prev,
          selectedServices: [...prev.selectedServices, srv],
        };
      }
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your work email';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.brandName.trim()) {
      newErrors.brandName = 'Please provide your brand or company name';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide at least 10 characters describing your project requirements or budget goals';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getEffectiveBudget = () => {
    if (formData.budget === 'Custom / Open to Negotiation' && formData.customBudget.trim()) {
      return `Custom: ${formData.customBudget.trim()} (Negotiable)`;
    }
    return formData.budget;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const effectiveBudget = getEffectiveBudget();

    try {
      const result = await submitProjectInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        brandName: formData.brandName.trim(),
        websiteUrl: formData.websiteUrl.trim(),
        industry: formData.industry,
        budget: effectiveBudget,
        selectedPackage: formData.selectedPackage,
        videoCount: formData.videoCount,
        timeline: formData.timeline,
        selectedServices: formData.selectedServices,
        message: formData.message.trim(),
      });

      setSupabaseSynced(result.syncedWithSupabase);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setErrors({});
    setHighlightNotice(null);
    setFormData({
      name: '',
      email: '',
      brandName: '',
      websiteUrl: '',
      selectedPackage: 'GROWTH — $89',
      videoCount: '2 Videos',
      timeline: '1-Day Delivery (Express 24h)',
      budget: '$89 (Growth Tier)',
      customBudget: '',
      isNegotiation: false,
      industry: 'Skincare & Beauty',
      selectedServices: ['AI UGC Video Ads'],
      message: '',
    });
  };

  const effectiveBudgetText = getEffectiveBudget();

  // Pre-filled WhatsApp link for instant communication with package & budget context
  const whatsappBriefText = encodeURIComponent(
    `Hi Ismail, my name is ${formData.name || 'Brand Owner'} from ${formData.brandName || 'my brand'}. I'm interested in "${formData.selectedPackage}" (${formData.videoCount}, timeline: ${formData.timeline}, budget: ${effectiveBudgetText}). Let's discuss our project!`
  );

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-28 bg-[#090A0B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A0A89F] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#C7F36B]" />
            <span>Project Inquiries &amp; Hiring</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F5F5F0] tracking-tight mb-3 sm:mb-4 [text-wrap:balance]">
            Need AI UGC videos or creative AI video advertisements for your brand?
          </h2>
          <p className="text-xs sm:text-base text-[#A0A89F] leading-relaxed mb-5">
            Let&apos;s discuss your project and create video ads that match your brand&apos;s goals.
          </p>
          <a
            href="#contact-form-panel"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact-name')?.focus();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all shadow-md shadow-[#C7F36B]/15 min-h-[40px]"
          >
            <span>Start a Project</span>
            <Send className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 2-Column Split: Direct Channels + Project Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          
          {/* Left Column: Direct Channels & Operational Info */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            
            {/* Direct Contact Channels */}
            <div className="bg-[#171C19] border border-[#2A332B] rounded-xl p-5 sm:p-6 space-y-4 sm:space-y-5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#A0A89F] block font-semibold">
                Direct Channels
              </span>

              {/* Email */}
              <div className="p-3.5 sm:p-4 rounded-lg bg-[#111514] border border-[#2A332B] flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-[#090A0B] text-[#C7F36B] border border-[#2A332B] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-[#A0A89F] block">OFFICIAL INBOX</span>
                    <a
                      href="mailto:hossenmeismail@gmail.com"
                      className="text-xs sm:text-sm font-semibold text-[#F5F5F0] hover:text-[#C7F36B] transition-colors truncate block"
                    >
                      hossenmeismail@gmail.com
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 text-[#A0A89F] hover:text-[#F5F5F0] rounded hover:bg-[#171C19] transition-colors cursor-pointer shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
                  title="Copy email to clipboard"
                  aria-label="Copy email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-[#C7F36B]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* WhatsApp Direct */}
              <div className="p-3.5 sm:p-4 rounded-lg bg-[#111514] border border-[#2A332B] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-[#090A0B] text-[#C7F36B] border border-[#2A332B] shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#A0A89F] block">DIRECT WHATSAPP</span>
                    <span className="text-xs sm:text-sm font-semibold text-[#F5F5F0]">
                      +88 01648861141
                    </span>
                  </div>
                </div>

                <a
                  href="https://wa.me/8801648861141?text=Hi%20Ismail,%20I'd%20like%20to%20discuss%20AI%20UGC%20video%20ads%20and%20negotiate%20pricing%20for%20our%20brand."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-[11px] font-bold font-heading uppercase text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded transition-all min-h-[34px] flex items-center"
                >
                  Chat Now
                </a>
              </div>

              {/* LinkedIn */}
              <div className="p-3.5 sm:p-4 rounded-lg bg-[#111514] border border-[#2A332B] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-[#090A0B] text-[#C7F36B] border border-[#2A332B] shrink-0">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#A0A89F] block">PROFESSIONAL PROFILE</span>
                    <span className="text-xs sm:text-sm font-semibold text-[#F5F5F0]">
                      in/ismail-sarder
                    </span>
                  </div>
                </div>

                <a
                  href="https://www.linkedin.com/in/ismail-sarder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-[11px] font-semibold text-[#F5F5F0] hover:text-[#C7F36B] bg-[#171C19] border border-[#2A332B] rounded transition-all min-h-[34px] flex items-center"
                >
                  Connect
                </a>
              </div>
            </div>

            {/* Price Flexibility Notice Card */}
            <div className="bg-[#171C19] border border-[#2A332B] rounded-xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F5F5F0]">
                <DollarSign className="w-4 h-4 text-[#C7F36B]" />
                <span>Flexible &amp; Negotiable Pricing</span>
              </div>
              <p className="text-xs text-[#A0A89F] leading-relaxed">
                Whether you need 1 test video or an ongoing 20-video monthly ad refresh, pricing can be customized to match your ROI targets, video quantity, and project complexity.
              </p>
              <div className="pt-2 border-t border-[#2A332B] flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#A0A89F]">
                <span className="flex items-center gap-1 text-[#C7F36B]">
                  <Check className="w-3.5 h-3.5" /> 1-Day Turnaround
                </span>
                <span>·</span>
                <span>Volume Discounts</span>
                <span>·</span>
                <span>Split Testing Hooks</span>
              </div>
            </div>

            {/* Database & Speed Metrics Card */}
            <div className="bg-[#171C19] border border-[#2A332B] rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F5F5F0]">
                  <Database className="w-4 h-4 text-[#C7F36B]" />
                  <span>Supabase Lead Engine</span>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isSupabaseReady
                    ? 'bg-[#C7F36B]/15 text-[#C7F36B] border-[#C7F36B]/30'
                    : 'bg-[#111514] text-[#A0A89F] border-[#2A332B]'
                }`}>
                  {isSupabaseReady ? 'CONNECTED' : 'LOCAL BACKUP READY'}
                </span>
              </div>

              <p className="text-xs text-[#A0A89F] leading-relaxed">
                {isSupabaseReady
                  ? 'Client inquiries are saved directly to your Supabase project_inquiries database in real time.'
                  : 'Inquiries are safely captured with resilient offline storage.'}
              </p>

              <div className="pt-3 border-t border-[#2A332B] flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] text-[#A0A89F] font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C7F36B]" />
                  Avg Response: &lt; 6 Hours
                </span>
                <span className="text-[#C7F36B]">EST · GMT · GST · AEDT</span>
              </div>
            </div>

          </div>

          {/* Right Column: Project Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#171C19] border border-[#2A332B] rounded-2xl p-5 sm:p-8 shadow-xl">
              
              {isSubmitted ? (
                <div className="py-8 sm:py-10 text-center space-y-5 animate-fade-in">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C7F36B]/20 text-[#C7F36B] border border-[#C7F36B]/40 flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#F5F5F0]">
                      Inquiry Received, {formData.name || 'Partner'}!
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A0A89F] max-w-md mx-auto mt-2 leading-relaxed">
                      Thank you for submitting your brief for{' '}
                      <span className="text-[#F5F5F0] font-semibold">{formData.brandName}</span>.
                      I will review your requirements and reply to{' '}
                      <span className="text-[#C7F36B]">{formData.email}</span> within 6 hours.
                    </p>
                  </div>

                  {supabaseSynced && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C7F36B]/10 border border-[#C7F36B]/30 text-[#C7F36B] text-xs font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Saved directly to Supabase database</span>
                    </div>
                  )}

                  {/* Inquiry Summary Box */}
                  <div className="p-4 rounded-xl bg-[#111514] border border-[#2A332B] max-w-md mx-auto text-left text-xs space-y-2">
                    <div className="text-[10px] font-mono text-[#A0A89F] uppercase font-semibold">Inquiry Summary:</div>
                    <div className="text-[#F5F5F0]">
                      <span className="text-[#A0A89F]">Package:</span>{' '}
                      <span className="text-[#C7F36B] font-bold">{formData.selectedPackage}</span>
                    </div>
                    <div className="text-[#F5F5F0]">
                      <span className="text-[#A0A89F]">Quantity &amp; Timeline:</span> {formData.videoCount} · {formData.timeline}
                    </div>
                    <div className="text-[#F5F5F0]">
                      <span className="text-[#A0A89F]">Target Budget:</span> {effectiveBudgetText}
                    </div>
                    <div className="text-[#F5F5F0]">
                      <span className="text-[#A0A89F]">Industry:</span> {formData.industry}
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/8801648861141?text=${whatsappBriefText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-3 text-xs font-bold font-heading uppercase text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all inline-flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Continue on WhatsApp
                    </a>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-[#A0A89F] hover:text-[#F5F5F0] rounded-md border border-[#2A332B] hover:bg-[#111514] transition-all cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  
                  {/* Form Header */}
                  <div className="border-b border-[#2A332B] pb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-heading text-[#F5F5F0]">
                        Project Brief &amp; Quote Request
                      </h3>
                      <p className="text-xs text-[#A0A89F] mt-1">
                        Select a package or negotiate custom pricing based on your project requirements.
                      </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[#A0A89F]">
                      <span className={`w-2 h-2 rounded-full ${isSupabaseReady ? 'bg-[#C7F36B]' : 'bg-amber-400'}`} />
                      <span>{isSupabaseReady ? 'Supabase Live' : 'Local Capture'}</span>
                    </div>
                  </div>

                  {/* Active Highlight Banner */}
                  {highlightNotice && (
                    <div className="p-3 rounded-lg bg-[#C7F36B]/10 border border-[#C7F36B]/30 flex items-center justify-between gap-2 text-xs text-[#F5F5F0]">
                      <div className="flex items-center gap-2 min-w-0">
                        <Sparkles className="w-4 h-4 text-[#C7F36B] shrink-0" />
                        <span className="truncate">{highlightNotice}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHighlightNotice(null)}
                        className="text-[#A0A89F] hover:text-[#F5F5F0] p-1 shrink-0 cursor-pointer"
                        aria-label="Dismiss notice"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* 1. PACKAGE SELECTION TIERS */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider font-mono">
                        1. Selected Package <span className="text-[#C7F36B]">*</span>
                      </label>
                      <span className="text-[11px] text-[#A0A89F]">Prices are flexible &amp; negotiable</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {packagesList.map((pkg) => {
                        const isSelected = formData.selectedPackage === pkg.name;
                        return (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => handlePackageSelect(pkg)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                              isSelected
                                ? 'bg-[#111514] border-[#C7F36B] shadow-md shadow-[#C7F36B]/10'
                                : 'bg-[#111514]/60 border-[#2A332B] hover:border-[#A0A89F]/40'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className={`text-xs font-bold font-heading ${isSelected ? 'text-[#C7F36B]' : 'text-[#F5F5F0]'}`}>
                                {pkg.name}
                              </span>
                              {pkg.isPopular && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#C7F36B] text-[#090A0B]">
                                  POPULAR
                                </span>
                              )}
                              {pkg.isNegotiation && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#2A332B] text-[#C7F36B]">
                                  NEGOTIABLE
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#A0A89F]">
                              {pkg.videos}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Negotiation Callout when active */}
                    {formData.isNegotiation && (
                      <div className="mt-3 p-3 rounded-lg bg-[#111514] border border-[#C7F36B]/40 text-xs text-[#A0A89F] leading-relaxed flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-[#C7F36B] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#F5F5F0]">Custom Price Negotiation Mode:</strong> Every brand has different volume and budget targets. Let&apos;s agree on a price that works for both of us—specify your target budget and video count below!
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. VIDEO QUANTITY & TIMELINE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-video-count" className="block text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider font-mono mb-1.5">
                        2. Number of Videos
                      </label>
                      <select
                        id="contact-video-count"
                        value={formData.videoCount}
                        onChange={(e) => setFormData({ ...formData, videoCount: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B] transition-colors"
                      >
                        {videoCountOptions.map((v) => (
                          <option key={v} value={v} className="bg-[#111514] text-[#F5F5F0]">
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-timeline" className="block text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider font-mono mb-1.5">
                        3. Preferred Delivery Timeline
                      </label>
                      <select
                        id="contact-timeline"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B] transition-colors"
                      >
                        {timelineOptions.map((t) => (
                          <option key={t} value={t} className="bg-[#111514] text-[#F5F5F0]">
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 3. TARGET BUDGET & CUSTOM PROPOSAL */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider font-mono">
                        4. Target Budget / Proposed Rate
                      </label>
                      <span className="text-[11px] text-[#A0A89F]">Negotiable based on scope</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2.5">
                      {budgetOptions.map((b) => {
                        const isBudgetSelected = formData.budget === b;
                        return (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setFormData({ ...formData, budget: b })}
                            className={`p-2 text-xs text-left rounded-lg border transition-all cursor-pointer min-h-[36px] flex items-center ${
                              isBudgetSelected
                                ? 'bg-[#C7F36B]/15 border-[#C7F36B] text-[#F5F5F0] font-semibold'
                                : 'bg-[#111514] border-[#2A332B] text-[#A0A89F] hover:text-[#F5F5F0]'
                            }`}
                          >
                            <span className="truncate">{b}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Show Custom Budget text input if negotiation or custom budget option is selected */}
                    {(formData.budget === 'Custom / Open to Negotiation' || formData.isNegotiation) && (
                      <div className="mt-2">
                        <label htmlFor="custom-budget-input" className="block text-[11px] text-[#A0A89F] mb-1">
                          Propose your budget or rate per video (Optional):
                        </label>
                        <input
                          id="custom-budget-input"
                          type="text"
                          value={formData.customBudget}
                          onChange={(e) => setFormData({ ...formData, customBudget: e.target.value })}
                          placeholder="e.g. $120 total for 3 videos, or $50/video test"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] placeholder-[#A0A89F]/50 focus:outline-none focus:border-[#C7F36B] transition-colors"
                        />
                      </div>
                    )}
                  </div>

                  {/* 4. NAME & WORK EMAIL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-semibold text-[#F5F5F0] mb-1.5">
                        Your Name <span className="text-[#C7F36B]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="Sarah Jenkins"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border text-xs sm:text-sm text-[#F5F5F0] placeholder-[#A0A89F]/50 focus:outline-none transition-colors ${
                          errors.name ? 'border-rose-500 focus:border-rose-500' : 'border-[#2A332B] focus:border-[#C7F36B]'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-[#F5F5F0] mb-1.5">
                        Work Email <span className="text-[#C7F36B]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="sarah@yourbrand.com"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border text-xs sm:text-sm text-[#F5F5F0] placeholder-[#A0A89F]/50 focus:outline-none transition-colors ${
                          errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-[#2A332B] focus:border-[#C7F36B]'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 5. BRAND NAME & WEBSITE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-brand" className="block text-xs font-semibold text-[#F5F5F0] mb-1.5">
                        Brand / Business Name <span className="text-[#C7F36B]">*</span>
                      </label>
                      <input
                        id="contact-brand"
                        type="text"
                        value={formData.brandName}
                        onChange={(e) => {
                          setFormData({ ...formData, brandName: e.target.value });
                          if (errors.brandName) setErrors({ ...errors, brandName: undefined });
                        }}
                        placeholder="Aurelia Botanica"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border text-xs sm:text-sm text-[#F5F5F0] placeholder-[#A0A89F]/50 focus:outline-none transition-colors ${
                          errors.brandName ? 'border-rose-500 focus:border-rose-500' : 'border-[#2A332B] focus:border-[#C7F36B]'
                        }`}
                      />
                      {errors.brandName && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.brandName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-website" className="block text-xs font-semibold text-[#F5F5F0] mb-1.5">
                        Website or Product Link
                      </label>
                      <input
                        id="contact-website"
                        type="url"
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                        placeholder="https://yourbrand.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] placeholder-[#A0A89F]/50 focus:outline-none focus:border-[#C7F36B] transition-colors"
                      />
                    </div>
                  </div>

                  {/* 6. TARGET INDUSTRY */}
                  <div>
                    <label htmlFor="contact-industry" className="block text-xs font-semibold text-[#F5F5F0] mb-1.5">
                      Target Industry
                    </label>
                    <select
                      id="contact-industry"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B] transition-colors"
                    >
                      {industries.map((ind) => (
                        <option key={ind} value={ind} className="bg-[#111514] text-[#F5F5F0]">
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 7. PROJECT REQUIREMENTS & GOALS */}
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-semibold text-[#F5F5F0] mb-1.5">
                      Project Requirements &amp; Creative Goals <span className="text-[#C7F36B]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      placeholder="Describe your product, required video angles, preferred creator demographics, and any specific budget expectations or negotiation requests..."
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border text-xs sm:text-sm text-[#F5F5F0] placeholder-[#A0A89F]/50 focus:outline-none transition-colors resize-none ${
                        errors.message ? 'border-rose-500 focus:border-rose-500' : 'border-[#2A332B] focus:border-[#C7F36B]'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.message}
                      </p>
                    )}
                  </div>

                  {/* 8. SERVICES MULTI-SELECT */}
                  <div>
                    <label className="block text-xs font-semibold text-[#F5F5F0] mb-1.5">
                      Services Needed (Select all that apply)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableServices.map((srv) => {
                        const isSelected = formData.selectedServices.includes(srv);
                        return (
                          <button
                            key={srv}
                            type="button"
                            onClick={() => toggleService(srv)}
                            className={`p-2 text-xs text-left rounded-lg border transition-all flex items-center justify-between cursor-pointer min-h-[38px] ${
                              isSelected
                                ? 'bg-[#C7F36B]/15 border-[#C7F36B] text-[#F5F5F0] font-medium'
                                : 'bg-[#111514] border-[#2A332B] text-[#A0A89F] hover:text-[#F5F5F0]'
                            }`}
                          >
                            <span className="truncate pr-2">{srv}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#C7F36B] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div id="contact-form-panel">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] active:scale-[0.99] rounded-lg transition-all duration-200 shadow-lg shadow-[#C7F36B]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[44px]"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-[#090A0B] border-t-transparent rounded-full animate-spin" />
                          <span>Dispatching Inquiry to Database...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Start a Project</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-[#A0A89F] text-center mt-2.5">
                      Guaranteed client privacy. No spam. Tailored creative angles and quote within 6 hours.
                    </p>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
});

Contact.displayName = 'Contact';
