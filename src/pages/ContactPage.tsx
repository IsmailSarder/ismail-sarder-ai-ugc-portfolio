import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs.tsx';
import { Pricing } from '../components/Pricing.tsx';
import { Contact, ContactRef } from '../components/Contact.tsx';
import { ROUTE_SEO_CONFIG } from '../lib/seo.ts';

interface ContactPageProps {
  contactRef: React.RefObject<ContactRef | null>;
  initialService?: string;
  onSelectPackage: (packageName: string, isNegotiation?: boolean) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  contactRef,
  initialService,
  onSelectPackage,
}) => {
  const seo = ROUTE_SEO_CONFIG['/contact'];

  return (
    <div className="pt-24 sm:pt-28 bg-[#090A0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <Breadcrumbs items={seo.breadcrumbs} />

        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C7F36B] block">
            Pricing &amp; Project Inquiry
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F5F5F0] tracking-tight leading-[1.08]">
            Hire Ismail Sarder for AI UGC &amp; Video Ads
          </h1>
          <p className="text-sm sm:text-base text-[#A0A89F] leading-relaxed">
            Review transparent starting packages ($39, $89, $179), propose a custom negotiated bundle, or submit your brand brief below. Fast international collaboration across EST, GMT, GST, and AEDT timezones.
          </p>
        </div>
      </div>

      <Pricing onSelectPackage={onSelectPackage} />
      <Contact ref={contactRef} initialService={initialService} />
    </div>
  );
};
