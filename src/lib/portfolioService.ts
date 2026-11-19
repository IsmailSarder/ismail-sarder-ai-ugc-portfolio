import { supabase, PortfolioProject, Inquiry, STORAGE_BUCKETS } from './supabase.ts';
import { isAuthorizedAdminUser } from '../context/AuthContext.tsx';

async function requireAdminSession(): Promise<void> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session || !isAuthorizedAdminUser(session.user)) {
    throw new Error('Unauthorized: valid Admin UUID authentication is required.');
  }
}

// Initial default projects to show only if Supabase table is temporarily unreachable
export const DEFAULT_INITIAL_PROJECTS: PortfolioProject[] = [
  {
    id: '12a2503f-fallback',
    title: 'My Simple Serum Routine: An Honest Skincare Review',
    description:
      'Vertical AI UGC skincare review concept highlighting an effortless daily serum routine with natural creator framing and clear product storytelling.',
    category: 'Beauty & Skincare',
    brand_name: '',
    duration: '0:28',
    aspect_ratio: '9:16',
    video_width: 1080,
    video_height: 1920,
    video_mime_type: 'video/mp4',
    video_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245521871_1000029752.mp4',
    video_path: '',
    thumbnail_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794245531277_1000030084.png',
    thumbnail_path: '',
    is_featured: true,
    is_published: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '450af57c-fallback',
    title: 'Lumera Skin Serum: Hydrated-Looking Skin, Simple Routine',
    description:
      'Skincare AI UGC video ad demonstrating hydrating serum application, lightweight glow, and concise direct-response pacing for Reels and TikTok.',
    category: 'Beauty & Skincare',
    brand_name: '',
    duration: '0:26',
    aspect_ratio: '9:16',
    video_width: 1080,
    video_height: 1920,
    video_mime_type: 'video/mp4',
    video_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245604657_1000029754.mp4',
    video_path: '',
    thumbnail_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794245611859_1000030085.png',
    thumbnail_path: '',
    is_featured: true,
    is_published: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '14b37ac4-fallback',
    title: 'Premium Sound, Comfortable All Day: Everyday Headphones Review',
    description:
      'Consumer electronics AI UGC review spotlighting all-day headband comfort, acoustic clarity, and everyday wireless utility.',
    category: 'Gadgets & Technology',
    brand_name: '',
    duration: '0:30',
    aspect_ratio: '9:16',
    video_width: 1080,
    video_height: 1920,
    video_mime_type: 'video/mp4',
    video_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245706375_1000029755.mp4',
    video_path: '',
    thumbnail_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794245714197_1000030086.png',
    thumbnail_path: '',
    is_featured: false,
    is_published: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'af7e8df2-fallback',
    title: 'Pro UGC Content That Sells: Real Product Demos That Convert',
    description:
      'Direct-to-camera AI spokesperson creative highlighting structured hook pacing, visual product proof, and clear brand communication.',
    category: 'AI UGC Ads',
    brand_name: '',
    duration: '0:27',
    aspect_ratio: '9:16',
    video_width: 1080,
    video_height: 1920,
    video_mime_type: 'video/mp4',
    video_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245792416_1000029756.mp4',
    video_path: '',
    thumbnail_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794245801394_1000030087.png',
    thumbnail_path: '',
    is_featured: false,
    is_published: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'eece6777-fallback',
    title: 'Simple Fit. Premium Feel: The Everyday Oversized Black Tee',
    description:
      'Apparel AI UGC video showcasing relaxed drape, fabric weight, and clean everyday styling for DTC fashion brands.',
    category: 'Fashion & Lifestyle',
    brand_name: '',
    duration: '0:24',
    aspect_ratio: '9:16',
    video_width: 1080,
    video_height: 1920,
    video_mime_type: 'video/mp4',
    video_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245883418_1000029757.mp4',
    video_path: '',
    thumbnail_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794245890811_1000030088.png',
    thumbnail_path: '',
    is_featured: false,
    is_published: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2e1c5146-fallback',
    title: 'NOIRÉ – Luxury Perfume CGI Commercial',
    description:
      'Photorealistic vertical CGI fragrance commercial crafted with moody studio lighting and luxury pacing.',
    category: 'CGI Product Ads',
    brand_name: '',
    duration: '0:24',
    aspect_ratio: '9:16',
    video_width: 1080,
    video_height: 1920,
    video_mime_type: 'video/mp4',
    video_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794738300263_Perfume.mp4',
    video_path: '',
    thumbnail_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794738306514_Perfume_thumbnail_9x16.jpg',
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
      await requireAdminSession();
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
      await requireAdminSession();
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
      await requireAdminSession();
      await supabase.storage.from(bucket).remove([path]);
    } catch (err) {
      console.warn(`Failed to delete storage file from ${bucket}:`, err);
    }
  },

  // Admin: Create new project
  async createProject(
    payload: Omit<PortfolioProject, 'id' | 'created_at' | 'updated_at'>
  ): Promise<{ data: PortfolioProject | null; error: Error | null }> {
    const normalizedPayload = {
      ...payload,
      aspect_ratio: payload.aspect_ratio || '9:16',
    };

    try {
      await requireAdminSession();
      const { data, error } = await supabase
        .from('portfolio_projects')
        .insert([normalizedPayload])
        .select()
        .single();

      if (error) {
        // Fallback if optional dimension columns (format, video_width, video_height, video_mime_type) aren't on table yet
        const msg = error.message || '';
        if (msg.includes('column') || msg.includes('schema cache') || error.code === 'PGRST204') {
          const corePayload = {
            title: normalizedPayload.title,
            description: normalizedPayload.description,
            category: normalizedPayload.category,
            brand_name: normalizedPayload.brand_name,
            duration: normalizedPayload.duration,
            aspect_ratio: normalizedPayload.aspect_ratio,
            video_url: normalizedPayload.video_url,
            video_path: normalizedPayload.video_path,
            thumbnail_url: normalizedPayload.thumbnail_url,
            thumbnail_path: normalizedPayload.thumbnail_path,
            is_featured: normalizedPayload.is_featured,
            is_published: normalizedPayload.is_published,
            display_order: normalizedPayload.display_order,
          };
          const retry = await supabase
            .from('portfolio_projects')
            .insert([corePayload])
            .select()
            .single();
          if (retry.error) throw retry.error;
          return { data: retry.data as PortfolioProject, error: null };
        }
        throw error;
      }

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
    const normalizedPayload = {
      ...payload,
      ...(payload.aspect_ratio !== undefined ? { aspect_ratio: payload.aspect_ratio || '9:16' } : {}),
      updated_at: new Date().toISOString(),
    };

    try {
      await requireAdminSession();
      const { data, error } = await supabase
        .from('portfolio_projects')
        .update(normalizedPayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        const msg = error.message || '';
        if (msg.includes('column') || msg.includes('schema cache') || error.code === 'PGRST204') {
          const coreUpdate: Record<string, unknown> = {
            updated_at: normalizedPayload.updated_at,
          };
          const allowedKeys = [
            'title',
            'description',
            'category',
            'brand_name',
            'duration',
            'aspect_ratio',
            'video_url',
            'video_path',
            'thumbnail_url',
            'thumbnail_path',
            'is_featured',
            'is_published',
            'display_order',
          ] as const;
          for (const key of allowedKeys) {
            if (key in normalizedPayload && normalizedPayload[key] !== undefined) {
              coreUpdate[key] = normalizedPayload[key];
            }
          }
          const retry = await supabase
            .from('portfolio_projects')
            .update(coreUpdate)
            .eq('id', id)
            .select()
            .single();
          if (retry.error) throw retry.error;
          return { data: retry.data as PortfolioProject, error: null };
        }
        throw error;
      }

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
      await requireAdminSession();
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

  // Inquiries (Admin-only read, synced with project_inquiries table + local fallback)
  async getInquiries(): Promise<{ data: Inquiry[]; error: Error | null }> {
    try {
      await requireAdminSession();
      const primary = await supabase
        .from('project_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!primary.error && primary.data) {
        const normalized: Inquiry[] = primary.data.map((d: any) => ({
          id: d.id,
          name: d.name || '',
          email: d.email || '',
          brandName: d.brand_name || d.brandName || '',
          brand_name: d.brand_name || d.brandName || '',
          websiteUrl: d.website_url || d.websiteUrl || '',
          website_url: d.website_url || d.websiteUrl || '',
          industry: d.industry || '',
          budget: d.budget || '',
          selectedServices: d.selected_services || d.selectedServices || [],
          selected_services: d.selected_services || d.selectedServices || [],
          message: d.message || '',
          created_at: d.created_at || new Date().toISOString(),
          status: d.status || 'new',
          is_read: typeof d.is_read === 'boolean' ? d.is_read : d.status === 'read',
        }));
        return { data: normalized, error: null };
      }

      // Fallback to legacy 'inquiries' table if present
      const legacy = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!legacy.error && legacy.data) {
        return { data: legacy.data as Inquiry[], error: null };
      }

      // Fallback to localStorage cached inquiries
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('local_project_inquiries');
        if (raw) {
          return { data: JSON.parse(raw) as Inquiry[], error: null };
        }
      }

      return { data: [], error: primary.error ? new Error(primary.error.message) : null };
    } catch (err) {
      return { data: [], error: err as Error };
    }
  },

  async toggleInquiryRead(id: string, isRead: boolean): Promise<{ error: Error | null }> {
    try {
      await requireAdminSession();
      // Update local fallback cache if present
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('local_project_inquiries');
          if (raw) {
            const parsed = JSON.parse(raw) as Inquiry[];
            const updated = parsed.map((i) =>
              i.id === id ? { ...i, is_read: isRead, status: isRead ? 'read' : 'new' } : i
            );
            localStorage.setItem('local_project_inquiries', JSON.stringify(updated));
          }
        } catch {
          // Ignore local cache errors
        }
      }

      const { error } = await supabase
        .from('project_inquiries')
        .update({ status: isRead ? 'read' : 'new' })
        .eq('id', id);

      if (error) {
        const legacy = await supabase
          .from('inquiries')
          .update({ is_read: isRead })
          .eq('id', id);
        if (legacy.error) throw legacy.error;
      }
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  },

  async deleteInquiry(id: string): Promise<{ error: Error | null }> {
    try {
      await requireAdminSession();
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('local_project_inquiries');
          if (raw) {
            const parsed = JSON.parse(raw) as Inquiry[];
            localStorage.setItem(
              'local_project_inquiries',
              JSON.stringify(parsed.filter((i) => i.id !== id))
            );
          }
        } catch {
          // Ignore local cache errors
        }
      }

      const { error } = await supabase.from('project_inquiries').delete().eq('id', id);
      if (error) {
        const legacy = await supabase.from('inquiries').delete().eq('id', id);
        if (legacy.error) throw legacy.error;
      }
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  },
};
