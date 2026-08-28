/**
 * The full configurator, embedded on every product page.
 *
 * The owner asked for the whole thing on the product page rather than a bar
 * linking away to it, and placed after the description. It goes immediately
 * before the "Customization Options" section — Elementor element 605ca9b, which
 * is present on all 35 product pages — so it lands directly after the
 * description and FAQ tabs and before the rest of the marketing sections.
 *
 * The CTA bar is suppressed on these pages: with the configurator itself on the
 * page, a bar pointing at the configurator is noise.
 */
import { configurator } from './configurator.js';

const ANCHOR = '<section class="elementor-section elementor-top-section elementor-element elementor-element-605ca9b';

const HEADING = `
<div class="ttp-cfg-embed">
<div class="ttp-cfg-embed__head">
<span class="ttp-cfg__eyebrow">Design it</span>
<h2>Design your tube packaging</h2>
<p>Build the specification for this product step by step — size, wall, material,
closure and finish — and send it for a quote. Five short steps, no account.</p>
</div>
`;

export function isProduct(route) {
  return route.startsWith('/product/');
}

export function embedConfigurator(html, route) {
  if (!isProduct(route)) return html;
  const at = html.indexOf(ANCHOR);
  if (at === -1) return html;
  return html.slice(0, at) + HEADING + configurator() + '</div>\n' + html.slice(at);
}

const css = `
.ttp-cfg-embed{
  max-width:1180px;margin:0 auto;padding:clamp(26px,3.4vw,46px) 20px;
}
.ttp-cfg-embed__head{margin:0 0 26px;max-width:70ch}
.ttp-cfg-embed__head .ttp-cfg__eyebrow,
.ttp-cfg-embed .ttp-cfg__eyebrow{
  display:inline-block;margin:0 0 12px;padding:7px 14px;border-radius:999px;
  background:var(--tpm-blue-50);border:1px solid var(--tpm-blue-100);
  font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
  color:var(--tpm-blue-strong);
}
.ttp-cfg-embed__head h2{
  margin:0 0 12px;font-size:clamp(24px,2.6vw,34px);line-height:1.15;
  letter-spacing:-.022em;color:var(--tpm-ink);
}
.ttp-cfg-embed__head p{
  margin:0;font-size:16px;line-height:1.62;color:var(--tpm-ink-soft);
}
`;

export const embedCss = `<style id="ttp-cfg-embed-css">${css}</style>`;
