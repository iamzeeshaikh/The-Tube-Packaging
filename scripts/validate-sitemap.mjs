// The sitemap is generated from the build output, so this checks the invariant
// that made that worth doing: every indexable page is listed exactly once, and
// no noindex page is.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIR = process.env.OUT_DIR || './dist';
const SITE = 'https://thetubepackaging.com';
let fails = 0;
const bad = (m) => { fails++; console.log('FAIL ' + m); };

function walk(d, out = []) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (n === 'index.html') out.push(p);
  }
  return out;
}

if (!existsSync(join(DIR, 'sitemap.xml'))) { bad('no sitemap.xml in the build'); process.exit(1); }
const xml = readFileSync(join(DIR, 'sitemap.xml'), 'utf8');
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ''));
const listed = new Set(locs);
if (locs.length !== listed.size) bad(`${locs.length - listed.size} duplicate entries`);

const NOINDEX = /<meta[^>]*name=['"]robots['"][^>]*content=['"][^'"]*noindex/i;
const indexable = new Set(); const noindex = new Set();
for (const f of walk(DIR)) {
  const rel = relative(DIR, f).split(sep).slice(0, -1).join('/');
  const route = rel ? `/${rel}/` : '/';
  (NOINDEX.test(readFileSync(f, 'utf8')) ? noindex : indexable).add(route);
}
for (const r of indexable) if (!listed.has(r)) bad(`indexable page missing from the sitemap: ${r}`);
for (const r of listed) if (!indexable.has(r)) bad(`sitemap lists a page that is not an indexable build output: ${r}`);
for (const r of noindex) if (listed.has(r)) bad(`noindex page listed in the sitemap: ${r}`);

const noMod = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].filter((m) => !m[1].includes('<lastmod>')).length;
if (noMod) bad(`${noMod} entries without a lastmod`);

// the retired Yoast sitemaps must not be served any more
for (const old of ['sitemap_index.xml', 'page-sitemap.xml', 'post-sitemap.xml',
  'product-sitemap.xml', 'category-sitemap.xml', 'product_cat-sitemap.xml', 'author-sitemap.xml'])
  if (existsSync(join(DIR, old))) bad(`retired sitemap still emitted: ${old}`);

console.log(fails
  ? `\n${fails} failure(s)`
  : `\nsitemap.xml lists all ${indexable.size} indexable pages, none of the ${noindex.size} noindex pages, no duplicates`);
process.exit(fails ? 1 : 0);
