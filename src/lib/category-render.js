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
import { quoteForm } from './category-form.js';
import catalogue from '../data/catalogue.json';

function above(copy) {
  const intro = section('intro', copy.intro.eyebrow, copy.intro.h2,
    paras(copy.intro.paras) + (copy.intro.cta ? cta(copy.intro.cta) : ''));
  const fit = section('fit', copy.fit.eyebrow, copy.fit.h2,
    paras([copy.fit.lead]) + table(copy.fit.table) +
    (copy.fit.note ? `<span class="ttp-cat__note">${esc(copy.fit.note)}</span>` : '') +
    (copy.fit.cta ? cta(copy.fit.cta) : ''));
  return intro + fit;
}

// The gallery image is resolved from the page's own product grid where the
// product appears on it, and from the catalogue where it does not.
//
// The first version used only the grid, and /shop/ silently rendered two cards
// instead of four — page one of /shop/ lists 16 of the 35 products, and two of
// the four chosen were on page two. `.filter(Boolean)` swallowed it. Falling
// back to the catalogue fixes that, and an unresolvable slug now throws rather
// than disappearing: a card that vanishes without a word is worse than a build
// that stops.
const PRODUCTS = catalogue.products || catalogue;

function galleryImage(html, slug) {
  const tile = new RegExp(
    '<a href="https://thetubepackaging\\.com/product/' + slug
    + '/" class="woocommerce-LoopProduct-link[^>]*>\\s*<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"', 'i');
  const m = tile.exec(html);
  if (m) {
    const src = m[1].replace(/-300x300(\.[a-z]+)$/i, '-600x600$1');
    return { src, srcset: `${src} 600w, ${m[1]} 300w`, alt: m[2] };
  }
  const product = Object.values(PRODUCTS).find((p) => p.slug === slug);
  if (!product) throw new Error(`gallery: no product "${slug}" in the grid or the catalogue`);
  const base = product.image.replace(/-100x100(\.[a-z]+)$/i, '');
  const ext = (product.image.match(/(\.[a-z]+)$/i) || ['.jpg'])[1];
  const six = `https://thetubepackaging.com${base}-600x600${ext}`;
  return { src: six, srcset: `${six} 600w, https://thetubepackaging.com${base}-300x300${ext} 300w`,
           alt: product.name };
}

function gallery(copy, html) {
  if (!copy.gallery) return '';
  const cards = copy.gallery.items.map((it) => {
    const img = galleryImage(html, it.slug);
    const url = `https://thetubepackaging.com/product/${it.slug}/`;
    return `
<article class="ttp-cat__card">
<a class="ttp-cat__cardMedia" href="${url}" aria-hidden="true" tabindex="-1"><img src="${img.src}" srcset="${img.srcset}" sizes="(max-width:640px) 90vw, 300px" width="600" height="600" loading="lazy" decoding="async" alt="${esc(img.alt)}"></a>
<div class="ttp-cat__cardBody">
<h3 class="ttp-cat__cardTitle"><a href="${url}">${esc(it.title)}</a></h3>
<p>${esc(it.text)}</p>
</div>
</article>`;
  }).join('\n');
  return section('gallery', copy.gallery.eyebrow, copy.gallery.h2,
    paras([copy.gallery.lead]) + `<div class="ttp-cat__gallery">${cards}</div>`
    + (copy.gallery.note ? `<span class="ttp-cat__note">${esc(copy.gallery.note)}</span>` : ''));
}

function quote(copy) {
  if (!copy.quote) return '';
  // the left column was mostly empty against a tall form; the direct line fills
  // it with something a buyer can actually use, and both details are the ones
  // already published in the header and footer
  const direct = `
<p class="ttp-cat__quoteAlt">Not sure what to put in the message?
<a href="https://thetubepackaging.com/tube-configurator/">Build your specification step by step</a>
and it arrives here filled in.</p>
<div class="ttp-cat__quoteDirect">
<span>Or reach us directly</span>
<a href="tel:(503)%20358-0443">(503) 358-0443</a>
<a href="mailto:info@thetubepackaging.com">info@thetubepackaging.com</a>
</div>`;
  const aside = `<div class="ttp-cat__quoteAside">${paras(copy.quote.paras)}`
    + `<ul class="ttp-cat__quoteList">${copy.quote.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`
    + direct + `</div>`;
  return section('quote', copy.quote.eyebrow, copy.quote.h2,
    `<div class="ttp-cat__quoteGrid">${aside}${quoteForm(copy.quote)}</div>`);
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
  html = html.slice(0, close) + gallery(copy, html) + below(copy) + quote(copy) + html.slice(close);

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
