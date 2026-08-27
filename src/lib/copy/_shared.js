/**
 * Shared pieces of the category copy.
 *
 * The size and wall-thickness classes are defined once and used identically on
 * every category page, on /shop/ and in /tube-size-guide/. That is deliberate:
 * the GSC export shows buyers searching relative size words rather than
 * dimensions — "large tube" alone is 7,100 impressions with one click — and
 * nothing on the site defined what large, small or thick meant. Defining them
 * in one place is what stops two pages disagreeing about it.
 */
export const P = 'https://thetubepackaging.com';
export const a = (href, text) => `<a href="${href}">${text}</a>`;

// The one size vocabulary the whole site uses.
export const SIZE_CLASSES = {
  caption: 'Size classes used across this site, by internal diameter',
  cols: ['Size class', 'Internal diameter', 'Typical length range', 'What it suits'],
  rows: [
    ['Small', 'Under 1½″ (38 mm)', '2″ – 8″', 'Lip balm, lipstick, deodorant, samples, seeds, single confectionery'],
    ['Medium', '1½″ – 3″ (38 – 76 mm)', '3″ – 14″', 'Candles, cosmetics, tea, coffee, spices, rolled prints'],
    ['Large', '3″ – 6″ (76 – 152 mm)', '6″ – 36″', 'Posters, apparel, bottles, gift sets, large pillar candles'],
    ['Extra large', '6″ – 12″ (152 – 305 mm)', '12″ – 48″', 'Rolled artwork, textiles, banners, display and industrial cores'],
  ],
};

export const WALL_CLASSES = {
  caption: 'Wall thickness classes, and what buyers usually mean by "thick"',
  cols: ['Wall class', 'Wall thickness', 'Board build', 'What it suits'],
  rows: [
    ['Thin / lightweight', '0.5 – 1.0 mm', '1 – 2 plies with a printed wrap', 'Retail cosmetics, lip balm, lightweight dry goods'],
    ['Standard', '1.0 – 1.5 mm', '2 – 3 plies', 'Most retail and mailing work; the default unless you say otherwise'],
    ['Thick / heavy duty', '1.5 – 3.0 mm', '3 – 5 plies', 'Shipping, large diameters, anything that will be handled by a courier'],
    ['Industrial core', '3.0 mm and above', '5 plies upward, convolute wound', 'Cores under load, long unsupported spans, repeated handling'],
  ],
};

