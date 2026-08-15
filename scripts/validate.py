#!/usr/bin/env python3
"""Phase 5 -- assert the final-validation checklist against the production build."""
import os, re, json, glob, sys, collections
from bs4 import BeautifulSoup

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")
SITE = "https://thetubepackaging.com"
pages = json.load(open(os.path.join(ROOT, "src/data/pages.json")))
rd = json.load(open(os.path.join(ROOT, "src/data/redirects.json")))

results = []


def check(name, ok, detail=""):
    results.append((ok, name, detail))


html_files = glob.glob(os.path.join(DIST, "**", "*.html"), recursive=True)
docs = {f: open(f, encoding="utf-8", errors="replace").read() for f in html_files}
soups = {f: BeautifulSoup(h, "lxml") for f, h in docs.items()}

# --- every sitemap URL exists -------------------------------------------------
sitemap = set()
for f in glob.glob(os.path.join(ROOT, "public", "*-sitemap.xml")):
    sitemap |= set(re.findall(r"<loc>([^<]+)</loc>", open(f, encoding="utf-8").read()))
built = {SITE + p["route"] for p in pages.values()}
handled = built | {SITE + r["source"] for r in rd["redirects"]}
check("every sitemap URL has an Astro equivalent", not (sitemap - handled),
      "missing: %s" % sorted(sitemap - handled))

# --- no URL changed -----------------------------------------------------------
bad_slash = [p["route"] for p in pages.values() if not p["route"].endswith("/")]
check("every route keeps its trailing slash", not bad_slash, str(bad_slash))
check("every route is emitted as a directory index",
      all(os.path.isfile(os.path.join(DIST, p["route"].strip("/"), "index.html"))
          or p["route"] == "/" for p in pages.values()))

# --- canonicals ---------------------------------------------------------------
canon = [(f, s.find("link", rel="canonical")) for f, s in soups.items()]
check("every page has a canonical", all(c for _, c in canon))
bad_canon = [c["href"] for _, c in canon if c and not c["href"].startswith(SITE)]
check("no canonical points at a staging domain", not bad_canon, str(bad_canon[:5]))

# --- no staging / localhost leakage ------------------------------------------
leak = [os.path.relpath(f, DIST) for f, h in docs.items()
        if "localhost" in h or "127.0.0.1" in h or ".vercel.app" in h]
check("no staging or localhost URL in the generated HTML", not leak, str(leak[:5]))

# --- H1 ----------------------------------------------------------------------
h1s = {os.path.relpath(f, DIST): len(s.find_all("h1")) for f, s in soups.items()}
odd = {k: v for k, v in h1s.items() if v != 1}
live_odd = {"about-us/index.html": 2, "refund_returns/index.html": 0}
check("no page gained or lost an H1 relative to the live site",
      odd == live_odd, "found %s, live has %s" % (odd, live_odd))

# --- schema: compare against the live capture rather than a magic number ------
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import extract as E

def ld_types(html):
    out = collections.Counter()
    for m in re.finditer(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S):
        try:
            data = json.loads(m.group(1))
        except Exception:
            continue
        stack = [data]
        while stack:
            node = stack.pop()
            if isinstance(node, list):
                stack.extend(node)
            elif isinstance(node, dict):
                if "@type" in node:
                    out[str(node["@type"])] += 1
                stack.extend(node.values())
    return out

live_types, built_types = collections.Counter(), collections.Counter()
for slug, page in pages.items():
    live_file = os.path.join(E.LIVE, slug + ".html")
    live_types += ld_types(E.cf_decode(open(live_file, encoding="utf-8", errors="replace").read()))
    built = os.path.join(DIST, page["route"].strip("/"), "index.html") if page["route"] != "/" \
        else os.path.join(DIST, "index.html")
    built_types += ld_types(open(built, encoding="utf-8", errors="replace").read())
check("JSON-LD type counts identical to the live site", live_types == built_types,
      "live %s vs built %s" % (dict(live_types), dict(built_types)))
check("all 35 products keep Product schema", built_types["Product"] >= 35,
      "%d Product nodes" % built_types["Product"])

# --- tracking -----------------------------------------------------------------
missing_gtag = [os.path.relpath(f, DIST) for f, h in docs.items() if "AW-16676839357" not in h]
check("Google Ads tag on every page", not missing_gtag, str(missing_gtag[:5]))
missing_zopim = [os.path.relpath(f, DIST) for f, h in docs.items() if "zopim" not in h]
check("Zendesk Chat on every page", not missing_zopim, str(missing_zopim[:5]))
missing_ver = [os.path.relpath(f, DIST) for f, h in docs.items()
               if h.count("google-site-verification") < 2]
check("both google-site-verification tags on every page", not missing_ver, str(missing_ver[:5]))

# --- forms --------------------------------------------------------------------
form_pages = [f for f, s in soups.items() if s.find("form", class_="elementor-form")]
check("Elementor forms present", len(form_pages) >= 40, "%d pages" % len(form_pages))
file_inputs = [f for f, s in soups.items() if s.find("input", type="file")]
check("artwork upload field preserved", len(file_inputs) >= 36, "%d pages" % len(file_inputs))
captcha = [f for f, s in soups.items() if s.select_one(".elementor-g-recaptcha")]
check("reCAPTCHA checkbox preserved", len(captcha) >= 36, "%d pages" % len(captcha))

# --- robots / sitemaps --------------------------------------------------------
robots = open(os.path.join(DIST, "robots.txt"), encoding="utf-8").read()
check("robots.txt uses the production domain", "thetubepackaging.com" in robots
      and "localhost" not in robots)
check("sitemap index and all six child sitemaps shipped",
      len(glob.glob(os.path.join(DIST, "*-sitemap.xml"))) == 6
      and os.path.isfile(os.path.join(DIST, "sitemap_index.xml")))
sm_hosts = set()
for f in glob.glob(os.path.join(DIST, "*.xml")):
    sm_hosts |= set(re.findall(r"<loc>https?://([^/<]+)", open(f, encoding="utf-8").read()))
check("sitemaps only reference the production domain", sm_hosts == {"thetubepackaging.com"},
      str(sm_hosts))

# --- merchant signals ---------------------------------------------------------
prices = sum(h.count('"price":"0.3"') for h in docs.values())
check("product price present in schema on all products", prices >= 35, "%d" % prices)
check("availability present in schema on all products",
      built_types["Offer"] >= 35, "%d Offer nodes" % built_types["Offer"])
instock = sum(h.count("schema.org\\/InStock") + h.count("schema.org/InStock") for h in docs.values())
check("InStock availability preserved", instock >= 35, "%d" % instock)
skus = sum(1 for h in docs.values() if '"sku"' in h)
check("product SKUs preserved", skus >= 35, "%d pages" % skus)

# --- no WordPress source exposed ---------------------------------------------
bad_files = [os.path.relpath(f, DIST) for f in glob.glob(os.path.join(DIST, "**", "*"), recursive=True)
             if os.path.isfile(f) and re.search(r"\.(php|sql|csv|log)$|^\.htaccess$", os.path.basename(f))]
check("no PHP, SQL, CSV or log file in the build", not bad_files, str(bad_files[:5]))
nonce_leak = [os.path.relpath(f, DIST) for f, h in docs.items()
              if re.search(r'nonce[^>]{0,40}value="[0-9a-f]{8,}"', h)]
check("no live WordPress nonce in the build", not nonce_leak, str(nonce_leak[:5]))
ajax = [os.path.relpath(f, DIST) for f, h in docs.items() if "admin-ajax.php" in h]
check("no admin-ajax.php reference", not ajax, str(ajax[:5]))

print()
for ok, name, detail in results:
    print(("  PASS  " if ok else "  FAIL  ") + name + (("   -> " + detail) if not ok and detail else ""))
failed = sum(1 for ok, _, _ in results if not ok)
print("\n%d checks, %d passed, %d failed" % (len(results), len(results) - failed, failed))
sys.exit(1 if failed else 0)
