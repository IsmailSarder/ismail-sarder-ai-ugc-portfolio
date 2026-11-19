import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, ArrowUpRight, Sparkles, Video } from 'lucide-react';
import { PortfolioItem } from './VideoModal.tsx';
import { getPresentationAspectRatio, normalizeAspectRatio } from '../lib/videoAspectRatios.ts';
import { deriveCaseStudyDetails } from '../lib/caseStudyEnrichment.ts';

interface ProjectCard3DProps {
  project: PortfolioItem;
  index: number;
  onSelect: (project: PortfolioItem) => void;
}

export const ProjectCard3D: React.FC<ProjectCard3DProps> = ({ project, index, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchDevice || prefersReducedMotion || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const maxTilt = 10;
      const rotateX = ((mouseY - centerY) / centerY) * -maxTilt;
      const rotateY = ((mouseX - centerX) / centerX) * maxTilt;

      setTilt({ x: rotateX, y: rotateY });
      setGlare({
        x: (mouseX / rect.width) * 100,
        y: (mouseY / rect.height) * 100,
        opacity: 0.75,
      });
    },
    [isTouchDevice, prefersReducedMotion]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const brandDisplayName = project.brand_name || project.brandName;
  const resolvedRatio = normalizeAspectRatio(
    project.aspect_ratio || project.aspectRatio,
    project.video_width || project.videoWidth,
    project.video_height || project.videoHeight
  );
  const cssAspectRatio = getPresentationAspectRatio(
    resolvedRatio,
    project.video_width || project.videoWidth,
    project.video_height || project.videoHeight
  );
  const derived = deriveCaseStudyDetails(project);
  const targetAudience = project.targetAudience || derived.targetAudience;
  const advertisingHook = project.hook || derived.advertisingHook;
  const creativeConcept = project.creativeConcept || derived.creativeConcept;
  const deliverables = project.deliverables || derived.deliverables;
  const statusLabel = brandDisplayName ? 'Client Project' : 'Concept Project';

  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: 0.45,
        delay: (index % 3) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="perspective-1000 h-full"
    >
      <div
        ref={cardRef}
        onClick={() => onSelect(project)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            !isTouchDevice && !prefersReducedMotion
              ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${
                  isHovered ? 1.02 : 1
                }, ${isHovered ? 1.02 : 1}, 1)`
              : undefined,
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.08s ease-out, box-shadow 0.25s ease-out, border-color 0.25s ease-out'
            : 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.45s ease-out, border-color 0.3s ease-out',
        }}
        className={`group relative bg-[#171C19] border rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer select-none h-full ${
          isHovered
            ? 'border-[#C7F36B]/80 shadow-[0_24px_54px_-15px_rgba(0,0,0,0.9),0_0_30px_-6px_rgba(199,243,107,0.2)]'
            : 'border-[#2A332B] shadow-[0_12px_32px_-10px_rgba(0,0,0,0.7)]'
        }`}
      >
        {/* Dynamic Specular Glare Sheen Overlay */}
        {!isTouchDevice && !prefersReducedMotion && (
          <div
            className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 rounded-2xl mix-blend-screen"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle 320px at ${glare.x}% ${glare.y}%, rgba(199, 243, 107, 0.22) 0%, rgba(245, 245, 240, 0.06) 35%, transparent 70%)`,
            }}
          />
        )}

        {/* Top Media Stage — Honors Exact Saved Aspect Ratio with object-contain */}
        <div
          className="relative h-60 sm:h-64 bg-[#090A0B] overflow-hidden flex items-center justify-center p-2.5"
          style={{ transform: 'translateZ(15px)' }}
        >
          {/* Ambient Blurred Backdrop */}
          <img
            src={project.thumbnail}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-125 pointer-events-none"
          />

          {/* Proportional Aspect-Ratio Frame */}
          <div
            style={{ aspectRatio: cssAspectRatio }}
            className="relative z-10 h-full max-w-full rounded-lg overflow-hidden bg-black/70 border border-white/10 flex items-center justify-center"
          >
            <img
              src={project.thumbnail}
              alt={`${project.title} — ${project.category} video ad thumbnail`}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#171C19]/90 via-black/15 to-black/35 pointer-events-none" />

          {/* Minimal Overlay Metadata: Duration + Aspect Ratio on left, Origin Status on right */}
          <div
            className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono pointer-events-none z-20"
            style={{ transform: 'translateZ(25px)' }}
          >
            <span className="text-[#F5F5F0] font-semibold bg-[#090A0B]/85 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 tabular-nums">
              {project.duration || '0:30'} · {resolvedRatio}
            </span>

            <span
              className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border backdrop-blur-md ${
                brandDisplayName
                  ? 'text-[#090A0B] bg-[#C7F36B] border-[#C7F36B] font-bold'
                  : 'text-[#F5F5F0] bg-[#090A0B]/85 border-white/15'
              }`}
            >
              {statusLabel}
            </span>
          </div>

          {/* Center Play Button */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            style={{ transform: 'translateZ(40px)' }}
          >
            <div
              className={`w-14 h-14 rounded-full bg-[#C7F36B] text-[#090A0B] flex items-center justify-center shadow-[0_0_30px_rgba(199,243,107,0.5)] transition-all duration-300 ${
                isHovered
                  ? 'scale-110 opacity-100 shadow-[0_0_45px_rgba(199,243,107,0.8)]'
                  : 'scale-95 opacity-90 sm:opacity-0 group-hover:opacity-100'
              }`}
            >
              <Play className="w-6 h-6 ml-0.5 fill-current" />
            </div>
          </div>
        </div>

        {/* Structured Case Study Card Body */}
        <div
          className="p-5 flex-1 flex flex-col justify-between space-y-4"
          style={{ transform: 'translateZ(22px)' }}
        >
          <div className="space-y-3">
            {/* Category & Brand Line */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#A0A89F] flex-wrap">
              <span className="text-[#C7F36B] font-semibold uppercase tracking-wider">
                {project.category}
              </span>
              {brandDisplayName && (
                <>
                  <span aria-hidden="true" className="text-[#2A332B]">·</span>
                  <span className="text-[#F5F5F0]">{brandDisplayName}</span>
                </>
              )}
            </div>

            {/* Project Title */}
            <h3 className="text-sm sm:text-base font-bold font-heading text-[#F5F5F0] group-hover:text-[#C7F36B] transition-colors duration-200 leading-snug line-clamp-2">
              {project.title}
            </h3>

            {/* Creative Concept */}
            <p className="text-xs text-[#A0A89F] leading-relaxed line-clamp-2">
              {creativeConcept}
            </p>

            {/* Structured Case Study Specs */}
            <div className="pt-2.5 border-t border-[#2A332B]/70 space-y-1.5 text-[11px]">
              <div className="flex items-start gap-2">
                <span className="font-mono text-[#A0A89F] uppercase shrink-0 w-[68px]">
                  Audience:
                </span>
                <span className="text-[#F5F5F0] line-clamp-1">{targetAudience}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-[#C7F36B] uppercase shrink-0 w-[68px]">
                  Ad Hook:
                </span>
                <span className="text-[#A0A89F] line-clamp-2 italic">&ldquo;{advertisingHook}&rdquo;</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-[#A0A89F] uppercase shrink-0 w-[68px]">
                  Delivers:
                </span>
                <span className="text-[#F5F5F0] line-clamp-1">
                  {deliverables.slice(0, 2).join(' · ')}
                </span>
              </div>
            </div>
          </div>

          {/* Card Footer Action */}
          <div className="pt-3 border-t border-[#2A332B] flex items-center justify-between text-xs font-semibold text-[#A0A89F] group-hover:text-[#F5F5F0] transition-colors">
            <span className="flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-[#C7F36B]" />
              <span>Watch Final Video &amp; Case Study</span>
            </span>
            <div className="p-1.5 rounded bg-[#111514] border border-[#2A332B] group-hover:border-[#C7F36B] group-hover:bg-[#C7F36B] group-hover:text-[#090A0B] transition-all duration-200">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
