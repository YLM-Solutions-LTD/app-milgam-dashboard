const { chromium } = require('/usr/local/lib/node_modules/@playwright/test/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const preview = 'https://ea51f277.app-milgam-dashboard.pages.dev/';
const commit = '8f1e577bbcb4670878dec24ff570c1382a18d170';
const hostBase = 'https://milgam.ylm.co.il/controller-host-fixture/';
const fixtureDir = '/workspace/.simplyvibe/input/controller-host-harness';
const out = process.argv[2];
const fixtureFiles = { 'index.html': 'index.html', 'host-fixture.js': 'host-fixture.js', 'vendor/guest-bridge.js': 'vendor/guest-bridge.js', 'vendor/simplyvibe-client.js': 'vendor/simplyvibe-client.js' };

const equipmentRow = (id) => ({
  EquipmentId: id, LocationEntityId: id + 10000, LocationEntityType: 1,
  LocationPath: `20,0/${id + 10000},1`, EquipmentTypeId: (id % 8) + 1,
  IsActive: id % 5 !== 0, TreatmentDaysInterval: id % 3 ? 30 : null,
  NextTreatmentDate: id % 3 ? '2026-11-24T00:00:00' : null,
  LastTreatmentEventId: id % 7 ? id + 50000 : null,
  LastTreatmentDate: id % 7 ? '2026-10-20T10:00:00' : null,
  LastTreatmentSeverityId: id % 7 ? 1 : null, LastTreatmentStatus: id % 7 ? 1 : null,
  TreatmentCategoryId: id % 3 ? 10487 : null, ValidTreatmentSeverityId: id % 3 ? 1 : null,
  AsOf: '2026-10-25T10:00:00'
});
const equipmentItems = Array.from({ length: 10000 }, (_, i) => equipmentRow(i + 1));
const fixtures = {
  MilgamDashboardCurrentEvents: { Items: [
    { ScopeKey: 'overall', TotalCount: 100, OpenCount: 20, AsOf: '2026-10-25T10:00:00' },
    { ScopeKey: 'headquarters', TotalCount: 40, OpenCount: 8, AsOf: '2026-10-25T10:00:00' },
    { ScopeKey: 'branches', TotalCount: 60, OpenCount: 12, AsOf: '2026-10-25T10:00:00' }
  ], TotalCount: 3 },
  MilgamDashboardCurrentPermits: { Items: [{ ValidCount: 70, MissingCount: 5, OverdueCount: 9, AsOf: '2026-10-25T10:00:00', ValueDate: '2026-10-25T00:00:00' }], TotalCount: 1 },
  MilgamDashboardCurrentEquipment: { Items: equipmentItems, TotalCount: equipmentItems.length }
};
const fixtureJson = Object.fromEntries(Object.entries(fixtures).map(([key, value]) => [key, JSON.stringify(value)]));

async function run(browser, viewport) {
  const context = await browser.newContext({ viewport, ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const calls = [], executableRequests = [], consoleErrors = [], pageErrors = [], failedRequests = [];
  let currentInFlight = 0, peakCurrentConcurrency = 0, csp = null;
  await page.addInitScript(() => {
    globalThis.__perfLongTasks = [];
    try { new PerformanceObserver(list => { for (const e of list.getEntries()) globalThis.__perfLongTasks.push({ startTime: e.startTime, duration: e.duration }); }).observe({ type: 'longtask', buffered: true }); } catch {}
  });
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => pageErrors.push(String(err)));
  page.on('requestfailed', req => failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
  page.on('request', req => { if (['script', 'stylesheet'].includes(req.resourceType())) executableRequests.push({ url: req.url(), type: req.resourceType() }); });
  page.on('response', res => {
    if (res.url() === preview) csp = res.headers()['content-security-policy'] || null;
    if (new URL(res.url()).hostname === 'api.ylm.co.il') {
      const call = [...calls].reverse().find(item => item.url === res.url() && !item.responseAt);
      if (call) call.responseAt = Date.now();
    }
  });
  await page.route(`${hostBase}**`, route => {
    const relative = new URL(route.request().url()).pathname.slice('/controller-host-fixture/'.length) || 'index.html';
    const file = fixtureFiles[relative];
    if (!file) return route.abort('blockedbyclient');
    return route.fulfill({ status: 200, contentType: path.extname(file) === '.html' ? 'text/html' : 'application/javascript', body: fs.readFileSync(path.join(fixtureDir, file)) });
  });
  await page.route('https://api.ylm.co.il/**', async route => {
    const req = route.request();
    const pathname = new URL(req.url()).pathname;
    const name = pathname.split('/').filter(Boolean).at(-2) || '';
    const isCurrent = name.startsWith('MilgamDashboardCurrent');
    const json = fixtureJson[name] || JSON.stringify({ Items: [], TotalCount: 0 });
    const call = { name, url: req.url(), method: req.method(), body: req.postData(), bytes: Buffer.byteLength(json), startedAt: Date.now(), isCurrent };
    calls.push(call);
    if (isCurrent) { currentInFlight++; peakCurrentConcurrency = Math.max(peakCurrentConcurrency, currentInFlight); }
    await new Promise(resolve => setTimeout(resolve, 60));
    await route.fulfill({ status: 200, contentType: 'application/json', body: json });
    call.finishedAt = Date.now();
    if (isCurrent) currentInFlight--;
  });
  await page.route('https://mntapi.ylm.co.il/**', route => route.abort('blockedbyclient'));
  const navStart = Date.now();
  await page.goto(`${hostBase}index.html?preview=${encodeURIComponent(preview)}`, { waitUntil: 'domcontentloaded' });
  const frame = await (await page.waitForSelector('#guest')).contentFrame();
  await frame.waitForSelector('.equipment-total strong', { timeout: 30000 });
  const readyAt = Date.now();
  const initialCallCount = calls.length;
  const initial = await frame.evaluate(() => {
    const region = document.querySelector('#snapshot-region');
    return {
      hasSimplyVibeClient: typeof globalThis.SimplyVibeClient === 'function',
      snapshotElements: region.querySelectorAll('*').length,
      contentElements: document.querySelector('#snapshot-content').querySelectorAll('*').length,
      documentElements: document.querySelectorAll('*').length,
      documentScrollWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      equipmentText: document.querySelector('.equipment-total strong')?.textContent,
      status: document.querySelector('#snapshot-status')?.textContent?.trim()
    };
  });
  const mappingSamplesMs = await frame.evaluate(async raw => {
    const { mapCurrentSnapshot } = await import('./current-snapshot.js');
    const samples = [];
    for (let i = 0; i < 6; i++) { const start = performance.now(); mapCurrentSnapshot(raw); samples.push(performance.now() - start); }
    return samples;
  }, { events: fixtures.MilgamDashboardCurrentEvents, permits: fixtures.MilgamDashboardCurrentPermits, equipment: fixtures.MilgamDashboardCurrentEquipment });
  const beforeRefresh = calls.length;
  await frame.evaluate(() => {
    globalThis.__snapshotMutationTimes = [];
    new MutationObserver(() => globalThis.__snapshotMutationTimes.push(Date.now())).observe(document.querySelector('#snapshot-content'), { subtree: true, childList: true, characterData: true });
  });
  const refreshStart = Date.now();
  await frame.locator('#snapshot-refresh').click();
  await frame.waitForFunction(() => document.querySelector('#snapshot-refresh')?.disabled === false && document.querySelector('.equipment-total strong'), null, { timeout: 30000 });
  const refreshMs = Date.now() - refreshStart;
  const refreshCalls = calls.slice(beforeRefresh);
  const lastRefreshResponse = Math.max(...refreshCalls.map(call => call.responseAt || 0));
  const mutationTimes = await frame.evaluate(() => globalThis.__snapshotMutationTimes || []);
  const firstPostResponseMutation = mutationTimes.find(time => time >= lastRefreshResponse) || null;
  const postResponseRenderMs = firstPostResponseMutation === null ? null : firstPostResponseMutation - lastRefreshResponse;
  const beforeBurst = calls.length;
  await frame.evaluate(() => { const button = document.querySelector('#snapshot-refresh'); for (let i = 0; i < 10; i++) button.click(); });
  for (let i = 0; i < 100 && calls.length < beforeBurst + 3; i++) await page.waitForTimeout(25);
  await frame.waitForFunction(() => document.querySelector('#snapshot-refresh')?.disabled === false && document.querySelectorAll('[data-permit]').length > 0, null, { timeout: 30000 });
  const refreshBurstCalls = calls.slice(beforeBurst);
  await page.evaluate(() => globalThis.controllerHarness.holdCommand());
  await frame.evaluate(() => { const buttons = [...document.querySelectorAll('[data-permit]')]; for (let i = 0; i < 20; i++) buttons[i % buttons.length].click(); });
  await page.waitForTimeout(150);
  const heldState = await page.evaluate(() => globalThis.controllerHarness.state());
  await page.evaluate(() => globalThis.controllerHarness.releaseCommand());
  await page.waitForTimeout(250);
  const releasedState = await page.evaluate(() => globalThis.controllerHarness.state());
  const beforeRevoke = calls.length;
  await page.evaluate(() => globalThis.controllerHarness.revoke());
  await page.waitForTimeout(150);
  await frame.locator('#snapshot-refresh').click({ force: true }).catch(() => {});
  await page.waitForTimeout(250);
  const postRevokeCalls = calls.slice(beforeRevoke);
  const beforeReentry = calls.length;
  await page.evaluate(() => globalThis.controllerHarness.reenter());
  for (let i = 0; i < 160 && calls.length < beforeReentry + 3; i++) await page.waitForTimeout(25);
  await frame.waitForFunction(() => document.querySelectorAll('[data-permit]').length > 0 && document.querySelector('#snapshot-refresh')?.disabled === false, null, { timeout: 30000 });
  const reentryCalls = calls.slice(beforeReentry);
  const reentryUi = await frame.evaluate(() => ({
    connection: document.querySelector('#connection-status')?.textContent?.trim(),
    snapshotStatus: document.querySelector('#snapshot-status')?.textContent?.trim(),
    equipmentText: document.querySelector('.equipment-total strong')?.textContent,
    refreshDisabled: document.querySelector('#snapshot-refresh')?.disabled
  }));
  const effectsBeforeRevokedCommand = (await page.evaluate(() => globalThis.controllerHarness.state())).effects.length;
  await page.evaluate(() => globalThis.controllerHarness.holdCommand());
  await frame.locator('[data-permit]').first().click();
  await page.waitForTimeout(75);
  await page.evaluate(() => globalThis.controllerHarness.revoke());
  await page.evaluate(() => globalThis.controllerHarness.releaseCommand());
  await page.waitForTimeout(250);
  const revokedCommandState = await page.evaluate(() => globalThis.controllerHarness.state());
  const longTasks = await frame.evaluate(() => globalThis.__perfLongTasks || []);
  const currentCalls = calls.filter(call => call.isCurrent);
  const result = {
    viewport, navigationToReadyMs: readyAt - navStart, initial, mappingSamplesMs,
    initialCalls: calls.slice(0, initialCallCount), refreshCalls, refreshMs, postResponseRenderMs,
    refreshBurstCalls, heldState, releasedState, postRevokeCalls, reentryCalls, reentryUi, effectsBeforeRevokedCommand, revokedCommandState, peakCurrentConcurrency,
    decodedCurrentBytesPerGeneration: currentCalls.slice(0, 3).reduce((sum, call) => sum + call.bytes, 0),
    allCalls: calls, longTasks, consoleErrors, pageErrors, failedRequests, executableRequests, csp
  };
  await context.close();
  return result;
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell', headless: true, args: ['--no-sandbox'] });
  const results = [];
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) results.push(await run(browser, viewport));
  const output = { measuredAt: new Date().toISOString(), preview, commit, browserVersion: await browser.version(), node: process.version, harness: 'controller-owned real GuestBridge and packaged guest SDK; corrected trusted origin; all API fulfilled locally', equipmentRows: equipmentItems.length, results };
  await browser.close();
  fs.writeFileSync(out, JSON.stringify(output, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
