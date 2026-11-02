#!/usr/bin/env python3
"""November 2026 backlink pass for /product/empty-lotion-tubes/.

The page gets a paid link with the anchor "empty hand cream tubes", its top
GSC query (562 impressions, position 10.4 over six months), yet the page never
said "hand cream" once. This adds, without replacing anything:

  - a Description section on hand cream and ointment tubes (one link)
  - four FAQs in the existing FAQ tab (the schema reads them from the markup)
  - one contextual link in from /product/lotion-tubes/ and one from
    /product/skincare-tubes/
  - meta descriptions on the indexable pages that had none. The title of every
    page is left alone, and the policy pages are not touched.

Idempotent: every insert checks for its own marker first.
Usage: python3 scripts/nov-2026-backlink-pass.py [--check]
"""
import html
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / "src" / "data" / "pages.json"
SITE = "https://thetubepackaging.com"

SECTION = f"""
<hr />
<h2>Empty Hand Cream Tubes And Ointment Tubes</h2>
<p>Hand cream is thicker than most body lotion and gets used many times a day, so the tube has to give a small, even amount with each squeeze and then close cleanly in a bag, a car or on a desk. Our empty hand cream tubes use the same PE and laminate bodies as the lotion range, from small purse sizes up to bathroom sizes. A narrower opening with a flip-top or screw cap stops a rich cream from creeping out when the tube gets pressed in a handbag. If you sell hand cream next to a face or body line, the same diameter can carry through the whole set, which is how many brands plan their <a href="{SITE}/product/skincare-tubes/">custom skincare tube packaging</a> for a matched shelf.</p>
<p>Wholesale hand cream orders usually come from salons, spas, hotels and gift box makers who want one tube in several scents. A single tube size can be printed in a few colorways, and the sealed end can carry a batch code or a scent name so packers can tell cases apart without opening them. That keeps reorders simple when one scent sells faster than the others.</p>
<h3>Ointment Tubes And Cosmetic Squeeze Tubes</h3>
<p>Balms, barrier creams and thick ointment style products need a tube that keeps air out after opening. A laminate body with a small opening helps, because it does not pull air back in when the customer lets go, so the product stays cleaner down to the last squeeze. Tell us the formula type when you ask for a custom quote and we will suggest the wall and cap that suit it. The tubes arrive empty, ready for your own filling by hand or on a filling line.</p>
<p><strong>Hand Cream Tube Checklist</strong></p>
<ul>
<li>Choose the cap first, flip-top for daily use or screw cap for travel</li>
<li>Match the opening size to how thick the cream is</li>
<li>Leave room on the back panel for ingredients and directions</li>
<li>Keep one diameter across a set so a gift box fits every tube</li>
</ul>
"""
SECTION_MARK = "Empty Hand Cream Tubes And Ointment Tubes"
# the Description tab ends after the last table of this section
SECTION_ANCHOR = "<td>Retail collections</td>\n</tr>\n</tbody>\n</table>"

FAQS = """<h3>16. Do you make empty hand cream tubes?</h3>
<p>Yes. The same tubes are made for hand cream, with a smaller opening and a flip-top or screw cap so a thick cream comes out in a small, even amount.</p>
<h3>17. Can I order hand cream tubes wholesale in several scents?</h3>
<p>Yes. One tube size can be printed in several colorways for different scents, and the sealed end can carry a batch code or scent name for your packers.</p>
<h3>18. Are these tubes suitable for ointments and balms?</h3>
<p>Yes, for cosmetic balms and barrier creams. A laminate body with a small opening keeps air out after each squeeze. Tell us the formula type and we will suggest the wall and cap.</p>
<h3>19. Do the tubes arrive filled or empty?</h3>
<p>They arrive empty and ready for your own filling. Let us know whether you fill by hand or on a machine so the open end and cap suit your process.</p>
"""
FAQ_MARK = "Do you make empty hand cream tubes?"
FAQ_ANCHOR = "<h3>What is the minimum order quantity?</h3>"

TARGET = f"{SITE}/product/empty-lotion-tubes/"
INBOUND = {
    "product__lotion-tubes": (
        "The goal is to keep user experience consistent from the first squeeze to the last.</p>",
        "The goal is to keep user experience consistent from the first squeeze to the last. "
        f"Hand cream is the clearest case, and our <a href=\"{TARGET}\">empty hand cream tubes</a> "
        "use a narrower opening so a rich cream comes out in a small, even ribbon.</p>",
    ),
    "product__skincare-tubes": (
        "This reduces the risk of visual mismatch across shelves. The outcome is a more dependable brand lineup.</p>",
        "This reduces the risk of visual mismatch across shelves. Brands that sell a hand cream beside the face range "
        f"often order <a href=\"{TARGET}\">empty lotion and hand cream tubes</a> in the same diameter so the set looks "
        "matched. The outcome is a more dependable brand lineup.</p>",
    ),
}

# Pages with no meta description. Titles stay as they are. Policy pages,
# cart/account/thank-you and paginated archives are left out on purpose.
DESCRIPTIONS = {
    "product__empty-lotion-tubes":
        "Empty lotion and hand cream tubes printed with your logo. Flip-top or screw caps, "
        "travel to full sizes. Free shipping to the US, UK, Canada and Australia.",
    "product__deodorant-paper-tubes":
        "Push-up deodorant paper tubes in kraft or white board, printed to your artwork, for stick "
        "deodorant brands that want a paper pack. Free design support.",
    "5-industries-that-can-benefit-most-from-cardboard-tube-packaging":
        "Five industries that gain the most from cardboard tube packaging, from cosmetics and food "
        "to retail, posters and apparel, and why each one uses tubes.",
    "5-ways-large-cardboard-tubes-boost-product-protection":
        "How large cardboard tubes protect products in transit, from durable walls and a snug fit "
        "to shelf value and eco-friendly protection.",
    "6-design-ideas-for-custom-square-paper-tubes":
        "Six design ideas for custom square paper tubes, using flat print panels, stable stacking and "
        "finishes that help a product stand out on the shelf.",
    "about-us":
        "Meet The Tube Packaging, a Phoenix, Arizona supplier of custom paper, cardboard, mailing and "
        "plastic tubes for brands across the US, UK, Canada and Australia.",
    "cardboard-tubes-for-business-effective-solutions-for-packaging-and-storage":
        "How businesses use cardboard tubes for packaging, storage and branding, with practical notes "
        "on sizes, materials and printing for everyday use.",
    "category__information":
        "Guides and articles on tube packaging from The Tube Packaging, covering cardboard, paper, "
        "mailing and cosmetic tubes, sizing, printing and shipping.",
    "contact-us":
        "Contact The Tube Packaging for a custom quote, tube sizing help or an order update. Call "
        "(503) 358-0443, email info@thetubepackaging.com or use the form.",
    "cosmetic-tubes-complete-packaging-guide-for-beauty-product-manufacturers":
        "A packaging guide to cosmetic tubes for beauty brands, covering materials, caps, sizes, "
        "printing and how tube choice affects shelf life and shelf appeal.",
    "the-ultimate-guide-to-tube-packaging-from-food-to-industrial-applications":
        "A guide to tube packaging across food, cosmetics, retail and industrial uses, with the "
        "materials, closures and sizes each one usually needs.",
    "why-mailing-tubes-are-essential-for-shipping-posters-and-documents":
        "Why mailing tubes are the safest way to ship posters, prints, drawings and documents, and how "
        "to pick the right diameter, length and end caps.",
    "why-wrapping-paper-tubes-are-the-future-of-gift-packaging":
        "Why wrapping paper tubes are winning in gift packaging, from reusable rigid walls to custom "
        "printing that turns the tube itself into part of the gift.",
}
LIMIT = 160


def main():
    check = "--check" in sys.argv
    pages = json.loads(PAGES.read_text())
    changes, problems = [], []

    lot = pages["product__empty-lotion-tubes"]
    c = lot["content"]
    if SECTION_MARK not in c:
        if c.count(SECTION_ANCHOR) != 1:
            problems.append(f"section anchor found {c.count(SECTION_ANCHOR)}x")
        else:
            c = c.replace(SECTION_ANCHOR, SECTION_ANCHOR + SECTION, 1)
            changes.append("target: hand cream section")
    if FAQ_MARK not in c:
        if c.count(FAQ_ANCHOR) != 1:
            problems.append(f"faq anchor found {c.count(FAQ_ANCHOR)}x")
        else:
            c = c.replace(FAQ_ANCHOR, FAQS + FAQ_ANCHOR, 1)
            changes.append("target: 4 FAQs")
    lot["content"] = c

    for slug, (old, new) in INBOUND.items():
        p = pages[slug]
        if TARGET in p["content"].split('id="tab-description"', 1)[-1].split('id="tab-specifications_tab"', 1)[0]:
            continue
        if p["content"].count(old) != 1:
            problems.append(f"{slug}: inbound anchor found {p['content'].count(old)}x")
            continue
        p["content"] = p["content"].replace(old, new, 1)
        changes.append(f"{slug}: link to target")

    for slug, text in DESCRIPTIONS.items():
        p = pages.get(slug)
        if p is None:
            problems.append(f"{slug}: not in pages.json")
            continue
        if re.search(r'<meta name="description"', p["head"], re.I):
            continue
        if len(text) > LIMIT:
            problems.append(f"{slug}: {len(text)} chars")
            continue
        if "</title>" not in p["head"]:
            problems.append(f"{slug}: no </title>")
            continue
        tag = f'\n\t<meta name="description" content="{html.escape(text, quote=True)}" />'
        p["head"] = p["head"].replace("</title>", "</title>" + tag, 1)
        changes.append(f"{p['route']}: meta {len(text)}")

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
