-- ==============================================================================
-- ISMAIL SARDER — AI UGC PORTFOLIO VIDEO PLAYER & ASPECT RATIO UPGRADE
-- SAFE MIGRATION SCRIPT (Preserves all existing projects, videos, and records)
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Safely add aspect ratio and video dimension metadata columns to portfolio_projects
ALTER TABLE public.portfolio_projects
  ADD COLUMN IF NOT EXISTS aspect_ratio TEXT DEFAULT 'auto',
  ADD COLUMN IF NOT EXISTS video_width INTEGER DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS video_height INTEGER DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS video_mime_type TEXT DEFAULT 'video/mp4';

-- 2. Optional: Set default aspect ratio for existing rows if NULL
UPDATE public.portfolio_projects
SET aspect_ratio = 'auto'
WHERE aspect_ratio IS NULL;

-- 3. Verify columns were created
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'portfolio_projects'
  AND column_name IN ('aspect_ratio', 'video_width', 'video_height', 'video_mime_type');
