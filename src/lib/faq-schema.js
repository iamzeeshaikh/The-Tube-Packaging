/**
 * FAQPage structured data, emitted from the questions a page actually renders.
 *
 * The site displays FAQs in three different shapes, inherited from three
 * different sources, so the schema is extracted from the rendered HTML rather
 * than from a data file. That way the markup can never claim a question the
 * page does not show — which is Google's first requirement for FAQPage and the
 * usual reason it is flagged.
 *
 *   1. `.ttp-cat__faq`   the sections this programme built (8 pages, 80 Q&A)
 *   2. `.tp-faq__item`   the home page's Elementor FAQ block (12 Q&A)
 *   3. `#tab-faqs_tab`   the product pages' FAQ tab, h3 question followed by
 *                        one or more paragraphs (35 pages)
 *
 * A note on what this is worth, recorded because it was asked for after being
 * advised against: Google restricted FAQ rich results to government and health
 * sites in 2023, so this will not produce an expanded snippet on a packaging
 * site. It is still valid, machine-readable Q&A — which is what AI assistants
 * and other consumers of structured data read — and it costs nothing but bytes.
 *
 * It emits an additional script element. No existing schema node is read,
 * rewritten, reordered or removed.
 */

const strip = (html) =>
  html
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#0?39;|&apos;|&#x27;|&#8217;/g, "'")
    .replace(/&quot;|&#8220;|&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8243;/g, '″')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

// 1. the sections this programme built
function fromDetails(html) {
  const out = [];
  const re = /<details class="ttp-cat__faq">\s*<summary>([\s\S]*?)<\/summary>\s*<div class="ttp-cat__faqBody">([\s\S]*?)<\/div>\s*<\/details>/g;
  let m;
  while ((m = re.exec(html))) out.push([strip(m[1]), strip(m[2])]);
  return out;
}

// 2. the home page's Elementor FAQ block
function fromHomeBlock(html) {
  const out = [];
  const re = /<article class="tp-faq__item"[\s\S]*?<h3 class="tp-faq__qText"[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<div class="tp-faq__aInner"[^>]*>([\s\S]*?)<\/div>/g;
  let m;
  while ((m = re.exec(html))) out.push([strip(m[1]), strip(m[2])]);
  return out;
}

// 3. the product pages' FAQ tab: an h3 question, then paragraphs until the next
//    heading. The questions are numbered for display ("1. Are paper tubes…");
//    the index is presentational and is dropped.
function fromProductTab(html) {
  const panel = /id="tab-faqs_tab"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/.exec(html)
    || /id="tab-faqs_tab"[^>]*>([\s\S]*?)$/.exec(html);
  if (!panel) return [];
  const inner = panel[1];
  const out = [];
  const heads = [...inner.matchAll(/<h([2-6])[^>]*>([\s\S]*?)<\/h\1>/g)];
  heads.forEach((h, i) => {
    const q = strip(h[2]).replace(/^\d+[.)]\s*/, '');
    const from = h.index + h[0].length;
    const to = i + 1 < heads.length ? heads[i + 1].index : inner.length;
    const body = inner.slice(from, to);
    const paras = [...body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((p) => strip(p[1]));
    const a = paras.filter(Boolean).join(' ');
    if (q && a) out.push([q, a]);
  });
  return out;
}

export function faqPairs(html) {
  if (!html) return [];
  const pairs = [...fromDetails(html), ...fromHomeBlock(html), ...fromProductTab(html)];
  const seen = new Set();
  return pairs.filter(([q, a]) => {
    if (!q || !a) return false;
    const key = q.toLowerCase();
    if (seen.has(key)) return false;          // a question appears once
    seen.add(key);
    return true;
  });
}

export function faqSchema(route, html) {
  const pairs = faqPairs(html);
  if (!pairs.length) return '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://thetubepackaging.com' + route + '#faq',
    mainEntity: pairs.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `\n<script type="application/ld+json" class="ttp-faq">${json}</script>\n`;
}
