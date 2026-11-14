import React, { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Search, X } from 'lucide-react';
import { VideoModal, PortfolioItem } from './VideoModal.tsx';
import { ProjectCard3D } from './ProjectCard3D.tsx';
import { FeaturedShowcase } from './FeaturedShowcase.tsx';
import { portfolioService } from '../lib/portfolioService.ts';
import {
  heroUgcBeauty,
  portfolioSkincare,
  portfolioTech,
  portfolioFashion,
} from '../assets/images.ts';

export interface PortfolioRef {
  setCategory: (category: string) => void;
}

interface PortfolioProps {
  onOpenInquiryWithProject?: (projectTitle: string) => void;
  refreshTrigger?: number;
}

export const Portfolio = forwardRef<PortfolioRef, PortfolioProps>(
  ({ onOpenInquiryWithProject, refreshTrigger }, ref) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All Projects');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);

    useImperativeHandle(ref, () => ({
      setCategory: (category: string) => {
        setSelectedCategory(category);
        setSearchQuery('');
        const el = document.getElementById('portfolio');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      },
    }));

    const categories = [
      'All Projects',
      'AI UGC Ads',
      'AI Video Ads',
      'Beauty & Skincare',
      'Fashion & Lifestyle',
      'Gadgets & Technology',
      'Product Demonstrations',
    ];

    const INITIAL_PROJECTS: PortfolioItem[] = [
      {
        id: 'aurelia-serum',
        title: 'Aurelia Botanica — Dewy Skin Viral Hook',
        category: 'Beauty & Skincare',
        serviceType: 'AI UGC Ads',
        duration: '0:28',
        format: '9:16 Vertical Video',
        thumbnail: heroUgcBeauty,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        aspect_ratio: '9:16',
        aspectRatio: '9:16',
        video_width: 1080,
        video_height: 1920,
        video_mime_type: 'video/mp4',
        hook: 'Wait, this glow without a 10-step routine? Honestly obsessed...',
        angle: 'Relatable Problem-to-Solution',
        isConcept: true,
        overview:
          'High-converting TikTok and Instagram Reels AI UGC ad creative engineered for a luxury botanical skincare brand targeting female demographics aged 22-38.',
        scriptBreakdown: {
          hook: 'Close-up camera tap, unfiltered morning natural skin, unexpected opening statement cutting through skincare skepticism.',
          agitation: 'Calling out the exhausting 10-step glass skin routine that clogs pores and wastes money monthly.',
          demonstration: 'Texture application demonstration showing immediate hydration sheen with zero sticky residue.',
          cta: 'Limited first-batch 20% discount offer with direct link in bio.',
        },
        keyFeatures: [
          '3 Alternative Hook Openings',
          'Burned-in Dynamic Kinetic Captions',
          'TikTok & Reels Sound Optimized',
          '9:16 + 4:5 Feed Master Deliverables',
        ],
        targetMarket: 'USA & United Kingdom',
      },
      {
        id: 'botanica-macro-demo',
        title: 'Botanica Facial Illumination — Macro Product Commercial',
        category: 'Product Demonstrations',
        serviceType: 'AI Video Ads',
        duration: '0:22',
        format: '4:5 Feed & 9:16 Story',
        thumbnail: portfolioSkincare,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        aspect_ratio: '4:5',
        aspectRatio: '4:5',
        video_width: 1080,
        video_height: 1350,
        video_mime_type: 'video/mp4',
        hook: 'Watch what happens when cold-pressed botanicals touch dehydrated skin...',
        angle: 'Sensory ASMR & Texture Proof',
        isConcept: true,
        overview:
          'Cinematic AI product commercial highlighting active ingredients, viscosity, and instant epidermal absorption with studio-grade lighting.',
        scriptBreakdown: {
          hook: 'Slow-motion macro droplet suspension with crisp ASMR dropper sound.',
          agitation: 'Why standard water-based moisturizers evaporate within 40 minutes.',
          demonstration: 'Split-screen hydration meter demonstration and cellular barrier simulation.',
          cta: 'Claim clinical trial kit before current batch sells out.',
        },
        keyFeatures: [
          'Macro Texture Cinematography',
          'Cellular Absorption Simulation',
          'Clean Studio Travertine Staging',
          'High-Retention Sound Design',
        ],
        targetMarket: 'USA, UAE & Canada',
      },
      {
        id: 'elara-anc-headphones',
        title: 'Elara ANC Pro — Commuter Noise-Cancellation Commercial',
        category: 'Gadgets & Technology',
        serviceType: 'AI Video Ads',
        duration: '0:34',
        format: '16:9 Landscape & 9:16 Feed',
        thumbnail: portfolioTech,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        aspect_ratio: '16:9',
        aspectRatio: '16:9',
        video_width: 1920,
        video_height: 1080,
        video_mime_type: 'video/mp4',
        hook: 'I tested these on the London Tube and my entire brain went quiet...',
        angle: 'Real-World Commute Stress Test',
        isConcept: true,
        overview:
          'Dynamic AI product showcase & unboxing commercial engineered for Meta Ads and YouTube Shorts with dramatic sound contrast.',
        scriptBreakdown: {
          hook: 'Loud screeching subway background instantly cuts to absolute studio silence upon placing headphones on ears.',
          agitation: 'Tired of overpaying $400 for bulky plastic headphones with 4-hour battery life.',
          demonstration: 'Tap-to-transparency mode switch, industrial matte build showcase, 60-hour battery stress test.',
          cta: 'Tap below to unlock 30-day risk-free commuter trial.',
        },
        keyFeatures: [
          'Binaural Sound Cut Pattern Interrupt',
          'Authentic Streetwear Tech Persona',
          'Exploded View Driver Architecture',
          'Direct Comparison vs Legacy Audio Brands',
        ],
        targetMarket: 'UK, Germany & Australia',
      },
      {
        id: 'nomad-atelier-trench',
        title: 'Nomad Atelier — Minimalist Capsule Wardrobe UGC',
        category: 'Fashion & Lifestyle',
        serviceType: 'AI UGC Ads',
        duration: '0:25',
        format: '9:16 TikTok / Reels',
        thumbnail: portfolioFashion,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        aspect_ratio: '9:16',
        aspectRatio: '9:16',
        video_width: 1080,
        video_height: 1920,
        video_mime_type: 'video/mp4',
        hook: 'Styling the one coat you will actually wear all week in 3 different ways...',
        angle: 'Capsule Wardrobe Utility & Fit',
        isConcept: true,
        overview:
          'High-fashion street aesthetic AI UGC showing movement, drape, water-resistance, and styling versatility for an apparel brand.',
        scriptBreakdown: {
          hook: 'Fast 1-second transitional fit snap in an architectural urban setting.',
          agitation: 'Fast fashion outerwear that falls apart after two rainstorms.',
          demonstration: '3 quick outfit swaps (casual denim, office tailoring, weekend travel) showing natural drape.',
          cta: 'Shop the Autumn capsule before restock waitlist closes.',
        },
        keyFeatures: [
          'Dynamic Motion Transitions',
          'Fabric Drape & Stitching Close-ups',
          'Natural Daylight Color Grading',
          'Multi-Angle Fit Verification',
        ],
        targetMarket: 'Europe, USA & Australia',
      },
      {
        id: 'founder-ugc-spokesperson',
        title: 'Founder Direct-to-Camera — AI Spokesperson UGC Ad',
        category: 'AI UGC Ads',
        serviceType: 'AI UGC Ads',
        duration: '0:30',
        format: '1:1 Square & 9:16 Feed',
        thumbnail: heroUgcBeauty,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        aspect_ratio: '1:1',
        aspectRatio: '1:1',
        video_width: 1080,
        video_height: 1080,
        video_mime_type: 'video/mp4',
        hook: 'Big skincare brands lied about why your pores stay enlarged...',
        angle: 'Contrarian Industry Whistleblower',
        isConcept: true,
        overview:
          'Hyper-realistic AI spokesperson UGC ad with authentic speech cadences, micro-expressions, and conversational direct-response structure.',
        scriptBreakdown: {
          hook: 'Contrarian question challenging common industry misconceptions with high authority tone.',
          agitation: 'Explaining the vicious cycle of stripping skin with harsh chemical washes.',
          demonstration: 'Presenting the pH-balanced biological formula with third-party lab proof.',
          cta: 'Exclusive 60-day money-back guarantee with order link below.',
        },
        keyFeatures: [
          '100% Natural Speech Synthesis',
          'Emotional Resonance Calibration',
          'Custom Scripting & Hook Matrix',
          'Burned-in Captions with Highlighted Keywords',
        ],
        targetMarket: 'USA, UK & Canada',
      },
      {
        id: 'kinetic-smart-ring',
        title: 'Kinetic Pulse — Smart Ring Product Ad',
        category: 'Gadgets & Technology',
        serviceType: 'AI Video Ads',
        duration: '0:26',
        format: '3:4 Portrait Video',
        thumbnail: portfolioTech,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        aspect_ratio: '3:4',
        aspectRatio: '3:4',
        video_width: 1080,
        video_height: 1440,
        video_mime_type: 'video/mp4',
        hook: 'Why I threw away my smart watch and switched to this titanium ring...',
        angle: 'Lifestyle Replacement & Freedom',
        isConcept: true,
        overview:
          'Targeted tech and wellness AI video ad demonstrating biocompatible titanium construction, biometric precision, and sleep tracking.',
        scriptBreakdown: {
          hook: 'Showing wrist indentation from bulky smartwatches before introducing the ultralight titanium ring.',
          agitation: 'Constantly charging watches every single night ruins sleep tracking.',
          demonstration: '7-day battery life, waterproof shower test, sync with real-time iOS app.',
          cta: 'Free sizing kit included with every early bird reservation.',
        },
        keyFeatures: [
          'Hardware Durability Demonstration',
          'App Interface Sync Integration',
          'Lifestyle Gym & Sleep Settings',
          '4 Testable Hook Variations',
        ],
        targetMarket: 'USA, UAE, Australia & UK',
      },
      {
        id: 'placeholder-beauty-commercial',
        title: 'Cinematic Beauty & Skincare Commercial (Placeholder Slot)',
        category: 'AI Video Ads',
        serviceType: 'AI Video Ads',
        isPlaceholder: true,
        duration: '0:24',
        format: '9:16 & 16:9 Commercial',
        thumbnail: portfolioSkincare,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        aspect_ratio: '4:5',
        aspectRatio: '4:5',
        video_width: 1080,
        video_height: 1350,
        video_mime_type: 'video/mp4',
        hook: 'Placeholder Slot — Replace via Admin Dashboard with your Beauty Commercial video.',
        angle: 'Cinematic Luxury Brand Commercial',
        isConcept: true,
        overview:
          'Placeholder slot for a cinematic AI Beauty & Skincare video advertisement showcasing elevated product lighting and brand identity.',
        keyFeatures: [
          'Cinematic Lighting & Transitions',
          'Premium Product Staging',
          'Replaceable via Admin Video Manager',
        ],
        targetMarket: 'Global E-commerce Brands',
      },
      {
        id: 'placeholder-fashion-campaign',
        title: 'AI Fashion & Lifestyle Campaign Film (Placeholder Slot)',
        category: 'AI Video Ads',
        serviceType: 'AI Video Ads',
        isPlaceholder: true,
        duration: '0:28',
        format: '9:16 Campaign Reel',
        thumbnail: portfolioFashion,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        aspect_ratio: '9:16',
        aspectRatio: '9:16',
        video_width: 1080,
        video_height: 1920,
        video_mime_type: 'video/mp4',
        hook: 'Placeholder Slot — Replace via Admin Dashboard with your Fashion & Lifestyle commercial.',
        angle: 'Editorial Lifestyle Showcase',
        isConcept: true,
        overview:
          'Placeholder slot for an AI Fashion & Lifestyle promotional campaign video highlighting aesthetic movement and visual storytelling.',
        keyFeatures: [
          'Editorial Motion Pacing',
          'Brand Storytelling Structure',
          'Replaceable via Admin Video Manager',
        ],
        targetMarket: 'Global Fashion & DTC Brands',
      },
    ];

    const [projects, setProjects] = useState<PortfolioItem[]>(INITIAL_PROJECTS);

    // Load published projects from Supabase whenever mounted or refreshed
    useEffect(() => {
      let isCurrent = true;
      portfolioService.getPublishedProjects().then(({ data }) => {
        if (isCurrent && data && data.length > 0) {
          const mappedItems: PortfolioItem[] = data.map((p) => {
            const derivedServiceType: 'AI UGC Ads' | 'AI Video Ads' =
              p.category === 'AI Video Ads' ||
              p.category === 'Product Demonstration' ||
              p.category === 'Product Demonstrations'
                ? 'AI Video Ads'
                : 'AI UGC Ads';

            return {
              id: p.id,
              title: p.title,
              category: p.category,
              serviceType: derivedServiceType,
              duration: p.duration || '0:30',
              format: p.format || '9:16 Vertical Video',
              thumbnail: p.thumbnail_url,
              video_url: p.video_url,
              videoUrl: p.video_url,
              aspect_ratio: p.aspect_ratio || 'auto',
              aspectRatio: p.aspect_ratio || 'auto',
              video_width: p.video_width,
              videoWidth: p.video_width,
              video_height: p.video_height,
              videoHeight: p.video_height,
              video_mime_type: p.video_mime_type,
              videoMimeType: p.video_mime_type,
              brand_name: p.brand_name,
              brandName: p.brand_name,
              hook: p.hook || p.title,
              angle: p.angle || p.category,
              overview: p.description,
              isConcept: !p.brand_name,
              targetMarket: 'USA & Global',
              keyFeatures: [
                '4K 60FPS Master Deliverable',
                'High-Converting Creative Hook',
                'Dynamic Kinetic Captions',
              ],
            };
          });
          setProjects(mappedItems);
        }
      });
      return () => {
        isCurrent = false;
      };
    }, [refreshTrigger]);

    // Search & Category Filtering
    const filteredProjects = useMemo(() => {
      return projects.filter((project) => {
        let matchesCategory = false;

        if (selectedCategory === 'All Projects') {
          matchesCategory = true;
        } else if (selectedCategory === 'AI UGC Ads') {
          matchesCategory =
            project.category === 'AI UGC Ads' ||
            project.category === 'AI UGC Creator Videos' ||
            project.serviceType === 'AI UGC Ads';
        } else if (selectedCategory === 'AI Video Ads') {
          matchesCategory =
            project.category === 'AI Video Ads' ||
            project.serviceType === 'AI Video Ads';
        } else if (selectedCategory === 'Product Demonstrations') {
          matchesCategory =
            project.category === 'Product Demonstrations' ||
            project.category === 'Product Demonstration';
        } else {
          matchesCategory = project.category === selectedCategory;
        }

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          q === '' ||
          project.title.toLowerCase().includes(q) ||
          project.category.toLowerCase().includes(q) ||
          (project.serviceType || '').toLowerCase().includes(q) ||
          (project.brandName || project.brand_name || '').toLowerCase().includes(q) ||
          (project.hook || '').toLowerCase().includes(q) ||
          (project.angle || '').toLowerCase().includes(q) ||
          (project.overview || '').toLowerCase().includes(q);

        return matchesCategory && matchesSearch;
      });
    }, [projects, selectedCategory, searchQuery]);

    const handleOrderSimilar = (title: string) => {
      if (onOpenInquiryWithProject) {
        onOpenInquiryWithProject(title);
      } else {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    const handleResetFilters = () => {
      setSelectedCategory('All Projects');
      setSearchQuery('');
    };

    return (
      <section
        id="portfolio"
        className="py-16 sm:py-20 lg:py-28 bg-[#111514] border-t border-b border-[#2A332B] relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A0A89F] uppercase mb-2">
                <span>AI UGC Ads &amp; AI Video Ads Portfolio</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F5F5F0] tracking-tight">
                FEATURED CREATIVE CONCEPTS.
              </h2>
            </div>

            <div className="max-w-md">
              <p className="text-xs sm:text-sm text-[#A0A89F] leading-relaxed">
                Explore authentic AI UGC creator videos and cinematic AI video advertisements engineered to stop scrolling and present your brand clearly.
              </p>
              <span className="text-[11px] font-mono text-[#A0A89F] block mt-1.5">
                Notice: Self-developed spec ad concepts &amp; replaceable slots demonstrating creative direction.
              </span>
            </div>
          </div>

          {/* 3D Animated Featured Showcase Carousel */}
          <FeaturedShowcase
            projects={projects}
            onSelectProject={(p) => setActiveModalItem(p)}
            onOrderSimilar={handleOrderSimilar}
          />

          {/* Search Bar & Category Controls Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 sm:mb-10">
            
            {/* Category Filter Segments */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 sm:px-4 py-2 text-xs font-medium font-heading rounded-md transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] flex items-center ${
                    selectedCategory === cat
                      ? 'bg-[#C7F36B] text-[#090A0B] font-bold shadow-sm shadow-[#C7F36B]/20'
                      : 'bg-[#171C19] text-[#A0A89F] hover:text-[#F5F5F0] hover:bg-[#1e2521] border border-[#2A332B]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Project Search Input */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 text-[#A0A89F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search concepts or categories..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-md bg-[#171C19] border border-[#2A332B] text-[#F5F5F0] placeholder-[#A0A89F]/60 focus:outline-none focus:border-[#C7F36B] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#A0A89F] hover:text-[#F5F5F0] cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

          {/* Zero Results State */}
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center bg-[#171C19] border border-[#2A332B] rounded-xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#111514] border border-[#2A332B] text-[#A0A89F] flex items-center justify-center mx-auto">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-[#F5F5F0]">
                  No concepts found matching &ldquo;{searchQuery || selectedCategory}&rdquo;
                </h3>
                <p className="text-xs text-[#A0A89F] mt-1">
                  Try switching categories or searching for &ldquo;AI UGC Ads&rdquo;, &ldquo;AI Video Ads&rdquo;, or &ldquo;skincare&rdquo;.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold text-[#090A0B] bg-[#C7F36B] hover:bg-[#d6ff7d] rounded-md transition-colors cursor-pointer"
              >
                Reset Search &amp; Filters
              </button>
            </div>
          ) : (
            /* 3D Interactive Portfolio Bento Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard3D
                  key={project.id}
                  project={project}
                  index={index}
                  onSelect={(p) => setActiveModalItem(p)}
                />
              ))}
            </div>
          )}

        </div>

        {/* Video Lightbox Modal */}
        {activeModalItem && (
          <VideoModal
            item={activeModalItem}
            onClose={() => setActiveModalItem(null)}
            onOrderSimilar={handleOrderSimilar}
          />
        )}
      </section>
    );
  }
);

Portfolio.displayName = 'Portfolio';
