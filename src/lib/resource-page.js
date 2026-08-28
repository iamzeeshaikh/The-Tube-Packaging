/*
 * The resource-page template.
 *
 * Every resource page carries the same components in the same order, so a
 * reader meets the same shape whichever topic they land on:
 *
 *   1. a 40-70 word direct answer, marked up as speakable
 *   2. question-based H2s
 *   3. specification tables with real units
 *   4. "Choose X when ..." decision tables
 *   5. definitions with the practical consequence, not just the meaning
 *   6. original labeled diagrams, drawn inline as SVG
 *   7. ordering and manufacturing facts that match the rest of the site
 *   8. limitations and exceptions
 *   9. author and reviewer, published and updated dates
 *  10. sources for the technical claims
 *  11. related products and contextual internal links
 *  12. BreadcrumbList, Article, FAQPage and speakable schema
 *
 * Nothing here invents a figure. Dimensions come from the same tables the
 * configurator and the size guide use; every external claim is carried by a
 * named source in SOURCES.
 */
import { esc, table, paras } from './sections.js';

export const SITE = 'https://thetubepackaging.com';

// counted, not estimated -- validate-resources.mjs fails the build if an answer
// falls outside 40-70 words
export const wordCount = (s) => s.trim().split(/\s+/).filter(Boolean).length;

export function answer(text) {
  return `
<div class="ttp-res__answer" data-speakable="answer">
<p>${esc(text)}</p>
</div>`;
}

export function definitions(list) {
  return `
<dl class="ttp-res__defs">
${list.map((d) => `<div class="ttp-res__def">
<dt>${esc(d.term)}</dt>
<dd><span class="ttp-res__defWhat">${esc(d.what)}</span> <span class="ttp-res__defWhy">${esc(d.why)}</span></dd>
</div>`).join('\n')}
</dl>`;
}

export function decision({ caption, when, rows }) {
  return `
<div class="ttp-cat__tableWrap ttp-res__decide">
<table class="ttp-cat__table">
<caption>${esc(caption)}</caption>
<thead><tr><th scope="col">${esc(when)}</th><th scope="col">Choose</th><th scope="col">Why</th><th scope="col">Watch out for</th></tr></thead>
<tbody>${rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th><td><strong>${esc(r[1])}</strong></td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody>
</table>
</div>`;
}

// drawn here rather than shipped as an image file: it stays sharp at any size,
// costs no request, and can be labeled in real text a screen reader can read
export function diagram({ title: t, desc, svg, caption }) {
  return `
<figure class="ttp-res__fig">
<div class="ttp-res__figInner">
<svg viewBox="0 0 640 240" role="img" aria-labelledby="${esc(t.replace(/\W+/g, '-').toLowerCase())}-t" class="ttp-res__svg" xmlns="http://www.w3.org/2000/svg">
<title id="${esc(t.replace(/\W+/g, '-').toLowerCase())}-t">${esc(t)}</title>
<desc>${esc(desc)}</desc>
${svg}
</svg>
</div>
<figcaption>${esc(caption)}</figcaption>
</figure>`;
}

export function limitations(list) {
  return `
<ul class="ttp-res__limits">
${list.map((l) => `<li><strong>${esc(l.what)}</strong> ${esc(l.detail)}</li>`).join('\n')}
</ul>`;
}

export function related(list) {
  return `
<ul class="ttp-res__related">
${list.map((p) => `<li><a href="${SITE}${p.route}">${esc(p.name)}</a><span>${esc(p.note)}</span></li>`).join('\n')}
</ul>`;
}

export function sourceList(list) {
  return `
<ol class="ttp-res__sources">
${list.map((s) => `<li><a href="${esc(s.url)}" rel="nofollow noopener" target="_blank">${esc(s.label)}</a> — ${esc(s.note)}</li>`).join('\n')}
</ol>`;
}

export function byline({ published, updated, reviewer }) {
  const d = (iso) => new Date(iso + 'T00:00:00Z')
    .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  return `
<div class="ttp-res__byline">
<p><span class="ttp-res__bylineBy">Written by the The Tube Packaging production team.</span>
${reviewer ? `<span class="ttp-res__bylineRev">Technically reviewed by ${esc(reviewer)}.</span>` : ''}</p>
<p class="ttp-res__dates"><time datetime="${published}">Published ${d(published)}</time>
<time datetime="${updated}">Updated ${d(updated)}</time></p>
</div>`;
}

export function section(mod, eyebrow, h2, body) {
  return `
<section class="ttp-cat ttp-cat--${mod} ttp-res__sec" aria-labelledby="ttp-res-${mod}">
<div class="ttp-cat__wrap">
<span class="ttp-cat__eyebrow">${esc(eyebrow)}</span>
<h2 class="ttp-cat__h2" id="ttp-res-${mod}">${esc(h2)}</h2>
${body}
</div>
</section>`;
}

// -------------------------------------------------------------------- schema
export function articleSchema(copy) {
  const url = SITE + copy.route;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': url + '#article',
    headline: copy.h1,
    description: copy.description,
    inLanguage: 'en-US',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: copy.published,
    dateModified: copy.updated,
    author: { '@type': 'Organization', name: 'The Tube Packaging', url: SITE + '/' },
    publisher: {
      '@type': 'Organization',
      name: 'The Tube Packaging',
      url: SITE + '/',
    },
    about: copy.about,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.ttp-res__answer'],
    },
  };
  if (copy.reviewer) data.reviewedBy = { '@type': 'Person', name: copy.reviewer };
  if (copy.citations) data.citation = copy.citations.map((c) => c.url);
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

// ---------------------------------------------------------------------- page
export function renderResource(copy) {
  const parts = [
    `<section class="ttp-cat ttp-cat--intro ttp-res__sec"><div class="ttp-cat__wrap">`
    + answer(copy.answer) + paras(copy.intro) + `</div></section>`,
    ...copy.SECTIONS.map((s) => section(s.mod, s.eyebrow, s.h2, s.body)),
  ];
  if (copy.FAQS && copy.FAQS.length) {
    parts.push(section('faq', 'FAQs', copy.faqH2,
      copy.FAQS.map((f) => `
<details class="ttp-cat__faq">
<summary>${esc(f.q)}</summary>
<div class="ttp-cat__faqBody">${paras(f.a)}</div>
</details>`).join('\n')));
  }
  parts.push(section('related', 'Related', 'Which products does this apply to?',
    related(copy.RELATED)));
  parts.push(section('sources', 'Sources', 'Where these technical claims come from',
    paras([copy.sourcesLead]) + sourceList(copy.citations)
    + byline({ published: copy.published, updated: copy.updated, reviewer: copy.reviewer })));
  return parts.join('\n');
}

export { table, paras, esc };

// NOTE: no backticks inside this template literal, not even in a comment --
// one would terminate the string and break the build.
export const resourcePageCss = `
.ttp-res__answer{background:#eef4ff;border-left:4px solid #1c56c4;border-radius:0 12px 12px 0;padding:18px 22px;margin:0 0 26px}
.ttp-res__answer p{margin:0;font-size:18px;line-height:1.6;font-weight:500}
.ttp-res__defs{margin:22px 0;display:grid;gap:14px}
.ttp-res__def{border:1px solid #e3e9f4;border-radius:12px;padding:14px 18px;background:#fff}
.ttp-res__def dt{font-weight:700;margin:0 0 4px}
.ttp-res__def dd{margin:0;line-height:1.6}
.ttp-res__defWhy{color:#41506b}
.ttp-res__decide table th[scope=row]{font-weight:600;white-space:normal}
.ttp-res__fig{margin:24px 0;padding:0}
.ttp-res__figInner{background:#f7f9fd;border:1px solid #e3e9f4;border-radius:14px;padding:16px}
.ttp-res__svg{width:100%;height:auto;display:block}
.ttp-res__fig figcaption{font-size:14px;color:#5a6780;margin-top:10px}
.ttp-res__limits{margin:18px 0;padding:0;list-style:none;display:grid;gap:12px}
.ttp-res__limits li{padding-left:26px;position:relative;line-height:1.6}
.ttp-res__limits li:before{content:"!";position:absolute;left:0;top:1px;width:18px;height:18px;border-radius:50%;background:#ffe8cc;color:#8a4b00;font-size:12px;font-weight:700;display:grid;place-items:center}
.ttp-res__related{margin:18px 0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr));gap:14px}
.ttp-res__related li{border:1px solid #e3e9f4;border-radius:12px;padding:14px 16px;background:#fff}
.ttp-res__related a{font-weight:600;display:block}
.ttp-res__related span{display:block;font-size:14px;color:#5a6780;margin-top:3px}
.ttp-res__sources{margin:14px 0 0;padding-left:20px;line-height:1.7}
.ttp-res__sources li{margin-bottom:6px}
.ttp-res__byline{margin-top:24px;padding-top:18px;border-top:1px solid #e3e9f4;font-size:15px;color:#41506b}
.ttp-res__byline p{margin:0 0 4px}
.ttp-res__dates time{margin-right:16px}
.ttp-res__hub{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr));gap:20px;margin:26px 0}
.ttp-res__hubCard{border:1px solid #e3e9f4;border-radius:14px;padding:20px;background:#fff;display:flex;flex-direction:column}
.ttp-res__hubCard h3{margin:0 0 8px;font-size:19px}
.ttp-res__hubCard p{margin:0 0 14px;font-size:15px;line-height:1.6;flex:1 1 auto}
.ttp-res__hubCard a.ttp-res__hubGo{font-weight:600}
@media (max-width:600px){.ttp-res__answer{padding:16px 18px}.ttp-res__answer p{font-size:17px}}
`;
