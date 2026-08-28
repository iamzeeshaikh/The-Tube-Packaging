// Every resource page and article has to carry the same components. This checks
// the built HTML rather than the copy modules, so a template change that stops
// emitting a block is caught.
import { readFileSync, existsSync } from 'node:fs';

const ROUTES = [
  '/resources/materials-and-construction/', '/resources/printing-and-design/',
  '/resources/shipping-and-protection/', '/resources/sustainability/',
  '/resources/industry-applications/', '/resources/comparisons/',
  '/how-to-order-custom-tube-packaging-wholesale/', '/choosing-tube-packaging-for-cosmetics/',
  '/food-safe-tube-packaging-choosing-a-liner/', '/what-makes-tube-packaging-look-premium/',
  '/custom-tube-packaging-for-small-businesses/',
];
const DIR = process.env.OUT_DIR || './dist';
let fails = 0;
const bad = (r, m) => { fails++; console.log(`FAIL ${r}: ${m}`); };

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const strip = (h) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

for (const route of ROUTES) {
  const file = `${DIR}${route}index.html`;
  if (!existsSync(file)) { bad(route, 'not built'); continue; }
  const h = readFileSync(file, 'utf8');
  const flat = h.replace(/\s+/g, '');

  const ans = /<div class="ttp-res__answer"[^>]*>([\s\S]*?)<\/div>/.exec(h);
  if (!ans) bad(route, 'no direct-answer block');
  else {
    const w = words(strip(ans[1]));
    if (w < 40 || w > 70) bad(route, `direct answer is ${w} words, outside 40-70`);
  }

  const h2 = [...h.matchAll(/<h2 class="ttp-cat__h2"[^>]*>([^<]*)<\/h2>/g)].map((m) => m[1]);
  if (h2.length < 5) bad(route, `only ${h2.length} H2s`);
  const questions = h2.filter((t) => t.trim().endsWith('?')).length;
  if (questions < 3) bad(route, `only ${questions} question-based H2s`);

  for (const [name, needle] of [
    ['spec table', 'ttp-cat__table'], ['decision table', 'ttp-res__decide'],
    ['limitations', 'ttp-res__limits'], ['related products', 'ttp-res__related'],
    ['sources', 'ttp-res__sources'], ['byline and dates', 'ttp-res__byline'],
    ['FAQ block', 'ttp-cat__faq'],
  ]) if (!h.includes(needle)) bad(route, `no ${name}`);

  for (const t of ['"@type":"BreadcrumbList"', '"@type":"FAQPage"', 'SpeakableSpecification'])
    if (!flat.includes(t.replace(/\s+/g, ''))) bad(route, `no ${t}`);
  if (!flat.includes('"@type":"Article"') && !flat.includes('"@type":"BlogPosting"'))
    bad(route, 'no Article or BlogPosting schema');

  if (!/datePublished":"\d{4}-\d{2}-\d{2}/.test(flat)) bad(route, 'no datePublished');
  if (!/dateModified":"\d{4}-\d{2}-\d{2}/.test(flat)) bad(route, 'no dateModified');

  const faqs = (h.match(/<details class="ttp-cat__faq">/g) || []).length;
  if (faqs < 10) bad(route, `only ${faqs} FAQs, fewer than 10`);

  // contextual internal links in prose, one per paragraph, 3-8 word anchors
  const article = /<div class="entry-content">([\s\S]*?)<\/article>/.exec(h);
  const prose = article[1].replace(/<(ul|ol)[^>]*class="ttp-res__(related|sources)"[\s\S]*?<\/\1>/g, '');
  const paras = [...prose.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1]);
  const links = [];
  for (const p of paras) {
    const inP = [...p.matchAll(/<a href="https:\/\/thetubepackaging\.com(\/[^"]*)"[^>]*>([^<]*)<\/a>/g)];
    if (inP.length > 1) bad(route, `a paragraph carries ${inP.length} links`);
    links.push(...inP);
  }
  if (links.length < 3 || links.length > 5) bad(route, `${links.length} contextual internal links, outside 3-5`);
  for (const [, target, anchor] of links) {
    const w = words(anchor);
    if (w < 3 || w > 8) bad(route, `anchor "${anchor}" is ${w} words`);
    if (!existsSync(`${DIR}${target}index.html`)) bad(route, `link target does not exist: ${target}`);
  }

  // every cited source must be an absolute external URL
  const src = /<ol class="ttp-res__sources">([\s\S]*?)<\/ol>/.exec(h);
  if (src) {
    const urls = [...src[1].matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    if (!urls.length) bad(route, 'sources list is empty');
    for (const u of urls) if (!/^https:\/\//.test(u)) bad(route, `source is not an absolute URL: ${u}`);
  }
}

console.log(fails
  ? `\n${fails} failure(s) across ${ROUTES.length} pages`
  : `\nall ${ROUTES.length} resource pages carry every template component`);
process.exit(fails ? 1 : 0);
