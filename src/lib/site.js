export const PROD_ORIGIN = 'https://thetubepackaging.com';

// Absolute URLs are carried over from WordPress verbatim. A QA build
// (SITE_ORIGIN=http://localhost:PORT) points them at the local server instead
// so the copy can be screenshotted and crawled without touching the live site.
export const ORIGIN = process.env.SITE_ORIGIN || PROD_ORIGIN;

export function rewrite(html) {
  if (ORIGIN === PROD_ORIGIN || !html) return html;
  return html.split(PROD_ORIGIN).join(ORIGIN);
}

// Elementor Pro loaded Google's reCAPTCHA API on every page carrying a form.
// That is 1.4 MB of third-party JavaScript — recaptcha__en.js is 344 KB and is
// fetched once per frame, four times in practice — none of which is needed
// until someone starts filling a form in. ttp.js now loads it on the first
// interaction with a form instead, so the eager tag is removed from the
// captured markup at build time.
const EAGER_RECAPTCHA =
  /<script[^>]*src="https:\/\/www\.google\.com\/recaptcha\/api\.js[^"]*"[^>]*>\s*<\/script>/g;

export function stripEagerRecaptcha(html) {
  if (!html) return html;
  return html.replace(EAGER_RECAPTCHA, '');
}

// Two more scripts WordPress emitted on every page that this site never uses.
//
//   wp-emoji-release.min.js  22 KB. A polyfill that swaps emoji characters for
//     images on browsers that cannot render them. Nothing current needs it.
//
//   the WooCommerce product-gallery trio — single-product.min.js, flexslider
//     and jquery.zoom, 34 KB together. They drive the gallery on a product
//     page. 34 of the 69 pages have no gallery at all and were loading them
//     anyway; the check below removes them only where the gallery is absent,
//     so the 35 product pages keep them.
// The emoji polyfill is not a plain <script src>. WordPress emits a JSON
// settings blob and an inline module that reads it and, on browsers that cannot
// render the current emoji set, fetches wp-emoji-release.min.js and rewrites
// text nodes into images. Both halves go; the module throws without the blob,
// so removing one and not the other would be worse than leaving them.
const DEAD_SCRIPTS = [
  /<script id="wp-emoji-settings" type="application\/json">[\s\S]*?<\/script>\s*/g,
  /<script type="module">\s*\/\*! This file is auto-generated \*\/[\s\S]*?wpEmojiSettingsSupports[\s\S]*?<\/script>\s*/g,
];

const GALLERY_SCRIPTS = [
  /<script[^>]*src="[^"]*frontend\/single-product\.min\.js[^"]*"[^>]*>\s*<\/script>/g,
  /<script[^>]*src="[^"]*flexslider\/jquery\.flexslider\.min\.js[^"]*"[^>]*>\s*<\/script>/g,
  /<script[^>]*src="[^"]*zoom\/jquery\.zoom\.min\.js[^"]*"[^>]*>\s*<\/script>/g,
];

export function stripDeadScripts(bodyTail, pageContent) {
  if (!bodyTail) return bodyTail;
  let out = bodyTail;
  for (const rx of DEAD_SCRIPTS) out = out.replace(rx, '');
  const hasGallery = (pageContent || '').includes('woocommerce-product-gallery');
  if (!hasGallery) {
    for (const rx of GALLERY_SCRIPTS) out = out.replace(rx, '');
  }
  return out;
}
