import { table, paras, definitions, decision, limitations } from '../../resource-page.js';
import { ORDERING, SOURCES, PRODUCTS, PAGES, a } from './_shared.js';

export const route = '/resources/shipping-and-protection/';
export const h1 = 'Shipping and Protection with Mailing Tubes';
export const title = 'Mailing Tube Shipping & Protection Guide | The Tube Packaging';
export const description =
  'Carrier size limits, how length and girth are measured, wall thickness for courier handling, '
  + 'end caps that stay shut, and what a tube protects against that a flat mailer does not.';
export const published = '2026-08-28';
export const updated = '2026-08-28';
export const about = ['Mailing tube', 'Shipping', 'Protective packaging'];

export const answer =
  'A mailing tube protects rolled flat goods by removing the failure mode a flat mailer has: '
  + 'a crease. USPS states a maximum of 108 inches in combined length and girth for most '
  + 'mailpieces, up to 130 inches for Retail Ground at oversized prices, and a 70-pound weight '
  + 'limit. Girth is measured around the thickest part, perpendicular to length.';

export const intro = [
  'Sending a poster, a drawing or a print flat means betting that nothing in the network bends it. A tube changes the bet: the contents are rolled, the rigid wall carries the handling, and a crease stops being a possible outcome.',
  'What follows is what actually decides whether a tube arrives intact — the wall, the caps and the dimensions the carrier will measure.',
];

const LIMITS = {
  caption: 'Carrier size limits quoted by USPS',
  cols: ['Limit', 'Figure', 'Applies to'],
  rows: [
    ['Combined length and girth', '108 inches', 'Most mailpieces'],
    ['Combined length and girth', '130 inches', 'USPS Retail Ground, charged at oversized prices'],
    ['Maximum weight', '70 pounds', 'Any mailpiece'],
    ['Minimum thickness', '0.007 inches', 'Any mailpiece'],
  ],
};

const WALLS = {
  caption: 'Wall thickness for shipped tubes',
  cols: ['Contents', 'Wall class', 'Thickness', 'Reason'],
  rows: [
    ['A single rolled print, short journey', 'Standard', '1.0 – 1.5 mm', 'Enough to resist denting in normal handling'],
    ['Several prints together, courier network', 'Thick', '1.5 – 3.0 mm', 'Longer unsupported span and more weight to carry'],
    ['Wide-format or canvas, 4 inches and above', 'Thick', '1.5 – 3.0 mm', 'Large diameters flex more; the wall has to compensate'],
    ['Retail pack posted in a carton', 'Thin', '0.5 – 1.0 mm', 'The outer carton carries the handling, not the tube'],
  ],
};

const CAPS = {
  caption: 'Choosing an end cap for shipping',
  when: 'If the shipment…',
  rows: [
    ['goes through a courier network', 'Plastic push cap', 'Best retention for the cost, and it reseats after inspection', 'Adds a non-paper part the recipient has to separate'],
    ['has to stay all paper', 'Paperboard plug cap', 'One material stream end to end', 'Lower retention under sustained vibration; tape it'],
    ['is heavy for its diameter', 'Plastic push cap, taped', 'Weight pushes on the cap every time the parcel is set down', 'Tape has to be removed before recycling'],
    ['is a gift being shipped', 'Telescoping lid inside an outer carton', 'The pack presents on opening rather than looking like transit packaging', 'Not a shipping closure on its own'],
  ],
};

export const SECTIONS = [
  { mod: 'why', eyebrow: 'Protection', h2: 'What does a tube protect against?',
    body: definitions([
      { term: 'Creasing', what: 'A permanent fold line in a flat sheet.', why: 'It is the failure a flat mailer cannot design out, and it is unrepairable on a print. Rolling removes it as a possibility.' },
      { term: 'Point loading', what: 'Force concentrated on a small area, such as a corner pressing into a stack.', why: 'A cylinder has no corners, so the same force spreads along a curve instead of denting a point.' },
      { term: 'Racking', what: 'The parcel twisting out of square under load.', why: 'A wound tube resists twist along its axis, which is why long thin shipments travel better in a tube than in a long flat box.' },
      { term: 'Girth', what: 'The distance around the thickest part of the parcel, measured perpendicular to its length.', why: 'Carriers price on length plus girth, so diameter costs more than it looks like it should on a long tube.' },
    ]) },
  { mod: 'limits', eyebrow: 'Carriers', h2: 'What size can actually be posted?',
    body: paras(['These are the figures USPS publishes on its own Postal Explorer page. Other carriers set their own limits, so confirm against the service you actually ship on.'])
      + table(LIMITS)
      + paras(['The practical consequence is that length is cheap and diameter is expensive. The ' + a('diameter and length reference table', PAGES.sizes.route) + ' will show you which combinations stay comfortably inside a carrier limit.']) },
  { mod: 'wall', eyebrow: 'Specification', h2: 'How thick should a shipping tube be?',
    body: table(WALLS) + paras(['A tube that will be handled by a courier is specified from the handling, not from the weight of the contents, and the ' + a('wall thickness classes explained', PAGES.materials.route) + ' set out what each range is built for.']) },
  { mod: 'caps', eyebrow: 'Closures', h2: 'Which end cap stays on?',
    body: decision(CAPS) + paras(['Whatever the cap, the failure most often reported is not the cap coming off in transit but the tube being opened for inspection and not reseating. A push cap reseats; a plug cap that has been prised out often does not.']) },
  { mod: 'ordering', eyebrow: 'Ordering', h2: 'How are shipping tubes ordered?',
    body: paras([
      'Order by internal diameter and length, not external. The contents have to fit inside, and the cap is sized to the internal diameter. ' + a('What a wholesale tube quote needs', '/how-to-order-custom-tube-packaging-wholesale/') + ' lists everything else we ask for.',
      ORDERING.moq + ' ' + ORDERING.smallRun,
      ORDERING.lead + ' ' + ORDERING.shipping,
    ]) },
  { mod: 'exceptions', eyebrow: 'Limitations', h2: 'Where a tube is the wrong answer',
    body: limitations([
      { what: 'Anything that must not be rolled.', detail: 'Mounted work, framed pieces, board-backed prints and photographs with a brittle emulsion should travel flat.' },
      { what: 'Very short, very wide contents.', detail: 'Below roughly a 2:1 length-to-diameter ratio a tube stops behaving like a tube and a box is usually cheaper.' },
      { what: 'Carrier limits change.', detail: 'The figures on this page are what USPS published when it was written; check the current page before designing to the edge of a limit.' },
      { what: 'A tube is not a moisture barrier.', detail: 'Caps are a physical closure, not a seal. Anything moisture-sensitive needs a bag inside the tube.' },
    ]) },
];

export const faqH2 = 'Common questions about shipping in tubes';
export const FAQS = [
  { q: 'What is the maximum size a mailing tube can be?', a: ['USPS states a maximum of 108 inches in combined length and girth for most mailpieces, and up to 130 inches for USPS Retail Ground, which is charged at oversized prices. The maximum mailable weight is 70 pounds.'] },
  { q: 'How is girth measured on a round tube?', a: ['Girth is the distance around the thickest part of the parcel, measured perpendicular to the length. On a cylinder that is the circumference at its widest point, so diameter drives girth directly.'] },
  { q: 'Is a tube stronger than a flat mailer?', a: ['For rolled flat goods it removes the main failure mode rather than resisting it. A flat mailer can be creased and a crease is permanent; a rolled print in a rigid tube cannot be creased in the same way.'] },
  { q: 'What wall thickness should a courier tube be?', a: ['1.0 to 1.5 mm covers a single rolled print on a normal journey. For several prints together, wide-format work, or diameters of 4 inches and above, move to 1.5 to 3.0 mm.'] },
  { q: 'Do the end caps come off in transit?', a: ['A plastic push cap has the best retention for the cost and reseats after the parcel is opened for inspection. Paperboard plug caps hold well but often do not reseat once prised out, so they are usually taped.'] },
  { q: 'Should I tape the caps?', a: ['For heavy contents or long journeys, yes. Weight pushes on the lower cap every time the parcel is set down. Remember the recipient has to remove that tape before the tube can be recycled as paper.'] },
  { q: 'Can I ship a canvas print in a tube?', a: ['Yes, on a large enough diameter that the canvas is not tightly rolled — 4 inches internal diameter and above is the usual starting point — and with a thick wall, because a wide tube flexes more over the same span.'] },
  { q: 'Does a tube protect against rain?', a: ['No. Caps are a physical closure, not a moisture seal. Anything moisture-sensitive should be bagged inside the tube.'] },
  { q: 'Is a longer tube more expensive to ship?', a: ['Length adds less than diameter does. Carriers price on length plus girth, and girth is the full circumference, so every extra inch of diameter counts more than three inches does.'] },
  { q: 'What is the minimum order for shipping tubes?', a: ['The standard minimum is 500 pieces, with smaller runs from around 100 pieces at a higher per-piece cost. Production and delivery together run 6 to 10 business days.'] },
];

export const RELATED = [PRODUCTS.poster, PRODUCTS.shipping, PRODUCTS.kraftMail, PRODUCTS.cylinder, PRODUCTS.large, PRODUCTS.industrial];
export const sourcesLead = 'The carrier figures on this page were read on the carrier own published page, not taken from a reseller summary. Where a widely repeated claim could not be confirmed at the source, it has been left out.';
export const citations = [SOURCES.usps, SOURCES.astmD642];
export const reviewer = null;
