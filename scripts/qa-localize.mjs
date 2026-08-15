// The CSS and JS copied out of wp-content contain absolute production URLs
// inside url(...) -- correct once the site is live on its own domain, but they
// would make the QA build fetch backgrounds and fonts from the live site and
// hide any missing asset. Rewrite them in the QA copy only.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIR = path.join(ROOT, process.env.OUT_DIR_NAME || 'dist-qa');
const FROM = 'https://thetubepackaging.com';
const TO = process.env.SITE_ORIGIN || 'http://localhost:4399';

let changed = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(p); continue; }
    if (!/\.(css|js)$/.test(entry.name)) continue;
    const src = fs.readFileSync(p, 'utf8');
    if (!src.includes(FROM)) continue;
    fs.writeFileSync(p, src.split(FROM).join(TO));
    changed++;
  }
}
walk(path.join(DIR, 'wp-content'));
console.log('localized ' + changed + ' asset files for QA');
