/**
 * The quote form, for pages that were built without one.
 *
 * The category pages and /shop/ shipped no form at all: a buyer who read the
 * page had to navigate away to ask for a quote. The five categories hold 44,770
 * impressions between them, so that is the most expensive missing element on
 * the site after the content itself.
 *
 * This is not a new form. It is form `2bb183f5` — the same "Instant Quote" the
 * 35 product pages use — with the same field names, the same form_id and the
 * same recipients from src/data/forms.json, so submissions arrive through the
 * path that is already working and already tested. Only `referer_title` changes,
 * so a quote from a category page is identifiable as one.
 *
 * `ttp.js` binds every `form.elementor-form` on the page, appends `page_url`
 * at submit time and posts to /api/form/, so nothing else has to be wired.
 *
 * No reCAPTCHA loader is emitted here. ttp.js fetches Google's API on the first
 * interaction with any form and renders the widgets then — 1.4 MB of
 * third-party JavaScript that used to load on every page carrying a form, for
 * people who mostly never touch it.
 */

const RECAPTCHA_SITEKEY = '6LelJqwrAAAAAEkxjxWF3PF2TEmtsKiICKHRnz7a';

const esc = (s) => String(s).replace(/&(?![a-z#0-9]+;)/gi, '&amp;').replace(/"/g, '&quot;');

export function quoteForm({ refererTitle, product }) {
  return `
<div class="ttp-cat__quoteForm">
<form class="elementor-form" method="post" name="Instant Quote" aria-label="Instant Quote">
<input type="hidden" name="form_id" value="2bb183f5"/>
<input type="hidden" name="referer_title" value="${esc(refererTitle)}" />
<div class="elementor-form-fields-wrapper elementor-labels-above">
<div class="elementor-field-type-text elementor-field-group elementor-column elementor-field-group-name elementor-col-50">
<label class="elementor-field-label" for="ttp-cat-name">Full name</label>
<input size="1" type="text" name="form_fields[name]" id="ttp-cat-name" class="elementor-field elementor-size-sm  elementor-field-textual" placeholder="Full name" required="required" aria-required="true">
</div>
<div class="elementor-field-type-email elementor-field-group elementor-column elementor-field-group-email elementor-col-50">
<label class="elementor-field-label" for="ttp-cat-email">Email</label>
<input size="1" type="email" name="form_fields[email]" id="ttp-cat-email" class="elementor-field elementor-size-sm  elementor-field-textual" placeholder="Email" required="required" aria-required="true">
</div>
<div class="elementor-field-type-tel elementor-field-group elementor-column elementor-field-group-field_f54cfcb elementor-col-50">
<label class="elementor-field-label" for="ttp-cat-phone">Phone</label>
<input size="1" type="tel" name="form_fields[field_f54cfcb]" id="ttp-cat-phone" class="elementor-field elementor-size-sm  elementor-field-textual" placeholder="Phone" pattern="[0-9()#&amp;+*-=.]+" title="Only numbers and phone characters (#, -, *, etc) are accepted.">
</div>
<div class="elementor-field-type-text elementor-field-group elementor-column elementor-field-group-field_a858f27 elementor-col-50">
<label class="elementor-field-label" for="ttp-cat-product">Product</label>
<input size="1" type="text" name="form_fields[field_a858f27]" id="ttp-cat-product" class="elementor-field elementor-size-sm  elementor-field-textual" placeholder="Product" value="${esc(product)}">
</div>
<div class="elementor-field-type-textarea elementor-field-group elementor-column elementor-field-group-message elementor-col-100">
<label for="ttp-cat-message" class="elementor-field-label">Message</label>
<textarea class="elementor-field-textual elementor-field elementor-size-sm" name="form_fields[message]" id="ttp-cat-message" rows="4" placeholder="Internal diameter, length, wall thickness, quantity — and what is going inside"></textarea>
</div>
<div class="elementor-field-type-upload elementor-field-group elementor-column elementor-field-group-field_e4013ab elementor-col-100">
<label for="ttp-cat-upload" class="elementor-field-label">Artwork or reference (optional)</label>
<input type="file" name="form_fields[field_e4013ab][]" id="ttp-cat-upload" class="elementor-field elementor-size-sm elementor-upload-field" multiple="multiple">
</div>
<div class="elementor-field-type-text">
<input size="1" type="text" name="form_fields[field_228829a]" id="ttp-cat-hp" class="elementor-field elementor-size-sm " style="display:none !important;" tabindex="-1" autocomplete="off">
</div>
<div class="elementor-field-type-recaptcha elementor-field-group elementor-column elementor-field-group-field_32ebaf7 elementor-col-100">
<div class="elementor-field"><div class="elementor-g-recaptcha" data-sitekey="${RECAPTCHA_SITEKEY}" data-type="v2_checkbox" data-theme="light" data-size="normal"></div></div>
</div>
<div class="elementor-field-group elementor-column elementor-field-type-submit elementor-col-100 e-form__buttons">
<button class="elementor-button elementor-size-sm" type="submit">
<span class="elementor-button-content-wrapper"><span class="elementor-button-text">Send</span></span>
</button>
</div>
</div>
</form>
</div>
`;
}
