import { P, a, SIZE_CLASSES, WALL_CLASSES, POLICY_FAQS } from './_shared.js';

/* ══════════════════════════════════════════════════════════════════════
   CUSTOM PAPER TUBES — intent: branding, not protection
   10,020 impressions, position 10.04, 1 click. 17 products.
   The paper query set is 152 queries, 564 clicks, 80,677 impressions at
   0.70% CTR. "eco friendly paper tube packaging" (1,477) and "kraft tube
   packaging" (1,511) are the modifiers that separate this category from
   cardboard, so the copy leads on surface and sustainability.
   ══════════════════════════════════════════════════════════════════════ */
export const route = '/product-category/custom-paper-tubes/';

export default {
  intro: {
    eyebrow: 'The retail surface',
    h2: 'Custom paper tubes for products that sit on a shelf',
    paras: [
      'A paper tube is the same wound construction as a cardboard tube on a lighter wall, finished so the outside is a printing surface rather than a protective one. That is the whole distinction. Walls run 0.5 mm to 1.5 mm, diameters from under 1″ for a lip balm up to 6″ for gift and apparel packaging, over uncoated kraft or a white-lined board.',
      `This is the range to start from when the tube is part of how the product is sold — full-wrap artwork, a soft-touch or matte finish, a paperboard cap that keeps the pack recyclable. When the tube must survive a courier rather than a shelf, ${a(P + '/product-category/custom-cardboard-tubes/', 'the heavier cardboard tubes range')} is the place to start.`,
    ],
    cta: `Kraft is the most-requested finish here — ${a(P + '/product/kraft-paper-tubes/', 'the kraft paper tubes page')} covers the uncoated natural build and where it works best.`,
  },
  fit: {
    eyebrow: 'Decision aid',
    h2: 'Which paper tube fits your product',
    lead: 'Retail tubes are specified from the product outward: the diameter is whatever the contents need plus clearance, and the wall is whatever keeps the tube feeling solid in the hand.',
    table: {
      caption: 'Product type, tube type and the diameter it normally lands in',
      cols: ['What you are packing', 'Tube type', 'Internal diameter', 'Size class'],
      rows: [
        ['Lip balm, lipstick, solid perfume', 'Thin-wall push-up or plug-cap tube', '¾″ – 1¼″', 'Small'],
        ['Deodorant sticks', 'Push-up paper tube with a screw base', '1¼″ – 1¾″', 'Small to medium'],
        ['Loose-leaf tea, coffee, spices', 'Lined tube, metal or plug closure', '2″ – 3″', 'Medium'],
        ['Pillar and jar candles', 'Rigid tube, telescoping lid', '2½″ – 4″', 'Medium'],
        ['Bath products, powders, bath salts', 'Lined tube with a rolled edge and shive', '2″ – 3½″', 'Medium'],
        ['Apparel, scarves, textiles at retail', 'Printed tube box, plug caps', '3″ – 5″', 'Large'],
        ['Wrapping paper and gift rolls', 'Long thin-wall tube', '1½″ – 2½″', 'Medium'],
      ],
    },
    note: 'Allow 1 – 2 mm of diametric clearance over the product. A tube cut exactly to size is difficult to fill on a line and difficult to open by hand.',
    cta: `Smaller formats have their own tolerances — ${a(P + '/product/small-paper-tubes/', 'the small paper tubes page')} covers everything under 1½″.`,
  },
  spec: {
    eyebrow: 'Specifications',
    h2: 'Paper tube specifications',
    lead: 'Standard industry specifications available through our manufacturing partners. Paper tubes are specified in four numbers: internal diameter, height, wall thickness and closure.',
    blocks: [
      {
        h3: 'Sizes — what small, medium and large mean on a paper tube',
        lead: 'Most retail paper tube work sits in the small and medium classes. Large is where the category starts overlapping with cardboard.',
        table: SIZE_CLASSES,
        note: 'Small paper tubes are anything under 1½″ internal diameter — lip balm, lipstick, deodorant, sample and seed formats. Small-diameter tubes hold tighter tolerances than large ones, so specify the internal diameter and let the wall follow.',
      },
      {
        h3: 'Wall thickness and board weight',
        lead: 'On a retail tube the wall is a feel decision as much as a strength one. A tube that flexes under thumb pressure reads as cheap even when the print is excellent.',
        table: WALL_CLASSES,
        note: 'Retail paper tubes are normally 0.5 – 1.5 mm. Board is typically 250 – 400 gsm per ply with a 120 – 170 gsm printed or kraft liner on the outside. Under about 0.8 mm, a tube over 2″ in diameter will feel soft.',
      },
      {
        h3: 'Materials: kraft, white and printed',
        table: {
          caption: 'Board options and what each one is for',
          cols: ['Material', 'What it looks like', 'Best for'],
          rows: [
            ['Uncoated natural kraft', 'Brown, matte, visible fiber', 'Eco and natural positioning; foil and one-color print sit well on it'],
            ['White-lined board', 'Clean white printing surface', 'Full-color artwork, photography, pale brand palettes'],
            ['Recycled chipboard core', 'Grey inner wall under any liner', 'The economical core; invisible once wrapped'],
            ['Black-dyed board', 'Through-colored dark wall', 'Premium and cosmetic work where the cut edge is visible'],
            ['Printed art-paper wrap', 'Offset-printed paper laminated to the tube', 'Anything where the print quality is the point'],
          ],
        },
        note: 'Kraft and unlaminated printed board are the two builds that keep a tube curbside-recyclable as paper. Adding a plastic film lamination, a foil liner or a plastic cap changes that, and is worth deciding early rather than at artwork stage.',
      },
      {
        h3: 'Closures and caps',
        table: {
          caption: 'Closure types available on paper tubes',
          cols: ['Closure', 'How it works', 'Best for'],
          rows: [
            ['Paperboard plug cap', 'Printed board plug, friction fit', 'Retail tubes that need an all-paper story'],
            ['Telescoping lid and base', 'Two tubes, one sliding over the other', 'Gift and candle presentation; no visible cap'],
            ['Push-up base', 'Screw or ratchet mechanism raising the product', 'Lip balm, deodorant, solid balms'],
            ['Rolled edge with a shive', 'Curled edge with an inner disc', 'Powders, salts, loose dry goods'],
            ['Metal (tin-plate) ends', 'Crimped metal base and lid', 'Tea, coffee and confectionery; best seal of the paper options'],
            ['Tuck-in end', 'Board flaps folded into the tube', 'Lightweight single-use retail formats'],
          ],
        },
      },
      {
        h3: 'Print and finish',
        lead: 'The finish is what separates a paper tube from a cardboard one in the buyer’s hand.',
        table: {
          caption: 'Print methods and finishes',
          cols: ['Method or finish', 'What it gives you', 'Notes'],
          rows: [
            ['Offset-printed wrap', 'Photographic full color, tight registration', 'Standard for retail'],
            ['Digital print', 'Short runs, versions, no plate cost', 'Best route below 1,000 pieces'],
            ['Flexographic direct print', 'One to three spot colors on the board', 'Economical at volume; suits kraft'],
            ['Hot foil stamping', 'Gold, silver or colored metallic foil', 'Excellent on uncoated kraft and dark board'],
            ['Emboss / deboss', 'Raised or recessed texture', 'Reads best on uncoated and soft-touch surfaces'],
            ['Soft-touch lamination', 'Velvet-feel sealed surface', 'The most common premium cosmetic finish'],
            ['Matte or gloss lamination', 'Sealed, scuff-resistant film', 'Matte hides handling marks; gloss lifts color'],
            ['Spot UV', 'Selective gloss over matte', 'Logo and pattern contrast'],
          ],
        },
        note: 'Supply artwork with bleed on all four edges and keep critical type clear of the wrap seam, which overlaps along one vertical line.',
      },
      {
        h3: 'Small runs and testing a design',
        paras: [
          'Our standard minimum is 500 pieces, and smaller runs from around 100 pieces are possible at a higher per-piece cost, because setup and printing are fixed regardless of quantity. For a brand testing a design before committing, digital printing on a short run is normally the cheapest honest way to see the finished tube.',
          'Per-piece cost drops significantly as quantity increases, so it is worth asking for pricing at two or three quantities rather than one.',
        ],
      },
    ],
    cta: `Larger retail formats have different wall requirements — ${a(P + '/product/large-paper-tubes/', 'the large paper tubes page')} covers 3″ and above.`,
  },
  faqH2: 'Paper tube questions buyers actually ask',
  faqs: [
    { q: 'What is the difference between a paper tube and a cardboard tube?',
      a: ['The construction is the same — plies of board wound and glued. The difference is wall thickness and finish. Paper tubes run 0.5 to 1.5 mm with a printed or kraft outer surface and are built to be seen; cardboard tubes run 1.5 to 3 mm and above and are built to take a load.',
          'If the tube is going on a shelf, start with paper. If it is going in a mailbag, start with cardboard.'] },
    { q: 'Are paper tubes recyclable?',
      a: ['An uncoated kraft or unlaminated printed tube with a paperboard cap goes into curbside paper recycling as it is. Adding a plastic film lamination, a foil barrier liner or a plastic cap changes that, because the layers have to be separated.',
          'If a fully recyclable pack matters to you, say so at the specification stage rather than at artwork stage — it changes the closure and the finish, not just the material.'] },
    { q: 'What counts as a small paper tube?',
      a: ['Anything under 1½″ internal diameter. That covers lip balm, lipstick, solid perfume, deodorant, seed and sample formats. Below about ¾″ the wall has to stay thin to keep enough internal space, which limits how heavy a board can be used.'] },
    { q: 'Can you print full-color artwork around the whole tube?',
      a: ['Yes. A full-wrap offset print is the standard for retail paper tubes and covers the entire circumference. Supply the artwork with bleed on all four edges, and keep logos and critical type away from the vertical seam where the wrap overlaps itself.'] },
    { q: 'What is the minimum order quantity?',
      a: ['Our standard minimum is 500 pieces. We can produce smaller runs — from around 100 pieces — at a higher per-piece cost, since setup and printing are fixed regardless of quantity. Per-piece cost drops significantly as quantity increases.',
          'Share your size, material, printing and quantity and we will send a quote.'] },
    { q: 'Are paper tubes biodegradable or compostable?',
      a: ['An uncoated kraft or unlaminated printed tube with a paperboard cap is paper, and behaves like paper — it recycles curbside and breaks down in the same way cardboard does. That covers most of this range.',
          'Compostable is a stricter claim than recyclable and it attaches to a specific build, not to the category. A PLA-coated liner is the route to it where a barrier is needed, and the certification has to be confirmed for your exact construction rather than assumed. Tell us if a compostable claim matters and it will be specified from the start.'] },
    { q: 'Do you supply eco-friendly lip balm and cosmetic tubes?',
      a: ['Yes — a paper tube with a push-up base is the standard plastic-free alternative to a molded lip balm stick, and it is one of the most-requested formats here. Uncoated kraft or unlaminated printed board keeps the whole pack recyclable as paper.',
          'The thing to decide early is the mechanism. A paperboard push-up base keeps the pack all-paper; a plastic screw base is more robust and cheaper but breaks the recycling story. Both are available, and it is worth choosing deliberately rather than at the end.'] },
    { q: 'Can I get paper tubes with lids?',
      a: ['Yes, and there are several ways to close one. A paperboard plug cap keeps the pack all-paper. A telescoping lid — an outer tube sliding over the inner — gives a gift-box feel with no separate cap. Tin-plate metal ends give the best seal and reseal. A rolled edge with an inner disc suits powders and loose goods.',
          'The closure decides how the pack feels to open more than any other single choice, so it is worth picking it before the artwork rather than after.'] },
    { q: 'What is the difference between kraft and white paper tubes?',
      a: ['Kraft is unbleached brown board with a visible fiber texture. It reads natural and sustainable, takes foil and one- or two-color print beautifully, and needs no lamination — which is what keeps it curbside recyclable.',
          'White-lined board gives a clean printing surface for full-color photographic artwork and pale brand palettes. It costs slightly more and usually wants a laminate to protect the print. Neither is stronger than the other; the wall thickness decides that.'] },
    { q: 'Can you match a specific brand color?',
      a: ['Yes. Supply your colors as Pantone references and offset printing will match them closely; that is the route to take when an exact brand color matters. Digital printing is convenient for short runs but matches spot colors less precisely.',
          'One thing worth knowing: the same ink looks different on uncoated kraft than on white-lined board, because the brown substrate shifts everything warmer. If the color is critical, specify the board at the same time as the color.'] },
    ...POLICY_FAQS,
  ],
  faqCta: `Packing food or tea? ${a(P + '/product-category/specialty-tubes/', 'The specialty tubes category')} covers barrier liners and food-contact construction.`,
  tiles: {
    '226': 'The general-purpose paper tube — the starting point when you know the size but not the finish.',
    '101': 'Uncoated natural kraft, unlaminated, and recyclable as paper with a board cap.',
    '121': 'White-lined board for full-color artwork and pale brand palettes.',
    '132': 'A heavier paper wall for retail formats that still need to take handling.',
    '127': 'Everything under 1½″ — lip balm, lipstick, samples and seed formats.',
    '116': 'Retail formats at 3″ and above, where the wall has to stay rigid across a wider span.',
    '137': 'A square profile rather than round, for shelf stacking and a different silhouette.',
    '86': 'Sized and finished for beauty lines — soft-touch, foil and full-wrap print.',
    '206': 'Push-up base with a screw mechanism, sized for a standard deodorant stick.',
    '96': 'Small-diameter push-up format for balms, at ¾″ to 1¼″.',
    '147': 'Lined for loose-leaf tea, with a closure that reseals between uses.',
    '142': 'Plain cores in the standard toilet-roll diameter, supplied unprinted.',
    '106': 'Longer plain cores in the kitchen-roll diameter, supplied unprinted.',
    '153': 'Natural kraft finish for candle lines that want an unbleached look.',
    '158': 'Through-colored black board, so the cut edge stays dark.',
    '164': 'Clean white board for candle brands printing pale or minimal artwork.',
  },
};
