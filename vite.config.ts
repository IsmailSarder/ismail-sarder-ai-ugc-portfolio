import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';
import { NOT_FOUND_SEO, ROUTE_SEO_CONFIG, SITE_URL } from './src/lib/seo.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function seoStaticRoutesPlugin(): Plugin {
  return {
    name: 'seo-static-route-html',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) return;

      const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

      const buildRouteHtml = (
        routePath: string,
        title: string,
        description: string,
        keywords: string,
        robots?: string
      ) => {
        const canonicalUrl =
          robots?.includes('noindex')
            ? `${SITE_URL}/`
            : routePath === '/'
            ? `${SITE_URL}/`
            : `${SITE_URL}${routePath}`;
        const ogUrl = routePath === '/' ? `${SITE_URL}/` : `${SITE_URL}${routePath}`;

        let html = baseHtml;
        html = html.replace(
          /<title>[\s\S]*?<\/title>/,
          `<title>${escapeHtmlAttr(title)}</title>`
        );
        html = html.replace(
          /<meta\s+name="description"[\s\S]*?content="[^"]*"\s*\/>/,
          `<meta name="description" content="${escapeHtmlAttr(description)}" />`
        );
        html = html.replace(
          /<meta\s+name="keywords"[\s\S]*?content="[^"]*"\s*\/>/,
          `<meta name="keywords" content="${escapeHtmlAttr(keywords)}" />`
        );
        if (robots) {
          html = html.replace(
            /<meta\s+name="robots"\s+content="[^"]*"\s*\/>/,
            `<meta name="robots" content="${escapeHtmlAttr(robots)}" />`
          );
        }
        html = html.replace(
          /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
          `<link rel="canonical" href="${escapeHtmlAttr(canonicalUrl)}" />`
        );
        html = html.replace(
          /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
          `<meta property="og:url" content="${escapeHtmlAttr(ogUrl)}" />`
        );
        html = html.replace(
          /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
          `<meta property="og:title" content="${escapeHtmlAttr(title)}" />`
        );
        html = html.replace(
          /<meta\s+property="og:description"[\s\S]*?content="[^"]*"\s*\/>/,
          `<meta property="og:description" content="${escapeHtmlAttr(description)}" />`
        );
        html = html.replace(
          /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/>/,
          `<meta name="twitter:url" content="${escapeHtmlAttr(ogUrl)}" />`
        );
        html = html.replace(
          /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
          `<meta name="twitter:title" content="${escapeHtmlAttr(title)}" />`
        );
        html = html.replace(
          /<meta\s+name="twitter:description"[\s\S]*?content="[^"]*"\s*\/>/,
          `<meta name="twitter:description" content="${escapeHtmlAttr(description)}" />`
        );
        return html;
      };

      // Generate dedicated pre-tagged index.html for each indexable SEO sub-route
      for (const [routePath, config] of Object.entries(ROUTE_SEO_CONFIG)) {
        if (routePath === '/') continue;
        const cleanSubDir = routePath.replace(/^\/+/, '');
        const targetDir = path.join(distDir, cleanSubDir);
        fs.mkdirSync(targetDir, { recursive: true });
        fs.writeFileSync(
          path.join(targetDir, 'index.html'),
          buildRouteHtml(routePath, config.title, config.description, config.keywords, config.robots),
          'utf-8'
        );
      }

      // Generate noindex 404.html fallback
      fs.writeFileSync(
        path.join(distDir, '404.html'),
        buildRouteHtml(
          '/404',
          NOT_FOUND_SEO.title,
          NOT_FOUND_SEO.description,
          NOT_FOUND_SEO.keywords,
          NOT_FOUND_SEO.robots
        ),
        'utf-8'
      );
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), seoStaticRoutesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('/react-dom/') || id.includes('/react/')) return 'vendor-react';
            if (id.includes('/motion/') || id.includes('/framer-motion/')) return 'vendor-motion';
            if (id.includes('/@supabase/')) return 'vendor-supabase';
            if (id.includes('/lucide-react/')) return 'vendor-icons';
            return undefined;
          },
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
