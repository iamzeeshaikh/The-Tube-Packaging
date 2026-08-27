#!/usr/bin/env python3
"""Two statements that contradict the confirmed MOQ policy, found by auditing
every page rather than the ones Stage 3 had already touched.

1. /product/custom-shipping-tubes/ — a specification table cell reading
   "Custom shipping tubes no minimum". Stage 3 corrected this page's body copy
   and missed the table. It is the only "no minimum" claim left on the site and
   it sits on a product page, next to the FAQ that says the minimum is 500.

2. /the-ultimate-guide-to-tube-packaging-from-food-to-industrial-applications/ —
   a list headed "Questions for Suppliers" whose four bullets are two questions
   and two *answers*, pasted from some other supplier's site:

     "Our tube sizes range from 1/4" to 6" outside diameter. We also produce
      tubes in a variety of materials including copper, aluminum, brass,
      bronze, steel and stainless steel"
     "We don't have a minimum order quantity, however orders under 10 units
      will incur an additional handling charge to cover our costs of despatch"

   Three problems in two bullets: it contradicts the 500-piece policy, it claims
   the business produces metal tubes, and it breaks the list's own structure.
   They are restored to the questions the heading promises.
"""
import json, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / 'src/data/pages.json'

EDITS = [
    ('/product/custom-shipping-tubes/',
     '<b>Custom shipping tubes no minimum</b>',
     '<b>Smaller runs below the 500-piece minimum</b>'),

    ('/the-ultimate-guide-to-tube-packaging-from-food-to-industrial-applications/',
     '<li>Our tube sizes range from 1/4&#8243; to 6&#8243; outside diameter. We also '
     'produce tubes in a variety of materials including copper, aluminum, brass, '
     'bronze, steel and stainless steel</li>',
     '<li>What tube sizes and materials do you produce?</li>'),

    ('/the-ultimate-guide-to-tube-packaging-from-food-to-industrial-applications/',
     '<li>We don&#8217;t have a minimum order quantity, however orders under 10 units '
     'will incur an additional handling charge to cover our costs of despatch</li>',
     '<li>What is your minimum order quantity, and what does a smaller run cost?</li>'),
]

pages = json.loads(PAGES.read_text())
by_route = {v['route']: k for k, v in pages.items()}

for route, old, new in EDITS:
    key = by_route.get(route)
    if key is None:
        sys.exit(f'{route}: no such page — aborting')
    c = pages[key]['content']
    if c.count(old) != 1:
        sys.exit(f'{route}: target text found {c.count(old)} times, expected 1 — aborting')
    pages[key]['content'] = c.replace(old, new)
    print(f'  {route}\n      - {old[:88]}\n      + {new[:88]}')

PAGES.write_text(json.dumps(pages, ensure_ascii=False))
print(f'\n{len(EDITS)} contradictions corrected')
