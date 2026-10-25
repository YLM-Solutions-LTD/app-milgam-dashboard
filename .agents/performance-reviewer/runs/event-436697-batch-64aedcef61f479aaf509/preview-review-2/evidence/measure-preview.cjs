const { chromium } = require('/usr/local/lib/node_modules/@playwright/test/node_modules/playwright');
const fs = require('fs');

const preview = 'https://1de11912.app-milgam-dashboard.pages.dev/';
const parentUrl = 'https://simplylog.ylm.co.il/perf-harness';
const apiOrigin = 'https://api.ylm.co.il';
const out = process.argv[2];

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
  MilgamDashboardCurrentEquipment: { Items: equipmentItems, TotalCount: equipmentItems.length },
  MilgamDashboardByMonth: { Items: [], TotalCount: 0 }
};

async function runViewport(browser, viewport) {
  const context = await browser.newContext({ viewport, ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const calls = [];
  const responses = [];
  const consoleErrors = [];
  await context.addInitScript(() => {
    globalThis.__hostCalls = [];
    globalThis.__longTasks = [];
    new PerformanceObserver(list => { for (const e of list.getEntries()) globalThis.__longTasks.push({ startTime: e.startTime, duration: e.duration }); }).observe({ type: 'longtask', buffered: true });
    globalThis.SimplyVibeHostAdapter = {
      ready: async () => { globalThis.__hostCalls.push({ type: 'ready', at: performance.now() }); await new Promise(r => setTimeout(r, 75)); },
      executeCommand: async (name, parameter) => { globalThis.__hostCalls.push({ type: 'command', name, parameter, at: performance.now() }); },
      ToDisplayDate: (value) => String(value)
    };
  });
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  await page.route(parentUrl, route => route.fulfill({ contentType: 'text/html', body: `<!doctype html><iframe id="app" src="${preview}" style="width:100%;height:100vh;border:0"></iframe><script>document.querySelector('#app').addEventListener('load',()=>setTimeout(()=>document.querySelector('#app').contentWindow.postMessage({ApiAddress:'${apiOrigin}',Token:{access_token:'synthetic-performance-token',token_type:'Bearer'},LanguageCode:'he',LanguageDirection:'rtl'},'*'),50))</script>` }));
  await page.route(`${apiOrigin}/api/Entity/**`, async route => {
    const req = route.request();
    const name = new URL(req.url()).pathname.split('/').at(-2);
    const body = req.postData() || '';
    calls.push({ name, method: req.method(), body, start: Date.now() });
    const fixture = fixtures[name] || { Items: [], TotalCount: 0 };
    const json = JSON.stringify(fixture);
    await new Promise(r => setTimeout(r, 40));
    await route.fulfill({ status: 200, contentType: 'application/json', body: json });
    responses.push({ name, bytes: Buffer.byteLength(json), at: Date.now() });
  });
  const start = Date.now();
  await page.goto(parentUrl, { waitUntil: 'domcontentloaded' });
  const frame = await (await page.waitForSelector('#app')).contentFrame();
  await frame.waitForSelector('.equipment-total strong', { timeout: 30000 });
  const readyAt = Date.now();
  const initial = await frame.evaluate(() => {
    const region = document.querySelector('#snapshot-region');
    const rect = region.getBoundingClientRect();
    return {
      snapshotElements: region.querySelectorAll('*').length,
      contentElements: document.querySelector('#snapshot-content').querySelectorAll('*').length,
      totalDocumentElements: document.querySelectorAll('*').length,
      width: rect.width, scrollWidth: region.scrollWidth, viewportWidth: innerWidth,
      equipmentText: document.querySelector('.equipment-total strong')?.textContent,
      heap: performance.memory ? performance.memory.usedJSHeapSize : null
    };
  });
  const initialCalls = calls.slice();
  const beforeRefresh = calls.length;
  const refreshStart = Date.now();
  await frame.locator('#snapshot-refresh').click();
  await frame.waitForFunction(() => document.querySelector('#snapshot-refresh')?.disabled === true);
  await frame.waitForFunction(() => document.querySelector('#snapshot-refresh')?.disabled === false, null, { timeout: 30000 });
  const refreshMs = Date.now() - refreshStart;
  const refreshCalls = calls.slice(beforeRefresh);
  const refreshResponseAt = Math.max(...responses.filter(r => r.at >= refreshStart && r.name.startsWith('MilgamDashboardCurrent')).map(r => r.at));
  const postResponseReadyMs = Date.now() - refreshResponseAt;
  const beforeBurst = calls.length;
  await frame.evaluate(() => { const b = document.querySelector('#snapshot-refresh'); for (let i = 0; i < 10; i++) b.click(); });
  await frame.waitForFunction(() => document.querySelector('#snapshot-refresh')?.disabled === false, null, { timeout: 30000 });
  const burstCalls = calls.slice(beforeBurst);
  await frame.evaluate(() => { for (const b of document.querySelectorAll('[data-permit]')) for (let i = 0; i < 7; i++) b.click(); });
  await page.waitForTimeout(200);
  const hostCalls = await frame.evaluate(() => globalThis.__hostCalls);
  const longTasks = await frame.evaluate(() => globalThis.__longTasks);
  const after = await frame.evaluate(() => ({ heap: performance.memory ? performance.memory.usedJSHeapSize : null, snapshotElements: document.querySelector('#snapshot-region').querySelectorAll('*').length }));
  await context.close();
  return { viewport, navigationToReadyMs: readyAt - start, initial, after, initialCalls, refreshMs, postResponseReadyMs, refreshCalls, burstCalls, responses, hostCalls, longTasks, consoleErrors };
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell', headless: true, args: ['--no-sandbox', '--enable-precise-memory-info'] });
  const browserVersion = await browser.version();
  const results = [];
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) results.push(await runViewport(browser, viewport));
  await browser.close();
  fs.writeFileSync(out, JSON.stringify({ measuredAt: new Date().toISOString(), preview, commit: 'd9ef28ddc6be1d9b6b9fb2f066bcde19c53c193b', browserVersion, node: process.version, equipmentRows: equipmentItems.length, results }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
