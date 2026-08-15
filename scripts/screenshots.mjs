// Phase 4 -- full-page screenshots of live vs Astro at 1440 / 768 / 390 and a
// per-page pixel diff.
//
//   node scripts/screenshots.mjs live     # capture the live site (gentle, resumable)
//   node scripts/screenshots.mjs local    # capture the local build
//   node scripts/screenshots.mjs diff     # compare and write reports/visual.json
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SHOTS = path.join(ROOT, 'reports', 'screenshots');
const LOCAL = process.env.LOCAL_ORIGIN || 'http://localhost:4399';
const LIVE = 'https://thetubepackaging.com';
const MODE = process.argv[2] || 'diff';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'tablet', width: 768, height: 1024, mobile: true },
  { name: 'mobile', width: 390, height: 844, mobile: true },
];

// headless Chrome's default UA trips the live host's bot rule on some URLs
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/pages.json'), 'utf8'));
const slugs = Object.keys(pages).sort();

// ------------------------------------------------------------------ capture
// 'live'    -> the live site over the network
// 'snapshot' -> the captured live HTML replayed from the QA server, used where
//               the live host rate-limits automated screenshot traffic
// 'local'    -> the Astro build
async function capture(which) {
  const origin = which === 'live' ? LIVE : LOCAL;
  const prefix = which === 'snapshot' ? '/__live' : '';
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    const dir = path.join(SHOTS, vp.name, which);
    fs.mkdirSync(dir, { recursive: true });
    for (const slug of slugs) {
      const file = path.join(dir, slug + '.png');
      if (fs.existsSync(file) && fs.statSync(file).size > 1000) continue;
      const ctx = await browser.newContext({
        userAgent: UA,
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.mobile,
        hasTouch: vp.mobile,
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      try {
        await page.goto(origin + prefix + pages[slug].route, { waitUntil: 'load', timeout: 120000 });
        // settle: run every entrance animation, load every lazy image, then
        // freeze animations so the two sides are comparable
        await page.evaluate(async () => {
          await new Promise((r) => setTimeout(r, 800));
          for (let y = 0; y < document.body.scrollHeight; y += 600) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 60));
          }
          window.scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 800));
        });
        await page.addStyleTag({
          // reCAPTCHA is loaded from Google and reserves its space whenever it
          // happens to arrive, so it is excluded from the pixel comparison; that
          // it renders is asserted separately by validate.py and runtime-check.
          content: `*,*::before,*::after{animation:none!important;transition:none!important}
                    .elementor-invisible{opacity:1!important}
                    .joinchat{display:none!important}
                    .elementor-g-recaptcha,.grecaptcha-badge{display:none!important}`,
        });
        await page.waitForTimeout(600);
        // The live host answers some requests with a 403 interstitial. Those
        // render as a bare viewport-height page, so check the page really is
        // the site before keeping the screenshot.
        const rendered = await page.evaluate(() =>
          document.querySelectorAll('#menu-main-menu > li').length);
        if (rendered < 6) throw new Error('page did not render (menu items: ' + rendered + ')');
        await page.screenshot({ path: file, fullPage: true });
        process.stdout.write('.');
      } catch (e) {
        console.log('\nFAIL', vp.name, slug, String(e).split('\n')[0].slice(0, 90));
        if (fs.existsSync(file)) fs.unlinkSync(file);
      }
      await ctx.close();
      if (which === 'live') await new Promise((r) => setTimeout(r, Number(process.env.LIVE_DELAY_MS || 1200)));
      if (which === 'snapshot') await new Promise((r) => setTimeout(r, 150));
    }
    console.log('\n' + which + ' ' + vp.name + ' done');
  }
  await browser.close();
}

// --------------------------------------------------------------------- diff
// Minimal PNG reader: enough for the RGBA8 images Chromium writes.
function readPNG(file) {
  const buf = fs.readFileSync(file);
  let pos = 8;
  let width = 0, height = 0, bitDepth = 0, colorType = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += len + 12;
  }
  const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
  if (bitDepth !== 8 || !channels) throw new Error('unsupported PNG in ' + file);
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);
  let rp = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[rp++];
    const line = raw.subarray(rp, rp + stride);
    rp += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y ? out.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? cur[x - channels] : 0;
      const b = prev[x];
      const c = x >= channels ? prev[x - channels] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      cur[x] = v & 0xff;
    }
  }
  return { width, height, channels, data: out };
}

function comparePNG(fileA, fileB) {
  const a = readPNG(fileA);
  const b = readPNG(fileB);
  const w = Math.min(a.width, b.width);
  const h = Math.min(a.height, b.height);
  let diff = 0;
  const rows = new Map();
  for (let y = 0; y < h; y++) {
    let rowDiff = 0;
    for (let x = 0; x < w; x++) {
      const ia = (y * a.width + x) * a.channels;
      const ib = (y * b.width + x) * b.channels;
      if (Math.abs(a.data[ia] - b.data[ib]) > 12 ||
          Math.abs(a.data[ia + 1] - b.data[ib + 1]) > 12 ||
          Math.abs(a.data[ia + 2] - b.data[ib + 2]) > 12) rowDiff++;
    }
    if (rowDiff > w * 0.02) rows.set(y, rowDiff);
    diff += rowDiff;
  }
  const bands = [];
  let start = null, last = null;
  for (const y of [...rows.keys()].sort((p, q) => p - q)) {
    if (start === null) { start = y; last = y; continue; }
    if (y - last > 20) { bands.push([start, last]); start = y; }
    last = y;
  }
  if (start !== null) bands.push([start, last]);
  return {
    sizeLive: [a.width, a.height],
    sizeAstro: [b.width, b.height],
    heightDelta: b.height - a.height,
    diffPixels: diff,
    diffPercent: +(100 * diff / (w * h)).toFixed(3),
    diffBands: bands.slice(0, 12),
  };
}

if (MODE === 'live' || MODE === 'local' || MODE === 'snapshot') {
  await capture(MODE);
} else {
  const report = {};
  for (const vp of VIEWPORTS) {
    for (const slug of slugs) {
      const B = path.join(SHOTS, vp.name, 'local', slug + '.png');
      const entry = {};
      // 'snapshot' replays the same captured HTML the build was made from, so
      // it isolates migration differences from the product grids, which
      // WooCommerce and Essential Addons order randomly per request.
      for (const ref of ['snapshot', 'live']) {
        const A = path.join(SHOTS, vp.name, ref, slug + '.png');
        if (fs.existsSync(A) && fs.existsSync(B)) entry['vs_' + ref] = comparePNG(A, B);
      }
      if (!Object.keys(entry).length) entry.missing = !fs.existsSync(B) ? 'local' : 'reference';
      (report[slug] ||= {})[vp.name] = entry;
    }
    console.log(vp.name + ' compared');
  }
  fs.writeFileSync(path.join(ROOT, 'reports/visual.json'), JSON.stringify(report, null, 1));
  for (const ref of ['snapshot', 'live']) {
    const rows = [];
    for (const [slug, vps] of Object.entries(report)) {
      for (const [vp, r] of Object.entries(vps)) {
        const d = r['vs_' + ref];
        if (!d) continue;
        rows.push([d.diffPercent, slug, vp,
          `diff ${d.diffPercent}%  height ${d.sizeLive[1]} -> ${d.sizeAstro[1]}`]);
      }
    }
    rows.sort((a, b) => b[0] - a[0]);
    console.log(`\n=== vs ${ref}: ${rows.length} comparisons, ` +
      `${rows.filter((r) => r[0] < 1).length} under 1%, ` +
      `${rows.filter((r) => r[0] < 0.2).length} under 0.2%`);
    for (const r of rows.slice(0, 10)) console.log(`  ${r[1]} [${r[2]}] ${r[3]}`);
  }
}
