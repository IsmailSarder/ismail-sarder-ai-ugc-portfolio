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

export const ROUTE_SEO_CONFIG: Record<string, RouteSeoConfig> = {
  '/': {
    path: '/',
    label: 'Home',
    title: 'Ismail Sarder | AI UGC Video Ads Creator & Creative Studio',
    description:
      'AI UGC Video Ads Creator helping beauty, fashion & e-commerce brands in the USA, UK, UAE, Canada & Europe launch AI UGC and CGI video ads.',
    keywords:
      'AI UGC Video Ads Creator, AI UGC Video Ads, AI Video Ad Creator, AI Spokesperson Video Ads, AI Product Video Ads, E-commerce Video Ads Creator, CGI Product Commercials, AI Video Ads for Beauty Brands, AI Video Ads for Fashion Brands',
    breadcrumbs: [{ name: 'Home', path: '/' }],
  },
  '/ai-ugc-video-ads': {
    path: '/ai-ugc-video-ads',
    label: 'AI UGC Video Ads',
    title: 'AI UGC Video Ads Creator for E-commerce | Ismail Sarder',
    description:
      'Custom AI UGC Video Ads for TikTok, Instagram Reels & Meta Ads. Hooks, scripts, AI presenters, captions, and native aspect ratios for DTC brands.',
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
        'Scroll-stopping AI-generated UGC video ads with native social pacing, custom hooks, scripts, and captions.',
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
      'Cinematic CGI product commercials and 3D product animation ads crafted to showcase luxury packaging, electronics, fragrance, and footwear launches.',
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
        'High-impact 3D CGI product advertisements crafted with realistic studio lighting and dynamic motion storytelling.',
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
      'Submit your project brief or negotiate a custom AI UGC or CGI video ad package. Serving brands in USA, UK, UAE, Canada, Australia & Europe.',
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

export const INDEXABLE_PATHS = Object.keys(ROUTE_SEO_CONFIG);

export function normalizePathname(rawPath: string): string {
  if (!rawPath || rawPath === '/') return '/';
  const withoutHashOrQuery = rawPath.split('#')[0].split('?')[0];
  const cleaned = withoutHashOrQuery.replace(/\/+$/, '');
  return cleaned || '/';
}

export function getRouteSeo(pathname: string): RouteSeoConfig {
  const normalized = normalizePathname(pathname);
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
      areaServed: [
        'United States',
        'United Kingdom',
        'United Arab Emirates',
        'Canada',
        'Australia',
        'Europe',
      ],
    });
  } else {
    graph.push({
      '@type': 'ProfessionalService',
      name: 'Ismail Sarder — AI UGC Video Ads Studio',
      url: canonicalUrl,
      image: ogImageUrl,
      description: seo.description,
      provider: { '@id': `${SITE_URL}/#ismail-sarder` },
      areaServed: [
        'United States',
        'United Kingdom',
        'United Arab Emirates',
        'Canada',
        'Australia',
        'Europe',
      ],
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
