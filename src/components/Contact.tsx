import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Mail,
  MessageSquare,
  Linkedin,
  Send,
  Copy,
  Check,
  Clock,
  Globe,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  DollarSign,
  X,
  ShieldCheck,
} from 'lucide-react';
import { submitProjectInquiry } from '../lib/supabase.ts';

export interface ContactRef {
  setService: (serviceName: string) => void;
  setProjectInterest: (projectTitle: string) => void;
  setPackageInterest: (
    packageName: string,
    isNegotiation?: boolean,
    serviceName?: string
  ) => void;
}

interface ContactProps {
  initialService?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  brandName?: string;
  message?: string;
}

interface PackageOption {
  id: string;
  category: string;
  name: string;
  videos: string;
  defaultBudget: string;
  defaultCount: string;
  defaultTimeline: string;
  defaultService: string;
  isPopular?: boolean;
  isNegotiation?: boolean;
}

const PACKAGE_OPTIONS: PackageOption[] = [
  // AI UGC Video Ads
  {
    id: 'AI UGC Video Ads — Starter ($25)',
    category: 'AI UGC Video Ads',
    name: 'AI UGC Video Ads — Starter ($25)',
    videos: '1 Video (15–20s) · 1–2 Days',
    defaultBudget: '$25 (AI UGC Starter)',
    defaultCount: '1 Video',
    defaultTimeline: '1–2 Days (AI UGC Express)',
    defaultService: 'AI UGC Video Ads',
  },
  {
    id: 'AI UGC Video Ads — Growth ($55)',
    category: 'AI UGC Video Ads',
    name: 'AI UGC Video Ads — Growth ($55)',
    videos: '2 Videos (20–30s) · 2–3 Days',
    defaultBudget: '$55 (AI UGC Growth)',
    defaultCount: '2 Videos',
    defaultTimeline: '2–3 Days',
    defaultService: 'AI UGC Video Ads',
    isPopular: true,
  },
  {
    id: 'AI UGC Video Ads — Pro ($99)',
    category: 'AI UGC Video Ads',
    name: 'AI UGC Video Ads — Pro ($99)',
    videos: '4 Videos (4 Angles) · 3–4 Days',
    defaultBudget: '$99 (AI UGC Pro)',
    defaultCount: '4 Videos',
    defaultTimeline: '3–5 Days',
    defaultService: 'AI UGC Video Ads',
  },
  // AI CGI Product Ads
  {
    id: 'AI CGI Product Ads — Starter ($45)',
    category: 'AI CGI Product Ads',
    name: 'AI CGI Product Ads — Starter ($45)',
    videos: '1 CGI Ad (12–18s) · 2–3 Days',
    defaultBudget: '$45 (CGI Starter)',
    defaultCount: '1 Video',
    defaultTimeline: '2–3 Days',
    defaultService: 'CGI Product Commercials',
  },
  {
    id: 'AI CGI Product Ads — Growth ($95)',
    category: 'AI CGI Product Ads',
    name: 'AI CGI Product Ads — Growth ($95)',
    videos: '2 CGI Spots (15–25s) · 3–5 Days',
    defaultBudget: '$95 (CGI Growth)',
    defaultCount: '2 Videos',
    defaultTimeline: '3–5 Days',
    defaultService: 'CGI Product Commercials',
    isPopular: true,
  },
  {
    id: 'AI CGI Product Ads — Pro ($179)',
    category: 'AI CGI Product Ads',
    name: 'AI CGI Product Ads — Pro ($179)',
    videos: '4 CGI Variations · 5–7 Days',
    defaultBudget: '$179 (CGI Pro)',
    defaultCount: '4 Videos',
    defaultTimeline: '5–7 Days',
    defaultService: 'CGI Product Commercials',
  },
  // AI Commercial Videos
  {
    id: 'AI Commercial Videos — Starter ($79)',
    category: 'AI Commercial Videos',
    name: 'AI Commercial Videos — Starter ($79)',
    videos: '1 Commercial (25–35s) · 3–4 Days',
    defaultBudget: '$79 (Commercial Starter)',
    defaultCount: '1 Video',
    defaultTimeline: '3–5 Days',
    defaultService: 'AI Commercial Videos',
  },
  {
    id: 'AI Commercial Videos — Growth ($149)',
    category: 'AI Commercial Videos',
    name: 'AI Commercial Videos — Growth ($149)',
    videos: '2 Commercials (30–45s) · 4–6 Days',
    defaultBudget: '$149 (Commercial Growth)',
    defaultCount: '2 Videos',
    defaultTimeline: '4–6 Days',
    defaultService: 'AI Commercial Videos',
    isPopular: true,
  },
  {
    id: 'AI Commercial Videos — Premium ($299)',
    category: 'AI Commercial Videos',
    name: 'AI Commercial Videos — Premium ($299)',
    videos: '4 Campaign Commercials · 5–8 Days',
    defaultBudget: '$299 (Commercial Premium)',
    defaultCount: '4 Videos',
    defaultTimeline: '5–8 Days',
    defaultService: 'AI Commercial Videos',
  },
  // Custom Package
  {
    id: 'Custom Package / Price Negotiation',
    category: 'Custom Quote',
    name: 'Custom Package / Price Negotiation',
    videos: 'Tailored Quantity, Scope & Budget',
    defaultBudget: 'Custom / Open to Negotiation',
    defaultCount: 'Custom Batch',
    defaultTimeline: 'Flexible Timeline',
    defaultService: 'AI UGC Video Ads',
    isNegotiation: true,
  },
];

export const Contact = forwardRef<ContactRef, ContactProps>(({ initialService = '' }, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    brandName: '',
    websiteUrl: '',
    selectedPackage: 'AI UGC Video Ads — Growth ($55)',
    videoCount: '2 Videos',
    timeline: '2–3 Days',
    budget: '$55 (AI UGC Growth)',
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
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    setService: (serviceName: string) => {
      setFormData((prev) => ({
        ...prev,
        selectedServices: prev.selectedServices.includes(serviceName)
          ? prev.selectedServices
          : [...prev.selectedServices, serviceName],
      }));
      setHighlightNotice(`Selected Service: ${serviceName}`);
      setSubmissionError(null);
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    },

    setProjectInterest: (projectTitle: string) => {
      setFormData((prev) => ({
        ...prev,
        message: `Hi Ismail, I saw "${projectTitle}" in your portfolio and would like to explore a similar video ad concept for our brand.`,
      }));
      setHighlightNotice(`Project Reference: "${projectTitle}"`);
      setSubmissionError(null);
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    },

    setPackageInterest: (
      packageName: string,
      isNegotiation?: boolean,
      serviceName?: string
    ) => {
      const matched =
        PACKAGE_OPTIONS.find(
          (opt) => opt.name.toLowerCase() === packageName.toLowerCase()
        ) ||
        PACKAGE_OPTIONS.find((opt) =>
          isNegotiation ? opt.isNegotiation : opt.name.includes(packageName)
        );

      const isCustom = Boolean(
        isNegotiation ||
          matched?.isNegotiation ||
          packageName.toLowerCase().includes('custom') ||
          packageName.toLowerCase().includes('negotiat')
      );

      const resolvedService = serviceName || matched?.defaultService;

      setFormData((prev) => ({
        ...prev,
        selectedPackage: matched ? matched.name : packageName,
        budget: matched ? matched.defaultBudget : 'Custom / Open to Negotiation',
        videoCount: matched ? matched.defaultCount : 'Custom Batch',
        timeline: matched ? matched.defaultTimeline : 'Flexible Timeline',
        isNegotiation: isCustom,
        selectedServices: resolvedService
          ? prev.selectedServices.includes(resolvedService)
            ? prev.selectedServices
            : [resolvedService, ...prev.selectedServices]
          : prev.selectedServices,
        message:
          isCustom && !prev.message
            ? "Hi Ismail, I'd like to request a custom quote and discuss pricing tailored to our video quantity, creative complexity, and budget."
            : prev.message,
      }));

      setHighlightNotice(
        isCustom
          ? `Custom Quote Active${resolvedService ? ` (${resolvedService})` : ''} — Propose your target budget below`
          : `Selected: ${matched ? matched.name : packageName}`
      );
      setSubmissionError(null);
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    },
  }));

  const videoCountOptions = [
    '1 Video',
    '2 Videos',
    '4 Videos',
    '5–8 Videos (Multi-Angle Bundle)',
    '10+ Batch / Monthly Retainer',
    'Custom Batch',
  ];

  const timelineOptions = [
    '1–2 Days (AI UGC Express)',
    '2–3 Days',
    '3–5 Days',
    '4–6 Days',
    '5–8 Days',
    'Flexible Timeline',
  ];

  const budgetOptions = [
    '$25 (AI UGC Starter)',
    '$45 (CGI Starter)',
    '$55 (AI UGC Growth)',
    '$79 (Commercial Starter)',
    '$95 (CGI Growth)',
    '$99 (AI UGC Pro)',
    '$149 (Commercial Growth)',
    '$179 (CGI Pro)',
    '$299 (Commercial Premium)',
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
    'AI UGC Video Ads',
    'CGI Product Commercials',
    'AI Commercial Videos',
    'AI Spokesperson Videos',
    'AI Product Demonstration Videos',
    'Beauty & Skincare Ads',
    'Fashion & Gadget Ads',
    'Ad Hooks & Scriptwriting',
  ];

  const handlePackageSelect = (pkg: PackageOption) => {
    setFormData((prev) => ({
      ...prev,
      selectedPackage: pkg.name,
      budget: pkg.defaultBudget,
      videoCount: pkg.defaultCount,
      timeline: pkg.defaultTimeline,
      isNegotiation: Boolean(pkg.isNegotiation),
      selectedServices: pkg.isNegotiation
        ? prev.selectedServices
        : prev.selectedServices.includes(pkg.defaultService)
        ? prev.selectedServices
        : [pkg.defaultService, ...prev.selectedServices],
      message:
        pkg.isNegotiation && !prev.message
          ? "Hi Ismail, I'd like to discuss a custom package and negotiate pricing tailored to our video quantity, creative requirements, and budget."
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
      return {
        ...prev,
        selectedServices: exists
          ? prev.selectedServices.filter((s) => s !== srv)
          : [...prev.selectedServices, srv],
      };
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
      newErrors.message =
        'Please provide at least 10 characters describing your product, video goals, or target budget';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getEffectiveBudget = () => {
    if (
      formData.budget === 'Custom / Open to Negotiation' &&
      formData.customBudget.trim()
    ) {
      return `Custom: ${formData.customBudget.trim()} (Negotiable)`;
    }
    return formData.budget;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
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

      if (result.success) {
        setIsSubmitted(true);
        setSubmissionError(null);
      } else {
        setSubmissionError(
          result.errorMessage ||
            'Could not save your inquiry automatically. Please retry or send your brief directly via WhatsApp or Email below.'
        );
      }
    } catch (err) {
      setSubmissionError(
        err instanceof Error
          ? err.message
          : 'Network error while submitting your inquiry. Please retry or use WhatsApp/Email.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmissionError(null);
    setErrors({});
    setHighlightNotice(null);
    setFormData({
      name: '',
      email: '',
      brandName: '',
      websiteUrl: '',
      selectedPackage: 'AI UGC Video Ads — Growth ($55)',
      videoCount: '2 Videos',
      timeline: '2–3 Days',
      budget: '$55 (AI UGC Growth)',
      customBudget: '',
      isNegotiation: false,
      industry: 'Skincare & Beauty',
      selectedServices: ['AI UGC Video Ads'],
      message: '',
    });
  };

  const effectiveBudgetText = getEffectiveBudget();

  const whatsappBriefText = encodeURIComponent(
    `Hi Ismail, my name is ${formData.name || 'Brand Partner'} from ${
      formData.brandName || 'my brand'
    }. Services: ${formData.selectedServices.join(', ') || 'Video Ads'}. Package: "${
      formData.selectedPackage
    }" (${formData.videoCount}, timeline: ${formData.timeline}, budget: ${effectiveBudgetText}). ${
      formData.message ? `Brief: ${formData.message}` : "Let's discuss our project!"
    }`
  );

  const mailtoBriefHref = `mailto:hossenmeismail@gmail.com?subject=${encodeURIComponent(
    `Project Brief: ${formData.brandName || 'Brand'} — ${formData.selectedPackage}`
  )}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\nBrand: ${formData.brandName}\nWebsite: ${
      formData.websiteUrl || 'N/A'
    }\nPackage: ${formData.selectedPackage}\nServices: ${formData.selectedServices.join(
      ', '
    )}\nVideos: ${formData.videoCount}\nTimeline: ${formData.timeline}\nBudget: ${effectiveBudgetText}\n\nRequirements:\n${
      formData.message
    }`
  )}`;

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-28 bg-[#090A0B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-mono font-semibold tracking-wider text-[#C7F36B] uppercase block mb-2">
            Project Inquiries &amp; Custom Quotes
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F5F5F0] tracking-tight mb-3 sm:mb-4 [text-wrap:balance]">
            Ready to launch AI UGC, CGI or commercial video ads?
          </h2>
          <p className="text-xs sm:text-base text-[#A0A89F] leading-relaxed mb-5">
            Select your service package below or request a tailored custom quote, and receive a response directly within 6 hours.
          </p>
          <a
            href="#contact-form-panel"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact-name')?.focus();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all shadow-md shadow-[#C7F36B]/15 min-h-[42px]"
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
                <div className="flex items-center gap-3 min-w-0">
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
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-[#C7F36B]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
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
                      +8801648861141
                    </span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/8801648861141?text=${whatsappBriefText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-[11px] font-bold font-heading uppercase text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded transition-all min-h-[36px] flex items-center"
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
                    <span className="text-[10px] font-mono text-[#A0A89F] block">
                      PROFESSIONAL PROFILE
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#F5F5F0]">
                      in/ismail-sarder
                    </span>
                  </div>
                </div>

                <a
                  href="https://www.linkedin.com/in/ismail-sarder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-[11px] font-semibold text-[#F5F5F0] hover:text-[#C7F36B] bg-[#171C19] border border-[#2A332B] rounded transition-all min-h-[36px] flex items-center"
                >
                  Connect
                </a>
              </div>
            </div>

            {/* Price Flexibility Notice Card */}
            <div className="bg-[#171C19] border border-[#2A332B] rounded-xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F5F5F0]">
                <DollarSign className="w-4 h-4 text-[#C7F36B]" />
                <span>Introductory Rates &amp; Custom Quotes</span>
              </div>
              <p className="text-xs text-[#A0A89F] leading-relaxed">
                Launch pricing starts at $25 for AI UGC, $45 for CGI Product Ads, and $79 for AI Commercials (first 3–5 clients). Custom volume bundles and retainers are open to budget negotiation.
              </p>
              <div className="pt-2 border-t border-[#2A332B] flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#A0A89F]">
                <span className="flex items-center gap-1 text-[#C7F36B]">
                  <Check className="w-3.5 h-3.5" /> Multi-Video Discounts
                </span>
                <span>·</span>
                <span>Commercial Rights</span>
                <span>·</span>
                <span>Split-Test Hooks</span>
              </div>
            </div>

            {/* Global Timezone & Confidentiality Card (Clean User-Facing Info) */}
            <div className="bg-[#171C19] border border-[#2A332B] rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F5F5F0]">
                  <Globe className="w-4 h-4 text-[#C7F36B]" />
                  <span>International Client Collaboration</span>
                </div>
                <ShieldCheck className="w-4 h-4 text-[#C7F36B]" />
              </div>

              <p className="text-xs text-[#A0A89F] leading-relaxed">
                Direct collaboration with e-commerce brands and marketing agencies across the USA, UK, UAE, Canada, Australia, and Europe. All submitted brand briefs and product assets stay confidential.
              </p>

              <div className="pt-3 border-t border-[#2A332B] flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] text-[#A0A89F] font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C7F36B]" />
                  Avg Response: &lt; 6 Hours
                </span>
                <span className="text-[#C7F36B]">EST · GMT · GST · CET · AEDT</span>
              </div>
            </div>
          </div>

          {/* Right Column: Project Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#171C19] border border-[#2A332B] rounded-2xl p-5 sm:p-8 shadow-xl">
              {isSubmitted ? (
                <div className="py-8 sm:py-10 text-center space-y-5 animate-fade-in">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C7F36B]/20 text-[#C7F36B] border border-[#C7F36B]/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#F5F5F0]">
                      Inquiry Received, {formData.name || 'Partner'}!
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A0A89F] max-w-md mx-auto mt-2 leading-relaxed">
                      Thank you for sending your project brief for{' '}
                      <span className="text-[#F5F5F0] font-semibold">{formData.brandName}</span>.
                      I will review your creative scope and reply to{' '}
                      <span className="text-[#C7F36B]">{formData.email}</span> within 6 hours.
                    </p>
                  </div>

                  {/* Inquiry Summary Box */}
                  <div className="p-4 rounded-xl bg-[#111514] border border-[#2A332B] max-w-md mx-auto text-left text-xs space-y-2">
                    <div className="text-[10px] font-mono text-[#A0A89F] uppercase font-semibold">
                      Submitted Brief Summary:
                    </div>
                    <div className="text-[#F5F5F0]">
                      <span className="text-[#A0A89F]">Package:</span>{' '}
                      <span className="text-[#C7F36B] font-bold">{formData.selectedPackage}</span>
                    </div>
                    <div className="text-[#F5F5F0]">
                      <span className="text-[#A0A89F]">Services:</span>{' '}
                      {formData.selectedServices.join(', ') || 'General Video Ads'}
                    </div>
                    <div className="text-[#F5F5F0]">
                      <span className="text-[#A0A89F]">Quantity &amp; Timeline:</span>{' '}
                      {formData.videoCount} · {formData.timeline}
                    </div>
                    <div className="text-[#F5F5F0]">
                      <span className="text-[#A0A89F]">Target Budget:</span> {effectiveBudgetText}
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/8801648861141?text=${whatsappBriefText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-3 text-xs font-bold font-heading uppercase text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all inline-flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Continue on WhatsApp
                    </a>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-[#A0A89F] hover:text-[#F5F5F0] rounded-md border border-[#2A332B] hover:bg-[#111514] transition-all cursor-pointer min-h-[44px]"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Form Header */}
                  <div className="border-b border-[#2A332B] pb-4">
                    <h3 className="text-lg sm:text-xl font-bold font-heading text-[#F5F5F0]">
                      Project Brief &amp; Quote Request
                    </h3>
                    <p className="text-xs text-[#A0A89F] mt-1">
                      Select an introductory package or propose custom pricing based on your creative scope.
                    </p>
                  </div>

                  {/* Honest Error Alert if submission failed */}
                  {submissionError && (
                    <div
                      role="alert"
                      className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/35 text-xs space-y-3"
                    >
                      <div className="flex items-start gap-2.5 text-rose-300">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                        <div className="space-y-1">
                          <p className="font-bold text-rose-200">
                            Submission could not be saved automatically
                          </p>
                          <p className="text-rose-300/90 leading-relaxed">{submissionError}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pl-6">
                        <a
                          href={`https://wa.me/8801648861141?text=${whatsappBriefText}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-md bg-[#C7F36B] text-[#090A0B] font-bold font-heading uppercase text-[11px] inline-flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Send Brief via WhatsApp</span>
                        </a>
                        <a
                          href={mailtoBriefHref}
                          className="px-3.5 py-2 rounded-md bg-[#111514] border border-[#2A332B] text-[#F5F5F0] hover:text-[#C7F36B] font-semibold text-[11px] inline-flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Send via Email App</span>
                        </a>
                      </div>
                    </div>
                  )}

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
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <label className="block text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider font-mono">
                        1. Selected Package <span className="text-[#C7F36B]">*</span>
                      </label>
                      <span className="text-[11px] text-[#A0A89F]">
                        Intro launch rates · Negotiable
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PACKAGE_OPTIONS.map((pkg) => {
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
                              <span
                                className={`text-xs font-bold font-heading leading-snug ${
                                  isSelected ? 'text-[#C7F36B]' : 'text-[#F5F5F0]'
                                }`}
                              >
                                {pkg.name}
                              </span>
                              {pkg.isPopular && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#C7F36B] text-[#090A0B] shrink-0">
                                  POPULAR
                                </span>
                              )}
                              {pkg.isNegotiation && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#2A332B] text-[#C7F36B] shrink-0">
                                  CUSTOM
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#A0A89F]">{pkg.videos}</span>
                          </button>
                        );
                      })}
                    </div>

                    {formData.isNegotiation && (
                      <div className="mt-3 p-3 rounded-lg bg-[#111514] border border-[#C7F36B]/40 text-xs text-[#A0A89F] leading-relaxed flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-[#C7F36B] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#F5F5F0]">Custom Quote &amp; Negotiation:</strong>{' '}
                          Specify your desired video quantity, creative mix (UGC + CGI + Commercial), and target budget below.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. VIDEO QUANTITY & TIMELINE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-video-count"
                        className="block text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider font-mono mb-1.5"
                      >
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
                      <label
                        htmlFor="contact-timeline"
                        className="block text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider font-mono mb-1.5"
                      >
                        3. Delivery Timeline
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
                            className={`p-2 text-xs text-left rounded-lg border transition-all cursor-pointer min-h-[38px] flex items-center ${
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

                    {(formData.budget === 'Custom / Open to Negotiation' || formData.isNegotiation) && (
                      <div className="mt-2">
                        <label
                          htmlFor="custom-budget-input"
                          className="block text-[11px] text-[#A0A89F] mb-1"
                        >
                          Propose your budget or bundle target (Optional):
                        </label>
                        <input
                          id="custom-budget-input"
                          type="text"
                          value={formData.customBudget}
                          onChange={(e) => setFormData({ ...formData, customBudget: e.target.value })}
                          placeholder="e.g. $120 total for 3 UGC + 1 CGI spot"
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
                          errors.name
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-[#2A332B] focus:border-[#C7F36B]'
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
                          errors.email
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-[#2A332B] focus:border-[#C7F36B]'
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
                        placeholder="Lumera Skin"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border text-xs sm:text-sm text-[#F5F5F0] placeholder-[#A0A89F]/50 focus:outline-none transition-colors ${
                          errors.brandName
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-[#2A332B] focus:border-[#C7F36B]'
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
                      placeholder="Describe your product, target markets (e.g. USA/UK/UAE), preferred creative style, and any custom pricing notes..."
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border text-xs sm:text-sm text-[#F5F5F0] placeholder-[#A0A89F]/50 focus:outline-none transition-colors resize-none ${
                        errors.message
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-[#2A332B] focus:border-[#C7F36B]'
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
                            className={`p-2 text-xs text-left rounded-lg border transition-all flex items-center justify-between cursor-pointer min-h-[40px] ${
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
                      className="w-full py-3.5 px-6 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] active:scale-[0.99] rounded-lg transition-all duration-200 shadow-lg shadow-[#C7F36B]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[46px]"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-[#090A0B] border-t-transparent rounded-full animate-spin" />
                          <span>Submitting Project Brief...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Project Brief</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-[#A0A89F] text-center mt-2.5">
                      Or message directly on WhatsApp at{' '}
                      <a
                        href={`https://wa.me/8801648861141?text=${whatsappBriefText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#C7F36B] hover:underline"
                      >
                        +8801648861141
                      </a>
                      .
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
