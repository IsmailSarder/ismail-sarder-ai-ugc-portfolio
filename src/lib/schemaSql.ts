export const SUPABASE_SETUP_SQL = `-- ==============================================================================
-- ISMAIL SARDER — AI UGC PORTFOLIO DATABASE SCHEMA & STORAGE POLICIES
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Create Portfolio Projects Table
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    video_url TEXT NOT NULL,
    video_path TEXT NOT NULL DEFAULT '',
    thumbnail_url TEXT NOT NULL,
    thumbnail_path TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL,
    brand_name TEXT DEFAULT '',
    duration TEXT DEFAULT '0:30',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_published_order 
    ON public.portfolio_projects (is_published, display_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_category 
    ON public.portfolio_projects (category);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_featured 
    ON public.portfolio_projects (is_featured);

-- Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_portfolio_projects_updated_at ON public.portfolio_projects;
CREATE TRIGGER trigger_portfolio_projects_updated_at
    BEFORE UPDATE ON public.portfolio_projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Project RLS Policies
DROP POLICY IF EXISTS "Public visitors can view published projects" ON public.portfolio_projects;
CREATE POLICY "Public visitors can view published projects"
    ON public.portfolio_projects
    FOR SELECT
    USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated admins can manage all projects" ON public.portfolio_projects;
CREATE POLICY "Authenticated admins can manage all projects"
    ON public.portfolio_projects
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 2. Create Inquiries Table for Contact Form Submissions
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    website_url TEXT DEFAULT '',
    industry TEXT NOT NULL DEFAULT 'Skincare & Beauty',
    budget TEXT NOT NULL DEFAULT '$1,500 - $3,000 (Multi-Hook Batch)',
    selected_services TEXT[] NOT NULL DEFAULT '{}',
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at 
    ON public.inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_read 
    ON public.inquiries (is_read);

-- Enable RLS for Inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Inquiry RLS Policies: Public can insert, Only Authenticated Admins can read & manage
DROP POLICY IF EXISTS "Public visitors can submit inquiries" ON public.inquiries;
CREATE POLICY "Public visitors can submit inquiries"
    ON public.inquiries
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admins can view and manage inquiries" ON public.inquiries;
CREATE POLICY "Authenticated admins can view and manage inquiries"
    ON public.inquiries
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3. Supabase Storage Buckets Setup
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-videos', 'portfolio-videos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-thumbnails', 'portfolio-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Objects Policies
-- Public Read Access
DROP POLICY IF EXISTS "Public can view portfolio videos" ON storage.objects;
CREATE POLICY "Public can view portfolio videos"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'portfolio-videos');

DROP POLICY IF EXISTS "Public can view portfolio thumbnails" ON storage.objects;
CREATE POLICY "Public can view portfolio thumbnails"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'portfolio-thumbnails');

-- Authenticated Admin Manage Access
DROP POLICY IF EXISTS "Admins can upload portfolio videos" ON storage.objects;
CREATE POLICY "Admins can upload portfolio videos"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-videos');

DROP POLICY IF EXISTS "Admins can update portfolio videos" ON storage.objects;
CREATE POLICY "Admins can update portfolio videos"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-videos');

DROP POLICY IF EXISTS "Admins can delete portfolio videos" ON storage.objects;
CREATE POLICY "Admins can delete portfolio videos"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-videos');

DROP POLICY IF EXISTS "Admins can upload portfolio thumbnails" ON storage.objects;
CREATE POLICY "Admins can upload portfolio thumbnails"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-thumbnails');

DROP POLICY IF EXISTS "Admins can update portfolio thumbnails" ON storage.objects;
CREATE POLICY "Admins can update portfolio thumbnails"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-thumbnails');

DROP POLICY IF EXISTS "Admins can delete portfolio thumbnails" ON storage.objects;
CREATE POLICY "Admins can delete portfolio thumbnails"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-thumbnails');

-- 4. Create Profile Settings Table
CREATE TABLE IF NOT EXISTS public.profile_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary_profile',
    full_name TEXT DEFAULT 'Ismail Sarder',
    title TEXT DEFAULT 'AI UGC Ad Creator & Creative Strategist',
    profile_image_url TEXT,
    profile_image_path TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for Profile Settings
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;

-- Public can view profile settings
DROP POLICY IF EXISTS "Public can view profile settings" ON public.profile_settings;
CREATE POLICY "Public can view profile settings"
    ON public.profile_settings
    FOR SELECT
    USING (true);

-- Authenticated admins can manage profile settings
DROP POLICY IF EXISTS "Admins can manage profile settings" ON public.profile_settings;
CREATE POLICY "Admins can manage profile settings"
    ON public.profile_settings
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert Storage Bucket: profile-images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Profile Images Storage Policies
DROP POLICY IF EXISTS "Public can view profile images" ON storage.objects;
CREATE POLICY "Public can view profile images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'profile-images');

DROP POLICY IF EXISTS "Admins can upload profile images" ON storage.objects;
CREATE POLICY "Admins can upload profile images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'profile-images');

DROP POLICY IF EXISTS "Admins can update profile images" ON storage.objects;
CREATE POLICY "Admins can update profile images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'profile-images');

DROP POLICY IF EXISTS "Admins can delete profile images" ON storage.objects;
CREATE POLICY "Admins can delete profile images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'profile-images');`;
