import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, CheckCircle2, ArrowRight } from 'lucide-react';

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Beauty & Skincare' | 'Fashion & Lifestyle' | 'Gadgets & Technology' | 'Product Demonstrations' | 'AI UGC Creator Videos';
  duration: string;
  format: string;
  thumbnail: string;
  hook: string;
  angle: string;
  overview: string;
  isConcept: boolean;
  scriptBreakdown: {
    hook: string;
    agitation: string;
    demonstration: string;
    cta: string;
  };
  keyFeatures: string[];
  targetMarket: string;
}

interface VideoModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onOrderSimilar: (itemTitle: string) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  item,
  onClose,
  onOrderSimilar,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(25);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (item) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [item]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1.5));
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 lg:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-[#111514] border border-[#2A332B] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#2A332B] bg-[#090A0B]/80 shrink-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#C7F36B] font-mono">
              {item.category}
            </span>
            <span aria-hidden="true" className="text-[#2A332B]">·</span>
            <span className="text-[10px] sm:text-xs text-[#A0A89F] font-mono">{item.format}</span>
            <span aria-hidden="true" className="text-[#2A332B]">·</span>
            <span className="text-[9px] sm:text-[10px] font-mono text-[#A0A89F] bg-[#171C19] border border-[#2A332B] px-1.5 py-0.5 rounded">
              Spec Concept
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19] rounded-md transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Media + Strategic Blueprint */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1">
          
          {/* Left Column: Interactive Video Player Simulation */}
          <div className="lg:col-span-5 bg-[#090A0B] p-4 sm:p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[#2A332B]">
            <div className="relative w-full max-w-[240px] sm:max-w-[270px] aspect-[9/16] rounded-xl overflow-hidden border border-[#2A332B] shadow-lg group">
              <img
                src={item.thumbnail}
                alt={item.title}
                loading="eager"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

              {/* Top Controls */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto">
                <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 bg-black/75 rounded text-[#C7F36B] border border-white/10">
                  {item.duration} · 4K 60FPS
                </span>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 bg-black/75 rounded-full text-white hover:bg-black transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Center Play/Pause Overlay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center focus:outline-none cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
                </div>
              </button>

              {/* Bottom Captions & Scrubber */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 space-y-1.5 pointer-events-none">
                <div className="bg-black/85 p-2 rounded text-[10px] sm:text-[11px] text-[#F5F5F0] border border-white/10">
                  <p className="font-medium line-clamp-2">&ldquo;{item.hook}&rdquo;</p>
                </div>
                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-[#C7F36B] h-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="text-[10px] sm:text-[11px] text-[#A0A89F] font-mono block">
                FORMAT: {item.format} · ANGLE: {item.angle}
              </span>
            </div>
          </div>

          {/* Right Column: Creative Strategy & Performance Blueprint */}
          <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="mb-4">
                <h2 id="modal-title" className="text-xl sm:text-2xl font-bold font-heading text-[#F5F5F0]">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#A0A89F] mt-1 leading-relaxed">{item.overview}</p>
              </div>

              {/* Script & Retention Architecture */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#C7F36B]">
                  Creative Strategy & Hook Breakdown
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="bg-[#171C19] p-3 rounded-lg border border-[#2A332B]">
                    <span className="text-[10px] font-mono text-[#C7F36B] uppercase font-bold block mb-1">
                      01. The Hook (0:00 - 0:03)
                    </span>
                    <p className="text-[#F5F5F0]">{item.scriptBreakdown.hook}</p>
                  </div>

                  <div className="bg-[#171C19] p-3 rounded-lg border border-[#2A332B]">
                    <span className="text-[10px] font-mono text-[#A0A89F] uppercase font-bold block mb-1">
                      02. Agitation & Pain Point (0:03 - 0:10)
                    </span>
                    <p className="text-[#A0A89F]">{item.scriptBreakdown.agitation}</p>
                  </div>

                  <div className="bg-[#171C19] p-3 rounded-lg border border-[#2A332B]">
                    <span className="text-[10px] font-mono text-[#A0A89F] uppercase font-bold block mb-1">
                      03. Demonstration & Sensory Proof (0:10 - 0:22)
                    </span>
                    <p className="text-[#A0A89F]">{item.scriptBreakdown.demonstration}</p>
                  </div>

                  <div className="bg-[#171C19] p-3 rounded-lg border border-[#2A332B]">
                    <span className="text-[10px] font-mono text-[#C7F36B] uppercase font-bold block mb-1">
                      04. Direct Response CTA (0:22 - 0:28)
                    </span>
                    <p className="text-[#F5F5F0]">{item.scriptBreakdown.cta}</p>
                  </div>
                </div>
              </div>

              {/* Deliverable Specifications */}
              <div className="mt-5 pt-4 border-t border-[#2A332B]">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#A0A89F] mb-2.5">
                  Production Assets Included
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#F5F5F0]">
                  {item.keyFeatures.map((feat) => (
                    <div key={feat} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C7F36B] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 border-t border-[#2A332B] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-[#A0A89F]">
                Target Markets: <span className="text-[#F5F5F0] font-medium">{item.targetMarket}</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOrderSimilar(item.title);
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                Inquire For Similar Concept
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
