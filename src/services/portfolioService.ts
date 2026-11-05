import { supabase, isSupabaseConfigured } from '../lib/supabase.ts';
import { PortfolioItem } from '../components/VideoModal.tsx';

export const INITIAL_SEED_PROJECTS: PortfolioItem[] = [
  {
    id: 'aurelia-serum',
    title: 'Aurelia Botanica — Dewy Skin Viral Hook',
    category: 'Beauty & Skincare',
    duration: '0:28',
    format: '9:16 Vertical Video',
    thumbnail: '/src/assets/images/hero_ugc_beauty_showcase_1793804788830.jpg',
    videoUrl: '',
    hook: 'Wait, this glow without a 10-step routine? Honestly obsessed...',
    angle: 'Relatable Problem-to-Solution',
    isConcept: true,
    overview: 'High-converting TikTok and Instagram Reels ad creative engineered for a luxury botanical skincare brand targeting US and UK female demographics aged 22-38.',
    scriptBreakdown: {
      hook: 'Close-up camera tap, unfiltered morning natural skin, unexpected opening statement cutting through skincare skepticism.',
      agitation: 'Calling out the exhausting 10-step glass skin routine that clogs pores and wastes $200+ monthly.',
      demonstration: 'Texture application demonstration showing immediate hydration sheen with zero sticky residue.',
      cta: 'Limited first-batch 20% discount offer with direct link in bio.',
    },
    keyFeatures: [
      '3 Alternative Hook Openings',
      'Burned-in Dynamic Kinetic Captions',
      'TikTok & Reels Sound Optimized',
      '9:16 + 4:5 Feed Master Deliverables',
    ],
    targetMarket: 'USA & United Kingdom',
  },
  {
    id: 'botanica-macro-demo',
    title: 'Botanica Facial Illumination — Macro Product Demo',
    category: 'Product Demonstrations',
    duration: '0:22',
    format: '4:5 Feed & 9:16 Story',
    thumbnail: '/src/assets/images/portfolio_skincare_glow_1793804789975.jpg',
    video_url: '',
    hook: 'Watch what happens when cold-pressed botanicals touch dehydrated skin...',
    angle: 'Sensory ASMR & Texture Proof',
    isConcept: true,
    overview: 'Photorealistic AI product demonstration highlighting active ingredients, viscosity, and instant epidermal absorption with studio-grade lighting.',
    scriptBreakdown: {
      hook: 'Slow-motion macro droplet suspension with crisp ASMR dropper sound.',
      agitation: 'Why standard water-based moisturizers evaporate within 40 minutes.',
      demonstration: 'Split-screen hydration meter demonstration and cellular barrier simulation.',
      cta: 'Claim clinical trial trial kit before current batch sells out.',
    },
    keyFeatures: [
      'Macro Texture Cinematography',
      'Cellular Absorption Simulation',
      'Clean Studio Travertine Staging',
      'High-Retention Sound Design',
    ],
    targetMarket: 'USA, UAE & Canada',
  },
  {
    id: 'elara-anc-headphones',
    title: 'Elara ANC Pro — Commuter Noise-Cancellation Demo',
    category: 'Gadgets & Technology',
    duration: '0:34',
    format: '9:16 Vertical Video',
    thumbnail: '/src/assets/images/portfolio_tech_audio_1793804790153.jpg',
    video_url: '',
    hook: 'I tested these on the London Tube and my entire brain went quiet...',
    angle: 'Real-World Commute Stress Test',
    isConcept: true,
    overview: 'Authentic tech creator unboxing and real-time noise cancellation test engineered to outperform competitor ads across Meta and YouTube Shorts.',
    scriptBreakdown: {
      hook: 'Loud screeching subway background instantly cuts to absolute studio silence upon placing headphones on ears.',
      agitation: 'Tired of overpaying $400 for bulky plastic headphones with 4-hour battery life.',
      demonstration: 'Tap-to-transparency mode switch, industrial matte build showcase, 60-hour battery stress test.',
      cta: 'Tap below to unlock 30-day risk-free commuter trial.',
    },
    keyFeatures: [
      'Binaural Sound Cut Pattern Interrupt',
      'Authentic Streetwear Tech Persona',
      'Exploded View Driver Architecture',
      'Direct Comparison vs Legacy Audio Brands',
    ],
    targetMarket: 'UK, Germany & Australia',
  },
  {
    id: 'nomad-atelier-trench',
    title: 'Nomad Atelier — Minimalist Capsule Wardrobe UGC',
    category: 'Fashion & Lifestyle',
    duration: '0:25',
    format: '9:16 TikTok / Reels',
    thumbnail: '/src/assets/images/portfolio_fashion_street_1793804790905.jpg',
    video_url: '',
    hook: 'Styling the one coat you will actually wear all week in 3 different ways...',
    angle: 'Capsule Wardrobe Utility & Fit',
    isConcept: true,
    overview: 'High-fashion street aesthetic UGC showing movement, drape, water-resistance, and styling versatility for a sustainable apparel brand.',
    scriptBreakdown: {
      hook: 'Fast 1-second transitional fit snap in an architectural urban setting.',
      agitation: 'Fast fashion outerwear that falls apart after two rainstorms.',
      demonstration: '3 quick outfit swaps (casual denim, office tailoring, weekend travel) showing natural drape.',
      cta: 'Shop the Autumn capsule before restock waitlist closes.',
    },
    keyFeatures: [
      'Dynamic Motion Transitions',
      'Fabric Drape & Stitching Close-ups',
      'Natural Daylight Color Grading',
      'Multi-Angle Fit Verification',
    ],
    targetMarket: 'Europe, USA & Australia',
  },
  {
    id: 'founder-ugc-spokesperson',
    title: 'Founder Direct-to-Camera — E-Com Brand Story Ad',
    category: 'AI UGC Creator Videos',
    duration: '0:30',
    format: '9:16 Vertical & 1:1 Feed',
    thumbnail: '/src/assets/images/hero_ugc_beauty_showcase_1793804788830.jpg',
    videoUrl: '',
    hook: 'Big skincare brands lied about why your pores stay enlarged...',
    angle: 'Contrarian Industry Whistleblower',
    isConcept: true,
    overview: 'Hyper-realistic AI founder spokesperson ad with authentic speech cadences, micro-expressions, and conversational direct response structure.',
    scriptBreakdown: {
      hook: 'Contrarian question challenging common industry misconceptions with high authority tone.',
      agitation: 'Explaining the vicious cycle of stripping skin with harsh chemical washes.',
      demonstration: 'Presenting the pH-balanced biological formula with third-party lab proof.',
      cta: 'Exclusive 60-day money-back guarantee with order link below.',
    },
    keyFeatures: [
      '100% Natural Speech Synthesis',
      'Emotional Resonance Calibration',
      'Custom Scripting & Hook Matrix',
      'Burned-in Captions with Highlighted Keywords',
    ],
    targetMarket: 'USA, UK & Canada',
  },
  {
    id: 'kinetic-smart-ring',
    title: 'Kinetic Pulse — Sleep & Recovery Tracker Ad',
    category: 'Gadgets & Technology',
    duration: '0:26',
    format: '9:16 Vertical Video',
    thumbnail: '/src/assets/images/portfolio_tech_audio_1793804790153.jpg',
    video_url: '',
    hook: 'Why I threw away my smart watch and switched to this titanium ring...',
    angle: 'Lifestyle Replacement & Freedom',
    isConcept: true,
    overview: 'Targeted tech and wellness ad demonstrating biocompatible titanium construction, biometric precision, and discreet sleep tracking.',
    scriptBreakdown: {
      hook: 'Showing wrist indentation from bulky smartwatches before introducing the ultralight titanium ring.',
      agitation: 'Constantly charging watches every single night ruins sleep tracking.',
      demonstration: '7-day battery life, waterproof shower test, sync with real-time iOS app.',
      cta: 'Free sizing kit included with every early bird reservation.',
    },
    keyFeatures: [
      'Hardware Durability Demonstration',
      'App Interface Sync Integration',
      'Lifestyle Gym & Sleep Settings',
      '4 Testable Hook Variations',
    ],
    targetMarket: 'USA, UAE, Australia & UK',
  },
];

const LOCAL_STORAGE_KEY = 'ismail_custom_portfolio_projects';

const getLocalCustomProjects = (): PortfolioItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalCustomProjects = (projects: PortfolioItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
};

// Storage Upload Helper (Step 3)
export const uploadPortfolioMedia = async (
  file: File,
  folder: 'thumbnails' | 'videos' = 'thumbnails'
): Promise<string> => {
  if (supabase && isSupabaseConfigured()) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${folder}/${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.warn('Supabase storage upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error('Failed to upload to Supabase storage, falling back to local object URL:', err);
    }
  }

  // Graceful fallback: return a FileReader Data URL so uploads work immediately even offline or without configured bucket!
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
};

// Map DB row to PortfolioItem
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapRowToProject = (row: any): PortfolioItem => {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    duration: row.duration || '0:30',
    format: row.format || '9:16 Vertical Video',
    thumbnail: row.thumbnail_url,
    video_url: row.video_url || '',
    hook: row.hook || '',
    angle: row.angle || '',
    overview: row.overview || '',
    isConcept: Boolean(row.is_concept ?? true),
    targetMarket: row.target_market || 'USA & United Kingdom',
    scriptBreakdown: {
      hook: row.script_hook || '',
      agitation: row.script_agitation || '',
      demonstration: row.script_demonstration || '',
      cta: row.script_cta || '',
    },
    keyFeatures: Array.isArray(row.key_features) ? row.key_features : [],
  };
};

// Fetch all projects (Supabase + Seeds)
export const fetchAllProjects = async (): Promise<PortfolioItem[]> => {
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const remoteProjects = data.map(mapRowToProject);
        // Combine remote projects with seeds not in remote
        const remoteIds = new Set(remoteProjects.map((p) => p.id));
        const filteredSeeds = INITIAL_SEED_PROJECTS.filter((p) => !remoteIds.has(p.id));
        return [...remoteProjects, ...filteredSeeds];
      }
    } catch (err) {
      console.warn('Could not fetch from Supabase, loading local custom + seed projects:', err);
    }
  }

  // Fallback to local storage custom projects merged with seeds
  const localCustom = getLocalCustomProjects();
  const localIds = new Set(localCustom.map((p) => p.id));
  const filteredSeeds = INITIAL_SEED_PROJECTS.filter((p) => !localIds.has(p.id));
  return [...localCustom, ...filteredSeeds];
};

// Add new project
export const createPortfolioProject = async (
  project: Omit<PortfolioItem, 'id'>
): Promise<PortfolioItem> => {
  const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `proj-${Date.now()}`;
  const completeProject: PortfolioItem = {
    ...project,
    id: newId,
  };

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .insert({
          title: project.title,
          category: project.category,
          duration: project.duration,
          format: project.format,
          thumbnail_url: project.thumbnail,
          video_url: project.video_url || project.videoUrl || '',
          hook: project.hook,
          angle: project.angle,
          overview: project.overview,
          is_concept: project.isConcept,
          target_market: project.targetMarket,
          script_hook: project.scriptBreakdown?.hook || '',
          script_agitation: project.scriptBreakdown?.agitation || '',
          script_demonstration: project.scriptBreakdown?.demonstration || '',
          script_cta: project.scriptBreakdown?.cta || '',
          key_features: project.keyFeatures,
        })
        .select()
        .single();

      if (!error && data) {
        return mapRowToProject(data);
      }
    } catch (err) {
      console.warn('Error inserting project to Supabase, saving to local custom storage:', err);
    }
  }

  // Local storage save
  const current = getLocalCustomProjects();
  saveLocalCustomProjects([completeProject, ...current]);
  return completeProject;
};

// Update project
export const updatePortfolioProject = async (
  id: string,
  updates: Partial<PortfolioItem>
): Promise<void> => {
  if (supabase && isSupabaseConfigured()) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
      if (updates.format !== undefined) dbUpdates.format = updates.format;
      if (updates.thumbnail !== undefined) dbUpdates.thumbnail_url = updates.thumbnail;
      if (updates.video_url !== undefined || updates.videoUrl !== undefined) {
        dbUpdates.video_url = updates.video_url || updates.videoUrl;
      }
      if (updates.hook !== undefined) dbUpdates.hook = updates.hook;
      if (updates.angle !== undefined) dbUpdates.angle = updates.angle;
      if (updates.overview !== undefined) dbUpdates.overview = updates.overview;
      if (updates.isConcept !== undefined) dbUpdates.is_concept = updates.isConcept;
      if (updates.targetMarket !== undefined) dbUpdates.target_market = updates.targetMarket;
      if (updates.scriptBreakdown) {
        dbUpdates.script_hook = updates.scriptBreakdown.hook;
        dbUpdates.script_agitation = updates.scriptBreakdown.agitation;
        dbUpdates.script_demonstration = updates.scriptBreakdown.demonstration;
        dbUpdates.script_cta = updates.scriptBreakdown.cta;
      }
      if (updates.keyFeatures !== undefined) dbUpdates.key_features = updates.keyFeatures;

      await supabase.from('portfolio_projects').update(dbUpdates).eq('id', id);
    } catch (err) {
      console.warn('Supabase update failed, updating local storage:', err);
    }
  }

  // Update in local custom storage
  const current = getLocalCustomProjects();
  const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveLocalCustomProjects(updated);
};

// Delete project
export const deletePortfolioProject = async (id: string): Promise<void> => {
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('portfolio_projects').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete failed, deleting from local storage:', err);
    }
  }

  const current = getLocalCustomProjects();
  saveLocalCustomProjects(current.filter((p) => p.id !== id));
};
