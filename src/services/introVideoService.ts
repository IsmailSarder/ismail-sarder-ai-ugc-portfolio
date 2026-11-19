import {
  supabase,
  isSupabaseConfigured,
  TABLE_PROFILE_SETTINGS,
  STORAGE_BUCKETS,
} from '../lib/supabase.ts';
import { isAuthorizedAdminUser } from '../context/AuthContext.tsx';

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
const INTRO_CONFIG_UUID = '00000000-0000-4000-8000-000000000002';
const LOCAL_INTRO_STORAGE_KEY = 'ismail_intro_video_settings';

interface SerializedIntroMeta {
  v?: 'tier1' | 'tier2';
  subheading?: string;
  description?: string;
  video_url?: string;
  video_path?: string;
  is_published?: boolean;
}

interface LegacyIntroPathPayload {
  __intro_v2: true;
  heading?: string;
  subheading?: string;
  description?: string;
  video_url?: string;
  video_path?: string;
  thumbnail_url?: string;
  thumbnail_path?: string;
  is_published?: boolean;
}

interface PostgrestLikeError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

function isSchemaCacheColumnError(error: PostgrestLikeError | null | undefined): boolean {
  if (!error) return false;
  if (error.code === 'PGRST204' || error.code === '42703') return true;
  const msg = (error.message || '').toLowerCase();
  return (
    msg.includes('schema cache') ||
    msg.includes('could not find the') ||
    (msg.includes('column') && msg.includes('does not exist'))
  );
}

function isUuidSyntaxError(error: PostgrestLikeError | null | undefined): boolean {
  if (!error) return false;
  if (error.code === '22P02') return true;
  const msg = (error.message || '').toLowerCase();
  return msg.includes('invalid input syntax for type uuid');
}

function isRlsOrAuthError(error: PostgrestLikeError | null | undefined): boolean {
  if (!error) return false;
  if (error.code === '42501' || error.code === 'PGRST301') return true;
  const msg = (error.message || '').toLowerCase();
  return (
    msg.includes('row-level security') ||
    msg.includes('permission denied') ||
    msg.includes('jwt') ||
    msg.includes('unauthorized')
  );
}

async function verifyAuthenticatedAdmin(): Promise<{ ok: boolean; error: string | null }> {
  if (!supabase || !isSupabaseConfigured()) {
    return { ok: true, error: null };
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return {
      ok: false,
      error: `Authentication check failed: ${error.message}. Please sign in again.`,
    };
  }

  if (!session || !session.user) {
    return {
      ok: false,
      error: 'Your admin session has expired. Please sign in again before saving or uploading.',
    };
  }

  if (!isAuthorizedAdminUser(session.user)) {
    return {
      ok: false,
      error: 'Access denied. Only the authorized studio admin account can update Intro Video settings.',
    };
  }

  return { ok: true, error: null };
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

function parseRowToSettings(row: Record<string, any>): IntroVideoSettings {
  // 1. Check for compact legacy payload serialized inside profile_image_path (Tier 3 schema)
  if (typeof row.profile_image_path === 'string' && row.profile_image_path.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(row.profile_image_path) as LegacyIntroPathPayload;
      if (parsed && parsed.__intro_v2 === true) {
        return {
          heading: parsed.heading || DEFAULT_INTRO_VIDEO_SETTINGS.heading,
          subheading: parsed.subheading ?? DEFAULT_INTRO_VIDEO_SETTINGS.subheading,
          description: parsed.description ?? DEFAULT_INTRO_VIDEO_SETTINGS.description,
          video_url: parsed.video_url ?? '',
          video_path: parsed.video_path ?? '',
          thumbnail_url: parsed.thumbnail_url ?? row.profile_image_url ?? '',
          thumbnail_path: parsed.thumbnail_path ?? '',
          is_published:
            typeof parsed.is_published === 'boolean'
              ? parsed.is_published
              : DEFAULT_INTRO_VIDEO_SETTINGS.is_published,
          updated_at: row.updated_at,
        };
      }
    } catch {
      // Fall through if profile_image_path is a plain storage path
    }
  }

  // 2. Parse metadata JSON stored in `title` (Tier 1 & Tier 2 compatibility)
  let meta: SerializedIntroMeta = {};
  if (typeof row.title === 'string' && row.title.trim().startsWith('{')) {
    try {
      meta = JSON.parse(row.title) as SerializedIntroMeta;
    } catch {
      meta = {};
    }
  }

  const hasDedicatedIntroColumns =
    'intro_heading' in row || 'intro_video_url' in row || 'intro_is_published' in row;

  if (hasDedicatedIntroColumns && meta.v === 'tier1') {
    return {
      heading: row.intro_heading || row.full_name || DEFAULT_INTRO_VIDEO_SETTINGS.heading,
      subheading: row.intro_subheading ?? meta.subheading ?? DEFAULT_INTRO_VIDEO_SETTINGS.subheading,
      description: row.intro_description ?? meta.description ?? DEFAULT_INTRO_VIDEO_SETTINGS.description,
      video_url: row.intro_video_url ?? meta.video_url ?? '',
      video_path: row.intro_video_path ?? meta.video_path ?? '',
      thumbnail_url: row.intro_thumbnail_url ?? row.profile_image_url ?? '',
      thumbnail_path: row.intro_thumbnail_path ?? row.profile_image_path ?? '',
      is_published:
        typeof row.intro_is_published === 'boolean'
          ? row.intro_is_published
          : typeof meta.is_published === 'boolean'
          ? meta.is_published
          : DEFAULT_INTRO_VIDEO_SETTINGS.is_published,
      updated_at: row.updated_at,
    };
  }

  // 3. Tier 2 (full_name + title JSON + profile_image_url/path)
  return {
    heading: row.full_name || row.intro_heading || DEFAULT_INTRO_VIDEO_SETTINGS.heading,
    subheading: meta.subheading ?? row.intro_subheading ?? DEFAULT_INTRO_VIDEO_SETTINGS.subheading,
    description: meta.description ?? row.intro_description ?? DEFAULT_INTRO_VIDEO_SETTINGS.description,
    video_url: meta.video_url ?? row.intro_video_url ?? '',
    video_path: meta.video_path ?? row.intro_video_path ?? '',
    thumbnail_url: row.profile_image_url || row.intro_thumbnail_url || '',
    thumbnail_path: row.profile_image_path || row.intro_thumbnail_path || '',
    is_published:
      typeof meta.is_published === 'boolean'
        ? meta.is_published
        : typeof row.intro_is_published === 'boolean'
        ? row.intro_is_published
        : DEFAULT_INTRO_VIDEO_SETTINGS.is_published,
    updated_at: row.updated_at,
  };
}

function isIntroConfigRow(row: Record<string, any>): boolean {
  if (!row) return false;
  if (row.id === INTRO_CONFIG_ROW_ID || row.id === INTRO_CONFIG_UUID) return true;
  if (typeof row.intro_video_url === 'string' && row.intro_video_url.length > 0) return true;
  if (typeof row.profile_image_path === 'string' && row.profile_image_path.includes('"__intro_v2"')) {
    return true;
  }
  if (typeof row.title === 'string' && row.title.includes('"video_url"')) return true;
  return false;
}

async function discoverStorageIntroMedia(): Promise<{
  video_url: string;
  video_path: string;
  thumbnail_url: string;
  thumbnail_path: string;
} | null> {
  if (!supabase || !isSupabaseConfigured()) return null;

  try {
    const [vidListRes, thumbListRes] = await Promise.all([
      supabase.storage
        .from(STORAGE_BUCKETS.VIDEOS)
        .list('intro', { limit: 10, sortBy: { column: 'created_at', order: 'desc' } }),
      supabase.storage
        .from(STORAGE_BUCKETS.THUMBNAILS)
        .list('intro-thumbnails', { limit: 10, sortBy: { column: 'created_at', order: 'desc' } }),
    ]);

    const latestVideo = (vidListRes.data || []).find(
      (item) => item?.name && /\.(mp4|mov|webm|m4v)$/i.test(item.name)
    );
    if (!latestVideo) return null;

    const videoPath = `intro/${latestVideo.name}`;
    const {
      data: { publicUrl: videoUrl },
    } = supabase.storage.from(STORAGE_BUCKETS.VIDEOS).getPublicUrl(videoPath);

    let thumbUrl = '';
    let thumbPath = '';
    const latestThumb = (thumbListRes.data || []).find(
      (item) => item?.name && /\.(jpg|jpeg|png|webp)$/i.test(item.name)
    );
    if (latestThumb) {
      thumbPath = `intro-thumbnails/${latestThumb.name}`;
      const {
        data: { publicUrl },
      } = supabase.storage.from(STORAGE_BUCKETS.THUMBNAILS).getPublicUrl(thumbPath);
      thumbUrl = publicUrl;
    }

    return {
      video_url: videoUrl,
      video_path: videoPath,
      thumbnail_url: thumbUrl,
      thumbnail_path: thumbPath,
    };
  } catch (err) {
    console.warn('Storage intro media discovery note:', err);
    return null;
  }
}

export const introVideoService = {
  async getIntroVideoSettings(): Promise<IntroVideoSettings> {
    const cached = readLocalCache();

    if (supabase && isSupabaseConfigured()) {
      try {
        // Fetch without filtering on non-UUID string ID so UUID-typed profile_settings tables never error with 22P02
        const { data, error } = await supabase
          .from(TABLE_PROFILE_SETTINGS)
          .select('*')
          .limit(20);

        if (!error && Array.isArray(data)) {
          const matchedRow = data.find((r) => isIntroConfigRow(r as Record<string, any>));
          if (matchedRow) {
            const resolved = parseRowToSettings(matchedRow as Record<string, any>);
            if (!resolved.video_url) {
              const discovered = await discoverStorageIntroMedia();
              if (discovered) {
                resolved.video_url = discovered.video_url;
                resolved.video_path = discovered.video_path;
                if (!resolved.thumbnail_url && discovered.thumbnail_url) {
                  resolved.thumbnail_url = discovered.thumbnail_url;
                  resolved.thumbnail_path = discovered.thumbnail_path;
                }
              }
            }
            writeLocalCache(resolved);
            return resolved;
          }
        }

        // If DB table has no intro row yet (e.g. schema/id mismatch), auto-discover uploaded intro assets from Supabase Storage
        const discovered = await discoverStorageIntroMedia();
        if (discovered) {
          const resolved: IntroVideoSettings = {
            ...DEFAULT_INTRO_VIDEO_SETTINGS,
            heading: cached?.heading || DEFAULT_INTRO_VIDEO_SETTINGS.heading,
            subheading: cached?.subheading || DEFAULT_INTRO_VIDEO_SETTINGS.subheading,
            description: cached?.description || DEFAULT_INTRO_VIDEO_SETTINGS.description,
            video_url: discovered.video_url,
            video_path: discovered.video_path,
            thumbnail_url: discovered.thumbnail_url || cached?.thumbnail_url || '',
            thumbnail_path: discovered.thumbnail_path || cached?.thumbnail_path || '',
            is_published:
              typeof cached?.is_published === 'boolean'
                ? cached.is_published
                : DEFAULT_INTRO_VIDEO_SETTINGS.is_published,
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
  ): Promise<{
    success: boolean;
    syncedWithSupabase: boolean;
    error: string | null;
    settings?: IntroVideoSettings;
  }> {
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

    if (supabase && isSupabaseConfigured()) {
      try {
        const authCheck = await verifyAuthenticatedAdmin();
        if (!authCheck.ok) {
          return {
            success: false,
            syncedWithSupabase: false,
            error: authCheck.error,
          };
        }

        const tier1Meta: SerializedIntroMeta = {
          v: 'tier1',
          subheading: cleanSettings.subheading,
          description: cleanSettings.description,
          video_url: cleanSettings.video_url,
          video_path: cleanSettings.video_path,
          is_published: cleanSettings.is_published,
        };

        const attemptUpsertWithRowId = async (rowId: string) => {
          // Tier 1: Dedicated intro_* columns + standard profile_settings columns
          const tier1Payload = {
            id: rowId,
            full_name: cleanSettings.heading,
            title: JSON.stringify(tier1Meta),
            profile_image_url: cleanSettings.thumbnail_url || null,
            profile_image_path: cleanSettings.thumbnail_path || null,
            intro_heading: cleanSettings.heading,
            intro_subheading: cleanSettings.subheading,
            intro_description: cleanSettings.description,
            intro_video_url: cleanSettings.video_url,
            intro_video_path: cleanSettings.video_path,
            intro_thumbnail_url: cleanSettings.thumbnail_url,
            intro_thumbnail_path: cleanSettings.thumbnail_path,
            intro_is_published: cleanSettings.is_published,
            updated_at: cleanSettings.updated_at,
          };

          let { error } = await supabase
            .from(TABLE_PROFILE_SETTINGS)
            .upsert(tier1Payload, { onConflict: 'id' });

          // Tier 2: Older profile_settings table with full_name + title (without intro_* columns)
          if (error && isSchemaCacheColumnError(error)) {
            const tier2Meta: SerializedIntroMeta = {
              v: 'tier2',
              subheading: cleanSettings.subheading,
              description: cleanSettings.description,
              video_url: cleanSettings.video_url,
              video_path: cleanSettings.video_path,
              is_published: cleanSettings.is_published,
            };

            const tier2Result = await supabase.from(TABLE_PROFILE_SETTINGS).upsert(
              {
                id: rowId,
                full_name: cleanSettings.heading,
                title: JSON.stringify(tier2Meta),
                profile_image_url: cleanSettings.thumbnail_url || null,
                profile_image_path: cleanSettings.thumbnail_path || null,
                updated_at: cleanSettings.updated_at,
              },
              { onConflict: 'id' }
            );
            error = tier2Result.error;
          }

          // Tier 3: Minimal legacy profile_settings table without full_name/title columns
          if (error && isSchemaCacheColumnError(error)) {
            const legacyPayload: LegacyIntroPathPayload = {
              __intro_v2: true,
              heading: cleanSettings.heading,
              subheading: cleanSettings.subheading,
              description: cleanSettings.description,
              video_url: cleanSettings.video_url,
              video_path: cleanSettings.video_path,
              thumbnail_url: cleanSettings.thumbnail_url,
              thumbnail_path: cleanSettings.thumbnail_path,
              is_published: cleanSettings.is_published,
            };

            const tier3Result = await supabase.from(TABLE_PROFILE_SETTINGS).upsert(
              {
                id: rowId,
                profile_image_url: cleanSettings.thumbnail_url || null,
                profile_image_path: JSON.stringify(legacyPayload),
                updated_at: cleanSettings.updated_at,
              },
              { onConflict: 'id' }
            );
            error = tier3Result.error;
          }

          return error;
        };

        let error = await attemptUpsertWithRowId(INTRO_CONFIG_ROW_ID);
        if (error && isUuidSyntaxError(error)) {
          error = await attemptUpsertWithRowId(INTRO_CONFIG_UUID);
        }

        if (error) {
          if (isRlsOrAuthError(error)) {
            return {
              success: false,
              syncedWithSupabase: false,
              error: `Supabase permission error (RLS): ${error.message}. Verify your admin account is signed in and policies are configured in Admin → Database Setup.`,
            };
          }
          return {
            success: false,
            syncedWithSupabase: false,
            error: `Supabase save failed: ${error.message}. Ensure 'profile_settings' exists in Admin → Database Setup.`,
          };
        }

        writeLocalCache(cleanSettings);
        return {
          success: true,
          syncedWithSupabase: true,
          error: null,
          settings: cleanSettings,
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save intro video settings.';
        return { success: false, syncedWithSupabase: false, error: msg };
      }
    }

    writeLocalCache(cleanSettings);
    return {
      success: true,
      syncedWithSupabase: false,
      error: null,
      settings: cleanSettings,
    };
  },

  async uploadIntroVideo(
    file: File
  ): Promise<{ path: string; publicUrl: string; error: Error | null }> {
    try {
      const authCheck = await verifyAuthenticatedAdmin();
      if (!authCheck.ok) {
        return { path: '', publicUrl: '', error: new Error(authCheck.error || 'Authentication required.') };
      }

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
      return {
        path: '',
        publicUrl: '',
        error: err instanceof Error ? err : new Error('Failed to upload intro video.'),
      };
    }
  },

  async uploadIntroThumbnail(
    file: File
  ): Promise<{ path: string; publicUrl: string; error: Error | null }> {
    try {
      const authCheck = await verifyAuthenticatedAdmin();
      if (!authCheck.ok) {
        return { path: '', publicUrl: '', error: new Error(authCheck.error || 'Authentication required.') };
      }

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
      return {
        path: '',
        publicUrl: '',
        error: err instanceof Error ? err : new Error('Failed to upload intro thumbnail.'),
      };
    }
  },

  async deleteStorageFile(bucket: string, path?: string): Promise<void> {
    if (!path || path.trim().startsWith('{')) return;
    try {
      await supabase.storage.from(bucket).remove([path]);
    } catch (err) {
      console.warn(`Failed to clean up storage asset in ${bucket}:`, err);
    }
  },
};
