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
export function region(name, page) {
  const diff = page.chromeDiff?.[name];
  const html = diff
    ? (() => {
        const out = tokens[name].slice();
        for (const [i, tag] of Object.entries(diff)) out[i] = tag;
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
  return rewrite(chrome.joinchat).replace('%%JC%%', rewrite(page.joinchatSettings));
}
