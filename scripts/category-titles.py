#!/usr/bin/env python3
"""Replace the Yoast archive titles on the six commercial archive pages.

Why they said "Archives": Yoast's default title template for a taxonomy archive
is `%%term_title%% Archives %%sep%% %%sitename%%`. It was never overridden in
WordPress, so it rendered into the HTML and the migration captured it verbatim.
It carries no meaning for a buyer and it sat in front of 44,770 impressions.

Each replacement leads with the phrasing the GSC export shows buyers using
[export], verified against data/gsc/queries.csv before it was written:

  cardboard  "cardboard tube packaging"   12,348 impr, pos  9.46
             "custom cardboard tube packaging" 1,309
  mailing    "mailing tubes"               4,200        pos 14.27
             "shipping tubes"              2,515        pos 14.90
             "bulk mailing tubes"          1,450        pos 30.11, 7 clicks
  paper      "paper tube packaging"        9,774        pos 10.68
             "custom paper tubes"          2,810 / "kraft tube packaging" 1,511
  specialty  "tube food packaging"         3,612 / "luxury tube packaging" 1,510
  plastic    "lotion tubes"                1,530 / "cosmetic squeeze tubes" 837
  shop       "tube packaging"             19,443        pos  7.55
             "custom tube packaging"       4,235

The brand suffix is dropped where it would repeat "Tube Packaging" inside the
title. Google renders a site name beside the title in its own right, so the
words are better spent on what the page sells.

Only <title> and og:title change. No description, H1, canonical, schema or price
is touched, and no other page is opened.
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / 'src/data/pages.json'

TITLES = {
    '/product-category/custom-cardboard-tubes/':
        'Custom Cardboard Tube Packaging | Wholesale Tubes',
    '/product-category/mailing-tubes/':
        'Custom Mailing & Shipping Tubes | Poster Tubes in Bulk',
    '/product-category/custom-paper-tubes/':
        'Custom Paper Tubes | Kraft & Printed Paper Tube Packaging',
    '/product-category/specialty-tubes/':
        'Specialty Tubes | Luxury, Cosmetic & Food Tube Packaging',
    '/product-category/custom-plastic-tubes/':
        'Custom Plastic Tubes | Lotion & Cosmetic Squeeze Tubes',
    '/product-category/custom-paper-tubes/page/2/':
        'Custom Paper Tubes | Page 2 | The Tube Packaging',
    '/shop/':
        'Shop Custom Tube Packaging | Paper, Cardboard & Plastic',
    # the blog index carries the same Yoast default. 51 impressions at position
    # 6.63, so small, but it is the same defect and the same one-line fix.
    '/category/information/':
        'Tube Packaging Guides & Articles | The Tube Packaging',
}

# NOT rewritten, deliberately:
#   /category/uncategorized/  — a default WordPress term with zero impressions
#     and zero clicks. It should be removed from the site and the sitemap, not
#     given a better title. Recorded in reports/owner-decisions.md.
#   /my-account/ and /my-account/lost-password/ share a title. Both are noindex,
#     so a duplicate title has no search consequence.

pages = json.loads(PAGES.read_text())
by_route = {v['route']: k for k, v in pages.items()}
changed = 0

for route, new in TITLES.items():
    key = by_route.get(route)
    if key is None:
        sys.exit(f'{route}: no such page record — aborting')
    head = pages[key]['head']
    esc = new.replace('&', '&amp;')

    t = re.search(r'<title>(.*?)</title>', head, re.S)
    og = re.search(r'<meta property="og:title" content="([^"]*)"', head)
    if not t or not og:
        sys.exit(f'{route}: title or og:title not found — aborting')
    if head.count('<title>') != 1 or head.count('<meta property="og:title"') != 1:
        sys.exit(f'{route}: title or og:title is not unique — aborting')

    head = head.replace(t.group(0), f'<title>{esc}</title>')
    head = head.replace(og.group(0),
                        f'<meta property="og:title" content="{esc}" />')
    pages[key]['head'] = head
    print(f'{route}\n    was: {t.group(1)}\n    now: {new}  ({len(new)} chars)')
    changed += 1

PAGES.write_text(json.dumps(pages, ensure_ascii=False))
print(f'\n{changed} titles rewritten')
