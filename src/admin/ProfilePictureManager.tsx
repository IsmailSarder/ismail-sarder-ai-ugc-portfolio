import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useProfile } from '../context/ProfileContext.tsx';
import {
  Upload,
  Camera,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Check,
  AlertCircle,
  X,
  Sparkles,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Move,
} from 'lucide-react';
import { isSupabaseConfigured, BUCKET_PROFILE_IMAGES } from '../lib/supabase.ts';

export const ProfilePictureManager: React.FC = () => {
  const {
    effectiveProfileImage,
    profileImageUrl,
    profileImagePath,
    isCustomImage,
    uploadProfilePicture,
    deleteProfilePicture,
    isLoading: isProfileLoading,
  } = useProfile();

  // File selection & raw preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  // Cropping State
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Progress & Notifications
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Deletion Confirmation Modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // References
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-clear success message after 6 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      setErrorMessage('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB. Please choose a smaller image.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setSelectedFile(file);

    // Read file for cropping preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setRawImageSrc(event.target?.result as string);
      // Reset cropping parameters
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  // Drag pan handlers (Mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Drag pan handlers (Touch for Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleResetCrop = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setRawImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Generate cropped image Blob from Canvas
  const generateCroppedBlob = useCallback(async (): Promise<Blob | null> => {
    if (!rawImageSrc || !imageRef.current) return null;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const outputSize = 800; // High-resolution output for crisp retina display
        canvas.width = outputSize;
        canvas.height = outputSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Translate to canvas center
        ctx.translate(outputSize / 2, outputSize / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        // Calculate aspect ratios & scaling
        const containerSize = 280; // Size of the crop preview viewport in UI
        const scaleFactor = outputSize / containerSize;

        // Apply pan and zoom
        const drawWidth = (img.width / img.height >= 1 ? containerSize * (img.width / img.height) : containerSize) * zoom * scaleFactor;
        const drawHeight = (img.height / img.width >= 1 ? containerSize * (img.height / img.width) : containerSize) * zoom * scaleFactor;

        const drawX = pan.x * scaleFactor - drawWidth / 2;
        const drawY = pan.y * scaleFactor - drawHeight / 2;

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          0.92
        );
      };
      img.src = rawImageSrc;
    });
  }, [rawImageSrc, zoom, rotation, pan]);

  // Execute Upload
  const handleUploadAndSave = async () => {
    if (!selectedFile || !rawImageSrc) return;

    setIsUploading(true);
    setUploadProgress(10);
    setStatusMessage('Preparing & cropping high-resolution image...');
    setErrorMessage(null);

    try {
      const croppedBlob = await generateCroppedBlob();
      if (!croppedBlob) {
        throw new Error('Could not render cropped image canvas.');
      }

      setStatusMessage('Uploading to Supabase Storage bucket: profile-images...');
      setUploadProgress(40);

      const result = await uploadProfilePicture(croppedBlob, (p) => {
        setUploadProgress(p);
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to upload profile picture.');
      }

      setUploadProgress(100);
      setStatusMessage('Profile picture successfully updated!');
      setSuccessMessage('Your profile picture has been updated and is now live across the entire website!');
      setSelectedFile(null);
      setRawImageSrc(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Action
  const handleDeletePicture = async () => {
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      const result = await deleteProfilePicture();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete profile picture.');
      }
      setShowDeleteConfirm(false);
      setSuccessMessage('Custom profile picture deleted. The website has reverted to the default studio portrait.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      setErrorMessage(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-xs max-w-5xl">
      {/* Top Banner / Description */}
      <div className="bg-[#171C19] border border-[#2A332B] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-heading text-[#F5F5F0]">
              Profile Picture Management
            </h2>
            <span className="text-[10px] font-mono text-[#C7F36B] bg-[#090A0B] border border-[#2A332B] px-2 py-0.5 rounded">
              LIVE SYNC
            </span>
          </div>
          <p className="text-[#A0A89F] leading-relaxed max-w-2xl">
            Upload, crop, and manage your official studio headshot. Changes are automatically synchronized across the Homepage Hero, About Me portrait, and all client-facing sections.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-[#A0A89F] flex items-center gap-1.5 bg-[#111514] border border-[#2A332B] px-3 py-1.5 rounded-lg">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured() ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {isSupabaseConfigured() ? `Storage: ${BUCKET_PROFILE_IMAGES}` : 'Local Cache Mode'}
          </span>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-start justify-between gap-3 animate-fade-in">
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
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-start justify-between gap-3 animate-fade-in">
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

      {/* Main 2-Column Split: Current Status & Cropper/Uploader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Current Active Picture & Status Card */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-[#111514] border border-[#2A332B] rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A0A89F]">
              Current Active Portrait
            </span>

            {/* Profile Avatar Frame with Lime Glow */}
            <div className="relative group">
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-[#2A332B] group-hover:border-[#C7F36B] transition-colors shadow-2xl bg-[#090A0B]">
                <img
                  src={effectiveProfileImage}
                  alt="Ismail Sarder Active Profile"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Status Badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full text-[9px] font-mono border shadow-md font-bold uppercase tracking-wider bg-[#090A0B] text-[#C7F36B] border-[#2A332B]">
                {isCustomImage ? 'Custom Headshot' : 'Default Studio Headshot'}
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-bold font-heading text-[#F5F5F0]">
                Ismail Sarder
              </h3>
              <p className="text-[11px] text-[#A0A89F] mt-0.5">
                AI UGC Ad Creator & Creative Strategist
              </p>
            </div>

            {/* Picture Details */}
            <div className="w-full pt-3 border-t border-[#2A332B] text-left space-y-2 text-[11px] font-mono text-[#A0A89F]">
              <div className="flex items-center justify-between">
                <span>Display Status:</span>
                <span className="text-[#F5F5F0]">
                  {isCustomImage ? 'Uploaded & Active' : 'Default Asset'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Storage Bucket:</span>
                <span className="text-[#C7F36B]">profile-images</span>
              </div>
              {profileImagePath && (
                <div className="flex items-center justify-between truncate">
                  <span>File Path:</span>
                  <span className="text-[#F5F5F0] truncate max-w-[150px]" title={profileImagePath}>
                    {profileImagePath}
                  </span>
                </div>
              )}
            </div>

            {/* Actions for Current Picture */}
            <div className="w-full pt-2 flex flex-col gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Camera className="w-4 h-4" />
                <span>Upload New Picture</span>
              </button>

              {isCustomImage && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-2 px-3 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/25 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Custom Picture</span>
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Guidelines Info Card */}
          <div className="bg-[#111514] border border-[#2A332B] rounded-xl p-4 space-y-2 text-[11px] text-[#A0A89F]">
            <span className="text-[#F5F5F0] font-semibold block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C7F36B]" />
              Headshot Guidelines:
            </span>
            <ul className="list-disc pl-4 space-y-1">
              <li>Use high-resolution photos with good lighting.</li>
              <li>Square or vertical composition works best.</li>
              <li>Our built-in cropper allows zooming and repositioning before saving.</li>
              <li>Max file size: 10MB (JPG, PNG, or WebP).</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Interactive Cropping Workspace or Dropzone */}
        <div className="lg:col-span-8">
          {rawImageSrc ? (
            /* ACTIVE CROPPER & REPOSITION WORKSPACE */
            <div className="bg-[#111514] border border-[#2A332B] rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#2A332B]">
                <div>
                  <h3 className="text-sm font-bold font-heading text-[#F5F5F0]">
                    Crop & Reposition Image
                  </h3>
                  <p className="text-[11px] text-[#A0A89F] mt-0.5">
                    Drag the image to reposition. Use the zoom slider and rotation tools to frame your portrait.
                  </p>
                </div>

                <button
                  onClick={handleCancel}
                  disabled={isUploading}
                  className="p-1.5 text-[#A0A89F] hover:text-[#F5F5F0] cursor-pointer"
                  title="Cancel crop"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Interactive Viewport Area */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
                {/* Main Interactive Pan/Zoom Frame */}
                <div className="relative">
                  <div
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-2xl overflow-hidden bg-[#090A0B] border-2 border-dashed border-[#C7F36B]/60 cursor-grab active:cursor-grabbing select-none shadow-2xl flex items-center justify-center"
                  >
                    {/* The transformable image */}
                    <img
                      ref={imageRef}
                      src={rawImageSrc}
                      alt="Crop Preview"
                      style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                      }}
                      className="max-w-none pointer-events-none select-none max-h-none"
                    />

                    {/* Circular Mask Overlay */}
                    <div className="absolute inset-0 pointer-events-none rounded-full border-2 border-[#C7F36B] shadow-[0_0_0_9999px_rgba(9,10,11,0.65)]" />

                    {/* Crosshair / Center guide */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                      <div className="w-full h-[1px] bg-white/40" />
                      <div className="h-full w-[1px] bg-white/40 absolute" />
                    </div>

                    {/* Drag Hint Tag */}
                    <div className="absolute top-2 left-2 text-[9px] font-mono bg-black/75 text-[#A0A89F] px-2 py-0.5 rounded border border-white/10 pointer-events-none flex items-center gap-1">
                      <Move className="w-3 h-3 text-[#C7F36B]" />
                      <span>Drag to Reposition</span>
                    </div>
                  </div>
                </div>

                {/* Live Output Previews (Circular & Square) */}
                <div className="flex flex-col items-center gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A0A89F]">
                    Live Previews
                  </span>

                  {/* 1. Circular Avatar (Hero / Header) */}
                  <div className="text-center space-y-1">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#C7F36B] shadow-lg bg-[#090A0B] mx-auto relative">
                      <img
                        src={rawImageSrc}
                        alt="Circle preview"
                        style={{
                          transform: `translate(${pan.x * 0.25}px, ${pan.y * 0.25}px) scale(${zoom}) rotate(${rotation}deg)`,
                          transformOrigin: 'center center',
                        }}
                        className="max-w-none w-[80px] h-[80px] object-cover pointer-events-none"
                      />
                    </div>
                    <span className="text-[9px] font-mono text-[#A0A89F] block">Hero Avatar</span>
                  </div>

                  {/* 2. Square Portrait (About section) */}
                  <div className="text-center space-y-1">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#2A332B] shadow-lg bg-[#090A0B] mx-auto relative">
                      <img
                        src={rawImageSrc}
                        alt="Square preview"
                        style={{
                          transform: `translate(${pan.x * 0.25}px, ${pan.y * 0.25}px) scale(${zoom}) rotate(${rotation}deg)`,
                          transformOrigin: 'center center',
                        }}
                        className="max-w-none w-[80px] h-[80px] object-cover pointer-events-none"
                      />
                    </div>
                    <span className="text-[9px] font-mono text-[#A0A89F] block">About Section</span>
                  </div>
                </div>
              </div>

              {/* Controls Bar: Zoom, Rotate, Reset */}
              <div className="p-4 rounded-xl bg-[#171C19] border border-[#2A332B] space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Zoom Slider */}
                  <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                    <ZoomOut className="w-4 h-4 text-[#A0A89F] shrink-0" />
                    <input
                      type="range"
                      min="1"
                      max="3.5"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-[#C7F36B] cursor-pointer"
                    />
                    <ZoomIn className="w-4 h-4 text-[#A0A89F] shrink-0" />
                    <span className="text-[11px] font-mono text-[#C7F36B] w-12 text-right">
                      {zoom.toFixed(2)}x
                    </span>
                  </div>

                  {/* Rotate and Reset */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleRotate}
                      className="px-3 py-1.5 rounded-lg bg-[#111514] border border-[#2A332B] text-[#F5F5F0] hover:border-[#C7F36B] transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Rotate 90 degrees"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Rotate 90°</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetCrop}
                      className="px-3 py-1.5 rounded-lg bg-[#111514] border border-[#2A332B] text-[#A0A89F] hover:text-[#F5F5F0] transition-colors cursor-pointer"
                      title="Reset Position"
                    >
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Upload Progress Bar if active */}
                {isUploading && (
                  <div className="space-y-2 pt-2 border-t border-[#2A332B] animate-fade-in">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#A0A89F] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#C7F36B] animate-ping" />
                        {statusMessage}
                      </span>
                      <span className="text-[#C7F36B] font-bold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#090A0B] overflow-hidden border border-[#2A332B]">
                      <div
                        className="h-full bg-gradient-to-r from-[#C7F36B] to-[#b6f043] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isUploading}
                    className="px-4 py-2 text-xs font-semibold text-[#A0A89F] hover:text-[#F5F5F0] rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleUploadAndSave}
                    disabled={isUploading}
                    className="px-5 py-2.5 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] disabled:opacity-50 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    {isUploading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-[#090A0B] border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Confirm Crop & Upload</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* EMPTY STATE / FILE DROPZONE */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#111514] border-2 border-dashed border-[#2A332B] hover:border-[#C7F36B] rounded-2xl p-10 sm:p-14 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer transition-all duration-300 group min-h-[380px]"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#171C19] border border-[#2A332B] group-hover:border-[#C7F36B]/60 text-[#A0A89F] group-hover:text-[#C7F36B] flex items-center justify-center transition-colors">
                <Upload className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold font-heading text-[#F5F5F0] group-hover:text-[#C7F36B] transition-colors">
                  Choose or Drop Your Profile Picture
                </h4>
                <p className="text-xs text-[#A0A89F] max-w-sm">
                  Click to browse from your device or mobile camera, or drag and drop an image file here.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-[10px] font-mono text-[#A0A89F] bg-[#171C19] px-3 py-1 rounded-full border border-[#2A332B]">
                <span>Supported: JPG, PNG, WebP</span>
                <span>·</span>
                <span>Max: 10MB</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#111514] border border-[#2A332B] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-heading text-[#F5F5F0]">
                Delete Custom Profile Picture?
              </h3>
            </div>

            <p className="text-xs text-[#A0A89F] leading-relaxed">
              Are you sure you want to delete your custom uploaded profile picture? This will delete the file from the <code className="text-[#C7F36B]">profile-images</code> Supabase Storage bucket and revert all website sections to the default studio portrait.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2A332B]">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs text-[#A0A89F] hover:text-[#F5F5F0] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePicture}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold font-heading uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Picture</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
