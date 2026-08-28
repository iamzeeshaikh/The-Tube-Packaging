#!/usr/bin/env python3
"""Put the configurator in the navigation, without touching the header menu.

It shipped live and correct, but was only linked from below the fold on seven
pages, so the owner could not find it.

A first attempt inserted an <li> into the header's top-level menu <ul>. That
broke the page: the header grew from 187px to 272px because seven items no
longer fit on one row, and worse, the DOM restructured — .site-content moved up
a level and a 746px gap opened between the header and the breadcrumb on every
page. The literal `</ul></li></ul>` matched in the header is not the top-level
menu close it appears to be.

Isolated by applying the change to one menu at a time and measuring: the header
insertion produced the 746px gap, the off-canvas insertion was clean. So:

Adding anything at all to the desktop header breaks it — a menu <li> and a
plain <a> in the CTA slot were both tried, and both produced the same 272px
header and 746px gap. The header row is laid out at a fixed height, so an extra
element wraps it to a second line, and the theme's sticky-header script then
measures the wrong height and inserts a spacer the size of the gap.

So the desktop header is left completely alone:

  off-canvas  a real menu item, and where mobile users look for navigation.
  footer      the Company column, anchored on a specific <li>.
  in-page     the quote section on all six category pages, the size guide, and
              the product food page already link to it.

Verified after: header height and the header-to-breadcrumb gap must be
unchanged from a build without this script (187px and 18px).
"""
import json, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHROME = ROOT / 'src/data/chrome.json'
URL = 'https://thetubepackaging.com/design-your-tube-packaging/'
LABEL = 'Build a Quote'

MENU_END = '</ul>\n</li>\n</ul>'
MENU_ITEM = (
    '</ul>\n</li>\n'
    '<li id="menu-item-ttpcfg" class="menu-item menu-item-type-post_type '
    f'menu-item-object-page menu-item-ttpcfg"><a href="{URL}">{LABEL}</a></li>\n</ul>')

FOOTER_ANCHOR = (
    '<li id="menu-item-435" class="menu-item menu-item-type-post_type '
    'menu-item-object-page menu-item-435">'
    '<a href="https://thetubepackaging.com/contact-us/">Contact Us</a></li>')
FOOTER_ITEM = (
    '<li id="menu-item-ttpcfgf" class="menu-item menu-item-type-post_type '
    f'menu-item-object-page menu-item-ttpcfgf"><a href="{URL}">{LABEL}</a></li>')

chrome = json.loads(CHROME.read_text())
done = []

# off-canvas: a real menu item
s = chrome['offcanvas']
if URL in s:
    print('  offcanvas: already linked')
elif s.count(MENU_END) != 1:
    sys.exit(f'offcanvas: menu end found {s.count(MENU_END)} times — aborting')
else:
    chrome['offcanvas'] = s.replace(MENU_END, MENU_ITEM)
    done.append('off-canvas menu')

s = chrome['footer']
if URL in s:
    print('  footer: already linked')
elif s.count(FOOTER_ANCHOR) != 1:
    sys.exit(f'footer: anchor found {s.count(FOOTER_ANCHOR)} times — aborting')
else:
    chrome['footer'] = s.replace(FOOTER_ANCHOR, FOOTER_ANCHOR + '\n' + FOOTER_ITEM)
    done.append('footer')

CHROME.write_text(json.dumps(chrome, ensure_ascii=False))
print('linked from:', ', '.join(done) if done else 'nothing changed')
