import React from 'react';
import { Cpu, SplitSquareVertical, Smartphone, Target, MessageCircle, ShieldCheck } from 'lucide-react';

export const WhyWorkWithMe: React.FC = () => {
  const pillars = [
    {
      title: 'AI-Powered Creative Production',
      icon: Cpu,
      description: 'Produce high-performing UGC video ads without traditional production bottlenecks. Test diverse demographics, international creator personas, and lifestyle aesthetics in days rather than waiting weeks for sample shipments and talent schedules.',
      benefit: '10x Speed & Cost Efficiency',
    },
    {
      title: 'Multiple Creative Angles',
      icon: SplitSquareVertical,
      description: 'Never bet your entire ad budget on a single creative hunch. Every package includes multiple distinct hook variations, psychological angles (problem-solution, contrarian, ASMR demo), and pacing styles for true multivariate testing.',
      benefit: 'Mitigate Creative Fatigue',
    },
    {
      title: 'Platform-Ready Video Formats',
      icon: Smartphone,
      description: 'Delivered in native aspect ratios engineered for algorithmic feeds: 9:16 vertical for TikTok and Reels, 4:5 for Meta Feeds, and 16:9 for YouTube. Includes burned-in kinetic captions positioned perfectly above interface UI overlays.',
      benefit: 'Native Feed Compatibility',
    },
    {
      title: 'Product-Focused Storytelling',
      icon: Target,
      description: 'Creatives designed to sell, not just entertain. We spotlight your product’s unique value proposition with visceral visual proof, macro texture close-ups, and clear consumer benefit demonstrations that overcome buyer hesitation.',
      benefit: 'Engineered for Conversions',
    },
    {
      title: 'Clear Communication',
      icon: MessageCircle,
      description: 'Direct collaboration with Ismail Sarder from initial brief to final delivery. Zero agency bureaucracy or junior account manager telephone games. Transparent timelines, responsive WhatsApp updates, and clear feedback loops.',
      benefit: 'Direct Founder Access',
    },
    {
      title: 'Professional Delivery',
      icon: ShieldCheck,
      description: 'Every deliverable includes color-graded master video files in 4K 60FPS, separate audio stems, SRT subtitles, and standardized naming conventions organized ready for immediate media buyer deployment into Meta Ads Manager.',
      benefit: 'Turnkey Media Buyer Deployment',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#111514] border-t border-b border-[#2A332B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A0A89F] uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7F36B]" />
            <span>The Competitive Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight mb-4">
            WHY HIGH-GROWTH E-COMMERCE BRANDS CHOOSE TO WORK WITH ME.
          </h2>
          <p className="text-sm text-[#A0A89F] leading-relaxed">
            Eliminating traditional studio friction while delivering performance-first creative assets that reduce CAC and scale your profitable spend.
          </p>
        </div>

        {/* 6 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-[#171C19] border border-[#2A332B] rounded-xl p-6 flex flex-col justify-between hover:border-[#C7F36B]/50 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-2.5 rounded-lg bg-[#111514] text-[#C7F36B] border border-[#2A332B] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-[#A0A89F]">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-heading text-[#F5F5F0] group-hover:text-[#C7F36B] transition-colors mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#A0A89F] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2A332B]">
                  <span className="text-[11px] font-mono text-[#C7F36B] font-semibold flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#C7F36B]" />
                    {item.benefit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
