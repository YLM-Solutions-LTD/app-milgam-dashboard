import { chromium } from '../../../tmp/node_modules/playwright-core/index.mjs';

const preview = 'https://c9756759.app-milgam-dashboard.pages.dev';
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

async function approved() {
  const context = await makeContext();
  const apiRequests = [];
  const executableRequests = [];
  await context.route('https://api.ylm.co.il/**', async route => {
    const req = route.request();
    apiRequests.push({ url: req.url(), method: req.method(), auth: req.headers().authorization ?? null, body: req.postData() });
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ Items: [{ Year: 2026, Month: 10, TotalCount: 2 }], TotalCount: 1 }) });
  });
  await context.route('https://mnt.ylm.co.il/harness', route => route.fulfill({ contentType: 'text/html', body: `<iframe id="app" src="${preview}"></iframe>` }));
  const page = await context.newPage();
  page.on('request', req => { if (req.resourceType() === 'script') executableRequests.push(req.url()); });
  await page.goto('https://mnt.ylm.co.il/harness');
  const frame = page.frames().find(item => item.url().startsWith(preview));
  await frame.waitForLoadState('domcontentloaded');
  await page.evaluate(() => document.querySelector('#app').contentWindow.postMessage({
    ApiAddress: 'https://api.ylm.co.il',
    Token: { token_type: 'Bearer', access_token: 'synthetic-preview-token' },
    LanguageCode: 'he'
  }, 'https://c9756759.app-milgam-dashboard.pages.dev'));
  await frame.waitForTimeout(800);
  results.approved = {
    apiRequests,
    executableRequests,
    thirdPartyExecutableRequests: executableRequests.filter(url => new URL(url).origin !== new URL(preview).origin),
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
  await page.evaluate(() => window.postMessage({ ApiAddress: 'https://api.ylm.co.il', Token: { access_token: 'synthetic-forged-token' } }, location.origin));
  await page.waitForTimeout(500);
  results.direct = { apiRequests, hostCalls: await page.evaluate(() => globalThis.__hostCalls), connection: await page.locator('#connection-status').innerText() };
  await context.close();
}

await approved();
await direct();
console.log(JSON.stringify(results, null, 2));
await browser.close();
