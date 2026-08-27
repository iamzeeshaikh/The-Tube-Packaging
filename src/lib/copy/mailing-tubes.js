import { P, a, SIZE_CLASSES, WALL_CLASSES, POLICY_FAQS } from './_shared.js';

/* ══════════════════════════════════════════════════════════════════════
   CUSTOM MAILING TUBES — intent: get it there undamaged
   11,585 impressions, position 10.54, 3 clicks.
   The mailing/poster/shipping query set is 181 queries, 998 clicks,
   48,680 impressions at 2.05% CTR — the site's best commercial cluster —
   and "wholesale mailing tubes" (1,835) and "bulk mailing tubes" (1,450)
   both sit around position 30 with almost no clicks, so the volume angle
   is deliberately answered on this page.
   ══════════════════════════════════════════════════════════════════════ */
export const route = '/product-category/mailing-tubes/';

export default {
  intro: {
    eyebrow: 'Built for transit',
    h2: 'Mailing and shipping tubes for posters, prints and rolled documents',
    paras: [
      'A mailing tube has one job: arrive with the contents flat, dry and uncreased after a courier network has sorted, stacked and dropped it. That is a different specification from a retail tube — a heavier wall for its diameter, end caps that stay on under compression, and enough length that the artwork is clear of both ends. Diameters run 1½″ to 6″, in lengths to 48″.',
      `The difference from the rest of the site is handling, not material. A shelf tube can have a thin wall and a fine finish; a tube going through a sorting belt needs 1.5 mm or more and a closure that will not pop off. For store-bound work, ${a(P + '/product-category/custom-paper-tubes/', 'the paper tubes range')} fits better.`,
    ],
    cta: `Buying at volume? Our standard minimum is 500 pieces, and per-piece cost falls sharply with quantity — ${a(P + '/contact-us/', 'send your quantity and dimensions')} for a bulk quote.`,
  },
  fit: {
    eyebrow: 'Decision aid',
    h2: 'Which mailing tube fits what you are sending',
    lead: 'Diameter follows the rolled size of the contents, not the flat size. A tighter roll means a smaller tube, but rolling too tight sets a curl into the print.',
    table: {
      caption: 'What you are mailing, the tube it needs and the diameter it lands in',
      cols: ['What you are mailing', 'Tube type', 'Internal diameter', 'Size class'],
      rows: [
        ['One or two rolled posters', 'Poster tube, plastic end caps', '1½″ – 2″', 'Small to medium'],
        ['Multiple prints or a thicker stock', 'Poster tube, standard wall', '2″ – 3″', 'Medium'],
        ['Architectural drawings and plans', 'Long cylinder tube to 48″', '2″ – 3″', 'Medium'],
        ['Canvas, fine-art prints, photography', 'Thick-wall tube, foam or tissue interleaf', '3″ – 4″', 'Large'],
        ['Banners, signage, vinyl', 'Heavy-duty tube, metal or deep push ends', '4″ – 6″', 'Large'],
        ['Apparel, fabric rolls, wallpaper', 'Heavy-duty tube, thick wall', '4″ – 6″', 'Large'],
      ],
    },
    note: 'Add at least 1″ to 2″ of length beyond the rolled artwork so nothing bears against the end caps in transit.',
    cta: `${a(P + '/product/poster-mailing-tubes/', 'The poster mailing tubes page')} covers the 2″ to 4″ range that most print shipping falls into.`,
  },
  spec: {
    eyebrow: 'Specifications',
    h2: 'Mailing tube specifications',
    lead: 'These are standard industry specifications available through our manufacturing partners, written for the way courier networks actually handle a tube.',
    blocks: [
      {
        h3: 'Diameter, length and the size words buyers use',
        lead: 'A large mailing tube and a large retail tube are not the same thing. On a mailing tube, large starts at 3″ internal diameter.',
        table: SIZE_CLASSES,
        note: 'Most poster shipping lands between 2″ and 4″. Below 1½″ a rolled print is being curled tighter than it should be; above 6″ you are usually better off with a flat carton.',
      },
      {
        h3: 'Wall thickness — the specification that decides whether it survives',
        lead: 'This is the single most important number on a mailing tube, and the one most often left unspecified.',
        table: WALL_CLASSES,
        note: 'For anything going through a courier, specify 1.5 mm or heavier. A thin-wall tube will arrive dented at the ends even when nothing inside is damaged, and dented ends are what generate the complaint.',
      },
      {
        h3: 'End caps and closures',
        lead: 'The closure is what fails first in transit. It is worth choosing deliberately rather than accepting whatever comes as standard.',
        table: {
          caption: 'Closure types for mailing and shipping tubes',
          cols: ['Closure', 'How it works', 'Best for'],
          rows: [
            ['Plastic push cap', 'Molded cap pushed into each end', 'The standard. Reopens cleanly, low cost, good retention'],
            ['Deep-skirt plastic cap', 'Longer skirt gripping more of the wall', 'Larger diameters and heavier contents'],
            ['Metal (tin-plate) ends', 'Crimped metal base and lid', 'Heavy or high-value contents, best compression resistance'],
            ['Paperboard plug cap', 'Board plug, printed to match', 'All-paper recycling story; lighter contents only'],
            ['Crimped ends', 'Tube wall folded flat and sealed', 'Single-use, tamper-evident, lowest cost'],
          ],
        },
        note: 'Push caps can be taped over the seam for a tamper-evident finish without changing the tube specification.',
      },
      {
        h3: 'Materials and print',
        paras: [
          'Natural kraft is the default outer surface for mailing work: uncoated, brown, recyclable, and it does not show handling marks the way a white gloss laminate does. White-lined board is the alternative when the tube carries full-color artwork.',
          'Printing is normally a one- or two-color flexographic direct print for logistics use, or a full offset-printed wrap where the tube is part of the brand experience. A printed label applied to a plain kraft tube is the economical middle route and is worth considering at lower quantities, because it keeps the tube itself unprinted.',
        ],
      },
      {
        h3: 'Ordering in volume',
        paras: [
          'Wholesale and bulk mailing tube buyers are the largest group arriving on this site without an answer, so to be direct about it: our standard minimum is 500 pieces, and smaller runs from around 100 pieces are possible at a higher per-piece cost, because setup and printing are fixed regardless of quantity.',
          `Per-piece cost falls significantly as quantity increases, and unprinted kraft tubes are the cheapest configuration at every quantity. ${a(P + '/contact-us/', 'Send the diameter, length, wall and quantity')} and we will quote against it.`,
        ],
      },
    ],
    cta: `For a plain unbranded build, ${a(P + '/product/kraft-mailing-tubes/', 'the kraft mailing tubes page')} is the uncoated natural option.`,
  },
  faqH2: 'Mailing tube questions buyers actually ask',
  faqs: [
    { q: 'What size mailing tube do I need for a poster?',
      a: ['For one or two rolled posters, a 1½″ to 2″ internal diameter tube is normal. For a thicker stock, several prints together, or anything you do not want tightly curled, move up to 2″ to 3″.',
          'Make the tube 1″ to 2″ longer than the rolled artwork so the print is not bearing against the end caps.'] },
    { q: 'What is the difference between a mailing tube and a shipping tube?',
      a: ['In practice they are the same product described by different buyers. Mailing tube tends to mean the smaller diameters used for posters and documents; shipping tube tends to mean the heavier builds used for banners, textiles and anything going by freight.',
          'Both are specified the same way: internal diameter, length, wall thickness and closure.'] },
    { q: 'Do you supply mailing tubes wholesale and in bulk?',
      a: ['Yes. The standard minimum is 500 pieces and per-piece cost drops significantly with quantity. Smaller runs from around 100 pieces are available at a higher per-piece cost, because setup and printing are fixed regardless of how many you order.',
          'Plain kraft tubes without printing are the lowest-cost configuration at any quantity.'] },
    { q: 'Which end cap should I choose?',
      a: ['A plastic push cap is the right default — it reopens cleanly, holds well and costs least. Move to a deep-skirt cap above 4″ diameter, or to crimped metal ends when the contents are heavy or valuable.',
          'Paperboard plug caps look better and keep the pack all-paper, but they have the least retention, so keep them for lighter contents.'] },
    { q: 'Can mailing tubes be printed with our branding?',
      a: ['Yes. A one- or two-color direct print is the economical route for logistics use, and a full-color offset wrap is available where the tube is part of how the brand arrives. At lower quantities, a printed label on a plain kraft tube often gives a better result for the money.'] },
    { q: 'Where can I buy poster tubes?',
      a: ['Here, made to your dimensions rather than picked from a fixed range. Poster tubes are one of the most-ordered things on this site, in diameters from 1½″ for a single rolled print up to 4″ for canvas and fine-art work, in lengths to 48″.',
          'If you need them plain, unprinted kraft is the fastest and cheapest configuration. If the tube is part of how your brand arrives, a printed wrap or an applied label are both available.'] },
    { q: 'Will the tube protect a print if the courier drops it?',
      a: ['A tube specified for transit will. A tube specified for a shelf will not, and that is the distinction this whole category is built on. Three things decide it: a wall of 1.5 mm or heavier, a closure with real retention, and enough length that the artwork is not resting against either end cap.',
          'The most common failure is not the print being damaged — it is the tube arriving with dented ends because the wall was too thin for its diameter. That is what generates the complaint, and it is avoidable at specification stage.'] },
    { q: 'Can I order plain unprinted mailing tubes?',
      a: ['Yes, and for logistics use it is usually the right answer. Plain natural kraft is the lowest-cost configuration at every quantity, it does not show handling marks the way a white gloss laminate does, and it needs no artwork approval.',
          'If you want branding without printing the tube itself, a printed label applied to a plain kraft tube is the economical middle route and often looks better than a cheap direct print.'] },
    { q: 'How do I stop the poster curling inside the tube?',
      a: ['Use a wider tube than the minimum that will physically fit. A tight roll fits a smaller diameter but sets a curl into the print that never fully relaxes, and the customer notices it the moment they unroll it.',
          'For a single poster, 1½″ to 2″ is fine. For heavier stock, several prints together, or anything you do not want curled, move up to 2″ to 3″. Canvas and fine-art prints want 3″ to 4″, usually with a tissue or foam interleaf.'] },
    { q: 'Do you supply custom printed mailing tubes?',
      a: ['Yes. A one- or two-color flexographic direct print is the economical route at volume and suits kraft board well. A full-color offset-printed wrap is available where the tube is part of the brand experience, and digital printing suits shorter runs without plate costs.',
          'Supply artwork with bleed on all four edges and keep critical type away from the vertical seam where the wrap overlaps itself. We will confirm the flat dimensions for your diameter before you lay it out.'] },
    ...POLICY_FAQS,
  ],
  faqCta: `Sending something unusual? ${a(P + '/product/cylinder-mailing-tubes/', 'The cylinder mailing tubes page')} covers longer spans and non-standard lengths.`,
  tiles: {
    '60': 'Sized for rolled posters and prints, 2″ to 4″, with caps that reopen without tearing the artwork.',
    '81': 'Uncoated natural kraft — the plain, unbranded, lowest-cost mailing build.',
    '221': 'Longer cylinder lengths to 48″, for drawings, plans and banner rolls.',
  },
};
