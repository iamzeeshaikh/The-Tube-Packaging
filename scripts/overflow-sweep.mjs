// Horizontal-overflow sweep across every page in the build, at phone width.
// Run after any markup change that could remove a scroll container.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 4322;
const server = spawn('node', ['scripts/serve.mjs'], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1500));

const routes = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') {
      const r = path.relative('dist', path.dirname(p));
      routes.push(r === '' ? '/' : '/' + r + '/');
    }
  }
})('dist');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 900 } });
let bad = 0;
for (const r of routes.sort()) {
  await page.goto(`http://localhost:${PORT}${r}`, { waitUntil: 'domcontentloaded' });
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (over > 0) { bad++; console.log(`OVERFLOW ${over}px  ${r}`); }
}
await browser.close();
server.kill();
console.log(`\n${routes.length} pages checked at 375px | ${bad} overflowing`);
process.exit(bad ? 1 : 0);
