/**
 * Request every URL in the Search Console Pages export against production.
 *
 * Writes reports/status-sweep.csv with regressions first: any URL that earned
 * clicks under WordPress and now answers 404 or 5xx.
 *
 * Paced deliberately. Vercel's Attack Challenge Mode answers bursts with 403 +
 * x-vercel-mitigated: challenge, and a challenged URL is a crawler problem, not
 * a page problem -- it is retried once, slowly, and reported as `challenged` if
 * it stays that way rather than being counted as a defect.
 *
 * Usage: node scripts/status-sweep.mjs [--delay 350] [--concurrency 2]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { request } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? Number(process.argv[i + 1]) : d;
};
const DELAY = arg('delay', 350);
const CONC = arg('concurrency', 2);
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const rows = parseCsv(fs.readFileSync(path.join(ROOT, 'data/gsc/pages.csv'), 'utf8'));
const head = rows.shift().map((h) => h.trim().toLowerCase());
const items = rows
  .filter((r) => r[head.indexOf('top pages')])
  .map((r) => ({
    url: r[head.indexOf('top pages')].trim(),
    clicks: Math.round(Number(r[head.indexOf('clicks')] || 0)),
    impressions: Math.round(Number(r[head.indexOf('impressions')] || 0)),
  }));

const api = await request.newContext({ userAgent: UA });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function probe(url) {
  const chain = [];
  let current = url;
  for (let hop = 0; hop < 6; hop++) {
    let res;
    try {
      res = await api.get(current, { maxRedirects: 0, timeout: 45000 });
    } catch (e) {
      return { status: 'ERROR', target: String(e.message).split('\n')[0].slice(0, 60), chain };
    }
    const s = res.status();
    if (s === 403 && res.headers()['x-vercel-mitigated'] === 'challenge') {
      return { status: 'challenged', target: '', chain };
    }
    const loc = res.headers()['location'];
    if (s >= 300 && s < 400 && loc) {
      chain.push(String(s));
      current = new URL(loc, current).href;
      continue;
    }
    return { status: s, target: chain.length ? current : '', chain };
  }
  return { status: 'redirect-loop', target: current, chain };
}

let done = 0;
const out = new Array(items.length);
let next = 0;
await Promise.all(Array.from({ length: CONC }, async () => {
  while (true) {
    const i = next++;
    if (i >= items.length) return;
    out[i] = { ...items[i], ...(await probe(items[i].url)) };
    if (++done % 25 === 0) console.log(`  ${done}/${items.length}`);
    await sleep(DELAY);
  }
}));

// one slow retry for anything the bot mitigation swallowed
const retry = out.filter((r) => r.status === 'challenged');
if (retry.length) {
  console.log(`retrying ${retry.length} challenged URL(s) slowly`);
  for (const r of retry) {
    await sleep(1500);
    Object.assign(r, await probe(r.url));
  }
}
await api.dispose();

const bad = (r) => r.status === 404 || (typeof r.status === 'number' && r.status >= 500);
out.sort((a, b) => {
  const ra = bad(a) && a.clicks > 0, rb = bad(b) && b.clicks > 0;
  if (ra !== rb) return rb - ra;
  if (bad(a) !== bad(b)) return bad(b) - bad(a);
  return b.impressions - a.impressions;
});

const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const dest = path.join(ROOT, 'reports', 'status-sweep.csv');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, ['url,status,redirect_target,gsc_clicks,gsc_impressions']
  .concat(out.map((r) => [r.url, r.status, r.target, r.clicks, r.impressions].map(esc).join(',')))
  .join('\n') + '\n');

const counts = out.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
console.log(`\nwrote reports/status-sweep.csv (${out.length} rows)`);
console.log('status counts:', counts);
const regressions = out.filter((r) => bad(r) && r.clicks > 0);
console.log(`\nREGRESSIONS (had clicks, now 404/5xx): ${regressions.length}`);
for (const r of regressions) console.log(`  ${r.status}  ${r.url}  clicks=${r.clicks} impr=${r.impressions}`);
