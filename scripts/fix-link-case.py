#!/usr/bin/env python3
"""Point internal category links at the lowercase canonical path.

Vercel is case-sensitive; WordPress was not. Thirty internal links still use the
capitalised category paths that only worked under WordPress:

    /product-category/Custom-Paper-Tubes/       17 links
    /product-category/Custom-Cardboard-Tubes/    7 links
    /product-category/Custom-Plastic-Tubes/      6 links

All three currently resolve because vercel.json rewrites them onto the
lowercase page, so they are not broken - but a rewrite serves one page at two
URLs, and every one of these links is on a product page pointing at a category
that already has its own canonical lowercase URL. The rewrites are left in
place: they catch inbound links from outside the site, which is what they are
for.

The paginated variant has no such cover. /product-category/Custom-Paper-Tubes/page/2/
returns 404 on production and has 6 impressions in the GSC export. It is not
touched here - creating a redirect needs the Stage 2.5 decision about whether
that page should exist at all.

Usage: python3 scripts/fix-link-case.py [--check]
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / "src" / "data" / "pages.json"
CHROME = ROOT / "src" / "data" / "chrome.json"

PATHS = [
    "/product-category/Custom-Paper-Tubes/",
    "/product-category/Custom-Cardboard-Tubes/",
    "/product-category/Custom-Plastic-Tubes/",
]
FIELDS = ("head", "content", "bodyOpen", "bodyTail")


def main():
    check = "--check" in sys.argv
    pages = json.loads(PAGES.read_text())
    chrome = json.loads(CHROME.read_text())

    total = {p: 0 for p in PATHS}
    touched = set()

    for slug, page in pages.items():
        for field in FIELDS:
            text = page.get(field)
            if not text:
                continue
            before = text
            for p in PATHS:
                n = text.count(p)
                if n:
                    total[p] += n
                    text = text.replace(p, p.lower())
            if text != before:
                page[field] = text
                touched.add(page["route"])

    # the shared header and drawer are rendered by index-based token replacement;
    # a same-length swap keeps every index intact
    for region, text in chrome.items():
        for p in PATHS:
            n = text.count(p)
            if n:
                total[p] += n
                text = text.replace(p, p.lower())
        chrome[region] = text

    for p, n in total.items():
        print(f"  {n:4} link(s)  {p}  ->  {p.lower()}")
    print(f"\n  pages touched: {len(touched)}")

    if check:
        print("--check: nothing written")
        return 0
    PAGES.write_text(json.dumps(pages, ensure_ascii=False))
    CHROME.write_text(json.dumps(chrome, ensure_ascii=False))
    print("written")
    return 0


if __name__ == "__main__":
    sys.exit(main())
