// Walk the configurator end to end in a real browser, intercept the POST and
// ABORT it, so nothing reaches the client's inbox.
//
// Checks the flow itself, the two behaviours that make it worth building —
// defaults following from what is being packed, and the food-liner step only
// appearing for food — and that the payload carries every field with the
// right names for /api/form/.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const PORT = 4325;
const server = spawn('node', ['scripts/serve.mjs'],
  { env: { ...process.env, PORT: String(PORT), DIST_DIR: 'dist-qa' }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1500));

const browser = await chromium.launch();
let fails = 0;
const check = (ok, label, extra = '') => {
  if (!ok) fails++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${extra ? '  ' + extra : ''}`);
};

async function run(pick, expectFood) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });
  let body = null;
  await page.route('**/api/form/**', async (r) => { body = r.request().postData() || ''; await r.abort(); });
  await page.goto(`http://localhost:${PORT}/tube-configurator/`, { waitUntil: 'load' });
  await page.waitForTimeout(900);

  const visible = () => page.$$eval('.ttp-cfg__step:not([hidden])', (n) => n.map((s) => s.dataset.step));
  check((await visible()).join() === 'packing', `[${pick}] starts on step 1`);

  await page.click(`input[name="form_fields[packing]"][data-id="${pick}"] + .ttp-cfg__optBody`, { force: true })
    .catch(async () => { await page.$eval(`input[data-id="${pick}"]`, (el) => { el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); }); });
  await page.waitForTimeout(300);

  // the defaults should have populated the summary before any other step is seen
  const filled = await page.$$eval('.ttp-cfg__sumRow:not([hidden]) dd', (n) => n.map((d) => d.textContent.trim()).filter(Boolean));
  check(filled.length >= 5, `[${pick}] defaults pre-filled from what is packed`, `${filled.length} rows`);

  const seen = [];
  for (let i = 0; i < 14; i++) {
    const v = await visible();
    if (!v.length) break;
    seen.push(v[0]);
    const done = await page.$eval('.ttp-cfg__send', (b) => !b.hidden).catch(() => false);
    if (done) break;
    // pick the first option where the step requires one and nothing is chosen —
    // the app refuses to advance otherwise, which is the intended behaviour and
    // is what this loop originally tripped over
    await page.evaluate(() => {
      const step = document.querySelector('.ttp-cfg__step:not([hidden])');
      const radios = [...step.querySelectorAll('input[type=radio]')]
        .filter((r) => !r.closest('[hidden]'));
      if (radios.length && !radios.some((r) => r.checked)) {
        radios[0].checked = true;
        radios[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.click('.ttp-cfg__next');
    await page.waitForTimeout(220);
  }
  check(seen.includes('liner') === expectFood,
    `[${pick}] food-liner step ${expectFood ? 'shown' : 'skipped'}`, seen.join(' > '));

  await page.fill('#cfg-name', 'QA Probe');
  await page.fill('#cfg-email', 'qa@example.invalid');
  await page.click('.ttp-cfg__send');
  await page.waitForTimeout(900);

  check(!!body, `[${pick}] posts to /api/form/`);
  if (body) {
    const need = ['form_id', 'ttpconfig', 'form_fields[packing]', 'form_fields[diameter]',
      'form_fields[wall]', 'form_fields[closure]', 'form_fields[quantity]',
      'form_fields[name]', 'form_fields[email]', 'page_url'];
    const missing = need.filter((k) => !body.includes(k));
    check(missing.length === 0, `[${pick}] payload complete`, missing.length ? 'missing ' + missing.join(',') : '');
    check(body.includes('form_fields[liner]') === expectFood, `[${pick}] liner in payload only for food`);
  }
  await page.close();
}

await run('posters', false);
await run('food', true);

await browser.close();
server.kill();
console.log(fails ? `\n${fails} failure(s)` : '\nthe configurator works end to end');
process.exit(fails ? 1 : 0);
