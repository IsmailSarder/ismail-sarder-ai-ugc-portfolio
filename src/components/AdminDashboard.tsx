import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, RotateCcw, Database, AlertCircle, Check, ExternalLink } from 'lucide-react';
import { PortfolioItem, ProductCategory } from '../types.ts';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  projects: PortfolioItem[];
  onAddProject: (project: PortfolioItem) => void;
  onUpdateProject: (project: PortfolioItem) => void;
  onDeleteProject: (projectId: string) => void;
  onResetProjects: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onResetProjects,
}) => {
  const [editingProject, setEditingProject] = useState<PortfolioItem | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [showConfigGuide, setShowConfigGuide] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Check if Supabase credentials exist in environment
  const isSupabaseConfigured = Boolean(
    (import.meta as any).env?.VITE_SUPABASE_URL &&
    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY
  );

  const emptyForm: PortfolioItem = {
    id: `custom-${Date.now()}`,
    title: '',
    brandName: '',
    category: 'Beauty & Skincare',
    duration: '0:30',
    format: '9:16 Vertical Video',
    thumbnail: '/src/assets/images/hero_ugc_beauty_showcase_1793804788830.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    hook: '',
    angle: 'Problem-to-Solution',
    creativeObjective: '',
    overview: '',
    scriptBreakdown: {
      hook: '',
      agitation: '',
      demonstration: '',
      cta: '',
    },
    keyFeatures: ['Dynamic Kinetic Captions', 'Native 9:16 Format', '3 Hook Variations'],
    targetMarket: 'USA & UK',
    isCustomAdded: true,
  };

  const [formData, setFormData] = useState<PortfolioItem>(emptyForm);

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setFormData({
      ...emptyForm,
      id: `project-${Date.now()}`,
    });
    setEditingProject(null);
    setIsCreating(true);
  };

  const handleStartEdit = (item: PortfolioItem) => {
    setFormData({ ...item });
    setEditingProject(item);
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingProject) {
      onUpdateProject(formData);
    } else {
      onAddProject(formData);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsCreating(false);
      setEditingProject(null);
    }, 800);
  };

  const categories: Array<Exclude<ProductCategory, 'All Projects'>> = [
    'Beauty & Skincare',
    'Fashion & Lifestyle',
    'Gadgets & Technology',
    'Product Demonstrations',
    'AI UGC Creator Videos',
    'SaaS & Digital Products',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-title"
    >
      <div className="relative w-full max-w-4xl bg-[#111514] border border-[#2A332B] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A332B] bg-[#090A0B]/80 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded bg-[#171C19] border border-[#2A332B] text-[#C7F36B]">
              <Database className="w-4 h-4" />
            </span>
            <div>
              <h2 id="admin-title" className="text-sm font-bold font-heading text-[#F5F5F0]">
                Portfolio Studio Management
              </h2>
              <span className="text-[10px] font-mono text-[#A0A89F]">
                {isSupabaseConfigured ? 'Supabase Remote Cloud Sync' : 'Local Storage Demo Mode'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCreating && (
              <button
                onClick={handleStartCreate}
                className="px-3 py-1.5 text-xs font-bold font-heading uppercase text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Project
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19] rounded transition-colors cursor-pointer"
              aria-label="Close admin dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Supabase Status Banner */}
        <div className="px-6 py-2.5 bg-[#171C19] border-b border-[#2A332B] flex flex-wrap items-center justify-between text-xs text-[#A0A89F] gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-[#C7F36B]" />
            <span>
              {isSupabaseConfigured
                ? 'Connected to configured Supabase database.'
                : 'Running in Local Storage Mode (safe client-side sandbox).'}
            </span>
          </div>

          <button
            onClick={() => setShowConfigGuide(!showConfigGuide)}
            className="text-[11px] font-mono text-[#C7F36B] hover:underline cursor-pointer"
          >
            {showConfigGuide ? 'Hide Supabase Setup Guide' : 'How to connect Supabase'}
          </button>
        </div>

        {/* Collapsible Supabase Instructions */}
        {showConfigGuide && (
          <div className="p-5 bg-[#090A0B] border-b border-[#2A332B] text-xs text-[#A0A89F] space-y-2 shrink-0 animate-fade-in">
            <p className="font-semibold text-[#F5F5F0]">How to configure Supabase for cloud portfolio persistence:</p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
              <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#C7F36B] hover:underline">supabase.com</a>.</li>
              <li>Create a table named <code className="text-[#C7F36B]">portfolio_projects</code> with matching fields (id, title, brand_name, category, video_url, etc.).</li>
              <li>Add your project credentials in <code className="text-[#C7F36B]">.env</code>:
                <pre className="mt-1 p-2 bg-[#171C19] rounded font-mono text-[#F5F5F0]">
                  VITE_SUPABASE_URL=https://your-project.supabase.co&#10;VITE_SUPABASE_ANON_KEY=your-anon-key
                </pre>
              </li>
              <li>Restart the dev server to activate full cloud authentication and PostgreSQL sync.</li>
            </ol>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isCreating ? (
            <form onSubmit={handleSave} className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between border-b border-[#2A332B] pb-3">
                <h3 className="text-base font-bold font-heading text-[#F5F5F0]">
                  {editingProject ? 'Edit Project' : 'Add New Portfolio Project'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-[#A0A89F] hover:text-[#F5F5F0]"
                >
                  Cancel
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-[#C7F36B]/20 border border-[#C7F36B] rounded text-xs text-[#C7F36B] flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Project saved successfully!</span>
                </div>
              )}

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
                    placeholder="e.g. Aurelia Glow Hook"
                    className="w-full px-3 py-2 bg-[#171C19] border border-[#2A332B] rounded text-xs text-[#F5F5F0] focus:border-[#C7F36B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder="e.g. Aurelia Botanica"
                    className="w-full px-3 py-2 bg-[#171C19] border border-[#2A332B] rounded text-xs text-[#F5F5F0] focus:border-[#C7F36B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#171C19] border border-[#2A332B] rounded text-xs text-[#F5F5F0] focus:border-[#C7F36B] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                    Video Format
                  </label>
                  <input
                    type="text"
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    placeholder="9:16 Vertical Video"
                    className="w-full px-3 py-2 bg-[#171C19] border border-[#2A332B] rounded text-xs text-[#F5F5F0] focus:border-[#C7F36B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="0:28"
                    className="w-full px-3 py-2 bg-[#171C19] border border-[#2A332B] rounded text-xs text-[#F5F5F0] focus:border-[#C7F36B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                    Thumbnail Image URL or Path
                  </label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171C19] border border-[#2A332B] rounded text-xs text-[#F5F5F0] focus:border-[#C7F36B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                    Video Stream URL (.mp4)
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://.../video.mp4"
                    className="w-full px-3 py-2 bg-[#171C19] border border-[#2A332B] rounded text-xs text-[#F5F5F0] focus:border-[#C7F36B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                  Hook Line (Opening 3 Seconds)
                </label>
                <input
                  type="text"
                  value={formData.hook}
                  onChange={(e) => setFormData({ ...formData, hook: e.target.value })}
                  placeholder="Wait, this glow without a 10-step routine?"
                  className="w-full px-3 py-2 bg-[#171C19] border border-[#2A332B] rounded text-xs text-[#F5F5F0] focus:border-[#C7F36B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F5F0] mb-1">
                  Creative Objective
                </label>
                <textarea
                  rows={2}
                  value={formData.creativeObjective}
                  onChange={(e) => setFormData({ ...formData, creativeObjective: e.target.value })}
                  placeholder="Halting feed scrolling and converting skeptical buyers..."
                  className="w-full px-3 py-2 bg-[#171C19] border border-[#2A332B] rounded text-xs text-[#F5F5F0] focus:border-[#C7F36B] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#2A332B] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-medium text-[#A0A89F] hover:text-[#F5F5F0] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold font-heading uppercase text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded transition-colors"
                >
                  Save Project
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#A0A89F] pb-2 border-b border-[#2A332B]">
                <span>Manage {projects.length} Active Portfolio Projects</span>
                <button
                  onClick={onResetProjects}
                  className="flex items-center gap-1.5 text-xs text-[#A0A89F] hover:text-[#C7F36B] transition-colors"
                  title="Reset back to curated studio portfolio"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Studio Defaults</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-[#171C19] border border-[#2A332B] rounded-lg flex items-center justify-between gap-4 hover:border-[#C7F36B]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.thumbnail}
                        alt=""
                        className="w-12 h-12 object-cover rounded bg-black shrink-0 border border-[#2A332B]"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-[#C7F36B] block uppercase truncate">
                          {p.category} · {p.brandName}
                        </span>
                        <h4 className="text-xs font-bold text-[#F5F5F0] truncate">
                          {p.title}
                        </h4>
                        <span className="text-[10px] text-[#A0A89F] truncate block">
                          Format: {p.format} · {p.duration}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="p-1.5 text-[#A0A89F] hover:text-[#C7F36B] rounded hover:bg-[#111514] transition-colors"
                        title="Edit project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProject(p.id)}
                        className="p-1.5 text-[#A0A89F] hover:text-red-400 rounded hover:bg-[#111514] transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
