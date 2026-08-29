/*
 * One flat sitemap, written from the build output.
 *
 * The site previously served a Yoast-style sitemap index with six child files
 * kept by hand in public/. Two of them had drifted -- pages existed that no
 * sitemap listed -- and the author sitemap had emptied out, which Search
 * Console reports as an error. Generating it from the emitted HTML removes the
 * whole class of problem: a page that is built and indexable is in the sitemap
 * by construction, and a noindex page cannot be.
 *
 * lastmod comes from the page's own modified date where it publishes one, so
 * regenerating the file does not reset every date to today.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
// dir is a URL; its pathname is percent-encoded, so a project path containing a
// space fails to scandir. fileURLToPath decodes it.
import { fileURLToPath } from 'node:url';

const SITE = 'https://thetubepackaging.com';

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name === 'index.html') out.push(p);
  }
  return out;
}

// the theme writes robots with single quotes, so match either
const NOINDEX = /<meta[^>]*name=['"]robots['"][^>]*content=['"][^'"]*noindex/i;
const MODIFIED = [
  /<meta[^>]*property=['"]article:modified_time['"][^>]*content=['"]([^'"]+)['"]/i,
  /"dateModified"\s*:\s*"([^"]+)"/,
  /<meta[^>]*property=['"]article:published_time['"][^>]*content=['"]([^'"]+)['"]/i,
];

export function flatSitemap({ fallbackDate }) {
  return {
    name: 'ttp-flat-sitemap',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const root = fileURLToPath(dir).replace(/[/\\]$/, '');
        const rows = [];
        let skipped = 0;
        for (const file of walk(root)) {
          const html = readFileSync(file, 'utf8');
          if (NOINDEX.test(html)) { skipped += 1; continue; }
          const rel = relative(root, file).split(sep).slice(0, -1).join('/');
          const route = rel ? `/${rel}/` : '/';
          let mod = fallbackDate;
          for (const re of MODIFIED) {
            const m = re.exec(html);
            if (m) { mod = m[1]; break; }
          }
          rows.push({ route, mod });
        }
        rows.sort((a, b) => (a.route === '/' ? -1 : b.route === '/' ? 1 : a.route.localeCompare(b.route)));
        const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
          + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
          + rows.map((r) => `  <url>\n    <loc>${SITE}${r.route}</loc>\n    <lastmod>${r.mod}</lastmod>\n  </url>`).join('\n')
          + '\n</urlset>\n';
        writeFileSync(join(root, 'sitemap.xml'), xml);
        logger.info(`sitemap.xml: ${rows.length} indexable URLs, ${skipped} noindex pages skipped`);
      },
    },
  };
}
