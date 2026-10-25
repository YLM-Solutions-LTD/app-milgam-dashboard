import { chromium } from '/workspace/src/apps/milgam-dashboard/.agents/uat-tester/tmp/playwright/node_modules/playwright-core/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const preview = 'https://5ab11833.app-milgam-dashboard.pages.dev';
const hostBase = 'https://milgam.ylm.co.il/controller-host-fixture/';
const fixtureRoot = '/workspace/.simplyvibe/input/controller-host-harness';
const browser = await chromium.launch({ executablePath: '/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell', headless: true });
const results = { preview, hostBase, chromium: await browser.version() };

function bodyFor(url) {
  if (url.includes('CurrentEvents')) return { Items: [{ ScopeKey:'overall',TotalCount:12,OpenCount:4,AsOf:'2026-10-25'},{ ScopeKey:'headquarters',TotalCount:5,OpenCount:2,AsOf:'2026-10-25'},{ ScopeKey:'branches',TotalCount:7,OpenCount:2,AsOf:'2026-10-25'}], TotalCount:3 };
  if (url.includes('CurrentPermits')) return { Items:[{ValidCount:8,MissingCount:2,OverdueCount:1,AsOf:'2026-10-25',ValueDate:'2026-10-25'}],TotalCount:1 };
  if (url.includes('CurrentEquipment')) return { Items:[{EquipmentId:'eq-1'},{EquipmentId:'eq-2'}],TotalCount:2 };
  if (url.includes('ByMonth')) return { Items:[{Year:2026,Month:10,Count:1}],TotalCount:1 };
  if (url.includes('ByDivision')) return { Items:[{DivisionName:'A',Count:1}],TotalCount:1 };
  if (url.includes('Summary')) return { Items:[{ScopeKey:'headquarters',TotalCount:1,OpenCount:1},{ScopeKey:'branches',TotalCount:0,OpenCount:0}],TotalCount:2 };
  if (url.includes('ByCategory')) return { Items:[{CategoryName:'A',Count:1}],TotalCount:1 };
  if (url.includes('ClosureByCategory')) return { Items:[{CategoryName:'A',AverageHours:1}],TotalCount:1 };
  return { Items:[],TotalCount:0 };
}

async function routes(context, state) {
  await context.route(`${hostBase}**`, async route => {
    const url = new URL(route.request().url());
    const relative = url.pathname.slice('/controller-host-fixture/'.length) || 'index.html';
    const data = await fs.readFile(path.join(fixtureRoot, relative));
    await route.fulfill({ status:200, contentType:relative.endsWith('.js')?'text/javascript':relative.endsWith('.json')?'application/json':'text/html', body:data });
  });
  await context.route('https://api.ylm.co.il/**', async route => {
    const req = route.request();
    const record = { url:req.url(), method:req.method(), auth:req.headers().authorization || null, body:req.postData(), phase:state.phase };
    state.api.push(record);
    if (state.phase === 'refresh-500' && req.url().includes('CurrentEvents')) return route.fulfill({status:500,contentType:'application/json',body:'{"person":"PRIVATE-500-MARKER"}'});
    if (state.phase === 'refresh-401' && req.url().includes('CurrentEvents')) return route.fulfill({status:401,contentType:'application/json',body:'{"person":"PRIVATE-401-MARKER"}'});
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(bodyFor(req.url()))});
  });
  for (const pattern of ['https://mntapi.ylm.co.il/**']) {
    await context.route(pattern, route => { state.unexpected.push(route.request().url()); return route.abort(); });
  }
}

async function runLifecycle() {
  const context = await browser.newContext();
  const state = { phase:'normal', api:[], unexpected:[] }, consoleEntries=[], pageErrors=[], requests=[];
  await routes(context,state);
  const page = await context.newPage();
  page.on('request', req => requests.push({url:req.url(),type:req.resourceType()}));
  page.on('console', async msg => consoleEntries.push({type:msg.type(), values:await Promise.all(msg.args().map(a=>a.jsonValue().catch(()=>'<unavailable>')))}));
  page.on('pageerror', error => pageErrors.push(String(error)));
  await page.goto(`${hostBase}index.html?preview=${encodeURIComponent(preview)}`);
  const frame = page.frames().find(f=>f.url().startsWith(preview));
  await frame.locator('#snapshot-content .snapshot-grid').waitFor({timeout:10000});
  await page.waitForTimeout(300);
  const initial = state.api.slice();
  const baselineText = await frame.locator('#snapshot-content').innerText();
  const baselineHtml = await frame.locator('#snapshot-content').innerHTML();
  const sdk = await frame.evaluate(()=>({client:typeof globalThis.SimplyVibeClient,adapter:typeof globalThis.SimplyVibeHostAdapter}));

  state.phase='refresh-500';
  const at500=state.api.length;
  await frame.locator('#snapshot-refresh').click(); await page.waitForTimeout(500);
  const after500={requests:state.api.slice(at500), text:await frame.locator('#snapshot-content').innerText(),status:await frame.locator('#snapshot-status').innerText()};

  state.phase='refresh-401';
  const at401=state.api.length;
  await frame.locator('#snapshot-refresh').click(); await page.waitForTimeout(500);
  const after401={requests:state.api.slice(at401), text:await frame.locator('#snapshot-content').innerText(),status:await frame.locator('#snapshot-status').innerText()};
  const deniedAt=state.api.length;
  await frame.locator('#snapshot-refresh').click(); await page.waitForTimeout(350);
  const deniedRequests=state.api.slice(deniedAt);

  state.phase='normal';
  const reentryAt=state.api.length;
  await page.evaluate(()=>controllerHarness.reenter()); await page.waitForTimeout(900);
  const reentryRequests=state.api.slice(reentryAt);

  await page.evaluate(()=>controllerHarness.holdCommand());
  const effectsBefore=await page.evaluate(()=>controllerHarness.effects.length);
  await frame.locator('[data-permit]').first().click({noWaitAfter:true});
  await frame.evaluate(()=>{ const b=document.querySelector('[data-permit]'); for(let i=0;i<20;i++) b.dispatchEvent(new MouseEvent('click',{bubbles:true})); });
  await page.waitForTimeout(100); await page.evaluate(()=>controllerHarness.releaseCommand()); await page.waitForTimeout(400);
  const effectsAfter=await page.evaluate(()=>controllerHarness.effects.slice());

  results.lifecycle={sdk,initial,baselineText,baselineHtml,after500,after401,deniedRequests,reentryRequests,effectsBefore,effectsAfter,
    marker500:JSON.stringify(consoleEntries).includes('PRIVATE-500-MARKER'),marker401:JSON.stringify(consoleEntries).includes('PRIVATE-401-MARKER'),
    pageErrors,unexpected:state.unexpected,externalExecutable:requests.filter(r=>['script','stylesheet'].includes(r.type)&&!r.url.startsWith(preview)&&!r.url.startsWith(hostBase)),consoleEntries};
  await context.close();
}

async function runRace() {
  const context=await browser.newContext(); const state={phase:'normal',api:[],unexpected:[]},pageErrors=[],unhandled=[];
  await routes(context,state); const page=await context.newPage(); page.on('pageerror',e=>pageErrors.push(String(e)));
  await page.addInitScript(()=>addEventListener('unhandledrejection',e=>globalThis.__unhandled=(globalThis.__unhandled||[]).concat(String(e.reason))));
  await page.goto(`${hostBase}index.html?preview=${encodeURIComponent(preview)}`); const frame=page.frames().find(f=>f.url().startsWith(preview));
  await frame.locator('#snapshot-content .snapshot-grid').waitFor({timeout:10000});
  await page.evaluate(()=>controllerHarness.holdCommand()); await frame.locator('[data-permit]').first().click({noWaitAfter:true}); await page.waitForTimeout(50);
  await page.evaluate(()=>{controllerHarness.revoke(); controllerHarness.releaseCommand(); controllerHarness.reenter(); queueMicrotask(()=>controllerHarness.reenter());});
  await page.waitForTimeout(1200); unhandled.push(...await page.evaluate(()=>globalThis.__unhandled||[]));
  results.race={pageErrors,unhandled,harness:await page.evaluate(()=>controllerHarness.state()),requests:state.api}; await context.close();
}

async function runDirect() {
  const context=await browser.newContext(); const api=[]; await context.route('https://api.ylm.co.il/**',r=>{api.push(r.request().url());return r.abort();});
  const page=await context.newPage(); await page.goto(preview); await page.evaluate(()=>window.postMessage({ApiAddress:'https://api.ylm.co.il',Token:{access_token:'forged'}},location.origin)); await page.waitForTimeout(500);
  results.direct={api,connection:await page.locator('#connection-status').innerText()}; await context.close();
}

await runLifecycle(); await runRace(); await runDirect();
console.log(JSON.stringify(results,null,2)); await browser.close();
