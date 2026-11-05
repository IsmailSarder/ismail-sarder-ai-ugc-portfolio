# ISMAIL SARDER — AI UGC Ad Creator & Creative Studio

A high-performance, international-standard personal portfolio website for **Ismail Sarder**, AI UGC Ad Creator & Creative Strategist. Built to showcase hyper-realistic AI-powered UGC video ads, product demonstrations, and performance creative concepts for global direct-to-consumer e-commerce brands.

---

## 🚀 Live Demo & Brand Information

- **Brand Name**: ISMAIL SARDER
- **Professional Title**: AI UGC Ad Creator & Creative Strategist
- **Email**: [hossenmeismail@gmail.com](mailto:hossenmeismail@gmail.com)
- **WhatsApp**: [+88 01648861141](https://wa.me/8801648861141)
- **LinkedIn**: [linkedin.com/in/ismail-sarder](https://www.linkedin.com/in/ismail-sarder)
- **Target Markets**: United States, United Kingdom, UAE & GCC, Canada, Australia, European Union

---

## 🛠 Tech Stack & Architecture

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8 with ESM code splitting
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) with custom design tokens
- **Typography**: Manrope (Display & Editorial Headings), DM Sans (Body Prose), JetBrains Mono (Data & Formats)
- **Icons**: Lucide React
- **Deployment Target**: Netlify (or any modern static SPA host)

---

## 📁 Project File Structure

├── .env.example              # Environment variables template
├── index.html                # HTML5 entry with SEO, OpenGraph, JSON-LD Schema & SVG favicon
├── metadata.json             # AI Studio applet metadata & permissions
├── netlify.toml              # Netlify build command, publish directory, redirects & security headers
├── package.json              # NPM dependencies and build scripts
├── README.md                 # Project documentation & deployment manual
├── tsconfig.json             # TypeScript compiler configuration
├── vite.config.ts            # Vite bundler plugins and path aliases
├── supabase/
│   └── schema.sql            # Supabase SQL table, RLS policies & storage setup
└── src/
    ├── main.tsx              # React DOM entry point
    ├── App.tsx               # Root application layout & state orchestrator
    ├── index.css             # Tailwind v4 theme, fonts, custom scrollbars
    ├── lib/
    │   └── supabase.ts       # Supabase client & dynamic configuration
    ├── services/
    │   └── portfolioService.ts # Portfolio CRUD operations & media storage
    ├── assets/
    │   └── images/           # High-resolution portfolio thumbnails & portraits
    └── components/
        ├── Logo.tsx          # Reusable SVG brand logo (IS monogram + wordmark)
        ├── Navbar.tsx        # Sticky 3-zone top navigation with mobile drawer
        ├── Hero.tsx          # Editorial split hero with interactive UGC player simulation
        ├── Portfolio.tsx     # Filterable & searchable concept showcase grid
        ├── VideoModal.tsx    # Lightbox player with creative hook strategy breakdown
        ├── Services.tsx      # 8 core creative services suite with inquiry buttons
        ├── About.tsx         # Founder introduction, 5 strategic pillars, portrait
        ├── Process.tsx       # 4-step creative workflow & 48-72h turnaround details
        ├── WhyWorkWithMe.tsx # 6 strategic pillars and competitive advantages
        ├── FAQ.tsx           # Interactive FAQ accordion with truthful disclosures
        ├── Contact.tsx       # Direct channels & validated project inquiry form
        ├── Footer.tsx        # Quick navigation, social links, and Studio CMS button
        └── admin/
            ├── AdminLoginModal.tsx # Admin sign-in & Supabase setup modal
            └── AdminDashboard.tsx  # Add, edit, delete portfolio projects & uploads
```

---

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd <repo-name>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Typecheck & Lint**:
   ```bash
   npm run lint
   ```

5. **Production Build**:
   ```bash
   npm run build
   ```
   This generates the optimized production bundle in the `/dist` directory.

---

## 🌐 Netlify Deployment Guide

The website is fully configured with `netlify.toml` for 1-click deployment on Netlify's free tier.

### Method 1: Continuous Deployment via GitHub + Netlify (Recommended)

1. Push your repository to **GitHub**.
2. Log in to [Netlify](https://www.netlify.com/) (free account).
3. Click **"Add new site"** > **"Import an existing project"**.
4. Select **GitHub** and authorize access to your repository.
5. Netlify will automatically detect settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**.
7. Your portfolio will go live on a free Netlify subdomain (e.g. `ismail-sarder-ugc.netlify.app`). You can also attach a custom domain anytime in **Site configuration > Domain management**.

### Method 2: Manual Deployment via Netlify Drop (Instant Drag-and-Drop)

1. Run the local build command:
   ```bash
   npm run build
   ```
2. Log in to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the generated `dist` folder into the upload box.
4. Your site will deploy instantly with a live public URL.

---

## 📹 How to Add New Portfolio Videos or Concepts

To add new portfolio items or real client case studies:

1. Open `src/components/Portfolio.tsx`.
2. Locate the `projects` array.
3. Add a new object following the `PortfolioItem` interface:
   ```typescript
   {
     id: 'brand-unique-slug',
     title: 'Brand Name — Ad Concept Title',
     category: 'Beauty & Skincare', // Options: 'Beauty & Skincare' | 'Fashion & Lifestyle' | 'Gadgets & Technology' | 'Product Demonstrations' | 'AI UGC Creator Videos'
     duration: '0:30',
     format: '9:16 Vertical Video',
     thumbnail: '/src/assets/images/your_thumbnail.jpg',
     hook: 'The exact opening line spoken in the first 3 seconds...',
     angle: 'Problem-to-Solution / Contrarian / ASMR / Social Proof',
     isConcept: true, // Set to false if it's an approved public client campaign
     overview: 'Short paragraph describing the brand, campaign goal, and target demographic.',
     scriptBreakdown: {
       hook: 'Opening visual action and spoken hook line.',
       agitation: 'Viewer pain point and relatable dilemma.',
       demonstration: 'Product solution demonstration and social proof.',
       cta: 'Closing direct response offer and link in bio prompt.'
     },
     keyFeatures: [
       '3 Alternative Hook Openings',
       'Burned-in Dynamic Kinetic Captions',
       'TikTok & Reels Sound Mix',
       '4K 60FPS Master Deliverables'
     ],
     targetMarket: 'USA & United Kingdom'
   }
   ```
4. Save the file. The search and category filter will automatically index your new project.

---

## 🔐 Environment Variables

No required runtime API keys are needed for the static portfolio to function. For optional self-referential links or custom form webhooks:

- `APP_URL`: Base URL where the site is hosted (e.g., `https://ismail-sarder.netlify.app`).

---

## ⚖️ Truthful Representation & Portfolio Disclosure

In compliance with professional advertising standards:
- Portfolio pieces are clearly designated as **Spec Concepts / Benchmark Demonstrations** showcasing Ismail Sarder's copywriting, AI video pipelines, and visual direction.
- Client campaigns subject to non-disclosure agreements (NDAs) are withheld to protect client proprietary ad performance and media buying strategies.
