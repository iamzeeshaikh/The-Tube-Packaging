import { P, a, SIZE_CLASSES, WALL_CLASSES } from './_shared.js';

/* ══════════════════════════════════════════════════════════════════════
   /shop/ — 10,731 impressions, position 12.34, 8 clicks, 35 products.
   Only 42 inbound internal links against the categories' 224–343, so it
   is under-linked as well as thin. Its job is orientation: route by
   material and by size vocabulary, not repeat any one category.
   ══════════════════════════════════════════════════════════════════════ */
export const route = '/shop/';

export default {
  intro: {
    eyebrow: 'The full range',
    h2: 'Every tube we supply, and how to find the right one',
    paras: [
      'Thirty-five tube products across five categories, all custom printed and made to your dimensions. They divide by what the tube has to do rather than by what goes inside it: cardboard for protection, mailing for transit, paper for retail presentation, specialty for lined and finished builds, and plastic for anything squeezed out of a nozzle.',
      `If you already know your dimensions, order by internal diameter — that is the number the product has to fit through. If you do not, ${a(P + '/tube-size-guide/', 'the tube size guide')} works the other way round, from the product to the diameter, the wall and the closure.`,
    ],
    cta: 'Every product on this page is quoted to your specification. Standard minimum is 500 pieces, with smaller runs from around 100 pieces at a higher per-piece cost.',
  },
  fit: {
    eyebrow: 'Where to start',
    h2: 'Which category you need',
    lead: 'The fastest way through 35 products is to pick the job first. Each category below is specified around a different failure mode.',
    table: {
      caption: 'The five categories and what separates them',
      cols: ['Category', 'The job it is specified for', 'Typical wall', 'Typical diameter'],
      rows: [
        [`${a(P + '/product-category/custom-cardboard-tubes/', 'Custom cardboard tubes')}`, 'Protection — crush load, stacking, drops', '1.5 – 3.0 mm', '1½″ – 12″'],
        [`${a(P + '/product-category/mailing-tubes/', 'Mailing &amp; shipping tubes')}`, 'Transit — courier handling, end caps that stay on', '1.5 mm and up', '1½″ – 6″'],
        [`${a(P + '/product-category/custom-paper-tubes/', 'Custom paper tubes')}`, 'Presentation — print surface, finish, shelf appeal', '0.5 – 1.5 mm', '¾″ – 6″'],
        [`${a(P + '/product-category/specialty-tubes/', 'Specialty tubes')}`, 'Interior — barrier liners, food contact, finish systems', '1.0 – 2.5 mm', '¾″ – 5″'],
        [`${a(P + '/product-category/custom-plastic-tubes/', 'Custom plastic tubes')}`, 'Formulation — creams, gels and liquids that are squeezed', 'n/a — extruded', '½″ – 2½″'],
      ],
    },
    note: 'A product can legitimately sit in two categories. Candle tubes appear under both cardboard and paper because the right answer depends on whether the tube ships or sells.',
  },
  spec: {
    eyebrow: 'Sizes',
    h2: 'Sizes across the whole range',
    lead: 'The same size vocabulary is used on every page of this site, so a large tube means the same thing wherever you read it.',
    blocks: [
      {
        h3: 'What small, medium, large and extra large mean',
        lead: 'Buyers ask for a large cardboard tube far more often than for a 4-inch one. These are the ranges those words map to here.',
        table: SIZE_CLASSES,
        note: 'Large tubes generally start at 3″ internal diameter and run to 12″, with lengths to 48″ on standard tooling. Small tubes are anything under 1½″.',
      },
      {
        h3: 'What thin, standard and thick mean',
        lead: 'Thickness refers to the wall, never the diameter. It is the specification most often left off an enquiry, and the one that decides whether a tube arrives dented.',
        table: WALL_CLASSES,
        note: 'If the tube is going through a courier, specify 1.5 mm or heavier whatever its diameter.',
      },
      {
        h3: 'What to send with an enquiry',
        paras: [
          'Four numbers and one sentence get a quote back quickly: internal diameter, length, wall thickness or size class, quantity, and what is going inside. The last one matters more than it sounds, because it decides the liner and the closure.',
          `If any of those are still open, say which — a quote against a range is more useful than a quote against a guess. ${a(P + '/contact-us/', 'Send what you have through the contact form')} and we will fill in the rest.`,
        ],
      },
    ],
  },
  faqH2: 'Questions about ordering across the range',
  faqs: [
    { q: 'How do I know which diameter to order?',
      a: ['Order by internal diameter, because that is the dimension the product has to pass through, and allow 1 to 2 mm of clearance over the widest part of the contents. For rolled goods, measure the roll rather than the flat sheet.',
          'Plastic squeeze tubes are the exception — they are ordered by outside diameter and fill volume.'] },
    { q: 'What is the minimum order quantity?',
      a: ['Our standard minimum is 500 pieces across every product on this page. We can produce smaller runs — from around 100 pieces — at a higher per-piece cost, since setup and printing are fixed regardless of quantity.',
          'Per-piece cost drops significantly as quantity increases, so it is worth asking for pricing at two or three quantities.'] },
    { q: 'Can I get the same design across several tube sizes?',
      a: ['Yes, and it is worth planning for. Artwork is set per size because the wrap circumference changes, so supply the design as a scalable layout rather than a fixed one, and keep critical type away from the vertical seam on every size.'] },
    { q: 'Do you supply unprinted tubes?',
      a: ['Yes. Plain kraft and plain white tubes are available across the paper and cardboard ranges, and unprinted stock formats exist in the plastic range. Unprinted is the lowest-cost configuration at every quantity and the fastest to produce.'] },
  ],
  faqCta: `Not sure which category to start in? ${a(P + '/tube-size-guide/', 'The tube size guide')} routes from the product to the tube.`,
  // /shop/ lists products from every category, so its tile notes are the same
  // lines the product's own category uses. Written once, not restated.
  tiles: {},
};
