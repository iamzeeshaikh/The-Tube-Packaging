#!/usr/bin/env python3
"""Build src/data/catalogue.json from the crawled product pages.

The cart needs the same product id, name, price, SKU and thumbnail WooCommerce
used, so everything is read back out of the captured pages rather than typed in.
"""
import os, re, json, glob, html, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import extract as E

SITE = "https://thetubepackaging.com"


def main():
    catalogue = {}
    for f in sorted(glob.glob(os.path.join(E.LIVE, "product__*.html"))):
        slug = os.path.basename(f)[len("product__"):-5]
        raw = open(f, encoding="utf-8", errors="replace").read()

        ld = None
        for m in re.finditer(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',
                             raw, re.S):
            try:
                data = json.loads(m.group(1))
            except Exception:
                continue
            for node in (data if isinstance(data, list) else [data]):
                if isinstance(node, dict) and node.get("@type") == "Product":
                    ld = node
        assert ld, slug

        # the single-product add-to-cart button carries the WooCommerce post id
        pid = re.search(r"add-to-cart=(\d+)", raw)
        assert pid, slug

        # main gallery image, at the size the cart thumbnails use
        thumb = re.search(r'data-thumb="([^"]+)"', raw)
        cat = re.search(r'href="' + re.escape(SITE) +
                        r'/product-category/([a-z-]+)/"[^>]*rel="tag"', raw)

        image = ld.get("image")
        if isinstance(image, list):
            image = image[0]
        if isinstance(image, dict):
            image = image.get("url")

        catalogue[pid.group(1)] = {
            "id": int(pid.group(1)),
            "sku": str(ld.get("sku") or ""),
            "name": html.unescape(ld.get("name") or ""),
            "slug": slug,
            "url": "/product/%s/" % slug,
            "price": float((ld.get("offers") or {}).get("price") or 0),
            "image": (thumb.group(1) if thumb else image or "").replace(SITE, ""),
            "full": (image or "").replace(SITE, ""),
            "category": cat.group(1) if cat else "",
        }

    out = {
        "currency": "USD",
        "currencySymbol": "$",
        "decimals": 2,
        # WooCommerce has no shipping zones and taxes are switched off, so the
        # order total is the line-item subtotal.
        "taxes": False,
        "shipping": False,
        "products": catalogue,
    }
    dest = os.path.join(ROOT, "src", "data", "catalogue.json")
    json.dump(out, open(dest, "w"), indent=1)
    print("products:", len(catalogue))
    missing = [p["slug"] for p in catalogue.values() if not p["image"] or not p["price"]]
    print("incomplete:", missing or "none")


if __name__ == "__main__":
    main()
