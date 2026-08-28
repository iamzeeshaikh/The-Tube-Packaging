/**
 * A visible way in to the configurator.
 *
 * It was linked from the off-canvas menu and the footer, and the owner still
 * could not find it — correctly. Measured on the live product page: the
 * off-canvas link computes as HIDDEN because the drawer is closed, and the
 * footer link sits at y=10,326 on desktop and y=19,504 on a phone. Neither is
 * an entry point.
 *
 * The desktop header cannot take another element — a menu item and a plain
 * anchor in the CTA slot both wrapped the header row to 272px and made the
 * theme's sticky-header script insert a 746px spacer on every page.
 *
 * So the link goes into the page body instead, directly under the breadcrumb,
 * where it is above the fold and where inserting a sibling is safe: this is the
 * same kind of content-level insertion the category sections already use.
 */
const ANCHOR = '</div><!-- .crumbs -->';

const BAR = `
<div class="ttp-cfgcta">
<span class="ttp-cfgcta__text">Know your size? Not sure yet? Build the specification step by step and send it for a quote.</span>
<a class="ttp-cfgcta__btn" href="https://thetubepackaging.com/tube-configurator/">Build a Quote</a>
</div>`;

export function configuratorCta(html, route) {
  if (!html || route === '/tube-configurator/') return html;
  if (html.indexOf(ANCHOR) === -1) return html;
  // after the first breadcrumb block only
  return html.replace(ANCHOR, ANCHOR + BAR);
}

const css = `
.ttp-cfgcta{
  display:flex;align-items:center;gap:16px;flex-wrap:wrap;
  margin:14px 0 4px;padding:14px 18px;
  border:1px solid var(--tpm-blue-100);border-radius:var(--tpm-r);
  background:linear-gradient(120deg,var(--tpm-blue-50) 0%, #ffffff 70%);
}
.ttp-cfgcta__text{
  flex:1 1 320px;min-width:0;
  font-size:15px;line-height:1.5;color:var(--tpm-ink-soft);
}
.ttp-cfgcta__btn{
  flex:0 0 auto;
  display:inline-flex;align-items:center;justify-content:center;
  min-height:44px;padding:11px 22px;border-radius:12px;
  background:linear-gradient(145deg,var(--tpm-blue) 0%, #4f8bff 100%);
  color:#fff !important;text-decoration:none !important;
  font-size:15px;font-weight:700;letter-spacing:.01em;
  box-shadow:0 10px 22px -12px rgba(33,108,218,.95);
  transition:transform .16s ease, box-shadow .16s ease;
}
.ttp-cfgcta__btn:hover,.ttp-cfgcta__btn:focus,.ttp-cfgcta__btn:focus-visible{
  color:#fff !important;transform:translateY(-1px);
  background:linear-gradient(145deg,var(--tpm-blue) 0%, #4f8bff 100%);
  box-shadow:0 14px 28px -12px rgba(33,108,218,1);outline:none;
}
@media (max-width:600px){
  .ttp-cfgcta{padding:13px 14px;gap:12px}
  .ttp-cfgcta__text{font-size:14.5px}
  .ttp-cfgcta__btn{width:100%}
}
`;

export const configuratorCtaCss = `<style id="ttp-cfgcta-css">${css}</style>`;
