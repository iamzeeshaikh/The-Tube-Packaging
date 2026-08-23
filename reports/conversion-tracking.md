# Tracking and conversion validation — Stage 7

`[measured]` against the rendered production build. **Nothing was implemented** —
see "Why nothing was implemented" at the end.

---

## The headline

**There is no GA4 property on this site, and no conversion event fires on any
form submission.**

`gtag.js` is present on all 68 pages, which is what makes this easy to miss —
but it loads a **Google Ads** conversion ID, not a GA4 measurement ID:

```html
<!-- Global site tag (gtag.js) - Google Ads: AW-16676839357 - Google for WooCommerce -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-16676839357"></script>
```

| Signal | Present on |
|---|---|
| `gtag.js` loader | 68 / 68 pages |
| Google Ads ID `AW-16676839357` | 68 / 68 |
| **GA4 measurement ID (`G-XXXXXXXX`)** | **0 / 68** |
| **GTM container (`GTM-XXXX`)** | **0 / 68** |
| `google-site-verification` | 68 / 68 |

So the business has **no analytics**, only an ad platform tag — and the ad tag
is never told when a lead happens. Every quote arrives as an email and nothing
else records it. That is why "most leads die on price" cannot currently be
quantified: there is no funnel data at all.

> **I corrected my own baseline for this.** `scripts/seo-baseline.mjs` reported
> `ga4_present = yes` on all 112 HTML pages, because it matched the
> `googletagmanager.com/gtag` loader. That was a false positive. The detector now
> requires a real `G-XXXXXXXX` ID and records `google_ads_present` separately;
> the baseline CSV has been regenerated and now reads **ga4 0 / ads 112 / gtm 0**.

---

## Event inventory `[measured]`

| Event | Pages | Where it comes from | Notes |
|---|---|---|---|
| `page_view` | 68 | gtag.js default | Goes to Google Ads, not analytics |
| `view_item` | 35 | inline script on product pages, `send_to: "GLA"` | Google Listings & Ads remarketing |
| `add_to_cart` | — | `google-listings-and-ads/js/build/gtag-events.js` | Bound to WooCommerce DOM events that the Astro cart no longer emits the same way — **unverified whether it still fires** |
| `generate_lead` | **0** | — | absent |
| `form_submit` | **0** | — | absent |
| `conversion` | **0** | — | absent |
| `begin_checkout` | **0** | — | absent |

---

## Action-by-action

| Action | Event name | Trigger | Current status | Test result | Recommended correction |
|---|---|---|---|---|---|
| Page view | `page_view` | gtag.js load | Working, to Google Ads only | `[measured]` present on 68/68 | Add GA4 alongside |
| Product view | `view_item` | inline script | Working, `send_to: GLA` | `[measured]` present on 35/35 | Add GA4 `view_item` |
| **Quote form submit** | — | — | **No event at all** | `[measured]` no `generate_lead` / `conversion` / `form_submit` anywhere in the build | **Highest priority.** Needs a GA4 ID and a Google Ads conversion label — both owner-supplied |
| **Contact form submit** | — | — | **No event** | as above | as above |
| File upload | — | — | No event | Field present on 68/68 | Optional |
| Phone click | — | — | **No event** | `tel:` links on 68/68 pages | Worth tracking — the phone is on every page |
| Email click | — | — | **No event** | `mailto:` links on 68/68 | Worth tracking |
| WhatsApp / Joinchat | — | — | **No event** | widget on 68/68 | Worth tracking |
| Zendesk chat open | — | — | **No event** | widget on 68/68 | Worth tracking |
| Get Quote button | — | — | No event | Elementor popup trigger | Optional |
| Add to cart | `add_to_cart` | GLA plugin JS | **Unverified** | `MANUAL — not verified` | Confirm it still fires on the Astro cart |
| Product inquiry source | — | hidden `referer_title` / `queried_id` | **Fixed in Stage 2.3** | `[measured]` correct on 5 sampled pages | Now usable for manual attribution |
| Thank-you state | `page_view` only | redirect | Partial — see below | `[measured]` | Fire the conversion here |
| Duplicate-event prevention | n/a | n/a | Not applicable — there are no conversion events to duplicate | — | Revisit once events exist |

---

## The thank-you page is only half-wired

Only **2 of the 9 configured forms** redirect to `/thank-you/`:

| Form ID | Where | Redirect |
|---|---|---|
| `2bb183f5` | product page quote form | `/thank-you/` |
| `e0d8389` | home page quote block | `/thank-you/` |
| `487202df` | product page "send the layout" | inline message only |
| `7eeee1ea`, `70a5bdc`, `693e3f36`, `4ec39e2`, `4675000`, `344590d` | contact and other forms | inline message only |

So a thank-you-page-based conversion would capture **two of nine** submission
paths. Any conversion tracking has to fire on the **submit success callback** in
`public/assets/ttp.js`, not on the thank-you page — that is the single point
every form already passes through.

`/thank-you/` is also `index, follow` and fires `page_view` with `send_to: GLA`
but no conversion. Stage 5 recommends noindexing it.

---

## Why nothing was implemented

The brief says to implement only objectively broken tracking that changes no
design or content. Nothing here qualifies:

- **GA4** cannot be added without a measurement ID from the owner. Inventing one
  or guessing at an existing property would be worse than the current gap.
- **A Google Ads conversion** needs a conversion label from the same account.
- **Event tracking on phone / email / chat / form-submit** all depend on one of
  the above existing first.
- **`/thank-you/` noindex** is an archive policy change (Stage 5), not a
  tracking fix.

The one thing I could correct without any of that was my own baseline's GA4
false positive, which is done.

---

## What is needed to close this — for `owner-decisions.md`

1. **GA4 measurement ID** (`G-XXXXXXXX`), or confirmation that no GA4 property
   exists and one should be created.
2. **Google Ads conversion action + label** for "quote submitted", from the
   account that owns `AW-16676839357`.
3. Confirmation of whether the `AW-16676839357` account is still active and
   spending — a Google-for-WooCommerce tag left over from the WordPress build may
   be pointing at a dormant account.

With 1 and 2, the implementation is small and self-contained: one event in the
existing success callback in `ttp.js`, which every form already passes through.

---

## Explicitly not verified

| Item | Why |
|---|---|
| Whether `page_view` / `view_item` actually arrive in the Ads account | No account access |
| Whether the GLA `add_to_cart` event still fires on the Astro cart | Needs a live session with network capture against the real cart flow |
| Whether tags fire after consent | The build sets `consent default: denied` for EU regions; behaviour post-consent needs a real consent interaction |
| Real form submission end-to-end | Would send live enquiries to the client (same reason as Stage 2.3) |
