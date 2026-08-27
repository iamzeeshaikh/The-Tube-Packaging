#!/usr/bin/env python3
"""Name the destinations wherever the site claims free shipping.

The owner confirms free shipping applies to all orders — the quantity qualifier
is gone from /shipping-policy/ — but it is still limited to four countries, and
29 pages outside the policy pages claim it without saying where. An unqualified
free-shipping claim is the most common source of dispute on a packaging lead.

One sentence is appended to the paragraph carrying the *first* claim on each
page, rather than to all 32 occurrences, so a page that mentions it three times
does not repeat the destinations three times.

/shipping-policy/, /terms-conditions/, /refund_returns/ and /privacy-policy/ are
never opened: the owner's instruction, so that nothing Merchant Center reads as
policy changes.
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / 'src/data/pages.json'
PROTECTED = {'/shipping-policy/', '/terms-conditions/', '/refund_returns/', '/privacy-policy/'}

CLAIM = re.compile(r'free (?:design (?:and|&amp;|&) )?shipping|free shipping', re.I)
NOTE = ' Free shipping covers the United States, United Kingdom, Canada and Australia.'

# Two hand-written cases, because appending a sentence would read badly:
#   the home page's claim is a short bullet in a "Why Choose Us" list, so the
#   destinations go inside the bullet instead;
#   /product/cosmetic-tubes/ carries a pre-existing "today!." typo in the
#   paragraph being edited, corrected while it is open.
SPECIAL = [
    ('/', '<li><p>Free Shipping: Helps reduce overall packaging costs.</p></li>',
          '<li><p>Free Shipping: To the US, UK, Canada and Australia, helping reduce '
          'overall packaging costs.</p></li>'),
    ('/product/cosmetic-tubes/', 'Order your cosmetic tubes today!.</p>',
                                 'Order your cosmetic tubes today!</p>'),
]

DRY = '--apply' not in sys.argv
pages = json.loads(PAGES.read_text())
changed = 0

by_route = {v['route']: k for k, v in pages.items()}
for route, old, new in SPECIAL:
    page = pages[by_route[route]]
    if old not in page['content']:
        print(f'  SPECIAL {route}: text not found — skipped')
        continue
    if not DRY:
        page['content'] = page['content'].replace(old, new, 1)
    print(f'  SPECIAL {route}: {old[:58]}…')

for key, page in pages.items():
    if page['route'] in PROTECTED:
        continue
    c = page['content']
    if page['route'] == '/':
        continue                          # handled above, inside the bullet
    m = CLAIM.search(c)
    if not m or NOTE.strip() in c:
        continue

    # the enclosing <p> or <li> the claim sits in
    best = None
    for tag in ('p', 'li'):
        open_at = c.rfind('<' + tag, 0, m.start())
        close_at = c.find('</' + tag + '>', m.end())
        if open_at == -1 or close_at == -1:
            continue
        if c.rfind('</' + tag + '>', 0, m.start()) > open_at:
            continue                      # the claim is not inside this element
        if best is None or open_at > best[1]:
            best = (tag, open_at, close_at)
    if best is None:
        print(f'  SKIP {page["route"]}: claim is not inside a <p> or <li>')
        continue

    tag, _, close_at = best
    head = c[:close_at].rstrip()
    if not head.endswith(('.', '!', '?')):
        head += '.'
    new = head + NOTE + c[close_at:]

    if DRY:
        s = re.sub(r'<[^>]*>', '', new[max(0, close_at - 240):close_at + len(NOTE) + 8])
        print(f'  {page["route"]}\n      …{re.sub(chr(92)+"s+", " ", s).strip()[-230:]}')
    else:
        page['content'] = new
    changed += 1

print(f'\n{changed} page(s) {"would be" if DRY else ""} qualified')
if not DRY:
    PAGES.write_text(json.dumps(pages, ensure_ascii=False))
