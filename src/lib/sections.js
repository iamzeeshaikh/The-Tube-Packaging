/**
 * The section renderers shared by the category pages, /shop/ and
 * /tube-size-guide/.
 *
 * One set of markup and one stylesheet across all seven pages, so the size
 * vocabulary, the tables and the FAQ pattern read the same wherever a buyer
 * lands. `src/lib/category-css.js` styles everything here.
 */
export const esc = (s) => String(s).replace(/&(?![a-z#0-9]+;)/gi, '&amp;');

export const table = ({ caption, cols, rows }) => `
<div class="ttp-cat__tableWrap">
<table class="ttp-cat__table">${caption ? `<caption>${esc(caption)}</caption>` : ''}
<thead><tr>${cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
<tbody>${rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th>${r.slice(1)
    .map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
</table>
</div>`;

export const paras = (list) => list.map((p) => `<p>${esc(p)}</p>`).join('\n');

export const block = (b) => {
  if (b.table) return `<h3 class="ttp-cat__h3">${esc(b.h3)}</h3>\n${b.lead ? paras([b.lead]) : ''}${table(b.table)}${b.note ? `<span class="ttp-cat__note">${esc(b.note)}</span>` : ''}`;
  return `<h3 class="ttp-cat__h3">${esc(b.h3)}</h3>\n${paras(b.paras)}`;
};

export const section = (mod, eyebrow, h2, body) => `
<section class="ttp-cat ttp-cat--${mod}" aria-labelledby="ttp-cat-${mod}">
<div class="ttp-cat__wrap">
<span class="ttp-cat__eyebrow">${esc(eyebrow)}</span>
<h2 class="ttp-cat__h2" id="ttp-cat-${mod}">${esc(h2)}</h2>
${body}
</div>
</section>
`;

export const cta = (html) => `<div class="ttp-cat__cta"><p>${html}</p></div>`;
