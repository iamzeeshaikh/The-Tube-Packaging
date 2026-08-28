import * as wholesale from './wholesale-ordering.js';
import * as cosmetics from './cosmetics.js';
import * as food from './food-liners.js';
import * as premium from './premium-feel.js';
import * as small from './small-business.js';

// newest first; the archive sorts by date, this is the authoring order
export const ARTICLES = [wholesale, cosmetics, food, premium, small];
