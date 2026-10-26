const { chromium } = require('/usr/local/lib/node_modules/@playwright/test/node_modules/playwright');
const fs = require('fs');
const preview = 'https://c9756759.app-milgam-dashboard.pages.dev/';
const parentUrl = 'https://simplylog.ylm.co.il/perf-harness';
const apiOrigin = 'https://api.ylm.co.il';
const output = process.argv[2];

const equipmentItems = Array.from({ length: 10000 }, (_, index) => {
  const id = index + 1;
  return { EquipmentId:id, LocationEntityId:id+10000, LocationEntityType:1, LocationPath:`20,0/${id+10000},1`, EquipmentTypeId:(id%8)+1,
    IsActive:id%5!==0, TreatmentDaysInterval:id%3?30:null, NextTreatmentDate:id%3?'2026-11-24T00:00:00':null,
    LastTreatmentEventId:id%7?id+50000:null, LastTreatmentDate:id%7?'2026-10-20T10:00:00':null,
    LastTreatmentSeverityId:id%7?1:null, LastTreatmentStatus:id%7?1:null, TreatmentCategoryId:id%3?10487:null,
    ValidTreatmentSeverityId:id%3?1:null, AsOf:'2026-10-25T10:00:00' };
});
const fixtures = {
  MilgamDashboardCurrentEvents:{Items:[
    {ScopeKey:'overall',TotalCount:100,OpenCount:20,AsOf:'2026-10-25T10:00:00'},
    {ScopeKey:'headquarters',TotalCount:40,OpenCount:8,AsOf:'2026-10-25T10:00:00'},
    {ScopeKey:'branches',TotalCount:60,OpenCount:12,AsOf:'2026-10-25T10:00:00'}],TotalCount:3},
  MilgamDashboardCurrentPermits:{Items:[{ValidCount:70,MissingCount:5,OverdueCount:9,AsOf:'2026-10-25T10:00:00',ValueDate:'2026-10-25T00:00:00'}],TotalCount:1},
  MilgamDashboardCurrentEquipment:{Items:equipmentItems,TotalCount:equipmentItems.length},
  MilgamDashboardByMonth:{Items:[],TotalCount:0}
};

async function measure(browser, viewport) {
  const context = await browser.newContext({viewport,ignoreHTTPSErrors:true});
  const page = await context.newPage();
  const calls=[], responses=[], consoleErrors=[], executable=[]; let csp=null;
  let inFlight=0, maxInFlight=0;
  await context.addInitScript(() => {
    globalThis.__hostCalls=[]; globalThis.__longTasks=[];
    new PerformanceObserver(list => { for (const e of list.getEntries()) globalThis.__longTasks.push({startTime:e.startTime,duration:e.duration}); }).observe({type:'longtask',buffered:true});
    globalThis.SimplyVibeHostAdapter={
      ready:async()=>{globalThis.__hostCalls.push({type:'ready',at:performance.now()});await new Promise(r=>setTimeout(r,75));},
      executeCommand:async(name,parameter)=>globalThis.__hostCalls.push({type:'command',name,parameter,at:performance.now()}),
      ToDisplayDate:value=>String(value)
    };
  });
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
  page.on('request',r=>{if(['script','stylesheet'].includes(r.resourceType()))executable.push({url:r.url(),type:r.resourceType()})});
  page.on('response',r=>{if(r.url()===preview)csp=r.headers()['content-security-policy']||null});
  await page.route(parentUrl,r=>r.fulfill({contentType:'text/html',body:`<!doctype html><iframe id="app" src="${preview}" style="width:100%;height:100vh;border:0"></iframe><script>document.querySelector('#app').addEventListener('load',()=>setTimeout(()=>document.querySelector('#app').contentWindow.postMessage({ApiAddress:'${apiOrigin}',Token:{access_token:'synthetic-performance-token',token_type:'Bearer'},LanguageCode:'he',LanguageDirection:'rtl'},'*'),50))</script>`}));
  await page.route(`${apiOrigin}/api/Entity/**`,async route=>{
    const req=route.request(), name=new URL(req.url()).pathname.split('/').at(-2), body=req.postData()||'';
    const started=Date.now(); inFlight++; maxInFlight=Math.max(maxInFlight,inFlight); calls.push({name,method:req.method(),body,started});
    const json=JSON.stringify(fixtures[name]||{Items:[],TotalCount:0}); await new Promise(r=>setTimeout(r,40));
    await route.fulfill({status:200,contentType:'application/json',body:json}); inFlight--; responses.push({name,bytes:Buffer.byteLength(json),elapsedMs:Date.now()-started,at:Date.now()});
  });
  const navStart=Date.now(); await page.goto(parentUrl,{waitUntil:'domcontentloaded'});
  const frame=await (await page.waitForSelector('#app')).contentFrame();
  await frame.waitForFunction(()=>document.querySelector('.equipment-total strong')||document.querySelector('#snapshot-refresh')?.disabled,{timeout:10000});
  const initial=await frame.evaluate(()=>{const region=document.querySelector('#snapshot-region'),rect=region.getBoundingClientRect();return {snapshotElements:region.querySelectorAll('*').length,totalDocumentElements:document.querySelectorAll('*').length,width:rect.width,scrollWidth:region.scrollWidth,documentScrollWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,equipmentText:document.querySelector('.equipment-total strong')?.textContent||null,status:document.querySelector('#snapshot-status')?.textContent||'',refreshDisabled:document.querySelector('#snapshot-refresh')?.disabled};});
  const initialCalls=calls.slice(); const initialReadyMs=Date.now()-navStart;
  if (initial.refreshDisabled && !initial.equipmentText) {
    const hostCalls=await frame.evaluate(()=>globalThis.__hostCalls), longTasks=await frame.evaluate(()=>globalThis.__longTasks);
    await Promise.race([context.close(),new Promise(resolve=>setTimeout(resolve,2000))]);
    return {viewport,initialReadyMs,initial,initialCalls,maxInFlight,responses,hostCalls,longTasks,consoleErrors,executable,csp,workflow:'snapshot-disabled'};
  }
  const beforeRefresh=calls.length, refreshStart=Date.now(); await frame.locator('#snapshot-refresh').click();
  await frame.waitForFunction(()=>document.querySelector('#snapshot-refresh')?.disabled===false,null,{timeout:30000});
  const refreshCalls=calls.slice(beforeRefresh), refreshMs=Date.now()-refreshStart;
  const beforeBurst=calls.length; await frame.evaluate(()=>{const b=document.querySelector('#snapshot-refresh');for(let i=0;i<10;i++)b.click()});
  await frame.waitForFunction(()=>document.querySelector('#snapshot-refresh')?.disabled===false,null,{timeout:30000});
  const burstCalls=calls.slice(beforeBurst);
  await frame.evaluate(()=>{for(const b of document.querySelectorAll('[data-permit]'))for(let i=0;i<7;i++)b.click()}); await page.waitForTimeout(200);
  const hostCalls=await frame.evaluate(()=>globalThis.__hostCalls), longTasks=await frame.evaluate(()=>globalThis.__longTasks);
  await Promise.race([context.close(),new Promise(resolve=>setTimeout(resolve,2000))]);
  return {viewport,initialReadyMs,initial,initialCalls,refreshMs,refreshCalls,burstCalls,maxInFlight,responses,hostCalls,longTasks,consoleErrors,executable,csp};
}
(async()=>{const browser=await chromium.launch({executablePath:'/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell',headless:true,args:['--no-sandbox']});const results=[];for(const viewport of [{width:390,height:844},{width:1440,height:900}])results.push(await measure(browser,viewport));const data={measuredAt:new Date().toISOString(),preview,commit:'50972d0b555115d3b1c9da90f7df0dc4790c6e8e',browserVersion:await browser.version(),node:process.version,equipmentRows:equipmentItems.length,results};fs.writeFileSync(output,JSON.stringify(data,null,2));await Promise.race([browser.close(),new Promise(resolve=>setTimeout(resolve,2000))]);process.exit(0);})().catch(e=>{console.error(e);process.exit(1)});
