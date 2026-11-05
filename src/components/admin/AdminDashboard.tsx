import React, { useState, useEffect } from 'react';
import {
  X, Plus, Edit2, Trash2, Upload, Video, Eye,
  RefreshCw, LogOut, Check, Sparkles, Database, ExternalLink
} from 'lucide-react';
import { PortfolioItem } from '../VideoModal.tsx';
import {
  fetchAllProjects,
  createPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
  uploadPortfolioMedia,
} from '../../services/portfolioService.ts';
import { isSupabaseConfigured, clearSupabaseCredentials } from '../../lib/supabase.ts';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onProjectsChanged: () => void;
}

interface AdminFormData extends Omit<PortfolioItem, 'id'> {
  video_url: string;
  scriptBreakdown: {
    hook: string;
    agitation: string;
    demonstration: string;
    cta: string;
  };
  keyFeatures: string[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onLogout,
  onProjectsChanged,
}) => {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Form State
  const [formData, setFormData] = useState<AdminFormData>({
    title: '',
    category: 'Beauty & Skincare',
    duration: '0:30',
    format: '9:16 Vertical Video',
    thumbnail: '',
    video_url: '',
    hook: '',
    angle: 'Problem-to-Solution',
    overview: '',
    isConcept: true,
    targetMarket: 'USA & United Kingdom',
    scriptBreakdown: {
      hook: '',
      agitation: '',
      demonstration: '',
      cta: '',
    },
    keyFeatures: ['3 Hook Openings', 'Burned-in Dynamic Captions', '4K 60FPS Master'],
  });

  const [featuresInput, setFeaturesInput] = useState(
    '3 Hook Openings, Burned-in Dynamic Captions, 4K 60FPS Master'
  );

  const categories: PortfolioItem['category'][] = [
    'Beauty & Skincare',
    'Fashion & Lifestyle',
    'Gadgets & Technology',
    'Product Demonstrations',
    'AI UGC Creator Videos',
  ];

  const loadProjects = async () => {
    setIsLoading(true);
    const data = await fetchAllProjects();
    setProjects(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Beauty & Skincare',
      duration: '0:30',
      format: '9:16 Vertical Video',
      thumbnail: '',
      video_url: '',
      hook: '',
      angle: 'Problem-to-Solution',
      overview: '',
      isConcept: true,
      targetMarket: 'USA & United Kingdom',
      scriptBreakdown: {
        hook: '',
        agitation: '',
        demonstration: '',
        cta: '',
      },
      keyFeatures: ['3 Hook Openings', 'Burned-in Dynamic Captions', '4K 60FPS Master'],
    });
    setFeaturesInput('3 Hook Openings, Burned-in Dynamic Captions, 4K 60FPS Master');
    setIsEditing(true);
  };

  const handleOpenEdit = (project: PortfolioItem) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      category: project.category,
      duration: project.duration,
      format: project.format,
      thumbnail: project.thumbnail,
      video_url: project.video_url || project.videoUrl || '',
      hook: project.hook,
      angle: project.angle,
      overview: project.overview,
      isConcept: project.isConcept,
      targetMarket: project.targetMarket || 'USA & United Kingdom',
      scriptBreakdown: {
        hook: project.scriptBreakdown?.hook || '',
        agitation: project.scriptBreakdown?.agitation || '',
        demonstration: project.scriptBreakdown?.demonstration || '',
        cta: project.scriptBreakdown?.cta || '',
      },
      keyFeatures: project.keyFeatures ? [...project.keyFeatures] : ['3 Hook Openings', 'Burned-in Dynamic Captions', '4K 60FPS Master'],
    });
    setFeaturesInput(project.keyFeatures ? project.keyFeatures.join(', ') : '3 Hook Openings, Burned-in Dynamic Captions, 4K 60FPS Master');
    setIsEditing(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deletePortfolioProject(id);
      await loadProjects();
      onProjectsChanged();
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingThumb(true);
    try {
      const publicUrl = await uploadPortfolioMedia(file, 'thumbnails');
      setFormData((prev) => ({ ...prev, thumbnail: publicUrl }));
    } catch (err) {
      console.error(err);
      alert('Failed to process image');
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingVideo(true);
    try {
      const publicUrl = await uploadPortfolioMedia(file, 'videos');
      setFormData((prev) => ({ ...prev, video_url: publicUrl }));
    } catch (err) {
      console.error(err);
      alert('Failed to process video file');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.thumbnail || !formData.hook) {
      alert('Please fill out the Title, Thumbnail, and Hook fields.');
      return;
    }

    const parsedFeatures = featuresInput
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const projectPayload = {
      ...formData,
      keyFeatures: parsedFeatures,
    };

    if (editingId) {
      await updatePortfolioProject(editingId, projectPayload);
    } else {
      await createPortfolioProject(projectPayload);
    }

    setIsEditing(false);
    await loadProjects();
    onProjectsChanged();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-6xl bg-[#111514] border border-[#2A332B] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A332B] bg-[#090A0B]/90 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold font-heading text-[#F5F5F0]">
              Studio Portfolio CMS
            </span>
            <span aria-hidden="true" className="text-[#2A332B]">/</span>
            <span className="text-xs font-mono text-[#A0A89F] flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured() ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              {isSupabaseConfigured() ? 'Supabase Database Connected' : 'Local Persistence Mode'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadProjects}
              className="p-2 text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19] rounded-md transition-colors cursor-pointer"
              title="Refresh projects"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19] rounded-md transition-colors cursor-pointer"
              aria-label="Close dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#171C19] p-4 rounded-xl border border-[#2A332B]">
            <div>
              <h3 className="text-sm font-bold font-heading text-[#F5F5F0]">
                Active Portfolio Projects ({projects.length})
              </h3>
              <p className="text-xs text-[#A0A89F] mt-0.5">
                Add, edit, or remove AI UGC ad concepts and live client creative demonstrations.
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>

          {/* Projects Table / Grid */}
          {isLoading ? (
            <div className="py-16 text-center text-xs text-[#A0A89F]">
              <span className="w-6 h-6 border-2 border-[#C7F36B] border-t-transparent rounded-full animate-spin inline-block mb-3" />
              <p>Loading portfolio database...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[#171C19] border border-[#2A332B] rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#C7F36B]/50 transition-colors"
                >
                  <div className="relative aspect-video bg-[#090A0B] overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-0.5 rounded text-[#C7F36B] border border-white/10">
                      {project.duration} · {project.format}
                    </div>
                    {project.isConcept && (
                      <div className="absolute top-2 right-2 text-[9px] font-mono bg-[#111514] px-1.5 py-0.5 rounded text-[#A0A89F] border border-[#2A332B]">
                        SPEC CONCEPT
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#A0A89F] block mb-1">
                        {project.category}
                      </span>
                      <h4 className="text-sm font-bold font-heading text-[#F5F5F0] line-clamp-1">
                        {project.title}
                      </h4>
                      <p className="text-xs text-[#A0A89F] mt-1.5 line-clamp-2 leading-relaxed">
                        &ldquo;{project.hook}&rdquo;
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#2A332B] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#A0A89F]">
                        {project.angle}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 text-[#A0A89F] hover:text-[#C7F36B] hover:bg-[#111514] rounded transition-colors cursor-pointer"
                          title="Edit project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="p-1.5 text-[#A0A89F] hover:text-rose-400 hover:bg-[#111514] rounded transition-colors cursor-pointer"
                          title="Delete project"
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

        {/* Modal: Add / Edit Form */}
        {isEditing && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#111514] border border-[#2A332B] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#2A332B] mb-5">
                <h3 className="text-base font-bold font-heading text-[#F5F5F0]">
                  {editingId ? 'Edit Portfolio Project' : 'Create New Portfolio Project'}
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 text-[#A0A89F] hover:text-[#F5F5F0] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Lumina Serum Viral Hook Ad"
                      className="w-full px-3 py-2 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as PortfolioItem['category'],
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="0:30"
                      className="w-full px-3 py-2 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                      Format
                    </label>
                    <input
                      type="text"
                      value={formData.format}
                      onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                      placeholder="9:16 Vertical Video"
                      className="w-full px-3 py-2 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                      Creative Angle
                    </label>
                    <input
                      type="text"
                      value={formData.angle}
                      onChange={(e) => setFormData({ ...formData, angle: e.target.value })}
                      placeholder="e.g. Contrarian / Problem-Solution"
                      className="w-full px-3 py-2 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                    />
                  </div>
                </div>

                {/* Media Uploads */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#2A332B]">
                  <div>
                    <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                      Thumbnail Image * (URL or Upload)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="https://... or upload below"
                      className="w-full px-3 py-2 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B] mb-2"
                    />
                    <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[#2A332B] bg-[#171C19] hover:border-[#C7F36B] text-xs text-[#A0A89F] hover:text-[#F5F5F0] cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingThumb ? 'Uploading...' : 'Upload Thumbnail File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                      Video File / URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="https://... MP4 / video link"
                      className="w-full px-3 py-2 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B] mb-2"
                    />
                    <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[#2A332B] bg-[#171C19] hover:border-[#C7F36B] text-xs text-[#A0A89F] hover:text-[#F5F5F0] cursor-pointer transition-colors">
                      <Video className="w-3.5 h-3.5" />
                      <span>{isUploadingVideo ? 'Uploading...' : 'Upload MP4 File'}</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Hook & Overview */}
                <div>
                  <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                    First 3-Second Hook Line *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.hook}
                    onChange={(e) => setFormData({ ...formData, hook: e.target.value })}
                    placeholder="e.g. Stop scrolling if you deal with dull dry morning skin..."
                    className="w-full px-3 py-2 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                    Project Overview
                  </label>
                  <textarea
                    rows={2}
                    value={formData.overview}
                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                    placeholder="Context on the audience and creative objective..."
                    className="w-full px-3 py-2 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                  />
                </div>

                {/* Script Architecture */}
                <div className="space-y-2 pt-2 border-t border-[#2A332B]">
                  <span className="text-[11px] font-mono text-[#C7F36B] font-bold uppercase block">
                    Script Breakdown (Optional for strategy modal)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      value={formData.scriptBreakdown.hook}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scriptBreakdown: { ...formData.scriptBreakdown, hook: e.target.value },
                        })
                      }
                      placeholder="01. Hook (0:00 - 0:03)"
                      className="px-3 py-1.5 rounded bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0]"
                    />
                    <input
                      type="text"
                      value={formData.scriptBreakdown.agitation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scriptBreakdown: { ...formData.scriptBreakdown, agitation: e.target.value },
                        })
                      }
                      placeholder="02. Agitation (0:03 - 0:10)"
                      className="px-3 py-1.5 rounded bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0]"
                    />
                    <input
                      type="text"
                      value={formData.scriptBreakdown.demonstration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scriptBreakdown: {
                            ...formData.scriptBreakdown,
                            demonstration: e.target.value,
                          },
                        })
                      }
                      placeholder="03. Demonstration (0:10 - 0:22)"
                      className="px-3 py-1.5 rounded bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0]"
                    />
                    <input
                      type="text"
                      value={formData.scriptBreakdown.cta}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scriptBreakdown: { ...formData.scriptBreakdown, cta: e.target.value },
                        })
                      }
                      placeholder="04. CTA (0:22 - 0:28)"
                      className="px-3 py-1.5 rounded bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0]"
                    />
                  </div>
                </div>

                {/* Features & Concept Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#2A332B]">
                  <div>
                    <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                      Deliverable Bullet Points (comma separated)
                    </label>
                    <input
                      type="text"
                      value={featuresInput}
                      onChange={(e) => setFeaturesInput(e.target.value)}
                      placeholder="3 Hook Openings, Burned-in Dynamic Captions, 4K 60FPS"
                      className="w-full px-3 py-2 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0]"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <label className="flex items-center gap-2 text-xs text-[#F5F5F0] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isConcept}
                        onChange={(e) =>
                          setFormData({ ...formData, isConcept: e.target.checked })
                        }
                        className="rounded border-[#2A332B] bg-[#171C19] text-[#C7F36B] focus:ring-0"
                      />
                      <span>Mark as Spec Concept Demo</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A332B]">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs text-[#A0A89F] hover:text-[#F5F5F0] rounded-md transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all cursor-pointer shadow-sm"
                  >
                    {editingId ? 'Save Changes' : 'Publish Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
