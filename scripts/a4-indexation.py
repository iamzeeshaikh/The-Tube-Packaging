#!/usr/bin/env python3
"""A4 — indexation cleanup.

1. /thank-you/ carried `index, follow`. A post-submission confirmation page has
   no search value, it earns 60 impressions and 0 clicks, and its appearance in
   results is a conversion-tracking hazard. Set it to `noindex, follow`, using
   the exact form /cart/ and /my-account/ already use.

2. /cart/, /checkout/ and /my-account/ are already `noindex` but are submitted
   in page-sitemap.xml. A sitemap should list URLs you want indexed.
   /thank-you/ joins them once step 1 lands, so it comes out too.

Nothing else in any sitemap is touched.
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / 'src/data/pages.json'
SITEMAP = ROOT / 'public/page-sitemap.xml'

OLD_ROBOTS = ("<meta name='robots' content='index, follow, max-image-preview:large, "
              "max-snippet:-1, max-video-preview:-1' />")
NEW_ROBOTS = "<meta name='robots' content='noindex, follow' />"

DROP = ['/cart/', '/checkout/', '/my-account/', '/thank-you/']

pages = json.loads(PAGES.read_text())
head = pages['thank-you']['head']
if OLD_ROBOTS not in head:
    sys.exit('thank-you: expected robots meta not found — aborting')
if head.count(OLD_ROBOTS) != 1:
    sys.exit('thank-you: robots meta is not unique — aborting')
pages['thank-you']['head'] = head.replace(OLD_ROBOTS, NEW_ROBOTS)
PAGES.write_text(json.dumps(pages, ensure_ascii=False))
print('thank-you robots ->', NEW_ROBOTS)

xml = SITEMAP.read_text()
for path in DROP:
    block = re.compile(
        r'\t<url>\s*\n\t\t<loc>https://thetubepackaging\.com' + re.escape(path)
        + r'</loc>\s*\n\t\t<lastmod>[^<]*</lastmod>\s*\n\t</url>\n')
    xml, n = block.subn('', xml)
    if n != 1:
        sys.exit(f'{path}: removed {n} sitemap entries, expected exactly 1 — aborting')
    print('sitemap  -', path)
SITEMAP.write_text(xml)
