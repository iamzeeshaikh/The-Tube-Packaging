import { table, paras, decision, limitations, definitions } from '../../resource-page.js';
import { ORDERING, SOURCES, PRODUCTS, PAGES, a } from '../resources/_shared.js';

export const route = '/food-safe-tube-packaging-choosing-a-liner/';
export const h1 = 'Food-Safe Tube Packaging: Choosing a Liner';
export const title = 'Food-Safe Tube Packaging: Choosing a Liner | The Tube Packaging';
export const description =
  'Which liner suits which food: greaseproof, PE, metallized film, foil laminate and PLA, what '
  + 'each one keeps out, the regulation that governs paper in food contact, and the trade-offs.';
export const published = '2026-08-28';
export const updated = '2026-08-28';
export const section = 'Food and drink';
export const about = ['Food packaging', 'Food contact materials', 'Paper tube'];
export const image = 'https://thetubepackaging.com/wp-content/uploads/2024/07/Tube-Food-Packaging-600x600.jpg';
export const excerpt =
  'A tube does not become food-safe by being paper. The liner laminated to the inside wall is '
  + 'what sits against the product, and it is chosen from the food, not from a preference.';

export const answer =
  'A tube is made suitable for food by the liner laminated to its inside wall, together with the '
  + 'board. Greaseproof handles fat, PE handles moisture, metallized film adds some oxygen '
  + 'protection and foil laminate gives the highest barrier. In the United States, paper in '
  + 'contact with aqueous and fatty foods is governed by 21 CFR 176.170.';

export const intro = [
  'The most common misunderstanding about food tubes is that the shape or the board makes them food-safe. Neither does. What sits against the product is the liner, and choosing it is a question about the food — its fat content, its moisture, and how long it has to keep.',
  'This article works through what each liner is actually for, and what you give up by choosing the highest barrier by default.',
];

const LINERS = {
  caption: 'Liners by what they keep out',
  cols: ['Liner', 'Barrier against', 'Typical contents', 'Trade-off'],
  rows: [
    ['Greaseproof', 'Fat and grease', 'Confectionery, baked goods, nuts', 'Little protection against moisture or oxygen'],
    ['PE-coated', 'Moisture', 'Sugar, salt, dry powders', 'Adds a polymer layer to the paper stream'],
    ['Metallized film', 'Moisture and some oxygen', 'Spices, tea', 'Not a full oxygen barrier for long shelf lives'],
    ['Aluminum foil laminate', 'Moisture and oxygen', 'Coffee, premium tea', 'Highest barrier, hardest to recycle'],
    ['PLA-coated', 'Moisture', 'Dry goods with a compostable claim', 'Industrial composting only; not curbside paper'],
  ],
};

const CHOOSE = {
  caption: 'Matching liner to food',
  when: 'If the product is…',
  rows: [
    ['fatty but eaten quickly', 'Greaseproof', 'Fat is the only thing that has to be held back', 'Will not extend shelf life on its own'],
    ['a dry powder that clumps', 'PE-coated', 'Moisture is what ruins it', 'The coating stays with the paper at disposal'],
    ['aromatic and losing its smell', 'Metallized film', 'Aroma loss is oxygen and moisture together', 'Not enough for a long dated shelf life'],
    ['coffee or premium tea', 'Aluminum foil laminate', 'The highest barrier available in this format', 'The pack becomes hard to recycle; choose it deliberately'],
    ['dry and sold on a compostable claim', 'PLA-coated', 'Bio-based, and certifiable against the compostability standards', 'Industrial composting only, and certification belongs to the tested article'],
  ],
};

export const SECTIONS = [
  { mod: 'what', eyebrow: 'The basics', h2: 'What makes a tube food-safe?',
    body: paras([
      'Food-contact suitability comes from the liner laminated to the inside wall together with the board behind it, and it is confirmed against the actual product rather than assumed from a material name.',
      'In the United States, the components of paper and paperboard in contact with aqueous and fatty foods are set out in 21 CFR 176.170, with dry foods in 176.180 of the same part. The ' + a('materials and construction guide', PAGES.materials.route) + ' explains how the liner and board work together.',
    ]) + definitions([
      { term: 'Liner', what: 'A film or coating laminated to the inside wall of the tube.', why: 'It is the only part of the pack the food touches, so it is the part that determines suitability and shelf life.' },
      { term: 'Barrier', what: 'Resistance to a specific thing passing through: moisture, oxygen, fat or aroma.', why: 'There is no general barrier — each liner is good against particular things and indifferent to others.' },
      { term: 'Shelf life', what: 'How long the product stays acceptable in the pack.', why: 'It is a property of the product, the pack and the storage together, which is why a liner alone cannot guarantee it.' },
    ]) },
  { mod: 'liners', eyebrow: 'Liners', h2: 'Which liner does each food need?',
    body: table(LINERS) + decision(CHOOSE) },
  { mod: 'closure', eyebrow: 'Closures', h2: 'Does the closure matter as much as the liner?',
    body: paras([
      'For anything opened more than once, yes. Food packs are opened repeatedly, and a liner that holds a barrier perfectly is undone by a closure that does not reseal. That is why metal ends dominate food and confectionery: they give the best seal and reseal available in this format.',
      'The cost is at disposal. A seamed metal end is difficult to separate from the paper body, so the item may be accepted by neither stream — ' + a('what actually recycles in a tube', PAGES.sustain.route) + ' covers that trade in full.',
      'For loose dry goods that are poured rather than resealed under pressure, a rolled edge and shive is often enough — it keeps fines in without pretending to be a barrier seal.',
    ]) },
  { mod: 'ordering', eyebrow: 'Ordering', h2: 'What do you need to tell us?',
    body: paras([
      'The food itself, its fat content, whether it is wet or dry, and the shelf life you need. Those four decide the liner. Then the dimensions, which the ' + a('tube size and diameter guide', PAGES.sizes.route) + ' will help you settle.',
      ORDERING.moq + ' ' + ORDERING.smallRun,
      ORDERING.lead + ' ' + ORDERING.samples,
    ]) },
  { mod: 'limits', eyebrow: 'Limitations', h2: 'What a liner cannot do',
    body: limitations([
      { what: 'A liner does not create a shelf life on its own.', detail: 'Headspace, fill temperature and the closure seal all move the result, and none of them are properties of the liner.' },
      { what: 'Compostable is not the same as recyclable.', detail: 'A PLA-coated liner needs industrial composting; it is not a curbside paper item and it is not a home-compost claim.' },
      { what: 'Nothing here is a regulatory clearance.', detail: 'Suitability is confirmed against your specific product and market. This article describes the framework, not an approval.' },
      { what: 'Highest barrier is not the safe default.', detail: 'A foil laminate on a product that only needed greaseproof adds cost and removes recyclability for no gain.' },
    ]) },
];

export const faqH2 = 'Food packaging questions';
export const FAQS = [
  { q: 'Are cardboard tubes food safe?', a: ['Not by themselves. Suitability comes from the liner laminated to the inside wall together with the board, and it is confirmed against the actual food. In the United States the relevant rules for aqueous and fatty foods sit in 21 CFR 176.170.'] },
  { q: 'Which liner does coffee need?', a: ['Coffee is normally specified with an aluminum foil laminate, because it needs both moisture and oxygen protection. Metallized film is the lighter option where the shelf life is shorter.'] },
  { q: 'What liner suits confectionery?', a: ['Greaseproof, if fat is the main issue and the product is eaten quickly. If it also has to stay dry over a longer period, a PE coating or metallized film is the better fit.'] },
  { q: 'Can a food tube be recycled?', a: ['The body can, but the liner and the closure decide how easily. A PE or foil laminate is bonded to the paper, and a seamed metal end is hard to separate. Specify the highest barrier only where the food needs it.'] },
  { q: 'Is a PLA liner compostable at home?', a: ['No. PLA coatings are certified against industrial composting standards, which assume controlled temperature in a managed facility. They are not a home-composting or a curbside claim.'] },
  { q: 'Do I need metal ends for food?', a: ['If the pack is opened repeatedly, they give the best seal and reseal. For loose dry goods that are poured, a rolled edge and shive is often enough and keeps the pack easier to recycle.'] },
  { q: 'What is the difference between 176.170 and 176.180?', a: ['176.170 covers components of paper and paperboard in contact with aqueous and fatty foods; 176.180 in the same part covers paper in contact with dry foods.'] },
  { q: 'Can you guarantee a shelf life?', a: ['No, and neither can a liner. Shelf life is a property of the product, the pack, the fill and the storage together. The liner is chosen to support it, and the result is confirmed by your own testing.'] },
  { q: 'What diameter suits tea or coffee?', a: ['Two to three inches internal diameter, which is 51 to 76 mm, covers most retail tea and coffee formats, usually with metal ends for reseal.'] },
  { q: 'What is the minimum order for lined tubes?', a: ['The standard minimum is 500 pieces, with smaller runs from around 100 pieces at a higher per-piece cost. Production and delivery together run 6 to 10 business days.'] },
];

export const RELATED = [PRODUCTS.food, PRODUCTS.tea, PRODUCTS.kraft, PRODUCTS.cardboard, PRODUCTS.white, PRODUCTS.luxury];
export const sourcesLead = 'The regulatory references were read at the eCFR rather than quoted from a supplier summary.';
export const citations = [SOURCES.cfr176170, SOURCES.cfr176, SOURCES.epa];
export const reviewer = null;
