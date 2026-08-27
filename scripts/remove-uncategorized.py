#!/usr/bin/env python3
"""Delete /category/uncategorized/.

A default WordPress term that should never have shipped: zero clicks, zero
impressions, 70 editorial words, and it duplicates the two posts it lists. D6
noindexed it and removed it from the sitemap; the owner has now asked for it
gone.

Two posts sit in it and nowhere else — "Why Mailing Tubes Are Essential…" and
"Why Wrapping Paper Tubes Are the Future…" — so their category link and
breadcrumb crumb are moved to /category/information/, the site's one real blog
category, rather than left pointing at a page that no longer exists. Their own
URLs do not change.

The page record is dropped so nothing is built, and a 301 sends the URL to
/category/information/. A redirect rather than a 410 because Google has the URL
on file and a redirect passes what little signal it holds to the surviving
category, where a 410 throws it away.
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / 'src/data/pages.json'
VERCEL = ROOT / 'vercel.json'

OLD = 'https://thetubepackaging.com/category/uncategorized/'
NEW = 'https://thetubepackaging.com/category/information/'

pages = json.loads(PAGES.read_text())
key = next((k for k, v in pages.items() if v['route'] == '/category/uncategorized/'), None)
if key is None:
    sys.exit('/category/uncategorized/ is not in pages.json — already removed?')

moved = 0
for k, page in pages.items():
    if k == key:
        continue
    for field in ('head', 'content', 'bodyTail', 'popup'):
        s = page.get(field)
        if not isinstance(s, str) or OLD not in s:
            continue
        n = s.count(OLD)
        s = s.replace(OLD, NEW)
        # the visible label travels with the link — the anchor's inner text,
        # whether it is bare or wrapped in the theme's <span>
        def relabel(m):
            return m.group(1) + m.group(2).replace('Uncategorized', 'Information') + m.group(3)
        # note the \s+ : the captured theme markup writes `<a  href=` with two
        # spaces in the breadcrumb and one space in the post meta
        s = re.sub(r'(<a\s+href="' + re.escape(NEW) + r'"[^>]*>)([\s\S]{0,80}?)(</a>)', relabel, s)
        page[field] = s
        moved += n
        print(f'  {page["route"]:56} {field}  {n} link(s) -> /category/information/')

if 'Uncategorized' in json.dumps({k: v for k, v in pages.items() if k != key}):
    leftover = [v['route'] for k, v in pages.items()
                if k != key and 'Uncategorized' in json.dumps(v)]
    print(f'  note: the word "Uncategorized" still appears on {leftover}')

del pages[key]
PAGES.write_text(json.dumps(pages, ensure_ascii=False))
print(f'\npage record deleted; {moved} internal links repointed')

vercel = json.loads(VERCEL.read_text())
src = '/category/uncategorized/'
if any(r['source'] == src for r in vercel['redirects']):
    sys.exit('redirect already present — aborting')
vercel['redirects'].append({
    'source': '/category/uncategorized',
    'destination': '/category/information/',
    'permanent': True,
})
vercel['redirects'].append({
    'source': src,
    'destination': '/category/information/',
    'permanent': True,
})
VERCEL.write_text(json.dumps(vercel, indent=2) + '\n')
print('301 added: /category/uncategorized/ -> /category/information/')
