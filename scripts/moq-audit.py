#!/usr/bin/env python3
"""What does the site say about minimum order quantity, right now?

Enumerates every page in the build, extracts every sentence that mentions a
minimum order or an order quantity, and groups them by what they actually claim
— so a contradiction cannot hide on a page nobody thought to check.
"""
import re, glob, os, html as htmlmod
from collections import defaultdict

TRIGGER = re.compile(
    r'\bMOQ\b|minimum order|minimum quantity|order minimum|minimum is|'
    r'no minimum|without minimum|low minimum|smaller runs|small runs|'
    r'\b\d{2,5}[\s-]*(?:pcs|pieces|piece|units)\b|\bpiece minimum\b', re.I)

CLAIMS = [
    ('500-piece standard minimum', re.compile(r'500[\s-]*(?:pcs|pieces|piece)|500-piece|standard minimum is 500|minimum is 500', re.I)),
    ('~100-piece smaller run',      re.compile(r'\b(?:around |from around |from )?100 pieces\b|from around 100', re.I)),
    ('800 pcs (eco line)',          re.compile(r'\b800\b', re.I)),
    ('NO minimum claimed',          re.compile(r'no (?:strict )?minimum|without (?:strict )?minimum|no moq', re.I)),
    ('other quantity figure',       re.compile(r'\b\d{2,5}[\s-]*(?:pcs|pieces|units)\b', re.I)),
]

def sentences(doc):
    doc = re.sub(r'<(script|style|noscript)\b[\s\S]*?</\1>', ' ', doc, flags=re.I)
    doc = re.sub(r'<!--[\s\S]*?-->', ' ', doc)
    doc = re.sub(r'<[^>]*>', ' ', doc)
    txt = re.sub(r'\s+', ' ', htmlmod.unescape(doc))
    return re.split(r'(?<=[.!?])\s+(?=[A-Z(])', txt)

buckets = defaultdict(list)
pages_with = set()
total = 0
for f in sorted(glob.glob('dist/**/index.html', recursive=True)):
    route = '/' + os.path.relpath(os.path.dirname(f), 'dist').replace('.', '').strip('/')
    route = (route.rstrip('/') + '/').replace('//', '/')
    seen = set()
    for s in sentences(open(f, encoding='utf-8').read()):
        s = s.strip()
        if not s or len(s) > 400 or not TRIGGER.search(s) or s in seen:
            continue
        seen.add(s)
        total += 1
        pages_with.add(route)
        label = next((n for n, rx in CLAIMS if rx.search(s)), 'mentions a minimum, no figure')
        buckets[label].append((route, s))

print(f'{total} statements across {len(pages_with)} pages\n')
for name, _ in CLAIMS + [('mentions a minimum, no figure', None)]:
    rows = buckets.get(name)
    if not rows:
        continue
    uniq = {}
    for route, s in rows:
        uniq.setdefault(s, []).append(route)
    print(f'== {name}  —  {len(rows)} occurrences on {len({r for r,_ in rows})} pages')
    for s, routes in sorted(uniq.items(), key=lambda kv: -len(kv[1])):
        print(f'   [{len(routes):>2} page(s)] {s[:190]}')
        if len(routes) <= 3:
            print(f'        {", ".join(routes)}')
    print()
