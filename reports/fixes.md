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

---

# Batch B — the five category pages, and /shop/

`[measured]` against the built HTML. `[export]` figures were re-checked against
`data/gsc/queries.csv` programmatically with `scripts/query-slice.py` before any
copy was written; none is from memory.

## B0 — already done, and not redone

Meta descriptions for all six URLs were written in commit `8ead883` and shipped
alone, with no body content, no H1 change and no price change. They reached
production for the first time in today's deploy. B0 was not repeated.

The isolation B0 was designed to give is now a matter of hours rather than
weeks, because the branch had never been deployed. That is recorded as a
decision for the owner in `owner-decisions.md` item 15.

## What changed, measured `[measured]`

Editorial words counted inside `<main>`, excluding the product grid, the
pagination and the sorting form. Stage 5's figure of 28–32 for these pages
additionally counted the H1, the result count and the sorting dropdown labels.

| Page | Editorial words before | After | Tiles | Tables | FAQs |
|---|---|---|---|---|---|
| `/product-category/custom-cardboard-tubes/` | 4 | **1,516** | 8 | 5 | 5 |
| `/product-category/mailing-tubes/` | 4 | **1,334** | 3 | 4 | 5 |
| `/product-category/custom-paper-tubes/` | 9 | **1,554** | 16 | 6 | 5 |
| `/product-category/specialty-tubes/` | 4 | **1,837** | 3 | 6 | 5 |
| `/product-category/custom-plastic-tubes/` | 4 | **1,026** | 6 | 3 | 4 |
| `/shop/` | 10 | **950** | 16 | 3 | 4 |
| `/product/tube-food-packaging/` | — | **+1,253** | — | 3 | 5 |
| `/tube-size-guide/` (new) | — | **1,952** | — | 5 | 6 |

Intro length, against the 80–120 word target: 108, 120, 120, 117, 117, 99.
All six inside range.

## The price element — the constraint that governed the implementation

Each tile's one-line differentiator is inserted **immediately before the
add-to-cart link**, which is *after* the anchor wrapping the title and the price.
The price element keeps its text, its markup, its formatting and its position
within its parent; adding a later sibling cannot move it. Inserting *before* it
would have shifted its index, so that was never an option.

| Check | Result |
|---|---|
| Visible `$0.30` price elements, source vs build, every page | **204 = 204**, 0 pages mismatched |
| Tiles where the note precedes the price | **0** |
| `"price":"0.3"` in the build | 72, unchanged |
| `Product` / `Offer` / `AggregateRating` / `Review` nodes | 72 each, unchanged |
| Merchant feed items and `g:price` | 35 × `0.30 USD`, unchanged |

## Verification `[measured]`

| Check | Tool | Result |
|---|---|---|
| Every editorial link resolves to a page in the build | `scripts/check-editorial-links.mjs` | **54 / 54** |
| Descriptive anchors, 2–9 words, none banned | same | pass |
| At most one link per paragraph | same | pass |
| Whole-site link integrity | `scripts/linkcheck.py` | **0 broken across 17,130 references** |
| Breadcrumbs still valid, existing JSON-LD untouched | `scripts/validate-breadcrumbs.mjs` | 69 pages, 0 failures |
| No page-level horizontal overflow; wide tables scroll in their own box | `scripts/overflow-check.mjs` (real browser) | pass at **375 / 768 / 1440px**, all 31 tables scrolling internally |
| US spelling | grep over the built pages | 0 British spellings in the new content |

## Corrections to earlier reports

**Product counts.** `reports/sitemap-archive.md` records 10, 5, 18, 5, 8 products
for the five categories and 18 for `/shop/`. Counted from the rendered grids and
the WooCommerce result count, the real figures are **8, 3, 17, 3, 6 and 35**.

## B3 — the two honest assessments the brief asked for

**Specialty Tubes.** As a shelf of three products — Luxury Tube Packaging, Paper
Lipstick Tubes, Tube Food Packaging — it is a leftovers drawer, and I am not
going to pretend those three share a buyer. What they do share is real: in all
three the specification carries on past the wall, into a barrier liner, a
food-contact interior or a finish system. That is a genuine distinction from
protection, transit, print surface and squeeze dispensing, and the page is
written to it. **The recommendation to split the food line into its own category
still stands** — it is the biggest thing in there and it is buried behind two
cosmetic products — but that needs a URL, which Section 0 protects. It is in
`owner-decisions.md` item 4.

**Plastic Tubes.** It earns a page, barely, and is deliberately the shortest of
the five. Against it: the whole plastic cluster is 45 queries, 13,415
impressions, 24 clicks at **0.18% CTR and weighted position 32.4** `[export]` —
the weakest on the site — and 30 of those 45 queries have never earned a click.
Content will not move a page from position 32. For it: six products live there
and the products do convert (`/product/lotion-tubes/` earns 97 clicks at 1.19%
CTR from position 13.33). The category is failing, not the range. So the page
does the one job it can do — route by formulation, and send anything solid or
dry to paper. Whether the plastic line is being pushed at all stays an owner
decision.

---

# Batch C — `/tube-size-guide/`

A new page at `/tube-size-guide/`, 1,952 words, indexable, in the sitemap
(59 → 60 URLs), with a `BreadcrumbList`, a meta description and a canonical.

Built on the captured `/about-us/` record through `src/lib/contentpage.js`, so it
carries the same head, chrome and scripts as every other page, with its own
identity swapped in.

## What it targets, and the honest size of that

The brief's premise is confirmed by the export: buyers search relative size
words, the site ranks for them, and nothing defined them. All 14 figures below
were re-checked against `data/gsc/queries.csv` `[export]`:

| Query | Impressions | Clicks | Position |
|---|---|---|---|
| large tube | 7,100 | 1 | 14.44 |
| large cardboard tubes | 4,681 | 25 | 16.81 |
| large tubes | 1,418 | 5 | 14.53 |
| small tube packaging | 969 | 1 | 10.95 |
| large cardboard tube | 785 | 8 | 20.33 |
| largetube | 784 | 0 | 7.41 |
| thick cardboard tubes for crafts | 702 | 7 | 9.02 |
| small cardboard tubes | 567 | 8 | 13.53 |
| thick cardboard tubes | 527 | 6 | 11.89 |
| large round cardboard tubes | 507 | 0 | 7.52 |
| large cardboard cylinder tubes | 468 | 3 | 4.14 |
| small diameter paper tubes | 380 | 1 | 7.05 |
| large diameter cardboard tubes | 344 | 5 | 16.45 |
| small paper tubes | 276 | 7 | 7.52 |

So the vocabulary is in the headings, not only in a table: **three headings each
containing "large", "small" and "thick"**, anchored to real diameters and wall
thicknesses. A dimensions table without those words would not capture these
queries, which is the point of the page.

**But the traffic case is smaller than it looks, and Stage 4 was right about
that.** Most of that cluster is size adjectives already served by the large and
small product pages; the genuine fit-checking demand is closer to 1,900
impressions. The page's real return is as a sales tool — a buyer arriving at the
quote form already knowing their diameter, wall and closure — which is the
lead-qualification problem, not a ranking one. It should be measured that way.

## What is on it

The vocabulary defined first; a diameter and length reference table from ½″ to
12″ with a size-class column so the table itself carries the words; how to
measure so it fits first time; a product-to-size table routing twelve product
types to a diameter, a size class and a linked page; wall thickness and board
weight with a straight answer on when a heavier board is worth paying for; nine
closure types; six FAQs.

**No lead time and no price figure appears on the page.** MOQ language is the
confirmed 500 / ~100 policy only.

---

# What Batch B and C did not verify

| Item | Why |
|---|---|
| Google's own Rich Results Test on any page | No public API; the hosted tool was not run |
| Whether any of this moves CTR | Needs four to eight weeks of Search Console data. With GA4 deferred, GSC is the only instrument |
| The compliance claims against supplier documentation | No access to the manufacturers' paperwork. All 9 are logged verbatim in `owner-decisions.md` item 12 for checking |
| The specification figures against the owner's actual manufacturers | Written as standard industry specification, as instructed. Diameters, walls, boards, closures, liners and finishes are all standard and available, but they have not been confirmed against a specific supplier's tooling |
| End-to-end quote email delivery | Unchanged from Stage 2.3 — still owner-tested separately |

---

# Batch D — everything else outstanding

Instructed on 2026-08-27: do all the remaining items except GA4/GTM and
conversion tracking. `[measured]` against the built HTML unless tagged.

| | Item | Result |
|---|---|---|
| D1 | Mailing category rename | 31 occurrences, one pass |
| D2 | Pasted ChatGPT UI markup | 40 pages, 4,063 artefacts |
| D3 | Horizontal overflow on mobile | 6 pages → 0, one of them mine |
| D4 | Anchor/target mismatches | 2 fixed |
| D5 | `Custom-Paper-Tubes/page/2/` 404 | alias added |
| D6 | Stage 5 archive policy | 5 pages noindexed |
| D7 | Missing Yoast crops | 68 regenerated |
| D8 | `?add-to-cart=` URLs | 278 → 0 crawlable |

## D3 — a correction to what I told you, and a regression I had shipped

`scripts/overflow-check.mjs`, written in Batch B, measured `./dist` against a
local server. The captured pages reference the theme's CSS by absolute
production URL, so the browser was rendering them **unstyled**. Every number it
produced was noise, including the "9 pages before, 7 after" in the D2 commit.

Measured correctly — a QA build with `SITE_ORIGIN` pointed at the local server,
so the real theme CSS loads — the truth was six pages, and the worst of them was
a page I had shipped four commits earlier:

| Page | Overflow | Cause |
|---|---|---|
| `/tube-size-guide/` | **386px** | mine — see below |
| `/contact-us/` | 14px | Elementor gutter + a native file input |
| `/about-us/` | 7px | Elementor gutter |
| `/privacy-policy/` | 7px | Elementor gutter |
| `/refund_returns/` | 7px | Elementor gutter |
| `/terms-conditions/` | 7px | Elementor gutter |

**The regression.** The `custom-tabs` plugin ships
`.entry-content > *:not(.alignwide):not(.alignfull):not(.alignleft):not(.alignright):not(.is-style-wide){max-width:fit-content !important; width:fit-content !important}`
— specificity (0,6,0), important on both properties. Every section on the size
guide sized to its widest table rather than its container: 746px inside a 375px
viewport. The five category pages were unaffected because they render inside
`<main>` rather than `.entry-content`, which is precisely why this had to be
measured on all 69 pages and not the 7 I had touched.

The plugin's own escape hatch is one of those five classes, but `.alignwide`
also carries `.alignwide > a{width:100%}`, which would have turned every inline
link in the copy into a full-width block. The specificity is beaten instead,
scoped to these sections only.

**Two fixes were removed rather than kept.** The unstyled run had me add a
`box-sizing:border-box` declaration and a mobile table-scroll media query.
With the real CSS loaded, the theme already sets `border-box` and no table was
overflowing. Neither fixed anything, so both were deleted — dead CSS left in
place to look thorough is worse than not writing it.

`scripts/overflow-check.mjs` is deleted; `scripts/overflow-sweep.mjs` replaces
it, runs against the QA build at 375/768/1440px across all 69 pages, and names
the shallowest offending element. **Result: 0 overflowing at all three widths.**

## D2 — the ChatGPT markup was 40 pages, not 7

`owner-decisions.md` item 9 recorded seven FAQ panels. Enumerating every page
record instead:

| | Count |
|---|---|
| Wrapper elements unwrapped | 44 |
| Turn/message attributes removed | 39 |
| `data-start` / `data-end` attributes removed | **3,980** (67,267 bytes) |
| Claude UI class tokens cleaned (cosmetic blog guide) | 141 |
| **Pages affected** | **40 of 66** |

Every page is checked before and after: visible text must match character for
character and the element census must be unchanged, or the script writes
nothing. The guard caught an earlier version destroying two real `<table>`s
whose class happened to contain a ChatGPT token.

## D7 — the crop count was 68, not 70

All 68 had their 1200×1200 primary on disk. Centre crops to 16:9 and 4:3, 4.6 MB.

| Check | Before | After |
|---|---|---|
| `ImageObject` URLs across the 35 product pages | 140 | 140 |
| …that do not exist | **70** | **0** |

## D8 — 278 add-to-cart links, two different fixes

243 loop and tile buttons now point at the clean product URL; `cart.js` falls
back to `data-product_id` and its selector still matches on
`a.add_to_cart_button`.

The other 35 are Elementor buttons on the product pages with no
`data-product_id` and no `add_to_cart_button` class — `cart.js` can only find
them through the href, so cleaning it would break them, and making them findable
would mean changing what Elementor styles. They get `rel="nofollow"`.

`scripts/cart-smoke.mjs` exercises all three shapes against a styled QA build:

```
PASS home tile                  stored=true navigated=false cart={"184":1}
PASS category loop button       stored=true navigated=false cart={"71":1}
PASS Elementor product button   stored=true navigated=false cart={"226":1}
```

Crawlable add-to-cart links in the build: **278 → 0**.

## Site-wide state after Batch D `[measured]`

| Check | Result |
|---|---|
| `"price":"0.3"` | 72, unchanged |
| Visible `$0.30` price elements | 204, unchanged |
| Merchant feed items / `g:price` | 35 × `0.30 USD`, unchanged |
| `Product` / `Offer` / `AggregateRating` / `Review` | 72 each, unchanged |
| Broken links | 0 across 17,130 references |
| BreadcrumbList validator | 69 pages, 0 failures |
| Horizontal overflow, 375 / 768 / 1440px | 0 pages |
| Robots census | 58 index / 11 noindex (was 63 / 6) |
| Sitemap URLs | 58 |
| noindex URLs in a sitemap | 0 |

## Still not done, and why

| Item | Why |
|---|---|
| GA4, GTM, conversion tracking | Deferred by the owner |
| Splitting food into its own category | Withdrawn — there is one food product, and a new URL would cannibalise a page already at position 13.48. Revisit at three or more |
| Whether the plastic line is pushed | A fact about the business, not the export |
| Eco-line 800 MOQ, free shipping, turnaround, sample policy | Owner-supplied facts; nothing invented |
| `/pricing-and-ordering/` | Blocked on those same facts |
| Lotion URL consolidation | Touches canonicals, which Section 0 protects |

---

# MOQ settled, and FAQPage schema

## The site now states one minimum, everywhere `[measured]`

The home page's eco-line hero card said **800 pcs**; on the owner's decision it
now says 500. Re-audited across all 68 pages with `scripts/moq-audit.py`:

| Figure | Occurrences |
|---|---|
| **500** | **55** |
| 800 | **0** |
| "no minimum" / "no MOQ" of any form | **0** |

Three contradictions were corrected before this, found by auditing every page
rather than the ones earlier stages had touched: a specification table cell on
`/product/custom-shipping-tubes/` reading "Custom shipping tubes no minimum",
and two bullets in `/the-ultimate-guide-to-tube-packaging.../` pasted from
another supplier's site — one claiming no minimum order, one claiming this
business produces copper, aluminum, brass, bronze and steel tubes.

## FAQ sections taken to 10 questions each

| Page | Before | After |
|---|---|---|
| 5 category pages | 4–5 | **10 each** |
| `/shop/` | 4 | **10** |
| `/tube-size-guide/` | 6 | **10** |
| `/product/tube-food-packaging/` | 5 | **10** |

80 questions in the sections this programme built. Every new one answers demand
the export shows — the printed cluster ("printed cardboard tubes" 1,988
impressions at position 38 with 1 click, "custom printed tubes" 677 with none)
and the eco cluster ("sustainable tube packaging" 637 with none, "recycled
cardboard tube packaging" 696 at position 43 with none) were the two largest
gaps and are now answered on four pages between them.

Checked on the build: no duplicate question within a page; **zero** lead-time,
price, free-shipping or sample-policy claims introduced, because none of those
are confirmed.

## FAQPage schema `[measured]`

| | |
|---|---|
| Pages displaying FAQs | **43** |
| …emitting exactly one `FAQPage` | **43** |
| Pages displaying no FAQs | 25 |
| …emitting a `FAQPage` | **0** |
| `Question` / `Answer` nodes | **642** each |

Extracted from the rendered HTML, not from a data file, because the site
displays FAQs in three unrelated shapes: `.ttp-cat__faq` (the new sections),
`.tp-faq__item` (the home page's Elementor block) and `#tab-faqs_tab` (the 35
product pages). Extracting from the output is what makes it impossible for the
markup to claim a question the page does not show.

`scripts/validate-faq-schema.mjs` checks the absence side as well as the
presence side, and asserts every schema question is actually rendered.

> **Stated plainly, because it was advised against and then requested:** Google
> restricted FAQ rich results to government and health sites in 2023. This will
> not produce an expanded snippet on a packaging site. It is valid,
> machine-readable Q&A — which is what AI assistants and other structured-data
> consumers read — and it costs bytes and nothing else. It was the owner's call
> and it is a defensible one; it just should not be expected to move CTR.

Existing schema untouched: 72 each of `Product`, `Offer`, `AggregateRating` and
`Review`, 72 offers at `"price":"0.3"`, 204 visible `$0.30` elements.

---

# Core Web Vitals

Measured before anything was changed, on a throttled Pixel 5 against production.
Baseline: home performance **66**, LCP **6.0s**; category **89**, LCP 2.6s.
"Reduce unused JavaScript" was the top opportunity on every page at **507 KB**.

## What was actually slow `[measured]`

Three things, none of which was the obvious "a big image somewhere".

**1. reCAPTCHA, 1.4 MB on every page carrying a form.** Google ships
`recaptcha__en.js` at 344 KB and fetches it once per frame — four times in
practice — plus 2 × 41 KB of styles. It loaded on page load, before anyone had
touched a form, on 42 pages. On the six category pages it was **my own doing**:
I shipped the loader with the quote form.

**2. The home page LCP element was a 379 KB image.** `banner.jpg`, 1920×765,
served at full size to a 390px phone with no `srcset`.

**3. The Zendesk chat bootstrapped from an inline script at the top of `<head>`**,
so its bundle competed with the stylesheet and the LCP image before anything
had painted, on all 69 pages.

## What changed

| | |
|---|---|
| reCAPTCHA | loads on first focus/pointerdown/keydown inside a form, not on page load |
| Zendesk chat | loads on first interaction, or 5s after the load event |
| Home hero | WebP + JPEG at 480/768/1200/1920 behind `<picture>`, with a matching preload — a phone takes **4 KB** instead of 379 KB |
| WordPress emoji polyfill | removed from all 66 pages that carried it |
| WooCommerce gallery scripts | removed from the 34 pages with no gallery; the 35 product pages keep them |

## Result — deterministic byte census `[measured]`

Lighthouse against production is too noisy to use as the scoreboard here: the
host challenges the measurement tool, and three consecutive runs on the category
page returned a score of 0. The home page read 66, then 91, then 68 across runs.
So the honest scoreboard is bytes and requests, measured on one local server
across two builds of the same tree, with a 7-second window so every deferred
loader had fired.

| Page | Requests | First-party | **Third-party** |
|---|---|---|---|
| `/` | 122 → **111** | 2,479 → **2,075 KB** | 953 → **186 KB** |
| `/product-category/custom-cardboard-tubes/` | 61 → **49** | 919 → 951 KB | 913 → **147 KB** |
| `/product/paper-tubes/` | 84 → **78** | 1,048 → 1,208 KB | 955 → **150 KB** |

Third-party weight is down about **80% on every page**. Lighthouse's "unused
JavaScript" fell from **507 KB to 78 KB**.

**The first-party rises are not regressions, and it is worth saying why rather
than hiding them.** On the product page `block-library/style.min.css` (128 KB),
`custom.js` and `hooks.min.js` show as *newly loaded* in the after run — because
in the before run they had not finished inside the measurement window, starved
by 1.4 MB of reCAPTCHA. The page now finishes loading; it did not get heavier.

## Two corrections to my own measurements

The first asset census read `Content-Length` and reported **836 KB of
JavaScript**. Measured from disk it is 212 KB — the real weight was CSS and
third-party. And the first count of pages loading gallery scripts said 69 of 69
*after* the fix, because it matched the script name inside an inline config blob
rather than a `<script src>` tag. The strip had worked.

## Verification

Every behaviour that could break was tested rather than assumed:

| Check | Result |
|---|---|
| reCAPTCHA absent before interaction, present after | 6 category pages, a product page, the home page — all pass |
| Category quote form still submits | 6 / 6 |
| Configurator still submits | pass, both food and non-food paths |
| Product and home forms still submit | pass |
| Chat absent before interaction, present after | 0 requests before, 8 after, on 3 pages |
| Cart add-to-cart | all three button shapes pass |
| Horizontal overflow 375 / 768 / 1440px | 0 pages |
| Links | 0 broken across 17,603 references |
| Price | 72 offers at `"price":"0.3"`, 204 visible `$0.30` |
