import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Film,
  Sparkles,
} from 'lucide-react';
import {
  introVideoService,
  IntroVideoSettings,
  DEFAULT_INTRO_VIDEO_SETTINGS,
} from '../services/introVideoService.ts';
import { useProfile } from '../context/ProfileContext.tsx';

interface IntroVideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const IntroVideoPlayer: React.FC<IntroVideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  title = 'Creator Introduction Video',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Reset state if videoUrl changes (e.g., live preview inside Admin Dashboard)
  useEffect(() => {
    setHasStarted(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setVideoError(false);
  }, [videoUrl]);

  // Listen to browser fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const scheduleHideControls = useCallback(() => {
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    setShowControls(true);
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2800);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, []);

  const handleTogglePlay = async () => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    if (!hasStarted) {
      setHasStarted(true);
    }

    if (video.paused || video.ended) {
      try {
        await video.play();
        setIsPlaying(true);
        scheduleHideControls();
      } catch (err) {
        console.warn('Video playback failed:', err);
      }
    } else {
      video.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isMuted || volume === 0) {
      const restoredVol = volume > 0 ? volume : 0.8;
      video.muted = false;
      video.volume = restoredVol;
      setIsMuted(false);
      setVolume(restoredVol);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
    scheduleHideControls();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const nextVol = parseFloat(e.target.value);
    const video = videoRef.current;
    setVolume(nextVol);
    if (video) {
      video.volume = nextVol;
      video.muted = nextVol === 0;
    }
    setIsMuted(nextVol === 0);
    scheduleHideControls();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const nextTime = parseFloat(e.target.value);
    const video = videoRef.current;
    if (video) {
      video.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
    scheduleHideControls();
  };

  const handleToggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if (video?.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      if (video?.webkitEnterFullscreen) {
        try {
          video.webkitEnterFullscreen();
        } catch {
          // Ignore unsupported fullscreen contexts
        }
      }
    }
  };

  // Clean Placeholder State when no video has been uploaded yet
  if (!videoUrl) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#111514] border border-[#2A332B] flex items-center justify-center shadow-2xl">
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(199,243,107,0.09) 0%, rgba(17,21,20,0.85) 55%, rgba(9,10,11,0.98) 100%)',
          }}
        />
        <div className="relative z-10 text-center px-6 py-8 max-w-md space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#171C19] border border-[#2A332B] text-[#C7F36B] flex items-center justify-center mx-auto shadow-lg shadow-[#C7F36B]/10">
            <Film className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#C7F36B]">
              <Sparkles className="w-3 h-3" /> 16:9 Studio Presentation
            </span>
            <p className="text-lg sm:text-xl font-bold font-heading text-[#F5F5F0]">
              Introduction Video Coming Soon.
            </p>
            <p className="text-xs sm:text-sm text-[#A0A89F]">
              A closer look inside my AI UGC &amp; CGI product ad creative workflow is arriving shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={scheduleHideControls}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false);
      }}
      className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-[#2A332B] hover:border-[#C7F36B]/50 transition-colors shadow-2xl select-none group"
    >
      {/* Video Element (No autoplay; clean contain scaling) */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl || undefined}
        playsInline
        preload="metadata"
        onClick={handleTogglePlay}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || 0);
          setVideoError(false);
        }}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          setIsPlaying(false);
          setShowControls(true);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setShowControls(true);
        }}
        onError={() => setVideoError(true)}
        className="w-full h-full object-contain bg-black cursor-pointer"
      />

      {/* Thumbnail Poster Overlay with Centered Play Button (until user initiates play) */}
      {!hasStarted && (
        <div
          onClick={handleTogglePlay}
          className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center bg-[#090A0B]"
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={`${title} — creator introduction video thumbnail`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          ) : (
            <div
              className="w-full h-full bg-[#111514]"
              style={{
                background:
                  'radial-gradient(circle at 50% 45%, rgba(199,243,107,0.12) 0%, rgba(17,21,20,0.92) 60%, #090A0B 100%)',
              }}
            />
          )}

          {/* Cinematic Dark Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/25 pointer-events-none" />

          {/* Centered Play Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePlay();
            }}
            aria-label="Play introduction video"
            className="relative z-10 flex flex-col items-center gap-3 focus:outline-none cursor-pointer group/play"
          >
            <span className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C7F36B] text-[#090A0B] shadow-2xl shadow-[#C7F36B]/30 transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-[#d6ff7d]">
              <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-current" />
            </span>
            <span className="px-3.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono uppercase tracking-wider text-[#F5F5F0]">
              Watch Introduction
            </span>
          </button>
        </div>
      )}

      {/* Video Load Fallback Message */}
      {videoError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 p-6 text-center">
          <p className="text-xs sm:text-sm text-rose-400">
            Unable to load video stream. Please verify the video file or URL.
          </p>
        </div>
      )}

      {/* Custom Responsive Video Control Bar (Visible once playback starts) */}
      {hasStarted && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-8 pb-3 px-3 sm:px-5 transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Scrubber Bar */}
          <div className="relative w-full mb-2.5 flex items-center">
            <div className="relative w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-[#C7F36B] transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Seek video position"
              className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-3 text-xs text-[#F5F5F0]">
            {/* Left: Play/Pause + Volume + Time */}
            <div className="flex items-center gap-2 sm:gap-3.5">
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="min-w-[36px] min-h-[36px] p-2 rounded-lg bg-white/10 hover:bg-[#C7F36B] hover:text-[#090A0B] transition-colors flex items-center justify-center cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  className="min-w-[36px] min-h-[36px] p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-[#A0A89F]" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#C7F36B]" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume"
                  className="hidden sm:block w-20 accent-[#C7F36B] cursor-pointer"
                />
              </div>

              <span className="font-mono text-[11px] text-[#A0A89F] tabular-nums">
                <span className="text-[#F5F5F0]">{formatTime(currentTime)}</span> / {formatTime(duration)}
              </span>
            </div>

            {/* Right: Fullscreen Toggle */}
            <button
              type="button"
              onClick={handleToggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="min-w-[36px] min-h-[36px] p-2 rounded-lg bg-white/10 hover:bg-[#C7F36B] hover:text-[#090A0B] transition-colors flex items-center justify-center cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface IntroVideoSectionProps {
  refreshTrigger?: number;
}

export const IntroVideoSection: React.FC<IntroVideoSectionProps> = ({ refreshTrigger = 0 }) => {
  const { effectiveProfileImage } = useProfile();
  const [settings, setSettings] = useState<IntroVideoSettings>(DEFAULT_INTRO_VIDEO_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    introVideoService.getIntroVideoSettings().then((res) => {
      if (active) {
        setSettings(res);
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, [refreshTrigger]);

  // If unpublished in Admin, hide cleanly from public homepage
  if (loaded && !settings.is_published) {
    return null;
  }

  return (
    <section
      id="intro-video"
      className="py-16 sm:py-20 lg:py-24 bg-[#090A0B] border-t border-[#2A332B] relative overflow-hidden"
    >
      {/* Subtle Studio Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[680px] h-[240px] sm:h-[360px] bg-[#C7F36B]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center mb-10 sm:mb-12"
        >
          <div className="text-xs font-semibold tracking-widest text-[#C7F36B] uppercase font-mono mb-3">
            {settings.heading || DEFAULT_INTRO_VIDEO_SETTINGS.heading}
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-[2.65rem] font-extrabold font-heading text-[#F5F5F0] tracking-tight leading-[1.12] mb-4 [text-wrap:balance]">
            {settings.subheading || DEFAULT_INTRO_VIDEO_SETTINGS.subheading}
          </h2>

          <p className="text-sm sm:text-base text-[#A0A89F] leading-relaxed font-sans max-w-2xl mx-auto">
            {settings.description || DEFAULT_INTRO_VIDEO_SETTINGS.description}
          </p>
        </motion.div>

        {/* Large Premium 16:9 Video Player Showcase Frame */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative bg-[#111514] border border-[#2A332B] rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-2xl">
            {/* Subtle Outer Rim Glow */}
            <div className="absolute -inset-1 bg-gradient-to-b from-[#C7F36B]/15 via-[#2A332B]/25 to-transparent rounded-3xl blur-md -z-10 pointer-events-none" />

            {/* Top Studio Frame Bar */}
            <div className="flex items-center justify-between px-2 pb-2.5 text-[10px] sm:text-xs font-mono text-[#A0A89F]">
              <div className="flex items-center gap-2.5">
                <img
                  src={effectiveProfileImage}
                  alt="Ismail Sarder — AI UGC Video Ads Creator portrait"
                  width={24}
                  height={24}
                  loading="lazy"
                  decoding="async"
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover object-top border border-[#C7F36B]/60"
                />
                <span className="text-[#F5F5F0] font-semibold">ISMAIL SARDER STUDIO</span>
              </div>
              <span className="text-[#C7F36B]">16:9 CREATOR INTRO</span>
            </div>

            {/* 16:9 Responsive Video Player */}
            <IntroVideoPlayer
              videoUrl={settings.video_url}
              thumbnailUrl={settings.thumbnail_url}
              title={settings.subheading || 'Meet Ismail Sarder — Creator Introduction'}
            />

            {/* Bottom Studio Metadata Bar */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 text-[10px] sm:text-xs font-mono text-[#A0A89F]">
              <span>AI UGC · AI VIDEO ADS · CGI PRODUCT COMMERCIALS</span>
              <span className="text-[#C7F36B]">CREATIVE APPROACH &amp; SERVICES</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
