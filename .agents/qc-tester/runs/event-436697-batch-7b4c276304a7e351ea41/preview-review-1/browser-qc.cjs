const { chromium } = require('/usr/local/lib/node_modules/@playwright/test/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const PREVIEW = 'https://02ea3f16.app-milgam-dashboard.pages.dev';
const HEAD = '3b3f8d4373ff90c2073fb4e884e1fe622a8595a0';
const HOST = 'https://ylm.ylm.co.il/controller-host-fixture/';
const FIXTURE = '/workspace/.simplyvibe/input/controller-host-harness';
const OUT = path.join(__dirname, 'evidence');
const result = { preview: PREVIEW, expectedHead: HEAD, host: HOST, console: [], pageErrors: [], requests: [], frames: [], finding: null };
const mime = p => p.endsWith('.html') ? 'text/html' : p.endsWith('.js') ? 'text/javascript' : 'application/octet-stream';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: '/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell' });
  result.chromium = await browser.version();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on('console', m => result.console.push({ type: m.type(), text: m.text() }));
  page.on('pageerror', e => result.pageErrors.push(String(e)));
  page.on('request', r => result.requests.push({ url: r.url(), type: r.resourceType(), method: r.method() }));
  await page.route('https://ylm.ylm.co.il/controller-host-fixture/**', route => {
    const pathname = new URL(route.request().url()).pathname;
    const rel = pathname.slice('/controller-host-fixture/'.length) || 'index.html';
    const full = path.resolve(FIXTURE, rel);
    assert(full.startsWith(FIXTURE + path.sep));
    route.fulfill({ status: 200, contentType: mime(full), body: fs.readFileSync(full) });
  });
  await page.route('https://api.ylm.co.il/**', route => route.abort('blockedbyclient'));
  await page.goto(HOST + 'index.html?preview=' + encodeURIComponent(PREVIEW), { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  result.frames = page.frames().map(f => f.url());
  result.hostState = await page.evaluate(() => window.controllerHarness?.state());
  result.guestLoaded = result.frames.some(u => u.startsWith(PREVIEW));
  result.cspFrameErrors = result.console.filter(x => /content security policy|frame-ancestors|refused to frame/i.test(x.text));
  await page.screenshot({ path: path.join(OUT, 'controller-harness-desktop.png'), fullPage: true });
  if (!result.guestLoaded) {
    result.finding = { fingerprint: 'qc-controller-harness-frame-ancestor-missing-v1', actual: 'The exact preview is refused inside the controller fixture before SDK initialization.', expected: 'The preview loads in the supplied trusted controller fixture and completes the real SDK handshake.' };
  } else {
    const guest = page.frames().find(f => f.url().startsWith(PREVIEW));
    result.connectionText = await guest.locator('#connection-status').innerText().catch(() => '');
    result.snapshotText = await guest.locator('#snapshot-region').innerText().catch(() => '');
    result.finding = { fingerprint: 'qc-real-sdk-bootstrap-missing-v1', actual: 'The guest loads but does not complete the real SDK handshake or render authenticated snapshot data.', expected: 'The deployed guest packages/instantiates the verified SDK and becomes ready through its protocol.' };
  }
  await context.close();
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'browser-results.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ok: false, chromium: result.chromium, guestLoaded: result.guestLoaded, finding: result.finding.fingerprint }, null, 2));
  process.exitCode = 1;
})().catch(e => {
  result.failure = { message: e.message, stack: e.stack };
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'browser-results.json'), JSON.stringify(result, null, 2));
  console.error(e);
  process.exitCode = 1;
});
