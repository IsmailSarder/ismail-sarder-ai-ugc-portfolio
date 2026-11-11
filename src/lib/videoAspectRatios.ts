/**
 * Video Aspect Ratio Utility
 * Handles aspect ratio detection, calculation, and presentation container styling
 * Supports all UGC and e-commerce ad formats: 9:16, 16:9, 1:1, 4:5, 3:4, 4:3, Auto, Original.
 */

export type AspectRatioOption =
  | 'auto'
  | '9:16'
  | '16:9'
  | '1:1'
  | '4:5'
  | '3:4'
  | '4:3'
  | 'original';

export interface AspectRatioConfig {
  value: AspectRatioOption;
  label: string;
  shortLabel: string;
  sublabel: string;
  ratioNum: number | null; // width / height
  cssRatio: string;
  isPortrait: boolean;
}

export const ASPECT_RATIO_OPTIONS: AspectRatioConfig[] = [
  {
    value: 'auto',
    label: 'Auto Detect (Original Ratio)',
    shortLabel: 'Auto',
    sublabel: 'Adapts to detected media dimensions',
    ratioNum: null,
    cssRatio: 'auto',
    isPortrait: true,
  },
  {
    value: '9:16',
    label: '9:16 — TikTok, Instagram Reels, YouTube Shorts',
    shortLabel: '9:16 Vertical',
    sublabel: 'Full Vertical (TikTok / Reels / Shorts)',
    ratioNum: 9 / 16,
    cssRatio: '9/16',
    isPortrait: true,
  },
  {
    value: '16:9',
    label: '16:9 — YouTube and landscape videos',
    shortLabel: '16:9 Landscape',
    sublabel: 'Widescreen (YouTube & Desktop)',
    ratioNum: 16 / 9,
    cssRatio: '16/9',
    isPortrait: false,
  },
  {
    value: '1:1',
    label: '1:1 — Square ads',
    shortLabel: '1:1 Square',
    sublabel: 'Square Feed (Meta & E-Com Carousel)',
    ratioNum: 1 / 1,
    cssRatio: '1/1',
    isPortrait: false,
  },
  {
    value: '4:5',
    label: '4:5 — Instagram feed ads',
    shortLabel: '4:5 Portrait',
    sublabel: 'Feed Portrait (Instagram In-Feed Ads)',
    ratioNum: 4 / 5,
    cssRatio: '4/5',
    isPortrait: true,
  },
  {
    value: '3:4',
    label: '3:4 — Portrait videos',
    shortLabel: '3:4 Portrait',
    sublabel: 'Standard Portrait (Mobile Web)',
    ratioNum: 3 / 4,
    cssRatio: '3/4',
    isPortrait: true,
  },
  {
    value: '4:3',
    label: '4:3 — Classic video',
    shortLabel: '4:3 Classic',
    sublabel: 'Classic Fullframe (Product Demo)',
    ratioNum: 4 / 3,
    cssRatio: '4/3',
    isPortrait: false,
  },
  {
    value: 'original',
    label: "Original — Preserve uploaded video's native dimensions",
    shortLabel: 'Original',
    sublabel: 'Preserve exact native dimensions',
    ratioNum: null,
    cssRatio: 'auto',
    isPortrait: true,
  },
];

/**
 * Given video dimensions (width, height), detects the closest standard ratio and returns clean labels.
 */
export function calculateDetectedRatio(width: number, height: number): {
  detectedRatio: string;
  closestOption: AspectRatioOption;
  label: string;
  isPortrait: boolean;
  aspectRatioValue: number;
} {
  if (!width || !height || width <= 0 || height <= 0) {
    return {
      detectedRatio: 'Auto',
      closestOption: 'auto',
      label: 'Auto Detect (Original)',
      isPortrait: true,
      aspectRatioValue: 9 / 16,
    };
  }

  const ratio = width / height;
  const isPortrait = height > width;

  const standardTargets: { option: AspectRatioOption; val: number; name: string }[] = [
    { option: '9:16', val: 9 / 16, name: '9:16' },
    { option: '3:4', val: 3 / 4, name: '3:4' },
    { option: '4:5', val: 4 / 5, name: '4:5' },
    { option: '1:1', val: 1 / 1, name: '1:1' },
    { option: '4:3', val: 4 / 3, name: '4:3' },
    { option: '16:9', val: 16 / 9, name: '16:9' },
  ];

  let closest = standardTargets[0];
  let minDiff = Math.abs(ratio - standardTargets[0].val);

  for (const target of standardTargets) {
    const diff = Math.abs(ratio - target.val);
    if (diff < minDiff) {
      minDiff = diff;
      closest = target;
    }
  }

  return {
    detectedRatio: closest.name,
    closestOption: closest.option,
    label: `${width} × ${height} (${closest.name})`,
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
  return new Promise((resolve, reject) => {
    const isFile = typeof fileOrUrl !== 'string';
    const url = isFile ? URL.createObjectURL(fileOrUrl) : fileOrUrl;
    const mimeType = isFile ? (fileOrUrl as File).type || 'video/mp4' : 'video/mp4';

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.playsInline = true;
    video.muted = true;
    video.src = url;

    const timeout = setTimeout(() => {
      cleanup();
      // Graceful fallback if timeout
      resolve({ width: 1080, height: 1920, duration: 30, mimeType });
    }, 6000);

    const cleanup = () => {
      clearTimeout(timeout);
      video.onloadedmetadata = null;
      video.onerror = null;
      if (isFile) {
        URL.revokeObjectURL(url);
      }
    };

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
 * Resolve the CSS aspect-ratio string for a project container.
 * If user chose 'auto' or 'original', calculate from width/height if available, or default to 9/16.
 */
export function getPresentationAspectRatio(
  selectedRatio?: string,
  width?: number,
  height?: number
): string {
  if (selectedRatio && selectedRatio !== 'auto' && selectedRatio !== 'original') {
    return selectedRatio.replace(':', '/');
  }

  if (width && height && width > 0 && height > 0) {
    return `${width}/${height}`;
  }

  return '9/16';
}

/**
 * Determines whether the presentation container is landscape (e.g. 16:9, 4:3)
 */
export function isLandscapeRatio(
  selectedRatio?: string,
  width?: number,
  height?: number
): boolean {
  if (selectedRatio === '16:9' || selectedRatio === '4:3') {
    return true;
  }
  if (selectedRatio === '9:16' || selectedRatio === '4:5' || selectedRatio === '3:4') {
    return false;
  }
  if (selectedRatio === '1:1') {
    return false;
  }
  if (width && height) {
    return width > height;
  }
  return false;
}
