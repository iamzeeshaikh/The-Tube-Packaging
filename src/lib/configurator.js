/**
 * The tube configurator: markup and stylesheet.
 *
 * Every step is rendered into the DOM at build time and the client script shows
 * one at a time, so the whole thing works as a plain form with JavaScript off —
 * every field is a real radio or input inside one <form>, and the submit button
 * posts to the same /api/form/ endpoint the rest of the site uses.
 *
 * There is no price anywhere in here, by design. See the note in
 * src/lib/copy/configurator.js.
 */
import catalogue from '../data/catalogue.json';
import {
  PACKING, SIZES, DIAMETERS, LENGTHS, WALLS, MATERIALS, CLOSURES,
  FINISHES, LINERS, QUANTITIES, STEPS, outro,
} from './copy/configurator.js';

const PRODUCTS = catalogue.products || catalogue;
const esc = (s) => String(s)
  .replace(/&(?![a-z#0-9]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function image(slug) {
  const p = Object.values(PRODUCTS).find((x) => x.slug === slug);
  if (!p) throw new Error(`configurator: no catalogue product "${slug}"`);
  const base = p.image.replace(/-100x100(\.[a-z]+)$/i, '');
  const ext = (p.image.match(/(\.[a-z]+)$/i) || ['.jpg'])[1];
  return {
    src: `https://thetubepackaging.com${base}-300x300${ext}`,
    srcset: `https://thetubepackaging.com${base}-300x300${ext} 300w, `
          + `https://thetubepackaging.com${base}-600x600${ext} 600w`,
    alt: p.name,
  };
}

const radio = (step, opt, i) => `
<label class="ttp-cfg__opt">
<input type="radio" name="form_fields[${step}]" value="${esc(opt.label)}" data-id="${esc(opt.id)}"${i === 0 ? ' data-first="1"' : ''}>
<span class="ttp-cfg__optBody">
<span class="ttp-cfg__optLabel">${esc(opt.label)}</span>
${opt.note ? `<span class="ttp-cfg__optNote">${esc(opt.note)}</span>` : ''}
</span>
</label>`;

const photoRadio = (opt) => {
  const img = image(opt.slug);
  return `
<label class="ttp-cfg__opt ttp-cfg__opt--photo">
<input type="radio" name="form_fields[packing]" value="${esc(opt.label)}" data-id="${esc(opt.id)}"
  data-defaults="${esc(JSON.stringify(opt.defaults))}"${opt.food ? ' data-food="1"' : ''}${opt.plastic ? ' data-plastic="1"' : ''}>
<span class="ttp-cfg__optBody">
<img src="${img.src}" srcset="${img.srcset}" sizes="140px" width="300" height="300" loading="lazy" decoding="async" alt="${esc(img.alt)}">
<span class="ttp-cfg__optLabel">${esc(opt.label)}</span>
</span>
</label>`;
};

const grid = (cls, inner) => `<div class="ttp-cfg__grid ${cls}">${inner}</div>`;

function stepBody(id) {
  switch (id) {
    case 'packing':
      return grid('ttp-cfg__grid--photo', PACKING.map(photoRadio).join(''));
    case 'size':
      return grid('', SIZES.map((o, i) => radio('size', o, i)).join(''));
    case 'diameter':
      // every class's options are rendered; the client shows the matching set
      return Object.entries(DIAMETERS).map(([cls, list]) => grid(
        `ttp-cfg__grid--tight ttp-cfg__diaSet`,
        list.map((d, i) => radio('diameter', { id: d, label: d }, i)).join(''),
      ).replace('<div class="ttp-cfg__grid ', `<div data-size="${cls}" class="ttp-cfg__grid `)).join('');
    case 'length':
      return grid('ttp-cfg__grid--tight', LENGTHS.map((d, i) => radio('length', { id: d, label: d }, i)).join(''));
    case 'wall':
      return grid('', WALLS.map((o, i) => radio('wall', o, i)).join(''));
    case 'material':
      return grid('', MATERIALS.map((o, i) => radio('material', o, i)).join(''));
    case 'closure':
      return grid('', CLOSURES.map((o, i) => radio('closure', o, i)).join(''));
    case 'finish':
      return grid('ttp-cfg__grid--tight', FINISHES.map((o, i) => radio('finish', o, i)).join(''));
    case 'liner':
      return grid('', LINERS.map((o, i) => radio('liner', o, i)).join(''));
    case 'quantity':
      return grid('', QUANTITIES.map((o, i) => radio('quantity', o, i)).join(''));
    case 'details':
      return `
<div class="ttp-cfg__fields">
<p class="ttp-cfg__field"><label for="cfg-name">Full name</label><input id="cfg-name" type="text" name="form_fields[name]" required placeholder="Full name"></p>
<p class="ttp-cfg__field"><label for="cfg-email">Email</label><input id="cfg-email" type="email" name="form_fields[email]" required placeholder="Email"></p>
<p class="ttp-cfg__field"><label for="cfg-phone">Phone</label><input id="cfg-phone" type="tel" name="form_fields[phone]" placeholder="Phone"></p>
<p class="ttp-cfg__field"><label for="cfg-company">Company</label><input id="cfg-company" type="text" name="form_fields[company]" placeholder="Company"></p>
<p class="ttp-cfg__field ttp-cfg__field--wide"><label for="cfg-message">Anything else</label><textarea id="cfg-message" name="form_fields[message]" rows="3" placeholder="Deadlines, a reference pack, anything the specification does not cover"></textarea></p>
<p class="ttp-cfg__field ttp-cfg__field--wide"><label for="cfg-artwork">Artwork or reference (optional)</label><input id="cfg-artwork" type="file" name="form_fields[artwork][]" multiple></p>
</div>`;
    default:
      return '';
  }
}

export function configurator() {
  const steps = STEPS.map((s, i) => {
    const body = s.groups.map((g) => {
      const inner = stepBody(g.field);
      if (!g.label) return inner;
      return `<h3 class="ttp-cfg__group">${esc(g.label)}</h3>\n${inner}`;
    }).join('\n');
    return `
<section class="ttp-cfg__step" data-step="${s.id}"${s.food ? ' data-food-only="1"' : ''} hidden>
<p class="ttp-cfg__count"><span class="ttp-cfg__n">${i + 1}</span> of <span class="ttp-cfg__total">${STEPS.length}</span></p>
<h2 class="ttp-cfg__title">${esc(s.title)}</h2>
<p class="ttp-cfg__hint">${esc(s.hint)}</p>
${body}
</section>`;
  }).join('');

  // the summary lists every field, not every step, now that steps group them
  const FIELDS = [
    ['packing', 'What are you packing'], ['size', 'Size class'],
    ['diameter', 'Internal diameter'], ['length', 'Length'],
    ['material', 'Material'], ['wall', 'Wall thickness'],
    ['closure', 'Closure'], ['finish', 'Finish'],
    ['liner', 'Food-contact liner'], ['quantity', 'Quantity'],
  ];
  const summaryRows = FIELDS.map(([field, label]) => `
<div class="ttp-cfg__sumRow" data-sum="${field}"${field === 'liner' ? ' data-food-only="1"' : ''} hidden>
<dt>${esc(label)}</dt><dd></dd>
</div>`).join('');

  return `
<div class="ttp-cfg" id="ttp-configurator">
<form class="ttp-cfg__form" method="post" novalidate>
<input type="hidden" name="form_id" value="ttpconfig">
<input type="hidden" name="referer_title" value="Design Your Tube Packaging | The Tube Packaging">
<input type="text" name="form_fields[field_228829a]" class="ttp-cfg__hp" tabindex="-1" autocomplete="off" aria-hidden="true">

<div class="ttp-cfg__progress" role="progressbar" aria-label="Progress" aria-valuemin="1" aria-valuemax="${STEPS.length}" aria-valuenow="1">
<span class="ttp-cfg__bar"></span>
</div>

<div class="ttp-cfg__main">
<div class="ttp-cfg__steps">
${steps}
<div class="ttp-cfg__nav">
<button type="button" class="ttp-cfg__back" hidden>Back</button>
<button type="button" class="ttp-cfg__next">Continue</button>
<button type="submit" class="ttp-cfg__send" hidden>Send my specification</button>
</div>
<p class="ttp-cfg__msg" role="alert" hidden></p>
</div>

<aside class="ttp-cfg__summary" aria-label="Your specification">
<h3>Your specification</h3>
<dl class="ttp-cfg__sum">${summaryRows}</dl>
<p class="ttp-cfg__sumEmpty">Nothing chosen yet — start with what you are packing.</p>
<p class="ttp-cfg__sumNote">${esc(outro)}</p>
</aside>
</div>
</form>
</div>`;
}

const css = `
.ttp-cfg{margin:0 0 26px}
/* The hidden attribute is only display:none through a UA rule, so any display
   declaration on a class selector beats it. The summary rows and the diameter
   sets are grids, so they stayed visible when the script hid them and the panel
   showed every label with an empty value before anything was chosen.
   (No backticks in this comment: the stylesheet lives in a template literal.) */
.ttp-cfg [hidden]{display:none !important}
.ttp-cfg__hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0}
.ttp-cfg__progress{height:6px;border-radius:99px;background:var(--tpm-line-soft);overflow:hidden;margin:0 0 22px}
.ttp-cfg__bar{display:block;height:100%;width:9%;border-radius:99px;
  background:linear-gradient(90deg,var(--tpm-blue) 0%, #4f8bff 100%);transition:width .3s cubic-bezier(.2,.7,.3,1)}

.ttp-cfg__main{display:grid;gap:clamp(20px,2.6vw,34px);align-items:start}
@media (min-width:960px){.ttp-cfg__main{grid-template-columns:minmax(0,1.5fr) minmax(0,.72fr)}}

.ttp-cfg__steps{min-width:0}
.ttp-cfg__count{margin:0 0 6px;font-size:12.5px;font-weight:700;letter-spacing:.08em;
  text-transform:uppercase;color:var(--tpm-blue-strong)}
.ttp-cfg__title{margin:0 0 6px;font-size:clamp(21px,2.2vw,28px);line-height:1.2;
  letter-spacing:-.02em;color:var(--tpm-ink)}
.ttp-cfg__group{margin:22px 0 10px;font-size:13px;font-weight:700;letter-spacing:.05em;
  text-transform:uppercase;color:var(--tpm-muted)}
.ttp-cfg__group:first-of-type{margin-top:0}
.ttp-cfg__hint{margin:0 0 18px;font-size:15px;line-height:1.6;color:var(--tpm-muted);max-width:62ch}

.ttp-cfg__grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(min(230px,100%),1fr))}
.ttp-cfg__grid--tight{grid-template-columns:repeat(auto-fit,minmax(min(120px,100%),1fr))}
.ttp-cfg__grid--photo{grid-template-columns:repeat(auto-fit,minmax(min(158px,100%),1fr))}

.ttp-cfg__opt{position:relative;display:block;cursor:pointer;min-width:0}
.ttp-cfg__opt input{position:absolute;opacity:0;width:1px;height:1px}
.ttp-cfg__optBody{
  display:block;height:100%;padding:14px 16px;border:1.5px solid var(--tpm-line);
  border-radius:14px;background:var(--tpm-surface);transition:border-color .15s ease,
  box-shadow .15s ease, background-color .15s ease, transform .15s ease;
}
.ttp-cfg__opt:hover .ttp-cfg__optBody{border-color:var(--tpm-blue-100);transform:translateY(-1px)}
.ttp-cfg__opt input:focus-visible + .ttp-cfg__optBody{box-shadow:var(--tpm-ring)}
.ttp-cfg__opt input:checked + .ttp-cfg__optBody{
  border-color:var(--tpm-blue);background:var(--tpm-blue-50);
  box-shadow:0 10px 22px -14px rgba(33,108,218,.9);
}
.ttp-cfg__optLabel{display:block;font-size:15.5px;font-weight:650;color:var(--tpm-ink);line-height:1.35}
.ttp-cfg__optNote{display:block;margin-top:5px;font-size:13.5px;line-height:1.5;color:var(--tpm-muted)}
.ttp-cfg__opt--photo .ttp-cfg__optBody{padding:12px;text-align:center}
.ttp-cfg__opt--photo img{width:100%;height:auto;aspect-ratio:1/1;object-fit:cover;
  border-radius:10px;margin-bottom:10px;background:var(--tpm-bg)}
.ttp-cfg__opt--photo .ttp-cfg__optLabel{font-size:14.5px}

.ttp-cfg__fields{display:grid;gap:16px 14px;grid-template-columns:repeat(2,minmax(0,1fr))}
@media (max-width:620px){.ttp-cfg__fields{grid-template-columns:1fr}}
.ttp-cfg__field{margin:0;min-width:0}
.ttp-cfg__field--wide{grid-column:1 / -1}
.ttp-cfg__field label{display:block;margin:0 0 7px;font-size:12.5px;font-weight:700;
  letter-spacing:.04em;text-transform:uppercase;color:var(--tpm-muted)}
.ttp-cfg__field input,.ttp-cfg__field textarea{
  width:100%;box-sizing:border-box;min-height:50px;padding:13px 15px;font:inherit;font-size:15.5px;
  color:var(--tpm-ink);background:#f4f7fd;border:1.5px solid transparent;border-radius:13px;
  transition:background-color .16s ease, border-color .16s ease, box-shadow .16s ease;
}
.ttp-cfg__field textarea{min-height:92px;resize:vertical}
.ttp-cfg__field input:focus,.ttp-cfg__field textarea:focus{
  background:#fff;border-color:var(--tpm-blue);box-shadow:var(--tpm-ring);outline:none}
.ttp-cfg__field input[type="file"]{padding:12px 14px;border:1.5px dashed #c9d7f0;cursor:pointer;color:var(--tpm-muted)}
.ttp-cfg__field input[type="file"]::file-selector-button{
  margin-right:12px;padding:8px 14px;border:0;border-radius:9px;cursor:pointer;background:#fff;
  color:var(--tpm-blue-strong);font:inherit;font-size:13px;font-weight:700}

.ttp-cfg__nav{display:flex;gap:12px;margin:26px 0 0;flex-wrap:wrap}
.ttp-cfg__nav button{
  font:inherit;font-size:15.5px;font-weight:700;cursor:pointer;border-radius:13px;
  min-height:52px;padding:14px 26px;border:1.5px solid transparent;transition:all .16s ease;
}
.ttp-cfg__next,.ttp-cfg__send{
  flex:1 1 220px;color:#fff;border:0;
  background:linear-gradient(145deg,var(--tpm-blue) 0%, #4f8bff 100%);
  box-shadow:0 12px 26px -12px rgba(33,108,218,.95);
}
.ttp-cfg__next:hover,.ttp-cfg__send:hover{transform:translateY(-1px);filter:saturate(1.08)}
.ttp-cfg__back{background:var(--tpm-surface);border-color:var(--tpm-line);color:var(--tpm-ink-soft)}
.ttp-cfg__back:hover{border-color:var(--tpm-blue-100);color:var(--tpm-blue-strong)}
.ttp-cfg__nav button[disabled]{opacity:.5;cursor:not-allowed;transform:none;filter:none}

/* Something in the theme styles a focused button as white-on-blue, so clicking
   Continue turned it into what looked like a broken outline button and stayed
   that way until focus moved. The focus state is therefore declared explicitly
   rather than left to inherit, with a visible ring so keyboard users still see
   where they are. */
.ttp-cfg .ttp-cfg__nav button.ttp-cfg__next:focus,
.ttp-cfg .ttp-cfg__nav button.ttp-cfg__next:focus-visible,
.ttp-cfg .ttp-cfg__nav button.ttp-cfg__send:focus,
.ttp-cfg .ttp-cfg__nav button.ttp-cfg__send:focus-visible{
  background:linear-gradient(145deg,var(--tpm-blue) 0%, #4f8bff 100%);
  color:#fff;
  outline:none;
  box-shadow:0 12px 26px -12px rgba(33,108,218,.95), var(--tpm-ring);
}
.ttp-cfg .ttp-cfg__nav button.ttp-cfg__back:focus,
.ttp-cfg .ttp-cfg__nav button.ttp-cfg__back:focus-visible{
  background:var(--tpm-surface);
  color:var(--tpm-blue-strong);
  border-color:var(--tpm-blue);
  outline:none;
  box-shadow:var(--tpm-ring);
}

.ttp-cfg__msg{margin:16px 0 0;padding:13px 15px;border-radius:12px;font-size:15px;line-height:1.55}
.ttp-cfg__msg--ok{background:#e9f7ef;border:1px solid #bfe6cf;color:#1a6b3c}
.ttp-cfg__msg--err{background:#fdecec;border:1px solid #f5c2c2;color:#a32020}

.ttp-cfg__summary{
  padding:22px;border:1px solid var(--tpm-line);border-radius:var(--tpm-r-lg);
  background:var(--tpm-bg);min-width:0;
}
@media (min-width:960px){.ttp-cfg__summary{position:sticky;top:24px}}
.ttp-cfg__summary h3{margin:0 0 14px;font-size:16px;letter-spacing:-.01em;color:var(--tpm-ink)}
.ttp-cfg__sum{margin:0;display:grid;gap:10px}
.ttp-cfg__sumRow{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:10px;
  padding-bottom:10px;border-bottom:1px dashed var(--tpm-line)}
.ttp-cfg__sumRow:last-child{border-bottom:0;padding-bottom:0}
.ttp-cfg__sum dt{margin:0;font-size:13px;font-weight:650;color:var(--tpm-muted)}
.ttp-cfg__sum dd{margin:0;font-size:14.5px;font-weight:650;color:var(--tpm-ink);word-break:break-word}
.ttp-cfg__sumEmpty{margin:0;font-size:14.5px;line-height:1.6;color:var(--tpm-muted)}
.ttp-cfg__sumNote{margin:16px 0 0;padding-top:14px;border-top:1px solid var(--tpm-line);
  font-size:13.5px;line-height:1.6;color:var(--tpm-muted)}

/* with JavaScript off every step is visible and the form still posts */
.no-js .ttp-cfg__step[hidden]{display:block!important}
.no-js .ttp-cfg__next,.no-js .ttp-cfg__back,.no-js .ttp-cfg__progress{display:none}
.no-js .ttp-cfg__send{display:block!important}
`;

export const configuratorCss = `<style id="ttp-cfg-css">${css}</style>`;
