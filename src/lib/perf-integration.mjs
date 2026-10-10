/*
 * Load-order fixes applied to the emitted HTML.
 *
 * Measured on a throttled mobile run (Lighthouse, 2026-10-10): home LCP 9-10s,
 * product pages ~8s, although the LCP image itself took ~0.3s. Nearly all of
 * the time was the page waiting to render:
 *
 *  - 25-35 render-blocking stylesheets in the head, one request each;
 *  - jQuery, jQuery Migrate and three more theme scripts loaded synchronously,
 *    two of them in the head;
 *  - three gtag.js copies (~470KB) and Clarity fetched during load;
 *  - three files the replay never shipped (the gitignore's bare `dist/` skips
 *    every `.../dist/...` path), requested on every page and answered 404.
 *
 * Working on the finished HTML keeps the captured page records untouched and
 * covers both templates ([...path].astro and Shell.astro) in one place.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const SITE = 'https://thetubepackaging.com';

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

// a same-origin URL as a path in the build output, or null
function localPath(url) {
  if (url.startsWith(SITE + '/')) url = url.slice(SITE.length);
  else if (!url.startsWith('/') || url.startsWith('//')) return null;
  return url.split(/[?#]/)[0];
}

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}=(["'])([^"']*)\\1`, 'i'))?.[2];

const STYLESHEET = /<link\b[^>]*\brel=["']stylesheet["'][^>]*>/gi;
const SCRIPT_SRC = /<script\b[^>]*\bsrc=["'][^"']+["'][^>]*>\s*<\/script>/gi;

// 1. References to files the build does not contain. They have 404ed since the
// migration, so removing them changes nothing a visitor sees.
function dropMissing(html, dist, missing) {
  const gone = (tag, url) => {
    const p = url && localPath(url);
    if (!p || existsSync(join(dist, p))) return false;
    missing.add(p);
    return true;
  };
  return html
    .replace(STYLESHEET, (tag) => (gone(tag, attr(tag, 'href')) ? '' : tag))
    .replace(SCRIPT_SRC, (tag) => (gone(tag, attr(tag, 'src')) ? '' : tag));
}

// 2. Analytics after the page is up: on the first interaction, or three
// seconds after load. The inline gtag() stubs stay where they are, so every
// config call and event made before then is queued in dataLayer and sent
// when gtag.js arrives.
const LATER_LOADER = `<script>
(function () {
  var done = false;
  function go() {
    if (done) return;
    done = true;
    document.querySelectorAll('script[data-ttp-later]').forEach(function (old) {
      var s = document.createElement('script');
      if (old.dataset.src) { s.src = old.dataset.src; s.async = true; }
      else s.text = old.text;
      old.replaceWith(s);
    });
  }
  ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(function (e) {
    window.addEventListener(e, go, { once: true, passive: true });
  });
  function later() { setTimeout(go, 3000); }
  if (document.readyState === 'complete') later();
  else window.addEventListener('load', later, { once: true });
}());
</script>`;

function deferAnalytics(html) {
  let n = 0;
  html = html.replace(
    /<script async src="(https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^"]+)"><\/script>/g,
    (_, src) => (n++, `<script type="text/plain" data-ttp-later data-src="${src}"></script>`),
  );
  // Clarity's own snippet injects its tag immediately
  html = html.replace(
    /<script type="text\/javascript">(\s*\(function\(c,l,a,r,i,t,y\)\{[\s\S]*?\}\)\(window, document, "clarity"[\s\S]*?)<\/script>/,
    (_, code) => (n++, `<script type="text/plain" data-ttp-later>${code}</script>`),
  );
  return n ? html.replace('</head>', `${LATER_LOADER}\n</head>`) : html;
}

// 3. Same-origin scripts deferred. Deferred scripts keep their document order
// and all run before DOMContentLoaded, so jQuery still precedes everything
// that needs it. The only inline script that calls jQuery while the page is
// parsing (the home page product grid) is moved to DOMContentLoaded.
function deferScripts(html) {
  html = html.replace(/<script\b([^>]*)\bsrc=(["'])([^"']+)\2([^>]*)>/gi, (tag, a, q, src, b) => {
    const attrs = a + b;
    if (/\b(defer|async)\b|type=["'](module|text\/plain)/i.test(attrs) || !localPath(src)) return tag;
    return tag.replace(/>$/, ' defer>');
  });
  return html.replace(/<script\b(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi, (tag, attrs, code) => {
    if (/type=["'](application\/ld\+json|text\/plain)/i.test(attrs) || !/\bjQuery\b/.test(code)) return tag;
    return `<script${attrs}>document.addEventListener('DOMContentLoaded', function () {${code}});</script>`;
  });
}

// 4. The head's stylesheets as one file. Everything from the first linked
// stylesheet to the last -- inline <style> blocks between them included --
// goes into the bundle in document order, so the cascade is unchanged.
// url() references are made root-relative because the rules move to a new
// file. Bundles are content-hashed; the 81 pages share about a dozen.
function rebase(css, base) {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (whole, q, ref) => {
    if (/^(data:|https?:|\/|#)/i.test(ref)) return whole;
    const u = new URL(ref, base);
    return `url(${q}${u.origin === SITE ? u.pathname + u.search + u.hash : u.href}${q})`;
  });
}

function bundleCss(html, dist, pageUrl, written) {
  const end = html.indexOf('</head>');
  if (end < 0) return html;
  const head = html.slice(0, end);
  const parts = [...head.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*>|<style\b([^>]*)>([\s\S]*?)<\/style>/gi)];
  const links = parts.filter((m) => m[0].startsWith('<link'));
  if (links.length < 2) return html;
  const from = parts.indexOf(links[0]);
  const to = parts.indexOf(links[links.length - 1]);
  const run = parts.slice(from, to + 1);

  const chunks = [];
  for (const m of run) {
    const tag = m[0];
    const isLink = tag.startsWith('<link');
    const media = attr(tag, 'media');
    let css;
    if (isLink) {
      const href = attr(tag, 'href');
      const p = href && localPath(href);
      if (!p || !existsSync(join(dist, p))) return html;
      css = rebase(readFileSync(join(dist, p), 'utf8'), SITE + p);
    } else {
      css = rebase(m[2], pageUrl);
    }
    css = css.replace(/^﻿/, '').replace(/@charset\s+["'][^"']*["'];?/gi, '');
    if (/@import\b/i.test(css)) return html;
    chunks.push(media && media !== 'all' ? `@media ${media}{\n${css}\n}` : css);
  }

  const body = chunks.join('\n');
  const name = createHash('sha1').update(body).digest('hex').slice(0, 12);
  if (!written.has(name)) {
    mkdirSync(join(dist, 'assets/css'), { recursive: true });
    writeFileSync(join(dist, 'assets/css', `${name}.css`), body);
    written.add(name);
  }

  let out = '';
  let pos = 0;
  run.forEach((m, i) => {
    out += head.slice(pos, m.index);
    if (i === 0) out += `<link rel="stylesheet" id="ttp-bundle-css" href="/assets/css/${name}.css" media="all" />`;
    pos = m.index + m[0].length;
  });
  return out + head.slice(pos) + html.slice(end);
}

// 5. A WebP <source> for an <img> whose every candidate has a .webp sibling in
// the build. Only the renditions made for it qualify, so this touches nothing
// else -- today, the home page's 303KB standard-vs-eco PNG (30KB as WebP).
// The source repeats the full srcset: a single WebP candidate would beat the
// img srcset on every screen and serve one size to all of them.
const webpOf = (p) => p.replace(/\.(png|jpe?g)$/i, '.webp');

function webpSources(html, dist) {
  return html.replace(/<img\b[^>]*>/gi, (tag, offset) => {
    const src = attr(tag, 'src');
    const p = src && localPath(src);
    if (!p || !/\.(png|jpe?g)$/i.test(p)) return tag;
    if (/<source\b[^>]*>\s*$/i.test(html.slice(Math.max(0, offset - 2000), offset))) return tag;
    const srcset = attr(tag, 'srcset');
    const cands = srcset ? srcset.split(',').map((c) => c.trim().split(/\s+/)) : [];
    const all = [p, ...cands.map(([u]) => localPath(u))];
    if (all.some((c) => !c || !existsSync(join(dist, webpOf(c))))) return tag;
    const set = srcset
      ? cands.map(([u, w]) => `${webpOf(u)}${w ? ' ' + w : ''}`).join(', ')
      : webpOf(src);
    const sizes = attr(tag, 'sizes');
    return `<picture><source type="image/webp" srcset="${set}"${sizes ? ` sizes="${sizes}"` : ''}>${tag}</picture>`;
  });
}

export function perfFixes() {
  return {
    name: 'ttp-perf',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const missing = new Set();
        const written = new Set();
        const files = walk(dist);
        for (const file of files) {
          const route = '/' + relative(dist, dirname(file)).split(sep).join('/');
          const pageUrl = SITE + (route === '/' ? '/' : route + '/');
          let html = readFileSync(file, 'utf8');
          if (!html.includes('</head>')) continue;
          html = dropMissing(html, dist, missing);
          html = deferAnalytics(html);
          html = deferScripts(html);
          html = webpSources(html, dist);
          html = bundleCss(html, dist, pageUrl, written);
          writeFileSync(file, html);
        }
        if (missing.size) logger.info(`dropped references to missing files: ${[...missing].join(', ')}`);
        logger.info(`${files.length} pages, ${written.size} stylesheet bundles`);
      },
    },
  };
}
