#!/usr/bin/env python3
"""Make every quote form say which page it was sent from.

All 70 product quote forms - two per product page across 35 products - ship the
same hidden fields:

    referer_title = "Paper Lip Balm Tubes Wholesale | The Tube Packaging"
    queried_id    = 96          (the lip balm product's WooCommerce ID)

So every quote from every product page is attributed to the lip balm page. The
work order reported the value as "Tea Paper Tubes"; on the current production
build it is the lip balm title. Same defect, different stale value.

Scope note, because the first pass here got it wrong. api/form.js builds the
notification's "Sent from" line as `fields.page_url || fields.referer_title`,
and `page_url` appears nowhere in the static HTML - which looked like the line
was falling through to the wrong title. It is not: public/assets/ttp.js appends
`page_url` from `location.href` to the FormData at submit time, so the "Sent
from" line is already correct.

Adding a hidden page_url input would have made it *worse*: parseMultipart in
api/form.js turns a repeated field into an array, so the email would have read
"Sent from https://...,https://...". That idea was dropped.

What is genuinely wrong is the attribution carried in the payload itself:

  referer_title  -> that page's own <title>
  queried_id     -> that page's own product ID (schema sku, which equals the
                    WooCommerce ID used by its add-to-cart link)

Hidden inputs only. No visible field, label, order or styling is touched.

Usage: python3 scripts/fix-form-attribution.py [--check]
"""
import argparse
import html
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / "src" / "data" / "pages.json"

REFERER = re.compile(r'(<input type="hidden" name="referer_title" value=")([^"]*)(")')
QUERIED = re.compile(r'(<input type="hidden" name="queried_id" value=")([^"]*)(")')


def page_title(head):
    m = re.search(r"<title>(.*?)</title>", head, re.S)
    return html.unescape(m.group(1)).strip() if m else ""


def product_id(page):
    """The page's own WooCommerce product ID, from its Product schema sku.

    Deliberately no add-to-cart fallback: related-product tiles and the home
    page's product grid carry other products' add-to-cart IDs, so that fallback
    would have rewritten the home page's queried_id from 41 to 184.
    """
    if not page.get("route", "").startswith("/product/"):
        return None
    m = re.search(r'"sku":"(\d+)"', page.get("head", ""))
    return m.group(1) if m else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    pages = json.loads(PAGES.read_text())
    stats = {"referer": 0, "queried": 0, "pages": 0}
    problems = []

    for slug, page in sorted(pages.items()):
        content = page.get("content") or ""
        if "name=\"referer_title\"" not in content:
            continue
        before = content

        title = page_title(page.get("head", ""))
        if not title:
            problems.append(f"{slug}: no <title> to attribute the form to")
            continue
        esc_title = html.escape(title, quote=True)

        content, n = REFERER.subn(lambda m: m.group(1) + esc_title + m.group(3), content)
        stats["referer"] += n

        pid = product_id(page)
        if pid:
            content, q = QUERIED.subn(lambda m: m.group(1) + pid + m.group(3), content)
            stats["queried"] += q

        if content != before:
            page["content"] = content
            stats["pages"] += 1
            if slug.startswith("product__"):
                print(f'  {page["route"]:44} -> "{title[:44]}" id={pid}')

    if problems:
        for p in problems:
            print("  !", p, file=sys.stderr)
        return 1

    print(f'\n  pages changed        : {stats["pages"]}')
    print(f'  referer_title set    : {stats["referer"]}')
    print(f'  queried_id set       : {stats["queried"]}')

    if args.check:
        print("\n--check: nothing written")
        return 0
    PAGES.write_text(json.dumps(pages, ensure_ascii=False))
    print("\nwritten to src/data/pages.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
