import playwright from '/usr/local/lib/node_modules/@playwright/test/node_modules/playwright/index.js';
import fs from 'node:fs';
import path from 'node:path';

const { chromium } = playwright;
const preview = 'https://42ad1c5f.app-milgam-dashboard.pages.dev';
const expectedCommit = 'b138df3040ab4468220a29f595d0caa62920f679';
const fixtureOrigin = 'https://milgam.ylm.co.il';
const fixtureRoot = '/workspace/.simplyvibe/input/controller-host-harness';
const out = '/workspace/src/apps/milgam-dashboard/.agents/ui-designer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence';
fs.mkdirSync(out, { recursive: true });

const equipment = Array.from({length:10000},(_,i)=>({EquipmentId:i+1,LocationEntityId:1,LocationEntityType:1,LocationPath:'1,1',EquipmentTypeId:1,IsActive:true,TreatmentDaysInterval:null,NextTreatmentDate:null,LastTreatmentEventId:null,LastTreatmentDate:null,LastTreatmentSeverityId:null,LastTreatmentStatus:null,TreatmentCategoryId:null,ValidTreatmentSeverityId:null,AsOf:'2026-10-25T08:00:00'}));
const fixtures = {
 MilgamDashboardCurrentEvents:{Items:[{ScopeKey:'overall',TotalCount:128,OpenCount:14,AsOf:'2026-10-25T08:00:00'},{ScopeKey:'headquarters',TotalCount:50,OpenCount:6,AsOf:'2026-10-25T08:00:00'},{ScopeKey:'branches',TotalCount:78,OpenCount:8,AsOf:'2026-10-25T08:00:00'}],TotalCount:3},
 MilgamDashboardCurrentPermits:{Items:[{ValidCount:92,MissingCount:7,OverdueCount:4,AsOf:'2026-10-25T08:00:00',ValueDate:'2026-10-25'}],TotalCount:1},
 MilgamDashboardCurrentEquipment:{Items:equipment,TotalCount:10000},
 MilgamDashboardByMonth:{Items:[{Year:2026,Month:10,Label:'10/26',EventCount:128}],TotalCount:1},
 MilgamDashboardByDivision:{Items:[{DivisionName:'מטה',EventCount:50},{DivisionName:'סניפים',EventCount:78}],TotalCount:2},
 MilgamDashboardSummary:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,EventCount:50,ClosedCount:44,EligibleDurationCount:40,InvalidDurationCount:4,AverageCloseDays:2},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,EventCount:78,ClosedCount:70,EligibleDurationCount:65,InvalidDurationCount:5,AverageCloseDays:4}],TotalCount:2},
 MilgamDashboardByCategory:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,CategoryName:'אחזקה',EventCount:50},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,CategoryName:'ניקיון',EventCount:78}],TotalCount:2},
 MilgamDashboardClosureByCategory:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,CategoryName:'אחזקה',ClosedCount:44,EligibleDurationCount:40,InvalidDurationCount:4,AverageCloseDays:2},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,CategoryName:'ניקיון',ClosedCount:70,EligibleDurationCount:65,InvalidDurationCount:5,AverageCloseDays:4}],TotalCount:2}
};

const browser=await chromium.launch({executablePath:'/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell',headless:true});
async function setup(viewport,{ltr=false}={}) {
 const context=await browser.newContext({viewport,deviceScaleFactor:1});
 const calls=[],consoleMessages=[],pageErrors=[],aborted=[],executables=[];
 let currentFailure=null;
 await context.route('**/*',async route=>{
   const req=route.request(), url=new URL(req.url());
   if(url.origin===fixtureOrigin && url.pathname.startsWith('/controller-host-fixture/')){
     const rel=url.pathname.replace('/controller-host-fixture/','')||'index.html', file=path.join(fixtureRoot,rel);
     if(!file.startsWith(fixtureRoot)||!fs.existsSync(file)) return route.abort();
     let body=fs.readFileSync(file);
     if(ltr && rel==='host-fixture.js') body=Buffer.from(body.toString().replace('LanguageDirection: "rtl"','LanguageDirection: "ltr"'));
     return route.fulfill({status:200,contentType:path.extname(file)==='.js'?'text/javascript':'text/html',body});
   }
   if(url.origin==='https://api.ylm.co.il'){
     const key=Object.keys(fixtures).find(k=>req.url().includes(k));
     const record={key,status:200,body:req.postData(),authorization:req.headers().authorization||null,time:Date.now()};
     if(currentFailure && key===currentFailure.key){ record.status=currentFailure.status; calls.push(record); return route.fulfill({status:currentFailure.status,contentType:'application/json',body:JSON.stringify({marker:'PRIVATE-BODY-MARKER',detail:'internal address hidden'})}); }
     calls.push(record); return route.fulfill({status:key?200:404,contentType:'application/json',body:JSON.stringify(key?fixtures[key]:{error:'unknown'})});
   }
   if(url.origin===new URL(preview).origin) return route.continue();
   if(['data:','blob:'].includes(url.protocol)) return route.continue();
   aborted.push(req.url()); return route.abort();
 });
 const page=await context.newPage();
 page.on('console',m=>consoleMessages.push(`${m.type()}: ${m.text()}`));
 page.on('pageerror',e=>pageErrors.push(e.message));
 page.on('request',r=>{if(['script','worker'].includes(r.resourceType())) executables.push(r.url());});
 await page.goto(`${fixtureOrigin}/controller-host-fixture/index.html?preview=${encodeURIComponent(preview)}`);
 await page.waitForTimeout(3500);
 return {context,page,frame:page.frameLocator('#guest'),calls,consoleMessages,pageErrors,aborted,executables,setFailure:v=>{currentFailure=v;}};
}
async function snapshotMetrics(frame){
 return frame.locator('body').evaluate(body=>({
  dir:document.documentElement.dir,lang:document.documentElement.lang,bodyText:body.innerText,
  snapshotText:document.querySelector('#snapshot-content')?.innerText||'',status:document.querySelector('#snapshot-status')?.innerText||'',
  snapshotElements:document.querySelectorAll('#snapshot-region *').length,scrollWidth:body.scrollWidth,clientWidth:body.clientWidth,
  inlineStyleCount:document.querySelectorAll('[style]').length,
  permits:[...document.querySelectorAll('[data-permit]')].map(x=>({label:x.getAttribute('aria-label'),disabled:x.disabled,busy:x.getAttribute('aria-busy')})),
  buttons:[...document.querySelectorAll('button')].map(x=>({text:x.innerText.trim(),disabled:x.disabled})),
  focusVisible:document.activeElement?{text:document.activeElement.innerText?.trim(),outline:getComputedStyle(document.activeElement).outline,boxShadow:getComputedStyle(document.activeElement).boxShadow}:null,
  chartCount:document.querySelectorAll('.donut,.bar-fill,.stacked-segment').length,
  headings:[...document.querySelectorAll('h1,h2,h3')].map(x=>x.innerText.trim())
 }));
}

const desktop=await setup({width:1440,height:900});
const {page,frame,calls}=desktop;
await frame.locator('#snapshot-refresh').focus();
const initial=await snapshotMetrics(frame);
await page.screenshot({path:`${out}/preview-desktop-rtl.png`,fullPage:true});

desktop.setFailure({key:'MilgamDashboardCurrentEvents',status:500});
const before500=calls.length; await frame.locator('#snapshot-refresh').click(); await page.waitForTimeout(800);
const after500=await snapshotMetrics(frame);
await page.screenshot({path:`${out}/preview-stale-500-rtl.png`,fullPage:true});

desktop.setFailure({key:'MilgamDashboardCurrentEvents',status:401});
const before401=calls.length; await frame.locator('#snapshot-refresh').click(); await page.waitForTimeout(800);
const after401=await snapshotMetrics(frame); const countAfter401=calls.length;
await frame.locator('#snapshot-refresh').click(); await page.waitForTimeout(500); const countAfterDeniedRetry=calls.length;
desktop.setFailure(null); await page.evaluate(()=>window.controllerHarness.reenter()); await page.waitForTimeout(1800);
const afterReentry=await snapshotMetrics(frame); const countAfterReentry=calls.length;
await page.screenshot({path:`${out}/preview-reentry-recovered-rtl.png`,fullPage:true});

await page.evaluate(()=>window.controllerHarness.holdCommand());
const permit=frame.locator('[data-permit]').first();
await permit.focus();
await permit.evaluate(el=>{for(let i=0;i<20;i++) el.click();});
await page.waitForTimeout(250); const pendingPermit=await snapshotMetrics(frame);
await page.evaluate(()=>window.controllerHarness.releaseCommand()); await page.waitForTimeout(600);
const effectsAfterBurst=await page.evaluate(()=>window.controllerHarness.state().effects);

const mobile=await setup({width:390,height:844});
await mobile.frame.locator('[data-permit]').first().focus();
const mobileMetrics=await snapshotMetrics(mobile.frame); await mobile.page.screenshot({path:`${out}/preview-mobile-rtl.png`,fullPage:true});
const ltr=await setup({width:1440,height:900},{ltr:true});
const ltrMetrics=await snapshotMetrics(ltr.frame); await ltr.page.screenshot({path:`${out}/preview-desktop-ltr.png`,fullPage:true});

const race=await setup({width:1440,height:900});
await race.page.evaluate(()=>window.controllerHarness.holdCommand());
await race.frame.locator('[data-permit]').first().click();
await race.page.waitForTimeout(100);
await race.page.evaluate(()=>{ window.controllerHarness.revoke(); window.controllerHarness.releaseCommand(); window.controllerHarness.reenter(); queueMicrotask(()=>window.controllerHarness.reenter()); });
await race.page.waitForTimeout(1800);
const raceMetrics=await snapshotMetrics(race.frame);
const raceState=await race.page.evaluate(()=>window.controllerHarness.state());

const response=await fetch(preview);
const results={preview,expectedCommit,browserVersion:browser.version(),headers:Object.fromEntries(response.headers),sdkSha256:'ee67f5ae15c70fee8443701b4391946a2275d922acdf9d1797c69dad3c414bf1',initial,after500,after401,afterReentry,pendingPermit,effectsAfterBurst,
 lifecycle:{before500,after500Calls:calls.length-before500,before401,countAfter401,deniedRetryNewCalls:countAfterDeniedRetry-countAfter401,reentryNewCalls:countAfterReentry-countAfterDeniedRetry,allCalls:calls},
 desktopRuntime:{consoleMessages:desktop.consoleMessages,pageErrors:desktop.pageErrors,aborted:[...new Set(desktop.aborted)],executables:[...new Set(desktop.executables)]},mobile:mobileMetrics,mobileRuntime:{consoleMessages:mobile.consoleMessages,pageErrors:mobile.pageErrors},ltr:ltrMetrics,ltrRuntime:{consoleMessages:ltr.consoleMessages,pageErrors:ltr.pageErrors},race:{metrics:raceMetrics,state:raceState,calls:race.calls,pageErrors:race.pageErrors,consoleMessages:race.consoleMessages}};
fs.writeFileSync(`${out}/playwright-results.json`,JSON.stringify(results,null,2));
await desktop.context.close(); await mobile.context.close(); await ltr.context.close(); await race.context.close(); await browser.close();
