/**
 * The modern presentation layer.
 *
 * The migration carried the WordPress markup across verbatim, so the styling
 * that dated the site lives in the captured theme and Elementor CSS. Rather
 * than rewrite 66 pages of markup, this stylesheet is emitted last into every
 * page head and restyles what the customer sees:
 *
 * - the header dropdowns (a flat 200px list, now a padded panel that splits
 *   into columns once a menu gets long),
 * - the home page's `tp-*` sections (flat white cards, now banded sections
 *   with elevated cards, accent icon tiles and a stronger heading rhythm),
 * - the quote forms (placeholder-only 40px inputs, now 52px fields with
 *   visible labels, real borders and a focus ring),
 * - the single product template shared by every product page (a cramped
 *   three-column block, now a gallery card, a sticky quote panel and readable
 *   description tables).
 *
 * Everything is additive: no captured markup or class name is depended on
 * beyond what the crawl already produced.
 */
const css = `
/* ── tokens ─────────────────────────────────────────────────────────── */
:root{
  --tpm-blue:#216cda;
  --tpm-blue-strong:#1550ad;
  --tpm-blue-ink:#0f3d8c;
  --tpm-blue-50:#eef4ff;
  --tpm-blue-100:#dbe7ff;
  --tpm-ink:#0b1220;
  --tpm-ink-soft:#42506a;
  --tpm-muted:#5f6b83;
  --tpm-line:#e2e8f4;
  --tpm-line-soft:#eef1f8;
  --tpm-surface:#ffffff;
  --tpm-bg:#f6f8fd;
  --tpm-r-sm:10px;
  --tpm-r:14px;
  --tpm-r-lg:20px;
  --tpm-shadow:0 1px 2px rgba(11,18,32,.04), 0 8px 24px rgba(11,18,32,.06);
  --tpm-shadow-lg:0 2px 4px rgba(11,18,32,.04), 0 18px 44px rgba(11,18,32,.10);
  --tpm-ring:0 0 0 4px rgba(33,108,218,.18);
}

/* ── shared primitives ──────────────────────────────────────────────── */
/* every inline icon is sized by its container; these are the fallbacks so a
   stray SVG can never render at its natural 24px-viewBox-scaled size */
.tpm-icon{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;flex:none}
.tpm-icon svg{width:100%;height:100%;display:block}
[class*="__icon"] > svg,[class*="__Icon"] > svg,[class*="Icon"] > svg{width:22px;height:22px}

:where(a,button,summary,[role="button"]):focus-visible{
  outline:2px solid var(--tpm-blue);
  outline-offset:2px;
  border-radius:6px;
}

/* ══════════════════════════════════════════════════════════════════════
   1. Header navigation dropdowns
   ══════════════════════════════════════════════════════════════════════ */
.site-header .site-navigation-1 .sub-menu,
.site-header .site-navigation-2 .sub-menu{
  --dropdown-width:264px;
  --dropdown-items-spacing:10px;
  --dropdown-top-offset:10px;
  --border-radius:16px !important;
  --box-shadow:0 2px 6px rgba(11,18,32,.06), 0 24px 48px -12px rgba(11,18,32,.24) !important;
  --dropdown-divider:0 none transparent;
}

.site-header .menu-item-has-children .sub-menu{
  padding:8px;
  border:1px solid var(--tpm-line);
  background-clip:padding-box;
  transition:opacity .18s ease, transform .18s cubic-bezier(.2,.7,.3,1), visibility .18s linear;
}

/* the pointer bridge the theme draws between trigger and panel */
.site-header .menu-item-has-children .sub-menu:before{height:var(--dropdown-top-offset,10px)}

.site-header .menu-item-has-children .sub-menu li{border-top:none}

.site-header .rishi-menu > .menu-item-has-children > .sub-menu a,
.site-header .menu-item-has-children .sub-menu li a{
  border-radius:10px;
  padding:9px 12px;
  line-height:1.35;
  font-size:15px;
  transition:background-color .16s ease, color .16s ease, padding-left .16s ease;
}

.site-header .menu-item-has-children .sub-menu li > a:hover,
.site-header .menu-item-has-children .sub-menu li > a:focus-visible{
  background:var(--tpm-blue-50);
  color:var(--tpm-blue-strong);
  padding-left:16px;
}

.site-header .menu-item-has-children .sub-menu li.current-menu-item > a{
  background:var(--tpm-blue-50);
  color:var(--tpm-blue-strong);
  font-weight:600;
}

/* Long product menus become a two-column panel instead of a 17-row list.
   The width is kept at 480px on purpose: the theme's own script flips a panel
   to right-aligned when it would overrun the viewport, and a wider panel made
   the left-hand menus flip and hang off the left edge instead. */
@media (min-width:1025px){
  .site-header .rishi-menu > .menu-item-has-children > .sub-menu:has(> li:nth-child(9)){
    --dropdown-width:480px;
    display:grid;
    grid-template-columns:1fr 1fr;
    align-content:start;
    gap:0 6px;
    padding:10px;
  }
}

/* the caret on the trigger turns with the panel */
.site-header .rishi-menu > .menu-item-has-children > a .submenu-toggle svg{
  transition:transform .18s ease;
}
.site-header .rishi-menu > .menu-item-has-children:hover > a .submenu-toggle svg,
.site-header .rishi-menu > .menu-item-has-children:focus-within > a .submenu-toggle svg{
  transform:rotate(180deg);
}

@media (prefers-reduced-motion:reduce){
  .site-header .menu-item-has-children .sub-menu,
  .site-header .rishi-menu > .menu-item-has-children > a .submenu-toggle svg{transition:none}
}

/* ══════════════════════════════════════════════════════════════════════
   2. Home page hero
   ══════════════════════════════════════════════════════════════════════ */
.tp-hero{
  position:relative;
  isolation:isolate;
  background:
    radial-gradient(1100px 520px at 88% -10%, rgba(33,108,218,.10), transparent 60%),
    linear-gradient(180deg,#ffffff 0%, var(--tpm-bg) 100%);
  padding:clamp(36px,5vw,72px) 20px clamp(40px,5vw,76px);
  overflow:hidden;
}
.tp-hero__wrap{
  max-width:1200px;
  margin:0 auto;
  display:grid;
  grid-template-columns:minmax(0,1.02fr) minmax(0,1fr);
  gap:clamp(24px,4vw,56px);
  align-items:center;
}
.tp-hero__eyebrow{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:7px 14px 7px 10px;
  border-radius:999px;
  background:var(--tpm-surface);
  border:1px solid var(--tpm-blue-100);
  box-shadow:0 1px 2px rgba(11,18,32,.05);
  font-size:13px;
  font-weight:600;
  letter-spacing:.02em;
  color:var(--tpm-blue-strong);
}
.tp-hero__eyebrow .tpm-icon{width:18px;height:18px;color:var(--tpm-blue)}
.tp-hero__title{
  margin:18px 0 0;
  font-size:clamp(34px,4.6vw,58px);
  line-height:1.06;
  letter-spacing:-.025em;
  color:var(--tpm-ink);
  text-wrap:balance;
}
.tp-hero__title em{
  font-style:normal;
  background:linear-gradient(120deg,var(--tpm-blue) 0%, #4f8bff 100%);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}
.tp-hero__lede{
  margin:16px 0 0;
  max-width:46ch;
  font-size:clamp(16px,1.25vw,18px);
  line-height:1.6;
  color:var(--tpm-muted);
}
.tp-hero__actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}
.tp-hero__btn{
  display:inline-flex;
  align-items:center;
  gap:10px;
  min-height:52px;
  padding:0 24px;
  border-radius:12px;
  font-size:16px;
  font-weight:600;
  text-decoration:none;
  cursor:pointer;
  transition:transform .16s ease, box-shadow .16s ease, background-color .16s ease, border-color .16s ease;
}
.tp-hero__btn--primary{
  color:#fff;
  background:linear-gradient(180deg,var(--tpm-blue) 0%, var(--tpm-blue-strong) 100%);
  box-shadow:0 10px 22px -8px rgba(33,108,218,.65);
}
.tp-hero__btn--primary:hover{color:#fff;transform:translateY(-1px);box-shadow:0 16px 30px -10px rgba(33,108,218,.7)}
.tp-hero__btn--ghost{
  color:var(--tpm-ink);
  background:var(--tpm-surface);
  border:1px solid var(--tpm-line);
  box-shadow:var(--tpm-shadow);
}
.tp-hero__btn--ghost:hover{color:var(--tpm-blue-strong);border-color:var(--tpm-blue-100);transform:translateY(-1px)}
.tp-hero__btn .tpm-icon{width:19px;height:19px}
.tp-hero__points{
  list-style:none;
  margin:30px 0 0;
  padding:0;
  display:flex;
  flex-wrap:wrap;
  gap:10px 22px;
}
.tp-hero__points li{
  display:flex;
  align-items:center;
  gap:8px;
  font-size:14.5px;
  font-weight:500;
  color:var(--tpm-ink-soft);
}
.tp-hero__points .tpm-icon{width:18px;height:18px;color:var(--tpm-blue);flex:none}

.tp-hero__media{position:relative}
.tp-hero__frame{
  position:relative;
  border-radius:var(--tpm-r-lg);
  overflow:hidden;
  background:var(--tpm-surface);
  border:1px solid var(--tpm-line);
  box-shadow:var(--tpm-shadow-lg);
  aspect-ratio:4/3;
}
.tp-hero__frame img{width:100%;height:100%;object-fit:cover;display:block}
.tp-hero__chip{
  position:absolute;
  left:18px;
  bottom:18px;
  display:flex;
  align-items:center;
  gap:12px;
  padding:12px 18px;
  border-radius:14px;
  background:rgba(255,255,255,.94);
  backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,.7);
  box-shadow:0 12px 30px -12px rgba(11,18,32,.4);
}
.tp-hero__chipNum{font-size:20px;font-weight:700;color:var(--tpm-ink);line-height:1}
.tp-hero__chipLabel{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--tpm-muted);margin-top:4px}
.tp-hero__chipDiv{width:1px;align-self:stretch;background:var(--tpm-line)}

@media (max-width:900px){
  .tp-hero__wrap{grid-template-columns:1fr}
  .tp-hero__media{order:-1}
  .tp-hero__frame{aspect-ratio:16/10}
}
@media (max-width:560px){
  .tp-hero__btn{width:100%;justify-content:center}
  .tp-hero__chip{left:12px;bottom:12px;padding:10px 14px}
}

/* the standard vs eco band that follows the hero */
.tp-plans{
  position:relative;
  padding:clamp(40px,5vw,72px) 20px;
  background:linear-gradient(180deg,#f3ece9 0%, #ede3df 100%);
}
.tp-plans__wrap{
  max-width:1200px;
  margin:0 auto;
  display:grid;
  grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);
  gap:clamp(24px,4vw,48px);
  align-items:center;
}
.tp-plans__media{position:relative;text-align:center}
.tp-plans__media img{max-width:min(100%,440px);height:auto;display:inline-block;filter:drop-shadow(0 30px 40px rgba(60,35,25,.22))}
.tp-plans__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}
.tp-plans__card{
  background:var(--tpm-surface);
  border:1px solid rgba(255,255,255,.9);
  border-radius:var(--tpm-r-lg);
  padding:26px 24px 24px;
  box-shadow:var(--tpm-shadow-lg);
  display:flex;
  flex-direction:column;
}
.tp-plans__tag{
  align-self:flex-start;
  display:inline-flex;
  align-items:center;
  gap:7px;
  padding:6px 12px;
  border-radius:999px;
  font-size:12px;
  font-weight:700;
  letter-spacing:.05em;
  text-transform:uppercase;
  background:var(--tpm-blue-50);
  color:var(--tpm-blue-strong);
}
.tp-plans__card--eco .tp-plans__tag{background:#e8f6ec;color:#1c7a3d}
.tp-plans__tag .tpm-icon{width:15px;height:15px}
.tp-plans__title{margin:14px 0 0;font-size:23px;line-height:1.2;letter-spacing:-.02em;color:var(--tpm-ink)}
.tp-plans__list{list-style:none;margin:16px 0 0;padding:0;display:grid;gap:11px}
.tp-plans__list li{display:flex;gap:10px;align-items:flex-start;font-size:15px;line-height:1.5;color:var(--tpm-ink-soft)}
.tp-plans__list .tpm-icon{width:18px;height:18px;flex:none;margin-top:1px;color:var(--tpm-blue)}
.tp-plans__card--eco .tp-plans__list .tpm-icon{color:#1c7a3d}
.tp-plans__cta{
  margin-top:auto;
  padding-top:22px;
  display:inline-flex;
  align-items:center;
  gap:8px;
  font-size:15px;
  font-weight:600;
  color:var(--tpm-blue-strong);
  text-decoration:none;
}
.tp-plans__cta .tpm-icon{width:17px;height:17px;transition:transform .16s ease}
.tp-plans__cta:hover .tpm-icon{transform:translateX(3px)}
@media (max-width:940px){
  .tp-plans__wrap{grid-template-columns:1fr}
  .tp-plans__media{order:-1}
}

/* ══════════════════════════════════════════════════════════════════════
   3. Home page content sections (tp-industry … tp-faq)
   ══════════════════════════════════════════════════════════════════════ */
.tp-industry,.tp-process,.tp-materials,.tp-trust,.tp-usecases,.tp-sustainability,.tp-faq{
  padding:clamp(52px,6vw,88px) 20px;
}
.tp-industry,.tp-materials,.tp-usecases,.tp-faq{background:var(--tpm-surface)}
.tp-process,.tp-trust,.tp-sustainability{
  background:
    radial-gradient(900px 420px at 12% 0%, rgba(33,108,218,.07), transparent 62%),
    var(--tpm-bg);
  border-block:1px solid var(--tpm-line-soft);
}

/* eyebrow */
.tp-industry__badge,.tp-process__badge,.tp-materials__badge,
.tp-trust__badge,.tp-usecases__badge,.tp-sustainability__badge,.tp-faq__badge{
  display:inline-flex;
  align-items:center;
  gap:9px;
  padding:8px 16px 8px 12px;
  border-radius:999px;
  background:var(--tpm-blue-50);
  border:1px solid var(--tpm-blue-100);
  box-shadow:none;
  font-size:12.5px;
  font-weight:700;
  letter-spacing:.08em;
  text-transform:uppercase;
  color:var(--tpm-blue-strong);
}
.tp-industry__badgeIcon,.tp-process__badgeIcon,.tp-materials__badgeIcon,
.tp-trust__badgeIcon,.tp-usecases__badgeIcon,.tp-sustainability__badgeIcon,.tp-faq__badgeIcon{
  width:17px;height:17px;color:var(--tpm-blue);
}

/* headings */
.tp-industry__title,.tp-process__title,.tp-materials__title,
.tp-trust__title,.tp-usecases__title,.tp-sustainability__title,.tp-faq__title{
  margin:20px 0 0;
  font-size:clamp(29px,3.4vw,44px);
  line-height:1.1;
  letter-spacing:-.028em;
  color:var(--tpm-ink);
  text-wrap:balance;
}
.tp-industry__subtitle,.tp-process__subtitle,.tp-materials__subtitle,
.tp-trust__subtitle,.tp-usecases__subtitle,.tp-sustainability__subtitle,.tp-faq__subtitle{
  margin:14px auto 0;
  max-width:62ch;
  font-size:clamp(15.5px,1.15vw,17.5px);
  line-height:1.62;
  color:var(--tpm-muted);
  text-wrap:pretty;
}

/* cards */
.tp-industry__card,.tp-process__card,.tp-materials__card,
.tp-trust__card,.tp-usecases__card,.tp-sustainability__card{
  position:relative;
  background:var(--tpm-surface);
  border:1px solid var(--tpm-line);
  border-radius:var(--tpm-r-lg);
  box-shadow:var(--tpm-shadow);
  transition:transform .2s cubic-bezier(.2,.7,.3,1), box-shadow .2s ease, border-color .2s ease;
}
.tp-industry__card:hover,.tp-process__card:hover,.tp-materials__card:hover,
.tp-trust__card:hover,.tp-usecases__card:hover,.tp-sustainability__card:hover{
  transform:translateY(-4px);
  border-color:var(--tpm-blue-100);
  box-shadow:var(--tpm-shadow-lg);
}
/* an accent rule that fills in on hover, so the grid reads as interactive */
.tp-industry__card::after,.tp-process__card::after,.tp-trust__card::after,
.tp-usecases__card::after,.tp-materials__card::after,.tp-sustainability__card::after{
  content:"";
  position:absolute;
  left:24px;right:24px;top:0;height:3px;
  border-radius:0 0 3px 3px;
  background:linear-gradient(90deg,var(--tpm-blue) 0%, #6aa0ff 100%);
  transform:scaleX(0);
  transform-origin:left;
  transition:transform .24s cubic-bezier(.2,.7,.3,1);
}
.tp-industry__card:hover::after,.tp-process__card:hover::after,.tp-trust__card:hover::after,
.tp-usecases__card:hover::after,.tp-materials__card:hover::after,.tp-sustainability__card:hover::after{
  transform:scaleX(1);
}

/* icon tiles */
.tp-industry__icon,.tp-process__icon,.tp-materials__icon,
.tp-trust__icon,.tp-usecases__icon,.tp-sustainability__icon{
  width:52px;
  height:52px;
  border-radius:15px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  background:linear-gradient(145deg,var(--tpm-blue-50) 0%, #ffffff 100%);
  border:1px solid var(--tpm-blue-100);
  color:var(--tpm-blue);
  box-shadow:inset 0 1px 0 #fff;
  font-size:0;
  transition:background-color .2s ease, color .2s ease, transform .2s ease;
}
.tp-industry__icon svg,.tp-process__icon svg,.tp-materials__icon svg,
.tp-trust__icon svg,.tp-usecases__icon svg,.tp-sustainability__icon svg{
  width:26px;height:26px;
}
.tp-industry__card:hover .tp-industry__icon,
.tp-process__card:hover .tp-process__icon,
.tp-materials__card:hover .tp-materials__icon,
.tp-trust__card:hover .tp-trust__icon,
.tp-usecases__card:hover .tp-usecases__icon,
.tp-sustainability__card:hover .tp-sustainability__icon{
  background:linear-gradient(145deg,var(--tpm-blue) 0%, #4f8bff 100%);
  border-color:transparent;
  color:#fff;
  transform:scale(1.04);
}
.tp-sustainability__card:hover .tp-sustainability__icon{
  background:linear-gradient(145deg,#1c7a3d 0%, #37a25c 100%);
}

/* card typography */
.tp-industry__cardTitle,.tp-process__cardTitle,.tp-materials__cardTitle,
.tp-trust__cardTitle,.tp-usecases__cardTitle,.tp-sustainability__cardTitle{
  font-size:19px;
  line-height:1.25;
  letter-spacing:-.015em;
  color:var(--tpm-ink);
}
.tp-industry__text,.tp-process__text,.tp-materials__text,
.tp-trust__text,.tp-usecases__text,.tp-sustainability__text{
  font-size:15.2px;
  line-height:1.62;
  color:var(--tpm-muted);
}
.tp-industry__list li,.tp-process__list li,.tp-usecases__list li{
  font-size:14.8px;
  color:var(--tpm-ink-soft);
}

/* process step numbers */
.tp-process__num{
  font-size:13px;
  font-weight:800;
  letter-spacing:.1em;
  color:var(--tpm-blue);
  background:var(--tpm-blue-50);
  border:1px solid var(--tpm-blue-100);
  border-radius:999px;
  padding:5px 12px;
}
.tp-process__card{overflow:hidden}

/* section CTA strips */
.tp-industry__cta,.tp-trust__cta,.tp-usecases__cta,.tp-faq__cta{
  border-radius:var(--tpm-r-lg);
  border:1px solid var(--tpm-blue-100);
  background:linear-gradient(120deg,var(--tpm-blue-50) 0%, #ffffff 65%);
  box-shadow:var(--tpm-shadow);
}
.tp-industry__ctaIcon,.tp-trust__ctaIcon,.tp-usecases__ctaIcon,.tp-faq__ctaIcon{
  width:48px;height:48px;border-radius:14px;
  display:inline-flex;align-items:center;justify-content:center;
  background:linear-gradient(145deg,var(--tpm-blue) 0%, #4f8bff 100%);
  color:#fff;font-size:0;flex:none;
  box-shadow:0 10px 20px -10px rgba(33,108,218,.8);
}
.tp-industry__ctaIcon svg,.tp-trust__ctaIcon svg,.tp-usecases__ctaIcon svg,.tp-faq__ctaIcon svg{width:23px;height:23px}

.tp-materials__noteIcon,.tp-sustainability__noteIcon{
  width:20px;height:20px;color:var(--tpm-blue);flex:none;font-size:0;
}
.tp-materials__noteIcon svg,.tp-sustainability__noteIcon svg{width:20px;height:20px}

/* FAQ */
.tp-faq__item{
  border:1px solid var(--tpm-line);
  border-radius:var(--tpm-r);
  background:var(--tpm-surface);
  box-shadow:0 1px 2px rgba(11,18,32,.04);
  transition:border-color .18s ease, box-shadow .18s ease;
}
.tp-faq__item:hover{border-color:var(--tpm-blue-100)}
.tp-faq__item[open]{
  border-color:var(--tpm-blue-100);
  box-shadow:var(--tpm-shadow);
}
.tp-faq__qIcon{
  width:34px;height:34px;border-radius:10px;
  display:inline-flex;align-items:center;justify-content:center;
  background:var(--tpm-blue-50);
  border:1px solid var(--tpm-blue-100);
  color:var(--tpm-blue);
  font-size:0;flex:none;
}
.tp-faq__qIcon svg{width:18px;height:18px}

/* ══════════════════════════════════════════════════════════════════════
   4. Quote forms — home block and every Elementor form on the site
   ══════════════════════════════════════════════════════════════════════ */
.tp-quote__label,
.elementor-field-group > label.elementor-field-label{
  display:block;
  margin-bottom:7px;
  font-size:13px;
  font-weight:650;
  letter-spacing:.01em;
  color:var(--tpm-ink);
}

.tp-quote__input,.tp-quote__textarea,.tp-quote__select,
.elementor-field-textual,
.woocommerce form .form-row input.input-text,
.woocommerce form .form-row textarea{
  width:100%;
  min-height:52px;
  padding:14px 16px;
  font-size:16px;
  line-height:1.4;
  color:var(--tpm-ink);
  background:#fbfcfe;
  border:1.5px solid #d7dfee;
  border-radius:12px;
  box-shadow:inset 0 1px 2px rgba(11,18,32,.03);
  transition:border-color .16s ease, box-shadow .16s ease, background-color .16s ease;
  -webkit-appearance:none;
  appearance:none;
}
.tp-quote__textarea,
textarea.elementor-field-textual{min-height:132px;padding-top:14px;resize:vertical}

/* Elementor draws its own caret inside .elementor-select-wrapper, so the
   background caret is only for bare selects */
.elementor-select-wrapper select.elementor-field-textual{background-image:none;padding-right:38px}

select.elementor-field-textual,.tp-quote__select{
  padding-right:42px;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%235f6b83' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat:no-repeat;
  background-position:right 14px center;
  text-overflow:ellipsis;
}

.tp-quote__input::placeholder,.tp-quote__textarea::placeholder,
.elementor-field-textual::placeholder{color:#93a0b8;opacity:1}

.tp-quote__input:hover,.tp-quote__textarea:hover,.elementor-field-textual:hover{border-color:#bfcde6}

.tp-quote__input:focus,.tp-quote__textarea:focus,.tp-quote__select:focus,
.elementor-field-textual:focus,
.woocommerce form .form-row input.input-text:focus{
  outline:none;
  background:#fff;
  border-color:var(--tpm-blue);
  box-shadow:var(--tpm-ring);
}

/* the blue panel on the home quote block keeps its own contrast */
.tp-quote__panel .tp-quote__label{color:#0b1220}

.tp-quote__submit,
.elementor-button[type="submit"],
.elementor-form .elementor-button{
  min-height:54px;
  border-radius:12px;
  font-size:16.5px;
  font-weight:650;
  letter-spacing:.01em;
  cursor:pointer;
  transition:transform .16s ease, box-shadow .16s ease, filter .16s ease;
}
.tp-quote__submit:hover,
.elementor-form .elementor-button:hover{transform:translateY(-1px);box-shadow:0 14px 28px -12px rgba(33,108,218,.8)}

/* the payment/secure-site strip inside the quote panel */
.tp-quote__seals{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-top:22px;
}
.tp-quote__seal{
  display:inline-flex;
  align-items:center;
  gap:9px;
  padding:10px 14px;
  border-radius:12px;
  background:rgba(255,255,255,.10);
  border:1px solid rgba(255,255,255,.22);
  color:#eaf1ff;
  font-size:13px;
  font-weight:600;
  line-height:1.2;
}
.tp-quote__seal .tpm-icon{width:18px;height:18px;color:#9dc0ff;flex:none}

/* ══════════════════════════════════════════════════════════════════════
   5. Single product template (shared by every product page)
   ══════════════════════════════════════════════════════════════════════ */
.single-product .site-content{background:var(--tpm-bg)}

/* breadcrumb */
.single-product .archive-title-wrapper{background:transparent;padding-top:18px}
.single-product .rishi-breadcrumbs{font-size:13.5px;color:var(--tpm-muted)}
.single-product .rishi-breadcrumbs a{color:var(--tpm-muted);text-decoration:none}
.single-product .rishi-breadcrumbs a:hover{color:var(--tpm-blue)}
.single-product .rishi-breadcrumbs .separator svg{width:9px;height:9px;opacity:.55}

/* product title */
.single-product .elementor-location-single > .elementor-element:first-of-type h1.elementor-heading-title{
  text-align:left;
  font-size:clamp(30px,3.4vw,44px);
  line-height:1.1;
  letter-spacing:-.028em;
  color:var(--tpm-ink);
  margin-bottom:4px;
}

/* the buy block: description | gallery | quote.
   Elementor lays these out as three 33%-wide flex children, so the columns are
   padded from the inside — a flex gap here would push them past 100% and
   wrap each one onto its own row. */
.single-product .elementor-location-single .elementor-section:nth-of-type(2) > .elementor-container{
  align-items:flex-start;
}
.single-product .elementor-location-single .elementor-section:nth-of-type(2) > .elementor-container > .elementor-column > .elementor-widget-wrap{
  padding-inline:clamp(6px,1vw,16px);
}

.single-product .woocommerce-product-details__short-description p{
  text-align:left;
  font-size:16.5px;
  line-height:1.68;
  color:var(--tpm-ink-soft);
}
/* add-to-cart */
.single-product .elementor-location-single .elementor-button{
  border-radius:12px;
  min-height:52px;
  padding:0 28px;
  font-size:16px;
  font-weight:650;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 10px 22px -10px rgba(33,108,218,.7);
  transition:transform .16s ease, box-shadow .16s ease;
}
.single-product .elementor-location-single .elementor-button:hover{transform:translateY(-1px)}

/* the SSL / ISO / guarantee strip */
.tpm-assure{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(190px,1fr));
  gap:10px;
  margin-top:22px;
}
.tpm-assure__item{
  display:flex;
  align-items:center;
  gap:11px;
  padding:12px 14px;
  border-radius:12px;
  background:var(--tpm-surface);
  border:1px solid var(--tpm-line);
  box-shadow:0 1px 2px rgba(11,18,32,.04);
}
.tpm-assure__icon{
  width:34px;height:34px;border-radius:10px;flex:none;
  display:inline-flex;align-items:center;justify-content:center;
  background:var(--tpm-blue-50);
  border:1px solid var(--tpm-blue-100);
  color:var(--tpm-blue);
}
.tpm-assure__icon svg{width:18px;height:18px}
.tpm-assure__text{min-width:0}
.tpm-assure__title{display:block;font-size:13.5px;font-weight:650;color:var(--tpm-ink);line-height:1.25}
.tpm-assure__note{display:block;font-size:12px;color:var(--tpm-muted);margin-top:2px;line-height:1.3}

/* gallery */
.single-product .woocommerce-product-gallery{
  background:var(--tpm-surface);
  border:1px solid var(--tpm-line);
  border-radius:var(--tpm-r-lg);
  padding:16px;
  box-shadow:var(--tpm-shadow);
  opacity:1 !important;
}
.single-product .woocommerce-product-gallery__wrapper{border-radius:var(--tpm-r);overflow:hidden}
.single-product .woocommerce-product-gallery__image img{
  border-radius:var(--tpm-r);
  width:100%;
  height:auto;
  display:block;
}
.single-product .flex-control-thumbs{
  display:grid !important;
  grid-template-columns:repeat(4,1fr);
  gap:10px;
  margin:14px 0 0 !important;
  padding:0 !important;
  list-style:none;
  overflow:visible !important;
}
.single-product .flex-control-thumbs li{width:auto !important;margin:0 !important;float:none !important}
.single-product .flex-control-thumbs img{
  width:100%;
  height:auto;
  aspect-ratio:1/1;
  object-fit:cover;
  border-radius:11px;
  border:1.5px solid var(--tpm-line);
  background:#fff;
  opacity:1 !important;
  cursor:pointer;
  transition:border-color .16s ease, transform .16s ease;
}
.single-product .flex-control-thumbs img:hover{border-color:var(--tpm-blue-100);transform:translateY(-2px)}
.single-product .flex-control-thumbs img.flex-active{border-color:var(--tpm-blue);box-shadow:var(--tpm-ring)}

/* the quote card beside the gallery.
   Elementor painted the widget container itself with a blue gradient, a 43px
   radius and a hard drop shadow, which framed the white form in a second box.
   The container is neutralised and the card lives on the widget. */
.single-product .elementor-widget-form > .elementor-widget-container{
  background:none !important;
  background-image:none !important;
  box-shadow:none !important;
  border-radius:0 !important;
  padding:20px 22px 22px !important;
}
.single-product .elementor-widget-form{
  background:var(--tpm-surface);
  border:1px solid var(--tpm-line);
  border-radius:var(--tpm-r-lg);
  box-shadow:var(--tpm-shadow);
  overflow:hidden;
}
.single-product .elementor-field-group{margin-bottom:14px}
.single-product .elementor-widget-heading:has(+ .elementor-widget-form) .elementor-heading-title{
  font-size:20px;
  letter-spacing:-.015em;
  text-align:left;
  color:var(--tpm-ink);
  margin-bottom:12px;
}
.single-product .elementor-widget-heading:has(+ .elementor-widget-form) .elementor-heading-title b{font-weight:700}

/* the price note under the short description */
.single-product .elementor-widget-woocommerce-product-short-description + .elementor-widget-text-editor p{
  text-align:left;
  font-size:15.5px;
  line-height:1.6;
  color:var(--tpm-muted);
  background:var(--tpm-surface);
  border:1px solid var(--tpm-line);
  border-left:4px solid var(--tpm-blue);
  border-radius:12px;
  padding:14px 18px;
  margin:0;
}
.single-product .elementor-widget-woocommerce-product-short-description + .elementor-widget-text-editor p strong{color:var(--tpm-ink)}

/* the payment-method logo strip under the form */
.single-product .elementor-widget-image img[src*="Payment"],
.single-product .elementor-widget-image img[src*="Secure-Site"]{
  max-height:34px;
  width:auto;
  opacity:.9;
}

/* file upload row */
.single-product .elementor-field-type-upload input[type="file"],
.tp-quote__file{
  padding:12px 14px;
  border:1.5px dashed #c4d2ea;
  border-radius:12px;
  background:#f8faff;
  font-size:14px;
  width:100%;
  cursor:pointer;
}

/* description body */
.single-product .elementor-widget-woocommerce-product-content,
.single-product .woocommerce-Tabs-panel,
.single-product .elementor-widget-text-editor{
  color:var(--tpm-ink-soft);
}
.single-product .elementor-widget-woocommerce-product-content p,
.single-product .woocommerce-Tabs-panel p{
  text-align:left;
  font-size:16.5px;
  line-height:1.75;
  color:var(--tpm-ink-soft);
  max-width:78ch;
}
.single-product .elementor-widget-woocommerce-product-content h2,
.single-product .woocommerce-Tabs-panel h2{
  font-size:clamp(24px,2.4vw,32px);
  line-height:1.2;
  letter-spacing:-.022em;
  color:var(--tpm-ink);
  margin-top:44px;
}
.single-product .elementor-widget-woocommerce-product-content h3,
.single-product .woocommerce-Tabs-panel h3{
  font-size:20px;
  letter-spacing:-.015em;
  color:var(--tpm-ink);
  margin-top:30px;
}
.single-product .elementor-widget-woocommerce-product-content ul li,
.single-product .elementor-widget-woocommerce-product-content ol li,
.single-product .woocommerce-Tabs-panel li{
  font-size:16px;
  line-height:1.7;
  margin-bottom:6px;
}

/* spec tables */
.single-product .elementor-widget-woocommerce-product-content table,
.single-product .woocommerce-Tabs-panel table{
  width:100%;
  border-collapse:separate;
  border-spacing:0;
  margin:26px 0;
  background:var(--tpm-surface);
  border:1px solid var(--tpm-line);
  border-radius:var(--tpm-r);
  overflow:hidden;
  box-shadow:var(--tpm-shadow);
  font-size:15px;
}
.single-product .elementor-widget-woocommerce-product-content table th,
.single-product .woocommerce-Tabs-panel table th{
  background:var(--tpm-blue-50);
  color:var(--tpm-ink);
  font-size:13px;
  font-weight:700;
  letter-spacing:.06em;
  text-transform:uppercase;
  text-align:left;
  padding:14px 16px;
  border-bottom:1px solid var(--tpm-blue-100);
}
.single-product .elementor-widget-woocommerce-product-content table td,
.single-product .woocommerce-Tabs-panel table td{
  padding:14px 16px;
  border-bottom:1px solid var(--tpm-line-soft);
  color:var(--tpm-ink-soft);
  vertical-align:top;
}
.single-product .elementor-widget-woocommerce-product-content table tr:last-child td,
.single-product .woocommerce-Tabs-panel table tr:last-child td{border-bottom:none}
.single-product .elementor-widget-woocommerce-product-content table tr:hover td{background:#fbfcff}
/* narrow screens scroll the table instead of the page */
.single-product .elementor-widget-woocommerce-product-content .elementor-widget-container,
.single-product .woocommerce-Tabs-panel{overflow-x:auto}

/* tabs */
.single-product .elementor-tabs-wrapper,
.single-product .woocommerce-tabs ul.tabs{
  display:flex;
  width:fit-content;
  max-width:100%;
  margin-inline:auto;
  flex-wrap:wrap;
  justify-content:center;
  gap:6px;
  padding:6px;
  border:1px solid var(--tpm-line);
  border-radius:999px;
  background:var(--tpm-surface);
  box-shadow:var(--tpm-shadow);
  margin-bottom:8px;
}
.single-product .woocommerce-tabs ul.tabs::before{display:none}
.single-product .elementor-tab-title,
.single-product .woocommerce-tabs ul.tabs li{
  border:none !important;
  background:transparent !important;
  border-radius:999px !important;
  padding:10px 20px !important;
  margin:0 !important;
  font-size:15px;
  font-weight:600;
  color:var(--tpm-muted) !important;
  cursor:pointer;
  transition:background-color .16s ease, color .16s ease;
}
.single-product .elementor-tab-title:hover,
.single-product .woocommerce-tabs ul.tabs li:hover{background:var(--tpm-blue-50) !important;color:var(--tpm-blue-strong) !important}
.single-product .elementor-tab-title.elementor-active,
.single-product .woocommerce-tabs ul.tabs li.active{
  background:var(--tpm-blue) !important;
  color:#fff !important;
  box-shadow:0 8px 18px -10px rgba(33,108,218,.9);
}

/* related products */
.single-product .related.products > h2,
.single-product .elementor-widget-woocommerce-product-related h2{
  font-size:clamp(24px,2.6vw,34px);
  letter-spacing:-.022em;
  text-transform:none !important;
  letter-spacing:-.022em !important;
  color:var(--tpm-ink);
  margin-bottom:22px;
}
.single-product ul.products li.product{
  background:var(--tpm-surface);
  border:1px solid var(--tpm-line);
  border-radius:var(--tpm-r-lg);
  padding:14px 14px 18px;
  box-shadow:var(--tpm-shadow);
  text-align:center;
  transition:transform .2s cubic-bezier(.2,.7,.3,1), box-shadow .2s ease, border-color .2s ease;
}
.single-product ul.products li.product:hover{
  transform:translateY(-4px);
  border-color:var(--tpm-blue-100);
  box-shadow:var(--tpm-shadow-lg);
}
.single-product ul.products li.product img{
  border-radius:var(--tpm-r);
  aspect-ratio:1/1;
  object-fit:cover;
  width:100%;
  height:auto;
  background:var(--tpm-bg);
}
.single-product ul.products li.product .cat-wrap{
  font-size:11.5px;
  font-weight:700;
  letter-spacing:.08em;
  text-transform:uppercase;
  color:var(--tpm-blue);
  margin-top:14px;
}
.single-product ul.products li.product .woocommerce-loop-product__title{
  font-size:17px;
  line-height:1.3;
  letter-spacing:-.012em;
  color:var(--tpm-ink);
  margin:6px 0 4px;
}
.single-product ul.products li.product .price{
  font-size:16px;
  font-weight:700;
  color:var(--tpm-ink);
}
/* the theme keeps the loop add-to-cart hidden until the card is hovered, so it
   is left alone — giving it a min-height painted a 2px sliver under the price */
.single-product ul.products li.product .button:not([style*="visible"]){min-height:0}

/* the icon benefit row under related products */
.single-product .elementor-widget-icon .elementor-icon{
  width:54px;height:54px;
  border-radius:16px;
  display:inline-flex;align-items:center;justify-content:center;
  background:linear-gradient(145deg,var(--tpm-blue-50) 0%, #fff 100%);
  border:1px solid var(--tpm-blue-100);
  color:var(--tpm-blue);
}
.single-product .elementor-widget-icon .elementor-icon svg{width:24px;height:24px}

/* the closing "send the layout" band */
.single-product .elementor-location-single .elementor-section:last-of-type .elementor-field-group{margin-bottom:16px}

@media (max-width:1024px){
  .single-product .elementor-location-single .elementor-section:nth-of-type(2) > .elementor-container{flex-wrap:wrap}
}

/* ══════════════════════════════════════════════════════════════════════
   6. Cross-page polish
   ══════════════════════════════════════════════════════════════════════ */
.woocommerce-loop-product__link,
.rishi-menu a,
.elementor-button{cursor:pointer}

img{max-width:100%}

@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{
    animation-duration:.01ms !important;
    animation-iteration-count:1 !important;
    transition-duration:.01ms !important;
    scroll-behavior:auto !important;
  }
}
`;

export const modernCss = `<style id="ttp-modern">${css}</style>`;
