import { PortfolioItem } from '../components/VideoModal.tsx';
import { normalizeAspectRatio } from './videoAspectRatios.ts';

export interface EnrichedCaseStudy {
  targetAudience: string;
  creativeConcept: string;
  deliverables: string[];
  advertisingHook: string;
  projectStatusLabel: 'Concept Project' | 'Client Project';
}

/**
 * Derives authentic, structured case-study metadata for any portfolio item
 * using its real title, category, brand_name, aspect ratio, duration, and description.
 * Never fabricates testimonials or fake performance metrics.
 */
export function deriveCaseStudyDetails(item: {
  title: string;
  category: string;
  brand_name?: string;
  brandName?: string;
  hook?: string;
  angle?: string;
  overview?: string;
  description?: string;
  aspect_ratio?: string;
  aspectRatio?: string;
  video_width?: number;
  videoWidth?: number;
  video_height?: number;
  videoHeight?: number;
  targetMarket?: string;
  targetAudience?: string;
  creativeConcept?: string;
  deliverables?: string[];
  keyFeatures?: string[];
}): EnrichedCaseStudy {
  const brand = (item.brand_name || item.brandName || '').trim();
  const isClientProject = Boolean(brand);
  const ratio = normalizeAspectRatio(
    item.aspect_ratio || item.aspectRatio,
    item.video_width || item.videoWidth,
    item.video_height || item.videoHeight
  );
  const titleLower = item.title.toLowerCase();
  const catLower = item.category.toLowerCase();
  const desc = (item.overview || item.description || '').trim();

  // Derive realistic target audience by category/keywords
  let targetAudience =
    item.targetAudience ||
    'DTC E-Commerce Shoppers (USA, UK, UAE, Canada & Europe)';

  if (!item.targetAudience) {
    if (catLower.includes('beauty') || catLower.includes('skincare') || titleLower.includes('serum') || titleLower.includes('skin') || titleLower.includes('body wash') || titleLower.includes('bloom')) {
      targetAudience = 'Skincare & Beauty Buyers (Ages 22–42 · USA, UK, UAE & Europe)';
    } else if (catLower.includes('fashion') || titleLower.includes('tee') || titleLower.includes('coat') || titleLower.includes('sneaker') || titleLower.includes('shoe')) {
      targetAudience = 'Modern Apparel & Footwear Consumers (USA, UK, Canada & EU)';
    } else if (catLower.includes('gadget') || catLower.includes('tech') || titleLower.includes('headphone') || titleLower.includes('beat') || titleLower.includes('charge') || titleLower.includes('ring')) {
      targetAudience = 'Everyday Tech & Audio Commuters (USA, UK, Canada & Europe)';
    } else if (titleLower.includes('perfume') || titleLower.includes('noir')) {
      targetAudience = 'Luxury Fragrance & Gift Shoppers (UAE, UK, USA & Europe)';
    } else if (catLower.includes('cgi') || catLower.includes('commercial') || catLower.includes('3d')) {
      targetAudience = 'Premium DTC Launch Audiences (USA, UK, UAE & Europe)';
    }
  }

  // Derive creative concept summary
  let creativeConcept = item.creativeConcept || '';
  if (!creativeConcept) {
    if (catLower.includes('cgi') || catLower.includes('3d') || catLower.includes('commercial')) {
      creativeConcept =
        desc ||
        'Cinematic 3D product staging with sculptural lighting, camera choreography, and luxury commercial pacing crafted to elevate perceived product value.';
    } else if (catLower.includes('demo')) {
      creativeConcept =
        desc ||
        'Clear, feature-focused product demonstration isolating key functional benefits through tight visual proof and concise storytelling.';
    } else {
      creativeConcept =
        desc ||
        'Native vertical AI UGC storytelling combining a relatable creator perspective, conversational pacing, and clear product demonstration.';
    }
  }

  // Derive advertising hook
  const advertisingHook =
    (item.hook && item.hook !== item.title ? item.hook : '') ||
    (titleLower.includes('serum')
      ? 'Visual texture reveal & relatable daily skincare opening designed to capture attention in the first 2 seconds.'
      : titleLower.includes('headphone') || titleLower.includes('beat')
      ? 'Immediate audio-comfort contrast opening built to stop tech commuters mid-scroll.'
      : titleLower.includes('perfume') || titleLower.includes('noir')
      ? 'Dramatic atmospheric lighting reveal showcasing bottle silhouette and luxury mood in the opening frame.'
      : titleLower.includes('sneaker') || titleLower.includes('run')
      ? 'High-energy kinetic motion opener highlighting footwear silhouette, sole detail, and dynamic movement.'
      : titleLower.includes('tee')
      ? 'Clean everyday fit-check opening emphasizing fabric drape, comfort, and effortless styling.'
      : `Scroll-stopping ${ratio} visual opener tailored for ${item.category} audiences.`);

  // Derive concrete deliverables
  const deliverables =
    item.deliverables && item.deliverables.length > 0
      ? item.deliverables
      : item.keyFeatures && item.keyFeatures.length > 0
      ? item.keyFeatures
      : [
          `Final ${ratio} Master Video (MP4)`,
          ratio === '16:9' ? 'Widescreen Campaign & Web Cut' : 'Social-Ready Ad Cut (Reels / TikTok / Meta)',
          'Clean & Captioned Versions',
          'Commercial Usage Rights Included',
        ];

  return {
    targetAudience,
    creativeConcept,
    deliverables,
    advertisingHook,
    projectStatusLabel: isClientProject ? 'Client Project' : 'Concept Project',
  };
}

/**
 * Enriches a PortfolioItem in-place with structured Case Study metadata
 * without overwriting any custom fields already provided.
 */
export function enrichPortfolioItem(item: PortfolioItem): PortfolioItem {
  const derived = deriveCaseStudyDetails(item);
  return {
    ...item,
    isConcept: !(item.brand_name || item.brandName),
    hook: item.hook && item.hook !== item.title ? item.hook : derived.advertisingHook,
    targetAudience: item.targetAudience || derived.targetAudience,
    creativeConcept: item.creativeConcept || derived.creativeConcept,
    deliverables: item.deliverables || derived.deliverables,
    keyFeatures: item.keyFeatures && item.keyFeatures.length > 0 ? item.keyFeatures : derived.deliverables,
  };
}
