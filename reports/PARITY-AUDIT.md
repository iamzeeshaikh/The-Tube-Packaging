# Migration parity audit — thetubepackaging.com → thetubepackaging.vercel.app

Run 2026-08-16/17 against the deployed staging build, independently of the
build-time reports. Both sides were compared **as rendered** — the live site and
the Astro build were each loaded in a real browser and the post-JavaScript DOM
was diffed — because comparing served HTML alone would miss everything the
client-side scripts do on either side.

## Method

| Step | What it did |
|---|---|
| URL inventory | fetched `sitemap_index.xml` and all six child sitemaps from the live site |
| Capture | loaded all 67 URLs on both hosts in Chromium, saved the rendered DOM |
| Field diff | title, description, canonical, robots, every OG/Twitter/verification tag, JSON-LD, headings, images + alt + srcset, internal and external links, tel/mailto/WhatsApp, forms and every field, tracking tags, widget counts, visible text |
| Content diff | the same text/heading/image/link comparison with the randomly-ordered blocks removed |
| Visual diff | full-page screenshots at 1440 and 390 on both hosts, per-pixel comparison |
| Behaviour | drove menus, dropdowns, search modal, gallery, tabs, mobile drawer on both hosts |
| Form | real submission through the deployed contact form with a file attached |
| Build integrity | resolved all 1,156 internal references against `dist/`, then rendered all 68 routes from a local copy that serves its own assets |

Two things had to be worked around. The live host answers automated traffic with
a SiteGround captcha, so the crawl runs through a real browser that solves it
once and keeps the cookie. Vercel's automatic DDoS mitigation also began
challenging this IP part-way through, which produced 403s on staging that look
alarming but are client-side mitigation, not the site — proven by the local
render pass below, and by `vercel firewall overview` reporting Attack Mode
**off** and no firewall rules.

## 1. Total original URLs

- `<loc>` entries across the six sitemaps: **64** (`/shop/` is listed in both the
  page and product sitemaps)
- **Distinct sitemap URLs: 63**
- Reachable only through internal links, not in any sitemap: **4**
  (`/shop/page/2/`, `/shop/page/3/`,
  `/product-category/custom-paper-tubes/page/2/`, `/my-account/lost-password/`)
- **Total audited: 67**
- Plus 3 capitalised category aliases the live host answers 200
  (`/product-category/Custom-Paper-Tubes/` and two more) → **70 addressable**

## 2. Total Astro URLs

- Built routes: **68** — all 67 above, plus `/checkout/order-received/`
- Redirects: 2 · host rewrites for the case aliases: 3
- `robots.txt` + `sitemap_index.xml` + 6 child sitemaps, byte-identical `<loc>`
  and `lastmod` values to the live originals

## 3. Missing URLs

**None.** Every one of the 67 URLs returns 200 on staging at its exact path and
trailing slash. Non-slashed requests 308 to the slashed form, matching the live
site's canonical shape.

## 4. URLs with content differences

**65 of 67 identical** once the three blocks the live site randomises are set
aside. The two that differ:

| URL | Difference | Verdict |
|---|---|---|
| `/cart/` | live carries a hidden `a11y-speak` live-region labelled "Notifications", injected by WordPress's `wp-a11y` script | not visible content; the region belongs to the WooCommerce Blocks runtime that does not exist statically |
| `/checkout/` | live 302s to `/cart/`; staging renders a real checkout | **intentional** — the working cart and Cash-on-Delivery checkout added at the client's request |

The randomised blocks are the Essential Addons home grid, WooCommerce related
products and the related-posts strip; all three use `orderby: rand`, so the live
site returns a different set on every request. Verified by cropping the
differing regions on both sides: identical card markup, typography, spacing and
price formatting, different products.

## 5. URLs with metadata differences

**None.** All 67 pages match on title, meta description, canonical, meta robots,
every Open Graph and Twitter tag, both `google-site-verification` tags and
hreflang. Two expected exceptions:

- `<meta name="generator">` (the Elementor/WordPress/WooCommerce fingerprint) is
  deliberately dropped on all 67 pages.
- `/checkout/`'s title, canonical and `og:` tags follow the intentional change
  above.

`noindex, follow` is preserved exactly where WordPress sets it — `/cart/`,
`/checkout/`, `/my-account/`, `/my-account/lost-password/` — and nowhere else.

## 6. Missing images

**One**, and it is missing on the live site too:
`/wp-content/uploads/2026/02/ChatGPT-Image-Feb-24-2026-09_27_44-AM.png`, used by
the home page as both an `<img>` and `og:image`. It returns 404 from live
WordPress. Copied verbatim under the freeze rule; worth repairing in the content
phase, not here.

Every other image resolves. All `src`, `srcset` candidate, CSS background and
alt attribute matches the live site on all 67 pages.

## 7. Broken internal links

**None.** 1,156 distinct internal references across the 68 built pages —
links, images, srcset candidates, stylesheets, scripts and CSS backgrounds —
were resolved against the files `dist/` actually contains plus the host
redirects and rewrites. One unresolved target: the pre-existing 404 above.

## 8. Schema differences

**None remaining.** All 67 pages emit byte-identical JSON-LD: Organization on the
home page, BlogPosting on the 8 posts, Product on all 35 products, ItemList on
the product categories, Person on the author archive.

One real defect was found and fixed: on the five product-category pages and
`/product-category/custom-paper-tubes/page/2/`, **43 ItemList `url` values had
lost their trailing slash**. WooCommerce builds them from the request URI, and
the cache-busting query string the original crawl used made it emit the
slash-less form, which the build then froze. Visitors and Googlebot get the
slashed form.

## 9. Form test results

Tested against the deployed build, with recipients temporarily routed to a
mailbox we control so the client's inboxes were not used. **The override was
removed and the site redeployed afterwards — production env holds no
`FORM_TO_OVERRIDE`.**

- Contact form, all fields filled and a file attached → `POST /api/form/` **200**
  `{"ok":true,...}`, Elementor's configured success message rendered, no JS
  errors. SMTP accepted the mail, so the deployed function's SMTP credentials
  are correct.
- Quote form (the one carrying the visible reCAPTCHA v2 checkbox) submitted
  without ticking the box → blocked with the configured invalid message
  ("There's something wrong. The form is invalid.") and no POST issued, matching
  Elementor's own behaviour. The server verifies the token as well. Completing
  this path needs a human to tick the checkbox; it was verified interactively
  during the build.
- All 9 forms keep their exact fields, names, order, required flags,
  placeholders, labels, file upload and honeypot.
- The Google Ads `page_view` conversion fired on the deployed page during the
  test, so tracking works in production conditions.

## 10. Visual differences fixed

134 full-page comparisons (67 URLs × desktop 1440 and mobile 390):

- identical full-page height: **112 / 134**
- under 1% differing pixels: **95 / 134**

**One genuine visual defect found and fixed.** The author archive rendered the
author's address as a clickable `mailto:` link; the live page renders it as plain
text. Cloudflare wraps that plain-text address in a bare
`<a class="__cf_email__">` and its own decoder restores plain text, but the
extractor was rebuilding it as a real link. After the fix that page is
**0.000% differing pixels at both breakpoints** (it was 6.4% at desktop).

Every other difference above 1% was traced to a randomised block, to the
WhatsApp bubble's 3-second reveal delay landing either side of the capture, or
to sub-pixel text offsets. `/checkout/` differs by design.

## 11. Remaining migration issues

Nothing outstanding that the migration can fix. What is left, and why:

| Item | Why it stays |
|---|---|
| `/checkout/` no longer 302s to `/cart/` | the working cart and COD checkout were requested by the client; this is the one deliberate break from 1:1 |
| Orders and form entries are emailed, not stored | no commerce backend and no WordPress to store them in |
| My Account login / registration / password reset are inert | needs WordPress to process the POST. The password show/hide toggle is also absent, because WooCommerce injects it with the script that has no backend to talk to |
| Essential Addons Quick View modal | opened over `admin-ajax.php`; icon and grid are preserved |
| Home grid and related products/posts are frozen in one order | the live site draws them with `orderby: rand` |
| Home page `og:image` and `<img>` 404 | the file does not exist on the live site either |
| Hidden `a11y-speak` region on `/cart/` | part of the WooCommerce Blocks runtime |
| `referer_title` / `queried_id` hidden fields carry one product's values on all 35 product pages | the **live site does the same** — WordPress caches them per object cache, so it currently sends "Tea Paper Tubes" everywhere. Frozen as found; flagging it because it mislabels quote emails on the live site today |
| `og:image` uses `http://`, `robots.txt` advertises the sitemap over `http://` and has two `User-agent: *` blocks, three product pages carry another product's title/description, product schema carries a 5/5 `aggregateRating` with one self-authored review | all present on the live site; preserved under the freeze rule, all candidates for the content/SEO phase |

## 12. Is production deployment safe?

**Yes.** The evidence:

- All 67 source URLs exist at their exact paths; nothing 404s and nothing moved.
- Rendered content, metadata and schema match the live site everywhere except
  the two documented cases.
- The build is self-contained. All 68 routes were rendered from a local copy
  serving its own assets — the post-cutover condition — with **zero missing
  assets, zero failed requests, zero JavaScript errors and zero font failures**,
  Font Awesome included. The only 400-class response was the image that 404s on
  live as well.
- Menus, dropdowns, search modal, product gallery, tabs, mobile drawer and the
  WhatsApp bubble behave identically to the live site at 1440 and 390, with no
  horizontal overflow.
- The forms deliver mail from the deployed function; reCAPTCHA is enforced.
- `validate.py`: 32 checks, 32 passed.

Two notes for the cutover itself:

1. **The staging noindex retires itself.** `vercel.json` sends
   `X-Robots-Tag: noindex, nofollow` only on hosts matching `.*\.vercel\.app`.
   Pointing `thetubepackaging.com` at the project stops the header being sent —
   there is nothing to remember to undo, and the production domain can never
   inherit a `noindex`. Confirmed live on the staging host, and no `noindex`
   exists in any built page except the four WooCommerce pages that carry
   WordPress's own.
2. **Staging borrows its assets from the live domain.** The migrated HTML keeps
   absolute `https://thetubepackaging.com/...` URLs, so today staging loads CSS,
   JS and images from the WordPress host. Two consequences worth knowing: the
   Font Awesome webfont is refused cross-origin on the staging host (it loads
   correctly same-origin, verified), and staging cannot be used to judge whether
   `dist/` is complete — the local render pass is what proves that. Both resolve
   the moment DNS moves.
