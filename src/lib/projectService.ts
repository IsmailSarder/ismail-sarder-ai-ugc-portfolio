import {
  supabase,
  TABLE_PROJECTS,
  BUCKET_VIDEOS,
  BUCKET_THUMBNAILS,
  SupabaseProject,
} from './supabase.ts';

export interface UploadProgress {
  status: 'idle' | 'uploading-thumbnail' | 'uploading-video' | 'saving' | 'success' | 'error';
  message: string;
  percentage?: number;
}

/**
 * Fetch all published projects for the public portfolio.
 * Gracefully returns empty array if table does not exist yet.
 */
export async function getPublishedProjects(): Promise<{
  data: SupabaseProject[];
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from(TABLE_PROJECTS)
      .select('*')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase getPublishedProjects warning:', error.message);
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (err: any) {
    console.warn('Supabase fetch exception:', err);
    return { data: [], error: err.message || 'Failed to fetch published projects' };
  }
}

/**
 * Fetch all projects for the authenticated admin (including drafts).
 */
export async function getAllAdminProjects(): Promise<{
  data: SupabaseProject[];
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from(TABLE_PROJECTS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (err: any) {
    return { data: [], error: err.message || 'Failed to fetch admin projects' };
  }
}

/**
 * Upload a media file (video or thumbnail) to Supabase Storage.
 */
export async function uploadMediaFile(
  file: File,
  bucket: typeof BUCKET_VIDEOS | typeof BUCKET_THUMBNAILS
): Promise<{ url: string; path: string }> {
  // Sanitize filename
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${Date.now()}_${cleanName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload to ${bucket} failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return {
    path: data.path,
    url: publicUrl,
  };
}

/**
 * Create or update a portfolio project.
 */
export async function saveProject(
  project: Partial<SupabaseProject>,
  projectId?: string
): Promise<{ data: SupabaseProject | null; error: string | null }> {
  try {
    if (projectId) {
      // Update
      const { data, error } = await supabase
        .from(TABLE_PROJECTS)
        .update({
          ...project,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data, error: null };
    } else {
      // Insert
      const { data, error } = await supabase
        .from(TABLE_PROJECTS)
        .insert([
          {
            ...project,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data, error: null };
    }
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to save project' };
  }
}

/**
 * Delete a project and its associated media files from storage.
 */
export async function deleteProject(
  id: string,
  videoPath?: string,
  thumbnailPath?: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // 1. Delete row from table
    const { error: dbError } = await supabase
      .from(TABLE_PROJECTS)
      .delete()
      .eq('id', id);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    // 2. Clean up storage files asynchronously (non-blocking)
    if (videoPath) {
      supabase.storage.from(BUCKET_VIDEOS).remove([videoPath]).catch(console.error);
    }
    if (thumbnailPath) {
      supabase.storage.from(BUCKET_THUMBNAILS).remove([thumbnailPath]).catch(console.error);
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete project' };
  }
}
