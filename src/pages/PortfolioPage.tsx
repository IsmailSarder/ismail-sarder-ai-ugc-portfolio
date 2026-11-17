import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs.tsx';
import { Portfolio } from '../components/Portfolio.tsx';
import { CgiPortfolio } from '../components/CgiPortfolio.tsx';
import { ROUTE_SEO_CONFIG, navigateToPath } from '../lib/seo.ts';
import { ArrowRight } from 'lucide-react';

interface PortfolioPageProps {
  onOpenInquiryWithProject: (projectTitle: string) => void;
  onSelectService: (serviceName: string) => void;
  refreshTrigger: number;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onOpenInquiryWithProject,
  onSelectService,
  refreshTrigger,
}) => {
  const seo = ROUTE_SEO_CONFIG['/portfolio'];

  return (
    <div className="pt-24 sm:pt-28 bg-[#090A0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <Breadcrumbs items={seo.breadcrumbs} />

        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C7F36B] block">
            AI UGC &amp; CGI Commercials
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F5F5F0] tracking-tight leading-[1.08]">
            AI UGC Video Ads &amp; CGI Commercial Portfolio
          </h1>
          <p className="text-sm sm:text-base text-[#A0A89F] leading-relaxed">
            Explore vertical 9:16 AI UGC creatives, skincare demonstrations, consumer electronics ads, and widescreen 16:9 CGI product commercials crafted for e-commerce brands across the USA, UK, UAE, Canada, Australia, and Europe.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="/contact"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                navigateToPath('/contact');
              }}
              className="px-5 py-3 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md inline-flex items-center gap-2"
            >
              <span>Request a Similar Video Ad</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <Portfolio
        onOpenInquiryWithProject={onOpenInquiryWithProject}
        refreshTrigger={refreshTrigger}
      />

      <CgiPortfolio
        onOpenInquiryWithProject={onOpenInquiryWithProject}
        onSelectService={onSelectService}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};
