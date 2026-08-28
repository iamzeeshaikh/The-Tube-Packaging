import { table, paras, decision, limitations } from '../../resource-page.js';
import { ORDERING, SOURCES, PRODUCTS, PAGES, a } from './_shared.js';

export const route = '/resources/industry-applications/';
export const h1 = 'Tube Packaging by Industry';
export const title = 'Tube Packaging Applications by Industry | The Tube Packaging';
export const description =
  'What each industry actually needs from a tube: diameters, wall classes, liners and closures '
  + 'for cosmetics, food and drink, print and art, candles, retail gifting and industrial cores.';
export const published = '2026-08-28';
export const updated = '2026-08-28';
export const about = ['Packaging', 'Cosmetics packaging', 'Food packaging', 'Industrial cores'];

export const answer =
  'The industry decides three things about a tube: the internal diameter the product needs, '
  + 'whether a liner is required, and which closure the user will operate. Cosmetics run small '
  + 'and need push-up bases or flip tops. Print and art run long and wide with push caps. Food '
  + 'needs a liner chosen to the food and usually a resealable end.';

export const intro = [
  'Two industries can order the same tube and be wrong for opposite reasons — one because the diameter was set from the product and not the handling, the other because the closure was chosen for the shelf and not for the user.',
  'This page works through the sectors we quote most often and sets out what each one actually constrains, in the same units used across the rest of the site.',
];

const BY_INDUSTRY = {
  caption: 'What each sector typically specifies',
  cols: ['Sector', 'Typical internal diameter', 'Wall class', 'Liner', 'Usual closure'],
  rows: [
    ['Cosmetics and personal care', 'Half inch to 1¼ inches (13 – 32 mm)', 'Thin to standard', 'None for solids', 'Push-up base or flip top'],
    ['Food and confectionery', '1½ to 3 inches (38 – 76 mm)', 'Standard', 'Chosen to the food', 'Metal ends, or shive for dry goods'],
    ['Tea, coffee and spices', '2 to 3 inches (51 – 76 mm)', 'Standard', 'Metallized or foil laminate', 'Metal ends'],
    ['Print, art and posters', '1½ to 6 inches (38 – 152 mm)', 'Standard to thick', 'None', 'Plastic push cap'],
    ['Candles and home fragrance', '2 to 4 inches (51 – 102 mm)', 'Standard', 'None', 'Telescoping lid'],
    ['Retail gifting and apparel', '3 to 6 inches (76 – 152 mm)', 'Standard', 'None', 'Telescoping lid or plug cap'],
    ['Industrial cores', '3 to 12 inches (76 – 305 mm)', 'Industrial, 3 mm and above', 'None', 'Open ended'],
  ],
};

const PICK = {
  caption: 'Matching the pack to what the user does with it',
  when: 'If the buyer will…',
  rows: [
    ['advance a solid stick with a thumb', 'Push-up base', 'The user never touches the product', 'Only suits solids; not creams or gels'],
    ['squeeze out a cream one-handed', 'Plastic tube with a flip top', 'Dispenses controlled amounts and closes itself', 'A different material stream from a paper pack'],
    ['open it once and recycle it', 'Plastic push cap on a paper body', 'Highest retention for the lowest cost', 'Two streams at disposal'],
    ['reseal it daily for weeks', 'Metal ends', 'Best seal and reseal', 'Seamed metal is hard to separate for recycling'],
    ['keep the pack on a shelf', 'Telescoping lid', 'Presents as a gift and gets kept rather than binned', 'Slower to fill; not a shipping closure alone'],
    ['pour or scoop a powder', 'Rolled edge and shive', 'The shive keeps fines in without a barrier seal', 'Not a moisture barrier by itself'],
  ],
};

export const SECTIONS = [
  { mod: 'matrix', eyebrow: 'By sector', h2: 'What does each industry specify?',
    body: table(BY_INDUSTRY)
      + paras(['Read across a row and you have most of a specification. The two figures that are not in the table are the length and the quantity, and those come from the product and the forecast rather than from the sector.']) },
  { mod: 'cosmetics', eyebrow: 'Cosmetics', h2: 'What is different about cosmetics and personal care?',
    body: paras([
      'Diameters are small and tolerances matter more than anywhere else, because the pack has to hold a formed stick or a filled insert rather than a loose object. A quarter of an inch of slack that would be irrelevant on a poster tube is a rattling lipstick.',
      'The closure is also the product experience. A push-up base means the user advances a balm or a deodorant without touching it; a flip top on a plastic tube means a cream can be dispensed one-handed. Those are not finishes, they are how the product works.',
      'Where a paper body is wanted for a cream or a gel, the honest answer is usually a plastic tube, because paper is not a squeeze format. ' + a('Choosing tube packaging for cosmetics', '/choosing-tube-packaging-for-cosmetics/') + ' works through the formats one by one.',
    ]) },
  { mod: 'food', eyebrow: 'Food and drink', h2: 'What does food packaging require?',
    body: paras([
      'A liner, chosen to the food rather than to a preference. Fat and grease need a greaseproof liner; sugars, salts and powders need moisture protection; tea, coffee and spices need moisture and oxygen protection, which is where metallized film and foil laminates come in.',
      'In the United States, paper and paperboard in contact with aqueous and fatty foods sits under 21 CFR 176.170, with dry foods covered separately in 176.180 of the same part. Suitability is confirmed against the actual product, not assumed from the liner name.',
      'The closure usually has to reseal, because food packs are opened repeatedly, which pushes food towards metal ends. ' + a('Choosing a food-safe tube liner', '/food-safe-tube-packaging-choosing-a-liner/') + ' covers the barrier side of the same decision.',
    ]) },
  { mod: 'print', eyebrow: 'Print and art', h2: 'What do print and art shipments need?',
    body: paras([
      'Diameter first: roll the artwork too tightly and it will not lie flat again. Wide-format work, canvas and anything with a heavy ink load starts at 3 to 4 inches internal diameter rather than 2.',
      'Then the wall, which is set by the handling rather than the weight. A courier network justifies the thick class from 1.5 mm upward, and large diameters justify it regardless of what is inside, because a wide tube flexes more over the same span.',
      'The ' + a('diameter and length reference table', PAGES.sizes.route) + ' will let you work back from the artwork dimensions to a tube size.',
    ]) },
  { mod: 'retail', eyebrow: 'Retail and gifting', h2: 'What about candles, gifting and apparel?',
    body: paras([
      'These packs are chosen to be kept. A telescoping lid has no separate cap to lose and opens like a gift, which is why it dominates candle and gift packaging even though it is slower to fill and is not a shipping closure on its own.',
      'Finish does real work here, because the pack is handled at the point of sale. ' + a('What makes tube packaging look premium', '/what-makes-tube-packaging-look-premium/') + ' sets out which of those choices a buyer actually registers.',
      'Where the pack also has to be posted, it goes inside an outer carton rather than being redesigned into a mailer.',
    ]) },
  { mod: 'industrial', eyebrow: 'Industrial', h2: 'Where do industrial cores differ?',
    body: paras([
      'Almost entirely in the wall. Cores carry load, so the specification starts at 3 mm and goes up, and the question is not how it prints but how much it can hold without deflecting over an unsupported span.',
      'Diameters run from 3 inches up to 12 inches, and lengths are usually cut to a machine rather than to a shelf. Printing is normally minimal or absent.',
    ]) },
  { mod: 'ordering', eyebrow: 'Ordering', h2: 'What do we need to quote your sector?',
    body: paras([
      'Four things cover most of it: internal diameter, length, what the tube has to hold, and roughly how many. Everything else can be recommended from those.',
      ORDERING.moq + ' ' + ORDERING.smallRun,
      ORDERING.lead + ' ' + ORDERING.shipping,
    ]) },
  { mod: 'limits', eyebrow: 'Limitations', h2: 'Where the sector rule of thumb breaks',
    body: limitations([
      { what: 'The table describes typical work, not every case.', detail: 'A cosmetics brand shipping direct to consumers has a courier problem as well as a shelf problem, and needs the wall class of a mailer.' },
      { what: 'Food suitability is confirmed, not inferred.', detail: 'A liner that suits one food may not suit another with a higher fat content or a longer shelf life.' },
      { what: 'A paper tube is not a squeeze format.', detail: 'Creams, gels and liquids that have to be dispensed by squeezing need a plastic tube, whatever the sustainability preference.' },
      { what: 'Industrial load figures are not quoted here.', detail: 'Core performance is specified against the actual application; we do not publish a load table we have not tested to.' },
    ]) },
];

export const faqH2 = 'Common questions by industry';
export const FAQS = [
  { q: 'Which tube diameter do cosmetics usually need?', a: ['Most personal-care formats sit between half an inch and 1¼ inches internal diameter — 13 to 32 mm. Lip balm and solid perfume at the small end, deodorant sticks and small candles towards 1¼ inches.'] },
  { q: 'Can a paper tube hold a cream or a gel?', a: ['Not as a squeeze format. Paper bodies suit solids, powders and rolled goods. For a cream or gel that has to be dispensed by squeezing, a plastic tube with a flip top is the right pack even where a paper look is preferred.'] },
  { q: 'What liner does tea need?', a: ['Tea needs moisture and some oxygen protection, so metallized film is the usual starting point and an aluminum foil laminate is used where the shelf life is longer. The trade-off is that higher barriers are harder to recycle.'] },
  { q: 'How wide should a poster tube be?', a: ['Two inches internal diameter suits a single rolled poster. Wide-format prints, canvas or anything with a heavy ink load should start at 3 to 4 inches so the artwork is not rolled tightly enough to resist lying flat again.'] },
  { q: 'Why do candle packs use telescoping lids?', a: ['There is no separate cap to lose, the pack opens like a gift, and it presents on a shelf. It is slower to fill and is not a shipping closure on its own, so a posted candle goes inside an outer carton.'] },
  { q: 'What makes an industrial core different?', a: ['The wall. Cores carry load, so they start at 3 mm and go up, and they are specified on how much they can hold without deflecting rather than on how they print.'] },
  { q: 'Do you make square tubes for retail?', a: ['Yes. Square-section bodies sit flat on a shelf without rolling, which is why they are used for gifting and apparel. The wall and liner choices are unchanged; only the former differs.'] },
  { q: 'Which closure reseals best for food?', a: ['Metal ends. Food packs are opened repeatedly, and a seamed metal end gives the best seal and reseal. The cost is at disposal, because seamed metal does not separate easily from the paper body.'] },
  { q: 'Can one tube serve retail and shipping?', a: ['Sometimes, if it is specified for the harder job. That usually means the thicker wall and a plastic push cap, which is a compromise on shelf presentation. Most brands ship the retail pack inside an outer carton instead.'] },
  { q: 'What is the minimum order across these sectors?', a: ['The same everywhere: 500 pieces standard, with smaller runs from around 100 pieces at a higher per-piece cost. Production and delivery together run 6 to 10 business days.'] },
];

export const RELATED = [PRODUCTS.cosmetic, PRODUCTS.food, PRODUCTS.poster, PRODUCTS.candle, PRODUCTS.industrial, PRODUCTS.tea];
export const sourcesLead = 'Food-contact references are quoted from the regulation itself. Everything else on this page describes our own production practice.';
export const citations = [SOURCES.cfr176170, SOURCES.cfr176];
export const reviewer = null;
