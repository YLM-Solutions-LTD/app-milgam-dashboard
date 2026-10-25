import playwright from '../../../tmp/playwright/node_modules/playwright-core/index.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const preview = 'https://ea51f277.app-milgam-dashboard.pages.dev';
const head = '8f1e577bbcb4670878dec24ff570c1382a18d170';
const fixtureRoot = '/workspace/.simplyvibe/input/controller-host-harness';
const out = new URL('./evidence/', import.meta.url);
await fs.mkdir(out, { recursive: true });
const browser = await playwright.chromium.launch({ executablePath: '/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell', headless: true, args: ['--no-sandbox'] });
const result = { preview, head, browser: await browser.version(), node: process.version, fixture: 'controller-owned GuestBridge + packaged guest SDK', scenarios: [], executableRequests: [], abortedRequests: [] };
const equipment = Array.from({ length: 10000 }, (_, i) => ({ EquipmentId: i + 1, IsActive: i % 2 === 0, LastTreatmentDate: null, AsOf: '2026-10-25T09:00:00' }));
const fixtures = {
  MilgamDashboardCurrentEvents: { Items: [{ ScopeKey: 'overall', TotalCount: 12, OpenCount: 5, AsOf: '2026-10-25T09:00:00' }, { ScopeKey: 'headquarters', TotalCount: 4, OpenCount: 2, AsOf: '2026-10-25T09:00:00' }, { ScopeKey: 'branches', TotalCount: 8, OpenCount: 3, AsOf: '2026-10-25T09:00:00' }], TotalCount: 3 },
  MilgamDashboardCurrentPermits: { Items: [{ ValidCount: 7, MissingCount: 2, OverdueCount: 1, AsOf: '2026-10-25T09:00:00', ValueDate: '2026-10-25' }], TotalCount: 1 },
  MilgamDashboardCurrentEquipment: { Items: equipment, TotalCount: 10000 },
  MilgamDashboardByMonth: { Items: [{ Year: 2026, Month: 9, Label: '9/26', EventCount: 10 }, { Year: 2026, Month: 10, Label: '10/26', EventCount: 10 }], TotalCount: 2 },
  MilgamDashboardByDivision: { Items: [{ DivisionName: 'General', EventCount: 10 }], TotalCount: 1 },
  MilgamDashboardSummary: { Items: [{ ScopeKey: 'headquarters', ScopeLabel: 'מטה', ScopeOrder: 1, EventCount: 4, ClosedCount: 2, EligibleDurationCount: 2, InvalidDurationCount: 0, AverageCloseDays: 1 }, { ScopeKey: 'branches', ScopeLabel: 'סניפים', ScopeOrder: 2, EventCount: 6, ClosedCount: 3, EligibleDurationCount: 3, InvalidDurationCount: 0, AverageCloseDays: 1 }], TotalCount: 2 },
  MilgamDashboardByCategory: { Items: [{ ScopeKey: 'headquarters', ScopeLabel: 'מטה', ScopeOrder: 1, CategoryName: 'General', EventCount: 4 }, { ScopeKey: 'branches', ScopeLabel: 'סניפים', ScopeOrder: 2, CategoryName: 'General', EventCount: 6 }], TotalCount: 2 },
  MilgamDashboardClosureByCategory: { Items: [{ ScopeKey: 'headquarters', ScopeLabel: 'מטה', ScopeOrder: 1, CategoryName: 'General', ClosedCount: 2, EligibleDurationCount: 2, InvalidDurationCount: 0, AverageCloseDays: 1 }, { ScopeKey: 'branches', ScopeLabel: 'סניפים', ScopeOrder: 2, CategoryName: 'General', ClosedCount: 3, EligibleDurationCount: 3, InvalidDurationCount: 0, AverageCloseDays: 1 }], TotalCount: 2 }
};
const keyFor = u => Object.keys(fixtures).find(k => u.includes(`/api/Entity/${k}/Search`));
async function session({ viewport = { width: 1440, height: 900 }, direction = 'rtl' } = {}) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage(); const calls = [], errors = []; let currentFailure = null;
  page.on('pageerror', e => errors.push(`pageerror:${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`console:${m.text()}`); });
  page.on('request', r => { if (['script', 'worker'].includes(r.resourceType())) result.executableRequests.push(r.url()); });
  await page.route('https://milgam.ylm.co.il/controller-host-fixture/**', async route => {
    const rel = new URL(route.request().url()).pathname.replace('/controller-host-fixture/', '') || 'index.html';
    const file = path.join(fixtureRoot, rel);
    try { let body = await fs.readFile(file); if (rel === 'host-fixture.js' && direction === 'ltr') body = Buffer.from(body.toString().replace('LanguageDirection: "rtl"', 'LanguageDirection: "ltr"').replace('LanguageCode: "he"', 'LanguageCode: "en"')); await route.fulfill({ status: 200, contentType: rel.endsWith('.js') ? 'text/javascript' : rel.endsWith('.json') ? 'application/json' : 'text/html', body }); } catch { await route.fulfill({ status: 404, body: 'not found' }); }
  });
  await page.route('https://api.ylm.co.il/**', async route => {
    const req = route.request(), key = keyFor(req.url()), body = JSON.stringify(fixtures[key] || {});
    calls.push({ key, url: req.url(), method: req.method(), body: req.postData(), t: performance.now(), bytes: Buffer.byteLength(body) });
    if (!key) return route.abort();
    if (key.startsWith('MilgamDashboardCurrent') && currentFailure) { const status = currentFailure; currentFailure = null; return route.fulfill({ status, contentType: 'application/json', body: '{"private":"DO-NOT-LOG","message":"synthetic denied"}' }); }
    await route.fulfill({ status: 200, contentType: 'application/json', body });
  });
  await page.route('**/*', async route => { const u = route.request().url(); if (u.startsWith(preview) || u.startsWith('https://milgam.ylm.co.il/controller-host-fixture/') || u.startsWith('https://api.ylm.co.il/')) return route.fallback(); result.abortedRequests.push(u); return route.abort(); });
  await page.goto(`https://milgam.ylm.co.il/controller-host-fixture/index.html?preview=${encodeURIComponent(preview)}`, { waitUntil: 'domcontentloaded' });
  const frame = await waitReady(page);
  return { context, page, frame, calls, errors, failNextCurrent: status => { currentFailure = status; } };
}
async function waitReady(page) { await page.waitForTimeout(350); const frame = page.frames().find(f => f.url().startsWith(preview)); if (!frame) throw Error('preview iframe missing'); await frame.locator('#snapshot-region').waitFor({ timeout: 20000 }); await frame.locator('[data-permit]').first().waitFor({ timeout: 20000 }); return frame; }

for (const spec of [{ name: 'desktop-rtl', viewport: { width: 1440, height: 900 }, direction: 'rtl' }, { name: 'phone-rtl', viewport: { width: 390, height: 844 }, direction: 'rtl' }, { name: 'desktop-ltr', viewport: { width: 1440, height: 900 }, direction: 'ltr' }, { name: 'phone-ltr', viewport: { width: 390, height: 844 }, direction: 'ltr' }]) {
  const x = await session(spec); const current = x.calls.filter(c => c.key?.startsWith('MilgamDashboardCurrent')); const before = await x.frame.locator('#snapshot-content').innerText(); const beforeCount = current.length;
  await x.frame.locator('#month-select').selectOption('9'); await x.frame.waitForTimeout(150);
  const geometry = await x.frame.evaluate(() => ({ dir: document.documentElement.dir, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, snapshotNodes: document.querySelector('#snapshot-region').querySelectorAll('*').length, inlineStyles: document.querySelectorAll('[style]').length, charts: document.querySelectorAll('svg').length }));
  result.scenarios.push({ name: spec.name, viewport: spec.viewport, calls: current.length, exactTransport: current.every(c => c.method === 'POST' && c.body === '{}'), startSpreadMs: Math.max(...current.map(c => c.t)) - Math.min(...current.map(c => c.t)), decodedBytes: current.reduce((n, c) => n + c.bytes, 0), analyticalDateAddedCurrentCalls: x.calls.filter(c => c.key?.startsWith('MilgamDashboardCurrent')).length - beforeCount, snapshotRetained: before === await x.frame.locator('#snapshot-content').innerText(), geometry, errors: x.errors });
  await x.page.screenshot({ path: new URL(`${spec.name}.png`, out).pathname, fullPage: true }); await x.context.close();
}

{
  const x = await session(); await x.page.evaluate(() => controllerHarness.holdCommand()); await x.frame.evaluate(() => { const buttons = [...document.querySelectorAll('[data-permit]')]; for (let i = 0; i < 20; i++) buttons[i % buttons.length].dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await x.frame.waitForTimeout(100); const whilePending = await x.page.evaluate(() => controllerHarness.state()); await x.page.evaluate(() => controllerHarness.releaseCommand()); await x.frame.waitForTimeout(250);
  result.scenarios.push({ name: 'permit-burst', whilePending, harness: await x.page.evaluate(() => controllerHarness.state()), hash: await x.page.evaluate(() => location.hash), errors: x.errors }); await x.context.close();
}
{
  const x = await session(); await x.page.evaluate(() => controllerHarness.holdCommand()); await x.frame.locator('[data-permit]').first().click(); await x.frame.waitForTimeout(80); await x.page.evaluate(() => controllerHarness.revoke()); await x.page.evaluate(() => controllerHarness.releaseCommand()); await x.frame.waitForTimeout(180); const afterOld = await x.page.evaluate(() => controllerHarness.state());
  await x.page.evaluate(() => controllerHarness.reenter()); const fresh = await waitReady(x.page); await fresh.locator('[data-permit]').first().click(); await fresh.waitForTimeout(250);
  result.scenarios.push({ name: 'command-revoke-reentry', afterOld, afterFresh: await x.page.evaluate(() => controllerHarness.state()), hash: await x.page.evaluate(() => location.hash), errors: x.errors }); await x.context.close();
}
{
  const x = await session(); const before = await x.frame.locator('#snapshot-content').innerText(); x.failNextCurrent(401); await x.frame.locator('#snapshot-refresh').click(); await x.frame.waitForTimeout(600); const afterExpiry = await x.page.evaluate(() => controllerHarness.state()); const afterText = await x.frame.locator('#snapshot-content').innerText(); const callsAfter401 = x.calls.filter(c => c.key?.startsWith('MilgamDashboardCurrent')).length; await x.frame.locator('#snapshot-refresh').click({ force: true }); await x.frame.waitForTimeout(250); const deniedOldGenerationCalls = x.calls.filter(c => c.key?.startsWith('MilgamDashboardCurrent')).length - callsAfter401;
  await x.page.evaluate(() => controllerHarness.reenter()); const fresh = await waitReady(x.page); const n = x.calls.length; await fresh.locator('#snapshot-refresh').click(); await fresh.waitForTimeout(600);
  result.scenarios.push({ name: 'api-expiry-reentry', beforeText: before, after401Text: afterText, retainedAfter401: afterText === before || afterText.includes('12'), afterExpiry, deniedOldGenerationCalls, freshCurrentCalls: x.calls.slice(n).filter(c => c.key?.startsWith('MilgamDashboardCurrent')).length, markerLeaked: x.errors.some(e => e.includes('DO-NOT-LOG') || e.includes('synthetic denied')), finalHarness: await x.page.evaluate(() => controllerHarness.state()), errors: x.errors }); await x.context.close();
}
{
  const x = await session(); const before = await x.frame.locator('#snapshot-content').innerText(); x.failNextCurrent(500); await x.frame.locator('#snapshot-refresh').click(); await x.frame.waitForTimeout(500); const staleText = await x.frame.locator('#snapshot-content').innerText(); await x.frame.locator('#snapshot-refresh').click(); await x.frame.waitForTimeout(500); const retryText = await x.frame.locator('#snapshot-content').innerText(); result.scenarios.push({ name: 'stale-retry', retainedOn500: staleText === before, recoveredOnRetry: retryText === before, errors: x.errors }); await x.context.close();
}
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } }); const page = await context.newPage(); const api = []; page.on('request', r => { if (r.url().includes('api.ylm.co.il')) api.push(r.url()); }); await page.goto(preview, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(3300); result.scenarios.push({ name: 'direct-entry', apiRequests: api.length }); await context.close();
}
const response = await (await browser.newContext()).request.get(preview); result.headers = { csp: response.headers()['content-security-policy'] || null };
result.executableRequests = [...new Set(result.executableRequests)]; result.abortedRequests = [...new Set(result.abortedRequests)];
await browser.close(); await fs.writeFile(new URL('observations.json', out), JSON.stringify(result, null, 2)); console.log(JSON.stringify(result, null, 2));
