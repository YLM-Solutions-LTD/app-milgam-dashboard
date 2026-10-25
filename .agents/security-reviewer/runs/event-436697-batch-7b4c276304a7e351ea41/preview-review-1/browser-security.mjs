import { chromium } from '/workspace/src/apps/milgam-dashboard/.agents/uat-tester/tmp/playwright/node_modules/playwright-core/index.mjs';

const preview = 'https://275c4e6f.app-milgam-dashboard.pages.dev';
const token = 'synthetic-preview-token';
const browser = await chromium.launch({ executablePath: '/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell', headless: true });
const results = {};

async function makeContext() {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    globalThis.__hostCalls = [];
    globalThis.SimplyVibeHostAdapter = {
      ready: async () => globalThis.__hostCalls.push(['ready']),
      executeCommand: async (name, payload) => globalThis.__hostCalls.push(['executeCommand', name, payload]),
      ToDisplayDate: value => `display:${value}`
    };
  });
  return context;
}

function responseFor(url) {
  if (url.includes('MilgamDashboardCurrentEvents')) return { Items: [
    { ScopeKey: 'overall', TotalCount: 12, OpenCount: 4, AsOf: '2026-10-25' },
    { ScopeKey: 'headquarters', TotalCount: 5, OpenCount: 2, AsOf: '2026-10-25' },
    { ScopeKey: 'branches', TotalCount: 7, OpenCount: 2, AsOf: '2026-10-25' }
  ], TotalCount: 3 };
  if (url.includes('MilgamDashboardCurrentPermits')) return { Items: [{ ValidCount: 8, MissingCount: 2, OverdueCount: 1, AsOf: '2026-10-25', ValueDate: '2026-10-25' }], TotalCount: 1 };
  if (url.includes('MilgamDashboardCurrentEquipment')) return { Items: [{ EquipmentId: 'eq-1' }, { EquipmentId: 'eq-2' }], TotalCount: 2 };
  return { Items: [], TotalCount: 0 };
}

async function approved() {
  const context = await makeContext();
  const apiRequests = [];
  const executableRequests = [];
  const consoleValues = [];
  await context.route('https://api.ylm.co.il/**', async route => {
    const req = route.request();
    apiRequests.push({ url: req.url(), method: req.method(), auth: req.headers().authorization ?? null, body: req.postData() });
    const analyticalFailure = req.url().includes('MilgamDashboardByMonth');
    await route.fulfill({ status: analyticalFailure ? 500 : 200, contentType: 'application/json', body: JSON.stringify(analyticalFailure ? { personName: 'SYNTHETIC PRIVATE PERSON', internalRecord: 'SYNTHETIC-991' } : responseFor(req.url())) });
  });
  await context.route('https://mnt.ylm.co.il/harness', route => route.fulfill({ contentType: 'text/html', body: `<iframe id="app" src="${preview}"></iframe>` }));
  const page = await context.newPage();
  page.on('request', req => { if (req.resourceType() === 'script') executableRequests.push(req.url()); });
  page.on('console', async msg => consoleValues.push(await Promise.all(msg.args().map(arg => arg.jsonValue().catch(() => '<unavailable>')))));
  await page.goto('https://mnt.ylm.co.il/harness');
  const frame = page.frames().find(item => item.url().startsWith(preview));
  await frame.waitForLoadState('domcontentloaded');
  await page.evaluate(({ preview, token }) => document.querySelector('#app').contentWindow.postMessage({ ApiAddress: 'https://api.ylm.co.il', Token: { token_type: 'Bearer', access_token: token }, LanguageCode: 'he' }, preview), { preview, token });
  await frame.waitForTimeout(900);
  const permit = frame.locator('[data-permit]').first();
  if (await permit.count()) await permit.click();
  await frame.waitForTimeout(100);
  results.approved = {
    apiRequests,
    tokenOnlyInAuthorization: apiRequests.every(req => req.auth === `Bearer ${token}` && !req.url.includes(token) && !String(req.body).includes(token)),
    executableRequests,
    thirdPartyExecutableRequests: executableRequests.filter(url => new URL(url).origin !== new URL(preview).origin),
    syntheticPrivateBodyObservedInConsole: JSON.stringify(consoleValues).includes('SYNTHETIC PRIVATE PERSON'),
    matchingConsoleEntries: consoleValues.filter(entry => JSON.stringify(entry).includes('SYNTHETIC PRIVATE PERSON')),
    hostCalls: await frame.evaluate(() => globalThis.__hostCalls),
    connection: await frame.locator('#connection-status').innerText(),
    snapshot: await frame.locator('#snapshot-region').innerText()
  };
  await context.close();
}

async function direct() {
  const context = await makeContext();
  const apiRequests = [];
  await context.route('https://api.ylm.co.il/**', route => { apiRequests.push(route.request().url()); return route.abort(); });
  const page = await context.newPage();
  await page.goto(preview);
  await page.evaluate(token => window.postMessage({ ApiAddress: 'https://api.ylm.co.il', Token: { access_token: token } }, location.origin), 'synthetic-forged-token');
  await page.waitForTimeout(500);
  results.direct = { apiRequests, hostCalls: await page.evaluate(() => globalThis.__hostCalls), connection: await page.locator('#connection-status').innerText() };
  await context.close();
}

await approved();
await direct();
console.log(JSON.stringify(results, null, 2));
await browser.close();
