import React, { useState } from 'react';
import {
  Check,
  Zap,
  Sparkles,
  Flame,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Clock,
  Video,
  Box,
  Film,
  Tag,
} from 'lucide-react';

export interface PricingTier {
  id: string;
  name: string;
  fullLabel: string;
  price: number;
  unitLabel: string;
  badge?: string;
  isPopular?: boolean;
  videosSummary: string;
  durationSummary: string;
  revisionsSummary: string;
  deliverySummary: string;
  recommendedFor: string;
  description: string;
  features: string[];
  ctaText: string;
}

export interface PricingCategory {
  id: 'ai-ugc' | 'ai-cgi' | 'ai-commercial';
  tabLabel: string;
  serviceName: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tiers: PricingTier[];
}

export const PRICING_CATEGORIES: PricingCategory[] = [
  {
    id: 'ai-ugc',
    tabLabel: 'AI UGC Video Ads',
    serviceName: 'AI UGC Video Ads',
    subtitle: 'Creator-style vertical ads, product testimonials & paid social hooks',
    icon: Video,
    tiers: [
      {
        id: 'ugc-starter',
        name: 'Starter',
        fullLabel: 'AI UGC Video Ads — Starter ($25)',
        price: 25,
        unitLabel: 'introductory launch rate',
        videosSummary: '1 AI UGC Video',
        durationSummary: '15–20 sec',
        revisionsSummary: '1 revision',
        deliverySummary: '1–2 days',
        recommendedFor: 'Single-product creative test & hook validation',
        description:
          'Focused direct-response video ad built to test a fresh product hook or audience angle on TikTok, Reels, or Meta.',
        features: [
          '1 AI UGC video (15–20 seconds)',
          '1 direct-response script & AI voiceover',
          'Dynamic burned-in captions + music',
          '1 aspect ratio (9:16, 4:5, or 1:1)',
          '1 revision round included',
          '1–2 days realistic delivery',
        ],
        ctaText: 'Book Starter — $25',
      },
      {
        id: 'ugc-growth',
        name: 'Growth',
        fullLabel: 'AI UGC Video Ads — Growth ($55)',
        price: 55,
        unitLabel: 'introductory launch rate',
        badge: 'MOST POPULAR',
        isPopular: true,
        videosSummary: '2 AI UGC Videos',
        durationSummary: '20–30 sec each',
        revisionsSummary: '2 revisions / video',
        deliverySummary: '2–3 days',
        recommendedFor: 'E-commerce brands split-testing Meta & TikTok hooks',
        description:
          'Balanced creative testing bundle featuring alternative opening hooks and product B-roll to find winning angles faster.',
        features: [
          '2 AI UGC videos (20–30 seconds each)',
          '2 opening hook options per video',
          'Script, AI voiceover & product B-roll',
          'Captions + clean uncaptioned cut',
          '2 aspect ratios per video',
          '2 revisions per video · 2–3 days delivery',
        ],
        ctaText: 'Book Growth — $55',
      },
      {
        id: 'ugc-pro',
        name: 'Pro',
        fullLabel: 'AI UGC Video Ads — Pro ($99)',
        price: 99,
        unitLabel: 'introductory launch rate',
        videosSummary: '4 AI UGC Videos',
        durationSummary: '20–35 sec each',
        revisionsSummary: '2 revisions / video',
        deliverySummary: '3–4 days',
        recommendedFor: 'Multi-angle paid social scaling across platforms',
        description:
          'Complete 4-angle ad testing batch combining spokesperson demos, problem-solution hooks, and lifestyle framing.',
        features: [
          '4 AI UGC videos (20–35 seconds each)',
          '4 distinct creative angles + 2 hooks each',
          'Product demonstration & B-roll sequences',
          'Script, voiceover, music & captions',
          'Up to 3 aspect ratios per video',
          '2 revisions per video · 3–4 days delivery',
        ],
        ctaText: 'Book Pro — $99',
      },
    ],
  },
  {
    id: 'ai-cgi',
    tabLabel: 'AI CGI Product Ads',
    serviceName: 'CGI Product Commercials',
    subtitle: '3D product staging, studio lighting reveals & scroll-stopping motion',
    icon: Box,
    tiers: [
      {
        id: 'cgi-starter',
        name: 'Starter',
        fullLabel: 'AI CGI Product Ads — Starter ($45)',
        price: 45,
        unitLabel: 'introductory launch rate',
        videosSummary: '1 CGI Product Ad',
        durationSummary: '12–18 sec',
        revisionsSummary: '1 revision',
        deliverySummary: '2–3 days',
        recommendedFor: 'Hero product reveal for Reels, TikTok or PDP banners',
        description:
          'Clean 3D studio-lit product showcase highlighting texture, packaging silhouette, and crisp kinetic movement.',
        features: [
          '1 AI CGI product ad (12–18 seconds)',
          'Sculpted studio lighting & product reveal',
          'Sound effects & background music mix',
          '1 aspect ratio (9:16, 4:5, or 16:9)',
          '1 revision round included',
          '2–3 days realistic delivery',
        ],
        ctaText: 'Book CGI Starter — $45',
      },
      {
        id: 'cgi-growth',
        name: 'Growth',
        fullLabel: 'AI CGI Product Ads — Growth ($95)',
        price: 95,
        unitLabel: 'introductory launch rate',
        badge: 'MOST POPULAR',
        isPopular: true,
        videosSummary: '2 CGI Product Spots',
        durationSummary: '15–25 sec each',
        revisionsSummary: '2 revisions / video',
        deliverySummary: '3–5 days',
        recommendedFor: 'DTC launches in beauty, fragrance, footwear & audio',
        description:
          'Multi-environment CGI campaign pairing dramatic atmospheric visuals with macro product feature close-ups.',
        features: [
          '2 AI CGI product commercials (15–25s)',
          '2 creative visual concepts / environments',
          'Camera choreography & macro detail shots',
          'Custom SFX, music & branded end-card',
          '2 aspect ratios (e.g. 16:9 + 9:16)',
          '2 revisions per video · 3–5 days delivery',
        ],
        ctaText: 'Book CGI Growth — $95',
      },
      {
        id: 'cgi-pro',
        name: 'Pro',
        fullLabel: 'AI CGI Product Ads — Pro ($179)',
        price: 179,
        unitLabel: 'introductory launch rate',
        videosSummary: '4 CGI Product Variations',
        durationSummary: '15–30 sec each',
        revisionsSummary: '2 revisions / video',
        deliverySummary: '5–7 days',
        recommendedFor: 'Full-funnel launch collections & multi-SKU hero assets',
        description:
          'Comprehensive CGI visual campaign spanning hero widescreen cinema and vertical paid social cutdowns.',
        features: [
          '4 AI CGI product commercials / cutdowns',
          'Multi-scene 3D environmental storytelling',
          'Bespoke sound design, titles & packshot',
          '9:16, 4:5 & 16:9 multi-platform delivery',
          'Full commercial ad usage rights',
          '2 revisions per video · 5–7 days delivery',
        ],
        ctaText: 'Book CGI Pro — $179',
      },
    ],
  },
  {
    id: 'ai-commercial',
    tabLabel: 'AI Commercial Videos',
    serviceName: 'AI Commercial Videos',
    subtitle: 'Full-story brand commercials blending AI talent, B-roll & CGI polish',
    icon: Film,
    tiers: [
      {
        id: 'comm-starter',
        name: 'Starter',
        fullLabel: 'AI Commercial Videos — Starter ($79)',
        price: 79,
        unitLabel: 'introductory launch rate',
        videosSummary: '1 Brand Commercial',
        durationSummary: '25–35 sec',
        revisionsSummary: '2 revisions',
        deliverySummary: '3–4 days',
        recommendedFor: 'Homepage hero explainers & YouTube / Meta launch ads',
        description:
          'Polished multi-scene commercial uniting brand narrative, AI presenter or voiceover, and crisp product visuals.',
        features: [
          '1 AI brand commercial (25–35 seconds)',
          'Creative concept & full storyboard script',
          'Multi-scene visual pacing + voiceover',
          'Custom SFX, music & clean typography',
          '16:9 or 9:16 master export',
          '2 revisions · 3–4 days realistic delivery',
        ],
        ctaText: 'Book Commercial — $79',
      },
      {
        id: 'comm-growth',
        name: 'Growth',
        fullLabel: 'AI Commercial Videos — Growth ($149)',
        price: 149,
        unitLabel: 'introductory launch rate',
        badge: 'MOST POPULAR',
        isPopular: true,
        videosSummary: '2 Brand Commercials',
        durationSummary: '30–45 sec each',
        revisionsSummary: '2 revisions / video',
        deliverySummary: '4–6 days',
        recommendedFor: 'Brands launching hero web films + social retargeting',
        description:
          'Dual commercial suite combining widescreen brand storytelling with direct-response social variations.',
        features: [
          '2 full AI commercial videos (30–45s each)',
          '2 distinct campaign narratives or angles',
          'AI presenter + CGI / lifestyle B-roll blend',
          'Multi-ratio exports (16:9, 9:16 & 4:5)',
          'Dynamic captions + clean textless master',
          '2 revisions per video · 4–6 days delivery',
        ],
        ctaText: 'Book Growth — $149',
      },
      {
        id: 'comm-premium',
        name: 'Premium',
        fullLabel: 'AI Commercial Videos — Premium ($299)',
        price: 299,
        unitLabel: 'introductory launch rate',
        videosSummary: '4 Campaign Commercials',
        durationSummary: '30–60 sec hero + cuts',
        revisionsSummary: '3 revisions',
        deliverySummary: '5–8 days',
        recommendedFor: 'Flagship international launches across all ad channels',
        description:
          'End-to-end commercial production package built to power product pages, YouTube pre-roll, and paid social funnels.',
        features: [
          '4 campaign commercials (hero + 3 social cuts)',
          'Full scriptwriting, concepting & voice casting',
          'Integrated AI spokesperson + 3D CGI sequences',
          'Delivered in 16:9, 9:16, 4:5 & 1:1 formats',
          'Priority turnaround & full commercial rights',
          '3 revision rounds · 5–8 days delivery',
        ],
        ctaText: 'Book Premium — $299',
      },
    ],
  },
];

interface PricingProps {
  onSelectPackage: (
    packageName: string,
    isNegotiation?: boolean,
    serviceName?: string
  ) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPackage }) => {
  const [activeCategoryId, setActiveCategoryId] =
    useState<PricingCategory['id']>('ai-ugc');

  const activeCategory =
    PRICING_CATEGORIES.find((c) => c.id === activeCategoryId) || PRICING_CATEGORIES[0];

  return (
    <section
      id="pricing"
      className="py-20 lg:py-28 bg-[#090A0B] relative border-t border-[#2A332B]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7F36B]/15 border border-[#C7F36B]/40 text-[11px] font-mono font-bold text-[#C7F36B] uppercase tracking-wider mb-3">
              <Tag className="w-3.5 h-3.5" />
              <span>Introductory Launch Pricing · First 3–5 Clients</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F5F5F0] tracking-tight [text-wrap:balance]">
              TRANSPARENT LAUNCH PACKAGES.
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A89F] mt-3 leading-relaxed">
              Introductory launch rates reserved for the first 3–5 new client partnerships across AI UGC Video Ads, AI CGI Product Ads, and AI Commercial Videos. Clear scope, realistic turnaround windows, and commercial ad rights included.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-xl bg-[#171C19] border border-[#2A332B] text-xs font-mono text-[#A0A89F] shrink-0">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C7F36B]" />
              <span>Realistic 1–8 Day Delivery</span>
            </div>
            <span className="text-[#2A332B] hidden sm:inline">|</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C7F36B]" />
              <span>Commercial Rights Included</span>
            </div>
          </div>
        </div>

        {/* Category Tabs Bar */}
        <div className="mb-10 sm:mb-12">
          <div
            role="tablist"
            aria-label="Service pricing categories"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 rounded-2xl bg-[#111514] border border-[#2A332B]"
          >
            {PRICING_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = category.id === activeCategory.id;
              const minPrice = Math.min(...category.tiers.map((t) => t.price));

              return (
                <button
                  key={category.id}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls={`pricing-panel-${category.id}`}
                  id={`pricing-tab-${category.id}`}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`p-3.5 sm:p-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer min-h-[60px] ${
                    isActive
                      ? 'bg-[#C7F36B] text-[#090A0B] shadow-lg shadow-[#C7F36B]/15'
                      : 'bg-[#171C19]/70 text-[#F5F5F0] hover:bg-[#171C19] border border-transparent hover:border-[#2A332B]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isActive
                          ? 'bg-[#090A0B]/15 text-[#090A0B]'
                          : 'bg-[#111514] text-[#C7F36B] border border-[#2A332B]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-extrabold font-heading block whitespace-nowrap truncate">
                        {category.tabLabel}
                      </span>
                      <span
                        className={`text-[11px] font-mono block truncate ${
                          isActive ? 'text-[#090A0B]/80 font-semibold' : 'text-[#A0A89F]'
                        }`}
                      >
                        From ${minPrice}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-xs sm:text-sm text-[#A0A89F] mt-3 font-mono text-center sm:text-left">
            Showing <strong className="text-[#F5F5F0]">{activeCategory.tabLabel}</strong> —{' '}
            {activeCategory.subtitle}
          </p>
        </div>

        {/* Active Category 3-Tier Cards Grid */}
        <div
          role="tabpanel"
          id={`pricing-panel-${activeCategory.id}`}
          aria-labelledby={`pricing-tab-${activeCategory.id}`}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-16"
        >
          {activeCategory.tiers.map((tier) => {
            const isPopular = tier.isPopular;

            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-[#171C19] border-2 border-[#C7F36B] shadow-2xl shadow-[#C7F36B]/10 lg:-translate-y-1.5'
                    : 'bg-[#171C19] border border-[#2A332B] hover:border-[#A0A89F]/40 shadow-lg'
                } p-6 sm:p-8`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C7F36B] text-[#090A0B] text-[11px] font-mono font-extrabold tracking-wider uppercase rounded-full shadow-md whitespace-nowrap">
                      <Flame className="w-3.5 h-3.5 fill-[#090A0B]" />
                      {tier.badge || 'MOST POPULAR'}
                    </span>
                  </div>
                )}

                <div>
                  {/* Tier Heading */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#C7F36B] block mb-0.5">
                        {activeCategory.tabLabel}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
                        {tier.name}
                      </h3>
                      <p className="text-xs text-[#A0A89F] mt-0.5">{tier.recommendedFor}</p>
                    </div>
                  </div>

                  {/* Price & Specs Strip */}
                  <div className="mb-6 pb-6 border-b border-[#2A332B]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-extrabold font-heading text-[#F5F5F0] tracking-tight tabular-nums">
                        ${tier.price}
                      </span>
                      <span className="text-[11px] font-mono text-[#C7F36B]">
                        / {tier.unitLabel}
                      </span>
                    </div>

                    {/* Key Specs Grid: Quantity, Duration, Revisions, Delivery */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-2 rounded-lg bg-[#111514] border border-[#2A332B]">
                        <span className="text-[#A0A89F] block text-[10px]">VIDEOS</span>
                        <span className="text-[#F5F5F0] font-semibold">{tier.videosSummary}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#111514] border border-[#2A332B]">
                        <span className="text-[#A0A89F] block text-[10px]">DURATION</span>
                        <span className="text-[#C7F36B] font-semibold">{tier.durationSummary}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#111514] border border-[#2A332B]">
                        <span className="text-[#A0A89F] block text-[10px]">REVISIONS</span>
                        <span className="text-[#F5F5F0] font-semibold">{tier.revisionsSummary}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#111514] border border-[#2A332B]">
                        <span className="text-[#A0A89F] block text-[10px]">DELIVERY</span>
                        <span className="text-[#F5F5F0] font-semibold">{tier.deliverySummary}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#A0A89F] leading-relaxed mt-4">
                      {tier.description}
                    </p>
                  </div>

                  {/* Feature Deliverables */}
                  <div className="space-y-2.5 mb-8">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#A0A89F] block font-semibold">
                      Deliverables Included:
                    </span>
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5 text-xs text-[#F5F5F0]">
                        <div className="p-0.5 rounded-full bg-[#C7F36B]/20 text-[#C7F36B] shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tier CTA Action */}
                <div className="pt-4 border-t border-[#2A332B] mt-auto">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectPackage(tier.fullLabel, false, activeCategory.serviceName)
                    }
                    className={`w-full py-3.5 px-4 rounded-lg text-xs sm:text-sm font-bold font-heading uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer min-h-[46px] ${
                      isPopular
                        ? 'bg-[#C7F36B] text-[#090A0B] hover:bg-[#d6ff7d] shadow-lg shadow-[#C7F36B]/20 active:scale-[0.99]'
                        : 'bg-[#111514] text-[#F5F5F0] hover:bg-[#C7F36B] hover:text-[#090A0B] border border-[#2A332B] hover:border-[#C7F36B]'
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-2.5 text-[11px] font-mono text-[#A0A89F]">
                    <span>Intro Launch Rate</span>
                    <span>·</span>
                    <span>First 3–5 Clients</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Quotes & Price Negotiation Section */}
        <div className="bg-[#171C19] border border-[#2A332B] rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7F36B]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#C7F36B] uppercase font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Custom Quotes &amp; Price Negotiation</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
                Need a Custom Package?
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-[#A0A89F] leading-relaxed">
                <p>
                  Every brand and project is different. The introductory prices listed above cover our starting packages for the first 3–5 clients. Final quotes can be tailored or negotiated based on your video quantity, creative complexity, delivery timeline, and campaign budget.
                </p>
                <p className="text-[#F5F5F0] font-medium">
                  Share your scope and target budget — we can agree on a custom bundle that works for your brand.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-[#A0A89F]">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#C7F36B]" />
                  Multi-Video Bundle Discounts
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#C7F36B]" />
                  Mixed AI UGC + CGI Packs
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#C7F36B]" />
                  Monthly Creative Retainers
                </span>
              </div>
            </div>

            <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
              <button
                type="button"
                onClick={() =>
                  onSelectPackage(
                    'Custom Package / Price Negotiation',
                    true,
                    activeCategory.serviceName
                  )
                }
                className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] active:scale-[0.99] rounded-lg transition-all duration-200 shadow-lg shadow-[#C7F36B]/20 flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/8801648861141?text=Hi%20Ismail,%20I'd%20like%20to%20request%20a%20custom%20video%20ad%20quote%20and%20discuss%20pricing%20for%20our%20brand."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-[#A0A89F] hover:text-[#F5F5F0] bg-[#111514] hover:bg-[#1a211d] border border-[#2A332B] rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[42px]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#C7F36B]" />
                <span>Discuss on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
