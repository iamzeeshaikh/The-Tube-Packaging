#!/usr/bin/env python3
"""Roll the confirmed MOQ policy across the site.

The owner has confirmed: standard minimum 500 pieces, smaller runs down to
around 100 pieces at a higher per-piece cost. Every conflicting statement is
brought into line with that, and every product page gets the same answer.

Two things this deliberately does NOT do:

  - it never touches a price figure, anywhere, for any reason
  - it never invents an MOQ number beyond the confirmed 500 / ~100

Auditing found the FAQ situation is not what a spot check suggests. Only 8 of
35 product pages ask a genuine minimum-order question; a further 8 ask an
adjacent quantity question (bulk delivery speed, samples, wholesale pricing)
that is not about MOQ at all; and 19 pages never mention it. So this both
rewrites existing answers and adds the question where it is missing.

Insertion method, chosen after an earlier regex fix in this repo emitted
unbalanced </div>s and broke a page layout: the new Q&A is placed after the
last Q&A pair in the run that opens the FAQ panel, found by walking
<h3>..</h3><p>..</p> pairs forward from the panel's opening tag. Nothing has to
locate the panel's closing tag, so nothing can unbalance it.

Usage: python3 scripts/moq-rollout.py [--check]
"""
import argparse
import html
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / "src" / "data" / "pages.json"
CHROME = ROOT / "src" / "data" / "chrome.json"

MOQ_Q = "What is the minimum order quantity?"
MOQ_A = (
    "Our standard minimum is 500 pieces. We can produce smaller runs — from "
    "around 100 pieces — at a higher per-piece cost, since setup and printing "
    "are fixed regardless of quantity. Per-piece cost drops significantly as "
    "quantity increases. Share your size, material, printing and quantity and "
    "we'll send a quote."
)

# Questions that genuinely ask about minimum order quantity. Deliberately
# narrow: "How fast can bulk orders arrive" and "Can I order samples" are
# quantity-adjacent but are not this question, and keep their own answers.
IS_MOQ_Q = re.compile(
    r"(?i)\b(?:minimum\s+(?:order\s+)?(?:quantity|quantities|order|requirement)|moq)\b"
    r"|(?i)can i order .{0,30}(?:small (?:quantities|runs)|in small runs)"
)

FAQ_PANEL = re.compile(
    r'<div class="woocommerce-Tabs-panel[^"]*"[^>]*id="tab-faqs_tab"[^>]*>'
)
# one Q&A pair, allowing the list/table blocks some answers carry after them
PAIR = re.compile(
    r"\s*<h3[^>]*>(?P<q>.*?)</h3>\s*(?:<p[^>]*>\s*</p>\s*)*<p[^>]*>(?P<a>.*?)</p>"
    r"(?P<extra>(?:\s*<(?:ul|ol|table)[^>]*>.*?</(?:ul|ol|table)>)*)",
    re.S,
)

# Site-wide claims that contradict the confirmed policy.
# (regex, replacement, note) - applied to the stored HTML, so each pattern is
# anchored on text that only appears in the claim it targets.
REPLACEMENTS = [
    (r"custom tube packaging without strict minimum order quantities\. This approach allows startups to order smaller runs while enabling established brands to scale production efficiently\.",
     "custom tube packaging with a 500-piece standard minimum. Smaller runs are "
     "possible at a higher per-piece cost, which lets startups test a design "
     "while established brands scale production efficiently.",
     "home body copy"),
    (r"No Minimum Order Requirement: Flexible quantities support both small businesses and large-scale operations\.",
     "500-Piece Standard Minimum: smaller trial runs are available on request, "
     "so both small businesses and large-scale operations are supported.",
     "home Why Choose Us"),
    (r"No Strict Minimum Orders",
     "500-Piece Standard Minimum", "home trust block"),
    (r"Low minimums and custom sizes",
     "500-piece standard minimum, smaller runs on request", "home quote CTA list"),
    (r"No MOQ", "500 pcs", "home stats bar"),
    (r"No strict minimum order quantity",
     "500-piece standard minimum", "home hero points"),
    (r"we provide the option for custom tube packaging no minimum order",
     "we can quote custom tube packaging below the 500-piece standard minimum",
     "home FAQ"),
    (r"Custom shipping tubes no minimum options help brands test new sizes",
     "Smaller runs below the 500-piece standard minimum help brands test new sizes",
     "/product/custom-shipping-tubes/ body"),
]


def faq_pairs(content):
    """(panel_end, [(start, end, question)]) for the run of Q&A that opens the panel."""
    m = FAQ_PANEL.search(content)
    if not m:
        return None, []
    # Seven pages have ChatGPT's own interface markup pasted into the panel
    # before the questions, so the walk starts at the first <h3> rather than at
    # the panel's opening tag.
    first_h3 = content.find("<h3", m.end())
    if first_h3 == -1:
        return None, []
    pos = first_h3
    pairs = []
    while True:
        p = PAIR.match(content, pos)
        if not p:
            break
        q = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", p.group("q")))).strip()
        pairs.append((p.start(), p.end(), q))
        pos = p.end()
    return pos, pairs


def qa_html(indent="\n"):
    return f"{indent}<h3>{MOQ_Q}</h3>{indent}<p>{MOQ_A}</p>"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    pages = json.loads(PAGES.read_text())
    chrome = json.loads(CHROME.read_text())
    replaced, added, skipped, notes = 0, 0, [], []

    for slug, page in sorted(pages.items()):
        route = page.get("route", "")
        if not route.startswith("/product/"):
            continue
        content = page["content"]
        end, pairs = faq_pairs(content)
        if not pairs:
            skipped.append(f"{route}: no FAQ pairs found")
            continue

        hit = next((p for p in pairs if IS_MOQ_Q.search(p[2])), None)
        if hit:
            start, stop, q = hit
            content = content[:start] + qa_html() + content[stop:]
            replaced += 1
            notes.append(f"  rewrote  {route:44} was: {q[:52]}")
        else:
            content = content[:end] + qa_html() + content[end:]
            added += 1
            notes.append(f"  added    {route:44} after: {pairs[-1][2][:46]}")
        page["content"] = content

    # site-wide claim sweep
    swept = []
    for pattern, repl, where in REPLACEMENTS:
        n = 0
        for slug, page in pages.items():
            for field in ("content", "head"):
                text = page.get(field)
                if not text:
                    continue
                text, k = re.subn(pattern, repl, text)
                if k:
                    page[field] = text
                    n += k
        for region, text in chrome.items():
            text, k = re.subn(pattern, repl, text)
            if k:
                chrome[region] = text
                n += k
        swept.append((where, pattern[:46], n))

    for line in notes:
        print(line)
    print(f"\n  MOQ FAQ rewritten : {replaced}")
    print(f"  MOQ FAQ added     : {added}")
    print(f"  pages skipped     : {len(skipped)}")
    for s in skipped:
        print(f"      ! {s}")
    print("\n  claim sweep:")
    for where, pat, n in swept:
        flag = " " if n else "!"
        print(f"    {flag} {n:3}x  {where:34} {pat}")

    if args.check:
        print("\n--check: nothing written")
        return 0
    PAGES.write_text(json.dumps(pages, ensure_ascii=False))
    CHROME.write_text(json.dumps(chrome, ensure_ascii=False))
    print("\nwritten")
    return 0


if __name__ == "__main__":
    sys.exit(main())
