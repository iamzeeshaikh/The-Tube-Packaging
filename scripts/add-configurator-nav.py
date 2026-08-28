#!/usr/bin/env python3
"""Put the configurator in the navigation.

It shipped live and correct, but the only links to it were inside the quote
section on six pages and one FAQ answer — all below the fold. The owner could
not find it on the live site, which is the whole point of building it.

Added as a top-level item in the header and off-canvas menus, and to the
footer's Company column. The markup copies the theme's own menu-item shape so
it inherits every existing style and the mobile drawer behaviour.
"""
import json, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHROME = ROOT / 'src/data/chrome.json'

URL = 'https://thetubepackaging.com/tube-configurator/'
LABEL = 'Build a Quote'

MENU_END = '</ul>\n</li>\n</ul>'
MENU_ITEM = (
    '</ul>\n</li>\n'
    '<li id="menu-item-ttpcfg" class="menu-item menu-item-type-post_type '
    'menu-item-object-page menu-item-ttpcfg">'
    f'<a href="{URL}">{LABEL}</a></li>\n</ul>'
)

FOOTER_ANCHOR = (
    '<li id="menu-item-435" class="menu-item menu-item-type-post_type '
    'menu-item-object-page menu-item-435">'
    '<a href="https://thetubepackaging.com/contact-us/">Contact Us</a></li>'
)
FOOTER_ITEM = (
    '<li id="menu-item-ttpcfgf" class="menu-item menu-item-type-post_type '
    'menu-item-object-page menu-item-ttpcfgf">'
    f'<a href="{URL}">{LABEL}</a></li>'
)

chrome = json.loads(CHROME.read_text())
changed = []

for key in ('header', 'offcanvas'):
    s = chrome[key]
    if URL in s:
        print(f'  {key}: already linked')
        continue
    if s.count(MENU_END) != 1:
        sys.exit(f'{key}: menu end found {s.count(MENU_END)} times, expected 1 — aborting')
    chrome[key] = s.replace(MENU_END, MENU_ITEM)
    changed.append(key)

s = chrome['footer']
if URL in s:
    print('  footer: already linked')
elif s.count(FOOTER_ANCHOR) != 1:
    sys.exit(f'footer: anchor found {s.count(FOOTER_ANCHOR)} times, expected 1 — aborting')
else:
    chrome['footer'] = s.replace(FOOTER_ANCHOR, FOOTER_ANCHOR + '\n' + FOOTER_ITEM)
    changed.append('footer')

CHROME.write_text(json.dumps(chrome, ensure_ascii=False))
print(f'\nlinked from: {", ".join(changed)}')
