import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, UserCheck, Clapperboard, Box, Check } from 'lucide-react';

interface CombinedServiceSectionProps {
  onExploreCategory: (category: 'AI UGC Ads' | 'AI Video Ads' | 'CGI Product Ads') => void;
}

export const CombinedServiceSection: React.FC<CombinedServiceSectionProps> = ({
  onExploreCategory,
}) => {
  const approaches = [
    {
      index: 'PILLAR 01',
      title: 'AI UGC Video Ads',
      categoryKey: 'AI UGC Ads' as const,
      subtitle: 'Starting from $25 · 1–4 Day Delivery',
      description:
        'Authentic AI-powered creator testimonials, direct-to-camera spokespersons, and product demos crafted for TikTok, Instagram Reels, and Meta Feeds.',
      highlights: [
        'AI Spokesperson & Testimonial Videos',
        'Opening Hook Split-Test Variations',
        'Dynamic Captions & Clean Export',
      ],
      ctaText: 'Explore AI UGC Work',
      icon: UserCheck,
    },
    {
      index: 'PILLAR 02',
      title: 'AI CGI Product Ads',
      categoryKey: 'CGI Product Ads' as const,
      subtitle: 'Starting from $45 · 2–7 Day Delivery',
      description:
        'Photorealistic 3D CGI product commercials with sculpted studio lighting, macro texture reveals, and standout kinetic camera movement.',
      highlights: [
        '3D Product Staging & Lighting Reveals',
        '16:9 Launch & 9:16 Social Cutdowns',
        'Beauty, Fragrance, Footwear & Audio',
      ],
      ctaText: 'Explore CGI Commercials',
      icon: Box,
    },
    {
      index: 'PILLAR 03',
      title: 'AI Commercial Videos',
      categoryKey: 'AI Video Ads' as const,
      subtitle: 'Starting from $79 · 3–8 Day Delivery',
      description:
        'Multi-scene brand storytelling commercials uniting AI presenters, lifestyle B-roll, and CGI polish for product launches and homepage hero films.',
      highlights: [
        'Full Concepting & Storyboard Script',
        'Multi-Scene Brand Narrative Pacing',
        'Delivered in 16:9, 9:16, 4:5 & 1:1',
      ],
      ctaText: 'Explore Video Ad Work',
      icon: Clapperboard,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#090A0B] border-t border-[#2A332B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <span className="text-xs font-mono font-semibold tracking-wider text-[#C7F36B] uppercase block mb-2">
            Three Core Production Categories
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight mb-3 [text-wrap:balance]">
            AI UGC, CGI Product Ads &amp; Brand Commercials Built for E-Commerce.
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-[#A0A89F] leading-relaxed">
            Whether you are testing Meta and TikTok hooks in the USA, UK, UAE, Canada, Australia, or Europe, choose the production tier aligned with your campaign goals.
          </p>
        </div>

        {/* Three Pillar Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">
          {approaches.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="bg-[#171C19] border border-[#2A332B] hover:border-[#C7F36B]/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-bold text-[#C7F36B] tracking-wider">
                      {item.index}
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#111514] border border-[#2A332B] text-[#C7F36B] group-hover:bg-[#C7F36B] group-hover:text-[#090A0B] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-[#F5F5F0] group-hover:text-[#C7F36B] transition-colors mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono text-[#C7F36B]/90 mb-4">
                    {item.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[#A0A89F] leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-[#2A332B] mb-7">
                    {item.highlights.map((hl) => (
                      <div key={hl} className="flex items-center gap-2.5 text-xs text-[#F5F5F0]">
                        <Check className="w-3.5 h-3.5 text-[#C7F36B] shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onExploreCategory(item.categoryKey)}
                  className="w-full py-3.5 px-5 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] active:scale-[0.99] rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#C7F36B]/15 min-h-[46px]"
                >
                  <span>{item.ctaText}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
