import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowUpRight } from 'lucide-react';

interface FAQProps {
  onOpenInquiry?: () => void;
}

export const HOMEPAGE_FAQS = [
  {
    question: 'What is an AI UGC video ad and how does it compare to traditional filming?',
    answer:
      'AI UGC combines realistic AI-generated creators, natural speech delivery, and focused product visuals to produce relatable social media video ads. Instead of waiting 3–4 weeks to ship physical samples and book studio talent, brands can test new creative angles and spokesperson styles within 1 to 4 days.',
  },
  {
    question: 'What are your pricing tiers and introductory launch rates?',
    answer:
      'Introductory launch rates for the first 3–5 clients start at $25 for AI UGC Video Ads (Starter $25, Growth $55, Pro $99), $45 for AI CGI Product Ads (Starter $45, Growth $95, Pro $179), and $79 for AI Commercial Videos (Starter $79, Growth $149, Premium $299). Custom bundles and price negotiation are welcome.',
  },
  {
    question: 'Are the portfolio pieces Concept Projects or Client Projects?',
    answer:
      'Every case study in the portfolio is explicitly labeled as either a Concept Project (spec demonstrations built to showcase creative strategy, hooks, and visual quality) or a Client Project. You can also filter directly between Concept Projects and Client Projects inside the portfolio section.',
  },
  {
    question: 'What do I need to share to get started?',
    answer:
      'All I need to start is your product or store URL, clear high-resolution product photos, your target country (such as USA, UK, UAE, Canada, Australia, or Europe), and any key benefits or customer pain points you want highlighted.',
  },
  {
    question: 'How fast is delivery and do you work across international timezones?',
    answer:
      'Realistic delivery timelines match each service complexity: 1–4 days for AI UGC Video Ads, 2–7 days for AI CGI Product Ads, and 3–8 days for multi-scene AI Commercial Videos. I collaborate directly across EST, GMT, GST, AEST, and CET timezones via email and WhatsApp.',
  },
  {
    question: 'Which video aspect ratios and file formats are delivered?',
    answer:
      'Videos are exported in crisp HD / 4K MP4 tailored to your placements—9:16 vertical for TikTok, Instagram Reels, and YouTube Shorts, 4:5 or 1:1 for Meta Feed ads, and 16:9 widescreen for YouTube or hero web commercials.',
  },
  {
    question: 'Do I get full commercial rights and revisions?',
    answer:
      'Yes. Every completed order includes 1 to 3 revision rounds matched to your selected tier along with full commercial usage rights so you can run ads across Meta, TikTok, Google, and your online store without ongoing licensing fees.',
  },
];

export const FAQ: React.FC<FAQProps> = ({ onOpenInquiry }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = HOMEPAGE_FAQS;

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-28 bg-[#090A0B] border-t border-[#2A332B] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs font-mono font-semibold tracking-wider text-[#C7F36B] uppercase block mb-2">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
            CLEAR ANSWERS BEFORE YOU ORDER.
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A89F] max-w-xl mx-auto mt-3 leading-relaxed">
            Key details on production workflow, aspect ratios, pricing flexibility, revisions, and commercial rights.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="bg-[#171C19] border border-[#2A332B] rounded-xl overflow-hidden transition-colors duration-200"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C7F36B]"
                >
                  <span className="text-sm sm:text-base font-bold font-heading text-[#F5F5F0] pr-2">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-md bg-[#111514] text-[#C7F36B] border border-[#2A332B] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#C7F36B] text-[#090A0B]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-[#A0A89F] leading-relaxed border-t border-[#2A332B]/60 pt-3">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 p-6 rounded-xl bg-[#111514] border border-[#2A332B] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#090A0B] text-[#C7F36B] border border-[#2A332B] shrink-0 hidden sm:block">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-[#F5F5F0]">
                Have a custom brief or campaign question?
              </h3>
              <p className="text-xs text-[#A0A89F] mt-0.5">
                Message me directly on WhatsApp or send your brief below.
              </p>
            </div>
          </div>

          <a
            href="#contact"
            onClick={onOpenInquiry}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
