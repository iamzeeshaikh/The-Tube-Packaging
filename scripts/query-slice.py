#!/usr/bin/env python3
"""Slice the GSC query export by regex, so page copy is written against real
demand rather than from memory. Every figure printed here is [export]."""
import csv, re, sys
rows = list(csv.DictReader(open('data/gsc/queries.csv')))
pat = re.compile(sys.argv[1], re.I)
excl = re.compile(sys.argv[2], re.I) if len(sys.argv) > 2 and sys.argv[2] else None
sel = [r for r in rows if pat.search(r['Top queries']) and not (excl and excl.search(r['Top queries']))]
sel.sort(key=lambda r: -float(r['Impressions']))
c = sum(float(r['Clicks']) for r in sel)
i = sum(float(r['Impressions']) for r in sel)
wp = sum(float(r['Position']) * float(r['Impressions']) for r in sel) / i if i else 0
print(f"{len(sel)} queries | {c:.0f} clicks | {i:.0f} impressions | "
      f"{c/i*100 if i else 0:.2f}% CTR | weighted position {wp:.1f}\n")
for r in sel[:int(sys.argv[3]) if len(sys.argv) > 3 else 45]:
    print(f"{r['Top queries'][:52]:54} {float(r['Clicks']):5.0f} {float(r['Impressions']):8.0f} "
          f"{float(r['CTR'])*100:6.2f}% {float(r['Position']):6.2f}")
