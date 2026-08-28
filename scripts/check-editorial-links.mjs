// Every internal link written in the Batch B and C editorial sections, checked
// against the pages that actually exist in the build. Also enforces the
// portfolio linking rules: descriptive anchors, no "click here" / "view" /
// "explore", and at most one link per paragraph.
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') files.push(p);
  }
})(DIST);
const routes = new Set(files.map((f) => {
  const d = path.relative(DIST, path.dirname(f));
  return d === '' ? '/' : '/' + d + '/';
}));

const BANNED = /^(click here|here|view|explore|read more|learn more|this page|link)$/i;
let fails = 0, links = 0, external = 0, pagesWithContent = 0;
const fail = (m) => { fails++; console.log('FAIL ' + m); };

for (const f of files.sort()) {
  const html = fs.readFileSync(f, 'utf8');
  const sections = [...html.matchAll(/<section class="ttp-cat[^"]*"[\s\S]*?<\/section>/g)].map((m) => m[0]);
  if (!sections.length) continue;
  pagesWithContent++;
  const route = '/' + path.relative(DIST, path.dirname(f)) + '/';

  for (const s of sections) {
    const inSources = s.includes('ttp-res__sources');
    for (const m of s.matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
      links++;
      const [, href, rawText] = m;
      const text = rawText.replace(/<[^>]*>/g, '').trim();
      const target = href.replace('https://thetubepackaging.com', '');
      // tel: and mailto: are the same contact details the header and footer
      // already publish; they are not page links and have nothing to resolve
      if (/^(tel:|mailto:)/i.test(href)) {
        if (!/^(tel:\(503\)%20358-0443|mailto:info@thetubepackaging\.com)$/i.test(href)) {
          fail(`${route} unexpected contact link ${href}`);
        }
        continue;
      }
      if (!target.startsWith('/')) {
        // resource pages cite their technical claims; those links are external
        // by design, are confined to the sources list and carry rel=nofollow
        if (inSources && /rel="nofollow noopener"/.test(m[0])) { external++; continue; }
        fail(`${route} external link ${href}`);
        continue;
      }
      if (!routes.has(target)) fail(`${route} -> ${target} (no such page in the build)`);
      if (BANNED.test(text)) fail(`${route} banned anchor text "${text}"`);
      const words = text.split(/\s+/).length;
      if (words < 2 || words > 9) fail(`${route} anchor "${text}" is ${words} word(s)`);
    }
    // at most one link per paragraph
    for (const p of s.matchAll(/<p>([\s\S]*?)<\/p>/g)) {
      const n = (p[1].match(/<a /g) || []).length;
      if (n > 1) fail(`${route} paragraph carries ${n} links`);
    }
  }
}
console.log(`\npages with editorial sections  ${pagesWithContent}`);
console.log(`internal links checked         ${links}`);
console.log(`cited external sources         ${external}`);
console.log(fails ? `FAILURES: ${fails}` : 'all editorial links resolve and follow the anchor rules');
process.exit(fails ? 1 : 0);
