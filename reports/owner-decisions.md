# Blocked on the owner

Everything here is stated but **not implemented**. Nothing on this list was
guessed at or worked around.

---

## 1. Eco-Friendly Tubes MOQ — RESOLVED 2026-08-27

The home page's second hero card read "Eco-Friendly Tubes — 800 pcs minimum
order quantity". The owner's decision was to make it 500, so the whole site
states one number.

Done, and re-audited across all 68 pages afterwards: **exactly one MOQ figure
now exists on the site — 500 — in 55 places.** Nothing says 800, and nothing
claims "no minimum" any more.

The confirmed policy in full, which is what every one of those 55 places says:
a **500-piece standard minimum**, with **smaller runs from around 100 pieces**
at a higher per-piece cost, because setup and printing are fixed regardless of
quantity.

`scripts/moq-audit.py` re-runs the check: it extracts every sentence mentioning
a minimum or an order quantity from the built HTML and groups them by what they
claim, so a future edit that contradicts the policy shows up rather than hiding
on a page nobody thought to check.

---

## 2. Commercial claims that are still unverified

None of these were changed. Counts are from the built HTML.

| Claim | Occurrences | Pages |
|---|---|---|
| "Free Shipping" / "free delivery" | 3 | 3 |
| "8–10 business day turnaround" | 38 | 36 |
| "35+ Tube products" | 2 | 1 |
| "Reply within 24 hours from a real person" | 1 | 1 |
| "fast / quick turnaround" (vague timing) | 59 | 36 |
| "free design" / "free design support" | 87 | 36 |
| sample-policy statements | 172 | 42 |

Two deserve attention beyond a yes/no:

- **"Free Shipping"** sits on the home page directly beside the MOQ statement.
  If it is conditional — order value, destination, weight — the condition needs
  stating or the claim removing. It is the most common source of dispute on
  packaging leads.
- **"8–10 business day turnaround"** is the most-repeated promise on the site
  and is baked into the Order Process block on every product page. Correcting it
  later is a 36-page change, not a one-line one.

**Needed:** for each, confirm / correct / remove.

---

## 3. Real size and specification data

Blocks Stage 8 (category specification tables) and Stage 9.1 (`/tube-size-guide/`).

Both were specified to be built with real values only, and to be left out
entirely rather than filled with invented dimensions.

**Needed, per category — Cardboard, Mailing, Paper, Specialty, Plastic:**

- diameters actually produced (list or range)
- height/length range per diameter
- wall thicknesses offered, and when each is used
- closure types genuinely available (rolled-edge, metal, plastic, paper end cap,
  telescoping, tuck-in)
- finishes genuinely available per material (matte, gloss, spot UV, soft-touch,
  foil, emboss/deboss)
- which materials are genuinely food-safe, and under what lining

Without this the specification section is omitted and the size guide ships as
structure with empty tables.

---

## 4. Specialty and Plastic — re-assessed 2026-08-27, and my answer changed

You said to do everything, so here is the part I did **not** do, with the reason.

### Splitting the food line out of Specialty — recommended earlier, withdrawn now

Batch B said the recommendation to give food its own category still stood. Having
looked at what it would actually take, I am withdrawing it, and the reason is
simple arithmetic: **there is one food product.** A category with one product in
it is not a category, it is a redirect with extra steps.

Worse, a brand-new category URL starts with no history and no inbound links, and
it would be competing for the same food terms as
`/product/tube-food-packaging/` — a page already earning 104 clicks from
position 13.48 on 35,432 impressions `[export]`. That is textbook
cannibalisation, and the new page would lose.

**Revisit when there are three or more food products.** Until then the food work
is where it belongs: built out on the product page itself (+1,253 words) and on
the Specialty category that routes to it.

### Plastic — no change, and it needs your input, not mine

Built shortest of the five on purpose. The numbers are unchanged `[export]`:
45 queries, 13,415 impressions, 24 clicks, **0.18% CTR at weighted position
32.4** — the weakest cluster on the site, with 30 of those 45 queries never
having earned a click.

Content does not move a page from position 32. What decides this is whether the
plastic line is being pushed commercially at all, and that is a fact about your
business that I cannot measure from an export. **Still needed:** keep pushing
plastic, or let the six products sit there and spend the effort elsewhere.

---

## 5. Lotion tubes — two near-identical URLs

`/product/lotion-tubes/` and `/product/empty-lotion-tubes/` target the same
cluster, and they are much closer than a glance suggests `[export]`:

| URL | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| `/product/empty-lotion-tubes/` | 108 | 13,978 | 0.77% | 14.22 |
| `/product/lotion-tubes/` | 97 | 8,147 | **1.19%** | **13.33** |

`lotion-tubes` earns near-identical clicks off 40% fewer impressions, with
better CTR and better position, and is the better match for the commercial head
term "lotion tubes" (1,530 impressions, position 8.66). `empty-lotion-tubes`
wins only on impression volume, which comes from the "empty" modifier matching a
large consumer-side cluster ("empty lipgloss tubes" sits at position 2.40) that
converts worse.

**My recommendation is `/product/lotion-tubes/`, but narrowly** — this is a
close call and it depends on something I cannot see: whether the "empty tubes"
traffic ever turns into quotes. If it does, the volume argues the other way.

Nothing was merged, canonicalised or redirected. **Needed:** which is the
preferred URL.

---

## 6. Facts needed for `/pricing-and-ordering/`

Scoped in Stage 9.2, not built. It cannot be written without:

- what actually drives cost (size, print colours, finish, closure, material)
- quantity tiers the business genuinely works to
- MOQ — now confirmed (500 standard, ~100 minimum)
- lead time, confirmed rather than the current unverified 8–10 days
- sample policy: are samples free, charged, credited against an order?
- artwork requirements: formats accepted, bleed, resolution
- shipping terms: who pays, from where, typical transit

This is also the content the largest unserved query cluster is asking for —
wholesale / supplier / manufacturer, 126 queries, 47,250 impressions, 0.37% CTR
at average position 24. Those buyers want MOQ, lead time, tiers and sample
policy. Stage 13 depends on it.

---

## 7. Yoast crop images — DONE 2026-08-27 (option 2)

Regenerated. Measured, not estimated: **68** crops were referenced, not 70, and
all 68 had their 1200x1200 primary on disk. They are centre crops to 16:9 and
4:3, which is what Yoast produces, at 4.6 MB total.

Before: 140 ImageObject URLs across the 35 product pages, **70 of which did not
exist** and returned 403 under the firewall rule on `/wp-content/uploads/`.
After: 140 of 140 resolve.

Option 2 was the right one for the reason given at the time — it restores exactly
the URLs Google had indexed (41 of them, 203 impressions) and changes no markup,
where option 3 would have meant editing Product schema. `scripts/regenerate-
yoast-crops.py` regenerates them from the primaries if they are ever lost.

---

## 8. Vercel Attack Challenge Mode — awareness item, not a defect

Production answers non-browser clients with `403 x-vercel-mitigated: challenge`
under sustained request rates, and denies non-existent paths under
`/wp-content/uploads/` with `403 ... deny`.

There is **no evidence Googlebot is affected** — Google reports 860,694
impressions and 26.45% CTR on Merchant listings over the period, so it is
crawling and indexing normally. Vercel exempts verified search crawlers by
design.

Flagging it only because it (a) blocked this audit's live crawl, and (b) would
be the first thing to check if crawl stats ever drop suddenly. **No action
requested.**

---

## 9. Pasted AI-chat interface markup — DONE 2026-08-27, and it was 40 pages

Stripped. This item said seven FAQ panels. A census across all 66 page records
found it was far wider, in three flavours:

| | Count |
|---|---|
| ChatGPT wrapper elements (nested layout divs, `<article>` turns) | 44 |
| Turn and message attributes (`data-turn-id`, `data-message-author-role`, …) | 39 |
| `data-start` / `data-end` on `<p>`, `<h3>`, `<strong>`, `<br>` | **3,980** (67,267 bytes) |
| **Pages affected** | **40 of 66** |

Including the home page, the privacy policy, the shipping policy, the refund
page and four blog posts — none of which this item named. Plus a second,
different assistant's UI in the cosmetic blog guide: 141 Claude interface class
tokens on a page earning 89 clicks from position 9.70.

Nothing in the site's JavaScript or CSS referenced any of it, checked first.
Every page is verified before and after: the visible text must match character
for character and the element census must be unchanged, or the script writes
nothing. That guard earned its place — an earlier version destroyed two real
tables whose class happened to contain a ChatGPT token, and the check caught it.

---

## 10. `priceValidUntil` — RESOLVED 2026-08-27, but you can revisit it

**Done.** The value is now computed at build time as *build date + 1 year* and
applied to all 72 offers on the site (35 product pages plus 37 carried on the 6
category archives). Every Vercel deploy rolls it forward, so it cannot expire in
place. Verified live: `2027-08-27T01:50:18+00:00`, with `price` still exactly
`0.3`. Evidence in `reports/fixes.md`, section A1.

**The alternative is equally valid and you can switch to it at any time.**
`priceValidUntil` is *recommended*, not required, and $0.30 is a standing price
rather than a time-limited sale — so removing the property entirely does **not**
affect rich-result eligibility. Google would simply use the price on the page.

Dynamic was chosen as the lower-risk of the two, because it preserves the markup
in exactly the shape Google has been crawling for the last year and changes only
the date. Removal changes the shape of the offer node. With Merchant listings at
44% of clicks, not changing shape was worth more than the tidier markup.

If you would rather have it gone, it is a one-line change in
`src/lib/pricing.js` and no other file.

---

## 11. There is no GA4 property, and no conversion event on any form

`gtag.js` is on all 68 pages but loads **Google Ads `AW-16676839357`**. There is
no `G-XXXXXXXX` measurement ID anywhere on the site, no GTM container, and no
`generate_lead`, `form_submit` or `conversion` event fires when a quote is
submitted.

The business currently has an ad tag and no analytics, and the ad tag is never
told when a lead happens. Every quote arrives as an email and nothing else
records it — which is why "most leads die on price" cannot be measured today.

**Needed:**

1. A **GA4 measurement ID** (`G-XXXXXXXX`), or confirmation that no property
   exists and one should be created.
2. A **Google Ads conversion action and label** for "quote submitted", from the
   account that owns `AW-16676839357`.
3. Confirmation that `AW-16676839357` is still an active, spending account — it
   is a Google-for-WooCommerce tag inherited from the WordPress build and may
   point at a dormant one.

With 1 and 2 the implementation is small and self-contained: one event in the
existing submit success callback in `public/assets/ttp.js`, which all nine forms
already pass through. Firing it on `/thank-you/` instead would miss seven of
them, because only two forms redirect there.

### Status 2026-08-27 — deferred by you, on the record

Asked before Batch A shipped; the answer was to handle GA4, GTM and conversion
tracking later. Nothing was installed and **no placeholder measurement ID was
shipped** — a made-up `G-XXXXXXXX` either sends nothing or sends this site's
data into somebody else's property, which is worse than the current gap.

The cost of waiting, stated plainly: the five category pages in Batch B ship
without analytics, so their effect can only be read from Search Console —
clicks, impressions, CTR, position. That is enough to judge the work, because
CTR is exactly what those pages fail at today (0.03%). What cannot be recovered
later is on-site behaviour and lead volume for the weeks between now and
whenever the tag goes in.

---

## 12. Compliance claims written — APPROVED BY THE OWNER 2026-08-27

> **Owner sign-off, 2026-08-27:** reviewed and approved as written. All nine
> claims stay on the site in their current wording, and the six disclaimers stay
> with them. Nothing further is needed unless a manufacturer's documentation
> later contradicts one — this list is what to check it against.

Batch B and C put food-safety and compliance language on the site for the first
time. Every such statement is listed here with its page and its exact wording,
so it can be checked in one place rather than hunted across pages.

Enumerated by `scripts/compliance-claims.py`, which scans **every sentence in
every editorial section of the built HTML** for compliance markers and reports
what it finds — 31 statements across 7 pages. It works by enumerating the
denominator and filtering, not by looking where a claim was expected, so a claim
cannot be missed by being somewhere unexpected.

**Nothing here asserts that the business holds a certification.** Everything is
written as capability — what can be specified, and what documentation comes with
the order — because the business sources from manufacturers rather than
operating fixed tooling. If any of it is wrong, it is one string edit per item.

### The claims that need supplier backing

| # | Claim | Pages | Exact wording |
|---|---|---|---|
| 1 | **FDA 21 CFR 176.170 / 176.180** | `/product-category/specialty-tubes/`<br>`/product/tube-food-packaging/` | "Food-contact liners can be specified using materials compliant with FDA 21 CFR 176.170 and 176.180, which cover paper and paperboard components in contact with aqueous and fatty foods" |
| 2 | **Declaration of compliance supplied** | both, above | "…and the manufacturer's declaration of compliance is supplied with the order." / "The manufacturer's declaration of compliance is supplied with the order and is the document that actually covers you." |
| 3 | **EU Regulation (EC) No 1935/2004** | both | "For product sold into the EU and UK, liners can be specified against Regulation (EC) No 1935/2004" |
| 4 | **EU Regulation (EU) No 10/2011** | both | "…and against Regulation (EU) No 10/2011 where a plastic layer is in direct contact" |
| 5 | **Migration testing provided** | both | "…with migration test results provided by the manufacturer." |
| 6 | **BRCGS Packaging Materials** | both | "BRCGS Packaging Materials certified production can be requested where your retail customer requires it." |
| 7 | **Compostable / PLA route** | `/product-category/specialty-tubes/` (liner table)<br>`/product/tube-food-packaging/` (FAQ) | "PLA-coated paper — Moisture barrier from a bio-based coating — Brands needing a compostable-claim route; confirm certification per build" / "PLA-coated liners offer a compostable route, and the certification should be confirmed per build." |
| 8 | **Documents to request** | `/product/tube-food-packaging/` | "ask for three things before you sign off a food build: the declaration of compliance naming your specific construction, the migration test report behind it, and the certification scope if a retailer has asked for one." |
| 9 | **Tamper-evident band as a market requirement** | `/product-category/specialty-tubes/`<br>`/product/tube-food-packaging/` | "Tamper-evident shrink band — Band over the closure joint — Retail requirement in many markets" / "…it is a retail requirement in many markets." |

### The disclaimers, which are the counterweight

These are deliberate and should stay unless you have documentation that says
otherwise. They are what keeps items 1–9 defensible.

| Page | Wording |
|---|---|
| `/product-category/specialty-tubes/` | "An unlined kraft tube is not a food-contact surface." |
| `/product-category/specialty-tubes/` | "Food-contact suitability always attaches to a specific build, so confirm it against the declaration of compliance issued for your order rather than against the category." |
| `/product/tube-food-packaging/` | "An unlined kraft or printed tube is not a food-contact surface, whatever it is sold as." |
| `/product/tube-food-packaging/` | "The tube wall itself is not a food-contact surface, and neither is a printed wrap." |
| `/product-category/specialty-tubes/` | "Shelf life is a function of the liner, the seal and the storage conditions together, and it should be confirmed by testing on your own product rather than assumed from the pack specification." |
| `/product/tube-food-packaging/` | "A wound paper wall cannot be relied on as a liquid-tight container" (and the six other "not suitable" rows) |

### What was deliberately **not** written

- No named certificate number, audit grade, or certifying body for this business.
- No ISO or BfR reference, because nothing confirmed one.
- No shelf-life figure in days or months for any product.
- No lead time, and no price figure, anywhere in Batch B or C.

**Status: closed.** Approved by the owner on 2026-08-27 without changes. Kept
here as the reference list, so any future supplier document can be checked
against it in one place rather than by re-reading seven pages.

---

## 13. Category page H1s — DONE 2026-08-27, as one consistent rename

The mailing category was named after the smallest of its three head terms
`[export]`: "custom mailing tubes" 809 impressions, against "mailing tubes"
4,200 at position 14.27 and "shipping tubes" 2,515 at 14.90.

It is now **Mailing & Shipping Tubes**, renamed in one pass across all 31 places
it was displayed: the category H1, the visible breadcrumb on the product pages,
the category label under every product tile, the tag links on those tiles, the
loop-category title with its aria-label and image alt, the footer's Top
Categories list, and the Omnisend tracking payloads. The URL is unchanged.

That is why it was held back from Batch B rather than done as an H1 edit. Since
A5 the BreadcrumbList name is derived from the H1, so changing the H1 alone would
have put the category page in disagreement with 35 product pages, the tiles and
the structured data simultaneously. Verified after: the visible trail and the
JSON-LD trail on `/product/cylinder-mailing-tubes/` both read
`Home > Shop > Mailing & Shipping Tubes > Cylinder Mailing Tubes`, character for
character.

**Two things left alone on purpose.** The header and off-canvas nav already read
"Mailing Tubes" — the head term, short enough for a nav label — so leaving it
reduces inconsistency rather than adding to it. And `merchant.json` still carries
"Custom Mailing Tubes" in `product_type`, four times: it is a merchant-defined
taxonomy field that no searcher sees and Google does not match against, while
Merchant listings are 44% of this site's clicks. Changing a Merchant field for a
cosmetic rename is not a trade worth making. Say the word if you want them
aligned anyway.

**Custom Specialty Tubes is still not a search term** — it appears nowhere in
the 1,000-row export. It was not renamed because the right name depends on
item 4, which is still yours to answer.

---

## 14. The "Archives" titles — FIXED 2026-08-27

**Why they said it.** Yoast's default title template for a taxonomy archive is
`%%term_title%% Archives %%sep%% %%sitename%%`. It was never overridden in
WordPress, so it rendered into the page HTML and the migration captured it
verbatim. Nothing was broken; the default was simply never changed.

A sweep of every page found **nine** archive-style titles, not six. Eight are
rewritten:

| Page | Was | Now |
|---|---|---|
| `/product-category/custom-cardboard-tubes/` | Custom Cardboard Tubes Archives - The Tube Packaging | **Custom Cardboard Tube Packaging \| Wholesale Tubes** |
| `/product-category/mailing-tubes/` | Custom Mailing Tubes Archives - The Tube Packaging | **Custom Mailing & Shipping Tubes \| Poster Tubes in Bulk** |
| `/product-category/custom-paper-tubes/` | Custom Paper Tubes Archives - The Tube Packaging | **Custom Paper Tubes \| Kraft & Printed Paper Tube Packaging** |
| `/product-category/specialty-tubes/` | Custom Specialty Tubes Archives - The Tube Packaging | **Specialty Tubes \| Luxury, Cosmetic & Food Tube Packaging** |
| `/product-category/custom-plastic-tubes/` | Custom Plastic Tubes Archives - The Tube Packaging | **Custom Plastic Tubes \| Lotion & Cosmetic Squeeze Tubes** |
| `/product-category/custom-paper-tubes/page/2/` | Custom Paper Tubes Archives - Page 2 of 2 - … | **Custom Paper Tubes \| Page 2 \| The Tube Packaging** |
| `/shop/` | Shop - The Tube Packaging | **Shop Custom Tube Packaging \| Paper, Cardboard & Plastic** |
| `/category/information/` | Information Archives - The Tube Packaging | **Tube Packaging Guides & Articles \| The Tube Packaging** |

Each leads with the phrasing the export shows buyers using, verified against
`data/gsc/queries.csv` before it was written `[export]`: "cardboard tube
packaging" 12,348 at position 9.46; "mailing tubes" 4,200 and "shipping tubes"
2,515; "paper tube packaging" 9,774; "tube food packaging" 3,612 and "luxury
tube packaging" 1,510; "lotion tubes" 1,530; "tube packaging" 19,443. All eight
are 48–57 characters.

The brand suffix is dropped where it would have repeated "Tube Packaging" inside
the title. Google renders a site name beside the title in its own right, so
those words are better spent on what the page sells.

**One left alone, and one thing to know:**

- `/category/uncategorized/` still reads "Uncategorized Archives". It has zero
  impressions and zero clicks and is a default WordPress term. It should be
  **removed from the site and the sitemap**, not given a better title.
- `/my-account/` and `/my-account/lost-password/` share a title. Both are
  `noindex`, so a duplicate title has no search consequence there.

Only `<title>` and `og:title` changed. Descriptions, H1s, canonicals, schema and
price are untouched.

---

## 15. B0's measurement isolation is now partly spent

Worth knowing rather than discovering later. The meta descriptions (commit
`8ead883`) were written on 2026-08-04 but the branch was never deployed, so they
reached production for the first time on **2026-08-27**, in the same deploy as
Batch A. Batch B and C follow within the same day.

That means the clean "descriptions only" window the brief designed is a matter of
hours, not weeks. There are two ways to read the result now:

1. **Hold Batch B and C on the branch** for two to four weeks, so the
   description effect on those six URLs can be read alone. Costs the content
   effect for that period.
2. **Ship everything now** and read the combined effect. Faster, but the CTR
   change cannot be split between the description and the content.

**Decided by the owner, 2026-08-27: option 2.** Batch B and C were deployed the
same day. The title rewrite in item 14 followed, on the owner's instruction.

So the CTR change on those six URLs cannot be attributed between the meta
description, the body content and the title — all three landed within hours of
each other. That is a deliberate trade and it is worth remembering when the
Search Console numbers are read in four to eight weeks: the combined effect is
readable, the split is not.
