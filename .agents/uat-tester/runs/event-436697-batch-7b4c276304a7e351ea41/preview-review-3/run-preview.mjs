import fs from 'node:fs/promises';

const prior = new URL('../preview-review-2/run-preview.mjs', import.meta.url);
let source = await fs.readFile(prior, 'utf8');
source = source
  .replace("import playwright from '../../../tmp/playwright/node_modules/playwright-core/index.js';", "import playwright from 'file:///workspace/src/apps/milgam-dashboard/.agents/uat-tester/tmp/playwright/node_modules/playwright-core/index.js';")
  .replace("const preview = 'https://ea51f277.app-milgam-dashboard.pages.dev';", "const preview = 'https://ef2f1185.app-milgam-dashboard.pages.dev';")
  .replace("const head = '8f1e577bbcb4670878dec24ff570c1382a18d170';", "const head = '3dc45f69655efd2a2c6b0ad016b1a8cf8f738066';")
  .replace("const out = new URL('./evidence/', import.meta.url);", "const out = new URL('file:///workspace/src/apps/milgam-dashboard/.agents/uat-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/');");
source = source.replace(`{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });`, `{
  const x = await session(); const before = x.calls.filter(c => c.key?.startsWith('MilgamDashboardCurrent')).length;
  await x.frame.evaluate(() => { const a = document.querySelector('#snapshot-refresh'); const b = document.querySelector('#refresh-button'); for (let i = 0; i < 10; i++) { a.click(); b.click(); } });
  await x.frame.waitForTimeout(700); const burst = x.calls.filter(c => c.key?.startsWith('MilgamDashboardCurrent')).slice(before);
  result.scenarios.push({ name: 'both-refresh-controls-burst', currentCalls: burst.length, routes: burst.map(c => c.key), errors: x.errors }); await x.context.close();
}
{
  const x = await session(); const original = await x.frame.locator('#snapshot-content').innerText(); x.failNextCurrent(500); await x.frame.locator('#snapshot-refresh').click(); await x.frame.waitForTimeout(500); const before = x.calls.filter(c => c.key?.startsWith('MilgamDashboardCurrent')).length;
  await x.frame.evaluate(() => { const retry = document.querySelector('[data-snapshot-retry]'); for (let i = 0; i < 10; i++) retry.click(); });
  await x.frame.waitForTimeout(700); const burst = x.calls.filter(c => c.key?.startsWith('MilgamDashboardCurrent')).slice(before);
  result.scenarios.push({ name: 'retry-control-burst', retainedBeforeRetry: (await x.frame.locator('#snapshot-content').innerText()).includes('12'), currentCalls: burst.length, routes: burst.map(c => c.key), lockReleased: !(await x.frame.locator('#snapshot-refresh').isDisabled()), errors: x.errors }); await x.context.close();
}
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });`);
await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
