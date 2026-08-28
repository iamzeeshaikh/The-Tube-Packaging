// The cart must never hold fewer than 100 pieces: the standard minimum is 500
// and smaller runs start around 100, so a cart of 1 contradicted every product
// page. Checks the add path, the rendered field, and typing a smaller number.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const s = spawn('node', ['scripts/serve.mjs'],
  { env: { ...process.env, PORT: '4325', DIST_DIR: 'dist-qa' }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1600));
const b = await chromium.launch();
let fails = 0;
const check = (ok, label, extra = '') => { if (!ok) fails++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${extra ? '  ' + extra : ''}`); };

const p = await b.newPage();
await p.goto('http://localhost:4325/product-category/custom-cardboard-tubes/', { waitUntil: 'load' });
await p.evaluate(() => localStorage.clear());
await p.waitForTimeout(400);
await p.$eval('.products a.add_to_cart_button', (el) => el.click());
await p.waitForTimeout(700);
const stored = await p.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find((k) => /cart/i.test(k)) || '') || '{}'));
const first = Object.values(stored)[0];
check(first === 100, 'add to cart stores 100, not 1', `stored ${JSON.stringify(stored)}`);

await p.goto('http://localhost:4325/cart/', { waitUntil: 'load' });
await p.waitForTimeout(900);
const field = await p.evaluate(() => {
  const i = document.querySelector('input.qty');
  return i ? { min: i.getAttribute('min'), value: i.value } : null;
});
check(!!field && field.min === '100', 'cart field min is 100', JSON.stringify(field));
check(!!field && Number(field.value) >= 100, 'cart field value is at least 100');

if (field) {
  await p.fill('input.qty', '5');
  await p.click('button[name="update_cart"], .actions button, [name="update_cart"]').catch(() => {});
  await p.waitForTimeout(800);
  const after = await p.evaluate(() => { const i = document.querySelector('input.qty'); return i ? i.value : null; });
  check(after === null || Number(after) >= 100, 'typing 5 is clamped back to 100', `now ${after}`);
}
await b.close(); s.kill();
console.log(fails ? `\n${fails} failure(s)` : '\nthe cart never holds fewer than 100');
process.exit(fails ? 1 : 0);
