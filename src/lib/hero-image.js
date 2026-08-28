/**
 * Responsive renditions for the home page hero, which is the LCP element.
 *
 * Measured on a throttled Pixel 5 against production: LCP 11.18s, the element
 * being /wp-content/uploads/2024/07/banner.jpg — 379 KB at 1920x765, served at
 * full size to a 390px phone with no srcset. The markup already carried
 * fetchpriority="high"; what it lacked was anything smaller to fetch.
 *
 * scripts/optimize-lcp-image.py produces WebP and JPEG at 480/768/1200/1920.
 * A phone now takes banner-480.webp at 4 KB.
 *
 * The declared width and height are left exactly as they were. CLS on this page
 * measures 0, the CSS controls the box, and changing the intrinsic ratio is the
 * one edit that could break that.
 */
const BASE = 'https://thetubepackaging.com/wp-content/uploads/2024/07/banner';
const WIDTHS = [480, 768, 1200, 1920];
const SIZES = '(max-width: 900px) 92vw, 640px';

const set = (ext) => WIDTHS.map((w) => `${BASE}-${w}.${ext} ${w}w`).join(', ');

const ORIGINAL = /<img src="https:\/\/thetubepackaging\.com\/wp-content\/uploads\/2024\/07\/banner\.jpg"([^>]*)\/>/;

export function heroPicture(html) {
  if (!html) return html;
  return html.replace(ORIGINAL, (whole, attrs) => `<picture>
<source type="image/webp" srcset="${set('webp')}" sizes="${SIZES}">
<img src="${BASE}-1200.jpg" srcset="${set('jpg')}" sizes="${SIZES}"${attrs}/>
</picture>`);
}

// Preload only what the browser will actually pick, so a phone never fetches
// the desktop rendition just because it was preloaded.
export const heroPreload = `
<link rel="preload" as="image" type="image/webp"
  imagesrcset="${set('webp')}" imagesizes="${SIZES}" fetchpriority="high">
`;
