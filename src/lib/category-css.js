/**
 * Styling for the category and shop editorial sections.
 *
 * Namespaced under `.ttp-cat` so it cannot reach any captured WooCommerce or
 * Elementor markup, and built entirely on the `--tpm-*` tokens that
 * `src/lib/modern.js` already defines, so the new sections read as part of the
 * same site rather than bolted on. No captured class name is restyled.
 */
const css = `
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
.ttp-cat__wrap{max-width:1180px;margin:0 auto}

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
