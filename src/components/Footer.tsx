import React from 'react';
import { Logo } from './Logo.tsx';
import { Mail, MessageSquare, Linkedin, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Process', href: '#process' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  const industries = [
    'Skincare & Beauty',
    'Fashion & Lifestyle',
    'Gadgets & Tech',
    'E-commerce Products',
    'SaaS & Digital Apps',
  ];

  return (
    <footer className="bg-[#090A0B] border-t border-[#2A332B] pt-14 sm:pt-16 pb-12 text-[#A0A89F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#2A332B]">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <Logo size="md" showSubtitle={true} />
            <p className="text-xs sm:text-sm text-[#A0A89F] max-w-sm leading-relaxed mt-4">
              I help e-commerce brands create realistic AI-powered UGC video ads, product demonstrations, social media advertisements, and performance-focused creative content.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/8801648861141"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#111514] border border-[#2A332B] text-[#A0A89F] hover:text-[#C7F36B] hover:border-[#C7F36B]/50 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="WhatsApp: +88 01648861141"
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
                    href={item.href}
                    className="hover:text-[#F5F5F0] transition-colors hover:underline underline-offset-4 py-0.5 inline-block"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Target Industries */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F5F5F0] font-semibold block">
              Industries
            </span>
            <ul className="space-y-2 text-xs">
              {industries.map((ind) => (
                <li key={ind} className="text-[#A0A89F] py-0.5">
                  {ind}
                </li>
              ))}
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
                  +88 01648861141
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
                  in/ismail-sarder
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-[#A0A89F] text-center sm:text-left">
            © {new Date().getFullYear()} Ismail Sarder. AI UGC Creative Studio. Spec demonstration portfolio.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-[11px] font-mono text-[#A0A89F] hidden md:inline">
              SERVICING USA · UK · UAE · CA · AU · EU
            </span>

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
