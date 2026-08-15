# Migration report — thetubepackaging.com → Astro

## 1. Source URLs discovered

- Sitemap URLs: **63**
- Additional URLs found by crawling internal links: **4**
  - https://thetubepackaging.com/my-account/lost-password/
  - https://thetubepackaging.com/product-category/custom-paper-tubes/page/2/
  - https://thetubepackaging.com/shop/page/2/
  - https://thetubepackaging.com/shop/page/3/
- Redirect-only URL: https://thetubepackaging.com/checkout/ (302 → /cart/ on the live site)
- Case-alias URLs answered by host rewrite: 3

**Total distinct source URLs: 71**

## 2. Astro URLs created

- Static pages built: **66**
- Redirects: **3**
- Rewrites (case aliases): **3**
- Sitemaps + robots.txt: **7 + 1**

## 3. Missing URL report

No sitemap URL is missing. Every source URL has an equivalent in the Astro build, either as a page or (for `/checkout/`) as the same redirect the live site serves.

## 4. Redirect report

| Source | Destination | Status | Reason |
|---|---|---|---|
| /checkout/ | /cart/ | 302 | live site 302s an empty cart to /cart/ |
| /shop/page/1/ | /shop/ | 301 | live site 301s page/1 to the unpaginated URL |
| /product-category/custom-paper-tubes/page/1/ | /product-category/custom-paper-tubes/ | 301 | live site 301s page/1 to the unpaginated URL |
| /product-category/Custom-Cardboard-Tubes/ | /product-category/custom-cardboard-tubes/ | 200 (rewrite) | live site answers 200 with a canonical to the lower-case URL |
| /product-category/Custom-Paper-Tubes/ | /product-category/custom-paper-tubes/ | 200 (rewrite) | live site answers 200 with a canonical to the lower-case URL |
| /product-category/Custom-Plastic-Tubes/ | /product-category/custom-plastic-tubes/ | 200 (rewrite) | live site answers 200 with a canonical to the lower-case URL |

No other redirects were introduced: every existing URL kept its exact path and trailing slash.

## 5. Metadata comparison report

All **66** pages match the live site exactly on title, meta description, canonical, meta robots, every Open Graph tag, every Twitter tag and both google-site-verification tags.

## 6. Content comparison report

- `/cart/`: {"h2": {"live": ["You may be interested in\u2026", "Your cart is currently empty!", "New in store", "Company", "Top Categories"], "astro": ["Your cart is currently empty!", "New in store", "Company", "Top Categories"]}, "words": {"live": 387, "astro": 382, "delta": -5}, "text": [{"op": "delete", "live": " may be interested in\u2026 You", "astro": ""}]}

## 7. Image comparison report

All **66** pages carry the identical set of image `src` values, `alt` text and `srcset` candidates as the live site.

## 8. Internal-link report

- References resolved across the build: internal links, images, stylesheets, scripts and srcset candidates
- **Unresolved targets: 1**
  - `/wp-content/uploads/2026/02/ChatGPT-Image-Feb-24-2026-09_27_44-AM.png` (from 1 page(s), e.g. /)

External hosts linked from the site:

- www.facebook.com (134 reference(s))
- www.linkedin.com (134 reference(s))
- join.chat (66 reference(s))
- www.googletagmanager.com (66 reference(s))
- www.google.com (36 reference(s))
- secure.gravatar.com (2 reference(s))

## 9. Schema comparison report

All **66** pages emit byte-identical JSON-LD: the Organization block on the home page, BlogPosting on all 8 posts, Product (with offers, price, availability, sku, mpn, brand, aggregateRating, review and image) on all 35 products, ItemList on the product categories and Person on the author archive.

## 10. Form test results

- Elementor forms carried across: **9**, all with their exact fields, names, required flags, placeholders, labels, order, file upload and honeypot
- Recipients, subjects, from-address, success/error/invalid messages and the `/thank-you/` redirect were recovered from the WordPress database and reimplemented in `api/form.js`
- The visible reCAPTCHA v2 checkbox is preserved and verified server-side with the same key pair
- **End-to-end test passed**: a real submission through the rendered contact form in a browser (fields filled, file attached, submit clicked) was accepted by `smtp.gmail.com` and returned Elementor's configured success message. A product-page quote form submission redirected to `/thank-you/` as configured. Both were routed to `info@zeecustomboxes.com` via `FORM_TO_OVERRIDE` so the client's inboxes were not used for testing.
- Not reproducible: Elementor's `save-to-database` submit action, which stored a copy of each entry in WordPress. Submissions are delivered by email only.

## 11. Desktop / tablet / mobile visual comparison

### Against snapshot — the captured live HTML replayed against the same local assets (isolates the migration from the randomly ordered product grids)

- Comparisons: **198** (of 198 possible)
- Under 1% differing pixels: **198 / 198**
- Under 0.2%: **195 / 198**
- Identical full-page height: **198 / 198**

| Page | Breakpoint | Differing pixels | Height (ref → Astro) |
|---|---|---|---|
| /my-account/lost-password/ | mobile | 0.498% | 2343 → 2343 |
| /category/uncategorized/ | mobile | 0.258% | 6111 → 6111 |
| /cart/ | tablet | 0.215% | 2753 → 2753 |
| /shop/page/2/ | mobile | 0.105% | 11147 → 11147 |
| /product-category/custom-paper-tubes/ | mobile | 0.104% | 11192 → 11192 |
| /terms-conditions/ | mobile | 0.1% | 11537 → 11537 |
| /5-ways-large-cardboard-tubes-boost-product-protection/ | tablet | 0.074% | 8034 → 8034 |
| /product/poster-mailing-tubes/ | mobile | 0.064% | 18245 → 18245 |
| /product/luxury-tube-packaging/ | mobile | 0.063% | 18401 → 18401 |
| /category/uncategorized/ | desktop | 0.062% | 5074 → 5074 |

### Against live — the live site over the network (also carries the random product order, and the live host rate-limited part of the run)

- Comparisons: **143** (of 198 possible)
- Under 1% differing pixels: **125 / 143**
- Under 0.2%: **109 / 143**
- Identical full-page height: **118 / 143**

| Page | Breakpoint | Differing pixels | Height (ref → Astro) |
|---|---|---|---|
| /terms-conditions/ | mobile | 17.23% | 11568 → 11537 |
| / | tablet | 16.25% | 29941 → 29941 |
| / | mobile | 11.342% | 37016 → 37016 |
| / | desktop | 8.482% | 18854 → 18854 |
| /about-us/ | mobile | 5.427% | 9372 → 9336 |
| /cardboard-tubes-for-business-effective-solutions-for-packaging-and-storage/ | desktop | 2.835% | 6492 → 6492 |
| /cardboard-tubes-for-business-effective-solutions-for-packaging-and-storage/ | tablet | 1.883% | 7500 → 7500 |
| /6-design-ideas-for-custom-square-paper-tubes/ | mobile | 1.847% | 22520 → 22550 |
| /product/white-paper-tubes/ | desktop | 1.422% | 9528 → 9559 |
| /cosmetic-tubes-complete-packaging-guide-for-beauty-product-manufacturers/ | mobile | 1.395% | 37383 → 37383 |


## 12. Build and crawl results

- `astro build`: completes with no errors, **66 pages**
- Static comparison against the live site: **65 / 66 pages identical**
- Rendered (post-JavaScript) comparison: **56 / 66 pages clean**
- Console output on the Astro build:
  - `console: Failed to load resource: the server responded with a status of 404 (Not Found)` — 1 page(s)
  - `console: Framing 'https://www.google.com/' violates the following report-only Content Security Policy directive: "frame-ancestors 'self'". The violati` — 1 page(s)

Breakdown of the pages not counted clean:

- 6 — zoom overlay / lazy image not yet settled in the live capture
- 2 — only the pre-existing broken og:image 404
- 2 — live capture blocked by the host (403), no local difference

## 13. Items that could not be replicated exactly

| Item | Why | Handling |
|---|---|---|
| Cart and checkout accumulate nothing | WooCommerce needs a PHP backend and a session | add-to-cart links, product IDs, prices and the /cart/ and /checkout/ pages are preserved exactly; /checkout/ reproduces the live 302 to /cart/ |
| My Account login / registration / password reset | needs WordPress to process the POST | pages render identically, forms are inert |
| Home-page product grid and related-products order | both use `orderby: rand`, so the live site reorders on every request | the static build freezes one draw; all products and links remain valid |
| Essential Addons Quick View modal | opened via admin-ajax.php | icon and grid preserved, modal needs a backend |
| Elementor form entries stored in the database | no WordPress to store them | submissions are emailed to the same recipients |
| Omnisend front-end script | talks to admin-ajax.php | removed |
| `og:image` on the home page | the file 404s on the live site too, and the tag uses http:// | tag copied verbatim, not repaired (freeze rule) |
| Live post-JavaScript capture for 2 blog posts | the live host returns 403 to headless browsers on those two URLs | their static HTML compared clean and they were compared visually against the captured live markup |

