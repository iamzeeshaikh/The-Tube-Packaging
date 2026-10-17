/**
 * Visible FAQ sections for the pages that had none: the eight posts migrated
 * from WordPress, the guides archive, About, Contact, the specification builder
 * and the resources hub.
 *
 * The copy lives in `src/data/page-faqs.json`, keyed by route. It renders with
 * the same `ttp-cat__faq` markup as the category and resource FAQs, so
 * `faq-schema.js` picks it up unchanged and the FAQPage schema can only ever
 * describe what the page shows.
 *
 * Insertion is additive and anchored, in this order of preference:
 *   1. before the post's prev/next navigation (the WordPress posts),
 *   2. before the last `</main>` (the guides archive),
 *   3. before the closing `.main-content-wrapper` (the Elementor pages, which
 *      carry no <main>).
 * A route listed in the data with none of those anchors fails the build rather
 * than silently shipping without its FAQs.
 */
import { section, paras, esc } from './sections.js';
import FAQS from '../data/page-faqs.json';

export function pageFaqSection(route) {
  const entry = FAQS[route];
  if (!entry || !entry.faqs || !entry.faqs.length) return '';
  const items = entry.faqs.map((f) => `
<details class="ttp-cat__faq">
<summary>${esc(f.q)}</summary>
<div class="ttp-cat__faqBody">${paras([f.a])}</div>
</details>`).join('\n');
  return section('faq', 'FAQs', entry.h2 || 'Frequently asked questions', items);
}

const ANCHORS = [
  '<nav class="navigation post-navigation"',
  '</main>',
  '</div><!-- .main-content-wrapper -->',
];

export function injectPageFaqs(route, html) {
  const sec = pageFaqSection(route);
  if (!sec) return html;
  for (const anchor of ANCHORS) {
    const at = html.lastIndexOf(anchor);
    if (at !== -1) return html.slice(0, at) + sec + '\n' + html.slice(at);
  }
  throw new Error(`page-faqs: no insertion anchor on ${route}`);
}
