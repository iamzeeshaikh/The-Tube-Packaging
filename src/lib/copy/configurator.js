import { P, a } from './_shared.js';

/* ══════════════════════════════════════════════════════════════════════
   /design-your-tube-packaging/ — the specification builder
   ══════════════════════════════════════════════════════════════════════
   Why it exists, in one line: the owner's problem is that leads arrive
   without a specification and die on price, and every page in this
   programme ends by telling the buyer to send four numbers and one
   sentence. This asks for them instead of hoping.

   Two rules govern the build.

   NO PRICE ANYWHERE. Every product on this site shows $0.30 per piece,
   Merchant listings are 44% of clicks, and a second price computed in a
   widget is exactly the "mismatched value (page crawl) [price]" risk the
   whole programme has been built to avoid. There is no estimate, no
   band, no "from" figure. The output is a specification, not a quote.

   PRODUCT FIRST, NOT DIMENSIONS. The GSC export shows buyers searching
   "large tube" (7,100 impressions) rather than "4 inch tube" — they know
   what they are packing, not what it measures. So step 1 asks what goes
   inside, and pre-selects sensible defaults for the steps after it. A
   buyer who knows their dimensions can change any of them; a buyer who
   does not can still finish.
   ══════════════════════════════════════════════════════════════════════ */

export const route = '/design-your-tube-packaging/';
export const title = 'Design Your Tube Packaging | Build a Spec in Minutes | The Tube Packaging';
export const description =
  'Design your custom tube packaging step by step — what you are packing, size, wall '
  + 'thickness, material, closure and finish — then send the specification for a quote.';
export const h1 = 'Design Your Tube Packaging';

export const intro = [
  'Most quote requests arrive with a product and a quantity and nothing else, which means a round of questions before anyone can price anything. This asks for the specification up front instead.',
  `Start with what you are packing and the rest is pre-filled with sensible defaults you can change. Five short steps — six if you are packing food, which adds the liner — no account, and nothing here commits you to anything. If you would rather read first, ${a(P + '/tube-size-guide/', 'the tube size guide')} covers the same ground in prose.`,
];

// Step 1 doubles as the router: each product sets defaults for the steps after
// it, so a buyer who only knows what they are packing can still finish.
export const PACKING = [
  { id: 'posters',   label: 'Posters and prints',      slug: 'poster-mailing-tubes',
    defaults: { size: 'medium', diameter: '2"', length: '24"', wall: 'standard', material: 'kraft', closure: 'plastic-cap' } },
  { id: 'documents', label: 'Documents and drawings',  slug: 'cylinder-mailing-tubes',
    defaults: { size: 'medium', diameter: '2½"', length: '36"', wall: 'standard', material: 'kraft', closure: 'plastic-cap' } },
  { id: 'apparel',   label: 'Apparel and textiles',    slug: 'round-cardboard-tubes',
    defaults: { size: 'large', diameter: '4"', length: '24"', wall: 'thick', material: 'kraft', closure: 'plastic-cap' } },
  { id: 'candles',   label: 'Candles and glassware',   slug: 'candle-tube-packaging',
    defaults: { size: 'medium', diameter: '3"', length: '6"', wall: 'thick', material: 'printed', closure: 'telescoping' } },
  { id: 'cosmetics', label: 'Cosmetics and skincare',  slug: 'cosmetic-tubes',
    defaults: { size: 'small', diameter: '1½"', length: '4"', wall: 'thin', material: 'printed', closure: 'board-cap' } },
  { id: 'balm',      label: 'Lip balm and lipstick',   slug: 'paper-lip-balm-tubes',
    defaults: { size: 'small', diameter: '¾"', length: '3"', wall: 'thin', material: 'printed', closure: 'push-up' } },
  { id: 'food',      label: 'Tea, coffee and food',    slug: 'tube-food-packaging', food: true,
    defaults: { size: 'medium', diameter: '3"', length: '8"', wall: 'standard', material: 'printed', closure: 'metal-ends' } },
  { id: 'creams',    label: 'Creams, gels and lotions', slug: 'lotion-tubes', plastic: true,
    defaults: { size: 'small', diameter: '1½"', length: '6"', wall: 'n/a', material: 'plastic', closure: 'flip-top' } },
  { id: 'other',     label: 'Something else',          slug: 'paper-tubes',
    defaults: { size: 'medium', diameter: '2"', length: '6"', wall: 'standard', material: 'kraft', closure: 'board-cap' } },
];

export const SIZES = [
  { id: 'small',  label: 'Small',       note: 'Under 1½″ internal diameter' },
  { id: 'medium', label: 'Medium',      note: '1½″ – 3″' },
  { id: 'large',  label: 'Large',       note: '3″ – 6″' },
  { id: 'xl',     label: 'Extra large', note: '6″ – 12″' },
  { id: 'unsure', label: 'Not sure yet', note: 'We will suggest one from what you are packing' },
];

export const DIAMETERS = {
  small:  ['½"', '¾"', '1"', '1¼"', '1½"'],
  medium: ['1½"', '2"', '2½"', '3"'],
  large:  ['3"', '4"', '5"', '6"'],
  xl:     ['6"', '8"', '10"', '12"'],
  unsure: ['Not sure yet'],
};

export const LENGTHS = ['3"', '4"', '6"', '8"', '12"', '18"', '24"', '36"', '48"', 'Not sure yet'];

export const WALLS = [
  { id: 'thin',     label: 'Thin',        note: '0.5 – 1.0 mm — retail, lightweight contents' },
  { id: 'standard', label: 'Standard',    note: '1.0 – 1.5 mm — the default for most work' },
  { id: 'thick',    label: 'Thick',       note: '1.5 – 3.0 mm — couriers, large diameters' },
  { id: 'core',     label: 'Industrial',  note: '3 mm and above — cores carrying load' },
  { id: 'n/a',      label: 'Not sure yet', note: 'We will specify it from the handling' },
];

export const MATERIALS = [
  { id: 'kraft',    label: 'Natural kraft',   note: 'Uncoated brown board, recyclable as paper' },
  { id: 'white',    label: 'White board',     note: 'Clean surface for full-colour artwork' },
  { id: 'printed',  label: 'Printed wrap',    note: 'Offset-printed paper laminated to the tube' },
  { id: 'black',    label: 'Black board',     note: 'Through-coloured, so the cut edge stays dark' },
  { id: 'plastic',  label: 'Plastic',         note: 'Squeeze tube for creams, gels and liquids' },
];

export const CLOSURES = [
  { id: 'plastic-cap',  label: 'Plastic push cap',   note: 'Mailing and shipping; best retention for the cost' },
  { id: 'board-cap',    label: 'Paperboard plug cap', note: 'Keeps the pack all paper' },
  { id: 'telescoping',  label: 'Telescoping lid',    note: 'Gift and candle presentation, no separate cap' },
  { id: 'metal-ends',   label: 'Metal (tin-plate) ends', note: 'Best seal and reseal; food and confectionery' },
  { id: 'shive',        label: 'Rolled edge and shive', note: 'Powders and loose dry goods' },
  { id: 'push-up',      label: 'Push-up base',       note: 'Balms, deodorant and solid sticks' },
  { id: 'flip-top',     label: 'Flip-top cap',       note: 'Plastic tubes; one-handed use' },
  { id: 'unsure',       label: 'Not sure yet',       note: 'We will recommend one' },
];

export const FINISHES = [
  { id: 'none',       label: 'None / plain' },
  { id: 'matte',      label: 'Matte lamination' },
  { id: 'gloss',      label: 'Gloss lamination' },
  { id: 'soft-touch', label: 'Soft-touch' },
  { id: 'foil',       label: 'Hot foil' },
  { id: 'emboss',     label: 'Emboss / deboss' },
  { id: 'spot-uv',    label: 'Spot UV' },
];

// only shown when what is being packed is food or drink
export const LINERS = [
  { id: 'greaseproof', label: 'Greaseproof',        note: 'Fat and grease; confectionery, baked goods' },
  { id: 'pe',          label: 'PE-coated',          note: 'Moisture; sugar, salt, powders' },
  { id: 'metallised',  label: 'Metallized film',    note: 'Moisture and some oxygen; spices, tea' },
  { id: 'foil',        label: 'Aluminum foil laminate', note: 'Highest barrier; coffee, premium tea' },
  { id: 'pla',         label: 'PLA-coated',         note: 'Bio-based; compostable-claim route' },
  { id: 'unsure',      label: 'Not sure yet',       note: 'We will specify it from the food and the shelf life' },
];

export const QUANTITIES = [
  { id: '100-499',    label: '100 – 499',   note: 'Below the standard minimum; higher per-piece cost' },
  { id: '500-999',    label: '500 – 999',   note: 'The standard minimum is 500' },
  { id: '1000-2499',  label: '1,000 – 2,499' },
  { id: '2500-4999',  label: '2,500 – 4,999' },
  { id: '5000-9999',  label: '5,000 – 9,999' },
  { id: '10000+',     label: '10,000+' },
];

export const STEPS = [
  { id: 'packing',  title: 'What are you packing?',
    hint: 'This sets sensible defaults for everything after it. You can change any of them.',
    groups: [{ field: 'packing' }] },

  { id: 'size',     title: 'Size',
    hint: 'Internal diameter is the dimension your product has to pass through. Allow 1 – 2 mm over the widest part, and 1″ to 2″ of extra length so nothing bears against the end caps.',
    groups: [
      { field: 'size',     label: 'Size class' },
      { field: 'diameter', label: 'Internal diameter' },
      { field: 'length',   label: 'Length' },
    ] },

  { id: 'build',    title: 'Material and wall',
    hint: 'The wall decides whether it survives handling; the material decides how it looks and prints.',
    groups: [
      { field: 'material', label: 'Material' },
      { field: 'wall',     label: 'Wall thickness' },
    ] },

  { id: 'finish',   title: 'Closure and finish',
    hint: 'The closure decides how it opens and seals. Finish is optional — each one carries its own setup.',
    groups: [
      { field: 'closure', label: 'Closure' },
      { field: 'finish',  label: 'Finish' },
    ] },

  { id: 'liner',    title: 'Food-contact liner',
    hint: 'The liner is what makes a tube food safe, not the wall.',
    food: true,
    groups: [{ field: 'liner' }] },

  { id: 'details',  title: 'Quantity and your details',
    hint: 'Artwork is optional — send it later if it is not ready.',
    groups: [
      { field: 'quantity', label: 'Quantity' },
      { field: 'details' },
    ] },
];

export const outro =
  'Nothing on this page is a price. It builds the specification a quote needs, and sends it '
  + 'to us so the first reply can be an answer rather than a list of questions.';
