-- =========================================================================
-- ISMAIL SARDER — AI UGC CREATIVE STUDIO
-- Supabase PostgreSQL Database Schema & Row Level Security (RLS) Policies
-- =========================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/_/sql
-- 2. Click "New Query"
-- 3. Paste and run this entire SQL script
-- 4. Copy your Project URL & Anon Public Key into your environment:
--    VITE_SUPABASE_URL=https://your-project.supabase.co
--    VITE_SUPABASE_ANON_KEY=eyJh...
-- =========================================================================

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------------------
-- 1. Table: project_inquiries
-- Stores client brand briefs, selected services, budget tiers & contact info
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    website_url TEXT,
    industry TEXT NOT NULL DEFAULT 'Skincare & Beauty',
    budget TEXT NOT NULL DEFAULT '$1,500 - $3,000 (Multi-Hook Batch)',
    selected_services TEXT[] DEFAULT '{}',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'archived')),
    notes TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.project_inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON public.project_inquiries (email);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.project_inquiries (status);

-- -------------------------------------------------------------------------
-- 2. Row Level Security (RLS) Policies
-- -------------------------------------------------------------------------
-- Enable RLS on the inquiries table
ALTER TABLE public.project_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy A: Allow public anonymous visitors to submit new inquiries (INSERT)
DROP POLICY IF EXISTS "Allow anonymous visitors to insert inquiries" ON public.project_inquiries;
CREATE POLICY "Allow anonymous visitors to insert inquiries"
ON public.project_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy B: Allow authenticated studio owner or service role to read inquiries (SELECT)
DROP POLICY IF EXISTS "Allow authenticated studio owner to read inquiries" ON public.project_inquiries;
CREATE POLICY "Allow authenticated studio owner to read inquiries"
ON public.project_inquiries
FOR SELECT
TO authenticated
USING (true);

-- Policy C: Allow authenticated studio owner to update inquiry status (UPDATE)
DROP POLICY IF EXISTS "Allow authenticated studio owner to update inquiries" ON public.project_inquiries;
CREATE POLICY "Allow authenticated studio owner to update inquiries"
ON public.project_inquiries
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);


-- -------------------------------------------------------------------------
-- 3. Optional Table: dynamic_portfolio_projects
-- Allows Ismail to manage and publish new portfolio showcase items directly
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dynamic_portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    duration TEXT NOT NULL DEFAULT '0:30',
    format TEXT NOT NULL DEFAULT '9:16 Vertical Video',
    thumbnail_url TEXT NOT NULL,
    hook_script TEXT NOT NULL,
    angle TEXT NOT NULL,
    overview TEXT NOT NULL,
    is_concept BOOLEAN NOT NULL DEFAULT true,
    target_market TEXT NOT NULL DEFAULT 'USA & United Kingdom',
    key_features TEXT[] DEFAULT '{}',
    sort_order INT DEFAULT 0
);

-- Enable RLS for portfolio
ALTER TABLE public.dynamic_portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active portfolio items
DROP POLICY IF EXISTS "Allow public read access to portfolio items" ON public.dynamic_portfolio_projects;
CREATE POLICY "Allow public read access to portfolio items"
ON public.dynamic_portfolio_projects
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow authenticated studio owner to modify portfolio items
DROP POLICY IF EXISTS "Allow studio owner full access to portfolio items" ON public.dynamic_portfolio_projects;
CREATE POLICY "Allow studio owner full access to portfolio items"
ON public.dynamic_portfolio_projects
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =========================================================================
-- Success Confirmation
-- =========================================================================
COMMENT ON TABLE public.project_inquiries IS 'Lead inquiries submitted through Ismail Sarder portfolio website';
COMMENT ON TABLE public.dynamic_portfolio_projects IS 'Showcase videos and spec creative benchmarks';
