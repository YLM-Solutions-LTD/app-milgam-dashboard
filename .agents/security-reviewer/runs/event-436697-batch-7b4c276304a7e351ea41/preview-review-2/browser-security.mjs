import { chromium } from '/workspace/src/apps/milgam-dashboard/.agents/uat-tester/tmp/playwright/node_modules/playwright-core/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const preview = 'https://ea51f277.app-milgam-dashboard.pages.dev';
const hostBase = 'https://milgam.ylm.co.il/controller-host-fixture/';
const fixtureRoot = '/workspace/.simplyvibe/input/controller-host-harness';
const browser = await chromium.launch({ executablePath: '/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell', headless: true });
const results = { preview, hostBase, chromium: await browser.version() };

function apiBody(url) {
  if (url.includes('CurrentEvents')) return { Items: [{ ScopeKey: 'overall', TotalCount: 12, OpenCount: 4, AsOf: '2026-10-25' }, { ScopeKey: 'headquarters', TotalCount: 5, OpenCount: 2, AsOf: '2026-10-25' }, { ScopeKey: 'branches', TotalCount: 7, OpenCount: 2, AsOf: '2026-10-25' }], TotalCount: 3 };
  if (url.includes('CurrentPermits')) return { Items: [{ ValidCount: 8, MissingCount: 2, OverdueCount: 1, AsOf: '2026-10-25', ValueDate: '2026-10-25' }], TotalCount: 1 };
  if (url.includes('CurrentEquipment')) return { Items: [{ EquipmentId: 'eq-1' }, { EquipmentId: 'eq-2' }], TotalCount: 2 };
  if (url.includes('ByMonth')) return { Items: [{ Year: 2026, Month: 10, Count: 1 }], TotalCount: 1 };
  if (url.includes('ByDivision')) return { Items: [{ DivisionName: 'A', Count: 1 }], TotalCount: 1 };
  if (url.includes('Summary')) return { Items: [{ ScopeKey: 'headquarters', TotalCount: 1, OpenCount: 1 }, { ScopeKey: 'branches', TotalCount: 0, OpenCount: 0 }], TotalCount: 2 };
  if (url.includes('ByCategory')) return { Items: [{ CategoryName: 'A', Count: 1 }], TotalCount: 1 };
  if (url.includes('ClosureByCategory')) return { Items: [{ CategoryName: 'A', AverageHours: 1 }], TotalCount: 1 };
  return { Items: [], TotalCount: 0 };
}

async function installFixtureRoutes(context, state) {
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
    const item = { url: req.url(), method: req.method(), auth: req.headers().authorization || null, body: req.postData(), phase: state.phase };
    state.apiRequests.push(item);
    if (state.phase === 'private-body' && req.url().includes('MilgamDashboardByMonth')) {
      return route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ personName: 'SYNTHETIC PRIVATE PERSON', internalRecord: 'SYNTHETIC-991' }) });
    }
    if (state.phase === 'expire-401' && req.url().includes('CurrentEvents')) {
      return route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ personName: 'SYNTHETIC 401 PRIVATE', internalRecord: 'AUTH-991' }) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(apiBody(req.url())) });
  });
  await context.route('https://mntapi.ylm.co.il/**', route => { state.unexpected.push(route.request().url()); return route.abort(); });
}

async function faithfulHarness() {
  const context = await browser.newContext();
  const state = { phase: 'normal', apiRequests: [], unexpected: [] };
  const scripts = [], consoleEntries = [], pageErrors = [], allRequests = [];
  await installFixtureRoutes(context, state);
  const page = await context.newPage();
  page.on('request', req => { allRequests.push(req.url()); if (req.resourceType() === 'script') scripts.push(req.url()); });
  page.on('console', async msg => consoleEntries.push({ type: msg.type(), values: await Promise.all(msg.args().map(a => a.jsonValue().catch(() => '<unavailable>'))) }));
  page.on('pageerror', error => pageErrors.push(String(error)));
  await page.goto(`${hostBase}index.html?preview=${encodeURIComponent(preview)}`);
  const frame = page.frames().find(item => item.url().startsWith(preview));
  await frame.waitForLoadState('domcontentloaded');
  await frame.locator('#snapshot-content .snapshot-grid').waitFor({ timeout: 10000 });
  const initialRequestCount = state.apiRequests.length;
  const sdk = await frame.evaluate(() => ({ type: typeof globalThis.SimplyVibeClient, adapter: typeof globalThis.SimplyVibeHostAdapter }));

  await frame.locator('[data-permit]').first().click();
  await page.waitForTimeout(200);
  const normalEffects = await page.evaluate(() => controllerHarness.effects.slice());

  await page.evaluate(() => controllerHarness.holdCommand());
  await frame.locator('[data-permit]').first().click();
  await page.waitForTimeout(100);
  await page.evaluate(() => controllerHarness.revoke());
  await page.evaluate(() => controllerHarness.releaseCommand());
  await page.waitForTimeout(300);
  const effectsAfterHeldRevoke = await page.evaluate(() => controllerHarness.effects.slice());
  const beforeDeniedRefresh = state.apiRequests.length;
  await frame.locator('#snapshot-refresh').click();
  await page.waitForTimeout(300);
  const deniedRefreshRequests = state.apiRequests.slice(beforeDeniedRefresh);

  await page.evaluate(() => controllerHarness.reenter());
  await page.waitForTimeout(700);
  await frame.locator('#snapshot-refresh').click();
  await page.waitForTimeout(500);
  const reentryRequests = state.apiRequests.filter(item => item.auth === 'Bearer controller-synthetic-generation-2');
  await frame.locator('[data-permit]').first().click();
  await page.waitForTimeout(200);
  const effectsAfterReentry = await page.evaluate(() => controllerHarness.effects.slice());

  state.phase = 'expire-401';
  const before401 = state.apiRequests.length;
  await frame.locator('#snapshot-refresh').click();
  await page.waitForTimeout(600);
  const requestsDuring401 = state.apiRequests.slice(before401);
  const beforePost401 = state.apiRequests.length;
  await frame.locator('#snapshot-refresh').click();
  await page.waitForTimeout(350);
  const post401Requests = state.apiRequests.slice(beforePost401);

  results.faithfulHarness = {
    sdk, initialRequests: state.apiRequests.slice(0, initialRequestCount), normalEffects,
    effectsAfterHeldRevoke, deniedRefreshRequests, reentryRequests, effectsAfterReentry,
    requestsDuring401, post401Requests,
    connectionAfter401: await frame.locator('#connection-status').innerText(),
    private401BodyObservedInConsole: JSON.stringify(consoleEntries).includes('SYNTHETIC 401 PRIVATE'),
    scripts, unexpected: state.unexpected, crossOriginRequests: allRequests.filter(url => !url.startsWith(preview) && !url.startsWith(hostBase) && !url.startsWith('https://api.ylm.co.il/')),
    consoleEntries, pageErrors
  };
  await context.close();
}

async function diagnosticBody() {
  const context = await browser.newContext();
  const state = { phase: 'private-body', apiRequests: [], unexpected: [] };
  const consoleEntries = [];
  await installFixtureRoutes(context, state);
  const page = await context.newPage();
  page.on('console', async msg => consoleEntries.push({ type: msg.type(), values: await Promise.all(msg.args().map(a => a.jsonValue().catch(() => '<unavailable>'))) }));
  await page.goto(`${hostBase}index.html?preview=${encodeURIComponent(preview)}`);
  await page.waitForTimeout(1300);
  results.diagnosticBody = { privateBodyObserved: JSON.stringify(consoleEntries).includes('SYNTHETIC PRIVATE PERSON'), matchingEntries: consoleEntries.filter(entry => JSON.stringify(entry).includes('SYNTHETIC PRIVATE PERSON')) };
  await context.close();
}

async function direct() {
  const context = await browser.newContext(); const apiRequests = [];
  await context.route('https://api.ylm.co.il/**', route => { apiRequests.push(route.request().url()); return route.abort(); });
  const page = await context.newPage(); await page.goto(preview);
  await page.evaluate(() => window.postMessage({ ApiAddress: 'https://api.ylm.co.il', Token: { access_token: 'synthetic-forged-token' } }, location.origin));
  await page.waitForTimeout(500);
  results.direct = { apiRequests, connection: await page.locator('#connection-status').innerText() };
  await context.close();
}

await faithfulHarness();
await diagnosticBody();
await direct();
console.log(JSON.stringify(results, null, 2));
await browser.close();
