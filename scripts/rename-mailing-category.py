#!/usr/bin/env python3
"""Rename the mailing category, consistently, everywhere it is displayed.

Why: "custom mailing tubes" earns 809 impressions. "mailing tubes" earns 4,200
at position 14.27 and "shipping tubes" 2,515 at 14.90 [export]. The category was
named after the smallest of the three.

Why it had to be done as one job rather than an H1 edit: the same string is the
visible breadcrumb on the product pages, the category label under every product
tile, the "tag" link on those tiles, the footer's Top Categories list and — since
A5 — the name inside the BreadcrumbList structured data, which is derived from
the H1. Changing one would have put the category page in disagreement with the
product pages about what the category is called.

The URL does not change. /product-category/mailing-tubes/ stays exactly as it is.

Two things are deliberately NOT touched:

  * The header and off-canvas nav already read "Mailing Tubes" — the head term,
    and short enough for a nav label. Leaving it reduces inconsistency rather
    than adding to it.
  * src/data/merchant.json `product_type` still reads "Custom Mailing Tubes".
    It is a merchant-defined taxonomy field that no searcher sees and that
    Google does not match against, and Merchant listings are 44% of this site's
    clicks. Changing a Merchant field for a cosmetic rename is not a trade worth
    making. Flagged in reports/fixes.md instead.
"""
import json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OLD = 'Custom Mailing Tubes'
NEW = 'Mailing &amp; Shipping Tubes'

total = 0
for name in ('pages.json', 'chrome.json'):
    path = ROOT / 'src/data' / name
    raw = path.read_text()
    data = json.loads(raw)

    def walk(node):
        global total
        if isinstance(node, dict):
            return {k: walk(v) for k, v in node.items()}
        if isinstance(node, list):
            return [walk(v) for v in node]
        if isinstance(node, str) and OLD in node:
            total += node.count(OLD)
            return node.replace(OLD, NEW)
        return node

    out = walk(data)
    path.write_text(json.dumps(out, ensure_ascii=False))
    print(f'{name}: rewritten')

if total == 0:
    sys.exit('nothing replaced — aborting')
print(f'\n{total} occurrences renamed to "{NEW}"')

# the feed must be left alone; assert it was
feed = (ROOT / 'src/data/merchant.json').read_text()
print(f'merchant.json still carries "{OLD}": {feed.count(OLD)} time(s) — left alone on purpose')
