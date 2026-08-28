import { table, paras, definitions, decision, diagram, limitations, esc } from '../../resource-page.js';
import { ORDERING, SOURCES, PRODUCTS, PAGES, a } from './_shared.js';

export const route = '/resources/materials-and-construction/';
export const h1 = 'Tube Packaging Materials and Construction';
export const title = 'Tube Packaging Materials & Construction | The Tube Packaging';
export const description =
  'How a paper tube is built: spiral and convolute winding, board weights and wall '
  + 'thickness in millimeters, liners for food contact, and which closure suits which product.';
export const published = '2026-08-28';
export const updated = '2026-08-28';
export const about = ['Paper tube', 'Packaging', 'Paperboard'];

// 40-70 words, counted by scripts/validate-resources.mjs
export const answer =
  'A paper tube is a wound paperboard body with a separate closure at one or both ends. '
  + 'The body is either spiral wound, where plies run at an angle around the axis, or '
  + 'convolute wound, where one ply is wrapped parallel to the axis. Wall thickness runs '
  + 'from about 0.5 mm for retail packs to 3 mm and above for load-bearing cores.';

export const intro = [
  'Almost every decision about a tube follows from three things: how the body is wound, how thick the wall is, and what sits on the inside surface. Everything else — the printed wrap, the finish, the cap — is applied to that body afterwards.',
  'This page sets out what each of those choices actually changes, in the units a specification is written in. The dimensions repeat the ones in the ' + a('tube diameter and length reference', PAGES.sizes.route) + ', so a figure read here is the same figure a quote is built from.',
];

const WALLS = {
  caption: 'Wall thickness classes and what each is used for',
  cols: ['Wall thickness', 'Class', 'Typical use', 'Trade-off'],
  rows: [
    ['0.5 – 1.0 mm', 'Thin', 'Retail packs, lightweight contents, short bodies', 'Dents under point loads; not for courier handling'],
    ['1.0 – 1.5 mm', 'Standard', 'The default for most work, retail and mail alike', 'Adds weight over thin wall at high volumes'],
    ['1.5 – 3.0 mm', 'Thick', 'Courier shipments, diameters of 3 inches and above', 'Heavier, and the cap must be sized to the thicker wall'],
    ['3.0 mm and above', 'Industrial', 'Cores carrying load, long unsupported spans', 'Overspecified for retail; cost rises with every ply'],
  ],
};

const BOARDS = {
  caption: 'Body materials and what each surface does',
  cols: ['Material', 'Surface', 'Print behavior', 'Recycling note'],
  rows: [
    ['Natural kraft', 'Uncoated brown board', 'Ink sinks in; colors read muted and warm', 'Recyclable as paper where the closure separates'],
    ['White board', 'Coated white', 'Full-color artwork holds its intended color', 'Recyclable as paper; coating weight matters'],
    ['Printed wrap', 'Offset-printed paper laminated to the tube', 'Photographic detail and exact brand color', 'Paper on paper, so it stays in the paper stream'],
    ['Black board', 'Through-colored', 'The cut edge stays dark, so no white line shows', 'Dyed fibre; check the local program accepts it'],
    ['Plastic', 'Extruded squeeze tube', 'Screen or offset onto the sleeve', 'Not a paper stream; a different route entirely'],
  ],
};

const LINERS = {
  caption: 'Liners, by what they are asked to keep out',
  cols: ['Liner', 'Barrier against', 'Typical contents', 'Limitation'],
  rows: [
    ['Greaseproof', 'Fat and grease', 'Confectionery, baked goods', 'Little moisture or oxygen protection'],
    ['PE-coated', 'Moisture', 'Sugar, salt, powders', 'Adds a polymer layer to the paper stream'],
    ['Metallized film', 'Moisture and some oxygen', 'Spices, tea', 'Not a full oxygen barrier for long shelf lives'],
    ['Aluminum foil laminate', 'Moisture and oxygen', 'Coffee, premium tea', 'Highest barrier, hardest to recycle'],
    ['PLA-coated', 'Moisture', 'Dry goods where a compostable claim is wanted', 'Needs industrial composting, not home composting'],
  ],
};

const CLOSURES = {
  caption: 'Choosing a closure',
  when: 'If the pack has to…',
  rows: [
    ['survive a courier and stay shut', 'Plastic push cap', 'Best retention for the cost, and it reseats after opening', 'Adds a non-paper part to a paper pack'],
    ['stay all paper', 'Paperboard plug cap', 'Keeps the whole pack in one material stream', 'Less retention than a plastic cap under vibration'],
    ['present as a gift', 'Telescoping lid', 'No separate cap to lose; the lid is part of the pack', 'Slower to fill; not a shipping closure on its own'],
    ['seal food and reseal it', 'Metal (tin-plate) ends', 'Best seal and reseal', 'Seamed metal is hard to separate for recycling'],
    ['hold powder or loose dry goods', 'Rolled edge and shive', 'The shive plugs the mouth so fines do not escape', 'Not a barrier closure by itself'],
    ['dispense a solid stick', 'Push-up base', 'The user advances the product without touching it', 'Only suits solids, not liquids or gels'],
  ],
};

const WIND_SVG = `
<rect x="0" y="0" width="640" height="240" fill="none"/>
<g stroke="#1c56c4" stroke-width="2" fill="none">
  <rect x="40" y="70" width="230" height="90" rx="6"/>
  <path d="M40 160 L110 70 M75 160 L145 70 M110 160 L180 70 M145 160 L215 70 M180 160 L250 70 M215 160 L270 90 M40 125 L80 70"/>
</g>
<g stroke="#0f7a4d" stroke-width="2" fill="none">
  <rect x="370" y="70" width="230" height="90" rx="6"/>
  <path d="M410 70 L410 160 M450 70 L450 160 M490 70 L490 160 M530 70 L530 160 M570 70 L570 160"/>
</g>
<g font-family="system-ui,sans-serif" font-size="15" fill="#1f2937">
  <text x="40" y="55" font-weight="700">Spiral wound</text>
  <text x="370" y="55" font-weight="700">Convolute wound</text>
  <text x="40" y="190">Plies run at an angle around the axis,</text>
  <text x="40" y="210">wound continuously, then cut to length.</text>
  <text x="370" y="190">One ply wrapped parallel to the axis,</text>
  <text x="370" y="210">edge to edge, under higher tension.</text>
</g>
<g stroke="#6b7280" stroke-width="1.5" fill="none" marker-end="url(#a)">
  <path d="M155 175 L155 200" opacity="0"/>
</g>`;

export const SECTIONS = [
  {
    mod: 'winding', eyebrow: 'Construction', h2: 'How is a paper tube actually made?',
    body: paras([
      'A tube body is wound from paperboard plies glued together as they go onto a mandrel. There are two ways to do it, and they produce different tubes from the same board.',
    ])
    + diagram({
      title: 'Spiral and convolute winding compared',
      desc: 'Two rectangles representing tube walls. The left shows plies running diagonally across the wall, the pattern left by spiral winding. The right shows plies running straight along the axis, the pattern left by convolute winding.',
      svg: WIND_SVG,
      caption: 'The seam pattern is the quickest way to tell the two apart on a finished tube.',
    })
    + definitions([
      { term: 'Spiral wound', what: 'Plies are fed at a continuous angle around the tube axis and wound without stopping, then cut to length.', why: 'It is the faster and cheaper process, and length is effectively unlimited, which is why most mailing and retail tubes are made this way.' },
      { term: 'Convolute wound', what: 'A single ply is wrapped edge to edge, parallel to the axis, under higher tension.', why: 'It is slower, and it is the construction normally reached for on heavy-duty cores and precision work.' },
      { term: 'Ply', what: 'One layer of board in the wall.', why: 'Wall thickness is built by adding plies, so a thicker wall costs more per tube in material and in winding time.' },
      { term: 'Mandrel', what: 'The steel former the tube is wound onto.', why: 'It fixes the internal diameter, which is why internal diameter is the dimension a tube is ordered by, not external.' },
    ])
    + paras([
      'Published comparisons of the two do not agree on which is stronger: some describe spiral wound tubes as more crush resistant in thick walls, others describe convolute tubes as the higher-strength construction. We have not tested them side by side, so this page does not claim a winner. What is not in dispute is the process difference above, and that is usually what decides the choice.',
    ]),
  },
  {
    mod: 'wall', eyebrow: 'Specification', h2: 'How thick does the wall need to be?',
    body: paras(['Wall thickness is the single specification that most often gets set too low. It is quoted in millimeters, and it is independent of diameter — a 2-inch tube and a 6-inch tube can both be built at 1.2 mm.'])
      + table(WALLS)
      + paras(['A useful rule when the contents are light: the wall carries the handling, not the product. A rolled print weighs almost nothing, but the tube still has to survive a sorting belt, and that is what the thicker wall buys.']),
  },
  {
    mod: 'board', eyebrow: 'Materials', h2: 'Which board should the body be?',
    body: table(BOARDS) + paras([
      'The choice is usually made on how the artwork has to look. Uncoated kraft mutes color and warms it, which suits earthy and minimal brands and works against bright, exact brand colors. Where a color has to be matched precisely, a printed wrap laminated to the body is the reliable route, because the printing happens flat before it ever touches the tube.',
    ]),
  },
  {
    mod: 'liner', eyebrow: 'Food contact', h2: 'What goes on the inside surface?',
    body: paras([
      'A liner is laminated to the inside wall and is what actually sits against the product. For food, the liner and the board together are what make the pack suitable, not the tube shape.',
    ]) + table(LINERS) + paras([
      'In the United States, paper and paperboard intended for contact with aqueous and fatty foods is governed by 21 CFR 176.170, with dry foods covered separately in 176.180 of the same part. Our guide to ' + a('choosing a food-safe tube liner', '/food-safe-tube-packaging-choosing-a-liner/') + ' works through it food by food.',
    ]),
  },
  {
    mod: 'closure', eyebrow: 'Closures', h2: 'Which closure suits which product?',
    body: decision(CLOSURES) + paras([
      'A closure is also a recycling decision. A plastic push cap lifts off and goes its own way; a seamed metal end does not separate easily, which is where ' + a('what actually recycles in a tube', PAGES.sustain.route) + ' takes over.',
    ]),
  },
  {
    mod: 'ordering', eyebrow: 'Ordering', h2: 'What does this mean for an order?',
    body: paras([
      ORDERING.moq + ' ' + ORDERING.smallRun,
      ORDERING.lead + ' ' + ORDERING.shipping,
      ORDERING.samples + ' Send the internal diameter, the length, the wall class and what the tube has to hold, and the rest of the specification can be filled in from those four.',
    ]) + paras([
      'If you would rather work through it as a form, the ' + a('step-by-step tube specification builder', '/design-your-tube-packaging/') + ' collects the same four and suggests the rest.',
    ]),
  },
  {
    mod: 'limits', eyebrow: 'Limitations', h2: 'Where does this guidance stop?',
    body: limitations([
      { what: 'Wall classes are ranges, not guarantees.', detail: 'Two tubes at 1.2 mm built from different board grades will not behave identically; the grade matters as well as the thickness.' },
      { what: 'Liner choice does not fix a shelf-life problem on its own.', detail: 'Headspace, fill temperature and the closure seal all move the result, and none of them are properties of the liner.' },
      { what: 'Compostable coatings need industrial composting.', detail: 'A PLA-coated liner is not a home-compost claim, and it is not accepted by every municipal program.' },
      { what: 'We have not run comparative strength tests.', detail: 'Where this page describes spiral and convolute construction it describes the process, not a measured strength ranking.' },
      { what: 'Nothing here is a regulatory clearance.', detail: 'Food-contact suitability is confirmed against your specific product and market, not assumed from a liner name.' },
    ]),
  },
];

export const faqH2 = 'Common questions about tube materials';
export const FAQS = [
  { q: 'What is the difference between spiral wound and convolute wound tubes?', a: ['Spiral winding feeds plies at a continuous angle around the axis and runs without stopping, so it is faster and length is effectively unlimited. Convolute winding wraps a single ply parallel to the axis, edge to edge, under higher tension, and is the construction normally used for heavy-duty cores.'] },
  { q: 'Is tube wall thickness measured in millimeters or in plies?', a: ['It is specified in millimeters, because that is what has to match the cap and the handling. Plies are how the thickness is built, not how it is ordered. Our classes run from 0.5 to 1.0 mm at the thin end to 3 mm and above for industrial cores.'] },
  { q: 'Which internal diameter should I order by?', a: ['Always the internal diameter. The mandrel sets it, the contents have to fit inside it, and the cap is sized to it. External diameter changes with wall thickness, so ordering by it produces a tube that does not hold what you expected.'] },
  { q: 'Can a kraft tube hold food?', a: ['Not on the board alone. Food contact comes from the liner laminated to the inside wall together with the board. In the United States the relevant rules for paper and paperboard in contact with aqueous and fatty foods sit in 21 CFR 176.170, with dry foods in 176.180.'] },
  { q: 'Why does printing on kraft look duller than the artwork?', a: ['Uncoated brown board absorbs ink, so colors read muted and warm and light tones shift towards the board color. If an exact brand color matters, print the artwork flat on a wrap and laminate it to the tube instead.'] },
  { q: 'Does a thicker wall always mean a stronger pack?', a: ['It usually means more resistance to denting and crushing, but the board grade matters as well. A thicker wall in a weaker grade can perform no better than a thinner wall in a stronger one, which is why the grade is specified alongside the thickness.'] },
  { q: 'What is a shive?', a: ['A shive is the plug that seats inside a rolled edge at the end of a tube. It is used for powders and loose dry goods, where the job is to stop fines escaping rather than to form a barrier seal.'] },
  { q: 'Are metal ends better than plastic caps?', a: ['They seal and reseal better, which is why they are used for food and confectionery. The trade-off is recycling: a seamed metal end is hard to separate from the paper body, while a plastic cap simply lifts off.'] },
  { q: 'Can the tube be square rather than round?', a: ['Yes. Square-section bodies are made for presentation packs where the pack has to sit flat on a shelf without rolling. The wall and liner choices are the same; only the former changes.'] },
  { q: 'What is the minimum order for a custom tube?', a: ['The standard minimum is 500 pieces. Smaller runs from around 100 pieces are possible at a higher per-piece cost, because setup and printing are fixed regardless of quantity.'] },
];

export const RELATED = [PRODUCTS.kraft, PRODUCTS.white, PRODUCTS.cardboard, PRODUCTS.industrial, PRODUCTS.food, PRODUCTS.plastic];

export const sourcesLead =
  'The regulatory and standards references on this page were read at the source rather than quoted from secondary summaries.';
export const citations = [SOURCES.cfr176170, SOURCES.cfr176, SOURCES.astmD642];
export const reviewer = null;
