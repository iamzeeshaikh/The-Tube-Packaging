#!/usr/bin/env python3
"""Remove the stale "Starting from 50 MOQ." qualifier from /shipping-policy/.

The owner's instruction, and the only edit made to that page.

Why it had to go: with the standard minimum settled at 500 pieces and smaller
runs from around 100, no orderable quantity falls below 50, so the condition
could never apply. It was left over from before the MOQ policy was fixed, and it
invited the question "so is there a threshold or not?".

Why this does not put Merchant Center at risk — the owner's stated concern, and
a fair one. Merchant reads the feed's shipping cost against what the site says.
The feed declares `g:shipping` US at 0.00 USD, unconditionally. Removing an
unreachable quantity threshold moves the page *towards* that, not away from it.
Everything Merchant actually checks is untouched:

    destinations   US, UK, Canada, Australia          unchanged
    cost           Free Standard Shipping             unchanged
    processing     3 – 5 business days                unchanged
    transit        3 – 5 business days                unchanged
    total          6 – 10 business days               unchanged
    tracking, lost and delayed shipments, contact     unchanged

One paragraph is deleted. Nothing else on the page, and no other page, is
touched — /terms-conditions/, /refund_returns/ and /privacy-policy/ are not
opened at all.
"""
import json, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / 'src/data/pages.json'

TARGET = '<h3><strong>✅ Free Standard Shipping</strong></h3>\n<p>Starting from 50 MOQ.</p>\n'
REPLACE = '<h3><strong>✅ Free Standard Shipping</strong></h3>\n'

pages = json.loads(PAGES.read_text())
page = pages['shipping-policy']
before = page['content']

if before.count(TARGET) != 1:
    sys.exit(f'expected the qualifier exactly once, found {before.count(TARGET)} — aborting')

after = before.replace(TARGET, REPLACE)
removed = len(before) - len(after)
if removed != len('<p>Starting from 50 MOQ.</p>\n'):
    sys.exit(f'removed {removed} characters, expected only the paragraph — aborting')

for keep in ['United States', 'United Kingdom', 'Canada', 'Australia',
             'Free Standard Shipping', '3 – 5 business days', '6 – 10 business days',
             'Order Tracking', 'Lost or Delayed Shipments']:
    if before.count(keep) != after.count(keep):
        sys.exit(f'"{keep}" count changed — aborting')

page['content'] = after
PAGES.write_text(json.dumps(pages, ensure_ascii=False))
print(f'removed "Starting from 50 MOQ." ({removed} characters); everything else on the page intact')
