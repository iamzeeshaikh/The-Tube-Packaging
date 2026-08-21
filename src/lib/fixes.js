/**
 * Defects the captured WordPress CSS carried over, patched in one place and
 * emitted verbatim into every page head.
 *
 * - The footer certificate strip is a fixed 564px image with no fluid rule of
 *   its own, so every page scrolled sideways on a phone.
 */
export const cssFixes = `<style id="ttp-fixes">
.widget_media_image img,
.wp-block-image img { max-width: 100%; height: auto; }
</style>`;
