#!/usr/bin/env python3
"""Point the home page's og:image at an image that exists, over https.

The tag referenced ChatGPT-Image-Feb-24-2026-09_27_44-AM.png, which was deleted
from the WordPress media library before the migration - it 404s on the old site
too. It was also declared over http:// while the canonical is https://, the only
http:// self-reference left in any page head.

It is replaced with the home page's actual hero image, which is already in the
project: banner.jpg, 1920x765, comfortably over the 1200x630 minimum. No image
was generated.

Usage: python3 scripts/fix-og-image.py [--check]
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / "src" / "data" / "pages.json"

OLD = ("http://thetubepackaging.com/wp-content/uploads/2026/02/"
       "ChatGPT-Image-Feb-24-2026-09_27_44-AM.png")
NEW = "https://thetubepackaging.com/wp-content/uploads/2024/07/banner.jpg"


def main():
    check = "--check" in sys.argv
    pages = json.loads(PAGES.read_text())
    head = pages["__home"]["head"]
    n = head.count(OLD)
    if n == 0:
        print("already applied")
        return 0
    if n != 1:
        print(f"expected 1 occurrence, found {n}", file=sys.stderr)
        return 1
    pages["__home"]["head"] = head.replace(OLD, NEW)
    print(f"og:image -> {NEW}")
    if check:
        print("--check: nothing written")
        return 0
    PAGES.write_text(json.dumps(pages, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
