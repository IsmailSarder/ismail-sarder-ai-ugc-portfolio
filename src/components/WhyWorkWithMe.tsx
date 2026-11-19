import React from 'react';
import {
  Cpu,
  SplitSquareVertical,
  Smartphone,
  Target,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';

export const WhyWorkWithMe: React.FC = () => {
  const pillars = [
    {
      title: 'Fast Production Without Studio Delays',
      icon: Cpu,
      description:
        'Launch AI UGC video ads in 1–4 days and CGI or multi-scene brand commercials in 2–8 days—without waiting weeks for sample shipping or set bookings.',
      benefit: '1–8 Day Turnaround',
    },
    {
      title: 'Multiple Hook & Angle Options',
      icon: SplitSquareVertical,
      description:
        'Test different opening hooks, problem-solution angles, and visual demos side by side to learn which message resonates most with your buyers.',
      benefit: 'Built for Creative Testing',
    },
    {
      title: 'Platform-Native Safe-Zone Framing',
      icon: Smartphone,
      description:
        'Every video is formatted for its intended placement—9:16 for TikTok and Reels, 4:5 or 1:1 for Meta Feeds, and 16:9 for YouTube and product pages.',
      benefit: 'Multi-Ratio Precision',
    },
    {
      title: 'Product-Focused Storytelling',
      icon: Target,
      description:
        'Visuals and voiceover focus clearly on how your product works, feels, and fits into a customer’s routine—reducing friction before clicking.',
      benefit: 'Clear Value Communication',
    },
    {
      title: 'Direct Founder Communication',
      icon: MessageCircle,
      description:
        'Work directly with Ismail Sarder from initial brief through revisions via email or WhatsApp—zero layers of agency miscommunication.',
      benefit: 'Responsive Collaboration',
    },
    {
      title: 'Full Commercial Rights Included',
      icon: ShieldCheck,
      description:
        'Once delivered, you own full commercial usage rights across paid social, organic channels, and product pages with no recurring creator licensing fees.',
      benefit: 'Perpetual Ad Usage Rights',
    },
  ];

  return (
    <section
      id="why-work-with-me"
      className="py-20 lg:py-28 bg-[#111514] border-t border-b border-[#2A332B] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <span className="text-xs font-mono font-semibold tracking-wider text-[#C7F36B] uppercase block mb-2">
            Why Work With Me
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight mb-4 [text-wrap:balance]">
            DESIGNED FOR SPEED, CLARITY &amp; PAID SOCIAL PERFORMANCE.
          </h2>
          <p className="text-sm text-[#A0A89F] leading-relaxed">
            Practical advantages for international e-commerce brands that need consistent, high-standard video creative without traditional production overhead.
          </p>
        </div>

        {/* 6 Value Pillars Grid */}
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
                  <span className="text-[11px] font-mono text-[#C7F36B] font-semibold">
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
