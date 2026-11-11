import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2,
  ArrowRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  AlertTriangle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import {
  getPresentationAspectRatio,
  isLandscapeRatio,
} from '../lib/videoAspectRatios.ts';

export interface PortfolioItem {
  id: string;
  title: string;
  category:
    | 'Beauty & Skincare'
    | 'Fashion & Lifestyle'
    | 'Gadgets & Technology'
    | 'Product Demonstration'
    | 'AI UGC Ads'
    | 'Product Demonstrations'
    | 'AI UGC Creator Videos';
  duration: string;
  format: string;
  thumbnail: string;
  videoUrl?: string;
  video_url?: string;
  brandName?: string;
  brand_name?: string;
  hook: string;
  angle: string;
  overview: string;
  isConcept: boolean;
  aspect_ratio?: string;
  aspectRatio?: string;
  video_width?: number;
  videoWidth?: number;
  video_height?: number;
  videoHeight?: number;
  video_mime_type?: string;
  videoMimeType?: string;
  scriptBreakdown?: {
    hook: string;
    agitation: string;
    demonstration: string;
    cta: string;
  };
  keyFeatures?: string[];
  targetMarket?: string;
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const videoSrc = item?.video_url || item?.videoUrl;
  const effectiveAspectRatio = item?.aspect_ratio || item?.aspectRatio || 'auto';
  const videoWidth = item?.video_width || item?.videoWidth;
  const videoHeight = item?.video_height || item?.videoHeight;
  const isLandscape = isLandscapeRatio(effectiveAspectRatio, videoWidth, videoHeight);

  // Safe Close Handler: immediately halts playback
  const handleClose = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    onClose();
  }, [onClose]);

  // Lock body scroll and cleanup on unmount
  useEffect(() => {
    if (item) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setHasError(false);
      setIsLoading(true);
      setCurrentTime(0);

      return () => {
        document.body.style.overflow = originalOverflow;
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      };
    }
  }, [item]);

  // Keyboard shortcut listener (Escape to close, Space to toggle play)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          handleClose();
        }
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  // Track Fullscreen state changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  if (!item) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      setIsLoading(false);
      setHasError(false);
      // Attempt auto-play gracefully (muted if browser blocks sound)
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If unmuted autoplay blocked, fall back to paused state awaiting user click
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const toggleFullscreen = () => {
    const target = playerContainerRef.current || videoRef.current;
    if (!target) return;

    if (!document.fullscreenElement) {
      if (target.requestFullscreen) {
        target.requestFullscreen().catch((err) => console.warn('FS error:', err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleMouseMovePlayer = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const brandDisplayName = item.brand_name || item.brandName;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={`relative w-full ${
          isLandscape ? 'max-w-5xl' : 'max-w-4xl'
        } bg-[#111514] border border-[#2A332B] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col transition-all duration-300`}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#2A332B] bg-[#090A0B]/90 shrink-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
            <span className="font-bold uppercase tracking-wider text-[#C7F36B]">
              {item.category}
            </span>
            <span aria-hidden="true" className="text-[#2A332B]">·</span>
            <span className="text-[#A0A89F]">{item.format || 'Native Format'}</span>
            <span aria-hidden="true" className="text-[#2A332B]">·</span>
            <span className="text-[10px] text-[#A0A89F] bg-[#171C19] border border-[#2A332B] px-1.5 py-0.5 rounded">
              {item.isConcept ? 'Spec Concept' : 'Client Campaign'}
            </span>
            {brandDisplayName && (
              <>
                <span aria-hidden="true" className="text-[#2A332B]">·</span>
                <span className="text-[#C7F36B] font-bold">
                  {brandDisplayName}
                </span>
              </>
            )}
            {effectiveAspectRatio && effectiveAspectRatio !== 'auto' && (
              <>
                <span aria-hidden="true" className="text-[#2A332B]">·</span>
                <span className="text-[10px] text-[#F5F5F0] bg-[#171C19] border border-[#C7F36B]/40 px-1.5 py-0.5 rounded font-bold">
                  RATIO: {effectiveAspectRatio}
                </span>
              </>
            )}
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19] rounded-lg transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Media Player + Strategic Blueprint */}
        <div
          className={`grid grid-cols-1 ${
            isLandscape ? 'lg:grid-cols-12' : 'lg:grid-cols-12'
          } overflow-y-auto flex-1`}
        >
          {/* Left / Primary Media Frame */}
          <div
            className={`${
              isLandscape ? 'lg:col-span-7' : 'lg:col-span-5'
            } bg-[#090A0B] p-3 sm:p-5 lg:p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[#2A332B]`}
          >
            {/* Player Container: Uses presentation aspect ratio with object-contain */}
            <div
              ref={playerContainerRef}
              onMouseMove={handleMouseMovePlayer}
              onMouseLeave={() => isPlaying && setShowControls(false)}
              className={`relative w-full ${
                isLandscape
                  ? 'max-w-[560px] aspect-video'
                  : 'max-w-[280px] sm:max-w-[300px] aspect-[9/16]'
              } rounded-2xl overflow-hidden border border-[#2A332B] shadow-2xl bg-black flex items-center justify-center group select-none`}
              style={{
                aspectRatio: getPresentationAspectRatio(
                  effectiveAspectRatio,
                  videoWidth,
                  videoHeight
                ),
                maxHeight: '70vh',
              }}
            >
              {videoSrc && !hasError ? (
                <>
                  {/* HTML5 Video Element: STRICT object-fit: contain (Never stretch or crop) */}
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    poster={item.thumbnail}
                    playsInline
                    preload="metadata"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onWaiting={() => setIsLoading(true)}
                    onCanPlay={() => setIsLoading(false)}
                    onPlaying={() => {
                      setIsPlaying(true);
                      setIsLoading(false);
                    }}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    onError={() => {
                      setHasError(true);
                      setIsLoading(false);
                    }}
                    onClick={togglePlay}
                    className="w-full h-full object-contain bg-black cursor-pointer"
                  />

                  {/* Loading Spinner Indicator */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-none z-20">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-[#C7F36B] animate-spin" />
                        <span className="text-[10px] font-mono text-[#A0A89F]">
                          Loading full video...
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Center Play Overlay Icon (when paused) */}
                  {!isPlaying && !isLoading && (
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center bg-black/35 group-hover:bg-black/50 transition-colors cursor-pointer z-10"
                      aria-label="Play video"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C7F36B] text-[#090A0B] flex items-center justify-center shadow-[0_0_35px_rgba(199,243,107,0.7)] transform group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-current" />
                      </div>
                    </button>
                  )}

                  {/* Custom Player Controls Bar */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent transition-opacity duration-300 z-20 ${
                      showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    {/* Seeking Timeline Scrubber */}
                    <div className="relative mb-2 flex items-center group/scrubber">
                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        step={0.1}
                        value={currentTime}
                        onChange={handleSeek}
                        aria-label="Video scrubber"
                        className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#C7F36B] hover:h-2 transition-all"
                        style={{
                          background: `linear-gradient(to right, #C7F36B ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`,
                        }}
                      />
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-xs text-[#F5F5F0]">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* Play/Pause */}
                        <button
                          onClick={togglePlay}
                          className="p-1.5 hover:text-[#C7F36B] transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                          aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current" />
                          )}
                        </button>

                        {/* Restart */}
                        <button
                          onClick={handleRestart}
                          className="p-1.5 text-[#A0A89F] hover:text-[#F5F5F0] transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                          title="Replay from start"
                          aria-label="Restart video"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        {/* Volume & Mute */}
                        <div className="flex items-center gap-1.5 group/vol">
                          <button
                            onClick={toggleMute}
                            className="p-1.5 hover:text-[#C7F36B] transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                          >
                            {isMuted || volume === 0 ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            aria-label="Volume slider"
                            className="w-14 sm:w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#C7F36B] hidden sm:block"
                          />
                        </div>

                        {/* Current Time / Duration */}
                        <span className="text-[11px] font-mono text-[#A0A89F] whitespace-nowrap">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Native Dimensions Tag */}
                        {videoWidth && videoHeight && (
                          <span className="hidden sm:inline-block text-[10px] font-mono text-[#A0A89F] bg-white/10 px-2 py-0.5 rounded">
                            {videoWidth}×{videoHeight}
                          </span>
                        )}

                        {/* Fullscreen Button */}
                        <button
                          onClick={toggleFullscreen}
                          className="p-1.5 hover:text-[#C7F36B] transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                          title="Toggle Fullscreen"
                          aria-label="Toggle Fullscreen"
                        >
                          {isFullscreen ? (
                            <Minimize2 className="w-4 h-4" />
                          ) : (
                            <Maximize2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Error or Fallback Poster Frame */
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-black p-4 text-center">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-contain opacity-40 blur-xs"
                  />
                  <div className="relative z-10 space-y-2 p-4 bg-black/80 rounded-xl border border-[#2A332B] max-w-xs">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                    <p className="text-xs text-[#F5F5F0] font-semibold">
                      {hasError
                        ? 'Video stream encountered an issue'
                        : 'No active video stream URL'}
                    </p>
                    <p className="text-[11px] text-[#A0A89F] font-mono">
                      Poster preview retained. Full original video will play once the stream connects.
                    </p>
                    {hasError && (
                      <button
                        onClick={() => {
                          setHasError(false);
                          setIsLoading(true);
                          if (videoRef.current) {
                            videoRef.current.load();
                          }
                        }}
                        className="px-3 py-1.5 text-xs text-[#090A0B] bg-[#C7F36B] rounded font-bold cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3 h-3" /> Retry Stream
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Video Format & Specification Line */}
            <div className="mt-3 text-center">
              <span className="text-[10px] sm:text-[11px] text-[#A0A89F] font-mono block">
                RATIO: {effectiveAspectRatio.toUpperCase()} · FORMAT: {item.format || 'Native'} · ANGLE: {item.angle || 'Direct Response'}
              </span>
            </div>
          </div>

          {/* Right Column: Creative Strategy & Performance Blueprint */}
          <div
            className={`${
              isLandscape ? 'lg:col-span-5' : 'lg:col-span-7'
            } p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-5`}
          >
            <div>
              <div className="mb-4">
                <h2
                  id="modal-title"
                  className="text-xl sm:text-2xl font-bold font-heading text-[#F5F5F0]"
                >
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#A0A89F] mt-1.5 leading-relaxed">
                  {item.overview}
                </p>
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
                    <p className="text-[#F5F5F0]">
                      {item.scriptBreakdown?.hook || item.hook || 'Opening pattern interrupt designed for high retention.'}
                    </p>
                  </div>

                  <div className="bg-[#171C19] p-3 rounded-lg border border-[#2A332B]">
                    <span className="text-[10px] font-mono text-[#A0A89F] uppercase font-bold block mb-1">
                      02. Agitation & Problem (0:03 - 0:10)
                    </span>
                    <p className="text-[#A0A89F]">
                      {item.scriptBreakdown?.agitation || 'Relatable viewer frustration and industry pain point agitation.'}
                    </p>
                  </div>

                  <div className="bg-[#171C19] p-3 rounded-lg border border-[#2A332B]">
                    <span className="text-[10px] font-mono text-[#A0A89F] uppercase font-bold block mb-1">
                      03. Demonstration & Proof (0:10 - 0:22)
                    </span>
                    <p className="text-[#A0A89F]">
                      {item.scriptBreakdown?.demonstration || 'Visceral product demonstration with authentic AI creator persona.'}
                    </p>
                  </div>

                  <div className="bg-[#171C19] p-3 rounded-lg border border-[#2A332B]">
                    <span className="text-[10px] font-mono text-[#C7F36B] uppercase font-bold block mb-1">
                      04. Direct Response CTA (0:22 - 0:28)
                    </span>
                    <p className="text-[#F5F5F0]">
                      {item.scriptBreakdown?.cta || 'Limited offer incentive with direct link in bio prompt.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deliverable Specifications */}
              <div className="mt-5 pt-4 border-t border-[#2A332B]">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#A0A89F] mb-2.5">
                  Production Assets Included
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#F5F5F0]">
                  {(item.keyFeatures || [
                    'Full-Frame Uncropped Master',
                    '3 Alternative Hook Openings',
                    'Burned-in Dynamic Captions',
                    '4K 60FPS Native Deliverables',
                  ]).map((feat) => (
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
                Target Markets:{' '}
                <span className="text-[#F5F5F0] font-medium">
                  {item.targetMarket || 'USA, UK, UAE & Europe'}
                </span>
              </div>

              <button
                onClick={() => {
                  handleClose();
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
