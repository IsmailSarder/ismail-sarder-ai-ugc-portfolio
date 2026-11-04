import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenInquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenInquiry }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(38);

  // Simulated video playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1.2));
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const targetMarkets = [
    'United States',
    'United Kingdom',
    'UAE & GCC',
    'Canada',
    'Australia',
    'European Union',
  ];

  return (
    <section id="home" className="relative pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Subtle Studio Backdrop Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] lg:w-[700px] h-[300px] sm:h-[400px] bg-[#C7F36B]/5 blur-[100px] sm:blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#171C19] blur-[80px] sm:blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Editorial Lead Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider text-[#A0A89F] uppercase mb-4 sm:mb-5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#C7F36B] shrink-0" />
              <span>Ismail Sarder</span>
              <span aria-hidden="true" className="text-[#2A332B]">/</span>
              <span className="text-[#F5F5F0]">AI UGC Ad Creator & Creative Strategist</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-[#F5F5F0] tracking-tight leading-[1.1] sm:leading-[1.08] mb-5 sm:mb-6 [text-wrap:balance]">
              MAKE YOUR BRAND <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F0] via-[#F5F5F0] to-[#C7F36B]">IMPOSSIBLE</span> TO SCROLL PAST.
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base lg:text-lg text-[#A0A89F] leading-relaxed max-w-2xl mb-6 sm:mb-8 font-sans">
              I create scroll-stopping AI-powered UGC video ads, product demonstrations, and creative content that help e-commerce brands connect with their audience.
            </p>

            {/* Action Buttons - 320px responsive */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <button
                onClick={onOpenInquiry}
                className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] active:scale-[0.98] rounded-md transition-all duration-200 shadow-lg shadow-[#C7F36B]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                Let&apos;s Work Together
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#portfolio"
                className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-semibold font-heading tracking-wider text-[#F5F5F0] hover:text-[#C7F36B] bg-[#171C19] hover:bg-[#1e2521] border border-[#2A332B] rounded-md transition-all duration-200 flex items-center justify-center gap-2 text-center"
              >
                Explore My Work
              </a>
            </div>

            {/* Target Markets Line - Clean Unboxed Typography */}
            <div className="pt-5 sm:pt-6 border-t border-[#2A332B]">
              <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#A0A89F] block mb-2 font-medium">
                Target Markets Served
              </span>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 sm:gap-x-3 text-xs sm:text-sm text-[#F5F5F0] font-medium">
                {targetMarkets.map((market, index) => (
                  <React.Fragment key={market}>
                    <span className="hover:text-[#C7F36B] transition-colors whitespace-nowrap">{market}</span>
                    {index < targetMarkets.length - 1 && (
                      <span aria-hidden="true" className="text-[#2A332B]">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Layered Creative Showcase Reel */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[310px] sm:max-w-[360px] group">
              
              {/* Outer Glow & Architectural Framing */}
              <div className="absolute -inset-1.5 bg-gradient-to-b from-[#C7F36B]/20 via-[#2A332B]/40 to-transparent rounded-3xl blur-md -z-10" />

              {/* Mobile Phone Mockup Device Frame */}
              <div className="relative bg-[#111514] border border-[#2A332B] rounded-[24px] sm:rounded-[28px] p-2.5 sm:p-3 shadow-2xl overflow-hidden">
                
                {/* Screen Top Status bar */}
                <div className="flex items-center justify-between px-2.5 py-1.5 text-[10px] sm:text-[11px] text-[#A0A89F] font-mono border-b border-[#2A332B]/60 mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C7F36B]" />
                    AI UGC REEL · 4K 60FPS
                  </span>
                  <span>9:16 VERTICAL</span>
                </div>

                {/* Video Container */}
                <div className="relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-[#090A0B] border border-[#2A332B]/80">
                  <img
                    src="/src/assets/images/hero_ugc_beauty_showcase_1793804788830.jpg"
                    alt="AI UGC Skincare Concept Ad Demonstration"
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Scrim Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                  {/* Top Badges - Truthful Concept Identification */}
                  <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] px-2 py-0.5 sm:py-1 rounded font-mono">
                      Spec Concept Demo
                    </span>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full border border-white/20 transition-colors cursor-pointer"
                      aria-label={isMuted ? 'Unmute video preview' : 'Mute video preview'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Play / Pause Interactive Center Overlay */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute inset-0 flex items-center justify-center group/btn focus:outline-none cursor-pointer"
                    aria-label={isPlaying ? 'Pause video preview' : 'Play video preview'}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-[#C7F36B] group-hover/btn:text-[#090A0B] group-hover/btn:border-[#C7F36B]">
                      {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 fill-current" />}
                    </div>
                  </button>

                  {/* Bottom Ad Meta & Captions */}
                  <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 space-y-1.5 sm:space-y-2 pointer-events-none">
                    <div className="bg-black/75 backdrop-blur-md p-2 sm:p-2.5 rounded-lg border border-white/10 text-left">
                      <p className="text-[10px] sm:text-[11px] font-semibold text-[#F5F5F0] leading-snug">
                        &ldquo;Wait, this glow without a 10-step routine? Honestly obsessed...&rdquo;
                      </p>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-1 text-[9px] sm:text-[10px] text-[#A0A89F]">
                        <span>Aurelia Botanica Serum</span>
                        <span>·</span>
                        <span className="text-[#C7F36B]">0:28 Total Run</span>
                      </div>
                    </div>

                    {/* Dynamic Scrubber Progress */}
                    <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-[#C7F36B] h-full transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* Sub-label Below Device */}
                <div className="mt-2.5 flex items-center justify-between text-[10px] sm:text-[11px] text-[#A0A89F] px-1 font-mono">
                  <span>ANGLE: PROBLEM-TO-SOLUTION</span>
                  <span className="text-[#C7F36B] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> PHOTOREALISTIC
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Full-Width Metric Strip Below the Split - 100% Truthful Capability Metrics */}
        <div className="mt-14 sm:mt-16 pt-8 sm:pt-10 border-t border-[#2A332B] grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight tabular-nums">
              100<span className="text-[#C7F36B]">%</span>
            </div>
            <p className="text-xs sm:text-sm text-[#A0A89F] mt-1">
              Realistic AI Persona & Natural Voice
            </p>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight tabular-nums">
              3-5<span className="text-[#C7F36B]">x</span>
            </div>
            <p className="text-xs sm:text-sm text-[#A0A89F] mt-1">
              Testable Hook Openings Per Concept
            </p>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight tabular-nums">
              48<span className="text-[#C7F36B]">h</span>
            </div>
            <p className="text-xs sm:text-sm text-[#A0A89F] mt-1">
              Turnaround For Testable Ad Batches
            </p>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight tabular-nums">
              4K<span className="text-[#C7F36B]">·60</span>
            </div>
            <p className="text-xs sm:text-sm text-[#A0A89F] mt-1">
              Native Vertical 9:16 & 4:5 Formats
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
