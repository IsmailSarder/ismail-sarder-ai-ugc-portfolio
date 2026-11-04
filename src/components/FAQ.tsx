import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowUpRight } from 'lucide-react';

interface FAQProps {
  onOpenInquiry?: () => void;
}

export const FAQ: React.FC<FAQProps> = ({ onOpenInquiry }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is an AI UGC video ad and how does it compare to traditional filming?',
      answer:
        'AI UGC (User-Generated Content) combines high-fidelity AI-generated video creators, lifelike speech models, and cinematic product b-roll to create authentic, relatable video ads. Unlike traditional filming—which requires physical sample shipments, talent contracts, studio rentals, and 3-4 week delays—AI UGC allows brands to test multiple creator demographics, accents, and visual hooks within 48 to 72 hours at a fraction of the cost.',
    },
    {
      question: 'Are the portfolio projects on this website live client campaigns or concept demonstrations?',
      answer:
        'The portfolio pieces showcased here are self-developed spec concepts and creative benchmarks created by Ismail Sarder. They demonstrate my creative copywriting, hook formulation, AI video persona synthesis, macro product staging, and post-production capabilities. For live client work where non-disclosure agreements (NDAs) are in place, performance metrics and creative assets are kept confidential to protect client ad strategy.',
    },
    {
      question: 'What do I need to provide to start a project?',
      answer:
        'Getting started is straightforward: provide your product website link, primary customer pain points, key benefits, and high-resolution product photos (or packshots) on neutral or transparent backgrounds. If you have existing customer review highlights or winning angle hypotheses, those can be incorporated into the hook strategy.',
    },
    {
      question: 'What is your typical production turnaround?',
      answer:
        'Standard creative batches (3 hook variations + direct response body + CTA) are delivered within 48 to 72 hours from the moment the script and creative brief are approved. Rapid iterations and headline refreshes can be turned around within 24 to 48 hours to prevent creative ad fatigue on Meta and TikTok.',
    },
    {
      question: 'What video formats, resolutions, and deliverables are included?',
      answer:
        'All deliverables are rendered in native 4K 60FPS or 1080p 60FPS. Master files are supplied in 9:16 vertical (for TikTok, Instagram Reels, YouTube Shorts), with 4:5 or 1:1 cutdowns available for Meta Feeds. Deliverables include burned-in kinetic typography captions formatted above platform UI elements, as well as clean caption-free masters.',
    },
    {
      question: 'How do revisions work if we need adjustments?',
      answer:
        'Every project includes one comprehensive round of revisions following initial delivery. You can request adjustments to pacing, caption styling, voiceover tone, background music tracks, or on-screen product highlights.',
    },
    {
      question: 'Does my brand retain full commercial usage rights?',
      answer:
        'Yes. Upon final delivery and payment, you receive 100% full commercial rights to deploy, edit, and scale the delivered video creatives across all paid advertising platforms (Meta, TikTok, Google Demand Gen, Pinterest, Amazon PDP) worldwide with zero recurring royalty fees.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-28 bg-[#090A0B] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A0A89F] uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7F36B]" />
            <span>Clear Answers & Process Clarifications</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
            FREQUENTLY ASKED QUESTIONS.
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A89F] max-w-xl mx-auto mt-3 leading-relaxed">
            Everything you need to know about AI UGC production workflows, licensing rights, timelines, and concept deliverables.
          </p>
        </div>

        {/* Accordion Container */}
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

        {/* Still have questions banner */}
        <div className="mt-12 p-6 rounded-xl bg-[#111514] border border-[#2A332B] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#090A0B] text-[#C7F36B] border border-[#2A332B] shrink-0 hidden sm:block">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-heading text-[#F5F5F0]">
                Have a unique product or custom requirement?
              </h4>
              <p className="text-xs text-[#A0A89F] mt-0.5">
                Reach out on WhatsApp or submit a brief to get a custom creative evaluation.
              </p>
            </div>
          </div>

          <a
            href="#contact"
            onClick={onOpenInquiry}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Ask a Question</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
