import { table, paras, definitions, decision, limitations } from '../../resource-page.js';
import { ORDERING, SOURCES, PRODUCTS, PAGES, a } from './_shared.js';

export const route = '/resources/sustainability/';
export const h1 = 'Sustainability in Tube Packaging';
export const title = 'Sustainable Tube Packaging: What Actually Recycles | The Tube Packaging';
export const description =
  'Which parts of a paper tube recycle, why a seamed metal end is harder than a plastic cap, '
  + 'what compostable actually certifies against, and how to specify a tube that separates cleanly.';
export const published = '2026-08-28';
export const updated = '2026-08-28';
export const about = ['Recycling', 'Sustainable packaging', 'Paper tube'];

export const answer =
  'A paper tube body is paper and is widely accepted for recycling. What complicates it is '
  + 'everything attached to it. A plastic cap lifts off and goes its own way. A seamed metal '
  + 'end does not separate easily, which can keep the whole item out of both the paper and the '
  + 'metal stream. Acceptance also varies by community.';

export const intro = [
  'Most claims about tube packaging being recyclable are true about the body and silent about the rest of the pack. That gap is where the real decision sits, because a buyer disposing of the pack meets the whole thing, not the body.',
  'This page separates what is genuinely straightforward from what depends on the local program, and what you can change at specification stage to make the difference.',
];

const PARTS = {
  caption: 'What each part of a tube means at disposal',
  cols: ['Part', 'Material', 'Separates easily?', 'Practical effect'],
  rows: [
    ['Wound body', 'Paperboard', 'n/a — it is the item', 'Widely accepted with paper and card'],
    ['Printed wrap', 'Paper laminated to the body', 'Not separated, and does not need to be', 'Stays in the paper stream with the body'],
    ['Plastic push cap', 'Polymer', 'Yes — it lifts off', 'Sorted separately; the body is unaffected'],
    ['Paperboard plug cap', 'Paperboard', 'Yes, and it is the same material', 'The whole pack stays in one stream'],
    ['Seamed metal end', 'Tin-plate', 'No — it is seamed to the body', 'Can keep the item out of both streams'],
    ['Foil laminate liner', 'Aluminum on paper', 'No — it is laminated', 'Highest barrier, hardest to recycle'],
    ['PLA-coated liner', 'Bio-based polymer on paper', 'No — it is a coating', 'Needs industrial composting, not curbside paper'],
  ],
};

const CHOOSE = {
  caption: 'Specifying for end of life',
  when: 'If the priority is…',
  rows: [
    ['the pack goes in one bin', 'Paperboard plug cap on kraft or white board', 'Every part is paper, so there is nothing to separate', 'Lower cap retention than plastic; not for courier abuse'],
    ['the cap must hold through a courier', 'Plastic push cap', 'Best retention for the cost, and it lifts off cleanly at the end', 'Two streams instead of one'],
    ['food has to keep a real shelf life', 'Lined tube, liner chosen to the food', 'The barrier is what makes the pack work at all', 'Higher barrier means harder to recycle; that is the trade'],
    ['a compostable claim is wanted', 'PLA-coated liner', 'Bio-based, and certifiable against the compostability standards', 'Industrial composting only, and not accepted everywhere'],
    ['the design should be reused, not recycled', 'Telescoping lid, uncoated board', 'Rigid presentation packs are kept rather than binned', 'Reuse is a behavior, not a certification, so do not claim it as one'],
  ],
};

export const SECTIONS = [
  { mod: 'body', eyebrow: 'The body', h2: 'Is a cardboard tube recyclable?',
    body: paras(['The body is paperboard, and most curbside programs accept cardboard tubes. The US EPA is explicit that what is accepted varies between communities, so a national claim about a specific bin is never quite right.'])
      + table(PARTS)
      + paras(['Read that table as a design brief rather than a disposal instruction, alongside the ' + a('closures and liners on the materials page', PAGES.materials.route) + ', where each of those parts is chosen.']) },
  { mod: 'closure', eyebrow: 'Closures', h2: 'Why is a metal end a recycling problem?',
    body: paras(['Because it is seamed on. Seaming a metal closure to a paper body makes the two very difficult to separate, and without separation the assembly may not be accepted by either the paper stream or the metal stream.',
      'That is not an argument against metal ends. They give the best seal and reseal, which is why they are used for food and confectionery, and a pack that fails to protect its contents is not the sustainable option. It is an argument for choosing them deliberately, where the barrier is actually needed.'])
      + definitions([
        { term: 'Mono-material', what: 'A pack where every part is the same material stream.', why: 'It is the only configuration where the user does not have to do anything correctly for the pack to be recycled.' },
        { term: 'Repulpability', what: 'Whether the paper fibre can be recovered in a standard mill process.', why: 'Coatings and laminates are what usually decide it, not the printing.' },
        { term: 'Industrial composting', what: 'Composting at controlled temperature in a managed facility.', why: 'Compostable liners are certified against that environment; they are not a home-compost or a landfill claim.' },
      ]) },
  { mod: 'claims', eyebrow: 'Claims', h2: 'What does compostable actually certify?',
    body: paras(['Compostability is certified against a named standard, not asserted. ASTM D6400 is the standard used in the United States and EN 13432 is its European counterpart. Both require biodegradation, disintegration, ecotoxicity and heavy-metals testing, and both are industrial-composting standards.',
      'The practical consequence for a tube is narrow: a PLA-coated liner can be part of a certified compostable pack, but the certification belongs to the tested article, not to the word on the artwork. Our guide to ' + a('choosing a liner for food products', '/food-safe-tube-packaging-choosing-a-liner/') + ' covers when each one is actually needed.']) },
  { mod: 'design', eyebrow: 'Specification', h2: 'How do I specify a tube that recycles well?',
    body: decision(CHOOSE)
      + paras(['One more lever that costs nothing: quantity. Overordering and disposing of obsolete stock outweighs most material choices, which is why ' + a('ordering a short first run', '/custom-tube-packaging-for-small-businesses/') + ' is a genuine sustainability decision, not just a cash one.']) },
  { mod: 'ordering', eyebrow: 'Ordering', h2: 'Can I order a smaller first run?',
    body: paras([ORDERING.moq + ' ' + ORDERING.smallRun,
      ORDERING.samples + ' Testing a design at 100 pieces before committing to a year of stock is usually the lowest-waste route to a pack that works.',
      ORDERING.lead]) },
  { mod: 'limits', eyebrow: 'Limitations', h2: 'What we will not claim',
    body: limitations([
      { what: 'We do not claim curbside acceptance everywhere.', detail: 'Acceptance varies by community, as the EPA states. A pack can be recyclable in principle and refused locally.' },
      { what: 'We do not hold compostability certification for a specific article on your behalf.', detail: 'A certified claim belongs to the tested pack, and testing is arranged against your actual specification.' },
      { what: 'Recycled content is a separate question from recyclability.', detail: 'They are often confused. Ask about each one specifically rather than accepting a general environmental claim.' },
      { what: 'We have not run life-cycle assessments.', detail: 'Nothing on this page is an LCA result, and no carbon figure is quoted, because we do not have one to quote.' },
    ]) },
];

export const faqH2 = 'Common questions about tube packaging and the environment';
export const FAQS = [
  { q: 'Are cardboard tubes recyclable?', a: ['The paperboard body is, and most curbside programs accept cardboard tubes. What complicates it is the attached parts. The US EPA notes that what is accepted varies between communities, so check the local program before printing a claim on the pack.'] },
  { q: 'Do I need to remove the plastic cap before recycling?', a: ['Yes, and that is the point in its favor: it lifts off cleanly. Once separated, the paper body and the polymer cap each go to the stream that can handle them.'] },
  { q: 'Why are metal ends harder to recycle than plastic caps?', a: ['A metal end is seamed to the body rather than pushed into it, so the two are very difficult to separate. Without separation the assembly may be accepted by neither the paper nor the metal stream.'] },
  { q: 'Is a foil-lined tube recyclable?', a: ['A foil laminate is bonded to the paper, so it is the hardest liner to recover. It is specified when the shelf life genuinely needs that barrier, and a pack that fails to protect its contents is not the greener option.'] },
  { q: 'What is the difference between ASTM D6400 and EN 13432?', a: ['They are the industrial compostability standards used in the United States and Europe respectively. Both require biodegradation, disintegration, ecotoxicity and heavy-metals testing. Neither is a home-composting claim.'] },
  { q: 'Can I say my tube is compostable?', a: ['Only if the certification exists for that article. Compostability is certified against a named standard by testing the finished pack, not inferred from the liner having a bio-based name.'] },
  { q: 'Is kraft more sustainable than white board?', a: ['Uncoated kraft skips a bleaching and coating step, which is a real difference, but it also constrains what can be printed. If the artwork forces a laminated wrap anyway, the advantage narrows.'] },
  { q: 'What is a mono-material tube?', a: ['One where every part is in the same material stream — typically a paperboard body with a paperboard plug cap and no laminated liner. It is the only configuration where the user does not have to separate anything.'] },
  { q: 'Does recycled content make a tube recyclable?', a: ['They are different properties. Recycled content is what the board was made from; recyclability is what happens at the end. Ask about each one separately.'] },
  { q: 'What is the lowest-waste way to launch a new pack?', a: ['A short first run against a real forecast. The standard minimum is 500 pieces and runs from around 100 are possible at a higher per-piece cost, which is usually cheaper than disposing of obsolete stock later.'] },
];

export const RELATED = [PRODUCTS.kraft, PRODUCTS.cardboard, PRODUCTS.food, PRODUCTS.tea, PRODUCTS.lipBalm, PRODUCTS.deodorant];
export const sourcesLead = 'Recycling guidance is quoted from the EPA rather than from packaging marketing. The compostability standards are named by designation so you can check the certification against them.';
export const citations = [SOURCES.epa, SOURCES.cfr176170];
export const reviewer = null;
