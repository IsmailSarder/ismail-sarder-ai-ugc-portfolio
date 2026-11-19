import React from 'react';
import {
  Target,
  Compass,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Mail,
  MessageSquare,
  Linkedin,
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext.tsx';

interface AboutProps {
  onOpenInquiry: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenInquiry }) => {
  const { effectiveProfileImage } = useProfile();

  const approaches = [
    {
      title: 'Product-First Storytelling',
      icon: Compass,
      description:
        'Translating product features into relatable everyday stories—replacing cold sales pitches with clear customer problems, visual proof, and natural product adoption.',
    },
    {
      title: 'Scroll-Stopping Advertising Hooks',
      icon: Target,
      description:
        'The opening 1.5 to 3 seconds shape retention. Every ad begins with an intentional visual pattern interrupt, bold opening line, or sensory close-up built for social feeds.',
    },
    {
      title: 'Audience & Market Positioning',
      icon: CheckCircle,
      description:
        'Focusing each script around the clearest buying motivation—comfort, skin confidence, daily convenience, or gifting appeal—tailored to your target region.',
    },
    {
      title: 'AI UGC & CGI Production Workflow',
      icon: Sparkles,
      description:
        'Combining lifelike AI spokesperson and UGC workflows with cinematic 3D CGI visuals so brands can test fresh creative concepts without multi-week studio delays.',
    },
    {
      title: 'Platform-Native Ad Formatting',
      icon: TrendingUp,
      description:
        'Delivering creatives formatted directly for TikTok, Instagram Reels, Meta Feeds, and YouTube Shorts with clean safe-zones, dynamic captions, and cohesive pacing.',
    },
  ];

  return (
    <section
      id="about"
      className="py-20 lg:py-28 bg-[#111514] border-t border-b border-[#2A332B] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <span className="text-xs font-mono font-semibold tracking-wider text-[#C7F36B] uppercase block mb-2">
            Founder &amp; Creative Strategist
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
            ABOUT ISMAIL SARDER.
          </h2>
        </div>

        {/* Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Portrait & Direct Contact Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#2A332B] bg-[#171C19] shadow-2xl group">
              <img
                src={effectiveProfileImage}
                alt="Ismail Sarder — AI UGC & Video Ad Specialist"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full aspect-square object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#090A0B]/85 backdrop-blur-md border border-[#2A332B] text-left">
                <span className="text-xs font-bold font-heading text-[#F5F5F0] block">
                  ISMAIL SARDER
                </span>
                <span className="text-[11px] text-[#A0A89F] block mt-0.5">
                  AI UGC &amp; Video Ad Creative Specialist
                </span>
                <div className="mt-2.5 pt-2.5 border-t border-[#2A332B] flex items-center justify-between text-[10px] font-mono text-[#C7F36B]">
                  <span>INTERNATIONAL CLIENT FOCUS</span>
                  <span>USA · UK · UAE · CA · EU</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Card */}
            <div className="bg-[#171C19] border border-[#2A332B] rounded-xl p-5 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#A0A89F] font-semibold block">
                Direct Communication Channels
              </span>
              <div className="flex flex-col gap-2 text-xs">
                <a
                  href="mailto:hossenmeismail@gmail.com"
                  className="flex items-center gap-2.5 text-[#F5F5F0] hover:text-[#C7F36B] transition-colors py-1 min-h-[36px]"
                >
                  <Mail className="w-4 h-4 text-[#C7F36B] shrink-0" />
                  <span>hossenmeismail@gmail.com</span>
                </a>
                <a
                  href="https://wa.me/8801648861141"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[#F5F5F0] hover:text-[#C7F36B] transition-colors py-1 min-h-[36px]"
                >
                  <MessageSquare className="w-4 h-4 text-[#C7F36B] shrink-0" />
                  <span>WhatsApp: +8801648861141</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/ismail-sarder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[#F5F5F0] hover:text-[#C7F36B] transition-colors py-1 min-h-[36px]"
                >
                  <Linkedin className="w-4 h-4 text-[#C7F36B] shrink-0" />
                  <span>linkedin.com/in/ismail-sarder</span>
                </a>
              </div>
            </div>

            {/* Studio Quick Facts (Factual GEO Summary) */}
            <div className="bg-[#171C19] border border-[#2A332B] rounded-xl p-5 space-y-2.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#C7F36B] font-semibold block">
                Studio Profile &amp; Transparency
              </span>
              <dl className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex justify-between gap-2 border-b border-[#2A332B]/60 pb-1.5">
                  <dt className="text-[#A0A89F]">Starting Launch Rates</dt>
                  <dd className="text-[#F5F5F0] font-mono font-semibold">$25 UGC · $45 CGI · $79 Comm.</dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-[#2A332B]/60 pb-1.5">
                  <dt className="text-[#A0A89F]">Aspect Ratios</dt>
                  <dd className="text-[#F5F5F0] font-mono">9:16, 4:5, 1:1, 16:9, 3:4, 4:3</dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-[#2A332B]/60 pb-1.5">
                  <dt className="text-[#A0A89F]">Typical Turnaround</dt>
                  <dd className="text-[#F5F5F0] font-mono">1–8 Days by Tier</dd>
                </div>
                <div className="pt-0.5 text-[11px] text-[#A0A89F] leading-relaxed">
                  Public case studies are explicitly labeled <strong className="text-[#F5F5F0]">Concept Project</strong> (studio demonstrations) or <strong className="text-[#F5F5F0]">Client Project</strong> (with brand attribution).
                </div>
              </dl>
            </div>
          </div>

          {/* Bio & Creative Approach Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4 text-base sm:text-lg text-[#F5F5F0] leading-relaxed">
              <p className="font-semibold text-xl sm:text-2xl font-heading text-[#F5F5F0] [text-wrap:balance]">
                &ldquo;Strong creative wins attention before a viewer ever reads the ad copy. My focus is turning product benefits into clear, believable video ads built to convert.&rdquo;
              </p>
              <p className="text-sm sm:text-base text-[#A0A89F]">
                I work directly with direct-to-consumer e-commerce founders, Shopify store owners, marketing teams, and growth-focused brands serving buyers across the United States, United Kingdom, UAE, Canada, Australia, and Europe.
              </p>
              <p className="text-sm sm:text-base text-[#A0A89F]">
                Every project blends structured direct-response scripting, realistic AI creators or photorealistic CGI product staging, and disciplined social editing—giving your ad account clean, ready-to-launch creative assets without multi-week physical shipping bottlenecks.
              </p>
            </div>

            {/* Strategic Pillars */}
            <div className="space-y-4 pt-6 border-t border-[#2A332B]">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[#C7F36B]">
                Creative Studio Methodology
              </h3>

              <div className="space-y-3.5">
                {approaches.map((item, idx) => (
                  <div
                    key={item.title}
                    className="p-4 rounded-xl bg-[#171C19] border border-[#2A332B] hover:border-[#C7F36B]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-xs font-mono font-bold text-[#C7F36B]">
                        0{idx + 1}.
                      </span>
                      <h4 className="text-sm font-bold font-heading text-[#F5F5F0]">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#A0A89F] leading-relaxed pl-7">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenInquiry}
                className="px-6 py-3.5 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all cursor-pointer shadow-md min-h-[46px]"
              >
                Start a Project With Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
