const { chromium } = require('/usr/local/lib/node_modules/@playwright/test/node_modules/playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');

const PREVIEW = 'https://1de11912.app-milgam-dashboard.pages.dev';
const OUT = '/workspace/src/apps/milgam-dashboard/.agents/qc-tester/runs/event-436697-batch-64aedcef61f479aaf509/preview-review-2/evidence';
const TOKEN = 'synthetic-qc-token';
const evidence = { preview: PREVIEW, chromium: '', scenarios: [], requests: [], console: [], pageErrors: [] };

const fixtures = {
  MilgamDashboardCurrentEvents: { Items: [
    { ScopeKey:'overall', TotalCount:12, OpenCount:5, AsOf:'2026-09-23T08:00:00' },
    { ScopeKey:'headquarters', TotalCount:4, OpenCount:2, AsOf:'2026-09-23T08:00:00' },
    { ScopeKey:'branches', TotalCount:8, OpenCount:3, AsOf:'2026-09-23T08:00:00' }
  ], TotalCount:3 },
  MilgamDashboardCurrentPermits: { Items:[{ ValidCount:7, MissingCount:2, OverdueCount:1, AsOf:'2026-09-23T08:00:00', ValueDate:'2026-09-23' }], TotalCount:1 },
  MilgamDashboardCurrentEquipment: { Items:[{ EquipmentId:101, LocationEntityId:1, LocationEntityType:1, LocationPath:'1,1', EquipmentTypeId:3, IsActive:false, TreatmentDaysInterval:null, NextTreatmentDate:null, LastTreatmentEventId:null, LastTreatmentDate:null, LastTreatmentSeverityId:null, LastTreatmentStatus:null, TreatmentCategoryId:null, ValidTreatmentSeverityId:null, AsOf:'2026-09-23T08:00:00' }], TotalCount:1 },
  MilgamDashboardByMonth: { Items:[{Year:2025,Month:12,Label:'12/25',EventCount:2},{Year:2026,Month:1,Label:'1/26',EventCount:5}], TotalCount:2 },
  MilgamDashboardByDivision: { Items:[{DivisionName:'חטיבה א',EventCount:3},{DivisionName:'חטיבה ב',EventCount:2}], TotalCount:2 },
  MilgamDashboardSummary: { Items:[
    {ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,EventCount:3,ClosedCount:2,EligibleDurationCount:1,InvalidDurationCount:1,AverageCloseDays:2},
    {ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,EventCount:2,ClosedCount:1,EligibleDurationCount:1,InvalidDurationCount:0,AverageCloseDays:4}
  ], TotalCount:2 },
  MilgamDashboardByCategory: { Items:[
    {ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,CategoryName:'אחזקה',EventCount:3},
    {ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,CategoryName:'ניקיון',EventCount:2}
  ], TotalCount:2 },
  MilgamDashboardClosureByCategory: { Items:[
    {ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,CategoryName:'אחזקה',ClosedCount:2,EligibleDurationCount:1,InvalidDurationCount:1,AverageCloseDays:2},
    {ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,CategoryName:'ניקיון',ClosedCount:1,EligibleDurationCount:1,InvalidDurationCount:0,AverageCloseDays:4}
  ], TotalCount:2 }
};

function keyFor(url) { return Object.keys(fixtures).find(k => url.includes(`/api/Entity/${k}/Search`)); }
async function makePage(browser, { dir='rtl', viewport={width:390,height:844}, failCurrent=0, delayedNavigation=false }={}) {
  const context = await browser.newContext({ viewport, ignoreHTTPSErrors:true });
  const page = await context.newPage();
  const routeState = { failuresLeft: failCurrent };
  page.on('console', m => { if (['error','warning'].includes(m.type())) evidence.console.push({type:m.type(), text:m.text()}); });
  page.on('pageerror', e => evidence.pageErrors.push(String(e)));
  await page.addInitScript(({delayedNavigation}) => {
    globalThis.__qcHostCalls = [];
    globalThis.SimplyVibeHostAdapter = {
      ready: async () => { globalThis.__qcHostCalls.push({method:'ready'}); },
      executeCommand: async (name, parameter) => { globalThis.__qcHostCalls.push({method:'executeCommand',name,parameter}); if (delayedNavigation) return new Promise((resolve,reject)=>{ globalThis.__qcResolveNav=resolve; globalThis.__qcRejectNav=reject; }); },
      ToDisplayDate: (value) => { globalThis.__qcHostCalls.push({method:'ToDisplayDate',value}); return `DISPLAY(${value})`; }
    };
  }, {delayedNavigation});
  await page.route('https://localhost:5500/**', route => route.fulfill({status:200,contentType:'text/html',body:`<!doctype html><iframe id="app" src="${PREVIEW}" style="position:fixed;inset:0;width:100%;height:100%;border:0"></iframe>`}));
  await page.route('https://localhost:5721/**', async route => {
    const req = route.request(); const key = keyFor(req.url());
    evidence.requests.push({ key, method:req.method(), body:req.postData(), authorization:req.headers().authorization || null });
    if (!key) return route.fulfill({status:404,body:'not found',headers:{'access-control-allow-origin':PREVIEW}});
    if (routeState.failuresLeft > 0 && key.startsWith('MilgamDashboardCurrent')) { routeState.failuresLeft--; return route.fulfill({status:500,contentType:'application/json',body:'{"error":"synthetic"}',headers:{'access-control-allow-origin':PREVIEW}}); }
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(fixtures[key]),headers:{'access-control-allow-origin':PREVIEW,'access-control-allow-headers':'authorization,content-type'}});
  });
  await page.goto('https://localhost:5500/harness');
  const frame = page.frames().find(f => f.url().startsWith(PREVIEW));
  assert(frame, 'preview iframe missing');
  await frame.waitForLoadState('domcontentloaded');
  await page.locator('#app').evaluate((iframe, payload) => iframe.contentWindow.postMessage(payload, 'https://1de11912.app-milgam-dashboard.pages.dev'), {
    ApiAddress:'https://localhost:5721', Token:{access_token:TOKEN,token_type:'Bearer'}, LanguageCode:dir==='rtl'?'he':'en', LanguageDirection:dir, ApplicationName:'QC fixture'
  });
  return {context,page,frame,setFailures:(count)=>{routeState.failuresLeft=count;}};
}

async function waitReady(frame) {
  await frame.locator('#snapshot-content .snapshot-grid').waitFor({timeout:15000});
  await frame.locator('#dashboard .dashboard-grid').first().waitFor({timeout:15000});
}

async function geometry(frame) {
  return frame.evaluate(() => {
    const els = [...document.querySelectorAll('body *')];
    const overflow = els.filter(e => { const r=e.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1; }).map(e => ({tag:e.tagName,cls:e.className,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right})).slice(0,20);
    return { innerWidth, scrollWidth:document.documentElement.scrollWidth, overflow, snapshotElements:document.querySelector('#snapshot-region').querySelectorAll('*').length, dir:document.documentElement.dir, lang:document.documentElement.lang };
  });
}

(async () => {
  fs.rmSync(OUT, {recursive:true,force:true}); fs.mkdirSync(OUT,{recursive:true});
  const browser = await chromium.launch({headless:true,executablePath:'/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell'});
  evidence.chromium = await browser.version();
  try {
    for (const spec of [
      {name:'phone-rtl',dir:'rtl',viewport:{width:320,height:844}},
      {name:'tablet-ltr',dir:'ltr',viewport:{width:768,height:900}},
      {name:'desktop-rtl',dir:'rtl',viewport:{width:1440,height:900}}
    ]) {
      const {context,page,frame}=await makePage(browser,spec); await waitReady(frame);
      const g=await geometry(frame); assert.equal(g.scrollWidth,g.innerWidth); assert.equal(g.overflow.length,0); assert.equal(g.dir,spec.dir);
      const permitNames=await frame.locator('[data-permit]').evaluateAll(bs=>bs.map(b=>b.getAttribute('aria-label'))); assert.equal(new Set(permitNames).size,3);
      const targetSizes=await frame.locator('button,select,a[href]').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {name:e.getAttribute('aria-label')||e.textContent.trim().slice(0,40),width:r.width,height:r.height}}));
      const before=await frame.evaluate(()=>globalThis.__qcHostCalls.length);
      await frame.locator('[data-permit="valid"]').focus(); await frame.locator('[data-permit="valid"]').press('Enter');
      await frame.waitForTimeout(100);
      const calls=await frame.evaluate(()=>globalThis.__qcHostCalls.slice());
      const nav=calls.filter(x=>x.method==='executeCommand'); assert.deepEqual(nav.at(-1),{method:'executeCommand',name:'Navigate',parameter:{Url:'#/Permits/Dashboard'}});
      const rawDates=calls.filter(x=>x.method==='ToDisplayDate').map(x=>x.value); assert(rawDates.includes('2026-09-23T08:00:00') && rawDates.includes('2026-09-23'));
      const focused=await frame.locator('[data-permit="valid"]').evaluate(e=>document.activeElement===e); assert(focused);
      await page.screenshot({path:`${OUT}/${spec.name}.png`,fullPage:true});
      evidence.scenarios.push({...spec,geometry:g,permitNames,targetSizes,hostCallDelta:calls.length-before,rawDates}); await context.close();
    }

    const baseReq=evidence.requests.length;
    const {context,page,frame}=await makePage(browser,{viewport:{width:390,height:844},failCurrent:3});
    await frame.locator('[data-snapshot-retry]').waitFor({timeout:15000});
    const initialText=await frame.locator('#snapshot-status').innerText(); assert(initialText.includes('לא ניתן לטעון')); assert.equal(await frame.locator('#snapshot-content').innerText(),'');
    await frame.locator('[data-snapshot-retry]').click(); await waitReady(frame);
    const current=evidence.requests.slice(baseReq).filter(r=>r.key?.startsWith('MilgamDashboardCurrent')); assert.equal(current.length,6); assert(current.every(r=>r.body==='{}'));
    evidence.scenarios.push({name:'initial-failure-retry',initialText,currentRequests:current.length,recovered:true});
    await page.screenshot({path:`${OUT}/recovered-phone.png`,fullPage:true}); await context.close();

    const rapid=await makePage(browser,{viewport:{width:390,height:844},delayedNavigation:true}); await waitReady(rapid.frame);
    await rapid.frame.locator('[data-permit]').first().evaluate((button)=>{ for(let i=0;i<20;i++) button.click(); });
    await rapid.frame.waitForTimeout(100);
    const pendingCalls=await rapid.frame.evaluate(()=>globalThis.__qcHostCalls.slice());
    assert.equal(pendingCalls.filter(x=>x.method==='ready').length,1); assert.equal(pendingCalls.filter(x=>x.method==='executeCommand').length,1);
    assert(await rapid.frame.locator('[data-permit]').evaluateAll(bs=>bs.every(b=>b.disabled&&b.getAttribute('aria-busy')==='true')));
    await rapid.frame.evaluate(()=>globalThis.__qcRejectNav(new Error('synthetic rejection'))); await rapid.frame.waitForTimeout(100);
    assert((await rapid.frame.locator('#snapshot-status').innerText()).includes('לא ניתן לפתוח'));
    assert(await rapid.frame.locator('[data-permit]').evaluateAll(bs=>bs.every(b=>!b.disabled&&!b.hasAttribute('aria-busy'))));
    evidence.scenarios.push({name:'navigation-lock-rejection',activations:20,readyCalls:1,navigateCalls:1,recovered:true}); await rapid.context.close();

    const stale=await makePage(browser,{viewport:{width:390,height:844}}); await waitReady(stale.frame);
    const beforePeriod=evidence.requests.filter(r=>r.key?.startsWith('MilgamDashboardCurrent')).length;
    await stale.frame.locator('#year-select').selectOption('2025'); await stale.frame.locator('#dashboard .dashboard-grid').first().waitFor();
    const afterPeriod=evidence.requests.filter(r=>r.key?.startsWith('MilgamDashboardCurrent')).length; assert.equal(afterPeriod,beforePeriod);
    stale.setFailures(3); await stale.frame.locator('#snapshot-refresh').click(); await stale.frame.locator('[data-snapshot-retry]').waitFor();
    const staleText=await stale.frame.locator('#snapshot-status').innerText(); assert(staleText.includes('העדכון התקין האחרון')); assert((await stale.frame.locator('#snapshot-content').innerText()).includes('12 סה״כ'));
    evidence.scenarios.push({name:'period-independent-stale-refresh',currentRequestsOnPeriodChange:afterPeriod-beforePeriod,staleText,lastGoodRetained:true}); await stale.context.close();

    const currentRequests=evidence.requests.filter(r=>r.key?.startsWith('MilgamDashboardCurrent'));
    assert(currentRequests.every(r=>r.method==='POST'&&r.body==='{}'&&r.authorization===`Bearer ${TOKEN}`));
    assert(evidence.pageErrors.every(x=>x.includes("Cannot read properties of null (reading 'focus')")));
  } finally { await browser.close(); }
  fs.writeFileSync(`${OUT}/browser-results.json`, JSON.stringify(evidence,null,2));
  console.log(JSON.stringify({ok:true,chromium:evidence.chromium,scenarios:evidence.scenarios.length,requests:evidence.requests.length,console:evidence.console.length,pageErrors:evidence.pageErrors.length},null,2));
})().catch(e => { evidence.failure={message:e.message,stack:e.stack}; fs.mkdirSync(OUT,{recursive:true}); fs.writeFileSync(`${OUT}/browser-results.json`,JSON.stringify(evidence,null,2)); console.error(e); process.exitCode=1; });
