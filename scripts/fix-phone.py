#!/usr/bin/env python3
"""Correct the wrong phone number.

The owner has confirmed (503) 358-0443 as the correct number. (503) 381-6437 is
wrong and appears on six pages -- one more than the work order listed, and in
both the tel: href and the visible text, so a visitor reads the wrong number
and dialling it calls the wrong line:

    /about-us/  /contact-us/  /privacy-policy/
    /refund_returns/  /shipping-policy/  /terms-conditions/

Checked and clean: no schema carries a telephone property anywhere on the site,
and the WhatsApp/Joinchat widget is configured with 15033580443, which is the
correct number.

Usage: python3 scripts/fix-phone.py [--check]
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / "src" / "data" / "pages.json"
CHROME = ROOT / "src" / "data" / "chrome.json"

SWAPS = [
    ("tel:(503)%20381-6437", "tel:(503)%20358-0443"),
    ("(503) 381-6437", "(503) 358-0443"),
    ("tel:+15033816437", "tel:+15033580443"),
    ("503-381-6437", "503-358-0443"),
]


def main():
    check = "--check" in sys.argv
    pages = json.loads(PAGES.read_text())
    chrome = json.loads(CHROME.read_text())
    total = 0
    touched = []

    for slug, page in sorted(pages.items()):
        n = 0
        for field in ("head", "content", "bodyTail"):
            text = page.get(field)
            if not text:
                continue
            for old, new in SWAPS:
                k = text.count(old)
                if k:
                    text = text.replace(old, new)
                    n += k
            page[field] = text
        if n:
            total += n
            touched.append((page["route"], n))

    for region, text in chrome.items():
        n = 0
        for old, new in SWAPS:
            k = text.count(old)
            if k:
                text = text.replace(old, new)
                n += k
        if n:
            chrome[region] = text
            total += n
            touched.append((f"chrome:{region}", n))

    for route, n in touched:
        print(f"  {n:3}x  {route}")
    print(f"\n  {total} occurrence(s) corrected on {len(touched)} location(s)")

    if check:
        print("--check: nothing written")
        return 0
    PAGES.write_text(json.dumps(pages, ensure_ascii=False))
    CHROME.write_text(json.dumps(chrome, ensure_ascii=False))
    print("written")
    return 0


if __name__ == "__main__":
    sys.exit(main())
