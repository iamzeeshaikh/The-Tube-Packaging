import { table, paras, decision, limitations, definitions } from '../../resource-page.js';
import { ORDERING, SOURCES, PRODUCTS, PAGES, a } from '../resources/_shared.js';

export const route = '/choosing-tube-packaging-for-cosmetics/';
export const h1 = 'Choosing Tube Packaging for Cosmetics';
export const title = 'Choosing Tube Packaging for Cosmetics | The Tube Packaging';
export const description =
  'Diameters, closures and materials for cosmetic tubes: which formats suit balms, sticks and '
  + 'creams, why paper cannot be a squeeze pack, and what to check before ordering.';
export const published = '2026-08-28';
export const updated = '2026-08-28';
export const section = 'Cosmetics';
export const about = ['Cosmetics packaging', 'Personal care', 'Paper tube'];
export const image = 'https://thetubepackaging.com/wp-content/uploads/2024/07/Cosmetic-Tubes-600x600.jpg';
export const excerpt =
  'Cosmetic tubes fail for one of two reasons: the diameter was set from the product instead of '
  + 'the filled insert, or a squeeze product was specified in a rigid pack. Both are avoidable.';

export const answer =
  'Cosmetic tube packaging divides on one question: is the product squeezed out, or lifted, '
  + 'poured or advanced? Squeezed products need a plastic tube with a flip top. Solids and '
  + 'sticks suit paper tubes with a push-up base. Diameters for personal care usually run from '
  + 'half an inch to 1¼ inches, which is 13 to 32 millimeters.';

export const intro = [
  'Beauty is the largest single cluster of searches this site receives, and it is also where the most specification mistakes are made — because the pack has to do three jobs at once: hold a formed product without slack, look right on a shelf, and be operated with one hand.',
  'What follows is the order those decisions should be made in, with the dimensions written the way a specification is written.',
];

const FORMATS = {
  caption: 'Cosmetic formats and the pack each needs',
  cols: ['Product', 'Typical internal diameter', 'Body', 'Closure'],
  rows: [
    ['Lip balm', '¾ inch (19 mm)', 'Paper tube', 'Push-up base'],
    ['Lip gloss', '½ inch (13 mm)', 'Paper or plastic', 'Cap, or an applicator fitment'],
    ['Lipstick', '1 inch (25 mm)', 'Paper tube', 'Push-up base'],
    ['Solid perfume', '¾ inch (19 mm)', 'Paper tube', 'Plug cap'],
    ['Deodorant stick', '1¼ inches (32 mm)', 'Paper tube', 'Push-up base'],
    ['Bath salts and powders', '1¼ to 2 inches (32 – 51 mm)', 'Paper tube, lined', 'Shive, or metal ends'],
    ['Hand cream or lotion', 'n/a — squeeze format', 'Plastic tube', 'Flip top'],
    ['Skincare sets and gifting', '2 to 3 inches (51 – 76 mm)', 'Paper tube', 'Telescoping lid'],
  ],
};

const PICK = {
  caption: 'Rigid or squeeze?',
  when: 'If the user…',
  rows: [
    ['advances a solid with a thumb', 'Paper tube, push-up base', 'The product is never touched, and the pack stays in the paper stream', 'Only works for solids that hold their shape'],
    ['squeezes out a cream or gel', 'Plastic tube, flip top', 'A paper wall cannot deform to dispense', 'A different material stream from a paper pack'],
    ['unscrews and dips', 'Paper tube, plug cap', 'Simple, all paper, and cheap to fill', 'No reseal pressure, so not for volatile products'],
    ['is opening a gift', 'Paper tube, telescoping lid', 'No cap to lose, and it presents on opening', 'Slower to fill; not a shipping closure on its own'],
    ['pours a powder', 'Lined paper tube, shive', 'The shive holds fines in', 'Not a moisture barrier by itself'],
  ],
};

export const SECTIONS = [
  { mod: 'first', eyebrow: 'The first decision', h2: 'Is the product squeezed or not?',
    body: paras([
      'Everything else follows from this. A paper tube is a rigid pack: the wall holds its shape, and the product is lifted out, poured, or advanced by a base. A cream that has to be squeezed cannot be dispensed from it, whatever the sustainability preference or the brand look.',
      'This is the single most common specification error we see in beauty. Our ' + a('paper against plastic tube comparison', PAGES.comparisons.route) + ' sets out the rest of that decision.',
    ]) + decision(PICK) },
  { mod: 'diameter', eyebrow: 'Sizing', h2: 'Which diameter does a cosmetic tube need?',
    body: table(FORMATS) + paras([
      'Two rules stop most sizing problems. Order by internal diameter, and size to the filled insert or formed stick rather than the raw product. The ' + a('tube size and diameter guide', PAGES.sizes.route) + ' carries the full reference table.',
    ]) },
  { mod: 'material', eyebrow: 'Materials', h2: 'Kraft, white or a printed wrap?',
    body: paras([
      'Beauty artwork is usually color-critical, which pushes against uncoated kraft. Natural kraft absorbs ink, so light tones warm towards brown and pastel shades largely disappear — lovely for an unbleached, minimal position, wrong for a brand built on a specific pink.',
      'Where the color has to match exactly, print the artwork flat onto a wrap and specify a named spot ink rather than a process build — the ' + a('printing and design guide', PAGES.printing.route) + ' explains why uncoated board shifts a color.',
    ]) + definitions([
      { term: 'Push-up base', what: 'A base that advances the product up the tube as the user turns or pushes it.', why: 'It is what makes a paper tube viable for balms and deodorants, because the user never has to touch the product.' },
      { term: 'Fitment', what: 'A molded part inserted into the tube to hold or apply the product.', why: 'It changes the internal dimension the product actually sits in, so the tube is sized around the fitment, not the formula.' },
      { term: 'Headspace', what: 'The empty volume left above the fill.', why: 'Too little and the product presses on the closure; too much and the pack rattles and reads as underfilled.' },
    ]) },
  { mod: 'ordering', eyebrow: 'Ordering', h2: 'What does a cosmetics order need?',
    body: paras([
      'Send the internal diameter, the length, what the tube holds — including any fitment — and roughly how many. The wall class, material and closure follow from those.',
      ORDERING.moq + ' ' + a('Ordering a short first run', '/custom-tube-packaging-for-small-businesses/') + ' is usually the right way to start. ' + ORDERING.smallRun,
      ORDERING.lead + ' ' + ORDERING.samples + ' For a formed product, a sample is worth taking: slack is much easier to see than to calculate.',
    ]) },
  { mod: 'limits', eyebrow: 'Limitations', h2: 'What to check before you commit',
    body: limitations([
      { what: 'A paper tube is not a barrier pack.', detail: 'For products sensitive to moisture or oxygen the liner does the work, and for volatile formulations a rigid paper pack may not be suitable at all.' },
      { what: 'Cosmetic regulations are outside this article.', detail: 'Labeling, ingredient declaration and market-specific requirements are your regulatory responsibility, not a property of the pack.' },
      { what: 'Fitment fit is confirmed physically.', detail: 'Tolerances between a molded fitment and a wound tube are worth checking on a sample rather than on paper.' },
      { what: 'Direct-to-consumer changes the wall class.', detail: 'A pack that also ships on its own needs mailer wall thickness, which is heavier than a shelf pack needs.' },
    ]) },
];

export const faqH2 = 'Cosmetic packaging questions';
export const FAQS = [
  { q: 'Can I use a paper tube for hand cream?', a: ['Not as the squeeze pack. A paper wall does not deform, so a cream that is dispensed by squeezing needs a plastic tube with a flip top. A paper outer or sleeve can still give the pack a paper look.'] },
  { q: 'What diameter is a lip balm tube?', a: ['Around ¾ of an inch, which is 19 mm internal diameter. Lip gloss usually sits at ½ inch (13 mm) and lipstick at 1 inch (25 mm).'] },
  { q: 'What is a push-up base?', a: ['A base that advances the product up the tube as the user pushes or turns it, so a balm or deodorant can be used without touching it. It is what makes a paper tube practical for solid sticks.'] },
  { q: 'Should cosmetic tubes be kraft or white?', a: ['White board or a printed wrap if the brand color has to be exact, because uncoated kraft warms light tones and removes pastels. Kraft if the position is deliberately unbleached and minimal.'] },
  { q: 'How do I stop a lipstick rattling in the tube?', a: ['Size the tube to the formed stick or the fitment rather than to the raw product, and specify the headspace deliberately. Slack that would be invisible on a large pack is obvious on a 1-inch tube.'] },
  { q: 'Are paper cosmetic tubes recyclable?', a: ['The paperboard body is, and a push-up base or plug cap that separates cleanly keeps it simple. A laminated liner or a seamed metal end makes the pack harder to recycle, so specify those only where the product needs them.'] },
  { q: 'Can I get a matte or soft-touch finish?', a: ['Yes. Both need a coated surface to sit on, so they change the board choice as well as the budget. Soft-touch reads as premium in the hand, which is where a cosmetic pack is judged.'] },
  { q: 'Do you supply the fitment as well as the tube?', a: ['Tell us the fitment you are using and the tube is specified around it. The dimension that matters is what the product sits in once the fitment is installed, not the bare internal diameter.'] },
  { q: 'What is the minimum order for cosmetic tubes?', a: ['The standard minimum is 500 pieces, with smaller runs from around 100 pieces at a higher per-piece cost. For a formed product, a short first run is usually worth it.'] },
  { q: 'How long will my order take?', a: ['Production and delivery together run 6 to 10 business days once artwork is approved. Free shipping covers the United States, United Kingdom, Canada and Australia.'] },
];

export const RELATED = [PRODUCTS.cosmetic, PRODUCTS.lipBalm, PRODUCTS.deodorant, PRODUCTS.plastic, PRODUCTS.lotion, PRODUCTS.luxury];
export const sourcesLead = 'This article describes packaging construction rather than cosmetic regulation. The reference below covers the food-contact rules that apply where a cosmetic pack shares a liner specification with a food pack.';
export const citations = [SOURCES.cfr176170];
export const reviewer = null;
