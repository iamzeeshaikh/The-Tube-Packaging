/**
 * Styling for the category and shop editorial sections.
 *
 * Namespaced under `.ttp-cat` so it cannot reach any captured WooCommerce or
 * Elementor markup, and built entirely on the `--tpm-*` tokens that
 * `src/lib/modern.js` already defines, so the new sections read as part of the
 * same site rather than bolted on. No captured class name is restyled.
 */
const css = `
/* min-width:0 and max-width:100% here are load-bearing, not defensive tidiness.
   On /tube-size-guide/ these sections sit inside the theme's .entry-content,
   which is a flex item, and a flex item defaults to min-width:auto — so the
   widest table's min-width:560px pushed the section itself to 746px inside a
   375px viewport and scrolled the whole page sideways by 386px. The category
   pages were unaffected because they render inside <main> rather than a flex
   item, which is exactly why this had to be measured on every page, not one.
   (No backticks in this comment: the stylesheet lives in a JS template
   literal.) */
.ttp-cat,.ttp-cat__wrap,.ttp-cat__tableWrap{min-width:0;max-width:100%}

/* The custom-tabs plugin ships:
     .entry-content > *:not(.alignwide):not(.alignfull):not(.alignleft)
       :not(.alignright):not(.is-style-wide){
         max-width:fit-content !important; width:fit-content !important }
   Five :not() classes give it (0,6,0) and it is important on both properties,
   so on /tube-size-guide/ every section sized to its widest table instead of
   its container — 746px inside a 375px viewport, scrolling the page sideways by
   386px. The category pages are unaffected because they render inside <main>
   rather than .entry-content.

   The plugin's escape hatch is one of those five classes, but .alignwide also
   carries ".alignwide > a{width:100%}", which would turn every inline link in
   the copy into a full-width block. So the specificity is beaten instead:
   repeating the class six times gives (0,7,0), scoped to these sections only.

   DO NOT DELETE when reorganising this file. It was written in D3 for this
   exact bug, removed by a later rewrite of the stylesheet, and the overflow
   sweep caught the same 386px regression a second time. */
.entry-content > .ttp-cat.ttp-cat.ttp-cat.ttp-cat.ttp-cat.ttp-cat{
  width:auto !important;
  max-width:100% !important;
}

/* The theme frames every archive title in 85px of margin above and below, then
   the content wrapper adds another 80px — 310px between the header and the
   first line of content, of which the H1 occupies 60. Tolerable when these
   pages had nothing on them; now that they do, it just pushes everything below
   the fold.

   The margin comes from
     .woocommerce-page .archive-title-wrapper .tagged-in-wrapper{margin:var(--wooMargin) 0}
   so the variable is overridden rather than the margin — that keeps the theme's
   own mechanism and its responsive steps, at roughly half the size. The
   selector matches the one the theme uses to define it, and this stylesheet is
   emitted last, so equal specificity resolves in its favour. */
.woocommerce.archive .site-content .archive-title-wrapper .tagged-in-wrapper{--wooMargin:44px}
@media (max-width:1024px){
  .woocommerce.archive .site-content .archive-title-wrapper .tagged-in-wrapper{--wooMargin:34px}
}
@media (max-width:768px){
  .woocommerce.archive .site-content .archive-title-wrapper .tagged-in-wrapper{--wooMargin:22px}
}
body.archive .main-content-wrapper{margin-top:34px}
@media (max-width:768px){
  body.archive .main-content-wrapper{margin-top:22px}
}

.ttp-cat{
  margin:0 0 22px;padding:clamp(22px,2.6vw,32px);
  border:1px solid var(--tpm-line);border-radius:var(--tpm-r-lg);
  background:var(--tpm-surface);box-shadow:var(--tpm-shadow);
}
.ttp-cat--intro{
  background:
    radial-gradient(760px 340px at 6% 0%, rgba(33,108,218,.07), transparent 64%),
    var(--tpm-surface);
}
.ttp-cat--fit,.ttp-cat--faq{background:var(--tpm-bg)}
.ttp-cat--spec{margin-top:30px}
.ttp-cat__wrap{width:100%;max-width:1180px;margin:0 auto}

.ttp-cat__eyebrow{
  display:inline-block;margin:0 0 12px;padding:7px 14px;border-radius:999px;
  background:var(--tpm-blue-50);border:1px solid var(--tpm-blue-100);
  font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
  color:var(--tpm-blue-strong);
}
.ttp-cat__h2{
  margin:0 0 14px;font-size:clamp(23px,2.5vw,33px);line-height:1.15;
  letter-spacing:-.022em;color:var(--tpm-ink);text-wrap:balance;
}
.ttp-cat__h3{
  margin:32px 0 10px;font-size:clamp(17.5px,1.5vw,21px);line-height:1.25;
  letter-spacing:-.012em;color:var(--tpm-ink);
}
.ttp-cat__h3:first-child{margin-top:0}
.ttp-cat p{margin:0 0 14px;font-size:16px;line-height:1.68;color:var(--tpm-ink-soft);text-wrap:pretty}
.ttp-cat__lead{max-width:74ch}
.ttp-cat a{color:var(--tpm-blue-strong);text-decoration:underline;text-underline-offset:2px;text-decoration-thickness:1px}
.ttp-cat a:hover{color:var(--tpm-blue)}

/* tables — always scroll inside their own box, never the page */
.ttp-cat__tableWrap{
  overflow-x:auto;margin:0 0 18px;border:1px solid var(--tpm-line);
  border-radius:var(--tpm-r);background:var(--tpm-surface);box-shadow:var(--tpm-shadow);
  -webkit-overflow-scrolling:touch;
}
.ttp-cat__table{width:100%;border-collapse:collapse;min-width:560px;font-size:15px}
.ttp-cat__table caption{
  caption-side:top;text-align:left;padding:14px 16px 0;font-size:13.5px;
  color:var(--tpm-muted);font-weight:600;
}
.ttp-cat__table th,.ttp-cat__table td{
  padding:12px 16px;text-align:left;vertical-align:top;
  border-bottom:1px solid var(--tpm-line-soft);line-height:1.5;color:var(--tpm-ink-soft);
}
.ttp-cat__table thead th{
  background:var(--tpm-blue-50);color:var(--tpm-blue-ink);font-weight:700;
  font-size:13px;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;
  border-bottom:1px solid var(--tpm-blue-100);
}
.ttp-cat__table tbody tr:last-child th,.ttp-cat__table tbody tr:last-child td{border-bottom:0}
.ttp-cat__table tbody th{font-weight:650;color:var(--tpm-ink);white-space:nowrap}
.ttp-cat__table tbody tr:nth-child(even) td,.ttp-cat__table tbody tr:nth-child(even) th{background:#fbfcfe}

.ttp-cat__note{
  display:block;margin:-4px 0 18px;font-size:14px;line-height:1.6;color:var(--tpm-muted);
}
.ttp-cat__cta{
  margin:22px 0 0;padding:16px 18px;border-radius:var(--tpm-r);
  border:1px solid var(--tpm-blue-100);
  background:linear-gradient(120deg,var(--tpm-blue-50) 0%,#fff 68%);
  font-size:15.5px;line-height:1.6;color:var(--tpm-ink-soft);
}
.ttp-cat__cta p{margin:0}

/* FAQ */
.ttp-cat__faq{
  border:1px solid var(--tpm-line);border-radius:var(--tpm-r);background:var(--tpm-surface);
  box-shadow:0 1px 2px rgba(11,18,32,.04);margin:0 0 10px;overflow:hidden;
}
.ttp-cat__faq[open]{border-color:var(--tpm-blue-100);box-shadow:var(--tpm-shadow)}
.ttp-cat__faq > summary{
  list-style:none;cursor:pointer;padding:16px 46px 16px 18px;position:relative;
  font-size:16.5px;font-weight:650;line-height:1.45;color:var(--tpm-ink);
}
.ttp-cat__faq > summary::-webkit-details-marker{display:none}
.ttp-cat__faq > summary::after{
  content:"+";position:absolute;right:18px;top:50%;transform:translateY(-50%);
  font-size:22px;font-weight:400;line-height:1;color:var(--tpm-blue);
}
.ttp-cat__faq[open] > summary::after{content:"\\2212"}
.ttp-cat__faq > summary:hover{color:var(--tpm-blue-strong)}
.ttp-cat__faqBody{padding:0 18px 18px}
.ttp-cat__faqBody p:last-child{margin-bottom:0}

/* ── gallery: what brands pack in these ─────────────────────────────── */
.ttp-cat__gallery{
  display:grid;gap:18px;margin:0 0 4px;
  grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr));
}
.ttp-cat__card{
  display:flex;flex-direction:column;min-width:0;
  border:1px solid var(--tpm-line);border-radius:var(--tpm-r);
  background:var(--tpm-surface);overflow:hidden;
  transition:border-color .18s ease, box-shadow .18s ease, transform .18s ease;
}
.ttp-cat__card:hover{
  border-color:var(--tpm-blue-100);box-shadow:var(--tpm-shadow);transform:translateY(-2px);
}
.ttp-cat__cardMedia{
  display:block;aspect-ratio:1/1;background:var(--tpm-bg);
  border-bottom:1px solid var(--tpm-line-soft);
}
.ttp-cat__cardMedia img{width:100%;height:100%;object-fit:cover;display:block}
.ttp-cat__cardBody{padding:16px 18px 18px}
.ttp-cat__cardTitle{
  margin:0 0 7px;font-size:16.5px;line-height:1.3;font-weight:650;letter-spacing:-.008em;
}
.ttp-cat__cardTitle a{color:var(--tpm-ink);text-decoration:none}
.ttp-cat__cardTitle a:hover{color:var(--tpm-blue-strong);text-decoration:underline}
.ttp-cat__card p{margin:0;font-size:14.5px;line-height:1.6;color:var(--tpm-muted)}

/* ── quote form ─────────────────────────────────────────────────────── */
/* Elementor's field gutter comes from per-widget CSS scoped to the original
   page id and element id, so a cloned form inherits none of it — the fields sat
   flush against each other with no gap at all. The layout is written here
   rather than borrowed. */
.ttp-cat--quote{
  position:relative;
  overflow:hidden;
  border-color:transparent;
  background:
    radial-gradient(900px 420px at 100% -10%, rgba(33,108,218,.16), transparent 58%),
    radial-gradient(700px 380px at -10% 110%, rgba(79,139,255,.13), transparent 60%),
    linear-gradient(160deg,#f7faff 0%, #eef4ff 100%);
  box-shadow:var(--tpm-shadow-lg);
}
.ttp-cat--quote:before{
  content:"";position:absolute;inset:0;pointer-events:none;
  background-image:radial-gradient(rgba(33,108,218,.10) 1px, transparent 1px);
  background-size:22px 22px;
  -webkit-mask-image:linear-gradient(180deg,#000 0%, transparent 62%);
  mask-image:linear-gradient(180deg,#000 0%, transparent 62%);
  opacity:.5;
}
.ttp-cat--quote > .ttp-cat__wrap{position:relative}
.ttp-cat--quote .ttp-cat__eyebrow{background:#fff;border-color:var(--tpm-blue-100)}

.ttp-cat__quoteGrid{display:grid;gap:clamp(24px,3vw,48px);align-items:start}
@media (min-width:920px){
  .ttp-cat__quoteGrid{grid-template-columns:minmax(0,.82fr) minmax(0,1.18fr)}
}

.ttp-cat__quoteAside p{font-size:16.5px;line-height:1.62;max-width:44ch}
.ttp-cat__quoteList{margin:22px 0 0;padding:0;list-style:none;display:grid;gap:13px}
.ttp-cat__quoteList li{
  position:relative;padding-left:34px;font-size:15.5px;line-height:1.55;
  color:var(--tpm-ink-soft);
}
.ttp-cat__quoteList li:before{
  content:"";position:absolute;left:0;top:.1em;width:22px;height:22px;
  border-radius:8px;
  background:linear-gradient(145deg,var(--tpm-blue) 0%, #4f8bff 100%);
  box-shadow:0 6px 14px -6px rgba(33,108,218,.9);
}
.ttp-cat__quoteList li:after{
  content:"";position:absolute;left:7px;top:.52em;width:7px;height:3.5px;
  border-left:2px solid #fff;border-bottom:2px solid #fff;
  transform:rotate(-45deg);
}

/* a direct line, for buyers who would rather not fill anything in */
.ttp-cat__quoteDirect{
  margin:26px 0 0;padding:16px 18px;border-radius:var(--tpm-r);
  background:rgba(255,255,255,.72);border:1px solid var(--tpm-blue-100);
  backdrop-filter:blur(4px);
}
.ttp-cat__quoteDirect span{
  display:block;font-size:12.5px;font-weight:700;letter-spacing:.07em;
  text-transform:uppercase;color:var(--tpm-blue-strong);margin-bottom:8px;
}
.ttp-cat__quoteDirect a{
  display:block;font-size:16px;font-weight:650;color:var(--tpm-ink);
  text-decoration:none;line-height:1.7;
}
.ttp-cat__quoteDirect a:hover{color:var(--tpm-blue-strong);text-decoration:underline}

.ttp-cat__quoteForm{
  padding:clamp(22px,2.8vw,34px);
  border:1px solid rgba(255,255,255,.9);
  border-radius:22px;
  background:rgba(255,255,255,.94);
  backdrop-filter:blur(6px);
  box-shadow:0 2px 6px rgba(11,18,32,.05), 0 28px 60px -28px rgba(11,18,32,.35);
  min-width:0;
}
.ttp-cat__quoteForm .elementor-form{margin:0}

.ttp-cat__quoteForm .elementor-form-fields-wrapper{
  display:grid;grid-template-columns:repeat(2,minmax(0,1fr));
  gap:20px 18px;margin:0 !important;
}
.ttp-cat__quoteForm .elementor-field-group{
  margin:0 !important;padding:0 !important;width:auto;max-width:none;min-width:0;
}
.ttp-cat__quoteForm .elementor-col-100,
.ttp-cat__quoteForm .e-form__buttons,
.ttp-cat__quoteForm .elementor-field-type-recaptcha,
.ttp-cat__quoteForm .elementor-field-type-upload{grid-column:1 / -1}
.ttp-cat__quoteForm .elementor-field-type-text[style*="none"]{display:none}
@media (max-width:620px){
  .ttp-cat__quoteForm .elementor-form-fields-wrapper{grid-template-columns:1fr}
}

.ttp-cat__quoteForm label.elementor-field-label{
  display:block;margin:0 0 8px;font-size:12.5px;font-weight:700;
  letter-spacing:.04em;text-transform:uppercase;color:var(--tpm-muted);
}
.ttp-cat__quoteForm .elementor-field-textual{
  min-height:52px;
  background:#f4f7fd !important;
  border:1.5px solid transparent !important;
  border-radius:13px !important;
  box-shadow:none !important;
  font-size:15.5px;
  transition:background-color .16s ease, border-color .16s ease, box-shadow .16s ease;
}
.ttp-cat__quoteForm .elementor-field-textual::placeholder{color:#9aa6bd}
.ttp-cat__quoteForm .elementor-field-textual:hover{background:#eef3fc !important}
.ttp-cat__quoteForm .elementor-field-textual:focus{
  background:#fff !important;
  border-color:var(--tpm-blue) !important;
  box-shadow:var(--tpm-ring) !important;
  outline:none;
}
.ttp-cat__quoteForm textarea.elementor-field-textual{min-height:134px;resize:vertical}

.ttp-cat__quoteForm input[type="file"].elementor-field{
  width:100%;padding:13px 16px;font-size:14px;color:var(--tpm-muted);
  background:#f4f7fd;border:1.5px dashed #c9d7f0;border-radius:13px;cursor:pointer;
  transition:border-color .16s ease, background-color .16s ease;
}
.ttp-cat__quoteForm input[type="file"]::file-selector-button{
  margin-right:14px;padding:9px 15px;border:0;border-radius:9px;cursor:pointer;
  background:#fff;color:var(--tpm-blue-strong);
  font-size:13px;font-weight:700;font-family:inherit;
  box-shadow:0 1px 2px rgba(11,18,32,.08);
}
.ttp-cat__quoteForm input[type="file"]:hover{border-color:var(--tpm-blue);background:#eef3fc}

.ttp-cat__quoteForm .elementor-g-recaptcha{margin:0}
.ttp-cat__quoteForm .elementor-field-type-recaptcha{margin-top:-4px}
.ttp-cat__quoteForm .e-form__buttons{display:flex}
.ttp-cat__quoteForm button[type="submit"].elementor-button{
  width:100%;min-height:54px;padding:15px 24px;border:0;border-radius:14px;
  background:linear-gradient(145deg,var(--tpm-blue) 0%, #4f8bff 100%);
  color:#fff;font-size:16px;font-weight:700;letter-spacing:.01em;cursor:pointer;
  box-shadow:0 14px 28px -12px rgba(33,108,218,.95);
  transition:transform .16s ease, box-shadow .16s ease, filter .16s ease;
}
.ttp-cat__quoteForm button[type="submit"].elementor-button:hover{
  transform:translateY(-1px);
  box-shadow:0 18px 34px -12px rgba(33,108,218,1);
  filter:saturate(1.08);
}
.ttp-cat__quoteForm button[type="submit"].elementor-button:active{transform:translateY(0)}
.ttp-cat__quoteForm .elementor-message{
  grid-column:1 / -1;margin:0;padding:13px 15px;border-radius:12px;font-size:14.5px;
}
.ttp-cat__quoteForm .elementor-message-success{
  background:#e9f7ef;border:1px solid #bfe6cf;color:#1a6b3c;
}
.ttp-cat__quoteForm .elementor-message-danger{
  background:#fdecec;border:1px solid #f5c2c2;color:#a32020;
}

/* one-line differentiator on each product tile */
.ttp-cat__tileNote{
  display:block;margin:6px 0 10px;font-size:13.5px;line-height:1.5;
  color:var(--tpm-muted);text-wrap:pretty;
}

@media (max-width:640px){
  .ttp-cat{padding-inline:16px}
  .ttp-cat p{font-size:15.5px}
}
`;

export const categoryCss = `<style id="ttp-cat-css">${css}</style>`;
