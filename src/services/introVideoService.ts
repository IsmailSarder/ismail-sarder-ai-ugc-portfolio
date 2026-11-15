import {
  supabase,
  isSupabaseConfigured,
  TABLE_PROFILE_SETTINGS,
  STORAGE_BUCKETS,
} from '../lib/supabase.ts';

export interface IntroVideoSettings {
  heading: string;
  subheading: string;
  description: string;
  video_url: string;
  video_path: string;
  thumbnail_url: string;
  thumbnail_path: string;
  is_published: boolean;
  updated_at?: string;
}

export const DEFAULT_INTRO_VIDEO_SETTINGS: IntroVideoSettings = {
  heading: 'MEET THE CREATOR',
  subheading: 'Creative Ideas. Powerful Visuals. Ads That Stand Out.',
  description:
    'Discover how I transform product ideas into engaging AI-powered UGC videos and cinematic CGI advertisements. Watch my introduction to explore my creative approach, services, and video advertising style.',
  video_url: '',
  video_path: '',
  thumbnail_url: '',
  thumbnail_path: '',
  is_published: true,
};

const INTRO_CONFIG_ROW_ID = 'intro_video_config';
const LOCAL_INTRO_STORAGE_KEY = 'ismail_intro_video_settings';

interface SerializedIntroMeta {
  subheading?: string;
  description?: string;
  video_url?: string;
  video_path?: string;
  is_published?: boolean;
}

function readLocalCache(): IntroVideoSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_INTRO_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_INTRO_VIDEO_SETTINGS,
      ...parsed,
    };
  } catch {
    return null;
  }
}

function writeLocalCache(settings: IntroVideoSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_INTRO_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Could not cache intro video settings locally:', err);
  }
}

export const introVideoService = {
  async getIntroVideoSettings(): Promise<IntroVideoSettings> {
    const cached = readLocalCache();

    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from(TABLE_PROFILE_SETTINGS)
          .select('*')
          .eq('id', INTRO_CONFIG_ROW_ID)
          .maybeSingle();

        if (!error && data) {
          let meta: SerializedIntroMeta = {};
          if (data.title) {
            try {
              meta = JSON.parse(data.title);
            } catch {
              meta = {};
            }
          }

          const resolved: IntroVideoSettings = {
            heading: data.full_name || DEFAULT_INTRO_VIDEO_SETTINGS.heading,
            subheading: meta.subheading ?? DEFAULT_INTRO_VIDEO_SETTINGS.subheading,
            description: meta.description ?? DEFAULT_INTRO_VIDEO_SETTINGS.description,
            video_url: meta.video_url ?? '',
            video_path: meta.video_path ?? '',
            thumbnail_url: data.profile_image_url || '',
            thumbnail_path: data.profile_image_path || '',
            is_published:
              typeof meta.is_published === 'boolean'
                ? meta.is_published
                : DEFAULT_INTRO_VIDEO_SETTINGS.is_published,
            updated_at: data.updated_at,
          };

          writeLocalCache(resolved);
          return resolved;
        }
      } catch (err) {
        console.warn('Intro video fetch note (using cached/default):', err);
      }
    }

    return cached || { ...DEFAULT_INTRO_VIDEO_SETTINGS };
  },

  async saveIntroVideoSettings(
    settings: IntroVideoSettings
  ): Promise<{ success: boolean; syncedWithSupabase: boolean; error: string | null }> {
    const cleanSettings: IntroVideoSettings = {
      heading: settings.heading.trim() || DEFAULT_INTRO_VIDEO_SETTINGS.heading,
      subheading: settings.subheading.trim() || DEFAULT_INTRO_VIDEO_SETTINGS.subheading,
      description: settings.description.trim() || DEFAULT_INTRO_VIDEO_SETTINGS.description,
      video_url: settings.video_url.trim(),
      video_path: settings.video_path.trim(),
      thumbnail_url: settings.thumbnail_url.trim(),
      thumbnail_path: settings.thumbnail_path.trim(),
      is_published: Boolean(settings.is_published),
      updated_at: new Date().toISOString(),
    };

    writeLocalCache(cleanSettings);

    if (supabase && isSupabaseConfigured()) {
      try {
        const serializedMeta: SerializedIntroMeta = {
          subheading: cleanSettings.subheading,
          description: cleanSettings.description,
          video_url: cleanSettings.video_url,
          video_path: cleanSettings.video_path,
          is_published: cleanSettings.is_published,
        };

        const { error } = await supabase.from(TABLE_PROFILE_SETTINGS).upsert({
          id: INTRO_CONFIG_ROW_ID,
          full_name: cleanSettings.heading,
          title: JSON.stringify(serializedMeta),
          profile_image_url: cleanSettings.thumbnail_url || null,
          profile_image_path: cleanSettings.thumbnail_path || null,
          updated_at: cleanSettings.updated_at,
        });

        if (error) {
          return {
            success: false,
            syncedWithSupabase: false,
            error: `Supabase save failed: ${error.message}. Ensure 'profile_settings' table exists and you are logged in as admin.`,
          };
        }

        return { success: true, syncedWithSupabase: true, error: null };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save intro video settings.';
        return { success: false, syncedWithSupabase: false, error: msg };
      }
    }

    return { success: true, syncedWithSupabase: false, error: null };
  },

  async uploadIntroVideo(
    file: File
  ): Promise<{ path: string; publicUrl: string; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'mp4';
      const cleanName = file.name
        .substring(0, Math.max(0, file.name.lastIndexOf('.')))
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      const filePath = `intro/${Date.now()}_${cleanName || 'intro_video'}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKETS.VIDEOS)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from(STORAGE_BUCKETS.VIDEOS).getPublicUrl(data.path);

      return { path: data.path, publicUrl, error: null };
    } catch (err) {
      return { path: '', publicUrl: '', error: err as Error };
    }
  },

  async uploadIntroThumbnail(
    file: File
  ): Promise<{ path: string; publicUrl: string; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanName = file.name
        .substring(0, Math.max(0, file.name.lastIndexOf('.')))
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      const filePath = `intro-thumbnails/${Date.now()}_${cleanName || 'intro_thumb'}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKETS.THUMBNAILS)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from(STORAGE_BUCKETS.THUMBNAILS).getPublicUrl(data.path);

      return { path: data.path, publicUrl, error: null };
    } catch (err) {
      return { path: '', publicUrl: '', error: err as Error };
    }
  },

  async deleteStorageFile(bucket: string, path?: string): Promise<void> {
    if (!path) return;
    try {
      await supabase.storage.from(bucket).remove([path]);
    } catch (err) {
      console.warn(`Failed to clean up storage asset in ${bucket}:`, err);
    }
  },
};
