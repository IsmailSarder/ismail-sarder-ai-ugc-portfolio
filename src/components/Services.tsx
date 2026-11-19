import React from 'react';
import {
  ArrowUpRight,
  Video,
  UserCheck,
  Layers,
  Sparkles,
  Box,
  Smartphone,
  Check,
} from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const specializedServices = [
    {
      index: '01',
      title: 'AI UGC Video Ads',
      description:
        'Native creator-style vertical video ads crafted with authentic speech pacing, natural product interaction, and high-retention visual hooks built for TikTok, Instagram Reels, and Meta Feeds.',
      deliverables: [
        '9:16 Vertical Ad Master',
        'Alternative Hook Variations',
        'Dynamic Burned-In Captions',
        'Clean Uncaptioned Export',
      ],
      platforms: 'TikTok · Instagram Reels · Meta Ads',
      icon: Video,
    },
    {
      index: '02',
      title: 'AI Spokesperson Videos',
      description:
        'Articulate AI brand spokespersons and founder-style explainers customized with regional accents and natural delivery tailored for US, UK, UAE, Canadian, and European audiences.',
      deliverables: [
        'Direct-to-Camera Presenter',
        'Tailored Persona & Wardrobe',
        'Natural Voice & Lip-Sync',
        'Script & Hook Copywriting',
      ],
      platforms: 'Meta Ads · YouTube · Landing Pages',
      icon: UserCheck,
    },
    {
      index: '03',
      title: 'AI Product Demonstration Videos',
      description:
        'Clear visual demonstrations highlighting product mechanics, ingredient textures, before-and-after results, and practical everyday usage to build buyer confidence.',
      deliverables: [
        'Feature & Benefit Walkthrough',
        'Texture & Detail Visuals',
        'Callout Text Overlays',
        'Multi-Ratio Social Formatting',
      ],
      platforms: 'Meta Ads · TikTok Shop · Product Pages',
      icon: Layers,
    },
    {
      index: '04',
      title: 'CGI Product Commercials',
      description:
        'Photorealistic 3D CGI product advertisements crafted with moody studio lighting, dynamic camera choreography, and luxury commercial pacing for brand launches.',
      deliverables: [
        '16:9 Cinema Commercial',
        '9:16 Social Reel Cutdown',
        'Sculpted Studio Lighting',
        'Custom SFX & Music Mix',
      ],
      platforms: 'Launch Campaigns · YouTube · Hero Web',
      icon: Box,
    },
    {
      index: '05',
      title: 'Beauty & Skincare Ads',
      description:
        'Routine-driven testimonials, hydrating texture showcases, and glow-focused visual storytelling engineered for skincare, fragrance, and personal care brands.',
      deliverables: [
        'Routine & Regimen Framing',
        'Macro Serum / Cream Visuals',
        'Ingredient Benefit Hooks',
        'Reels & TikTok Ready Cuts',
      ],
      platforms: 'Instagram · TikTok · Meta Paid Social',
      icon: Sparkles,
    },
    {
      index: '06',
      title: 'Fashion & Gadget Ads',
      description:
        'Apparel fit checks, capsule styling transitions, consumer electronics unboxings, and ergonomic comfort demonstrations designed for modern DTC shoppers.',
      deliverables: [
        'Apparel Drape & Fit Reels',
        'Tech Comfort & Sound Demos',
        '9:16 & 4:5 Feed Exports',
        'Commercial Ad Usage Rights',
      ],
      platforms: 'Meta Ads · YouTube Shorts · TikTok',
      icon: Smartphone,
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#090A0B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <span className="text-xs font-mono font-semibold tracking-wider text-[#C7F36B] uppercase block mb-2">
              Full-Service Ad Production
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
              SERVICES TAILORED FOR E-COMMERCE GROWTH.
            </h2>
          </div>

          <p className="text-sm text-[#A0A89F] max-w-md leading-relaxed">
            Six focused video production services structured to help DTC brands across the USA, UK, UAE, Canada, Australia, and Europe test more winning angles with transparent 1–8 day delivery windows.
          </p>
        </div>

        {/* 6 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {specializedServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-[#171C19] border border-[#2A332B] rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#C7F36B]/60 transition-all duration-300 group shadow-lg"
              >
                <div>
                  {/* Index & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-bold text-[#C7F36B]">
                      SERVICE {service.index}
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#111514] border border-[#2A332B] text-[#C7F36B] group-hover:bg-[#C7F36B] group-hover:text-[#090A0B] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-extrabold font-heading text-[#F5F5F0] group-hover:text-[#C7F36B] transition-colors mb-2.5">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A0A89F] leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Deliverables */}
                  <div className="space-y-2 pt-4 border-t border-[#2A332B] mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#A0A89F] block mb-2 font-semibold">
                      Key Deliverables
                    </span>
                    {service.deliverables.map((item) => (
                      <div key={item} className="text-xs text-[#F5F5F0] flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#C7F36B] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="pt-4 border-t border-[#2A332B]">
                  <div className="text-[11px] font-mono text-[#A0A89F] mb-3.5">
                    <span>Best For: </span>
                    <span className="text-[#F5F5F0]">{service.platforms}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectService(service.title)}
                    className="w-full py-3 px-4 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                  >
                    <span>Book {service.title}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
