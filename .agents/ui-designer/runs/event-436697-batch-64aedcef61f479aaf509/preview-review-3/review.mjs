import playwright from '/usr/local/lib/node_modules/@playwright/test/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = playwright;
const preview = 'https://c9756759.app-milgam-dashboard.pages.dev';
const out = '/workspace/src/apps/milgam-dashboard/.agents/ui-designer/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-3/evidence';
fs.mkdirSync(out, { recursive: true });
const calls = [];
const fixtures = {
  MilgamDashboardCurrentEvents: { Items: [
    { ScopeKey: 'overall', TotalCount: 1248, OpenCount: 186, AsOf: '2026-09-23T08:00:00' },
    { ScopeKey: 'headquarters', TotalCount: 320, OpenCount: 42, AsOf: '2026-09-23T08:00:00' },
    { ScopeKey: 'branches', TotalCount: 928, OpenCount: 144, AsOf: '2026-09-23T08:00:00' }
  ], TotalCount: 3 },
  MilgamDashboardCurrentPermits: { Items: [{ ValidCount: 132, MissingCount: 27, OverdueCount: 18, AsOf: '2026-09-23T08:00:00', ValueDate: '2026-09-23' }], TotalCount: 1 },
  MilgamDashboardCurrentEquipment: { Items: [{ EquipmentId: 1, IsActive: true, LastTreatmentDate: null, AsOf: '2026-09-23T08:00:00' }, { EquipmentId: 2, IsActive: false, LastTreatmentDate: null, AsOf: '2026-09-23T08:00:00' }], TotalCount: 2 },
  MilgamDashboardByMonth: { Items: [{ Year: 2026, Month: 9, Label: '09/26', EventCount: 5 }], TotalCount: 1 },
  MilgamDashboardByDivision: { Items: [{ DivisionName: 'חטיבה א', EventCount: 3 }, { DivisionName: 'חטיבה ב', EventCount: 2 }], TotalCount: 2 },
  MilgamDashboardSummary: { Items: [{ ScopeKey: 'headquarters', ScopeLabel: 'מטה', ScopeOrder: 1, EventCount: 3, ClosedCount: 2, EligibleDurationCount: 1, InvalidDurationCount: 1, AverageCloseDays: 2 }, { ScopeKey: 'branches', ScopeLabel: 'סניפים', ScopeOrder: 2, EventCount: 2, ClosedCount: 1, EligibleDurationCount: 1, InvalidDurationCount: 0, AverageCloseDays: 4 }], TotalCount: 2 },
  MilgamDashboardByCategory: { Items: [{ ScopeKey: 'headquarters', ScopeLabel: 'מטה', ScopeOrder: 1, CategoryName: 'אחזקה', EventCount: 3 }, { ScopeKey: 'branches', ScopeLabel: 'סניפים', ScopeOrder: 2, CategoryName: 'ניקיון', EventCount: 2 }], TotalCount: 2 },
  MilgamDashboardClosureByCategory: { Items: [{ ScopeKey: 'headquarters', ScopeLabel: 'מטה', ScopeOrder: 1, CategoryName: 'אחזקה', ClosedCount: 2, EligibleDurationCount: 1, InvalidDurationCount: 1, AverageCloseDays: 2 }, { ScopeKey: 'branches', ScopeLabel: 'סניפים', ScopeOrder: 2, CategoryName: 'ניקיון', ClosedCount: 1, EligibleDurationCount: 1, InvalidDurationCount: 0, AverageCloseDays: 4 }], TotalCount: 2 }
};
const browser = await chromium.launch({ executablePath: '/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell', headless: true });
async function run(name, viewport, direction, rejectNavigation = false) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const pageErrors = [];
  await context.addInitScript(({ rejectNavigation }) => {
    globalThis.SimplyVibeHostAdapter = {
      ready: async () => true,
      executeCommand: async (name, parameter) => { globalThis.__commands = [...(globalThis.__commands || []), { name, parameter }]; if (rejectNavigation) throw new Error('synthetic command rejection'); },
      ToDisplayDate: (value) => `מוצג:${value}`
    };
  }, { rejectNavigation });
  await context.route('https://milgam.ylm.co.il/synthetic-host', route => route.fulfill({ contentType: 'text/html', body: `<!doctype html><iframe id="app" src="${preview}" style="position:fixed;inset:0;width:100%;height:100%;border:0"></iframe><script>const f=document.getElementById('app');f.onload=()=>f.contentWindow.postMessage({context:{ApiAddress:'https://api.ylm.co.il',Token:{access_token:'synthetic-preview-token'},LanguageCode:'${direction === 'rtl' ? 'he' : 'en'}',CultureInfo:'${direction === 'rtl' ? 'he-IL' : 'en-US'}',LanguageDirection:'${direction}'}},'${preview}');</script>` }));
  await context.route('https://api.ylm.co.il/**', async route => {
    const req = route.request(); const key = Object.keys(fixtures).find(k => req.url().includes(k));
    calls.push({ name, url: req.url(), method: req.method(), body: req.postData(), authorization: Boolean(req.headers().authorization) });
    await route.fulfill({ status: key ? 200 : 404, contentType: 'application/json', body: JSON.stringify(key ? fixtures[key] : { error: 'unknown fixture' }) });
  });
  const page = await context.newPage();
  const consoleMessages = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => consoleMessages.push(`${message.type()}: ${message.text()}`));
  await page.goto('https://milgam.ylm.co.il/synthetic-host');
  const frame = page.frameLocator('#app');
  await page.waitForTimeout(5000);
  const permit = frame.locator('[data-permit="missing"]');
  const hasPermit = await permit.count() > 0;
  if (hasPermit) await permit.focus();
  const metrics = await frame.locator('body').evaluate(body => ({
    dir: document.documentElement.dir, lang: document.documentElement.lang,
    scrollWidth: body.scrollWidth, clientWidth: body.clientWidth,
    snapshotElements: document.querySelectorAll('#snapshot-region *').length,
    permitLabels: [...document.querySelectorAll('[data-permit]')].map(x => x.getAttribute('aria-label')),
    snapshotText: document.querySelector('#snapshot-region')?.innerText,
    analyticsPanels: document.querySelectorAll('#dashboard .panel, #dashboard .closure-section').length,
    focusVisible: document.activeElement?.matches(':focus-visible'),
    fontFamily: getComputedStyle(body).fontFamily,
    primaryColor: getComputedStyle(document.querySelector('.snapshot-card') || body).borderColor
  }));
  if (hasPermit) await permit.click();
  await page.waitForTimeout(500);
  metrics.commands = await frame.locator('body').evaluate(() => globalThis.__commands || []);
  metrics.activePermitAfterCommand = await frame.locator('body').evaluate(() => document.activeElement?.getAttribute('data-permit'));
  metrics.pageErrors = pageErrors;
  metrics.consoleMessages = consoleMessages;
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  await context.close();
  return metrics;
}
const results = {};
results.desktopRtl = await run('preview-desktop-rtl', { width: 1440, height: 900 }, 'rtl');
results.mobileRtl = await run('preview-mobile-rtl', { width: 390, height: 844 }, 'rtl');
results.desktopLtr = await run('preview-desktop-ltr', { width: 1440, height: 900 }, 'ltr');
results.navigationRejection = await run('preview-navigation-rejection', { width: 1440, height: 900 }, 'rtl', true);
results.calls = calls;
fs.writeFileSync(`${out}/playwright-results.json`, JSON.stringify(results, null, 2));
await browser.close();
