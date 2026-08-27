#!/usr/bin/env python3
"""Remove the pasted AI-chat interface markup from the page content.

Two different assistants' UI markup was pasted into this site over time. Both are
handled here, because the defect and the fix are the same.

reports/owner-decisions.md item 9 recorded this as seven FAQ panels carrying
wrapper divs. A full census across all 66 page records found it is wider than
that: **40 pages**, in three flavours.

  wrapper elements      135   nested ChatGPT layout divs and <article> turns
  turn/message attrs     39   data-turn-id, data-testid="conversation-turn-N",
                              data-message-author-role, data-message-id
  data-start/data-end  3,980   on <p>, <h3>, <strong> and <br> — 67,267 bytes

The wrapper elements are unwrapped, keeping every child, and the attributes are
deleted. Nothing in the site's JavaScript or CSS references any of them, checked
before writing this.

Safety: for every page the visible text is extracted before and after and must
match character for character, and the count of headings, paragraphs, links,
images and list items must be unchanged. The script aborts on any difference.
"""
import json, re, sys, pathlib, html as htmlmod

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / 'src/data/pages.json'

# Attribute substrings only ChatGPT's UI emits.
#
# Only <div> and <article> are ever unwrapped. An earlier version unwrapped any
# element carrying a marker, and the safety guard caught it destroying two real
# <table>s on /5-ways-large-cardboard-tubes-boost-product-protection/ whose class
# happened to contain `min-w-(--thread-content-width)`. Content elements get
# their ChatGPT class tokens cleaned instead, never their structure removed.
UNWRAPPABLE = {'div', 'article'}

WRAPPER = re.compile(
    r'--composer-overlap-px|thread-xl:|thread-lg:|thread-sm:|text-token-text-primary'
    r'|--thread-content-|scrollbar-gutter:stable|markdown prose|has-data-writing-block'
    r'|text-message|data-turn-id=|data-testid="conversation-turn'
    r'|group/conversation-turn|agent-turn'
    r'|data-message-author-role=|data-scroll-anchor=')

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
        'meta', 'param', 'source', 'track', 'wbr'}

TAG = re.compile(r'<(/?)([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|\'[^\']*\'|[^>"\'])*?)(/?)>')

ATTRS = re.compile(
    r'\s+data-(?:start|end|turn-id|turn|message-id|message-author-role|message-model-slug'
    r'|scroll-anchor|testid|col-size)="[^"]*"')

# ChatGPT class tokens left on real content elements — a <table> that carries
# `min-w-(--thread-content-width)`, for instance. The token is removed; the
# element is not.
CLASS_TOKEN = re.compile(
    r'(?:^|(?<=\s))(?:[^\s"]*(?:'
    # ChatGPT
    r'--thread-content-|--composer-overlap-px|thread-xl:|thread-lg:|thread-sm:'
    r'|text-token-text-primary|has-data-writing-block|scrollbar-gutter:stable'
    # Claude — pasted into the cosmetic blog guide
    r'|text-text-\d|border-border-\d|border-t-border-\d|bg-bg-\d|font-claude'
    r'|font-styrene|font-tiempos|text-oncolor-|shadow-element'
    r'|hsla\(var\(--border-|:not\(:first-child\)'
    r')[^\s"]*)')


def clean_classes(doc):
    def fix(m):
        cleaned = re.sub(r'\s+', ' ', CLASS_TOKEN.sub('', m.group(2))).strip()
        return '' if not cleaned else f'{m.group(1)}class="{cleaned}"'
    return re.sub(r'(\s)class="([^"]*)"',
                  lambda m: fix(m) if CLASS_TOKEN.search(m.group(2)) else m.group(0), doc)


def unwrap_once(doc):
    """Unwrap the first element whose opening tag carries a ChatGPT marker."""
    for m in TAG.finditer(doc):
        closing, name, attrs, selfclose = m.group(1), m.group(2).lower(), m.group(3), m.group(4)
        if (closing or selfclose or name not in UNWRAPPABLE
                or not WRAPPER.search(attrs)):
            continue
        # walk forward to the matching close tag
        depth = 0
        for n in TAG.finditer(doc, m.start()):
            nclose, nname, nattrs, nself = n.group(1), n.group(2).lower(), n.group(3), n.group(4)
            if nname != name or nself or nname in VOID:
                continue
            depth += -1 if nclose else 1
            if depth == 0:
                return doc[:m.start()] + doc[m.end():n.start()] + doc[n.end():], True
        # no matching close: drop the opening tag only, rather than guess
        return doc[:m.start()] + doc[m.end():], True
    return doc, False


def text_of(doc):
    t = re.sub(r'<(script|style)\b[\s\S]*?</\1>', ' ', doc, flags=re.I)
    t = re.sub(r'<!--[\s\S]*?-->', ' ', t)
    t = re.sub(r'<[^>]*>', ' ', t)
    return re.sub(r'\s+', ' ', htmlmod.unescape(t)).strip()


def census(doc):
    return {tag: len(re.findall(rf'<{tag}\b', doc, re.I))
            for tag in ('h1', 'h2', 'h3', 'h4', 'p', 'a', 'img', 'li', 'table', 'form', 'script')}


pages = json.loads(PAGES.read_text())
changed = unwrapped = attrs_removed = 0

for key, page in pages.items():
    before = page['content']
    if not (WRAPPER.search(before) or ATTRS.search(before)
            or CLASS_TOKEN.search(before)):
        continue

    after, n = before, 0
    while True:
        after, did = unwrap_once(after)
        if not did:
            break
        n += 1
        if n > 500:
            sys.exit(f"{page['route']}: unwrap did not converge — aborting")

    removed = len(ATTRS.findall(after))
    after = ATTRS.sub('', after)
    after = clean_classes(after)

    if text_of(before) != text_of(after):
        sys.exit(f"{page['route']}: visible text changed — aborting, nothing written")
    if census(before) != census(after):
        b, a = census(before), census(after)
        diff = {k: (b[k], a[k]) for k in b if b[k] != a[k]}
        sys.exit(f"{page['route']}: element census changed {diff} — aborting, nothing written")

    if after != before:
        page['content'] = after
        changed += 1
        unwrapped += n
        attrs_removed += removed
        print(f"  {page['route']:52} unwrapped {n:3}  attrs -{removed}")

if not changed:
    sys.exit('nothing to strip')

PAGES.write_text(json.dumps(pages, ensure_ascii=False))
print(f"\n{changed} pages cleaned | {unwrapped} elements unwrapped | "
      f"{attrs_removed} attributes removed")
