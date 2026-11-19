-- ==============================================================================
-- ISMAIL SARDER — ADMIN UUID HARDENED DATABASE SCHEMA, RLS & STORAGE POLICIES
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- Non-destructive: preserves all existing rows, tables, and storage files.
-- ==============================================================================

-- 0. Single-Admin UUID Verification Function
-- IMPORTANT: Replace '00000000-0000-0000-0000-000000000000' with your Supabase Auth User UUID
CREATE OR REPLACE FUNCTION public.is_studio_admin()
RETURNS BOOLEAN AS $$
  SELECT auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. Portfolio Projects Table
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
    format TEXT DEFAULT '9:16 Vertical Video',
    hook TEXT DEFAULT '',
    angle TEXT DEFAULT 'Direct Response',
    aspect_ratio TEXT DEFAULT '9:16',
    video_width INTEGER DEFAULT NULL,
    video_height INTEGER DEFAULT NULL,
    video_mime_type TEXT DEFAULT 'video/mp4',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_projects
    ADD COLUMN IF NOT EXISTS format TEXT DEFAULT '9:16 Vertical Video',
    ADD COLUMN IF NOT EXISTS hook TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS angle TEXT DEFAULT 'Direct Response',
    ADD COLUMN IF NOT EXISTS aspect_ratio TEXT DEFAULT '9:16',
    ADD COLUMN IF NOT EXISTS video_width INTEGER DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS video_height INTEGER DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS video_mime_type TEXT DEFAULT 'video/mp4';

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_published_order
    ON public.portfolio_projects (is_published, display_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_category
    ON public.portfolio_projects (category);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_featured
    ON public.portfolio_projects (is_featured);

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

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can view published projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Public can view published projects" ON public.portfolio_projects;
CREATE POLICY "Public can view published projects"
    ON public.portfolio_projects
    FOR SELECT
    USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated admins can manage all projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Admin email can manage all projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Admin UUID can view all projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Admin UUID can insert projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Admin UUID can update projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Admin UUID can delete projects" ON public.portfolio_projects;

CREATE POLICY "Admin UUID can view all projects"
    ON public.portfolio_projects
    FOR SELECT
    TO authenticated
    USING (public.is_studio_admin());

CREATE POLICY "Admin UUID can insert projects"
    ON public.portfolio_projects
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_studio_admin());

CREATE POLICY "Admin UUID can update projects"
    ON public.portfolio_projects
    FOR UPDATE
    TO authenticated
    USING (public.is_studio_admin())
    WITH CHECK (public.is_studio_admin());

CREATE POLICY "Admin UUID can delete projects"
    ON public.portfolio_projects
    FOR DELETE
    TO authenticated
    USING (public.is_studio_admin());

-- 2. Project Inquiries Table
CREATE TABLE IF NOT EXISTS public.project_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    website_url TEXT DEFAULT '',
    industry TEXT NOT NULL DEFAULT 'Skincare & Beauty',
    budget TEXT NOT NULL DEFAULT '',
    selected_package TEXT DEFAULT '',
    video_count TEXT DEFAULT '',
    timeline TEXT DEFAULT '',
    selected_services TEXT[] NOT NULL DEFAULT '{}',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new'
);

ALTER TABLE public.project_inquiries
    ADD COLUMN IF NOT EXISTS selected_package TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS video_count TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS timeline TEXT DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_project_inquiries_created_at
    ON public.project_inquiries (created_at DESC);

ALTER TABLE public.project_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit inquiries" ON public.project_inquiries;
CREATE POLICY "Public can submit inquiries"
    ON public.project_inquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        length(trim(name)) > 0
        AND length(trim(email)) > 0
        AND length(trim(brand_name)) > 0
        AND length(trim(message)) >= 10
    );

DROP POLICY IF EXISTS "Admin email can manage inquiries" ON public.project_inquiries;
DROP POLICY IF EXISTS "Admin UUID can read inquiries" ON public.project_inquiries;
DROP POLICY IF EXISTS "Admin UUID can update inquiries" ON public.project_inquiries;
DROP POLICY IF EXISTS "Admin UUID can delete inquiries" ON public.project_inquiries;

CREATE POLICY "Admin UUID can read inquiries"
    ON public.project_inquiries
    FOR SELECT
    TO authenticated
    USING (public.is_studio_admin());

CREATE POLICY "Admin UUID can update inquiries"
    ON public.project_inquiries
    FOR UPDATE
    TO authenticated
    USING (public.is_studio_admin())
    WITH CHECK (public.is_studio_admin());

CREATE POLICY "Admin UUID can delete inquiries"
    ON public.project_inquiries
    FOR DELETE
    TO authenticated
    USING (public.is_studio_admin());

-- Non-destructive hardening if legacy public.inquiries table exists
DO $$
DECLARE
    pol RECORD;
BEGIN
    IF to_regclass('public.inquiries') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY';
        FOR pol IN
            SELECT policyname
            FROM pg_policies
            WHERE schemaname = 'public' AND tablename = 'inquiries'
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.inquiries', pol.policyname);
        END LOOP;

        EXECUTE 'CREATE POLICY "Public can submit legacy inquiries"
            ON public.inquiries
            FOR INSERT
            TO anon, authenticated
            WITH CHECK (
                length(trim(name)) > 0
                AND length(trim(email)) > 0
                AND length(trim(message)) >= 5
            )';

        EXECUTE 'CREATE POLICY "Admin UUID can read legacy inquiries"
            ON public.inquiries
            FOR SELECT
            TO authenticated
            USING (public.is_studio_admin())';

        EXECUTE 'CREATE POLICY "Admin UUID can update legacy inquiries"
            ON public.inquiries
            FOR UPDATE
            TO authenticated
            USING (public.is_studio_admin())
            WITH CHECK (public.is_studio_admin())';

        EXECUTE 'CREATE POLICY "Admin UUID can delete legacy inquiries"
            ON public.inquiries
            FOR DELETE
            TO authenticated
            USING (public.is_studio_admin())';
    END IF;
END $$;

-- 3. Profile & Intro Video Settings Table
CREATE TABLE IF NOT EXISTS public.profile_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary_profile',
    full_name TEXT DEFAULT 'Ismail Sarder',
    title TEXT DEFAULT 'AI UGC Video Ads Creator & Creative Strategist',
    profile_image_url TEXT,
    profile_image_path TEXT,
    intro_heading TEXT DEFAULT 'MEET THE CREATOR',
    intro_subheading TEXT DEFAULT 'Creative Ideas. Powerful Visuals. Ads That Stand Out.',
    intro_description TEXT DEFAULT '',
    intro_video_url TEXT DEFAULT '',
    intro_video_path TEXT DEFAULT '',
    intro_thumbnail_url TEXT DEFAULT '',
    intro_thumbnail_path TEXT DEFAULT '',
    intro_is_published BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_settings
    ADD COLUMN IF NOT EXISTS full_name TEXT DEFAULT 'Ismail Sarder',
    ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'AI UGC Video Ads Creator & Creative Strategist',
    ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
    ADD COLUMN IF NOT EXISTS profile_image_path TEXT,
    ADD COLUMN IF NOT EXISTS intro_heading TEXT DEFAULT 'MEET THE CREATOR',
    ADD COLUMN IF NOT EXISTS intro_subheading TEXT DEFAULT 'Creative Ideas. Powerful Visuals. Ads That Stand Out.',
    ADD COLUMN IF NOT EXISTS intro_description TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS intro_video_url TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS intro_video_path TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS intro_thumbnail_url TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS intro_thumbnail_path TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS intro_is_published BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS trigger_profile_settings_updated_at ON public.profile_settings;
CREATE TRIGGER trigger_profile_settings_updated_at
    BEFORE UPDATE ON public.profile_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view profile settings" ON public.profile_settings;
CREATE POLICY "Public can view profile settings"
    ON public.profile_settings
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin email can manage profile settings" ON public.profile_settings;
DROP POLICY IF EXISTS "Admin UUID can insert profile settings" ON public.profile_settings;
DROP POLICY IF EXISTS "Admin UUID can update profile settings" ON public.profile_settings;
DROP POLICY IF EXISTS "Admin UUID can delete profile settings" ON public.profile_settings;

CREATE POLICY "Admin UUID can insert profile settings"
    ON public.profile_settings
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_studio_admin());

CREATE POLICY "Admin UUID can update profile settings"
    ON public.profile_settings
    FOR UPDATE
    TO authenticated
    USING (public.is_studio_admin())
    WITH CHECK (public.is_studio_admin());

CREATE POLICY "Admin UUID can delete profile settings"
    ON public.profile_settings
    FOR DELETE
    TO authenticated
    USING (public.is_studio_admin());

-- 4. Storage Buckets & Admin-UUID-Restricted Storage Policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-videos', 'portfolio-videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-thumbnails', 'portfolio-thumbnails', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view portfolio videos" ON storage.objects;
CREATE POLICY "Public can view portfolio videos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-videos');

DROP POLICY IF EXISTS "Public can view portfolio thumbnails" ON storage.objects;
CREATE POLICY "Public can view portfolio thumbnails"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-thumbnails');

DROP POLICY IF EXISTS "Public can view profile images" ON storage.objects;
CREATE POLICY "Public can view profile images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'profile-images');

DROP POLICY IF EXISTS "Admin email can manage portfolio videos" ON storage.objects;
DROP POLICY IF EXISTS "Admin UUID can insert portfolio videos" ON storage.objects;
DROP POLICY IF EXISTS "Admin UUID can update portfolio videos" ON storage.objects;
DROP POLICY IF EXISTS "Admin UUID can delete portfolio videos" ON storage.objects;

CREATE POLICY "Admin UUID can insert portfolio videos"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-videos' AND public.is_studio_admin());

CREATE POLICY "Admin UUID can update portfolio videos"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-videos' AND public.is_studio_admin())
    WITH CHECK (bucket_id = 'portfolio-videos' AND public.is_studio_admin());

CREATE POLICY "Admin UUID can delete portfolio videos"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-videos' AND public.is_studio_admin());

DROP POLICY IF EXISTS "Admin email can manage portfolio thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admin UUID can insert portfolio thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admin UUID can update portfolio thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admin UUID can delete portfolio thumbnails" ON storage.objects;

CREATE POLICY "Admin UUID can insert portfolio thumbnails"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-thumbnails' AND public.is_studio_admin());

CREATE POLICY "Admin UUID can update portfolio thumbnails"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-thumbnails' AND public.is_studio_admin())
    WITH CHECK (bucket_id = 'portfolio-thumbnails' AND public.is_studio_admin());

CREATE POLICY "Admin UUID can delete portfolio thumbnails"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-thumbnails' AND public.is_studio_admin());

DROP POLICY IF EXISTS "Admin email can manage profile images" ON storage.objects;
DROP POLICY IF EXISTS "Admin UUID can insert profile images" ON storage.objects;
DROP POLICY IF EXISTS "Admin UUID can update profile images" ON storage.objects;
DROP POLICY IF EXISTS "Admin UUID can delete profile images" ON storage.objects;

CREATE POLICY "Admin UUID can insert profile images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'profile-images' AND public.is_studio_admin());

CREATE POLICY "Admin UUID can update profile images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'profile-images' AND public.is_studio_admin())
    WITH CHECK (bucket_id = 'profile-images' AND public.is_studio_admin());

CREATE POLICY "Admin UUID can delete profile images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'profile-images' AND public.is_studio_admin());

NOTIFY pgrst, 'reload schema';
