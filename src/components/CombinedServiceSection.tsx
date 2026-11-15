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
      index: 'APPROACH 01',
      title: 'AI UGC Ads',
      categoryKey: 'AI UGC Ads' as const,
      subtitle: 'Relatable Creator & Spokesperson Storytelling',
      description:
        'Authentic-looking AI creator testimonials, product demos, and native vertical videos crafted to blend seamlessly into TikTok, Instagram Reels, and Meta feeds.',
      highlights: [
        'AI Avatars & Spokesperson Delivery',
        'Problem-Solution Hook Frameworks',
        'Organic Smartphone Pacing & Captions',
      ],
      ctaText: 'Explore AI UGC Ads',
      icon: UserCheck,
    },
    {
      index: 'APPROACH 02',
      title: 'AI Video Ads',
      categoryKey: 'AI Video Ads' as const,
      subtitle: 'Cinematic Product Commercials & Brand Storytelling',
      description:
        'High-impact visual commercials, macro product showcases, and fashion or beauty campaign films engineered to elevate brand authority and stop the scroll.',
      highlights: [
        'Cinematic AI Product Commercials',
        'Beauty, Fashion & Tech Visual Suites',
        'Studio-Grade Lighting & Sound Design',
      ],
      ctaText: 'Explore AI Video Ads',
      icon: Clapperboard,
    },
    {
      index: 'APPROACH 03',
      title: 'CGI Product Ads',
      categoryKey: 'CGI Product Ads' as const,
      subtitle: '3D Product Animation & High-Impact Commercials',
      description:
        'Photorealistic 3D product renders, exploded-view engineering reveals, and dynamic motion commercials built for luxury launches and standout hero ads.',
      highlights: [
        '3D Product Animation & Renders',
        'Dynamic Liquid & Particle Simulations',
        'High-Contrast Studio Commercial Reels',
      ],
      ctaText: 'Explore CGI Product Ads',
      icon: Box,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#090A0B] border-t border-[#2A332B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A0A89F] uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7F36B]" />
            <span>Creative Production Pillars</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight mb-3 [text-wrap:balance]">
            Three Creative Approaches. One Goal: Better Video Ads.
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-[#A0A89F] leading-relaxed">
            From authentic AI UGC content to cinematic AI video commercials and 3D CGI product ads, I create engaging video creatives that help brands communicate their value and connect with audiences.
          </p>
        </div>

        {/* Three Service Approach Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">
          {approaches.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
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
                  className="w-full py-3.5 px-5 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] active:scale-[0.99] rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#C7F36B]/15 min-h-[44px]"
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
