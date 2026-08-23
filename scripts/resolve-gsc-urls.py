#!/usr/bin/env python3
"""Resolve every GSC URL against the build and the Vercel routing rules.

Vercel's Attack Challenge Mode answered all 250 live probes with 403 +
x-vercel-mitigated: challenge, so a live status for the full set could not be
obtained from this network. This resolves each URL the way the host will:
redirects first, then rewrites, then the file on disk - matching case exactly,
because macOS will happily open a file whose case does not match.

The result is tagged [inferred] everywhere it is used. It is not a live check.

Usage: python3 scripts/resolve-gsc-urls.py
"""
import csv
import json
import pathlib
import re
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
SITE = "https://thetubepackaging.com"

cfg = json.loads((ROOT / "vercel.json").read_text())
REDIRECTS = [(r["source"], r["destination"]) for r in cfg.get("redirects", [])
             if not r.get("has")]
REWRITES = [(r["source"], r["destination"]) for r in cfg.get("rewrites", [])]


def exists(path):
    """Case-exact existence check for a URL path inside dist/."""
    p = urllib.parse.unquote(path).lstrip("/")
    if not p:
        p = "index.html"
    f = DIST / p
    if f.is_dir():
        f = f / "index.html"
    elif not f.suffix:
        f = DIST / p.rstrip("/") / "index.html"
    if not f.exists():
        return False
    # walk up confirming each component's exact case
    cur = DIST
    for part in f.relative_to(DIST).parts:
        names = {x.name for x in cur.iterdir()} if cur.is_dir() else set()
        if part not in names:
            return False
        cur = cur / part
    return True


def resolve(url):
    path = urllib.parse.urlparse(url).path
    for src, dest in REDIRECTS:
        if src == path or src == path.rstrip("/"):
            return "301", dest
    for src, dest in REWRITES:
        if src == path:
            return ("200" if exists(dest) else "404"), dest
    return ("200" if exists(path) else "404"), ""


rows = list(csv.DictReader(open(ROOT / "data/gsc/pages.csv")))
out = []
for r in rows:
    url = r["Top pages"].strip()
    status, target = resolve(url)
    out.append({
        "url": url,
        "status_live": "challenged",
        "status_inferred": status,
        "redirect_target": target,
        "gsc_clicks": round(float(r["Clicks"])),
        "gsc_impressions": round(float(r["Impressions"])),
    })

out.sort(key=lambda r: (
    not (r["status_inferred"] != "200" and r["gsc_clicks"] > 0),
    r["status_inferred"] == "200",
    -r["gsc_impressions"],
))

dest = ROOT / "reports" / "status-sweep.csv"
with dest.open("w", newline="", encoding="utf-8") as fh:
    w = csv.DictWriter(fh, fieldnames=list(out[0].keys()))
    w.writeheader()
    w.writerows(out)

bad = [r for r in out if r["status_inferred"] != "200"]
reg = [r for r in bad if r["gsc_clicks"] > 0]
print(f"rows: {len(out)}")
print(f"inferred non-200: {len(bad)}")
print(f"REGRESSIONS (had clicks, now non-200): {len(reg)}")
for r in reg:
    print(f'  {r["status_inferred"]}  {r["url"]}  clicks={r["gsc_clicks"]} impr={r["gsc_impressions"]}')
print("\nnon-200 with impressions but no clicks (top 12 by impressions):")
for r in [x for x in bad if x["gsc_clicks"] == 0][:12]:
    print(f'  {r["status_inferred"]}  {r["url"].replace(SITE,"")}  impr={r["gsc_impressions"]}')
