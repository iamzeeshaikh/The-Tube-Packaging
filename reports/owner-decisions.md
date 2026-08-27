# Blocked on the owner

Everything here is stated but **not implemented**. Nothing on this list was
guessed at or worked around.

---

## 1. Eco-Friendly Tubes — is 800 pieces still right?

The home page hero has two cards. The confirmed policy is a 500-piece standard
minimum, and card 1 already says 500. Card 2 says **800 pcs minimum order
quantity** for the eco-friendly line.

Both cards were left exactly as they are, as instructed. But the site now says
"500-piece standard minimum" in seven other places, so an 800 on one card reads
as either a genuine line-specific minimum or a leftover.

**Needed:** confirm 800 is the real minimum for the eco line, or the number to
replace it with.

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

## 4. Do Specialty and Plastic categories earn a page?

- **Specialty Tubes** — 7,125 impressions, position 13.05, 3 products (Luxury
  Tube Packaging, Paper Lipstick Tubes, Tube Food Packaging). Real demand, but
  three products with nothing in common is hard to give a distinct intent.
- **Custom Plastic Tubes** — 2,834 impressions, position 23.64, **0 clicks**,
  6 products. Weakest on every measure.

**Needed:** keep both as categories, merge one, or leave Plastic thin
deliberately. This is a business decision about whether the plastic line is
being pushed.

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

## 7. Yoast crop images — 70 missing, low impact

Every product's `Product.image` array lists two Yoast aspect-ratio crops
(`-1200x675`, `-1200x900`) that were not carried over from WordPress. The
primary image always resolves, so Merchant listings are unaffected.

Three options, none taken:

1. **Leave it.** Google uses a working image. 203 impressions and 1 click are at
   stake in total.
2. **Regenerate the crops** from the primaries and add them to
   `public/wp-content/uploads/` — restores the URLs Google indexed, changes no
   markup.
3. **Remove them from the schema** — cleanest structurally, but means editing
   Product schema, which Section 0 protects.

Option 2 is the only one that recovers the indexed URLs without touching schema.
**Needed:** a decision, or approval to do option 2.

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

## 9. Pasted ChatGPT interface markup in seven FAQ panels

`/product/deodorant-paper-tubes/`, `/product/empty-lotion-tubes/`,
`/product/kraft-paper-tubes/`, `/product/lotion-tubes/`,
`/product/paper-lipstick-tubes/`, `/product/skincare-tubes/`,
`/product/white-lipstick-tubes/`

These ship ChatGPT's own UI markup inside the FAQ panel — wrapper divs with
classes like `has-data-writing-block:pointer-events-none` and
`[--composer-overlap-px:28px]`. It renders harmlessly and the questions display
correctly, so it is cosmetic in the DOM rather than visible to a reader.

Not cleaned up: it is dead markup, not a defect with a search or conversion
consequence, and removing it means editing seven pages' body HTML for no
measurable gain. **Needed:** say the word if you want it stripped.

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

## 12. Compliance claims written — check these against supplier documentation

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

**Needed:** confirm items 1–9 against your manufacturers' documentation, or tell
me which to soften or remove.

---

## 13. Category page H1s were left alone — here is why, and what I would change

The brief asked for the H1 to be "the category name as buyers search it". Three
of the five already are `[export]`:

| H1 today | Exact-match query | Impressions |
|---|---|---|
| Custom Cardboard Tubes | "custom cardboard tubes" | 2,259 |
| Custom Paper Tubes | "custom paper tubes" | 2,810 |
| Custom Plastic Tubes | "custom plastic tubes" | 268 |
| Custom Mailing Tubes | "custom mailing tubes" | **809** — against "mailing tubes" **4,200** and "shipping tubes" **2,515** |
| Custom Specialty Tubes | *not a query anywhere in the 1,000-row export* | 0 |

So two are genuinely mismatched. I did **not** change them, for a reason worth
stating: the category H1 is not just a heading on that page. The same string is
the visible breadcrumb on all 35 product pages, the tile category label in every
product grid, the header navigation label, and — since A5 — the name in the
BreadcrumbList structured data. Changing the H1 alone would make the category
page disagree with 35 product pages about what the category is called.

**Recommendation, as one consistent rename rather than five inconsistent ones:**
"Custom Mailing Tubes" → "Mailing & Shipping Tubes", applied to the H1, the 35
product breadcrumbs, the tile labels and the nav at the same time. The URL does
not change. That is a contained job and I can do it on request. "Custom
Specialty Tubes" should wait on the consolidation decision in item 4.

---

## 14. The six page titles still say "Archives" — flagged, not fixed

Every category title reads `Custom Cardboard Tubes Archives - The Tube
Packaging`. "Archives" is a Yoast default that means nothing to a buyer, and it
is sitting in front of 44,770 impressions.

I did not fix it in Batch B on purpose. B0 put meta descriptions on these six
URLs alone so the CTR effect of the description could be measured on its own;
changing the titles in the same window would confound that measurement and the
content measurement together, and titles were not in Batch B's scope.

**Recommendation:** ship it as its own commit once the description effect has
been read — it is a six-line change and the clearest remaining CTR win on the
site after the content itself.

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

I did not decide this. Given the category pages convert 0.03% today and both
changes push the same direction, option 2 is defensible — but it is a
measurement call, not a technical one.
