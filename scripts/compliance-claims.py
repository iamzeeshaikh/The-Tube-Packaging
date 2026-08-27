#!/usr/bin/env python3
"""Enumerate every certification, compliance standard and food-safety claim in
the built HTML, so the log in reports/owner-decisions.md is built by scanning
the pages rather than from memory.

Enumerates the denominator — every sentence in the editorial sections — and
selects the ones carrying a compliance marker, so a claim cannot be missed by
only looking where I expect one.
"""
import re, html, glob, os, sys

MARKERS = re.compile(
    r'\b(FDA|21 CFR|CFR|BRCGS|ISO\s?\d+|EU\)? No|1935/2004|10/2011|Regulation|'
    r'food[- ]grade|food[- ]safe|food[- ]contact|migration|declaration of compliance|'
    r'certif\w+|compostable|compliant|compliance|BfR|tamper[- ]evident)\b', re.I)

rows = []
for f in sorted(glob.glob('dist/**/index.html', recursive=True)):
    route = '/' + os.path.relpath(os.path.dirname(f), 'dist').replace('.', '').strip('/')
    route = (route.rstrip('/') + '/').replace('//', '/')
    doc = open(f, encoding='utf-8').read()
    for sec in re.findall(r'<section class="ttp-cat[^"]*"[\s\S]*?</section>', doc):
        # every sentence in the section, table cells included
        text = html.unescape(re.sub(r'<[^>]+>', ' ', sec))
        text = re.sub(r'\s+', ' ', text)
        for sentence in re.split(r'(?<=[.!?])\s+(?=[A-Z(])', text):
            s = sentence.strip()
            if s and MARKERS.search(s):
                rows.append((route, s))

seen, out = set(), []
for route, s in rows:
    if (route, s) in seen:
        continue
    seen.add((route, s))
    out.append((route, s))

print(f"{len(out)} compliance / food-safety statements across "
      f"{len({r for r, _ in out})} pages\n")
cur = None
for route, s in out:
    if route != cur:
        cur = route
        print(f"\n### `{route}`\n")
    print(f"- {s}")
