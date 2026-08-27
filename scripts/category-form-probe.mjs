// Does the quote form added to the category pages actually work?
//
// Fills it in a real browser, intercepts the POST and ABORTS it, so nothing
// reaches the client's inbox. Checks three things:
//   1. Google's reCAPTCHA API loaded and the widget rendered — ttp.js refuses to
//      submit a form whose captcha has no response, so this is the failure mode
//      that would make the form look fine and never send.
//   2. The request goes to /api/form/.
//   3. The payload carries form_id 2bb183f5, the page's own referer_title, and
//      the page_url ttp.js appends — so a quote is attributable to the category
//      it came from.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const PORT = 4325;
const server = spawn('node', ['scripts/serve.mjs'],
  { env: { ...process.env, PORT: String(PORT), DIST_DIR: 'dist-qa' }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1500));

const ROUTES = [
  '/product-category/custom-cardboard-tubes/',
  '/product-category/mailing-tubes/',
  '/product-category/custom-paper-tubes/',
  '/product-category/specialty-tubes/',
  '/product-category/custom-plastic-tubes/',
  '/shop/',
];

const browser = await chromium.launch();
let fails = 0;
for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  let captured = null;
  await page.route('**/api/form/**', async (r) => {
    captured = r.request().postData() || '';
    await r.abort();                                  // never actually send
  });
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'load' }).catch(() => {});
  await page.waitForTimeout(2500);

  const state = await page.evaluate(() => ({
    forms: document.querySelectorAll('.ttp-cat__quoteForm form.elementor-form').length,
    apiLoaded: typeof window.grecaptcha !== 'undefined',
    widget: !!document.querySelector('.elementor-g-recaptcha iframe'),
  }));

  if (state.forms !== 1) { fails++; console.log(`FAIL ${route}: ${state.forms} forms`); await page.close(); continue; }
  if (!state.apiLoaded) { fails++; console.log(`FAIL ${route}: reCAPTCHA API did not load`); }
  if (!state.widget) { fails++; console.log(`FAIL ${route}: reCAPTCHA widget did not render`); }

  await page.fill('#ttp-cat-name', 'QA Probe');
  await page.fill('#ttp-cat-email', 'qa@example.invalid');
  await page.fill('#ttp-cat-message', 'Probe — intercepted and aborted, never sent.');
  // Stand in for a solved captcha. It has to be the textarea reCAPTCHA itself
  // renders, not an appended input: ttp.js reads
  // `form.querySelector('[name="g-recaptcha-response"]')`, which returns the
  // FIRST match — Google's own empty textarea — so a second field further down
  // the DOM is never seen. That is exactly the failure this probe exists to
  // catch, and it caught it on the first run.
  const filled = await page.evaluate(() => {
    const f = document.querySelector('.ttp-cat__quoteForm form');
    const t = f.querySelector('[name="g-recaptcha-response"]');
    if (!t) return false;
    t.value = 'qa-probe';
    return true;
  });
  if (!filled) { fails++; console.log(`FAIL ${route}: no g-recaptcha-response field to fill`); }
  await page.click('.ttp-cat__quoteForm button[type="submit"]');
  await page.waitForTimeout(1200);

  if (!captured) { fails++; console.log(`FAIL ${route}: no request to /api/form/`); await page.close(); continue; }
  const has = (k) => captured.includes(k);
  const ok = has('form_id') && has('2bb183f5') && has('referer_title') && has('page_url') && has('QA Probe');
  if (!ok) fails++;
  const title = (captured.match(/name="referer_title"\r?\n\r?\n(.*)/) || [])[1] || '?';
  console.log(`${ok ? 'PASS' : 'FAIL'} ${route.padEnd(44)} captcha=${state.widget} referer_title="${title.trim().slice(0, 46)}"`);
  await page.close();
}
await browser.close();
server.kill();
console.log(fails ? `\n${fails} failure(s)` : '\nthe category quote form submits correctly on every page');
process.exit(fails ? 1 : 0);
