// Compares the *rendered* page -- after scripts have run -- between the live
// WordPress site and the local Astro build: page errors, failed requests, and
// the runtime state only JavaScript produces (gallery slider, entrance
// animations, sticky header, WhatsApp widget, forms, menus).
//
//   node scripts/runtime-check.mjs live    # capture the live baseline (slow, gentle)
//   node scripts/runtime-check.mjs         # capture local + diff against baseline
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const REPORTS = path.join(ROOT, 'reports');
const BASELINE = path.join(REPORTS, 'runtime-live.json');
const LOCAL = process.env.LOCAL_ORIGIN || 'http://localhost:4399';
const LIVE = 'https://thetubepackaging.com';
const MODE = process.argv[2] === 'live' ? 'live' : 'local';

const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/pages.json'), 'utf8'));

const probe = () => ({
  gallerySlides: document.querySelectorAll('.woocommerce-product-gallery__image').length,
  galleryThumbs: document.querySelectorAll('.flex-control-thumbs li').length,
  galleryOpacity: (() => {
    const g = document.querySelector('.woocommerce-product-gallery');
    return g ? getComputedStyle(g).opacity : null;
  })(),
  flexViewport: document.querySelectorAll('.flex-viewport').length,
  zoomImg: document.querySelectorAll('img.zoomImg').length,
  stillInvisible: document.querySelectorAll('.elementor-invisible').length,
  animatedEls: document.querySelectorAll('.animated').length,
  stickyHeaders: document.querySelectorAll('.sticky-header').length,
  joinchatReady: !!document.querySelector('.joinchat[data-settings]'),
  forms: [...document.querySelectorAll('form.elementor-form')].map((f) => ({
    id: (f.querySelector('input[name=form_id]') || {}).value,
    fields: [...f.querySelectorAll('input,textarea,select')]
      .map((i) => i.name + ':' + (i.type || i.tagName) + (i.required ? ':req' : '')).join('|'),
  })),
  offcanvasHidden: document.querySelector('#rishi-offcanvas')?.getAttribute('aria-hidden') ?? null,
  searchModals: document.querySelectorAll('.search-toggle-form').length,
  menuItems: document.querySelectorAll('#menu-main-menu > li').length,
  subMenus: document.querySelectorAll('#menu-main-menu .sub-menu').length,
  bodyClass: [...document.body.classList].sort().join(' '),
  brokenImages: [...document.images]
    .filter((i) => i.complete && i.naturalWidth === 0)
    .map((i) => (i.currentSrc || i.src).replace(location.origin, '').replace('https://thetubepackaging.com', '')),
  imageCount: document.images.length,
});

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

async function visit(browser, url, attempt = 0) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, userAgent: UA });
  const page = await ctx.newPage();
  const errors = [];
  const failed = [];
  page.on('pageerror', (e) => errors.push(String(e).split('\n')[0].slice(0, 160)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 160)); });
  page.on('requestfailed', (r) => failed.push('failed ' + r.url().slice(0, 150)));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url().slice(0, 150)); });
  let result = null;
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 120000 });
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    result = await page.evaluate(probe);
  } catch (e) {
    await ctx.close();
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 8000 * (attempt + 1)));
      return visit(browser, url, attempt + 1);
    }
    return { result: { FATAL: String(e).split('\n')[0].slice(0, 160) }, errors, failed };
  }
  await ctx.close();
  return { result, errors: [...new Set(errors)], failed: [...new Set(failed)] };
}

const IGNORE_HOSTS = /google|gstatic|zopim|zdassets|doubleclick|omnisend|recaptcha|cloudflareinsights/;

const browser = await chromium.launch();
const slugs = Object.keys(pages).sort();
fs.mkdirSync(REPORTS, { recursive: true });

if (MODE === 'live') {
  const out = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : {};
  for (const slug of slugs) {
    if (out[slug]?.result?.bodyClass) { console.log('cached', slug); continue; }
    const v = await visit(browser, LIVE + pages[slug].route);
    out[slug] = v;
    fs.writeFileSync(BASELINE, JSON.stringify(out, null, 1));
    console.log((v.result.FATAL ? 'FATAL ' : 'ok    ') + pages[slug].route);
    await new Promise((r) => setTimeout(r, 12000)); // stay well under Cloudflare's rate limit
  }
} else {
  const live = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  const report = {};
  for (const slug of slugs) {
    const local = await visit(browser, LOCAL + pages[slug].route);
    const diffs = {};
    const base = live[slug]?.result || {};
    for (const key of Object.keys(local.result)) {
      if (JSON.stringify(base[key]) !== JSON.stringify(local.result[key])) {
        diffs[key] = { live: base[key], astro: local.result[key] };
      }
    }
    report[slug] = {
      route: pages[slug].route,
      diffs,
      astroErrors: local.errors,
      astroFailedRequests: local.failed.filter((u) => !IGNORE_HOSTS.test(u)),
      liveErrors: live[slug]?.errors || [],
    };
    const bad = Object.keys(diffs).length + report[slug].astroErrors.length +
      report[slug].astroFailedRequests.length;
    console.log((bad ? 'DIFF ' : 'ok   ') + pages[slug].route +
      (bad ? '  ' + JSON.stringify(Object.keys(diffs)) : ''));
  }
  fs.writeFileSync(path.join(REPORTS, 'runtime.json'), JSON.stringify(report, null, 1));
  const clean = slugs.filter((s) => !Object.keys(report[s].diffs).length &&
    !report[s].astroErrors.length && !report[s].astroFailedRequests.length);
  console.log(`\nclean pages: ${clean.length} / ${slugs.length}`);
}
await browser.close();
