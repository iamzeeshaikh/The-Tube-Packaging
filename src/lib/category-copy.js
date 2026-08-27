/**
 * Index of the editorial copy for the product categories and /shop/.
 *
 * One file per page under `src/lib/copy/`, because these are genuinely
 * different pages rather than one template with the noun swapped — the existing
 * product pages already do that, and it is the pattern this content exists to
 * avoid. Splitting them also means a page can be revised, reviewed or reverted
 * on its own.
 *
 * The size and wall vocabulary is shared from `copy/_shared.js` so that "large"
 * and "thick" mean the same thing on every page, which is the entire point of
 * defining them.
 */
import cardboard, { route as cardboardRoute } from './copy/cardboard-tubes.js';
import mailing, { route as mailingRoute } from './copy/mailing-tubes.js';
import paper, { route as paperRoute } from './copy/paper-tubes.js';
import specialty, { route as specialtyRoute } from './copy/specialty-tubes.js';
import plastic, { route as plasticRoute } from './copy/plastic-tubes.js';

export { SIZE_CLASSES, WALL_CLASSES } from './copy/_shared.js';

export const COPY = {
  [cardboardRoute]: cardboard,
  [mailingRoute]: mailing,
  [paperRoute]: paper,
  [specialtyRoute]: specialty,
  [plasticRoute]: plastic,
};
