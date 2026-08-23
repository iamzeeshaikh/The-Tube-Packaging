/**
 * Capture what a product quote form actually POSTs, without delivering it.
 *
 * Fills the visible fields in a real browser, intercepts the request to
 * /api/form and prints its body, then aborts it. Nothing reaches the server, so
 * this proves the payload without sending real quote emails to the business.
 *
 * Usage: node scripts/form-payload-probe.mjs [origin]
 */
import { chromium } from 'playwright';

const ORIGIN = process.argv[2] || 'http://127.0.0.1:4321';
const SLUGS = [
  'paper-tubes', 'cosmetic-tubes', 'kraft-mailing-tubes',
  'luxury-tube-packaging', 'large-cardboard-tubes',
];

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.route('**/*', (r) => {
  const u = new URL(r.request().url());
  if (u.hostname === '127.0.0.1' || u.hostname === 'localhost') return r.continue();
  if (u.hostname === 'thetubepackaging.com') {
    return ctx.request.fetch(ORIGIN + u.pathname + u.search, { maxRedirects: 3 })
      .then((res) => r.fulfill({ response: res })).catch(() => r.abort());
  }
  return r.abort();
});

for (const slug of SLUGS) {
  await page.goto(`${ORIGIN}/product/${slug}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  const form = page.locator('form.elementor-form').first();
  await form.locator('input[name="form_fields[name]"]').fill('Test Buyer');
  await form.locator('input[name="form_fields[email]"]').fill('test@example.com');
  const phone = form.locator('input[type="tel"]');
  if (await phone.count()) await phone.first().fill('5033580443');
  const product = form.locator('input[name="form_fields[field_a858f27]"]');
  if (await product.count()) await product.first().fill('12 x 60mm kraft tube');
  const msg = form.locator('textarea');
  if (await msg.count()) await msg.first().fill('Quantity 2,000. Please quote.');

  // ttp.js refuses to submit while the reCAPTCHA checkbox is unanswered, and
  // Google's api.js is blocked here on purpose. Plant the response field the
  // widget would have written so the real submit path runs. The server still
  // verifies the token, which is why this request is aborted rather than sent.
  await page.evaluate(() => {
    const box = document.querySelector('form.elementor-form .elementor-g-recaptcha');
    if (box && !box.querySelector('[name="g-recaptcha-response"]')) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'g-recaptcha-response';
      input.value = 'PROBE-NOT-A-REAL-TOKEN';
      box.appendChild(input);
    }
  });

  let captured = null;
  await page.route('**/api/**', async (route) => {
    captured = route.request().postData() || '(no body)';
    await route.abort();           // never delivered
  });

  await form.locator('button[type="submit"]').first().click().catch(() => {});
  await page.waitForTimeout(1500);
  await page.unroute('**/api/**');

  console.log(`\n===== /product/${slug}/ =====`);
  if (!captured) {
    console.log('  (no POST captured - form did not submit; reCAPTCHA may block it)');
    continue;
  }
  for (const line of captured.split(/\r?\n/)) {
    const m = line.match(/name="([^"]+)"/);
    if (m) process.stdout.write(`  ${m[1]} = `);
    else if (line.trim() && !line.startsWith('--') && !/^Content-/i.test(line)) console.log(line.trim());
  }
}
await browser.close();
