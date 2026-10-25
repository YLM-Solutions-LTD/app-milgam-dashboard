const { chromium } = require('/usr/local/lib/node_modules/@playwright/test/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const preview = 'https://5ab11833.app-milgam-dashboard.pages.dev/';
const hostBase = 'https://milgam.ylm.co.il/controller-host-fixture/';
const fixtureDir = '/workspace/.simplyvibe/input/controller-host-harness';
const files = { 'index.html': 'index.html', 'host-fixture.js': 'host-fixture.js', 'vendor/guest-bridge.js': 'vendor/guest-bridge.js', 'vendor/simplyvibe-client.js': 'vendor/simplyvibe-client.js' };
const fixtures = {
  MilgamDashboardCurrentEvents: { Items: [
    { ScopeKey: 'overall', TotalCount: 100, OpenCount: 20, AsOf: '2026-10-25T10:00:00' },
    { ScopeKey: 'headquarters', TotalCount: 40, OpenCount: 8, AsOf: '2026-10-25T10:00:00' },
    { ScopeKey: 'branches', TotalCount: 60, OpenCount: 12, AsOf: '2026-10-25T10:00:00' }
  ], TotalCount: 3 },
  MilgamDashboardCurrentPermits: { Items: [{ ValidCount: 70, MissingCount: 5, OverdueCount: 9, AsOf: '2026-10-25T10:00:00', ValueDate: '2026-10-25T00:00:00' }], TotalCount: 1 },
  MilgamDashboardCurrentEquipment: { Items: [{ EquipmentId: 1 }], TotalCount: 1 }
};
const output = process.argv[2];

(async () => {
  const browser = await chromium.launch({ executablePath: '/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell', headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const calls = [], consoleMessages = [], pageErrors = [];
  let currentMode = 'ok';
  page.on('console', message => consoleMessages.push({ type: message.type(), text: message.text() }));
  page.on('pageerror', error => pageErrors.push(String(error)));
  await page.route(`${hostBase}**`, route => {
    const relative = new URL(route.request().url()).pathname.slice('/controller-host-fixture/'.length) || 'index.html';
    const file = files[relative];
    if (!file) return route.abort('blockedbyclient');
    return route.fulfill({ status: 200, contentType: path.extname(file) === '.html' ? 'text/html' : 'application/javascript', body: fs.readFileSync(path.join(fixtureDir, file)) });
  });
  await page.route('https://api.ylm.co.il/**', async route => {
    const request = route.request();
    const name = new URL(request.url()).pathname.split('/').filter(Boolean).at(-2) || '';
    const isCurrent = name.startsWith('MilgamDashboardCurrent');
    const record = { name, body: request.postData(), auth: request.headers().authorization || null, mode: currentMode, at: Date.now() };
    calls.push(record);
    if (isCurrent && currentMode === '500' && name === 'MilgamDashboardCurrentEvents') return route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ private: 'PERF_PRIVATE_500_MARKER' }) });
    if (isCurrent && currentMode === '401' && name === 'MilgamDashboardCurrentEvents') return route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ private: 'PERF_PRIVATE_401_MARKER' }) });
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fixtures[name] || { Items: [], TotalCount: 0 }) });
  });
  await page.route('https://mntapi.ylm.co.il/**', route => route.abort('blockedbyclient'));
  await page.goto(`${hostBase}index.html?preview=${encodeURIComponent(preview)}`, { waitUntil: 'domcontentloaded' });
  const frame = await (await page.waitForSelector('#guest')).contentFrame();
  await frame.waitForSelector('.equipment-total strong', { timeout: 20000 });
  const snapshot = async () => frame.evaluate(() => ({
    html: document.querySelector('#snapshot-content')?.innerHTML,
    text: document.querySelector('#snapshot-content')?.textContent?.trim(),
    status: document.querySelector('#snapshot-status')?.textContent?.trim(),
    connection: document.querySelector('#connection-status')?.textContent?.trim()
  }));
  const baseline = await snapshot();

  currentMode = '500';
  const before500 = calls.length;
  await frame.locator('#snapshot-refresh').click();
  await frame.waitForFunction(() => document.querySelector('#snapshot-status')?.textContent?.includes('האחרון'), null, { timeout: 10000 });
  const after500 = await snapshot();
  const calls500 = calls.slice(before500);

  currentMode = 'ok';
  await frame.locator('[data-snapshot-retry]').click();
  await frame.waitForFunction(() => !document.querySelector('#snapshot-status')?.textContent?.includes('האחרון'), null, { timeout: 10000 });

  currentMode = '401';
  const before401 = calls.length;
  await frame.locator('#snapshot-refresh').click();
  await frame.waitForFunction(() => document.querySelector('#snapshot-status')?.textContent?.includes('האחרון'), null, { timeout: 10000 });
  const after401 = await snapshot();
  const calls401 = calls.slice(before401);
  currentMode = 'ok';
  const beforeDeniedRefresh = calls.length;
  await frame.locator('#snapshot-refresh').click({ force: true }).catch(() => {});
  await page.waitForTimeout(500);
  const deniedRefreshCalls = calls.slice(beforeDeniedRefresh);

  const beforeReentry = calls.length;
  await page.evaluate(() => globalThis.controllerHarness.reenter());
  for (let i = 0; i < 100 && calls.length < beforeReentry + 3; i++) await page.waitForTimeout(25);
  await frame.waitForFunction(() => document.querySelector('.equipment-total strong') && !document.querySelector('#snapshot-status')?.textContent?.includes('האחרון'), null, { timeout: 10000 });
  const reentryCalls = calls.slice(beforeReentry);
  const afterReentry = await snapshot();

  const effectsBefore = (await page.evaluate(() => globalThis.controllerHarness.state())).effects.length;
  await page.evaluate(() => globalThis.controllerHarness.holdCommand());
  await frame.evaluate(() => { const controls = [...document.querySelectorAll('[data-permit]')]; for (let i = 0; i < 20; i++) controls[i % controls.length].click(); });
  await page.waitForTimeout(100);
  const held = await page.evaluate(() => globalThis.controllerHarness.state());
  await page.evaluate(() => globalThis.controllerHarness.releaseCommand());
  await page.waitForTimeout(250);
  const released = await page.evaluate(() => globalThis.controllerHarness.state());

  const beforeOverlap = calls.length;
  await page.evaluate(() => {
    globalThis.controllerHarness.reenter();
    queueMicrotask(() => globalThis.controllerHarness.reenter());
  });
  for (let i = 0; i < 120; i++) {
    const state = await page.evaluate(() => globalThis.controllerHarness.state());
    if (state.generation === 4 && calls.slice(beforeOverlap).filter(call => call.auth?.endsWith('generation-4') && call.name.startsWith('MilgamDashboardCurrent')).length >= 3) break;
    await page.waitForTimeout(25);
  }
  await page.waitForTimeout(250);
  const overlapReentryCalls = calls.slice(beforeOverlap);
  const overlapState = await page.evaluate(() => globalThis.controllerHarness.state());

  const markerLeak = consoleMessages.filter(entry => /PERF_PRIVATE_(500|401)_MARKER/.test(entry.text));
  fs.writeFileSync(output, JSON.stringify({
    preview, commit: 'c9686ba1ad6d4f7b0896ba32c29ad38dcf607022', browserVersion: await browser.version(),
    baseline, calls500, after500, retained500: after500.html === baseline.html,
    calls401, after401, retained401: after401.html === baseline.html,
    deniedRefreshCalls, reentryCalls, afterReentry,
    permitBurst: { effectsBefore, heldEffects: held.effects.length, releasedEffects: released.effects.length, addedEffects: released.effects.length - effectsBefore },
    overlapReentryCalls, overlapState,
    pageErrors, markerLeak, consoleWarningsAndErrors: consoleMessages.filter(entry => ['warning', 'error'].includes(entry.type))
  }, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
