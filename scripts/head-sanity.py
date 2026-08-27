#!/usr/bin/env python3
"""Guard against the class of bug that put a visible "/>" on eight pages.

A head that contains a bare text node is a head with a malformed tag in it — the
browser closes <head> at that point and renders the fragment as page content.
Nothing except <title> should produce text in the head.

Also checks the singleton head elements are singletons.
"""
import re, glob, os, sys, html as htmlmod
from collections import Counter

fails = 0
for f in sorted(glob.glob('dist/**/index.html', recursive=True)):
    route = '/' + os.path.relpath(os.path.dirname(f), 'dist').replace('.', '').strip('/')
    route = (route.rstrip('/') + '/').replace('//', '/')
    doc = open(f, encoding='utf-8').read()
    end = doc.find('</head>')
    if end < 0:
        print(f'FAIL {route}: no </head>'); fails += 1; continue
    head = doc[:end]

    stripped = re.sub(r'<(script|style|title|noscript)\b[\s\S]*?</\1>', '', head, flags=re.I)
    stripped = re.sub(r'<!--[\s\S]*?-->', '', stripped)
    for m in re.finditer(r'>([^<]+)<', stripped):
        text = htmlmod.unescape(m.group(1)).strip()
        if text:
            print(f'FAIL {route}: stray text in <head>: {text[:60]!r}')
            fails += 1

    for tag, pat in (('title', r'<title>'), ('canonical', r'<link rel="canonical"'),
                     ('og:title', r'<meta property="og:title"'),
                     ('description', r'<meta name="description"')):
        n = len(re.findall(pat, head))
        if n > 1:
            print(f'FAIL {route}: {n} {tag} elements'); fails += 1

    if '/> />' in head or '/>/>' in head:
        print(f'FAIL {route}: duplicated tag terminator'); fails += 1

print(f'\n{len(glob.glob("dist/**/index.html", recursive=True))} pages checked')
print(f'FAILURES: {fails}' if fails else 'every head is well formed')
sys.exit(1 if fails else 0)
