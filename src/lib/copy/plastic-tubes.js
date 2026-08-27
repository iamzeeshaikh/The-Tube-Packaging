import { P, a, SIZE_CLASSES, WALL_CLASSES } from './_shared.js';

/* ══════════════════════════════════════════════════════════════════════
   CUSTOM PLASTIC TUBES — intent: hold a formulation paper cannot
   2,834 impressions, position 23.64, 0 clicks. 6 products.
   The honest assessment is in reports/owner-decisions.md: the whole
   plastic query set is 45 queries, 13,415 impressions, 24 clicks at
   0.18% CTR and weighted position 32.4 — the weakest on the site. The
   page is not the problem; the site does not rank for plastic. It is
   built shortest of the five on purpose, and it does the one job it can
   do well: routing the buyer to the right material rather than the
   right tube.
   ══════════════════════════════════════════════════════════════════════ */
export const route = '/product-category/custom-plastic-tubes/';

export default {
  intro: {
    eyebrow: 'When paper cannot hold it',
    h2: 'Plastic squeeze tubes for creams, gels and liquids',
    paras: [
      'A plastic tube is a different object from everything else on this site. It is extruded or laminated rather than wound, it collapses as it empties instead of holding its shape, and it dispenses through a nozzle rather than opening at the end. That is why it exists here: a lotion, gel or serum with any water content will soften a paper wall from the inside, and no liner fixes that in a wound tube.',
      `So the decision is about the formulation, not the look. Anything wet, oily or dispensed by squeezing belongs in plastic. Anything solid, dry or powdered is better served by ${a(P + '/product-category/custom-paper-tubes/', 'the paper tubes range')}, which prints better, costs less and recycles more simply.`,
    ],
    cta: `If you are weighing paper against plastic for a solid balm, ${a(P + '/product/paper-lip-balm-tubes/', 'the paper lip balm tubes page')} is the direct comparison.`,
  },
  fit: {
    eyebrow: 'Decision aid',
    h2: 'Which plastic tube fits your formulation',
    lead: 'Diameter is set by fill volume and how the product is dispensed. Wall material is set by what the formulation does to plastic over time.',
    table: {
      caption: 'Formulation type, tube build and the diameter it lands in',
      cols: ['What you are packing', 'Tube build', 'Tube diameter', 'Size class'],
      rows: [
        ['Lip gloss, liquid lipstick', 'Slim tube with a wand applicator', '½″ – ¾″', 'Small'],
        ['Lip balm, solid stick balms', 'Push-up stick tube with a screw base', '¾″ – 1″', 'Small'],
        ['Serums, eye creams, small skincare', 'Laminate squeeze tube, narrow orifice', '¾″ – 1¼″', 'Small'],
        ['Face and hand creams', 'Squeeze tube, screw or flip-top cap', '1¼″ – 1¾″', 'Small to medium'],
        ['Body lotion and larger skincare', 'Squeeze tube, flip-top or disc cap', '1¾″ – 2½″', 'Medium'],
        ['Gels, masks, styling products', 'Squeeze tube, wide orifice or nozzle cap', '1½″ – 2½″', 'Medium'],
      ],
    },
    note: 'Plastic tubes are ordered by outside diameter and fill volume rather than internal diameter, which is the opposite convention from every paper tube on this site.',
    cta: `${a(P + '/product/lotion-tubes/', 'The lotion tubes page')} covers the most-ordered sizes in this range.`,
  },
  spec: {
    eyebrow: 'Specifications',
    h2: 'Plastic tube specifications',
    lead: 'Standard industry specifications available through our manufacturing partners. Plastic tubes are specified in four things: diameter, fill volume, wall material and closure.',
    blocks: [
      {
        h3: 'Materials and what each one is for',
        table: {
          caption: 'Tube wall materials',
          cols: ['Material', 'Character', 'Best for'],
          rows: [
            ['LDPE', 'Soft, very squeezable, good recovery', 'Creams and lotions where feel matters'],
            ['HDPE', 'Stiffer wall, better chemical resistance', 'Products with actives or solvents'],
            ['PP', 'Rigid, heat resistant, glossy', 'Slim cosmetic tubes and hot-fill products'],
            ['ABL — aluminum barrier laminate', 'Foil layer in the wall, no recovery after squeezing', 'Oxygen-sensitive formulations; the highest barrier'],
            ['PBL — plastic barrier laminate', 'EVOH barrier layer, keeps some recovery', 'Barrier without the dead-fold look of foil'],
            ['PCR blends', 'Post-consumer recycled content in the wall', 'Recycled-content targets; confirm percentage per build'],
          ],
        },
        note: 'A barrier laminate is only worth the cost when the formulation is oxygen-sensitive. For most creams and gels, LDPE or a PE blend is the right answer.',
      },
      {
        h3: 'Closures and orifices',
        table: {
          caption: 'Cap and orifice options',
          cols: ['Closure', 'How it works', 'Best for'],
          rows: [
            ['Screw cap', 'Threaded cap over a standard orifice', 'General purpose, lowest cost'],
            ['Flip-top cap', 'Hinged lid over the orifice', 'One-handed use; the default for lotion'],
            ['Disc-top cap', 'Press-open disc, self-closing', 'Thicker creams and gels'],
            ['Nozzle or precision tip', 'Narrow extended orifice', 'Serums and targeted application'],
            ['Wand applicator', 'Doe-foot wand in the cap', 'Lip gloss and liquid lip products'],
            ['Push-up base', 'Screw mechanism raising a solid stick', 'Balms and solid sticks'],
          ],
        },
      },
      {
        h3: 'Printing on plastic',
        paras: [
          'Offset and silkscreen printing are the two standard routes for plastic tubes, with hot foil available for metallic detail. Silkscreen gives strong solid color and works well on small type; offset handles gradients and photographic work better.',
          'A shrink sleeve is the other option, and it is worth considering when the artwork wraps the whole tube or when several variants share one tube — the sleeve changes, the tube does not, which reduces the setup cost across a range.',
        ],
      },
      {
        h3: 'Ordering',
        paras: [
          'Our standard minimum is 500 pieces, and smaller runs from around 100 pieces are possible at a higher per-piece cost, because setup and printing are fixed regardless of quantity. Per-piece cost drops significantly as quantity increases.',
          'Plastic tubes carry a tooling consideration that paper tubes do not: the diameter and cap combination has to come from an existing set unless the volume justifies new tooling. Tell us the fill volume and the diameter you want and we will confirm what is available before quoting.',
        ],
      },
    ],
    cta: `Empty stock formats are the fastest route for a first run — ${a(P + '/product/empty-lotion-tubes/', 'the empty lotion tubes page')} covers unprinted builds.`,
  },
  faqH2: 'Plastic tube questions buyers actually ask',
  faqs: [
    { q: 'Should I use a plastic tube or a paper one?',
      a: ['Formulation decides it. Anything with water content, oil content, or that is dispensed by squeezing — lotions, gels, serums, creams — needs plastic, because a wet formulation will soften a wound paper wall from the inside regardless of the liner.',
          'Solids, dry goods, powders and pressed balms are better in paper: it prints better, costs less and recycles more simply.'] },
    { q: 'What is an ABL tube and do I need one?',
      a: ['An aluminum barrier laminate has a foil layer inside the tube wall, which gives the highest oxygen and moisture barrier available in a squeeze tube. It does not spring back after squeezing, which some brands like and some do not.',
          'It is worth the cost only when the formulation is genuinely oxygen-sensitive. For most creams and gels, LDPE or a PE blend is the correct answer.'] },
    { q: 'Can plastic tubes be made with recycled content?',
      a: ['Yes. PCR blends put post-consumer recycled material into the tube wall, and the achievable percentage depends on the wall material and the finish you want. Confirm the percentage per build, because it varies by supplier and by tube diameter.'] },
    { q: 'What is the minimum order quantity?',
      a: ['Our standard minimum is 500 pieces, with smaller runs from around 100 pieces available at a higher per-piece cost, since setup and printing are fixed regardless of quantity.',
          'Plastic carries one extra constraint: the diameter and cap combination has to come from an existing tooling set unless the volume justifies new tooling, so confirm the size is available before planning a run.'] },
    { q: 'Do you supply empty lip gloss tubes with a wand applicator?',
      a: ['Yes. Slim tubes with a doe-foot wand in the cap are a standard format here, normally ½″ to ¾″ in diameter, and they are supplied empty for you to fill.',
          'The two things to specify are the wand shape, which changes how the product applies, and whether you want the tube clear, frosted or opaque — a clear tube shows the color of the product, which is worth having when the shade is the selling point.'] },
    { q: 'Can I buy empty lotion, hand cream or ointment tubes to fill myself?',
      a: ['Yes, everything in this range is supplied empty. Unprinted stock tubes are the fastest route to a first fill and the lowest cost at any quantity, and they can be labeled rather than printed while a formulation is still being tested.',
          'Tell us the fill volume and how the product is dispensed. A thick ointment wants a wider orifice and a stiffer wall; a light lotion wants a softer wall that recovers its shape after squeezing.'] },
    { q: 'Do you supply cosmetic squeeze tubes wholesale?',
      a: ['Yes. The standard minimum is 500 pieces and per-piece cost drops significantly with quantity, with smaller runs from around 100 pieces available at a higher per-piece cost.',
          'One constraint that paper tubes do not have: the diameter and cap combination has to come from an existing tooling set unless the volume justifies new tooling. Confirm the size is available before planning a run.'] },
    { q: 'What sizes and fill volumes are available?',
      a: ['Diameters run from about ½″ for a lip gloss up to 2½″ for body lotion, and the fill volume follows from the diameter and the length together. As a rough guide, a ¾″ tube suits a serum or eye cream, 1¼″ to 1¾″ suits a face or hand cream, and 1¾″ to 2½″ suits body lotion.',
          'Plastic tubes are the one exception on this site: they are ordered by outside diameter and fill volume, not internal diameter.'] },
    { q: 'Can plastic tubes be printed in full color?',
      a: ['Yes. Offset printing handles gradients and photographic work; silkscreen gives strong solid color and holds small type well; hot foil adds metallic detail.',
          'A shrink sleeve is the other route and it is worth considering when several shades or variants share one tube — the sleeve changes and the tube does not, which cuts setup cost across a range.'] },
    { q: 'Are plastic tubes recyclable?',
      a: ['A single-material PE tube with a matching cap is the most recyclable build available in this format, and it is the one to ask for if that matters. PCR blends put post-consumer recycled content into the wall, with the achievable percentage depending on the material and finish.',
          'An aluminum barrier laminate is the opposite case: it gives the best oxygen barrier and the worst recyclability, because the layers cannot be separated. That trade-off is worth making deliberately, and only when the formulation genuinely needs the barrier.'] },
  ],
  faqCta: `Working across both materials? ${a(P + '/shop/', 'The full product range')} lists every tube on the site in one place.`,
  tiles: {
    '66': 'The general-purpose squeeze tube — the starting point when the formulation is set but the size is not.',
    '194': 'Standard lotion sizes with flip-top and disc caps, for creams and body products.',
    '200': 'Unprinted stock lotion tubes — the fastest route to a first fill.',
    '201': 'Narrower orifices and smaller fills, sized for serums and treatment products.',
    '216': 'Slim tubes with a doe-foot wand applicator in the cap.',
    '211': 'Push-up stick format in white, for solid balms and lip products.',
  },
};
