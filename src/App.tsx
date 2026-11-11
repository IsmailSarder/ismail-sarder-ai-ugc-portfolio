/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { Portfolio } from './components/Portfolio.tsx';
import { Services } from './components/Services.tsx';
import { About } from './components/About.tsx';
import { Process } from './components/Process.tsx';
import { WhyWorkWithMe } from './components/WhyWorkWithMe.tsx';
import { FAQ } from './components/FAQ.tsx';
import { Contact, ContactRef } from './components/Contact.tsx';
import { Footer } from './components/Footer.tsx';
import { WhatsAppButton } from './components/WhatsAppButton.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ProfileProvider } from './context/ProfileContext.tsx';
import { AdminDashboard } from './admin/AdminDashboard.tsx';
import { AdminLogin } from './admin/AdminLogin.tsx';

function MainApp() {
  const contactRef = useRef<ContactRef>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();
  const [isAdminOpen, setIsAdminOpen] = useState(false);

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
    if (serviceName && contactRef.current) {
      contactRef.current.setService(serviceName);
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenInquiryWithProject = (projectTitle: string) => {
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
    if (user) {
      return <AdminDashboard onBackToHome={handleCloseAdmin} />;
    }
    return <AdminLogin onBackToHome={handleCloseAdmin} />;
  }

  return (
    <div className="min-h-screen bg-[#090A0B] text-[#F5F5F0] flex flex-col selection:bg-[#C7F36B] selection:text-[#090A0B]">
      {/* Sticky Header Navigation */}
      <Navbar
        onOpenInquiry={() => handleOpenInquiry()}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenInquiry={() => handleOpenInquiry()} />

        {/* Featured Portfolio Section (Connected to Supabase) */}
        <Portfolio
          onOpenInquiryWithProject={handleOpenInquiryWithProject}
          refreshTrigger={refreshTrigger}
        />

        {/* Services Suite Section */}
        <Services onSelectService={(srv) => handleOpenInquiry(srv)} />

        {/* About Ismail Sarder Section */}
        <About onOpenInquiry={() => handleOpenInquiry()} />

        {/* 4-Step Creative Process Section */}
        <Process />

        {/* Why Work With Me Section */}
        <WhyWorkWithMe />

        {/* Frequently Asked Questions Accordion */}
        <FAQ onOpenInquiry={() => handleOpenInquiry()} />

        {/* Contact Section & Inquiry Form */}
        <Contact ref={contactRef} />
      </main>

      {/* Floating Direct WhatsApp Action */}
      <WhatsAppButton />

      {/* Footer with Admin Portal trigger */}
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
