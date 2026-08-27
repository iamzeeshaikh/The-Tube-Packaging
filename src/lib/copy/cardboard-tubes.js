import { P, a, SIZE_CLASSES, WALL_CLASSES } from './_shared.js';

/* ══════════════════════════════════════════════════════════════════════
   CUSTOM CARDBOARD TUBES — intent: protection
   13,194 impressions, position 11.67, 7 clicks
   ══════════════════════════════════════════════════════════════════════ */
export const route = '/product-category/custom-cardboard-tubes/';

export default {
  intro: {
    eyebrow: 'Strength first',
    h2: 'Custom cardboard tubes, specified by how much protection you need',
    paras: [
      'A cardboard tube is a rigid wall wound from several plies of paperboard and glued under tension, which is what lets it resist a crush load from the side and hold its shape in a stack. This category is the heavy end of what we supply: internal diameters from about 1½″ up to 12″, walls from a standard 1 mm through thick 3 mm heavy-duty builds, and lengths to 48″ on standard tooling.',
      `Pick cardboard when the job is protection rather than presentation. If you actually need a printed retail surface on a lighter wall, start with ${a(P + '/product-category/custom-paper-tubes/', 'the custom paper tubes range')} — same construction, thinner board, better print.`,
    ],
    cta: `Not sure which wall thickness you need? ${a(P + '/tube-size-guide/', 'The tube size guide')} maps diameter, wall and length to the product going inside.`,
  },
  fit: {
    eyebrow: 'Decision aid',
    h2: 'Which cardboard tube fits your product',
    lead: 'Start from what you are packing. The diameter follows the product; the wall thickness follows how the tube will be handled.',
    table: {
      caption: 'Product type, tube type and the diameter range it normally lands in',
      cols: ['What you are packing', 'Tube type', 'Internal diameter', 'Size class'],
      rows: [
        ['Rolled posters, prints, plans', 'Poster mailing tube, plastic or plug end caps', '2″ – 4″', 'Medium to large'],
        ['Framed art, large-format drawings', 'Large-diameter tube, thick wall', '4″ – 6″', 'Large'],
        ['Apparel rolls, banners, textiles', 'Round cardboard tube, thick wall', '3″ – 6″', 'Large'],
        ['Candles, glassware, bottles', 'Rigid tube with a telescoping lid or metal ends', '2½″ – 4″', 'Medium'],
        ['Film, foil, tape, yarn (cores)', 'Convolute-wound industrial core', '3″ – 12″', 'Large to extra large'],
        ['Gift sets and retail bundles', 'Printed tube box with a paperboard plug cap', '2″ – 3½″', 'Medium'],
      ],
    },
    note: 'Diameters are internal. Order by internal diameter, because that is the number the product has to fit through.',
    cta: `Shipping is the most common use in this category — ${a(P + '/product/custom-shipping-tubes/', 'the custom shipping tubes page')} covers courier-handled builds specifically.`,
  },
  spec: {
    eyebrow: 'Specifications',
    h2: 'Cardboard tube specifications',
    lead: 'Everything below is standard industry specification available through our manufacturing partners. Tell us the product, the quantity and how it ships, and we quote against these.',
    blocks: [
      {
        h3: 'What "large", "small" and "thick" mean here',
        lead: 'Buyers ask for a large cardboard tube far more often than for a 4-inch one, so it is worth being exact about where the words sit.',
        table: SIZE_CLASSES,
        note: 'Large cardboard tubes generally start at 3″ internal diameter and run to 12″, with lengths to 48″ on standard tooling. Anything under 1½″ is a small tube. Larger diameters and longer lengths are possible but move onto non-standard tooling.',
      },
      {
        h3: 'Wall thickness and board weight',
        lead: 'A thick cardboard tube means a heavier wall, not a bigger diameter. Wall thickness is what decides whether the tube survives being dropped, stacked or run through a sorting belt.',
        table: WALL_CLASSES,
        note: 'Board is typically 250 – 450 gsm per ply for wound walls, with a 120 – 200 gsm kraft or printed liner on the outside. Heavier board costs more per piece and is worth it once the tube is over 3″ in diameter or going through a courier.',
      },
      {
        h3: 'Construction: spiral wound or convolute',
        paras: [
          'Spiral-wound tubes are made by winding plies around a mandrel at an angle. They are the economical build, strong in compression, and available in long lengths — the visible spiral seam is normally covered by a printed wrap or a kraft liner.',
          'Convolute (parallel-wound) tubes are wrapped concentrically with no spiral seam. They hold a tighter tolerance and take a higher radial crush load, which is why industrial cores and premium rigid tubes are built this way. Convolute costs more and is the right call when the tube is structural.',
        ],
      },
      {
        h3: 'Closures and end caps',
        lead: 'The closure decides how the tube opens, how well it seals and how it feels to the person receiving it.',
        table: {
          caption: 'Closure types available on cardboard tubes',
          cols: ['Closure', 'How it works', 'Best for'],
          rows: [
            ['Plastic push cap', 'Molded cap pushed into the tube end', 'Mailing tubes, repeated opening, low cost'],
            ['Paperboard plug cap', 'Board plug, often printed to match', 'Retail tubes, all-paper recycling story'],
            ['Metal (tin-plate) ends', 'Crimped metal base and lid', 'Heavy contents, premium feel, food and confectionery'],
            ['Telescoping lid and base', 'Two tubes, one sliding over the other', 'Gift and luxury presentation, no separate cap'],
            ['Rolled edge with a shive', 'Curled tube edge, inner disc plug', 'Powders and dry goods, clean interior line'],
            ['Crimped or tucked ends', 'Tube wall folded and sealed', 'Single-use, tamper-evident, lowest cost'],
          ],
        },
      },
      {
        h3: 'Printing and finishes',
        lead: 'Printed cardboard tubes are one of the most-searched things on this site and one of the least-explained, so here is what is actually on offer.',
        table: {
          caption: 'Print methods and surface finishes',
          cols: ['Method or finish', 'What it gives you', 'Notes'],
          rows: [
            ['Offset-printed wrap', 'Full-color photographic quality, tight registration', 'The default for retail-facing tubes'],
            ['Flexographic direct print', 'Spot colors printed straight onto the board', 'Economical for one to three colors at volume'],
            ['Digital print', 'Short runs, versioning, no plate cost', 'Suits smaller-run orders and design testing'],
            ['Hot foil stamping', 'Metallic gold, silver or colored foil', 'Logos and type; not for large solid areas'],
            ['Emboss and deboss', 'Raised or recessed texture in the wrap', 'Works best on uncoated and soft-touch stocks'],
            ['Matte, gloss or soft-touch lamination', 'Sealed, scuff-resistant outer surface', 'Soft-touch reads premium; matte hides handling marks'],
            ['Spot UV', 'Selective high-gloss over a matte base', 'Contrast on logos and pattern work'],
            ['Uncoated kraft', 'Natural brown board, no film layer', 'The recyclable, unlaminated option'],
          ],
        },
        note: 'Full-wrap artwork should be supplied with bleed on all four edges; the wrap overlaps itself along one seam, so avoid placing critical type across that join.',
      },
    ],
    cta: `Industrial and core work has its own tolerances — ${a(P + '/product/industrial-cardboard-tubes/', 'the industrial cardboard tubes page')} covers builds intended to carry load rather than present a product.`,
  },
  faqH2: 'Cardboard tube questions buyers actually ask',
  faqs: [
    { q: 'What counts as a large cardboard tube?',
      a: ['Large cardboard tubes generally start at 3″ internal diameter and run up to 12″, with lengths to 48″ on standard tooling. Below 1½″ is a small tube, and 1½″ to 3″ is the medium range that most candle, cosmetic and rolled-print work sits in.',
          'If you are packing a rolled poster, large usually means 3″ to 4″. If you are packing apparel or a banner, it usually means 4″ to 6″.'] },
    { q: 'What is a thick cardboard tube, and do I need one?',
      a: ['Thick refers to the wall, not the diameter. A standard wall is 1.0 to 1.5 mm; a thick or heavy-duty wall is 1.5 to 3.0 mm, built from three to five plies; industrial cores go above 3 mm.',
          'You need a thick wall once the tube is over about 3″ in diameter, once it will be handled by a courier rather than a person, or once the contents are heavy enough to load the wall from the inside.'] },
    { q: 'Can cardboard tubes be printed all the way around?',
      a: ['Yes. Full-wrap offset printing is the standard route for retail-facing tubes and gives photographic quality across the whole surface. Flexographic direct printing is the economical option for one to three spot colors at volume, and digital printing suits shorter runs.',
          'Supply artwork with bleed on all four edges. The wrap overlaps along one seam, so keep critical type away from that join.'] },
    { q: 'Do you supply heavy-duty tubes for shipping?',
      a: ['Yes — that is most of what this category is for. A courier-handled tube should be specified with a 1.5 mm or heavier wall, a closure that will not pop off under compression, and enough length margin that the contents are not touching the end caps.',
          'Metal ends or a well-fitted plastic push cap are the two closures that survive courier handling most reliably.'] },
    { q: 'What is the minimum order quantity?',
      a: ['Our standard minimum is 500 pieces. We can produce smaller runs — from around 100 pieces — at a higher per-piece cost, since setup and printing are fixed regardless of quantity. Per-piece cost drops significantly as quantity increases.',
          'Share your size, material, printing and quantity and we will send a quote.'] },
    { q: 'Are cardboard tubes durable enough to ship without an outer box?',
      a: ['Yes, for rolled and cylindrical goods, and that is most of what this category is for. A wound cardboard wall resists crushing from the side far better than a flat carton of the same weight, which is why posters, banners and textiles ship in tubes rather than boxes.',
          'Specify a 1.5 mm or heavier wall and a closure that will not pop under compression, and add an inch or two of length beyond the contents so nothing bears against the end caps. Those three choices are what decide whether it arrives intact.'] },
    { q: 'Are your cardboard tubes recycled, and can they be recycled again?',
      a: ['The wound core is normally made from recycled board — that is the standard construction, not an upgrade. Kraft and white-lined outer liners are available with recycled content, and an uncoated tube with a paperboard cap goes into curbside paper recycling as it is.',
          'What changes that is the finish: a plastic film lamination, a foil barrier liner or a plastic end cap all mean the layers have to be separated. If a fully recyclable pack matters to you, say so at the specification stage rather than at artwork stage, because it decides the closure and the finish, not just the material.'] },
    { q: 'Do you supply plain cardboard tubes for crafts, storage or fabric rolls?',
      a: ['Yes. Plain unprinted tubes are the lowest-cost configuration at every quantity and the fastest to produce, and they are ordered regularly for fabric storage, craft use, workshop organization and as blanks for finishing in house.',
          'Tell us the internal diameter, the length and the wall class you want. For craft use a thick 1.5 to 3.0 mm wall is usually the right call, because it can be cut, drilled and stood upright without deforming.'] },
    { q: 'Where can I buy cardboard tubes in bulk?',
      a: ['Directly here. Every product in this category is quoted to your specification rather than sold from a fixed catalogue, so a bulk order is the normal case rather than a special one, and per-piece cost drops significantly as quantity increases.',
          'The standard minimum is 500 pieces, with smaller runs from around 100 pieces at a higher per-piece cost. Send the diameter, length, wall and quantity and we will quote against it.'] },
    { q: 'What artwork do you need from us?',
      a: ['A print-ready vector file for the wrap, with bleed on all four edges, and your colors specified as Pantone references where an exact match matters. Photographic elements should be supplied at 300 dpi at final size.',
          'The wrap overlaps itself along one vertical seam, so keep logos and critical type clear of that join. We will confirm the exact flat dimensions for your tube size before you lay the artwork out, because the circumference changes with the diameter.'] },
  ],
  faqCta: `Have the dimensions but not the specification? ${a(P + '/contact-us/', 'Send the sizes through the contact form')} and we will come back with a build.`,
  tiles: {
    '52': 'The general-purpose rigid tube — the starting point when you know the diameter but not the build.',
    '174': 'Large diameters from 3″ up to 12″, on a thick wall that will take courier handling.',
    '189': 'Round profile with a heavy wall — the usual choice for apparel rolls, banners and textiles.',
    '91': 'Convolute-wound cores built to carry load rather than present a product.',
    '76': 'Specified around courier handling: heavier wall, closures that stay on in transit.',
    '60': 'Sized for rolled posters and prints, 2″ to 4″, with end caps that reopen cleanly.',
    '81': 'Uncoated natural kraft for mailing, where the outside is meant to look unbranded.',
    '71': 'Rigid wall and a telescoping or metal-end closure, sized for pillar and jar candles.',
  },
};
