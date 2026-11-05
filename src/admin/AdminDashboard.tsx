import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { PortfolioProject, Inquiry } from '../lib/supabase.ts';
import { portfolioService } from '../lib/portfolioService.ts';
import { ProjectFormModal } from './ProjectFormModal.tsx';
import { SUPABASE_SETUP_SQL } from '../lib/schemaSql.ts';
import { Logo } from '../components/Logo.tsx';
import {
  LayoutDashboard,
  Film,
  PlusCircle,
  FolderKanban,
  MessageSquare,
  Database,
  Settings,
  LogOut,
  ExternalLink,
  Search,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Star,
  Copy,
  AlertCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Play,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToHome: () => void;
}

type TabType =
  | 'overview'
  | 'projects'
  | 'add-project'
  | 'categories'
  | 'inquiries'
  | 'sql-setup'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToHome }) => {
  const { user, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');

  // Modals & Active Edit State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [previewingVideoUrl, setPreviewingVideoUrl] = useState<string | null>(null);

  // Copy SQL State
  const [copiedSql, setCopiedSql] = useState(false);

  // Inquiries Search
  const [inquirySearch, setInquirySearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    setErrorNotice(null);

    try {
      const [projectsRes, inquiriesRes] = await Promise.all([
        portfolioService.getAllProjectsAdmin(),
        portfolioService.getInquiries(),
      ]);

      if (projectsRes.error) {
        setErrorNotice(
          `Notice: Supabase table 'portfolio_projects' may not be created yet. Please run the SQL setup script under 'Database Setup'. Error: ${projectsRes.error.message}`
        );
      } else {
        setProjects(projectsRes.data);
      }

      if (!inquiriesRes.error) {
        setInquiries(inquiriesRes.data);
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'Error connecting to Supabase database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Project Actions
  const handleTogglePublish = async (project: PortfolioProject) => {
    const updatedStatus = !project.is_published;
    await portfolioService.togglePublish(project.id, updatedStatus);
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, is_published: updatedStatus } : p))
    );
  };

  const handleToggleFeatured = async (project: PortfolioProject) => {
    const updatedFeatured = !project.is_featured;
    await portfolioService.toggleFeatured(project.id, updatedFeatured);
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, is_featured: updatedFeatured } : p))
    );
  };

  const handleMoveOrder = async (project: PortfolioProject, direction: 'up' | 'down') => {
    const currentOrder = project.display_order ?? 0;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    await portfolioService.updateDisplayOrder(project.id, newOrder);
    loadData();
  };

  const handleDeleteProject = async (project: PortfolioProject) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${project.title}"? This will also remove the video and thumbnail from Supabase Storage.`)) {
      return;
    }

    setDeletingProjectId(project.id);
    const { error } = await portfolioService.deleteProject(
      project.id,
      project.video_path,
      project.thumbnail_path
    );
    setDeletingProjectId(null);

    if (error) {
      alert(`Failed to delete: ${error.message}`);
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    }
  };

  // Inquiry Actions
  const handleToggleInquiryRead = async (inquiry: Inquiry) => {
    const newStatus = !inquiry.is_read;
    await portfolioService.toggleInquiryRead(inquiry.id, newStatus);
    setInquiries((prev) =>
      prev.map((i) => (i.id === inquiry.id ? { ...i, is_read: newStatus } : i))
    );
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this client inquiry permanently?')) return;
    await portfolioService.deleteInquiry(id);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Calculations for Overview Stats
  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.is_published).length;
  const draftProjects = projects.filter((p) => !p.is_published).length;
  const featuredProjects = projects.filter((p) => p.is_featured).length;
  const unreadInquiries = inquiries.filter((i) => !i.is_read).length;

  // Filtered Projects for List
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand_name && p.brand_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'All' ||
      p.category === categoryFilter ||
      (categoryFilter === 'Product Demonstration' && p.category === 'Product Demonstrations') ||
      (categoryFilter === 'Product Demonstrations' && p.category === 'Product Demonstration') ||
      (categoryFilter === 'AI UGC Ads' && p.category === 'AI UGC Creator Videos') ||
      (categoryFilter === 'AI UGC Creator Videos' && p.category === 'AI UGC Ads');

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Published' && p.is_published) ||
      (statusFilter === 'Draft' && !p.is_published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    'Beauty & Skincare',
    'Fashion & Lifestyle',
    'Gadgets & Technology',
    'Product Demonstration',
    'AI UGC Ads',
  ];

  return (
    <div className="min-h-screen bg-[#090A0B] text-[#F5F5F0] flex flex-col lg:flex-row selection:bg-[#C7F36B] selection:text-[#090A0B]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-[#111514] border-r border-[#2A332B] flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Logo Header */}
          <div className="p-5 border-b border-[#2A332B] flex items-center justify-between">
            <Logo size="sm" showSubtitle={false} />
            <span className="text-[10px] font-mono text-[#C7F36B] bg-[#171C19] border border-[#2A332B] px-2 py-0.5 rounded">
              CMS ADMIN
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#C7F36B] text-[#090A0B]'
                  : 'text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[#C7F36B] text-[#090A0B]'
                  : 'text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Film className="w-4 h-4" />
                <span>All Projects</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                activeTab === 'projects' ? 'bg-[#090A0B]/20 text-[#090A0B]' : 'bg-[#171C19] text-[#A0A89F]'
              }`}>
                {totalProjects}
              </span>
            </button>

            <button
              onClick={() => {
                setEditingProject(null);
                setIsFormModalOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-[#C7F36B] hover:bg-[#C7F36B]/10 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Project</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#C7F36B] text-[#090A0B]'
                  : 'text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderKanban className="w-4 h-4" />
                <span>Categories</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[#C7F36B] text-[#090A0B]'
                  : 'text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Client Inquiries</span>
              </div>
              {unreadInquiries > 0 && (
                <span className="text-[10px] font-bold bg-[#C7F36B] text-[#090A0B] px-1.5 py-0.2 rounded-full">
                  {unreadInquiries}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('sql-setup')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'sql-setup'
                  ? 'bg-[#C7F36B] text-[#090A0B]'
                  : 'text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4" />
                <span>Database Setup</span>
              </div>
              <span className="text-[9px] font-mono text-[#C7F36B] bg-[#C7F36B]/10 px-1 rounded">
                SQL
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#C7F36B] text-[#090A0B]'
                  : 'text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
            </button>
          </nav>
        </div>

        {/* User Profile & Actions Footer */}
        <div className="p-4 border-t border-[#2A332B] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] font-mono text-[#A0A89F] block">SIGNED IN AS</span>
              <span className="text-xs font-semibold text-[#F5F5F0] truncate block">
                {user?.email || 'Admin'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onBackToHome}
              className="px-2 py-2 text-[11px] font-medium text-[#A0A89F] hover:text-[#F5F5F0] bg-[#171C19] border border-[#2A332B] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>

            <button
              onClick={() => signOut()}
              className="px-2 py-2 text-[11px] font-medium text-rose-400 hover:text-rose-300 bg-[#171C19] border border-[#2A332B] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <header className="px-6 py-4 bg-[#111514] border-b border-[#2A332B] flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base sm:text-lg font-bold font-heading text-[#F5F5F0] capitalize">
              {activeTab === 'overview' && 'Studio Portfolio Overview'}
              {activeTab === 'projects' && 'Portfolio Video Management'}
              {activeTab === 'categories' && 'Creative Categories & Taxonomy'}
              {activeTab === 'inquiries' && 'Client Leads & Inquiries'}
              {activeTab === 'sql-setup' && 'Supabase Schema & Storage Configuration'}
              {activeTab === 'settings' && 'System Configuration & Security'}
            </h1>
            <p className="text-xs text-[#A0A89F]">
              Supabase Project: <code className="text-[#C7F36B] font-mono">ogzrhiwvgahjnazeuxmg</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2 text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19] rounded-lg border border-[#2A332B] transition-colors cursor-pointer"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                setEditingProject(null);
                setIsFormModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>
        </header>

        {/* Database notice if needed */}
        {errorNotice && (
          <div className="m-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start justify-between gap-3 animate-fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">Supabase Migration Notice:</span>
                <p>{errorNotice}</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('sql-setup')}
              className="px-3 py-1.5 text-xs font-semibold text-[#090A0B] bg-amber-400 hover:bg-amber-300 rounded whitespace-nowrap cursor-pointer shrink-0"
            >
              Run SQL Script
            </button>
          </div>
        )}

        {/* Content Tabs */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-[#111514] border border-[#2A332B] space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#A0A89F]">
                    Total Projects
                  </span>
                  <div className="text-3xl font-extrabold font-heading text-[#F5F5F0] tabular-nums">
                    {totalProjects}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#111514] border border-[#2A332B] space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#A0A89F]">
                    Live / Published
                  </span>
                  <div className="text-3xl font-extrabold font-heading text-[#C7F36B] tabular-nums">
                    {publishedProjects}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#111514] border border-[#2A332B] space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#A0A89F]">
                    Draft Projects
                  </span>
                  <div className="text-3xl font-extrabold font-heading text-amber-400 tabular-nums">
                    {draftProjects}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#111514] border border-[#2A332B] space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#A0A89F]">
                    Client Inquiries
                  </span>
                  <div className="text-3xl font-extrabold font-heading text-[#F5F5F0] tabular-nums flex items-baseline gap-2">
                    <span>{inquiries.length}</span>
                    {unreadInquiries > 0 && (
                      <span className="text-xs text-[#C7F36B] font-mono font-normal">
                        ({unreadInquiries} unread)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Projects */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Projects Strip */}
                <div className="lg:col-span-8 bg-[#111514] border border-[#2A332B] rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold font-heading text-[#F5F5F0]">
                      Recent Portfolio Projects
                    </h3>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="text-xs text-[#C7F36B] hover:underline"
                    >
                      View All ({totalProjects})
                    </button>
                  </div>

                  {projects.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#A0A89F]">
                      No projects uploaded yet. Click &ldquo;Add New Project&rdquo; to upload your first AI UGC video!
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {projects.slice(0, 4).map((p) => (
                        <div
                          key={p.id}
                          className="p-3 rounded-lg bg-[#171C19] border border-[#2A332B] flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={p.thumbnail_url}
                              alt={p.title}
                              className="w-12 h-10 object-cover rounded bg-black shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="font-semibold text-[#F5F5F0] truncate block">
                                {p.title}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] text-[#A0A89F] font-mono mt-0.5">
                                <span>{p.category}</span>
                                <span>·</span>
                                <span>{p.duration || '0:30'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                                p.is_published
                                  ? 'bg-[#C7F36B]/15 text-[#C7F36B] border border-[#C7F36B]/30'
                                  : 'bg-zinc-700/30 text-zinc-400 border border-zinc-700'
                              }`}
                            >
                              {p.is_published ? 'Published' : 'Draft'}
                            </span>
                            <button
                              onClick={() => {
                                setEditingProject(p);
                                setIsFormModalOpen(true);
                              }}
                              className="p-1.5 text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#111514] rounded"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Inquiries Strip */}
                <div className="lg:col-span-4 bg-[#111514] border border-[#2A332B] rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold font-heading text-[#F5F5F0]">
                      Recent Leads
                    </h3>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="text-xs text-[#C7F36B] hover:underline"
                    >
                      All Leads ({inquiries.length})
                    </button>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#A0A89F]">
                      No inquiries submitted yet. Form submissions from the portfolio will appear here.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {inquiries.slice(0, 3).map((inq) => (
                        <div
                          key={inq.id}
                          className="p-3 rounded-lg bg-[#171C19] border border-[#2A332B] space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#F5F5F0]">
                              {inq.brand_name || inq.name}
                            </span>
                            {!inq.is_read && (
                              <span className="w-2 h-2 rounded-full bg-[#C7F36B]" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#A0A89F] line-clamp-2">
                            &ldquo;{inq.message}&rdquo;
                          </p>
                          <div className="text-[10px] font-mono text-[#A0A89F] pt-1">
                            {new Date(inq.created_at).toLocaleDateString()} · {inq.email}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: ALL PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              
              {/* Controls bar */}
              <div className="p-4 bg-[#111514] border border-[#2A332B] rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                
                {/* Search input */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-[#A0A89F] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                  />
                </div>

                {/* Category & Status Filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Published">Published Only</option>
                    <option value="Draft">Drafts Only</option>
                  </select>
                </div>
              </div>

              {/* Projects List / Table */}
              {filteredProjects.length === 0 ? (
                <div className="p-12 text-center bg-[#111514] border border-[#2A332B] rounded-xl space-y-3">
                  <Film className="w-8 h-8 text-[#A0A89F] mx-auto" />
                  <h3 className="text-sm font-bold font-heading text-[#F5F5F0]">
                    No projects found
                  </h3>
                  <p className="text-xs text-[#A0A89F]">
                    Try adjusting your filters or upload a new project.
                  </p>
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setIsFormModalOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-bold text-[#090A0B] bg-[#C7F36B] rounded-md cursor-pointer"
                  >
                    Add Project
                  </button>
                </div>
              ) : (
                <div className="bg-[#111514] border border-[#2A332B] rounded-xl overflow-hidden divide-y divide-[#2A332B]">
                  {filteredProjects.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 hover:bg-[#171C19]/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                    >
                      {/* Left: Thumbnail & Meta */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-black border border-[#2A332B] shrink-0 group">
                          <img
                            src={p.thumbnail_url}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                          {p.video_url && (
                            <button
                              onClick={() => setPreviewingVideoUrl(p.video_url)}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Preview video"
                            >
                              <Play className="w-4 h-4 text-[#C7F36B] fill-current" />
                            </button>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#F5F5F0] truncate block">
                              {p.title}
                            </span>
                            {p.is_featured && (
                              <Star className="w-3.5 h-3.5 text-[#C7F36B] fill-current shrink-0" />
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#A0A89F] font-mono mt-0.5">
                            <span>{p.category}</span>
                            <span>·</span>
                            <span>{p.duration || '0:30'}</span>
                            {p.brand_name && (
                              <>
                                <span>·</span>
                                <span className="text-[#F5F5F0]">{p.brand_name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {/* Order adjustment */}
                        <div className="flex items-center gap-1 border border-[#2A332B] rounded bg-[#171C19] px-1">
                          <button
                            onClick={() => handleMoveOrder(p, 'up')}
                            className="p-1 text-[#A0A89F] hover:text-[#F5F5F0]"
                            title="Move up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] font-mono px-1 text-[#A0A89F]">
                            {p.display_order}
                          </span>
                          <button
                            onClick={() => handleMoveOrder(p, 'down')}
                            className="p-1 text-[#A0A89F] hover:text-[#F5F5F0]"
                            title="Move down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Publish toggle */}
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium border transition-colors cursor-pointer ${
                            p.is_published
                              ? 'bg-[#C7F36B]/15 text-[#C7F36B] border-[#C7F36B]/30'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          {p.is_published ? 'Published' : 'Draft'}
                        </button>

                        {/* Featured toggle */}
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1.5 rounded border transition-colors cursor-pointer ${
                            p.is_featured
                              ? 'bg-[#C7F36B]/15 text-[#C7F36B] border-[#C7F36B]/30'
                              : 'text-[#A0A89F] hover:text-[#F5F5F0] border-[#2A332B]'
                          }`}
                          title="Toggle featured status"
                        >
                          <Star className={`w-3.5 h-3.5 ${p.is_featured ? 'fill-current' : ''}`} />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => {
                            setEditingProject(p);
                            setIsFormModalOpen(true);
                          }}
                          className="p-1.5 text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19] rounded border border-[#2A332B] cursor-pointer"
                          title="Edit project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteProject(p)}
                          disabled={deletingProjectId === p.id}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded border border-[#2A332B] cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const count = projects.filter((p) => p.category === cat).length;
                  const publishedCount = projects.filter(
                    (p) => p.category === cat && p.is_published
                  ).length;

                  return (
                    <div
                      key={cat}
                      className="p-5 rounded-xl bg-[#111514] border border-[#2A332B] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold font-heading text-sm text-[#F5F5F0]">
                          {cat}
                        </h3>
                        <span className="text-xs font-mono text-[#C7F36B] bg-[#C7F36B]/10 px-2 py-0.5 rounded">
                          {count} Projects
                        </span>
                      </div>
                      <p className="text-xs text-[#A0A89F]">
                        {publishedCount} live in public portfolio · {count - publishedCount} drafts
                      </p>
                      <button
                        onClick={() => {
                          setCategoryFilter(cat);
                          setActiveTab('projects');
                        }}
                        className="text-xs text-[#C7F36B] hover:underline font-semibold"
                      >
                        Filter & View Projects &rarr;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 p-4 bg-[#111514] border border-[#2A332B] rounded-xl text-xs">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-[#A0A89F] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    placeholder="Search leads by brand or email..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C7F36B]"
                  />
                </div>
                <span className="text-xs font-mono text-[#A0A89F]">
                  Total: {inquiries.length} ({unreadInquiries} unread)
                </span>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-12 text-center bg-[#111514] border border-[#2A332B] rounded-xl space-y-2 text-xs text-[#A0A89F]">
                  <MessageSquare className="w-8 h-8 mx-auto text-[#A0A89F]" />
                  <p className="font-semibold text-[#F5F5F0]">No inquiries found</p>
                  <p>Inquiries submitted through your contact form will be listed here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries
                    .filter(
                      (i) =>
                        inquirySearch === '' ||
                        (i.brand_name || i.brandName || '').toLowerCase().includes(inquirySearch.toLowerCase()) ||
                        (i.email || '').toLowerCase().includes(inquirySearch.toLowerCase()) ||
                        (i.name || '').toLowerCase().includes(inquirySearch.toLowerCase()) ||
                        (i.message || '').toLowerCase().includes(inquirySearch.toLowerCase())
                    )
                    .map((inq) => (
                      <div
                        key={inq.id}
                        className={`p-5 rounded-xl border transition-all text-xs space-y-3 ${
                          inq.is_read
                            ? 'bg-[#111514] border-[#2A332B]'
                            : 'bg-[#171C19] border-[#C7F36B]/40 shadow-sm shadow-[#C7F36B]/5'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#F5F5F0]">
                              {inq.brand_name || inq.name}
                            </span>
                            {!inq.is_read && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#C7F36B] text-[#090A0B] font-bold">
                                NEW
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <button
                              onClick={() => handleToggleInquiryRead(inq)}
                              className="px-2.5 py-1 rounded bg-[#171C19] border border-[#2A332B] text-[#A0A89F] hover:text-[#F5F5F0] cursor-pointer"
                            >
                              {inq.is_read ? 'Mark Unread' : 'Mark Read'}
                            </button>
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 text-rose-400 hover:text-rose-300 rounded bg-[#171C19] border border-[#2A332B] cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#A0A89F] font-mono border-y border-[#2A332B] py-2">
                          <div>
                            <span className="text-[#A0A89F]">Contact:</span>{' '}
                            <span className="text-[#F5F5F0]">{inq.name}</span> (
                            <a href={`mailto:${inq.email}`} className="text-[#C7F36B] hover:underline">
                              {inq.email}
                            </a>
                            )
                          </div>
                          <div>
                            <span className="text-[#A0A89F]">Industry:</span>{' '}
                            <span className="text-[#F5F5F0]">{inq.industry}</span>
                          </div>
                          <div>
                            <span className="text-[#A0A89F]">Budget:</span>{' '}
                            <span className="text-[#F5F5F0]">{inq.budget}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A0A89F] block mb-1">
                            Message Brief:
                          </span>
                          <p className="text-xs text-[#F5F5F0] leading-relaxed whitespace-pre-wrap bg-[#090A0B] p-3 rounded-lg border border-[#2A332B]">
                            {inq.message}
                          </p>
                        </div>

                        {inq.selected_services && inq.selected_services.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] text-[#A0A89F]">Services requested:</span>
                            {inq.selected_services.map((srv) => (
                              <span
                                key={srv}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171C19] border border-[#2A332B] text-[#F5F5F0]"
                              >
                                {srv}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SQL SETUP */}
          {activeTab === 'sql-setup' && (
            <div className="bg-[#111514] border border-[#2A332B] rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold font-heading text-[#F5F5F0]">
                    Supabase SQL Schema & Storage Setup
                  </h3>
                  <p className="text-xs text-[#A0A89F] mt-1 leading-relaxed">
                    Execute this script in your Supabase SQL Editor to provision the <code className="text-[#C7F36B]">portfolio_projects</code> and <code className="text-[#C7F36B]">inquiries</code> tables, RLS security policies, and storage buckets.
                  </p>
                </div>

                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 text-xs font-bold font-heading uppercase text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied SQL!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy SQL Schema</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-lg bg-[#171C19] border border-[#2A332B] text-xs space-y-2">
                <span className="font-semibold text-[#F5F5F0] block">How to apply in 60 seconds:</span>
                <ol className="list-decimal pl-4 space-y-1 text-[#A0A89F]">
                  <li>Open the <a href="https://supabase.com/dashboard/project/ogzrhiwvgahjnazeuxmg/sql" target="_blank" rel="noopener noreferrer" className="text-[#C7F36B] hover:underline">Supabase SQL Editor</a>.</li>
                  <li>Click <strong>&ldquo;New query&rdquo;</strong>.</li>
                  <li>Paste the SQL script below and click <strong>&ldquo;Run&rdquo;</strong>.</li>
                  <li>All tables, storage buckets (<code className="text-[#F5F5F0]">portfolio-videos</code> & <code className="text-[#F5F5F0]">portfolio-thumbnails</code>), and RLS security rules will be configured automatically!</li>
                </ol>
              </div>

              {/* Code viewer */}
              <div className="relative">
                <pre className="p-4 rounded-xl bg-[#090A0B] border border-[#2A332B] text-[11px] font-mono text-[#A0A89F] overflow-x-auto max-h-[380px] leading-relaxed">
                  {SUPABASE_SETUP_SQL}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-[#111514] border border-[#2A332B] rounded-xl p-6 space-y-6 text-xs">
              <h3 className="text-base font-bold font-heading text-[#F5F5F0]">
                Supabase Connection & Project Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#171C19] border border-[#2A332B] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#A0A89F]">Project URL</span>
                  <p className="text-xs font-mono text-[#F5F5F0] truncate">
                    https://ogzrhiwvgahjnazeuxmg.supabase.co
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#171C19] border border-[#2A332B] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#A0A89F]">Publishable Key</span>
                  <p className="text-xs font-mono text-[#F5F5F0] truncate">
                    sb_publishable_EzrsAx5vS0gkTPXTNzW-NA_hFVil_pw
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2A332B] space-y-3">
                <h4 className="font-bold text-[#F5F5F0]">Security & Admin Management</h4>
                <p className="text-[#A0A89F] leading-relaxed">
                  Only authenticated users can upload media, edit projects, or read client inquiries.
                  Public visitors only have read-only access to published projects via Row Level Security (RLS).
                </p>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Project Add/Edit Modal */}
      {isFormModalOpen && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => setIsFormModalOpen(false)}
          onSaved={() => {
            setIsFormModalOpen(false);
            loadData();
          }}
        />
      )}

      {/* Video Preview Modal */}
      {previewingVideoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewingVideoUrl(null)}
        >
          <div className="relative max-w-sm w-full bg-[#111514] rounded-2xl overflow-hidden border border-[#2A332B] p-2">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setPreviewingVideoUrl(null)}
                className="p-1 text-white hover:text-[#C7F36B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-[9/16] bg-black rounded-xl overflow-hidden">
              <video src={previewingVideoUrl} controls autoPlay className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
