# The Tube Packaging

[thetubepackaging.com](https://thetubepackaging.com) migrated from
WordPress / WooCommerce / Elementor to [Astro](https://astro.build).

A strict 1:1 migration: the live rendered HTML is the source of truth. Every
page's `<head>`, body classes, content, inline styles and JSON-LD are carried
across verbatim and rendered through one Astro template plus four shared chrome
components. All 66 migrated pages compare identical to the WordPress site on
title, meta description, canonical, robots, Open Graph, Twitter tags, H1–H4,
schema, internal links, image `src`/`alt`, `srcset`, forms and rendered text.

The one deliberate departure is the cart: WooCommerce's own cart and checkout
could not work without a backend, so they were rebuilt (see below).

## Layout

| Path | What it is |
|---|---|
| `src/data/pages.json` | every migrated page, extracted from a crawl of the live site |
| `src/data/chrome.json` | the shared header, off-canvas drawer, footer and WhatsApp widget |
| `src/pages/[...path].astro` | renders the migrated pages |
| `src/pages/checkout*` | the cart-flow pages WordPress never served as HTML |
| `public/wp-content/` | the original theme, plugin and upload assets, at their original URLs |
| `api/` | serverless handlers for the contact forms and Cash-on-Delivery orders |
| `scripts/` | the migration and verification pipeline |
| `reports/` | the migration report and working notes |

## Build

```sh
npm install
npx astro build      # -> dist/
```

## Cart and checkout

The cart lives in `localStorage` and reuses the site's existing
`?add-to-cart=<id>` links unchanged. Prices come from each product's own
`Product` JSON-LD, so the cart and the structured data cannot disagree, and
`api/order.js` re-reads them server-side so a tampered payload cannot change a
total. Cash on delivery is the only payment method — the only gateway the
WordPress store had enabled.

Orders are emailed to the store and confirmed to the customer. They are not
stored: there is no order list, stock decrement or order status without a real
commerce backend.

## Configuration

Copy `.env.example` to `.env` and fill it in; set the same variables in the
host. `.env` is gitignored and must stay that way — it holds the SMTP password
and the reCAPTCHA secret.

`vercel.json` sends `X-Robots-Tag: noindex, nofollow` only on hosts matching
`.*\.vercel\.app`, which keeps the staging deploy out of the index while the
site is being reviewed. Because the rule is keyed on the hostname, the header
stops being sent the moment `thetubepackaging.com` is pointed at the project —
there is nothing to remember to undo at cutover, and the production domain
can never inherit a `noindex`.

## Verification

The migration is checked by script, not by eye:

```sh
python3 scripts/crawl.py scripts/crawl   # re-fetch the live site (cache-bypassed)
python3 scripts/extract.py               # crawl -> src/data/*.json
python3 scripts/compare.py               # static diff against the live crawl
node scripts/runtime-check.mjs           # post-JavaScript DOM diff
node scripts/screenshots.mjs diff        # 1440 / 768 / 390 pixel diff
python3 scripts/linkcheck.py             # every internal reference resolves
python3 scripts/validate.py              # the final checklist
python3 scripts/report.py                # writes reports/REPORT.md
```

Latest results: 65/66 pages byte-identical (the 66th is the cart, documented in
`reports/MIGRATION-NOTES.md`), 198/198 screenshot comparisons identical in
height with 197 under 1% differing pixels, zero broken internal references, and
32/32 validation checks passing.
