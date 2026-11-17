import React from 'react';
import { ArrowUpRight, Compass } from 'lucide-react';
import { navigateToPath } from '../lib/seo.ts';

const SPECIALIZED_LINKS = [
  {
    path: '/ai-ugc-video-ads',
    title: 'AI UGC Video Ads',
    subtitle: 'TikTok, Reels & Meta Ads',
    description: 'Native creator-style vertical video ads with scroll-stopping hooks and fast turnaround.',
  },
  {
    path: '/ai-spokesperson-videos',
    title: 'AI Spokesperson Videos',
    subtitle: 'Direct-to-Camera Presenters',
    description: 'Articulate AI brand presenters with tailored regional English accents for DTC and SaaS.',
  },
  {
    path: '/cgi-product-ads',
    title: 'CGI Product Ads',
    subtitle: '3D Product Commercials',
    description: 'Studio-lit 3D CGI product launches crafted for luxury packaging, footwear, and hardware.',
  },
  {
    path: '/beauty-video-ads',
    title: 'Beauty Video Ads',
    subtitle: 'Skincare & Cosmetics',
    description: 'Sensory serum textures, morning routines, and fragrance spots built for beauty brands.',
  },
  {
    path: '/fashion-video-ads',
    title: 'Fashion Video Ads',
    subtitle: 'Apparel & Footwear',
    description: 'Fit-check lookbooks, capsule styling reels, and dynamic sneaker launch commercials.',
  },
  {
    path: '/portfolio',
    title: 'Full Case Study Portfolio',
    subtitle: 'Watch Video Examples',
    description: 'Inspect published AI UGC ads, product demos, and CGI commercials with full breakdowns.',
  },
  {
    path: '/about',
    title: 'About Ismail Sarder',
    subtitle: 'Creative Methodology',
    description: 'Learn how creative strategy, scripting, and production come together for global brands.',
  },
  {
    path: '/contact',
    title: 'Project Brief & Pricing',
    subtitle: 'Start a Campaign',
    description: 'Submit your product link, select a starter or custom package, and get a quote fast.',
  },
];

export const SpecializedPagesHub: React.FC = () => {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigateToPath(path);
  };

  return (
    <section
      aria-labelledby="specialized-solutions-heading"
      className="py-16 sm:py-20 bg-[#111514] border-t border-b border-[#2A332B]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-[#C7F36B] uppercase mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Dedicated Service &amp; Industry Pages</span>
            </div>
            <h2
              id="specialized-solutions-heading"
              className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F5F5F0] tracking-tight"
            >
              EXPLORE SPECIALIZED VIDEO AD SOLUTIONS.
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#A0A89F] max-w-md leading-relaxed">
            Dedicated guides and curated video examples for brands in the USA, UK, UAE, Canada, Australia, and Europe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SPECIALIZED_LINKS.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => handleNav(e, item.path)}
              className="group p-5 rounded-xl bg-[#171C19] border border-[#2A332B] hover:border-[#C7F36B]/60 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C7F36B] block mb-1.5">
                  {item.subtitle}
                </span>
                <h3 className="text-base font-bold font-heading text-[#F5F5F0] group-hover:text-[#C7F36B] transition-colors flex items-center justify-between gap-2 mb-2">
                  <span>{item.title}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0 text-[#A0A89F] group-hover:text-[#C7F36B] transition-colors" />
                </h3>
                <p className="text-xs text-[#A0A89F] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
