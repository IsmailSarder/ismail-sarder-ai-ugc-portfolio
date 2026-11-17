import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Globe,
  Play,
  Film,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs.tsx';
import { PortfolioItem, VideoModal } from '../components/VideoModal.tsx';
import { ServiceLandingPageContent } from '../data/landingPagesData.ts';
import { ROUTE_SEO_CONFIG, navigateToPath } from '../lib/seo.ts';
import { portfolioService, DEFAULT_INITIAL_PROJECTS } from '../lib/portfolioService.ts';
import { CGI_INITIAL_PROJECTS, CGI_CATEGORIES } from '../data/cgiProjects.ts';
import { enrichPortfolioItem } from '../lib/caseStudyEnrichment.ts';
import { getPresentationAspectRatio, normalizeAspectRatio } from '../lib/videoAspectRatios.ts';

interface ServiceLandingPageProps {
  content: ServiceLandingPageContent;
  onBookService: (serviceName: string) => void;
  refreshTrigger?: number;
}

export const ServiceLandingPage: React.FC<ServiceLandingPageProps> = ({
  content,
  onBookService,
  refreshTrigger = 0,
}) => {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const seo = ROUTE_SEO_CONFIG[content.path];

  useEffect(() => {
    let active = true;

    const mapDefaults = () => {
      const baseMapped = DEFAULT_INITIAL_PROJECTS.map((p) =>
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
          brand_name: p.brand_name,
          brandName: p.brand_name,
          hook: p.hook || '',
          angle: p.angle || p.category,
          overview: p.description,
          isConcept: !p.brand_name,
          targetMarket: 'USA, UK, UAE, Canada & Europe',
        })
      );

      // Merge curated CGI showcase items if not already duplicated by ID
      const seenIds = new Set(baseMapped.map((b) => b.id));
      const merged = [...baseMapped];
      for (const cgi of CGI_INITIAL_PROJECTS) {
        if (!seenIds.has(cgi.id)) {
          merged.push(enrichPortfolioItem(cgi));
          seenIds.add(cgi.id);
        }
      }
      return merged;
    };

    setProjects(mapDefaults());

    portfolioService.getPublishedProjects().then(({ data, isFromDatabase }) => {
      if (!active || !isFromDatabase || !data || data.length === 0) return;

      const dbMapped = data.map((p) =>
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
          brand_name: p.brand_name,
          brandName: p.brand_name,
          hook: p.hook || '',
          angle: p.angle || p.category,
          overview: p.description,
          isConcept: !p.brand_name,
          targetMarket: 'USA, UK, UAE, Canada & Europe',
        })
      );

      setProjects(dbMapped);
    });

    return () => {
      active = false;
    };
  }, [refreshTrigger]);

  const curatedExamples = useMemo(() => {
    const matched = projects.filter((proj) => {
      const haystack = `${proj.title} ${proj.category} ${proj.overview || ''} ${proj.serviceType || ''}`.toLowerCase();
      return content.portfolioFilterKeywords.some((kw) => haystack.includes(kw.toLowerCase()));
    });
    return (matched.length > 0 ? matched : projects).slice(0, 3);
  }, [projects, content.portfolioFilterKeywords]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigateToPath(path);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#090A0B]">
      {/* Page Hero Header */}
      <section className="pb-14 sm:pb-16 border-b border-[#2A332B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={seo?.breadcrumbs || [{ name: 'Home', path: '/' }]} />

          <div className="max-w-4xl space-y-5">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C7F36B] block">
              {content.eyebrow}
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold font-heading text-[#F5F5F0] tracking-tight leading-[1.08] [text-wrap:balance]">
              {content.h1}
            </h1>

            <p className="text-base sm:text-lg text-[#F5F5F0]/90 leading-relaxed max-w-3xl">
              {content.lead}
            </p>

            <div className="inline-flex items-start sm:items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-xs text-[#A0A89F]">
              <Globe className="w-4 h-4 text-[#C7F36B] shrink-0 mt-0.5 sm:mt-0" />
              <span>{content.internationalNote}</span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => onBookService(content.inquiryServiceKey)}
                className="px-6 py-3.5 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all shadow-lg shadow-[#C7F36B]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="/portfolio"
                onClick={(e) => handleLinkClick(e, '/portfolio')}
                className="px-6 py-3.5 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#F5F5F0] hover:text-[#C7F36B] bg-[#171C19] border border-[#2A332B] hover:border-[#C7F36B]/50 rounded-md transition-all flex items-center justify-center gap-2"
              >
                <span>View All Case Studies</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Strategy & Deliverables Breakdown */}
      <section className="py-14 sm:py-20 bg-[#111514] border-b border-[#2A332B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F5F5F0] tracking-tight leading-snug">
              {content.overviewTitle}
            </h2>
            {content.overviewParagraphs.map((para) => (
              <p key={para.slice(0, 32)} className="text-sm text-[#A0A89F] leading-relaxed">
                {para}
              </p>
            ))}

            {/* Formats & Ratios Box */}
            <div className="p-5 rounded-xl bg-[#171C19] border border-[#2A332B] space-y-3 mt-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C7F36B]">
                Delivered Ad Aspect Ratios
              </h3>
              <div className="space-y-2.5">
                {content.formats.map((fmt) => (
                  <div key={fmt.ratio} className="flex items-start justify-between gap-3 text-xs border-b border-[#2A332B]/70 last:border-b-0 pb-2 last:pb-0">
                    <div>
                      <span className="font-mono font-bold text-[#F5F5F0]">{fmt.ratio}</span>
                      <span className="text-[#A0A89F]"> — {fmt.label}</span>
                    </div>
                    <span className="text-[#A0A89F] text-right">{fmt.platforms}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
              {content.featuresTitle}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.features.map((feat) => (
                <article
                  key={feat.title}
                  className="p-5 rounded-xl bg-[#171C19] border border-[#2A332B] space-y-2"
                >
                  <div className="flex items-center gap-2 text-[#C7F36B]">
                    <Check className="w-4 h-4 shrink-0" />
                    <h3 className="text-sm sm:text-base font-bold font-heading text-[#F5F5F0]">
                      {feat.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#A0A89F] leading-relaxed">{feat.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Curated Video Samples */}
      <section className="py-14 sm:py-20 bg-[#090A0B] border-b border-[#2A332B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C7F36B] block mb-2">
                Portfolio Examples
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
                {content.portfolioCategoryLabel}
              </h2>
            </div>

            <a
              href="/portfolio"
              onClick={(e) => handleLinkClick(e, '/portfolio')}
              className="text-xs font-mono font-bold text-[#C7F36B] hover:underline underline-offset-4 inline-flex items-center gap-1"
            >
              <span>Browse Full Portfolio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {curatedExamples.map((item) => {
              const resolvedRatio = normalizeAspectRatio(
                item.aspect_ratio || item.aspectRatio,
                item.video_width || item.videoWidth,
                item.video_height || item.videoHeight
              );
              const cssRatio = getPresentationAspectRatio(
                resolvedRatio,
                item.video_width || item.videoWidth,
                item.video_height || item.videoHeight
              );

              return (
                <article
                  key={item.id}
                  onClick={() => setActiveModalItem(item)}
                  className="group bg-[#171C19] border border-[#2A332B] hover:border-[#C7F36B]/70 rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all"
                >
                  <div className="relative h-56 bg-[#090A0B] flex items-center justify-center p-3 overflow-hidden">
                    <div
                      style={{ aspectRatio: cssRatio }}
                      className="h-full max-w-full rounded-lg overflow-hidden bg-black/75 border border-white/10 flex items-center justify-center"
                    >
                      <img
                        src={item.thumbnail}
                        alt={`${item.title} — ${item.category} video ad sample`}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-[#C7F36B] text-[#090A0B] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#C7F36B] mb-1.5">
                        <span>{item.category}</span>
                        <span className="inline-flex items-center gap-1 text-[#A0A89F]">
                          <Film className="w-3 h-3 text-[#C7F36B]" />
                          {resolvedRatio}
                        </span>
                      </div>
                      <h3 className="text-base font-bold font-heading text-[#F5F5F0] group-hover:text-[#C7F36B] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#A0A89F] mt-1.5 line-clamp-2">
                        {item.creativeConcept || item.overview}
                      </p>
                    </div>

                    <span className="pt-3 border-t border-[#2A332B] text-xs font-mono text-[#C7F36B] inline-flex items-center gap-1.5">
                      <span>Watch Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service-Specific FAQs */}
      <section className="py-14 sm:py-20 bg-[#111514] border-b border-[#2A332B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C7F36B] block mb-2">
              Questions &amp; Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-3">
            {content.faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={faq.question}
                  className="bg-[#171C19] border border-[#2A332B] rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <h3 className="text-sm sm:text-base font-bold font-heading text-[#F5F5F0]">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-4 h-4 text-[#C7F36B] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-[#A0A89F] leading-relaxed border-t border-[#2A332B]/70 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Internal Related Services & Final CTA */}
      <section className="pt-14 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold font-heading text-[#F5F5F0] mb-5">
              Explore Related Services &amp; Pages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content.relatedPages.map((rel) => (
                <a
                  key={rel.path}
                  href={rel.path}
                  onClick={(e) => handleLinkClick(e, rel.path)}
                  className="p-5 rounded-xl bg-[#171C19] border border-[#2A332B] hover:border-[#C7F36B]/60 transition-colors group flex items-start justify-between gap-3"
                >
                  <div>
                    <h3 className="text-sm font-bold font-heading text-[#F5F5F0] group-hover:text-[#C7F36B] transition-colors">
                      {rel.label}
                    </h3>
                    <p className="text-xs text-[#A0A89F] mt-1">{rel.summary}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#C7F36B] shrink-0" />
                </a>
              ))}
            </div>
          </div>

          <div className="p-8 sm:p-10 rounded-2xl bg-[#171C19] border border-[#C7F36B]/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#F5F5F0]">
                {content.ctaHeadline}
              </h2>
              <p className="text-xs sm:text-sm text-[#A0A89F] leading-relaxed">
                {content.ctaDescription}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onBookService(content.inquiryServiceKey)}
              className="px-6 py-3.5 text-xs sm:text-sm font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Request Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {activeModalItem && (
        <VideoModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
          onOrderSimilar={() => {
            setActiveModalItem(null);
            onBookService(content.inquiryServiceKey);
          }}
        />
      )}
    </div>
  );
};
