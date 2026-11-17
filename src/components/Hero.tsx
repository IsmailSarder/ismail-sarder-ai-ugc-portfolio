import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, ArrowRight, Film } from 'lucide-react';
import { useProfile } from '../context/ProfileContext.tsx';
import { VideoModal, PortfolioItem } from './VideoModal.tsx';
import { portfolioService, DEFAULT_INITIAL_PROJECTS } from '../lib/portfolioService.ts';
import { enrichPortfolioItem } from '../lib/caseStudyEnrichment.ts';
import { normalizeAspectRatio } from '../lib/videoAspectRatios.ts';

interface HeroProps {
  onOpenInquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenInquiry }) => {
  const { effectiveProfileImage } = useProfile();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const defaultFeatured: PortfolioItem = enrichPortfolioItem({
    id: DEFAULT_INITIAL_PROJECTS[0].id,
    title: DEFAULT_INITIAL_PROJECTS[0].title,
    category: DEFAULT_INITIAL_PROJECTS[0].category,
    serviceType: 'AI UGC Ads',
    duration: DEFAULT_INITIAL_PROJECTS[0].duration || '0:28',
    format: '9:16 Vertical Video',
    thumbnail: DEFAULT_INITIAL_PROJECTS[0].thumbnail_url,
    videoUrl: DEFAULT_INITIAL_PROJECTS[0].video_url,
    video_url: DEFAULT_INITIAL_PROJECTS[0].video_url,
    aspect_ratio: '9:16',
    aspectRatio: '9:16',
    video_width: DEFAULT_INITIAL_PROJECTS[0].video_width,
    video_height: DEFAULT_INITIAL_PROJECTS[0].video_height,
    hook: 'Candid daily skincare opener contrasting complicated routines with one simple hydrating serum step.',
    angle: 'Honest Routine Review',
    isConcept: true,
    overview: DEFAULT_INITIAL_PROJECTS[0].description,
    targetMarket: 'USA, UK, UAE, Canada & Europe',
  });

  const [featuredItem, setFeaturedItem] = useState<PortfolioItem>(defaultFeatured);

  // Load actual featured vertical Supabase video asset so Hero never shows a fake placeholder
  useEffect(() => {
    let active = true;
    portfolioService.getPublishedProjects().then(({ data }) => {
      if (!active || !data || data.length === 0) return;
      const preferred =
        data.find(
          (p) =>
            p.video_url &&
            (p.aspect_ratio === '9:16' || p.is_featured)
        ) || data[0];

      if (preferred && preferred.video_url) {
        const mapped = enrichPortfolioItem({
          id: preferred.id,
          title: preferred.title,
          category: preferred.category,
          serviceType: 'AI UGC Ads',
          duration: preferred.duration || '0:28',
          format: preferred.format || '9:16 Vertical Video',
          thumbnail: preferred.thumbnail_url,
          videoUrl: preferred.video_url,
          video_url: preferred.video_url,
          aspect_ratio: normalizeAspectRatio(
            preferred.aspect_ratio,
            preferred.video_width,
            preferred.video_height
          ),
          aspectRatio: normalizeAspectRatio(
            preferred.aspect_ratio,
            preferred.video_width,
            preferred.video_height
          ),
          video_width: preferred.video_width,
          video_height: preferred.video_height,
          brand_name: preferred.brand_name,
          brandName: preferred.brand_name,
          hook: preferred.hook || '',
          angle: preferred.angle || preferred.category,
          isConcept: !preferred.brand_name,
          overview: preferred.description,
          targetMarket: 'USA, UK, UAE, Canada & Europe',
        });
        setFeaturedItem(mapped);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // 3D tilt tracking for phone preview
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

      const maxTilt = 8;
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

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  const targetMarkets = ['USA', 'UK', 'UAE', 'Canada', 'Europe'];
  const coreCapabilities = [
    {
      label: 'Services',
      value: 'AI UGC · Spokesperson · CGI',
      detail: 'Beauty, skincare, fashion & gadget ad production',
    },
    {
      label: 'Formats',
      value: '9:16 · 4:5 · 1:1 · 16:9',
      detail: 'TikTok, Instagram Reels, Meta & YouTube ready',
    },
    {
      label: 'Turnaround',
      value: '24 – 72 Hours',
      detail: 'Fast delivery with structured hook variations',
    },
    {
      label: 'Markets Served',
      value: 'USA · UK · UAE · CA · EU',
      detail: 'Direct collaboration for international DTC brands',
    },
  ];

  const previewOriginLabel =
    featuredItem.brand_name || featuredItem.brandName
      ? 'Client Project'
      : 'Concept Project';

  return (
    <section
      id="home"
      className="relative pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24 overflow-hidden"
    >
      {/* Subtle Ambient Backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[540px] lg:w-[740px] h-[300px] sm:h-[420px] bg-[#C7F36B]/[0.06] blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
          {/* Left Column: Clear Agency Positioning & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Creator Intro Line */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-wider text-[#A0A89F] uppercase mb-5"
            >
              <img
                src={effectiveProfileImage}
                alt="Ismail Sarder — AI UGC Video Ads Creator portrait"
                width={32}
                height={32}
                decoding="async"
                className="w-8 h-8 rounded-full object-cover object-top border border-[#C7F36B]/60 shrink-0"
              />
              <span className="text-[#F5F5F0] font-bold">Ismail Sarder</span>
              <span aria-hidden="true" className="text-[#2A332B]">/</span>
              <span className="text-[#C7F36B] font-mono">
                AI UGC &amp; Creative Video Ad Studio
              </span>
            </motion.div>

            {/* Exact Requested Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold font-heading text-[#F5F5F0] tracking-tight leading-[1.08] mb-5 sm:mb-6 [text-wrap:balance]"
            >
              AI UGC Video Ads That Help Brands{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F0] via-[#F5F5F0] to-[#C7F36B]">
                Stand Out
              </span>
            </motion.h1>

            {/* Exact Requested Supporting Text + Professional Introduction */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-[#F5F5F0]/90 leading-relaxed max-w-2xl mb-3 font-sans"
            >
              I create engaging AI-powered video ads, product demonstrations and social media advertising creatives for e-commerce brands.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs sm:text-sm text-[#A0A89F] leading-relaxed max-w-xl mb-7 sm:mb-8"
            >
              Specializing in AI UGC Video Ads, AI Spokesperson Videos, Product Demonstrations, and CGI Commercials tailored for Beauty &amp; Skincare, Fashion, and Gadget brands across the USA, UK, UAE, Canada, and Europe.
            </motion.p>

            {/* Action Buttons: View My Work, Hire Me, Featured Preview */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-10 flex-wrap"
            >
              <a
                href="#portfolio"
                className="group px-6 py-3.5 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] active:scale-[0.98] rounded-md transition-all duration-200 shadow-lg shadow-[#C7F36B]/20 flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                type="button"
                onClick={onOpenInquiry}
                className="px-6 py-3.5 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#F5F5F0] hover:text-[#C7F36B] bg-[#171C19] hover:bg-[#1e2521] border border-[#2A332B] hover:border-[#C7F36B]/50 rounded-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
              >
                <span>Hire Me</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(true)}
                className="px-5 py-3.5 text-xs sm:text-sm font-mono tracking-wider text-[#C7F36B] hover:text-[#090A0B] bg-[#C7F36B]/10 hover:bg-[#C7F36B] border border-[#C7F36B]/30 rounded-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
              >
                <Film className="w-4 h-4" />
                <span>Watch Featured Case Study</span>
              </button>
            </motion.div>

            {/* Target Markets Line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.36 }}
              className="pt-5 border-t border-[#2A332B]"
            >
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#A0A89F] block mb-2">
                Serving E-Commerce Brands In
              </span>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-[#F5F5F0] font-medium">
                {targetMarkets.map((market, index) => (
                  <React.Fragment key={market}>
                    <span>{market}</span>
                    {index < targetMarkets.length - 1 && (
                      <span aria-hidden="true" className="text-[#2A332B]">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Featured Live Video Preview Frame (Real Video Asset) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[300px] sm:max-w-[340px] group perspective-1000"
            >
              <div className="absolute -inset-1.5 bg-gradient-to-b from-[#C7F36B]/20 via-[#2A332B]/40 to-transparent rounded-3xl blur-md -z-10" />

              <motion.div
                ref={phoneRef}
                onMouseMove={handlePhoneMouseMove}
                onMouseEnter={() => setIsHoveringPhone(true)}
                onMouseLeave={handlePhoneMouseLeave}
                style={{
                  transform:
                    !isTouchDevice && isHoveringPhone
                      ? `perspective(1000px) rotateX(${phoneTilt.x}deg) rotateY(${phoneTilt.y}deg) scale3d(1.015, 1.015, 1)`
                      : undefined,
                  transformStyle: 'preserve-3d',
                  transition: isHoveringPhone
                    ? 'transform 0.1s ease-out'
                    : 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
                className="relative bg-[#111514] border border-[#2A332B] rounded-[24px] sm:rounded-[28px] p-2.5 sm:p-3 shadow-2xl overflow-hidden hover:border-[#C7F36B]/60 transition-colors"
              >
                {/* Frame Top Bar */}
                <div className="flex items-center justify-between px-2.5 py-1.5 text-[10px] sm:text-[11px] text-[#A0A89F] font-mono border-b border-[#2A332B]/60 mb-2">
                  <span className="font-semibold text-[#F5F5F0]">FEATURED PREVIEW</span>
                  <span className="text-[#C7F36B]">{featuredItem.aspect_ratio || '9:16'}</span>
                </div>

                {/* Real HTML5 Video Container */}
                <div
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-[#2A332B]/80 cursor-pointer"
                >
                  <video
                    ref={videoRef}
                    src={featuredItem.video_url || featuredItem.videoUrl}
                    poster={featuredItem.thumbnail}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="w-full h-full object-contain bg-black"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Overlay Controls */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] px-2 py-0.5 rounded font-mono">
                      {previewOriginLabel}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleTogglePlay}
                        className="p-1.5 bg-black/70 hover:bg-black text-white rounded-full border border-white/20 transition-colors cursor-pointer"
                        aria-label={isPlaying ? 'Pause video preview' : 'Play video preview'}
                      >
                        {isPlaying ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleToggleMute}
                        className="p-1.5 bg-black/70 hover:bg-black text-white rounded-full border border-white/20 transition-colors cursor-pointer"
                        aria-label={isMuted ? 'Unmute video preview' : 'Mute video preview'}
                      >
                        {isMuted ? (
                          <VolumeX className="w-3.5 h-3.5" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Title & Scrubber */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 space-y-2 pointer-events-none z-10">
                    <div className="bg-black/75 backdrop-blur-md p-2.5 rounded-lg border border-white/10 text-left">
                      <span className="text-[10px] font-mono text-[#C7F36B] uppercase block">
                        {featuredItem.category}
                      </span>
                      <p className="text-[11px] sm:text-xs font-semibold text-[#F5F5F0] leading-snug line-clamp-2 mt-0.5">
                        {featuredItem.title}
                      </p>
                    </div>

                    <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-[#C7F36B] h-full transition-all duration-150"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Trigger */}
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="mt-2.5 w-full flex items-center justify-between text-[11px] font-mono text-[#A0A89F] hover:text-[#C7F36B] px-1 py-0.5 transition-colors cursor-pointer"
                >
                  <span>CLICK TO WATCH CASE STUDY</span>
                  <span className="text-[#C7F36B] font-bold">OPEN PLAYER &rarr;</span>
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Truthful Studio Capabilities Strip (Zero Fabricated Stats) */}
        <div className="mt-14 sm:mt-16 pt-8 sm:pt-10 border-t border-[#2A332B] grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {coreCapabilities.map((item) => (
            <div key={item.label}>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C7F36B] block mb-1">
                {item.label}
              </span>
              <div className="text-lg sm:text-xl lg:text-2xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
                {item.value}
              </div>
              <p className="text-xs text-[#A0A89F] mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Case Study Lightbox */}
      {isPreviewModalOpen && (
        <VideoModal
          item={featuredItem}
          onClose={() => setIsPreviewModalOpen(false)}
          onOrderSimilar={() => {
            setIsPreviewModalOpen(false);
            onOpenInquiry();
          }}
        />
      )}
    </section>
  );
};
