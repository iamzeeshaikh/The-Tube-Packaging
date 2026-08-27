import pages from '../data/pages.json';

/**
 * Build a page record for an editorial page WordPress never served, out of the
 * captured /about-us/ record — a plain, indexable, schema-free page — so the
 * new page carries exactly the same head, chrome, scripts and body classes as
 * the rest of the site. Only the page's identity is swapped.
 *
 * /about-us/ is the base rather than /cart/ (which the cart-flow pages borrow)
 * because /cart/ is `noindex` and carries WooCommerce body classes.
 */
export function contentPage({ route, title, description, crumb, postId }) {
  const base = pages['about-us'];
  const url = 'https://thetubepackaging.com' + route;
  let head = base.head
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`);

  // /about-us/ ships no meta description; add one, next to the canonical.
  head = head.replace(/(<link rel="canonical" href="[^"]*" \/>)/,
    `$1\n\t<meta name="description" content="${description}" />`);
  // and drop its own reading-time card values, which describe that page
  head = head.replace(/\s*<meta name="twitter:label1"[^>]*>/, '')
             .replace(/\s*<meta name="twitter:data1"[^>]*>/, '');

  return {
    ...base,
    route,
    url,
    head,
    bodyClass: base.bodyClass.replace(/\bpage-id-\d+\b/, `page-id-${postId}`),
    // `content` on this record is never rendered — Shell.astro uses a slot — so
    // give the breadcrumb builder the trail explicitly rather than letting it
    // read /about-us/'s H1.
    crumbs: [
      { name: 'Home', url: 'https://thetubepackaging.com/' },
      { name: crumb, url },
    ],
  };
}
