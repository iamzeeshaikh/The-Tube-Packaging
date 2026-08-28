import { table, paras, definitions, decision, diagram, limitations } from '../../resource-page.js';
import { ORDERING, SOURCES, PRODUCTS, PAGES, a } from './_shared.js';

export const route = '/resources/printing-and-design/';
export const h1 = 'Printing and Design for Tube Packaging';
export const title = 'Tube Packaging Printing & Design Guide | The Tube Packaging';
export const description =
  'How artwork is printed on a cylindrical pack: wrap versus direct printing, artwork setup, '
  + 'bleed and the seam allowance, finishes, and why color reads differently on kraft.';
export const published = '2026-08-28';
export const updated = '2026-08-28';
export const about = ['Packaging design', 'Printing', 'Paper tube'];

export const answer =
  'Artwork reaches a paper tube one of two ways. It is printed flat onto a paper wrap that is '
  + 'then laminated to the body, or it is printed directly onto the wound tube. The wrap route '
  + 'holds photographic detail and exact brand color; direct printing suits simple one and '
  + 'two-color marks. A cylinder has no back panel, so the layout has to close on itself.';

export const intro = [
  'Designing for a tube is different from designing for a box in one specific way: the panel is continuous. There is no front, back and side — there is one surface that meets itself at a seam, and anything that crosses that seam has to survive being wrapped.',
  'This page covers how the artwork is put on, what the file needs to contain, and which finishes are worth the money on which product.',
];

const METHODS = {
  caption: 'Print methods and what each is for',
  cols: ['Method', 'What it is', 'Best for', 'Limit'],
  rows: [
    ['Printed wrap', 'Offset-printed paper laminated to the wound body', 'Photography, gradients, exact brand color', 'Adds a lamination step, so a longer lead time on complex work'],
    ['Direct print', 'Ink applied to the finished tube', 'One and two-color marks, logos, batch text', 'Flat color only; no fine gradients'],
    ['Hot foil', 'Metallic foil pressed with a heated die', 'Small metallic marks and logos', 'Needs a die; does not suit large solid areas'],
    ['Emboss / deboss', 'Raised or recessed relief pressed into the surface', 'Tactile logos on uncoated board', 'Die cost applies; detail is limited by board thickness'],
    ['Spot UV', 'Gloss varnish on selected areas', 'Contrast against a matte laminate', 'Reads best against matte, not against gloss'],
  ],
};

const SETUP = {
  caption: 'What the artwork file needs',
  cols: ['Item', 'What to supply', 'Why it matters'],
  rows: [
    ['Format', 'Vector artwork with fonts outlined, or 300 ppi at final size', 'A cylinder shows soft edges more than a flat panel does'],
    ['Color', 'CMYK build, plus a named spot color if one has to match', 'Uncoated board shifts color; a named spot is the only reliable match'],
    ['Bleed', 'Artwork extended past every trimmed edge', 'The wrap is trimmed after printing; short artwork leaves a white line'],
    ['Seam allowance', 'A quiet zone where the wrap closes on itself', 'A logo landing on the overlap will be cut by the join'],
    ['Safe area', 'Critical text held in from the top and bottom edges', 'The ends are where caps seat and where handling wears the pack'],
    ['Dimensions', 'Internal diameter, length and wall class', 'The flat wrap size is calculated from these, not guessed'],
  ],
};

const CHOOSE = {
  caption: 'Choosing a print route',
  when: 'If the artwork is…',
  rows: [
    ['a photograph or a gradient', 'Printed wrap', 'Printed flat before it touches the tube, so detail survives', 'Adds a lamination step to the schedule'],
    ['one or two flat colors', 'Direct print', 'No wrap to laminate, so it is the shorter route', 'Not suitable for fine tonal work'],
    ['a small metallic logo', 'Hot foil on a wrap', 'Foil reads as metal in a way printed silver never does', 'A die is required, so it suits repeat designs'],
    ['a tactile mark on brown board', 'Deboss, no ink', 'The relief carries the brand without fighting the board color', 'Needs a die and a board thick enough to hold relief'],
    ['a full-color pack that must match a brand color exactly', 'Wrap with a named spot color', 'A spot ink is mixed, not built from CMYK', 'Spot inks add cost per additional color'],
  ],
};

const WRAP_SVG = `
<g stroke="#1c56c4" stroke-width="2" fill="none">
  <rect x="40" y="60" width="250" height="110" rx="4"/>
  <line x1="40" y1="60" x2="40" y2="170" stroke-dasharray="5 4"/>
  <line x1="66" y1="60" x2="66" y2="170" stroke-dasharray="5 4"/>
  <rect x="24" y="46" width="282" height="138" rx="6" stroke="#c04a1c" stroke-dasharray="6 5"/>
</g>
<g stroke="#0f7a4d" stroke-width="2" fill="none">
  <ellipse cx="470" cy="70" rx="72" ry="20"/>
  <path d="M398 70 L398 170"/><path d="M542 70 L542 170"/>
  <path d="M398 170 A72 20 0 0 0 542 170"/>
  <path d="M470 50 L470 90" stroke="#c04a1c" stroke-dasharray="5 4"/>
</g>
<g font-family="system-ui,sans-serif" font-size="14" fill="#1f2937">
  <text x="24" y="34" font-weight="700">Flat wrap, as printed</text>
  <text x="398" y="34" font-weight="700">Wrapped on the body</text>
  <text x="24" y="205" fill="#c04a1c">Outer dashed line: bleed</text>
  <text x="24" y="224" fill="#1c56c4">Inner dashed band: seam allowance</text>
  <text x="398" y="205" fill="#c04a1c">The seam is where the wrap</text>
  <text x="398" y="224" fill="#c04a1c">closes on itself.</text>
</g>`;

export const SECTIONS = [
  { mod: 'method', eyebrow: 'Print', h2: 'How does artwork get onto a round pack?',
    body: paras(['There is no way to feed a finished cylinder through a press the way a flat sheet goes through. So either the artwork is printed flat first and wrapped on, or it is applied to the tube by a process that tolerates a curved surface.'])
      + table(METHODS)
      + paras(['For most branded retail work the wrap is the answer, because it is the only route that keeps photographic detail and exact color intact.']) },
  { mod: 'file', eyebrow: 'Artwork', h2: 'What does the artwork file have to contain?',
    body: table(SETUP)
      + diagram({ title: 'Bleed and seam allowance on a tube wrap',
          desc: 'On the left, a flat rectangle representing the printed wrap, with an outer dashed border marking bleed and a narrow dashed band at one edge marking the seam allowance. On the right, a cylinder showing where that seam lands once the wrap is applied.',
          svg: WRAP_SVG,
          caption: 'Bleed runs past every trimmed edge; the seam allowance is the strip that ends up under the overlap.' })
      + paras(['Send the internal diameter, the length and the wall class with the artwork; the ' + a('tube size and diameter tables', PAGES.sizes.route) + ' will give you all three. The flat wrap size is calculated from them, and a wrap laid out to a guessed circumference will either gap or overlap into the design.']) },
  { mod: 'color', eyebrow: 'Color', h2: 'Why does the printed color not match the screen?',
    body: definitions([
      { term: 'Substrate shift', what: 'The board color showing through the ink film.', why: 'On natural kraft, every light tone warms towards brown and pastel shades largely disappear; the artwork has to be designed for that, not corrected afterwards.' },
      { term: 'CMYK build', what: 'A color made from four process inks.', why: 'It is economical and reproduces photography, but the same build lands differently on coated white and uncoated kraft.' },
      { term: 'Spot color', what: 'A single ink mixed to a specified reference before printing.', why: 'It is the only reliable way to hold a brand color across repeat runs, and it costs per additional color.' },
      { term: 'Total ink coverage', what: 'The sum of all four process inks in the darkest area.', why: 'Heavy coverage on uncoated board takes longer to dry and can mark during winding, so deep solids are specified carefully.' },
    ]) + paras(['If a brand color is non-negotiable, say so at quote stage. It changes the route: white board or a printed wrap rather than natural kraft, and a named spot ink rather than a process build.']) },
  { mod: 'finish', eyebrow: 'Finishes', h2: 'Which finish is worth paying for?',
    body: decision(CHOOSE)
      + paras(['Finishes work hardest where the pack is picked up. If the pack is meant to feel expensive, ' + a('what makes tube packaging look premium', '/what-makes-tube-packaging-look-premium/') + ' sets out where a limited budget goes furthest.']) },
  { mod: 'ordering', eyebrow: 'Ordering', h2: 'What does a print run need from you?',
    body: paras([
      ORDERING.moq + ' ' + ORDERING.smallRun,
      'Setup, plates and any dies are fixed costs, which is why a 100-piece run costs more per piece than a 1,000-piece run of the same design. ' + a('Ordering custom tubes wholesale', '/how-to-order-custom-tube-packaging-wholesale/') + ' covers how that arithmetic works.',
      ORDERING.lead + ' ' + ORDERING.samples,
    ]) },
  { mod: 'limits', eyebrow: 'Limitations', h2: 'What this page does not cover',
    body: limitations([
      { what: 'Color cannot be guaranteed from a screen proof.', detail: 'A monitor is backlit and a tube is not; where color is critical, ask for a printed proof on the actual board.' },
      { what: 'Not every finish suits every board.', detail: 'Soft-touch and spot UV need a coated surface to sit on, so they change the board choice as well as the budget.' },
      { what: 'Relief detail is limited by board thickness.', detail: 'Fine hairlines in an emboss will not hold in a thin wall.' },
      { what: 'Die costs are per design, not per run.', detail: 'Foil and emboss become economical on repeats, not on one-off short runs.' },
    ]) },
];

export const faqH2 = 'Common questions about printing on tubes';
export const FAQS = [
  { q: 'Can you print full-color photographs on a paper tube?', a: ['Yes, by printing the artwork flat onto a paper wrap and laminating that to the wound body. Photographic detail and gradients survive that route; they do not survive direct printing onto a finished cylinder.'] },
  { q: 'What file format should I send artwork in?', a: ['Vector artwork with the fonts outlined is ideal. If the design contains photography, supply it at 300 ppi at final size. Include the internal diameter, length and wall class so the flat wrap can be laid out to the right circumference.'] },
  { q: 'How much bleed does a tube wrap need?', a: ['Artwork should extend past every trimmed edge rather than stopping on it. The wrap is trimmed after printing, so artwork that finishes exactly on the trim line will show a white edge on some pieces.'] },
  { q: 'What is the seam allowance?', a: ['It is the strip of the wrap that ends up underneath the overlap where the wrap closes on itself. Anything placed there is hidden or cut by the join, so logos and critical text are kept out of it.'] },
  { q: 'Why does my brand color look wrong on kraft?', a: ['Uncoated brown board shows through the ink film. Light tones warm towards brown and pastels largely disappear. If the color has to match exactly, print on white board or a wrap and specify a named spot ink rather than a CMYK build.'] },
  { q: 'Is a spot color worth the extra cost?', a: ['It is the only reliable way to hold the same brand color across repeat runs. If your packaging sits next to other branded items, it usually is. If the design is photographic anyway, a process build is normally enough.'] },
  { q: 'Can I foil and emboss the same area?', a: ['Yes, and the combination reads well on uncoated board. Both need dies, so it suits a design you will reprint rather than a one-off.'] },
  { q: 'Does spot UV work on a matte tube?', a: ['That is exactly where it works best. Spot UV is a gloss varnish, so it needs a matte surface around it to read as contrast. On a gloss laminate there is very little difference to see.'] },
  { q: 'Can you print on the inside of the tube?', a: ['On a wrap-built tube the printed surface is the outside. Inside printing is a separate operation and is not offered as standard, so ask before designing around it.'] },
  { q: 'How small a run can be printed?', a: ['The standard minimum is 500 pieces, and smaller runs from around 100 pieces are possible at a higher per-piece cost. Plates, dies and setup are fixed, so they are spread over fewer pieces on a short run.'] },
];

export const RELATED = [PRODUCTS.white, PRODUCTS.kraft, PRODUCTS.luxury, PRODUCTS.candle, PRODUCTS.cosmetic, PRODUCTS.square];
export const sourcesLead = 'This page describes our own production practice. The one external reference below covers the food-contact rules that constrain what can be applied to a liner.';
export const citations = [SOURCES.cfr176170];
export const reviewer = null;
