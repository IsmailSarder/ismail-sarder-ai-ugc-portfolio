import React, { useState, useEffect, useRef } from 'react';
import {
  supabase,
  SupabaseProject,
  ProjectCategory,
  SUPABASE_SETUP_SQL,
  BUCKET_VIDEOS,
  BUCKET_THUMBNAILS,
} from '../lib/supabase.ts';
import {
  getAllAdminProjects,
  uploadMediaFile,
  saveProject,
  deleteProject,
} from '../lib/projectService.ts';
import {
  X,
  Upload,
  Film,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  LogOut,
  Edit2,
  Trash2,
  Plus,
  Play,
  Lock,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectsUpdated?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onProjectsUpdated,
}) => {
  // Auth state
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState('hossenmeismail@gmail.com');
  const [authPassword, setAuthPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Dashboard view state
  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'sql'>('list');
  const [projects, setProjects] = useState<SupabaseProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Form state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>('');

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<ProjectCategory>('AI UGC Ads');
  const [formBrandName, setFormBrandName] = useState('');
  const [formHook, setFormHook] = useState('');
  const [formDuration, setFormDuration] = useState('0:30');
  const [formFormat, setFormFormat] = useState('9:16 Vertical Video');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsPublished, setFormIsPublished] = useState(true);

  // Upload/submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Preview player in admin modal
  const [previewingVideoUrl, setPreviewingVideoUrl] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // Listen to Supabase Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session) {
        loadProjects();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadProjects();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const loadProjects = async () => {
    setLoadingProjects(true);
    const { data, error } = await getAllAdminProjects();
    if (error) {
      console.warn('Admin fetch error:', error);
    }
    setProjects(data || []);
    setLoadingProjects(false);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);

    if (!authEmail || !authPassword) {
      setAuthError('Please enter both email and password.');
      return;
    }

    try {
      if (isSignUpMode) {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        if (data.session) {
          setSession(data.session);
        } else {
          setAuthSuccessMsg(
            'Admin account created! Check your email to confirm, or if email confirmation is disabled in Supabase, sign in immediately.'
          );
          setIsSignUpMode(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        setSession(data.session);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Video file selection
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setFormError('Please select a valid video file (.mp4, .mov, etc).');
      return;
    }

    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);
    setFormError(null);
  };

  // Thumbnail file selection
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file for the thumbnail.');
      return;
    }

    setThumbnailFile(file);
    const url = URL.createObjectURL(file);
    setThumbnailPreviewUrl(url);
    setFormError(null);
  };

  const resetForm = () => {
    setEditingProjectId(null);
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreviewUrl('');
    setThumbnailPreviewUrl('');
    setFormTitle('');
    setFormDescription('');
    setFormCategory('AI UGC Ads');
    setFormBrandName('');
    setFormHook('');
    setFormDuration('0:30');
    setFormFormat('9:16 Vertical Video');
    setFormIsFeatured(false);
    setFormIsPublished(true);
    setFormError(null);
    setFormSuccess(null);
    setUploadStatusText('');
  };

  const handleStartEdit = (p: SupabaseProject) => {
    setEditingProjectId(p.id);
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreviewUrl(p.video_url || '');
    setThumbnailPreviewUrl(p.thumbnail_url || '');
    setFormTitle(p.title || '');
    setFormDescription(p.description || '');
    setFormCategory(p.category || 'AI UGC Ads');
    setFormBrandName(p.brand_name || '');
    setFormHook(p.hook || '');
    setFormDuration(p.duration || '0:30');
    setFormFormat(p.format || '9:16 Vertical Video');
    setFormIsFeatured(Boolean(p.is_featured));
    setFormIsPublished(Boolean(p.is_published));
    setFormError(null);
    setFormSuccess(null);
    setActiveTab('form');
  };

  const handleDelete = async (p: SupabaseProject) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${p.title}"?`)) {
      return;
    }

    const { success, error } = await deleteProject(p.id, p.video_path, p.thumbnail_path);
    if (!success) {
      alert(`Delete failed: ${error}`);
    } else {
      await loadProjects();
      if (onProjectsUpdated) onProjectsUpdated();
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Validation
    if (!formTitle.trim()) {
      setFormError('Please provide a project title.');
      return;
    }
    if (!formBrandName.trim()) {
      setFormError('Please provide a brand or product name.');
      return;
    }
    if (!editingProjectId && !videoFile) {
      setFormError('Please upload an MP4 video file.');
      return;
    }
    if (!editingProjectId && !thumbnailFile && !thumbnailPreviewUrl) {
      setFormError('Please upload a video thumbnail image.');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalVideoUrl = videoPreviewUrl;
      let finalVideoPath = '';
      let finalThumbUrl = thumbnailPreviewUrl;
      let finalThumbPath = '';

      // 1. Upload Video if new file selected
      if (videoFile) {
        setUploadStatusText(`Uploading video file (${(videoFile.size / (1024 * 1024)).toFixed(1)} MB) to ${BUCKET_VIDEOS}...`);
        const vidResult = await uploadMediaFile(videoFile, BUCKET_VIDEOS);
        finalVideoUrl = vidResult.url;
        finalVideoPath = vidResult.path;
      }

      // 2. Upload Thumbnail if new file selected
      if (thumbnailFile) {
        setUploadStatusText(`Uploading thumbnail image to ${BUCKET_THUMBNAILS}...`);
        const thumbResult = await uploadMediaFile(thumbnailFile, BUCKET_THUMBNAILS);
        finalThumbUrl = thumbResult.url;
        finalThumbPath = thumbResult.path;
      }

      // 3. Save database record
      setUploadStatusText('Saving project details to Supabase database...');
      const projectPayload: Partial<SupabaseProject> = {
        title: formTitle.trim(),
        description: formDescription.trim(),
        category: formCategory,
        brand_name: formBrandName.trim(),
        hook: formHook.trim(),
        duration: formDuration.trim() || '0:30',
        format: formFormat.trim() || '9:16 Vertical Video',
        is_featured: formIsFeatured,
        is_published: formIsPublished,
        video_url: finalVideoUrl,
        thumbnail_url: finalThumbUrl,
      };

      if (finalVideoPath) projectPayload.video_path = finalVideoPath;
      if (finalThumbPath) projectPayload.thumbnail_path = finalThumbPath;

      const { data, error } = await saveProject(projectPayload, editingProjectId || undefined);

      if (error) {
        throw new Error(error);
      }

      setFormSuccess(
        editingProjectId
          ? `Project "${formTitle}" updated successfully!`
          : `Project "${formTitle}" published/saved successfully!`
      );

      await loadProjects();
      if (onProjectsUpdated) onProjectsUpdated();

      setTimeout(() => {
        resetForm();
        setActiveTab('list');
      }, 1200);
    } catch (err: any) {
      console.error('Save error:', err);
      setFormError(
        err.message ||
          'Failed to upload media or save project. Please verify Supabase storage bucket permissions.'
      );
    } finally {
      setIsSubmitting(false);
      setUploadStatusText('');
    }
  };

  const copySqlScript = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-5xl bg-[#111514] border border-[#2A332B] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A332B] bg-[#090A0B]/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#171C19] border border-[#2A332B] text-[#C7F36B]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-heading text-[#F5F5F0]">
                  Portfolio Admin & Video Manager
                </h2>
                <span className="text-[10px] font-mono uppercase bg-[#C7F36B]/20 text-[#C7F36B] px-2 py-0.5 rounded font-bold">
                  Supabase Live
                </span>
              </div>
              <p className="text-[11px] text-[#A0A89F] font-mono">
                Connected to ogzrhiwvgahjnazeuxmg.supabase.co
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {session && (
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 text-xs text-[#A0A89F] hover:text-rose-400 border border-[#2A332B] hover:border-rose-500/40 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Sign out of Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19] rounded-md transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* AUTHENTICATION GATE */}
          {!session ? (
            <div className="max-w-md mx-auto py-8 sm:py-12">
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-[#171C19] border border-[#2A332B] text-[#C7F36B] flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-heading text-[#F5F5F0]">
                  Admin Authentication
                </h3>
                <p className="text-xs text-[#A0A89F] mt-1.5">
                  Sign in with your Supabase credentials to manage video ads, upload MP4s, and update project details.
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4 bg-[#171C19] p-6 rounded-xl border border-[#2A332B]">
                {authError && (
                  <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}
                {authSuccessMsg && (
                  <div className="p-3 rounded-lg bg-[#C7F36B]/15 border border-[#C7F36B]/40 text-xs text-[#C7F36B] flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{authSuccessMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="hossenmeismail@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 px-4 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isSignUpMode ? 'Create Initial Admin' : 'Sign In To Dashboard'}</span>
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUpMode(!isSignUpMode);
                      setAuthError(null);
                      setAuthSuccessMsg(null);
                    }}
                    className="text-[11px] text-[#A0A89F] hover:text-[#C7F36B] underline cursor-pointer"
                  >
                    {isSignUpMode
                      ? 'Already have an admin account? Sign In'
                      : 'First time? Create initial admin user'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* AUTHENTICATED ADMIN DASHBOARD */
            <div className="space-y-6">
              {/* Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A332B] pb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveTab('list');
                      resetForm();
                    }}
                    className={`px-4 py-2 text-xs font-bold font-heading rounded-md transition-colors cursor-pointer flex items-center gap-2 ${
                      activeTab === 'list'
                        ? 'bg-[#C7F36B] text-[#090A0B]'
                        : 'bg-[#171C19] text-[#A0A89F] hover:text-[#F5F5F0] border border-[#2A332B]'
                    }`}
                  >
                    <span>Manage Projects</span>
                    <span className="text-[10px] font-mono bg-black/20 px-1.5 py-0.5 rounded">
                      {projects.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('form');
                    }}
                    className={`px-4 py-2 text-xs font-bold font-heading rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'form' && !editingProjectId
                        ? 'bg-[#C7F36B] text-[#090A0B]'
                        : 'bg-[#171C19] text-[#A0A89F] hover:text-[#F5F5F0] border border-[#2A332B]'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload New Video</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('sql')}
                    className={`px-3 py-2 text-xs font-medium font-mono rounded-md transition-colors cursor-pointer ${
                      activeTab === 'sql'
                        ? 'bg-[#C7F36B] text-[#090A0B]'
                        : 'bg-[#171C19] text-[#A0A89F] hover:text-[#F5F5F0] border border-[#2A332B]'
                    }`}
                  >
                    SQL Setup Script
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#A0A89F]">
                  <span className="truncate max-w-[180px] text-[#F5F5F0]">{session.user.email}</span>
                  <button
                    onClick={loadProjects}
                    className="p-1.5 text-[#A0A89F] hover:text-[#C7F36B] border border-[#2A332B] rounded hover:bg-[#171C19] cursor-pointer"
                    title="Refresh projects list"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingProjects ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* TAB 1: PROJECTS LIST */}
              {activeTab === 'list' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#A0A89F]">
                    <span>
                      Total Projects in Supabase: <strong className="text-[#F5F5F0]">{projects.length}</strong>
                    </span>
                    <button
                      onClick={() => {
                        resetForm();
                        setActiveTab('form');
                      }}
                      className="text-[#C7F36B] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Project
                    </button>
                  </div>

                  {projects.length === 0 ? (
                    <div className="p-10 text-center bg-[#171C19] border border-[#2A332B] rounded-xl space-y-4">
                      <Film className="w-12 h-12 text-[#A0A89F] mx-auto opacity-60" />
                      <div>
                        <h4 className="text-base font-bold font-heading text-[#F5F5F0]">
                          No Supabase Projects Found
                        </h4>
                        <p className="text-xs text-[#A0A89F] max-w-md mx-auto mt-1 leading-relaxed">
                          You haven&apos;t uploaded any video projects to your Supabase database yet. Click below to upload your first MP4 video ad!
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          resetForm();
                          setActiveTab('form');
                        }}
                        className="px-5 py-2.5 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Upload First Video Project
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projects.map((p) => (
                        <div
                          key={p.id}
                          className="bg-[#171C19] border border-[#2A332B] rounded-xl overflow-hidden flex flex-col justify-between group"
                        >
                          <div className="relative aspect-video bg-[#090A0B] overflow-hidden">
                            {p.thumbnail_url ? (
                              <img
                                src={p.thumbnail_url}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#A0A89F]">
                                <Film className="w-8 h-8 opacity-40" />
                              </div>
                            )}

                            {/* Status Badges */}
                            <div className="absolute top-2 left-2 flex items-center gap-1.5">
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                                  p.is_published
                                    ? 'bg-[#C7F36B] text-[#090A0B]'
                                    : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                }`}
                              >
                                {p.is_published ? 'Published' : 'Draft'}
                              </span>
                              {p.is_featured && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-400/40">
                                  Featured
                                </span>
                              )}
                            </div>

                            {/* Direct Play Action */}
                            {p.video_url && (
                              <button
                                onClick={() => setPreviewingVideoUrl(p.video_url)}
                                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                aria-label="Play video preview"
                              >
                                <div className="w-10 h-10 rounded-full bg-[#C7F36B] text-[#090A0B] flex items-center justify-center shadow-lg">
                                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                                </div>
                              </button>
                            )}
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between text-[11px] text-[#A0A89F] mb-1 font-mono">
                                <span>{p.category}</span>
                                <span>{p.duration || '0:30'}</span>
                              </div>
                              <h4 className="text-sm font-bold font-heading text-[#F5F5F0] line-clamp-1">
                                {p.title}
                              </h4>
                              <p className="text-[11px] text-[#A0A89F] mt-1 line-clamp-2">
                                {p.description || p.hook || 'No description entered.'}
                              </p>
                              {p.brand_name && (
                                <span className="text-[10px] text-[#C7F36B] font-mono block mt-1.5">
                                  Brand: {p.brand_name}
                                </span>
                              )}
                            </div>

                            <div className="pt-3 mt-3 border-t border-[#2A332B] flex items-center justify-between">
                              <span className="text-[10px] text-[#A0A89F] font-mono">
                                {p.format || '9:16 Vertical'}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleStartEdit(p)}
                                  className="p-1.5 text-[#A0A89F] hover:text-[#C7F36B] border border-[#2A332B] rounded hover:bg-[#111514] transition-colors cursor-pointer"
                                  title="Edit Project"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(p)}
                                  className="p-1.5 text-[#A0A89F] hover:text-rose-400 border border-[#2A332B] rounded hover:bg-[#111514] transition-colors cursor-pointer"
                                  title="Delete Project"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: UPLOAD & EDIT FORM */}
              {activeTab === 'form' && (
                <form onSubmit={handleSaveProject} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#2A332B] pb-3">
                    <div>
                      <h3 className="text-base font-bold font-heading text-[#F5F5F0]">
                        {editingProjectId ? 'Edit Project' : 'Upload Video Project'}
                      </h3>
                      <p className="text-xs text-[#A0A89F]">
                        Upload your MP4 video file and thumbnail directly into Supabase Storage buckets.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setActiveTab('list');
                      }}
                      className="text-xs text-[#A0A89F] hover:text-[#F5F5F0] underline cursor-pointer"
                    >
                      Cancel & Return
                    </button>
                  </div>

                  {formError && (
                    <div className="p-3.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {formSuccess && (
                    <div className="p-3.5 rounded-lg bg-[#C7F36B]/15 border border-[#C7F36B]/40 text-xs text-[#C7F36B] flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{formSuccess}</span>
                    </div>
                  )}

                  {/* FILE UPLOAD GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 1. MP4 Video Upload */}
                    <div className="bg-[#171C19] border border-[#2A332B] rounded-xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-[#F5F5F0] flex items-center gap-1.5">
                          <Film className="w-4 h-4 text-[#C7F36B]" />
                          <span>MP4 Video File</span>
                          <span className="text-[#C7F36B]">*</span>
                        </label>
                        <span className="text-[10px] font-mono text-[#A0A89F]">Bucket: portfolio-videos</span>
                      </div>

                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/mp4,video/quicktime,video/webm"
                        onChange={handleVideoSelect}
                        className="hidden"
                      />

                      {videoPreviewUrl ? (
                        <div className="space-y-3">
                          <div className="relative aspect-[9/16] max-w-[200px] mx-auto rounded-lg overflow-hidden bg-black border border-[#2A332B]">
                            <video
                              src={videoPreviewUrl}
                              controls
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => videoInputRef.current?.click()}
                              className="px-3 py-1.5 text-xs text-[#F5F5F0] bg-[#111514] border border-[#2A332B] hover:border-[#C7F36B] rounded transition-colors cursor-pointer"
                            >
                              Replace Video File
                            </button>
                            {videoFile && (
                              <span className="text-[10px] font-mono text-[#C7F36B]">
                                {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => videoInputRef.current?.click()}
                          className="border-2 border-dashed border-[#2A332B] hover:border-[#C7F36B]/60 rounded-xl p-8 text-center cursor-pointer transition-colors bg-[#111514]/50"
                        >
                          <Upload className="w-8 h-8 text-[#A0A89F] mx-auto mb-2" />
                          <p className="text-xs font-semibold text-[#F5F5F0]">
                            Click to upload MP4 video
                          </p>
                          <p className="text-[10px] text-[#A0A89F] mt-1 font-mono">
                            Supports MP4, MOV, WebM (9:16 or 4:5 recommended)
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 2. Video Thumbnail Upload */}
                    <div className="bg-[#171C19] border border-[#2A332B] rounded-xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-[#F5F5F0] flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#C7F36B]" />
                          <span>Video Thumbnail</span>
                          <span className="text-[#C7F36B]">*</span>
                        </label>
                        <span className="text-[10px] font-mono text-[#A0A89F]">Bucket: portfolio-thumbnails</span>
                      </div>

                      <input
                        ref={thumbInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailSelect}
                        className="hidden"
                      />

                      {thumbnailPreviewUrl ? (
                        <div className="space-y-3">
                          <div className="relative aspect-[4/3] max-w-[240px] mx-auto rounded-lg overflow-hidden bg-black border border-[#2A332B]">
                            <img
                              src={thumbnailPreviewUrl}
                              alt="Thumbnail preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-center">
                            <button
                              type="button"
                              onClick={() => thumbInputRef.current?.click()}
                              className="px-3 py-1.5 text-xs text-[#F5F5F0] bg-[#111514] border border-[#2A332B] hover:border-[#C7F36B] rounded transition-colors cursor-pointer"
                            >
                              Replace Thumbnail
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => thumbInputRef.current?.click()}
                          className="border-2 border-dashed border-[#2A332B] hover:border-[#C7F36B]/60 rounded-xl p-8 text-center cursor-pointer transition-colors bg-[#111514]/50"
                        >
                          <ImageIcon className="w-8 h-8 text-[#A0A89F] mx-auto mb-2" />
                          <p className="text-xs font-semibold text-[#F5F5F0]">
                            Click to upload poster image
                          </p>
                          <p className="text-[10px] text-[#A0A89F] mt-1 font-mono">
                            JPG, PNG, WebP thumbnail
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PROJECT METADATA FIELDS */}
                  <div className="bg-[#171C19] border border-[#2A332B] rounded-xl p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                          Video Title <span className="text-[#C7F36B]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="e.g. Aurelia Botanica — Dewy Skin Viral Hook"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                          Brand or Product Name <span className="text-[#C7F36B]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formBrandName}
                          onChange={(e) => setFormBrandName(e.target.value)}
                          placeholder="e.g. Aurelia Skincare / Elara Audio"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                          Category <span className="text-[#C7F36B]">*</span>
                        </label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value as ProjectCategory)}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                        >
                          <option value="Beauty & Skincare">Beauty & Skincare</option>
                          <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                          <option value="Gadgets & Technology">Gadgets & Technology</option>
                          <option value="Product Demonstration">Product Demonstration</option>
                          <option value="AI UGC Ads">AI UGC Ads</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={formDuration}
                          onChange={(e) => setFormDuration(e.target.value)}
                          placeholder="e.g. 0:28 or 0:34"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                          Format
                        </label>
                        <input
                          type="text"
                          value={formFormat}
                          onChange={(e) => setFormFormat(e.target.value)}
                          placeholder="e.g. 9:16 Vertical Video"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                        Opening Hook (First 3 Seconds)
                      </label>
                      <input
                        type="text"
                        value={formHook}
                        onChange={(e) => setFormHook(e.target.value)}
                        placeholder='e.g. "Wait, this glow without a 10-step routine? Honestly obsessed..."'
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#F5F5F0] mb-1.5">
                        Video Description & Strategic Notes
                      </label>
                      <textarea
                        rows={3}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Explain the product positioning, target market, and advertising angle..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-xs sm:text-sm text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B] resize-none"
                      />
                    </div>

                    {/* FLAGS */}
                    <div className="pt-2 flex flex-wrap items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-[#F5F5F0]">
                        <input
                          type="checkbox"
                          checked={formIsFeatured}
                          onChange={(e) => setFormIsFeatured(e.target.checked)}
                          className="rounded border-[#2A332B] text-[#C7F36B] focus:ring-[#C7F36B]"
                        />
                        <span>Mark as Featured Project</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs text-[#F5F5F0]">
                        <input
                          type="checkbox"
                          checked={formIsPublished}
                          onChange={(e) => setFormIsPublished(e.target.checked)}
                          className="rounded border-[#2A332B] text-[#C7F36B] focus:ring-[#C7F36B]"
                        />
                        <span>Publish Immediately (uncheck to save as private Draft)</span>
                      </label>
                    </div>
                  </div>

                  {/* SUBMISSION BUTTON */}
                  <div>
                    {isSubmitting && (
                      <div className="mb-3 p-3 rounded-lg bg-[#C7F36B]/10 border border-[#C7F36B]/30 text-xs text-[#C7F36B] flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#C7F36B] border-t-transparent rounded-full animate-spin shrink-0" />
                        <span>{uploadStatusText || 'Uploading to Supabase...'}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{editingProjectId ? 'Save Changes' : formIsPublished ? 'Upload & Publish' : 'Save as Draft'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          resetForm();
                          setActiveTab('list');
                        }}
                        className="px-4 py-3 text-xs font-semibold text-[#A0A89F] hover:text-[#F5F5F0] rounded-lg border border-[#2A332B] hover:bg-[#111514] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 3: SQL SETUP HELPER */}
              {activeTab === 'sql' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold font-heading text-[#F5F5F0]">
                        Supabase Database & Storage Setup
                      </h3>
                      <p className="text-xs text-[#A0A89F]">
                        If your Supabase project does not have the <code className="text-[#C7F36B]">portfolio_projects</code> table or storage buckets yet, run this script once in your Supabase SQL Editor.
                      </p>
                    </div>

                    <button
                      onClick={copySqlScript}
                      className="px-3.5 py-2 text-xs font-bold font-heading uppercase text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                    </button>
                  </div>

                  <div className="relative">
                    <pre className="p-4 rounded-xl bg-[#090A0B] border border-[#2A332B] text-[11px] font-mono text-[#A0A89F] overflow-x-auto max-h-[350px] leading-relaxed">
                      {SUPABASE_SETUP_SQL}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Preview Modal inside Admin */}
      {previewingVideoUrl && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewingVideoUrl(null)}
        >
          <div
            className="relative max-w-sm w-full bg-[#111514] border border-[#2A332B] rounded-2xl overflow-hidden p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-1">
              <button
                onClick={() => setPreviewingVideoUrl(null)}
                className="p-1 text-[#A0A89F] hover:text-[#F5F5F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <video
              src={previewingVideoUrl}
              controls
              autoPlay
              className="w-full aspect-[9/16] rounded-xl object-cover bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
};
