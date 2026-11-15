import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Play, ArrowUpRight, Box, Clock, Film } from 'lucide-react';
import { VideoModal, PortfolioItem } from './VideoModal.tsx';
import { portfolioService } from '../lib/portfolioService.ts';
import { CGI_INITIAL_PROJECTS, CGI_CATEGORIES } from '../data/cgiProjects.ts';

interface CgiPortfolioProps {
  onOpenInquiryWithProject?: (projectTitle: string) => void;
  onSelectService?: (serviceName: string) => void;
  refreshTrigger?: number;
}

const FILTER_TABS = [
  'All Work',
  'CGI Product Ads',
  'Product Commercials',
  '3D Product Animation',
] as const;

export const CgiPortfolio: React.FC<CgiPortfolioProps> = ({
  onOpenInquiryWithProject,
  onSelectService,
  refreshTrigger,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All Work');
  const [projects, setProjects] = useState<PortfolioItem[]>(CGI_INITIAL_PROJECTS);
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    let isCurrent = true;
    portfolioService.getPublishedProjects().then(({ data, isFromDatabase }) => {
      if (!isCurrent || !isFromDatabase || !data || data.length === 0) return;

      const cgiFromDb: PortfolioItem[] = data
        .filter((p) => (CGI_CATEGORIES as readonly string[]).includes(p.category))
        .map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          serviceType: 'CGI Product Ads',
          duration: p.duration || '0:30',
          format: p.format || '16:9 & 9:16 Commercial Master',
          thumbnail: p.thumbnail_url,
          video_url: p.video_url,
          videoUrl: p.video_url,
          aspect_ratio: p.aspect_ratio || 'auto',
          aspectRatio: p.aspect_ratio || 'auto',
          video_width: p.video_width,
          videoWidth: p.video_width,
          video_height: p.video_height,
          videoHeight: p.video_height,
          video_mime_type: p.video_mime_type,
          videoMimeType: p.video_mime_type,
          brand_name: p.brand_name,
          brandName: p.brand_name,
          hook: p.hook || p.title,
          angle: p.angle || p.category,
          overview: p.description,
          isConcept: !p.brand_name,
          targetMarket: 'Global Brands',
          keyFeatures: [
            '3D Lighting & Material Craft',
            '4K Master Video Delivery',
            'Social & Web Cutdowns',
          ],
        }));

      if (cgiFromDb.length > 0) {
        setProjects([...cgiFromDb, ...CGI_INITIAL_PROJECTS]);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [refreshTrigger]);

  const filteredProjects = useMemo(() => {
    if (selectedFilter === 'All Work') return projects;
    return projects.filter((p) => p.category === selectedFilter);
  }, [projects, selectedFilter]);

  const handleOrderSimilar = (title: string) => {
    if (onOpenInquiryWithProject) {
      onOpenInquiryWithProject(title);
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="cgi-portfolio"
      className="py-16 sm:py-20 lg:py-28 bg-[#090A0B] border-b border-[#2A332B] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C7F36B] uppercase mb-2">
              <Box className="w-3.5 h-3.5" />
              <span>3D Visuals &amp; Product Cinema</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight [text-wrap:balance]">
              CGI Product Commercials
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-[#A0A89F] leading-relaxed mt-3">
              High-impact cinematic product advertisements crafted with creative 3D visuals, dynamic motion, and premium visual storytelling.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
            {onSelectService && (
              <button
                type="button"
                onClick={() => onSelectService('CGI Product Ads')}
                className="px-5 py-3 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap min-h-[42px] shadow-md shadow-[#C7F36B]/15"
              >
                <span>Commission a CGI Ad</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedFilter(tab)}
                className={`px-3.5 sm:px-4 py-2 text-xs font-medium font-heading rounded-md transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] flex items-center ${
                  selectedFilter === tab
                    ? 'bg-[#C7F36B] text-[#090A0B] font-bold shadow-sm shadow-[#C7F36B]/20'
                    : 'bg-[#171C19] text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#1e2521] border border-[#2A332B]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-[#A0A89F]">
            Sample reels marked as Portfolio Concepts · Click any card to watch full video
          </span>
        </div>

        {/* Large CGI Video Preview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((project, idx) => {
            const brandDisplayName = project.brand_name || project.brandName;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (idx % 3) * 0.08 }}
                onClick={() => setActiveModalItem(project)}
                className="group bg-[#111514] border border-[#2A332B] hover:border-[#C7F36B]/70 rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-xl hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.85),0_0_30px_-8px_rgba(199,243,107,0.18)]"
              >
                {/* Large Video Preview Frame */}
                <div className="relative aspect-[16/10] bg-[#090A0B] overflow-hidden flex items-center justify-center">
                  {/* Ambient Soft Blur Layer */}
                  <img
                    src={project.thumbnail}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110 pointer-events-none"
                  />

                  {/* Main Crisp Render Thumbnail */}
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="relative z-10 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Scrim Overlay */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#111514] via-black/15 to-black/40 pointer-events-none" />

                  {/* Top Metadata Strip (Duration & Concept Label) */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between text-[11px] font-mono pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 text-[#C7F36B] font-bold bg-[#090A0B]/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 tabular-nums">
                      <Clock className="w-3 h-3" />
                      {project.duration || '0:30'}
                    </span>

                    <span className="text-[10px] text-[#A0A89F] bg-[#090A0B]/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 uppercase tracking-wider">
                      {project.isConcept ? 'Portfolio Concept' : 'Client Reel'}
                    </span>
                  </div>

                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C7F36B] text-[#090A0B] flex items-center justify-center shadow-[0_0_32px_rgba(199,243,107,0.5)] transform group-hover:scale-110 transition-all duration-300">
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1 fill-current" />
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2.5">
                    {/* Unboxed Clean Category & Metadata */}
                    <div className="flex items-center gap-2 text-xs font-mono text-[#A0A89F] flex-wrap">
                      <span className="text-[#C7F36B] font-semibold">
                        {project.category}
                      </span>
                      <span aria-hidden="true" className="text-[#2A332B]">·</span>
                      <span className="tabular-nums">{project.duration || '0:30'}</span>
                      {brandDisplayName && (
                        <>
                          <span aria-hidden="true" className="text-[#2A332B]">·</span>
                          <span className="text-[#F5F5F0]">{brandDisplayName}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold font-heading text-[#F5F5F0] group-hover:text-[#C7F36B] transition-colors leading-snug">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#A0A89F] leading-relaxed line-clamp-3">
                      {project.overview}
                    </p>
                  </div>

                  {/* Play Video Button Footer */}
                  <div className="pt-4 border-t border-[#2A332B] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalItem(project);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-colors cursor-pointer min-h-[38px]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Video</span>
                    </button>

                    <span className="text-[11px] font-mono text-[#A0A89F] flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-[#C7F36B]" />
                      <span>{project.aspect_ratio || project.aspectRatio || '16:9'}</span>
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Responsive Video Player Lightbox */}
      {activeModalItem && (
        <VideoModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
          onOrderSimilar={handleOrderSimilar}
        />
      )}
    </section>
  );
};
