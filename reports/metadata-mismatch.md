# Product metadata mismatch — Stage 2.1

**Status:** fixed and verified. `[measured]` unless tagged otherwise.

## What was actually wrong

The work order named two pages. Both are confirmed, and both go deeper than the
title: the wrong text is also in the Yoast JSON-LD, on the `Product` node's
`description`.

### 1. `/product/cardboard-tube-packaging/` — 45,095 impressions, position 10.05, 0.26% CTR

Its `<title>`, `<meta description>`, `og:title` and `og:description` were a
**byte-identical copy** of `/product/candle-tube-packaging/`. Not a swap — a
duplication. The candle page still had its own correct metadata.

Six of its fifteen FAQs were also about candles ("What is the core material used
to make the candle tubes?", "Can I order tubes specifically sized for my candle
jars?", "Can the tube accommodate pillar candles without a container?").

The **body copy was already correct** — it is genuinely about cardboard tube
packaging for posters, certificates, blueprints, textiles and art prints.

### 2. `/product/custom-shipping-tubes/`

Its `<title>`, `<meta description>`, `og:title` and `og:description` described
**Lotion Tubes**. No other page carries that title and neither lotion page uses
it, so it is an orphan rather than a swap — there was nothing to swap back. Its
FAQs were correct and were left alone.

## The signal that separated real from false positives

The work order's noun rule flags **25 product pages**. Reading all 25, only the
two above are genuinely wrong. The other 23 are legitimate adjective or use-case
language, e.g.:

| Page | Flagged noun | Why it is fine |
|---|---|---|
| `/product/black-paper-candle-tubes/` | luxury | Title is "Luxury Black Paper Candle Tubes Packaging Wholesale" |
| `/product/cylinder-mailing-tubes/` | shipping | "Cylinder Mailing Tubes with Custom Printing \| Secure Shipping" |
| `/product/lotion-tubes/` | cosmetic | "Lotion Tubes \| Custom Cosmetic Tube Packaging Wholesale" |
| `/product/small-paper-tubes/` | food | "...for Packaging, Crafts & Food Samples" |
| `/product/paper-tubes/` | food | Description says paper tubes are used for food — true |

The objective discriminator is a **duplicate-title check across product pages**,
which returned exactly one collision — the candle/cardboard pair. That check is
now part of the audit and returns **zero** after the fix.

## What changed

| Page | Field | Before | After |
|---|---|---|---|
| `/product/cardboard-tube-packaging/` | title | Custom Candle Tube Packaging Boxes for Luxury Brands | Custom Cardboard Tube Packaging for Rolled & Fragile Goods |
| | meta description | Durable custom Candle Tube Packaging for glass and pillar candles… | Rigid cardboard tube packaging for posters, prints, textiles and rolled goods… |
| | og:title / og:description | (as above) | (as above) |
| | schema `Product.description` | Durable custom Candle Tube Packaging… | Rigid cardboard tube packaging… |
| | schema `Review.description` | Durable custom Candle Tube Packaging… | Rigid cardboard tube packaging… |
| | 6 of 15 FAQs | candle framing | product framing, every factual claim carried across verbatim |
| `/product/custom-shipping-tubes/` | title | Custom Lotion Tubes Packaging \| Flip-Top & Pump Caps | Custom Shipping Tubes \| Printed Tubes for Safe Transit |
| | meta description | Durable custom Lotion Tubes for creams & gels… | Custom shipping tubes with multi-layer spiral-wound walls… |
| | og:title / og:description | (as above) | (as above) |
| | schema `Product.description` ×2 | Durable custom Lotion Tubes… | Custom shipping tubes… |

### Why the schema description was in scope

Section 0 protects Product schema. This change **reduces** mismatch risk rather
than creating it: the `Product` node's `name` was already "Cardboard Tube
Packaging" while its `description` sold candles, and the **Merchant feed for
that item is already correct** (`title` = Cardboard Tube Packaging, description
= the correct cardboard body copy). The page schema now agrees with the feed.

`price`, `priceCurrency`, `availability`, `sku`, `productID`, `brand`, images
and `aggregateRating` were not touched. Verified in the built HTML after the
change: price `0.3` USD, `InStock`, sku 52 / 76, aggregateRating 5 / 1 review —
all identical to the baseline.

### FAQ rewrite policy

Only candle *framing* changed. Nine FAQs were already product-neutral and were
not touched at all. In the six that changed, every factual claim — spiral-wound
paperboard, custom inner diameter and height, foam/cardboard inserts, interior
lining, internal printing — is carried across word for word. Nothing was
invented. The MOQ FAQ was deliberately left for Stage 3, which standardises it
across every product page.

## Verification

- duplicate product titles: **1 → 0**
- "candle" in the head of `/product/cardboard-tube-packaging/`: **4 → 0**
- "lotion" in the head of `/product/custom-shipping-tubes/`: **present → 0**
- remaining "candle" strings in that page's body: 16, all legitimate — a related
  product tile for Candle Tube Packaging, and one body sentence listing candles
  as a use case
- `scripts/validate.py`: 32/32
- schema `description` now equals `meta description` on both pages, which is the
  convention every correct product page already follows

## Full audit output

The noun-rule table below is the raw detector output, kept for the record. Grade
is `CRITICAL` when a foreign noun is in the title, `HIGH` when only in the
description. As above, after reading each one only the two pages named at the
top were genuine.

| Grade | URL | H1 | Title | Foreign nouns (title / desc / faq) |
|---|---|---|---|---|
| CRITICAL | `/product/black-paper-candle-tubes/` | Black Paper Candle Tubes | Luxury Black Paper Candle Tubes Packaging Wholesale | luxury / luxury / — |
| CRITICAL | `/product/candle-tube-packaging/` | Candle Tube Packaging | Custom Candle Tube Packaging Boxes for Luxury Brands | luxury / — / — |
| CRITICAL | `/product/cylinder-mailing-tubes/` | Cylinder Mailing Tubes | Cylinder Mailing Tubes with Custom Printing | Secure Shipping | shipping / kraft / — |
| CRITICAL | `/product/lotion-tubes/` | Lotion Tubes | Lotion Tubes | Custom Cosmetic Tube Packaging Wholesale | cosmetic / cosmetic / — |
| CRITICAL | `/product/skincare-tubes/` | Skincare Tubes | Skincare Tubes | Custom Cosmetic Tube Packaging | cosmetic / — / — |
| CRITICAL | `/product/small-paper-tubes/` | Small Paper Tubes | Small Paper Tubes for Packaging, Crafts & Food Samples | food / food / — |
| HIGH | `/product/cardboard-paper-tubes/` | Cardboard Paper Tubes | Cardboard Paper Tubes Wholesale | The Tube Packaging | — / mailing, round / — |
| HIGH | `/product/cosmetic-tubes/` | Cosmetic Tubes | Cosmetic Tubes Wholesale | The Tube Packaging | — / skincare / — |
| HIGH | `/product/custom-shipping-tubes/` | Custom Shipping Tubes | Custom Shipping Tubes | Printed Tubes for Safe Transit | — / plastic / — |
| HIGH | `/product/deodorant-paper-tubes/` | Deodorant Paper Tubes | Deodorant Paper Tubes - The Tube Packaging | — / shipping / — |
| HIGH | `/product/empty-lipgloss-tubes/` | Empty Lipgloss Tubes | Empty Lipgloss Tubes Wholesale | The Tube Packaging | — / plastic / — |
| HIGH | `/product/empty-lotion-tubes/` | Empty Lotion Tubes | Empty Lotion Tubes - The Tube Packaging | — / shipping / — |
| HIGH | `/product/kraft-mailing-tubes/` | Kraft Mailing Tubes | Kraft Mailing Tubes Wholesale | The Tube Packaging | — / shipping / — |
| HIGH | `/product/kraft-paper-candle-tubes/` | Kraft Paper Candle Tubes | Premium Kraft Paper Candle Tubes | Eco-Friendly Candle Packaging | — / shipping / — |
| HIGH | `/product/large-paper-tubes/` | Large Paper Tubes | Extra Large Paper Tubes & Thick Cardboard Tube Packaging | — / industrial / — |
| HIGH | `/product/paper-lipstick-tubes/` | Paper Lipstick Tubes | Paper Lipstick Tubes Wholesale | Sustainable Lip Balm Tubes | — / cosmetic, plastic / — |
| HIGH | `/product/paper-towel-tubes/` | Paper Towel Tubes | Paper Towel Tubes Wholesale | The Tube Packaging. | — / kraft / — |
| HIGH | `/product/paper-tubes/` | Paper Tubes | Paper Tubes Wholesale | The Tube Packaging | — / food / — |
| HIGH | `/product/plastic-tube-packaging/` | Plastic Tube Packaging | Plastic Tube Packaging Wholesale | The Tube Packaging | — / food / — |
| HIGH | `/product/square-paper-tubes/` | Square Paper Tubes | Square Paper Tubes Wholesale | The Tube Packaging | — / shipping / — |
| HIGH | `/product/tea-paper-tubes/` | Tea Paper Tubes | Tea Paper Tubes Wholesale | The Tube Packaging | — / food / — |
| HIGH | `/product/tube-food-packaging/` | Tube Food Packaging | Tube Food Packaging Wholesale | The Tube Packaging | — / tea / — |
| HIGH | `/product/white-lipstick-tubes/` | White Lipstick Tubes | White Lipstick Tubes | Custom Printed Balm Packaging | — / cosmetic / — |
| HIGH | `/product/white-paper-tubes/` | White Paper Tubes | White Paper Tubes Wholesale | The Tube Packaging. | — / food, large, small / — |
