import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo.tsx';
import { Menu, X, ArrowUpRight, Lock, ChevronDown } from 'lucide-react';
import { navigateToPath, normalizePathname } from '../lib/seo.ts';

interface NavbarProps {
  currentPath?: string;
  onOpenInquiry?: (serviceName?: string) => void;
  onOpenAdmin?: () => void;
}

const SERVICE_SUBLINKS = [
  { label: 'AI UGC Video Ads', path: '/ai-ugc-video-ads' },
  { label: 'AI Spokesperson Videos', path: '/ai-spokesperson-videos' },
  { label: 'CGI Product Ads', path: '/cgi-product-ads' },
  { label: 'Beauty Video Ads', path: '/beauty-video-ads' },
  { label: 'Fashion Video Ads', path: '/fashion-video-ads' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPath = '/',
  onOpenInquiry,
  onOpenAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const normalizedCurrent = normalizePathname(currentPath);

  const navLinks = [
    { label: 'Home', path: '/', hash: '' },
    { label: 'Portfolio', path: '/portfolio', hash: '' },
    { label: 'Pricing', path: '/', hash: 'pricing' },
    { label: 'About', path: '/about', hash: '' },
    { label: 'FAQ', path: '/', hash: 'faq' },
    { label: 'Contact', path: '/contact', hash: '' },
  ];

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
    hash?: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    navigateToPath(path, hash || undefined);
  };

  const handleCtaClick = () => {
    setMobileMenuOpen(false);
    if (onOpenInquiry) {
      onOpenInquiry();
    } else {
      navigateToPath('/contact');
    }
  };

  const handleAdminClick = () => {
    setMobileMenuOpen(false);
    if (onOpenAdmin) onOpenAdmin();
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#090A0B]/90 backdrop-blur-md border-b border-[#2A332B] py-3 shadow-lg shadow-black/40'
            : 'bg-[#090A0B]/60 backdrop-blur-sm border-b border-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 sm:gap-8">
            {/* Zone 1: Brand Wordmark / SVG Logo */}
            <div className="shrink-0">
              <Logo size="sm" showSubtitle={true} />
            </div>

            {/* Zone 2: Navigation Links + Specialized Services Dropdown */}
            <nav
              aria-label="Primary navigation"
              className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs xl:text-sm font-medium text-[#A0A89F]"
            >
              {navLinks.slice(0, 2).map((link) => {
                const isActive = !link.hash && normalizedCurrent === link.path;
                return (
                  <a
                    key={link.label}
                    href={link.hash ? `/#${link.hash}` : link.path}
                    onClick={(e) => handleLinkClick(e, link.path, link.hash)}
                    className={`whitespace-nowrap shrink-0 transition-colors duration-200 py-1 relative group ${
                      isActive ? 'text-[#C7F36B]' : 'hover:text-[#F5F5F0]'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#C7F36B] transition-all duration-200 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </a>
                );
              })}

              {/* Services Dropdown for Crawlers & Users */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setServicesDropdownOpen((prev) => !prev)}
                  aria-expanded={servicesDropdownOpen}
                  className={`whitespace-nowrap shrink-0 transition-colors duration-200 py-1 inline-flex items-center gap-1 cursor-pointer ${
                    SERVICE_SUBLINKS.some((s) => s.path === normalizedCurrent)
                      ? 'text-[#C7F36B]'
                      : 'hover:text-[#F5F5F0]'
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      servicesDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {servicesDropdownOpen && (
                  <div className="absolute left-0 top-full pt-2 w-60 z-50">
                    <div className="bg-[#111514] border border-[#2A332B] rounded-xl p-2 shadow-2xl space-y-0.5">
                      {SERVICE_SUBLINKS.map((sub) => (
                        <a
                          key={sub.path}
                          href={sub.path}
                          onClick={(e) => handleLinkClick(e, sub.path)}
                          className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            normalizedCurrent === sub.path
                              ? 'bg-[#C7F36B]/15 text-[#C7F36B] font-semibold'
                              : 'text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19]'
                          }`}
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {navLinks.slice(2).map((link) => {
                const isActive = !link.hash && normalizedCurrent === link.path;
                return (
                  <a
                    key={link.label}
                    href={link.hash ? `/#${link.hash}` : link.path}
                    onClick={(e) => handleLinkClick(e, link.path, link.hash)}
                    className={`whitespace-nowrap shrink-0 transition-colors duration-200 py-1 relative group ${
                      isActive ? 'text-[#C7F36B]' : 'hover:text-[#F5F5F0]'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#C7F36B] transition-all duration-200 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </a>
                );
              })}
            </nav>

            {/* Zone 3: 1 Primary Action + Quick Admin link */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              {onOpenAdmin && (
                <button
                  onClick={handleAdminClick}
                  className="px-2.5 py-1.5 text-[11px] font-mono text-[#A0A89F] hover:text-[#C7F36B] border border-[#2A332B] hover:border-[#C7F36B]/40 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  title="Open Admin Video Manager"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin</span>
                </button>
              )}

              <button
                onClick={handleCtaClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] active:scale-[0.98] rounded-md transition-all duration-200 shadow-sm shadow-[#C7F36B]/20 whitespace-nowrap cursor-pointer min-h-[36px]"
              >
                <span>Hire Me</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Menu Button - min touch target 44px */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="min-w-[44px] min-h-[44px] p-2.5 text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#171C19] border border-[#2A332B] rounded-md transition-colors flex items-center justify-center cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-[#090A0B]/95 backdrop-blur-lg pt-20 pb-8 px-6 flex flex-col justify-between overflow-y-auto">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1 mt-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.hash ? `/#${link.hash}` : link.path}
                onClick={(e) => handleLinkClick(e, link.path, link.hash)}
                className="text-base font-heading font-semibold text-[#F5F5F0] hover:text-[#C7F36B] py-3 border-b border-[#2A332B]/60 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-4 h-4 text-[#A0A89F]" />
              </a>
            ))}

            <div className="pt-3 pb-1 text-[11px] font-mono uppercase tracking-wider text-[#C7F36B]">
              Specialized Services
            </div>
            {SERVICE_SUBLINKS.map((sub) => (
              <a
                key={sub.path}
                href={sub.path}
                onClick={(e) => handleLinkClick(e, sub.path)}
                className="text-sm font-heading font-medium text-[#A0A89F] hover:text-[#C7F36B] py-2.5 pl-3 border-b border-[#2A332B]/40 transition-colors flex items-center justify-between"
              >
                <span>{sub.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ))}

            {onOpenAdmin && (
              <button
                onClick={handleAdminClick}
                className="text-base font-heading font-semibold text-[#C7F36B] py-3 border-b border-[#2A332B]/60 transition-colors flex items-center justify-between text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Admin Video Manager</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#C7F36B]" />
              </button>
            )}
          </nav>

          <div className="pt-6 space-y-4">
            <button
              onClick={handleCtaClick}
              className="w-full py-3.5 text-center text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <span>Hire Me</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <div className="text-xs text-[#A0A89F] text-center space-y-1.5 pt-2">
              <p>
                Email:{' '}
                <a href="mailto:hossenmeismail@gmail.com" className="text-[#F5F5F0]">
                  hossenmeismail@gmail.com
                </a>
              </p>
              <p>
                WhatsApp:{' '}
                <a href="https://wa.me/8801648861141" className="text-[#F5F5F0]">
                  +8801648861141
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
