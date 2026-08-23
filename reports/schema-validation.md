# Merchant and schema validation — Stage 6

**Report only. Nothing was changed.** Validated against the **rendered HTML in
the production build**, not source templates, and against
`/google-merchant-feed.xml`. `[measured]` throughout.

> **What I could not do:** I have no Merchant Center access. Everything below
> validates on-page structured data and the feed file. It does **not** verify
> listing eligibility, disapprovals, or what Merchant Center currently reports.
> The brief states Merchant Center shows no price warnings; I could not confirm
> or contradict that.

---

## Summary

| | |
|---|---|
| Product pages validated | 35 / 35 |
| Feed items | 35 / 35 |
| **Genuine errors** | **1** (plus 1 that becomes an error on a known date) |
| Optional recommendations | 4 |

Everything Section 0 protects is intact and consistent.

---

## Genuine errors

### E1. No `BreadcrumbList` anywhere on the site

**0 of 68 pages** emit breadcrumb structured data — not in JSON-LD, not as
microdata, not as RDFa.

Product pages *do* render visible breadcrumbs (`Home › Shop › Custom Paper Tubes
› Paper Tubes`) in `.rishi-breadcrumbs`, so the information exists and is
accurate — it simply carries no markup Google can read.

**Consequence:** the SERP shows the raw URL path instead of a breadcrumb trail.
It is a display feature, not an eligibility requirement, and it does not affect
Merchant listings.

**Why it is listed as an error rather than an option:** the site declares a
`breadcrumb_present` state in every other respect — the trail is rendered,
linked and correct on all 35 product pages. The markup is the only missing part.

### E2. `priceValidUntil` is frozen and will expire

Every offer carries a `priceValidUntil` captured from WordPress at crawl time.
None are expired today (2026-08-23), but they are static values in
`pages.json` — they will not roll forward.

| Date | Products | Status today |
|---|---|---|
| 2026-11-10 | 5 | future |
| 2026-11-12 | 12 | future |
| 2026-11-18 | 1 | future |
| 2026-12-08 | 1 | future |
| 2026-12-09 | 13 | future |
| 2026-12-16 | 2 | future |
| 2026-12-23 | 1 | future |

**The first 5 products lapse on 10 November 2026; all 35 have lapsed by 24
December 2026.** Google treats an expired `priceValidUntil` as a reason to drop
the price from rich results and can flag it in Merchant Center.

**This needs a decision before November.** The options are to remove the
property, or to generate it at build time as a rolling date. Both touch offer
markup, which Section 0 protects, so neither was done. Flagged in
`owner-decisions.md`.

---

## Everything that is correct `[measured]`

### Page schema

| Check | Result |
|---|---|
| JSON-LD parses on every product page | 35 / 35 |
| Exactly one `Product` node per page | 35 / 35 |
| `offers.price` present | 35 / 35, all `0.3` |
| `offers.priceCurrency` | 35 / 35, all `USD` |
| `offers.availability` | 35 / 35, all `schema.org/InStock` |
| `offers.url` self-referencing | 35 / 35 |
| `sku` | 35 / 35, all distinct |
| `mpn` | 35 / 35, **35 distinct values** |
| `brand` | 35 / 35, `The Tube Packaging` |
| `aggregateRating` | 35 / 35 |
| Backing `Review` node for each rating | 35 / 35 |
| Node types present | Product, Offer, Brand, AggregateRating, Rating, Review, Person, ImageObject |

### Page ↔ feed consistency — the check that matters most

| Check | Result |
|---|---|
| Every product page present in the feed | 35 / 35 |
| `price` page vs feed | **identical on all 35** (`0.3` / `0.30 USD`) |
| `availability` page vs feed | identical on all 35 (`InStock` / `in stock`) |
| Feed `g:id` matches schema `sku` | 35 / 35 (`gla_226` ↔ `226`) |
| Feed `title` matches schema `Product.name` | 35 / 35 |
| Feed `g:image_link` resolves | 35 / 35 |
| Feed `g:additional_image_link` resolves | 106 / 106 |

**No page-versus-feed mismatch of any kind.** This is the failure mode Section 0
warns about, and there is none.

### Feed attribute coverage

| Attribute | Coverage | Value |
|---|---|---|
| `g:id` | 35 | `gla_<sku>` |
| `title`, `description`, `link` | 35 | — |
| `g:image_link` | 35 | resolves |
| `g:additional_image_link` | 106 | resolves |
| `g:price` | 35 | `0.30 USD` |
| `g:availability` | 35 | `in stock` |
| `g:condition` | 35 | `new` |
| `g:brand` | 35 | `The Tube Packaging` |
| `g:identifier_exists` | 35 | `no` |
| `g:product_type` | 35 | category path |
| `g:shipping` | 35 | `US`, `0.00 USD` |

---

## Optional recommendations — none implemented

### O1. Feed `description` contains raw HTML

All 35 descriptions are HTML-escaped markup — `&lt;h2&gt;`, `&lt;strong&gt;`,
`&lt;h3&gt;`. Google strips tags, so this works, but plain text is the
documented recommendation and avoids odd truncation mid-tag.

### O2. 78 href-less `<a>` elements inside feed descriptions

The descriptions carry `&lt;strong&gt;&lt;a&gt;Kraft Paper Candle
Tubes&lt;/a&gt;&lt;/strong&gt;` — an anchor with **no `href`**. This is the
product body copy with internal links stripped of their targets during feed
generation. Harmless to Merchant, but it is malformed markup being submitted.

### O3. No `g:google_product_category`

Absent from all 35 items. Google infers a category when it is missing, but
setting it explicitly (e.g. *Business & Industrial > Advertising & Marketing >
Retail Display Cases* or a packaging category) gives more control over
classification. `g:product_type` is present and correct, which is the
site-defined equivalent.

### O4. `aggregateRating` is uniform across the catalogue

Every one of the 35 products carries **exactly `ratingValue: 5`, `reviewCount:
1`**, with one backing `Review` node each.

Recording this as an observation only. **Section 0 says existing review schema
stays exactly as it is and nothing is to be added to it, and I have not touched
it.** It is flagged because a uniform 5.0-from-one-review across an entire
catalogue is the pattern Google's review-snippet guidelines treat with least
weight, and the export shows Review snippets earning 210 clicks on 31,638
impressions at 0.66% CTR — real but not load-bearing. If the owner ever collects
genuine varied reviews, that is where the upside is.

---

## Deliberately not done

| | |
|---|---|
| Price | Not changed anywhere. `0.3` on all 35 pages and `0.30 USD` on all 35 feed items, before and after this branch. |
| `Product` schema | Not removed or restructured on any page. |
| `aggregateRating` / `Review` | Not removed, not modified, not added to. |
| Schema strategy | Not changed on the say-so of an audit tool. The one substantive schema edit in this branch was Stage 2.1, which corrected two `description` values that described the wrong product — and that brought the page **into** agreement with the feed. |
