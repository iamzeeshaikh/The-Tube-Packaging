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


/**
 * Ordering policy answers, confirmed by the owner on 2026-08-27.
 *
 * Identical on every page that carries them, because they are policy rather
 * than category copy — the same reason the MOQ answer is identical everywhere.
 *
 * The figures are taken from /shipping-policy/, which is the site's own
 * authoritative statement, rather than paraphrased into a fourth version. The
 * product pages say "8 to 10 business days" where the policy page says a 6 to 10
 * total; 8 to 10 sits inside that, so it is not a false promise, but the
 * inconsistency is recorded in reports/owner-decisions.md rather than copied
 * forward here.
 *
 * Free shipping is stated WITH its destinations. Around twenty product pages
 * state it unqualified, and an unqualified free-shipping claim is the single
 * most common source of dispute on a packaging lead — so these pages name the
 * four countries and link to the policy instead of repeating the bare claim.
 */
export const POLICY_FAQS = [
  { q: 'Can I get a sample before committing to a full run?',
    a: ['Yes. Samples can be provided to confirm sizing, material selection and design details before full production begins, so you can check the structure and the print in your hand rather than on screen.',
        'Free design support comes with it — artwork preparation, layout help, bleed and print-ready file setup, and 3D mockups before manufacturing starts. For a first order it is worth using both, because the two things that go wrong most often are a diameter chosen without the product to hand and artwork laid out before the flat dimensions were confirmed.'] },
  { q: 'How long does an order take?',
    a: ['Processing takes 3 to 5 business days, which covers printing, packaging and quality checks, and orders are processed Monday to Saturday. Transit is a further 3 to 5 business days, for a total estimated delivery time of 6 to 10 business days.',
        'Timelines vary a little with the destination city and courier workload, and a tracking link is emailed once the order ships. Embossing adds to production time, so allow extra if your build includes it.'] },
  { q: 'Do you offer free shipping?',
    a: ['Yes — free standard shipping to the United States, the United Kingdom, Canada and Australia. Those are the destinations the policy covers, so it is worth checking it applies to yours before you plan around it.',
        'The full terms, including processing and transit times, order tracking and what happens if a shipment is delayed or lost, are set out on the shipping policy page.'] },
];
