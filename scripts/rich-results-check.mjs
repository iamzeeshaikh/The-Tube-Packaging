// Structured-data check against LIVE production HTML.
//
// This is not Google's Rich Results Test — that tool has no public API and was
// not run here. It parses the JSON-LD Google would parse and checks it against
// Google's documented requirements for product snippets, merchant listings and
// breadcrumbs, which is the part that can be verified without account access.
//
//   node scripts/rich-results-check.mjs [url ...]
import { setTimeout as sleep } from 'node:timers/promises';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
           '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const urls = process.argv.slice(2).length ? process.argv.slice(2) : [
  'https://thetubepackaging.com/product/paper-tubes/',
  'https://thetubepackaging.com/product/cosmetic-tubes/',
  'https://thetubepackaging.com/product/poster-mailing-tubes/',
  'https://thetubepackaging.com/product/luxury-tube-packaging/',
  'https://thetubepackaging.com/product/large-cardboard-tubes/',
];

const flatten = (node, out = []) => {
  if (Array.isArray(node)) node.forEach((n) => flatten(n, out));
  else if (node && typeof node === 'object') {
    out.push(node);
    for (const v of Object.values(node)) if (v && typeof v === 'object') flatten(v, out);
  }
  return out;
};

let failures = 0;
for (const url of urls) {
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  const html = await res.text();
  console.log(`\n${url}  [HTTP ${res.status}]`);
  if (res.status !== 200) { failures++; continue; }

  const nodes = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { flatten(JSON.parse(m[1].replace(/\\u003c/g, '<')), nodes); }
    catch (e) { console.log('  ERROR  JSON-LD block does not parse:', e.message); failures++; }
  }

  const products = nodes.filter((n) => n['@type'] === 'Product');
  const crumbs = nodes.filter((n) => n['@type'] === 'BreadcrumbList');
  const check = (ok, label, value) => {
    if (!ok) failures++;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${value === undefined ? '' : '  ' + JSON.stringify(value)}`);
  };

  check(products.length === 1, 'exactly one Product node', products.length);
  for (const p of products) {
    const o = Array.isArray(p.offers) ? p.offers[0] : p.offers;
    // Required by Google for product snippets / merchant listings
    check(!!p.name, 'Product.name', p.name);
    check(!!p.image, 'Product.image present', Array.isArray(p.image) ? p.image.length + ' image(s)' : !!p.image);
    check(!!o, 'Offer present');
    check(o && o.price === '0.3', 'Offer.price is exactly "0.3"', o && o.price);
    check(o && o.priceCurrency === 'USD', 'Offer.priceCurrency', o && o.priceCurrency);
    check(o && /InStock/.test(o.availability || ''), 'Offer.availability', o && o.availability);
    // Recommended
    check(!!p.sku, 'Product.sku', p.sku);
    check(!!(p.brand && p.brand.name), 'Product.brand', p.brand && p.brand.name);
    check(!!p.aggregateRating, 'aggregateRating retained',
      p.aggregateRating && `${p.aggregateRating.ratingValue} / ${p.aggregateRating.reviewCount}`);
    // The A1 fix
    const pvu = o && o.priceValidUntil;
    const future = pvu && new Date(pvu) > new Date();
    const monthsOut = pvu ? (new Date(pvu) - Date.now()) / 2629800000 : 0;
    check(!!pvu, 'Offer.priceValidUntil present', pvu);
    check(!!future, 'priceValidUntil is in the future');
    check(monthsOut > 11 && monthsOut < 13, 'priceValidUntil is ~12 months out',
      pvu ? monthsOut.toFixed(1) + ' months' : null);
  }

  check(crumbs.length === 1, 'exactly one BreadcrumbList', crumbs.length);
  for (const b of crumbs) {
    const items = b.itemListElement || [];
    check(items.length >= 2, 'BreadcrumbList has a real trail',
      items.map((i) => i.name).join(' > '));
    check(items.every((i, n) => i.position === n + 1 && i.name && i.item),
      'every ListItem has position, name and item');
  }
  await sleep(2500);
}
console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
process.exit(failures ? 1 : 0);
