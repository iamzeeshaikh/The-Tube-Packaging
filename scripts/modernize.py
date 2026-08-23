#!/usr/bin/env python3
"""Rewrite the captured markup that the modern stylesheet cannot reach.

Three things need the HTML itself changed rather than restyled:

1. The home hero. Elementor built it as a background-image section with a
   second, empty column, followed by a pink band whose left-hand image
   (`ChatGPT-Image-Feb-24-...png`) was deleted from the media library before
   the migration — it 404s on WordPress too, which is the blank half the
   client reported. Both are replaced by a `tp-hero` + `tp-plans` block that
   keeps every word of the original copy.

2. The emoji standing in for icons across the home page sections and the
   product trust strips. Emoji render as a different typeface on every
   platform and look like placeholders at card-title size; each becomes an
   inline stroke SVG that inherits `currentColor`.

3. The washed-out badge images (SSL / ISO / guarantee / payment seals), which
   were separate raster files at three different heights.

Run from the site root:  python3 scripts/modernize.py
It is idempotent — a second run reports "already applied" and changes nothing.
"""

import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / "src" / "data" / "pages.json"

SVG_OPEN = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" '
    'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" '
    'stroke-linejoin="round" aria-hidden="true" focusable="false">'
)


def svg(*bits):
    return SVG_OPEN + "".join(bits) + "</svg>"


def p(d):
    return f'<path d="{d}"/>'


def circle(cx, cy, r, fill=False):
    f = ' fill="currentColor" stroke="none"' if fill else ""
    return f'<circle cx="{cx}" cy="{cy}" r="{r}"{f}/>'


def rect(x, y, w, h, r=2):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}"/>'


# ── the icon set ────────────────────────────────────────────────────────
# Lucide-style 24x24 strokes; a handful (lipstick, pump bottle) are drawn
# here because Lucide has no equivalent.
ICONS = {
    "tag": svg(
        p("M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"),
        circle("7.5", "7.5", ".5", fill=True),
    ),
    "lipstick": svg(
        p("M9 10V5.6a1 1 0 0 1 .62-.93l3.5-1.4a1 1 0 0 1 1.38.93V10"),
        rect(8, 10, 8, 11, 1.5),
        p("M8 15h8"),
    ),
    "candle": svg(
        p("M12 3c1.6 1.3 2.4 2.4 2.4 3.4a2.4 2.4 0 0 1-4.8 0C9.6 5.4 10.4 4.3 12 3z"),
        rect(8, 10, 8, 11, 1.5),
        p("M12 10v-1.2"),
    ),
    "cup": svg(
        p("M10 2v2"), p("M14 2v2"),
        p("M17 8H4a1 1 0 0 0-1 1v7a5 5 0 0 0 5 5h5a5 5 0 0 0 5-5V9a1 1 0 0 0-1-1z"),
        p("M18 9h1a3 3 0 0 1 0 6h-1"),
    ),
    "gift": svg(
        p("M20 12v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9"),
        rect(2, 7, 20, 5, 1),
        p("M12 22V7"),
        p("M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"),
        p("M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"),
    ),
    "package": svg(
        p("m7.5 4.3 9 5.1"),
        p("M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"),
        p("m3.3 7 8.7 5 8.7-5"),
        p("M12 22V12"),
    ),
    "bottle": svg(
        p("M10 6V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"),
        p("M9 6h6a3 3 0 0 1 3 3v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a3 3 0 0 1 3-3z"),
        p("M9 12h6"),
    ),
    "chat": svg(p("M7.9 20A9 9 0 1 0 4 16.1L2 22z")),
    "receipt": svg(
        p("M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"),
        p("M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"),
        p("M12 17.5v-11"),
    ),
    "mail-open": svg(
        p("M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0z"),
        p("m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"),
    ),
    "palette": svg(
        p("M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"),
        circle("13.5", "6.5", ".8", fill=True),
        circle("17.5", "10.5", ".8", fill=True),
        circle("6.5", "12.5", ".8", fill=True),
        circle("8.5", "7.5", ".8", fill=True),
    ),
    "factory": svg(
        p("M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"),
        p("M17 18h1"), p("M12 18h1"), p("M7 18h1"),
    ),
    "truck": svg(
        p("M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"),
        p("M15 18H9"),
        p("M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"),
        circle("17", "18", "2"), circle("7", "18", "2"),
    ),
    "layers": svg(
        p("M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"),
        p("m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"),
        p("m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"),
    ),
    "leaf": svg(
        p("M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"),
        p("M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"),
    ),
    "info": svg(circle("12", "12", "10"), p("M12 16v-4"), p("M12 8h.01")),
    "star": svg(
        p("M11.53 2.3a.53.53 0 0 1 .95 0l2.3 4.68a2.1 2.1 0 0 0 1.6 1.16l5.17.75a.53.53 0 0 1 .29.91l-3.73 3.64a2.1 2.1 0 0 0-.61 1.87l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.1 2.1 0 0 0-1.97 0L6.4 21.01a.53.53 0 0 1-.77-.56l.88-5.14a2.1 2.1 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .29-.91l5.17-.75a2.1 2.1 0 0 0 1.6-1.16z"),
    ),
    "wrench": svg(
        p("M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"),
    ),
    "timer": svg(p("M10 2h4"), p("M12 14V9"), circle("12", "14", "8")),
    "globe": svg(
        circle("12", "12", "10"),
        p("M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"),
        p("M2 12h20"),
    ),
    "phone": svg(
        p("M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.94.36 1.86.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.95.34 1.87.58 2.81.7A2 2 0 0 1 22 16.92z"),
    ),
    "bulb": svg(
        p("M15 14c.2-1 .7-1.7 1.5-2.5A5.9 5.9 0 0 0 18 7.5 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.8.8 1.3 1.5 1.5 2.5"),
        p("M9 18h6"), p("M10 22h4"),
    ),
    "image": svg(
        rect(3, 3, 18, 18, 2),
        circle("9", "9", "1.6"),
        p("m21 15-3.09-3.09a2 2 0 0 0-2.83 0L6 21"),
    ),
    "file": svg(
        p("M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"),
        p("M14 2v4a2 2 0 0 0 2 2h4"),
        p("M9 13h6"), p("M9 17h4"),
    ),
    "sprout": svg(
        p("M7 20h10"),
        p("M10 20c5.5-2.5.8-6.4 3-10"),
        p("M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"),
        p("M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"),
    ),
    "recycle": svg(
        p("M7 19H4.8a1.83 1.83 0 0 1-1.57-.88 1.79 1.79 0 0 1 0-1.79L7.2 9.5"),
        p("M11 19h8.2a1.83 1.83 0 0 0 1.56-.89 1.78 1.78 0 0 0 0-1.78l-1.23-2.12"),
        p("m14 16-3 3 3 3"),
        p("M8.29 13.6 7.2 9.5 3.1 10.6"),
        p("m9.34 5.81 1.1-1.89A1.83 1.83 0 0 1 12 3a1.78 1.78 0 0 1 1.55.89l3.94 6.84"),
        p("m13.38 9.63 4.09 1.1 1.1-4.1"),
    ),
    "help": svg(
        circle("12", "12", "10"),
        p("M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"),
        p("M12 17h.01"),
    ),
    "puzzle": svg(
        p("M15.39 4.39a1 1 0 0 0 1.68-.47 2.5 2.5 0 1 1 3.01 3.01 1 1 0 0 0-.47 1.68l1.68 1.69a2.41 2.41 0 0 1 0 3.41L19.61 15.4a1 1 0 0 1-1.68-.48 2.5 2.5 0 1 0-3.01 3.02 1 1 0 0 1 .47 1.68l-1.68 1.68a2.41 2.41 0 0 1-3.42 0L8.61 19.6a1 1 0 0 0-1.68.48 2.5 2.5 0 1 1-3.01-3.02 1 1 0 0 0 .47-1.68l-1.68-1.68a2.41 2.41 0 0 1 0-3.42L4.39 8.6a1 1 0 0 1 1.68.48 2.5 2.5 0 1 0 3.01-3.02 1 1 0 0 1-.47-1.68z"),
    ),
    "card": svg(rect(2, 5, 20, 14, 2), p("M2 10h20"), p("M6 15h4")),
    "ruler": svg(
        p("M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4z"),
        p("m7.5 10.5 2 2"), p("m10.5 7.5 2 2"), p("m13.5 4.5 2 2"), p("m4.5 13.5 2 2"),
    ),
    "bag": svg(
        p("M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"),
        p("M3 6h18"),
        p("M16 10a4 4 0 0 1-8 0"),
    ),
    "repeat": svg(
        p("m17 2 4 4-4 4"),
        p("M3 11v-1a4 4 0 0 1 4-4h14"),
        p("m7 22-4-4 4-4"),
        p("M21 13v1a4 4 0 0 1-4 4H3"),
    ),
    "mail": svg(rect(2, 4, 20, 16, 2), p("m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7")),
    "check": svg(p("M20 6 9 17l-5-5")),
    "arrow-right": svg(p("M5 12h14"), p("m12 5 7 7-7 7")),
    "sparkles": svg(
        p("M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"),
        p("M20 3v4"), p("M22 5h-4"),
    ),
    "shield-check": svg(
        p("M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"),
        p("m9 12 2 2 4-4"),
    ),
    "lock": svg(rect(3, 11, 18, 11, 2), p("M7 11V7a5 5 0 0 1 10 0v4")),
    "badge-check": svg(
        p("M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z"),
        p("m9 12 2 2 4-4"),
    ),
    "zap": svg(
        p("M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"),
    ),
    "printer": svg(
        p("M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"),
        p("M6 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1"),
        rect(6, 14, 12, 8, 1),
    ),
    "flask": svg(
        p("M10 2v6.3a2 2 0 0 1-.3 1.1L4.6 18a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3l-5.1-8.6a2 2 0 0 1-.3-1.1V2"),
        p("M8.5 2h7"),
        p("M7 15h10"),
    ),
    "pen": svg(
        p("M21.17 2.83a3 3 0 0 0-4.24 0L3 16.76V21h4.24L21.17 7.07a3 3 0 0 0 0-4.24z"),
        p("m15.5 4.5 4 4"),
    ),
}

# every emoji the crawl carried into an icon slot, mapped to its replacement
EMOJI = {
    "🏷️": "tag", "🏷": "tag",
    "💄": "lipstick",
    "🕯️": "candle", "🕯": "candle",
    "🍵": "cup",
    "🎁": "gift",
    "📦": "package",
    "🧴": "bottle",
    "💬": "chat",
    "🧾": "receipt",
    "📩": "mail-open",
    "🎨": "palette",
    "🏭": "factory",
    "🚚": "truck",
    "🧱": "layers",
    "🌿": "leaf",
    "ℹ️": "info", "ℹ": "info",
    "⭐": "star",
    "🔧": "wrench",
    "⏱️": "timer", "⏱": "timer",
    "🌍": "globe",
    "📞": "phone",
    "🧠": "bulb",
    "🖼️": "image", "🖼": "image",
    "📄": "file",
    "🌱": "sprout",
    "♻️": "recycle", "♻": "recycle",
    "❓": "help",
    "🧩": "puzzle",
    "💳": "card",
    "📏": "ruler",
    "🛍️": "bag", "🛍": "bag",
    "🔁": "repeat",
    "✨": "sparkles",
    "🖨️": "printer", "🖨": "printer",
    "🧪": "flask",
    "&#9742;": "phone",
    "&#9993;": "mail",
    "☎": "phone",
    "✉": "mail",
}

ICON_SLOT = re.compile(
    r'(<(?P<tag>div|span)[^>]*class="tp-[a-z]+__[a-zA-Z]*(?:[Ii]con)[a-zA-Z]*"[^>]*>)'
    r'\s*(?P<body>[^<]{1,12}?)\s*'
    r'(</(?P=tag)>)'
)


def swap_icons(html):
    """Replace every emoji sitting in a `tp-*__…icon` slot with an SVG."""
    misses = []

    def repl(m):
        body = m.group("body").strip()
        name = EMOJI.get(body)
        if not name:
            misses.append(body)
            return m.group(0)
        return m.group(1) + ICONS[name] + m.group(4)

    return ICON_SLOT.sub(repl, html), misses


# ── the home hero ───────────────────────────────────────────────────────
HERO_START = '<section class="elementor-section elementor-top-section elementor-element elementor-element-4e562598'
HERO_END = '<section class="elementor-section elementor-top-section elementor-element elementor-element-53b9c3dd'

QUOTE_POPUP = (
    "#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3D"
    "eyJpZCI6IjMwNiIsInRvZ2dsZSI6ZmFsc2V9"
)


def hero_block():
    i = ICONS
    return f'''
<section class="tp-hero" aria-label="Custom tube packaging">
  <div class="tp-hero__wrap">
    <div class="tp-hero__copy">
      <span class="tp-hero__eyebrow"><span class="tpm-icon">{i["sparkles"]}</span>Custom Tube Packaging</span>
      <h1 class="tp-hero__title">Premium Tube Packaging Solutions for <em>Every Need</em></h1>
      <p class="tp-hero__lede">Get high-quality custom-printed tube packaging that will make your products shine!</p>
      <div class="tp-hero__actions">
        <a class="tp-hero__btn tp-hero__btn--primary" href="{QUOTE_POPUP}">Get A Quote<span class="tpm-icon">{i["arrow-right"]}</span></a>
        <a class="tp-hero__btn tp-hero__btn--ghost" href="tel:(503)%20358-0443"><span class="tpm-icon">{i["phone"]}</span>(503) 358-0443</a>
      </div>
      <ul class="tp-hero__points">
        <li><span class="tpm-icon">{i["check"]}</span>No strict minimum order quantity</li>
        <li><span class="tpm-icon">{i["check"]}</span>Free design and artwork support</li>
        <li><span class="tpm-icon">{i["check"]}</span>8&#8211;10 business day turnaround</li>
      </ul>
    </div>
    <div class="tp-hero__media">
      <div class="tp-hero__frame">
        <img src="https://thetubepackaging.com/wp-content/uploads/2024/07/banner.jpg" width="1200" height="900" alt="Custom printed paper, kraft and cardboard tubes for cosmetics, candles, tea and gifts" fetchpriority="high" decoding="async" />
      </div>
      <div class="tp-hero__chip">
        <div>
          <div class="tp-hero__chipNum">35+</div>
          <div class="tp-hero__chipLabel">Tube products</div>
        </div>
        <span class="tp-hero__chipDiv"></span>
        <div>
          <div class="tp-hero__chipNum">$0.30</div>
          <div class="tp-hero__chipLabel">From, per piece</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="tp-plans" aria-label="Standard and eco-friendly tubes">
  <div class="tp-plans__wrap">
    <div class="tp-plans__media">
      <img src="https://thetubepackaging.com/wp-content/uploads/2026/02/hero-tube-packaging-1.png" width="750" height="750" alt="Kraft paper tubes with push lids, one showing the sifter insert and one the foil lining" loading="lazy" decoding="async" srcset="https://thetubepackaging.com/wp-content/uploads/2026/02/hero-tube-packaging-1.png 1024w, https://thetubepackaging.com/wp-content/uploads/2026/02/hero-tube-packaging-1-768x768.png 768w, https://thetubepackaging.com/wp-content/uploads/2026/02/hero-tube-packaging-1-600x600.png 600w, https://thetubepackaging.com/wp-content/uploads/2026/02/hero-tube-packaging-1-300x300.png 300w" sizes="(max-width: 940px) 90vw, 440px" />
    </div>
    <div class="tp-plans__grid">
      <article class="tp-plans__card">
        <span class="tp-plans__tag"><span class="tpm-icon">{i["zap"]}</span>Ready to ship</span>
        <h3 class="tp-plans__title">Standard Tubes</h3>
        <ul class="tp-plans__list">
          <li><span class="tpm-icon">{i["check"]}</span>500 pcs minimum order quantity</li>
          <li><span class="tpm-icon">{i["check"]}</span>Ready-made with shorter lead times</li>
          <li><span class="tpm-icon">{i["check"]}</span>Available in common sizes and colors</li>
          <li><span class="tpm-icon">{i["check"]}</span>Cost-effective and quick turnaround</li>
        </ul>
        <a class="tp-plans__cta" href="https://thetubepackaging.com/shop/">Shop Now<span class="tpm-icon">{i["arrow-right"]}</span></a>
      </article>
      <article class="tp-plans__card tp-plans__card--eco">
        <span class="tp-plans__tag"><span class="tpm-icon">{i["leaf"]}</span>Made to order</span>
        <h3 class="tp-plans__title">Eco-Friendly Tubes</h3>
        <ul class="tp-plans__list">
          <li><span class="tpm-icon">{i["check"]}</span>800 pcs minimum order quantity</li>
          <li><span class="tpm-icon">{i["check"]}</span>Custom-made with eco-friendly materials</li>
          <li><span class="tpm-icon">{i["check"]}</span>Variety of sustainable finishes and styles</li>
          <li><span class="tpm-icon">{i["check"]}</span>Promote your brand&#8217;s commitment to the environment</li>
        </ul>
        <a class="tp-plans__cta" href="https://thetubepackaging.com/product/kraft-paper-tubes/">Shop Now<span class="tpm-icon">{i["arrow-right"]}</span></a>
      </article>
    </div>
  </div>
</section>
'''


# ── visible labels on every quote form ──────────────────────────────────
# Elementor shipped these forms with placeholder-only fields: the label
# vanishes the moment someone starts typing, and a half-filled form gives no
# clue which box is which. Each field gets a real label above it.
FIELD_GROUP = re.compile(
    r'(<div class="[^"]*elementor-field-group[^"]*"[^>]*>)(\s*)'
    r'(<(?:input|select|textarea)\b[^>]*>)'
)
PLACEHOLDER = re.compile(r'placeholder="([^"]*)"')
FIELD_ID = re.compile(r'\bid="([^"]+)"')
FIELD_TYPE = re.compile(r'\btype="([^"]+)"')

# nicer wording than the terse placeholders the form shipped with
LABEL_TEXT = {
    "Name": "Full name",
    "Your Name": "Full name",
    "Email": "Email address",
    "Phone": "Phone number",
    "Your Phone Number": "Phone number",
    "Product": "Product or tube type",
    "Message": "Message",
    "Additional Information": "Additional information",
    "Choose a way to Contact": "Preferred contact method",
}


# Elementor wraps <select> in its own div, so it needs its own pass; the label
# text comes from the first option, which the form used as the placeholder.
SELECT_GROUP = re.compile(
    r'(<div class="[^"]*elementor-field-group[^"]*"[^>]*>)(\s*)'
    r'(<div class="elementor-field elementor-select-wrapper[^"]*"[^>]*>.*?'
    r'<select[^>]*\bid="([^"]+)"[^>]*>\s*<option[^>]*>([^<]*)</option>)',
    re.S,
)


def add_labels(html):
    """Give every placeholder-only form field a visible label."""
    added = 0

    def select_repl(m):
        nonlocal added
        text = LABEL_TEXT.get(m.group(5).strip(), m.group(5).strip())
        if not text:
            return m.group(0)
        added += 1
        return (
            f'{m.group(1)}{m.group(2)}<label class="elementor-field-label" '
            f'for="{m.group(4)}">{text}</label>{m.group(2)}{m.group(3)}'
        )

    html = SELECT_GROUP.sub(select_repl, html)

    def repl(m):
        nonlocal added
        opening, gap, field = m.group(1), m.group(2), m.group(3)
        kind = FIELD_TYPE.search(field)
        if kind and kind.group(1) in ("file", "hidden", "submit"):
            return m.group(0)
        ph = PLACEHOLDER.search(field)
        fid = FIELD_ID.search(field)
        if not ph or not fid or not ph.group(1).strip():
            return m.group(0)
        text = LABEL_TEXT.get(ph.group(1).strip(), ph.group(1).strip())
        if "elementor-field-required" in opening:
            text += ' <abbr title="required" aria-hidden="true">*</abbr>'
        added += 1
        return (
            f'{opening}{gap}<label class="elementor-field-label" '
            f'for="{fid.group(1)}">{text}</label>{gap}{field}'
        )

    # a group that already carries a label is left alone
    def guarded(m):
        tail = html[m.end(1): m.end(3)]
        if "<label" in tail:
            return m.group(0)
        return repl(m)

    return FIELD_GROUP.sub(guarded, html), added


# ── the seals in the home quote panel ───────────────────────────────────
SEAL_IMG = re.compile(r'<div class="tp-quote__trust">.*?</div>', re.S)


def seal_block():
    i = ICONS
    return (
        '<div class="tp-quote__seals">'
        f'<span class="tp-quote__seal"><span class="tpm-icon">{i["lock"]}</span>Secure SSL checkout</span>'
        f'<span class="tp-quote__seal"><span class="tpm-icon">{i["card"]}</span>Visa, Mastercard, Amex &amp; PayPal</span>'
        f'<span class="tp-quote__seal"><span class="tpm-icon">{i["shield-check"]}</span>Satisfaction guaranteed</span>'
        '</div>'
    )


# ── the SSL / ISO / guarantee strip on every product page ───────────────
BADGE_CONTAINER = re.compile(
    r'<div class="elementor-element elementor-element-bc40ef7[^"]*"[^>]*>.*?'
    r'guarantee_image\.webp".*?</div>\s*</div>\s*</div>\s*</div>',
    re.S,
)


def assure_block():
    i = ICONS
    return (
        '<div class="tpm-assure">'
        f'<div class="tpm-assure__item"><span class="tpm-assure__icon">{i["lock"]}</span>'
        '<span class="tpm-assure__text"><span class="tpm-assure__title">Secure ordering</span>'
        '<span class="tpm-assure__note">SSL encrypted site</span></span></div>'
        f'<div class="tpm-assure__item"><span class="tpm-assure__icon">{i["badge-check"]}</span>'
        '<span class="tpm-assure__text"><span class="tpm-assure__title">Quality checked</span>'
        '<span class="tpm-assure__note">Reviewed before dispatch</span></span></div>'
        f'<div class="tpm-assure__item"><span class="tpm-assure__icon">{i["shield-check"]}</span>'
        '<span class="tpm-assure__text"><span class="tpm-assure__title">Satisfaction guarantee</span>'
        '<span class="tpm-assure__note">We reprint genuine faults</span></span></div>'
        '</div>'
    )


def main():
    pages = json.loads(PAGES.read_text())
    changed = {"hero": 0, "pages": 0, "seals": 0, "assure": 0, "labels": 0}
    all_misses = set()

    for slug, page in pages.items():
        html = page.get("content") or ""
        before = html

        if slug == "__home" and HERO_START in html:
            s = html.index(HERO_START)
            e = html.index(HERO_END)
            html = html[:s] + hero_block() + html[e:]
            changed["hero"] += 1

        html, misses = swap_icons(html)
        all_misses.update(misses)

        n = len(SEAL_IMG.findall(html))
        if n:
            html = SEAL_IMG.sub(seal_block(), html)
            changed["seals"] += n

        n = len(BADGE_CONTAINER.findall(html))
        if n:
            html = BADGE_CONTAINER.sub(assure_block(), html)
            changed["assure"] += n

        html, added = add_labels(html)
        changed["labels"] += added

        if html != before:
            page["content"] = html
            changed["pages"] += 1

    PAGES.write_text(json.dumps(pages, ensure_ascii=False))
    print("hero rebuilt on              :", changed["hero"], "page(s)")
    print("pages changed                :", changed["pages"])
    print("quote-panel seal strips       :", changed["seals"])
    print("product trust strips replaced :", changed["assure"])
    print("form labels added             :", changed["labels"])
    if all_misses:
        print("unmapped icon slots:", sorted(all_misses), file=sys.stderr)


if __name__ == "__main__":
    main()
