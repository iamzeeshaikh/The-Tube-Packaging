#!/usr/bin/env python3
"""D4/D5 — two loose ends recorded in reports/fixes.md but never implemented.

2.7  Two product pages carry the anchor text "cardboard tube packaging" pointing
     at the home page, while the product it names lives at
     /product/cardboard-tube-packaging/. Stage 2.7 fixed the third, unambiguous
     case (a self-link) and reported these two because they *might* have been
     intentional. They are not: the anchor names a product, that product has a
     page, and pointing it at the home page wastes the link and misleads the
     reader. Both are re-pointed at the product.

2.4  /product-category/Custom-Paper-Tubes/page/2/ returns 404 on production,
     confirmed live. The vercel.json rewrites cover the three uppercase category
     URLs but not the paginated variant of any of them. It carries 6
     impressions. A rewrite is added for the one that exists.
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / 'src/data/pages.json'
VERCEL = ROOT / 'vercel.json'

TARGET = 'https://thetubepackaging.com/product/cardboard-tube-packaging/'
ANCHOR = 'cardboard tube packaging'

pages = json.loads(PAGES.read_text())
fixed = 0
for key, page in pages.items():
    if page['route'] not in ('/product/kraft-paper-tubes/', '/product/round-cardboard-tubes/'):
        continue
    c = page['content']
    # the anchor text is wrapped in <strong> on both pages, so match the link
    # and compare its stripped text rather than assuming bare text
    pat = re.compile(r'(<a[^>]*href=")https://thetubepackaging\.com/("[^>]*>)([\s\S]*?)(</a>)')

    hits = []

    def swap(m):
        if re.sub(r'<[^>]*>', '', m.group(3)).strip().lower() != ANCHOR:
            return m.group(0)
        hits.append(1)
        return m.group(1) + TARGET + m.group(2) + m.group(3) + m.group(4)

    new = pat.sub(swap, c)
    n = len(hits)
    if n != 1:
        sys.exit(f"{page['route']}: matched {n} anchors, expected exactly 1 — aborting")
    page['content'] = new
    fixed += 1
    print(f"  {page['route']:38} '{ANCHOR}' -> /product/cardboard-tube-packaging/")

if fixed != 2:
    sys.exit(f'fixed {fixed} anchors, expected 2 — aborting')
PAGES.write_text(json.dumps(pages, ensure_ascii=False))

vercel = json.loads(VERCEL.read_text())
rewrites = vercel['rewrites']
src = '/product-category/Custom-Paper-Tubes/page/2/'
if any(r['source'] == src for r in rewrites):
    sys.exit('the paginated alias already exists — aborting')
idx = next(i for i, r in enumerate(rewrites)
           if r['source'] == '/product-category/Custom-Paper-Tubes/')
rewrites.insert(idx + 1, {
    'source': src,
    'destination': '/product-category/custom-paper-tubes/page/2/index.html',
})
VERCEL.write_text(json.dumps(vercel, indent=2) + '\n')
print(f'  rewrite added: {src}')
