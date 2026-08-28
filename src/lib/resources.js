/*
 * Guides and articles.
 *
 * Eight posts were published, but the archive markup captured from WordPress
 * lists only six -- it is a frozen snapshot, so anything published after the
 * capture never appeared, and nothing linked to the archive at all. The list is
 * therefore rebuilt here from the post sitemap and the pages themselves, so it
 * cannot drift again, and an entry point is added to the footer and the
 * off-canvas menu.
 *
 * The desktop header is deliberately left alone: adding an item to it makes the
 * theme's sticky-header script insert a 746px gap on every page.
 */
// bundled by Vite at build time; reading it from disk resolves relative to the
// emitted chunk, not to the project, and fails during the build
import postSitemap from '../../public/post-sitemap.xml?raw';
import pages from '../data/pages.json' with { type: 'json' };
import { ARTICLES } from './copy/blog/index.js';

const SITE = 'https://thetubepackaging.com';
const ARCHIVE = '/category/information/';
const list = Array.isArray(pages) ? pages : Object.values(pages);
const byRoute = new Map(list.map((p) => [p.route, p]));

const text = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ').trim();

function decode(s) {
  return s.replace(/&#0?38;|&amp;/g, '&').replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8211;|&ndash;/g, '–').replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'");
}

function meta(head, prop) {
  const m = new RegExp(`<meta[^>]+(?:property|name)="${prop}"[^>]+content="([^"]*)"`)
    .exec(head || '');
  return m ? m[1] : '';
}

// the post sitemap is what Yoast published and what Google was given, so it is
// the authority on which pages are posts -- not the archive markup
function postRoutes() {
  return [...postSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(SITE, ''))
    .filter((r) => byRoute.has(r));
}

// the articles written for this site are not in the WordPress post sitemap, so
// they are merged in here and sorted with the rest by date
function nativePosts() {
  return ARTICLES.map((a) => {
    const d = new Date(a.published + 'T00:00:00Z');
    return {
      route: a.route,
      title: a.h1,
      excerpt: a.excerpt,
      iso: a.published + 'T00:00:00+00:00',
      image: a.image || '',
      alt: a.h1,
      date: d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
      time: d.getTime(),
    };
  });
}

let cache = null;
export function posts() {
  if (cache) return cache;
  cache = postRoutes().map((route) => {
    const p = byRoute.get(route);
    const head = p.head || '';
    const content = p.content || '';
    const title = decode((/<title>([^<]*)<\/title>/.exec(head) || [, ''])[1]
      .replace(/\s*[-|]\s*The Tube Packaging\s*$/, '').trim());
    const img = /<img[^>]+src="([^"]*wp-content\/uploads[^"]*)"/.exec(content);
    const alt = img ? (/<img[^>]+alt="([^"]*)"/.exec(img[0]) || [, title])[1] : title;
    // The first paragraph of several posts is the page header repeated -- the
    // breadcrumb label and the title, twice -- so a paragraph is only prose if
    // it does not simply restate the title.
    const bare = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const titleWords = bare(title);
    let excerpt = '';
    for (const m of content.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)) {
      const t = decode(text(m[1]));
      if (t.length < 90) continue;
      if (bare(t).includes(titleWords)) continue;
      excerpt = t; break;
    }
    if (excerpt.length > 190) excerpt = excerpt.slice(0, 187).replace(/\s+\S*$/, '') + '…';
    const iso = meta(head, 'article:published_time') || meta(head, 'article:modified_time');
    const d = iso ? new Date(iso) : null;
    return {
      route, title, excerpt, iso,
      image: img ? img[1] : '',
      alt: decode(alt || title),
      date: d ? d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
      time: d ? d.getTime() : 0,
    };
  }).concat(nativePosts()).sort((a, b) => b.time - a.time);
  return cache;
}

function card(p) {
  const figure = p.image
    ? `<figure class="rishi-featured-image image-contain">`
      + `<a class="post-thumbnail" href="${SITE}${p.route}" tabindex="-1" aria-hidden="true">`
      + `<img loading="lazy" decoding="async" src="${p.image}" alt="${p.alt}" width="1920" height="1080" /></a></figure>`
    : '';
  return `<article class="post type-post status-publish format-standard has-post-thumbnail hentry category-information rishi-post ttp-res__card">
  <div class="blog-post-lay"><div class="post-content"><div class="entry-content-main-wrap">
    ${figure}
    <div class="post-meta-inner"><span class="cat-links meta-common dot"><a href="${SITE}${ARCHIVE}" rel="category tag">Guides</a></span></div>
    <h2 class="entry-title"><a href="${SITE}${p.route}" rel="bookmark">${p.title}</a></h2>
    <div class="post-meta-wrapper"><div class="post-meta-inner dot" data-position="First">
      <span class="posted-on meta-common"><time class="entry-date published" datetime="${p.iso}">${p.date}</time></span>
    </div></div>
    <div class="entry-content"><p>${p.excerpt}</p></div>
    <div class="rishi-read-more-wrap"><a class="rishi-read-more ttp-res__more" href="${SITE}${p.route}">Read the guide</a></div>
  </div></div></div>
</article>`;
}

// rebuild the archive listing so every published post appears
export function rebuildArchive(page) {
  if (page.route !== ARCHIVE) return page.content;
  const all = posts();
  const html = page.content;
  const start = html.indexOf('<article');
  const end = html.lastIndexOf('</article>');
  if (start === -1 || end === -1) return html;
  return html.slice(0, start)
    + `<div class="ttp-res__grid">${all.map(card).join('\n')}</div>`
    + html.slice(end + '</article>'.length)
      // the theme prints the old hard-coded result count above the list
      .replace(/(\d+)(\s*Results)/, `${all.length}$2`);
}

export function archiveResultCount(html, route) {
  if (route !== ARCHIVE) return html;
  return html.replace(/>\s*\d+\s+Results\s*</, `>${posts().length} Results<`)
    .replace(/(<h1[^>]*class="[^"]*category-title[^"]*"[^>]*>)\s*Information\s*(<\/h1>)/,
      '$1Tube Packaging Guides &amp; Articles$2');
}

// The byline printed the owner's personal Gmail address on 50 pages. The same
// address is also the author name inside the Review JSON-LD on 49 pages; that
// is left alone -- renaming a reviewer would be inventing who wrote the review,
// and the review schema itself must not be touched.
export function brandByline(html) {
  return html
    // the byline linked to /author/shanimazhar82gmail-com/, so the address was
    // in the href too; the target is noindex, so the link is dropped entirely
    .replace(/<a\b[^>]*href="[^"]*\/author\/[^"]*"[^>]*>([\s\S]*?)<\/a>/g, '$1')
    .replace(/shanimazhar82@gmail\.com/g, 'The Tube Packaging');
}

const RESOURCE_LINKS = [
  ['Resources &amp; Guides', '/resources/'],
  ['Guides &amp; Articles', ARCHIVE],
  ['Tube Size Guide', '/tube-size-guide/'],
  ['Design Your Tube Packaging', '/design-your-tube-packaging/'],
];

// footer patches happen here rather than in chrome.json: region() replaces tags
// by index, so inserting markup there shifts every index in each chromeDiff
export function footerResources(html) {
  if (html.includes('ttp-res__footer')) return html;
  const items = RESOURCE_LINKS.map(([label, href], i) =>
    `<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-ttpres${i}">`
    + `<a href="${SITE}${href}">${label}</a></li>`).join('\n');
  const widget = `<section class="widget widget_nav_menu ttp-res__footer">`
    + `<h2 class="widget-title">Resources</h2><div class="menu-footer-3-container">`
    + `<ul id="menu-footer-3" class="menu">${items}</ul></div></section>`;
  return html.replace('<section id="nav_menu-7"', widget + '<section id="nav_menu-7"');
}

export function offcanvasResources(html) {
  if (html.includes('menu-item-ttpres')) return html;
  const items = RESOURCE_LINKS.slice(0, 3).map(([label, href], i) =>
    `<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-ttpres${i}">`
    + `<a href="${SITE}${href}">${label}</a></li>`).join('\n');
  const anchor = `<li id="menu-item-ttpcfg"`;
  return html.includes(anchor) ? html.replace(anchor, items + anchor)
    : html.replace(/<\/ul>\s*<\/div>\s*<\/nav>/, items + '</ul></div></nav>');
}

// the theme sizes .entry-title for a single-column blog roll, so these rules are
// repeated-class specific to win without !important
export const resourcesCss = `
.ttp-res__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,290px),1fr));gap:28px;align-items:stretch}
.ttp-res__card.ttp-res__card{margin:0;display:flex}
.ttp-res__card .blog-post-lay{display:flex;width:100%}
.ttp-res__card .post-content{display:flex;flex-direction:column;width:100%}
.ttp-res__card .entry-content-main-wrap{display:flex;flex-direction:column;height:100%;background:#fff;border:1px solid #e7ecf5;border-radius:14px;overflow:hidden}
.ttp-res__card .rishi-featured-image{margin:0;overflow:hidden}
.ttp-res__card .rishi-featured-image img{width:100%;height:180px;object-fit:cover;display:block}
.ttp-res__card .post-meta-inner{padding:16px 18px 0}
.ttp-res__card .cat-links a{font-size:12px;letter-spacing:.04em;text-transform:uppercase;font-weight:600}
.ttp-res__card .entry-title.entry-title.entry-title{font-size:19px;line-height:1.35;margin:8px 0 6px;padding:0 18px;font-weight:700}
.ttp-res__card .post-meta-wrapper{padding:0 18px}
.ttp-res__card .post-meta-wrapper .posted-on{font-size:13px;opacity:.7}
.ttp-res__card .entry-content{padding:10px 18px 0;flex:1 1 auto}
.ttp-res__card .entry-content p{font-size:15px;line-height:1.6;margin:0}
.ttp-res__card .rishi-read-more-wrap{padding:14px 18px 18px}
.ttp-res__more{display:inline-block;font-weight:600}
@media (max-width:600px){.ttp-res__grid{gap:20px}}
`;
