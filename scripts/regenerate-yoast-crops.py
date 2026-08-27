#!/usr/bin/env python3
"""D7 — regenerate the Yoast aspect-ratio crops the migration did not carry over.

reports/owner-decisions.md item 7, option 2. Every product's Product schema
declares three ImageObjects: the 1200x1200 primary, which resolves, plus a
-1200x675 and a -1200x900 crop that WordPress generated and the migration left
behind. Both 404 — or, under the firewall rule on /wp-content/uploads/, 403.

41 of those URLs appear in the GSC export with 203 impressions between them, so
Google had indexed them. Regenerating restores exactly the URLs it knows, and
changes no markup at all — which is the point: options 1 and 3 either leave the
403s or mean editing Product schema, and Section 0 protects that.

Yoast crops from the centre, so these do too: the 1200x1200 primary is cut to
16:9 and 4:3 about the vertical centre, at the same width.
"""
import json, re, os, sys, pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUB = ROOT / 'public'
pages = json.loads((ROOT / 'src/data/pages.json').read_text())

wanted = set()
for page in pages.values():
    blob = (page['head'] + page['content']).replace('\\/', '/')
    for m in re.finditer(
            r'/wp-content/uploads/[^"\'\s)\\]+?-1200x(?:675|900)\.(?:jpg|jpeg|png|webp)', blob):
        wanted.add(m.group(0))

made = skipped = 0
total = 0
for rel in sorted(wanted):
    dest = PUB / rel.lstrip('/')
    if dest.exists():
        skipped += 1
        continue
    m = re.match(r'^(.*)-1200x(675|900)(\.[A-Za-z]+)$', str(dest))
    src = pathlib.Path(m.group(1) + m.group(3))
    height = int(m.group(2))
    if not src.exists():
        sys.exit(f'{rel}: primary {src.name} not on disk — aborting')

    with Image.open(src) as im:
        im = im.convert('RGB')
        w, h = im.size
        target_h = round(w * height / 1200)
        if target_h > h:
            sys.exit(f'{rel}: primary is {w}x{h}, too short to crop — aborting')
        top = (h - target_h) // 2                      # centre crop, as Yoast does
        crop = im.crop((0, top, w, top + target_h))
        if crop.size != (1200, height):
            crop = crop.resize((1200, height), Image.LANCZOS)
        dest.parent.mkdir(parents=True, exist_ok=True)
        crop.save(dest, 'JPEG', quality=82, optimize=True, progressive=True)
    total += dest.stat().st_size
    made += 1

print(f'{made} crops written, {skipped} already present, '
      f'{total/1024/1024:.1f} MB total')
