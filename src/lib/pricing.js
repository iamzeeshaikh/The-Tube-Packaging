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

// Offer shipping and returns (2026-11 backlink pass).
//
// Google flagged every Merchant listing on the site with "Missing field
// shippingDetails" and "Missing field hasMerchantReturnPolicy". Both facts are
// already stated on the site, so the schema now repeats them and nothing more:
//
//   /shipping-policy/  free standard shipping to the US, UK, Canada and
//                      Australia, processing 3-5 business days, transit 3-5
//   /refund_returns/   same four countries, 10 days from delivery, by mail,
//                      return label included, no restocking fee
//
// The fields are appended after `priceValidUntil` inside each Offer. `price`
// and every other captured field stay exactly as they are, and the Merchant
// feed is not touched.
const COUNTRIES = ['US', 'GB', 'CA', 'AU'];
const SHIPPING_DETAILS = COUNTRIES.map((c) => ({
  '@type': 'OfferShippingDetails',
  shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: 'USD' },
  shippingDestination: { '@type': 'DefinedRegion', addressCountry: c },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 5, unitCode: 'DAY' },
    transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 5, unitCode: 'DAY' },
  },
}));
const RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: COUNTRIES,
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 10,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/FreeReturn',
  merchantReturnLink: 'https://thetubepackaging.com/refund_returns/',
};
const OFFER_EXTRA =
  `,"shippingDetails":${JSON.stringify(SHIPPING_DETAILS)},"hasMerchantReturnPolicy":${JSON.stringify(RETURN_POLICY)}`;
const VALID_UNTIL_FIELD_RE = /("priceValidUntil"\s*:\s*"[^"]*")(?!,"shippingDetails")/g;

export function addOfferPolicies(html) {
  if (!html) return html;
  return html.replace(VALID_UNTIL_FIELD_RE, `$1${OFFER_EXTRA}`);
}
