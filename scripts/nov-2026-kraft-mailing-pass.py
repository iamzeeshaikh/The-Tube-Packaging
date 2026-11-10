#!/usr/bin/env python3
"""November 2026 ranking pass for /product/kraft-mailing-tubes/.

GSC, 28 days Oct 12 - Nov 8 against Sep 14 - Oct 11: the page fell from
position 9.7 to 13.0 (207 -> 142 clicks). The slide starts on 2026-10-16 and
no commit since mid-September touched the page, its title, its links or its
template. Almost all of the loss is head terms the page never really
answered: "shipping tubes" 9.4 -> 20.1 (25 -> 7 clicks), "shipping tube"
13.2 -> 26.9, "cardboard mailing tubes" 8.5 -> 18.0, "kraft mailing tubes"
7.0 -> 13.2, "mailing tubes" 12.0 -> 14.1. The copy said "shipping tubes"
almost nowhere and gave no actual sizes, and only one page linked to it from
its body text (everything else is random related-product grids).

This adds, without replacing anything (title and meta stay as they are):

  - a Description section on shipping in kraft tubes: sizes for common rolled
    items, wall choice, caps and carrier sizing (one link, to the size guide)
  - three FAQs in the existing FAQ tab (the schema reads them from the markup)
  - one contextual link in from /product/custom-shipping-tubes/,
    /product/poster-mailing-tubes/ and /product/large-cardboard-tubes/, each in
    a heading section that had no link yet

Idempotent: every insert checks for its own marker first.
Usage: python3 scripts/nov-2026-kraft-mailing-pass.py [--check]
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / "src" / "data" / "pages.json"
SITE = "https://thetubepackaging.com"
TARGET = f"{SITE}/product/kraft-mailing-tubes/"

SECTION = f"""
<h2>Kraft Shipping Tubes For Courier And Postal Delivery</h2>
<p>Most of the kraft tubes we make never sit on a shelf. They go out of a mailroom with a label on the side and come back to nobody, so the questions that matter are practical ones: how wide, how long, how thick the wall, and what keeps the ends on. As a starting point, a tube should be about 1 to 2 inches longer than the edge you roll along, which leaves room for the caps and a little give at each end. The diameter should let the roll slide in without forcing it but stop it from spinning loose. If a print set or a stack of drawings is thicker than you expect, go up a diameter rather than rolling tighter, because a tight roll is what puts curl and creases into paper. <a href="{SITE}/tube-size-guide/">Our full tube size guide</a> lists every standard diameter and length we run.</p>
<table>
<thead>
<tr>
<th><strong>What you are shipping</strong></th>
<th><strong>Inside diameter to ask for</strong></th>
<th><strong>Tube length to ask for</strong></th>
<th><strong>Wall</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>Letter size or A4 certificates, a few sheets</td>
<td>1.5″ to 2″</td>
<td>12″ to 13″</td>
<td>Standard</td>
</tr>
<tr>
<td>18″ x 24″ posters, rolled along the 18″ side</td>
<td>2″</td>
<td>19″ to 20″</td>
<td>Standard</td>
</tr>
<tr>
<td>24″ x 36″ posters, rolled along the 24″ side</td>
<td>2″ to 3″</td>
<td>25″ to 26″</td>
<td>Standard, thick for multi-packs</td>
</tr>
<tr>
<td>Architectural and engineering plan sets</td>
<td>3″ to 4″</td>
<td>Sheet width plus 1″ to 2″</td>
<td>Thick</td>
</tr>
<tr>
<td>Canvas prints, vinyl banners, fabric samples</td>
<td>3″ to 6″</td>
<td>Roll width plus 1″ to 2″, up to 48″</td>
<td>Thick</td>
</tr>
</tbody>
</table>
<h3>Choosing the wall for the trip</h3>
<p>A standard 1.0 to 1.5 mm kraft wall is enough for one or two posters sent by mail. Move to a thick 1.5 to 3.0 mm wall once the tube is wider than 3 inches, once it will travel with a courier that stacks parcels in cages, or once the roll is heavy enough to press on the wall from inside, like canvas or a full plan set. Thick walls cost more per tube, so there is no point paying for them on a single lightweight print.</p>
<h3>Caps, labels and carrier sizing</h3>
<p>Plastic push caps are the usual choice for mailing because they seat firmly and the receiver can pull them out by hand. Run a strip of tape across each cap if the tube is going overseas or into a sorting center, since that is where caps get knocked. The plain brown board takes a printed shipping label, a barcode or a handwritten address without smudging. Carriers such as USPS, UPS and FedEx price long parcels on size as well as weight, so a tube that is longer or wider than the roll needs costs more to send every time. Matching the length to the item is the cheapest saving in a tube program.</p>
<ul>
<li>Measure the edge you roll along, then add 1″ to 2″ for the length</li>
<li>Go up one diameter for multi-sheet sets instead of rolling tighter</li>
<li>Pick a thick wall for courier routes and anything over 3″ wide</li>
<li>Tape the caps on for international parcels</li>
<li>Check your carrier's size limits before you fix a length for bulk orders</li>
</ul>
"""
SECTION_MARK = "Kraft Shipping Tubes For Courier And Postal Delivery"
SECTION_ANCHOR = "for a clean and safe look.</p>"

FAQS = """<h3>16. What size shipping tube do I need for a 24 x 36 poster?</h3>
<p>Roll it along the 24 inch side and use a tube about 25 to 26 inches long with a 2 to 3 inch inside diameter. Use the larger diameter if you send several posters in one tube.</p>
<h3>17. When should I choose a thick-walled kraft shipping tube?</h3>
<p>Choose a thick 1.5 to 3.0 mm wall when the tube is wider than 3 inches, when a courier will handle it, or when the contents are heavy, such as canvas or a full set of plans. A standard wall is fine for one or two posters sent by mail.</p>
<h3>18. Can I order kraft mailing tubes in bulk in more than one size?</h3>
<p>Yes. List each diameter and length with the quantity you need when you ask for a custom quote, and we will quote each size so you can stock a small range for different prints.</p>
"""
FAQ_MARK = "What size shipping tube do I need for a 24 x 36 poster?"
FAQ_ANCHOR = "<h3>What is the minimum order quantity?</h3>"

INBOUND = {
    "product__custom-shipping-tubes": (
        "The print layout can stay minimal or expanded depending on your product line.</p>",
        "The print layout can stay minimal or expanded depending on your product line. "
        "If you only need a logo sticker and a shipping label, our "
        f"<a href=\"{TARGET}\">plain kraft mailing tubes</a> are the lower-cost route.</p>",
    ),
    "product__poster-mailing-tubes": (
        "and wholesale supply keeps costs low for bulk sending.</p>",
        "and wholesale supply keeps costs low for bulk sending. For unprinted mail-outs, "
        f"<a href=\"{TARGET}\">brown kraft shipping tubes with push caps</a> do the same job and "
        "show fewer scuffs than a white wrap.</p>",
    ),
    "product__large-cardboard-tubes": (
        "For heavy posters, thicker tube walls are recommended.</p>",
        "For heavy posters, thicker tube walls are recommended. If the tube is mainly for mailing "
        f"prints and documents, <a href=\"{TARGET}\">kraft mailing tubes sized for posters</a> are "
        "usually the better fit.</p>",
    ),
}


def description_tab(content):
    return content.split('id="tab-description"', 1)[-1].split('id="tab-specifications_tab"', 1)[0]


def main():
    check = "--check" in sys.argv
    pages = json.loads(PAGES.read_text())
    changes, problems = [], []

    page = pages["product__kraft-mailing-tubes"]
    c = page["content"]
    if SECTION_MARK not in c:
        if description_tab(c).count(SECTION_ANCHOR) != 1:
            problems.append(f"section anchor found {c.count(SECTION_ANCHOR)}x")
        else:
            c = c.replace(SECTION_ANCHOR, SECTION_ANCHOR + SECTION, 1)
            changes.append("target: shipping tubes section")
    if FAQ_MARK not in c:
        if c.count(FAQ_ANCHOR) != 1:
            problems.append(f"faq anchor found {c.count(FAQ_ANCHOR)}x")
        else:
            c = c.replace(FAQ_ANCHOR, FAQS + FAQ_ANCHOR, 1)
            changes.append("target: 3 FAQs")
    page["content"] = c

    for slug, (old, new) in INBOUND.items():
        p = pages[slug]
        if new in p["content"]:
            continue
        if p["content"].count(old) != 1:
            problems.append(f"{slug}: inbound anchor found {p['content'].count(old)}x")
            continue
        p["content"] = p["content"].replace(old, new, 1)
        changes.append(f"{slug}: link to target")

    for line in changes:
        print("  +", line)
    for line in problems:
        print("  !", line, file=sys.stderr)
    if problems:
        return 1
    if not check and changes:
        PAGES.write_text(json.dumps(pages, ensure_ascii=False))
        print(f"wrote {len(changes)} change(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
