import React, { useState, useEffect } from 'react';
import { Logo } from './Logo.tsx';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenInquiry?: (serviceName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInquiry }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
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

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Process', href: '#process' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const handleCtaClick = () => {
    setMobileMenuOpen(false);
    if (onOpenInquiry) {
      onOpenInquiry();
    } else {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
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
          {/* Strictly 3-Zone Top Bar Contract */}
          <div className="flex items-center justify-between gap-4 sm:gap-8">
            {/* Zone 1: Brand Wordmark / SVG Logo */}
            <div className="shrink-0">
              <Logo size="sm" showSubtitle={true} />
            </div>

            {/* Zone 2: Navigation Links (single line, unboxed, subtle hover) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs xl:text-sm font-medium text-[#A0A89F]">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="whitespace-nowrap shrink-0 hover:text-[#F5F5F0] transition-colors duration-200 py-1 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C7F36B] transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Zone 3: 1 Primary Action */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <button
                onClick={handleCtaClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] active:scale-[0.98] rounded-md transition-all duration-200 shadow-sm shadow-[#C7F36B]/20 whitespace-nowrap cursor-pointer min-h-[36px]"
              >
                <span>Let&apos;s Work Together</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Menu Button - min touch target 44px */}
            <div className="flex sm:hidden items-center">
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
          <nav className="flex flex-col gap-1 mt-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={handleLinkClick}
                className="text-base font-heading font-semibold text-[#F5F5F0] hover:text-[#C7F36B] py-3 border-b border-[#2A332B]/60 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-4 h-4 text-[#A0A89F]" />
              </a>
            ))}
          </nav>

          <div className="pt-6 space-y-4">
            <button
              onClick={handleCtaClick}
              className="w-full py-3.5 text-center text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <span>Let&apos;s Work Together</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <div className="text-xs text-[#A0A89F] text-center space-y-1.5 pt-2">
              <p>Email: <a href="mailto:hossenmeismail@gmail.com" className="text-[#F5F5F0]">hossenmeismail@gmail.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/8801648861141" className="text-[#F5F5F0]">+88 01648861141</a></p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
