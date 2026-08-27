import { P, a } from './_shared.js';

/* ══════════════════════════════════════════════════════════════════════
   /product/tube-food-packaging/ — the food build-out
   ══════════════════════════════════════════════════════════════════════
   104 clicks on 35,432 impressions at 0.29% CTR, position 13.48 [export].
   The food query set is 36 queries and 22,976 impressions at 0.29% CTR,
   with "food grade tube packaging" (1,084 impressions) and "food grade
   paper tubes" (411) at zero clicks, and "food grade paper tube
   packaging" (740) at position 41.

   The page already carries a lot of prose. What it did not carry was any
   of the substance those queries are asking for. This section is
   deliberately the part the category page does not cover: the category
   page explains which liner suits which food; this explains what
   actually determines shelf life, what documentation to ask a supplier
   for, how the tube is filled and sealed, and — the part nobody writes —
   which foods a paper tube is not suitable for.

   Every compliance and food-safety statement here is logged verbatim in
   reports/owner-decisions.md under "Compliance claims written".
   No lead time and no price figure appears.
   ══════════════════════════════════════════════════════════════════════ */

export const route = '/product/tube-food-packaging/';

// inserted immediately before the "Related Products" Elementor section
export const anchor =
  '<section class="elementor-section elementor-top-section elementor-element elementor-element-60692e5b';

export const SECTIONS = [
  {
    mod: 'spec',
    eyebrow: 'Food grade, explained',
    h2: 'What makes tube food packaging food grade',
    lead: 'Food-contact suitability comes from the liner laminated to the inside wall and from the paperwork behind it — not from the tube. An unlined kraft or printed tube is not a food-contact surface, whatever it is sold as.',
    blocks: [
      {
        h3: 'What actually determines shelf life',
        lead: 'Four things decide how long your product stays good in a tube, and only one of them is the pack material.',
        table: {
          caption: 'The four shelf-life drivers, in the order they usually matter',
          cols: ['Driver', 'What it controls', 'How it is specified'],
          rows: [
            ['Barrier layer', 'How fast moisture, oxygen and light get in, and how fast aroma gets out', 'Liner choice: greaseproof, PE, metallized film, aluminum foil, PLA or wax'],
            ['Seal integrity', 'Whether the barrier is continuous once the tube is closed', 'Heat-seal membrane, crimped metal ends, shive, overcap'],
            ['Headspace and fill', 'How much oxygen is sealed in with the product', 'Fill weight against tube volume; nitrogen flush where a line supports it'],
            ['Storage conditions', 'Temperature, humidity and light after it leaves you', 'Outside the pack, but it is what most shelf-life failures come down to'],
          ],
        },
        note: 'A high-barrier liner behind a poor seal performs like no barrier at all. Specify the two together, and confirm shelf life by testing your own product rather than inferring it from the pack specification.',
      },
      {
        h3: 'Which foods suit a tube, and which do not',
        lead: 'Worth being straight about, because the wrong product in the right tube is the most expensive mistake in this category.',
        table: {
          caption: 'Suitability by food type',
          cols: ['Food type', 'Suitable?', 'Why'],
          rows: [
            ['Dry goods — coffee, tea, spices, powders, granola, nuts', 'Yes', 'The format this pack is built for; liner chosen for oxygen or moisture'],
            ['Confectionery, chocolate, biscuits', 'Yes', 'Greaseproof or foil liner; keep the pack opaque and out of warmth'],
            ['Dried fruit and semi-moist snacks', 'Usually', 'Needs a foil or metallized barrier and a heat-seal membrane'],
            ['Oils, syrups and liquids', 'No', 'A wound paper wall cannot be relied on as a liquid-tight container'],
            ['Fresh, chilled or frozen food', 'No', 'Condensation attacks the wall from both sides'],
            ['High-acid or high-moisture products', 'No', 'Migration and wall softening; use a rigid molded container'],
            ['Hot-fill products', 'No', 'Heat and steam delaminate the liner from the board'],
          ],
        },
      },
      {
        h3: 'Fill weight and tube size',
        lead: 'Food tubes are ordered by fill weight far more often than by dimensions, so these are the sizes those weights usually land on. Bulk density varies by product, so treat them as a starting point and confirm against your own fill.',
        table: {
          caption: 'Common fill weights and the tube size they normally need',
          cols: ['Product and fill weight', 'Internal diameter', 'Length', 'Notes'],
          rows: [
            ['Ground or whole-bean coffee, 250 g', '2½″ – 3″', '6″ – 8″', 'Add a degassing valve for coffee sealed within days of roast'],
            ['Loose-leaf tea, 100 g', '2½″', '6½″', 'Low bulk density, so tea needs more volume per gram than it looks'],
            ['Ground spices, 50 g', '1½″', '4″', 'A shaker insert under the cap suits retail'],
            ['Nuts or confectionery, 200 g', '2½″', '5″', 'Greaseproof liner unless the shelf life is long'],
            ['Protein or drink powder, 500 g', '3½″', '7½″', 'Wide mouth matters — a scoop has to fit through it'],
          ],
        },
        note: 'Allow about 10% headspace over the settled fill. Too little and the tube is difficult to close on a line; too much and you are sealing avoidable oxygen in with the product.',
      },
      {
        h3: 'Filling, sealing and tamper evidence',
        paras: [
          'Tubes can be hand filled or run on a line. Hand filling suits small batches and takes any of the closures; line filling wants a consistent rim, which is where a rolled edge with a shive or a heat-seal membrane earns its place.',
          'A heat-seal foil membrane sealed to the tube rim gives the best initial barrier and doubles as tamper evidence, with a plastic overcap on top for reclosing. A tamper-evident shrink band over the closure joint is the alternative where a membrane is not practical, and it is a retail requirement in many markets.',
          'Coffee is the one product that needs an extra part: a one-way degassing valve, so the carbon dioxide a fresh roast releases can escape without letting oxygen back in. Without it a sealed tube of fresh coffee will swell.',
        ],
      },
      {
        h3: 'Compliance, certification and the documents to ask for',
        paras: [
          'Food-contact liners can be specified using materials compliant with FDA 21 CFR 176.170 and 176.180, which cover paper and paperboard components in contact with aqueous and fatty foods. The manufacturer’s declaration of compliance is supplied with the order and is the document that actually covers you.',
          'For product sold into the EU and UK, liners can be specified against Regulation (EC) No 1935/2004, and against Regulation (EU) No 10/2011 where a plastic layer is in direct contact, with migration test results provided by the manufacturer. BRCGS Packaging Materials certified production can be requested where your retail customer requires it.',
          `Whatever the market, ask for three things before you sign off a food build: the declaration of compliance naming your specific construction, the migration test report behind it, and the certification scope if a retailer has asked for one. ${a(P + '/contact-us/', 'Tell us the food and the market')} and we will confirm what documentation comes with the build.`,
        ],
      },
    ],
    cta: `Comparing constructions across the range? ${a(P + '/product-category/specialty-tubes/', 'The specialty tubes category')} sets out which liner suits which food.`,
  },
];

export const faqH2 = 'Food packaging questions this page is asked most';

export const FAQS = [
  { q: 'Is a paper tube actually safe for direct food contact?',
    a: ['Only with a food-contact liner and a declaration of compliance covering that specific construction. The tube wall itself is not a food-contact surface, and neither is a printed wrap.',
        'Tell us the food, the market and the shelf life you need, and the liner and seal are specified from that rather than from the tube.'] },
  { q: 'How long will coffee or tea stay fresh in a tube?',
    a: ['It depends on the barrier, the seal, the headspace and how it is stored — in that order. An aluminum foil laminate liner with a heat-sealed membrane gives the longest life and the best aroma retention; a metallized film is a step below; a PE coating handles moisture but not oxygen.',
        'Coffee sealed within a few days of roasting also needs a one-way degassing valve, or the tube will swell.'] },
  { q: 'Can I use these tubes for liquids or fresh food?',
    a: ['No. A wound paper wall cannot be relied on as a liquid-tight container, and condensation from chilled or fresh product attacks the wall from both sides. Hot-fill is also out, because heat and steam delaminate the liner from the board.',
        'Dry goods, confectionery and semi-moist snacks are what this format is built for.'] },
  { q: 'What size tube do I need for a 250 g fill?',
    a: ['For 250 g of coffee, a 2½″ to 3″ internal diameter tube at 6″ to 8″ long is the usual answer. Bulk density changes it a lot though — 250 g of loose-leaf tea takes roughly twice the volume of 250 g of spice.',
        'Allow about 10% headspace over the settled fill so the tube closes cleanly without sealing in avoidable oxygen.'] },
  { q: 'Are the tubes recyclable?',
    a: ['A greaseproof or PE-lined tube with a paperboard cap is far closer to curbside paper than a foil-lined one, which cannot be separated at a household level. PLA-coated liners offer a compostable route, and the certification should be confirmed per build.',
        'There is a genuine trade-off here: the liners that give the longest shelf life are the ones that recycle least easily. It is worth deciding which matters more before artwork.'] },
  { q: 'Do you supply food-grade cardboard tubes as well as paper ones?',
    a: ['The distinction that matters is the liner, not whether the wall is described as paper or cardboard — both are wound paperboard, and neither is a food-contact surface on its own. A heavier cardboard wall is used where the pack has to take handling; the food-contact layer is the same either way.',
        'So specify the liner from the food and the wall from the handling, and the two decisions stay independent of each other.'] },
  { q: 'Can I get paper tubes for loose-leaf tea?',
    a: ['Yes, and tea is one of the formats this pack suits best. Tea loses aroma and picks up moisture, so it wants a foil or metallized liner and a closure that reseals properly between uses — tin-plate ends are the usual answer.',
        'Tea also has a low bulk density, so it takes more volume per gram than most people expect: 100 g of loose leaf needs roughly a 2½″ tube at 6½″ long, against 50 g of ground spice in a 1½″ tube at 4″.'] },
  { q: 'What documents come with a food-grade order?',
    a: ['A declaration of compliance naming your specific construction, and the migration test report behind it. Those two are what actually cover you, and they attach to the build rather than to the product category.',
        'Where a retailer requires it, BRCGS Packaging Materials certified production can be requested and the certification scope supplied. Ask for all three before signing off a food build rather than after.'] },
  { q: 'Can the tube be printed and still be food safe?',
    a: ['Yes. Print sits on the outside of the wall and the liner sits on the inside, so they are separate layers and neither compromises the other. Full-wrap offset printing, foil, emboss and matte or gloss lamination are all available on a lined food tube.',
        'What does need care is set-off during production and storage, which is a manufacturing control rather than a design choice — and it is one of the things the declaration of compliance covers.'] },
  { q: 'Do you supply food tubes wholesale?',
    a: ['Yes. The standard minimum is 500 pieces, with smaller runs from around 100 pieces at a higher per-piece cost, since setup and printing are fixed regardless of quantity.',
        'For food specifically it is worth quoting at two or three quantities before committing, because the liner and the seal carry their own setup and their share of the per-piece cost falls faster than the tube does as volume rises.'] },
];

export const faqCta =
  `Not sure which size your fill weight needs? ${a(P + '/tube-size-guide/', 'The tube size guide')} works from the product back to the diameter.`;
