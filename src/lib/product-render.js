/**
 * Editorial sections appended to a product page.
 *
 * Only /product/tube-food-packaging/ carries one today, and it exists because
 * the food cluster is the site's weakest-served real demand — 36 queries and
 * 22,976 impressions at 0.29% CTR, with "food grade tube packaging" earning
 * nothing from 1,084 impressions.
 *
 * The section is inserted before the Related Products block, which is the last
 * thing on the page, so nothing above it moves. No existing markup is read or
 * rewritten, and the page's Product schema, offer, price and reviews are not
 * touched.
 */
import { section, paras, block, cta, esc } from './sections.js';
import * as food from './copy/product-food.js';

const PAGES = { [food.route]: food };

export function enhanceProduct(page) {
  const copy = PAGES[page.route];
  if (!copy) return page.content;
  const at = page.content.indexOf(copy.anchor);
  if (at === -1) return page.content;

  const body = [
    ...copy.SECTIONS.map((s) => section(
      s.mod, s.eyebrow, s.h2,
      paras([s.lead]) + s.blocks.map(block).join('\n') + (s.cta ? cta(s.cta) : ''),
    )),
    section('faq', 'FAQs', copy.faqH2,
      copy.FAQS.map((f) => `
<details class="ttp-cat__faq">
<summary>${esc(f.q)}</summary>
<div class="ttp-cat__faqBody">${paras(f.a)}</div>
</details>`).join('\n') + cta(copy.faqCta)),
  ].join('\n');

  return page.content.slice(0, at) +
    `<div class="rishi-container" data-strech="none">${body}</div>` +
    page.content.slice(at);
}
