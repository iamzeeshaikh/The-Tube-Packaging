import type { APIRoute } from 'astro';
import merchantRaw from '../data/merchant.json';

export const prerender = true;

// Google Merchant Center product feed (RSS 2.0 + g: namespace).
// merchant.json is a verbatim copy of the GMC export taken from the old
// Google Listings & Ads plugin feed (products_2026-08-17 TSV) — ids, titles,
// HTML descriptions, images and product types must stay byte-identical so the
// existing Merchant Center listings are not altered by the migration.

const merchant = merchantRaw as Record<string, {
  id: string; title: string; description: string; link: string;
  image_link: string; additional_image_links: string[];
  price: string; condition: string; availability: string;
  brand: string; product_type: string; shipping_countries: string[];
}>;

function esc(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export const GET: APIRoute = () => {
  const items = Object.values(merchant)
    .map((m) => {
      const addl = m.additional_image_links
        .map((u) => `    <g:additional_image_link>${esc(u)}</g:additional_image_link>`)
        .join('\n');
      const shipping = m.shipping_countries
        .map((c) => `    <g:shipping>
      <g:country>${esc(c)}</g:country>
      <g:price>0.00 USD</g:price>
    </g:shipping>`)
        .join('\n');
      return `  <item>
    <g:id>${esc(m.id)}</g:id>
    <title>${esc(m.title)}</title>
    <description>${esc(m.description)}</description>
    <link>${esc(m.link)}</link>
    <g:image_link>${esc(m.image_link)}</g:image_link>
${addl}
    <g:availability>${esc(m.availability)}</g:availability>
    <g:price>${esc(m.price)}</g:price>
    <g:condition>${esc(m.condition)}</g:condition>
    <g:brand>${esc(m.brand)}</g:brand>
    <g:identifier_exists>no</g:identifier_exists>
    <g:product_type>${esc(m.product_type)}</g:product_type>
${shipping}
  </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>The Tube Packaging</title>
    <link>https://thetubepackaging.com/</link>
    <description>Custom tube packaging — product feed</description>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
