import playwright from '/workspace/src/apps/milgam-dashboard/.agents/uat-tester/tmp/playwright/node_modules/playwright-core/index.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const preview = 'https://ea51f277.app-milgam-dashboard.pages.dev';
const head = '8f1e577bbcb4670878dec24ff570c1382a18d170';
const host = 'https://milgam.ylm.co.il/controller-host-fixture/';
const fixtureRoot = '/workspace/.simplyvibe/input/controller-host-harness';
const out = new URL('./evidence/', import.meta.url);
const { chromium } = playwright;
await fs.mkdir(out, { recursive: true });

const equipment = Array.from({ length: 10000 }, (_, i) => ({ EquipmentId:i+1, LocationEntityId:i%20, LocationEntityType:'Site', LocationPath:`Root/${i%20}`, EquipmentTypeId:1, IsActive:true, TreatmentDaysInterval:null, NextTreatmentDate:null, LastTreatmentEventId:null, LastTreatmentDate:null, LastTreatmentSeverityId:null, LastTreatmentStatus:null, TreatmentCategoryId:null, ValidTreatmentSeverityId:null, AsOf:'2026-10-25T09:00:00' }));
const fixtures = {
  MilgamDashboardCurrentEvents:{Items:[{ScopeKey:'overall',TotalCount:12,OpenCount:5,AsOf:'2026-10-25T09:00:00'},{ScopeKey:'headquarters',TotalCount:4,OpenCount:2,AsOf:'2026-10-25T09:00:00'},{ScopeKey:'branches',TotalCount:8,OpenCount:3,AsOf:'2026-10-25T09:00:00'}],TotalCount:3},
  MilgamDashboardCurrentPermits:{Items:[{ValidCount:7,MissingCount:2,OverdueCount:1,AsOf:'2026-10-25T09:00:00',ValueDate:'2026-10-25'}],TotalCount:1},
  MilgamDashboardCurrentEquipment:{Items:equipment,TotalCount:10000},
  MilgamDashboardByMonth:{Items:[{Year:2026,Month:9,Label:'9/26',EventCount:10},{Year:2026,Month:10,Label:'10/26',EventCount:10}],TotalCount:2},
  MilgamDashboardByDivision:{Items:[{DivisionName:'General',EventCount:6},{DivisionName:'Field',EventCount:4}],TotalCount:2},
  MilgamDashboardSummary:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,EventCount:4,ClosedCount:2,EligibleDurationCount:2,InvalidDurationCount:0,AverageCloseDays:1},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,EventCount:6,ClosedCount:3,EligibleDurationCount:3,InvalidDurationCount:0,AverageCloseDays:1}],TotalCount:2},
  MilgamDashboardByCategory:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,CategoryName:'General',EventCount:4},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,CategoryName:'General',EventCount:6}],TotalCount:2},
  MilgamDashboardClosureByCategory:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,CategoryName:'General',ClosedCount:2,EligibleDurationCount:2,InvalidDurationCount:0,AverageCloseDays:1},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,CategoryName:'General',ClosedCount:3,EligibleDurationCount:3,InvalidDurationCount:0,AverageCloseDays:1}],TotalCount:2}
};
const keyFor = u => Object.keys(fixtures).find(k => u.includes(`/api/Entity/${k}/Search`));
const result = { preview, head, host, browser:null, headers:{}, scenarios:[], executableRequests:[], blockedRequests:[] };

async function make({name, viewport, dir='rtl', failMode=null, delays=false}={}) {
  const context = await browser.newContext({ viewport: viewport || {width:1440,height:900} });
  const page = await context.newPage();
  const calls=[], consoleMessages=[], pageErrors=[]; let currentFailMode=failMode; let sequence=0;
  await page.route('**/*', route => { const u=route.request().url(); if (u.startsWith(preview)||u.startsWith(host)||u.startsWith('https://api.ylm.co.il/')) return route.continue(); result.blockedRequests.push(u); return route.abort('blockedbyclient'); });
  page.on('console', m => consoleMessages.push({type:m.type(),text:m.text()}));
  page.on('pageerror', e => pageErrors.push(String(e)));
  page.on('request', r => { if (['script','worker'].includes(r.resourceType())) result.executableRequests.push(r.url()); });
  await page.route('https://milgam.ylm.co.il/controller-host-fixture/**', async route => {
    const rel = new URL(route.request().url()).pathname.replace('/controller-host-fixture/','') || 'index.html';
    const file = path.resolve(fixtureRoot, rel); if (!file.startsWith(fixtureRoot + path.sep)) return route.abort();
    try { let body=await fs.readFile(file); if (rel==='host-fixture.js' && dir==='ltr') body=Buffer.from(body.toString().replace('LanguageDirection: "rtl"','LanguageDirection: "ltr"').replace('LanguageCode: "he"','LanguageCode: "en"')); await route.fulfill({status:200,contentType:rel.endsWith('.js')?'text/javascript':'text/html',body}); } catch { await route.fulfill({status:404,body:'not found'}); }
  });
  await page.route('https://api.ylm.co.il/**', async route => {
    const req=route.request(), key=keyFor(req.url()), n=++sequence; calls.push({key,url:req.url(),method:req.method(),body:req.postData(),authorization:req.headers().authorization||null,n});
    if (!key) return route.abort('blockedbyclient');
    if (currentFailMode==='marker' && key.startsWith('MilgamDashboardCurrent')) return route.fulfill({status:500,contentType:'application/json',body:'{"secret":"PERSONAL_MARKER_9f3a","internal":"INTERNAL_MARKER_2d7b"}'});
    if (currentFailMode==='401' && key.startsWith('MilgamDashboardCurrent')) return route.fulfill({status:401,contentType:'application/json',body:'{"secret":"PERSONAL_MARKER_9f3a"}'});
    if (delays && key.startsWith('MilgamDashboardCurrent')) await new Promise(r=>setTimeout(r, Math.max(0,180-n*8)));
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(fixtures[key])});
  });
  await page.goto(`${host}index.html?preview=${encodeURIComponent(preview)}`, {waitUntil:'domcontentloaded'});
  const frame = await waitFrame(page); await frame.locator('#snapshot-content').getByText('10,000').waitFor({timeout:25000});
  return {name,context,page,frame,calls,consoleMessages,pageErrors,setFailMode:v=>currentFailMode=v};
}
async function waitFrame(page){for(let i=0;i<100;i++){const f=page.frames().find(x=>x.url().startsWith(preview));if(f)return f;await page.waitForTimeout(100)}throw Error('preview frame missing')}
const current = x => x.calls.filter(c=>c.key?.startsWith('MilgamDashboardCurrent'));
const errors = x => ({console:x.consoleMessages.filter(m=>m.type==='error'),pageErrors:x.pageErrors});

const browser = await chromium.launch({executablePath:'/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell',headless:true,args:['--no-sandbox']}); result.browser=await browser.version();
const response=await (await browser.newContext()).request.get(preview); result.headers=response.headers();

for (const spec of [{name:'desktop-rtl',viewport:{width:1440,height:900},dir:'rtl'},{name:'desktop-ltr',viewport:{width:1440,height:900},dir:'ltr'},{name:'mobile-rtl',viewport:{width:390,height:844},dir:'rtl'},{name:'mobile-ltr',viewport:{width:390,height:844},dir:'ltr'}]) {
  const t=performance.now(), x=await make(spec), renderMs=performance.now()-t, initial=current(x).length, before=await x.frame.locator('#snapshot-content').innerText();
  await x.frame.locator('#month-select').selectOption('9'); await x.frame.waitForTimeout(250);
  const geometry=await x.frame.evaluate(()=>{const s=document.querySelector('#snapshot-region');const focusables=[...document.querySelectorAll('button,select,a[href]')];return{dir:document.documentElement.dir,docScrollWidth:document.documentElement.scrollWidth,docClientWidth:document.documentElement.clientWidth,snapshotNodes:s.querySelectorAll('*').length,inlineStyles:s.querySelectorAll('[style]').length,allInlineStyles:document.querySelectorAll('[style]').length,visibleSvgs:[...document.querySelectorAll('svg')].filter(e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0).length,focusableNames:focusables.map(e=>e.getAttribute('aria-label')||e.innerText||e.id),clipped:[...document.querySelectorAll('button,select')].filter(e=>{const r=e.getBoundingClientRect();return r.left<0||r.right>innerWidth}).map(e=>e.id||e.innerText)} });
  await x.page.screenshot({path:new URL(`./evidence/${spec.name}.png`,import.meta.url).pathname,fullPage:true});
  result.scenarios.push({...spec,renderMs,currentCalls:initial,exactBodies:current(x).every(c=>c.method==='POST'&&c.body==='{}'),dateChangeCurrentCalls:current(x).length-initial,snapshotStable:before===await x.frame.locator('#snapshot-content').innerText(),geometry,...errors(x)}); await x.context.close();
}

{
  const x=await make({name:'permit-burst'}), buttons=x.frame.locator('[data-permit]'); await x.page.evaluate(()=>controllerHarness.holdCommand()); await buttons.first().focus(); await x.frame.evaluate(()=>{const bs=[...document.querySelectorAll('[data-permit]')];for(let i=0;i<20;i++)bs[i%bs.length].click()}); await x.page.waitForTimeout(30); const disabledPending=await buttons.first().isDisabled(); await x.page.evaluate(()=>controllerHarness.releaseCommand()); await x.page.waitForTimeout(400);
  result.scenarios.push({name:'permit-burst',harness:await x.page.evaluate(()=>controllerHarness.state()),activeId:await x.frame.evaluate(()=>document.activeElement?.getAttribute('data-permit')||document.activeElement?.id||document.activeElement?.tagName),disabledPending,disabledAfter:await buttons.first().isDisabled(),...errors(x)}); await x.context.close();
}
{
  const x=await make({name:'refresh-burst',delays:true}); const b=x.frame.locator('#snapshot-refresh'); for(let i=0;i<10;i++) await b.click({force:true}); await x.page.waitForTimeout(900);
  result.scenarios.push({name:'refresh-burst',currentCalls:current(x).length,content:(await x.frame.locator('#snapshot-content').innerText()).slice(0,500),...errors(x)}); await x.context.close();
}
{
  const x=await make({name:'marker-errors'}); x.setFailMode('marker'); await x.frame.locator('#snapshot-refresh').click(); await x.page.waitForTimeout(500); const serialized=JSON.stringify(x.consoleMessages)+JSON.stringify(x.pageErrors);
  result.scenarios.push({name:'marker-errors',markerLeaked:/PERSONAL_MARKER|INTERNAL_MARKER/.test(serialized),consoleMessages:x.consoleMessages,pageErrors:x.pageErrors}); await x.context.close();
}
{
  const x=await make({name:'revocation'}), before=await x.frame.locator('#snapshot-content').innerText(); await x.page.evaluate(()=>controllerHarness.holdCommand()); await x.frame.locator('[data-permit]').first().click(); await x.page.waitForTimeout(100); await x.page.evaluate(()=>controllerHarness.revoke()); const callsBefore=current(x).length; await x.page.evaluate(()=>controllerHarness.releaseCommand()); await x.frame.locator('#snapshot-refresh').click({force:true}).catch(()=>{}); await x.page.waitForTimeout(400);
  const revoked={harness:await x.page.evaluate(()=>controllerHarness.state()),newCalls:current(x).length-callsBefore,retained:(await x.frame.locator('#snapshot-content').innerText()).includes('10,000'),hash:await x.page.evaluate(()=>location.hash)};
  await x.page.evaluate(()=>controllerHarness.reenter()); await x.page.waitForTimeout(1000); const callsPreFresh=current(x).length; await x.frame.locator('#snapshot-refresh').click({force:true}); await x.page.waitForTimeout(500);
  result.scenarios.push({name:'revocation-reentry',revoked,freshGeneration:(await x.page.evaluate(()=>controllerHarness.state())).generation,freshCalls:current(x).length-callsPreFresh,...errors(x)}); await x.context.close();
}
{
  const context=await browser.newContext({viewport:{width:390,height:844}}), page=await context.newPage(), api=[]; page.on('request',r=>{if(r.url().includes('api.ylm.co.il'))api.push(r.url())}); await page.goto(preview,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500); result.scenarios.push({name:'direct-access',apiRequests:api.length}); await context.close();
}

result.executableRequests=[...new Set(result.executableRequests)]; result.blockedRequests=[...new Set(result.blockedRequests)];
await browser.close(); await fs.writeFile(new URL('./evidence/browser-results.json',import.meta.url),JSON.stringify(result,null,2)); console.log(JSON.stringify(result,null,2));
