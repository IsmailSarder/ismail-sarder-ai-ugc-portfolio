import { PortfolioItem } from '../components/VideoModal.tsx';
import { PortfolioProject } from '../lib/supabase.ts';
import { normalizeAspectRatio } from '../lib/videoAspectRatios.ts';

export const REAL_SUPABASE_PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: '2e1c5146-4b8e-4b0b-aff4-699fb1111ade',
    title: 'NOIRÉ – Luxury Perfume CGI Commercial',
    category: 'CGI Commercials',
    serviceType: 'CGI Product Ads',
    duration: '0:30',
    format: '9:16 Vertical Commercial',
    thumbnail:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794738306514_Perfume_thumbnail_9x16.jpg',
    videoUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794738300263_Perfume.mp4',
    video_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794738300263_Perfume.mp4',
    aspect_ratio: '9:16',
    aspectRatio: '9:16',
    video_mime_type: 'video/mp4',
    hook: 'Dramatic studio spotlight reveal with atmospheric smoke and sculptural 3D bottle rotation.',
    advertisingHook:
      'Dramatic studio spotlight reveal with atmospheric smoke and sculptural 3D bottle rotation designed to hold luxury buyer attention in the first 2 seconds.',
    angle: 'Luxury CGI Product Reveal',
    creativeConcept:
      'Elevated fragrance commercial combining chiaroscuro lighting, volumetric mist, and smooth camera orbit to position an emerging scent like an established couture house.',
    targetMarket: 'USA, UK, UAE & Europe',
    targetAudience: 'Luxury fragrance shoppers and gift buyers across USA, UK, UAE, and Europe (Ages 22–45)',
    isConcept: true,
    overview:
      'A cinematic CGI perfume advertisement designed to capture the essence of luxury and sophistication. Featuring dramatic lighting, atmospheric smoke, elegant product rotations, and refined visual effects for high-impact fragrance campaigns.',
    scriptBreakdown: {
      hook: 'Dramatic obsidian rim-light silhouette emerging through atmospheric smoke within the opening frames.',
      agitation: 'Elevates luxury packaging far above static studio packshots in crowded social feeds.',
      demonstration: '360-degree 3D rotational pass spotlighting glass clarity, cap detail, and tactile label typography.',
      cta: 'Clean luxury brand lockup engineered for Reels, TikTok, and hero launch placements.',
    },
    keyFeatures: [
      '9:16 Vertical Commercial Master',
      '3D CGI Camera & Lighting Choreography',
      'Sound-Designed Luxury Atmosphere',
      'Clean & Brand-Logo End Slate',
    ],
  },
  {
    id: '2fc48fef-15e8-43ca-a69b-ba7966d5161c',
    title: 'Premium Sneakers – Cinematic CGI Product Commercial',
    category: 'CGI Commercials',
    serviceType: 'CGI Product Ads',
    duration: '0:30',
    format: '9:16 Vertical Commercial',
    thumbnail:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794739197194_1115_Shoe_thumbnail_16x9.jpg',
    videoUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794739191187_shoes.mp4',
    video_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794739191187_shoes.mp4',
    aspect_ratio: '9:16',
    aspectRatio: '9:16',
    video_mime_type: 'video/mp4',
    hook: 'High-contrast sculptural sneaker entrance with dynamic camera sweep highlighting sole and stitch geometry.',
    advertisingHook:
      'High-contrast sculptural sneaker entrance with rapid perspective shifts spotlighting outsole craftsmanship from frame one.',
    angle: 'Kinetic Footwear Reveal',
    creativeConcept:
      'Dynamic CGI product spot built for footwear drops—highlighting silhouette, textured uppers, and energy in motion without costly location shoots.',
    targetMarket: 'USA, UK, Canada & Europe',
    targetAudience: 'Streetwear and performance footwear buyers on Instagram Reels, TikTok, and Meta Ads',
    isConcept: true,
    overview:
      'High-impact CGI sneaker commercial emphasizing sculpted midsoles, dynamic camera movement, and high-contrast studio lighting for DTC footwear launches.',
    scriptBreakdown: {
      hook: 'Immediate kinetic camera reveal locking onto the sneaker silhouette in crisp studio lighting.',
      agitation: 'Stands out immediately against flat e-commerce catalog carousel ads.',
      demonstration: 'Multi-angle surface sweeps showcasing texture depth, heel geometry, and tonal highlights.',
      cta: 'High-impact drop reveal built for launch countdowns and paid acquisition.',
    },
    keyFeatures: [
      'Dynamic 3D Motion Choreography',
      'Texture & Material Detail Passes',
      'Full HD Commercial Video Master',
      'Multi-Platform Ad Ready Cut',
    ],
  },
  {
    id: 'af7e8df2-638c-423f-a2df-8a86df843945',
    title: 'Pro UGC Content That Sells: Real Product Demos That Convert',
    category: 'AI UGC',
    serviceType: 'AI UGC Ads',
    duration: '0:50',
    format: '9:16 Vertical Video',
    thumbnail:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794245801394_1000030087.png',
    videoUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245792416_1000029756.mp4',
    video_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245792416_1000029756.mp4',
    aspect_ratio: '9:16',
    aspectRatio: '9:16',
    video_mime_type: 'video/mp4',
    hook: 'Show, don’t just tell—authentic UGC product demonstration built around a clear problem-to-solution story.',
    advertisingHook:
      'Direct-to-camera problem callout transitioning straight into tactile hands-on product proof within the first 3 seconds.',
    angle: 'Problem-to-Solution Product Demo',
    creativeConcept:
      'Authentic creator-led demonstration reel pairing natural conversational delivery with close-up visual proof designed for TikTok, Reels, and Meta.',
    targetMarket: 'USA, UK, Canada & Australia',
    targetAudience: 'Direct-to-consumer e-commerce shoppers evaluating product credibility on paid social',
    isConcept: true,
    overview:
      'UGC-style video ad built around relatable product demonstrations and a clear problem-to-solution narrative engineered to earn attention and present real product value.',
    scriptBreakdown: {
      hook: 'Immediate spoken hook paired with authentic mobile creator framing to disarm ad skepticism.',
      agitation: 'Highlights everyday buyer frustration with unverified alternatives.',
      demonstration: 'Clear hands-on demonstration showing ease of use and practical everyday benefits.',
      cta: 'Conversational closing recommendation encouraging product page visits.',
    },
    keyFeatures: [
      '9:16 Vertical AI UGC Master',
      'Problem-Agitation-Solution Script',
      'Synchronized Captions & Audio Mix',
      'Alternative Opening Hook Cut',
    ],
  },
  {
    id: '5cee0882-d429-484b-8175-31eb92bfae99',
    title: 'LUMIÈRE – Smooth & Glow Product Showcase',
    category: 'Beauty & Skincare',
    serviceType: 'CGI Product Ads',
    duration: '0:30',
    format: '9:16 Vertical Video',
    thumbnail:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794738427460_Body_wash_thumbnail_9x16.jpg',
    videoUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794738419128_Body_wash.mp4',
    video_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794738419128_Body_wash.mp4',
    aspect_ratio: '9:16',
    aspectRatio: '9:16',
    video_mime_type: 'video/mp4',
    hook: 'Dynamic liquid simulation and macro texture lighting engineered for modern body-care and skincare brands.',
    advertisingHook:
      'Macro liquid splash and silky product surface reveal creating immediate sensory appeal in muted or sound-on feeds.',
    angle: 'Sensory Liquid & Texture Showcase',
    creativeConcept:
      'Sensory visual commercial uniting silky liquid dynamics, crisp macro bottle illumination, and rhythmic editorial transitions to communicate hydration and purity.',
    targetMarket: 'USA, UK, UAE & Europe',
    targetAudience: 'Personal care, bath, and clean-beauty buyers ages 20–42',
    isConcept: true,
    overview:
      'A visually engaging skincare product showcase featuring dynamic liquid effects, detailed product textures, and smooth transitions designed for beauty commercials.',
    scriptBreakdown: {
      hook: 'Crisp studio splash and glowing bottle silhouette capture immediate visual contrast.',
      agitation: 'Communicates sensorial richness static skincare photos cannot convey.',
      demonstration: 'Close-up viscosity and surface sheen shots highlighting formulation smoothness.',
      cta: 'Clean product lockup ready for Paid Social and Shopify landing pages.',
    },
    keyFeatures: [
      '3D Liquid & Macro Texture Visuals',
      'Studio Color Grading',
      '9:16 Social Feed Master',
      'Music & Sound Design Included',
    ],
  },
  {
    id: '450af57c-75c5-4aea-b81e-237d1d2a0998',
    title: 'Lumera Skin Serum: Hydrated-Looking Skin, Simple Routine',
    category: 'Beauty & Skincare',
    serviceType: 'AI UGC Ads',
    duration: '0:30',
    format: '9:16 Vertical Video',
    thumbnail:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794245611859_1000030085.png',
    videoUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245604657_1000029754.mp4',
    video_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245604657_1000029754.mp4',
    aspect_ratio: '9:16',
    aspectRatio: '9:16',
    video_mime_type: 'video/mp4',
    hook: 'Skin looking tired even when you’re doing everything right? Here is the simple nightly switch.',
    advertisingHook:
      'Relatable skincare fatigue opener ("Skin looking tired even when you’re doing everything right?") paired with natural evening routine lighting.',
    angle: 'Evening Routine Simplification',
    creativeConcept:
      'Warm, trustworthy creator-style skincare testimonial positioning a lightweight hydrating serum as the effortless nightly anchor.',
    targetMarket: 'USA, UK & Canada',
    targetAudience: 'Beauty consumers seeking lightweight daily hydration without complex multi-step routines',
    isConcept: true,
    overview:
      'Relatable AI UGC skincare testimonial highlighting lightweight texture, fast absorption, and an effortless evening glow routine.',
    scriptBreakdown: {
      hook: 'Empathetic question addressing dullness despite trying multiple products.',
      agitation: 'Calls out heavy, sticky serums and overly complicated nightly regimens.',
      demonstration: 'Smooth application clip showing lightweight texture and fresh hydrated finish.',
      cta: 'Direct invitation to simplify daily skincare with clean caption prompts.',
    },
    keyFeatures: [
      'Natural AI Creator Delivery',
      'Burned-in Dynamic Captions',
      'TikTok & Reels Pacing',
      'Uncaptioned Clean Master Option',
    ],
  },
  {
    id: '12a2503f-5681-4780-9993-0d4cea960fb8',
    title: 'My Simple Serum Routine: An Honest Skincare Review',
    category: 'Beauty & Skincare',
    serviceType: 'AI UGC Ads',
    duration: '0:50',
    format: '9:16 Vertical Video',
    thumbnail:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794245531277_1000030084.png',
    videoUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245521871_1000029752.mp4',
    video_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245521871_1000029752.mp4',
    aspect_ratio: '9:16',
    aspectRatio: '9:16',
    video_mime_type: 'video/mp4',
    hook: 'Looking for a skincare step you’ll actually stick to? Watch how a few drops fit into an easy daily habit.',
    advertisingHook:
      'Candid "honest review" framing showing how a lightweight serum fits effortlessly into a morning routine.',
    angle: 'Honest Daily Habit Review',
    creativeConcept:
      'Organic testimonial-style AI UGC ad focusing on texture transparency, step-by-step application clarity, and approachable creator credibility.',
    targetMarket: 'USA, UK, Europe & Australia',
    targetAudience: 'Skincare buyers comparing lightweight daily serums and minimalist routines',
    isConcept: true,
    overview:
      'Honest UGC skincare review walking viewers through real texture, dropper dosage, and a simple everyday application habit.',
    scriptBreakdown: {
      hook: 'Everyday routine realism that looks indistinguishable from an organic creator post.',
      agitation: 'Addresses abandoned skincare bottles that felt too heavy or time-consuming.',
      demonstration: 'Clear look at consistency, absorption speed, and healthy skin finish.',
      cta: 'Friendly nudge toward trying a consistent daily habit.',
    },
    keyFeatures: [
      'Organic Selfie & B-Roll Framing',
      'Natural Voiceover & Cadence',
      'Timed Retention Captions',
      '9:16 Vertical Master Export',
    ],
  },
  {
    id: '14b37ac4-fcdd-479e-8c6e-c60269af6671',
    title: 'Premium Sound, Comfortable All Day: Everyday Headphones Review',
    category: 'Gadgets & Technology',
    serviceType: 'AI UGC Ads',
    duration: '0:30',
    format: '9:16 Vertical Video',
    thumbnail:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794245714197_1000030086.png',
    videoUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245706375_1000029755.mp4',
    video_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245706375_1000029755.mp4',
    aspect_ratio: '9:16',
    aspectRatio: '9:16',
    video_mime_type: 'video/mp4',
    hook: 'Great sound shouldn’t cost you comfort—all-day headphones tested for work calls, focus, and music.',
    advertisingHook:
      'Direct comfort challenge ("Great sound shouldn’t cost you comfort") tailored for remote workers and daily commuters.',
    angle: 'Lifestyle Comfort & Audio Demo',
    creativeConcept:
      'Tech lifestyle UGC demonstration bridging industrial design close-ups with everyday focus-work, calls, and commuting comfort.',
    targetMarket: 'USA, UK, Germany & Canada',
    targetAudience: 'Remote professionals, students, and daily commuters shopping for consumer audio',
    isConcept: true,
    overview:
      'Consumer electronics AI UGC review highlighting ergonomic earcup fit, rich audio clarity, and zero-fatigue wearability across work and travel.',
    scriptBreakdown: {
      hook: 'Calls out clamping pressure and ear fatigue from heavy headphones in the opening line.',
      agitation: 'Shows why studio-sound headphones get left on desks when comfort is ignored.',
      demonstration: 'Close-up hardware finish, cushion detail, and real-world desk-to-commute use.',
      cta: 'Clean product benefit wrap-up for Meta and TikTok Shop discovery.',
    },
    keyFeatures: [
      'Gadget Close-Up Demonstration',
      'Creator Voice & Lifestyle Cuts',
      'Clean UI-Safe Captions',
      'Paid Social Aspect Ratio Ready',
    ],
  },
  {
    id: 'eece6777-ded7-4229-b587-04ddc96695dc',
    title: 'Simple Fit. Premium Feel: The Everyday Oversized Black Tee',
    category: 'Fashion',
    serviceType: 'AI UGC Ads',
    duration: '0:30',
    format: '9:16 Vertical Video',
    thumbnail:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-thumbnails/thumbnails/1794245890811_1000030088.png',
    videoUrl:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245883418_1000029757.mp4',
    video_url:
      'https://ogzrhiwvgahjnazeuxmg.supabase.co/storage/v1/object/public/portfolio-videos/videos/1794245883418_1000029757.mp4',
    aspect_ratio: '9:16',
    aspectRatio: '9:16',
    video_mime_type: 'video/mp4',
    hook: 'Your everyday fit, upgraded—see how this relaxed black tee drapes and moves in city style.',
    advertisingHook:
      'Street-style fit check opening immediately showing shoulder drape, heavyweight cotton collar structure, and movement.',
    angle: 'Fit Check & Fabric Drape Proof',
    creativeConcept:
      'Modern urban apparel AI UGC commercial spotlighting silhouette, fabric weight, and effortless pairing with neutral trousers and sneakers.',
    targetMarket: 'USA, UK, Europe & UAE',
    targetAudience: 'Modern streetwear and minimalist essentials apparel shoppers ages 18–35',
    isConcept: true,
    overview:
      'Fashion lifestyle AI UGC ad showcasing relaxed drape, heavyweight tee structure, and everyday city styling versatility.',
    scriptBreakdown: {
      hook: 'Crisp full-body urban styling opener establishing silhouette and fabric quality right away.',
      agitation: 'Contrasts structured collar and drape against thin tees that lose shape quickly.',
      demonstration: 'Movement shots in city light paired with neutral trousers and sneakers.',
      cta: 'Everyday wardrobe staple positioning tailored for Instagram Reels and TikTok.',
    },
    keyFeatures: [
      'Lifestyle Fit & Movement Cuts',
      'Natural Urban Color Grading',
      'Fashion-Forward Pacing & Audio',
      '9:16 Vertical Campaign Master',
    ],
  },
];

// Enrich dynamically fetched Supabase projects with structured Case Study fields cleanly
const CASE_STUDY_PRESETS = new Map(REAL_SUPABASE_PORTFOLIO_ITEMS.map((item) => [item.id, item]));

export function mapSupabaseProjectToPortfolioItem(p: PortfolioProject): PortfolioItem {
  const preset = CASE_STUDY_PRESETS.get(p.id);
  const rawCat = String(p.category || '').trim();

  // Map legacy category labels cleanly into normalized display & filter categories
  const isCgi =
    rawCat === 'CGI Product Ads' ||
    rawCat === 'Product Commercials' ||
    rawCat === '3D Product Animation' ||
    rawCat === 'CGI Commercials';

  const isBeauty = rawCat === 'Beauty & Skincare';
  const isFashion = rawCat === 'Fashion' || rawCat === 'Fashion & Lifestyle';
  const isGadgets = rawCat === 'Gadgets & Technology';

  const derivedServiceType: 'AI UGC Ads' | 'AI Video Ads' | 'CGI Product Ads' = isCgi
    ? 'CGI Product Ads'
    : p.category === 'AI Video Ads'
    ? 'AI Video Ads'
    : 'AI UGC Ads';

  const resolvedRatio = normalizeAspectRatio(p.aspect_ratio, p.video_width, p.video_height);

  return {
    id: p.id,
    title: p.title,
    category: (isFashion
      ? 'Fashion'
      : isCgi
      ? 'CGI Commercials'
      : isBeauty
      ? 'Beauty & Skincare'
      : isGadgets
      ? 'Gadgets & Technology'
      : p.category === 'AI UGC Ads' || p.category === 'AI UGC Creator Videos'
      ? 'AI UGC'
      : p.category) as PortfolioItem['category'],
    rawCategory: rawCat,
    serviceType: derivedServiceType,
    duration: p.duration || preset?.duration || '0:30',
    format: p.format || `${resolvedRatio} Video Master`,
    thumbnail: p.thumbnail_url,
    video_url: p.video_url,
    videoUrl: p.video_url,
    aspect_ratio: resolvedRatio,
    aspectRatio: resolvedRatio,
    video_width: p.video_width,
    videoWidth: p.video_width,
    video_height: p.video_height,
    videoHeight: p.video_height,
    video_mime_type: p.video_mime_type || 'video/mp4',
    videoMimeType: p.video_mime_type || 'video/mp4',
    brand_name: p.brand_name,
    brandName: p.brand_name,
    hook: p.hook || preset?.hook || p.title,
    advertisingHook:
      preset?.advertisingHook ||
      p.hook ||
      'Opening visual pattern interrupt engineered for immediate feed retention.',
    angle: p.angle || preset?.angle || rawCat || 'Direct Response Creative',
    creativeConcept:
      preset?.creativeConcept ||
      p.description ||
      'AI-directed advertising concept uniting creator storytelling and sharp visual product focus.',
    overview: p.description || preset?.overview || p.title,
    isConcept: !p.brand_name,
    targetMarket: preset?.targetMarket || 'USA, UK, UAE, Canada & Europe',
    targetAudience:
      preset?.targetAudience ||
      `E-commerce & paid social buyers in ${rawCat || 'consumer'} markets`,
    scriptBreakdown: preset?.scriptBreakdown,
    keyFeatures: preset?.keyFeatures || [
      `${resolvedRatio} Master Video File`,
      'Burned-in Dynamic Captions',
      'Clean Uncaptioned Version',
      '100% Commercial Ad Rights',
    ],
  };
}
