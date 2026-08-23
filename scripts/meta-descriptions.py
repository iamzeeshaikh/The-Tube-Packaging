#!/usr/bin/env python3
"""Add the missing meta descriptions to the category pages and /shop/.

These six pages carry 55,489 impressions between them at positions 10-24 and
ship no meta description at all, so Google is writing their snippets. They are
also the only pages on the site where a description is missing *and* the
impression base is large enough to read a CTR change from.

Descriptions only. No title, H1, body, canonical, schema or price change - the
point is to be able to attribute any CTR movement to the snippet and nothing
else.

Wording rules applied:
  - lead with the phrase the GSC query export shows buyers actually typing
  - name products that genuinely sit in that category
  - carry the owner-confirmed 500-piece standard minimum, varied in phrasing so
    six pages don't ship one templated tail
  - no price figure anywhere, and no claim the owner has not confirmed

Usage: python3 scripts/meta-descriptions.py [--check]
"""
import argparse
import html
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / "src" / "data" / "pages.json"

DESCRIPTIONS = {
    # 13,194 impressions, position 11.67. Query language: "cardboard tube
    # packaging", "cardboard tubes", "large cardboard tubes", "industrial".
    "product-category__custom-cardboard-tubes":
        "Custom cardboard tubes in round, large and industrial sizes. Rigid "
        "walls that hold shape in transit, printed to your artwork. 500-piece "
        "standard minimum.",

    # 11,585 impressions, position 10.54. Query language: "mailing tubes",
    # "poster mailing tubes", "shipping tubes", "mailing tubes for posters".
    "product-category__mailing-tubes":
        "Mailing and shipping tubes for posters, prints, artwork and rolled "
        "documents. Kraft, cylinder and poster sizes, custom printed. Standard "
        "minimum 500 pieces.",

    # 10,020 impressions, position 10.04. Query language: "paper tube
    # packaging", "custom paper tubes", "kraft tube packaging".
    "product-category__custom-paper-tubes":
        "Custom paper tubes for cosmetics, candles, deodorant, tea and gifts. "
        "Kraft or white board, full-wrap printing, 16 styles. 500-piece "
        "standard minimum.",

    # 7,125 impressions, position 13.05. Query language: "luxury tube"
    # (position 4.91), "tube food packaging", "luxury tube packaging".
    "product-category__specialty-tubes":
        "Luxury, lipstick and food tube packaging built for shelf presence. "
        "Rigid walls, matte or gloss finishes, printed to your brand. Trial "
        "runs on request.",

    # 2,834 impressions, position 23.64. Query language: "lotion tubes",
    # "empty lipgloss tubes", "cosmetic squeeze tubes", "plastic tube packaging".
    "product-category__custom-plastic-tubes":
        "Plastic squeeze tubes for lotion, lipgloss, lipstick and skincare. "
        "Empty or fully printed, moisture-resistant, six styles. 500-piece "
        "standard minimum.",

    # 10,731 impressions, position 12.34.
    "shop":
        "Browse every custom tube packaging product: paper, cardboard, kraft, "
        "mailing and plastic tubes, printed to your artwork. 500-piece standard "
        "minimum.",
}

TITLE_END = "</title>"
HAS_DESC = re.compile(r'<meta name="description"', re.I)
LIMIT = 158


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="report only, write nothing")
    args = ap.parse_args()

    pages = json.loads(PAGES.read_text())
    changed = 0
    problems = []

    for slug, text in DESCRIPTIONS.items():
        page = pages.get(slug)
        if page is None:
            problems.append(f"{slug}: not in pages.json")
            continue
        head = page["head"]
        if HAS_DESC.search(head):
            print(f"  = {page['route']:46} already has a description")
            continue
        if TITLE_END not in head:
            problems.append(f"{slug}: no </title> in head")
            continue
        # Google truncates the snippet around 155-160 characters; a description
        # that gets cut mid-sentence reads worse than none at all
        if len(text) > LIMIT:
            problems.append(f"{slug}: description is {len(text)} chars, limit {LIMIT}")
            continue
        # Yoast's own layout: description on the line straight after the title
        tag = f'\n\t<meta name="description" content="{html.escape(text, quote=True)}" />'
        page["head"] = head.replace(TITLE_END, TITLE_END + tag, 1)
        changed += 1
        print(f"  + {page['route']:46} {len(text)} chars")

    if problems:
        for p in problems:
            print(f"  ! {p}", file=sys.stderr)
        return 1

    if args.check:
        print(f"\n--check: {changed} page(s) would change, nothing written")
        return 0

    PAGES.write_text(json.dumps(pages, ensure_ascii=False))
    print(f"\nwrote {changed} description(s) to src/data/pages.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
