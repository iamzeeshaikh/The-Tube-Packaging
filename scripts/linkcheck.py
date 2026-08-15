#!/usr/bin/env python3
"""Crawl the production build and resolve every internal link, image, stylesheet
and script against the files on disk (plus the host redirects/rewrites)."""
import os, re, json, sys, glob, urllib.parse, collections
from bs4 import BeautifulSoup

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")
SITE = "https://thetubepackaging.com"
rd = json.load(open(os.path.join(ROOT, "src/data/redirects.json")))
REDIRECTS = {r["source"]: r["destination"] for r in rd["redirects"]}
REWRITES = {r["source"]: r["destination"] for r in rd["rewrites"]}


def resolves(p):
    """True if the production host would answer 200 for this path."""
    p = urllib.parse.unquote(p.split("#")[0].split("?")[0])
    if p in REWRITES:
        p = REWRITES[p]
    if not p.startswith("/"):
        return False
    target = os.path.join(DIST, p.lstrip("/"))
    if os.path.isfile(target):
        return True
    if os.path.isfile(os.path.join(target, "index.html")):
        return True
    return False


def main():
    broken = collections.defaultdict(list)
    external = collections.Counter()
    checked = 0
    for f in glob.glob(os.path.join(DIST, "**", "*.html"), recursive=True):
        page = "/" + os.path.relpath(f, DIST).replace("index.html", "")
        s = BeautifulSoup(open(f, encoding="utf-8", errors="replace").read(), "lxml")
        urls = []
        for a in s.find_all("a", href=True):
            urls.append(a["href"])
        for t in s.find_all(["img", "script"], src=True):
            urls.append(t["src"])
        for t in s.find_all("link", href=True):
            urls.append(t["href"])
        for t in s.find_all("img", srcset=True):
            urls += [c.strip().split()[0] for c in t["srcset"].split(",") if c.strip()]
        for u in urls:
            checked += 1
            if u.startswith(("mailto:", "tel:", "javascript:", "#", "data:")):
                continue
            if u.startswith(SITE):
                u = u[len(SITE):] or "/"
            elif u.startswith("http"):
                external[urllib.parse.urlparse(u).netloc] += 1
                continue
            # query strings are WooCommerce cart actions / cache busters; the
            # path is what has to resolve
            u = u.split("#")[0].split("?")[0] or "/" 
            if u in REDIRECTS:
                continue
            if not u.startswith("/"):
                u = os.path.normpath(os.path.join(page, u))
            if not resolves(u):
                broken[u].append(page)

    print("references checked:", checked)
    print("distinct broken targets:", len(broken))
    for u, pages in sorted(broken.items()):
        print("  %-70s  <- %d page(s) e.g. %s" % (u[:70], len(pages), pages[0]))
    print("\nexternal hosts:")
    for h, n in external.most_common():
        print("  %-40s %d" % (h, n))
    json.dump({"broken": {k: v for k, v in broken.items()},
               "external": dict(external)},
              open(os.path.join(ROOT, "reports", "links.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
