#!/usr/bin/env python3
"""Fetch every live URL, bypassing the host's page cache.

SiteGround serves stale HTML for some URLs (an older Rishi build), so every
request carries a throwaway query parameter. WordPress echoes that parameter
back into a handful of links, so it is removed again afterwards -- carefully,
because `/?tok&add-to-cart=116` must come back as `/?add-to-cart=116`, not
`/&add-to-cart=116`.
"""
import os, re, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "crawl")
URLS = os.path.join(HERE, "urls.txt")
TOKEN = "ttpnc=1908773311"
AMP = r"(?:&#038;|&)"


def strip_token(html):
    # `?tok&rest` -> `?rest`
    html = re.sub(r"\?" + re.escape(TOKEN) + AMP, "?", html)
    # `&tok` / `&#038;tok` -> ``
    html = re.sub(AMP + re.escape(TOKEN), "", html)
    # `?tok` on its own -> ``
    html = html.replace("?" + TOKEN, "")
    return html


def main():
    os.makedirs(OUT, exist_ok=True)
    urls = [u.strip() for u in open(URLS) if u.strip()]
    bad = []
    for url in urls:
        slug = url.replace("https://thetubepackaging.com/", "").rstrip("/").replace("/", "__") or "__home"
        sep = "&" if "?" in url else "?"
        raw = subprocess.run(
            ["curl", "-s", "--compressed", "--max-time", "120", url + sep + TOKEN],
            capture_output=True).stdout.decode("utf-8", "replace")
        cleaned = strip_token(raw)
        left = cleaned.count(TOKEN)
        open(os.path.join(OUT, slug + ".html"), "w").write(cleaned)
        flag = "  <-- CACHE-BUSTER SURVIVED" if left else ""
        short = "  <-- SHORT RESPONSE" if len(cleaned) < 50000 else ""
        if left or short:
            bad.append(slug)
        print("%-52s %8d bytes%s%s" % (slug, len(cleaned), flag, short))
        time.sleep(1.5)
    print("\nproblem pages:", bad or "none")


if __name__ == "__main__":
    main()
