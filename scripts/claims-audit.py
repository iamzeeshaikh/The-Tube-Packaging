#!/usr/bin/env python3
"""What exactly does the site claim about shipping, turnaround and samples?

Enumerates every sentence on every page that touches one of the three claims the
owner has now confirmed, and groups identical wording, so the confirmed text is
known exactly rather than approximately.
"""
import re, glob, os, html as h
from collections import defaultdict

CLAIMS = {
    'free shipping / delivery': re.compile(r'free (shipping|delivery)|shipping is free|no shipping (cost|charge)', re.I),
    'turnaround / lead time':   re.compile(r'turnaround|lead time|business days?|working days?|\b\d+\s*[-–]\s*\d+\s*days?\b', re.I),
    'samples':                  re.compile(r'\bsamples?\b|\bmock ?up|\bproof\b|\bprototype\b', re.I),
    'free design':              re.compile(r'free design|design support|artwork support', re.I),
}

def sentences(doc):
    doc = re.sub(r'<(script|style|noscript)\b[\s\S]*?</\1>', ' ', doc, flags=re.I)
    doc = re.sub(r'<!--[\s\S]*?-->', ' ', doc)
    doc = re.sub(r'<[^>]*>', ' ', doc)
    return re.split(r'(?<=[.!?])\s+(?=[A-Z(])', re.sub(r'\s+', ' ', h.unescape(doc)))

buckets = {k: defaultdict(list) for k in CLAIMS}
for f in sorted(glob.glob('dist/**/index.html', recursive=True)):
    route = '/' + os.path.relpath(os.path.dirname(f), 'dist').replace('.', '').strip('/')
    route = (route.rstrip('/') + '/').replace('//', '/')
    seen = set()
    for s in sentences(open(f, encoding='utf-8').read()):
        s = s.strip()
        if not s or len(s) > 320 or s in seen:
            continue
        seen.add(s)
        for name, rx in CLAIMS.items():
            if rx.search(s):
                buckets[name][s].append(route)

for name in CLAIMS:
    rows = sorted(buckets[name].items(), key=lambda kv: -len(kv[1]))
    total = sum(len(v) for _, v in rows)
    print(f'\n{"="*74}\n{name.upper()} — {total} occurrences, {len(rows)} distinct wordings\n{"="*74}')
    for s, routes in rows[:14]:
        print(f'  [{len(routes):>2} page(s)] {s[:200]}')
