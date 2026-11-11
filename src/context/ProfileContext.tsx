import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { profileService, ProfileSettings } from '../services/profileService.ts';
import { aboutIsmail } from '../assets/images.ts';

interface ProfileContextType {
  profileSettings: ProfileSettings;
  profileImageUrl: string | null;
  profileImagePath: string | null;
  effectiveProfileImage: string;
  isCustomImage: boolean;
  isLoading: boolean;
  uploadProfilePicture: (
    file: Blob | File,
    onProgress?: (progress: number) => void
  ) => Promise<{ success: boolean; url?: string; error?: string }>;
  deleteProfilePicture: () => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    id: 'primary_profile',
    full_name: 'Ismail Sarder',
    title: 'AI UGC Ad Creator & Creative Strategist',
    profile_image_url: null,
    profile_image_path: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await profileService.getProfileSettings();
      setProfileSettings(data);
    } catch (err) {
      console.warn('Error loading profile settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const uploadProfilePicture = async (
    file: Blob | File,
    onProgress?: (progress: number) => void
  ) => {
    try {
      const result = await profileService.uploadProfileImage(file, onProgress);
      if (result.error) {
        return { success: false, error: result.error.message };
      }

      setProfileSettings((prev) => ({
        ...prev,
        profile_image_url: result.publicUrl,
        profile_image_path: result.path,
      }));

      return { success: true, url: result.publicUrl };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      return { success: false, error: msg };
    }
  };

  const deleteProfilePicture = async () => {
    try {
      const result = await profileService.deleteProfileImage(profileSettings.profile_image_path);
      if (result.error) {
        return { success: false, error: result.error.message };
      }

      setProfileSettings((prev) => ({
        ...prev,
        profile_image_url: null,
        profile_image_path: null,
      }));

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      return { success: false, error: msg };
    }
  };

  // Determine effective display image: custom uploaded URL or default portrait
  const effectiveProfileImage = profileSettings.profile_image_url || aboutIsmail;
  const isCustomImage = Boolean(profileSettings.profile_image_url);

  return (
    <ProfileContext.Provider
      value={{
        profileSettings,
        profileImageUrl: profileSettings.profile_image_url,
        profileImagePath: profileSettings.profile_image_path,
        effectiveProfileImage,
        isCustomImage,
        isLoading,
        uploadProfilePicture,
        deleteProfilePicture,
        refreshProfile: loadProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
