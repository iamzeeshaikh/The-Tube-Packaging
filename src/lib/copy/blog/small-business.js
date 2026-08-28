import { table, paras, decision, limitations, definitions } from '../../resource-page.js';
import { ORDERING, SOURCES, PRODUCTS, PAGES, a } from '../resources/_shared.js';

export const route = '/custom-tube-packaging-for-small-businesses/';
export const h1 = 'Custom Tube Packaging for Small Businesses';
export const title = 'Custom Tube Packaging for Small Businesses | The Tube Packaging';
export const description =
  'How to get custom tube packaging without ordering thousands: what a short run really costs, '
  + 'which choices save money, and how to launch a pack you will not have to bin.';
export const published = '2026-08-28';
export const updated = '2026-08-28';
export const section = 'Ordering';
export const about = ['Small business', 'Custom packaging', 'Minimum order quantity'];
export const image = 'https://thetubepackaging.com/wp-content/uploads/2024/07/Kraft-Paper-Tubes-600x600.jpg';
export const excerpt =
  'The barrier for a small brand is rarely the unit price — it is committing to thousands before '
  + 'the product has sold. Short runs are possible, and here is how to make one count.';

export const answer =
  'Small runs of custom tube packaging are possible from around 100 pieces, below the 500-piece '
  + 'standard minimum, at a higher cost per piece. That premium exists because setup, plates and '
  + 'dies are fixed regardless of quantity. The cheapest way to reduce a short-run quote is to '
  + 'simplify the printing, not to thin the wall.';

export const intro = [
  'Most packaging advice is written for brands ordering in the tens of thousands. For a small business the arithmetic is different: the risk is not the unit price, it is committing cash to stock of a design that might change after the first hundred customers.',
  'This article is about ordering a pack at a size that matches that risk, and about which specification choices actually move a short-run quote.',
];

const COSTS = {
  caption: 'What scales with quantity, and what does not',
  cols: ['Cost', 'Behavior', 'Effect on a short run'],
  rows: [
    ['Board and winding', 'Scales with the number of pieces', 'Roughly proportional; no surprise here'],
    ['Print setup and plates', 'Fixed, paid once per design', 'Dominates the per-piece cost at 100 pieces'],
    ['Dies for foil or emboss', 'Fixed, paid once per design', 'Usually the first thing to drop on a first run'],
    ['Color matching', 'Fixed, per named spot color', 'Each additional spot color is a fixed cost, not a per-piece one'],
    ['Lamination and finishes', 'A pass over the run', 'Adds time as well as cost on a small batch'],
    ['Delivery', 'Per shipment', 'Free to the United States, United Kingdom, Canada and Australia'],
  ],
};

const CHOOSE = {
  caption: 'Getting a short run to work',
  when: 'If you are…',
  rows: [
    ['launching an unproven product', 'Around 100 pieces, simple print', 'Finds specification problems before they are expensive', 'Highest per-piece cost you will pay'],
    ['confident in the product, unsure of the artwork', '500 pieces, one design', 'The standard minimum, with room to reprint later', 'Artwork changes mean a new setup'],
    ['selling seasonally', 'Two shorter runs', 'Nothing carried into a season it does not suit', 'Setup paid twice'],
    ['selling a range of sizes', 'One tube size, different labels', 'One setup across the range instead of several', 'Some products fit less well than a bespoke size would'],
  ],
};

export const SECTIONS = [
  { mod: 'moq', eyebrow: 'Minimums', h2: 'Do I have to order 500?',
    body: paras([
      ORDERING.moq + ' ' + ORDERING.smallRun,
      'A minimum order quantity is a scheduling figure rather than a technical limit. The machine does not mind making 100; what changes is how the fixed costs are shared out.',
    ]) + definitions([
      { term: 'Setup', what: 'Everything done before the first good piece: plates, dies, mandrel changeover, color matching.', why: 'It is paid once whether you order 100 or 10,000, which is the entire reason short runs cost more per piece.' },
      { term: 'Standard minimum', what: 'The quantity a supplier normally schedules against.', why: 'It is where per-piece cost starts to settle, not a wall you cannot go under.' },
    ]) },
  { mod: 'cost', eyebrow: 'Cost', h2: 'Where does a short-run quote actually go?',
    body: table(COSTS) + paras([
      'The practical reading of that table: on a 100-piece run you are mostly buying setup. So the way to bring the number down is to reduce the number of setups — fewer spot colors, no die, one tube size rather than three — not to specify a thinner wall.',
      'Wall thickness is the one place where saving money creates a new problem. A pack that dents in transit costs more in replacements than the material ever saved — the ' + a('wall thickness classes', PAGES.materials.route) + ' show what each range is for.',
    ]) },
  { mod: 'plan', eyebrow: 'Planning', h2: 'How do I avoid buying stock I cannot use?',
    body: decision(CHOOSE) + paras([
      'One structural trick worth knowing: standardize the tube and vary the label. If the range shares one internal diameter and length, a single setup covers the lot — the ' + a('tube size and diameter guide', PAGES.sizes.route) + ' will help you find a size that fits everything.',
    ]) },
  { mod: 'spec', eyebrow: 'Specification', h2: 'What should a first pack specify?',
    body: paras([
      'Internal diameter and length sized to the product, a standard wall at 1.0 to 1.5 mm unless it is being couriered on its own, kraft or white board depending on the artwork, and the simplest closure that does the job.',
      'Leave foil, soft-touch and spot UV for the second run, once the artwork has stopped moving. If they matter to you, ' + a('what makes tube packaging look premium', '/what-makes-tube-packaging-look-premium/') + ' explains where they pay off.',
      ORDERING.samples,
    ]) },
  { mod: 'time', eyebrow: 'Lead time', h2: 'How long will a small order take?',
    body: paras([
      ORDERING.lead + ' ' + ORDERING.shipping,
      'A small order is not faster than a large one, because the setup is the same. ' + a('What a wholesale tube quote needs', '/how-to-order-custom-tube-packaging-wholesale/') + ' lists what to send so approval does not add a week.',
    ]) },
  { mod: 'limits', eyebrow: 'Limitations', h2: 'What a short run cannot do',
    body: limitations([
      { what: 'It cannot avoid the fixed costs.', detail: 'Setup is the same at 100 pieces as at 10,000, which is why the per-piece figure looks high and is not negotiable downward by much.' },
      { what: 'It is not a prototype service.', detail: 'A short run is a real production run. Specification changes after it starts are a new setup, not an amendment.' },
      { what: 'Complex finishes rarely make sense at 100.', detail: 'Dies and additional spot colors are fixed costs spread over very few pieces.' },
      { what: 'No price is quoted here.', detail: 'Per-piece cost depends on quantity, print, material and finish, so a figure in an article would be wrong for most readers.' },
    ]) },
];

export const faqH2 = 'Small-business ordering questions';
export const FAQS = [
  { q: 'What is the smallest order of custom tubes I can place?', a: ['Runs from around 100 pieces are possible, below the 500-piece standard minimum, at a higher cost per piece. Setup and printing are fixed regardless of quantity, which is where that premium comes from.'] },
  { q: 'Why is a 100-piece run so much more per unit?', a: ['Because most of what you are paying for is setup: plates, dies, mandrel changeover and color matching. Those are paid once whatever the quantity, so on 100 pieces they are shared between 100.'] },
  { q: 'How do I make a small order cheaper?', a: ['Reduce the number of setups. Fewer spot colors, no foil or emboss die, and one tube size across the range. Do not thin the wall — a pack that dents in transit costs more than the material saved.'] },
  { q: 'Can I use one tube size for several products?', a: ['Yes, and for a small range it is usually the right answer. One setup covers the run and each product gets its own applied label, instead of paying setup three or four times.'] },
  { q: 'Should I add foil on my first run?', a: ['Usually not. Dies are a fixed cost, so they are at their most expensive per piece on a short run. Leave them for the reprint, once the artwork has stopped changing.'] },
  { q: 'Is a small order faster to produce?', a: ['No. Setup takes the same time, so production and delivery still run 6 to 10 business days once artwork is approved.'] },
  { q: 'Do you charge for shipping on small orders?', a: ['Free shipping covers the United States, United Kingdom, Canada and Australia.'] },
  { q: 'Can I see a sample before committing to 100?', a: ['Yes, samples are available on request before a full run is committed. For a formed or fitted product, a sample is the fastest way to catch a sizing problem.'] },
  { q: 'What if my artwork changes after the run?', a: ['New plates are a fresh setup. If artwork is likely to move, keep the printed element simple and carry the changing part on an applied label instead.'] },
  { q: 'What should a first pack specify?', a: ['Internal diameter and length sized to the product, a standard wall of 1.0 to 1.5 mm unless it ships on its own, kraft or white board to suit the artwork, and the simplest closure that does the job.'] },
];

export const RELATED = [PRODUCTS.kraft, PRODUCTS.white, PRODUCTS.cardboard, PRODUCTS.candle, PRODUCTS.cosmetic, PRODUCTS.poster];
export const sourcesLead = 'This article describes our own ordering practice. No external pricing source is cited, because no price is quoted.';
export const citations = [SOURCES.epa];
export const reviewer = null;
