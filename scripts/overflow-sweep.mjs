// Horizontal-overflow sweep across every page in the build.
//
// It must run against a QA build, not ./dist. The captured pages reference the
// theme's CSS by absolute production URL, so a local server hands the browser
// HTML whose stylesheets it cannot fetch — and an unstyled page gives readings
// that are worse than useless. The first version of this script did exactly
// that and reported the opposite of the truth: it said /tube-size-guide/ was
// clean when it was scrolling the page sideways by 386px, and it invented a
// 34px form overflow that only existed without the theme's box-sizing.
//
//   SITE_ORIGIN=http://localhost:4325 OUT_DIR=./dist-qa npm run build
//   node scripts/overflow-sweep.mjs
//
// The off-canvas drawer is parked off-screen by design and is excluded.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.PORT || 4325);
const DIST = process.env.DIST_DIR || 'dist-qa';
const WIDTHS = (process.env.WIDTHS || '375,768,1440').split(',').map(Number);

if (!fs.existsSync(DIST)) {
  console.error(`${DIST} not found. Build it first:\n  SITE_ORIGIN=http://localhost:${PORT} OUT_DIR=./${DIST} npm run build`);
  process.exit(2);
}

const server = spawn('node', ['scripts/serve.mjs'],
  { env: { ...process.env, PORT: String(PORT), DIST_DIR: DIST }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1500));

const routes = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') {
      const r = path.relative(DIST, path.dirname(p));
      routes.push(r === '' ? '/' : '/' + r + '/');
    }
  }
})(DIST);
routes.sort();

const browser = await chromium.launch();
let fails = 0;
for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  let bad = 0;
  for (const r of routes) {
    await page.goto(`http://localhost:${PORT}${r}`, { waitUntil: 'load' }).catch(() => {});
    await page.waitForTimeout(150);
    const res = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const over = document.documentElement.scrollWidth - vw;
      if (over <= 0) return { over };
      const worst = [];
      document.querySelectorAll('body *').forEach((el) => {
        if (el.closest('.rishi-offcanvas-drawer')) return;
        const rc = el.getBoundingClientRect();
        if (rc.right > vw + 1 && rc.width > 0) {
          let d = 0; let p = el;
          while (p.parentElement) { d++; p = p.parentElement; }
          worst.push({ d, t: el.tagName.toLowerCase(), c: (el.className || '').toString().slice(0, 46) });
        }
      });
      worst.sort((a, b) => a.d - b.d);
      return { over, cause: worst[0] };
    });
    if (res.over > 0) {
      bad++; fails++;
      const c = res.cause ? `<${res.cause.t} class="${res.cause.c}">` : '(no in-flow element — check a fixed/absolute child)';
      console.log(`OVERFLOW ${String(res.over).padStart(4)}px @${width}  ${r}\n            cause: ${c}`);
    }
  }
  console.log(`${width}px: ${routes.length} pages, ${bad} overflowing`);
  await page.close();
}
await browser.close();
server.kill();
console.log(fails ? `\nFAILURES: ${fails}` : '\nno page-level horizontal overflow at any width');
process.exit(fails ? 1 : 0);
