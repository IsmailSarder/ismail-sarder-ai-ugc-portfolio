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
      title: 'AI UGC Video Ads & Spokespersons',
      categoryKey: 'AI UGC Ads' as const,
      subtitle: 'AI UGC Video Ads · AI Spokesperson Videos',
      description:
        'Authentic AI-powered creator ads and direct-to-camera spokesperson videos tailored for TikTok, Instagram Reels, and Meta paid acquisition.',
      highlights: [
        'AI UGC Video Ads',
        'AI Spokesperson Videos',
        'Beauty, Skincare & Fashion UGC',
      ],
      ctaText: 'Explore AI UGC Work',
      icon: UserCheck,
    },
    {
      index: 'PILLAR 02',
      title: 'Product Demos & Niche Ads',
      categoryKey: 'AI Video Ads' as const,
      subtitle: 'AI Product Demonstrations · Beauty, Fashion & Tech',
      description:
        'Clear product demonstration videos and vertical-specific ad creatives highlighting real product texture, fit, ergonomics, and everyday benefits.',
      highlights: [
        'AI Product Demonstration Videos',
        'Beauty & Skincare Ads',
        'Fashion & Gadget Ads',
      ],
      ctaText: 'Explore Product Demos',
      icon: Clapperboard,
    },
    {
      index: 'PILLAR 03',
      title: 'CGI Product Commercials',
      categoryKey: 'CGI Product Ads' as const,
      subtitle: '3D Product Visuals · High-Impact Launch Spots',
      description:
        'Cinematic CGI product commercials featuring sculpted studio lighting, dynamic camera choreography, and standout visual framing for e-commerce launches.',
      highlights: [
        'CGI Product Commercials',
        '16:9 Campaign & 9:16 Social Cuts',
        'Luxury Fragrance, Footwear & Audio',
      ],
      ctaText: 'Explore CGI Commercials',
      icon: Box,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#090A0B] border-t border-[#2A332B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <span className="text-xs font-mono font-semibold tracking-wider text-[#C7F36B] uppercase block mb-2">
            Core Creative Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight mb-3 [text-wrap:balance]">
            Six Specialized Video Ad Services Built for E-Commerce Brands.
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-[#A0A89F] leading-relaxed">
            Whether you are scaling Meta and TikTok campaigns in the US, UK, UAE, Canada, or Europe, each creative format is structured to communicate product value clearly and convert cold traffic.
          </p>
        </div>

        {/* Three Pillar Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">
          {approaches.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
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
