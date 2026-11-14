import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, UserCheck, Clapperboard, Check } from 'lucide-react';

interface CombinedServiceSectionProps {
  onExploreCategory: (category: 'AI UGC Ads' | 'AI Video Ads') => void;
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
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#090A0B] border-t border-[#2A332B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A0A89F] uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7F36B]" />
            <span>Dual Creative Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight mb-3 [text-wrap:balance]">
            Two Creative Approaches. One Goal: Better Video Ads.
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-[#A0A89F] leading-relaxed">
            From authentic AI UGC content to cinematic AI-powered commercials, I create engaging video ad creatives that help brands communicate their value and connect with their audiences.
          </p>
        </div>

        {/* Two Service Approach Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
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
