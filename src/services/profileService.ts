import {
  supabase,
  isSupabaseConfigured,
  BUCKET_PROFILE_IMAGES,
  BUCKET_THUMBNAILS,
  TABLE_PROFILE_SETTINGS,
} from '../lib/supabase.ts';
import { isAuthorizedAdminUser } from '../context/AuthContext.tsx';

const PRIMARY_PROFILE_ROW_ID = 'primary_profile';
const PRIMARY_PROFILE_UUID = '00000000-0000-4000-8000-000000000001';

async function requireAdminSession(): Promise<Error | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session || !isAuthorizedAdminUser(session.user)) {
    return new Error('Unauthorized: Admin UUID authentication is required to modify profile media.');
  }
  return null;
}

export interface ProfileSettings {
  id: string;
  full_name?: string;
  title?: string;
  profile_image_url: string | null;
  profile_image_path: string | null;
  updated_at?: string;
}

const LOCAL_STORAGE_URL_KEY = 'ismail_profile_image_url';
const LOCAL_STORAGE_PATH_KEY = 'ismail_profile_image_path';

function isSchemaColumnError(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false;
  if (error.code === 'PGRST204' || error.code === '42703') return true;
  const msg = (error.message || '').toLowerCase();
  return msg.includes('schema cache') || msg.includes('column');
}

function isUuidSyntaxError(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false;
  if (error.code === '22P02') return true;
  return (error.message || '').toLowerCase().includes('invalid input syntax for type uuid');
}

function isPrimaryProfileRow(row: Record<string, any>): boolean {
  if (!row) return false;
  if (row.id === PRIMARY_PROFILE_ROW_ID || row.id === PRIMARY_PROFILE_UUID) return true;
  // Exclude intro config or studio content rows
  if (typeof row.profile_image_path === 'string' && row.profile_image_path.trim().startsWith('{')) {
    return false;
  }
  if (typeof row.title === 'string' && row.title.trim().startsWith('{')) {
    return false;
  }
  return typeof row.profile_image_url === 'string' && row.profile_image_url.length > 0;
}

async function discoverStorageProfileImage(): Promise<{ url: string; path: string } | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  for (const bucket of [BUCKET_PROFILE_IMAGES, BUCKET_THUMBNAILS]) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list('avatars', { limit: 5, sortBy: { column: 'created_at', order: 'desc' } });

      if (!error && Array.isArray(data)) {
        const latest = data.find((item) => item?.name && /\.(jpg|jpeg|png|webp)$/i.test(item.name));
        if (latest) {
          const path = `avatars/${latest.name}`;
          const {
            data: { publicUrl },
          } = supabase.storage.from(bucket).getPublicUrl(path);
          return { url: publicUrl, path };
        }
      }
    } catch {
      // Try next bucket
    }
  }
  return null;
}

async function upsertProfileRow(
  imageUrl: string | null,
  imagePath: string | null,
  nowIso: string
) {
  const tryUpsert = async (rowId: string) => {
    let { error } = await supabase
      .from(TABLE_PROFILE_SETTINGS)
      .upsert(
        {
          id: rowId,
          full_name: 'Ismail Sarder',
          title: 'AI UGC Ad Creator & Creative Strategist',
          profile_image_url: imageUrl,
          profile_image_path: imagePath,
          updated_at: nowIso,
        },
        { onConflict: 'id' }
      );

    if (error && isSchemaColumnError(error)) {
      const minimalResult = await supabase.from(TABLE_PROFILE_SETTINGS).upsert(
        {
          id: rowId,
          profile_image_url: imageUrl,
          profile_image_path: imagePath,
          updated_at: nowIso,
        },
        { onConflict: 'id' }
      );
      error = minimalResult.error;
    }

    return error;
  };

  let error = await tryUpsert(PRIMARY_PROFILE_ROW_ID);
  if (error && isUuidSyntaxError(error)) {
    error = await tryUpsert(PRIMARY_PROFILE_UUID);
  }
  return error;
}

export const profileService = {
  /**
   * Fetch current profile picture configuration from Supabase with Storage & local fallback
   */
  async getProfileSettings(): Promise<ProfileSettings> {
    const fallbackUrl = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_URL_KEY) : null;
    const fallbackPath = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_PATH_KEY) : null;

    if (supabase && isSupabaseConfigured()) {
      try {
        // Query without non-UUID string filter so UUID-typed tables never fail with 22P02
        const { data, error } = await supabase
          .from(TABLE_PROFILE_SETTINGS)
          .select('*')
          .limit(20);

        if (!error && Array.isArray(data)) {
          const row = data.find((r) => isPrimaryProfileRow(r as Record<string, any>));
          if (row) {
            const url = row.profile_image_url || null;
            const path = row.profile_image_path || null;
            if (typeof window !== 'undefined') {
              if (url) {
                localStorage.setItem(LOCAL_STORAGE_URL_KEY, url);
              } else {
                localStorage.removeItem(LOCAL_STORAGE_URL_KEY);
              }
              if (path) {
                localStorage.setItem(LOCAL_STORAGE_PATH_KEY, path);
              } else {
                localStorage.removeItem(LOCAL_STORAGE_PATH_KEY);
              }
            }

            return {
              id: row.id || PRIMARY_PROFILE_ROW_ID,
              full_name: row.full_name || 'Ismail Sarder',
              title: row.title || 'AI UGC Ad Creator & Creative Strategist',
              profile_image_url: url,
              profile_image_path: path,
              updated_at: row.updated_at,
            };
          }
        }

        // Discover uploaded avatar directly from Storage if profile_settings row doesn't exist yet
        const discovered = await discoverStorageProfileImage();
        if (discovered) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_URL_KEY, discovered.url);
            localStorage.setItem(LOCAL_STORAGE_PATH_KEY, discovered.path);
          }
          return {
            id: PRIMARY_PROFILE_ROW_ID,
            full_name: 'Ismail Sarder',
            title: 'AI UGC Ad Creator & Creative Strategist',
            profile_image_url: discovered.url,
            profile_image_path: discovered.path,
          };
        }
      } catch (err) {
        console.warn('Could not fetch profile settings from Supabase, using local fallback:', err);
      }
    }

    return {
      id: PRIMARY_PROFILE_ROW_ID,
      full_name: 'Ismail Sarder',
      title: 'AI UGC Ad Creator & Creative Strategist',
      profile_image_url: fallbackUrl,
      profile_image_path: fallbackPath,
    };
  },

  /**
   * Upload cropped profile picture to Supabase Storage ('profile-images' primary, 'portfolio-thumbnails/avatars' fallback)
   * and update profile_settings database record.
   */
  async uploadProfileImage(
    file: Blob | File,
    onProgress?: (progress: number) => void
  ): Promise<{ publicUrl: string; path: string; error: Error | null }> {
    const fileName = `ismail_profile_${Date.now()}.jpg`;
    const filePath = `avatars/${fileName}`;

    if (onProgress) onProgress(20);

    let uploadedUrl: string | null = null;
    let uploadedPath = filePath;

    if (supabase && isSupabaseConfigured()) {
      const authError = await requireAdminSession();
      if (authError) {
        return { publicUrl: '', path: '', error: authError };
      }

      if (onProgress) onProgress(45);

      for (const bucket of [BUCKET_PROFILE_IMAGES, BUCKET_THUMBNAILS]) {
        try {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
              contentType: 'image/jpeg',
              cacheControl: '3600',
              upsert: true,
            });

          if (!uploadError) {
            if (onProgress) onProgress(75);
            const { data: publicUrlData } = supabase.storage
              .from(bucket)
              .getPublicUrl(uploadData?.path || filePath);
            uploadedUrl = publicUrlData.publicUrl;
            uploadedPath = uploadData?.path || filePath;
            break;
          }
          console.warn(`Supabase storage upload note (${bucket}):`, uploadError.message);
        } catch (err) {
          console.warn(`Supabase storage upload exception (${bucket}):`, err);
        }
      }

      if (uploadedUrl) {
        const dbError = await upsertProfileRow(uploadedUrl, uploadedPath, new Date().toISOString());
        if (dbError) {
          console.warn('Supabase profile_settings db update warning:', dbError.message);
        }
        if (onProgress) onProgress(100);
      }
    }

    // Last-resort Data URL fallback if no remote bucket succeeded
    if (!uploadedUrl) {
      if (onProgress) onProgress(80);
      uploadedUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      if (onProgress) onProgress(100);
    }

    if (typeof window !== 'undefined' && uploadedUrl) {
      localStorage.setItem(LOCAL_STORAGE_URL_KEY, uploadedUrl);
      localStorage.setItem(LOCAL_STORAGE_PATH_KEY, uploadedPath);
    }

    return {
      publicUrl: uploadedUrl,
      path: uploadedPath,
      error: null,
    };
  },

  /**
   * Delete custom profile picture from Supabase Storage and database table
   */
  async deleteProfileImage(currentPath?: string | null): Promise<{ success: boolean; error: Error | null }> {
    if (supabase && isSupabaseConfigured()) {
      const authError = await requireAdminSession();
      if (authError) {
        return { success: false, error: authError };
      }
      try {
        if (currentPath) {
          await supabase.storage.from(BUCKET_PROFILE_IMAGES).remove([currentPath]).catch(() => {});
          await supabase.storage.from(BUCKET_THUMBNAILS).remove([currentPath]).catch(() => {});
        }
        await upsertProfileRow(null, null, new Date().toISOString());
      } catch (err: unknown) {
        console.warn('Failed to delete profile picture in Supabase:', err);
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_URL_KEY);
      localStorage.removeItem(LOCAL_STORAGE_PATH_KEY);
    }

    return { success: true, error: null };
  },
};

