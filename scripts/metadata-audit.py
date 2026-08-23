#!/usr/bin/env python3
"""Find product pages whose metadata describes a different product.

The migration carried each page's <head> across verbatim, so a title that was
attached to the wrong product in WordPress is still attached to the wrong
product here. `/product/cardboard-tube-packaging/` ships the title "Custom
Candle Tube Packaging Boxes for Luxury Brands" and candle FAQs; it sits at
position 10 on 45,095 impressions with 0.26% CTR.

Detection follows the work order: flag any product page where the title, meta
description or FAQ block uses a product noun that appears in neither the H1 nor
the slug. Findings are graded, because the same rule catches two different
things:

  CRITICAL  foreign noun in <title> or og:title  - this is the SERP headline
  HIGH      foreign noun in the meta description - this is the SERP snippet
  REVIEW    foreign noun only in an FAQ or body  - often a legitimate use-case
            mention ("paper tubes for food"), so each needs an eye

Usage:
  python3 scripts/metadata-audit.py            # table to stdout
  python3 scripts/metadata-audit.py --md FILE  # write the markdown report
"""
import argparse
import html
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / "src" / "data" / "pages.json"

# the product vocabulary, taken from the site's own navigation
NOUNS = [
    "candle", "lotion", "lipgloss", "lipstick", "skincare", "cosmetic",
    "deodorant", "tea", "poster", "mailing", "shipping", "kraft", "toilet",
    "towel", "wrapping", "square", "round", "large", "small", "white",
    "black", "industrial", "luxury", "plastic", "food",
]

TAGS = re.compile(r"<[^>]+>")


def text(s):
    return html.unescape(TAGS.sub(" ", s or "")).replace("\xa0", " ")


def words(s):
    return set(re.findall(r"[a-z]+", (s or "").lower()))


def nouns_in(s):
    w = words(text(s))
    return [n for n in NOUNS if n in w]


def head_field(head, pattern):
    m = re.search(pattern, head or "", re.S | re.I)
    return html.unescape(m.group(1)).strip() if m else ""


def faq_text(content):
    """The FAQ question/answer text, from either the JSON-LD or the visible block."""
    out = []
    for m in re.finditer(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', content, re.S):
        try:
            data = json.loads(m.group(1))
        except Exception:
            continue
        stack = [data]
        while stack:
            node = stack.pop()
            if isinstance(node, list):
                stack.extend(node)
            elif isinstance(node, dict):
                if node.get("@type") == "Question":
                    out.append(node.get("name", ""))
                    ans = node.get("acceptedAnswer") or {}
                    out.append(ans.get("text", "") if isinstance(ans, dict) else "")
                stack.extend(v for v in node.values() if isinstance(v, (list, dict)))
    for m in re.finditer(r'class="tp-faq__(?:q|a)[^"]*"[^>]*>(.*?)</', content, re.S):
        out.append(m.group(1))
    return " ".join(out)


def audit():
    pages = json.loads(PAGES.read_text())
    findings = []
    for slug, page in sorted(pages.items()):
        route = page.get("route", "")
        if not route.startswith("/product/"):
            continue
        head = page.get("head", "")
        content = page.get("content", "")

        title = head_field(head, r"<title>(.*?)</title>")
        desc = head_field(head, r'<meta name="description" content="([^"]*)"')
        ogt = head_field(head, r'<meta property="og:title" content="([^"]*)"')
        ogd = head_field(head, r'<meta property="og:description" content="([^"]*)"')
        h1 = text(head_field(content, r"<h1[^>]*>(.*?)</h1>")).strip()

        own = words(h1) | words(route.replace("-", " ").replace("/", " "))
        own_nouns = {n for n in NOUNS if n in own}

        def foreign(s):
            return sorted(set(nouns_in(s)) - own_nouns)

        t_bad = foreign(title) + foreign(ogt)
        d_bad = foreign(desc) + foreign(ogd)
        f_bad = foreign(faq_text(content))

        if not (t_bad or d_bad or f_bad):
            continue
        findings.append({
            "route": route,
            "h1": h1,
            "title": title,
            "desc": desc,
            "title_foreign": sorted(set(t_bad)),
            "desc_foreign": sorted(set(d_bad)),
            "faq_foreign": sorted(set(f_bad)),
            "grade": "CRITICAL" if t_bad else ("HIGH" if d_bad else "REVIEW"),
        })
    return findings


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--md")
    args = ap.parse_args()

    findings = audit()
    order = {"CRITICAL": 0, "HIGH": 1, "REVIEW": 2}
    findings.sort(key=lambda f: (order[f["grade"]], f["route"]))

    counts = {g: sum(1 for f in findings if f["grade"] == g) for g in order}
    for f in findings:
        print(f'{f["grade"]:9} {f["route"]:46} title={f["title_foreign"]} '
              f'desc={f["desc_foreign"]} faq={f["faq_foreign"]}')
    print(f'\nCRITICAL {counts["CRITICAL"]}  HIGH {counts["HIGH"]}  REVIEW {counts["REVIEW"]}')

    if args.md:
        lines = [
            "| Grade | URL | H1 | Title | Foreign nouns (title / desc / faq) |",
            "|---|---|---|---|---|",
        ]
        for f in findings:
            lines.append(
                f'| {f["grade"]} | `{f["route"]}` | {f["h1"]} | {f["title"]} | '
                f'{", ".join(f["title_foreign"]) or "—"} / '
                f'{", ".join(f["desc_foreign"]) or "—"} / '
                f'{", ".join(f["faq_foreign"]) or "—"} |'
            )
        pathlib.Path(args.md).write_text("\n".join(lines) + "\n")
        print(f"wrote {args.md}")

    return 1 if counts["CRITICAL"] else 0


if __name__ == "__main__":
    sys.exit(main())
