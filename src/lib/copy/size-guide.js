import { P, a, SIZE_CLASSES, WALL_CLASSES, POLICY_FAQS } from './_shared.js';

/* ══════════════════════════════════════════════════════════════════════
   /tube-size-guide/ — Batch C
   ══════════════════════════════════════════════════════════════════════
   This page exists because of one measured gap: buyers search relative
   size words, the site ranks for them, and nothing on the site defines
   what they mean. From the GSC export [export]:

     large tube                        7,100 impr    1 click    pos 14.44
     large cardboard tubes             4,681        25          pos 16.81
     large tubes                       1,418         5          pos 14.53
     small tube packaging                969         1          pos 10.95
     largetube                           784         0          pos  7.41
     large cardboard tube                785         8          pos 20.33
     large round cardboard tubes         507         0          pos  7.52
     large cardboard cylinder tubes      468         3          pos  4.14
     thick cardboard tubes for crafts    702         7          pos  9.02
     thick cardboard tubes               527         6          pos 11.89
     small cardboard tubes               567         8          pos 13.53
     small paper tubes                   276         7          pos  7.52
     small diameter paper tubes          380         1          pos  7.05
     large diameter cardboard tubes      344         5          pos 16.45

   All fourteen figures were re-checked against data/gsc/queries.csv
   programmatically before this page was written; none is from memory.

   So the relative-size words go in the headings, not only in a table. A
   table of dimensions with no "large / small / thick" language would not
   capture these queries, which is the whole point of the page.

   It is also a sales tool, not only a traffic play: Stage 4 found the
   genuine fit-checking demand is closer to 1,900 impressions than 26,899.
   Its real job is letting a buyer arrive at the quote form already
   knowing the diameter, the wall and the closure they need.

   No lead time and no price figure appears anywhere on this page.
   ══════════════════════════════════════════════════════════════════════ */

export const route = '/tube-size-guide/';
export const title = 'Tube Size Guide: What Large, Small and Thick Mean | The Tube Packaging';
export const description =
  'Cardboard and paper tube sizes explained: what large, small and thick mean in ' +
  'internal diameter and wall thickness, a full diameter and length reference table, ' +
  'and which tube fits your product.';
export const h1 = 'Tube Size Guide';

export const intro = [
  'Almost every enquiry that reaches us starts with a size word rather than a number. People ask for a large cardboard tube, a small paper tube, a thick tube for shipping. Those words are perfectly reasonable — they just mean different things to different suppliers, which is why quotes come back inconsistent.',
  `This guide fixes the vocabulary. It sets out what small, medium, large and extra large mean in internal diameter, what thin, standard and thick mean in wall thickness, and which tube fits which product. Every page on this site uses these same definitions, so a large tube on ${a(P + '/product-category/custom-cardboard-tubes/', 'the cardboard tubes category')} is the same large tube described here.`,
];

export const SECTIONS = [
  {
    mod: 'intro',
    eyebrow: 'Start here',
    h2: 'What large, small and thick actually mean',
    lead: 'Two numbers describe almost any tube: the internal diameter, which is what the product has to fit through, and the wall thickness, which is what decides whether it survives handling. Size words map to the first; thickness words map to the second.',
    blocks: [
      {
        h3: 'Small, medium, large and extra large — by internal diameter',
        lead: 'Size class is set by internal diameter, never by length. A 2″ tube that is 36″ long is still a medium tube; it is just a long one.',
        table: SIZE_CLASSES,
        note: 'Large tubes generally start at 3″ internal diameter and run up to 12″, with lengths to 48″ on standard tooling. Small tubes are anything under 1½″. Anything above 12″ moves onto non-standard tooling.',
      },
      {
        h3: 'Thin, standard and thick — by wall thickness',
        lead: 'A thick cardboard tube means a heavier wall, not a wider tube. This is the single most common misunderstanding in a tube enquiry, and it is the one that costs money, because the wrong wall either fails in transit or is paid for and never needed.',
        table: WALL_CLASSES,
        note: 'A thick-walled tube of the same diameter costs more per piece. It is worth it once the tube is over 3″ across, once a courier will handle it, or once the contents are heavy enough to press on the wall from the inside.',
      },
    ],
    cta: `If you already know your size class, ${a(P + '/shop/', 'the full product range')} lists every tube we make.`,
  },
  {
    mod: 'fit',
    eyebrow: 'Reference',
    h2: 'Diameter and length reference table',
    lead: 'The full standard range, with the size class each diameter falls into. Diameters are internal — that is the dimension your product has to pass through, and the one you should quote on.',
    blocks: [
      {
        h3: 'Every standard diameter, from small to extra large',
        table: {
          caption: 'Internal diameter, size class, standard length range and common uses',
          cols: ['Internal diameter', 'Size class', 'Typical length range', 'Commonly used for'],
          rows: [
            ['½″ (13 mm)', 'Small', '2″ – 4″', 'Lip gloss, sample tubes, seed tubes'],
            ['¾″ (19 mm)', 'Small', '2″ – 5″', 'Lip balm, solid perfume, single confectionery'],
            ['1″ (25 mm)', 'Small', '2½″ – 6″', 'Lipstick, small balms, spice samples'],
            ['1¼″ (32 mm)', 'Small', '3″ – 7″', 'Deodorant sticks, bath salts, small candles'],
            ['1½″ (38 mm)', 'Small to medium', '3″ – 12″', 'A single rolled poster, incense, tea samples'],
            ['2″ (51 mm)', 'Medium', '4″ – 24″', 'Posters, loose-leaf tea, votive candles'],
            ['2½″ (64 mm)', 'Medium', '4″ – 30″', 'Coffee, spices, pillar candles, cosmetics sets'],
            ['3″ (76 mm)', 'Medium to large', '6″ – 36″', 'Several prints together, gift sets, powders'],
            ['4″ (102 mm)', 'Large', '6″ – 48″', 'Canvas prints, apparel, bottles, large candles'],
            ['5″ (127 mm)', 'Large', '8″ – 48″', 'Banners, textile rolls, wide gift packaging'],
            ['6″ (152 mm)', 'Large to extra large', '10″ – 48″', 'Wide-format prints, wallpaper, signage'],
            ['8″ (203 mm)', 'Extra large', '12″ – 48″', 'Rolled artwork, retail display, cores'],
            ['10″ – 12″ (254 – 305 mm)', 'Extra large', '12″ – 48″', 'Industrial cores, large display and storage'],
          ],
        },
        note: 'Lengths beyond 48″ and diameters beyond 12″ are possible but move onto non-standard tooling, so tell us early if your product needs one.',
      },
      {
        h3: 'How to measure so the tube fits first time',
        paras: [
          'Measure the widest part of the product, not the average, and add 1 to 2 mm of diametric clearance. A tube cut exactly to the product is difficult to fill on a line and difficult to open by hand.',
          'For anything rolled — posters, prints, banners, fabric — measure the roll, not the flat sheet, and roll it the way you actually intend to ship it. A tighter roll fits a smaller tube but sets a curl into the print that never quite comes out.',
          'For length, add 1″ to 2″ beyond the contents so nothing bears against the end caps in transit. That single allowance prevents most of the damage complaints on rolled goods.',
        ],
      },
    ],
    cta: `Larger diameters have their own wall requirements — ${a(P + '/product/large-cardboard-tubes/', 'the large cardboard tubes page')} covers 3″ and above.`,
  },
  {
    mod: 'spec',
    eyebrow: 'Which tube fits my product',
    h2: 'Find your product, get your size',
    lead: 'Work from the product to the tube. Each row gives the diameter range, the size class and the page that covers that build in detail.',
    blocks: [
      {
        h3: 'Product to diameter, size class and range',
        table: {
          caption: 'What you are packing, the size it needs and where to read more',
          cols: ['Your product', 'Internal diameter', 'Size class', 'Where to look'],
          rows: [
            ['Rolled poster or art print', '1½″ – 4″', 'Small to large', a(P + '/product/poster-mailing-tubes/', 'Poster mailing tubes')],
            ['Documents, plans, blueprints', '2″ – 3″', 'Medium', a(P + '/product/cylinder-mailing-tubes/', 'Cylinder mailing tubes')],
            ['Pillar or jar candle', '2½″ – 4″', 'Medium', a(P + '/product/candle-tube-packaging/', 'Candle tube packaging')],
            ['Lip balm or solid balm stick', '¾″ – 1¼″', 'Small', a(P + '/product/paper-lip-balm-tubes/', 'Paper lip balm tubes')],
            ['Deodorant stick', '1¼″ – 1¾″', 'Small to medium', a(P + '/product/deodorant-paper-tubes/', 'Deodorant paper tubes')],
            ['Whole-bean or ground coffee', '2½″ – 3½″', 'Medium', a(P + '/product/tube-food-packaging/', 'Tube food packaging')],
            ['Loose-leaf tea', '2″ – 3″', 'Medium', a(P + '/product/tea-paper-tubes/', 'Tea paper tubes')],
            ['Apparel, scarves, textile rolls', '3″ – 6″', 'Large', a(P + '/product/round-cardboard-tubes/', 'Round cardboard tubes')],
            ['Cosmetics and beauty sets', '1″ – 3″', 'Small to medium', a(P + '/product/cosmetic-tubes/', 'Cosmetic tubes')],
            ['Banners, signage, wide-format', '4″ – 6″', 'Large', a(P + '/product/custom-shipping-tubes/', 'Custom shipping tubes')],
            ['Film, tape, yarn and cores', '3″ – 12″', 'Large to extra large', a(P + '/product/industrial-cardboard-tubes/', 'Industrial cardboard tubes')],
            ['Creams, gels and lotions', '¾″ – 2½″ outside diameter', 'Small to medium', a(P + '/product-category/custom-plastic-tubes/', 'Custom plastic tubes')],
          ],
        },
        note: 'Plastic squeeze tubes are the one exception on this site: they are ordered by outside diameter and fill volume rather than internal diameter.',
      },
      {
        h3: 'Wall thickness and board weight: when a heavier board earns its cost',
        lead: 'Board is typically 250 to 450 gsm per ply in a wound wall, with a 120 to 200 gsm kraft or printed liner on the outside. More plies means a thicker wall and a higher price per piece, so it is worth knowing when to stop.',
        paras: [
          'A standard 1.0 to 1.5 mm wall is enough for a retail tube that will be handled by a person, put on a shelf and opened once. Going heavier adds cost and adds nothing a buyer can see.',
          'A thick 1.5 to 3.0 mm wall earns its cost the moment a courier is involved, the moment the diameter passes about 3″, or the moment the contents are heavy enough to press outward on the wall. Below that threshold the tube arrives dented at the ends even when nothing inside is damaged — and dented ends are what generate the complaint.',
          'Above 3 mm you are into convolute-wound core territory, which is specified for load rather than presentation. That is a different product, not a heavier version of the same one.',
        ],
      },
      {
        h3: 'Closure and cap types, and what each one suits',
        lead: 'The closure is chosen last and matters more than most buyers expect: it decides how the tube opens, how well it holds, and how the pack feels to the person receiving it.',
        table: {
          caption: 'Closure options across paper and cardboard tubes',
          cols: ['Closure', 'How it works', 'Best for'],
          rows: [
            ['Plastic push cap', 'Molded cap pushed into the tube end', 'Mailing and shipping; best retention for the cost'],
            ['Deep-skirt plastic cap', 'Longer skirt gripping more of the wall', 'Large diameters and heavier contents'],
            ['Paperboard plug cap', 'Printed board plug, friction fit', 'Retail tubes that need an all-paper recycling story'],
            ['Telescoping lid and base', 'Two tubes, one sliding over the other', 'Gift, candle and luxury presentation'],
            ['Metal (tin-plate) ends', 'Crimped metal base and lid', 'Heavy contents, food and confectionery, best reseal'],
            ['Rolled edge with a shive', 'Curled rim with an inner disc plug', 'Powders, salts and loose dry goods'],
            ['Push-up base', 'Screw or ratchet mechanism raising the product', 'Lip balm, deodorant and solid sticks'],
            ['Heat-seal foil membrane', 'Foil disc sealed to the rim, peeled to open', 'Food, tamper evidence, maximum initial barrier'],
            ['Crimped or tucked ends', 'Tube wall folded and sealed', 'Single-use formats at the lowest cost'],
          ],
        },
        note: 'On a food tube the closure and the liner are chosen together, because the seal is what the shelf life actually depends on.',
      },
    ],
    cta: `Packing food? ${a(P + '/product-category/specialty-tubes/', 'The specialty tubes category')} covers liners, barriers and food-contact construction.`,
  },
];

export const faqH2 = 'Size questions we are asked most often';

export const FAQS = [
  { q: 'What size is a large cardboard tube?',
    a: ['Large cardboard tubes generally start at 3″ internal diameter and run up to 12″, with lengths to 48″ on standard tooling. Anything between 1½″ and 3″ is medium, and anything under 1½″ is small.',
        'In practice, large means 3″ to 4″ for rolled posters and 4″ to 6″ for apparel, banners and wide-format prints.'] },
  { q: 'How thick is a thick cardboard tube?',
    a: ['Thick refers to the wall, not the diameter. A standard wall is 1.0 to 1.5 mm; a thick or heavy-duty wall is 1.5 to 3.0 mm, built from three to five plies; industrial cores go above 3 mm.',
        'For craft use, a thick cardboard tube usually means the 1.5 to 3.0 mm range — rigid enough to cut, drill and stand upright without deforming.'] },
  { q: 'What size tube do I need for a poster?',
    a: ['For one or two rolled posters, 1½″ to 2″ internal diameter is normal. For heavier stock, several prints together, or anything you do not want tightly curled, move up to 2″ to 3″. Canvas and fine-art prints usually want 3″ to 4″.',
        'Make the tube 1″ to 2″ longer than the rolled artwork so the print is not bearing against the end caps.'] },
  { q: 'Should I measure internal or external diameter?',
    a: ['Internal, for every paper and cardboard tube on this site. It is the dimension the product has to pass through, and quoting on external diameter is the most common cause of a tube arriving that will not accept the product.',
        'Plastic squeeze tubes are the exception and are ordered by outside diameter and fill volume.'] },
  { q: 'What are the standard household cardboard tube sizes?',
    a: ['A toilet roll core is about 1⅝″ (roughly 42 mm) internal diameter and about 4″ long. A kitchen towel core is the same diameter at about 11″ long. A wrapping paper tube is usually about 1½″ internal diameter at 30″ to 40″ long.',
        'These are the standard consumer sizes and we supply plain cores in them, but almost all custom work uses a diameter chosen for the product rather than one of these.'] },
  { q: 'What is the minimum order quantity?',
    a: ['Our standard minimum is 500 pieces, at any size in this guide. We can produce smaller runs — from around 100 pieces — at a higher per-piece cost, since setup and printing are fixed regardless of quantity. Per-piece cost drops significantly as quantity increases.',
        'Share your size, material, printing and quantity and we will send a quote.'] },
  { q: 'What size tube do I need for a candle?',
    a: ['Measure the vessel, not the candle. A standard votive or tin sits in a 2½″ to 3″ internal diameter tube; a pillar or a large jar usually wants 3″ to 4″. Add 1 to 2 mm of clearance so the pack is not a fight to open.',
        'Candles are heavier than they look, so specify a wall that does not flex when the pack is picked up — 1.5 mm or more at these diameters — and a telescoping lid or metal ends rather than a light plug cap.'] },
  { q: 'How do I measure a rolled poster, fabric or banner?',
    a: ['Roll it the way you actually intend to ship it, then measure the roll — not the flat sheet. Rolling tighter fits a smaller tube but sets a curl into the material that never fully relaxes.',
        'Then add 1 to 2 mm of diametric clearance, and make the tube 1″ to 2″ longer than the roll so nothing bears against the end caps in transit. Those two allowances prevent most damage complaints on rolled goods.'] },
  { q: 'What is the largest tube you can make?',
    a: ['12″ internal diameter and 48″ long on standard tooling, which covers rolled artwork, wide-format prints, textiles and most industrial cores.',
        'Larger diameters and longer lengths are possible but move onto non-standard tooling, which changes both the cost and what is practical at low quantities. Tell us early if your product needs one, because it is better designed around than discovered late.'] },
  { q: 'Does printing change the size of the tube?',
    a: ['Not the internal diameter, which is what your product has to fit through — that stays what you specify. What printing changes is the flat artwork dimension, because the wrap has to go all the way round plus an overlap at the seam.',
        'So a design laid out for a 2″ tube will not fit a 3″ one. Ask for the flat dimensions for each size before laying artwork out, and keep critical type clear of the seam on every one.'] },
  ...POLICY_FAQS,
];

export const faqCta =
  `Have your diameter, length and wall? ${a(P + '/tube-configurator/', 'Build it in the tube configurator')} and it reaches us as a specification rather than a message.`;
