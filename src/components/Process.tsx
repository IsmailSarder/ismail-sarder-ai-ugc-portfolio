import React from 'react';
import { Search, PenTool, Cpu, Film, Clock, CheckCircle } from 'lucide-react';

export const Process: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Product Research',
      subtitle: 'Angle Discovery & Review Mining',
      icon: Search,
      timeframe: 'Day 1',
      description: 'We analyze your product UVP, examine top-performing competitor creatives in your niche, and mine real customer reviews on Amazon/Shopify to extract the exact emotional vocabulary your buyers use.',
      deliverables: [
        'Competitor Creative Audit',
        'Customer Pain-Point & Review Extraction',
        'Target Demographic Persona Profile',
        'Primary & Contrarian Angle Selection',
      ],
    },
    {
      step: '02',
      title: 'Script & Hook Development',
      subtitle: 'Direct-Response Storyboarding',
      icon: PenTool,
      timeframe: 'Day 1 - 2',
      description: 'We construct word-for-word scripts designed to retain viewers past the 3-second mark. Every script is paired with 3 distinct hook variations (curiosity, problem-agitation, or contrarian) for multivariate testing.',
      deliverables: [
        '3-5 Testable Hook Variations',
        'Direct-Response Script Drafts',
        'Visual Shotlist & Text Overlay Guide',
        'Brand Sign-off & Refinement',
      ],
    },
    {
      step: '03',
      title: 'AI Video Production',
      subtitle: 'Photorealistic AI Persona Synthesis',
      icon: Cpu,
      timeframe: 'Day 2 - 3',
      description: 'Using advanced AI video rendering pipelines, we generate hyper-realistic creator personas with natural eye contact, realistic micro-expressions, authentic speech pacing, and flawless product demonstrations.',
      deliverables: [
        'Ultra-Realistic Creator Synthesis',
        'Natural Demographic Voice Generation',
        'Macro Product Integration Passes',
        'Native Mobile Smartphone Framing',
      ],
    },
    {
      step: '04',
      title: 'Editing & Delivery',
      subtitle: 'Sound Design, Captions & Final Cut',
      icon: Film,
      timeframe: 'Day 3 (48h Avg)',
      description: 'We finish the creatives with high-retention dynamic kinetic captions, professional sound effects, trend audio tracks, and native aspect ratio exports (9:16 vertical, 4:5 feed, 1:1 square).',
      deliverables: [
        'Burned-in High-Contrast Captions',
        'ASMR & Foley Sound Design',
        'Ready-to-Deploy Ad Master Files',
        '1 Round of Polish & Iteration Revisions',
      ],
    },
  ];

  return (
    <section id="process" className="py-20 lg:py-28 bg-[#090A0B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A0A89F] uppercase mb-2">
              <span>The Production System</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
              FROM BRIEF TO VIRAL ADS IN 4 STEPS.
            </h2>
          </div>

          <p className="text-sm text-[#A0A89F] max-w-md leading-relaxed">
            A battle-tested production pipeline delivering high-converting ad variations in days instead of weeks, with zero logistical friction.
          </p>
        </div>

        {/* 4 Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-[#171C19] border border-[#2A332B] rounded-xl p-6 flex flex-col justify-between hover:border-[#C7F36B]/50 transition-all duration-300 relative group"
              >
                <div>
                  {/* Top Step Index & Duration */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-extrabold font-heading text-[#C7F36B]">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-mono text-[#A0A89F] flex items-center gap-1 bg-[#111514] px-2.5 py-1 rounded border border-[#2A332B]">
                      <Clock className="w-3 h-3 text-[#C7F36B]" />
                      {item.timeframe}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-[#111514] text-[#C7F36B] border border-[#2A332B]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold font-heading text-[#F5F5F0] group-hover:text-[#C7F36B] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono text-[#A0A89F] block mb-4">
                    {item.subtitle}
                  </span>

                  <p className="text-xs text-[#A0A89F] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="pt-4 border-t border-[#2A332B] space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A0A89F] font-bold block mb-1">
                    Step Output
                  </span>
                  {item.deliverables.map((deliv) => (
                    <div key={deliv} className="text-[11px] text-[#F5F5F0] flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#C7F36B] shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

        {/* Turnaround Guarantee Banner */}
        <div className="mt-12 p-6 rounded-xl bg-[#111514] border border-[#2A332B] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#C7F36B]/10 border border-[#C7F36B]/30 flex items-center justify-center shrink-0 text-[#C7F36B]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-heading text-[#F5F5F0]">
                Average Turnaround: 48 to 72 Hours
              </h4>
              <p className="text-xs text-[#A0A89F]">
                Fast creative iterations allow your media buying team to beat ad fatigue and scale winning creatives without waiting for physical shipments.
              </p>
            </div>
          </div>

          <a
            href="#contact"
            className="px-5 py-2.5 text-xs font-bold font-heading uppercase tracking-wider text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-all whitespace-nowrap"
          >
            Submit Creative Brief
          </a>
        </div>

      </div>
    </section>
  );
};
