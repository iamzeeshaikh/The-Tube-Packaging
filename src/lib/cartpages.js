import pages from '../data/pages.json';

/**
 * Build a page record for a cart-flow page out of the captured /cart/ record,
 * so checkout and order-received carry exactly the same head, body classes and
 * chrome as the page WordPress did serve. Only the identity of the page --
 * title, canonical, og:url, body page-id class -- is swapped.
 */
export function cartFlowPage({ route, title, bodyClasses }) {
  const cart = pages.cart;
  const url = 'https://thetubepackaging.com' + route;
  const head = cart.head
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`);

  return {
    ...cart,
    route,
    url,
    head,
    // the cart page's own WooCommerce body classes describe the cart; swap the
    // ones that name the page
    bodyClass: cart.bodyClass
      .replace(/\bpage-id-\d+\b/, '')
      .replace(/\bwoocommerce-cart\b/, bodyClasses)
      .replace(/\s+/g, ' ')
      .trim(),
  };
}
