/**
 * Renders the editorial sections onto the captured category and shop markup.
 *
 * The migration carried WordPress's archive template across verbatim, so these
 * six pages ship the H1, the result count, a sorting dropdown and a product
 * grid — 28 to 33 editorial words — while carrying 224 to 343 inbound internal
 * links each. They rank at positions 10 to 13 on 44,770 impressions and convert
 * 0.03% of it, because there is nothing on them to read.
 *
 * Everything here is additive. Sections are inserted at two anchors inside
 * `<main id="primary">`, and each product tile gains one line of text placed
 * *after* the price element, never before it and never inside it, so the price
 * keeps its text, its markup, its formatting and its position in the DOM.
 */
import { COPY } from './category-copy.js';
import { esc, table, paras, block, section, cta } from './sections.js';

function above(copy) {
  const intro = section('intro', copy.intro.eyebrow, copy.intro.h2,
    paras(copy.intro.paras) + (copy.intro.cta ? cta(copy.intro.cta) : ''));
  const fit = section('fit', copy.fit.eyebrow, copy.fit.h2,
    paras([copy.fit.lead]) + table(copy.fit.table) +
    (copy.fit.note ? `<span class="ttp-cat__note">${esc(copy.fit.note)}</span>` : '') +
    (copy.fit.cta ? cta(copy.fit.cta) : ''));
  return intro + fit;
}

function below(copy) {
  const spec = section('spec', copy.spec.eyebrow, copy.spec.h2,
    paras([copy.spec.lead]) + copy.spec.blocks.map(block).join('\n') +
    (copy.spec.cta ? cta(copy.spec.cta) : ''));
  const faq = section('faq', 'FAQs', copy.faqH2,
    copy.faqs.map((f) => `
<details class="ttp-cat__faq">
<summary>${esc(f.q)}</summary>
<div class="ttp-cat__faqBody">${paras(f.a)}</div>
</details>`).join('\n') + (copy.faqCta ? cta(copy.faqCta) : ''));
  return spec + faq;
}

const MAIN_OPEN = '<main id="primary" class="site-main">';

export function enhanceCategory(page) {
  const copy = COPY[page.route];
  if (!copy) return page.content;
  let html = page.content;

  // Sections. Both anchors are unique in every one of these six records.
  if (html.indexOf(MAIN_OPEN) === -1 || html.lastIndexOf('</main>') === -1) return html;
  html = html.replace(MAIN_OPEN, MAIN_OPEN + above(copy));
  const close = html.lastIndexOf('</main>');
  html = html.slice(0, close) + below(copy) + html.slice(close);

  // One differentiator per tile, inserted immediately before the add-to-cart
  // link — which is *after* the anchor that wraps the title and the price. The
  // price element is not read, moved, reformatted or reparented.
  html = html.replace(
    /<a href="[^"]*\?add-to-cart=(\d+)"/g,
    (match, id) => {
      const note = copy.tiles[id];
      return note ? `<span class="ttp-cat__tileNote">${esc(note)}</span>\n${match}` : match;
    },
  );
  return html;
}
