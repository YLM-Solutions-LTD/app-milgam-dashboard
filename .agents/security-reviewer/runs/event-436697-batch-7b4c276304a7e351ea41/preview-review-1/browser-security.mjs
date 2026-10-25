import { chromium } from '/workspace/src/apps/milgam-dashboard/.agents/uat-tester/tmp/playwright/node_modules/playwright-core/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
const preview = 'https://02ea3f16.app-milgam-dashboard.pages.dev';
const hostBase = 'https://mnt.ylm.co.il/controller-host-fixture/';
const fixtureRoot = '/workspace/.simplyvibe/input/controller-host-harness';
const browser = await chromium.launch({ executablePath: '/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell', headless: true });
const results = { preview, hostBase };
function apiBody(url) {
  if (url.includes('CurrentEvents')) return { Items: [{ ScopeKey: 'overall', TotalCount: 12, OpenCount: 4, AsOf: '2026-10-25' }, { ScopeKey: 'headquarters', TotalCount: 5, OpenCount: 2, AsOf: '2026-10-25' }, { ScopeKey: 'branches', TotalCount: 7, OpenCount: 2, AsOf: '2026-10-25' }], TotalCount: 3 };
  if (url.includes('CurrentPermits')) return { Items: [{ ValidCount: 8, MissingCount: 2, OverdueCount: 1, AsOf: '2026-10-25', ValueDate: '2026-10-25' }], TotalCount: 1 };
  if (url.includes('CurrentEquipment')) return { Items: [{ EquipmentId: 'eq-1' }, { EquipmentId: 'eq-2' }], TotalCount: 2 };
  if (url.includes('ByMonth')) return { Items: [{ Year: 2026, Month: 10, Count: 1 }], TotalCount: 1 };
  return { Items: [], TotalCount: 0 };
}
async function faithfulHarness() {
  const context = await browser.newContext();
  const apiRequests = [], scripts = [], consoleEntries = [], pageErrors = [];
  await context.route(`${hostBase}**`, async route => {
    const url = new URL(route.request().url());
    const relative = url.pathname.slice('/controller-host-fixture/'.length) || 'index.html';
    const target = path.join(fixtureRoot, relative);
    const body = await fs.readFile(target);
    const contentType = relative.endsWith('.js') ? 'text/javascript' : relative.endsWith('.json') ? 'application/json' : 'text/html';
    await route.fulfill({ status: 200, contentType, body });
  });
  await context.route('https://api.ylm.co.il/**', async route => {
    const req = route.request();
    apiRequests.push({ url: req.url(), method: req.method(), auth: req.headers().authorization || null, body: req.postData() });
    const analyticalFailure = req.url().includes('MilgamDashboardByMonth');
    await route.fulfill({ status: analyticalFailure ? 500 : 200, contentType: 'application/json', body: JSON.stringify(analyticalFailure ? { personName: 'SYNTHETIC PRIVATE PERSON', internalRecord: 'SYNTHETIC-991' } : apiBody(req.url())) });
  });
  const page = await context.newPage();
  page.on('request', req => { if (req.resourceType() === 'script') scripts.push(req.url()); });
  page.on('console', async msg => consoleEntries.push({ type: msg.type(), values: await Promise.all(msg.args().map(a => a.jsonValue().catch(() => '<unavailable>'))) }));
  page.on('pageerror', error => pageErrors.push(String(error)));
  await page.goto(`${hostBase}index.html?preview=${encodeURIComponent(preview)}`);
  const frame = page.frames().find(item => item.url().startsWith(preview));
  await frame.waitForLoadState('domcontentloaded');
  await frame.locator('#snapshot-content .snapshot-grid').waitFor({ timeout: 8000 });
  const initialCount = apiRequests.length;
  const adapterType = await frame.evaluate(() => typeof globalThis.SimplyVibeHostAdapter);
  const sdkType = await frame.evaluate(() => typeof globalThis.SimplyVibeClient);
  await frame.locator('[data-permit]').first().click();
  await frame.waitForTimeout(150);
  const effectsBeforeRevoke = await page.evaluate(() => controllerHarness.effects.slice());
  await page.evaluate(() => controllerHarness.revoke());
  await frame.locator('#snapshot-refresh').click();
  await frame.waitForTimeout(350);
  results.faithfulHarness = { initialRequests: apiRequests.slice(0, initialCount), afterRevokeRequests: apiRequests.slice(initialCount), effectsBeforeRevoke, effectsAfterRevoke: await page.evaluate(() => controllerHarness.effects.slice()), adapterType, sdkType, connectionAfterRevoke: await frame.locator('#connection-status').innerText(), snapshotAfterRevoke: await frame.locator('#snapshot-region').innerText(), syntheticPrivateBodyObservedInConsole: JSON.stringify(consoleEntries).includes('SYNTHETIC PRIVATE PERSON'), matchingConsoleEntries: consoleEntries.filter(entry => JSON.stringify(entry).includes('SYNTHETIC PRIVATE PERSON')), scripts, consoleEntries, pageErrors };
  await context.close();
}
async function direct() {
  const context = await browser.newContext(); const apiRequests = [];
  await context.route('https://api.ylm.co.il/**', route => { apiRequests.push(route.request().url()); return route.abort(); });
  const page = await context.newPage(); await page.goto(preview);
  await page.evaluate(() => window.postMessage({ ApiAddress: 'https://api.ylm.co.il', Token: { access_token: 'synthetic-forged-token' } }, location.origin));
  await page.waitForTimeout(400);
  results.direct = { apiRequests, connection: await page.locator('#connection-status').innerText() }; await context.close();
}
await faithfulHarness(); await direct(); console.log(JSON.stringify(results, null, 2)); await browser.close();
