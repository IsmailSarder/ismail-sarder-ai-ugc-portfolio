import React from 'react';
import { Target, Compass, Sparkles, TrendingUp, CheckCircle, Mail, MessageSquare } from 'lucide-react';

interface AboutProps {
  onOpenInquiry: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenInquiry }) => {
  const approaches = [
    {
      title: 'Creative Storytelling',
      icon: Compass,
      description: 'Translating product features into relatable human stories. We replace cold commercial pitches with authentic customer transformations, relatable frustrations, and natural lifestyle adoption.',
    },
    {
      title: 'Advertising Hooks & Pattern Interrupts',
      icon: Target,
      description: 'The first 1.5 to 3 seconds determine 90% of ad performance. Every creative opens with unexpected visual motions, conversational micro-taps, or contrarian questions that halt scrolling immediately.',
    },
    {
      title: 'Product Positioning & Psychology',
      icon: CheckCircle,
      description: 'Identifying the single sharpest buying trigger—whether it is vanity, social status, pain relief, or sheer convenience—and anchoring the creative around that indisputable advantage.',
    },
    {
      title: 'AI-Powered Content Production',
      icon: Sparkles,
      description: 'Leveraging modern generative AI video architectures to create photorealistic creators, diverse international accents, and lifelike environments without the 4-week delays and $15,000 budgets of traditional film sets.',
    },
    {
      title: 'Social Media Advertising & Scaling',
      icon: TrendingUp,
      description: 'Creatives engineered specifically for the machine-learning algorithms of TikTok, Meta (Facebook & Instagram), and YouTube Shorts. Clean formatting, burned-in captions, and fast iterative testing cycles.',
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#111514] border-t border-b border-[#2A332B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A0A89F] uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7F36B]" />
            <span>Creative Strategist & Founder</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
            ABOUT ISMAIL SARDER.
          </h2>
        </div>

        {/* Editorial Split: Visual Portrait + Manifesto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          
          {/* Portrait & Credentials Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#2A332B] bg-[#171C19] shadow-2xl group">
              <img
                src="/src/assets/images/about_ismail_creative_director_1793804791326.jpg"
                alt="Ismail Sarder - AI UGC Ad Creator & Creative Strategist"
                referrerPolicy="no-referrer"
                className="w-full aspect-square object-cover object-top transition-transform duration-500 group-hover:scale-102"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {/* In-Frame Brand Caption */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#090A0B]/85 backdrop-blur-md border border-[#2A332B] text-left">
                <span className="text-xs font-bold font-heading text-[#F5F5F0] block">
                  ISMAIL SARDER
                </span>
                <span className="text-[11px] text-[#A0A89F] block mt-0.5">
                  AI UGC Ad Creator & Creative Strategist
                </span>
                <div className="mt-2.5 pt-2.5 border-t border-[#2A332B] flex items-center justify-between text-[10px] font-mono text-[#C7F36B]">
                  <span>GLOBAL BRANDS PARTNER</span>
                  <span>USA · UK · UAE · EU</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Badge Card */}
            <div className="bg-[#171C19] border border-[#2A332B] rounded-xl p-5 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#A0A89F] font-semibold block">
                Direct Contact Channels
              </span>
              <div className="flex flex-col gap-2 text-xs">
                <a
                  href="mailto:hossenmeismail@gmail.com"
                  className="flex items-center gap-2.5 text-[#F5F5F0] hover:text-[#C7F36B] transition-colors py-1"
                >
                  <Mail className="w-4 h-4 text-[#C7F36B]" />
                  <span>hossenmeismail@gmail.com</span>
                </a>
                <a
                  href="https://wa.me/8801648861141"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[#F5F5F0] hover:text-[#C7F36B] transition-colors py-1"
                >
                  <MessageSquare className="w-4 h-4 text-[#C7F36B]" />
                  <span>WhatsApp: +88 01648861141</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bio & Approach Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4 text-base sm:text-lg text-[#F5F5F0] leading-relaxed">
              <p className="font-semibold text-xl sm:text-2xl font-heading text-[#F5F5F0] [text-wrap:balance]">
                &ldquo;Traditional studio production is slow and costly. Generic AI slop destroys buyer trust. I operate right at the intersection—crafting hyper-realistic, performance-engineered video ads that drive actual sales.&rdquo;
              </p>
              <p className="text-sm sm:text-base text-[#A0A89F]">
                As an AI UGC Ad Creator and Creative Strategist, I partner directly with direct-to-consumer e-commerce brands, high-growth startups, and media buyers across the United States, United Kingdom, UAE, Canada, Australia, and Europe.
              </p>
              <p className="text-sm sm:text-base text-[#A0A89F]">
                Rather than treating AI as a novelty, I utilize it as an agile creative engine—enabling brands to test multiple creator personas, demographic angles, and hook frameworks in a fraction of traditional production timelines.
              </p>
            </div>

            {/* The 5 Strategic Pillars */}
            <div className="space-y-4 pt-6 border-t border-[#2A332B]">
              <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-[#C7F36B]">
                My Strategic Framework
              </h3>

              <div className="space-y-4">
                {approaches.map((item, idx) => {
                  const Icon = item.icon;
                  return (
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
                      <p className="text-xs text-[#A0A89F] leading-relaxed pl-6">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <button
                onClick={onOpenInquiry}
                className="px-6 py-3.5 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all cursor-pointer shadow-md"
              >
                Start a Creative Project With Me
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
