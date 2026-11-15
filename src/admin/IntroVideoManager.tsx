import React, { useState, useEffect, useRef } from 'react';
import {
  introVideoService,
  IntroVideoSettings,
  DEFAULT_INTRO_VIDEO_SETTINGS,
} from '../services/introVideoService.ts';
import { STORAGE_BUCKETS, isSupabaseConfigured } from '../lib/supabase.ts';
import { IntroVideoPlayer } from '../components/IntroVideoSection.tsx';
import {
  Video,
  Image as ImageIcon,
  Upload,
  Check,
  AlertCircle,
  X,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  Save,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';

export const IntroVideoManager: React.FC = () => {
  const [settings, setSettings] = useState<IntroVideoSettings>(DEFAULT_INTRO_VIDEO_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState<boolean>(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    introVideoService.getIntroVideoSettings().then((data) => {
      if (active) {
        setSettings(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleVideoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/mov'];
    if (!validVideoTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
      setErrorMessage('Please select a valid MP4, WebM, or MOV video file.');
      return;
    }

    if (file.size > 200 * 1024 * 1024) {
      setErrorMessage('Video size exceeds 200MB limit.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsUploadingVideo(true);

    try {
      const previousPath = settings.video_path;
      const { path, publicUrl, error } = await introVideoService.uploadIntroVideo(file);
      if (error || !publicUrl) {
        throw new Error(
          error?.message ||
            "Video upload failed. Please make sure you are signed in and the 'portfolio-videos' bucket is configured."
        );
      }

      if (previousPath && previousPath !== path) {
        await introVideoService.deleteStorageFile(STORAGE_BUCKETS.VIDEOS, previousPath);
      }

      setSettings((prev) => ({
        ...prev,
        video_url: publicUrl,
        video_path: path,
      }));
      setSuccessMessage('Introduction video uploaded! Preview it below and click "Save & Apply Changes" to publish.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload introduction video.';
      setErrorMessage(msg);
    } finally {
      setIsUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleThumbFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validImageTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      setErrorMessage('Please select a valid JPG, PNG, or WebP thumbnail image.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Thumbnail size exceeds 15MB limit.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsUploadingThumb(true);

    try {
      const previousPath = settings.thumbnail_path;
      const { path, publicUrl, error } = await introVideoService.uploadIntroThumbnail(file);
      if (error || !publicUrl) {
        throw new Error(
          error?.message ||
            "Thumbnail upload failed. Please make sure you are signed in and the 'portfolio-thumbnails' bucket is configured."
        );
      }

      if (previousPath && previousPath !== path) {
        await introVideoService.deleteStorageFile(STORAGE_BUCKETS.THUMBNAILS, previousPath);
      }

      setSettings((prev) => ({
        ...prev,
        thumbnail_url: publicUrl,
        thumbnail_path: path,
      }));
      setSuccessMessage('Thumbnail uploaded! Preview it below and click "Save & Apply Changes".');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload thumbnail.';
      setErrorMessage(msg);
    } finally {
      setIsUploadingThumb(false);
      if (thumbInputRef.current) thumbInputRef.current.value = '';
    }
  };

  const handleRemoveVideo = async () => {
    if (settings.video_path) {
      await introVideoService.deleteStorageFile(STORAGE_BUCKETS.VIDEOS, settings.video_path);
    }
    setSettings((prev) => ({ ...prev, video_url: '', video_path: '' }));
  };

  const handleRemoveThumbnail = async () => {
    if (settings.thumbnail_path) {
      await introVideoService.deleteStorageFile(STORAGE_BUCKETS.THUMBNAILS, settings.thumbnail_path);
    }
    setSettings((prev) => ({ ...prev, thumbnail_url: '', thumbnail_path: '' }));
  };

  const handleResetCopy = () => {
    setSettings((prev) => ({
      ...prev,
      heading: DEFAULT_INTRO_VIDEO_SETTINGS.heading,
      subheading: DEFAULT_INTRO_VIDEO_SETTINGS.subheading,
      description: DEFAULT_INTRO_VIDEO_SETTINGS.description,
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await introVideoService.saveIntroVideoSettings(settings);
      if (!result.success && result.error) {
        setErrorMessage(result.error);
      } else {
        setSuccessMessage(
          result.syncedWithSupabase
            ? `Intro Video settings saved to Supabase! Section is currently ${
                settings.is_published ? 'Published (Live)' : 'Unpublished (Hidden)'
              }.`
            : 'Intro Video settings saved locally.'
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save settings.';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#A0A89F]">
        Loading Intro Video settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-xs max-w-6xl">
      {/* Top Banner */}
      <div className="bg-[#171C19] border border-[#2A332B] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold font-heading text-[#F5F5F0]">
              Homepage Intro Video Section
            </h2>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                settings.is_published
                  ? 'text-[#C7F36B] bg-[#090A0B] border-[#C7F36B]/40'
                  : 'text-amber-400 bg-[#090A0B] border-amber-500/30'
              }`}
            >
              {settings.is_published ? 'PUBLISHED ON HOMEPAGE' : 'UNPUBLISHED (HIDDEN)'}
            </span>
          </div>
          <p className="text-[#A0A89F] leading-relaxed max-w-2xl">
            Manage the &ldquo;Meet The Creator&rdquo; 16:9 introduction video displayed directly below your homepage Hero section. Upload an MP4 file or paste a video URL, customize your thumbnail and copy, preview playback, and control visibility.
          </p>
        </div>

        {/* Quick Publish / Unpublish Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() =>
              setSettings((prev) => ({ ...prev, is_published: !prev.is_published }))
            }
            className={`px-4 py-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              settings.is_published
                ? 'bg-[#C7F36B]/15 border-[#C7F36B] text-[#C7F36B]'
                : 'bg-[#111514] border-[#2A332B] text-[#A0A89F] hover:text-[#F5F5F0]'
            }`}
          >
            {settings.is_published ? (
              <>
                <Eye className="w-4 h-4" />
                <span>Section Published</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Section Hidden</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feedback Alerts */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="p-1 text-emerald-400 hover:text-emerald-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Action Error:</span>
              <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 text-rose-400 hover:text-rose-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main 2-Column Workspace */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Media Upload + Section Copy */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card 1: Video Upload / URL */}
          <div className="bg-[#111514] border border-[#2A332B] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#C7F36B]" />
                <h3 className="text-sm font-bold font-heading text-[#F5F5F0]">
                  1. Introduction Video (MP4 or URL)
                </h3>
              </div>
              {settings.video_url && (
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Video</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,.mov"
                className="hidden"
                onChange={handleVideoFileSelect}
              />
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={isUploadingVideo}
                className="px-4 py-2.5 rounded-lg bg-[#C7F36B] hover:bg-[#d6ff7d] text-[#090A0B] font-bold font-heading uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
              >
                {isUploadingVideo ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#090A0B] border-t-transparent rounded-full animate-spin" />
                    <span>Uploading Video...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>{settings.video_url ? 'Replace Video File' : 'Upload MP4 Video'}</span>
                  </>
                )}
              </button>

              <span className="text-[11px] font-mono text-[#A0A89F]">
                {isSupabaseConfigured()
                  ? `Bucket: ${STORAGE_BUCKETS.VIDEOS}`
                  : 'Local Storage Mode'}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-[#A0A89F]">
                Or Paste Direct Video URL (.mp4)
              </label>
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 text-[#A0A89F] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={settings.video_url}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, video_url: e.target.value, video_path: '' }))
                  }
                  placeholder="https://.../creator-intro.mp4"
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Thumbnail Upload / URL */}
          <div className="bg-[#111514] border border-[#2A332B] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#C7F36B]" />
                <h3 className="text-sm font-bold font-heading text-[#F5F5F0]">
                  2. Custom Video Thumbnail (16:9)
                </h3>
              </div>
              {settings.thumbnail_url && (
                <button
                  type="button"
                  onClick={handleRemoveThumbnail}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Thumbnail</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={thumbInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleThumbFileSelect}
              />
              <button
                type="button"
                onClick={() => thumbInputRef.current?.click()}
                disabled={isUploadingThumb}
                className="px-4 py-2.5 rounded-lg bg-[#171C19] hover:bg-[#1e2521] border border-[#2A332B] hover:border-[#C7F36B]/50 text-[#F5F5F0] font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
              >
                {isUploadingThumb ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#C7F36B] border-t-transparent rounded-full animate-spin" />
                    <span>Uploading Thumbnail...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3.5 h-3.5 text-[#C7F36B]" />
                    <span>
                      {settings.thumbnail_url ? 'Replace Thumbnail' : 'Upload Thumbnail Image'}
                    </span>
                  </>
                )}
              </button>

              <span className="text-[11px] font-mono text-[#A0A89F]">JPG, PNG, WebP · 16:9 recommended</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-[#A0A89F]">
                Or Paste Thumbnail Image URL
              </label>
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 text-[#A0A89F] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={settings.thumbnail_url}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      thumbnail_url: e.target.value,
                      thumbnail_path: '',
                    }))
                  }
                  placeholder="https://.../intro-thumbnail.jpg"
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Section Copy Editor */}
          <div className="bg-[#111514] border border-[#2A332B] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C7F36B]" />
                <h3 className="text-sm font-bold font-heading text-[#F5F5F0]">
                  3. Section Heading &amp; Description
                </h3>
              </div>
              <button
                type="button"
                onClick={handleResetCopy}
                className="text-[11px] text-[#A0A89F] hover:text-[#C7F36B] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Default Text</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                Section Heading
              </label>
              <input
                type="text"
                value={settings.heading}
                onChange={(e) => setSettings((prev) => ({ ...prev, heading: e.target.value }))}
                placeholder="MEET THE CREATOR"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                Subheading
              </label>
              <input
                type="text"
                value={settings.subheading}
                onChange={(e) => setSettings((prev) => ({ ...prev, subheading: e.target.value }))}
                placeholder="Creative Ideas. Powerful Visuals. Ads That Stand Out."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                value={settings.description}
                onChange={(e) => setSettings((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B] resize-none leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-4 border-t border-[#2A332B]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.is_published}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, is_published: e.target.checked }))
                  }
                  className="w-4 h-4 rounded accent-[#C7F36B]"
                />
                <span className="text-xs font-medium text-[#F5F5F0]">
                  Publish section on homepage
                </span>
              </label>

              <button
                type="submit"
                disabled={isSaving || isUploadingVideo || isUploadingThumb}
                className="px-5 py-2.5 rounded-lg bg-[#C7F36B] hover:bg-[#d6ff7d] text-[#090A0B] font-bold font-heading uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {isSaving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#090A0B] border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save &amp; Apply Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live 16:9 Section Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#111514] border border-[#2A332B] rounded-2xl p-6 space-y-5 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A332B]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C7F36B] block">
                  LIVE PREVIEW BEFORE PUBLISHING
                </span>
                <h3 className="text-sm font-bold font-heading text-[#F5F5F0] mt-0.5">
                  Homepage Section &amp; 16:9 Player Preview
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171C19] border border-[#2A332B] text-[#A0A89F]">
                16:9 ASPECT RATIO
              </span>
            </div>

            {/* Simulated Section Copy Preview */}
            <div className="text-center space-y-1.5 px-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C7F36B]">
                ● {settings.heading || DEFAULT_INTRO_VIDEO_SETTINGS.heading}
              </span>
              <h4 className="text-base sm:text-lg font-extrabold font-heading text-[#F5F5F0]">
                {settings.subheading || DEFAULT_INTRO_VIDEO_SETTINGS.subheading}
              </h4>
              <p className="text-[11px] text-[#A0A89F] leading-relaxed line-clamp-3">
                {settings.description || DEFAULT_INTRO_VIDEO_SETTINGS.description}
              </p>
            </div>

            {/* Live Interactive Player Preview */}
            <IntroVideoPlayer
              videoUrl={settings.video_url}
              thumbnailUrl={settings.thumbnail_url}
              title={settings.subheading}
            />

            {!settings.is_published && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] text-center">
                This section is currently set to <strong>Unpublished</strong> and will not appear on the public homepage until you enable &ldquo;Publish section on homepage&rdquo; and save.
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
