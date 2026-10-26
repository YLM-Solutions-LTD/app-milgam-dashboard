import playwright from '/usr/local/lib/node_modules/@playwright/test/node_modules/playwright/index.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const preview = 'https://f9d0c736.app-milgam-dashboard.pages.dev';
const head = '2f47f48ed056df72c5d8b861778dad5cc4069703';
const harness = '/workspace/.simplyvibe/input/controller-host-harness';
const evidence = new URL('./evidence/', import.meta.url);
await fs.mkdir(evidence, { recursive: true });
const browser = await playwright.chromium.launch({ executablePath: '/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell', headless: true, args: ['--no-sandbox'] });

const equipment = Array.from({ length: 10000 }, (_, i) => ({ EquipmentId: i + 1, IsActive: i % 2 === 0, LastTreatmentDate: null, AsOf: '2026-10-26T09:00:00' }));
const thousand = Array.from({ length: 1000 }, (_, i) => ({ DivisionName: `D${i}`, EventCount: i === 0 ? 10 : 0 }));
const fixtures = {
  MilgamDashboardCurrentEvents: { Items: [{ ScopeKey: 'overall', TotalCount: '12', OpenCount: '5', AsOf: '2026-10-26T09:00:00' }, { ScopeKey: 'headquarters', TotalCount: '4', OpenCount: '2', AsOf: '2026-10-26T09:00:00' }, { ScopeKey: 'branches', TotalCount: '8', OpenCount: '3', AsOf: '2026-10-26T09:00:00' }], TotalCount: 3 },
  MilgamDashboardCurrentPermits: { Items: [{ ValidCount: '7', MissingCount: '2', OverdueCount: '1', AsOf: '2026-10-26T09:00:00', ValueDate: '2026-10-26' }], TotalCount: 1 },
  MilgamDashboardCurrentEquipment: { Items: equipment, TotalCount: 10000 },
  MilgamDashboardByMonth: { Items: [{ Year: 2026, Month: 10, Label: '10/26', EventCount: 10 }], TotalCount: 1 },
  MilgamDashboardByDivision: { Items: thousand, TotalCount: 1000 },
  MilgamDashboardSummary: { Items: [{ ScopeKey: 'headquarters', ScopeLabel: 'מטה', ScopeOrder: 1, EventCount: 5, ClosedCount: 2, EligibleDurationCount: 2, InvalidDurationCount: 0, AverageCloseDays: 1 }, { ScopeKey: 'branches', ScopeLabel: 'סניפים', ScopeOrder: 2, EventCount: 5, ClosedCount: 3, EligibleDurationCount: 3, InvalidDurationCount: 0, AverageCloseDays: 1 }], TotalCount: 2 },
  MilgamDashboardByCategory: { Items: thousand.map((_, i) => ({ ScopeKey: i % 2 ? 'branches' : 'headquarters', ScopeLabel: i % 2 ? 'סניפים' : 'מטה', ScopeOrder: i % 2 ? 2 : 1, CategoryName: `C${i}`, EventCount: i < 2 ? 5 : 0 })), TotalCount: 1000 },
  MilgamDashboardClosureByCategory: { Items: thousand.map((_, i) => ({ ScopeKey: i % 2 ? 'branches' : 'headquarters', ScopeLabel: i % 2 ? 'סניפים' : 'מטה', ScopeOrder: i % 2 ? 2 : 1, CategoryName: `C${i}`, ClosedCount: i === 0 ? 2 : i === 1 ? 3 : 0, EligibleDurationCount: i === 0 ? 2 : i === 1 ? 3 : 0, InvalidDurationCount: 0, AverageCloseDays: i < 2 ? 1 : null })), TotalCount: 1000 }
};
const fixtureKey = url => Object.keys(fixtures).find(key => url.includes(`/api/Entity/${key}/Search`));
const result = { preview, head, browser: await browser.version(), scenarios: [], unexpected: [], executables: [] };

async function open(spec) {
  const context = await browser.newContext({ viewport: spec.viewport });
  const page = await context.newPage();
  const calls = [], errors = [];
  let active = 0, peak = 0, terminal401 = false;
  page.on('pageerror', error => errors.push(`pageerror:${error.message}`));
  page.on('console', message => { if (message.type() === 'error') errors.push(`console:${message.text()}`); });
  page.on('request', request => { if (['script', 'worker'].includes(request.resourceType())) result.executables.push(request.url()); });
  await page.addInitScript(() => { window.__long = []; new PerformanceObserver(list => window.__long.push(...list.getEntries().map(entry => entry.duration))).observe({ type: 'longtask', buffered: true }); });
  await page.route('https://milgam.ylm.co.il/controller-host-fixture/**', async route => {
    const relative = new URL(route.request().url()).pathname.replace('/controller-host-fixture/', '') || 'index.html';
    try {
      let body = await fs.readFile(path.join(harness, relative));
      if (relative === 'host-fixture.js' && spec.dir === 'ltr') body = Buffer.from(body.toString().replace('LanguageDirection: "rtl"', 'LanguageDirection: "ltr"').replace('LanguageCode: "he"', 'LanguageCode: "en"'));
      await route.fulfill({ status: 200, contentType: relative.endsWith('.js') ? 'text/javascript' : 'text/html', body });
    } catch { await route.fulfill({ status: 404, body: 'missing' }); }
  });
  await page.route('https://api.ylm.co.il/**', async route => {
    const request = route.request(), key = fixtureKey(request.url()), body = JSON.stringify(fixtures[key] || {}), started = performance.now();
    active++; peak = Math.max(peak, active);
    const call = { key, method: request.method(), body: request.postData(), bytes: Buffer.byteLength(body), started, status: terminal401 && key?.startsWith('MilgamDashboardCurrent') ? 401 : 200 };
    calls.push(call);
    await new Promise(resolve => setTimeout(resolve, 25));
    active--;
    if (call.status === 401) await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ untrusted: 'do-not-render' }) });
    else if (key) await route.fulfill({ status: 200, contentType: 'application/json', body });
    else await route.abort();
  });
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith(preview) || url.startsWith('https://milgam.ylm.co.il/controller-host-fixture/') || url.startsWith('https://api.ylm.co.il/')) return route.fallback();
    result.unexpected.push(url); return route.abort();
  });
  await page.goto(`https://milgam.ylm.co.il/controller-host-fixture/index.html?preview=${encodeURIComponent(preview)}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  const frame = page.frames().find(candidate => candidate.url().startsWith(preview));
  if (!frame) throw Error('preview iframe missing');
  await frame.locator('#apply-range').waitFor({ timeout: 20000 });
  await frame.locator('[data-permit]').first().waitFor({ timeout: 20000 });
  return { context, page, frame, calls, errors, peak: () => peak, set401: value => { terminal401 = value; } };
}

for (const spec of [{ name: 'desktop-rtl', viewport: { width: 1440, height: 900 }, dir: 'rtl' }, { name: 'phone-ltr', viewport: { width: 390, height: 844 }, dir: 'ltr' }]) {
  const x = await open(spec), initial = x.calls.length;
  await x.frame.locator('#from-date').fill('2025-12-31'); await x.frame.locator('#to-date').fill('2026-01-02');
  const before = x.calls.length; await x.frame.evaluate(() => { window.__long = []; });
  await x.frame.locator('#apply-range').click(); await x.page.waitForTimeout(900);
  const applied = x.calls.slice(before);
  const beforePage = x.calls.length;
  await x.frame.locator('[data-page-key="division"] [data-page-step="1"]').click(); await x.page.waitForTimeout(100);
  const metrics = await x.frame.evaluate(() => {
    const footer = document.querySelector('[data-simplyvibe-release]'), rect = footer.getBoundingClientRect();
    return { dir: document.documentElement.dir, widths: [document.documentElement.scrollWidth, document.documentElement.clientWidth], dashboardNodes: document.querySelector('#dashboard').querySelectorAll('*').length, snapshotNodes: document.querySelector('#snapshot-region').querySelectorAll('*').length, footerCount: document.querySelectorAll('[data-simplyvibe-release]').length, footerVisible: rect.width > 0 && rect.height > 0, footerBounds: { left: rect.left, right: rect.right }, footerText: footer.innerText, longTasks: window.__long || [], divisionRange: document.querySelector('[data-page-key="division"] .detail-range')?.textContent };
  });
  result.scenarios.push({ name: spec.name, initialCalls: initial, draftDelta: before - initial, applyCalls: applied.map(call => call.key), applyBodies: applied.map(call => call.body), decodedBytes: applied.reduce((total, call) => total + call.bytes, 0), peak: x.peak(), pageNavigationApiDelta: x.calls.length - beforePage, metrics, errors: x.errors });
  await x.context.close();
}

{
  const x = await open({ viewport: { width: 1440, height: 900 }, dir: 'rtl' }), base = x.calls.length;
  await x.frame.evaluate(() => { for (let i = 0; i < 10; i++) document.querySelector('#snapshot-refresh').click(); }); await x.page.waitForTimeout(900);
  result.scenarios.push({ name: 'snapshot-refresh-burst', calls: x.calls.slice(base).map(call => call.key), peak: x.peak(), errors: x.errors }); await x.context.close();
}

{
  const x = await open({ viewport: { width: 1440, height: 900 }, dir: 'rtl' }); x.set401(true); const base = x.calls.length;
  await x.frame.locator('#snapshot-refresh').click(); await x.page.waitForTimeout(600); const afterFailure = x.calls.length;
  await x.frame.evaluate(() => { const refresh = document.querySelector('#snapshot-refresh'); for (let i = 0; i < 10; i++) refresh.click(); }); await x.page.waitForTimeout(300);
  result.scenarios.push({ name: 'terminal-401', failureCalls: x.calls.slice(base, afterFailure).map(call => ({ key: call.key, status: call.status })), postTerminalCallDelta: x.calls.length - afterFailure, refreshDisabled: await x.frame.locator('#snapshot-refresh').isDisabled(), retryCount: await x.frame.locator('[data-snapshot-retry]').count(), statusText: await x.frame.locator('#snapshot-status').innerText(), errors: x.errors }); await x.context.close();
}

{
  const x = await open({ viewport: { width: 320, height: 844 }, dir: 'rtl' });
  const footer = await x.frame.locator('[data-simplyvibe-release]').evaluate(element => { const rect = element.getBoundingClientRect(); return { left: rect.left, right: rect.right, width: rect.width, innerWidth, scrollWidth: document.documentElement.scrollWidth, text: element.innerText, visible: rect.width > 0 && rect.height > 0 }; });
  result.scenarios.push({ name: 'footer-320-rtl', footer, errors: x.errors }); await x.context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } }), page = await context.newPage(), api = [];
  page.on('request', request => { if (request.url().includes('api.ylm.co.il')) api.push(request.url()); });
  await page.goto(preview, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(800);
  result.scenarios.push({ name: 'no-context', apiCalls: api.length, footer: await page.locator('[data-simplyvibe-release]').innerText(), count: await page.locator('[data-simplyvibe-release]').count() }); await context.close();
}

result.executables = [...new Set(result.executables)]; result.unexpected = [...new Set(result.unexpected)];
await browser.close(); await fs.writeFile(new URL('observations.json', evidence), JSON.stringify(result, null, 2)); console.log(JSON.stringify(result, null, 2));
