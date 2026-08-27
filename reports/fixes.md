# Stage 2 — objective defect fixes

`[measured]` unless tagged otherwise. Every verification below was run against
the built HTML, and against production where stated.

---

## 2.1 Product metadata mapping — FIXED

Full detail in `reports/metadata-mismatch.md`. Summary:

| Page | Defect | Fix |
|---|---|---|
| `/product/cardboard-tube-packaging/` | title, description, og:title, og:description were a **byte-identical copy** of `/product/candle-tube-packaging/`; 6 of 15 FAQs were about candles; schema `Product.description` and `Review.description` also candle text | correct metadata + 6 FAQs re-framed, schema descriptions corrected |
| `/product/custom-shipping-tubes/` | title, description, og:* described **Lotion Tubes**; schema descriptions likewise. FAQs were correct | correct metadata + schema descriptions |

The work order's noun rule flags 25 pages. Reading all 25, only these two are
genuine — the other 23 are legitimate adjective or use-case language. The
objective discriminator is a **duplicate-title check**, which returned exactly
one collision and now returns **zero**.

`price`, `priceCurrency`, `availability`, `sku`, `brand`, images and
`aggregateRating` untouched — verified as `0.3` USD / InStock / sku 52 and 76 /
rating 5 with 1 review, identical to baseline.

---

## 2.2 Home page OG image — FIXED

**Before:** `og:image = http://thetubepackaging.com/wp-content/uploads/2026/02/ChatGPT-Image-Feb-24-2026-09_27_44-AM.png`

Two defects, as described: the file was deleted from the WordPress media
library before the migration — it 404s on the old site too — and it was declared
over `http://` while the canonical is `https://`. A sweep confirmed it was the
**only** `http://` self-reference in any page head across all 68 pages.

**After:** `https://thetubepackaging.com/wp-content/uploads/2024/07/banner.jpg`
— the home page's actual hero image, already in the project, **1920×765**,
comfortably over the 1200×630 minimum. No image was generated.

**Not fixed, reported:** the page still emits no `og:image:width`,
`og:image:height` or `twitter:image`. Left alone to keep the commit to the
defect described.

---

## 2.3 Quote form product attribution — FIXED

All **70** product quote forms (two per page across 35 pages) shipped:

```
referer_title = "Paper Lip Balm Tubes Wholesale | The Tube Packaging"
queried_id    = 96      (the lip balm product's WooCommerce ID)
```

The work order reported the stale value as "Tea Paper Tubes"; on the current
build it is the lip balm title. Same defect, different stale value.

**Correction to my own first reading, because it nearly shipped a regression.**
`api/form.js` writes the "Sent from" line as `fields.page_url ||
fields.referer_title`, and `page_url` appears nowhere in the static HTML — which
reads like the line was falling through to the wrong title. It is not:
`public/assets/ttp.js` appends `page_url` from `location.href` at submit time.
I had added a hidden `page_url` input; `parseMultipart` turns a repeated field
into an **array**, so the email would have read `Sent from url,url`. Reverted.

So the "Sent from" line was already correct. What was wrong is the attribution
carried in the payload, which is what a CRM or a reply-handling process reads.

### Evidence — real POST bodies, five different product pages `[measured]`

Captured with `scripts/form-payload-probe.mjs`, which fills the form in a real
browser, intercepts the request and **aborts it**. Full output in
`reports/form-payloads.txt`.

| Page | referer_title | queried_id | page_url |
|---|---|---|---|
| `/product/paper-tubes/` | Paper Tubes Wholesale \| The Tube Packaging | 226 | …/product/paper-tubes/ |
| `/product/cosmetic-tubes/` | Cosmetic Tubes Wholesale \| The Tube Packaging | 86 | …/product/cosmetic-tubes/ |
| `/product/kraft-mailing-tubes/` | Kraft Mailing Tubes Wholesale \| The Tube Packaging | 81 | …/product/kraft-mailing-tubes/ |
| `/product/luxury-tube-packaging/` | Luxury Tube Packaging Wholesale \| The Tube Packaging | 179 | …/product/luxury-tube-packaging/ |
| `/product/large-cardboard-tubes/` | Large Cardboard Tubes Wholesale \| The Tube Packaging | 174 | …/product/large-cardboard-tubes/ |

Name, email, phone, product and message fields all present and correct; the
upload field `form_fields[field_e4013ab][]` is present in the payload.

> **MANUAL — not verified:** end-to-end delivery. I did not submit five live
> quotes, because that puts five test enquiries in the client's inbox and I have
> no SMTP credentials of my own. File attachment delivery is likewise unverified.

Deriving the product ID from the page's own schema `sku` rather than the first
`add-to-cart` link matters: the home page's product grid carries other products'
IDs, and the loose version rewrote the home page's `queried_id` from 41 to 184.
Guarded and verified — home page still 41.

Hidden inputs only. No visible field, label, order or styling changed.

---

## 2.4 Case-sensitivity sweep — FIXED

Sweeping the codebase and all rendered output found **1,001** internal URLs
containing an uppercase letter. Only **three are pages**; the rest are asset
filenames (`Secure-Site.png`, `stickyHeader.js`, `fadeInUp.min.css`,
`Why-Wrapping-Paper-Tubes-….avif`) that are genuinely uppercase on disk and
resolve correctly.

| Path | Internal links | Status |
|---|---|---|
| `/product-category/Custom-Paper-Tubes/` | 17 | 200 via a vercel.json rewrite |
| `/product-category/Custom-Cardboard-Tubes/` | 7 | 200 via rewrite — **confirmed live** |
| `/product-category/Custom-Plastic-Tubes/` | 6 | 200 via rewrite |

All 30 internal links now point at the lowercase canonical. The rewrites are
left in place — they catch inbound links from outside the site, which is what
they are for. Uppercase `product-category` links remaining in the build: **0**.
`linkcheck` 0 broken across 16,900 references.

**Not fixed — needs the 2.5 decision:**
`/product-category/Custom-Paper-Tubes/page/2/` returns **404 on production**
(confirmed live) and carries 6 impressions. No rewrite covers the paginated
variant. Creating a redirect depends on whether that URL should exist.

> **Method note that matters for anyone repeating this:** macOS is
> case-insensitive, so this class of bug cannot be reproduced against a local
> origin. That path answers **200 locally and 404 on production**.

---

## 2.5 404 sweep — REPORT ONLY

`reports/status-sweep.csv`, 250 rows, regressions first.

### The live sweep could not be completed, and I am not going to pretend otherwise

Vercel's **Attack Challenge Mode** is active on this project. A paced sweep — 2
concurrent, 350 ms apart, with a 1.5 s retry pass — was answered with
`403 x-vercel-mitigated: challenge` on **all 250 URLs**. Headless Chromium does
not clear the challenge either. So the `status_live` column reads `challenged`
except for the URLs I spot-checked by hand.

The CSV therefore carries **two** status columns:

- `status_live` — real production response, only where one was obtained
- `status_inferred` `[inferred]` — each URL resolved the way the host will:
  redirects, then rewrites, then the file on disk with **case-exact** matching

### Result

| | |
|---|---|
| URLs resolved | 250 |
| Inferred non-200 | **44** |
| …of which are Yoast crop images | 43 |
| …of which are pages | **1** (`/product-category/Custom-Paper-Tubes/page/2/`) |
| **Regressions — earned clicks, now non-200** | **1**, and it is an image (1 click, 26 impressions) |
| **HTML pages that earned clicks and now fail** | **0** |

### Spot-check against production, paced `[measured]`

| URL | Live | Inferred |
|---|---|---|
| `/` | 200 | 200 |
| `/product/cardboard-tube-packaging/` | 200 | 200 |
| `/product-category/custom-cardboard-tubes/` | 200 | 200 |
| `/shop/page/2/` | 200 | 200 |
| `/product-category/Custom-Cardboard-Tubes/` | 200 | 200 |
| `/product-category/Custom-Paper-Tubes/page/2/` | **404** | 404 |
| `…/Cardboard-Tube-Packaging.jpg` | 200 | 200 |
| `…/Cardboard-Tube-Packaging-1200x900.jpg` | **403 deny** | 404 |
| `/product/kraft-paper-candle-tubes/?add-to-cart=111` | 200 | 200 |

**8 of 8 agree.** That is good evidence the inferred column is sound, but it is
8 URLs, not 250.

One thing the spot-check found that inference could not: a **missing file under
`/wp-content/uploads/` returns `403 x-vercel-mitigated: deny`, not 404.** A
made-up filename under that prefix returns the same 403, while a made-up *page*
returns a normal 404. There is a firewall rule denying non-existent paths under
that prefix. Practically both mean "cannot be fetched", but Google may retry a
403 longer than a 404.

No redirects were created. Whether these URLs should exist is the owner's call.

**Vercel log review: MANUAL — not verified.** I have no access to the Vercel
dashboard, so high-frequency 404s not present in the GSC export were not checked.

---

## 2.6 Image URL preservation — REPORT ONLY

Checked every image in Product schema, every product gallery image, and every
image in the Merchant feed — 479 distinct paths, case-exact.

### The part that matters: no Merchant exposure `[measured]`

| | Count | Missing |
|---|---|---|
| Merchant feed `g:image_link` | 35 | **0** |
| Merchant feed `g:additional_image_link` | 106 | **0** |
| Product schema `#primaryimage` | 35 | **0** |
| Product gallery images | — | **0** |

### The regression that does exist

Every product's `Product.image` array holds three entries: the primary
(1200×1200, resolves) plus two Yoast aspect-ratio crops that **do not exist in
the build**:

| Crop | Missing |
|---|---|
| `-1200x675` | 35 |
| `-1200x900` | 35 |

These existed on WordPress — 41 such URLs appear in the GSC export with **203
impressions**, so Google had indexed them. The migration copied the media
library but not Yoast's generated crops. Same root cause as the 43 image
non-200s in the status sweep.

**Impact:** low. The primary image always resolves, so Merchant listings and
product snippets have a working image. 2 of 3 declared `ImageObject`s return
403; Google picks a working one.

**Not fixed, by instruction** — "report it, do not clean it up". Removing them
would also mean editing Product schema, which Section 0 protects. Options for
the owner are in `reports/owner-decisions.md`.

---

## 2.7 Anchor/target mismatch — ONE FIXED, TWO REPORTED

Checked every internal link in editorial body content whose anchor text names a
product, against where it actually points. **Three** mismatches, all pointing at
the home page.

**Fixed — the unambiguous self-referential case:**

| Page | Anchor | Pointed at |
|---|---|---|
| `/product/cardboard-tube-packaging/` | "Cardboard Tube Packaging" | `/` — while the reader is on that page |

The link is removed and the words kept. Re-pointing it at the current URL would
just be a self-link.

**Reported, not changed** — the anchor names a product while the link goes to
the home page, which may be intentional:

| Page | Anchor | Pointed at | Product actually lives at |
|---|---|---|---|
| `/product/kraft-paper-tubes/` | "cardboard tube packaging" | `/` | `/product/cardboard-tube-packaging/` |
| `/product/round-cardboard-tubes/` | "cardboard tube packaging" | `/` | `/product/cardboard-tube-packaging/` |

---

## 2.8 `?add-to-cart=` parameter URLs — REPORT ONLY

### What they do now `[measured]`

| Question | Answer |
|---|---|
| Status on Astro | **200** — confirmed live on `/product/kraft-paper-candle-tubes/?add-to-cart=111` |
| Renders a duplicate? | Yes — byte-identical to the clean URL; a static host ignores the query string |
| Canonical | Correct — points at the clean URL, self-referencing without the parameter |
| Robots meta | `index, follow` |
| **Does the cart flow still work?** | **No.** `cart.js` handles `add-to-cart` only on *click*, by intercepting the anchor. Visiting the URL directly adds nothing — verified: localStorage empty after load. |

That last row is the finding. On WordPress these URLs added an item. On Astro
they are inert duplicates of the clean page, so a searcher landing on one gets
a normal product page and no cart action.

### Scale

| | |
|---|---|
| Parameter URLs in the GSC export | 45, all `add-to-cart=N` |
| Their clicks / impressions | **1 click**, 264 impressions |
| Best position | 4.00 (1 impression) |
| Source | home page tiles emit `https://thetubepackaging.com/?add-to-cart=184` |

`/shop/page/2/` and `/shop/page/3/` are also indexed: 13 and 26 impressions, 0
clicks, positions 17.4 and 20.9. Both carry `index, follow`, self-referencing
canonicals, and correct `rel=prev`/`rel=next`.

### Recommendation — not implemented

1. **Do nothing about canonicals.** They already point at the clean URL, which
   is the correct signal and is working — 45 parameter URLs hold 264 impressions
   between them, i.e. Google is largely ignoring them already.
2. **Stop emitting them.** The home page tiles and loop buttons produce these
   URLs. Since the parameter no longer does anything on page load, the `href`
   could be the clean product URL with the cart action bound to the click — the
   behaviour users get today, without minting indexable duplicates.
3. **Leave `/shop/page/2,3/` indexable** or noindex them — Stage 5 decision.
4. Do **not** add a `robots.txt` disallow: that would block the canonical
   signal rather than consolidate it.

Parameter handling touches canonicals, so nothing here is implemented.

---

## What I could not verify

| Item | Why |
|---|---|
| End-to-end quote email delivery, and file attachment delivery | Would send live test enquiries to the client; no SMTP credentials of my own |
| Live status for 242 of 250 GSC URLs | Vercel Attack Challenge Mode blocked the sweep; 8 spot-checked by hand, all agreeing with inference |
| Vercel log review for high-frequency 404s | No dashboard access |
| Whether Googlebot is affected by the bot mitigation | Cannot impersonate Googlebot. Google reports 860k impressions and 26% Merchant CTR, so there is no evidence it is |

---

# Batch A — schema, indexation and breadcrumbs

Committed one item per commit, built, and **verified against live production**
after deploy. `[measured]` unless tagged otherwise.

Deployed 2026-08-27. `seo/full-programme` fast-forwarded into `main` (18
commits, no divergence), pushed, `vercel --prod`, aliased to
`thetubepackaging.com`. That deploy also carried Stages 1–3, which had been
committed and verified on the branch but were never live.

---

## A1 `priceValidUntil` — FIXED

**Before:** a frozen literal per product, captured from WordPress at crawl time.
5 products expired 10 Nov 2026, all 35 by 24 Dec 2026.

**After:** `src/lib/pricing.js` computes *build date + 1 year* once per build and
rewrites only the `priceValidUntil` value in each page head. Every Vercel deploy
refreshes it, so no deploy can leave an expired date behind. No literal date was
hardcoded.

### Scope — larger than the 35 products `[measured]`

| Where | Offers |
|---|---|
| 35 product pages | 35 |
| 6 category archives (each carries a Product node per listed product) | 37 |
| **Total offers rewritten** | **72** |

The brief specified 35. The category archives carry offer markup too, and
leaving those frozen would have left 37 expiring offers on the exact pages
Batch B is about to rebuild.

### Price is untouched `[measured]`

| Check | Result |
|---|---|
| `"price":"0.3"` in the build, before | 72 |
| `"price":"0.3"` in the build, after | 72 |
| Stale (2026) `priceValidUntil` in the build | **0** |
| Distinct `priceValidUntil` values in the build | 1 |
| Merchant feed `g:price` (product, not shipping) | 35 × `0.30 USD`, unchanged |
| Merchant feed items | 35, unchanged |

A normalised diff — every `priceValidUntil` value replaced with a constant, then
source compared to output across all 66 page records — reports **zero** other
textual difference. The transform cannot touch anything else.

The site emits no `og:price` on any page, so there was nothing there to protect.

### Live verification `[measured]`

`scripts/rich-results-check.mjs` fetches production and validates the JSON-LD
Google parses against its documented product-snippet and merchant-listing
requirements. Five product URLs, all 16 checks passing on each:

```
https://thetubepackaging.com/product/paper-tubes/            [HTTP 200]
  PASS  Offer.price is exactly "0.3"          "0.3"
  PASS  Offer.priceCurrency                   "USD"
  PASS  Offer.availability                    "https://schema.org/InStock"
  PASS  Product.sku                           "226"
  PASS  aggregateRating retained              "5 / 1"
  PASS  Offer.priceValidUntil present         "2027-08-27T01:50:18+00:00"
  PASS  priceValidUntil is in the future
  PASS  priceValidUntil is ~12 months out     "12.0 months"
```

Identical result on `/product/cosmetic-tubes/` (sku 86),
`/product/poster-mailing-tubes/` (sku 60), `/product/luxury-tube-packaging/`
(sku 179) and `/product/large-cardboard-tubes/` (sku 174).

Production before the deploy read `2026-11-12T04:39:23+00:00` on
`/product/paper-tubes/` and `2026-11-10T19:48:56+00:00` on
`/product/poster-mailing-tubes/`; both now read `2027-08-27`.

> **MANUAL — not verified: Google's own Rich Results Test.** It has no public
> API and I did not run the hosted tool, so I will not report a result from it.
> What is above is the same JSON-LD, fetched from production and validated
> against Google's documented requirements — it is not a substitute for the
> tool's own verdict on rich-result eligibility.
>
> **MANUAL — not verified: Merchant listing eligibility.** No Merchant Center
> access. The page-versus-feed price agreement that governs the
> `mismatched value (page crawl) [price]` flag is verified above and unchanged;
> what Merchant Center reports is not.
>
> URLs to paste into https://search.google.com/test/rich-results:
> `/product/paper-tubes/`, `/product/cosmetic-tubes/`,
> `/product/poster-mailing-tubes/`.

---

## A2 GA4 and GTM — DEFERRED BY THE OWNER

Not implemented. The owner's instruction on 2026-08-27 was to handle GA4 and
GTM later. No placeholder ID was shipped.

**Consequence, recorded so it is not a surprise:** the category pages in Batch B
ship without analytics, so their effect can only be read from Search Console
clicks, impressions, CTR and position. On-site behaviour and lead volume before
and after remain unmeasurable. GSC still gives a clean read on the CTR and
click change, which is what Batch B is aimed at.

Detector result stands: **GA4 0 / 68 pages, GTM 0 / 68, Google Ads
`AW-16676839357` 68 / 68.**

---

## A3 Form conversion tracking — DEFERRED BY THE OWNER

Not implemented, same instruction. The design is unchanged and still correct
when it is picked up: fire on the submit success callback in
`public/assets/ttp.js`, which all 9 forms pass through, **not** on `/thank-you/`,
which only 2 of 9 forms reach.

Quote email delivery end-to-end is still **MANUAL — not verified**; the owner is
testing it separately.

---

## A4 Indexation cleanup — FIXED

| Item | Before | After |
|---|---|---|
| `/thank-you/` robots | `index, follow, max-image-preview:large, …` | `noindex, follow` |
| `/cart/` in `page-sitemap.xml` | submitted | removed |
| `/checkout/` in `page-sitemap.xml` | submitted | removed |
| `/my-account/` in `page-sitemap.xml` | submitted | removed |
| `/thank-you/` in `page-sitemap.xml` | submitted | removed |

`/thank-you/` was removed from the sitemap because noindexing it while still
submitting it would recreate exactly the contradiction this item exists to fix.

**Correction to `reports/sitemap-archive.md`.** That report's archive table
records `/thank-you/` as *not* in the sitemap. It was in `page-sitemap.xml`. The
report is amended in place.

### Verification `[measured]`

| Check | Result |
|---|---|
| Robots census across the build, before | 63 index / 5 noindex |
| Robots census across the build, after | 62 index / 6 noindex |
| Unique sitemap URLs, before | 63 |
| Unique sitemap URLs, after | **59** |
| noindex URLs still listed in any child sitemap | **0** |
| Other sitemap entries changed | **0** |

Live, after deploy: `/thank-you/` returns
`<meta name='robots' content='noindex, follow' />`, and
`https://thetubepackaging.com/page-sitemap.xml` lists 8 URLs — home, shop,
shipping-policy, contact-us, terms-conditions, refund_returns, privacy-policy,
about-us. No other child sitemap was opened or edited.

---

## A5 `BreadcrumbList` — FIXED

**Before:** 0 of 68 pages emitted breadcrumb structured data, in JSON-LD,
microdata or RDFa — while all 35 product pages render a correct, linked visible
trail. Only the machine-readable part was missing.

**After:** 61 pages emit one `BreadcrumbList` each.

The trail is taken from what the page already says, so the two cannot drift:

- where the theme renders `.rishi-breadcrumbs`, **its own anchors are used
  verbatim** — same names, same URLs, same order (all 35 product pages);
- where it renders none — the 6 category archives, 7 blog posts, 2 blog category
  archives, the author archive and the static pages — the trail is derived from
  the route and the page's own H1. That is the same hierarchy: the
  `/product-category/mailing-tubes/` H1 is "Custom Mailing Tubes", which is
  character-for-character the name the product breadcrumbs link to.

### Deliberately skipped

| Pages | Why |
|---|---|
| `/` | A one-item breadcrumb is not a trail |
| 6 noindex pages — cart, checkout, order received, my account, lost password, thank-you | Structured data on a page that is not indexed does nothing |

### Verification `[measured]`

`scripts/validate-breadcrumbs.mjs`, run on the built HTML — 68 pages, **0
failures**:

| Check | Result |
|---|---|
| Exactly one `BreadcrumbList` per page | 61 / 61 |
| JSON parses | 61 / 61 |
| Positions contiguous from 1 | 61 / 61 |
| Every `item` URL resolves to a page that exists in the build | 61 / 61 |
| JSON names match the visible trail character for character | 35 / 35 pages that render one |
| **Pre-existing JSON-LD byte-identical to the source record** | **68 / 68** |

That last row is the one that matters against the standing rule. The comparison
normalises A1's `priceValidUntil` and then requires the remaining JSON-LD to be
identical — so Product, Offer, `aggregateRating`, `Review`, `ImageObject` and
every Merchant field are provably untouched, not merely believed to be.

Live, after deploy: `class="ttp-breadcrumb"` present on all five sampled product
URLs and on `/product-category/mailing-tubes/`, with trails such as
`Home > Shop > Custom Specialty Tubes > Luxury Tube Packaging`.
