// @ts-check
import { defineConfig } from 'astro/config';
import { flatSitemap } from './src/lib/sitemap-integration.mjs';

// SITE_ORIGIN lets the QA harness build a copy whose absolute asset URLs point
// at localhost. Production builds must always use the real domain.
const site = process.env.SITE_ORIGIN || 'https://thetubepackaging.com';

export default defineConfig({
  site,
  // one flat /sitemap.xml, generated from the build output rather than kept by
  // hand; see src/lib/sitemap-integration.mjs
  integrations: [flatSitemap({ fallbackDate: '2026-08-29T00:00:00+00:00' })],
  outDir: process.env.OUT_DIR || './dist',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: false,
  devToolbar: { enabled: false },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
