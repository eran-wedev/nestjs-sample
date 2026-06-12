import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const results = [];

function pass(name, detail = '') {
  results.push({ name, ok: true, detail });
  console.log(`PASS  ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, detail = '') {
  results.push({ name, ok: false, detail });
  console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
}

async function assert(name, condition, detail) {
  if (condition) pass(name, detail);
  else fail(name, detail);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  await page.goto(BASE, { waitUntil: 'networkidle' });

  await assert(
    'Dashboard loads',
    (await page.locator('h1').textContent()) === 'Items Dashboard',
  );

  await page.waitForFunction(
    () => document.getElementById('stat-total')?.textContent !== '—',
  );
  const total = await page.locator('#stat-total').textContent();
  await assert('Stats populate', Number(total) > 0, `total=${total}`);

  const initialCount = await page.locator('.item').count();
  await assert('Seed items render', initialCount > 0, `count=${initialCount}`);

  await page.getByRole('button', { name: 'Pending' }).click();
  await page.waitForTimeout(400);
  const pendingCount = await page.locator('.item').count();
  await assert(
    'Pending filter works',
    pendingCount > 0 && pendingCount <= initialCount,
    `count=${pendingCount}`,
  );

  await page.getByRole('button', { name: 'All' }).click();
  await page.locator('#search-input').fill('NestJS');
  await page.waitForTimeout(400);
  const searchCount = await page.locator('.item').count();
  const searchText = await page.locator('.item-name').first().textContent();
  await assert(
    'Search filter works',
    searchCount > 0 && /nestjs/i.test(searchText ?? ''),
    `count=${searchCount}, first="${searchText}"`,
  );

  await page.locator('#search-input').fill('');
  await page.getByRole('button', { name: 'All' }).click();
  await page.waitForTimeout(400);

  const uniqueName = `UI test ${Date.now()}`;
  await page.locator('input[name="name"]').fill(uniqueName);
  await page.locator('input[name="description"]').fill('Added by automated UI test');
  await page.getByRole('button', { name: 'Add item' }).click();
  await page.waitForTimeout(500);

  await assert(
    'Add item shows in list',
    (await page.locator('.item-name', { hasText: uniqueName }).count()) === 1,
    uniqueName,
  );

  const row = page.locator('.item', { hasText: uniqueName });
  await row.locator('.checkbox').click();
  await page.waitForTimeout(500);
  await assert(
    'Toggle complete applies done style',
    (await row.evaluate((el) => el.classList.contains('done'))) === true,
  );

  await row.locator('button.danger').click();
  await page.waitForTimeout(500);
  await assert(
    'Delete removes item',
    (await page.locator('.item-name', { hasText: uniqueName }).count()) === 0,
    uniqueName,
  );

  await page.waitForTimeout(2500);

  const countBeforeBlank = await page.locator('.item').count();
  await page.locator('input[name="name"]').fill('   ');
  await page.getByRole('button', { name: 'Add item' }).click();
  await page.waitForTimeout(500);
  const countAfterBlank = await page.locator('.item').count();
  await assert(
    'Whitespace-only add is rejected',
    countAfterBlank === countBeforeBlank,
    `before=${countBeforeBlank}, after=${countAfterBlank}`,
  );
} catch (error) {
  fail('Unexpected error', error instanceof Error ? error.message : String(error));
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length > 0 ? 1 : 0);
