// Google Analytics 4. Injected into the head of every route: the migrated
// pages render through `src/pages/[...path].astro`, the cart-flow pages
// through `src/layouts/Shell.astro`, and the two do not share a head.
export const GA4_ID = 'G-VFELHL96YM';

export const ga4Tag = `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');</script>`;
