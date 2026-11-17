import React from 'react';
import {
  FileVideo,
  Maximize2,
  Captions,
  Music,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface WhatClientsReceiveProps {
  onOpenInquiry: () => void;
}

export const WhatClientsReceive: React.FC<WhatClientsReceiveProps> = ({ onOpenInquiry }) => {
  const deliverables = [
    {
      title: 'High-Resolution MP4 Masters',
      detail: 'Crisp 1080p / 4K exported video files ready to upload directly into Meta Ads Manager, TikTok Ads, or YouTube.',
      icon: FileVideo,
    },
    {
      title: 'Platform-Specific Aspect Ratios',
      detail: 'Delivered in native 9:16 (TikTok / Reels / Shorts), 4:5 or 1:1 (Feed Ads), or 16:9 (Widescreen & Landing Pages).',
      icon: Maximize2,
    },
    {
      title: 'Scroll-Stopping Hook Variations',
      detail: 'Multiple opening 3-second hook cuts available on growth and scale batches so you can split-test winning angles cleanly.',
      icon: Sparkles,
    },
    {
      title: 'Captioned & Clean Versions',
      detail: 'Receive both burned-in kinetic caption exports (positioned cleanly in safe-zones) and uncaptioned masters.',
      icon: Captions,
    },
    {
      title: 'Voiceover, Music & SFX Mix',
      detail: 'Balanced AI voiceover delivery paired with rhythm-matched background music and subtle sound effects.',
      icon: Music,
    },
    {
      title: 'Full Commercial Usage Rights',
      detail: 'Perpetual rights to run, repurpose, and boost your delivered creatives across paid and organic channels worldwide.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      id="deliverables"
      className="py-16 sm:py-20 lg:py-24 bg-[#111514] border-t border-[#2A332B] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-semibold tracking-wider text-[#C7F36B] uppercase block mb-2">
              Turnkey Production Output
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
              WHAT CLIENTS RECEIVE.
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A89F] mt-3 leading-relaxed">
              Every project is delivered organized, properly formatted, and ready for immediate campaign launch—with zero hidden licensing restrictions.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenInquiry}
            className="px-5 py-3 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap min-h-[42px] shrink-0"
          >
            <span>Request Sample Deliverables</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Concrete Deliverables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {deliverables.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-[#171C19] border border-[#2A332B] hover:border-[#C7F36B]/50 rounded-xl p-6 transition-colors duration-200 flex items-start gap-4"
              >
                <div className="p-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-[#C7F36B] shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-heading text-[#F5F5F0] mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#A0A89F] leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
