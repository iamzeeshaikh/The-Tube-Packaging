// The editorial sections add wide tables. Wide content must scroll inside its
// own box; the page body must never scroll horizontally. Checked in a real
// browser at three widths against the built site.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const PORT = 4319;
const server = spawn('node', ['scripts/serve.mjs'], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1200));

const ROUTES = [
  '/product-category/custom-cardboard-tubes/', '/product-category/mailing-tubes/',
  '/product-category/custom-paper-tubes/', '/product-category/specialty-tubes/',
  '/product-category/custom-plastic-tubes/', '/shop/', '/tube-size-guide/',
];
const WIDTHS = [375, 768, 1440];
const browser = await chromium.launch();
let fails = 0;
for (const w of WIDTHS) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  for (const r of ROUTES) {
    await page.goto(`http://localhost:${PORT}${r}`, { waitUntil: 'domcontentloaded' });
    const res = await page.evaluate(() => {
      const de = document.documentElement;
      const wide = [...document.querySelectorAll('.ttp-cat__tableWrap')]
        .filter((el) => el.scrollWidth > el.clientWidth + 1).length;
      const tables = document.querySelectorAll('.ttp-cat__table').length;
      const faqs = document.querySelectorAll('.ttp-cat__faq').length;
      return { over: de.scrollWidth - de.clientWidth, wide, tables, faqs };
    });
    const ok = res.over <= 0;
    if (!ok) { fails++; console.log(`FAIL ${w}px ${r} body overflows by ${res.over}px`); }
    if (w === 375) console.log(`  375px ${r.padEnd(42)} tables=${res.tables} scrolling=${res.wide} faqs=${res.faqs} bodyOverflow=${res.over}`);
  }
  await page.close();
}
await browser.close();
server.kill();
console.log(fails ? `\nFAILURES: ${fails}` : '\nno page-level horizontal overflow at 375 / 768 / 1440px');
process.exit(fails ? 1 : 0);
