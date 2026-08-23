/**
 * Defects the captured WordPress CSS carried over, patched in one place and
 * emitted verbatim into every page head.
 *
 * - The footer certificate strip is a fixed 564px image with no fluid rule of
 *   its own, so every page scrolled sideways on a phone.
 *
 * - Every footer scope sets --linkHoverColor to paletteColor3 (#216BDB) over a
 *   blue footer, so hovering a footer link -- or landing on the page it points
 *   at, which adds current-menu-item -- painted the text almost the same colour
 *   as the background and it vanished. Keep footer links white in every state
 *   and signal hover with an underline instead.
 */
export const cssFixes = `<style id="ttp-fixes">
.widget_media_image img,
.wp-block-image img { max-width: 100%; height: auto; }

#footer-site-navigation,
.rishi-footer .footer-top-row .widget,
.rishi-footer .footer-middle-row .widget,
.rishi-footer .footer-bottom-row .widget,
.rishi-footer-copyrights { --linkHoverColor: #ffffff; }

/* the product nav is vertically centred in its column, so adding a heading
   above it pushed its first item below the first category beside it */
#footer-site-navigation { align-items: flex-start; }
#rishi-footer .footer-middle-row .widget:has(> .widget-title:only-child) { margin-bottom: 0; }

#rishi-footer a:hover,
#rishi-footer li:hover > a,
#rishi-footer li[class*="current-menu-"] > a,
#rishi-footer a:focus-visible {
  color: #ffffff;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>`;
