import playwright from '../../../tmp/playwright/node_modules/playwright-core/index.js';
import fs from 'node:fs/promises';
const { chromium } = playwright;

const preview = 'https://c9756759.app-milgam-dashboard.pages.dev';
const expectedCommit = '50972d0b555115d3b1c9da90f7df0dc4790c6e8e';
const out = new URL('./evidence/', import.meta.url);
const browser = await chromium.launch({ executablePath:'/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell', headless:true, args:['--no-sandbox'] });
const result = { preview, expectedCommit, browser:await browser.version(), responseHeaders:{}, executableRequests:[], scenarios:[] };

const fixtures = {
  MilgamDashboardCurrentEvents:{Items:[
    {ScopeKey:'overall',TotalCount:12,OpenCount:5,AsOf:'2026-10-25T09:00:00'},
    {ScopeKey:'headquarters',TotalCount:4,OpenCount:2,AsOf:'2026-10-25T09:00:00'},
    {ScopeKey:'branches',TotalCount:8,OpenCount:3,AsOf:'2026-10-25T09:00:00'}],TotalCount:3},
  MilgamDashboardCurrentPermits:{Items:[{ValidCount:7,MissingCount:2,OverdueCount:1,AsOf:'2026-10-25T09:00:00',ValueDate:'2026-10-25'}],TotalCount:1},
  MilgamDashboardCurrentEquipment:{Items:[
    {EquipmentId:101,LocationEntityId:1,LocationEntityType:1,LocationPath:'1,1',EquipmentTypeId:5,IsActive:true,TreatmentDaysInterval:null,NextTreatmentDate:null,LastTreatmentEventId:null,LastTreatmentDate:null,LastTreatmentSeverityId:null,LastTreatmentStatus:null,TreatmentCategoryId:null,ValidTreatmentSeverityId:null,AsOf:'2026-10-25T09:00:00'},
    {EquipmentId:102,LocationEntityId:2,LocationEntityType:1,LocationPath:'2,1',EquipmentTypeId:5,IsActive:false,TreatmentDaysInterval:null,NextTreatmentDate:null,LastTreatmentEventId:null,LastTreatmentDate:null,LastTreatmentSeverityId:null,LastTreatmentStatus:null,TreatmentCategoryId:null,ValidTreatmentSeverityId:null,AsOf:'2026-10-25T09:00:00'}],TotalCount:2},
  MilgamDashboardByMonth:{Items:[{Year:2026,Month:9,Label:'9/26',EventCount:10},{Year:2026,Month:10,Label:'10/26',EventCount:10}],TotalCount:2},
  MilgamDashboardByDivision:{Items:[{DivisionName:'אגף א',EventCount:10}],TotalCount:1},
  MilgamDashboardSummary:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,EventCount:4,ClosedCount:2,EligibleDurationCount:2,InvalidDurationCount:0,AverageCloseDays:1},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,EventCount:6,ClosedCount:3,EligibleDurationCount:3,InvalidDurationCount:0,AverageCloseDays:1}],TotalCount:2},
  MilgamDashboardByCategory:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,CategoryName:'כללי',EventCount:4},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,CategoryName:'כללי',EventCount:6}],TotalCount:2},
  MilgamDashboardClosureByCategory:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,CategoryName:'כללי',ClosedCount:2,EligibleDurationCount:2,InvalidDurationCount:0,AverageCloseDays:1},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,CategoryName:'כללי',ClosedCount:3,EligibleDurationCount:3,InvalidDurationCount:0,AverageCloseDays:1}],TotalCount:2}
};
const keyFor = u => Object.keys(fixtures).find(k => u.includes(`/api/Entity/${k}/Search`));

async function create(spec={}) {
  const context=await browser.newContext({viewport:spec.viewport||{width:1440,height:900},locale:spec.dir==='ltr'?'en-US':'he-IL'});
  const page=await context.newPage(); const calls=[]; const errors=[]; let failures=spec.failures||0;
  await page.addInitScript(({navMode})=>{
    globalThis.__uatCalls=[];
    globalThis.SimplyVibeHostAdapter={
      ready:async()=>globalThis.__uatCalls.push(['ready']),
      executeCommand:async(n,p)=>{globalThis.__uatCalls.push([n,p]); if(navMode==='reject') throw new Error('synthetic internal detail'); if(navMode==='pending') return new Promise((res,rej)=>{globalThis.__uatResolve=res;globalThis.__uatReject=rej;});},
      ToDisplayDate:v=>{globalThis.__uatCalls.push(['date',v]);return `DISPLAY:${v}`;}
    };
  },{navMode:spec.navMode||'resolve'});
  page.on('pageerror',e=>errors.push(`pageerror:${e.message}`));
  page.on('console',m=>{if(m.type()==='error') errors.push(`console:${m.text()}`);});
  page.on('request',r=>{if(['script','worker'].includes(r.resourceType())) result.executableRequests.push(r.url());});
  await page.route('https://api.ylm.co.il/**',async route=>{
    const req=route.request(), key=keyFor(req.url()); calls.push({key,url:req.url(),method:req.method(),body:req.postData(),auth:req.headers().authorization?'present':'absent',t:Date.now()});
    if(key?.startsWith('MilgamDashboardCurrent')&&failures>0){failures--;return route.fulfill({status:403,contentType:'application/json',body:'{"message":"synthetic denied"}'});}
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(fixtures[key])});
  });
  const response=await page.goto(preview,{waitUntil:'domcontentloaded'}); if(!result.responseHeaders.csp) result.responseHeaders={csp:response.headers()['content-security-policy']||null,xContentTypeOptions:response.headers()['x-content-type-options']||null};
  await page.evaluate(({dir})=>window.dispatchEvent(new MessageEvent('message',{data:{ApiAddress:'https://api.ylm.co.il',Token:{token_type:'Bearer',access_token:'synthetic-uat-token'},LanguageCode:dir==='ltr'?'en':'he',LanguageDirection:dir},origin:'https://milgam.ylm.co.il',source:window.parent})),{dir:spec.dir||'rtl'});
  return {context,page,calls,errors,setFailures:n=>{failures=n;}};
}
async function ready(page){await page.getByText('12 סה״כ').waitFor({timeout:15000});await page.locator('#dashboard').waitFor({state:'visible',timeout:15000});}

for(const spec of [{name:'desktop-rtl',viewport:{width:1440,height:900},dir:'rtl'},{name:'phone-rtl',viewport:{width:390,height:844},dir:'rtl'},{name:'desktop-ltr',viewport:{width:1440,height:900},dir:'ltr'}]){
  const x=await create(spec);await ready(x.page);const current=x.calls.filter(c=>c.key?.startsWith('MilgamDashboardCurrent'));const before=await x.page.locator('#snapshot-content').innerText();const n=current.length;
  await x.page.locator('#month-select').selectOption('9');await x.page.waitForTimeout(150);const after=await x.page.locator('#snapshot-content').innerText();
  await x.page.locator('[data-permit]').first().click();await x.page.waitForTimeout(50);
  const geometry=await x.page.evaluate(()=>({dir:document.documentElement.dir,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,domCount:document.querySelector('#snapshot-region').querySelectorAll('*').length}));
  const hostCalls=await x.page.evaluate(()=>globalThis.__uatCalls); result.scenarios.push({...spec,currentCalls:current,startSpreadMs:Math.max(...current.map(c=>c.t))-Math.min(...current.map(c=>c.t)),exactBodies:current.every(c=>c.method==='POST'&&c.body==='{}'),snapshotStable:before===after,currentCallsOnMonth:x.calls.filter(c=>c.key?.startsWith('MilgamDashboardCurrent')).length-n,geometry,hostCalls,errors:x.errors});
  await x.page.screenshot({path:new URL(`${spec.name}.png`,out).pathname,fullPage:true});await x.context.close();
}

{
  const x=await create({viewport:{width:390,height:844},failures:3});await x.page.getByText('לא ניתן לטעון את תמונת המצב').waitFor({timeout:15000});const empty=(await x.page.locator('#snapshot-content').innerText()).trim()==='';await x.page.locator('[data-snapshot-retry]').click();await ready(x.page);result.scenarios.push({name:'initial-error-retry',empty,recovered:true,currentCalls:x.calls.filter(c=>c.key?.startsWith('MilgamDashboardCurrent')).length,errors:x.errors});await x.page.screenshot({path:new URL('initial-error-retry.png',out).pathname,fullPage:true});await x.context.close();
}
{
  const x=await create({viewport:{width:390,height:844}});await ready(x.page);const before=(await x.page.locator('#snapshot-content').innerText());x.setFailures(3);await x.page.locator('#snapshot-refresh').click();await x.page.getByText(/העדכון התקין האחרון/).waitFor({timeout:15000});const after=await x.page.locator('#snapshot-content').innerText();result.scenarios.push({name:'stale-refresh',retained:before===after,status:await x.page.locator('#snapshot-status').innerText(),errors:x.errors});await x.context.close();
}
for(const variant of ['survives','removed','rerendered']){
  const x=await create({viewport:{width:390,height:844},navMode:'pending'});await ready(x.page);const b=x.page.locator('[data-permit]').first();await b.focus();await b.click();await x.page.waitForTimeout(20);
  if(variant==='removed') await b.evaluate(el=>el.remove());
  if(variant==='rerendered') await b.evaluate(el=>{const c=el.cloneNode(true);el.replaceWith(c);});
  await x.page.evaluate(()=>globalThis.__uatReject(new Error('secret synthetic rejection')));await x.page.waitForTimeout(120);
  const text=await x.page.locator('#snapshot-status').innerText(); const host=await x.page.evaluate(()=>globalThis.__uatCalls); const unlocked=await x.page.locator('[data-permit]').evaluateAll(bs=>bs.every(b=>!b.disabled&&!b.hasAttribute('aria-busy')));
  result.scenarios.push({name:`navigation-reject-${variant}`,sanitized:!text.includes('secret')&&text.includes('לא ניתן לפתוח'),unlocked,readyCalls:host.filter(x=>x[0]==='ready').length,navigateCalls:host.filter(x=>x[0]==='Navigate').length,errors:x.errors});await x.context.close();
}
{
  const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),api=[];page.on('request',r=>{if(r.url().includes('api.ylm.co.il'))api.push(r.url());});await page.goto(preview,{waitUntil:'domcontentloaded'});await page.waitForTimeout(3300);result.scenarios.push({name:'direct-timeout',apiRequests:api.length,text:(await page.locator('#state-region').innerText()).trim()});await page.screenshot({path:new URL('direct-timeout.png',out).pathname,fullPage:true});await context.close();
}
result.executableRequests=[...new Set(result.executableRequests)];await browser.close();await fs.writeFile(new URL('observations.json',out),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
