#!/usr/bin/env python3
"""D6 — apply the Stage 5 archive recommendations that were never implemented.

reports/sitemap-archive.md recommended these five months ago and stopped short of
doing them, because archive policy was the owner's call. It has now been given.

  /author/shanimazhar82gmail-com/               noindex, follow  + out of sitemap
  /category/uncategorized/                      noindex, follow  + out of sitemap
  /shop/page/2/                                 noindex, follow
  /shop/page/3/                                 noindex, follow
  /product-category/custom-paper-tubes/page/2/  noindex, follow

`follow` is kept on all five so the products and posts they link to stay
crawlable — this removes the pages from the index, not from the crawl graph.
Total traffic at risk, from the export: 1 click and 45 impressions.

Not included, deliberately: /category/information/. Stage 5 recommended
noindexing it too, on 51 impressions and 0 clicks at position 6.63. But its
title was rewritten today from the Yoast default "Information Archives" to
"Tube Packaging Guides & Articles", and noindexing a page hours after giving it
a real title throws away the measurement. It stays indexed for one cycle.

The author sitemap is left registered in sitemap_index.xml but emptied of its
one URL, rather than deleted — removing a child sitemap that Search Console has
on file produces a fetch error, while an empty one is read and ignored.
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / 'src/data/pages.json'

OLD = ("<meta name='robots' content='index, follow, max-image-preview:large, "
       "max-snippet:-1, max-video-preview:-1' />")
NEW = "<meta name='robots' content='noindex, follow' />"

ROUTES = [
    '/author/shanimazhar82gmail-com/',
    '/category/uncategorized/',
    '/shop/page/2/',
    '/shop/page/3/',
    '/product-category/custom-paper-tubes/page/2/',
]

DROP_FROM_SITEMAP = {
    'author-sitemap.xml': ['/author/shanimazhar82gmail-com/'],
    'category-sitemap.xml': ['/category/uncategorized/'],
}

pages = json.loads(PAGES.read_text())
by_route = {v['route']: k for k, v in pages.items()}

for route in ROUTES:
    key = by_route.get(route)
    if key is None:
        sys.exit(f'{route}: no such page record — aborting')
    head = pages[key]['head']
    if head.count(OLD) != 1:
        sys.exit(f'{route}: robots meta not found exactly once — aborting')
    pages[key]['head'] = head.replace(OLD, NEW)
    print(f'  noindex, follow  {route}')

PAGES.write_text(json.dumps(pages, ensure_ascii=False))

for name, locs in DROP_FROM_SITEMAP.items():
    path = ROOT / 'public' / name
    xml = path.read_text()
    for loc in locs:
        block = re.compile(
            r'\t<url>\s*\n\t\t<loc>https://thetubepackaging\.com' + re.escape(loc)
            + r'</loc>[\s\S]*?\n\t</url>\n')
        xml, n = block.subn('', xml)
        if n != 1:
            sys.exit(f'{name}: removed {n} entries for {loc}, expected 1 — aborting')
        print(f'  sitemap -       {loc}  ({name})')
    path.write_text(xml)
