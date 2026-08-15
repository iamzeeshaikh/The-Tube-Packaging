export const PROD_ORIGIN = 'https://thetubepackaging.com';

// Absolute URLs are carried over from WordPress verbatim. A QA build
// (SITE_ORIGIN=http://localhost:PORT) points them at the local server instead
// so the copy can be screenshotted and crawled without touching the live site.
export const ORIGIN = process.env.SITE_ORIGIN || PROD_ORIGIN;

export function rewrite(html) {
  if (ORIGIN === PROD_ORIGIN || !html) return html;
  return html.split(PROD_ORIGIN).join(ORIGIN);
}
