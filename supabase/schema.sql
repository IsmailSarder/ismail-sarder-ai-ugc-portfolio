-- ====================================================================
-- ISMAIL SARDER — AI UGC CREATIVE STUDIO
-- Supabase Database Schema, Row-Level Security (RLS) & Storage Policies
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Portfolio Projects Table
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    duration TEXT NOT NULL DEFAULT '0:30',
    format TEXT NOT NULL DEFAULT '9:16 Vertical Video',
    thumbnail_url TEXT NOT NULL,
    video_url TEXT DEFAULT '',
    hook TEXT NOT NULL,
    angle TEXT NOT NULL,
    overview TEXT NOT NULL,
    is_concept BOOLEAN NOT NULL DEFAULT true,
    target_market TEXT NOT NULL DEFAULT 'USA & United Kingdom',
    script_hook TEXT NOT NULL DEFAULT '',
    script_agitation TEXT NOT NULL DEFAULT '',
    script_demonstration TEXT NOT NULL DEFAULT '',
    script_cta TEXT NOT NULL DEFAULT '',
    key_features TEXT[] DEFAULT ARRAY[]::TEXT[],
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for category filtering and ordering
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON public.portfolio_projects (category);
CREATE INDEX IF NOT EXISTS idx_portfolio_created ON public.portfolio_projects (created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- 4. RLS Security Policies for Portfolio Table
-- Policy A: Anyone (public / anonymous visitors) can view portfolio projects
DROP POLICY IF EXISTS "Public can view portfolio projects" ON public.portfolio_projects;
CREATE POLICY "Public can view portfolio projects"
    ON public.portfolio_projects
    FOR SELECT
    USING (true);

-- Policy B: Only authenticated admin users can insert new projects
DROP POLICY IF EXISTS "Authenticated admin can insert projects" ON public.portfolio_projects;
CREATE POLICY "Authenticated admin can insert projects"
    ON public.portfolio_projects
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.role() = 'authenticated');

-- Policy C: Only authenticated admin users can update projects
DROP POLICY IF EXISTS "Authenticated admin can update projects" ON public.portfolio_projects;
CREATE POLICY "Authenticated admin can update projects"
    ON public.portfolio_projects
    FOR UPDATE
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Policy D: Only authenticated admin users can delete projects
DROP POLICY IF EXISTS "Authenticated admin can delete projects" ON public.portfolio_projects;
CREATE POLICY "Authenticated admin can delete projects"
    ON public.portfolio_projects
    FOR DELETE
    TO authenticated
    USING (auth.role() = 'authenticated');

-- 5. Storage Configuration: Create 'portfolio-media' public bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-media',
    'portfolio-media',
    true,
    52428800, -- 50MB max file size
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. Storage Security Policies for 'portfolio-media'
-- Allow public visitors to read/download media files
DROP POLICY IF EXISTS "Public can view portfolio media" ON storage.objects;
CREATE POLICY "Public can view portfolio media"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'portfolio-media');

-- Allow authenticated admin users to upload media files
DROP POLICY IF EXISTS "Authenticated admin can upload media" ON storage.objects;
CREATE POLICY "Authenticated admin can upload media"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

-- Allow authenticated admin users to update media files
DROP POLICY IF EXISTS "Authenticated admin can update media" ON storage.objects;
CREATE POLICY "Authenticated admin can update media"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

-- Allow authenticated admin users to delete media files
DROP POLICY IF EXISTS "Authenticated admin can delete media" ON storage.objects;
CREATE POLICY "Authenticated admin can delete media"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');
