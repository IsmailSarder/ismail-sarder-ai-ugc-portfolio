import { supabase, isSupabaseConfigured, BUCKET_PROFILE_IMAGES, TABLE_PROFILE_SETTINGS } from '../lib/supabase.ts';

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

export const profileService = {
  /**
   * Fetch current profile picture configuration from Supabase with local storage fallback
   */
  async getProfileSettings(): Promise<ProfileSettings> {
    const fallbackUrl = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_URL_KEY) : null;
    const fallbackPath = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_PATH_KEY) : null;

    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from(TABLE_PROFILE_SETTINGS)
          .select('*')
          .eq('id', 'primary_profile')
          .maybeSingle();

        if (!error && data) {
          // Sync with local storage
          if (typeof window !== 'undefined') {
            if (data.profile_image_url) {
              localStorage.setItem(LOCAL_STORAGE_URL_KEY, data.profile_image_url);
            } else {
              localStorage.removeItem(LOCAL_STORAGE_URL_KEY);
            }
            if (data.profile_image_path) {
              localStorage.setItem(LOCAL_STORAGE_PATH_KEY, data.profile_image_path);
            } else {
              localStorage.removeItem(LOCAL_STORAGE_PATH_KEY);
            }
          }

          return {
            id: 'primary_profile',
            full_name: data.full_name || 'Ismail Sarder',
            title: data.title || 'AI UGC Ad Creator & Creative Strategist',
            profile_image_url: data.profile_image_url || null,
            profile_image_path: data.profile_image_path || null,
            updated_at: data.updated_at,
          };
        }
      } catch (err) {
        console.warn('Could not fetch profile settings from Supabase, using local fallback:', err);
      }
    }

    return {
      id: 'primary_profile',
      full_name: 'Ismail Sarder',
      title: 'AI UGC Ad Creator & Creative Strategist',
      profile_image_url: fallbackUrl,
      profile_image_path: fallbackPath,
    };
  },

  /**
   * Upload cropped profile picture to Supabase Storage 'profile-images' bucket
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
      try {
        if (onProgress) onProgress(45);

        // Upload to profile-images bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(BUCKET_PROFILE_IMAGES)
          .upload(filePath, file, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          console.warn('Supabase profile storage upload warning:', uploadError);
          throw uploadError;
        }

        if (onProgress) onProgress(75);

        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_PROFILE_IMAGES)
          .getPublicUrl(uploadData?.path || filePath);

        uploadedUrl = publicUrlData.publicUrl;
        uploadedPath = uploadData?.path || filePath;

        // Upsert into profile_settings table
        const { error: dbError } = await supabase
          .from(TABLE_PROFILE_SETTINGS)
          .upsert({
            id: 'primary_profile',
            full_name: 'Ismail Sarder',
            title: 'AI UGC Ad Creator & Creative Strategist',
            profile_image_url: uploadedUrl,
            profile_image_path: uploadedPath,
            updated_at: new Date().toISOString(),
          });

        if (dbError) {
          console.warn('Supabase profile_settings db update warning (table may need creation):', dbError);
        }

        if (onProgress) onProgress(100);
      } catch (err: unknown) {
        console.warn('Supabase storage upload failed or not provisioned yet, falling back to local object storage:', err);
      }
    }

    // Graceful fallback to Data URL if Supabase bucket wasn't reachable
    if (!uploadedUrl) {
      if (onProgress) onProgress(80);
      uploadedUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      if (onProgress) onProgress(100);
    }

    // Always cache in localStorage so it appears everywhere immediately
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
      try {
        if (currentPath) {
          await supabase.storage.from(BUCKET_PROFILE_IMAGES).remove([currentPath]);
        }

        // Reset profile_settings record
        await supabase
          .from(TABLE_PROFILE_SETTINGS)
          .upsert({
            id: 'primary_profile',
            full_name: 'Ismail Sarder',
            title: 'AI UGC Ad Creator & Creative Strategist',
            profile_image_url: null,
            profile_image_path: null,
            updated_at: new Date().toISOString(),
          });
      } catch (err: unknown) {
        console.warn('Failed to delete profile picture in Supabase:', err);
      }
    }

    // Clear local storage cache
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_URL_KEY);
      localStorage.removeItem(LOCAL_STORAGE_PATH_KEY);
    }

    return { success: true, error: null };
  },
};
