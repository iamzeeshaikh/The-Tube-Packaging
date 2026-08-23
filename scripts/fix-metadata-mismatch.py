#!/usr/bin/env python3
"""Fix the product pages carrying another product's metadata.

Two pages ship metadata written for a different product. The body copy on both
is correct - only the head, and on one page the FAQ block, describe the wrong
thing.

  /product/cardboard-tube-packaging/
      title, description, og:title and og:description are a byte-identical copy
      of /product/candle-tube-packaging/, and six of its fifteen FAQs are about
      candles. It sits at position 10.05 on 45,095 impressions with 0.26% CTR,
      showing a candle headline for cardboard tube queries.

  /product/custom-shipping-tubes/
      title, description, og:title and og:description describe Lotion Tubes.
      No other page carries that title, so it is an orphan rather than a swap -
      nothing needs swapping back. Its FAQs are correct and are left alone.

`scripts/metadata-audit.py` flags 25 pages by the noun rule in the work order.
Reading each one, only these two are genuinely wrong: the other 23 are
legitimate adjective or use-case language ("Luxury Black Paper Candle Tubes",
"Cylinder Mailing Tubes ... Secure Shipping", "paper tubes ... for food"). The
objective signal that separates them is the duplicate-title check, which
returns exactly one collision.

The same wrong description also sits in each page's Yoast JSON-LD, on the
Product node's `description` and on the mirrored Review node. That one matters
beyond the SERP: the Product node's name is "Cardboard Tube Packaging" while
its description sold candles, and the Merchant feed for that item is already
correct ("Cardboard Tube Packaging", correct body copy). Bringing the page
schema in line with the feed reduces mismatch risk rather than creating it.
Only `description` is touched -- name, sku, offers, price, availability,
aggregateRating, brand and images are all left exactly as they are.

Only candle framing is rewritten in the FAQs. Every factual claim - materials,
lid options, finishes, printing methods, turnaround wording - is carried across
verbatim, so this fix invents nothing. Nine FAQs are already product-neutral
and are not touched at all.

Usage: python3 scripts/fix-metadata-mismatch.py [--check]
"""
import argparse
import html
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / "src" / "data" / "pages.json"

META = {
    "product__cardboard-tube-packaging": {
        "title": "Custom Cardboard Tube Packaging for Rolled & Fragile Goods",
        "description": (
            "Rigid cardboard tube packaging for posters, prints, textiles and rolled "
            "goods. Spiral-wound walls, gloss, matte or Spot UV printing, custom sizes."
        ),
    },
    "product__custom-shipping-tubes": {
        "title": "Custom Shipping Tubes | Printed Tubes for Safe Transit",
        "description": (
            "Custom shipping tubes with multi-layer spiral-wound walls that resist "
            "bending and crushing. Metal, plastic or paper end caps, printed to your artwork."
        ),
    },
}

# (candle wording -> cardboard wording). Only the six FAQs that name candles.
FAQ_REWRITES = [
    (
        "What is the core material used to make the candle tubes?",
        "What is the core material used to make the tubes?",
        "The core is made from sturdy, spiral-wound paperboard. This construction delivers high crush resistance to protect the fragile candle inside.",
        "The core is made from sturdy, spiral-wound paperboard. This construction delivers high crush resistance to protect the product inside.",
    ),
    (
        "Are these tubes suitable for shipping candles purchased online?",
        "Are these tubes suitable for shipping products purchased online?",
        "Yes. The rigid walls and optional inserts make the tubes reliable for e-commerce shipping and help prevent breakage during transit and handling.",
        "Yes. The rigid walls and optional inserts make the tubes reliable for e-commerce shipping and help prevent damage during transit and handling.",
    ),
    (
        "Can I order tubes specifically sized for my candle jars?",
        "Can I order tubes specifically sized for my product?",
        "Yes. The inner diameter and height can be customized to match your candle containers, whether they are glass, ceramic, or metal.",
        "Yes. The inner diameter and height can be customized to match what goes inside, whether that is a rolled print, a textile or a boxed item.",
    ),
    (
        "Is there a way to secure the candle inside the tube to stop it from moving?",
        "Is there a way to secure the contents inside the tube to stop them moving?",
        "Yes. Custom foam or cardboard inserts can be added to hold the candle firmly in place and minimize impact during shipping.",
        "Yes. Custom foam or cardboard inserts can be added to hold the contents firmly in place and minimize impact during shipping.",
    ),
    (
        "Can the tube accommodate pillar candles without a container?",
        "Can the tube hold unwrapped items without an inner container?",
        "Yes. A protective interior lining or coating can be added to keep the wax surface safe when packaging standalone pillar candles.",
        "Yes. A protective interior lining or coating can be added to keep the surface of an unwrapped item safe inside the tube.",
    ),
    (
        "Can I print special instructions or warnings on the inside of the tube?",
        "Can I print special instructions or warnings on the inside of the tube?",
        "Yes. Internal printing is available for candle care instructions, safety details, or branding elements.",
        "Yes. Internal printing is available for care instructions, handling details, or branding elements.",
    ),
]

LD_BLOCK = re.compile(r'(<script type="application/ld\+json"[^>]*>)(.*?)(</script>)', re.S)
DESC_VALUE = re.compile(r'"description":"((?:[^"\\]|\\.)*)"')

# the wrong descriptions, exactly as they sit in the JSON-LD today
OLD_SCHEMA_DESC = {
    "product__cardboard-tube-packaging":
        "Durable custom Candle Tube Packaging for glass and pillar candles. Full "
        "print customization, foil stamp options, free design, and fast delivery.",
    "product__custom-shipping-tubes":
        "Durable custom Lotion Tubes for creams &amp; gels. Choose sustainable PCR "
        "plastic, any size, &amp; cap style (pump/flip-top). Free design support "
        "&amp; fast delivery.",
}


def set_schema_description(head, problems, slug, new_desc):
    """Swap the wrong description inside the JSON-LD, and nothing else.

    The block is edited as text rather than re-serialised, so every other field
    keeps its exact bytes -- re-dumping the graph would reformat price,
    availability and the rating even though their values were never touched.

    Each `"description":"..."` value is decoded before comparing, because Yoast
    writes the same sentence two different ways in one document: the Product
    node HTML-escapes the ampersand and the Review node does not, and both
    escape the slash in "pump/flip-top". Matching raw text would silently miss
    one of them.
    """
    old = OLD_SCHEMA_DESC.get(slug)
    if not old:
        return head
    m = LD_BLOCK.search(head)
    if not m:
        problems.append(f"{slug}: no ld+json block in head")
        return head

    want = html.unescape(old)
    hits = [0]

    def repl(dm):
        raw = dm.group(1)
        try:
            value = json.loads(f'"{raw}"')
        except ValueError:
            return dm.group(0)
        if html.unescape(value) != want:
            return dm.group(0)
        hits[0] += 1
        return '"description":' + json.dumps(new_desc)

    body = DESC_VALUE.sub(repl, m.group(2))
    if not hits[0]:
        problems.append(f"{slug}: schema description not found")
        return head
    print(f"    {slug}: {hits[0]} schema description(s) updated")
    return head[:m.start(2)] + body + head[m.end(2):]


TAGS = [
    ('<title>', '</title>', 'title'),
    ('<meta name="description" content="', '"', 'description'),
    ('<meta property="og:title" content="', '"', 'title'),
    ('<meta property="og:description" content="', '"', 'description'),
]


def set_head(head, problems, slug, values):
    for open_tag, close, key in TAGS:
        text = values[key]
        esc = html.escape(text, quote=True) if open_tag != '<title>' else html.escape(text)
        pat = re.escape(open_tag) + r'(.*?)' + re.escape(close)
        m = re.search(pat, head, re.S)
        if not m:
            problems.append(f"{slug}: no {open_tag!r} in head")
            continue
        head = head[:m.start(1)] + esc + head[m.end(1):]
    return head


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    pages = json.loads(PAGES.read_text())
    problems, changes = [], []

    for slug, values in META.items():
        page = pages.get(slug)
        if page is None:
            problems.append(f"{slug}: not in pages.json")
            continue
        before = page["head"]
        head = set_head(before, problems, slug, values)
        head = set_schema_description(head, problems, slug, values["description"])
        page["head"] = head
        if page["head"] != before:
            changes.append(f'{page["route"]}  head -> "{values["title"]}"')

    faq_page = pages.get("product__cardboard-tube-packaging")
    if faq_page:
        content = faq_page["content"]
        for old_q, new_q, old_a, new_a in FAQ_REWRITES:
            for old, new in ((old_q, new_q), (old_a, new_a)):
                if old == new:
                    continue
                if old not in content:
                    problems.append(f"FAQ text not found: {old[:60]}")
                    continue
                n = content.count(old)
                if n != 1:
                    problems.append(f"FAQ text appears {n}x, expected 1: {old[:50]}")
                    continue
                content = content.replace(old, new, 1)
        if content != faq_page["content"]:
            faq_page["content"] = content
            changes.append("/product/cardboard-tube-packaging/  6 candle FAQs re-framed")

    for c in changes:
        print("  +", c)
    for p in problems:
        print("  !", p, file=sys.stderr)
    if problems:
        return 1

    if args.check:
        print("\n--check: nothing written")
        return 0

    PAGES.write_text(json.dumps(pages, ensure_ascii=False))
    print(f"\nwrote {len(changes)} change(s) to src/data/pages.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
