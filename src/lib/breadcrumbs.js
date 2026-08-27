// BreadcrumbList — A5.
//
// The site renders a correct, linked breadcrumb trail on all 35 product pages
// (`Home > Shop > Custom Paper Tubes > Paper Tubes`) but emitted no breadcrumb
// structured data anywhere: 0 of 68 pages, in JSON-LD, microdata or RDFa. The
// information was there; only the markup Google reads was missing, so the SERP
// showed a raw URL path instead of a trail.
//
// This builds the JSON-LD from what the page already says, so the two can never
// disagree:
//
//   * where a `.rishi-breadcrumbs` trail is rendered, its own anchors are used
//     verbatim — same names, same URLs, same order;
//   * where none is rendered (the category archives, the blog posts, the static
//     pages), the trail is derived from the route and the page's own H1, which
//     is the same hierarchy the header navigation and the product breadcrumbs
//     use — `/product-category/mailing-tubes/` has the H1 "Custom Mailing
//     Tubes", which is exactly the name the product breadcrumbs link to.
//
// It emits an additional script element. No existing schema node is read,
// rewritten, reordered or removed.

import { PROD_ORIGIN } from './site.js';

const HOME = { name: 'Home', url: PROD_ORIGIN + '/' };

// Pages excluded on purpose:
//   `/`        — a one-item breadcrumb is not a trail, and Google does not use
//                one on the page it would point at.
//   noindex    — cart, checkout, order received, my account, lost password and
//                thank-you carry `noindex`; structured data on a page that is
//                not indexed does nothing.
function isNoindex(head) {
  return /<meta\s+name=['"]robots['"]\s+content=['"][^'"]*noindex/i.test(head || '');
}

function text(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#0?39;|&apos;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// The rendered trail, when the theme prints one.
function renderedTrail(content) {
  const block = /<div class="rishi-breadcrumbs[^"]*">([\s\S]*?)<!-- \.crumbs -->/.exec(content || '');
  if (!block) return null;
  const inner = block[1].replace(/<svg[\s\S]*?<\/svg>/g, '');
  const items = [];
  const anchor = /<a href="([^"]*)"[^>]*>\s*<span\s*>([\s\S]*?)<\/span>\s*<\/a>/g;
  let m;
  while ((m = anchor.exec(inner))) {
    const name = text(m[2]);
    // The theme links the home crumb as the bare origin; the site's URLs always
    // carry a trailing slash, so normalise it to match the derived trails.
    const url = m[1] === PROD_ORIGIN ? PROD_ORIGIN + '/' : m[1];
    if (name) items.push({ name, url });
  }
  return items.length >= 2 ? items : null;
}

function h1(content) {
  const m = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(content || '');
  return m ? text(m[1]) : '';
}

function docTitle(head) {
  const m = /<title>([\s\S]*?)<\/title>/.exec(head || '');
  if (!m) return '';
  return text(m[1]).replace(/\s+-\s+The Tube Packaging\.?$/, '');
}

const abs = (route) => PROD_ORIGIN + route;

// Derived trail, for the pages the theme leaves without one.
function derivedTrail(page) {
  const route = page.route;
  const label = h1(page.content) || docTitle(page.head);
  if (!label) return null;

  const shop = { name: 'Shop', url: abs('/shop/') };

  if (route === '/shop/') return [HOME, shop];

  let m = /^\/shop\/page\/(\d+)\/$/.exec(route);
  if (m) return [HOME, shop, { name: `Page ${m[1]}`, url: abs(route) }];

  m = /^\/product-category\/([^/]+)\/$/.exec(route);
  if (m) return [HOME, shop, { name: label, url: abs(route) }];

  m = /^\/product-category\/([^/]+)\/page\/(\d+)\/$/.exec(route);
  if (m) {
    return [
      HOME,
      shop,
      { name: label, url: abs(`/product-category/${m[1]}/`) },
      { name: `Page ${m[2]}`, url: abs(route) },
    ];
  }

  // Blog posts, blog category archives, the author archive and the static
  // pages all sit directly under the home page in this site's navigation.
  return [HOME, { name: label, url: abs(route) }];
}

export function breadcrumbTrail(page) {
  if (!page || page.route === '/') return null;
  if (isNoindex(page.head)) return null;
  return renderedTrail(page.content) || derivedTrail(page);
}

export function breadcrumbSchema(page) {
  const trail = breadcrumbTrail(page);
  if (!trail) return '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': abs(page.route) + '#breadcrumb',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  // `</` inside a script element would end it early; `<` is escaped for safety.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `\n<script type="application/ld+json" class="ttp-breadcrumb">${json}</script>\n`;
}
