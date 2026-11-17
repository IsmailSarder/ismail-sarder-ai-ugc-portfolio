import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs.tsx';
import { About } from '../components/About.tsx';
import { WhyWorkWithMe } from '../components/WhyWorkWithMe.tsx';
import { WhatClientsReceive } from '../components/WhatClientsReceive.tsx';
import { ROUTE_SEO_CONFIG } from '../lib/seo.ts';

interface AboutPageProps {
  onOpenInquiry: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenInquiry }) => {
  const seo = ROUTE_SEO_CONFIG['/about'];

  return (
    <div className="pt-24 sm:pt-28 bg-[#090A0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <Breadcrumbs items={seo.breadcrumbs} />

        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C7F36B] block">
            Creator &amp; Strategist Profile
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F5F5F0] tracking-tight leading-[1.08]">
            About Ismail Sarder — AI UGC Video Ads Creator
          </h1>
          <p className="text-sm sm:text-base text-[#A0A89F] leading-relaxed">
            Partnering directly with direct-to-consumer e-commerce brands and marketing agencies across the United States, United Kingdom, United Arab Emirates, Canada, Australia, and Europe to produce conversion-focused AI UGC and CGI video creatives.
          </p>
        </div>
      </div>

      <About onOpenInquiry={onOpenInquiry} />
      <WhyWorkWithMe />
      <WhatClientsReceive onOpenInquiry={onOpenInquiry} />
    </div>
  );
};
