/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { IntroVideoSection } from './components/IntroVideoSection.tsx';
import { CombinedServiceSection } from './components/CombinedServiceSection.tsx';
import { Portfolio, PortfolioRef } from './components/Portfolio.tsx';
import { CgiPortfolio } from './components/CgiPortfolio.tsx';
import { Services } from './components/Services.tsx';
import { Pricing } from './components/Pricing.tsx';
import { About } from './components/About.tsx';
import { Process } from './components/Process.tsx';
import { WhyWorkWithMe } from './components/WhyWorkWithMe.tsx';
import { WhatClientsReceive } from './components/WhatClientsReceive.tsx';
import { FAQ, HOMEPAGE_FAQS } from './components/FAQ.tsx';
import { SpecializedPagesHub } from './components/SpecializedPagesHub.tsx';
import { Contact, ContactRef } from './components/Contact.tsx';
import { Footer } from './components/Footer.tsx';
import { WhatsAppButton } from './components/WhatsAppButton.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ProfileProvider } from './context/ProfileContext.tsx';
import {
  applyRouteSeo,
  isKnownRoute,
  navigateToPath,
  normalizePathname,
} from './lib/seo.ts';
import { SERVICE_LANDING_PAGES } from './data/landingPagesData.ts';

// Code-split admin portal and dedicated SEO route views to minimize initial JS payload
const AdminDashboard = lazy(() =>
  import('./admin/AdminDashboard.tsx').then((m) => ({ default: m.AdminDashboard }))
);
const AdminLogin = lazy(() =>
  import('./admin/AdminLogin.tsx').then((m) => ({ default: m.AdminLogin }))
);
const ServiceLandingPage = lazy(() =>
  import('./pages/ServiceLandingPage.tsx').then((m) => ({ default: m.ServiceLandingPage }))
);
const PortfolioPage = lazy(() =>
  import('./pages/PortfolioPage.tsx').then((m) => ({ default: m.PortfolioPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage.tsx').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage.tsx').then((m) => ({ default: m.ContactPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage.tsx').then((m) => ({ default: m.NotFoundPage }))
);

function RouteLoadingFallback() {
  return (
    <div className="min-h-[60vh] bg-[#090A0B] flex items-center justify-center pt-24">
      <div className="w-7 h-7 border-2 border-[#C7F36B] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function MainApp() {
  const contactRef = useRef<ContactRef>(null);
  const portfolioRef = useRef<PortfolioRef>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [pendingService, setPendingService] = useState<string | undefined>(undefined);
  const [currentPath, setCurrentPath] = useState<string>(() =>
    typeof window !== 'undefined' ? normalizePathname(window.location.pathname) : '/'
  );

  // Listen to browser navigation & custom SPA navigation events
  useEffect(() => {
    const syncPath = () => {
      setCurrentPath(normalizePathname(window.location.pathname));
    };

    const handleCustomNavigate = (e: Event) => {
      const detail = (e as CustomEvent<{ path?: string }>).detail;
      if (detail?.path) {
        setCurrentPath(normalizePathname(detail.path));
      } else {
        syncPath();
      }
    };

    window.addEventListener('popstate', syncPath);
    window.addEventListener('app:navigate', handleCustomNavigate);
    return () => {
      window.removeEventListener('popstate', syncPath);
      window.removeEventListener('app:navigate', handleCustomNavigate);
    };
  }, []);

  // Apply SEO metadata, canonical URL, Open Graph, Twitter Card & Schema.org JSON-LD per route
  useEffect(() => {
    const serviceData = SERVICE_LANDING_PAGES[currentPath];
    const faqs = serviceData
      ? serviceData.faqs
      : currentPath === '/'
      ? HOMEPAGE_FAQS
      : undefined;
    applyRouteSeo(currentPath, faqs);
  }, [currentPath]);

  // Handle initial hash scrolling when landing on /#section
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash && hash !== '#admin') {
      const targetId = hash.replace(/^#/, '');
      const timer = setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentPath]);

  // Check URL hash for direct #admin access
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleOpenInquiry = (serviceName?: string) => {
    if (serviceName) {
      setPendingService(serviceName);
    }
    if (currentPath !== '/' && currentPath !== '/contact') {
      navigateToPath('/contact');
      setTimeout(() => {
        if (serviceName && contactRef.current) {
          contactRef.current.setService(serviceName);
        }
      }, 150);
      return;
    }

    if (serviceName && contactRef.current) {
      contactRef.current.setService(serviceName);
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenInquiryWithPackage = (packageName: string, isNegotiation?: boolean) => {
    if (currentPath !== '/' && currentPath !== '/contact') {
      navigateToPath('/contact');
      setTimeout(() => {
        contactRef.current?.setPackageInterest(packageName, isNegotiation);
      }, 150);
      return;
    }
    if (contactRef.current) {
      contactRef.current.setPackageInterest(packageName, isNegotiation);
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenInquiryWithProject = (projectTitle: string) => {
    if (currentPath !== '/' && currentPath !== '/contact') {
      navigateToPath('/contact');
      setTimeout(() => {
        contactRef.current?.setProjectInterest(projectTitle);
      }, 180);
      return;
    }
    if (contactRef.current) {
      contactRef.current.setProjectInterest(projectTitle);
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
    setIsAdminOpen(true);
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin') {
      history.pushState(null, '', window.location.pathname);
    }
    setRefreshTrigger((prev) => prev + 1);
  };

  if (isAdminOpen) {
    return (
      <Suspense fallback={<RouteLoadingFallback />}>
        {user ? (
          <AdminDashboard onBackToHome={handleCloseAdmin} />
        ) : (
          <AdminLogin onBackToHome={handleCloseAdmin} />
        )}
      </Suspense>
    );
  }

  const servicePageContent = SERVICE_LANDING_PAGES[currentPath];
  const known = isKnownRoute(currentPath);

  return (
    <div className="min-h-screen bg-[#090A0B] text-[#F5F5F0] flex flex-col selection:bg-[#C7F36B] selection:text-[#090A0B]">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[#C7F36B] focus:text-[#090A0B] focus:font-bold focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Sticky Header Navigation */}
      <Navbar
        currentPath={currentPath}
        onOpenInquiry={() => handleOpenInquiry()}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Route View Switcher */}
      <main id="main-content" className="flex-1">
        {currentPath === '/' ? (
          <>
            <Hero onOpenInquiry={() => handleOpenInquiry()} />
            <IntroVideoSection refreshTrigger={refreshTrigger} />
            <CombinedServiceSection
              onExploreCategory={(cat) => {
                if (cat === 'CGI Product Ads') {
                  document
                    .getElementById('cgi-portfolio')
                    ?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  portfolioRef.current?.setCategory(cat);
                }
              }}
            />
            <Portfolio
              ref={portfolioRef}
              onOpenInquiryWithProject={handleOpenInquiryWithProject}
              refreshTrigger={refreshTrigger}
            />
            <CgiPortfolio
              onOpenInquiryWithProject={handleOpenInquiryWithProject}
              onSelectService={(srv) => handleOpenInquiry(srv)}
              refreshTrigger={refreshTrigger}
            />
            <Services onSelectService={(srv) => handleOpenInquiry(srv)} />
            <Pricing onSelectPackage={handleOpenInquiryWithPackage} />
            <About onOpenInquiry={() => handleOpenInquiry()} />
            <Process />
            <WhyWorkWithMe />
            <WhatClientsReceive onOpenInquiry={() => handleOpenInquiry()} />
            <FAQ onOpenInquiry={() => handleOpenInquiry()} />
            <SpecializedPagesHub />
            <Contact ref={contactRef} initialService={pendingService} />
          </>
        ) : servicePageContent ? (
          <Suspense fallback={<RouteLoadingFallback />}>
            <ServiceLandingPage
              content={servicePageContent}
              onBookService={(srv) => handleOpenInquiry(srv)}
              refreshTrigger={refreshTrigger}
            />
          </Suspense>
        ) : currentPath === '/portfolio' ? (
          <Suspense fallback={<RouteLoadingFallback />}>
            <PortfolioPage
              onOpenInquiryWithProject={handleOpenInquiryWithProject}
              onSelectService={(srv) => handleOpenInquiry(srv)}
              refreshTrigger={refreshTrigger}
            />
          </Suspense>
        ) : currentPath === '/about' ? (
          <Suspense fallback={<RouteLoadingFallback />}>
            <AboutPage onOpenInquiry={() => handleOpenInquiry()} />
          </Suspense>
        ) : currentPath === '/contact' ? (
          <Suspense fallback={<RouteLoadingFallback />}>
            <ContactPage
              contactRef={contactRef}
              initialService={pendingService}
              onSelectPackage={handleOpenInquiryWithPackage}
            />
          </Suspense>
        ) : !known ? (
          <Suspense fallback={<RouteLoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        ) : null}
      </main>

      {/* Floating Direct WhatsApp Action */}
      <WhatsAppButton />

      {/* Footer with Internal SEO Links & Admin Portal trigger */}
      <Footer onOpenAdmin={handleOpenAdmin} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <MainApp />
      </ProfileProvider>
    </AuthProvider>
  );
}
