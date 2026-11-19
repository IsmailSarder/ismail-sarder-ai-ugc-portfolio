export const SITE_URL = 'https://ismail-sarder-ai-ugc-ad-creator-creative-studio.ai.studio';

export interface RouteSeoConfig {
  path: string;
  label: string;
  title: string;
  description: string;
  keywords: string;
  robots?: string;
  breadcrumbs: { name: string; path: string }[];
  serviceSchema?: {
    name: string;
    serviceType: string;
    description: string;
  };
}

export interface VideoSchemaSource {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  contentUrl: string;
  durationIso: string;
  aspectRatio: string;
  uploadDate: string;
  routeMatch: string[];
}

export const PORTFOLIO_VIDEO_SCHEMA_ITEMS: VideoSchemaSource[] = [
  {
    id: 'video-simple-serum-routine',
    name: 'My Simple Serum Routine: An Honest Skincare Review (AI UGC Ad)',
    description:
      'Vertical 9:16 AI UGC skincare review highlighting an effortless daily hydrating serum routine for e-commerce beauty brands.',
    category: 'AI UGC Video Ads',
    thumbnailUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794245531277_1000030084.png',
    contentUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245521871_1000029752.mp4',
    durationIso: 'PT28S',
    aspectRatio: '9:16',
    uploadDate: '2026-11-01',
    routeMatch: ['/', '/portfolio', '/ai-ugc-video-ads', '/beauty-video-ads'],
  },
  {
    id: 'video-lumera-skin-serum',
    name: 'Lumera Skin Serum: Hydrated-Looking Skin AI UGC Ad',
    description:
      'Beauty & skincare AI UGC video advertisement demonstrating lightweight hydrating serum texture and direct-response pacing for TikTok and Reels.',
    category: 'Beauty & Skincare',
    thumbnailUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794245611859_1000030085.png',
    contentUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245604657_1000029754.mp4',
    durationIso: 'PT26S',
    aspectRatio: '9:16',
    uploadDate: '2026-11-01',
    routeMatch: ['/', '/portfolio', '/ai-ugc-video-ads', '/beauty-video-ads'],
  },
  {
    id: 'video-everyday-headphones',
    name: 'Everyday Wireless Headphones Review — Consumer Tech AI UGC Ad',
    description:
      'Consumer electronics AI UGC video ad highlighting acoustic clarity and all-day wireless comfort for Meta and TikTok campaigns.',
    category: 'Gadgets & Technology',
    thumbnailUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794245714197_1000030086.png',
    contentUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245706375_1000029755.mp4',
    durationIso: 'PT30S',
    aspectRatio: '9:16',
    uploadDate: '2026-11-01',
    routeMatch: ['/', '/portfolio', '/ai-ugc-video-ads'],
  },
  {
    id: 'video-pro-ugc-spokesperson',
    name: 'Pro UGC Product Demo & AI Spokesperson Ad Creative',
    description:
      'Direct-to-camera AI spokesperson creative showcasing structured direct-response hook pacing and visual product demonstration.',
    category: 'AI Spokesperson Videos',
    thumbnailUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794245801394_1000030087.png',
    contentUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245792416_1000029756.mp4',
    durationIso: 'PT27S',
    aspectRatio: '9:16',
    uploadDate: '2026-11-01',
    routeMatch: ['/', '/portfolio', '/ai-spokesperson-videos', '/ai-ugc-video-ads'],
  },
  {
    id: 'video-oversized-black-tee',
    name: 'Everyday Oversized Black Tee — Apparel & Fashion AI UGC Ad',
    description:
      'Fashion and apparel AI UGC video ad demonstrating relaxed fabric drape, everyday styling, and clean product framing.',
    category: 'Fashion & Lifestyle',
    thumbnailUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794245890811_1000030088.png',
    contentUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245883418_1000029757.mp4',
    durationIso: 'PT24S',
    aspectRatio: '9:16',
    uploadDate: '2026-11-01',
    routeMatch: ['/', '/portfolio', '/fashion-video-ads', '/ai-ugc-video-ads'],
  },
  {
    id: 'video-noire-perfume-cgi',
    name: 'NOIRÉ Luxury Perfume — Vertical CGI Product Commercial',
    description:
      'Photorealistic 9:16 CGI fragrance commercial crafted with moody studio reflections and luxury pacing for paid social.',
    category: 'CGI Product Ads',
    thumbnailUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794738306514_Perfume_thumbnail_9x16.jpg',
    contentUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794738300263_Perfume.mp4',
    durationIso: 'PT24S',
    aspectRatio: '9:16',
    uploadDate: '2026-11-05',
    routeMatch: ['/', '/portfolio', '/cgi-product-ads', '/beauty-video-ads'],
  },
  {
    id: 'video-golden-desert-perfume-cgi',
    name: 'Luxury Perfume (Golden Desert) — 16:9 CGI Commercial',
    description:
      'Widescreen 16:9 CGI fragrance commercial blending golden-hour desert environments with luxury bottle close-ups.',
    category: 'CGI Product Ads',
    thumbnailUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794911159794_cover_1.jpg',
    contentUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794911157939_1000030727.mp4',
    durationIso: 'PT22S',
    aspectRatio: '16:9',
    uploadDate: '2026-11-10',
    routeMatch: ['/portfolio', '/cgi-product-ads', '/beauty-video-ads'],
  },
  {
    id: 'video-run-the-future-cgi',
    name: 'Run the Future — Footwear Launch 16:9 CGI Commercial',
    description:
      'Futuristic 16:9 sneaker launch commercial featuring kinetic camera motion and sculpted studio lighting.',
    category: 'CGI Product Ads',
    thumbnailUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794911299691_cover_3.jpg',
    contentUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794911297813_1000030729.mp4',
    durationIso: 'PT22S',
    aspectRatio: '16:9',
    uploadDate: '2026-11-10',
    routeMatch: ['/portfolio', '/cgi-product-ads', '/fashion-video-ads'],
  },
];

export const STUDIO_OFFER_CATALOG = {
  '@type': 'OfferCatalog',
  name: 'AI Video Ad Production Packages (Introductory Launch Pricing)',
  itemListElement: [
    {
      '@type': 'Offer',
      name: 'AI UGC Video Ads (Starter / Growth / Pro)',
      description: '1 to 4 AI UGC video ads with scripts, AI voiceover, hooks, captions, and 1–4 day delivery.',
      priceCurrency: 'USD',
      lowPrice: '25',
      highPrice: '99',
      price: '25',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/#pricing`,
    },
    {
      '@type': 'Offer',
      name: 'AI CGI Product Ads (Starter / Growth / Pro)',
      description: '1 to 4 photorealistic 3D CGI product spots with studio lighting, SFX, and 2–7 day delivery.',
      priceCurrency: 'USD',
      lowPrice: '45',
      highPrice: '179',
      price: '45',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/#pricing`,
    },
    {
      '@type': 'Offer',
      name: 'AI Commercial Videos (Starter / Growth / Premium)',
      description: 'Multi-scene brand storytelling commercials combining AI talent, B-roll, and CGI polish in 3–8 days.',
      priceCurrency: 'USD',
      lowPrice: '79',
      highPrice: '299',
      price: '79',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/#pricing`,
    },
  ],
};

export const ROUTE_SEO_CONFIG: Record<string, RouteSeoConfig> = {
  '/': {
    path: '/',
    label: 'Home',
    title: 'Ismail Sarder | AI UGC Video Ads Creator & Creative Studio',
    description:
      'AI UGC Video Ads Creator helping beauty, fashion & e-commerce brands in the USA, UK, UAE, Canada, Australia & Europe launch AI UGC and CGI video ads.',
    keywords:
      'AI UGC Video Ads Creator, AI UGC Video Ads, AI Video Ad Creator, AI Spokesperson Video Ads, AI Product Video Ads, E-commerce Video Ads Creator, CGI Product Commercials, AI Video Ads for Beauty Brands, AI Video Ads for Fashion Brands',
    breadcrumbs: [{ name: 'Home', path: '/' }],
  },
  '/ai-ugc-video-ads': {
    path: '/ai-ugc-video-ads',
    label: 'AI UGC Video Ads',
    title: 'AI UGC Video Ads Creator for E-commerce | Ismail Sarder',
    description:
      'Custom AI UGC Video Ads starting at $25 for TikTok, Instagram Reels & Meta Ads. Hooks, scripts, AI presenters, captions, and native aspect ratios.',
    keywords:
      'AI UGC Video Ads, AI UGC Video Ads Creator, E-commerce Video Ads Creator, TikTok AI UGC ads, Instagram Reels AI UGC ads',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'AI UGC Video Ads', path: '/ai-ugc-video-ads' },
    ],
    serviceSchema: {
      name: 'AI UGC Video Ads Creation',
      serviceType: 'AI UGC Video Ads',
      description:
        'Scroll-stopping AI-generated UGC video ads with native social pacing, custom hooks, scripts, and captions starting at $25.',
    },
  },
  '/ai-spokesperson-videos': {
    path: '/ai-spokesperson-videos',
    label: 'AI Spokesperson Videos',
    title: 'AI Spokesperson Video Ads for Brands | Ismail Sarder',
    description:
      'Realistic AI spokesperson video ads with natural voice delivery, tailored scripts, and regional accents for Shopify, DTC, and SaaS brands.',
    keywords:
      'AI Spokesperson Video Ads, AI Video Ad Creator, AI Avatar Commercials, Direct-to-Camera AI Video Ads',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'AI Spokesperson Videos', path: '/ai-spokesperson-videos' },
    ],
    serviceSchema: {
      name: 'AI Spokesperson Video Ads',
      serviceType: 'AI Spokesperson Videos',
      description:
        'Photorealistic AI presenters delivering product explainers, brand stories, and direct-response hooks.',
    },
  },
  '/cgi-product-ads': {
    path: '/cgi-product-ads',
    label: 'CGI Product Ads',
    title: 'CGI Product Commercials & 3D Video Ads | Ismail Sarder',
    description:
      'Cinematic CGI product commercials and 3D product animation ads starting at $45 for luxury packaging, electronics, fragrance, and footwear launches.',
    keywords:
      'CGI Product Commercials, 3D Product Animation Ads, AI Product Video Ads, Luxury CGI Product Ads',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'CGI Product Ads', path: '/cgi-product-ads' },
    ],
    serviceSchema: {
      name: 'CGI Product Commercials',
      serviceType: 'CGI Product Ads',
      description:
        'High-impact 3D CGI product advertisements crafted with realistic studio lighting and dynamic motion storytelling starting at $45.',
    },
  },
  '/beauty-video-ads': {
    path: '/beauty-video-ads',
    label: 'Beauty Video Ads',
    title: 'AI Video Ads for Beauty & Skincare | Ismail Sarder',
    description:
      'AI Video Ads for beauty, cosmetics & skincare brands. Sensory product demos, routine hooks, and social creatives for Shopify and DTC brands.',
    keywords:
      'AI Video Ads for Beauty Brands, Skincare AI UGC Video Ads, Cosmetics AI Product Video Ads',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Beauty Video Ads', path: '/beauty-video-ads' },
    ],
    serviceSchema: {
      name: 'AI Video Ads for Beauty & Skincare Brands',
      serviceType: 'Beauty & Skincare Video Advertising',
      description:
        'Tailored AI UGC testimonials and product texture demonstrations built for modern skincare and cosmetic brands.',
    },
  },
  '/fashion-video-ads': {
    path: '/fashion-video-ads',
    label: 'Fashion Video Ads',
    title: 'AI Video Ads for Fashion & Lifestyle | Ismail Sarder',
    description:
      'AI Video Ads for fashion, apparel & lifestyle brands. Capsule wardrobe UGC, outfit transitions, and editorial video creatives for Reels & TikTok.',
    keywords:
      'AI Video Ads for Fashion Brands, Apparel AI UGC Ads, Lifestyle Video Ads Creator',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Fashion Video Ads', path: '/fashion-video-ads' },
    ],
    serviceSchema: {
      name: 'AI Video Ads for Fashion & Lifestyle Brands',
      serviceType: 'Fashion Video Advertising',
      description:
        'Dynamic apparel storytelling, styling transitions, and lifestyle video creatives for modern fashion labels.',
    },
  },
  '/portfolio': {
    path: '/portfolio',
    label: 'Portfolio',
    title: 'AI UGC & CGI Video Ads Portfolio | Ismail Sarder',
    description:
      'Watch AI UGC video ads, AI spokesperson concepts, product demonstrations, and CGI product commercials created by Ismail Sarder.',
    keywords:
      'AI UGC Video Ads Portfolio, AI Video Ad Examples, CGI Product Ads Portfolio, AI Product Video Ads',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Portfolio', path: '/portfolio' },
    ],
  },
  '/about': {
    path: '/about',
    label: 'About',
    title: 'About Ismail Sarder | AI UGC Video Ads Creator',
    description:
      'Meet Ismail Sarder, AI UGC Video Ads Creator & Creative Strategist partnering with e-commerce brands and marketing agencies globally.',
    keywords:
      'Ismail Sarder, AI UGC Video Ads Creator, Creative Strategist, E-commerce Video Ads Creator',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ],
  },
  '/contact': {
    path: '/contact',
    label: 'Contact',
    title: 'Hire Ismail Sarder | AI UGC & Video Ad Project Brief',
    description:
      'Submit your project brief or negotiate a custom AI UGC, CGI Product Ad, or Commercial Video package. Packages start at $25 for first 3–5 clients.',
    keywords:
      'Hire AI UGC Video Ads Creator, Contact Ismail Sarder, Request AI Video Ad Quote',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ],
  },
};

export const NOT_FOUND_SEO: RouteSeoConfig = {
  path: '/404',
  label: 'Page Not Found',
  title: 'Page Not Found (404) | Ismail Sarder AI UGC Studio',
  description:
    'The requested page could not be found. Explore AI UGC Video Ads, CGI Product Commercials, Portfolio, Services, or submit a project inquiry.',
  keywords: 'AI UGC Video Ads Creator, Ismail Sarder',
  robots: 'noindex, follow',
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: '404 Not Found', path: '/404' },
  ],
};

export const ADMIN_SEO: RouteSeoConfig = {
  path: '/admin',
  label: 'Admin Dashboard',
  title: 'Admin Login | Ismail Sarder Studio',
  description: 'Restricted studio administration portal.',
  keywords: 'Ismail Sarder Studio Admin',
  robots: 'noindex, nofollow',
  breadcrumbs: [{ name: 'Home', path: '/' }],
};

export const INDEXABLE_PATHS = Object.keys(ROUTE_SEO_CONFIG);

export function normalizePathname(rawPath: string): string {
  if (!rawPath || rawPath === '/') return '/';
  const withoutHashOrQuery = rawPath.split('#')[0].split('?')[0];
  const cleaned = withoutHashOrQuery.replace(/\/+$/, '');
  return cleaned || '/';
}

export function getRouteSeo(pathname: string): RouteSeoConfig {
  const normalized = normalizePathname(pathname);
  if (normalized === '/admin' || normalized.startsWith('/admin/')) {
    return ADMIN_SEO;
  }
  return ROUTE_SEO_CONFIG[normalized] || NOT_FOUND_SEO;
}

export function isKnownRoute(pathname: string): boolean {
  const normalized = normalizePathname(pathname);
  return Boolean(ROUTE_SEO_CONFIG[normalized]);
}

function upsertMetaTag(attr: 'name' | 'property', key: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export interface SchemaFaqItem {
  question: string;
  answer: string;
}

export function applyRouteSeo(pathname: string, faqs?: SchemaFaqItem[]) {
  if (typeof document === 'undefined') return;
  const seo = getRouteSeo(pathname);
  const canonicalUrl = seo.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${seo.path}`;
  const ogImageUrl = `${SITE_URL}/images/og-share-card.jpg`;

  document.title = seo.title;
  upsertMetaTag('name', 'description', seo.description);
  upsertMetaTag('name', 'keywords', seo.keywords);
  upsertMetaTag(
    'name',
    'robots',
    seo.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  );
  upsertMetaTag('property', 'og:title', seo.title);
  upsertMetaTag('property', 'og:description', seo.description);
  upsertMetaTag('property', 'og:url', canonicalUrl);
  upsertMetaTag('property', 'og:image', ogImageUrl);
  upsertMetaTag('name', 'twitter:title', seo.title);
  upsertMetaTag('name', 'twitter:description', seo.description);
  upsertMetaTag('name', 'twitter:url', canonicalUrl);
  upsertMetaTag('name', 'twitter:image', ogImageUrl);

  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', seo.robots?.includes('noindex') ? `${SITE_URL}/` : canonicalUrl);

  const areaServedCountries = [
    'United States',
    'United Kingdom',
    'United Arab Emirates',
    'Canada',
    'Australia',
    'Europe',
  ];

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'Ismail Sarder — AI UGC Video Ads Creator & Creative Studio',
      inLanguage: 'en',
      description:
        'AI UGC Video Ads Creator & Creative Strategist serving e-commerce, beauty, fashion, tech, and SaaS brands globally.',
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#ismail-sarder`,
      name: 'Ismail Sarder',
      jobTitle: 'AI UGC Video Ads Creator & Creative Strategist',
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/images/about_ismail_creative_director.webp`,
      email: 'hossenmeismail@gmail.com',
      telephone: '+8801648861141',
      sameAs: ['https://www.linkedin.com/in/ismail-sarder'],
      knowsAbout: [
        'AI UGC Video Ads',
        'AI CGI Product Ads',
        'AI Commercial Videos',
        'AI Spokesperson Video Ads',
        'Performance Creative Strategy',
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: seo.breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.name,
        item: crumb.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${crumb.path}`,
      })),
    },
  ];

  if (seo.serviceSchema) {
    graph.push({
      '@type': 'Service',
      name: seo.serviceSchema.name,
      serviceType: seo.serviceSchema.serviceType,
      description: seo.serviceSchema.description,
      url: canonicalUrl,
      provider: { '@id': `${SITE_URL}/#ismail-sarder` },
      areaServed: areaServedCountries,
      hasOfferCatalog: STUDIO_OFFER_CATALOG,
    });
  } else {
    graph.push({
      '@type': 'ProfessionalService',
      name: 'Ismail Sarder — AI UGC Video Ads Creative Studio',
      url: canonicalUrl,
      image: ogImageUrl,
      description: seo.description,
      priceRange: '$25 - $299',
      provider: { '@id': `${SITE_URL}/#ismail-sarder` },
      areaServed: areaServedCountries,
      hasOfferCatalog: STUDIO_OFFER_CATALOG,
    });
  }

  // Add Schema.org VideoObject structured entries matching current route
  const matchingVideos = PORTFOLIO_VIDEO_SCHEMA_ITEMS.filter((v) =>
    v.routeMatch.includes(seo.path)
  );
  for (const vid of matchingVideos) {
    graph.push({
      '@type': 'VideoObject',
      '@id': `${SITE_URL}/#${vid.id}`,
      name: vid.name,
      description: vid.description,
      thumbnailUrl: vid.thumbnailUrl,
      contentUrl: vid.contentUrl,
      uploadDate: vid.uploadDate,
      duration: vid.durationIso,
      inLanguage: 'en',
      creator: { '@id': `${SITE_URL}/#ismail-sarder` },
      genre: vid.category,
    });
  }

  if (faqs && faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  }

  let scriptEl = document.getElementById('dynamic-seo-schema') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'dynamic-seo-schema';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  });
}

export function navigateToPath(path: string, hash?: string) {
  if (typeof window === 'undefined') return;
  const targetPath = normalizePathname(path);
  const cleanHash = hash ? hash.replace(/^#/, '') : '';
  const fullTarget = cleanHash ? `${targetPath}#${cleanHash}` : targetPath;
  window.history.pushState({}, '', fullTarget);
  window.dispatchEvent(new CustomEvent('app:navigate', { detail: { path: targetPath, hash: cleanHash } }));
  if (cleanHash) {
    requestAnimationFrame(() => {
      const targetEl = document.getElementById(cleanHash);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
