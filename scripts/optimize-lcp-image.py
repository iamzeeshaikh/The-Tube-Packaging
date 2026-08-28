#!/usr/bin/env python3
"""Responsive renditions for the home page hero, which is the LCP element.

Measured on a throttled Pixel 5 against production: LCP 11.18s, and the LCP
element is /wp-content/uploads/2024/07/banner.jpg — 388 KB, 1920x765, served at
full size to a 390px phone with no srcset and no priority hint.

Produces WebP and JPEG at 480/768/1200/1920 wide. The original file is left
exactly where it is, because it is also the og:image and is referenced from
page-sitemap.xml.
"""
import pathlib, sys
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'public/wp-content/uploads/2024/07/banner.jpg'
WIDTHS = [480, 768, 1200, 1920]

if not SRC.exists():
    sys.exit(f'{SRC} not found')

im = Image.open(SRC).convert('RGB')
print(f'source {SRC.name}: {im.size[0]}x{im.size[1]}, {SRC.stat().st_size/1024:.0f} KB\n')

made = []
for w in WIDTHS:
    if w > im.size[0]:
        continue
    h = round(im.size[1] * w / im.size[0])
    r = im.resize((w, h), Image.LANCZOS)
    for ext, kw in (('webp', dict(quality=76, method=6)), ('jpg', dict(quality=80, optimize=True, progressive=True))):
        out = SRC.with_name(f'banner-{w}.{ext}')
        r.save(out, kw.pop('format', None) or ('WEBP' if ext == 'webp' else 'JPEG'), **kw)
        made.append(out)
        print(f'  banner-{w}.{ext:4} {out.stat().st_size/1024:6.0f} KB  {w}x{h}')

total = sum(p.stat().st_size for p in made)
print(f'\n{len(made)} renditions, {total/1024:.0f} KB total')
print(f'a 390px phone now fetches banner-480.webp instead of the 388 KB original')
