// The chat widget must not load until someone interacts (or the page goes idle),
// and must still load when they do. Both halves matter: a widget that never
// appears is worse than one that loads early.
import { chromium, devices } from 'playwright';
import { spawn } from 'node:child_process';
const PORT = 4325;
const s = spawn('node', ['scripts/serve.mjs'],
  { env: { ...process.env, PORT: String(PORT), DIST_DIR: 'dist-qa' }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1500));
const b = await chromium.launch();
let fails = 0;
for (const route of ['/', '/product-category/custom-cardboard-tubes/', '/product/paper-tubes/']) {
  const ctx = await b.newContext({ ...devices['Pixel 5'] });
  const page = await ctx.newPage();
  const hits = [];
  page.on('request', (r) => { if (/zopim|zdassets|zendesk/i.test(r.url())) hits.push(r.url()); });

  // block idle boot from firing during the "before" window
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'load' });
  await page.waitForTimeout(1800);
  const before = hits.length;

  await page.mouse.move(200, 400);
  await page.mouse.down(); await page.mouse.up();
  await page.waitForTimeout(3500);
  const after = hits.length;

  const ok = before === 0 && after > 0;
  if (!ok) fails++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${route.padEnd(42)} before-interaction ${before} requests, after ${after}`);
  await ctx.close();
}
await b.close(); s.kill();
console.log(fails ? `\n${fails} failure(s)` : '\nchat loads only once someone interacts');
process.exit(fails ? 1 : 0);
