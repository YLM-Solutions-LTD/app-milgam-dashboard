import playwright from '/usr/local/lib/node_modules/@playwright/test/node_modules/playwright/index.js';
import fs from 'node:fs';
import path from 'node:path';

const { chromium } = playwright;
const preview = 'https://8248a782.app-milgam-dashboard.pages.dev';
const expectedVersion = '1c5ebdae74cb';
const fixtureOrigin = 'https://milgam.ylm.co.il';
const fixtureRoot = '/workspace/.simplyvibe/input/controller-host-harness';
const out = '/workspace/src/apps/milgam-dashboard/.agents/ui-designer/runs/event-436697-batch-b48436fc6cafd492b70f/preview-review-1/evidence';

const fixtures = {
  MilgamDashboardByMonth: { Items: [{ Year: 2026, Month: 10, Label: '10/26', EventCount: 12 }], TotalCount: 1 },
  MilgamDashboardByDivision: { Items: [{ DivisionName: 'מטה', EventCount: 5 }, { DivisionName: 'סניפים', EventCount: 7 }], TotalCount: 2 },
  MilgamDashboardSummary: { Items: [{ ScopeKey: 'headquarters', ScopeLabel: 'מטה', ScopeOrder: 1, EventCount: 5, ClosedCount: 4, EligibleDurationCount: 4, InvalidDurationCount: 0, AverageCloseDays: 2 }, { ScopeKey: 'branches', ScopeLabel: 'סניפים', ScopeOrder: 2, EventCount: 7, ClosedCount: 6, EligibleDurationCount: 6, InvalidDurationCount: 0, AverageCloseDays: 3 }], TotalCount: 2 },
  MilgamDashboardByCategory: { Items: [{ ScopeKey: 'headquarters', ScopeLabel: 'מטה', ScopeOrder: 1, CategoryName: 'אחזקה', EventCount: 5 }, { ScopeKey: 'branches', ScopeLabel: 'סניפים', ScopeOrder: 2, CategoryName: 'ניקיון', EventCount: 7 }], TotalCount: 2 },
  MilgamDashboardClosureByCategory: { Items: [{ ScopeKey: 'headquarters', ScopeLabel: 'מטה', ScopeOrder: 1, CategoryName: 'אחזקה', ClosedCount: 4, EligibleDurationCount: 4, InvalidDurationCount: 0, AverageCloseDays: 2 }, { ScopeKey: 'branches', ScopeLabel: 'סניפים', ScopeOrder: 2, CategoryName: 'ניקיון', ClosedCount: 6, EligibleDurationCount: 6, InvalidDurationCount: 0, AverageCloseDays: 3 }], TotalCount: 2 },
  MilgamDashboardCurrentEvents: { Items: [{ ScopeKey: 'overall', TotalCount: '12', OpenCount: '2', AsOf: '2026-10-26T08:00:00' }, { ScopeKey: 'headquarters', TotalCount: '5', OpenCount: '1', AsOf: '2026-10-26T08:00:00' }, { ScopeKey: 'branches', TotalCount: '7', OpenCount: '1', AsOf: '2026-10-26T08:00:00' }], TotalCount: 3 },
  MilgamDashboardCurrentPermits: { Items: [{ ValidCount: '9', MissingCount: '2', OverdueCount: '1', AsOf: '2026-10-26T08:00:00', ValueDate: '2026-10-26' }], TotalCount: 1 },
  MilgamDashboardCurrentEquipment: { Items: [{ EquipmentId: 1, LocationEntityId: 1, LocationEntityType: 1, LocationPath: '1,1', EquipmentTypeId: 1, IsActive: true, TreatmentDaysInterval: null, NextTreatmentDate: null, LastTreatmentEventId: null, LastTreatmentDate: null, LastTreatmentSeverityId: null, LastTreatmentStatus: null, TreatmentCategoryId: null, ValidTreatmentSeverityId: null, AsOf: '2026-10-26T08:00:00' }], TotalCount: 1 }
};

const browser = await chromium.launch({ executablePath: '/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell', headless: true });
async function setup(viewport, { ltr = false, delay = 0, failKey = null } = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const calls = [], aborted = [], pageErrors = [], consoleMessages = [], executableRequests = [];
  await context.route('**/*', async route => {
    const req = route.request(); const url = new URL(req.url());
    if (url.origin === fixtureOrigin && url.pathname.startsWith('/controller-host-fixture/')) {
      const rel = url.pathname.replace('/controller-host-fixture/', '') || 'index.html';
      const file = path.join(fixtureRoot, rel);
      if (!file.startsWith(fixtureRoot) || !fs.existsSync(file)) return route.abort();
      let body = fs.readFileSync(file);
      if (ltr && rel === 'host-fixture.js') body = Buffer.from(body.toString().replace('LanguageCode: "he", LanguageDirection: "rtl"', 'LanguageCode: "en", LanguageDirection: "ltr"'));
      return route.fulfill({ status: 200, contentType: path.extname(file) === '.js' ? 'text/javascript' : 'text/html', body });
    }
    if (url.origin === 'https://api.ylm.co.il') {
      if (delay) await new Promise(resolve => setTimeout(resolve, delay));
      const key = Object.keys(fixtures).find(name => req.url().includes(name));
      calls.push({ key, method: req.method(), body: req.postData(), resourceType: req.resourceType() });
      if (key === failKey) return route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ privateMarker: 'MUST_NOT_RENDER' }) });
      return route.fulfill({ status: key ? 200 : 404, contentType: 'application/json', body: JSON.stringify(key ? fixtures[key] : {}) });
    }
    if (url.origin === new URL(preview).origin) return route.continue();
    if (['data:', 'blob:'].includes(url.protocol)) return route.continue();
    aborted.push(req.url()); return route.abort();
  });
  const page = await context.newPage();
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', msg => consoleMessages.push(`${msg.type()}: ${msg.text()}`));
  page.on('request', req => { if (['script', 'worker'].includes(req.resourceType())) executableRequests.push(req.url()); });
  await page.goto(`${fixtureOrigin}/controller-host-fixture/index.html?preview=${encodeURIComponent(preview)}`);
  return { context, page, frame: page.frameLocator('#guest'), calls, aborted, pageErrors, consoleMessages, executableRequests };
}

async function metrics(frame) {
  return frame.locator('body').evaluate(body => {
    const footer = document.querySelector('footer[data-simplyvibe-release]');
    const rect = footer?.getBoundingClientRect();
    return {
      lang: document.documentElement.lang, dir: document.documentElement.dir,
      bodyText: body.innerText, bodyScrollWidth: body.scrollWidth, bodyClientWidth: body.clientWidth,
      footerCount: document.querySelectorAll('footer[data-simplyvibe-release]').length,
      footerText: footer?.innerText || '', footerDisplay: footer ? getComputedStyle(footer).display : null,
      footerRect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
      releaseAttributes: footer ? Object.fromEntries([...footer.attributes].filter(x => x.name.startsWith('data-release-')).map(x => [x.name, x.value])) : {},
      releaseValues: [...document.querySelectorAll('[data-release-value]')].map(x => ({ key: x.dataset.releaseValue, text: x.textContent })),
      inputs: [...document.querySelectorAll('input')].map(x => ({ id: x.id, type: x.type, value: x.value, disabled: x.disabled, invalid: x.getAttribute('aria-invalid'), height: x.getBoundingClientRect().height })),
      buttons: [...document.querySelectorAll('button')].map(x => ({ id: x.id, text: x.innerText.trim(), disabled: x.disabled, height: x.getBoundingClientRect().height })),
      headings: [...document.querySelectorAll('h1,h2,h3')].map(x => x.innerText.trim()),
      snapshotText: document.querySelector('#snapshot-region')?.innerText || '',
      dashboardDescendants: document.querySelectorAll('#dashboard *').length,
      active: { id: document.activeElement?.id || '', outline: getComputedStyle(document.activeElement).outline },
      footerAfterMain: Boolean(footer && document.querySelector('main')?.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING)
    };
  });
}

const desktop = await setup({ width: 1440, height: 900 });
await desktop.page.waitForTimeout(1800);
await desktop.frame.locator('#apply-range').focus();
const desktopReady = await metrics(desktop.frame);
await desktop.page.screenshot({ path: `${out}/desktop-rtl-ready.png`, fullPage: true });
const beforeDraft = desktop.calls.length;
await desktop.frame.locator('#from-date').fill('2025-12-31');
await desktop.frame.locator('#to-date').fill('2026-01-01');
const afterDraft = desktop.calls.length;
await desktop.frame.locator('#apply-range').click();
await desktop.page.waitForTimeout(600);
const applyCalls = desktop.calls.slice(afterDraft);
const afterApply = await metrics(desktop.frame);
await desktop.frame.locator('#from-date').fill('2026-02-02');
await desktop.frame.locator('#to-date').fill('2026-01-01');
await desktop.frame.locator('#apply-range').click();
await desktop.page.waitForTimeout(100);
const invalid = await metrics(desktop.frame);

const mobile = await setup({ width: 390, height: 844 });
await mobile.page.waitForTimeout(1800);
await mobile.frame.locator('#from-date').focus();
const mobileReady = await metrics(mobile.frame);
await mobile.page.screenshot({ path: `${out}/mobile-rtl-ready.png`, fullPage: true });

const ltr = await setup({ width: 1440, height: 900 }, { ltr: true });
await ltr.page.waitForTimeout(1800);
const ltrReady = await metrics(ltr.frame);
await ltr.page.screenshot({ path: `${out}/desktop-ltr-ready.png`, fullPage: true });

const loading = await setup({ width: 390, height: 844 }, { delay: 3000 });
await loading.page.waitForTimeout(500);
const loadingState = await metrics(loading.frame);
await loading.page.screenshot({ path: `${out}/mobile-rtl-loading.png`, fullPage: true });

const error = await setup({ width: 390, height: 844 }, { failKey: 'MilgamDashboardCurrentEvents' });
await error.page.waitForTimeout(1800);
const errorState = await metrics(error.frame);
await error.page.screenshot({ path: `${out}/mobile-rtl-error.png`, fullPage: true });

const directContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
await directContext.route('**/*', route => new URL(route.request().url()).origin === new URL(preview).origin ? route.continue() : route.abort());
const directPage = await directContext.newPage();
await directPage.goto(preview); await directPage.waitForTimeout(3500);
const directMetrics = await metrics(directPage.mainFrame());
await directPage.screenshot({ path: `${out}/mobile-no-context.png`, fullPage: true });

const result = {
  preview, expectedVersion, browserVersion: browser.version(),
  desktopReady, mobileReady, ltrReady, loadingState, errorState, directMetrics,
  requestEvidence: { beforeDraft, afterDraft, draftDelta: afterDraft - beforeDraft, applyCalls },
  runtime: {
    desktop: { pageErrors: desktop.pageErrors, consoleMessages: desktop.consoleMessages, aborted: desktop.aborted, executableRequests: desktop.executableRequests },
    mobile: { pageErrors: mobile.pageErrors, consoleMessages: mobile.consoleMessages },
    ltr: { pageErrors: ltr.pageErrors, consoleMessages: ltr.consoleMessages }
  }, invalid, afterApply
};
fs.writeFileSync(`${out}/playwright-results.json`, JSON.stringify(result, null, 2));
await Promise.all([desktop.context.close(), mobile.context.close(), ltr.context.close(), loading.context.close(), error.context.close(), directContext.close()]);
await browser.close();
