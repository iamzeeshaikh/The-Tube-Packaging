import type { APIRoute } from 'astro';
import catalogueRaw from '../data/catalogue.json';
import pagesRaw from '../data/pages.json';

export const prerender = true;

// Google Merchant Center product feed (RSS 2.0 + g: namespace), same shape as
// the insertshub / customperfumeboxes feeds. Regenerated on every build from
// catalogue.json (id/name/url/image/price) + pages.json (meta descriptions).

const SITE_URL = process.env.SITE_ORIGIN || 'https://thetubepackaging.com';
const BRAND = 'The Tube Packaging';

type Product = {
  id: number; name: string; slug: string; url: string;
  price: number; full: string; category: string;
};
const products = Object.values(
  (catalogueRaw as { products: Record<string, Product> }).products,
);
const pages = pagesRaw as Record<string, { head: string }>;

const CATEGORY_NAMES: Record<string, string> = {
  'custom-cardboard-tubes': 'Custom Cardboard Tubes',
  'custom-paper-tubes': 'Custom Paper Tubes',
  'custom-plastic-tubes': 'Custom Plastic Tubes',
  'specialty-tubes': 'Specialty Tubes',
};

function decodeEntities(s: string) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
function esc(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function description(slug: string, name: string) {
  const head = pages[`product__${slug}`]?.head || '';
  const meta =
    head.match(/<meta name="description" content="([^"]*)"/)?.[1] ||
    head.match(/property="og:description" content="([^"]*)"/)?.[1] ||
    '';
  return (decodeEntities(meta) || `${name} — custom printed wholesale packaging by ${BRAND}.`).slice(0, 4900);
}

export const GET: APIRoute = () => {
  const items = products
    .sort((a, b) => a.id - b.id)
    .map((p) => `  <item>
    <g:id>gla_${p.id}</g:id>
    <title>${esc(p.name)}</title>
    <description>${esc(description(p.slug, p.name))}</description>
    <link>${esc(SITE_URL + p.url)}</link>
    <g:image_link>${esc(SITE_URL + p.full)}</g:image_link>
    <g:availability>in stock</g:availability>
    <g:price>${p.price.toFixed(2)} USD</g:price>
    <g:condition>new</g:condition>
    <g:brand>${esc(BRAND)}</g:brand>
    <g:mpn>gla_${p.id}</g:mpn>
    <g:identifier_exists>no</g:identifier_exists>
    <g:product_type>${esc(CATEGORY_NAMES[p.category] || p.category)}</g:product_type>
    <g:shipping>
      <g:country>US</g:country>
      <g:price>0.00 USD</g:price>
    </g:shipping>
  </item>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${esc(BRAND)}</title>
    <link>${SITE_URL}/</link>
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
