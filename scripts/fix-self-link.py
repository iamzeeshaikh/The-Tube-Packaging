#!/usr/bin/env python3
"""Unwrap the one self-referential product link.

/product/cardboard-tube-packaging/ contains:

    <a href="https://thetubepackaging.com/"><strong>Cardboard Tube Packaging</strong></a>

The anchor names the page the reader is already on, and sends them to the home
page instead. The link is removed and the words kept, which is the only
unambiguous fix - re-pointing it at the current URL would just be a self-link.

Two related cases are reported but deliberately not changed, because the anchor
naming a product while the link goes to the home page may be intentional:

    /product/kraft-paper-tubes/     "cardboard tube packaging" -> /
    /product/round-cardboard-tubes/ "cardboard tube packaging" -> /

Usage: python3 scripts/fix-self-link.py [--check]
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / "src" / "data" / "pages.json"

SLUG = "product__cardboard-tube-packaging"
OLD = '<a href="https://thetubepackaging.com/"><strong>Cardboard Tube Packaging</strong></a>'
NEW = "<strong>Cardboard Tube Packaging</strong>"


def main():
    check = "--check" in sys.argv
    pages = json.loads(PAGES.read_text())
    content = pages[SLUG]["content"]
    n = content.count(OLD)
    if n == 0:
        print("already applied")
        return 0
    if n != 1:
        print(f"expected 1 occurrence, found {n}", file=sys.stderr)
        return 1
    pages[SLUG]["content"] = content.replace(OLD, NEW)
    print(f"  unwrapped self-link on /product/cardboard-tube-packaging/")
    if check:
        print("--check: nothing written")
        return 0
    PAGES.write_text(json.dumps(pages, ensure_ascii=False))
    print("written")
    return 0


if __name__ == "__main__":
    sys.exit(main())
