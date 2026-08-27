#!/usr/bin/env python3
"""Bring the site's delivery time in line with Google Merchant Center.

Merchant Center, account 5418427166, "Shipping Policy":

    Countries          Australia, Canada, United Kingdom, United States
    Order cut off      2:00 PM (GMT-08:00) Pacific, Los Angeles
    Handling time      3 – 5 days, fulfilled Mon – Sat
    Transit time       3 – 5 days, shipped Mon – Sat, all destinations
    TOTAL DELIVERY     6 – 10 business days
    Shipping cost      Free shipping — all orders get free shipping
    Order value        no conditions set

The site carried two figures. /shipping-policy/, /about-us/ and
/terms-conditions/ already say 3–5 processing plus 3–5 transit for a 6–10 total,
which matches Merchant exactly. The home page and all 35 product pages said
8–10, which does not.

Merchant is the authority — it is what Google shows next to the listing — so the
37 statements saying 8–10 become 6–10. Nothing on /shipping-policy/,
/terms-conditions/, /refund_returns/ or /privacy-policy/ is touched; they were
already correct.
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / 'src/data/pages.json'
PROTECTED = {'/shipping-policy/', '/terms-conditions/', '/refund_returns/', '/privacy-policy/'}

SUBS = [
    ('Typical turnaround: 8–10 business days', 'Typical turnaround: 6–10 business days'),
    ('8&#8211;10 business day turnaround',      '6&#8211;10 business day turnaround'),
    # the home page writes the dash as &ndash; rather than &#8211;, which is why
    # the first pass left two behind and the verification caught them
    ('8&ndash;10 business day turnaround',      '6&ndash;10 business day turnaround'),
    ('<strong>8&ndash;10</strong><span>day turnaround</span>',
     '<strong>6&ndash;10</strong><span>day turnaround</span>'),
    ('You will receive your order within 8 to 10 business days',
     'You will receive your order within 6 to 10 business days'),
]

pages = json.loads(PAGES.read_text())
counts = {old: 0 for old, _ in SUBS}
touched = set()

for key, page in pages.items():
    if page['route'] in PROTECTED:
        continue
    for field in ('content', 'head'):
        s = page.get(field)
        if not isinstance(s, str):
            continue
        for old, new in SUBS:
            if old in s:
                counts[old] += s.count(old)
                s = s.replace(old, new)
                touched.add(page['route'])
        page[field] = s

total = sum(counts.values())

# nothing anywhere may still claim 8-10, in any dash spelling and in any field
DASH = r'8\s*(?:to|–|-|&#8211;|&ndash;|&#x2013;)\s*10'
leftover = sum(len(re.findall(DASH, v, re.I))
               for page in pages.values() for v in page.values() if isinstance(v, str))
if leftover:
    sys.exit(f'{leftover} statements still say 8–10 — aborting')

PAGES.write_text(json.dumps(pages, ensure_ascii=False))
for old, n in counts.items():
    print(f'  {n:3}  {old[:58]}')
print(f'\n{total} statements aligned to 6–10 business days across {len(touched)} pages')
