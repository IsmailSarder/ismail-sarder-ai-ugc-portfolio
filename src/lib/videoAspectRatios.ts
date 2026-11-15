/**
 * Video Aspect Ratio Utility
 * Handles aspect ratio options, detection, normalization, and responsive container styling.
 * Supports: 9:16, 16:9, 1:1, 4:5, 4:3, 3:4 (with 9:16 as graceful default).
 */

export type StandardAspectRatio = '9:16' | '16:9' | '1:1' | '4:5' | '4:3' | '3:4';

export type AspectRatioOption = StandardAspectRatio | 'auto' | 'original';

export interface AspectRatioConfig {
  value: StandardAspectRatio;
  label: string;
  orientation: string;
  shortLabel: string;
  sublabel: string;
  ratioNum: number; // width / height
  cssRatio: string;
  previewWidthPx: number;
  previewHeightPx: number;
  isPortrait: boolean;
}

export const ASPECT_RATIO_OPTIONS: AspectRatioConfig[] = [
  {
    value: '9:16',
    label: '9:16 (Vertical)',
    orientation: 'Vertical',
    shortLabel: '9:16 Vertical',
    sublabel: 'TikTok, Reels, Shorts',
    ratioNum: 9 / 16,
    cssRatio: '9/16',
    previewWidthPx: 20,
    previewHeightPx: 36,
    isPortrait: true,
  },
  {
    value: '16:9',
    label: '16:9 (Landscape)',
    orientation: 'Landscape',
    shortLabel: '16:9 Landscape',
    sublabel: 'YouTube & Widescreen',
    ratioNum: 16 / 9,
    cssRatio: '16/9',
    previewWidthPx: 40,
    previewHeightPx: 22,
    isPortrait: false,
  },
  {
    value: '1:1',
    label: '1:1 (Square)',
    orientation: 'Square',
    shortLabel: '1:1 Square',
    sublabel: 'Square Feed Ads',
    ratioNum: 1,
    cssRatio: '1/1',
    previewWidthPx: 28,
    previewHeightPx: 28,
    isPortrait: false,
  },
  {
    value: '4:5',
    label: '4:5 (Portrait)',
    orientation: 'Portrait',
    shortLabel: '4:5 Portrait',
    sublabel: 'Instagram Feed Ads',
    ratioNum: 4 / 5,
    cssRatio: '4/5',
    previewWidthPx: 26,
    previewHeightPx: 32,
    isPortrait: true,
  },
  {
    value: '4:3',
    label: '4:3 (Standard)',
    orientation: 'Standard',
    shortLabel: '4:3 Standard',
    sublabel: 'Classic Product Video',
    ratioNum: 4 / 3,
    cssRatio: '4/3',
    previewWidthPx: 34,
    previewHeightPx: 26,
    isPortrait: false,
  },
  {
    value: '3:4',
    label: '3:4 (Portrait)',
    orientation: 'Portrait',
    shortLabel: '3:4 Portrait',
    sublabel: 'Social Portrait Card',
    ratioNum: 3 / 4,
    cssRatio: '3/4',
    previewWidthPx: 24,
    previewHeightPx: 32,
    isPortrait: true,
  },
];

const STANDARD_RATIO_SET = new Set<string>(['9:16', '16:9', '1:1', '4:5', '4:3', '3:4']);

/**
 * Normalizes any saved or missing aspect_ratio value to one of the 6 standard ratios,
 * defaulting gracefully to '9:16'.
 */
export function normalizeAspectRatio(
  savedRatio?: string | null,
  width?: number | null,
  height?: number | null
): StandardAspectRatio {
  const cleaned = savedRatio?.trim();
  if (cleaned && STANDARD_RATIO_SET.has(cleaned)) {
    return cleaned as StandardAspectRatio;
  }

  if ((cleaned === 'auto' || cleaned === 'original') && width && height && width > 0 && height > 0) {
    return calculateDetectedRatio(width, height).closestOption;
  }

  return '9:16';
}

/**
 * Given video dimensions (width, height), detects the closest standard ratio.
 */
export function calculateDetectedRatio(width: number, height: number): {
  detectedRatio: StandardAspectRatio;
  closestOption: StandardAspectRatio;
  label: string;
  isPortrait: boolean;
  aspectRatioValue: number;
} {
  if (!width || !height || width <= 0 || height <= 0) {
    return {
      detectedRatio: '9:16',
      closestOption: '9:16',
      label: '9:16 (Default)',
      isPortrait: true,
      aspectRatioValue: 9 / 16,
    };
  }

  const ratio = width / height;
  const isPortrait = height > width;

  let closest = ASPECT_RATIO_OPTIONS[0];
  let minDiff = Math.abs(ratio - closest.ratioNum);

  for (const target of ASPECT_RATIO_OPTIONS) {
    const diff = Math.abs(ratio - target.ratioNum);
    if (diff < minDiff) {
      minDiff = diff;
      closest = target;
    }
  }

  return {
    detectedRatio: closest.value,
    closestOption: closest.value,
    label: `${width} × ${height} (${closest.value})`,
    isPortrait,
    aspectRatioValue: ratio,
  };
}

/**
 * Extract video metadata from File or URL via offscreen HTML5 video element.
 */
export function extractVideoDimensions(
  fileOrUrl: File | string
): Promise<{ width: number; height: number; duration: number; mimeType: string }> {
  return new Promise((resolve) => {
    const isFile = typeof fileOrUrl !== 'string';
    const url = isFile ? URL.createObjectURL(fileOrUrl) : fileOrUrl;
    const mimeType = isFile ? (fileOrUrl as File).type || 'video/mp4' : 'video/mp4';

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.playsInline = true;
    video.muted = true;
    video.src = url;

    const cleanup = () => {
      clearTimeout(timeout);
      video.onloadedmetadata = null;
      video.onerror = null;
      if (isFile) {
        URL.revokeObjectURL(url);
      }
    };

    const timeout = setTimeout(() => {
      cleanup();
      resolve({ width: 1080, height: 1920, duration: 30, mimeType });
    }, 6000);

    video.onloadedmetadata = () => {
      const width = video.videoWidth || 1080;
      const height = video.videoHeight || 1920;
      const duration = video.duration || 30;
      cleanup();
      resolve({ width, height, duration, mimeType });
    };

    video.onerror = (e) => {
      cleanup();
      console.warn('Video metadata load warning:', e);
      resolve({ width: 1080, height: 1920, duration: 30, mimeType });
    };
  });
}

/**
 * Resolve the CSS aspect-ratio string for a project container (defaults cleanly to 9/16).
 */
export function getPresentationAspectRatio(
  selectedRatio?: string | null,
  width?: number | null,
  height?: number | null
): string {
  const normalized = normalizeAspectRatio(selectedRatio, width, height);
  return normalized.replace(':', '/');
}

/**
 * Determines whether the presentation container is landscape (16:9 or 4:3).
 */
export function isLandscapeRatio(
  selectedRatio?: string | null,
  width?: number | null,
  height?: number | null
): boolean {
  const normalized = normalizeAspectRatio(selectedRatio, width, height);
  return normalized === '16:9' || normalized === '4:3';
}

/**
 * Returns a clean responsive max-width Tailwind class tailored to the selected aspect ratio.
 */
export function getModalContainerMaxWidthClass(
  selectedRatio?: string | null,
  width?: number | null,
  height?: number | null
): string {
  const normalized = normalizeAspectRatio(selectedRatio, width, height);
  switch (normalized) {
    case '16:9':
      return 'max-w-[580px]';
    case '4:3':
      return 'max-w-[500px]';
    case '1:1':
      return 'max-w-[420px]';
    case '4:5':
      return 'max-w-[360px]';
    case '3:4':
      return 'max-w-[350px]';
    case '9:16':
    default:
      return 'max-w-[290px] sm:max-w-[310px]';
  }
}
