/**
 * SEO baseline crawler.
 *
 * Crawls every URL in the production sitemap plus every URL in the Search
 * Console Pages export, and writes one row per URL to
 * reports/seo-baseline/baseline-YYYY-MM-DD.csv.
 *
 * The CSV is the rollback reference for the whole programme: every later stage
 * compares against it rather than re-crawling.
 *
 * Notes on method, so the numbers can be trusted:
 *
 * - Status and redirect chains come from real requests to production with
 *   redirects disabled, followed one hop at a time (max 6).
 * - Vercel's Attack Challenge Mode is active on this project and answers
 *   non-browser clients with 403 + `x-vercel-mitigated: challenge`. A 403
 *   carrying that header is recorded as `challenged`, never as a defect - a
 *   challenged URL is a crawler problem, not a page problem.
 * - Because of that, `--origin` can be pointed at a local server running the
 *   deployed build (`node scripts/serve.mjs`). Page facts are identical - it is
 *   the same static output - and the `url` column still carries the production
 *   URL so the GSC join and every later stage keep working. The `crawl_origin`
 *   column records which was used, so no row can be mistaken for a live check.
 * - Page facts are read out of a real DOM. The HTML is fetched over HTTP and
 *   handed to a browser page with every subresource aborted, so the parse is a
 *   browser parse without 400 pages of network.
 * - GSC figures are joined from data/gsc/pages.csv. That export has no
 *   query-to-page pairing, so nothing here can attribute a query to a URL.
 *
 * Usage:
 *   node scripts/seo-baseline.mjs [--origin https://thetubepackaging.com]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'reports', 'seo-baseline');
const GSC_PAGES = path.join(ROOT, 'data', 'gsc', 'pages.csv');

const argOrigin = process.argv.indexOf('--origin');
const ORIGIN = argOrigin > -1 ? process.argv[argOrigin + 1] : 'https://thetubepackaging.com';
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const COLUMNS = [
  'url', 'crawl_origin', 'http_status', 'redirect_chain', 'final_url', 'title', 'meta_description',
  'canonical', 'meta_robots', 'h1_count', 'h1_text', 'h2_list', 'word_count',
  'internal_link_count', 'external_link_count', 'image_srcs', 'images_missing_alt',
  'schema_types', 'product_id', 'sku', 'price', 'currency', 'availability', 'brand',
  'has_aggregate_rating', 'review_count', 'breadcrumb_present', 'ga4_present',
  'gtm_present', 'form_count', 'in_sitemap',
  'gsc_clicks', 'gsc_impressions', 'gsc_ctr', 'gsc_position',
];

/* ── tiny CSV ──────────────────────────────────────────────────────────── */

function csvCell(v) {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

/* ── inputs ────────────────────────────────────────────────────────────── */

async function sitemapUrls(api, toOrigin) {
  const seen = new Set();
  // /sitemap.xml is a Vercel rewrite onto /sitemap_index.xml, so a local origin
  // only answers the latter. Child <loc> values are absolute production URLs,
  // so they are re-pointed at the crawl origin before fetching.
  const queue = ['/sitemap.xml', '/sitemap_index.xml'];
  const found = new Set();
  while (queue.length) {
    const p = queue.shift();
    if (seen.has(p)) continue;
    seen.add(p);
    const res = await api.get(new URL(p, ORIGIN).href).catch(() => null);
    if (!res || !res.ok()) continue;
    const xml = await res.text();
    const isIndex = /<sitemapindex/i.test(xml);
    for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) {
      if (isIndex) queue.push(new URL(m[1]).pathname);
      else found.add(m[1]);
    }
  }
  return found;
}

function gscPages() {
  if (!fs.existsSync(GSC_PAGES)) {
    console.warn('  ! data/gsc/pages.csv missing - run scripts/gsc-export.py first');
    return new Map();
  }
  const rows = parseCsv(fs.readFileSync(GSC_PAGES, 'utf8'));
  const head = rows.shift().map((h) => h.trim().toLowerCase());
  const idx = (n) => head.indexOf(n);
  const out = new Map();
  for (const r of rows) {
    if (!r[idx('top pages')]) continue;
    out.set(r[idx('top pages')].trim(), {
      clicks: Math.round(Number(r[idx('clicks')] || 0)),
      impressions: Math.round(Number(r[idx('impressions')] || 0)),
      ctr: Number(r[idx('ctr')] || 0),
      position: Number(r[idx('position')] || 0),
    });
  }
  return out;
}

/* ── fetching ──────────────────────────────────────────────────────────── */

async function follow(api, url) {
  const chain = [];
  let current = url;
  for (let hop = 0; hop < 6; hop++) {
    let res;
    try {
      res = await api.get(current, { maxRedirects: 0, timeout: 45000 });
    } catch (err) {
      return { status: `ERR: ${String(err.message).split('\n')[0].slice(0, 80)}`, chain, final: current, body: null, type: '' };
    }
    const status = res.status();
    const loc = res.headers()['location'];
    if (status >= 300 && status < 400 && loc) {
      chain.push(`${status} ${current}`);
      current = new URL(loc, current).href;
      continue;
    }
    const type = res.headers()['content-type'] || '';
    if (status === 403 && res.headers()['x-vercel-mitigated'] === 'challenge') {
      return { status: 'challenged', chain, final: current, body: null, type };
    }
    const body = type.includes('html') ? await res.text() : null;
    return { status, chain, final: current, body, type };
  }
  return { status: 'redirect-loop', chain, final: current, body: null, type: '' };
}

async function pool(items, size, worker) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (true) {
        const i = next++;
        if (i >= items.length) return;
        out[i] = await worker(items[i], i);
      }
    })
  );
  return out;
}

/* ── DOM extraction ────────────────────────────────────────────────────── */

const EXTRACT = (origin) => {
  const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  const attr = (sel, a) => document.querySelector(sel)?.getAttribute(a) || '';

  const h1s = [...document.querySelectorAll('h1')];
  const links = [...document.querySelectorAll('a[href]')];
  let internal = 0, external = 0;
  for (const a of links) {
    const href = a.getAttribute('href') || '';
    if (/^(mailto:|tel:|javascript:|#)/i.test(href)) continue;
    let abs;
    try { abs = new URL(href, origin); } catch { continue; }
    if (abs.origin === origin || abs.hostname === new URL(origin).hostname) internal++;
    else external++;
  }

  const imgs = [...document.querySelectorAll('img')];
  const missingAlt = imgs.filter((i) => !i.hasAttribute('alt') || !i.getAttribute('alt').trim()).length;

  // JSON-LD, flattened through @graph
  const nodes = [];
  for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
    let data;
    try { data = JSON.parse(s.textContent); } catch { continue; }
    const push = (d) => {
      if (Array.isArray(d)) return d.forEach(push);
      if (!d || typeof d !== 'object') return;
      nodes.push(d);
      if (d['@graph']) push(d['@graph']);
    };
    push(data);
  }
  const typeOf = (n) => (Array.isArray(n['@type']) ? n['@type'].join('+') : n['@type'] || '');
  const types = [...new Set(nodes.map(typeOf).filter(Boolean))];
  const product = nodes.find((n) => typeOf(n).includes('Product')) || null;
  const offer = product
    ? (Array.isArray(product.offers) ? product.offers[0] : product.offers) || null
    : null;
  const rating = product?.aggregateRating || null;

  const body = document.body ? document.body.innerText.replace(/\s+/g, ' ').trim() : '';

  const html = document.documentElement.outerHTML;

  return {
    title: txt(document.querySelector('title')),
    meta_description: attr('meta[name="description"]', 'content'),
    canonical: attr('link[rel="canonical"]', 'href'),
    meta_robots: attr('meta[name="robots"]', 'content'),
    h1_count: h1s.length,
    h1_text: h1s.map(txt).join(' | '),
    h2_list: [...document.querySelectorAll('h2')].map(txt).filter(Boolean).join(' | '),
    word_count: body ? body.split(/\s+/).length : 0,
    internal_link_count: internal,
    external_link_count: external,
    image_srcs: imgs.map((i) => i.getAttribute('src') || '').filter(Boolean).join(' '),
    images_missing_alt: missingAlt,
    schema_types: types.join('+'),
    product_id: product?.productID || product?.['@id'] || '',
    sku: product?.sku || '',
    price: offer?.price ?? '',
    currency: offer?.priceCurrency || '',
    availability: offer?.availability || '',
    brand: (typeof product?.brand === 'object' ? product?.brand?.name : product?.brand) || '',
    has_aggregate_rating: rating ? 'yes' : 'no',
    review_count: rating?.reviewCount ?? rating?.ratingCount ?? '',
    breadcrumb_present: types.some((t) => t.includes('BreadcrumbList')) ? 'yes' : 'no',
    ga4_present: /gtag\(|googletagmanager\.com\/gtag|G-[A-Z0-9]{8,}/.test(html) ? 'yes' : 'no',
    gtm_present: /GTM-[A-Z0-9]+/.test(html) ? 'yes' : 'no',
    form_count: document.querySelectorAll('form').length,
  };
};

/* ── main ──────────────────────────────────────────────────────────────── */

const browser = await chromium.launch();
const context = await browser.newContext({ userAgent: UA, ignoreHTTPSErrors: true });
// clear the bot challenge once, in a real page, so the shared cookie jar carries
// the clearance into every request below
if (ORIGIN.startsWith('https://')) {
  const primer = await context.newPage();
  await primer.goto(ORIGIN, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await primer.waitForTimeout(4000);
  await primer.close();
}
const api = context.request;

console.log(`origin: ${ORIGIN}`);
const smUrls = await sitemapUrls(api);
console.log(`sitemap URLs: ${smUrls.size}`);
const gsc = gscPages();
console.log(`GSC page rows: ${gsc.size}`);

const PROD = 'https://thetubepackaging.com';
/** production URL -> the URL actually requested (same path on the crawl origin) */
const target = (u) => (ORIGIN === PROD ? u : new URL(new URL(u).pathname + new URL(u).search, ORIGIN).href);

const all = [...new Set([...smUrls, ...gsc.keys()])]
  .map((u) => (u.startsWith(ORIGIN) && ORIGIN !== PROD ? PROD + new URL(u).pathname + new URL(u).search : u))
  .filter((u, i, a) => a.indexOf(u) === i)
  .sort();
console.log(`unique URLs to crawl: ${all.length}`);

let done = 0;
const fetched = await pool(all, 4, async (url) => {
  const r = await follow(api, target(url));
  if (++done % 50 === 0) console.log(`  fetched ${done}/${all.length}`);
  return { url, ...r };
});
// anything challenged gets a second pass, paced, through a real page
const challenged = fetched.filter((f) => f.status === 'challenged');
if (challenged.length) {
  console.log(`re-checking ${challenged.length} challenged URL(s) through a page`);
  const probe = await context.newPage();
  for (const f of challenged) {
    await probe.waitForTimeout(400);
    const res = await probe.goto(target(f.url), { waitUntil: 'commit', timeout: 45000 }).catch(() => null);
    if (!res) continue;
    if (res.status() === 403 && res.headers()['x-vercel-mitigated'] === 'challenge') continue;
    f.status = res.status();
    f.final = res.url();
    const type = res.headers()['content-type'] || '';
    if (type.includes('html')) f.body = await res.text().catch(() => null);
  }
  await probe.close();
}

const page = await context.newPage();
await page.route('**/*', (r) => (r.request().url().startsWith('data:') ? r.continue() : r.abort()));

const rows = [];
for (const f of fetched) {
  const g = gsc.get(f.url);
  const row = {
    url: f.url,
    crawl_origin: ORIGIN,
    http_status: f.status,
    redirect_chain: f.chain.join(' -> '),
    final_url: f.final,
    in_sitemap: smUrls.has(f.url) ? 'yes' : 'no',
    gsc_clicks: g ? g.clicks : '',
    gsc_impressions: g ? g.impressions : '',
    gsc_ctr: g ? g.ctr : '',
    gsc_position: g ? g.position : '',
  };
  if (f.body) {
    await page.setContent(f.body, { waitUntil: 'commit' });
    Object.assign(row, await page.evaluate(EXTRACT, ORIGIN));
  }
  rows.push(row);
}
await browser.close();

fs.mkdirSync(OUT_DIR, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
const dest = path.join(OUT_DIR, `baseline-${stamp}.csv`);
const lines = [COLUMNS.join(',')];
for (const r of rows) lines.push(COLUMNS.map((c) => csvCell(r[c])).join(','));
fs.writeFileSync(dest, lines.join('\n') + '\n');

const non200 = rows.filter((r) => String(r.http_status) !== '200');
const stillChallenged = rows.filter((r) => r.http_status === 'challenged');
const html = rows.filter((r) => r.title !== undefined);
console.log(`\nwrote ${path.relative(ROOT, dest)}  (${rows.length} rows)`);
console.log(`  HTML pages parsed : ${html.length}`);
console.log(`  non-200           : ${non200.length}`);
console.log(`  still challenged  : ${stillChallenged.length}  (bot mitigation, not a page defect)`);
console.log(`  missing title     : ${html.filter((r) => !r.title).length}`);
console.log(`  missing canonical : ${html.filter((r) => !r.canonical).length}`);
console.log(`  missing meta desc : ${html.filter((r) => !r.meta_description).length}`);
console.log(`  no schema         : ${html.filter((r) => !r.schema_types).length}`);
console.log(`  h1 != 1           : ${html.filter((r) => r.h1_count !== 1).length}`);
