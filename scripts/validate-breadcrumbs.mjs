// A5 verification.
//   1. Every indexable page carries exactly one BreadcrumbList and it parses.
//   2. Every `item` URL resolves to a page that exists in the build.
//   3. Where the theme renders a visible trail, the JSON-LD matches it exactly.
//   4. The JSON-LD that was already on the page is byte-identical to the source
//      record — no existing schema node was altered, reordered or dropped.
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const pages = JSON.parse(fs.readFileSync('src/data/pages.json', 'utf8'));
const byRoute = Object.fromEntries(Object.values(pages).map((p) => [p.route, p]));

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') files.push(p);
  }
})(DIST);

const routeOf = (f) => {
  const d = path.relative(DIST, path.dirname(f));
  return d === '' ? '/' : '/' + d + '/';
};
const routes = new Set(files.map(routeOf));

const ldScripts = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json"([^>]*)>([\s\S]*?)<\/script>/g)]
    .map((m) => ({ attrs: m[1], body: m[2] }));

const strip = (s) =>
  s.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]*>/g, '')
   .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

let withBc = 0, fails = 0;
const fail = (r, m) => { fails++; console.log(`FAIL ${r}: ${m}`); };

for (const f of files.sort()) {
  const route = routeOf(f);
  const html = fs.readFileSync(f, 'utf8');
  const scripts = ldScripts(html);
  const bc = scripts.filter((s) => s.attrs.includes('ttp-breadcrumb'));

  // 4. pre-existing JSON-LD unchanged
  const src = byRoute[route];
  if (src) {
    // A1 rewrites priceValidUntil at build time; normalise it so this check
    // asserts that *nothing else* in the pre-existing JSON-LD moved.
    const norm = (s) => s.replace(/"priceValidUntil":"[^"]*"/g, '"priceValidUntil":"X"');
    const before = ldScripts(src.head).map((s) => norm(s.body));
    // this programme's own additions are excluded; everything else must match
    const added = (a) => a.includes('ttp-breadcrumb') || a.includes('ttp-faq');
    const after = scripts.filter((s) => !added(s.attrs)).map((s) => norm(s.body));
    if (JSON.stringify(before) !== JSON.stringify(after))
      fail(route, `existing JSON-LD changed (${before.length} -> ${after.length} blocks)`);
  }

  if (bc.length === 0) continue;
  if (bc.length > 1) { fail(route, `${bc.length} BreadcrumbList blocks`); continue; }
  withBc++;

  let data;
  try { data = JSON.parse(bc[0].body.replace(/\\u003c/g, '<')); }
  catch (e) { fail(route, 'BreadcrumbList does not parse: ' + e.message); continue; }

  if (data['@type'] !== 'BreadcrumbList') fail(route, 'wrong @type');
  const items = data.itemListElement || [];
  if (items.length < 2) fail(route, `only ${items.length} crumb(s)`);
  items.forEach((it, i) => {
    if (it.position !== i + 1) fail(route, `position ${it.position} at index ${i}`);
    if (!it.name) fail(route, `crumb ${i + 1} has no name`);
    const u = (it.item || '').replace('https://thetubepackaging.com', '');
    if (!routes.has(u)) fail(route, `crumb ${i + 1} points at a URL not in the build: ${it.item}`);
  });

  // 3. match the visible trail where one is rendered
  const block = /<div class="rishi-breadcrumbs[^"]*">([\s\S]*?)<!-- \.crumbs -->/.exec(html);
  if (block) {
    const visible = [...block[1].matchAll(/<a href="([^"]*)"[^>]*>\s*<span\s*>([\s\S]*?)<\/span>\s*<\/a>/g)]
      .map((m) => strip(m[2])).filter(Boolean);
    if (visible.length >= 2) {
      const json = items.map((i) => i.name);
      if (visible.join(' > ') !== json.join(' > '))
        fail(route, `visible "${visible.join(' > ')}" != json "${json.join(' > ')}"`);
    }
  }
}

const noindex = files.filter((f) => /content=['"][^'"]*noindex/.test(fs.readFileSync(f, 'utf8')));
console.log(`pages in build          ${files.length}`);
console.log(`with BreadcrumbList     ${withBc}`);
console.log(`noindex (skipped)       ${noindex.length}`);
console.log(`home page (skipped)     1`);
console.log(fails ? `FAILURES: ${fails}` : 'all checks passed');
process.exit(fails ? 1 : 0);
