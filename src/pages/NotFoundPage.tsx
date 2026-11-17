import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs.tsx';
import { NOT_FOUND_SEO, navigateToPath } from '../lib/seo.ts';

export const NotFoundPage: React.FC = () => {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigateToPath(path);
  };

  const quickLinks = [
    { label: 'Home Studio Overview', path: '/' },
    { label: 'AI UGC Video Ads', path: '/ai-ugc-video-ads' },
    { label: 'CGI Product Ads', path: '/cgi-product-ads' },
    { label: 'Video Portfolio', path: '/portfolio' },
    { label: 'Contact & Project Brief', path: '/contact' },
  ];

  return (
    <section className="pt-28 sm:pt-36 pb-24 bg-[#090A0B] min-h-[75vh] flex items-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Breadcrumbs items={NOT_FOUND_SEO.breadcrumbs} />

        <div className="p-8 sm:p-10 rounded-2xl bg-[#111514] border border-[#2A332B] space-y-6">
          <span className="text-xs font-mono font-bold text-[#C7F36B] uppercase tracking-wider block">
            Error 404 · Page Not Found
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
            This Page Could Not Be Found
          </h1>

          <p className="text-sm sm:text-base text-[#A0A89F] leading-relaxed">
            The URL you requested does not match an active page on Ismail Sarder&apos;s AI UGC Studio. Use one of the links below to browse our services, portfolio, or project inquiry form.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="/"
              onClick={(e) => handleNav(e, '/')}
              className="px-5 py-3 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Homepage</span>
            </a>

            <a
              href="/contact"
              onClick={(e) => handleNav(e, '/contact')}
              className="px-5 py-3 text-xs font-bold font-heading uppercase tracking-wider text-[#F5F5F0] bg-[#171C19] border border-[#2A332B] hover:border-[#C7F36B]/50 rounded-md inline-flex items-center gap-2"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="pt-6 border-t border-[#2A332B]">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#A0A89F] mb-3">
              Available Pages
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {quickLinks.map((lnk) => (
                <li key={lnk.path}>
                  <a
                    href={lnk.path}
                    onClick={(e) => handleNav(e, lnk.path)}
                    className="text-[#F5F5F0] hover:text-[#C7F36B] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{lnk.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#C7F36B]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
