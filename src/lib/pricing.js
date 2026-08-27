// `priceValidUntil` was captured from WordPress at crawl time, so every offer
// carried a frozen date — the first five lapsing on 10 November 2026 and all 35
// by 24 December 2026. Google drops the price from a rich result once that date
// has passed, and Merchant listings are 44% of this site's clicks.
//
// The value is therefore computed at build time as "one year from this build",
// so every Vercel deploy rolls it forward and it can never expire in place.
// $0.30 is a standing price, not a time-limited offer, so the date carries no
// commercial meaning — only the "this price is still current" signal.
//
// Only the date is touched. `price`, `priceCurrency`, `availability`, `url`,
// `sku` and every other offer field are left exactly as captured.

function isoUtc(date) {
  // Match the format already in the captured markup: 2026-11-12T04:39:23+00:00
  return date.toISOString().replace(/\.\d+Z$/, '+00:00');
}

function oneYearOut(from) {
  const d = new Date(from.getTime());
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  return d;
}

// Evaluated once per build, so all 72 offers across the site share one value.
export const PRICE_VALID_UNTIL = isoUtc(oneYearOut(new Date()));

const PRICE_VALID_UNTIL_RE = /("priceValidUntil"\s*:\s*")[^"]*(")/g;

export function refreshPriceValidUntil(html) {
  if (!html) return html;
  return html.replace(PRICE_VALID_UNTIL_RE, `$1${PRICE_VALID_UNTIL}$2`);
}
