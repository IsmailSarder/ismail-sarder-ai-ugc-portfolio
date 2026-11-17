import { supabase, isSupabaseConfigured, TABLE_PROFILE_SETTINGS } from '../lib/supabase.ts';
import {
  heroUgcBeauty,
  portfolioTech,
  cgiLuxuryPerfume,
} from '../assets/images.ts';

export interface ServiceItemConfig {
  id: string;
  index: string;
  title: string;
  inquiryKey: string;
  route: string;
  shortTag: string;
  description: string;
  ctaText: string;
  deliverables: string[];
  platforms: string;
}

export interface CaseStudyItem {
  id: string;
  title: string;
  productCategory: string;
  targetAudience: string;
  advertisingObjective: string;
  creativeConcept: string;
  hookStrategy: string;
  productionApproach: string;
  videoUrl: string;
  thumbnailUrl: string;
  aspectRatio: string;
  duration: string;
  deliverables: string[];
  isConcept: boolean;
  clientOrBrandLabel: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  roleAndCompany: string;
  projectType: string;
  quote: string;
  verifiedDate?: string;
}

export const DEFAULT_SERVICES_CONFIG: ServiceItemConfig[] = [
  {
    id: 'ai-ugc-video-ads',
    index: '01',
    title: 'AI UGC Video Ads',
    inquiryKey: 'AI UGC Video Ads',
    route: '/ai-ugc-video-ads',
    shortTag: 'TikTok · Reels · Meta Feeds',
    description:
      'Authentic, relatable AI-generated UGC video ads structured with native smartphone framing, scroll-stopping hooks, and direct-response storytelling for e-commerce brands.',
    ctaText: 'Request a Video Ad',
    deliverables: [
      '9:16 Vertical & 4:5 Feed Masters',
      'Multiple Opening Hook Variations',
      'Burned-In Dynamic Captions & CTA',
      'Clean Caption-Free Master Files',
    ],
    platforms: 'TikTok · Instagram Reels · Meta Ads · YouTube Shorts',
  },
  {
    id: 'ai-spokesperson-ads',
    index: '02',
    title: 'AI Spokesperson Ads',
    inquiryKey: 'AI Spokesperson Ads',
    route: '/ai-spokesperson-videos',
    shortTag: 'Founder & Creator Personas',
    description:
      'Hyper-realistic AI spokesperson videos delivering crisp direct-to-camera product explanations tailored to US, UK, UAE, Canadian, Australian, and European audiences.',
    ctaText: 'Start Your Project',
    deliverables: [
      'Custom AI Presenter & Wardrobe Framing',
      'Regional English Accent & Voice Calibration',
      'Scriptwriting & Talking-Point Structure',
      'Multi-Ratio Paid Social Exports',
    ],
    platforms: 'Meta Ads · YouTube · Shopify PDPs · SaaS Onboarding',
  },
  {
    id: 'ai-product-demonstration-videos',
    index: '03',
    title: 'AI Product Demonstration Videos',
    inquiryKey: 'AI Product Demonstration Videos',
    route: '/portfolio',
    shortTag: 'Visual Proof & Feature Clarity',
    description:
      'Focused AI product demonstration creatives engineered to show product textures, key features, workflows, and everyday use-cases clearly before a buyer checks out.',
    ctaText: 'Request a Video Ad',
    deliverables: [
      'Guided Product Benefit Sequence',
      'Macro Visual & Feature Callouts',
      'Problem-to-Solution Visual Flow',
      'Commercial Ad Usage Rights',
    ],
    platforms: 'Shopify Product Pages · Meta Ads · Amazon · TikTok Shop',
  },
  {
    id: 'cgi-product-commercials',
    index: '04',
    title: 'CGI Product Commercials',
    inquiryKey: 'CGI Product Commercials',
    route: '/cgi-product-ads',
    shortTag: '3D Motion & Visual Storytelling',
    description:
      'High-impact 3D CGI product commercials crafted with studio lighting, dynamic motion choreography, liquid simulations, and sleek visual storytelling for brand launches.',
    ctaText: 'Start Your Project',
    deliverables: [
      '3D Product Reveal & Motion Choreography',
      'Studio Obsidian & Reflective Lighting',
      '16:9 Landscape + 9:16 Vertical Cutdowns',
      'Launch Hero & Paid Ad Masters',
    ],
    platforms: 'Product Launch Pages · Meta Video Ads · YouTube',
  },
  {
    id: 'beauty-and-skincare-ads',
    index: '05',
    title: 'Beauty and Skincare Ads',
    inquiryKey: 'Beauty and Skincare Ads',
    route: '/beauty-video-ads',
    shortTag: 'Skincare · Cosmetics · Wellness',
    description:
      'Sensory beauty and skincare video creatives spotlighting serum viscosity, morning routine storytelling, ingredient benefits, and authentic creator testimonials.',
    ctaText: 'Request a Video Ad',
    deliverables: [
      'Relatable Morning / Routine Hook Angles',
      'Texture & Application Storytelling',
      'Kinetic Subtitle Styling for Beauty',
      '9:16 & 4:5 Ad-Ready Exports',
    ],
    platforms: 'TikTok · Instagram Reels · Meta Beauty Campaigns',
  },
  {
    id: 'fashion-and-lifestyle-ads',
    index: '06',
    title: 'Fashion and Lifestyle Ads',
    inquiryKey: 'Fashion and Lifestyle Ads',
    route: '/fashion-video-ads',
    shortTag: 'Apparel · Accessories · DTC',
    description:
      'Editorial street-style AI UGC and lifestyle commercials showing outfit styling, fabric drape, movement transitions, and seasonal collection storytelling.',
    ctaText: 'Start Your Project',
    deliverables: [
      '3-Way Styling & Fit Narrative',
      'Fast Motion Transition Editing',
      'Music-Synced Reels & TikTok Cuts',
      'Lookbook & Paid Social Formats',
    ],
    platforms: 'Instagram Reels · TikTok · Meta Dynamic Campaigns',
  },
  {
    id: 'gadget-and-technology-ads',
    index: '07',
    title: 'Gadget and Technology Ads',
    inquiryKey: 'Gadget and Technology Ads',
    route: '/portfolio',
    shortTag: 'Hardware · Electronics · SaaS',
    description:
      'Clear, problem-focused video ads for consumer gadgets, audio gear, smart wearables, and software products that demonstrate practical value in seconds.',
    ctaText: 'Request a Video Ad',
    deliverables: [
      'Real-World Problem Pattern Interrupt',
      'Hardware Feature & Sound Contrast Cuts',
      'Clear UI / Product Value Callouts',
      '16:9, 1:1 & 9:16 Campaign Files',
    ],
    platforms: 'Meta Ads · YouTube · Tech Launch Pages',
  },
];

export const DEFAULT_CASE_STUDIES: CaseStudyItem[] = [
  {
    id: 'cs-aurelia-skincare',
    title: 'Dewy Skin Morning Routine — AI UGC Ad Concept',
    productCategory: 'Beauty & Skincare Ads',
    targetAudience: 'Women aged 22–38 in USA & UK interested in minimalist daily skincare',
    advertisingObjective:
      'Capture attention within the first 2 seconds of an algorithmic feed and communicate fast absorption without heavy multi-step routines.',
    creativeConcept:
      'A relatable AI creator films a morning mirror-check talking casually about simplifying an overly complicated 10-step routine down to one botanical serum.',
    hookStrategy:
      'Contrarian curiosity opener ("Wait, this glow without a 10-step routine?") paired with crisp burned-in captions positioned inside mobile safe zones.',
    productionApproach:
      'Custom direct-response scriptwriting, photorealistic AI creator persona synthesis, warm natural daylight color grading, and 9:16 kinetic editing.',
    videoUrl: '',
    thumbnailUrl: heroUgcBeauty,
    aspectRatio: '9:16',
    duration: '0:28',
    deliverables: [
      '9:16 Vertical Ad Master',
      '4:5 Instagram Feed Cutdown',
      '3 Opening Hook Variations',
      'Burned-in & Clean Masters',
    ],
    isConcept: true,
    clientOrBrandLabel: 'Spec Concept Project (Aurelia Botanica)',
  },
  {
    id: 'cs-elara-audio-tech',
    title: 'Commuter Silence Stress Test — AI Spokesperson & Tech Demo Concept',
    productCategory: 'Gadget & Technology Ads',
    targetAudience: 'Daily city commuters and remote workers across UK, Europe & North America',
    advertisingObjective:
      'Demonstrate noise-cancellation contrast and hardware build quality clearly without relying on complex technical jargon.',
    creativeConcept:
      'An AI tech reviewer tests matte-black wireless ANC headphones during a noisy urban commute, cutting sharply from ambient street sound to studio quiet.',
    hookStrategy:
      'Audio pattern-interrupt transition within 1.5 seconds backed by bold value callouts highlighting comfort and battery endurance.',
    productionApproach:
      'Script and sound-design architecture, photorealistic presenter framing, product close-up pacing, and dual 16:9 + 9:16 ad formatting.',
    videoUrl: '',
    thumbnailUrl: portfolioTech,
    aspectRatio: '16:9',
    duration: '0:34',
    deliverables: [
      '16:9 Widescreen Video Master',
      '9:16 Vertical Cutdown',
      'Voiceover + Foley Sound Mix',
      'Direct-Response End Card',
    ],
    isConcept: true,
    clientOrBrandLabel: 'Spec Concept Project (Elara Audio)',
  },
  {
    id: 'cs-aurora-cgi-fragrance',
    title: 'Zero-Gravity Glass Refraction — CGI Product Commercial Concept',
    productCategory: 'CGI Product Commercials',
    targetAudience: 'Luxury fragrance & gift shoppers in UAE, UK, USA, and Europe',
    advertisingObjective:
      'Elevate perceived product craftsmanship above standard studio packshots for flagship product launches.',
    creativeConcept:
      'Obsidian studio lighting with suspended micro-droplets encircling an embossed amber glass bottle before revealing the brand lockup.',
    hookStrategy:
      'Immediate macro fluid motion and golden rim light sweep that rewards visual curiosity on silent autoplay feeds.',
    productionApproach:
      '3D commercial storyboarding, refractive glass & liquid simulation choreography, high-contrast grading, and multi-ratio exports.',
    videoUrl: '',
    thumbnailUrl: cgiLuxuryPerfume,
    aspectRatio: '4:3',
    duration: '0:24',
    deliverables: [
      '16:9 Hero Commercial Master',
      '9:16 Social Cutdown',
      'Custom Sound Design & Score',
      'PDP Hero Loop Export',
    ],
    isConcept: true,
    clientOrBrandLabel: 'Spec Concept Project (Aurora Noir)',
  },
];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [];

const ROW_IDS = {
  SERVICES: 'services_config',
  CASE_STUDIES: 'case_studies_config',
  TESTIMONIALS: 'testimonials_config',
} as const;

const LOCAL_KEYS = {
  SERVICES: 'ismail_studio_services_v1',
  CASE_STUDIES: 'ismail_studio_case_studies_v1',
  TESTIMONIALS: 'ismail_studio_testimonials_v1',
} as const;

function readLocalJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeLocalJson<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

async function fetchRowPayload<T>(rowId: string): Promise<T | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from(TABLE_PROFILE_SETTINGS)
      .select('title')
      .eq('id', rowId)
      .maybeSingle();

    if (error || !data?.title) return null;
    return JSON.parse(data.title) as T;
  } catch {
    return null;
  }
}

async function saveRowPayload<T>(
  rowId: string,
  label: string,
  payload: T
): Promise<{ success: boolean; syncedWithSupabase: boolean; error: string | null }> {
  if (!supabase || !isSupabaseConfigured()) {
    return { success: true, syncedWithSupabase: false, error: null };
  }

  try {
    const { error } = await supabase.from(TABLE_PROFILE_SETTINGS).upsert({
      id: rowId,
      full_name: label,
      title: JSON.stringify(payload),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return {
        success: false,
        syncedWithSupabase: false,
        error: `Supabase save failed: ${error.message}`,
      };
    }

    return { success: true, syncedWithSupabase: true, error: null };
  } catch (err: unknown) {
    return {
      success: false,
      syncedWithSupabase: false,
      error: err instanceof Error ? err.message : 'Save failed',
    };
  }
}

export const studioContentService = {
  async getServices(): Promise<ServiceItemConfig[]> {
    const remote = await fetchRowPayload<ServiceItemConfig[]>(ROW_IDS.SERVICES);
    if (remote && Array.isArray(remote) && remote.length > 0) {
      writeLocalJson(LOCAL_KEYS.SERVICES, remote);
      return remote;
    }
    const local = readLocalJson<ServiceItemConfig[]>(LOCAL_KEYS.SERVICES);
    if (local && Array.isArray(local) && local.length > 0) {
      return local;
    }
    return DEFAULT_SERVICES_CONFIG;
  },

  async saveServices(services: ServiceItemConfig[]) {
    writeLocalJson(LOCAL_KEYS.SERVICES, services);
    return saveRowPayload(ROW_IDS.SERVICES, 'Studio Services Config', services);
  },

  async getCaseStudies(): Promise<CaseStudyItem[]> {
    const remote = await fetchRowPayload<CaseStudyItem[]>(ROW_IDS.CASE_STUDIES);
    if (remote && Array.isArray(remote) && remote.length > 0) {
      writeLocalJson(LOCAL_KEYS.CASE_STUDIES, remote);
      return remote;
    }
    const local = readLocalJson<CaseStudyItem[]>(LOCAL_KEYS.CASE_STUDIES);
    if (local && Array.isArray(local) && local.length > 0) {
      return local;
    }
    return DEFAULT_CASE_STUDIES;
  },

  async saveCaseStudies(items: CaseStudyItem[]) {
    writeLocalJson(LOCAL_KEYS.CASE_STUDIES, items);
    return saveRowPayload(ROW_IDS.CASE_STUDIES, 'Studio Case Studies Config', items);
  },

  async getTestimonials(): Promise<TestimonialItem[]> {
    const remote = await fetchRowPayload<TestimonialItem[]>(ROW_IDS.TESTIMONIALS);
    if (remote && Array.isArray(remote)) {
      writeLocalJson(LOCAL_KEYS.TESTIMONIALS, remote);
      return remote;
    }
    const local = readLocalJson<TestimonialItem[]>(LOCAL_KEYS.TESTIMONIALS);
    if (local && Array.isArray(local)) {
      return local;
    }
    return DEFAULT_TESTIMONIALS;
  },

  async saveTestimonials(items: TestimonialItem[]) {
    writeLocalJson(LOCAL_KEYS.TESTIMONIALS, items);
    return saveRowPayload(ROW_IDS.TESTIMONIALS, 'Verified Testimonials Config', items);
  },
};
