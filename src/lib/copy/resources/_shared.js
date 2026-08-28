/*
 * Facts shared by every resource page.
 *
 * ORDERING repeats what the rest of the site already states, so a reader never
 * meets two different numbers. Price is deliberately absent: the product pages
 * carry it and the Merchant feed carries it, and restating it in editorial copy
 * is how a quote-only site ends up contradicting its own feed.
 *
 * SOURCES were each opened and read. Anything that could not be confirmed at
 * the primary source is not claimed anywhere in this folder -- in particular,
 * the widely repeated "USPS defines a mailing tube as length no more than ten
 * times the diameter" appears on resellers' blogs but not on the USPS page
 * itself, so it is not used.
 */
export const ORDERING = {
  moq: 'The standard minimum is 500 pieces.',
  smallRun: 'Smaller runs from around 100 pieces are possible at a higher per-piece cost, because setup and printing are fixed regardless of quantity.',
  lead: 'Production and delivery together run 6 to 10 business days.',
  shipping: 'Free shipping covers the United States, United Kingdom, Canada and Australia.',
  samples: 'Samples are available on request before a full run is committed.',
};

export const SOURCES = {
  usps: {
    label: 'USPS Postal Explorer — Minimum and Maximum Sizes',
    url: 'https://pe.usps.com/BusinessMail101?ViewName=MinMax',
    note: 'the 108-inch and 130-inch combined length-and-girth limits and the 70-pound weight limit quoted on this page',
  },
  cfr176170: {
    label: '21 CFR 176.170, eCFR',
    url: 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-176/subpart-B/section-176.170',
    note: 'components of paper and paperboard in contact with aqueous and fatty foods',
  },
  cfr176: {
    label: '21 CFR Part 176, eCFR',
    url: 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-176',
    note: 'the part that also contains 176.180, which covers paper in contact with dry foods',
  },
  astmD642: {
    label: 'ASTM D642-20',
    url: 'https://www.astm.org/Standards/D642.htm',
    note: 'compressive resistance of shipping containers; the standard states it fulfills the requirements of ISO 12048',
  },
  epa: {
    label: 'US EPA — How Do I Recycle Common Recyclables',
    url: 'https://www.epa.gov/recycle/how-do-i-recycle-common-recyclables',
    note: 'what curbside programs accept, and why acceptance varies by community',
  },
};

// every route below exists in the build; validate-resources.mjs checks them
export const PRODUCTS = {
  poster: { name: 'Poster Mailing Tubes', route: '/product/poster-mailing-tubes/', note: 'prints, drawings and documents' },
  shipping: { name: 'Custom Shipping Tubes', route: '/product/custom-shipping-tubes/', note: 'courier-handled shipments' },
  kraftMail: { name: 'Kraft Mailing Tubes', route: '/product/kraft-mailing-tubes/', note: 'uncoated brown board, plastic push caps' },
  cylinder: { name: 'Cylinder Mailing Tubes', route: '/product/cylinder-mailing-tubes/', note: 'round-section mailers' },
  kraft: { name: 'Kraft Paper Tubes', route: '/product/kraft-paper-tubes/', note: 'the uncoated brown-board body' },
  white: { name: 'White Paper Tubes', route: '/product/white-paper-tubes/', note: 'clean surface for full-color artwork' },
  cardboard: { name: 'Cardboard Tube Packaging', route: '/product/cardboard-tube-packaging/', note: 'the general-purpose rigid body' },
  industrial: { name: 'Industrial Cardboard Tubes', route: '/product/industrial-cardboard-tubes/', note: 'cores carrying load' },
  large: { name: 'Large Cardboard Tubes', route: '/product/large-cardboard-tubes/', note: '3 inches internal diameter and above' },
  luxury: { name: 'Luxury Tube Packaging', route: '/product/luxury-tube-packaging/', note: 'foil, soft-touch and telescoping lids' },
  candle: { name: 'Candle Tube Packaging', route: '/product/candle-tube-packaging/', note: 'telescoping presentation packs' },
  food: { name: 'Tube Food Packaging', route: '/product/tube-food-packaging/', note: 'lined tubes for food contact' },
  tea: { name: 'Tea Paper Tubes', route: '/product/tea-paper-tubes/', note: 'metallized and foil liners' },
  cosmetic: { name: 'Cosmetic Tubes', route: '/product/cosmetic-tubes/', note: 'beauty and skincare formats' },
  lipBalm: { name: 'Paper Lip Balm Tubes', route: '/product/paper-lip-balm-tubes/', note: 'push-up bases' },
  deodorant: { name: 'Deodorant Paper Tubes', route: '/product/deodorant-paper-tubes/', note: 'solid sticks, push-up base' },
  plastic: { name: 'Plastic Tube Packaging', route: '/product/plastic-tube-packaging/', note: 'squeeze tubes for creams and gels' },
  lotion: { name: 'Lotion Tubes', route: '/product/lotion-tubes/', note: 'flip-top squeeze format' },
  wrapping: { name: 'Wrapping Paper Tubes', route: '/product/wrapping-paper-tubes/', note: 'long, thin-wall bodies' },
  square: { name: 'Square Paper Tubes', route: '/product/square-paper-tubes/', note: 'square-section presentation packs' },
};

export const HUB = '/resources/';
export const PAGES = {
  materials:   { route: '/resources/materials-and-construction/', name: 'Materials & Construction' },
  sizes:       { route: '/tube-size-guide/',                      name: 'Sizes & Specifications' },
  printing:    { route: '/resources/printing-and-design/',        name: 'Printing & Design' },
  shipping:    { route: '/resources/shipping-and-protection/',    name: 'Shipping & Protection' },
  sustain:     { route: '/resources/sustainability/',             name: 'Sustainability' },
  industries:  { route: '/resources/industry-applications/',      name: 'Industry Applications' },
  comparisons: { route: '/resources/comparisons/',                name: 'Comparisons' },
};

// Contextual links are written into the prose with this helper so every anchor
// is a real URL from the build, not a hand-typed path. One link per paragraph,
// descriptive anchors, per the site's internal-linking rules.
export const a = (label, route) =>
  '<a href="https://thetubepackaging.com' + route + '">' + label + '</a>';
