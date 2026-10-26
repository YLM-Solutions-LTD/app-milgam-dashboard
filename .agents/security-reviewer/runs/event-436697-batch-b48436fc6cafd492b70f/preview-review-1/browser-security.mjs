import { chromium } from '/workspace/src/apps/milgam-dashboard/.agents/security-reviewer/tmp/playwright/node_modules/playwright-core/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const preview = 'https://8248a782.app-milgam-dashboard.pages.dev';
const hostBase = 'https://milgam.ylm.co.il/controller-host-fixture/';
const fixtureRoot = '/workspace/.simplyvibe/input/controller-host-harness';
const browser = await chromium.launch({ executablePath: '/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell', headless: true });
const out = { preview, chromium: await browser.version() };

function bodyFor(url) {
  if (url.includes('CurrentEvents')) return {Items:[{ScopeKey:'overall',TotalCount:'12',OpenCount:'4',AsOf:'2026-10-26'},{ScopeKey:'headquarters',TotalCount:'5',OpenCount:'2',AsOf:'2026-10-26'},{ScopeKey:'branches',TotalCount:'7',OpenCount:'2',AsOf:'2026-10-26'}],TotalCount:3};
  if (url.includes('CurrentPermits')) return {Items:[{ValidCount:'8',MissingCount:'2',OverdueCount:'1',AsOf:'2026-10-26',ValueDate:'2026-10-26'}],TotalCount:1};
  if (url.includes('CurrentEquipment')) return {Items:[{EquipmentId:'eq-1'}],TotalCount:1};
  if (url.includes('ByMonth')) return {Items:[{Year:2026,Month:10,Count:1}],TotalCount:1};
  if (url.includes('ByDivision')) return {Items:[{DivisionName:'A',Count:1}],TotalCount:1};
  if (url.includes('Summary')) return {Items:[{ScopeKey:'headquarters',TotalCount:1,OpenCount:1},{ScopeKey:'branches',TotalCount:0,OpenCount:0}],TotalCount:2};
  if (url.includes('ByCategory')) return {Items:[{CategoryName:'A',Count:1}],TotalCount:1};
  if (url.includes('ClosureByCategory')) return {Items:[{CategoryName:'A',AverageHours:1}],TotalCount:1};
  return {Items:[],TotalCount:0};
}

async function install(context, state) {
  await context.route(`${hostBase}**`, async route => {
    const url = new URL(route.request().url());
    const relative = url.pathname.slice('/controller-host-fixture/'.length) || 'index.html';
    const data = await fs.readFile(path.join(fixtureRoot, relative));
    await route.fulfill({status:200,contentType:relative.endsWith('.js')?'text/javascript':relative.endsWith('.json')?'application/json':'text/html',body:data});
  });
  await context.route('https://api.ylm.co.il/**', async route => {
    const req=route.request(); state.api.push({url:req.url(),method:req.method(),auth:req.headers().authorization||null,body:req.postData(),phase:state.phase});
    if (state.phase==='401' && req.url().includes('CurrentEvents')) return route.fulfill({status:401,contentType:'application/json',body:'{"private":"PRIVATE-401-MARKER"}'});
    if (state.phase==='500' && req.url().includes('CurrentEvents')) return route.fulfill({status:500,contentType:'application/json',body:'{"private":"PRIVATE-500-MARKER"}'});
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(bodyFor(req.url()))});
  });
  await context.route('**/*', async route => {
    const u=route.request().url();
    if (u.startsWith(preview)||u.startsWith(hostBase)||u.startsWith('https://api.ylm.co.il/')) return route.fallback();
    state.blocked.push(u); return route.abort();
  });
}

async function hosted() {
  const context=await browser.newContext({viewport:{width:390,height:844}}); const state={phase:'normal',api:[],blocked:[]};
  await install(context,state); const page=await context.newPage(), logs=[], errors=[], requests=[];
  page.on('console',async m=>logs.push(JSON.stringify(await Promise.all(m.args().map(a=>a.jsonValue().catch(()=>'<unavailable>'))))));
  page.on('pageerror',e=>errors.push(String(e))); page.on('request',r=>requests.push({url:r.url(),type:r.resourceType()}));
  const response=await page.goto(`${hostBase}index.html?preview=${encodeURIComponent(preview)}`);
  const frame=page.frames().find(f=>f.url().startsWith(preview));
  await frame.locator('#snapshot-content .snapshot-grid').waitFor({timeout:15000});
  const footer=await frame.locator('[data-simplyvibe-release]').evaluate(el=>({count:document.querySelectorAll('[data-simplyvibe-release]').length,text:el.innerText,visible:!!(el.offsetWidth||el.offsetHeight),htmlAttrs:[...document.documentElement.attributes].map(a=>[a.name,a.value]),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth}));
  const sdk=await frame.evaluate(()=>({client:typeof globalThis.SimplyVibeClient,adapter:typeof globalThis.SimplyVibeHostAdapter}));
  const initial=state.api.slice();
  state.phase='500'; await frame.locator('#snapshot-refresh').click(); await page.waitForTimeout(500);
  state.phase='401'; const before401=state.api.length; await frame.locator('#snapshot-refresh').click(); await page.waitForTimeout(600); const calls401=state.api.slice(before401);
  const deniedAt=state.api.length; await frame.locator('#snapshot-refresh').click(); await page.waitForTimeout(350); const denied=state.api.slice(deniedAt);
  state.phase='normal'; const reentryAt=state.api.length; await page.evaluate(()=>controllerHarness.reenter()); await page.waitForTimeout(1000); const reentry=state.api.slice(reentryAt);
  await page.evaluate(()=>controllerHarness.holdCommand()); const effectsBefore=await page.evaluate(()=>controllerHarness.effects.length);
  await frame.locator('[data-permit]').first().click(); await page.waitForTimeout(100); await page.evaluate(()=>controllerHarness.revoke()); await page.evaluate(()=>controllerHarness.releaseCommand()); await page.waitForTimeout(400);
  const effectsAfter=await page.evaluate(()=>controllerHarness.effects.slice());
  out.hosted={status:response.status(),headers:response.headers(),sdk,footer,initial,calls401,denied,reentry,effectsBefore,effectsAfter,marker401:logs.some(x=>x.includes('PRIVATE-401-MARKER')),marker500:logs.some(x=>x.includes('PRIVATE-500-MARKER')),errors,blocked:state.blocked,externalExecutable:requests.filter(r=>['script','stylesheet'].includes(r.type)&&!r.url.startsWith(preview)&&!r.url.startsWith(hostBase))};
  await context.close();
}

async function direct() {
  const context=await browser.newContext(); const state={phase:'normal',api:[],blocked:[]}; await install(context,state); const page=await context.newPage();
  await page.goto(preview); await page.evaluate(()=>window.postMessage({ApiAddress:'https://api.ylm.co.il',Token:{access_token:'forged'}},location.origin)); await page.waitForTimeout(500);
  out.direct={api:state.api,connection:await page.locator('#connection-status').innerText(),footer:await page.locator('[data-simplyvibe-release]').innerText()}; await context.close();
}

await hosted(); await direct();
console.log(JSON.stringify(out,null,2)); await browser.close();
