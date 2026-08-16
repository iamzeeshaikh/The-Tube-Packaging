#!/usr/bin/env python3
"""Extract per-page data from the crawled live HTML into src/data/*.json.

Strict 1:1 migration: the live rendered HTML is the source of truth for markup.
Only WordPress-runtime artefacts that cannot exist on a static host are removed
(feeds, wp-json, RSD/wlwmanifest, oembed, plugin JS bundles, WP nonces).
Everything visible -- markup, classes, inline styles, CSS links, metadata,
schema, tracking -- is carried across byte-for-byte.
"""
import os, re, json, glob, hashlib, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LIVE = os.environ.get("LIVE_DIR", os.path.join(HERE, "crawl"))
OUT = os.path.join(ROOT, "src", "data")
SITE = "https://thetubepackaging.com"

# ---------------------------------------------------------------- cloudflare
def _dec(hexstr):
    b = bytes.fromhex(hexstr)
    k = b[0]
    return "".join(chr(c ^ k) for c in b[1:])


def cf_decode(h):
    """Undo Cloudflare's email obfuscation -- it is applied at their edge and
    will not be re-applied, so the real address has to be restored."""
    h = re.sub(
        r'<a([^>]*?)href="/cdn-cgi/l/email-protection#([0-9a-f]+)"([^>]*)>\s*<span[^>]*class="__cf_email__"[^>]*data-cfemail="[0-9a-f]+"[^>]*>.*?</span>\s*</a>',
        lambda m: '<a%shref="mailto:%s"%s>%s</a>' % (m.group(1), _dec(m.group(2)), m.group(3), _dec(m.group(2))),
        h, flags=re.S)
    # The author archive uses a bare <a class="__cf_email__"> with no #hash.
    # That variant wraps text that was never a link -- Cloudflare's own decoder
    # replaces the whole anchor with the plain address, which is what the live
    # page renders ("By shanimazhar82@gmail.com"), so restore plain text here.
    h = re.sub(
        r'<a href="/cdn-cgi/l/email-protection"(?![^>]*href="mailto)[^>]*?data-cfemail="([0-9a-f]+)"[^>]*>.*?</a>',
        lambda m: _dec(m.group(1)),
        h, flags=re.S)
    h = re.sub(r'<span[^>]*class="__cf_email__"[^>]*data-cfemail="([0-9a-f]+)"[^>]*>.*?</span>',
               lambda m: _dec(m.group(1)), h, flags=re.S)
    h = re.sub(r'href="/cdn-cgi/l/email-protection#([0-9a-f]+)"',
               lambda m: 'href="mailto:%s"' % _dec(m.group(1)), h)
    h = re.sub(r'<script[^>]*src="/cdn-cgi/scripts/[^"]*email-decode[^"]*"[^>]*>\s*</script>', '', h)
    return h


# ---------------------------------------------------------------- head clean
# Endpoints that exist only under WordPress; leaving the links in would point at
# URLs that 404 on the static build.
DROP_LINK_PATTERNS = [
    r'<link[^>]*rel=["\']alternate["\'][^>]*type=["\']application/rss\+xml["\'][^>]*>',
    r'<link[^>]*rel=["\']alternate["\'][^>]*type=["\']application/json\+oembed["\'][^>]*>',
    r'<link[^>]*rel=["\']alternate["\'][^>]*type=["\']text/xml\+oembed["\'][^>]*>',
    r'<link[^>]*rel=["\']alternate["\'][^>]*type=["\']application/json["\'][^>]*>',
    r'<link[^>]*rel=["\']https://api\.w\.org/["\'][^>]*>',
    r'<link[^>]*rel=["\']EditURI["\'][^>]*>',
    r'<link[^>]*rel=["\']wlwmanifest["\'][^>]*>',
    r'<link[^>]*rel=["\']shortlink["\'][^>]*>',
    r'<link[^>]*rel=["\']pingback["\'][^>]*>',
    r'<link[^>]*rel=["\']profile["\'][^>]*>',
    r'<meta[^>]*name=["\']generator["\'][^>]*>',
]

# Vendor scripts that are self-contained -- they need no WordPress backend, so
# the originals are kept verbatim and the behaviour they drive (sticky header,
# off-canvas drawer, search modal, submenu toggles, WhatsApp widget, product
# gallery slider + zoom) is reproduced exactly rather than reimplemented.
KEEP_SCRIPT_SRC = [
    "/wp-includes/js/jquery/jquery.min.js",
    "/wp-includes/js/jquery/jquery-migrate.min.js",
    "/wp-includes/js/dist/hooks.min.js",
    "/wp-content/plugins/custom-tabs/public/js/custom-tabs-public.js",
    "/wp-content/plugins/woocommerce/assets/js/zoom/jquery.zoom.min.js",
    "/wp-content/plugins/woocommerce/assets/js/flexslider/jquery.flexslider.min.js",
    "/wp-content/plugins/woocommerce/assets/js/frontend/single-product.min.js",
    "/wp-content/plugins/elementor/assets/lib/font-awesome/js/v4-shims.min.js",
    "/wp-content/plugins/creame-whatsapp-me/public/js/joinchat.min.js",
    "/wp-content/plugins/rishi-companion/build/stickyHeader.js",
    "/wp-content/themes/rishi/dist/custom/custom.js",
    "/wp-content/plugins/google-listings-and-ads/js/build/gtag-events.js",
    "googletagmanager.com/gtag/js",
    # the quote forms carry a visible reCAPTCHA v2 checkbox
    "google.com/recaptcha/api.js",
]

# Inline <script> blocks whose consumer (a WordPress plugin bundle) is gone.
DROP_INLINE_SCRIPT_MARKERS = [
    "wc_add_to_cart_params", "woocommerce_params", "wc_country_select_params",
    "wc_address_i18n_params", "wc_cart_params", "wc_checkout_params",
    "wc_single_product_params", "wc_add_to_cart_variation_params",
    "wpforms_settings", "omnisend_woo_data", "elementorFrontendConfig",
    "ElementorProFrontendConfig", "eael_", "rishi_localize", "rishiOptions",
    "_wpUtilSettings", "wpApiSettings",
    # WooCommerce Blocks bootstraps on the cart page and needs wp.data / moment
    "wc-blocks-registry", "wcSettings", "wcBlocksRegistry", "wp.data",
    "moment.updateLocale", "wc.wcSettings", "_wpmejsSettings",
    "lazyloadRunObserver", "wp.i18n.setLocaleData", "sbjs.init",
    "customTabs", "custom_tabs", "joinchat_settings",
]

KEEP_INLINE_SCRIPT_MARKERS = [
    "zopim", "dataLayer", "gtag(", "application/ld+json",
    "woocommerce-no-js", "wc_single_product_params",
    # WordPress swaps emoji characters for Twemoji images on clients whose
    # fonts cannot draw them; the product copy is full of emoji, so dropping
    # this would change what those visitors see
    "_wpemojiSettings", "wpemoji",
]


# WordPress prints a companion inline script for each enqueued handle
# (<handle>-js-extra / -js-before / -js-after). Once the handle's bundle is
# gone the companion is dead code -- and several of them carry REST nonces.
INLINE_ID_RE = re.compile(r'id=["\']([^"\']+)-js-(?:extra|before|after)["\']')
KEEP_INLINE_IDS = {
    "wc-single-product",   # gallery slider + zoom config
    "gla-gtag-events",     # Google Listings & Ads conversion data
    "rishi-custom",        # theme script config
}


def keep_src(src):
    return any(k in src for k in KEEP_SCRIPT_SRC)


def drop_by_id(open_tag):
    m = INLINE_ID_RE.search(open_tag)
    return bool(m) and m.group(1) not in KEEP_INLINE_IDS


def clean_head(head):
    for p in DROP_LINK_PATTERNS:
        head = re.sub(p, "", head, flags=re.I)
    # remove every external <script src>: the replacements live in /assets/site.js,
    # except the tracking tags which must survive verbatim.
    def _script_sub(m):
        tag = m.group(0)
        open_tag = tag[:tag.index(">") + 1]
        src = re.search(r'src=["\']([^"\']+)', open_tag)
        if src:
            return tag if keep_src(src.group(1)) else ""
        body = m.group(1)
        if drop_by_id(open_tag):
            return ""
        if any(k in tag or k in body for k in KEEP_INLINE_SCRIPT_MARKERS):
            return tag
        if any(k in body for k in DROP_INLINE_SCRIPT_MARKERS):
            return ""
        return tag
    head = re.sub(r"<script\b[^>]*>(.*?)</script>", _script_sub, head, flags=re.S | re.I)
    head = re.sub(r"<script\b[^>]*/>", "", head, flags=re.I)
    head = re.sub(r"\n{3,}", "\n\n", head)
    return head.strip()


def clean_body_fragment(h):
    def _script_sub(m):
        tag = m.group(0)
        body = m.group(1)
        open_tag = tag[:tag.index(">") + 1]
        src = re.search(r'src=["\']([^"\']+)', open_tag)
        if src:
            return tag if keep_src(src.group(1)) else ""
        if drop_by_id(open_tag):
            return ""
        if any(k in body for k in KEEP_INLINE_SCRIPT_MARKERS):
            return tag
        if any(k in body for k in DROP_INLINE_SCRIPT_MARKERS):
            return ""
        if 'type="text/template"' in tag or "speculationrules" in tag:
            return ""
        return tag
    h = re.sub(r"<script\b[^>]*>(.*?)</script>", _script_sub, h, flags=re.S | re.I)
    h = re.sub(r"<script\b[^>]*/>", "", h, flags=re.I)
    # WordPress nonces / ajax endpoints must never reach the static output.
    # The hidden nonce inputs stay (they are part of the form's field list) but
    # their values are emptied -- a token bound to a session that no longer
    # exists is only a leak.
    h = re.sub(r'\s(?:data-)?nonce=["\'][^"\']*["\']', "", h)
    h = re.sub(r'(<input[^>]*name="(?:_wpnonce|[\w-]*-nonce)"[^>]*value=")[^"]*(")',
               r"\1\2", h)
    h = re.sub(r'/wp-admin/admin-ajax\.php', "#", h)
    return h


CART_BLOCK = os.path.join(OUT, "cart-block.html")


def splice_cart_block(h):
    """The cart page ships a WooCommerce Blocks skeleton that only becomes the
    real (empty-cart) panel once the Blocks bundle hydrates it against the Store
    API. With no WordPress behind it the skeleton would be all a visitor ever
    sees, so the hydrated markup captured from the live page is baked in."""
    if "wp-block-woocommerce-cart" not in h or not os.path.exists(CART_BLOCK):
        return h
    el = slice_element(h, r'<div data-block-name="woocommerce/cart"', "div")
    if not el:
        return h
    return h.replace(el, open(CART_BLOCK, encoding="utf-8").read())


def clean_body_open(h):
    """Everything WordPress prints between <body> and the page wrapper: just
    the Google Ads page_view conversion event, which must be kept."""
    keep = [m.group(0) for m in re.finditer(r"<script\b[^>]*>.*?</script>", h, re.S)
            if "gtag(" in m.group(0)]
    return "".join(keep)


def slice_between(h, start_marker, end_marker):
    i = h.find(start_marker)
    if i < 0:
        return None
    j = h.find(end_marker, i)
    if j < 0:
        return None
    return h[i:j + len(end_marker)]


VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr"}


def slice_element(h, start_re, tag):
    """Return the full element (balanced) whose opening tag matches start_re."""
    m = re.search(start_re, h)
    if not m:
        return None
    i = m.start()
    depth = 0
    pos = i
    open_re = re.compile(r"<(/?)(%s)\b[^>]*?(/?)>" % tag, re.I)
    while True:
        mm = open_re.search(h, pos)
        if not mm:
            return None
        pos = mm.end()
        if mm.group(3) == "/" or mm.group(2).lower() in VOID:
            continue
        depth += -1 if mm.group(1) else 1
        if depth == 0:
            return h[i:mm.end()]


def route_for(slug):
    if slug == "__home":
        return "/"
    return "/" + slug.replace("__", "/") + "/"


TAG_SPLIT = re.compile(r"(<[^>]+>)")


def tokenize(h):
    """Split a fragment into alternating text / tag tokens."""
    return TAG_SPLIT.split(h or "")


def tag_overrides(baseline_tokens, page_html):
    """Positions where this page's chrome differs from the shared baseline.

    Header / footer / off-canvas differ between pages only in menu state
    (current-menu-item & friends, aria-current) and in the loading /
    fetchpriority hints WordPress computes per page. Recording the differing
    tags by position reproduces every page byte-for-byte from one component.
    """
    toks = tokenize(page_html)
    if len(toks) != len(baseline_tokens):
        return None
    return {str(i): t for i, (t, b) in enumerate(zip(toks, baseline_tokens)) if t != b}


CHROME_KEYS = ("header", "offcanvas", "footer")

# /checkout/ is not a page on the live site: WooCommerce 302s it to /cart/
# whenever the cart is empty, which -- with no cart backend -- is always.
# Reproduced as a redirect in redirects.json rather than as a built page.
SKIP_FILES = {"checkout.html"}


# WooCommerce builds the product-category ItemList `url` values from the
# request URI, so the cache-busting query string used during the crawl made it
# drop the trailing slash. Visitors and Googlebot get the slashed form; restore
# it so the JSON-LD matches what the live site actually publishes.
CATEGORY_URL = re.compile(
    r'(thetubepackaging\.com(?:\\/|/)product-category(?:\\/|/)[a-z0-9-]+)(?=["#])')


def read_page(f):
    slug = os.path.basename(f)[:-5]
    raw = cf_decode(open(f, encoding="utf-8", errors="replace").read())
    # the search-modal key is randomised on every render; pin it
    raw = re.sub(r'data-modal-key="\d+"', 'data-modal-key="ttp-search"', raw)
    raw = CATEGORY_URL.sub(lambda m: m.group(1) + ("\\/" if "\\/" in m.group(1) else "/"), raw)
    parts = {
        "header": slice_element(raw, r'<header id="header"', "header"),
        "offcanvas": slice_element(raw, r'<div id="rishi-offcanvas"', "div"),
        "footer": slice_element(raw, r'<footer class="rishi-footer"', "footer"),
        "joinchat": slice_element(raw, r'<div class="joinchat joinchat--', "div"),
        "popup": slice_element(raw, r'<div data-elementor-type="popup"', "div"),
        "skip": slice_between(raw, '<a class="skip-link', "</a>"),
        "content": slice_between(raw, '<div class="site-content"', "</div><!-- .site-content -->"),
    }
    b = raw.find(">", raw.find("<body")) + 1
    parts["bodyOpen"] = raw[b:raw.find('<div id="main-container"')]
    t = raw.find("</div><!-- #page -->")
    parts["bodyTail"] = raw[t + len("</div><!-- #page -->"):raw.rfind("</body>")]
    for k in CHROME_KEYS + ("joinchat", "content"):
        assert parts[k], "%s: missing %s" % (slug, k)
    return slug, raw, parts


def main():
    os.makedirs(OUT, exist_ok=True)
    files = sorted(glob.glob(os.path.join(LIVE, "*.html")))
    parsed = [read_page(f) for f in files if os.path.basename(f) not in SKIP_FILES]

    # the shop page carries no active menu state, so it makes the cleanest
    # baseline for the shared chrome
    base = next(p for p in parsed if p[0] == "shop")
    chrome = {"skip": base[2]["skip"]}
    for k in CHROME_KEYS:
        chrome[k] = clean_body_fragment(base[2][k])
    chrome["joinchat"] = re.sub(r"data-settings='[^']*'", "data-settings='%%JC%%'",
                                clean_body_fragment(base[2]["joinchat"]))
    base_tokens = {k: tokenize(chrome[k]) for k in CHROME_KEYS}

    pages, unsplittable = {}, []
    for slug, raw, parts in parsed:
        head = raw[raw.find("<head>") + 6: raw.find("</head>")]
        bodym = re.search(r"<body class=\"([^\"]*)\"", raw)
        jc = re.search(r"<div class=\"joinchat[^\"]*\"[^>]*data-settings='([^']*)'", raw)

        chrome_diff = {}
        for k in CHROME_KEYS:
            d = tag_overrides(base_tokens[k], clean_body_fragment(parts[k]))
            if d is None:
                unsplittable.append((slug, k))
            elif d:
                chrome_diff[k] = d

        pages[slug] = {
            "slug": slug,
            "route": route_for(slug),
            "url": SITE + route_for(slug),
            "bodyClass": bodym.group(1) if bodym else "",
            "head": clean_head(head),
            "content": splice_cart_block(clean_body_fragment(parts["content"])),
            "joinchatSettings": jc.group(1) if jc else "",
            "chromeDiff": chrome_diff,
            # Elementor's frontend bundle is not enqueued on every page that
            # contains Elementor markup; ttp.js needs to know which pages had it
            "elementorFrontend": "elementor/assets/js/frontend.min.js" in raw,
            "bodyOpen": clean_body_open(parts["bodyOpen"]),
            # everything WordPress prints after the page wrapper: late
            # stylesheets, the Elementor popup template, the WhatsApp widget
            # (swapped for a marker so one component can own it) and the
            # vendor scripts that survive the move off WordPress
            "bodyTail": clean_body_fragment(parts["bodyTail"]).replace(
                parts["joinchat"], "<!--JOINCHAT-->"),
        }

    json.dump(pages, open(os.path.join(OUT, "pages.json"), "w"), indent=1)
    json.dump(chrome, open(os.path.join(OUT, "chrome.json"), "w"), indent=1)
    print("pages:", len(pages))
    for k in ("header", "offcanvas", "footer", "joinchat", "skip"):
        print("  chrome.%s: %d bytes" % (k, len(chrome[k] or "")))
    print("  structural mismatches:", unsplittable or "none")
    print("  max chrome overrides on a page:",
          max(sum(len(v) for v in p["chromeDiff"].values()) for p in pages.values()))


if __name__ == "__main__":
    main()
