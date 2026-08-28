import { table, paras, decision, limitations, definitions } from '../../resource-page.js';
import { ORDERING, SOURCES, PRODUCTS, PAGES, a } from './_shared.js';

export const route = '/resources/comparisons/';
export const h1 = 'Tube Packaging Comparisons';
export const title = 'Tube Packaging Comparisons: Which Option to Choose | The Tube Packaging';
export const description =
  'Side-by-side comparisons for the decisions buyers actually face: tube or box, kraft or white, '
  + 'plastic cap or metal end, paper tube or plastic tube, and printed wrap or direct print.';
export const published = '2026-08-28';
export const updated = '2026-08-28';
export const about = ['Packaging', 'Paper tube', 'Product comparison'];

export const answer =
  'Most tube decisions come down to five comparisons. Tube or box is decided by whether the '
  + 'contents roll. Kraft or white is decided by the artwork. Plastic cap or metal end is a '
  + 'trade between reseal and recycling. Paper or plastic tube is decided by whether the product '
  + 'is squeezed. Wrap or direct print is decided by tonal detail.';

export const intro = [
  'Comparison pages usually declare a winner. This one does not, because in every case below the right answer changes with what the pack has to do — and the wrong answer is normally the one chosen on price alone.',
  'Each comparison lists what actually differs, then the condition that decides it.',
];

const TUBE_BOX = {
  caption: 'Tube against box, for the same contents',
  cols: ['Factor', 'Tube', 'Box'],
  rows: [
    ['Failure mode removed', 'Creasing — rolled contents cannot crease', 'None specific; a flat item can still bend inside'],
    ['Corners', 'None, so force spreads along a curve', 'Four, and each one concentrates a point load'],
    ['Carrier pricing', 'Diameter drives girth, so width costs more than length', 'Girth is the two smaller dimensions combined'],
    ['Shelf behavior', 'Rolls unless the section is square', 'Sits flat'],
    ['Best at', 'Long, thin, rollable goods', 'Rigid, flat or irregular goods'],
  ],
};

const KRAFT_WHITE = {
  caption: 'Natural kraft against white board',
  cols: ['Factor', 'Natural kraft', 'White board'],
  rows: [
    ['Surface', 'Uncoated brown', 'Coated white'],
    ['Color behavior', 'Light tones warm towards brown; pastels largely disappear', 'Artwork holds close to the intended color'],
    ['Suits', 'Earthy, minimal and unbleached brand positions', 'Photography, bright color, exact brand matches'],
    ['Process steps', 'Skips bleaching and coating', 'Bleached and coated'],
    ['If the color must match exactly', 'Print a wrap and laminate it instead', 'Specify a named spot ink'],
  ],
};

const CAP_END = {
  caption: 'Plastic push cap against seamed metal end',
  cols: ['Factor', 'Plastic push cap', 'Metal (tin-plate) end'],
  rows: [
    ['Retention in transit', 'Best retention for the cost', 'Sealed, so retention is not the question'],
    ['Reseal', 'Reseats after opening', 'Best seal and reseal'],
    ['Barrier', 'None — it is a physical closure', 'Contributes to the seal'],
    ['Separation at disposal', 'Lifts off cleanly', 'Seamed on, so difficult to separate'],
    ['Chosen when', 'The pack is shipped and opened once', 'The pack holds food and is opened repeatedly'],
  ],
};

const PAPER_PLASTIC = {
  caption: 'Paper tube against plastic tube',
  cols: ['Factor', 'Paper tube', 'Plastic tube'],
  rows: [
    ['Dispensing', 'Rigid — the product is lifted, poured or advanced', 'Squeezed, one-handed'],
    ['Suits', 'Solids, powders, rolled goods, gifting', 'Creams, gels, lotions and liquids'],
    ['Material stream', 'Paper, where the closure separates', 'A polymer stream, separate from paper'],
    ['Print route', 'Wrap or direct print onto board', 'Printed onto the sleeve'],
    ['Decided by', 'Whether the product has to be squeezed', 'Whether the product has to be squeezed'],
  ],
};

const CHOOSE = {
  caption: 'The condition that decides each comparison',
  when: 'The question',
  rows: [
    ['Tube or box?', 'Tube, if the contents roll', 'A rolled item cannot crease, and a cylinder has no corners to point-load', 'Below about 2:1 length to diameter, a box is usually cheaper'],
    ['Kraft or white?', 'Whichever the artwork survives', 'Uncoated board shifts every light tone towards brown', 'A brand color that must match needs a wrap or a spot ink'],
    ['Push cap or metal end?', 'Metal end only if it is opened repeatedly', 'Reseal is the only thing metal buys that a cap does not', 'Seamed metal is hard to separate at disposal'],
    ['Paper or plastic tube?', 'Plastic, if the product is squeezed', 'Paper is not a squeeze format, whatever the preference', 'A paper look on a squeezed product is a specification error'],
    ['Wrap or direct print?', 'Wrap, if there is tonal detail', 'Flat printing before lamination is what preserves gradients', 'Direct print is shorter and cheaper for one or two flat colors'],
  ],
};

export const SECTIONS = [
  { mod: 'tubebox', eyebrow: 'Format', h2: 'Tube or box?',
    body: table(TUBE_BOX) + paras(['The deciding question is whether the contents roll. If they do, the tube removes a failure mode rather than resisting one, which is the argument the ' + a('shipping and protection guide', PAGES.shipping.route) + ' works through in full.']) },
  { mod: 'kraftwhite', eyebrow: 'Material', h2: 'Natural kraft or white board?',
    body: table(KRAFT_WHITE) + paras(['This is an artwork decision dressed up as a material decision, and the ' + a('printing and design guide', PAGES.printing.route) + ' covers how far the board shifts a color before you commit to one.']) },
  { mod: 'capend', eyebrow: 'Closure', h2: 'Plastic push cap or metal end?',
    body: table(CAP_END) + paras(['Metal ends buy reseal and seal. If the pack is opened once and recycled, they buy nothing and cost separation at disposal, as the ' + a('guide to what actually recycles', PAGES.sustain.route) + ' explains.']) },
  { mod: 'paperplastic', eyebrow: 'Material', h2: 'Paper tube or plastic tube?',
    body: table(PAPER_PLASTIC)
      + definitions([
        { term: 'Squeeze format', what: 'A pack whose wall deforms to dispense the product.', why: 'It is the one requirement paper cannot meet, which makes it the fastest way to settle this comparison.' },
        { term: 'Rigid format', what: 'A pack whose wall holds its shape and is opened rather than squeezed.', why: 'Everything a paper tube does well — presentation, stacking, printing, recycling — follows from being rigid.' },
      ]) },
  { mod: 'print', eyebrow: 'Print', h2: 'Printed wrap or direct print?',
    body: paras([
      'A printed wrap is artwork printed flat and then laminated to the wound body. Direct printing applies ink to the finished tube. The wrap keeps photographic detail, gradients and exact color; direct printing handles one and two-color marks well and is the shorter route.',
      'The practical test is whether the design has tonal detail anywhere. If it does, the wrap is not an upgrade, it is a requirement, and the ' + a('artwork setup for a tube wrap', PAGES.printing.route) + ' explains how the file has to be laid out.',
    ]) },
  { mod: 'decide', eyebrow: 'Decision', h2: 'What actually decides each one?',
    body: decision(CHOOSE) },
  { mod: 'ordering', eyebrow: 'Ordering', h2: 'How do I test a choice before committing?',
    body: paras([
      ORDERING.samples,
      ORDERING.moq + ' ' + ORDERING.smallRun + ' Running a short first batch of the option you are unsure about is usually cheaper than being wrong at volume.',
      ORDERING.lead + ' ' + ORDERING.shipping,
    ]) },
  { mod: 'limits', eyebrow: 'Limitations', h2: 'What these comparisons do not settle',
    body: limitations([
      { what: 'None of these are strength tests.', detail: 'The comparisons describe construction and behavior, not measured performance. We have not run comparative testing and do not publish figures we have not measured.' },
      { what: 'Cost is not compared here.', detail: 'Per-piece cost moves with quantity, print colors and dies, so a general cost ranking would be misleading.' },
      { what: 'Local recycling acceptance still varies.', detail: 'A configuration that separates cleanly can still be refused by a specific program.' },
      { what: 'Hybrid answers exist.', detail: 'A retail telescoping pack shipped inside an outer carton is frequently the right answer to a tube-or-box question, and it is not in the table.' },
    ]) },
];

export const faqH2 = 'Comparison questions we are asked most';
export const FAQS = [
  { q: 'Is a tube better than a box for posters?', a: ['For rolled prints, yes, because it removes creasing as a possible outcome rather than resisting it, and a cylinder has no corners to concentrate a point load. For mounted or board-backed work, a flat box is better.'] },
  { q: 'Which is cheaper to ship, a tube or a box?', a: ['It depends on the shape rather than the format. Carriers price on length plus girth, and on a tube girth is the full circumference, so diameter costs disproportionately. A long narrow tube ships cheaply; a short wide one often does not.'] },
  { q: 'Should I choose kraft or white board?', a: ['Choose from the artwork. Uncoated kraft warms every light tone towards brown and largely removes pastels. If the design depends on bright or exact color, use white board or a printed wrap.'] },
  { q: 'Do metal ends make a tube stronger?', a: ['They make it seal and reseal better, which is a different property. Strength in a tube comes from the wall thickness and the board grade, not from the closure.'] },
  { q: 'Can I use a paper tube for a lotion?', a: ['Not as a squeeze pack. A lotion that is dispensed by squeezing needs a plastic tube with a flip top. A paper tube can hold a jar or a solid, but it cannot be the squeeze format itself.'] },
  { q: 'Is direct printing cheaper than a wrap?', a: ['It is a shorter route with no lamination step, so for one or two flat colors it usually is. It cannot reproduce gradients or photography, so for tonal artwork the wrap is not the expensive option, it is the only one.'] },
  { q: 'Which option is the most environmentally sound?', a: ['Usually a paperboard body with a paperboard plug cap and no laminated liner, because every part is in one stream. Whether that pack is right depends on whether it protects the contents; a pack that fails is not the greener choice.'] },
  { q: 'Is a thicker wall always worth it?', a: ['Only where handling justifies it. The thick class from 1.5 mm upward is aimed at courier networks and diameters of 3 inches and above. On a retail pack inside an outer carton it adds weight and cost for no gain.'] },
  { q: 'Telescoping lid or plastic cap for a gift pack?', a: ['A telescoping lid if the pack is presented and kept, because there is no cap to lose and it opens like a gift. A plastic cap if the same pack has to survive a courier on its own.'] },
  { q: 'Can I get samples of two options to compare?', a: ['Yes, samples are available on request before a full run is committed, and short runs from around 100 pieces are possible at a higher per-piece cost if you want to test a design properly.'] },
];

export const RELATED = [PRODUCTS.kraft, PRODUCTS.white, PRODUCTS.poster, PRODUCTS.plastic, PRODUCTS.luxury, PRODUCTS.food];
export const sourcesLead = 'These comparisons describe construction and our own production practice. The external references cover the two areas where a published source matters: carrier limits and recycling acceptance.';
export const citations = [SOURCES.usps, SOURCES.epa];
export const reviewer = null;
