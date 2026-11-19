import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Check,
} from 'lucide-react';
import { PortfolioItem } from './VideoModal.tsx';
import { getPresentationAspectRatio, normalizeAspectRatio } from '../lib/videoAspectRatios.ts';
import { deriveCaseStudyDetails } from '../lib/caseStudyEnrichment.ts';

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
  const featuredProjects = projects.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);

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
  const resolvedRatio = normalizeAspectRatio(
    currentProject.aspect_ratio || currentProject.aspectRatio,
    currentProject.video_width || currentProject.videoWidth,
    currentProject.video_height || currentProject.videoHeight
  );
  const cssAspectRatio = getPresentationAspectRatio(
    resolvedRatio,
    currentProject.video_width || currentProject.videoWidth,
    currentProject.video_height || currentProject.videoHeight
  );
  const derived = deriveCaseStudyDetails(currentProject);
  const targetAudience = currentProject.targetAudience || derived.targetAudience;
  const creativeConcept = currentProject.creativeConcept || derived.creativeConcept;
  const advertisingHook = currentProject.hook || derived.advertisingHook;
  const deliverables = currentProject.deliverables || derived.deliverables;
  const statusLabel = brandName ? 'Client Project' : 'Concept Project';

  return (
    <div
      className="relative mb-14 sm:mb-18"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-[#C7F36B]/15 text-[#C7F36B] border border-[#C7F36B]/30">
            <Zap className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold font-heading uppercase tracking-wider text-[#F5F5F0]">
            Featured Case Study Spotlight
          </span>
          <span className="text-[11px] font-mono text-[#A0A89F] hidden sm:inline-block">
            · {currentIndex + 1} of {featuredProjects.length}
          </span>
        </div>

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

      {/* Main Spotlight Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#2A332B] bg-[#171C19] shadow-2xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50, scale: 0.99 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50, scale: 0.99 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch"
          >
            {/* Left Media Preview Frame (object-contain in true ratio) */}
            <div
              onClick={() => onSelectProject(currentProject)}
              className="lg:col-span-5 relative min-h-[290px] sm:min-h-[380px] bg-[#090A0B] overflow-hidden group cursor-pointer flex items-center justify-center p-4"
            >
              <img
                src={currentProject.thumbnail}
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-125 pointer-events-none"
              />

              <div
                style={{ aspectRatio: cssAspectRatio }}
                className="relative z-10 max-h-[340px] max-w-[90%] rounded-xl overflow-hidden bg-black/75 border border-white/10 flex items-center justify-center"
              >
                <img
                  src={currentProject.thumbnail}
                  alt={`${currentProject.title} — ${currentProject.category} featured case study thumbnail`}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#090A0B]/80 via-transparent to-black/35 pointer-events-none" />

              {/* Top Overlay Strip */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono pointer-events-none z-20">
                <span className="text-[#090A0B] font-bold bg-[#C7F36B] px-2.5 py-1 rounded uppercase tracking-wider">
                  {statusLabel}
                </span>
                <span className="text-[#F5F5F0] bg-[#090A0B]/85 px-2.5 py-1 rounded border border-white/10 backdrop-blur-md">
                  {currentProject.duration || '0:30'} · {resolvedRatio}
                </span>
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#C7F36B] text-[#090A0B] flex items-center justify-center shadow-[0_0_40px_rgba(199,243,107,0.6)] group-hover:scale-110 transition-all duration-300">
                  <Play className="w-7 h-7 ml-1 fill-current" />
                </div>
              </div>
            </div>

            {/* Right Structured Case Study Breakdown */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-xs font-mono text-[#A0A89F] flex-wrap">
                  <span className="text-[#C7F36B] font-bold uppercase tracking-wider">
                    {currentProject.category}
                  </span>
                  <span aria-hidden="true" className="text-[#2A332B]">·</span>
                  <span>{statusLabel}</span>
                  {brandName && (
                    <>
                      <span aria-hidden="true" className="text-[#2A332B]">·</span>
                      <span className="text-[#F5F5F0] font-semibold">{brandName}</span>
                    </>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-heading text-[#F5F5F0] tracking-tight leading-snug">
                  {currentProject.title}
                </h3>

                {/* Target Audience & Creative Concept Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#111514] border border-[#2A332B]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#C7F36B] font-bold block mb-1">
                      Target Audience
                    </span>
                    <p className="text-[#F5F5F0] leading-relaxed">{targetAudience}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#111514] border border-[#2A332B]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#A0A89F] font-bold block mb-1">
                      Creative Concept
                    </span>
                    <p className="text-[#A0A89F] leading-relaxed line-clamp-3">{creativeConcept}</p>
                  </div>
                </div>

                {/* Advertising Hook */}
                <div className="p-4 rounded-xl bg-[#111514] border border-[#2A332B] space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C7F36B] font-bold block">
                    Advertising Hook
                  </span>
                  <p className="text-xs sm:text-sm text-[#F5F5F0] leading-relaxed italic">
                    &ldquo;{advertisingHook}&rdquo;
                  </p>
                </div>

                {/* Deliverables */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A0A89F] font-bold block mb-2">
                    Deliverables Included
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#F5F5F0]">
                    {deliverables.slice(0, 4).map((feat) => (
                      <div key={feat} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#C7F36B] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#2A332B] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onSelectProject(currentProject)}
                  className="px-6 py-3 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-xl transition-all shadow-md shadow-[#C7F36B]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch Final Video</span>
                </button>

                {onOrderSimilar && (
                  <button
                    onClick={() => onOrderSimilar(currentProject.title)}
                    className="px-5 py-3 text-xs sm:text-sm font-semibold font-heading text-[#F5F5F0] hover:text-[#C7F36B] bg-[#111514] hover:bg-[#1e2521] border border-[#2A332B] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request Similar Concept</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Indicators */}
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
