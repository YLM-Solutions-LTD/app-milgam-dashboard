import { chromium } from '/workspace/src/apps/milgam-dashboard/.agents/security-reviewer/tmp/playwright/node_modules/playwright-core/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const preview = 'https://f9d0c736.app-milgam-dashboard.pages.dev';
const hostBase = 'https://milgam.ylm.co.il/controller-host-fixture/';
const fixtureRoot = '/workspace/.simplyvibe/input/controller-host-harness';
const executablePath = '/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell';
const browser = await chromium.launch({ executablePath, headless: true });
const out = { preview, chromium: await browser.version() };

function analytics(url, count = 1) {
  if (url.includes('ByMonth')) return { Items: [{ Year: 2026, Month: 10, Label: '10/26', EventCount: 10 }], TotalCount: 1 };
  if (url.includes('Summary')) return { Items: [
    {ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,EventCount:5,ClosedCount:2,EligibleDurationCount:2,InvalidDurationCount:0,AverageCloseDays:1},
    {ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,EventCount:5,ClosedCount:3,EligibleDurationCount:3,InvalidDurationCount:0,AverageCloseDays:1}
  ], TotalCount: 2 };
  if (url.includes('ByDivision')) return { Items: Array.from({length:count},(_,i)=>({ DivisionName:`<img src=x onerror=alert(${i})> division ${i}`, EventCount:i===0?10:0 })), TotalCount: count };
  if (url.includes('ClosureByCategory')) return { Items: Array.from({length:count},(_,i)=>({ScopeKey:i%2?'branches':'headquarters',ScopeLabel:i%2?'סניפים':'מטה',ScopeOrder:i%2?2:1,CategoryName:`<svg onload=alert(${i})> category ${i}`,ClosedCount:i===0?2:i===1?3:0,EligibleDurationCount:i===0?2:i===1?3:0,InvalidDurationCount:0,AverageCloseDays:i<2?1:null})), TotalCount: count };
  if (url.includes('ByCategory')) return { Items: Array.from({length:count},(_,i)=>({ScopeKey:i%2?'branches':'headquarters',ScopeLabel:i%2?'סניפים':'מטה',ScopeOrder:i%2?2:1,CategoryName:`<svg onload=alert(${i})> category ${i}`,EventCount:i<2?5:0})), TotalCount: count };
  return null;
}

function bodyFor(url, count = 1) {
  if (url.includes('CurrentEvents')) return {Items:[{ScopeKey:'overall',TotalCount:'12',OpenCount:'4',AsOf:'2026-10-26'},{ScopeKey:'headquarters',TotalCount:'5',OpenCount:'2',AsOf:'2026-10-26'},{ScopeKey:'branches',TotalCount:'7',OpenCount:'2',AsOf:'2026-10-26'}],TotalCount:3};
  if (url.includes('CurrentPermits')) return {Items:[{ValidCount:'8',MissingCount:'2',OverdueCount:'1',AsOf:'2026-10-26',ValueDate:'2026-10-26'}],TotalCount:1};
  if (url.includes('CurrentEquipment')) return {Items:[{EquipmentId:'eq-1'}],TotalCount:1};
  return analytics(url, count) || {Items:[],TotalCount:0};
}

async function install(context, state) {
  await context.route(`${hostBase}**`, async route => {
    const url = new URL(route.request().url());
    const relative = url.pathname.slice('/controller-host-fixture/'.length) || 'index.html';
    const data = await fs.readFile(path.join(fixtureRoot, relative));
    await route.fulfill({ status:200, contentType:relative.endsWith('.js')?'text/javascript':relative.endsWith('.json')?'application/json':'text/html', body:data });
  });
  await context.route('https://api.ylm.co.il/**', async route => {
    const req = route.request();
    state.api.push({url:req.url(),method:req.method(),auth:req.headers().authorization||null,body:req.postData(),phase:state.phase});
    if (state.phase === '401' && req.url().includes('CurrentEvents')) return route.fulfill({status:401,contentType:'application/json',body:'{"private":"PRIVATE-401-MARKER","token":"SHOULD-NOT-LOG"}'});
    if (state.phase === '500' && req.url().includes('CurrentEvents')) return route.fulfill({status:500,contentType:'application/json',body:'{"private":"PRIVATE-500-MARKER"}'});
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(bodyFor(req.url(), state.analyticsCount))});
  });
  await context.route('**/*', async route => {
    const u = route.request().url();
    if (u.startsWith(preview) || u.startsWith(hostBase) || u.startsWith('https://api.ylm.co.il/')) return route.fallback();
    state.blocked.push(u); return route.abort();
  });
}

async function hosted() {
  const context = await browser.newContext({viewport:{width:320,height:844}});
  const state = {phase:'normal',analyticsCount:1000,api:[],blocked:[]};
  await install(context,state);
  const page = await context.newPage(), logs = [], errors = [], dialogs = [], requests = [];
  page.on('console', async m => logs.push(JSON.stringify(await Promise.all(m.args().map(a=>a.jsonValue().catch(()=>'<unavailable>'))))));
  page.on('pageerror', e => errors.push(String(e)));
  page.on('dialog', async d => { dialogs.push(d.message()); await d.dismiss(); });
  page.on('request', r => requests.push({url:r.url(),type:r.resourceType()}));
  const response = await page.goto(`${hostBase}index.html?preview=${encodeURIComponent(preview)}`);
  const frame = page.frames().find(f => f.url().startsWith(preview));
  await frame.locator('#apply-range').waitFor({timeout:20000});
  await frame.locator('#from-date').fill('2026-10-01');
  await frame.locator('#to-date').fill('2026-10-31');
  await frame.locator('#apply-range').click();
  await page.waitForTimeout(2000);
  const sourceSecurity = await frame.evaluate(() => ({
    sdk: typeof globalThis.SimplyVibeClient,
    adapter: typeof globalThis.SimplyVibeHostAdapter,
    scripts: [...document.scripts].map(s=>s.src),
    footerCount: document.querySelectorAll('[data-simplyvibe-release]').length,
    footer: document.querySelector('[data-simplyvibe-release]')?.innerText,
    footerBox: (()=>{const r=document.querySelector('[data-simplyvibe-release]').getBoundingClientRect(); return {left:r.left,right:r.right,width:r.width,innerWidth,scrollWidth:document.documentElement.scrollWidth};})(),
    dashboardNodes: document.querySelectorAll('#dashboard *').length,
    injectedElements: [...document.querySelectorAll('#dashboard img,#dashboard script,#dashboard [onload],#dashboard [onerror]')].map(el=>el.outerHTML),
    pageButtons: document.querySelectorAll('[data-page-step]').length
    ,stateText: document.querySelector('#state-region')?.innerText
  }));
  const initial = state.api.slice();
  state.phase='500'; await frame.locator('#snapshot-refresh').click(); await page.waitForTimeout(500);
  state.phase='401'; const before401=state.api.length; await frame.locator('#snapshot-refresh').click(); await page.waitForTimeout(700);
  const terminalUi = await frame.evaluate(() => ({
    refreshDisabled: document.querySelector('#snapshot-refresh')?.disabled,
    retryCount: document.querySelectorAll('[data-snapshot-retry]').length,
    status: document.querySelector('#snapshot-status')?.innerText
  }));
  const calls401=state.api.slice(before401), deniedAt=state.api.length;
  await frame.locator('#snapshot-refresh').evaluate(el=>el.click()); await page.waitForTimeout(350);
  const denied=state.api.slice(deniedAt);
  state.phase='normal'; const reentryAt=state.api.length; await page.evaluate(()=>controllerHarness.reenter()); await page.waitForTimeout(1000);
  const reentry=state.api.slice(reentryAt);
  await page.evaluate(()=>controllerHarness.holdCommand());
  await frame.locator('[data-permit]').first().click(); await page.waitForTimeout(100);
  await page.evaluate(()=>controllerHarness.revoke()); await page.evaluate(()=>controllerHarness.releaseCommand()); await page.waitForTimeout(400);
  out.hosted={status:response.status(),headers:response.headers(),sourceSecurity,initial,calls401,terminalUi,denied,reentry,
    effects:await page.evaluate(()=>controllerHarness.effects.slice()),marker401:logs.some(x=>x.includes('PRIVATE-401-MARKER')||x.includes('SHOULD-NOT-LOG')),
    marker500:logs.some(x=>x.includes('PRIVATE-500-MARKER')),errors,dialogs,blocked:state.blocked,
    externalExecutable:requests.filter(r=>['script','stylesheet'].includes(r.type)&&!r.url.startsWith(preview)&&!r.url.startsWith(hostBase))};
  await context.close();
}

async function direct() {
  const context=await browser.newContext(); const state={phase:'normal',analyticsCount:1,api:[],blocked:[]}; await install(context,state);
  const page=await context.newPage(); await page.goto(preview);
  await page.evaluate(()=>window.postMessage({ApiAddress:'https://api.ylm.co.il',Token:{access_token:'forged'}},location.origin)); await page.waitForTimeout(500);
  out.direct={api:state.api,connection:await page.locator('#connection-status').innerText(),footer:await page.locator('[data-simplyvibe-release]').innerText(),blocked:state.blocked};
  await context.close();
}

await hosted(); await direct(); console.log(JSON.stringify(out,null,2)); await browser.close();
