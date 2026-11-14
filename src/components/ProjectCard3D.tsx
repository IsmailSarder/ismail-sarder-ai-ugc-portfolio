import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, ArrowUpRight, Sparkles, Video, Volume2 } from 'lucide-react';
import { PortfolioItem } from './VideoModal.tsx';

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

      // Calculate tilt angles (degrees)
      const maxTilt = 12;
      const rotateX = ((mouseY - centerY) / centerY) * -maxTilt;
      const rotateY = ((mouseX - centerX) / centerX) * maxTilt;

      setTilt({ x: rotateX, y: rotateY });
      setGlare({
        x: (mouseX / rect.width) * 100,
        y: (mouseY / rect.height) * 100,
        opacity: 0.85,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.55,
        delay: (index % 3) * 0.1,
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
                  isHovered ? 1.025 : 1
                }, ${isHovered ? 1.025 : 1}, 1)`
              : undefined,
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.08s ease-out, box-shadow 0.25s ease-out, border-color 0.25s ease-out'
            : 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.45s ease-out, border-color 0.3s ease-out',
        }}
        className={`group relative bg-[#171C19] border rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer select-none h-full ${
          isHovered
            ? 'border-[#C7F36B]/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_-5px_rgba(199,243,107,0.22)]'
            : 'border-[#2A332B] shadow-[0_12px_32px_-10px_rgba(0,0,0,0.7)]'
        }`}
      >
        {/* Dynamic Specular Glare Sheen Overlay */}
        {!isTouchDevice && !prefersReducedMotion && (
          <div
            className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 rounded-2xl mix-blend-screen"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle 320px at ${glare.x}% ${glare.y}%, rgba(199, 243, 107, 0.25) 0%, rgba(245, 245, 240, 0.08) 35%, transparent 70%)`,
            }}
          />
        )}

        {/* Top 3D Media Showcase - Preserves full uncropped media with ambient backdrop */}
        <div
          className="relative aspect-[4/3] bg-[#090A0B] overflow-hidden flex items-center justify-center"
          style={{ transform: 'translateZ(15px)' }}
        >
          {/* Layer 1: Ambient Blurred Backdrop for Unused Space (Never leaves raw blank void) */}
          <img
            src={project.thumbnail}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-125 pointer-events-none"
          />

          {/* Layer 2: Full Complete Uncropped Thumbnail */}
          <img
            src={project.thumbnail}
            alt={project.title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="relative z-10 w-full h-full object-contain p-1 transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Cinematic Scrim Gradient Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#171C19]/90 via-black/20 to-black/35 pointer-events-none" />

          {/* Top Floating Badge Bar */}
          <div
            className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono pointer-events-none z-20"
            style={{ transform: 'translateZ(25px)' }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[#C7F36B] font-bold bg-[#090A0B]/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 shadow-sm">
                {project.duration || '0:30'}
              </span>
              {(project.aspect_ratio || project.aspectRatio) && (
                <span className="text-[#F5F5F0] font-bold bg-[#111514]/90 backdrop-blur-md px-2 py-1 rounded-md border border-[#2A332B] shadow-sm">
                  {project.aspect_ratio || project.aspectRatio}
                </span>
              )}
            </div>

            {project.isPlaceholder ? (
              <span className="text-[9px] font-mono text-amber-300 bg-amber-500/15 backdrop-blur-md px-2 py-1 rounded-md border border-amber-400/40 uppercase tracking-wider font-bold">
                PLACEHOLDER SLOT
              </span>
            ) : project.isConcept ? (
              <span className="text-[9px] font-mono text-[#A0A89F] bg-black/80 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 uppercase tracking-wider">
                SPEC CONCEPT
              </span>
            ) : (
              <span className="text-[9px] font-mono text-[#C7F36B] bg-[#C7F36B]/15 backdrop-blur-md px-2 py-1 rounded-md border border-[#C7F36B]/40 uppercase tracking-wider font-bold">
                CLIENT AD
              </span>
            )}
          </div>

          {/* Center Interactive 3D Play Button */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            style={{ transform: 'translateZ(40px)' }}
          >
            <div
              className={`w-14 h-14 rounded-full bg-[#C7F36B] text-[#090A0B] flex items-center justify-center shadow-[0_0_30px_rgba(199,243,107,0.5)] transition-all duration-300 ${
                isHovered
                  ? 'scale-110 opacity-100 rotate-0 shadow-[0_0_45px_rgba(199,243,107,0.8)]'
                  : 'scale-90 opacity-0 group-hover:opacity-100 -rotate-12'
              }`}
            >
              <Play className="w-6 h-6 ml-1 fill-current" />
            </div>
          </div>

          {/* Angle Tag Bottom Bar */}
          <div
            className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10"
            style={{ transform: 'translateZ(20px)' }}
          >
            <span className="text-[9px] uppercase font-mono tracking-wider text-[#A0A89F] bg-[#090A0B]/80 backdrop-blur-md px-2 py-0.5 rounded border border-[#2A332B] truncate max-w-[85%]">
              HOOK ANGLE: {project.angle}
            </span>
            <span className="text-[#C7F36B] opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card Body Details with 3D Depth */}
        <div
          className="p-5 flex-1 flex flex-col justify-between space-y-4"
          style={{ transform: 'translateZ(22px)' }}
        >
          <div className="space-y-2">
            {/* Category & Service Type Metadata (Clean unboxed typography) */}
            <div className="flex items-center gap-2 text-xs text-[#A0A89F] font-medium flex-wrap">
              <span className="text-[#C7F36B] font-semibold">{project.category}</span>
              {project.serviceType && project.serviceType !== project.category && (
                <>
                  <span aria-hidden="true" className="text-[#2A332B]">
                    ·
                  </span>
                  <span className="text-[#F5F5F0] text-[11px] font-mono">
                    {project.serviceType}
                  </span>
                </>
              )}
              {brandDisplayName && (
                <>
                  <span aria-hidden="true" className="text-[#2A332B]">
                    ·
                  </span>
                  <span className="text-[#A0A89F] font-mono text-[11px]">
                    {brandDisplayName}
                  </span>
                </>
              )}
            </div>

            {/* Title with Electric Lime Hover Reveal */}
            <h3 className="text-sm sm:text-base font-bold font-heading text-[#F5F5F0] group-hover:text-[#C7F36B] transition-colors duration-200 leading-snug line-clamp-2">
              {project.title}
            </h3>

            {/* Short Project Description */}
            <p className="text-xs text-[#A0A89F] leading-relaxed line-clamp-2">
              {project.overview || project.hook}
            </p>
          </div>

          {/* Card Footer: Action Prompt */}
          <div className="pt-3 border-t border-[#2A332B] flex items-center justify-between text-xs font-semibold text-[#A0A89F] group-hover:text-[#F5F5F0] transition-colors">
            <span className="flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-[#C7F36B]" />
              <span>{project.isPlaceholder ? 'Preview Placeholder Slot' : 'Play Video & Strategy'}</span>
            </span>
            <div className="p-1 rounded bg-[#111514] border border-[#2A332B] group-hover:border-[#C7F36B] group-hover:bg-[#C7F36B] group-hover:text-[#090A0B] transition-all duration-200">
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
