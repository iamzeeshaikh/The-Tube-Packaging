import { P, a, SIZE_CLASSES, WALL_CLASSES, POLICY_FAQS } from './_shared.js';

/* ══════════════════════════════════════════════════════════════════════
   CUSTOM SPECIALTY TUBES — intent: the tube has to do more than hold shape
   7,125 impressions, position 13.05, 3 clicks. 3 products.
   This is the weakest-defined of the five, and the honest read is in
   reports/owner-decisions.md: luxury, lipstick and food have nothing in
   common as buyer intent. What they DO have in common is that the
   specification extends past the wall — a barrier liner, a food-contact
   interior, or a finish system — which is the intent written here.
   It also holds /product/tube-food-packaging/, and the food query set is
   36 queries, 22,976 impressions at 0.29% CTR with "food grade tube
   packaging" (1,084) at zero clicks. That is the site's weakest-served
   real demand, so the food build-out lives here.
   ══════════════════════════════════════════════════════════════════════ */
export const route = '/product-category/specialty-tubes/';

export default {
  intro: {
    eyebrow: 'Specified inside and out',
    h2: 'Specialty tubes: when the wall is not the whole specification',
    paras: [
      'Everything in the other four categories is specified by its wall — diameter, thickness, length. A specialty tube is one where the specification carries on past the wall: a barrier liner that keeps moisture and oxygen away from what is inside, a food-contact interior with a declaration of compliance behind it, or a finish system that survives being picked up and put down a hundred times.',
      `That is a real distinction, not a leftovers drawer. If your tube only needs to hold its shape, ${a(P + '/product-category/custom-paper-tubes/', 'the standard paper tubes range')} will do it for less. If what goes inside is food, cosmetic or high-value enough that the interior matters as much as the print, this is the right category.`,
    ],
    cta: `Food packaging is the largest use here — ${a(P + '/product/tube-food-packaging/', 'the tube food packaging page')} covers liners, seals and shelf life in detail.`,
  },
  fit: {
    eyebrow: 'Decision aid',
    h2: 'Which specialty tube fits your product',
    lead: 'Start from what the interior has to do. The liner and the seal are chosen first here; the diameter and the finish follow.',
    table: {
      caption: 'Product type, the construction it needs and the diameter it lands in',
      cols: ['What you are packing', 'Construction', 'Internal diameter', 'Size class'],
      rows: [
        ['Loose-leaf tea, herbal blends', 'Greaseproof or PE-lined tube, metal ends', '2″ – 3″', 'Medium'],
        ['Whole-bean or ground coffee', 'Foil-laminate liner, heat-seal membrane, degassing valve', '2½″ – 3½″', 'Medium'],
        ['Ground spices and seasoning', 'Foil or metallized liner, shaker insert or plug cap', '1½″ – 2½″', 'Medium'],
        ['Confectionery, chocolate, snacks', 'Greaseproof liner, metal ends or telescoping lid', '2″ – 3½″', 'Medium'],
        ['Protein, drink and supplement powders', 'PE- or foil-lined tube, rolled edge with a shive', '2½″ – 4″', 'Medium to large'],
        ['Lipstick, balm, solid cosmetics', 'Thin-wall tube, push-up base, soft-touch finish', '¾″ – 1¼″', 'Small'],
        ['Spirits, candles, high-value gifts', 'Rigid convolute tube, telescoping lid, foil and emboss', '2½″ – 5″', 'Medium to large'],
      ],
    },
    note: 'Liner choice drives shelf life far more than wall thickness does. Decide the interior before the artwork.',
    cta: `For presentation-led work, ${a(P + '/product/luxury-tube-packaging/', 'the luxury tube packaging page')} covers rigid builds and finish systems.`,
  },
  spec: {
    eyebrow: 'Specifications',
    h2: 'Specialty and food tube specifications',
    lead: 'Standard industry specifications available through our manufacturing partners. This section covers the part that is normally left unexplained: how a paper tube becomes suitable for food, and what the finish options actually are.',
    blocks: [
      {
        h3: 'Sizes — small, medium and large in this category',
        lead: 'Specialty work spans the widest size range on the site, from a ¾″ lipstick tube to a 5″ spirits presentation tube.',
        table: SIZE_CLASSES,
        note: 'Cosmetic formats sit in the small class, food formats mostly in the medium class, and presentation and gift formats in the large class.',
      },
      {
        h3: 'How a paper tube becomes food-safe: liners and barriers',
        lead: 'An unlined kraft tube is not a food-contact surface. What makes a tube suitable for food is the liner laminated to the inside wall, and which liner you need depends on what the food is sensitive to — moisture, oxygen, fat migration, or aroma loss.',
        table: {
          caption: 'Liner materials, the barrier each provides, and what it suits',
          cols: ['Liner', 'Barrier provided', 'Suits'],
          rows: [
            ['Greaseproof / vegetable-parchment paper', 'Fat and grease migration; no moisture or oxygen barrier', 'Confectionery, baked goods, dry snacks, short shelf life'],
            ['PE-coated paper', 'Moisture barrier, light grease resistance; weak oxygen barrier', 'Dry goods, sugar, salt, powders, tea for near-term sale'],
            ['Metallized PET film', 'Good moisture barrier, moderate oxygen and light barrier', 'Spices, tea and snack lines wanting shelf life without foil'],
            ['Aluminum foil laminate', 'High moisture, oxygen, light and aroma barrier', 'Coffee, premium tea, spices, anything aroma-critical'],
            ['PLA-coated paper', 'Moisture barrier from a bio-based coating', 'Brands needing a compostable-claim route; confirm certification per build'],
            ['Wax-coated paper', 'Moisture and grease barrier', 'Traditional confectionery and dry snack formats'],
          ],
        },
        note: 'A foil laminate gives the longest shelf life and the strongest aroma retention, and it is the reason coffee tubes are built the way they are. It also stops the pack being recycled as plain paper, which is the trade-off to make consciously.',
      },
      {
        h3: 'Matching the food to the construction',
        lead: 'Different foods fail in different ways. Choose the liner and the seal around the failure mode, not around the product category.',
        table: {
          caption: 'Food type, what threatens it, and the construction that answers it',
          cols: ['Food type', 'What shortens its life', 'Construction'],
          rows: [
            ['Whole-bean and ground coffee', 'Oxygen and aroma loss; CO₂ release after roast', 'Foil-laminate liner, heat-seal membrane, one-way degassing valve, tin-plate ends'],
            ['Loose-leaf and herbal tea', 'Moisture pickup and aroma loss', 'Foil or metallized liner, resealable metal or plug closure'],
            ['Ground spices and seasoning blends', 'Light, oxygen and moisture; oil migration', 'Foil or metallized liner, shaker insert under a plug cap'],
            ['Chocolate and confectionery', 'Fat bloom, grease migration, warmth', 'Greaseproof or foil liner, telescoping lid, opaque wrap'],
            ['Dry snacks, nuts, granola', 'Rancidity from oxygen; crushing', 'Foil or metallized liner, heat-seal membrane, thicker wall'],
            ['Protein and drink powders', 'Moisture caking and clumping', 'PE- or foil-lined tube, rolled edge with a shive, tight overcap'],
            ['Sugar, salt, dry baking goods', 'Moisture only', 'PE-coated liner, plug cap or shive'],
          ],
        },
        note: 'Shelf life is a function of the liner, the seal and the storage conditions together, and it should be confirmed by testing on your own product rather than assumed from the pack specification.',
      },
      {
        h3: 'Seals and closures for food tubes',
        table: {
          caption: 'Closure types used on food-contact tubes',
          cols: ['Closure', 'How it works', 'Best for'],
          rows: [
            ['Heat-seal foil membrane', 'Foil disc sealed to the tube rim, peeled to open', 'Tamper evidence and the best initial barrier'],
            ['Tin-plate base and lid', 'Crimped metal ends, lid reseals', 'Coffee, tea and confectionery; strongest reseal'],
            ['Rolled edge with a shive', 'Curled rim, inner disc plug', 'Powders and loose dry goods'],
            ['Plastic overcap over a membrane', 'Seal first, then a reclosable cap', 'Anything used over several weeks'],
            ['Telescoping lid', 'Outer tube sliding over the inner', 'Confectionery and gifting where presentation leads'],
            ['Tamper-evident shrink band', 'Band over the closure joint', 'Retail requirement in many markets'],
          ],
        },
      },
      {
        h3: 'Compliance and certification',
        paras: [
          'Food-contact liners can be specified using materials compliant with FDA 21 CFR 176.170 and 176.180, which cover paper and paperboard components in contact with aqueous and fatty foods, and the manufacturer’s declaration of compliance is supplied with the order.',
          'For product sold into the EU and UK, liners can be specified against Regulation (EC) No 1935/2004, and against Regulation (EU) No 10/2011 where a plastic layer is in direct contact, with migration test results provided by the manufacturer. BRCGS Packaging Materials certified production can be requested where your retail customer requires it.',
          'One thing worth stating plainly: an unlined kraft or printed tube is not a food-contact surface. Food-contact suitability always attaches to a specific build, so confirm it against the declaration of compliance issued for your order rather than against the category.',
        ],
      },
      {
        h3: 'Finish systems for luxury and cosmetic work',
        lead: 'A luxury tube is a rigid convolute-wound body with a finish system on top of it. The wall is what makes it feel solid; the finish is what makes it feel expensive.',
        table: {
          caption: 'Finish options and what each contributes',
          cols: ['Finish', 'What it gives you', 'Notes'],
          rows: [
            ['Soft-touch lamination', 'Velvet surface, matte depth', 'The most common premium cosmetic finish'],
            ['Hot foil stamping', 'Metallic gold, silver, copper or colored foil', 'Excellent against uncoated kraft and dark board'],
            ['Emboss and deboss', 'Raised or recessed relief', 'Strongest effect on uncoated and soft-touch surfaces'],
            ['Spot UV over matte', 'Selective gloss contrast', 'Logos, patterns and typographic detail'],
            ['Through-colored board', 'Dark or colored cut edge', 'Matters wherever the tube rim is visible when open'],
            ['Textured or specialty paper wrap', 'Linen, felt, laid and metallic stocks', 'Adds material cost but changes the whole impression'],
            ['Rigid convolute body', 'No spiral seam, tighter tolerance, higher crush strength', 'What separates a luxury tube from a printed one'],
          ],
        },
      },
      {
        h3: 'Small-batch and small-order cosmetic work',
        paras: [
          'Small-order and small-batch cosmetic tube buyers arrive here regularly, so to answer it directly: our standard minimum is 500 pieces, and smaller runs from around 100 pieces are possible at a higher per-piece cost, because setup and printing are fixed regardless of quantity.',
          'For a small batch, digital printing avoids plate costs and is normally the cheapest route to a finished tube. Foil, emboss and soft-touch all carry their own setup, so a first run testing the format usually makes more sense in a simpler finish.',
        ],
      },
    ],
    cta: `Cosmetic formats have their own page — ${a(P + '/product/paper-lipstick-tubes/', 'the paper lipstick tubes page')} covers push-up mechanisms and small-diameter tolerances.`,
  },
  faqH2: 'Specialty and food tube questions buyers actually ask',
  faqs: [
    { q: 'What makes a tube food grade?',
      a: ['The liner, not the tube. Food-contact suitability comes from the material laminated to the inside wall — greaseproof paper, PE coating, metallized film, aluminum foil, PLA or wax — and from a declaration of compliance issued for that specific build.',
          'An unlined kraft or printed tube is not a food-contact surface. Tell us the food and how long it has to stay good, and the liner is specified from that.'] },
    { q: 'Can you supply tubes for loose-leaf tea and coffee?',
      a: ['Yes, and they are built differently from each other. Tea needs a moisture and aroma barrier with a closure that reseals well between uses — a foil or metallized liner with tin-plate ends.',
          'Coffee needs more: a foil-laminate liner, a heat-seal membrane, and a one-way degassing valve so the CO₂ released after roasting can escape without letting oxygen back in.'] },
    { q: 'How long will my product stay fresh in a paper tube?',
      a: ['That depends on the liner, the seal and how it is stored, not on the tube wall. A greaseproof liner suits short shelf life; PE coating handles moisture; metallized film extends it further; an aluminum foil laminate gives the longest life and the best aroma retention.',
          'Shelf life should be confirmed by testing on your own product rather than assumed from the pack specification.'] },
    { q: 'What actually makes a tube a luxury tube?',
      a: ['Two things. The body is convolute wound rather than spiral wound, so there is no visible seam, the tolerance is tighter and the wall takes more crush load — that is what makes it feel solid rather than light.',
          'On top of that sits a finish system: soft-touch lamination, hot foil, emboss or deboss, spot UV, or a textured specialty paper. The wall is the feel; the finish is the impression.'] },
    { q: 'Do you take small-batch and small orders?',
      a: ['Yes. Our standard minimum is 500 pieces, and we can produce smaller runs from around 100 pieces at a higher per-piece cost, since setup and printing are fixed regardless of quantity. Per-piece cost drops significantly as quantity increases.',
          'For a small batch, digital printing avoids plate costs and is usually the most economical way to get a finished tube in hand.'] },
    { q: 'Do you supply candle tube packaging?',
      a: ['Yes, and it is one of the most-ordered formats in this range. A candle tube is a rigid body sized to the vessel with a telescoping lid or crimped metal ends, usually 2½″ to 4″ internal diameter depending on whether it holds a pillar, a jar or a tin.',
          'Candles are heavier than they look and they are almost always a gift, so the two things that matter are a wall that does not flex when the pack is picked up, and a closure that opens cleanly. Kraft, white and through-colored black board are all available, with foil and emboss on top.'] },
    { q: 'Can I buy empty cosmetic tubes and fill them myself?',
      a: ['Yes. Everything in this range is supplied empty for you to fill, whether that is in a studio by hand or on a line. Nothing here is sold pre-filled.',
          'If you are filling by hand, say so when you ask for a quote — it can change the closure recommendation, because some seals that suit a production line are awkward to apply without one.'] },
    { q: 'Are your cosmetic tubes eco-friendly?',
      a: ['A paper cosmetic tube with a paperboard cap and no film lamination is recyclable as paper, which is the strongest version of the claim available in this format. Kraft board also carries the look, which matters for a brand selling on it.',
          'The two things that quietly break it are a plastic push-up mechanism and a soft-touch or gloss lamination. Both are available and both are popular; they are just worth choosing knowingly rather than discovering later.'] },
    { q: 'Are you a cosmetic tube supplier or a manufacturer?',
      a: ['We specify and source production through manufacturing partners rather than running one fixed set of tooling. In practice that is an advantage for a buyer: the diameter, wall, liner, closure and finish are chosen for your product instead of being whatever one factory happens to run.',
          'What it means for you is that a quote needs a specification rather than a catalogue code. Tell us what goes inside, the size and the quantity, and the build is put together around that.'] },
    { q: 'Can a tube be foiled and printed for a gift or limited edition line?',
      a: ['Yes, and this is where the finish options actually earn their cost. Hot foil stamping, emboss and deboss, spot UV over a matte laminate, soft-touch lamination and textured specialty papers can all be combined on a rigid convolute body.',
          'Each finish carries its own setup, so a first run testing the format usually makes more sense in a simpler specification, with the full finish applied once the size and structure are settled.'] },
    ...POLICY_FAQS,
  ],
  faqCta: `Packing a cream or a gel rather than a solid? ${a(P + '/product-category/custom-plastic-tubes/', 'The plastic tubes category')} covers squeeze formats.`,
  gallery: {
    eyebrow: "In use",
    h2: "Where the interior matters as much as the outside",
    lead: "Three builds where the specification carries on past the wall \u2014 into a liner, a food contact interior or a finish system.",
    items: [
      { slug: "tube-food-packaging", title: "Food, coffee and tea", text: "The liner is chosen from what the food is sensitive to: greaseproof, PE, metallized film or aluminum foil. Coffee also needs a one way degassing valve." },
      { slug: "luxury-tube-packaging", title: "Gift and presentation", text: "A convolute wound body with no visible seam, then a finish system on top \u2014 hot foil, emboss, spot UV or soft touch." },
      { slug: "paper-lipstick-tubes", title: "Cosmetic push up formats", text: "Small diameters with the tolerance a lipstick mechanism needs, in a paper body rather than moulded plastic." },
    ],
  },
  quote: {
    eyebrow: "Get a quote",
    h2: "Tell us what goes inside first",
    refererTitle: "Specialty Tubes | Luxury, Cosmetic & Food Tube Packaging",
    product: "Specialty tubes",
    paras: [
      "In this category the interior is specified before the artwork. What is going in decides the liner, the liner decides the seal, and the seal decides the shelf life \u2014 so that is the first thing to tell us.",
    ],
    points: [
      "What is going inside, and how long it has to stay good",
      "The market it sells into, if compliance documents are needed",
      "Internal diameter and height, or the fill weight",
      "Finish \u2014 foil, emboss, soft touch, spot UV",
    ],
  },
  tiles: {
    '179': 'Convolute-wound rigid body with a finish system — foil, emboss, soft-touch or spot UV.',
    '169': 'Small-diameter push-up format with the tolerances a lipstick mechanism needs.',
    '184': 'Lined and sealed for food contact — liner chosen around the food, not the tube.',
  },
};
