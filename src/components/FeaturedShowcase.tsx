import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  Layers,
  Volume2,
  ExternalLink,
} from 'lucide-react';
import { PortfolioItem } from './VideoModal.tsx';

interface FeaturedShowcaseProps {
  projects: PortfolioItem[];
  onSelectProject: (project: PortfolioItem) => void;
  onOrderSimilar?: (projectTitle: string) => void;
}

export const FeaturedShowcase: React.FC<FeaturedShowcaseProps> = ({
  projects,
  onSelectProject,
  onOrderSimilar,
}) => {
  // Use first 5 projects as featured items
  const featuredProjects = projects.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);

  // Auto-advance carousel every 7 seconds when not paused
  useEffect(() => {
    if (isPaused || featuredProjects.length <= 1) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused, featuredProjects.length]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
  }, [featuredProjects.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);
  }, [featuredProjects.length]);

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  if (featuredProjects.length === 0) return null;

  const currentProject = featuredProjects[currentIndex] || featuredProjects[0];
  const brandName = currentProject.brand_name || currentProject.brandName;

  return (
    <div
      className="relative mb-16 sm:mb-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header Accent Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#C7F36B]/15 text-[#C7F36B] border border-[#C7F36B]/30">
            <Zap className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold font-heading uppercase tracking-wider text-[#F5F5F0]">
            Featured 3D Concept Spotlight
          </span>
          <span className="text-[10px] font-mono text-[#C7F36B] bg-[#171C19] border border-[#2A332B] px-2 py-0.5 rounded hidden sm:inline-block">
            {currentIndex + 1} of {featuredProjects.length}
          </span>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 sm:p-2.5 rounded-xl bg-[#171C19] border border-[#2A332B] text-[#A0A89F] hover:text-[#C7F36B] hover:border-[#C7F36B] transition-colors cursor-pointer"
            aria-label="Previous featured project"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 sm:p-2.5 rounded-xl bg-[#171C19] border border-[#2A332B] text-[#A0A89F] hover:text-[#C7F36B] hover:border-[#C7F36B] transition-colors cursor-pointer"
            aria-label="Next featured project"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3D Card Display */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#2A332B] bg-[#111514] shadow-2xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, x: direction > 0 ? 60 : -60, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction > 0 ? -60 : 60, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch"
          >
            {/* Left 3D Media Showcase (lg:col-span-6) - Complete Uncropped Preview */}
            <div
              onClick={() => onSelectProject(currentProject)}
              className="lg:col-span-6 relative aspect-video lg:aspect-auto min-h-[280px] sm:min-h-[380px] bg-[#090A0B] overflow-hidden group cursor-pointer flex items-center justify-center"
            >
              {/* Layer 1: Ambient Blurred Backdrop */}
              <img
                src={currentProject.thumbnail}
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-125 pointer-events-none"
              />

              {/* Layer 2: Complete Uncropped Thumbnail */}
              <img
                src={currentProject.thumbnail}
                alt={currentProject.title}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="relative z-10 w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#111514] via-black/20 to-black/35 pointer-events-none" />

              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono pointer-events-none z-20">
                <span className="text-[#090A0B] font-bold bg-[#C7F36B] px-3 py-1 rounded-md shadow-lg shadow-[#C7F36B]/20 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>FEATURED CAMPAIGN</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-[#F5F5F0] bg-black/80 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-md">
                    {currentProject.duration || '0:30'}
                  </span>
                  {(currentProject.aspect_ratio || currentProject.aspectRatio) && (
                    <span className="text-[11px] font-mono font-bold text-[#C7F36B] bg-black/80 px-2 py-1 rounded-md border border-white/10 backdrop-blur-md">
                      {currentProject.aspect_ratio || currentProject.aspectRatio}
                    </span>
                  )}
                </div>
              </div>

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C7F36B] text-[#090A0B] flex items-center justify-center shadow-[0_0_40px_rgba(199,243,107,0.6)] group-hover:scale-110 group-hover:shadow-[0_0_60px_rgba(199,243,107,0.9)] transition-all duration-300">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-current" />
                </div>
              </div>

              {/* Hover Cue */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#A0A89F] pointer-events-none">
                <span className="bg-[#090A0B]/85 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 font-mono text-[10px]">
                  CLICK TO PLAY 4K MASTER
                </span>
                <span className="text-[#C7F36B] font-mono text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Watch Reel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Right Strategic Breakdown & CTA (lg:col-span-6) */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Taxonomy & Concept Tag */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#C7F36B] bg-[#C7F36B]/10 px-2.5 py-1 rounded border border-[#C7F36B]/20">
                    {currentProject.category}
                  </span>
                  {brandName && (
                    <span className="text-xs font-mono text-[#F5F5F0] bg-[#171C19] px-2.5 py-1 rounded border border-[#2A332B]">
                      {brandName}
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-[#A0A89F] bg-[#171C19] px-2 py-0.5 rounded border border-[#2A332B]">
                    ANGLE: {currentProject.angle}
                  </span>
                </div>

                {/* Main Headline */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-heading text-[#F5F5F0] tracking-tight leading-snug">
                  {currentProject.title}
                </h3>

                {/* Hook Box */}
                <div className="p-4 rounded-xl bg-[#171C19] border border-[#2A332B] space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C7F36B] font-bold block">
                    First 3-Second Viral Hook:
                  </span>
                  <p className="text-xs sm:text-sm text-[#F5F5F0] leading-relaxed italic">
                    &ldquo;{currentProject.hook}&rdquo;
                  </p>
                </div>

                {/* Overview Description */}
                <p className="text-xs sm:text-sm text-[#A0A89F] leading-relaxed">
                  {currentProject.overview}
                </p>

                {/* Deliverables Pills */}
                {currentProject.keyFeatures && currentProject.keyFeatures.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-[#A0A89F]">
                    {currentProject.keyFeatures.slice(0, 3).map((feat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-[#090A0B] border border-[#2A332B]"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#2A332B] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onSelectProject(currentProject)}
                  className="px-6 py-3 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-xl transition-all shadow-md shadow-[#C7F36B]/20 flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play Video & Strategy</span>
                </button>

                {onOrderSimilar && (
                  <button
                    onClick={() => onOrderSimilar(currentProject.title)}
                    className="px-5 py-3 text-xs sm:text-sm font-semibold font-heading text-[#F5F5F0] hover:text-[#C7F36B] bg-[#171C19] hover:bg-[#1e2521] border border-[#2A332B] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request Similar Creative</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {featuredProjects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIndex
                ? 'w-8 bg-[#C7F36B]'
                : 'w-2 bg-[#2A332B] hover:bg-[#A0A89F]'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
