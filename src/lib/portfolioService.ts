import { supabase, PortfolioProject, Inquiry, STORAGE_BUCKETS } from './supabase.ts';

// Initial default projects to show if Supabase table is empty or migrating
export const DEFAULT_INITIAL_PROJECTS: PortfolioProject[] = [
  {
    id: 'aurelia-serum-spec',
    title: 'Aurelia Botanica — Dewy Skin Viral Hook',
    description: 'High-converting TikTok and Instagram Reels ad creative engineered for a luxury botanical skincare brand. Designed with relatable morning routine pattern interrupt and dynamic kinetic captions.',
    category: 'Beauty & Skincare',
    brand_name: 'Aurelia Botanica',
    duration: '0:28',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    video_path: '',
    thumbnail_url: '/src/assets/images/hero_ugc_beauty_showcase_1793804788830.jpg',
    thumbnail_path: '',
    is_featured: true,
    is_published: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'botanica-macro-demo-spec',
    title: 'Botanica Facial Illumination — Macro Product Demo',
    description: 'Photorealistic AI product demonstration highlighting active ingredients, viscosity, and instant epidermal absorption with studio-grade lighting on limestone travertine.',
    category: 'Product Demonstration',
    brand_name: 'Botanica Lab',
    duration: '0:22',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    video_path: '',
    thumbnail_url: '/src/assets/images/portfolio_skincare_glow_1793804789975.jpg',
    thumbnail_path: '',
    is_featured: true,
    is_published: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'elara-anc-headphones-spec',
    title: 'Elara ANC Pro — Commuter Noise-Cancellation Demo',
    description: 'Authentic tech creator unboxing and real-time subway noise cancellation stress test engineered to outperform competitor ads across Meta and YouTube Shorts.',
    category: 'Gadgets & Technology',
    brand_name: 'Elara Audio',
    duration: '0:34',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    video_path: '',
    thumbnail_url: '/src/assets/images/portfolio_tech_audio_1793804790153.jpg',
    thumbnail_path: '',
    is_featured: false,
    is_published: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'nomad-atelier-trench-spec',
    title: 'Nomad Atelier — Minimalist Capsule Wardrobe UGC',
    description: 'High-fashion street aesthetic UGC showing movement, drape, water-resistance, and 3-way styling versatility for a modern sustainable apparel brand.',
    category: 'Fashion & Lifestyle',
    brand_name: 'Nomad Atelier',
    duration: '0:25',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    video_path: '',
    thumbnail_url: '/src/assets/images/portfolio_fashion_street_1793804790905.jpg',
    thumbnail_path: '',
    is_featured: false,
    is_published: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'founder-ugc-spokesperson-spec',
    title: 'Founder Direct-to-Camera — E-Com Brand Story Ad',
    description: 'Hyper-realistic AI founder spokesperson ad with authentic speech cadences, micro-expressions, and conversational direct response structure.',
    category: 'AI UGC Ads',
    brand_name: 'SkinBio Direct',
    duration: '0:30',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    video_path: '',
    thumbnail_url: '/src/assets/images/hero_ugc_beauty_showcase_1793804788830.jpg',
    thumbnail_path: '',
    is_featured: false,
    is_published: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'kinetic-smart-ring-spec',
    title: 'Kinetic Pulse — Sleep & Recovery Tracker Ad',
    description: 'Targeted tech and wellness ad demonstrating biocompatible titanium construction, biometric precision, and discreet sleep tracking.',
    category: 'Gadgets & Technology',
    brand_name: 'Kinetic Health',
    duration: '0:26',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    video_path: '',
    thumbnail_url: '/src/assets/images/portfolio_tech_audio_1793804790153.jpg',
    thumbnail_path: '',
    is_featured: false,
    is_published: true,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const portfolioService = {
  // Public: Fetch published projects from Supabase database
  async getPublishedProjects(): Promise<{ data: PortfolioProject[]; isFromDatabase: boolean }> {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase portfolio fetch note (using fallback):', error.message);
        return { data: DEFAULT_INITIAL_PROJECTS, isFromDatabase: false };
      }

      if (!data || data.length === 0) {
        return { data: DEFAULT_INITIAL_PROJECTS, isFromDatabase: false };
      }

      return { data: data as PortfolioProject[], isFromDatabase: true };
    } catch (err) {
      console.warn('Failed to load projects from Supabase:', err);
      return { data: DEFAULT_INITIAL_PROJECTS, isFromDatabase: false };
    }
  },

  // Admin: Fetch all projects including drafts
  async getAllProjectsAdmin(): Promise<{ data: PortfolioProject[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: (data || []) as PortfolioProject[], error: null };
    } catch (err) {
      return { data: [], error: err as Error };
    }
  },

  // Storage: Upload MP4 video or thumbnail image with clean unique path
  async uploadFile(
    bucket: string,
    file: File,
    folder: string = 'media'
  ): Promise<{ path: string; publicUrl: string; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'bin';
      const cleanName = file.name
        .substring(0, file.name.lastIndexOf('.'))
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      const filePath = `${folder}/${Date.now()}_${cleanName}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      return { path: data.path, publicUrl, error: null };
    } catch (err) {
      return { path: '', publicUrl: '', error: err as Error };
    }
  },

  // Storage: Remove file
  async deleteFile(bucket: string, path: string): Promise<void> {
    if (!path) return;
    try {
      await supabase.storage.from(bucket).remove([path]);
    } catch (err) {
      console.warn(`Failed to delete storage file from ${bucket}:`, err);
    }
  },

  // Admin: Create new project
  async createProject(
    payload: Omit<PortfolioProject, 'id' | 'created_at' | 'updated_at'>
  ): Promise<{ data: PortfolioProject | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return { data: data as PortfolioProject, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  },

  // Admin: Update existing project
  async updateProject(
    id: string,
    payload: Partial<PortfolioProject>
  ): Promise<{ data: PortfolioProject | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .update({
          ...payload,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as PortfolioProject, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  },

  // Admin: Delete project and its storage media
  async deleteProject(
    id: string,
    videoPath?: string,
    thumbnailPath?: string
  ): Promise<{ error: Error | null }> {
    try {
      // Clean up storage objects
      if (videoPath) {
        await this.deleteFile(STORAGE_BUCKETS.VIDEOS, videoPath);
      }
      if (thumbnailPath) {
        await this.deleteFile(STORAGE_BUCKETS.THUMBNAILS, thumbnailPath);
      }

      // Delete database record
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  },

  // Admin: Quick toggle publish status
  async togglePublish(id: string, isPublished: boolean): Promise<{ error: Error | null }> {
    return this.updateProject(id, { is_published: isPublished });
  },

  // Admin: Quick toggle featured status
  async toggleFeatured(id: string, isFeatured: boolean): Promise<{ error: Error | null }> {
    return this.updateProject(id, { is_featured: isFeatured });
  },

  // Admin: Update display order
  async updateDisplayOrder(id: string, newOrder: number): Promise<{ error: Error | null }> {
    return this.updateProject(id, { display_order: newOrder });
  },

  // Inquiries
  async getInquiries(): Promise<{ data: Inquiry[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: (data || []) as Inquiry[], error: null };
    } catch (err) {
      return { data: [], error: err as Error };
    }
  },

  async toggleInquiryRead(id: string, isRead: boolean): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ is_read: isRead })
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  },

  async deleteInquiry(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  },
};
