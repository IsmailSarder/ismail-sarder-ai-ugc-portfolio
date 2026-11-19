import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Resolve configuration from environment variables with fallback to project configuration
export const DEFAULT_SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://ogzrhiwvgahjnazeuxmg.supabase.co';

export const DEFAULT_SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_EzrsAx5vS0gkTPXTNzW-NA_hFVil_pw';

// Active credentials (can be overridden at runtime via admin settings)
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
export const TABLE_INQUIRIES_LEGACY = 'inquiries';
export const TABLE_PROFILE_SETTINGS = 'profile_settings';

export const STORAGE_BUCKETS = {
  VIDEOS: BUCKET_VIDEOS,
  THUMBNAILS: BUCKET_THUMBNAILS,
  PROFILE_IMAGES: BUCKET_PROFILE_IMAGES,
} as const;

export type ProjectCategory =
  | 'Beauty & Skincare'
  | 'Fashion'
  | 'Fashion & Lifestyle'
  | 'Gadgets & Technology'
  | 'Product Demonstration'
  | 'AI UGC'
  | 'AI UGC Ads'
  | 'AI Video Ads'
  | 'CGI Commercials'
  | 'CGI Product Ads'
  | 'Product Commercials'
  | '3D Product Animation'
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
 * Submit client inquiry to Supabase ('project_inquiries' primary, 'inquiries' legacy fallback)
 * Never fakes database success if Supabase rejects or fails to persist.
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
}): Promise<{
  success: boolean;
  syncedWithSupabase: boolean;
  id?: string;
  errorMessage?: string;
}> {
  const structuredPrefix = [
    inquiryData.selectedPackage ? `Package: ${inquiryData.selectedPackage}` : '',
    inquiryData.videoCount ? `Videos: ${inquiryData.videoCount}` : '',
    inquiryData.timeline ? `Timeline: ${inquiryData.timeline}` : '',
    inquiryData.budget ? `Budget: ${inquiryData.budget}` : '',
  ]
    .filter(Boolean)
    .join(' · ');

  const enrichedMessage = structuredPrefix
    ? `[${structuredPrefix}]\n\n${inquiryData.message}`
    : inquiryData.message;

  const newInquiry: StoredInquiry = {
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `inq_${Date.now()}`,
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
    is_read: false,
  };

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      syncedWithSupabase: false,
      errorMessage:
        'Database connection is not configured. Please send your brief directly via WhatsApp or email.',
    };
  }

  try {
    // Attempt 1: Full row in primary 'project_inquiries' table
    const fullRow = {
      name: inquiryData.name,
      email: inquiryData.email,
      brand_name: inquiryData.brandName,
      website_url: inquiryData.websiteUrl || '',
      industry: inquiryData.industry,
      budget: inquiryData.budget,
      selected_package: inquiryData.selectedPackage || '',
      video_count: inquiryData.videoCount || '',
      timeline: inquiryData.timeline || '',
      selected_services: inquiryData.selectedServices,
      message: enrichedMessage,
      status: 'new',
    };

    const primaryAttempt = await supabase.from(TABLE_INQUIRIES).insert([fullRow]);
    if (!primaryAttempt.error) {
      try {
        const raw = localStorage.getItem('local_project_inquiries');
        const existing = raw ? JSON.parse(raw) : [];
        existing.unshift(newInquiry);
        localStorage.setItem('local_project_inquiries', JSON.stringify(existing.slice(0, 50)));
      } catch {
        // Ignore local cache errors after successful remote insert
      }
      return { success: true, syncedWithSupabase: true, id: newInquiry.id };
    }

    // Attempt 2: Core columns on 'project_inquiries' in case optional columns aren't migrated yet
    const msg = primaryAttempt.error.message || '';
    if (msg.includes('column') || msg.includes('schema cache') || primaryAttempt.error.code === 'PGRST204') {
      const coreAttempt = await supabase.from(TABLE_INQUIRIES).insert([
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
      ]);
      if (!coreAttempt.error) {
        return { success: true, syncedWithSupabase: true, id: newInquiry.id };
      }
    }

    // Attempt 3: Legacy 'inquiries' table fallback (if project uses legacy schema)
    const legacyAttempt = await supabase.from(TABLE_INQUIRIES_LEGACY).insert([
      {
        name: inquiryData.name,
        email: inquiryData.email,
        brand_name: inquiryData.brandName,
        website_url: inquiryData.websiteUrl || '',
        industry: inquiryData.industry,
        budget: inquiryData.budget,
        selected_services: inquiryData.selectedServices,
        message: enrichedMessage,
        is_read: false,
      },
    ]);
    if (!legacyAttempt.error) {
      return { success: true, syncedWithSupabase: true, id: newInquiry.id };
    }

    const detailedError =
      primaryAttempt.error.message ||
      legacyAttempt.error.message ||
      'Unable to save your inquiry to the database.';
    return {
      success: false,
      syncedWithSupabase: false,
      errorMessage: detailedError,
    };
  } catch (err) {
    const detailedError =
      err instanceof Error ? err.message : 'Network error while submitting your inquiry.';
    return {
      success: false,
      syncedWithSupabase: false,
      errorMessage: detailedError,
    };
  }
}

/**
 * Fetch inquiries for authenticated admin inspection
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

      if (!error && data) {
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
          selectedPackage: d.selected_package || d.selectedPackage || '',
          selected_package: d.selected_package || d.selectedPackage || '',
          videoCount: d.video_count || d.videoCount || '',
          video_count: d.video_count || d.videoCount || '',
          timeline: d.timeline || '',
          selectedServices: d.selected_services || d.selectedServices || [],
          selected_services: d.selected_services || d.selectedServices || [],
          message: d.message || '',
          created_at: d.created_at || new Date().toISOString(),
          status: d.status || 'new',
          is_read: typeof d.is_read === 'boolean' ? d.is_read : d.status === 'read',
        }));
        return { inquiries: formatted, source: 'supabase' };
      }
    } catch (e) {
      console.warn('Supabase inquiry fetch note:', e);
    }
  }

  return { inquiries: [], source: 'local' };
}

export { SUPABASE_SETUP_SQL } from './schemaSql.ts';
