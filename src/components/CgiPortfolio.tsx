import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Play, ArrowUpRight, Box, Clock, Film } from 'lucide-react';
import { VideoModal, PortfolioItem } from './VideoModal.tsx';
import { portfolioService } from '../lib/portfolioService.ts';
import { getPresentationAspectRatio, normalizeAspectRatio } from '../lib/videoAspectRatios.ts';
import { deriveCaseStudyDetails, enrichPortfolioItem } from '../lib/caseStudyEnrichment.ts';
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
  const [projectOrigin, setProjectOrigin] = useState<'all' | 'client' | 'concept'>('all');
  const [projects, setProjects] = useState<PortfolioItem[]>(
    CGI_INITIAL_PROJECTS.map(enrichPortfolioItem)
  );
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    let isCurrent = true;
    portfolioService.getPublishedProjects().then(({ data, isFromDatabase }) => {
      if (!isCurrent || !isFromDatabase || !data || data.length === 0) return;

      const cgiFromDb: PortfolioItem[] = data
        .filter((p) => (CGI_CATEGORIES as readonly string[]).includes(p.category))
        .map((p) =>
          enrichPortfolioItem({
            id: p.id,
            title: p.title,
            category: p.category,
            serviceType: 'CGI Product Ads',
            duration: p.duration || '0:24',
            format: p.format || '16:9 & 9:16 Commercial Master',
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
        );

      if (cgiFromDb.length > 0) {
        setProjects(cgiFromDb);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [refreshTrigger]);

  const originCounts = useMemo(() => {
    const client = projects.filter((p) => Boolean(p.brand_name || p.brandName)).length;
    return {
      all: projects.length,
      concept: projects.length - client,
      client,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const isClient = Boolean(p.brand_name || p.brandName);
      if (projectOrigin === 'client' && !isClient) return false;
      if (projectOrigin === 'concept' && isClient) return false;
      if (selectedFilter === 'All Work') return true;
      return p.category === selectedFilter;
    });
  }, [projects, selectedFilter, projectOrigin]);

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
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-[#C7F36B] uppercase mb-2">
              <Box className="w-3.5 h-3.5" />
              <span>3D Visuals &amp; Product Cinema</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight [text-wrap:balance]">
              CGI Product Commercials
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-[#A0A89F] leading-relaxed mt-3">
              High-impact cinematic product advertisements crafted with creative 3D visuals, dynamic motion, and premium visual storytelling. Each spot is clearly labeled Concept Project or Client Project.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
            {onSelectService && (
              <button
                type="button"
                onClick={() => onSelectService('CGI Product Commercials')}
                className="px-5 py-3 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap min-h-[44px] shadow-md shadow-[#C7F36B]/15"
              >
                <span>Commission a CGI Commercial</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category & Origin Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedFilter(tab)}
                className={`px-3.5 sm:px-4 py-2 text-xs font-medium font-heading rounded-md transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer min-h-[42px] flex items-center ${
                  selectedFilter === tab
                    ? 'bg-[#C7F36B] text-[#090A0B] font-bold shadow-sm shadow-[#C7F36B]/20'
                    : 'bg-[#171C19] text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#1e2521] border border-[#2A332B]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: 'all', label: `All (${originCounts.all})` },
                { id: 'concept', label: `Concept (${originCounts.concept})` },
                { id: 'client', label: `Client (${originCounts.client})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setProjectOrigin(tab.id)}
                className={`px-3 py-1.5 text-[11px] font-mono rounded-md transition-colors cursor-pointer min-h-[38px] ${
                  projectOrigin === tab.id
                    ? 'bg-[#C7F36B]/15 text-[#C7F36B] border border-[#C7F36B]/60 font-bold'
                    : 'bg-[#171C19] text-[#A0A89F] hover:text-[#F5F5F0] border border-[#2A332B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CGI Commercial Cards Grid / NDA Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="p-10 text-center bg-[#111514] border border-[#2A332B] rounded-xl space-y-4">
            <h3 className="text-base font-bold font-heading text-[#F5F5F0]">
              {projectOrigin === 'client' && originCounts.client === 0
                ? 'Private Client CGI Reels Available on Request'
                : 'No CGI Commercials Match This Filter'}
            </h3>
            <p className="text-xs text-[#A0A89F] max-w-md mx-auto leading-relaxed">
              {projectOrigin === 'client' && originCounts.client === 0
                ? 'Client launch commercials covered by brand NDA are withheld from public display. Switch to Concept Projects to watch studio examples.'
                : 'Try selecting All Work or resetting your origin filter.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedFilter('All Work');
                setProjectOrigin('all');
              }}
              className="px-4 py-2 text-xs font-semibold text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-colors cursor-pointer min-h-[40px]"
            >
              Show All CGI Commercials
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProjects.map((project, idx) => {
              const brandDisplayName = project.brand_name || project.brandName;
              const resolvedRatio = normalizeAspectRatio(
                project.aspect_ratio || project.aspectRatio,
                project.video_width || project.videoWidth,
                project.video_height || project.videoHeight
              );
              const derived = deriveCaseStudyDetails(project);
              const statusLabel = brandDisplayName ? 'Client Project' : 'Concept Project';

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
                  {/* Aspect-Ratio Matched Uncropped Stage */}
                  <div className="relative h-56 sm:h-64 bg-[#090A0B] overflow-hidden flex items-center justify-center p-2.5">
                    <img
                      src={project.thumbnail}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110 pointer-events-none"
                    />

                    <div
                      style={{
                        aspectRatio: getPresentationAspectRatio(
                          resolvedRatio,
                          project.video_width || project.videoWidth,
                          project.video_height || project.videoHeight
                        ),
                      }}
                      className="relative z-10 h-full max-w-full rounded-lg overflow-hidden bg-black/70 border border-white/10 flex items-center justify-center"
                    >
                      <img
                        src={project.thumbnail}
                        alt={`${project.title} — ${project.category} video commercial thumbnail`}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>

                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#111514]/80 via-transparent to-black/35 pointer-events-none" />

                    <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between text-[11px] font-mono pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 text-[#C7F36B] font-bold bg-[#090A0B]/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 tabular-nums">
                        <Clock className="w-3 h-3" />
                        {project.duration || '0:24'}
                      </span>

                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-md border uppercase tracking-wider backdrop-blur-md ${
                          brandDisplayName
                            ? 'bg-[#C7F36B] text-[#090A0B] border-[#C7F36B] font-bold'
                            : 'bg-[#090A0B]/85 text-[#F5F5F0] border-white/15'
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C7F36B] text-[#090A0B] flex items-center justify-center shadow-[0_0_32px_rgba(199,243,107,0.5)] transform group-hover:scale-110 transition-all duration-300">
                        <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1 fill-current" />
                      </div>
                    </div>
                  </div>

                  {/* Card Body with Case Study Breakdown */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#A0A89F] flex-wrap">
                        <span className="text-[#C7F36B] font-semibold">
                          {project.category}
                        </span>
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

                      <p className="text-xs sm:text-sm text-[#A0A89F] leading-relaxed line-clamp-2">
                        {project.creativeConcept || derived.creativeConcept}
                      </p>

                      <div className="pt-2 border-t border-[#2A332B]/70 space-y-1 text-[11px]">
                        <p className="text-[#A0A89F] line-clamp-1">
                          <span className="font-mono text-[#F5F5F0] uppercase">Audience:</span>{' '}
                          {project.targetAudience || derived.targetAudience}
                        </p>
                        <p className="text-[#A0A89F] line-clamp-1 italic">
                          <span className="font-mono text-[#C7F36B] uppercase not-italic">Hook:</span>{' '}
                          &ldquo;{project.hook || derived.advertisingHook}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#2A332B] flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalItem(project);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-colors cursor-pointer min-h-[42px]"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch Commercial</span>
                      </button>

                      <span className="text-[11px] font-mono text-[#A0A89F] flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-[#C7F36B]" />
                        <span>{resolvedRatio}</span>
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
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
