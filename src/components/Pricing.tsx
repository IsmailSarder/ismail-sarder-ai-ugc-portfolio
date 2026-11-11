import React from 'react';
import { Check, Zap, Sparkles, Flame, MessageSquare, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export interface PricingPackage {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  price: number;
  period: string;
  description: string;
  videosSummary: string;
  features: string[];
  ctaText: string;
  recommendedFor: string;
}

interface PricingProps {
  onSelectPackage: (packageName: string, isNegotiation?: boolean) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPackage }) => {
  const packages: PricingPackage[] = [
    {
      id: 'starter',
      name: 'STARTER',
      price: 39,
      period: 'per test batch',
      description: 'Ideal for e-commerce brands wanting to validate an initial concept or test a rapid pattern-interrupt hook.',
      videosSummary: '1 AI UGC Video (15–20s)',
      recommendedFor: 'Fast validation & early-stage product testing',
      features: [
        '1 AI UGC video (15–20 seconds)',
        '1 creative concept',
        'Script and AI voiceover',
        'Captions and music',
        '1 aspect ratio',
        '1 revision',
        '1-day delivery',
      ],
      ctaText: 'Choose Starter — $39',
    },
    {
      id: 'growth',
      name: 'GROWTH',
      badge: 'MOST POPULAR',
      isPopular: true,
      price: 89,
      period: 'per batch',
      description: 'The optimal direct-response sweet spot: test multiple visual hooks and B-roll cuts to maximize conversion rate.',
      videosSummary: '2 AI UGC Videos (20–30s each)',
      recommendedFor: 'Scaling DTC brands running Meta & TikTok ads',
      features: [
        '2 AI UGC videos (20–30 seconds each)',
        '2 hook options per video',
        'Script and AI voiceover',
        'Product B-roll',
        'Captions and CTA',
        '2 aspect ratios per video',
        '2 revisions per video',
        '1-day delivery',
      ],
      ctaText: 'Get Growth — $89',
    },
    {
      id: 'pro-scale',
      name: 'PRO / SCALE',
      price: 179,
      period: 'per campaign',
      description: 'High-volume multivariate campaign deployment with deep product demonstrations and 4 distinct psychological angles.',
      videosSummary: '4 AI UGC Videos (Multi-Angle)',
      recommendedFor: 'Brands spending $5k+/mo seeking creative scale',
      features: [
        '4 AI UGC videos',
        '4 creative angles',
        '2 hook options per video',
        'Product demonstration',
        'Script, voiceover and captions',
        '2 aspect ratios per video',
        '2 revisions per video',
        '1-day delivery',
      ],
      ctaText: 'Get Pro / Scale — $179',
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-[#090A0B] relative border-t border-[#2A332B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A0A89F] uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-[#C7F36B]" />
              <span>Transparent Rates · Rapid 1-Day Delivery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
              PERFORMANCE PRICING &amp; PACKAGES.
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A89F] mt-3 leading-relaxed">
              Transparent, fixed published rates designed to give your media buyers immediate testable assets. Every deliverable includes human-calibrated AI personas, native captions, and 24-hour turnaround.
            </p>
          </div>

          {/* Quick SLA Indicator */}
          <div className="hidden lg:flex items-center gap-4 p-3.5 rounded-xl bg-[#171C19] border border-[#2A332B] text-xs font-mono text-[#A0A89F]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C7F36B]" />
              <span>Guaranteed 24h Turnaround</span>
            </div>
            <span className="text-[#2A332B]">|</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C7F36B]" />
              <span>Commercial Ad Rights Included</span>
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-16">
          {packages.map((pkg) => {
            const isPopular = pkg.isPopular;

            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-[#171C19] border-2 border-[#C7F36B] shadow-2xl shadow-[#C7F36B]/10 lg:-translate-y-2'
                    : 'bg-[#171C19] border border-[#2A332B] hover:border-[#A0A89F]/40 shadow-lg'
                } p-6 sm:p-8`}
              >
                {/* Popular Highlight Label */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C7F36B] text-[#090A0B] text-[11px] font-mono font-extrabold tracking-wider uppercase rounded-full shadow-md">
                      <Flame className="w-3.5 h-3.5 fill-[#090A0B]" />
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div>
                  {/* Top Tier Info */}
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-[#A0A89F] mt-0.5">
                        {pkg.recommendedFor}
                      </p>
                    </div>
                  </div>

                  {/* Price Block */}
                  <div className="mb-6 pb-6 border-b border-[#2A332B]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-extrabold font-heading text-[#F5F5F0] tracking-tight tabular-nums">
                        ${pkg.price}
                      </span>
                      <span className="text-xs font-mono text-[#A0A89F]">
                        / {pkg.period}
                      </span>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#111514] border border-[#2A332B] text-xs font-medium text-[#C7F36B]">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{pkg.videosSummary}</span>
                    </div>

                    <p className="text-xs text-[#A0A89F] leading-relaxed mt-3">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#A0A89F] block font-semibold">
                      What&apos;s Included:
                    </span>
                    {pkg.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5 text-xs text-[#F5F5F0]">
                        <div className="p-0.5 rounded-full bg-[#C7F36B]/20 text-[#C7F36B] shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Action */}
                <div className="pt-4 border-t border-[#2A332B] mt-auto">
                  <button
                    type="button"
                    onClick={() => onSelectPackage(pkg.name, false)}
                    className={`w-full py-3 px-4 rounded-lg text-xs sm:text-sm font-bold font-heading uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                      isPopular
                        ? 'bg-[#C7F36B] text-[#090A0B] hover:bg-[#d6ff7d] shadow-lg shadow-[#C7F36B]/20 active:scale-[0.99]'
                        : 'bg-[#111514] text-[#F5F5F0] hover:bg-[#C7F36B] hover:text-[#090A0B] border border-[#2A332B] hover:border-[#C7F36B]'
                    }`}
                  >
                    <span>{pkg.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-2.5 text-[11px] font-mono text-[#A0A89F]">
                    <span>1-Day Delivery</span>
                    <span>·</span>
                    <span>Flexible Revisions</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* CUSTOM PRICE NEGOTIATION SECTION */}
        <div className="bg-[#171C19] border border-[#2A332B] rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Decorative Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7F36B]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#C7F36B] uppercase font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Custom Scope &amp; Volume Batches</span>
              </div>

              {/* Exact Required Heading */}
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
                Need a Custom Package?
              </h3>

              {/* Exact Required Messages */}
              <div className="space-y-3 text-xs sm:text-sm text-[#A0A89F] leading-relaxed">
                <p>
                  Every brand and project is different. The prices listed above are starting package prices. Final pricing can be negotiated based on your project requirements, video quantity, creative complexity, delivery timeline, and budget.
                </p>
                <p className="text-[#F5F5F0] font-medium">
                  Let&apos;s discuss your project and agree on a price that works for both of us.
                </p>
              </div>

              {/* Negotiation Attributes */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-[#A0A89F]">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#C7F36B]" />
                  Volume Ad Discounts
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#C7F36B]" />
                  Custom Actor Demographics
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#C7F36B]" />
                  Monthly Retainers
                </span>
              </div>
            </div>

            {/* Negotiation CTA Button */}
            <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
              <button
                type="button"
                onClick={() => onSelectPackage('Custom Package / Price Negotiation', true)}
                className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] active:scale-[0.99] rounded-lg transition-all duration-200 shadow-lg shadow-[#C7F36B]/20 flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
              >
                <span>Discuss Your Budget</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/8801648861141?text=Hi%20Ismail,%20I'd%20like%20to%20discuss%20a%20custom%20AI%20UGC%20video%20package%20and%20negotiate%20pricing%20for%20our%20brand."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-[#A0A89F] hover:text-[#F5F5F0] bg-[#111514] hover:bg-[#1a211d] border border-[#2A332B] rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#C7F36B]" />
                <span>Instant WhatsApp Discussion</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
