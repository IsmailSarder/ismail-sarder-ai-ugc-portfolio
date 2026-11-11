import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Resolve configuration from environment variables with fallback to project configuration
export const DEFAULT_SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://ogzrhiwvgahjnazeuxmg.supabase.co';

export const DEFAULT_SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_EzrsAx5vS0gkTPXTNzW-NA_hFVil_pw';

// Active credentials (can be overridden at runtime via admin login settings)
export let activeSupabaseUrl: string =
  typeof window !== 'undefined' && localStorage.getItem('supabase_project_url')
    ? localStorage.getItem('supabase_project_url')!
    : DEFAULT_SUPABASE_URL;

export let activeSupabaseAnonKey: string =
  typeof window !== 'undefined' && localStorage.getItem('supabase_anon_key')
    ? localStorage.getItem('supabase_anon_key')!
    : DEFAULT_SUPABASE_KEY;

export const SUPABASE_URL = activeSupabaseUrl;
export const SUPABASE_PUBLISHABLE_KEY = activeSupabaseAnonKey;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    activeSupabaseUrl &&
    activeSupabaseAnonKey &&
    !activeSupabaseUrl.includes('placeholder') &&
    activeSupabaseUrl.startsWith('https://')
  );
}

export function createSupabaseClient(url = activeSupabaseUrl, key = activeSupabaseAnonKey): SupabaseClient {
  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export let supabase: SupabaseClient = createSupabaseClient();

export function saveSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('supabase_project_url', url);
    localStorage.setItem('supabase_anon_key', key);
  }
  activeSupabaseUrl = url;
  activeSupabaseAnonKey = key;
  supabase = createSupabaseClient(url, key);
}

export function clearSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('supabase_project_url');
    localStorage.removeItem('supabase_anon_key');
  }
  activeSupabaseUrl = DEFAULT_SUPABASE_URL;
  activeSupabaseAnonKey = DEFAULT_SUPABASE_KEY;
  supabase = createSupabaseClient();
}

// Storage Buckets & Table Constants
export const BUCKET_VIDEOS = 'portfolio-videos';
export const BUCKET_THUMBNAILS = 'portfolio-thumbnails';
export const BUCKET_PROFILE_IMAGES = 'profile-images';
export const TABLE_PROJECTS = 'portfolio_projects';
export const TABLE_INQUIRIES = 'project_inquiries';
export const TABLE_PROFILE_SETTINGS = 'profile_settings';

export const STORAGE_BUCKETS = {
  VIDEOS: BUCKET_VIDEOS,
  THUMBNAILS: BUCKET_THUMBNAILS,
  PROFILE_IMAGES: BUCKET_PROFILE_IMAGES,
} as const;

export type ProjectCategory =
  | 'Beauty & Skincare'
  | 'Fashion & Lifestyle'
  | 'Gadgets & Technology'
  | 'Product Demonstration'
  | 'AI UGC Ads'
  | 'Product Demonstrations'
  | 'AI UGC Creator Videos';

export interface SupabaseProject {
  id: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  description: string;
  category: ProjectCategory;
  brand_name?: string;
  video_url: string;
  video_path?: string;
  thumbnail_url: string;
  thumbnail_path?: string;
  is_featured: boolean;
  is_published: boolean;
  display_order?: number;
  duration?: string;
  format?: string;
  hook?: string;
  angle?: string;
  aspect_ratio?: string;
  video_width?: number;
  video_height?: number;
  video_mime_type?: string;
}

export type PortfolioProject = SupabaseProject;

export interface StoredInquiry {
  id: string;
  name: string;
  email: string;
  brandName: string;
  brand_name?: string;
  websiteUrl?: string;
  website_url?: string;
  industry: string;
  budget: string;
  selectedPackage?: string;
  selected_package?: string;
  videoCount?: string;
  video_count?: string;
  timeline?: string;
  selectedServices?: string[];
  selected_services?: string[];
  message: string;
  created_at: string;
  createdAt?: string;
  status?: string;
  is_read?: boolean;
}

export type Inquiry = StoredInquiry;

/**
 * Submit client inquiry to Supabase with local fallback
 */
export async function submitProjectInquiry(inquiryData: {
  name: string;
  email: string;
  brandName: string;
  websiteUrl?: string;
  industry: string;
  budget: string;
  selectedPackage?: string;
  videoCount?: string;
  timeline?: string;
  selectedServices: string[];
  message: string;
}): Promise<{ success: boolean; syncedWithSupabase: boolean; id?: string }> {
  const structuredPrefix = [
    inquiryData.selectedPackage ? `Package: ${inquiryData.selectedPackage}` : '',
    inquiryData.videoCount ? `Videos: ${inquiryData.videoCount}` : '',
    inquiryData.timeline ? `Timeline: ${inquiryData.timeline}` : '',
    inquiryData.budget ? `Budget: ${inquiryData.budget}` : '',
  ].filter(Boolean).join(' · ');

  const enrichedMessage = structuredPrefix
    ? `[${structuredPrefix}]\n\n${inquiryData.message}`
    : inquiryData.message;

  const newInquiry: StoredInquiry = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `inq_${Date.now()}`,
    name: inquiryData.name,
    email: inquiryData.email,
    brandName: inquiryData.brandName,
    brand_name: inquiryData.brandName,
    websiteUrl: inquiryData.websiteUrl,
    website_url: inquiryData.websiteUrl,
    industry: inquiryData.industry,
    budget: inquiryData.budget,
    selectedPackage: inquiryData.selectedPackage,
    selected_package: inquiryData.selectedPackage,
    videoCount: inquiryData.videoCount,
    video_count: inquiryData.videoCount,
    timeline: inquiryData.timeline,
    selectedServices: inquiryData.selectedServices,
    selected_services: inquiryData.selectedServices,
    message: enrichedMessage,
    created_at: new Date().toISOString(),
    status: 'new',
  };

  // Always save to local storage as fallback
  try {
    const raw = localStorage.getItem('local_project_inquiries');
    const existing = raw ? JSON.parse(raw) : [];
    existing.unshift(newInquiry);
    localStorage.setItem('local_project_inquiries', JSON.stringify(existing.slice(0, 50)));
  } catch (e) {
    console.warn('Local storage inquiry cache warning:', e);
  }

  // Attempt Supabase insert if configured
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from(TABLE_INQUIRIES)
        .insert([
          {
            name: inquiryData.name,
            email: inquiryData.email,
            brand_name: inquiryData.brandName,
            website_url: inquiryData.websiteUrl || '',
            industry: inquiryData.industry,
            budget: inquiryData.budget,
            selected_services: inquiryData.selectedServices,
            message: enrichedMessage,
            status: 'new',
          },
        ])
        .select()
        .single();

      if (!error && data) {
        return { success: true, syncedWithSupabase: true, id: data.id };
      }
      console.warn('Supabase inquiry insert warning:', error?.message);
    } catch (err) {
      console.warn('Supabase inquiry insert exception:', err);
    }
  }

  return { success: true, syncedWithSupabase: false, id: newInquiry.id };
}

/**
 * Fetch inquiries for admin inspection
 */
export async function fetchRecentInquiries(): Promise<{
  inquiries: StoredInquiry[];
  source: 'supabase' | 'local';
}> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from(TABLE_INQUIRIES)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (!error && data && data.length > 0) {
        const formatted: StoredInquiry[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          email: d.email,
          brandName: d.brand_name || d.brandName || '',
          brand_name: d.brand_name || d.brandName || '',
          websiteUrl: d.website_url || d.websiteUrl || '',
          website_url: d.website_url || d.websiteUrl || '',
          industry: d.industry || 'Skincare & Beauty',
          budget: d.budget || '',
          selectedServices: d.selected_services || d.selectedServices || [],
          selected_services: d.selected_services || d.selectedServices || [],
          message: d.message || '',
          created_at: d.created_at || new Date().toISOString(),
          status: d.status || 'new',
        }));
        return { inquiries: formatted, source: 'supabase' };
      }
    } catch (e) {
      console.warn('Supabase inquiry fetch failed, reading local fallback', e);
    }
  }

  try {
    const raw = localStorage.getItem('local_project_inquiries');
    const existing: StoredInquiry[] = raw ? JSON.parse(raw) : [];
    return { inquiries: existing, source: 'local' };
  } catch {
    return { inquiries: [], source: 'local' };
  }
}

// SQL Schema script for user reference in case table/buckets need setup in Supabase SQL editor
export const SUPABASE_SETUP_SQL = `-- ==============================================================================
-- ISMAIL SARDER — AI UGC PORTFOLIO DATABASE SCHEMA & STORAGE POLICIES
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create portfolio_projects table
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL,
  brand_name TEXT DEFAULT '',
  video_url TEXT NOT NULL,
  video_path TEXT DEFAULT '',
  thumbnail_url TEXT NOT NULL,
  thumbnail_path TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  duration TEXT DEFAULT '0:30',
  format TEXT DEFAULT '9:16 Vertical Video',
  hook TEXT DEFAULT '',
  angle TEXT DEFAULT 'Direct Response',
  aspect_ratio TEXT DEFAULT 'auto',
  video_width INTEGER DEFAULT NULL,
  video_height INTEGER DEFAULT NULL,
  video_mime_type TEXT DEFAULT 'video/mp4'
);

-- Safe migration for existing tables (Adds columns if not present without deleting data)
ALTER TABLE public.portfolio_projects
  ADD COLUMN IF NOT EXISTS aspect_ratio TEXT DEFAULT 'auto',
  ADD COLUMN IF NOT EXISTS video_width INTEGER DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS video_height INTEGER DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS video_mime_type TEXT DEFAULT 'video/mp4';

-- 2. Create project_inquiries table
CREATE TABLE IF NOT EXISTS public.project_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  website_url TEXT DEFAULT '',
  industry TEXT DEFAULT 'Skincare & Beauty',
  budget TEXT DEFAULT '',
  selected_services TEXT[] DEFAULT '{}',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new'
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_inquiries ENABLE ROW LEVEL SECURITY;

-- 4. Projects RLS Policies
DROP POLICY IF EXISTS "Public can view published projects" ON public.portfolio_projects;
CREATE POLICY "Public can view published projects"
  ON public.portfolio_projects
  FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated users have full access to projects" ON public.portfolio_projects;
CREATE POLICY "Authenticated users have full access to projects"
  ON public.portfolio_projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Inquiries RLS Policies
DROP POLICY IF EXISTS "Public can submit inquiries" ON public.project_inquiries;
CREATE POLICY "Public can submit inquiries"
  ON public.project_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can read inquiries" ON public.project_inquiries;
CREATE POLICY "Authenticated users can read inquiries"
  ON public.project_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- 6. Storage Buckets (Create in Storage Dashboard or via SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-videos', 'portfolio-videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-thumbnails', 'portfolio-thumbnails', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for portfolio-videos
DROP POLICY IF EXISTS "Public can read portfolio-videos" ON storage.objects;
CREATE POLICY "Public can read portfolio-videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-videos');

DROP POLICY IF EXISTS "Authenticated users can upload portfolio-videos" ON storage.objects;
CREATE POLICY "Authenticated users can upload portfolio-videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-videos');

DROP POLICY IF EXISTS "Authenticated users can update/delete portfolio-videos" ON storage.objects;
CREATE POLICY "Authenticated users can update/delete portfolio-videos"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'portfolio-videos');

-- Storage policies for portfolio-thumbnails
DROP POLICY IF EXISTS "Public can read portfolio-thumbnails" ON storage.objects;
CREATE POLICY "Public can read portfolio-thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-thumbnails');

DROP POLICY IF EXISTS "Authenticated users can upload portfolio-thumbnails" ON storage.objects;
CREATE POLICY "Authenticated users can upload portfolio-thumbnails"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-thumbnails');

DROP POLICY IF EXISTS "Authenticated users can update/delete portfolio-thumbnails" ON storage.objects;
CREATE POLICY "Authenticated users can update/delete portfolio-thumbnails"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'portfolio-thumbnails');
`;
