# Sitemap and archive audit — Stage 5

> **Correction, 2026-08-27.** The archive table below originally recorded
> `/thank-you/` as absent from the sitemap. It was listed in
> `page-sitemap.xml`. The row is corrected and the page was removed from the
> sitemap in A4, along with `/cart/`, `/checkout/` and `/my-account/`.

**Report only. No archive policy change was implemented.** `[measured]` unless
tagged otherwise.

---

## Segment performance `[export]`

| Segment | URLs | Clicks | Impressions | CTR |
|---|---|---|---|---|
| `/product/` | 35 | 5,362 | 643,976 | 0.83% |
| Home | 1 | 1,421 | 259,118 | 0.55% |
| `/product-category/` | 7 | **14** | 44,770 | **0.03%** |
| Blog + static | ~14 | 177 | 28,260 | 0.63% |
| `/shop/` | 3 | 8 | 10,770 | 0.07% |
| `/author/` | 1 | 1 | 11 | — |
| `/wp-content/uploads/` (images) | 144 | 3 | 721 | — |
| `?add-to-cart=` parameters | 45 | 1 | 264 | — |

Product pages are the business. Everything below is about the 44,770
impressions the category segment converts almost none of.

---

## Sitemap structure `[measured]`

`/sitemap.xml` is a Vercel rewrite onto `/sitemap_index.xml`, which lists six
children:

| Child sitemap | URLs |
|---|---|
| `post-sitemap.xml` | 8 |
| `page-sitemap.xml` | 12 |
| `product-sitemap.xml` | 36 |
| `category-sitemap.xml` | 2 |
| `product_cat-sitemap.xml` | 5 |
| `author-sitemap.xml` | 1 |
| **Total** | **64** (63 unique) |

### Defect: three noindex URLs are listed in the sitemap

| URL | robots | Listed in |
|---|---|---|
| `/cart/` | `noindex, follow` | `page-sitemap.xml` |
| `/checkout/` | `noindex, follow` | `page-sitemap.xml` |
| `/my-account/` | `noindex, follow` | `page-sitemap.xml` |

A sitemap should list URLs you want indexed. Submitting three you have
explicitly excluded is a contradictory signal and shows up in Search Console as
"Excluded by 'noindex' tag" against submitted URLs. Low impact, trivially
fixable, **not fixed here** — it is an archive policy change.

### Indexable URLs absent from the sitemap

| URL | Impressions | Note |
|---|---|---|
| `/shop/page/2/` | 13 | pagination — reasonable to omit, but it is `index, follow` and Google found it |
| `/shop/page/3/` | 26 | same |
| `/product-category/custom-paper-tubes/page/2/` | 6 | same |
| `/my-account/lost-password/` | — | `noindex`, canonicalises to `/my-account/` — correct as-is |

### robots.txt

Correct: production domain, sitemap declared, WooCommerce log and upload
directories disallowed, `wp-admin` disallowed with the `admin-ajax.php`
exception. The Yoast block emits a redundant bare `Disallow:` under a second
`User-agent: *`, which is harmless. **No AI-crawler blocks present.**

---

## Archive-by-archive `[measured]` + `[export]`

"Editorial words" excludes the product grid, navigation and footer — it is what
a reader actually gets beyond the tiles.

| URL | Clicks | Impr | CTR | Pos | Editorial words | Products | Inbound internal links | In sitemap | Indexable |
|---|---|---|---|---|---|---|---|---|---|
| `/product-category/custom-cardboard-tubes/` | 7 | 13,194 | 0.05% | 11.67 | **28** | 10 | 274 | yes | yes |
| `/product-category/mailing-tubes/` | 3 | 11,585 | 0.03% | 10.54 | **28** | 5 | 229 | yes | yes |
| `/product-category/custom-paper-tubes/` | 1 | 10,020 | 0.01% | 10.04 | **32** | 18 | 343 | yes | yes |
| `/product-category/specialty-tubes/` | 3 | 7,125 | 0.04% | 13.05 | **28** | 5 | 224 | yes | yes |
| `/product-category/custom-plastic-tubes/` | 0 | 2,834 | 0.00% | 23.64 | **28** | 8 | 254 | yes | yes |
| `/shop/` | 8 | 10,731 | 0.07% | 12.34 | 33 | 18 | 42 | yes | yes |
| `/shop/page/2/` | 0 | 13 | 0.00% | 17.38 | 33 | 18 | 7 | no | yes |
| `/shop/page/3/` | 0 | 26 | 0.00% | 20.92 | 22 | 5 | 5 | no | yes |
| `/product-category/custom-paper-tubes/page/2/` | 0 | 6 | 0.00% | 19.33 | 20 | 3 | 4 | no | yes |
| `/category/information/` | 0 | 51 | 0.00% | 6.63 | 70 | — | 25 | yes | yes |
| `/category/uncategorized/` | 0 | 0 | — | — | 66 | — | 7 | yes | yes |
| `/author/shanimazhar82gmail-com/` | 1 | 11 | 9.09% | 4.27 | 67 | — | 17 | yes | yes |
| `/thank-you/` | 0 | 60 | 0.00% | — | 18 | — | — | **yes** | **yes** |
| `/cart/` | 0 | 0 | — | — | 43 | — | 2 | **yes** | no |
| `/checkout/` | — | — | — | — | 19 | — | — | **yes** | no |
| `/my-account/` | 0 | 0 | — | — | 23 | — | 4 | **yes** | no |
| `/my-account/lost-password/` | — | — | — | — | 35 | — | 1 | no | no |

**No search or filter URLs exist** — the migration produced no `?s=`, `?orderby=`
or faceted URLs. The only parameter family is `?add-to-cart=` (Stage 2.8).

---

## The finding that matters

**The five category pages have 28–32 editorial words each.** That is the H1,
the breadcrumb, "Showing 1–16 of N results" and a sorting dropdown label.
Nothing else.

They also carry **224–343 inbound internal links each** — more internal support
than most product pages get. That combination explains the whole picture: strong
internal linking is holding them at positions 10–13 on 44,770 impressions, and
having nothing to read is why 0.03% of that converts.

They are not failing on ranking. They are failing on having a reason to click,
and — until this branch — they had **no meta description either**, so Google was
writing their snippets from 28 words of chrome.

**Do not blanket-noindex them.** Four of five rank at 10–13. Noindexing would
discard a position most sites pay for.

---

## Recommendations — none implemented

| URL(s) | Recommendation | Reasoning |
|---|---|---|
| `/product-category/custom-cardboard-tubes/`<br>`/product-category/mailing-tubes/`<br>`/product-category/custom-paper-tubes/` | **Keep indexed, build content** (Stage 8) | Real demand at positions 10–12. The highest-return work available. |
| `/product-category/specialty-tubes/` | **Keep indexed, build content — but give it a real intent or merge it** | 7,125 impressions at 13.05 is genuine, but three products with nothing in common (Luxury Tube Packaging, Paper Lipstick Tubes, Tube Food Packaging) is not a category. If a distinct intent cannot be written honestly, fold it into Paper and Plastic. Owner decision. |
| `/product-category/custom-plastic-tubes/` | **Keep indexed, build content last** | 2,834 impressions, position 23.6, 0 clicks — and the whole plastic cluster sits at weighted position 31.5 with 0.16% CTR (Stage 4). The page is not the problem; the site does not rank for plastic. Lowest priority of the five. Owner decision on whether the line is being pushed at all. |
| `/shop/` | **Keep indexed, improve** | 10,731 impressions at position 12.34 with 33 editorial words. Same problem as the categories, and it has only 42 inbound links against their 224–343 — it is under-linked as well as thin. |
| `/shop/page/2/`, `/shop/page/3/`, `/product-category/custom-paper-tubes/page/2/` | **noindex, follow** | 45 impressions between them, no clicks, and they duplicate the tile content of page 1. Keep `follow` so the products stay crawlable. Already absent from the sitemap, so nothing else changes. |
| `/author/shanimazhar82gmail-com/` | **noindex, follow** | A single-author site does not need an author archive. It is indexed, in the sitemap, and earns 1 click. Remove from `author-sitemap.xml` at the same time. |
| `/category/information/` | **noindex, follow** | 51 impressions, 0 clicks, 70 editorial words. It duplicates the blog posts it lists. Position 6.63 looks appealing but on 51 impressions it is noise. |
| `/category/uncategorized/` | **noindex, follow, and remove from the sitemap** | Zero impressions, zero clicks. A default WordPress term that should never have shipped. |
| `/thank-you/` | **noindex, follow** | Currently `index, follow` with 60 impressions. A post-submission confirmation page has no search value and its appearance in results is a small conversion-tracking hazard. **Done in A4** — and removed from `page-sitemap.xml` at the same time. |
| `/cart/`, `/checkout/`, `/my-account/` | **Remove from `page-sitemap.xml`** | Already correctly `noindex`. Only the sitemap listing is wrong. |
| `/my-account/lost-password/` | **No change** | Already `noindex` and canonicalised to `/my-account/`. |

### If all of the above were applied

Sitemap would go from **63 URLs to 58** (drop cart, checkout, my-account,
uncategorized, author), and five thin archives would stop competing for
crawl budget — while every URL that earns impressions stays indexed.

**Total traffic at risk: 2 clicks and 62 impressions.** Nothing that earns is
touched.

---

## What I did not verify

| Item | Why |
|---|---|
| Whether Search Console reports these as "Crawled – currently not indexed" or "Excluded by noindex" | No GSC access beyond the supplied export, which has no coverage dimension |
| Real crawl-budget impact | Needs server log or Vercel log access |
