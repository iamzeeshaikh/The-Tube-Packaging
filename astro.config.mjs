// @ts-check
import { defineConfig } from 'astro/config';

// SITE_ORIGIN lets the QA harness build a copy whose absolute asset URLs point
// at localhost. Production builds must always use the real domain.
const site = process.env.SITE_ORIGIN || 'https://thetubepackaging.com';

export default defineConfig({
  site,
  outDir: process.env.OUT_DIR || './dist',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: false,
  devToolbar: { enabled: false },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
