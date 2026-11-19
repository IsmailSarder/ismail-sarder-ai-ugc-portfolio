import React from 'react';
import {
  MessageSquare,
  Search,
  PenTool,
  Cpu,
  Film,
  CheckCircle,
  Clock,
} from 'lucide-react';

export const Process: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Discovery & Brand Brief',
      subtitle: 'Product Goals & Asset Intake',
      icon: MessageSquare,
      timeframe: 'Step 1',
      description:
        'You share your product link, high-resolution product photos, target country (USA, UK, UAE, Canada, or Europe), and preferred ad format or package.',
      deliverables: [
        'Product & Offer Alignment',
        'Platform & Aspect Ratio Plan',
      ],
    },
    {
      step: '02',
      title: 'Audience & Angle Research',
      subtitle: 'Pain Points & Value Framing',
      icon: Search,
      timeframe: 'Step 2',
      description:
        'I review your customer objections, category positioning, and product benefits to pick the strongest creative angles for cold social traffic.',
      deliverables: [
        'Primary Buying Trigger',
        'Creative Concept Direction',
      ],
    },
    {
      step: '03',
      title: 'Hook & Script Writing',
      subtitle: 'First 3-Second Retention',
      icon: PenTool,
      timeframe: 'Step 3',
      description:
        'Writing a concise, conversational direct-response script paired with testable opening hooks designed to stop scrolling immediately.',
      deliverables: [
        'Opening Hook Options',
        'Structured Voiceover Script',
      ],
    },
    {
      step: '04',
      title: 'AI Video & CGI Production',
      subtitle: 'Creator & Visual Synthesis',
      icon: Cpu,
      timeframe: 'Step 4',
      description:
        'Producing realistic AI spokesperson scenes, product demonstrations, or 3D CGI visuals calibrated for your brand look and audience demographic.',
      deliverables: [
        'AI Creator or CGI Scenes',
        'Product Showcase Shots',
      ],
    },
    {
      step: '05',
      title: 'Editing, Captions & Audio',
      subtitle: 'Sound Design & Pacing',
      icon: Film,
      timeframe: 'Step 5',
      description:
        'Assembling tight rhythm-synced edits with burned-in readable captions, clean SFX, balanced voiceover, and music matched to social feeds.',
      deliverables: [
        'Dynamic Kinetic Captions',
        'Balanced Voice & Music Mix',
      ],
    },
    {
      step: '06',
      title: 'Delivery & Revisions',
      subtitle: 'Multi-Ratio Launch Readiness',
      icon: CheckCircle,
      timeframe: 'Step 6',
      description:
        'Exporting final master videos in your requested aspect ratios with included revisions so your media buyers can launch with confidence.',
      deliverables: [
        'Platform-Ready Master Files',
        'Included Polish Revisions',
      ],
    },
  ];

  return (
    <section id="process" className="py-20 lg:py-28 bg-[#090A0B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-16 gap-6">
          <div>
            <span className="text-xs font-mono font-semibold tracking-wider text-[#C7F36B] uppercase block mb-2">
              Creative Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
              MY CREATIVE PROCESS IN 6 STEPS.
            </h2>
          </div>

          <p className="text-sm text-[#A0A89F] max-w-md leading-relaxed">
            A clear, collaborative six-stage workflow moving smoothly from product brief to launch-ready video ads in days.
          </p>
        </div>

        {/* 6 Process Steps Grid (3x2 on desktop, 2x3 on tablet, 1-col on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-[#171C19] border border-[#2A332B] rounded-xl p-6 flex flex-col justify-between hover:border-[#C7F36B]/50 transition-all duration-300 relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-extrabold font-heading text-[#C7F36B] tabular-nums">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-mono text-[#A0A89F] bg-[#111514] px-2.5 py-1 rounded border border-[#2A332B]">
                      {item.timeframe}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-[#111514] text-[#C7F36B] border border-[#2A332B]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold font-heading text-[#F5F5F0] group-hover:text-[#C7F36B] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono text-[#A0A89F] block mb-3">
                    {item.subtitle}
                  </span>

                  <p className="text-xs sm:text-sm text-[#A0A89F] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2A332B] space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A0A89F] font-bold block mb-1">
                    Stage Output
                  </span>
                  {item.deliverables.map((deliv) => (
                    <div key={deliv} className="text-xs text-[#F5F5F0] flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#C7F36B] shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Turnaround CTA Banner */}
        <div className="mt-12 p-6 rounded-xl bg-[#111514] border border-[#2A332B] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#C7F36B]/10 border border-[#C7F36B]/30 flex items-center justify-center shrink-0 text-[#C7F36B]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-heading text-[#F5F5F0]">
                Realistic Delivery: 1–4 Days (AI UGC) · 2–8 Days (CGI &amp; Commercials)
              </h4>
              <p className="text-xs text-[#A0A89F]">
                Launch creative tests quickly without physical product shipping delays.
              </p>
            </div>
          </div>

          <a
            href="#contact"
            className="px-5 py-2.5 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all whitespace-nowrap min-h-[42px] inline-flex items-center"
          >
            Start Your Brief
          </a>
        </div>
      </div>
    </section>
  );
};
