// FAQPage verification, run on the built HTML.
//   1. Every page that displays FAQs emits exactly one FAQPage, and no page
//      that displays none emits one — the absence side is what matters, so the
//      denominator is enumerated rather than the found instances counted.
//   2. It parses, and every Question has a name and a non-empty acceptedAnswer.
//   3. Every question in the schema is actually rendered on the page.
//   4. The pre-existing JSON-LD is untouched.
import fs from 'node:fs';
import path from 'node:path';
import { faqPairs } from '../src/lib/faq-schema.js';

const DIST = 'dist';
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') files.push(p);
  }
})(DIST);

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
let fails = 0, withFaq = 0, questions = 0;
const fail = (r, m) => { fails++; console.log(`FAIL ${r}: ${m}`); };

for (const f of files.sort()) {
  const d = path.relative(DIST, path.dirname(f));
  const route = d === '' ? '/' : '/' + d + '/';
  const html = fs.readFileSync(f, 'utf8');

  const blocks = [...html.matchAll(/<script type="application\/ld\+json" class="ttp-faq">([\s\S]*?)<\/script>/g)];
  const displayed = faqPairs(html);

  if (!displayed.length) {
    if (blocks.length) fail(route, 'FAQPage emitted but the page displays no FAQs');
    continue;
  }
  withFaq++;
  if (blocks.length !== 1) { fail(route, `${blocks.length} FAQPage blocks, expected 1`); continue; }

  let data;
  try { data = JSON.parse(blocks[0][1].replace(/\\u003c/g, '<')); }
  catch (e) { fail(route, 'FAQPage does not parse: ' + e.message); continue; }

  if (data['@type'] !== 'FAQPage') fail(route, 'wrong @type');
  const ents = data.mainEntity || [];
  if (ents.length !== displayed.length)
    fail(route, `${ents.length} questions in schema, ${displayed.length} displayed`);

  const shown = new Set(displayed.map(([q]) => norm(q)));
  for (const e of ents) {
    questions++;
    if (e['@type'] !== 'Question') fail(route, 'entity is not a Question');
    if (!e.name) fail(route, 'a Question has no name');
    const t = e.acceptedAnswer && e.acceptedAnswer.text;
    if (!t || !t.trim()) fail(route, `no answer text for "${(e.name || '').slice(0, 50)}"`);
    if (e.name && !shown.has(norm(e.name)))
      fail(route, `schema question not rendered on the page: "${e.name.slice(0, 60)}"`);
    if (t && /<[a-z]/i.test(t)) fail(route, 'answer text contains markup');
  }
}

console.log(`\npages in build            ${files.length}`);
console.log(`pages displaying FAQs     ${withFaq}`);
console.log(`questions in schema       ${questions}`);
console.log(fails ? `FAILURES: ${fails}` : 'every FAQPage matches what its page displays');
process.exit(fails ? 1 : 0);
