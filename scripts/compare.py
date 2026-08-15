#!/usr/bin/env python3
"""Phase 3 -- compare every live URL against its built Astro page.

Checks: HTTP status/path, title, meta description, canonical, robots, OG/Twitter,
H1-H3, JSON-LD schema, internal links, image src + alt, word count, forms,
tracking IDs.
"""
import os, re, sys, json, glob, difflib, collections
from bs4 import BeautifulSoup

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import extract as E

DIST = os.path.join(ROOT, "dist")
SITE = "https://thetubepackaging.com"


def parse(html):
    s = BeautifulSoup(html, "lxml")
    def meta(name=None, prop=None):
        t = s.find("meta", attrs={"name": name} if name else {"property": prop})
        return t.get("content") if t else None
    schema = []
    for sc in s.find_all("script", type="application/ld+json"):
        try:
            schema.append(json.loads(sc.string or "{}"))
        except Exception:
            schema.append({"PARSE_ERROR": (sc.string or "")[:80]})
    body = s.find("body")
    text_soup = BeautifulSoup(str(body), "lxml")
    for t in text_soup.find_all(["script", "style", "noscript"]):
        t.decompose()
    return {
        "title": s.title.get_text() if s.title else None,
        "description": meta(name="description"),
        "robots": meta(name="robots"),
        "canonical": (s.find("link", rel="canonical") or {}).get("href"),
        "og": {t.get("property"): t.get("content") for t in s.find_all("meta", property=True)},
        "twitter": {t.get("name"): t.get("content")
                    for t in s.find_all("meta", attrs={"name": re.compile("^twitter:")})},
        "verification": sorted(t.get("content") for t in
                               s.find_all("meta", attrs={"name": "google-site-verification"})),
        "h1": [h.get_text(" ", strip=True) for h in s.find_all("h1")],
        "h2": [h.get_text(" ", strip=True) for h in s.find_all("h2")],
        "h3": [h.get_text(" ", strip=True) for h in s.find_all("h3")],
        "h4": [h.get_text(" ", strip=True) for h in s.find_all("h4")],
        "schema": schema,
        "links": sorted({a["href"] for a in s.find_all("a", href=True)}),
        "images": sorted({(i.get("src") or "", i.get("alt") or "") for i in s.find_all("img")}),
        "srcsets": sorted({i.get("srcset") for i in s.find_all("img") if i.get("srcset")}),
        "stylesheets": [l.get("href") for l in s.find_all("link", rel="stylesheet")],
        "forms": [{"fields": sorted(
                      (i.get("name") or "", i.get("type") or i.name, i.has_attr("required"))
                      for i in f.find_all(["input", "textarea", "select"])),
                   "buttons": [b.get_text(" ", strip=True) for b in f.find_all("button")]}
                  for f in s.find_all("form")],
        "bodyClass": " ".join(body.get("class", [])) if body else "",
        "words": len(text_soup.get_text(" ", strip=True).split()),
        "text": text_soup.get_text(" ", strip=True),
        "tracking": sorted(set(re.findall(r"AW-\d+|G-[A-Z0-9]{6,}|GTM-[A-Z0-9]+", str(s)))),
        "zopim": "zopim" in str(s),
    }


def norm_asset(u):
    """Version query strings are WordPress cache-busters; ignore them."""
    return re.sub(r"\?ver=[^&\"']*", "", u or "")


# Differences that are deliberate, with the reason. Compared against the live
# *raw* HTML these show up as diffs; against what a visitor actually sees they
# are what makes the two match.
INTENTIONAL = {
    "cart": {
        "keys": {"h2", "words", "text"},
        "why": "the live page ships a WooCommerce Blocks skeleton containing a hidden "
               "'You may be interested in…' cross-sells heading, which the Blocks bundle "
               "removes when it hydrates an empty cart. The build bakes in the hydrated "
               "markup, so it matches the rendered page rather than the skeleton.",
    },
}


def main():
    report = collections.OrderedDict()
    pages = json.load(open(os.path.join(ROOT, "src", "data", "pages.json")))
    for slug, page in sorted(pages.items()):
        livef = os.path.join(E.LIVE, slug + ".html")
        route = page["route"]
        distf = os.path.join(DIST, route.strip("/"), "index.html") if route != "/" \
            else os.path.join(DIST, "index.html")
        if not os.path.exists(distf):
            report[slug] = {"MISSING_BUILD": distf}
            continue
        live = parse(E.cf_decode(open(livef, encoding="utf-8", errors="replace").read()))
        new = parse(open(distf, encoding="utf-8", errors="replace").read())
        diffs = {}
        for k in ("title", "description", "robots", "canonical", "og", "twitter",
                  "verification", "h1", "h2", "h3", "h4", "bodyClass", "tracking", "zopim"):
            if live[k] != new[k]:
                diffs[k] = {"live": live[k], "astro": new[k]}
        if json.dumps(live["schema"], sort_keys=True) != json.dumps(new["schema"], sort_keys=True):
            diffs["schema"] = {"live": live["schema"], "astro": new["schema"]}
        if live["links"] != new["links"]:
            diffs["links"] = {"only_live": [l for l in live["links"] if l not in new["links"]],
                              "only_astro": [l for l in new["links"] if l not in live["links"]]}
        if live["images"] != new["images"]:
            diffs["images"] = {"only_live": [i for i in live["images"] if i not in new["images"]],
                               "only_astro": [i for i in new["images"] if i not in live["images"]]}
        if live["srcsets"] != new["srcsets"]:
            diffs["srcsets"] = {"n_live": len(live["srcsets"]), "n_astro": len(new["srcsets"])}
        ls = [norm_asset(u) for u in live["stylesheets"]]
        ns = [norm_asset(u) for u in new["stylesheets"] if "/assets/ttp.css" not in (u or "")]
        if ls != ns:
            diffs["stylesheets"] = {"only_live": [u for u in ls if u not in ns],
                                    "only_astro": [u for u in ns if u not in ls]}
        if live["forms"] != new["forms"]:
            diffs["forms"] = {"live": live["forms"], "astro": new["forms"]}
        if live["words"] != new["words"]:
            diffs["words"] = {"live": live["words"], "astro": new["words"],
                              "delta": new["words"] - live["words"]}
        if live["text"] != new["text"]:
            sm = difflib.SequenceMatcher(None, live["text"], new["text"])
            ops = [o for o in sm.get_opcodes() if o[0] != "equal"]
            diffs["text"] = [{"op": o[0],
                              "live": live["text"][o[1]:o[2]][:200],
                              "astro": new["text"][o[3]:o[4]][:200]} for o in ops[:8]]
        exc = INTENTIONAL.get(slug)
        if exc and set(diffs) <= exc["keys"]:
            diffs = {"_intentional": exc["why"], **{k: v for k, v in diffs.items()}}
        report[slug] = diffs

    out = os.path.join(ROOT, "reports", "compare.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump(report, open(out, "w"), indent=1)
    clean = [s for s, d in report.items() if not d]
    intentional = [s for s, d in report.items() if "_intentional" in d]
    print("identical pages: %d / %d" % (len(clean), len(report)))
    if intentional:
        print("intentional differences: %d (%s)" % (len(intentional), ", ".join(intentional)))
        for s in intentional:
            print("   %s: %s" % (s, report[s]["_intentional"]))
    counts = collections.Counter(k for d in report.values() for k in d if k != "_intentional")
    for k, v in counts.most_common():
        print("  %-14s %d pages" % (k, v))


if __name__ == "__main__":
    main()
