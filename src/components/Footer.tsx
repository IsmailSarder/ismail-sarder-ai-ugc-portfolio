import React from 'react';
import { Logo } from './Logo.tsx';
import { Mail, MessageSquare, Linkedin, ArrowUp, Lock } from 'lucide-react';
import { navigateToPath } from '../lib/seo.ts';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
    hash?: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigateToPath(path, hash);
  };

  const navLinks = [
    { label: 'Home', path: '/', hash: '' },
    { label: 'Portfolio', path: '/portfolio', hash: '' },
    { label: 'About', path: '/about', hash: '' },
    { label: 'Pricing', path: '/', hash: 'pricing' },
    { label: 'Process', path: '/', hash: 'process' },
    { label: 'FAQ', path: '/', hash: 'faq' },
    { label: 'Contact', path: '/contact', hash: '' },
  ];

  const serviceLinks = [
    { label: 'AI UGC Video Ads', path: '/ai-ugc-video-ads' },
    { label: 'AI Spokesperson Videos', path: '/ai-spokesperson-videos' },
    { label: 'CGI Product Ads', path: '/cgi-product-ads' },
    { label: 'Beauty Video Ads', path: '/beauty-video-ads' },
    { label: 'Fashion Video Ads', path: '/fashion-video-ads' },
  ];

  return (
    <footer className="bg-[#090A0B] border-t border-[#2A332B] pt-14 sm:pt-16 pb-12 text-[#A0A89F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#2A332B]">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" showSubtitle={true} />
            <p className="text-xs sm:text-sm text-[#A0A89F] max-w-sm leading-relaxed mt-4">
              AI UGC Video Ads Creator &amp; Creative Strategist helping e-commerce brands across the USA, UK, UAE, Canada, Australia, and Europe create high-impact video ads.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/8801648861141"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-[#A0A89F] hover:text-[#C7F36B] hover:border-[#C7F36B]/50 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="WhatsApp: +8801648861141"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="mailto:hossenmeismail@gmail.com"
                className="p-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-[#A0A89F] hover:text-[#C7F36B] hover:border-[#C7F36B]/50 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Email: hossenmeismail@gmail.com"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/ismail-sarder"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-[#A0A89F] hover:text-[#C7F36B] hover:border-[#C7F36B]/50 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="LinkedIn: Ismail Sarder"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F5F5F0] font-semibold block">
              Navigation
            </span>
            <ul className="space-y-2 text-xs">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.hash ? `/#${item.hash}` : item.path}
                    onClick={(e) => handleLinkClick(e, item.path, item.hash || undefined)}
                    className="hover:text-[#F5F5F0] transition-colors hover:underline underline-offset-4 py-0.5 inline-block"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              {onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="text-[#C7F36B] hover:underline underline-offset-4 py-0.5 inline-flex items-center gap-1 cursor-pointer font-mono text-[11px]"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Admin Video Upload</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Specialized SEO Landing Pages */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F5F5F0] font-semibold block">
              Specialized Services
            </span>
            <ul className="space-y-2 text-xs">
              {serviceLinks.map((srv) => (
                <li key={srv.path}>
                  <a
                    href={srv.path}
                    onClick={(e) => handleLinkClick(e, srv.path)}
                    className="hover:text-[#C7F36B] transition-colors hover:underline underline-offset-4 py-0.5 inline-block"
                  >
                    {srv.label}
                  </a>
                </li>
              ))}
              <li className="pt-1 text-[11px] font-mono text-[#A0A89F]">
                Markets: USA · UK · UAE · Canada · Australia · EU
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F5F5F0] font-semibold block">
              Direct Contact
            </span>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#A0A89F] block text-[11px]">Email:</span>
                <a
                  href="mailto:hossenmeismail@gmail.com"
                  className="text-[#F5F5F0] hover:text-[#C7F36B] transition-colors"
                >
                  hossenmeismail@gmail.com
                </a>
              </div>
              <div>
                <span className="text-[#A0A89F] block text-[11px]">WhatsApp:</span>
                <a
                  href="https://wa.me/8801648861141"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F5F5F0] hover:text-[#C7F36B] transition-colors"
                >
                  +8801648861141
                </a>
              </div>
              <div>
                <span className="text-[#A0A89F] block text-[11px]">LinkedIn:</span>
                <a
                  href="https://www.linkedin.com/in/ismail-sarder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F5F5F0] hover:text-[#C7F36B] transition-colors"
                >
                  linkedin.com/in/ismail-sarder
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-[#A0A89F] text-center sm:text-left">
            © {new Date().getFullYear()} Ismail Sarder. AI UGC Creative Studio.
          </p>

          <div className="flex items-center gap-6">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-[11px] font-mono text-[#A0A89F] hover:text-[#C7F36B] flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-[#C7F36B]" />
                <span>Admin Portal</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="p-2 px-3 rounded bg-[#111514] border border-[#2A332B] text-[#A0A89F] hover:text-[#C7F36B] hover:border-[#C7F36B]/50 transition-colors flex items-center gap-1.5 cursor-pointer min-h-[36px]"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
