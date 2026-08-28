// LCP element, CLS sources and third-party weight, measured in a throttled
// mobile browser against whatever origin is passed in.
import { chromium, devices } from 'playwright';
const ORIGIN = process.argv[2] || 'https://thetubepackaging.com';
const ROUTES = process.argv.slice(3).length ? process.argv.slice(3) : ['/'];
const b = await chromium.launch();
for (const route of ROUTES) {
  const ctx = await b.newContext({ ...devices['Pixel 5'] });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false, downloadThroughput: 1.6 * 1024 * 1024 / 8,
    uploadThroughput: 750 * 1024 / 8, latency: 150,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  const bytes = [];
  page.on('response', async (r) => {
    try {
      const h = r.headers();
      bytes.push({ host: new URL(r.url()).host, path: new URL(r.url()).pathname,
        size: Number(h['content-length'] || 0),
        type: (h['content-type'] || '').split(';')[0] });
    } catch {}
  });

  await page.addInitScript(() => {
    window.__lcp = null; window.__cls = 0; window.__shifts = [];
    new PerformanceObserver((l) => {
      const e = l.getEntries().at(-1);
      window.__lcp = { t: e.startTime, url: e.url || '',
        tag: e.element ? e.element.tagName : '',
        cls: e.element ? (e.element.className || '').toString().slice(0, 60) : '',
        txt: e.element ? (e.element.textContent || '').trim().slice(0, 60) : '' };
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        if (e.hadRecentInput) continue;
        window.__cls += e.value;
        for (const s of e.sources || []) {
          window.__shifts.push({ v: e.value,
            tag: s.node ? s.node.tagName : '?',
            cls: s.node ? (s.node.className || '').toString().slice(0, 60) : '' });
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto(ORIGIN + route, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(6000);
  const m = await page.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls, shifts: window.__shifts.slice(0, 4) }));

  console.log(`\n=== ${route}`);
  console.log(`  LCP  ${(m.lcp ? m.lcp.t / 1000 : 0).toFixed(2)}s  <${(m.lcp?.tag || '?').toLowerCase()} class="${m.lcp?.cls || ''}">`);
  if (m.lcp?.url) console.log(`       ${m.lcp.url.replace(ORIGIN, '').slice(0, 80)}`);
  if (m.lcp?.txt) console.log(`       text: ${m.lcp.txt}`);
  console.log(`  CLS  ${m.cls.toFixed(3)}`);
  for (const s of m.shifts) console.log(`       shift ${s.v.toFixed(3)} <${s.tag.toLowerCase()} class="${s.cls}">`);

  const byHost = {};
  for (const r of bytes) { byHost[r.host] = (byHost[r.host] || 0) + r.size; }
  const own = new URL(ORIGIN).host;
  const third = Object.entries(byHost).filter(([h]) => h !== own).sort((a, c) => c[1] - a[1]);
  console.log(`  requests ${bytes.length} | first-party ${(byHost[own] / 1024 || 0).toFixed(0)} KB`);
  console.log('  third-party:');
  for (const [h, s] of third.slice(0, 6)) console.log(`       ${h.padEnd(34)} ${(s / 1024).toFixed(0).padStart(5)} KB  ${bytes.filter(r=>r.host===h).length} req`);
  await ctx.close();
}
await b.close();
