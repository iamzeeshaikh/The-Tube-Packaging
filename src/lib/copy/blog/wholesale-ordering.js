import { table, paras, decision, limitations, definitions } from '../../resource-page.js';
import { ORDERING, SOURCES, PRODUCTS, PAGES, a } from '../resources/_shared.js';

export const route = '/how-to-order-custom-tube-packaging-wholesale/';
export const h1 = 'How to Order Custom Tube Packaging Wholesale';
export const title = 'How to Order Custom Tube Packaging Wholesale | The Tube Packaging';
export const description =
  'What a wholesale tube packaging order actually needs: minimum quantities, lead times, the '
  + 'four dimensions to send, artwork requirements and where the cost sits.';
export const published = '2026-08-28';
export const updated = '2026-08-28';
export const section = 'Ordering';
export const about = ['Wholesale packaging', 'Custom packaging', 'Procurement'];
export const image = 'https://thetubepackaging.com/wp-content/uploads/2024/07/Cardboard-Tube-Packaging-600x600.jpg';
export const excerpt =
  'Most wholesale packaging quotes stall on the same four missing numbers. Here is exactly what '
  + 'to send, what the minimum order really means, and how long production and delivery take.';

export const answer =
  'A wholesale tube order needs four things: internal diameter, length, what the tube has to '
  + 'hold, and roughly how many. From those, the wall class, material, liner and closure can be '
  + 'recommended. The standard minimum is 500 pieces, smaller runs from around 100 are possible '
  + 'at a higher per-piece cost, and production and delivery run 6 to 10 business days.';

export const intro = [
  'Buying custom packaging for the first time is mostly an information problem. The supplier cannot quote without a specification, the buyer does not yet have one, and the quote request goes back and forth for a week over things that could have been settled in one message.',
  'This article sets out what a tube packaging quote actually needs, what the minimum order means in practice, and which parts of the cost move with quantity and which do not.',
];

const NEEDED = {
  caption: 'What a quote needs, and what it can be inferred from',
  cols: ['Item', 'Send this', 'If you do not have it'],
  rows: [
    ['Internal diameter', 'The measurement across the inside, in inches or millimeters', 'Send the widest dimension of the product; the diameter is worked back from it'],
    ['Length', 'The internal length of the body', 'Send the length of the contents plus how much headroom you want'],
    ['Contents', 'What the tube will hold, and whether it is food', 'This is the one item that cannot be inferred'],
    ['Quantity', 'A rough annual or first-run figure', 'Send a range; the per-piece cost is quoted against it'],
    ['Wall class', 'Thin, standard, thick or industrial', 'Recommended from the contents and the handling'],
    ['Material', 'Kraft, white board, printed wrap, black board or plastic', 'Recommended from the artwork'],
    ['Closure', 'The end cap or lid', 'Recommended from how the buyer opens the pack'],
    ['Liner', 'Only for food and drink', 'Specified from the food, the fat content and the shelf life'],
  ],
};

const MOQ = {
  caption: 'Choosing a first order quantity',
  when: 'If you are…',
  rows: [
    ['testing a design before committing', 'Around 100 pieces', 'The lowest-waste way to find a specification problem', 'Higher per-piece cost; setup is the same at any quantity'],
    ['launching a product with a real forecast', '500 pieces', 'The standard minimum, where per-piece cost starts to settle', 'Ties up cash in stock before the forecast is proven'],
    ['restocking a proven line', '1,000 and above', 'Setup and plates are spread over more pieces', 'Storage and obsolescence if the artwork changes'],
    ['running seasonal artwork', 'Two shorter runs', 'Avoids carrying obsolete stock into next season', 'Setup is paid twice'],
  ],
};

export const SECTIONS = [
  { mod: 'send', eyebrow: 'The quote', h2: 'What does a supplier actually need from you?',
    body: table(NEEDED) + paras([
      'Only one row on that table cannot be inferred: what the tube has to hold. If you do not have the dimensions yet, the ' + a('tube diameter and length tables', PAGES.sizes.route) + ' will get you to them from the product.',
    ]) },
  { mod: 'moq', eyebrow: 'Quantity', h2: 'What does the minimum order really mean?',
    body: paras([ORDERING.moq + ' ' + ORDERING.smallRun])
      + decision(MOQ)
      + definitions([
        { term: 'Setup cost', what: 'The fixed work before the first piece is made: plates, dies, mandrel changeover, color matching.', why: 'It does not change with quantity, so it is the whole reason a short run costs more per piece.' },
        { term: 'Minimum order quantity', what: 'The smallest run a supplier will normally schedule.', why: 'It is a scheduling figure, not a technical limit, which is why runs below it are possible at a different price.' },
      ]) },
  { mod: 'cost', eyebrow: 'Cost', h2: 'Which parts of the cost move with quantity?',
    body: paras([
      'Two things behave differently. Material and winding scale with the number of pieces — twice as many tubes uses twice as much board. Setup, plates, dies and color matching do not; they are paid once whether you order 100 or 10,000.',
      'That is the whole explanation for why per-piece pricing falls as quantity rises, and it is also why adding a second spot color or a foil die costs proportionally more on a short run than on a long one.',
      'It also means the cheapest way to reduce a quote is usually to simplify the print, not to cut the wall thickness — the ' + a('wall thickness classes', PAGES.materials.route) + ' explain what each range is actually carrying.',
    ]) },
  { mod: 'time', eyebrow: 'Lead time', h2: 'How long does an order take?',
    body: paras([
      ORDERING.lead + ' ' + ORDERING.shipping,
      'Artwork is the usual reason a schedule slips, not production. A file that arrives without bleed, with live fonts, or laid out to a guessed circumference has to go back before anything can be printed.',
      ORDERING.samples + ' If you are ordering for the first time, ' + a('custom tube packaging for small businesses', '/custom-tube-packaging-for-small-businesses/') + ' covers how to size a first run.',
    ]) },
  { mod: 'artwork', eyebrow: 'Artwork', h2: 'What does the artwork have to include?',
    body: paras([
      'Vector artwork with the fonts outlined, or 300 ppi at final size if the design is photographic. Extend the artwork past every trimmed edge, keep logos and critical text out of the strip where the wrap closes on itself, and name any color that has to match exactly rather than relying on a process build.',
      'The ' + a('printing and design guide', PAGES.printing.route) + ' covers the file setup in detail, including how bleed and the seam allowance work on a cylinder.',
    ]) },
  { mod: 'limits', eyebrow: 'Limitations', h2: 'What this article does not tell you',
    body: limitations([
      { what: 'It does not quote a price.', detail: 'Per-piece cost moves with quantity, print colors, dies and material, so any number here would be wrong for most readers.' },
      { what: 'Lead time assumes approved artwork.', detail: 'The 6 to 10 business days covers production and delivery, not the approval cycle before it.' },
      { what: 'Food work carries an extra step.', detail: 'Liner suitability is confirmed against the actual product, which is a conversation rather than a menu choice.' },
      { what: 'Minimums are scheduling figures.', detail: 'They can move for repeat work; they are not a statement about what the machine can physically do.' },
    ]) },
];

export const faqH2 = 'Wholesale ordering questions';
export const FAQS = [
  { q: 'What is the minimum order for custom tube packaging?', a: ['The standard minimum is 500 pieces. Smaller runs from around 100 pieces are possible at a higher per-piece cost, because setup and printing are fixed regardless of quantity.'] },
  { q: 'How long does a custom tube order take?', a: ['Production and delivery together run 6 to 10 business days. That window assumes the artwork is approved; the approval cycle before it is the part that most often extends a schedule.'] },
  { q: 'What information do you need to quote?', a: ['Internal diameter, length, what the tube has to hold, and roughly how many. The wall class, material, liner and closure can be recommended from those four.'] },
  { q: 'Why does a smaller run cost more per piece?', a: ['Setup, plates, dies and color matching are fixed costs paid once, whatever the quantity. On 100 pieces they are spread over 100; on 5,000 they are spread over 5,000.'] },
  { q: 'Can I get samples before ordering?', a: ['Yes, samples are available on request before a full run is committed. For a design you are unsure about, a short run of around 100 pieces is usually cheaper than being wrong at volume.'] },
  { q: 'Do you ship internationally?', a: ['Free shipping covers the United States, United Kingdom, Canada and Australia.'] },
  { q: 'Should I order by internal or external diameter?', a: ['Always internal. The contents have to fit inside it and the cap is sized to it. External diameter changes with wall thickness, so ordering by it produces a tube that does not hold what you expected.'] },
  { q: 'What is the cheapest way to bring a quote down?', a: ['Usually the print, not the build. Reducing spot colors or dropping a die saves more than thinning the wall, and the wall is what keeps the pack intact in handling.'] },
  { q: 'Can I change the artwork between runs?', a: ['Yes, but new plates or dies are a fresh setup cost. If artwork changes seasonally, two shorter runs often beat one long run that leaves obsolete stock.'] },
  { q: 'Do you need the artwork before quoting?', a: ['No. A quote can be built from the four dimensions and a description of the print — how many colors, whether there is a foil or emboss. The file itself is needed before production, not before pricing.'] },
];

export const RELATED = [PRODUCTS.kraft, PRODUCTS.cardboard, PRODUCTS.poster, PRODUCTS.white, PRODUCTS.candle, PRODUCTS.food];
export const sourcesLead = 'This article describes our own ordering process. The reference below is included because food work is the one category where an external rule changes what can be quoted.';
export const citations = [SOURCES.cfr176170];
export const reviewer = null;
