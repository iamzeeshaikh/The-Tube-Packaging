# Keyword-to-page and cannibalization map — Stage 4

**Nothing in this document is implemented.** No consolidation, canonical,
noindex or redirect was created. It is for approval.

---

## The limitation, stated up front

The GSC Queries and Pages sheets are **separate exports with no query→page
pairing**. Nothing here can measure which page ranks for which query.

- `[export]` — read directly from the GSC files. Query totals, page totals.
- `[inferred]` — my reasoning from slug, title and body overlap. Every
  "preferred URL" and "competing URLs" cell is inference.
- `[measured]` — I made the request myself.

I checked the work order's figures against the export rather than repeating
them: **all 19 asserted query figures match exactly** (impressions and position),
as does "337 zero-click queries on 114,885 impressions". The cluster table below
is my own clustering of all 1,000 exported queries.

---

## Cluster totals `[export]`

| Cluster | Queries | Clicks | Impressions | CTR | Weighted position |
|---|---|---|---|---|---|
| cosmetic / beauty | 178 | 263 | 66,938 | 0.39% | 22.2 |
| wholesale / supplier | 117 | 163 | 45,910 | 0.36% | 26.0 |
| paper tube packaging | 37 | 343 | 39,969 | 0.86% | 14.4 |
| cardboard tube packaging | 40 | 145 | 35,283 | 0.41% | 13.2 |
| tube packaging (head) | 22 | 273 | 34,444 | 0.79% | 14.5 |
| poster / shipping tubes | 83 | 576 | 25,575 | 2.25% | 20.6 |
| large / size adjective | 46 | 97 | 23,331 | 0.42% | 14.9 |
| food / tea / coffee | 35 | 66 | 22,819 | 0.29% | 16.9 |
| mailing tubes | 53 | 343 | 20,819 | 1.65% | 20.7 |
| cardboard tubes (generic) | 20 | 249 | 17,876 | 1.39% | 14.2 |
| toilet / towel roll | 32 | 38 | 11,946 | 0.32% | 4.1 |
| plastic / squeeze | 33 | 17 | 10,604 | 0.16% | 31.5 |
| luxury / rigid / gift | 15 | 30 | 10,172 | 0.29% | 8.1 |
| kraft | 24 | 98 | 9,517 | 1.03% | 16.1 |
| custom tube packaging | 5 | 39 | 7,400 | 0.53% | 21.2 |
| candle | 16 | 37 | 7,141 | 0.52% | 14.0 |
| small / mini | 19 | 29 | 5,024 | 0.58% | 13.2 |
| canister / paper can | 8 | 7 | 3,023 | 0.23% | 18.3 |
| industrial | 3 | 12 | 2,318 | 0.52% | 18.0 |
| explicit dimensions | 16 | 17 | 1,941 | 0.88% | 11.1 |

### Page-level performance for the URLs named below `[export]`

| URL | Clicks / Impressions / CTR / Position |
|---|---|
| `/` | 1421 / 259,118 / 0.55% / 20.49 |
| `/product/poster-mailing-tubes/` | 693 / 53,498 / 1.30% / 16.44 |
| `/product/kraft-mailing-tubes/` | 658 / 28,741 / 2.29% / 18.23 |
| `/product/cardboard-toilet-paper/` | 79 / 33,873 / 0.23% / 6.47 |
| `/product/luxury-tube-packaging/` | 58 / 21,792 / 0.27% / 10.11 |
| `/product/cosmetic-tubes/` | 291 / 67,945 / 0.43% / 16.63 |
| `/product/large-cardboard-tubes/` | 401 / 43,576 / 0.92% / 12.8 |
| `/product/tube-food-packaging/` | 104 / 35,432 / 0.29% / 13.48 |
| `/product/cardboard-tube-packaging/` | 115 / 45,095 / 0.26% / 10.05 |
| `/product/paper-tubes/` | 106 / 8,326 / 1.27% / 15.51 |
| `/product/empty-lotion-tubes/` | 108 / 13,978 / 0.77% / 14.22 |
| `/product/lotion-tubes/` | 97 / 8,147 / 1.19% / 13.33 |
| `/product/deodorant-paper-tubes/` | 71 / 11,877 / 0.60% / 16.39 |
| `/product/square-paper-tubes/` | 139 / 6,347 / 2.19% / 12.13 |
| `/product/round-cardboard-tubes/` | 348 / 22,141 / 1.57% / 11.58 |
| `/product/industrial-cardboard-tubes/` | 109 / 11,199 / 0.97% / 15.9 |
| `/product/cardboard-paper-tubes/` | 367 / 26,172 / 1.40% / 11.14 |
| `/product/skincare-tubes/` | 39 / 9,897 / 0.39% / 13.79 |
| `/product/candle-tube-packaging/` | 27 / 9,093 / 0.30% / 11.41 |
| `/product-category/custom-cardboard-tubes/` | 7 / 13,194 / 0.05% / 11.67 |
| `/product-category/mailing-tubes/` | 3 / 11,585 / 0.03% / 10.54 |
| `/product-category/custom-paper-tubes/` | 1 / 10,020 / 0.01% / 10.04 |
| `/product-category/specialty-tubes/` | 3 / 7,125 / 0.04% / 13.05 |
| `/product-category/custom-plastic-tubes/` | 0 / 2,834 / 0.00% / 23.64 |
| `/shop/` | 8 / 10,731 / 0.07% / 12.34 |
| `/cosmetic-tubes-complete-packaging-guide-for-beauty-product-manufacturers/` | 89 / 13,981 / 0.64% / 9.7 |

---

## Three corrections to the brief, with evidence

### 1. `/product/cardboard-toilet-paper/` — the intent question, answered

The brief asks to "assess whether searchers want cores or retail product before
touching it". Here is the answer, and it changes the recommendation.

The toilet/towel cluster is **32 queries, 11,946 impressions at weighted
position 4.1** — the best average position of any cluster on this site by a wide
margin. But splitting it by intent `[export]`:

| Intent | Queries | Impressions | Clicks |
|---|---|---|---|
| Commercial (custom / wholesale / buy / supplier / packaging / order / price) | **1** | 126 | 0 |
| Informational | **31** | **11,820** | 38 |

The actual queries: "toilet paper cardboard tube" (1,176), "toilet paper tube"
(1,092), "cardboard toilet paper roll" (989), "toilet paper core" (599), "how
long is a toilet paper roll cardboard" (278), "standard toilet paper roll
cardboard tube inner diameter" (248), "toilet paper tube diameter" (142).

These are people looking up craft dimensions and what a toilet roll core is.
Not brands buying custom packaging. The single query with a commercial marker —
"where to buy empty paper towel rolls", 126 impressions, 0 clicks — is a
consumer wanting empty rolls for crafts.

**Recommendation: leave this page alone entirely.** The 0.23% CTR is not a title
problem, it is a page ranking at position 4 on a non-commercial cluster.
Rewriting the title to win those clicks would import traffic that cannot
convert, and would cost real position on the one thing it ranks for. This page
should move from **Tier A to Tier C**.

### 2. The size/spec cluster is mostly size *adjectives*, not dimensions

The brief justifies `/tube-size-guide/` with "66 queries and 26,899 impressions
at average position 14.5 — buyers checking whether a tube fits their product".

My broad net reproduces that shape — 85 queries, 30,245 impressions, weighted
position 14.5, 0.47% CTR — but the composition is not what the framing implies
`[export]`:

| Sub-cluster | Queries | Impressions | What it is |
|---|---|---|---|
| Size **adjectives** — "large tube" (7,100), "large cardboard tubes" (4,681), "large tubes", "big cardboard tubes", "small tube packaging" | 46 | 23,331 | product selection, already served by the large/small product pages |
| **Explicit dimensions** — "small diameter paper tubes", "large diameter cardboard tubes", "1 inch cardboard tubes", "toilet paper tube diameter" | 16 | **1,941** | genuine fit-checking |

And a meaningful share of the explicit-dimension queries are the *toilet roll*
dimension queries from correction 1 — informational, not buyers.

So the demand a size guide would actually serve is closer to **~1,900
impressions**, not 26,899. There is also "large cardboard tubes free" (1,436
impressions, position 7.69) in the adjective cluster — people looking for free
tubes.

**This does not kill Stage 9.1**, but it changes the argument for it. The size
guide earns its place as a **sales tool that lets a buyer self-specify before
requesting a quote** — which is the lead-qualification problem in Stage 11 — not
as a traffic play. It should be scoped and measured that way, and it should not
be prioritised above the category pages.

### 3. `plastic / squeeze` is weaker than the category page alone suggests

Stage 5 flags `/product-category/custom-plastic-tubes/` (2,834 impressions,
position 23.6, 0 clicks). The whole cluster behind it is worse: **33 queries,
10,604 impressions, weighted position 31.5, 0.16% CTR** — the weakest position
of any cluster on the site.

Six product pages sit behind it. This is not a page problem, it is a "the site
does not rank for plastic tubes" problem. Feeds the Stage 5 verdict.

---

## Cluster map

Position and impression figures are `[export]`. Preferred and competing URLs are
`[inferred]` — slug and title overlap, not measured attribution.

### A. Head terms

| | |
|---|---|
| **Primary query** | tube packaging — 19,443 impr, pos 7.55, 1.17% CTR |
| **Supporting** | tubes packaging, packaging tube, custom tube packaging (4,235 / 16.76), tube packaging wholesale |
| **Cluster** | 22 queries, 273 clicks, 34,444 impr, 0.79%, pos 14.5 |
| **Preferred URL** | `/` `[inferred]` — 1,421 clicks / 259,118 impr / 0.55% / pos 20.49 |
| **Competing** | `/product/cardboard-tube-packaging/`, `/shop/` |
| **Intent** | Commercial investigation — comparing suppliers |
| **Action** | Title and meta only (Stage 10 Tier A). The home title does not lead with "tube packaging" at all. |

### B. cardboard tube packaging

| | |
|---|---|
| **Primary query** | cardboard tube packaging — 12,348 impr, pos 9.46, 0.57% CTR |
| **Supporting** | cardboard cylinder packaging (2,498 / 15.66), cardboard tubes packaging, printed cardboard tubes (1,988 / 38.06), paperboard tube packaging (2,307 / 10.40) |
| **Cluster** | 40 queries, 145 clicks, 35,283 impr, 0.41%, pos 13.2 |
| **Preferred URL** | `/product/cardboard-tube-packaging/` — 115 clicks / 45,095 impr / 0.26% / pos 10.05 |
| **Competing** | `/`, `/product-category/custom-cardboard-tubes/`, `/product/cardboard-paper-tubes/` |
| **Intent** | Commercial |
| **Action** | **Stage 2.1 already fixed the cause** — this page was serving a candle title. Measure for four weeks before touching anything else. This is the single largest CTR opportunity on the site and the fix has not been measured yet. |

### C. paper tube packaging — a genuine three-way split

| | |
|---|---|
| **Primary query** | paper tube packaging — 9,774 impr, pos 10.68, 1.28% CTR |
| **Supporting** | paper tubes (4,803 / 14.14), custom paper tubes (2,810 / 12.54), paper tube packaging wholesale (1,656 / 10.90), paper tube packaging for food (1,835 / 15.04) |
| **Cluster** | 37 queries, 343 clicks, 39,969 impr, 0.86%, pos 14.4 |
| **Preferred URL** | `/product/paper-tubes/` `[inferred]` |
| **Competing** | `/product/cardboard-paper-tubes/`, `/product-category/custom-paper-tubes/` |
| **Intent** | Commercial |
| **Action** | Consolidate signals — internal links from the category to the product page, distinct angles per page. Do not merge or redirect. |

### D. mailing / poster / shipping — the site's best commercial cluster

| | |
|---|---|
| **Primary queries** | mailing tubes 4,200 / 14.27 / 2.48%; poster mailing tubes 3,077 / 13.24; shipping tubes 2,515 / 14.90 / 4.10% |
| **Cluster** | poster/shipping 83 queries, **576 clicks**, 25,575 impr, **2.25%**; mailing 53 queries, 343 clicks, 20,819 impr, 1.65% |
| **Preferred URLs** | `/product/poster-mailing-tubes/` (693 clicks / 1.30% / 16.44) and `/product/kraft-mailing-tubes/` (658 clicks / **2.29%** / 18.23) |
| **Competing** | `/product-category/mailing-tubes/` (3 clicks / 11,585 impr / 0.03%), `/product/cylinder-mailing-tubes/`, `/product/custom-shipping-tubes/` |
| **Intent** | Commercial, high |
| **Action** | **Leave both product pages alone** — they work. Fix the category page, which holds 11,585 impressions at position 10.5 and converts almost none of it. Note `wholesale mailing tubes` (1,835 impr, **position 31**) and `bulk mailing tubes` (1,450, position 30) — the wholesale angle is unserved. |

### E. cosmetic / beauty — biggest opportunity, and a self-inflicted problem

| | |
|---|---|
| **Cluster** | 178 queries, 263 clicks, **66,938 impr**, 0.39%, pos 22.2 |
| **Primary queries** | cosmetic tubes 2,128 / 10.86; cosmetic tube packaging 2,101 / 8.22; cosmetic packaging tubes 3,076 / 17.65; cosmetic tubes supplier 2,511 (0 clicks); cosmetic tube printing 1,255 (0 clicks) |
| **Preferred URL** | `/product/cosmetic-tubes/` — 291 clicks / 67,945 impr / 0.43% / pos 16.63 |
| **Competing** | `/product/skincare-tubes/`, `/product/lotion-tubes/`, `/product/empty-lotion-tubes/`, and **the blog guide** |
| **Intent** | Commercial, mixed with research |
| **Action** | **The blog guide outranks the product page it should feed** — `/cosmetic-tubes-complete-packaging-guide-…/` sits at **position 9.70 with 89 clicks on 13,981 impressions** while the product page is at 16.63. Point that guide's contextual links at the product page and measure before rewriting anything. This is an internal-linking fix first, a content fix second. |

### F. wholesale / supplier — the largest unserved cluster

| | |
|---|---|
| **Cluster** | 117 queries, 163 clicks, **45,910 impr**, 0.36%, **pos 26.0** |
| **Top zero-click** | cosmetic tubes supplier 2,511; wholesale mailing tubes 1,835; cosmetic tubes manufacturer 1,298; wholesale tubes 883; paper tube packaging wholesale 1,656 |
| **Preferred URL** | none exists `[inferred]` |
| **Intent** | Commercial, bottom-funnel — these buyers want MOQ, lead time, tiers, sample policy, credibility |
| **Action** | **Blocked on the owner.** This is exactly the content scoped for `/pricing-and-ordering/` in Stage 9.2 and listed in `owner-decisions.md`. Position 26 across 46k impressions means the site is barely visible to the buyers closest to purchase. |

### G. luxury — a pure title problem

| | |
|---|---|
| **Primary queries** | luxury tube **4,665 impr at position 4.91 with 0.04% CTR**; luxury tube packaging 1,510 / 6.76; luxury tubes 1,498 / 9.70 |
| **Cluster** | 15 queries, 30 clicks, 10,172 impr, 0.29%, **pos 8.1** |
| **Preferred URL** | `/product/luxury-tube-packaging/` — 58 clicks / 21,792 impr / 0.27% / pos 10.11 |
| **Competing** | `/`, `/product-category/specialty-tubes/` |
| **Intent** | Commercial |
| **Action** | Title and meta only. Position 4.9 earning 0.04% is the clearest title failure on the site. |

### H. food / tea / coffee

| | |
|---|---|
| **Cluster** | 35 queries, 66 clicks, 22,819 impr, 0.29%, pos 16.9 |
| **Primary** | tube food packaging 3,612 / 12.88; food packaging tubes 1,171 / 13.19; paper tube food packaging 1,066 / 8.52; food grade tube packaging 1,084 (0 clicks) |
| **Preferred URL** | `/product/tube-food-packaging/` — 104 clicks / 35,432 impr / 0.29% / pos 13.48 |
| **Competing** | `/product/tea-paper-tubes/`, `/product/paper-tubes/` |
| **Intent** | Commercial |
| **Action** | Tier B content improvement. "Food grade" is the recurring modifier and the site never uses the phrase — but it is a compliance claim and is **blocked on the owner** (`owner-decisions.md` item 3). |

### I. large / size adjective

| | |
|---|---|
| **Cluster** | 46 queries, 97 clicks, 23,331 impr, 0.42%, pos 14.9 |
| **Primary** | large tube **7,100 impr, pos 14.44, 1 click**; large cardboard tubes 4,681 / 16.81; large tubes 1,418 / 14.53 |
| **Preferred URL** | `/product/large-cardboard-tubes/` — 401 clicks / 43,576 impr / 0.92% / pos 12.80 |
| **Competing** | `/product/large-paper-tubes/`, `/product/industrial-cardboard-tubes/`, `/product/round-cardboard-tubes/` |
| **Intent** | Commercial, but "large cardboard tubes free" (1,436 impr, pos 7.69) is not |
| **Action** | Tier B. Huge base, and "large tube" at 7,100 impressions with one click is the second-clearest title failure after luxury. |

### J. candle

| | |
|---|---|
| **Cluster** | 16 queries, 37 clicks, 7,141 impr, 0.52%, pos 14.0 |
| **Preferred URL** | `/product/candle-tube-packaging/` |
| **Competing** | three colour variants (kraft / white / black paper candle tubes) and, until Stage 2.1, `/product/cardboard-tube-packaging/` which was serving the candle title |
| **Action** | **Re-measure after Stage 2.1.** Two pages were competing on an identical title; that is now resolved and the cluster should be re-read before any consolidation is considered. |

### K. kraft

| | |
|---|---|
| **Cluster** | 24 queries, 98 clicks, 9,517 impr, **1.03%**, pos 16.1 |
| **Primary** | kraft tube packaging 1,511 / 9.94; kraft mailing tubes 1,271 / 20.68 |
| **Preferred URL** | `/product/kraft-paper-tubes/` |
| **Action** | Keep. Above-average CTR, no cannibalization worth acting on. |

### L. lotion — two near-identical URLs

| | |
|---|---|
| **Primary** | lotion tubes 1,530 / 8.66 / 0.59%; lotion tube packaging 1,210 / 16.60; empty lipgloss tubes 1,381 / **2.40** |
| **The two URLs** | `/product/empty-lotion-tubes/` — 108 clicks / 13,978 impr / **0.77%** / pos 14.22<br>`/product/lotion-tubes/` — 97 clicks / 8,147 impr / **1.19%** / pos 13.33 |
| **Recommendation** | **`/product/lotion-tubes/`**, narrowly. The two are much closer than they look: near-identical clicks (97 vs 108) off 40% fewer impressions, with better CTR *and* better position. `empty-lotion-tubes` wins only on impression volume, which is a consequence of the "empty" modifier matching a large consumer-side cluster ("empty lipgloss tubes" sits at position 2.40) that converts worse. `lotion-tubes` is also the better match for the commercial head term "lotion tubes" (1,530 impr, pos 8.66). **This is a genuinely close call and the owner should make it** — reasoning repeated in `owner-decisions.md`. |
| **Action** | Decision only. No merge, canonical or redirect. |

### M. canister / paper can — the one genuinely unserved product term

| | |
|---|---|
| **Cluster** | 8 queries, 7 clicks, 3,023 impr, 0.23%, pos 18.3 |
| **Primary** | cardboard canister packaging — 1,492 impr, **position 6.18**, 0.27% CTR |
| **Preferred URL** | none — no page addresses "canister" `[inferred]` |
| **Action** | Stage 13 assessment only. Ranking at position 6 with no page on the term suggests the site is being matched loosely; a dedicated page is a candidate, but **after** the category pages. |

### N. industrial

| | |
|---|---|
| **Cluster** | 3 queries, 12 clicks, 2,318 impr, 0.52%, pos 18.0 |
| **Preferred URL** | `/product/industrial-cardboard-tubes/` — 109 clicks / 11,199 impr / 0.97% / pos 15.90 |
| **Competing** | `/product/large-cardboard-tubes/` |
| **Action** | Improve, low priority. |

---

## Cannibalization worth acting on `[inferred]`

Ranked by how much is at stake, not by how tidy the fix is.

| # | Conflict | Evidence | Recommended action |
|---|---|---|---|
| 1 | Blog guide vs cosmetic product page | guide pos 9.70 / 89 clicks vs product pos 16.63 / 0.43% | Re-point the guide's internal links at the product page. Measure. **Do this before any Tier B rewrite.** |
| 2 | Category vs product on mailing | category 11,585 impr at 0.03% CTR; two product pages at 1.3–2.3% | Give the category a job (Stage 8). Do not noindex it. |
| 3 | Three-way paper split | product / cardboard-paper / category all on the same cluster | Distinct angles + internal links. No redirects. |
| 4 | Candle colour variants | 3 colour pages + the main candle page | Re-measure after Stage 2.1 before deciding |
| 5 | Two lotion URLs | see L above | Owner picks one |
| 6 | Home vs cardboard product page on head terms | home pos 20.49 on 259k impr | Home title should lead with "tube packaging" (Tier A) |

---

## What I would sequence first, on this evidence

1. **Measure Stage 2.1.** The cardboard page's candle title was live for the
   whole 12-month window. 45,095 impressions at 0.26% CTR has an obvious cause
   that is now fixed and unmeasured. Nothing else should be judged until this
   settles.
2. **Category pages (Stage 8).** Five pages, 44,770 impressions, 0.03% CTR,
   positions 10–13, no content and — until this branch — no meta description.
3. **Cosmetic internal linking**, not content. One link change, testable.
4. **Tier A titles**: luxury (pos 4.91 / 0.04%), large tube (7,100 / 1 click),
   home page.
5. **Wholesale content** — largest unserved cluster, but blocked on the owner.

**Not sequenced:** `/product/cardboard-toilet-paper/`, per correction 1.
