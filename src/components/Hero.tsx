import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Sparkles, ArrowRight, Film, X } from 'lucide-react';
import { heroUgcBeauty } from '../assets/images.ts';
import { useProfile } from '../context/ProfileContext.tsx';
import { VideoModal, PortfolioItem } from './VideoModal.tsx';

interface HeroProps {
  onOpenInquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenInquiry }) => {
  const { effectiveProfileImage } = useProfile();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(38);
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);

  // 3D tilt tracking for phone mockup
  const phoneRef = useRef<HTMLDivElement>(null);
  const [phoneTilt, setPhoneTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHoveringPhone, setIsHoveringPhone] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handlePhoneMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchDevice || !phoneRef.current) return;
      const rect = phoneRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const maxTilt = 10;
      const rotateX = ((mouseY - centerY) / centerY) * -maxTilt;
      const rotateY = ((mouseX - centerX) / centerX) * maxTilt;
      setPhoneTilt({ x: rotateX, y: rotateY });
    },
    [isTouchDevice]
  );

  const handlePhoneMouseLeave = () => {
    setIsHoveringPhone(false);
    setPhoneTilt({ x: 0, y: 0 });
  };

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

  const masterShowreelItem: PortfolioItem = {
    id: 'master-showreel-2026',
    title: 'Ismail Sarder — 2026 AI UGC Master Showreel',
    category: 'AI UGC Creator Videos',
    duration: '1:15',
    format: '9:16 & 16:9 Master Reel',
    thumbnail: heroUgcBeauty,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    hook: 'Halting thumbs, beating creative ad fatigue, and scaling direct-response e-commerce ads with photorealistic AI UGC creators.',
    angle: '2026 Creative Director & AI Pipeline Showreel',
    overview: 'Full creative showreel demonstrating realistic multi-demographic AI creators, high-converting product demonstrations, dynamic macro b-roll, and multivariate hook testing formulated for brands in the USA, UK, UAE, Canada, Australia, and Europe.',
    isConcept: false,
    keyFeatures: [
      'Photorealistic AI Creator Personas',
      'Native TikTok & Reels Pacing & Sound',
      'Macro Product Staging & ASMR Audio',
      '4K 60FPS High-Bitrate Master Deliverables',
    ],
    targetMarket: 'USA, UK, UAE, Canada, Australia & Europe',
  };

  return (
    <section id="home" className="relative pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Subtle Studio Backdrop Elements with Continuous Ambient Drift */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.05, 0.09, 0.05],
        }}
        transition={{
          repeat: Infinity,
          duration: 9,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] lg:w-[700px] h-[300px] sm:h-[400px] bg-[#C7F36B] blur-[100px] sm:blur-[140px] pointer-events-none rounded-full"
      />
      <motion.div
        animate={{
          x: [-15, 15, -15],
          y: [-10, 10, -10],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: 'easeInOut',
        }}
        className="absolute top-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#171C19] blur-[80px] sm:blur-[100px] pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Typographic Hierarchy with Staggered Entrance */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Editorial Lead Kicker with Creator Avatar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-2.5 text-xs font-semibold tracking-wider text-[#A0A89F] uppercase mb-4 sm:mb-5"
            >
              <div className="relative shrink-0">
                <img
                  src={effectiveProfileImage}
                  alt="Ismail Sarder Profile"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover object-top border border-[#C7F36B]/60 shadow-sm shadow-[#C7F36B]/20"
                />
              </div>
              <span className="text-[#F5F5F0] font-bold">Ismail Sarder</span>
              <span aria-hidden="true" className="text-[#2A332B]">/</span>
              <span className="text-[#C7F36B]">AI UGC &amp; Video Ad Creative Specialist</span>
            </motion.div>

            {/* Display Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-[#F5F5F0] tracking-tight leading-[1.1] sm:leading-[1.08] mb-5 sm:mb-6 [text-wrap:balance]"
            >
              AI UGC &amp; VIDEO ADS THAT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F0] via-[#F5F5F0] to-[#C7F36B]">HALT THE FEED</span> &amp; SCALE BRANDS.
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm sm:text-base lg:text-lg text-[#A0A89F] leading-relaxed max-w-2xl mb-6 sm:mb-8 font-sans"
            >
              I create AI-powered UGC videos and cinematic video advertisements for e-commerce brands, beauty, fashion, and digital businesses.
            </motion.p>

            {/* Action Buttons - Primary: View My Work, Secondary: Let's Work Together, Showreel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-10 flex-wrap"
            >
              <a
                href="#portfolio"
                className="group relative px-6 py-3.5 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] active:scale-[0.98] rounded-md transition-all duration-200 shadow-lg shadow-[#C7F36B]/20 flex items-center justify-center gap-2 cursor-pointer overflow-hidden min-h-[46px]"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={onOpenInquiry}
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold font-heading tracking-wider text-[#F5F5F0] hover:text-[#C7F36B] bg-[#171C19] hover:bg-[#1e2521] border border-[#2A332B] hover:border-[#C7F36B]/40 rounded-md transition-all duration-200 flex items-center justify-center gap-2 text-center cursor-pointer min-h-[46px]"
              >
                <span>Let&apos;s Work Together</span>
              </button>

              <button
                onClick={() => setIsShowreelOpen(true)}
                className="px-5 py-3.5 text-xs sm:text-sm font-mono tracking-wider text-[#C7F36B] hover:text-[#090A0B] bg-[#C7F36B]/10 hover:bg-[#C7F36B] border border-[#C7F36B]/30 rounded-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
              >
                <Film className="w-4 h-4" />
                <span>Watch 2026 Showreel</span>
              </button>
            </motion.div>

            {/* Target Markets Line - Clean Unboxed Typography */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-5 sm:pt-6 border-t border-[#2A332B]"
            >
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
            </motion.div>

          </div>

          {/* Right Column: Layered Creative Showcase Reel with 3D Float & Tilt */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[310px] sm:max-w-[360px] group perspective-1000"
            >
              {/* Outer Glow & Architectural Framing */}
              <div className="absolute -inset-1.5 bg-gradient-to-b from-[#C7F36B]/20 via-[#2A332B]/40 to-transparent rounded-3xl blur-md -z-10" />

              {/* Mobile Phone Mockup Device Frame with 3D Mouse Parallax & Gentle Idle Float */}
              <motion.div
                ref={phoneRef}
                onMouseMove={handlePhoneMouseMove}
                onMouseEnter={() => setIsHoveringPhone(true)}
                onMouseLeave={handlePhoneMouseLeave}
                animate={
                  !isHoveringPhone && !isTouchDevice
                    ? { y: [-4, 4, -4] }
                    : undefined
                }
                transition={
                  !isHoveringPhone && !isTouchDevice
                    ? { repeat: Infinity, duration: 6, ease: 'easeInOut' }
                    : undefined
                }
                style={{
                  transform:
                    !isTouchDevice && isHoveringPhone
                      ? `perspective(1000px) rotateX(${phoneTilt.x}deg) rotateY(${phoneTilt.y}deg) scale3d(1.02, 1.02, 1)`
                      : undefined,
                  transformStyle: 'preserve-3d',
                  transition: isHoveringPhone
                    ? 'transform 0.1s ease-out'
                    : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
                className="relative bg-[#111514] border border-[#2A332B] rounded-[24px] sm:rounded-[28px] p-2.5 sm:p-3 shadow-2xl overflow-hidden hover:border-[#C7F36B]/60 transition-colors"
              >
                
                {/* Screen Top Status bar */}
                <div className="flex items-center justify-between px-2.5 py-1.5 text-[10px] sm:text-[11px] text-[#A0A89F] font-mono border-b border-[#2A332B]/60 mb-2">
                  <span className="font-semibold text-[#F5F5F0]">
                    AI UGC REEL · 4K 60FPS
                  </span>
                  <span>9:16 VERTICAL</span>
                </div>

                {/* Video Container */}
                <div className="relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-[#090A0B] border border-[#2A332B]/80">
                  <img
                    src={heroUgcBeauty}
                    alt="AI UGC Skincare Concept Ad Demonstration"
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Scrim Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                  {/* Top Badges */}
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
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-[#C7F36B] group-hover/btn:text-[#090A0B] group-hover/btn:border-[#C7F36B] shadow-lg">
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

              </motion.div>
            </motion.div>
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

      {/* Featured Master Showreel Lightbox Modal */}
      {isShowreelOpen && (
        <VideoModal
          item={masterShowreelItem}
          onClose={() => setIsShowreelOpen(false)}
          onOrderSimilar={() => {
            setIsShowreelOpen(false);
            onOpenInquiry();
          }}
        />
      )}
    </section>
  );
};
