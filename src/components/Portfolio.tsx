import React, { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Search, X } from 'lucide-react';
import { VideoModal, PortfolioItem } from './VideoModal.tsx';
import { ProjectCard3D } from './ProjectCard3D.tsx';
import { FeaturedShowcase } from './FeaturedShowcase.tsx';
import { portfolioService, DEFAULT_INITIAL_PROJECTS } from '../lib/portfolioService.ts';
import { normalizeAspectRatio } from '../lib/videoAspectRatios.ts';
import { enrichPortfolioItem } from '../lib/caseStudyEnrichment.ts';
import { CGI_CATEGORIES } from '../data/cgiProjects.ts';

export interface PortfolioRef {
  setCategory: (category: string) => void;
}

interface PortfolioProps {
  onOpenInquiryWithProject?: (projectTitle: string) => void;
  refreshTrigger?: number;
}

const PORTFOLIO_CATEGORIES = [
  'All Work',
  'Beauty & Skincare',
  'Fashion',
  'Gadgets & Technology',
  'AI UGC',
  'CGI Commercials',
] as const;

export const Portfolio = forwardRef<PortfolioRef, PortfolioProps>(
  ({ onOpenInquiryWithProject, refreshTrigger }, ref) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All Work');
    const [projectOrigin, setProjectOrigin] = useState<'all' | 'client' | 'concept'>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);

    useImperativeHandle(ref, () => ({
      setCategory: (category: string) => {
        if (category === 'All Projects' || category === 'All Work') {
          setSelectedCategory('All Work');
        } else if (category === 'AI UGC Ads' || category === 'AI UGC Creator Videos') {
          setSelectedCategory('AI UGC');
        } else if (category === 'CGI Product Ads' || category === 'Product Commercials' || category === '3D Product Animation') {
          setSelectedCategory('CGI Commercials');
        } else if (category === 'Fashion & Lifestyle') {
          setSelectedCategory('Fashion');
        } else if (category === 'AI Video Ads' || category === 'Product Demonstrations') {
          setSelectedCategory('All Work');
        } else {
          setSelectedCategory(category);
        }
        setProjectOrigin('all');
        setSearchQuery('');
        const el = document.getElementById('portfolio');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      },
    }));

    const initialMapped: PortfolioItem[] = useMemo(
      () =>
        DEFAULT_INITIAL_PROJECTS.map((p) =>
          enrichPortfolioItem({
            id: p.id,
            title: p.title,
            category: p.category,
            serviceType: (CGI_CATEGORIES as readonly string[]).includes(p.category)
              ? 'CGI Product Ads'
              : 'AI UGC Ads',
            duration: p.duration || '0:28',
            format: p.format || '9:16 Vertical Video',
            thumbnail: p.thumbnail_url,
            video_url: p.video_url,
            videoUrl: p.video_url,
            aspect_ratio: normalizeAspectRatio(p.aspect_ratio, p.video_width, p.video_height),
            aspectRatio: normalizeAspectRatio(p.aspect_ratio, p.video_width, p.video_height),
            video_width: p.video_width,
            videoWidth: p.video_width,
            video_height: p.video_height,
            videoHeight: p.video_height,
            video_mime_type: p.video_mime_type,
            videoMimeType: p.video_mime_type,
            brand_name: p.brand_name,
            brandName: p.brand_name,
            hook: p.hook || '',
            angle: p.angle || p.category,
            overview: p.description,
            isConcept: !p.brand_name,
            targetMarket: 'USA, UK, UAE, Canada, Australia & Europe',
          })
        ),
      []
    );

    const [projects, setProjects] = useState<PortfolioItem[]>(initialMapped);

    // Load published projects from Supabase whenever mounted or refreshed
    useEffect(() => {
      let isCurrent = true;
      portfolioService.getPublishedProjects().then(({ data }) => {
        if (isCurrent && data && data.length > 0) {
          const mappedItems: PortfolioItem[] = data.map((p) => {
            const derivedServiceType: 'AI UGC Ads' | 'AI Video Ads' | 'CGI Product Ads' =
              (CGI_CATEGORIES as readonly string[]).includes(p.category)
                ? 'CGI Product Ads'
                : p.category === 'AI Video Ads' ||
                  p.category === 'Product Demonstration' ||
                  p.category === 'Product Demonstrations'
                ? 'AI Video Ads'
                : 'AI UGC Ads';

            return enrichPortfolioItem({
              id: p.id,
              title: p.title,
              category: p.category,
              serviceType: derivedServiceType,
              duration: p.duration || '0:30',
              format: p.format || '9:16 Vertical Video',
              thumbnail: p.thumbnail_url,
              video_url: p.video_url,
              videoUrl: p.video_url,
              aspect_ratio: normalizeAspectRatio(p.aspect_ratio, p.video_width, p.video_height),
              aspectRatio: normalizeAspectRatio(p.aspect_ratio, p.video_width, p.video_height),
              video_width: p.video_width,
              videoWidth: p.video_width,
              video_height: p.video_height,
              videoHeight: p.video_height,
              video_mime_type: p.video_mime_type,
              videoMimeType: p.video_mime_type,
              brand_name: p.brand_name,
              brandName: p.brand_name,
              hook: p.hook || '',
              angle: p.angle || p.category,
              overview: p.description,
              isConcept: !p.brand_name,
              targetMarket: 'USA, UK, UAE, Canada, Australia & Europe',
            });
          });
          setProjects(mappedItems);
        }
      });
      return () => {
        isCurrent = false;
      };
    }, [refreshTrigger]);

    const originCounts = useMemo(() => {
      const clientCount = projects.filter((p) => Boolean(p.brand_name || p.brandName)).length;
      const conceptCount = projects.length - clientCount;
      return {
        all: projects.length,
        client: clientCount,
        concept: conceptCount,
      };
    }, [projects]);

    // Origin, Category & Search Filtering
    const filteredProjects = useMemo(() => {
      return projects.filter((project) => {
        const isClient = Boolean(project.brand_name || project.brandName);
        if (projectOrigin === 'client' && !isClient) return false;
        if (projectOrigin === 'concept' && isClient) return false;

        let matchesCategory = false;
        const cat = project.category;

        if (selectedCategory === 'All Work' || selectedCategory === 'All Projects') {
          matchesCategory = true;
        } else if (selectedCategory === 'Beauty & Skincare') {
          matchesCategory =
            cat === 'Beauty & Skincare' ||
            project.title.toLowerCase().includes('serum') ||
            project.title.toLowerCase().includes('skin') ||
            project.title.toLowerCase().includes('body wash') ||
            project.title.toLowerCase().includes('bloom');
        } else if (selectedCategory === 'Fashion') {
          matchesCategory =
            cat === 'Fashion & Lifestyle' ||
            project.title.toLowerCase().includes('tee') ||
            project.title.toLowerCase().includes('sneaker') ||
            project.title.toLowerCase().includes('future');
        } else if (selectedCategory === 'Gadgets & Technology') {
          matchesCategory =
            cat === 'Gadgets & Technology' ||
            project.title.toLowerCase().includes('headphone') ||
            project.title.toLowerCase().includes('beat') ||
            project.title.toLowerCase().includes('charge');
        } else if (selectedCategory === 'AI UGC') {
          matchesCategory =
            cat === 'AI UGC Ads' ||
            cat === 'AI UGC Creator Videos' ||
            cat === 'Beauty & Skincare' ||
            cat === 'Fashion & Lifestyle' ||
            cat === 'Gadgets & Technology' ||
            project.serviceType === 'AI UGC Ads';
        } else if (selectedCategory === 'CGI Commercials') {
          matchesCategory =
            cat === 'CGI Product Ads' ||
            cat === 'Product Commercials' ||
            cat === '3D Product Animation' ||
            project.serviceType === 'CGI Product Ads';
        } else {
          matchesCategory = cat === selectedCategory;
        }

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          q === '' ||
          project.title.toLowerCase().includes(q) ||
          project.category.toLowerCase().includes(q) ||
          (project.serviceType || '').toLowerCase().includes(q) ||
          (project.brandName || project.brand_name || '').toLowerCase().includes(q) ||
          (project.hook || '').toLowerCase().includes(q) ||
          (project.targetAudience || '').toLowerCase().includes(q) ||
          (project.creativeConcept || project.overview || '').toLowerCase().includes(q);

        return matchesCategory && matchesSearch;
      });
    }, [projects, projectOrigin, selectedCategory, searchQuery]);

    const handleOrderSimilar = (title: string) => {
      if (onOpenInquiryWithProject) {
        onOpenInquiryWithProject(title);
      } else {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    const handleResetFilters = () => {
      setSelectedCategory('All Work');
      setProjectOrigin('all');
      setSearchQuery('');
    };

    return (
      <section
        id="portfolio"
        className="py-16 sm:py-20 lg:py-28 bg-[#111514] border-t border-b border-[#2A332B] relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
            <div>
              <span className="text-xs font-mono font-semibold tracking-wider text-[#C7F36B] uppercase block mb-2">
                Selected Work &amp; Case Studies
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
                AI UGC &amp; VIDEO AD PORTFOLIO.
              </h2>
            </div>

            <div className="max-w-md">
              <p className="text-xs sm:text-sm text-[#A0A89F] leading-relaxed">
                Every showcase below is explicitly classified as a <strong className="text-[#F5F5F0]">Concept Project</strong> (studio demonstrations) or a <strong className="text-[#F5F5F0]">Client Project</strong> with brand attribution, breaking down target audience, hook, and deliverables.
              </p>
            </div>
          </div>

          {/* Featured Case Study Spotlight */}
          <FeaturedShowcase
            projects={projects}
            onSelectProject={(p) => setActiveModalItem(p)}
            onOrderSimilar={handleOrderSimilar}
          />

          {/* Concept vs Client Origin Segmentation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#2A332B]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#A0A89F] mr-1">
                Project Type:
              </span>
              {(
                [
                  { id: 'all', label: `All Showcase (${originCounts.all})` },
                  { id: 'concept', label: `Concept Projects (${originCounts.concept})` },
                  { id: 'client', label: `Client Projects (${originCounts.client})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setProjectOrigin(tab.id)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors cursor-pointer min-h-[38px] ${
                    projectOrigin === tab.id
                      ? 'bg-[#C7F36B]/15 text-[#C7F36B] border border-[#C7F36B]/60 font-bold'
                      : 'bg-[#171C19] text-[#A0A89F] hover:text-[#F5F5F0] border border-[#2A332B]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-mono text-[#A0A89F]">
              Client commissions under NDA are kept private
            </span>
          </div>

          {/* Search Bar & Category Controls Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 sm:mb-10">
            {/* Category Filter Segments */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {PORTFOLIO_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 sm:px-4 py-2 text-xs font-medium font-heading rounded-md transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer min-h-[42px] flex items-center ${
                    selectedCategory === cat
                      ? 'bg-[#C7F36B] text-[#090A0B] font-bold shadow-sm shadow-[#C7F36B]/20'
                      : 'bg-[#171C19] text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#1e2521] border border-[#2A332B]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Project Search Input */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 text-[#A0A89F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case studies..."
                className="w-full pl-9 pr-8 py-2.5 text-xs rounded-md bg-[#171C19] border border-[#2A332B] text-[#F5F5F0] placeholder-[#A0A89F]/60 focus:outline-none focus:border-[#C7F36B] transition-colors min-h-[42px]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#A0A89F] hover:text-[#F5F5F0] cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Zero Results State */}
          {filteredProjects.length === 0 ? (
            <div className="p-10 sm:p-12 text-center bg-[#171C19] border border-[#2A332B] rounded-xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#111514] border border-[#2A332B] text-[#A0A89F] flex items-center justify-center mx-auto">
                <Search className="w-5 h-5" />
              </div>
              <div className="max-w-lg mx-auto">
                <h3 className="text-base font-bold font-heading text-[#F5F5F0]">
                  {projectOrigin === 'client' && originCounts.client === 0
                    ? 'Public Client Campaigns Under NDA'
                    : `No projects found matching "${searchQuery || selectedCategory}"`}
                </h3>
                <p className="text-xs text-[#A0A89F] mt-1.5 leading-relaxed">
                  {projectOrigin === 'client' && originCounts.client === 0
                    ? 'Active commercial client deliverables are omitted from public listing under confidentiality agreements or pending client showcase approval. Browse Concept Projects to inspect production quality or inquire for private client samples.'
                    : 'Try switching categories, toggling project types, or resetting your search filters.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2.5 text-xs font-semibold text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-colors cursor-pointer min-h-[42px]"
              >
                {projectOrigin === 'client' && originCounts.client === 0
                  ? 'View Concept Showcase'
                  : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard3D
                  key={project.id}
                  project={project}
                  index={index}
                  onSelect={(p) => setActiveModalItem(p)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Video Case Study Lightbox Modal */}
        {activeModalItem && (
          <VideoModal
            item={activeModalItem}
            onClose={() => setActiveModalItem(null)}
            onOrderSimilar={handleOrderSimilar}
          />
        )}
      </section>
    );
  }
);

Portfolio.displayName = 'Portfolio';
