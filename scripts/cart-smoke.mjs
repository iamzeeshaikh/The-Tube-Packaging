// D8 safety net: the add-to-cart buttons must still work after their hrefs were
// pointed at the clean product URL. Three shapes are exercised — a home page
// tile, a category loop button, and the Elementor button on a product page,
// which is the one that still relies on the href.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const PORT = 4325;
const s = spawn('node', ['scripts/serve.mjs'], { env: { ...process.env, PORT: String(PORT), DIST_DIR: 'dist-qa' }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1500));
const b = await chromium.launch();
let fails = 0;
const cases = [
  ['/', '.products a.add_to_cart_button', 'home tile'],
  ['/product-category/custom-cardboard-tubes/', '.products a.add_to_cart_button', 'category loop button'],
  ['/product/paper-tubes/', 'a.elementor-button[href*="add-to-cart="], a[rel="nofollow"][href*="add-to-cart="]', 'Elementor product button'],
];
for (const [route, sel, label] of cases) {
  const page = await b.newPage();
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.waitForTimeout(400);
  const btn = await page.$(sel);
  if (!btn) { console.log(`FAIL ${label}: no button matched ${sel}`); fails++; await page.close(); continue; }
  const before = page.url();
  // the theme reveals loop buttons on hover, so dispatch the click rather than
  // fight visibility — the handler is delegated on document either way
  await page.$eval(sel, (el) => el.click());
  await page.waitForTimeout(700);
  const res = await page.evaluate(() => {
    const raw = Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)])
      .find(([, v]) => v && v.includes('"id"') || (v && /\d/.test(v) && v.length > 2));
    return { url: location.href, keys: Object.keys(localStorage), raw: raw ? raw[1].slice(0, 90) : null };
  });
  const navigated = res.url !== before;
  const stored = !!res.raw;
  const ok = stored && !navigated;
  if (!ok) fails++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label.padEnd(26)} stored=${stored} navigated=${navigated} cart=${res.raw}`);
  await page.close();
}
await b.close(); s.kill();
console.log(fails ? `\n${fails} failure(s)` : '\nall add-to-cart buttons still work');
process.exit(fails ? 1 : 0);
