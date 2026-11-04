export type ProductCategory =
  | 'All Projects'
  | 'Beauty & Skincare'
  | 'Fashion & Lifestyle'
  | 'Gadgets & Technology'
  | 'Product Demonstrations'
  | 'AI UGC Creator Videos'
  | 'SaaS & Digital Products';

export interface ScriptBreakdown {
  hook: string;
  agitation: string;
  demonstration: string;
  cta: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  brandName: string;
  category: Exclude<ProductCategory, 'All Projects'>;
  duration: string;
  format: string;
  thumbnail: string;
  videoUrl?: string;
  hook: string;
  angle: string;
  creativeObjective: string;
  overview: string;
  scriptBreakdown: ScriptBreakdown;
  keyFeatures: string[];
  targetMarket: string;
  isCustomAdded?: boolean;
}

export interface ContactFormData {
  fullName: string;
  businessEmail: string;
  brandName: string;
  websiteUrl: string;
  industry: string;
  videoType: string;
  budget: string;
  projectDescription: string;
}
