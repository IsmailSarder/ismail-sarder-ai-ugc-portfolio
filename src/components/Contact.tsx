import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Mail, MessageSquare, Linkedin, Send, Copy, Check, Clock, Globe, AlertCircle, Database, CheckCircle2 } from 'lucide-react';
import { submitProjectInquiry, isSupabaseConfigured } from '../lib/supabase.ts';

export interface ContactRef {
  setService: (serviceName: string) => void;
  setProjectInterest: (projectTitle: string) => void;
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
    industry: 'Skincare & Beauty',
    budget: '$1,500 - $3,000 (Multi-Hook Batch)',
    selectedServices: initialService ? [initialService] : ['AI UGC Creator Videos'],
    message: '',
  });

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
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },
    setProjectInterest: (projectTitle: string) => {
      setFormData((prev) => ({
        ...prev,
        message: `Hi Ismail, I saw the concept demonstration "${projectTitle}" on your portfolio and would like to explore a tailored AI UGC video ad batch for our brand.`,
      }));
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },
  }));

  const industries = [
    'Skincare & Beauty',
    'Fashion & Lifestyle',
    'Gadgets & Consumer Technology',
    'E-commerce Products',
    'SaaS & Digital Products',
  ];

  const budgetOptions = [
    'Under $1,500 (Starter Test Batch)',
    '$1,500 - $3,000 (Multi-Hook Batch)',
    '$3,000 - $6,000 (Full Campaign Suite)',
    '$6,000+ (Monthly Creative Retainer)',
  ];

  const availableServices = [
    'AI UGC Video Ads',
    'AI Spokesperson Videos',
    'Product Demonstration Videos',
    'E-commerce Video Creatives',
    'Ad Hooks & Scriptwriting',
    'Multiple Creative Variations',
    'Product B-roll & Lifestyle',
    'Social Media Ad Creatives',
  ];

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
      newErrors.message = 'Please provide at least 10 characters describing your goals';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await submitProjectInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        brandName: formData.brandName.trim(),
        websiteUrl: formData.websiteUrl.trim(),
        industry: formData.industry,
        budget: formData.budget,
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
    setFormData({
      name: '',
      email: '',
      brandName: '',
      websiteUrl: '',
      industry: 'Skincare & Beauty',
      budget: '$1,500 - $3,000 (Multi-Hook Batch)',
      selectedServices: ['AI UGC Creator Videos'],
      message: '',
    });
  };

  // Pre-filled WhatsApp link for direct instant communication
  const whatsappBriefText = encodeURIComponent(
    `Hi Ismail, my name is ${formData.name || 'Brand Owner'} from ${formData.brandName || 'my brand'}. I'm interested in ${formData.selectedServices.join(', ')} for our ${formData.industry} products. Budget: ${formData.budget}.`
  );

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-28 bg-[#090A0B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A0A89F] uppercase mb-2">
            <span>Project Inquiries & Collaborations</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F5F5F0] tracking-tight mb-3 sm:mb-4 [text-wrap:balance]">
            LET&apos;S MAKE YOUR NEXT AD IMPOSSIBLE TO IGNORE.
          </h2>
          <p className="text-xs sm:text-base text-[#A0A89F] leading-relaxed">
            Have a product ready to scale? Reach out via WhatsApp or submit your project details below to receive a custom creative angle breakdown and production quote within 6 hours.
          </p>
        </div>

        {/* 2-Column Split: Direct Channels + Project Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          
          {/* Left Column: Direct Channels & Operational Info */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            
            {/* Direct Contact Cards */}
            <div className="bg-[#171C19] border border-[#2A332B] rounded-xl p-5 sm:p-6 space-y-4 sm:space-y-5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#A0A89F] block font-semibold">
                Direct Communication Channels
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
                  onClick={handleCopyEmail}
                  className="p-2 text-[#A0A89F] hover:text-[#F5F5F0] rounded hover:bg-[#171C19] transition-colors cursor-pointer shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
                  title="Copy email to clipboard"
                  aria-label="Copy email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-[#C7F36B]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* WhatsApp */}
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
                  href="https://wa.me/8801648861141?text=Hi%20Ismail,%20I%20came%20across%20your%20portfolio%20and%20would%20love%20to%20discuss%20AI%20UGC%20video%20ads%20for%20our%20brand."
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

            {/* Supabase Integration & Global Capabilities Card */}
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
                  : 'Inquiries are safely captured with resilient offline storage. Connect your Supabase project URL and key anytime.'}
              </p>

              {onOpenSupabaseModal && (
                <button
                  type="button"
                  onClick={onOpenSupabaseModal}
                  className="text-xs font-semibold text-[#C7F36B] hover:underline cursor-pointer flex items-center gap-1 pt-1"
                >
                  <span>View Supabase Setup & Leads</span>
                  <span>→</span>
                </button>
              )}

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
                      I will review your request and reply to{' '}
                      <span className="text-[#C7F36B]">{formData.email}</span> within 6 hours with initial creative angles.
                    </p>
                  </div>

                  {supabaseSynced && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C7F36B]/10 border border-[#C7F36B]/30 text-[#C7F36B] text-xs font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Saved directly to Supabase project_inquiries</span>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-[#111514] border border-[#2A332B] max-w-md mx-auto text-left text-xs space-y-2">
                    <div className="text-[10px] font-mono text-[#A0A89F] uppercase">Brief Summary:</div>
                    <div className="text-[#F5F5F0]">
                      <span className="text-[#A0A89F]">Industry:</span> {formData.industry}
                    </div>
                    <div className="text-[#F5F5F0]">
                      <span className="text-[#A0A89F]">Budget:</span> {formData.budget}
                    </div>
                    <div className="text-[#F5F5F0]">
                      <span className="text-[#A0A89F]">Services:</span>{' '}
                      {formData.selectedServices.join(', ')}
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
                      onClick={handleReset}
                      className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-[#A0A89F] hover:text-[#F5F5F0] rounded-md border border-[#2A332B] hover:bg-[#111514] transition-all cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6">
                  
                  <div className="border-b border-[#2A332B] pb-3 sm:pb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-heading text-[#F5F5F0]">
                        Brand & Project Brief
                      </h3>
                      <p className="text-xs text-[#A0A89F] mt-1">
                        Fill out the key details below to help me prepare tailored creative concepts.
                      </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[#A0A89F]">
                      <span className={`w-2 h-2 rounded-full ${isSupabaseReady ? 'bg-[#C7F36B]' : 'bg-amber-400'}`} />
                      <span>{isSupabaseReady ? 'Supabase Live' : 'Local Capture'}</span>
                    </div>
                  </div>

                  {/* Name & Work Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
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
                      <label htmlFor="contact-email" className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
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

                  {/* Brand Name & Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-brand" className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                        Brand / Company Name <span className="text-[#C7F36B]">*</span>
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
                      <label htmlFor="contact-website" className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
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

                  {/* Target Industry Dropdown */}
                  <div>
                    <label htmlFor="contact-industry" className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
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

                  {/* Estimated Project Budget */}
                  <div>
                    <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                      Estimated Project Budget
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {budgetOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData({ ...formData, budget: opt })}
                          className={`px-3 py-2 text-xs text-left rounded-lg border transition-all cursor-pointer min-h-[38px] flex items-center ${
                            formData.budget === opt
                              ? 'bg-[#C7F36B]/15 border-[#C7F36B] text-[#F5F5F0] font-semibold'
                              : 'bg-[#111514] border-[#2A332B] text-[#A0A89F] hover:text-[#F5F5F0]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Services Multi-Select */}
                  <div>
                    <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
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

                  {/* Message / Brief */}
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                      Tell me about your product & goals <span className="text-[#C7F36B]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      placeholder="Briefly describe what your product does, current ad challenges, and target audience..."
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

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] active:scale-[0.99] rounded-lg transition-all duration-200 shadow-lg shadow-[#C7F36B]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[44px]"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-[#090A0B] border-t-transparent rounded-full animate-spin" />
                          <span>Dispatching to Database...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Project Inquiry</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-[#A0A89F] text-center mt-2.5">
                      Guaranteed client privacy. No spam. You will receive custom creative angles within 6 hours.
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
