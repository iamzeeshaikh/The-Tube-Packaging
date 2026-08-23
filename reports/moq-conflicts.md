# MOQ policy, NAP, and commercial claims — Stage 3

`[measured]` unless tagged otherwise. Verified against the built HTML.

## 1. MOQ policy — implemented

Owner-confirmed policy: **standard minimum 500 pieces; smaller runs down to
around 100 pieces at a higher per-piece cost.** No figure beyond those two was
invented, and no price figure was added anywhere.

### Home page

| Section | Before | After |
|---|---|---|
| Hero card 1 — Standard Tubes | 500 pcs minimum order quantity | *unchanged, as instructed* |
| Hero card 2 — Eco-Friendly Tubes | 800 pcs minimum order quantity | *unchanged* — flagged in `owner-decisions.md` |
| Hero points | No strict minimum order quantity | 500-piece standard minimum |
| Body copy | custom tube packaging without strict minimum order quantities. This approach allows startups to order smaller runs while enabling established brands to scale production efficiently. | custom tube packaging with a 500-piece standard minimum. Smaller runs are possible at a higher per-piece cost, which lets startups test a design while established brands scale production efficiently. |
| Why Choose Us | No Minimum Order Requirement: Flexible quantities support both small businesses and large-scale operations. | 500-Piece Standard Minimum: smaller trial runs are available on request, so both small businesses and large-scale operations are supported. |
| Trust block | No Strict Minimum Orders | 500-Piece Standard Minimum |
| Quote CTA list | Low minimums and custom sizes | 500-piece standard minimum, smaller runs on request |
| Stats bar | No MOQ on custom tubes | 500 pcs on custom tubes |
| Home FAQ | we provide the option for custom tube packaging no minimum order | we can quote custom tube packaging below the 500-piece standard minimum |

One more, outside the work order's list, found by the sweep:

| Page | Before | After |
|---|---|---|
| `/product/custom-shipping-tubes/` body | Custom shipping tubes no minimum options help brands test new sizes… | Smaller runs below the 500-piece standard minimum help brands test new sizes… |

### Product pages — the FAQ was worse than a spot check suggests

A spot check finds a few product pages answering the MOQ question
inconsistently. Enumerating all 35 instead of inspecting the ones that have it:

| | Pages |
|---|---|
| Genuine minimum-order question | **9** |
| Quantity-*adjacent* question that is not MOQ (bulk delivery speed, samples, wholesale pricing, jars vs tubes) | 7 |
| **No mention of minimum order at all** | **19** |

So more than half the catalogue simply never answered it. All 35 now carry the
same question and answer — 9 rewritten, 26 added:

> **What is the minimum order quantity?**
>
> Our standard minimum is 500 pieces. We can produce smaller runs — from around
> 100 pieces — at a higher per-piece cost, since setup and printing are fixed
> regardless of quantity. Per-piece cost drops significantly as quantity
> increases. Share your size, material, printing and quantity and we'll send a
> quote.

The clause explaining *why* smaller runs cost more is kept verbatim — it is the
part that reframes the price before the quote lands.

The 7 adjacent questions were deliberately left alone. "How fast can bulk orders
arrive" and "Can I order samples before placing a bulk order?" are not this
question and keep their own answers.

### Verification

- product pages carrying the standard answer: **35 / 35**
- "No MOQ", "no minimum order", "no strict minimum", "low minimums", "flexible
  quantities", "without strict minimum" remaining anywhere in the build: **0**
- distinct schema prices across all product pages after the change: **{'0.3'}** — unchanged
- `validate.py` 32/32, `linkcheck` 0 broken targets

## 2. NAP — corrected

Correct number: **(503) 358-0443**.

The work order reported the wrong number on `/about-us/`. It is on **six** pages,
and in both the `tel:` href *and* the visible text — so a visitor reads the
wrong number and tapping it dials the wrong line.

| Page | Occurrences corrected |
|---|---|
| `/about-us/` | 2 (href + visible) |
| `/contact-us/` | 2 |
| `/privacy-policy/` | 2 |
| `/refund_returns/` | 2 |
| `/shipping-policy/` | 2 |
| `/terms-conditions/` | 2 |

Swept and clean:

- **schema**: no `telephone` property exists in any structured data on the site
- **WhatsApp / Joinchat widget**: configured with `15033580443` — correct
- **header and footer chrome**: correct
- after the fix, `381-6437` appears **0** times in the build; `358-0443` appears **303** times

## 3. Commercial claims — reported only, not changed

None of these are owner-confirmed. All left exactly as they are.

| Claim | Occurrences | Pages | Example location |
|---|---|---|---|
| "Free Shipping" / "free delivery" | 3 | 3 | `/` — "Free Shipping: Helps reduce overall packaging costs." |
| "8–10 business day turnaround" | 38 | 36 | `/` hero points, and the Order Process block on every product page |
| "35+ Tube products" | 2 | 1 | `/` hero chip and stats bar |
| "Reply within 24 hours from a real person" | 1 | 1 | `/` quote panel |
| "fast / quick turnaround" (vague timing) | 59 | 36 | product page body copy and FAQs |
| "free design" / "free design support" | 87 | 36 | product FAQs and short descriptions |
| sample policy statements | 172 | 42 | product FAQs — "Can I order samples before placing a bulk order?" |

Two of these are worth the owner's attention beyond simple verification:

- **"Free Shipping"** sits on the home page next to the MOQ statement. If it is
  conditional (order value, destination), it needs its condition stated or
  removing — it is the single most common source of packaging-lead disputes.
- **"8–10 business day turnaround"** appears on 36 pages, which makes it the
  most-repeated commercial promise on the site. It is also embedded in the Order
  Process block on every product page, so correcting it later is a 36-page
  change, not a one-line one.

## 4. Not touched, by instruction

No price figure was added, removed or reworded anywhere. The $0.30 element, its
markup, its position and its formatting are untouched on every page, and the
Product schema price remains `0.3` on all 35 products.
