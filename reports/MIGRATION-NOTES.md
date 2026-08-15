# The Tube Packaging — WordPress to Astro migration

Working notes captured during the build. The formal reports live alongside this
file (`compare.json`, `runtime.json`, `visual.json`).

## How the site is built

`scripts/extract.py` reads a cache-bypassed crawl of the live site and writes
`src/data/pages.json` + `src/data/chrome.json`. The live rendered HTML is the
source of truth for markup: every page's `<head>`, body classes, content block,
inline styles and JSON-LD are carried across verbatim. Astro renders them
through one page template and four shared chrome components.

Header, off-canvas drawer and footer are byte-identical across the site apart
from menu state and WordPress's per-page `loading` / `fetchpriority` hints, so
they live in one shared blob plus a small per-page tag-override map
(`chromeDiff`). This is verified: every page reproduces its original chrome
byte-for-byte.

## What was deliberately removed

Only WordPress-runtime artefacts that cannot exist on a static host:

- feed, oembed, RSD, wlwmanifest, shortlink and `wp-json` `<link>` tags
- `<meta name="generator">` (WordPress / Elementor / WooCommerce fingerprints)
- WordPress nonces and `admin-ajax.php` references
- plugin JS bundles that need a WordPress backend (see below)

## What was deliberately kept

- every stylesheet, inline `<style>` block and CSS custom property
- every meta tag, canonical, OG/Twitter tag, JSON-LD block, breadcrumb
- Google Ads gtag (`AW-16676839357`) incl. the consent block and the
  `page_view` conversion event, Google Listings & Ads `gtag-events.js`,
  both `google-site-verification` metas, Zendesk Chat, reCAPTCHA v2
- the self-contained vendor scripts: jQuery, flexslider, jquery.zoom,
  WooCommerce `single-product.js`, Rishi `custom.js` and `stickyHeader.js`,
  joinchat, Font Awesome v4 shims

## Source-side quirks found and preserved (not fixed — freeze rule)

| # | Finding | Where | Handling |
|---|---------|-------|----------|
| 1 | `og:image` points at `/wp-content/uploads/2026/02/ChatGPT-Image-Feb-24-2026-09_27_44-AM.png`, which 404s on the live site, and uses `http://` | home page | tag copied verbatim; the image genuinely does not exist |
| 2 | A stray `</body></html>` sits in the middle of the post body | `/why-mailing-tubes-are-essential-for-shipping-posters-and-documents/` | copied verbatim |
| 3 | `/product/cardboard-tube-packaging/` carries the title and meta description of `/product/candle-tube-packaging/` | product meta | copied verbatim |
| 4 | `/product/custom-shipping-tubes/` is titled "Custom Lotion Tubes Packaging \| Flip-Top & Pump Caps" | product meta | copied verbatim |
| 5 | Product schema carries `aggregateRating` 5/5 with `reviewCount` 1 and a review authored by the site's own admin address | all 35 products | copied verbatim |
| 6 | `robots.txt` advertises the sitemap over `http://`, and contains two `User-agent: *` blocks | robots.txt | copied verbatim |
| 7 | Three internal links use capitalised category slugs (`/product-category/Custom-Paper-Tubes/`) that WordPress answers 200 with a canonical to the lower-case URL | product pages | reproduced with host rewrites, so the URLs still answer 200 with identical content |
| 8 | `/checkout/` 302-redirects to `/cart/` (WooCommerce empty-cart behaviour) | checkout | reproduced as a 302 redirect |
| 9 | SiteGround's page cache was serving stale markup for 16 of 66 URLs (an older Rishi build using `<span class="submenu-toggle">` instead of `<button>`) | site-wide | crawled with a cache-bypass parameter so the current markup was captured |

## Things that genuinely cannot be reproduced statically

These are recorded rather than worked around, because each one needs a running
WooCommerce backend.

1. **Cart and checkout.** The shop, category and single-product pages all carry
   real WooCommerce add-to-cart links (`/?add-to-cart=<id>&quantity=1`) and the
   product loop buttons are AJAX add-to-cart buttons. The markup, product IDs,
   prices and the `/cart/` and `/checkout/` pages are all preserved exactly, but
   nothing accumulates a cart without WooCommerce. `/checkout/` reproduces the
   live 302 to `/cart/`.
2. **My Account.** `/my-account/` and `/my-account/lost-password/` render
   identically but the login, registration and password-reset forms need
   WordPress to process them.
3. **Related products rotate on the live site.** WooCommerce orders the four
   related products randomly on every request, so the live page shows a
   different four each time. The static build freezes the set captured during
   the crawl. Every product still links to a valid product URL.
4. **Essential Addons "Quick View".** The eye icon on the home page product grid
   opened an AJAX modal via `admin-ajax.php`. The icon and grid are preserved;
   the modal needs a backend.
5. **Omnisend.** Its front-end script talks to `admin-ajax.php` and was dropped.

## Forms

Nine Elementor Pro forms exist across the site. All nine keep their exact
fields, names, `required` flags, placeholders, labels, order, file upload,
honeypot field and submit-button text.

Configuration recovered from the WordPress database (`localhost.sql`) and
reimplemented in `api/form.js`:

| Form ID | Name | Where | Recipients | Redirect |
|---|---|---|---|---|
| e0d8389 | Instant Quote | home | shanimazhar82@gmail.com, customforms24@gmail.com | /thank-you/ |
| 2bb183f5 | Instant Quote | 35 product pages | shanimazhar82@gmail.com, customforms24@gmail.com | /thank-you/ |
| 487202df | New Form ("Find Out the Cost") | 35 product pages | shanimazhar82@gmail.com, customforms24@gmail.com | — |
| 7eeee1ea | Contact Us | contact | shanimazhar82@gmail.com, customforms24@gmail.com | — |
| 693e3f36 | Schedule Appointment | home popup | shanimazhar82@gmail.com, customforms24@gmail.com | — |
| 70a5bdc, 4ec39e2, 4675000, 344590d | Contact Us | policy pages | shanimazhar82@gmail.com, customforms24@gmail.com | — |

- From address: `info@thetubepackaging.com`, from name per form, reply-to set to
  the submitter's email — same as Elementor was configured to send.
- Success / error / invalid messages are the strings configured in WordPress.
- SMTP host, port, user and password were recovered from the site's own
  `wp_mail_smtp` settings (the password is stored libsodium-encrypted with the
  `wp_mail_smtp_mail_key`) and now live in `.env`, which is gitignored.
- The visible reCAPTCHA v2 checkbox on the two quote forms is preserved and is
  verified server-side with the same key pair the WordPress install used.
- The `save-to-database` submit action Elementor performed has no equivalent
  without WordPress; submissions are delivered by email only.

**Test performed:** a real submission through the rendered contact form in a
browser (fields filled, file attached, submit clicked) returned Elementor's
configured success message with the mail accepted by `smtp.gmail.com`. A second
submission through a product-page quote form redirected to `/thank-you/` as
configured. Both were sent to `info@zeecustomboxes.com` via `FORM_TO_OVERRIDE`
so the client's inboxes were not used for testing.

## Deployment

- `vercel.json` sets `trailingSlash: true`, the `/checkout/` → `/cart/` 302 and
  the three case-alias rewrites.
- `api/form.js` is a Node serverless function. It needs these environment
  variables set in the host (see `.env.example`): `SMTP_HOST`, `SMTP_PORT`,
  `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`,
  `RECAPTCHA_SECRET_KEY`.
- `.env` holds the real values locally and is gitignored — the SMTP password and
  reCAPTCHA secret must never be committed.
- `robots.txt` and all seven sitemap files are served from `public/` unchanged,
  so `sitemap_index.xml` and the six child sitemaps keep their existing URLs and
  `lastmod` values.

## Local workflow

```
python3 scripts/crawl.py scripts/crawl   # re-fetch the live site (cache-bypassed)
python3 scripts/extract.py               # crawl -> src/data/*.json
npx astro build                          # production build (dist/)
OUT_DIR=./dist-qa SITE_ORIGIN=http://localhost:4399 npx astro build
SITE_ORIGIN=http://localhost:4399 node scripts/qa-localize.mjs
PORT=4399 DIST_DIR=dist-qa node --env-file=.env scripts/serve.mjs
python3 scripts/compare.py               # static diff vs the live crawl
node scripts/runtime-check.mjs live      # capture live post-JS baseline
node scripts/runtime-check.mjs           # diff local post-JS against it
node scripts/screenshots.mjs live|local|diff
python3 scripts/linkcheck.py
python3 scripts/report.py
```

The QA build exists because the migrated HTML keeps WordPress's absolute
`https://thetubepackaging.com/...` URLs. `SITE_ORIGIN` repoints them (and
`qa-localize.mjs` repoints the ones baked into the copied CSS) so the local copy
can be screenshotted and crawled without silently loading assets from the live
site. Production builds always use the real domain.

## Visual QA method

Full-page screenshots at 1440 / 768 / 390, with animations frozen, all lazy
images forced to load and the WhatsApp bubble hidden so the two sides are
comparable. Two references are used:

- **snapshot** — the captured live HTML replayed from the QA server against the
  same local copies of the assets (`/__live/<route>`). Because both sides come
  from the same capture, this isolates any difference the migration introduced
  from the product grids, which reorder randomly per request.
- **live** — the live site over the network. Also valid, but noisier: the
  home-page product grid and the related-products strip use `orderby: rand`, so
  a different four/eight products appear on every request.

The live host rate-limits automated traffic hard; after several hundred
screenshot requests it began returning 403 to everything from this IP,
including plain `curl`. Live screenshots therefore cover 143 of 198
comparisons; the snapshot reference covers all 198. Screenshots that captured a
403 interstitial were detected (the page has no main menu) and discarded rather
than compared.

## Visual differences investigated

| Finding | Verdict |
|---|---|
| Home-page product grid and related-products strips show different products | `orderby: rand` in both the Essential Addons grid and WooCommerce related products — the live site reorders on every request. The static build freezes one draw. Card markup, layout and styling are identical. |
| Cart page rendered as a grey skeleton | Real defect, fixed. The WooCommerce Blocks cart only becomes the "Your cart is currently empty! / New in store" panel once its bundle hydrates. The hydrated markup is now baked into the page (`src/data/cart-block.html`), so the rendered result matches. |
| `[email protected]` shown instead of the address | Artefact of the *reference*, not the build. Cloudflare rewrites mailto links at its edge and decodes them with an injected script; replaying the HTML locally skipped that. The QA server now performs the same decode, and the build already emitted the real address. |

## Final validation

`python3 scripts/validate.py` asserts the checklist against `dist/` — 25 checks,
all passing: sitemap coverage, trailing slashes, canonicals, no staging URLs,
H1 parity with the live site, JSON-LD type counts identical to the live site,
tracking tags on every page, forms and file upload and reCAPTCHA present,
robots.txt and sitemaps on the production domain, Merchant-relevant price /
availability / SKU signals intact, and no PHP, SQL, CSV, log file, live nonce or
`admin-ajax.php` reference anywhere in the build.

JavaScript-disabled check: every page still renders its content, headings, full
navigation (41 links), footer (22 links), images and forms with scripting off,
and the product gallery stays visible via WordPress's own `<noscript>` rule. The
only things that stop working are the ones that need JavaScript on the live site
too (entrance animations, off-canvas drawer, search modal, gallery slider).

## Not deployed

The build has not been deployed and the live site has not been touched. Run
`npx astro build` and deploy `dist/` plus `api/` once the review is signed off.
