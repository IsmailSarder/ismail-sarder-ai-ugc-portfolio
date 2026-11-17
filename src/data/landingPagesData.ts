export interface LandingPageFaq {
  question: string;
  answer: string;
}

export interface LandingPageFeature {
  title: string;
  description: string;
}

export interface ServiceLandingPageContent {
  path: string;
  eyebrow: string;
  h1: string;
  lead: string;
  internationalNote: string;
  overviewTitle: string;
  overviewParagraphs: string[];
  featuresTitle: string;
  features: LandingPageFeature[];
  formats: {
    ratio: string;
    label: string;
    platforms: string;
  }[];
  portfolioFilterKeywords: string[];
  portfolioCategoryLabel: string;
  faqs: LandingPageFaq[];
  ctaHeadline: string;
  ctaDescription: string;
  inquiryServiceKey: string;
  relatedPages: {
    label: string;
    path: string;
    summary: string;
  }[];
}

export const SERVICE_LANDING_PAGES: Record<string, ServiceLandingPageContent> = {
  '/ai-ugc-video-ads': {
    path: '/ai-ugc-video-ads',
    eyebrow: 'Service · AI UGC Video Ads',
    h1: 'AI UGC Video Ads Creator for E-Commerce & DTC Brands',
    lead: 'Scroll-stopping AI UGC video ads scripted, produced, and formatted for TikTok, Instagram Reels, and Meta Ads without shipping inventory or waiting weeks for traditional creator turnarounds.',
    internationalNote:
      'Built for e-commerce and DTC marketing teams operating in the United States, United Kingdom, United Arab Emirates, Canada, Australia, and Europe.',
    overviewTitle: 'Native Social Creative Built to Hold Attention in the First 3 Seconds',
    overviewParagraphs: [
      'Paid social performance lives or dies on creative velocity. As an AI UGC Video Ads Creator, I produce relatable, direct-response video advertisements featuring realistic AI presenters, structured opening hooks, natural product demonstrations, and clear calls to action.',
      'Instead of waiting three to four weeks for physical shipping, studio scheduling, and creator reshoots, your brand receives ready-to-launch 9:16, 4:5, and 1:1 ad variations in 24 to 72 hours—allowing media buyers to test multiple hooks and problem-solution angles efficiently.',
    ],
    featuresTitle: 'What Every AI UGC Ad Package Includes',
    features: [
      {
        title: 'Direct-Response Hook & Script Strategy',
        description:
          'Opening lines engineered around buyer pain points, tactile product moments, or contrarian curiosity to earn the first 3 seconds of watch time.',
      },
      {
        title: 'Realistic Creator Pacing & Captions',
        description:
          'Natural delivery paired with clean kinetic captions designed for both sound-on TikTok feeds and sound-off Meta mobile placements.',
      },
      {
        title: 'Multi-Ratio Social Formatting',
        description:
          'Clean MP4 exports formatted for 9:16 (Reels/TikTok/Shorts), 4:5 (Instagram/Facebook Feed), and 1:1 square placements with safe-zone protection.',
      },
      {
        title: 'Full Commercial Ad Usage Rights',
        description:
          'Every delivered creative includes full paid media rights across Meta, TikTok, Google, and your online storefront with zero recurring royalties.',
      },
    ],
    formats: [
      { ratio: '9:16', label: 'Vertical Full-Screen', platforms: 'TikTok, Instagram Reels, YouTube Shorts' },
      { ratio: '4:5', label: 'Portrait Feed', platforms: 'Meta Facebook & Instagram Feeds' },
      { ratio: '1:1', label: 'Square Ad', platforms: 'Retargeting Carousels & Social Feeds' },
    ],
    portfolioFilterKeywords: ['serum', 'ugc', 'skincare', 'headphone', 'tee', 'bloom'],
    portfolioCategoryLabel: 'Featured AI UGC Video Ad Examples',
    faqs: [
      {
        question: 'How fast can you deliver AI UGC video ads?',
        answer:
          'Single-video starter concepts can be delivered within 24 hours, while multi-angle Growth and Pro batches typically deliver within 24 to 72 hours depending on revisions and script complexity.',
      },
      {
        question: 'Can you test multiple hooks for the same product video?',
        answer:
          'Yes. Growth and Pro packages include alternative opening hooks so your media buying team can split-test different first-3-second angles against the same core product demonstration.',
      },
      {
        question: 'Do I need to ship physical products to start?',
        answer:
          'No shipping is required. Share your product link, high-resolution product photos, packaging angles, and target audience notes to begin production immediately.',
      },
      {
        question: 'Which markets and English accents do you support?',
        answer:
          'Creatives are produced in natural international English tailored to buyers in the USA, UK, UAE, Canada, Australia, and European English-speaking markets.',
      },
    ],
    ctaHeadline: 'Need High-Converting AI UGC Video Ads for Your Store?',
    ctaDescription:
      'Start with a single $39 test concept or request a custom multi-hook testing batch tailored to your ad account goals.',
    inquiryServiceKey: 'AI UGC Video Ads',
    relatedPages: [
      {
        label: 'AI Spokesperson Videos',
        path: '/ai-spokesperson-videos',
        summary: 'Direct-to-camera AI brand presenters and explainers.',
      },
      {
        label: 'Beauty Video Ads',
        path: '/beauty-video-ads',
        summary: 'Routine hooks and sensory visuals for skincare and cosmetics.',
      },
      {
        label: 'Full Video Portfolio',
        path: '/portfolio',
        summary: 'Browse all AI UGC and CGI commercial case studies.',
      },
    ],
  },
  '/ai-spokesperson-videos': {
    path: '/ai-spokesperson-videos',
    eyebrow: 'Service · AI Spokesperson Videos',
    h1: 'AI Spokesperson Video Ads for E-Commerce, SaaS & Agencies',
    lead: 'Articulate AI brand spokespersons delivering natural direct-to-camera product explainers, founder-style stories, and multi-market ad creatives with clean lip-sync and tailored personas.',
    internationalNote:
      'Calibrated for international audiences across the USA, United Kingdom, United Arab Emirates, Canada, Australia, and Europe.',
    overviewTitle: 'Human-Style Brand Communication Without Studio Scheduling Delays',
    overviewParagraphs: [
      'Direct-to-camera spokesperson videos remain one of the most reliable creative structures for explaining complex offers, SaaS platforms, skincare routines, and consumer gadgets. When a presenter looks directly at the viewer and clearly articulates why a product solves a real problem, trust forms immediately.',
      'As an AI Video Ad Creator, I pair realistic AI presenters with structured direct-response scripts, clean background staging, product B-roll cutaways, and crisp audio so your brand can launch spokesperson ads in days instead of months.',
    ],
    featuresTitle: 'Key Capabilities in AI Spokesperson Production',
    features: [
      {
        title: 'Tailored Presenter Demographics & Wardrobe',
        description:
          'Select presenter style, age range, wardrobe tone, and setting—from casual home lighting for UGC trust to sleek studio framing for SaaS and corporate launches.',
      },
      {
        title: 'Natural Voice Cadence & Regional Accents',
        description:
          'Clear pronunciation and conversational pacing matched to North American, British, Australian, or neutral international English audiences.',
      },
      {
        title: 'B-Roll & Product Visual Integration',
        description:
          'Spokesperson segments cut cleanly with close-up product shots, interface screen recordings, and visual benefit callouts to keep retention steady.',
      },
      {
        title: 'Scriptwriting & CTA Optimization',
        description:
          'Structured Hook -> Problem -> Solution -> Social Proof -> CTA messaging tailored to cold paid social traffic or landing page conversion.',
      },
    ],
    formats: [
      { ratio: '9:16', label: 'Vertical Direct-to-Camera', platforms: 'TikTok Ads, Instagram Reels, Shorts' },
      { ratio: '16:9', label: 'Widescreen Explainer', platforms: 'Landing Pages, YouTube In-Stream, LinkedIn' },
      { ratio: '4:5', label: 'Portrait Feed Cut', platforms: 'Meta Feed Acquisition Campaigns' },
    ],
    portfolioFilterKeywords: ['ugc', 'pro', 'headphone', 'serum', 'ai ugc'],
    portfolioCategoryLabel: 'Spokesperson & Direct-to-Camera Video Samples',
    faqs: [
      {
        question: 'Can the AI spokesperson speak with US, UK, or international accents?',
        answer:
          'Yes. Voice delivery can be matched to American, British, Canadian, Australian, or neutral international English based on the country your ads target.',
      },
      {
        question: 'Can you include our product images or app screen recordings inside the video?',
        answer:
          'Yes. Spokesperson videos regularly cut between the presenter and your product photos, website walkthroughs, or macro B-roll clips for visual clarity.',
      },
      {
        question: 'Are AI spokesperson videos suitable for Shopify stores and SaaS landing pages?',
        answer:
          'Yes. Beyond paid social in 9:16 and 4:5, we can export crisp 16:9 widescreen versions designed specifically for hero website banners and product pages.',
      },
      {
        question: 'Do you provide both captioned and clean versions?',
        answer:
          'Yes, both burned-in dynamic caption exports for social feeds and clean caption-free master videos can be provided.',
      },
    ],
    ctaHeadline: 'Launch Realistic AI Spokesperson Videos for Your Brand',
    ctaDescription:
      'Share your script talking points or let me write the full direct-response script tailored to your target audience.',
    inquiryServiceKey: 'AI Spokesperson Ads',
    relatedPages: [
      {
        label: 'AI UGC Video Ads',
        path: '/ai-ugc-video-ads',
        summary: 'Native creator-style social video ads for TikTok and Meta.',
      },
      {
        label: 'Fashion Video Ads',
        path: '/fashion-video-ads',
        summary: 'Apparel styling and lifestyle storytelling creatives.',
      },
      {
        label: 'About Ismail Sarder',
        path: '/about',
        summary: 'Creative methodology, direct channels, and studio background.',
      },
    ],
  },
  '/cgi-product-ads': {
    path: '/cgi-product-ads',
    eyebrow: 'Service · CGI Product Commercials',
    h1: 'CGI Product Commercials & 3D Video Ads for Modern Brands',
    lead: 'High-impact cinematic CGI product commercials crafted with sculptural studio lighting, photorealistic materials, and dynamic camera choreography for product launches and luxury e-commerce.',
    internationalNote:
      'Designed for ambitious beauty, fragrance, footwear, watch, and consumer tech brands across the USA, UK, UAE, Canada, Australia, and Europe.',
    overviewTitle: 'Studio-Grade Product Cinema Without Physical Set Construction',
    overviewParagraphs: [
      'When your product deserves elevated visual positioning—whether a luxury perfume bottle emerging from golden desert dunes, wireless audio pulsing in dark obsidian contrast, or performance footwear suspended mid-motion—CGI product commercials deliver immediate visual authority.',
      'I craft 16:9 widescreen hero commercials and 9:16 vertical social cutdowns combining clean composition, bespoke sound design, and crisp 3D motion direction built for product launches, homepage banners, and Meta/YouTube campaigns.',
    ],
    featuresTitle: 'What Sets Our CGI Product Ads Apart',
    features: [
      {
        title: 'Photorealistic Material & Lighting Direction',
        description:
          'Focused attention to glass reflections, metallic finishes, botanical elements, and tactile surfaces that elevate perceived brand value.',
      },
      {
        title: 'Dynamic Camera Choreography & Sound Design',
        description:
          'Smooth orbital reveals, macro detail sweeps, and bass-synced transitions paired with custom SFX and cinematic pacing.',
      },
      {
        title: 'Widescreen 16:9 & Social 9:16 Masters',
        description:
          'Produced cleanly for both widescreen YouTube/website hero headers and vertical Instagram Reels or TikTok launch teasers.',
      },
      {
        title: 'Flexible Custom Scope & Pricing',
        description:
          'Commission a focused 15–25 second product reveal or pair a CGI commercial with AI UGC ad variations for full-funnel launch coverage.',
      },
    ],
    formats: [
      { ratio: '16:9', label: 'Widescreen Cinema', platforms: 'Website Hero Banners, YouTube Pre-Roll, Pitch Decks' },
      { ratio: '9:16', label: 'Vertical Reel Spot', platforms: 'Instagram Reels, TikTok, YouTube Shorts' },
      { ratio: '4:5', label: 'Social Feed Cutdown', platforms: 'Meta Paid Launch Campaigns' },
    ],
    portfolioFilterKeywords: ['cgi', 'perfume', 'sneaker', 'bloom', 'future', 'beat', 'desert'],
    portfolioCategoryLabel: 'Featured CGI Product Commercials',
    faqs: [
      {
        question: 'Which product categories work best for CGI product commercials?',
        answer:
          'Perfumes and fragrances, skincare bottles, athletic sneakers, watches, consumer headphones, minimalist tech hardware, and luxury packaged goods shine in CGI environments.',
      },
      {
        question: 'Can you deliver both 16:9 horizontal and 9:16 vertical versions?',
        answer:
          'Yes. Many brands pair a 16:9 hero commercial for their Shopify homepage or YouTube campaign with a 9:16 vertical version formatted for Instagram Reels and TikTok.',
      },
      {
        question: 'What assets do you need from our brand to create a CGI commercial?',
        answer:
          'High-resolution product images from multiple angles, packaging label artwork, brand color guidelines, and any mood-board inspiration you want matched.',
      },
      {
        question: 'How is CGI commercial pricing structured?',
        answer:
          'Because CGI complexity varies by product geometry and scene environment, custom quotes can be discussed and negotiated directly based on duration, scenes, and deliverables.',
      },
    ],
    ctaHeadline: 'Commission a Cinematic CGI Product Commercial',
    ctaDescription:
      'Share your product photos and launch vision to receive a tailored production plan and flexible custom quote.',
    inquiryServiceKey: 'CGI Product Commercials',
    relatedPages: [
      {
        label: 'AI UGC Video Ads',
        path: '/ai-ugc-video-ads',
        summary: 'Pair high-impact CGI reveals with relatable UGC performance ads.',
      },
      {
        label: 'Beauty Video Ads',
        path: '/beauty-video-ads',
        summary: 'Botanical skincare commercials and serum product demos.',
      },
      {
        label: 'Contact & Project Brief',
        path: '/contact',
        summary: 'Discuss custom CGI scope, timeline, and pricing.',
      },
    ],
  },
  '/beauty-video-ads': {
    path: '/beauty-video-ads',
    eyebrow: 'Industry Vertical · Beauty & Skincare',
    h1: 'AI Video Ads for Beauty, Skincare & Fragrance Brands',
    lead: 'Sensory AI UGC testimonials, serum application demonstrations, and botanical CGI fragrance spots engineered for modern skincare, cosmetics, and personal care brands.',
    internationalNote:
      'Tailored for high-growth beauty and skincare e-commerce brands in the United States, United Kingdom, UAE, Canada, Australia, and Europe.',
    overviewTitle: 'Visual Proof, Texture & Relatable Routines That Sell Skincare Online',
    overviewParagraphs: [
      'Beauty shoppers buy with their eyes—they want to see texture absorption, realistic skin finish, effortless morning routines, and trustworthy creator explanations before adding a new serum or cleanser to cart.',
      'I produce dedicated AI Video Ads for beauty brands combining natural AI creator routines, close-up macro serum/cream visuals, and elevated CGI fragrance reveals—giving DTC beauty teams fresh creative variations every week.',
    ],
    featuresTitle: 'Creative Angles Designed for Beauty & Skincare',
    features: [
      {
        title: 'Morning & Evening Routine Storytelling',
        description:
          'Authentic creator framing showing how your serum, moisturizer, or cleanser simplifies complicated multi-step regimens.',
      },
      {
        title: 'Texture, Glow & Packaging Close-Ups',
        description:
          'High-clarity visual sequences highlighting droplet viscosity, non-greasy absorption, and premium bottle craftsmanship.',
      },
      {
        title: 'Ingredient & Benefit Simplification',
        description:
          'Translating complex actives (hyaluronic acid, niacinamide, botanicals) into clear everyday skin benefits buyers immediately grasp.',
      },
      {
        title: 'Fragrance & Botanical CGI Options',
        description:
          'Pair everyday AI UGC testimonials with atmospheric CGI product commercials for seasonal launches and gifting campaigns.',
      },
    ],
    formats: [
      { ratio: '9:16', label: 'Routine & GRWM Reel', platforms: 'TikTok, Instagram Reels, Snapchat' },
      { ratio: '4:5', label: 'Skincare Feed Ad', platforms: 'Instagram & Facebook Feed' },
      { ratio: '16:9', label: 'Launch Film / PDP Banner', platforms: 'Shopify Product Pages & YouTube' },
    ],
    portfolioFilterKeywords: ['serum', 'skin', 'bloom', 'perfume', 'beauty'],
    portfolioCategoryLabel: 'Beauty, Skincare & Fragrance Case Studies',
    faqs: [
      {
        question: 'Can AI UGC skincare ads show realistic everyday skin routines?',
        answer:
          'Yes. Creative concepts are framed around natural lighting, concise morning/evening routines, and relatable skin concerns rather than stiff studio infomercials.',
      },
      {
        question: 'Do you create both UGC skincare testimonials and luxury perfume CGI ads?',
        answer:
          'Yes. You can book standalone AI UGC beauty ads, luxury CGI bottle commercials like our NOIRÉ and Pure Bloom concepts, or a combined launch bundle.',
      },
      {
        question: 'How do you highlight active ingredients without overwhelming viewers?',
        answer:
          'Each script distills formulation claims into 1–2 memorable visual benefits supported by clean on-screen callouts and dynamic captions.',
      },
      {
        question: 'What package works best for testing skincare hooks?',
        answer:
          'Our Growth ($89) and Pro / Scale ($179) packages include multiple hook options per video so you can test problem-focused vs. routine-focused openers.',
      },
    ],
    ctaHeadline: 'Scale Your Beauty Brand With Fresh Creative Angles',
    ctaDescription:
      'Turn product bottles and ingredient benefits into scroll-stopping skincare and fragrance video ads.',
    inquiryServiceKey: 'Beauty & Skincare Ads',
    relatedPages: [
      {
        label: 'AI UGC Video Ads',
        path: '/ai-ugc-video-ads',
        summary: 'Performance UGC creatives across Meta and TikTok.',
      },
      {
        label: 'CGI Product Ads',
        path: '/cgi-product-ads',
        summary: 'Luxury fragrance and botanical 3D visuals.',
      },
      {
        label: 'Portfolio',
        path: '/portfolio',
        summary: 'Watch skincare, serum, and perfume video demos.',
      },
    ],
  },
  '/fashion-video-ads': {
    path: '/fashion-video-ads',
    eyebrow: 'Industry Vertical · Fashion & Apparel',
    h1: 'AI Video Ads for Fashion, Footwear & Lifestyle Brands',
    lead: 'Dynamic apparel lookbooks, everyday fit-check UGC videos, and kinetic CGI footwear commercials built to showcase drape, styling versatility, and modern brand identity.',
    internationalNote:
      'Crafted for apparel, streetwear, footwear, and lifestyle labels selling across the USA, UK, UAE, Canada, Australia, and Europe.',
    overviewTitle: 'Show Fit, Fabric & Motion Across Vertical Feeds',
    overviewParagraphs: [
      'Online fashion buyers hesitate when they cannot feel fabric weight or visualize how a garment drapes in real movement. Static product photography rarely conveys silhouette, versatility, or lifestyle context on its own.',
      'I build AI Video Ads for fashion brands that combine clean editorial energy with relatable social pacing—from minimalist oversized tees and capsule wardrobe styling videos to high-energy CGI sneaker launch spots.',
    ],
    featuresTitle: 'Fashion & Footwear Creative Deliverables',
    features: [
      {
        title: 'Fit-Check & Outfit Versatility Hooks',
        description:
          'Quick-cut "3 ways to style" and everyday comfort openers designed for high organic-style retention on Instagram Reels and TikTok.',
      },
      {
        title: 'Fabric Drape & Silhouette Detail',
        description:
          'Focused framing highlighting heavyweight cotton texture, tailored outerwear lines, and clean stitching details.',
      },
      {
        title: 'Kinetic Footwear CGI Commercials',
        description:
          'Bold 3D sneaker reveals showcasing sole geometry, surface materials, and athletic launch energy.',
      },
      {
        title: 'Drop & Seasonal Lookbook Cuts',
        description:
          'Delivered cleanly across 9:16 Reels, 4:5 Meta feeds, and 16:9 collection headers with commercial usage rights.',
      },
    ],
    formats: [
      { ratio: '9:16', label: 'Fit-Check & Reel Ad', platforms: 'TikTok, Instagram Reels, Shorts' },
      { ratio: '4:5', label: 'Catalog & Feed Video', platforms: 'Meta Feed Carousel & Lookbooks' },
      { ratio: '16:9', label: 'Drop Campaign Header', platforms: 'Shopify Hero & YouTube' },
    ],
    portfolioFilterKeywords: ['fashion', 'tee', 'sneaker', 'future', 'shoe'],
    portfolioCategoryLabel: 'Fashion, Apparel & Footwear Case Studies',
    faqs: [
      {
        question: 'Can you produce video ads for clothing drops and footwear launches?',
        answer:
          'Yes. Apparel pieces can be showcased through AI UGC styling and fit-check concepts, while sneakers and statement accessories also pair powerfully with CGI product reveals.',
      },
      {
        question: 'What aspect ratios do fashion brands receive?',
        answer:
          'Every project supports 9:16 vertical for Reels/TikTok, 4:5 for Meta portrait feeds, 1:1 square ads, and 16:9 for hero website collections.',
      },
      {
        question: 'Can pricing be negotiated for full seasonal collection batches?',
        answer:
          'Yes. While starter packages begin at $39, seasonal lookbooks and multi-SKU bundles are eligible for custom negotiated pricing.',
      },
      {
        question: 'How do we share garment photos and sizing notes?',
        answer:
          'Simply send your lookbook URL or product images via the Contact brief along with your target region and campaign objective.',
      },
    ],
    ctaHeadline: 'Elevate Your Next Fashion or Footwear Drop',
    ctaDescription:
      'Launch crisp apparel UGC reels and kinetic sneaker commercials built for modern social shopping feeds.',
    inquiryServiceKey: 'Fashion & Gadget Ads',
    relatedPages: [
      {
        label: 'CGI Product Ads',
        path: '/cgi-product-ads',
        summary: 'High-energy 3D sneaker and luxury accessory commercials.',
      },
      {
        label: 'AI UGC Video Ads',
        path: '/ai-ugc-video-ads',
        summary: 'Relatable direct-response video ads for e-commerce.',
      },
      {
        label: 'Contact & Project Brief',
        path: '/contact',
        summary: 'Request a custom apparel or footwear campaign quote.',
      },
    ],
  },
};
