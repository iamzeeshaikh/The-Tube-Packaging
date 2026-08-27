#!/usr/bin/env python3
"""D8 — stop the product tiles minting indexable ?add-to-cart= URLs.

Stage 2.8 measured what these do on the Astro build: nothing. cart.js handles
add-to-cart on *click*, by intercepting the anchor; visiting the URL directly
adds no item and renders a byte-identical copy of the clean page. So the site
was emitting 243 links whose only effect was to offer Google 45 indexable
duplicates — 264 impressions and 1 click between them.

The fix Stage 2.8 recommended and did not implement: point the href at the clean
product URL and leave the cart action on the click. That is strictly better than
today even with JavaScript off, where the button currently goes to a page that
does nothing and would now go to the product.

Safe because of how cart.js reads the id:

    function addToCartHref(link) {
      var m = (link.getAttribute('href') || '').match(/[?&]add-to-cart=(\\d+)/);
      if (m) return m[1];
      return link.dataset.product_id || null;      <-- the fallback
    }

and because its selector is `a[href*="add-to-cart="], a.add_to_cart_button` —
the second half still matches. Only anchors that carry BOTH the parameter and a
matching data-product_id are rewritten, so the fallback is guaranteed to resolve.

Canonicals, redirects and page URLs are untouched. Stage 2.8's first
recommendation — leave the canonicals alone, they already point at the clean URL
— still holds and nothing here changes them.
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / 'src/data/pages.json'
CATALOGUE = json.loads((ROOT / 'src/data/catalogue.json').read_text())
PRODUCTS = CATALOGUE.get('products', CATALOGUE)

pages = json.loads(PAGES.read_text())

# The 35 Elementor "Add to cart" buttons on the product pages are a different
# shape: `href="https://thetubepackaging.com?add-to-cart=189&#038;quantity=1..."`,
# no data-product_id, and class `elementor-button` rather than
# `add_to_cart_button`. cart.js can only find them through the href, so cleaning
# it would break the button outright, and making them findable would mean adding
# `add_to_cart_button` to their class list — which changes what Elementor styles.
# They get rel="nofollow" instead: Google stops following them into a parameter
# URL, the button keeps working, and nothing visible changes.
ELEMENTOR = re.compile(
    r'<a\s(?![^>]*\brel=)[^>]*?href="https://thetubepackaging\.com\?add-to-cart=\d+[^"]*"[^>]*?>')

ANCHOR = re.compile(r'<a\s[^>]*?href="([^"]*?\?add-to-cart=(\d+))"[^>]*?>')

rewritten = skipped = 0
for key, page in pages.items():
    c = page['content']
    out = []
    last = 0
    for m in ANCHOR.finditer(c):
        tag, href, pid = m.group(0), m.group(1), m.group(2)
        product = PRODUCTS.get(pid)
        if not product or f'data-product_id="{pid}"' not in tag:
            skipped += 1
            continue
        out.append(c[last:m.start()])
        out.append(tag.replace(f'href="{href}"', f'href="{product["url"]}"'))
        last = m.end()
        rewritten += 1
    if last:
        out.append(c[last:])
        page['content'] = ''.join(out)

nofollowed = 0
for key, page in pages.items():
    c = page['content']
    new, n = ELEMENTOR.subn(lambda m: m.group(0)[:2] + ' rel="nofollow"' + m.group(0)[2:], c)
    if n:
        page['content'] = new
        nofollowed += n

if skipped:
    print(f'{skipped} anchors left alone (no matching data-product_id or catalogue entry)')
if not rewritten and not nofollowed:
    sys.exit('nothing rewritten — aborting')

PAGES.write_text(json.dumps(pages, ensure_ascii=False))
print(f'{rewritten} add-to-cart hrefs pointed at the clean product URL')
print(f'{nofollowed} Elementor add-to-cart buttons marked rel="nofollow"')
