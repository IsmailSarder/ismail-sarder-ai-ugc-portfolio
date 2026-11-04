import React from 'react';
import { ArrowUpRight, Video, UserCheck, Layers, FileText, Film, Sparkles, SlidersHorizontal } from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const servicesList = [
    {
      index: '01',
      title: 'AI UGC Creator Videos',
      description: 'Hyper-realistic digital creator ads that look and feel like organic user-generated content. Built with native smartphone camera pacing, authentic speaking cadences, and zero uncanny valley.',
      deliverables: ['9:16 Vertical Master', 'Burned-in Dynamic Captions', '2-3 Hook Variations', 'Raw Footage Export'],
      platforms: 'TikTok · Reels · Shorts',
      icon: Video,
    },
    {
      index: '02',
      title: 'AI Spokesperson Ads',
      description: 'Charismatic, articulate brand advocates and founder-led explainers. Tailored with custom demographics, regional accents (US, UK, Australian, European), and high-authority product endorsements.',
      deliverables: ['Direct-to-Camera Delivery', 'Custom Wardrobe & Backdrop', 'Multi-Language Dubbing Option', 'Voice Tone Calibration'],
      platforms: 'Meta Ads · YouTube · Landing Pages',
      icon: UserCheck,
    },
    {
      index: '03',
      title: 'Product Demonstration Videos',
      description: 'Ultra-detailed macro visual demonstrations showcasing ingredient science, mechanical assembly, app UI workflows, or sensory product textures that instantly validate claims.',
      deliverables: ['Macro Texture Still Integration', 'Split-Screen Before/After', 'Feature Callout Overlays', 'Exploded Angle Renders'],
      platforms: 'Amazon PDP · Meta Ads · TikTok Shop',
      icon: Layers,
    },
    {
      index: '04',
      title: 'E-commerce Video Ads',
      description: 'High-velocity direct-response creatives formulated specifically for customer acquisition. Calibrated for paid social channels to maximize return on ad spend (ROAS) and lower CPA.',
      deliverables: ['Direct Response CTA Cards', 'Offer Overlay Animations', 'Problem-Agitation-Solution Flow', 'A/B Testing Ready'],
      platforms: 'Meta Ads · Pinterest · Google Demand Gen',
      icon: Sparkles,
    },
    {
      index: '05',
      title: 'Hook & Script Development',
      description: 'Psychology-backed direct response copywriting. We construct the critical first 3-second pattern interrupts, relatable audience tension points, and bulletproof closing CTAs.',
      deliverables: ['5 Tested Hook Frameworks', 'Word-for-Word Voiceover Script', 'Visual Storyboard & Shotlist', 'Competitor Angle Matrix'],
      platforms: 'Cross-Platform Creative Strategy',
      icon: FileText,
    },
    {
      index: '06',
      title: 'Product B-roll & Lifestyle Videos',
      description: 'Cinematic contextual footage placing your product inside aspirational real-world environments—from sunlit modern loft interiors to architectural outdoor urban settings.',
      deliverables: ['Rich Ambient Environmental Cuts', 'Organic Hands-On Interaction', 'Color Graded 4K Master', 'Seamless Looping Formats'],
      platforms: 'Brand Awareness · Retargeting · Stories',
      icon: Film,
    },
    {
      index: '07',
      title: 'Social Media Ad Creatives',
      description: 'Platform-native visual assets engineered for modern algorithmic feeds. Fast cuts, punchy text kinetic motion, and trends mapped directly to your product positioning.',
      deliverables: ['Platform Native Pacing', 'Sound-Trend Synchronization', 'Dynamic Aspect Ratios (9:16 / 4:5)', 'High-Retention Visual Loops'],
      platforms: 'TikTok · Instagram · Snapchat',
      icon: SlidersHorizontal,
    },
    {
      index: '08',
      title: 'Multiple Creative Variations',
      description: 'Rapid multivariate creative testing at scale. We generate multiple hooks, pacing speeds, spokesperson personas, and music tracks to identify winning ad combinations fast.',
      deliverables: ['Batch Matrix (3 Hooks × 2 Bodies × 2 CTAs)', 'Rapid Creative Refresh Batches', 'Fatigue-Prevention Iterations', 'Naming Convention for Media Buyers'],
      platforms: 'High-Spend Ad Accounts ($10k-$100k+/mo)',
      icon: SlidersHorizontal,
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#090A0B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A0A89F] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C7F36B]" />
              <span>Full-Stack Creative Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
              SERVICES & PRODUCTION SUITE.
            </h2>
          </div>

          <p className="text-sm text-[#A0A89F] max-w-md leading-relaxed">
            From creative strategy and psychological hook formulation to AI video synthesis and post-production editing, every asset is delivered ready to scale.
          </p>
        </div>

        {/* 8 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-[#171C19] border border-[#2A332B] rounded-xl p-6 flex flex-col justify-between hover:border-[#C7F36B]/50 transition-all duration-300 group shadow-md"
              >
                <div>
                  {/* Service Index & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-bold text-[#C7F36B]">
                      {service.index}.
                    </span>
                    <div className="p-2 rounded-lg bg-[#111514] border border-[#2A332B] text-[#A0A89F] group-hover:text-[#C7F36B] group-hover:border-[#C7F36B]/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold font-heading text-[#F5F5F0] group-hover:text-[#C7F36B] transition-colors mb-2.5">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#A0A89F] leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Deliverables */}
                  <div className="space-y-1.5 pt-4 border-t border-[#2A332B] mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#A0A89F] block mb-2 font-semibold">
                      Included Deliverables
                    </span>
                    {service.deliverables.map((item) => (
                      <div key={item} className="text-xs text-[#F5F5F0] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#C7F36B]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="pt-4 border-t border-[#2A332B]">
                  <div className="text-[11px] text-[#A0A89F] mb-3">
                    <span className="text-[#A0A89F]">Optimized for: </span>
                    <span className="text-[#F5F5F0]">{service.platforms}</span>
                  </div>

                  <button
                    onClick={() => onSelectService(service.title)}
                    className="w-full py-2.5 px-3 text-xs font-bold font-heading uppercase tracking-wider text-[#F5F5F0] bg-[#111514] hover:bg-[#C7F36B] hover:text-[#090A0B] border border-[#2A332B] hover:border-[#C7F36B] rounded-md transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Inquire About This</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
