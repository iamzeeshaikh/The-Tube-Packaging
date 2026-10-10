import chrome from '../data/chrome.json';
import { rewrite } from './site.js';
import { withMenuIcons } from './menu-icons.js';

const TAG_SPLIT = /(<[^>]+>)/;

const tokens = {
  header: chrome.header.split(TAG_SPLIT),
  offcanvas: chrome.offcanvas.split(TAG_SPLIT),
  footer: chrome.footer.split(TAG_SPLIT),
};

/**
 * Rebuild a chrome region for one page.
 *
 * The header, off-canvas drawer and footer are byte-identical across the site
 * apart from menu state (current-menu-item and friends, aria-current) and the
 * loading / fetchpriority hints WordPress recomputes per page. `chromeDiff`
 * holds those differing tags by position, so a single shared markup blob
 * reproduces every page exactly.
 */
// A diff tag and the shared tag it replaces differ only in per-page state.
const identity = (tag) => tag
  .replace(/\s(loading|fetchpriority|decoding|aria-current|class|style)="[^"]*"/g, '')
  .replace(/\s+/g, ' ');

// The footer blob gained tags after the footer diffs were captured, so their
// indexes point 8 tokens early: the certificate image landed on a </div> (two
// badge rows) and the current-menu class on the wrong category. Each diff tag
// is therefore placed on the nearest token with the same identity; a tag with
// no match is dropped rather than overwrite an unrelated token.
function place(list, index, tag) {
  const want = identity(tag);
  for (let d = 0; d <= 40; d++) {
    for (const j of d ? [index + d, index - d] : [index]) {
      if (list[j] !== undefined && identity(list[j]) === want) return j;
    }
  }
  return -1;
}

export function region(name, page) {
  const diff = page.chromeDiff?.[name];
  const html = diff
    ? (() => {
        const out = tokens[name].slice();
        for (const [i, tag] of Object.entries(diff)) {
          const j = place(tokens[name], Number(i), tag);
          if (j >= 0) out[j] = tag;
        }
        return out.join('');
      })()
    : chrome[name];
  // The dropdown icons go in here, never into chrome.json: `diff` addresses
  // tokens by index, so anything added to the stored markup shifts the tags
  // after it and lands, for instance, the site logo inside a menu link.
  const iconed = name === 'footer' ? html : withMenuIcons(html);
  return rewrite(iconed);
}

export const skipLink = rewrite(chrome.skip);

export function joinchat(page) {
  // ga_event "" stops Joinchat sending its own generate_lead to GA4 on every
  // WhatsApp open; /ga4-events.js sends whatsapp_click from joinchat:open instead.
  const settings = rewrite(page.joinchatSettings).replace(/^\{/, '{"ga_event":"",');
  return rewrite(chrome.joinchat).replace('%%JC%%', settings);
}
