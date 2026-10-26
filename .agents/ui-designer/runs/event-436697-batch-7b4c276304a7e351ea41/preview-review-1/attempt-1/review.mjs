import playwright from '/usr/local/lib/node_modules/@playwright/test/node_modules/playwright/index.js';
import fs from 'node:fs';
import path from 'node:path';
const { chromium } = playwright;
const preview = 'https://02ea3f16.app-milgam-dashboard.pages.dev';
const expectedCommit = '3b3f8d4373ff90c2073fb4e884e1fe622a8595a0';
const fixtureRoot = '/workspace/.simplyvibe/input/controller-host-harness';
const out = '/workspace/src/apps/milgam-dashboard/.agents/ui-designer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-1/attempt-1/evidence';
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
async function run(name,viewport,locale='he') {
 const context=await browser.newContext({viewport,deviceScaleFactor:1});
 const calls=[], executable=[], consoleMessages=[], pageErrors=[];
 await context.route('https://milgam.ylm.co.il/controller-host-fixture/**',route=>{
   const url=new URL(route.request().url()); const rel=url.pathname.replace('/controller-host-fixture/','') || 'index.html';
   const file=path.join(fixtureRoot,rel); if(!file.startsWith(fixtureRoot)||!fs.existsSync(file)) return route.abort();
   const ext=path.extname(file); const contentType=ext==='.js'?'text/javascript':ext==='.html'?'text/html':'application/octet-stream';
   return route.fulfill({status:200,contentType,body:fs.readFileSync(file)});
 });
 await context.route('https://api.ylm.co.il/**',async route=>{const req=route.request();const key=Object.keys(fixtures).find(k=>req.url().includes(k));calls.push({url:req.url(),method:req.method(),body:req.postData(),key});await route.fulfill({status:key?200:404,contentType:'application/json',body:JSON.stringify(key?fixtures[key]:{error:'unknown'})});});
 const page=await context.newPage();
 page.on('console',m=>consoleMessages.push(`${m.type()}: ${m.text()}`)); page.on('pageerror',e=>pageErrors.push(e.message));
 page.on('request',r=>{if(['script','worker'].includes(r.resourceType())) executable.push(r.url());});
 await page.goto(`https://milgam.ylm.co.il/controller-host-fixture/index.html?preview=${encodeURIComponent(preview)}`);
 await page.waitForTimeout(7000); const frame=page.frameLocator('#guest');
 if(locale==='en') await frame.locator('html').evaluate(el=>{el.dir='ltr';el.lang='en';});
 const permit=frame.locator('[data-permit="missing"]'); const hasPermit=await permit.count()>0;
 if(hasPermit){await permit.focus();await permit.click();await page.waitForTimeout(500);}
 const metrics=await frame.locator('body').evaluate(body=>{const charts=[...document.querySelectorAll('.donut,.donut-chart,.stacked-bar,.bar-fill,[class*="donut"],[class*="bar"]')];return {dir:document.documentElement.dir,lang:document.documentElement.lang,bodyText:body.innerText,snapshotText:document.querySelector('#snapshot-region')?.innerText,snapshotElements:document.querySelectorAll('#snapshot-region *').length,scrollWidth:body.scrollWidth,clientWidth:body.clientWidth,inlineStyles:[...document.querySelectorAll('[style]')].map(x=>({tag:x.tagName,cls:String(x.className),style:x.getAttribute('style')})),permitLabels:[...document.querySelectorAll('[data-permit]')].map(x=>x.getAttribute('aria-label')),activePermit:document.activeElement?.getAttribute('data-permit'),statusRegions:[...document.querySelectorAll('[role="status"],[aria-live]')].map(x=>({role:x.getAttribute('role'),live:x.getAttribute('aria-live'),text:x.textContent.trim()})),chartRects:charts.map(x=>({cls:String(x.className),w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height,background:getComputedStyle(x).backgroundImage,backgroundColor:getComputedStyle(x).backgroundColor}))};});
 metrics.harness=await page.evaluate(()=>window.controllerHarness?.state?.()); metrics.hash=await page.evaluate(()=>location.hash); metrics.calls=calls; metrics.consoleMessages=consoleMessages; metrics.pageErrors=pageErrors; metrics.executable=[...new Set(executable)];
 await page.screenshot({path:`${out}/${name}.png`,fullPage:true}); await context.close(); return metrics;
}
const response=await fetch(preview); const results={preview,expectedCommit,browserVersion:browser.version(),headers:Object.fromEntries(response.headers),desktopRtl:await run('preview-desktop-rtl',{width:1440,height:900}),mobileRtl:await run('preview-mobile-rtl',{width:390,height:844}),desktopLtr:await run('preview-desktop-ltr',{width:1440,height:900},'en')};
fs.writeFileSync(`${out}/playwright-results.json`,JSON.stringify(results,null,2)); await browser.close();
