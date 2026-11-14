import React, { useState, useRef } from 'react';
import { PortfolioProject, STORAGE_BUCKETS } from '../lib/supabase.ts';
import { portfolioService } from '../lib/portfolioService.ts';
import { X, Upload, Video, Image as ImageIcon, CheckCircle, AlertCircle, Play, Eye } from 'lucide-react';

interface ProjectFormModalProps {
  project?: PortfolioProject | null;
  onClose: () => void;
  onSaved: () => void;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  project,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(project);

  const categories = [
    'AI UGC Ads',
    'AI Video Ads',
    'Beauty & Skincare',
    'Fashion & Lifestyle',
    'Gadgets & Technology',
    'Product Demonstration',
  ];

  // Form State
  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [category, setCategory] = useState(project?.category || 'Beauty & Skincare');
  const [brandName, setBrandName] = useState(project?.brand_name || '');
  const [duration, setDuration] = useState(project?.duration || '0:30');
  const [displayOrder, setDisplayOrder] = useState<number>(project?.display_order || 0);
  const [isFeatured, setIsFeatured] = useState<boolean>(project?.is_featured || false);
  const [isPublished, setIsPublished] = useState<boolean>(
    project ? project.is_published : true
  );

  // File Upload State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [existingVideoUrl, setExistingVideoUrl] = useState(project?.video_url || '');
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState(project?.thumbnail_url || '');

  // Preview State
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);

  // Upload Progress & Errors
  const [isSaving, setIsSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/mov'];
    if (!validVideoTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
      setErrorMessage('Please select a valid MP4, WebM, or MOV video file.');
      return;
    }

    if (file.size > 150 * 1024 * 1024) {
      setErrorMessage('Video size exceeds 150MB limit.');
      return;
    }

    setErrorMessage(null);
    setVideoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(objectUrl);
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validImageTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      setErrorMessage('Please select a JPG, PNG, or WebP image file.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Thumbnail size exceeds 15MB limit.');
      return;
    }

    setErrorMessage(null);
    setThumbnailFile(file);
    const objectUrl = URL.createObjectURL(file);
    setThumbnailPreviewUrl(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Project title is required.');
      return;
    }

    if (!isEditing && !videoFile && !existingVideoUrl) {
      setErrorMessage('Please upload a video file for this project.');
      return;
    }

    if (!isEditing && !thumbnailFile && !existingThumbnailUrl) {
      setErrorMessage('Please upload a thumbnail image.');
      return;
    }

    setIsSaving(true);

    try {
      let finalVideoUrl = existingVideoUrl;
      let finalVideoPath = project?.video_path || '';
      let finalThumbnailUrl = existingThumbnailUrl;
      let finalThumbnailPath = project?.thumbnail_path || '';

      // 1. Upload Video if selected
      if (videoFile) {
        setUploadStatus('Uploading video to Supabase Storage...');
        const { path, publicUrl, error } = await portfolioService.uploadFile(
          STORAGE_BUCKETS.VIDEOS,
          videoFile,
          'videos'
        );

        if (error) {
          throw new Error(`Video upload failed: ${error.message}. Please verify the 'portfolio-videos' bucket exists in Supabase Storage.`);
        }

        // If replacing an old video, delete old file to prevent orphaned storage
        if (project?.video_path && project.video_path !== path) {
          await portfolioService.deleteFile(STORAGE_BUCKETS.VIDEOS, project.video_path);
        }

        finalVideoUrl = publicUrl;
        finalVideoPath = path;
      }

      // 2. Upload Thumbnail if selected
      if (thumbnailFile) {
        setUploadStatus('Uploading thumbnail to Supabase Storage...');
        const { path, publicUrl, error } = await portfolioService.uploadFile(
          STORAGE_BUCKETS.THUMBNAILS,
          thumbnailFile,
          'thumbnails'
        );

        if (error) {
          throw new Error(`Thumbnail upload failed: ${error.message}. Please verify the 'portfolio-thumbnails' bucket exists in Supabase Storage.`);
        }

        // If replacing an old thumbnail, delete old file
        if (project?.thumbnail_path && project.thumbnail_path !== path) {
          await portfolioService.deleteFile(STORAGE_BUCKETS.THUMBNAILS, project.thumbnail_path);
        }

        finalThumbnailUrl = publicUrl;
        finalThumbnailPath = path;
      }

      // 3. Save to Database
      setUploadStatus('Saving project record to database...');

      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        brand_name: brandName.trim(),
        duration: duration.trim() || '0:30',
        video_url: finalVideoUrl,
        video_path: finalVideoPath,
        thumbnail_url: finalThumbnailUrl,
        thumbnail_path: finalThumbnailPath,
        is_featured: isFeatured,
        is_published: isPublished,
        display_order: Number(displayOrder) || 0,
      };

      if (isEditing && project) {
        const { error } = await portfolioService.updateProject(project.id, payload);
        if (error) throw error;
      } else {
        const { error } = await portfolioService.createProject(payload);
        if (error) throw error;
      }

      setIsSaving(false);
      onSaved();
    } catch (err: any) {
      setIsSaving(false);
      setErrorMessage(err.message || 'Failed to save project. Please verify Supabase tables and RLS permissions.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-[#111514] border border-[#2A332B] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A332B] bg-[#090A0B]/80 shrink-0">
          <div>
            <h2 className="text-lg font-bold font-heading text-[#F5F5F0]">
              {isEditing ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
            </h2>
            <p className="text-xs text-[#A0A89F] mt-0.5">
              Upload video and thumbnail directly to Supabase Storage & publish to live portfolio.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">Action Error:</span>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Title & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                Project Title <span className="text-[#C7F36B]">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Aurelia Botanica — Dewy Skin Viral Hook"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                Brand / Client Name (Optional)
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Aurelia Skincare"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
              />
            </div>
          </div>

          {/* Category & Duration & Display Order */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                Category <span className="text-[#C7F36B]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                Video Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="0:28"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
              Project Description & Hook Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the creative angle, target audience, and psychological hook strategy..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B] resize-none"
            />
          </div>

          {/* Media Uploads Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            
            {/* Video File Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#F5F5F0]">
                Upload Video File (MP4, WebM, MOV) {!isEditing && <span className="text-[#C7F36B]">*</span>}
              </label>

              <div
                onClick={() => videoInputRef.current?.click()}
                className="border-2 border-dashed border-[#2A332B] hover:border-[#C7F36B] bg-[#171C19] rounded-xl p-4 text-center cursor-pointer transition-colors space-y-2"
              >
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,.mov"
                  className="hidden"
                  onChange={handleVideoSelect}
                />

                {videoPreviewUrl || existingVideoUrl ? (
                  <div className="space-y-2">
                    <div className="relative aspect-[9/16] max-w-[160px] mx-auto rounded-lg overflow-hidden bg-black border border-[#2A332B]">
                      <video
                        src={videoPreviewUrl || existingVideoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] text-[#C7F36B] block">
                      {videoFile ? `Selected: ${videoFile.name}` : 'Current video loaded (Click to replace)'}
                    </span>
                  </div>
                ) : (
                  <div className="py-6 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#111514] text-[#A0A89F] flex items-center justify-center mx-auto border border-[#2A332B]">
                      <Video className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-[#F5F5F0] font-medium">Click to select video</p>
                    <p className="text-[10px] text-[#A0A89F]">Max 150MB · Native 9:16 vertical recommended</p>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Image Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#F5F5F0]">
                Upload Thumbnail Image {!isEditing && <span className="text-[#C7F36B]">*</span>}
              </label>

              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className="border-2 border-dashed border-[#2A332B] hover:border-[#C7F36B] bg-[#171C19] rounded-xl p-4 text-center cursor-pointer transition-colors space-y-2"
              >
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleThumbnailSelect}
                />

                {thumbnailPreviewUrl || existingThumbnailUrl ? (
                  <div className="space-y-2">
                    <div className="relative aspect-[4/3] max-w-[200px] mx-auto rounded-lg overflow-hidden bg-black border border-[#2A332B]">
                      <img
                        src={thumbnailPreviewUrl || existingThumbnailUrl}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] text-[#C7F36B] block">
                      {thumbnailFile ? `Selected: ${thumbnailFile.name}` : 'Current thumbnail loaded (Click to replace)'}
                    </span>
                  </div>
                ) : (
                  <div className="py-6 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#111514] text-[#A0A89F] flex items-center justify-center mx-auto border border-[#2A332B]">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-[#F5F5F0] font-medium">Click to select image</p>
                    <p className="text-[10px] text-[#A0A89F]">JPG, PNG, WebP · Max 15MB</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Toggle Switches */}
          <div className="pt-4 border-t border-[#2A332B] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C7F36B] accent-[#C7F36B]"
                />
                <span className="text-xs text-[#F5F5F0] font-medium">
                  Publish to Live Portfolio
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C7F36B] accent-[#C7F36B]"
                />
                <span className="text-xs text-[#F5F5F0] font-medium">
                  Mark as Featured Concept
                </span>
              </label>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#2A332B] flex items-center justify-between">
            <span className="text-[11px] text-[#A0A89F]">
              {isSaving && uploadStatus ? uploadStatus : 'All media uploaded securely to Supabase Storage'}
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold text-[#A0A89F] hover:text-[#F5F5F0] rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 min-h-[38px]"
              >
                {isSaving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#090A0B] border-t-transparent rounded-full animate-spin" />
                    <span>Saving Project...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Save Changes' : 'Publish Project'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
