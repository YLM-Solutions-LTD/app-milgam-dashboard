import playwright from 'file:///workspace/src/apps/milgam-dashboard/.agents/uat-tester/tmp/node_modules/playwright-core/index.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const preview = 'https://8248a782.app-milgam-dashboard.pages.dev';
const head = '1c5ebdae74cb6a1fae0f818b9f44997e43b8245c';
const fixtureRoot = '/workspace/.simplyvibe/input/controller-host-harness';
const out = new URL('./evidence/', import.meta.url);
await fs.mkdir(out, { recursive: true });
const browser = await playwright.chromium.launch({ executablePath: '/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell', headless: true, args: ['--no-sandbox'] });
const result = { preview, head, browser: await browser.version(), node: process.version, fixture: 'controller-owned GuestBridge + deployed packaged guest SDK', scenarios: [], executableRequests: [], blockedRequests: [] };
const equipment = Array.from({ length: 10000 }, (_, i) => ({ EquipmentId: i + 1, IsActive: i % 2 === 0, LastTreatmentDate: null, AsOf: '2026-10-26T09:00:00' }));
const fixtures = {
  MilgamDashboardCurrentEvents: { Items: [{ ScopeKey: 'overall', TotalCount: ' 12 ', OpenCount: '5', AsOf: '2026-10-26T09:00:00' }, { ScopeKey: 'headquarters', TotalCount: '4', OpenCount: '2', AsOf: '2026-10-26T09:00:00' }, { ScopeKey: 'branches', TotalCount: '8', OpenCount: '3', AsOf: '2026-10-26T09:00:00' }], TotalCount: 3 },
  MilgamDashboardCurrentPermits: { Items: [{ ValidCount: '7', MissingCount: '2', OverdueCount: '1', AsOf: '2026-10-26T09:00:00', ValueDate: '2026-10-26' }], TotalCount: 1 },
  MilgamDashboardCurrentEquipment: { Items: equipment, TotalCount: 10000 },
  MilgamDashboardByMonth: { Items: [], TotalCount: 0 },
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
    try { let body = await fs.readFile(path.join(fixtureRoot, rel)); if (rel === 'host-fixture.js' && direction === 'ltr') body = Buffer.from(body.toString().replace('LanguageDirection: "rtl"', 'LanguageDirection: "ltr"').replace('LanguageCode: "he"', 'LanguageCode: "en"')); await route.fulfill({ status: 200, contentType: rel.endsWith('.js') ? 'text/javascript' : rel.endsWith('.json') ? 'application/json' : 'text/html', body }); } catch { await route.fulfill({ status: 404, body: 'not found' }); }
  });
  await page.route('https://api.ylm.co.il/**', async route => {
    const req = route.request(), key = keyFor(req.url()), response = fixtures[key], body = JSON.stringify(response || {});
    calls.push({ key, method: req.method(), body: req.postData(), t: performance.now(), bytes: Buffer.byteLength(body) });
    if (!key) return route.abort();
    if (key.startsWith('MilgamDashboardCurrent') && currentFailure) { const status = currentFailure; currentFailure = null; return route.fulfill({ status, contentType: 'application/json', body: '{"private":"DO-NOT-LOG","message":"synthetic denied"}' }); }
    await route.fulfill({ status: 200, contentType: 'application/json', body });
  });
  await page.route('**/*', async route => { const u = route.request().url(); if (u.startsWith(preview) || u.startsWith('https://milgam.ylm.co.il/controller-host-fixture/') || u.startsWith('https://api.ylm.co.il/')) return route.fallback(); result.blockedRequests.push(u); return route.abort(); });
  await page.goto(`https://milgam.ylm.co.il/controller-host-fixture/index.html?preview=${encodeURIComponent(preview)}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const frame = page.frames().find(f => f.url().startsWith(preview));
  if (!frame) throw Error('preview iframe missing');
  await frame.locator('#from-date').waitFor({ timeout: 20000 });
  await frame.locator('[data-permit]').first().waitFor({ timeout: 20000 });
  return { context, page, frame, calls, errors, failCurrent: status => { currentFailure = status; } };
}

for (const spec of [{ name: 'desktop-rtl', viewport: { width: 1440, height: 900 }, direction: 'rtl' }, { name: 'phone-rtl', viewport: { width: 390, height: 844 }, direction: 'rtl' }, { name: 'desktop-ltr', viewport: { width: 1440, height: 900 }, direction: 'ltr' }, { name: 'phone-ltr', viewport: { width: 390, height: 844 }, direction: 'ltr' }]) {
  const x = await session(spec); const footer = x.frame.locator('[data-simplyvibe-release]');
  const before = x.calls.length; for (let i = 0; i < 10; i++) await x.frame.locator('#from-date').fill(`202${i % 6}-01-01`); await x.frame.waitForTimeout(100);
  const draftCalls = x.calls.length - before;
  await x.frame.locator('#from-date').fill('2025-12-31'); await x.frame.locator('#to-date').fill('2026-01-01'); const applyStart = x.calls.length; await x.frame.locator('#apply-range').click(); await x.frame.waitForTimeout(400);
  const applied = x.calls.slice(applyStart), analytical = applied.filter(c => ['MilgamDashboardByDivision','MilgamDashboardSummary','MilgamDashboardByCategory','MilgamDashboardClosureByCategory'].includes(c.key)), current = applied.filter(c => c.key?.startsWith('MilgamDashboardCurrent'));
  const state = await x.frame.evaluate(() => ({ dir: document.documentElement.dir, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, footerCount: document.querySelectorAll('[data-simplyvibe-release]').length, footerVisible: !!document.querySelector('[data-simplyvibe-release]')?.getClientRects().length, footerText: document.querySelector('[data-simplyvibe-release]')?.innerText, labels: [...document.querySelectorAll('[data-release-label]')].map(n => n.textContent), values: [...document.querySelectorAll('[data-release-value]')].map(n => n.textContent), snapshotText: document.querySelector('#snapshot-content')?.innerText, snapshotNodes: document.querySelector('#snapshot-region')?.querySelectorAll('*').length, dashboardNodes: document.querySelector('#dashboard')?.querySelectorAll('*').length }));
  result.scenarios.push({ name: spec.name, viewport: spec.viewport, draftCalls, applyAnalyticalCalls: analytical.length, applySnapshotCalls: current.length, analyticalBodies: analytical.map(c => JSON.parse(c.body)), state, errors: x.errors });
  await x.page.screenshot({ path: new URL(`${spec.name}.png`, out).pathname, fullPage: true }); await x.context.close();
}

{
  const x = await session(); const before = x.calls.length; await x.frame.locator('#from-date').fill('2026-02-02'); await x.frame.locator('#to-date').fill('2026-02-01'); await x.frame.locator('#apply-range').click(); await x.frame.waitForTimeout(100);
  result.scenarios.push({ name: 'invalid-reversed', newCalls: x.calls.length - before, ariaInvalid: await x.frame.locator('#from-date').getAttribute('aria-invalid'), error: await x.frame.locator('#range-error').innerText(), focused: await x.frame.evaluate(() => document.activeElement?.id), errors: x.errors }); await x.context.close();
}
{
  const x = await session(); await x.page.evaluate(() => controllerHarness.holdCommand()); await x.frame.locator('[data-permit]').first().click(); await x.frame.waitForTimeout(80); await x.page.evaluate(() => controllerHarness.revoke()); await x.page.evaluate(() => controllerHarness.releaseCommand()); await x.frame.waitForTimeout(180); const afterOld = await x.page.evaluate(() => controllerHarness.state()); await x.page.evaluate(() => controllerHarness.reenter()); await x.page.waitForTimeout(500); const fresh = x.page.frames().find(f => f.url().startsWith(preview)); await fresh.locator('[data-permit]').first().click(); await fresh.waitForTimeout(200);
  result.scenarios.push({ name: 'navigate-revoke-reentry', afterOld, afterFresh: await x.page.evaluate(() => controllerHarness.state()), hash: await x.page.evaluate(() => location.hash), errors: x.errors }); await x.context.close();
}
{
  const x = await session(); const before = await x.frame.locator('#snapshot-content').innerText(); x.failCurrent(401); await x.frame.locator('#snapshot-refresh').click(); await x.frame.waitForTimeout(500); const callsAt401 = x.calls.length; const retry = x.frame.locator('[data-snapshot-retry]'); if (await retry.count()) await retry.click(); await x.frame.waitForTimeout(150);
  result.scenarios.push({ name: 'terminal-401', retained: (await x.frame.locator('#snapshot-content').innerText()).includes('12') && before.includes('12'), oldGenerationCalls: x.calls.length - callsAt401, refreshDisabled: await x.frame.locator('#snapshot-refresh').isDisabled(), retryButtons: await x.frame.locator('[data-snapshot-retry]').count(), statusText: await x.frame.locator('#snapshot-status').innerText(), markerLeaked: (await x.frame.locator('body').innerText()).includes('DO-NOT-LOG') || x.errors.some(e => e.includes('DO-NOT-LOG')), errors: x.errors }); await x.context.close();
}
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } }); const page = await context.newPage(); const api = []; page.on('request', r => { if (r.url().includes('api.ylm.co.il')) api.push(r.url()); }); await page.goto(preview, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(800); const footer = await page.locator('[data-simplyvibe-release]').evaluate(el => ({ count: document.querySelectorAll('[data-simplyvibe-release]').length, visible: !!el.getClientRects().length, text: el.innerText })); result.scenarios.push({ name: 'direct-no-context', apiRequests: api.length, footer }); await context.close();
}
const requestContext = await browser.newContext(); const response = await requestContext.request.get(preview); result.headers = { csp: response.headers()['content-security-policy'] || null }; await requestContext.close();
result.executableRequests = [...new Set(result.executableRequests)]; result.blockedRequests = [...new Set(result.blockedRequests)];
await browser.close(); await fs.writeFile(new URL('observations.json', out), JSON.stringify(result, null, 2)); console.log(JSON.stringify(result, null, 2));
