// Google Analytics 4. Injected into the head of every route: the migrated
// pages render through `src/pages/[...path].astro`, the cart-flow pages
// through `src/layouts/Shell.astro`, and the two do not share a head.
export const GA4_ID = 'G-VFELHL96YM';

export const ga4Tag = `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');</script>
<script defer src="/ga4-events.js"></script>
<script>document.addEventListener('joinchat:open',function(e){if(typeof gtag==='function')gtag('event','whatsapp_click',{link_url:(e.detail&&e.detail.link)||'',link_text:'joinchat'});});</script>`;

// Microsoft Clarity (packaging project). Same two heads as the GA4 tag above.
export const CLARITY_ID = 'yk7d21q01g';

export const clarityTag = `<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${CLARITY_ID}");
</script>`;
