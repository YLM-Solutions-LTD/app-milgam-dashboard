import playwright from '/usr/local/lib/node_modules/@playwright/test/node_modules/playwright/index.js';
import fs from 'node:fs/promises';
import path from 'node:path';

const preview = 'https://f9d0c736.app-milgam-dashboard.pages.dev';
const head = '2f47f48ed056df72c5d8b861778dad5cc4069703';
const host = 'https://milgam.ylm.co.il/controller-host-fixture/';
const fixtureRoot = '/workspace/.simplyvibe/input/controller-host-harness';
const out = new URL('./evidence/', import.meta.url);
await fs.mkdir(out, { recursive: true });

const thousand = Array.from({length: 1000}, (_, i) => i);
const equipment = Array.from({length: 10000}, (_, i) => ({EquipmentId:i+1,LocationEntityId:i%20,LocationEntityType:'Site',LocationPath:`Root/${i%20}`,EquipmentTypeId:1,IsActive:true,TreatmentDaysInterval:null,NextTreatmentDate:null,LastTreatmentEventId:null,LastTreatmentDate:null,LastTreatmentSeverityId:null,LastTreatmentStatus:null,TreatmentCategoryId:null,ValidTreatmentSeverityId:null,AsOf:'2026-10-26T09:00:00'}));
const fixtures = {
  MilgamDashboardCurrentEvents:{Items:[{ScopeKey:'overall',TotalCount:'12',OpenCount:'5',AsOf:'2026-10-26T09:00:00'},{ScopeKey:'headquarters',TotalCount:'4',OpenCount:'2',AsOf:'2026-10-26T09:00:00'},{ScopeKey:'branches',TotalCount:'8',OpenCount:'3',AsOf:'2026-10-26T09:00:00'}],TotalCount:3},
  MilgamDashboardCurrentPermits:{Items:[{ValidCount:'7',MissingCount:'2',OverdueCount:'1',AsOf:'2026-10-26T09:00:00',ValueDate:'2026-10-26'}],TotalCount:1},
  MilgamDashboardCurrentEquipment:{Items:equipment,TotalCount:10000},
  MilgamDashboardByMonth:{Items:[{Year:2026,Month:10,Label:'10/26',EventCount:10}],TotalCount:1},
  MilgamDashboardByDivision:{Items:thousand.map(i=>({DivisionName:`Division ${i+1}`,EventCount:i===0?10:0})),TotalCount:1000},
  MilgamDashboardSummary:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,EventCount:5,ClosedCount:2,EligibleDurationCount:2,InvalidDurationCount:0,AverageCloseDays:1},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,EventCount:5,ClosedCount:3,EligibleDurationCount:3,InvalidDurationCount:0,AverageCloseDays:1}],TotalCount:2},
  MilgamDashboardByCategory:{Items:thousand.map(i=>({ScopeKey:i%2?'branches':'headquarters',ScopeLabel:i%2?'סניפים':'מטה',ScopeOrder:i%2?2:1,CategoryName:`Category ${i+1}`,EventCount:i<2?5:0})),TotalCount:1000},
  MilgamDashboardClosureByCategory:{Items:thousand.map(i=>({ScopeKey:i%2?'branches':'headquarters',ScopeLabel:i%2?'סניפים':'מטה',ScopeOrder:i%2?2:1,CategoryName:`Category ${i+1}`,ClosedCount:i===0?2:i===1?3:0,EligibleDurationCount:i===0?2:i===1?3:0,InvalidDurationCount:0,AverageCloseDays:i<2?1:null})),TotalCount:1000}
};
const keyFor = u => Object.keys(fixtures).find(k => u.includes(`/api/Entity/${k}/Search`));
const result = {preview, head, browser:null, headers:{}, scenarios:[], blocked:[], executables:[]};
const browser = await playwright.chromium.launch({executablePath:'/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell',headless:true,args:['--no-sandbox']});
result.browser = await browser.version();
const hc = await browser.newContext();
const hr = await hc.request.get(preview);
result.headers = hr.headers();
await hc.close();

async function session({name, viewport={width:1440,height:900}, dir='rtl', terminal401=false}={}) {
  const context = await browser.newContext({viewport});
  const page = await context.newPage();
  const calls=[], consoleErrors=[], pageErrors=[], longTasks=[];
  let currentCalls=0;
  page.on('console', m => { if (m.type()==='error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => pageErrors.push(String(e)));
  page.on('request', r => { if (['script','worker'].includes(r.resourceType())) result.executables.push(r.url()); });
  await page.addInitScript(() => new PerformanceObserver(list => { globalThis.__qcLongTasks=(globalThis.__qcLongTasks||[]).concat(list.getEntries().map(e=>({name:e.name,duration:e.duration,startTime:e.startTime}))); }).observe({entryTypes:['longtask']}));
  await page.route('**/*', route => { const u=route.request().url(); if(u.startsWith(preview)||u.startsWith(host)||u.startsWith('https://api.ylm.co.il/')) return route.continue(); result.blocked.push(u); return route.abort('blockedbyclient'); });
  await page.route('https://milgam.ylm.co.il/controller-host-fixture/**', async route => { const rel=new URL(route.request().url()).pathname.replace('/controller-host-fixture/','')||'index.html'; const file=path.resolve(fixtureRoot,rel); if(!file.startsWith(fixtureRoot+path.sep)) return route.abort(); let body=await fs.readFile(file); if(rel==='host-fixture.js'&&dir==='ltr') body=Buffer.from(body.toString().replace('LanguageDirection: "rtl"','LanguageDirection: "ltr"').replace('LanguageCode: "he"','LanguageCode: "en"')); await route.fulfill({status:200,contentType:rel.endsWith('.js')?'text/javascript':'text/html',body}); });
  await page.route('https://api.ylm.co.il/**', async route => { const req=route.request(), key=keyFor(req.url()), call={key,body:req.postData(),method:req.method(),status:200}; calls.push(call); if(!key) return route.abort('blockedbyclient'); if(key.startsWith('MilgamDashboardCurrent')) currentCalls++; if(terminal401 && currentCalls===4){call.status=401;return route.fulfill({status:401,contentType:'application/json',body:JSON.stringify({privateMarker:'must-not-render'})});} await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(fixtures[key])}); });
  await page.goto(`${host}index.html?preview=${encodeURIComponent(preview)}`,{waitUntil:'domcontentloaded'});
  let frame;
  for(let i=0;i<150;i++){ frame=page.frames().find(f=>f.url().startsWith(preview)); if(frame)break; await page.waitForTimeout(100); }
  if(!frame) throw Error('preview frame missing');
  await frame.locator('#snapshot-content').getByText('10,000').waitFor({timeout:30000});
  await page.waitForTimeout(500);
  return {name,context,page,frame,calls,consoleErrors,pageErrors,longTasks};
}

for (const spec of [{name:'desktop-rtl',viewport:{width:1440,height:900},dir:'rtl'},{name:'desktop-ltr',viewport:{width:1440,height:900},dir:'ltr'},{name:'mobile-rtl',viewport:{width:390,height:844},dir:'rtl'},{name:'mobile-ltr',viewport:{width:390,height:844},dir:'ltr'},{name:'narrow-rtl',viewport:{width:320,height:844},dir:'rtl'}]) {
  const x=await session(spec);
  const base=x.calls.length;
  const from=x.frame.locator('#from-date'), to=x.frame.locator('#to-date'), apply=x.frame.locator('#apply-range');
  await from.fill('2025-12-31'); await to.fill('2026-01-01'); await apply.click(); await x.page.waitForTimeout(800);
  const rangeCalls=x.calls.slice(base).filter(c=>c.key&&!c.key.startsWith('MilgamDashboardCurrent'));
  const invalidBase=x.calls.length; await from.fill('2026-02-02'); await to.fill('2026-02-01'); await apply.click(); await x.page.waitForTimeout(200);
  const metrics=await x.frame.evaluate(()=>{ const f=document.querySelector('footer[data-simplyvibe-release]'),r=f?.getBoundingClientRect(), els=[...document.querySelectorAll('footer,footer *')]; return {dir:document.documentElement.dir,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,dashboardNodes:document.querySelectorAll('#dashboard *').length,footerCount:document.querySelectorAll('footer[data-simplyvibe-release]').length,footerText:f?.innerText,footerVisible:!!r&&r.width>0&&r.height>0,footerBox:r&&{left:r.left,right:r.right,width:r.width},footerClipped:els.filter(e=>{const z=e.getBoundingClientRect();return z.left<0||z.right>innerWidth}).map(e=>e.tagName),footerAttrs:f&&Object.fromEntries([...f.attributes].map(a=>[a.name,a.value])),invalid:document.querySelector('#from-date')?.getAttribute('aria-invalid'),active:document.activeElement?.id,validation:document.querySelector('#range-validation')?.innerText||'',live:[...document.querySelectorAll('[aria-live]')].map(e=>e.innerText),longTasks:globalThis.__qcLongTasks||[]}; });
  await x.page.screenshot({path:new URL(`./evidence/${spec.name}.png`,import.meta.url).pathname,fullPage:true});
  result.scenarios.push({...spec,rangeCalls:rangeCalls.length,rangeBodies:rangeCalls.map(c=>c.body),invalidNewCalls:x.calls.length-invalidBase,metrics,consoleErrors:x.consoleErrors,pageErrors:x.pageErrors});
  await x.context.close();
}

{
  const x=await session({name:'terminal-401',terminal401:true}); const base=x.calls.length;
  await x.frame.locator('#snapshot-refresh').click(); await x.page.waitForTimeout(500);
  const m=await x.frame.evaluate(()=>({refreshDisabled:document.querySelector('#snapshot-refresh')?.disabled,retryCount:document.querySelectorAll('[data-snapshot-retry]').length,retryEnabled:[...document.querySelectorAll('[data-snapshot-retry]')].filter(b=>!b.disabled).length,status:document.querySelector('#snapshot-status')?.innerText,text:document.querySelector('#snapshot-content')?.innerText,footerCount:document.querySelectorAll('footer[data-simplyvibe-release]').length}));
  result.scenarios.push({name:'terminal-401',newCalls:x.calls.slice(base),metrics:m,consoleErrors:x.consoleErrors,pageErrors:x.pageErrors}); await x.context.close();
}
{
  const x=await session({name:'navigate'}); await x.frame.locator('[data-permit]').first().click(); await x.page.waitForTimeout(300); result.scenarios.push({name:'navigate',harness:await x.page.evaluate(()=>controllerHarness.state()),hash:await x.page.evaluate(()=>location.hash),consoleErrors:x.consoleErrors,pageErrors:x.pageErrors}); await x.context.close();
}
{
  const context=await browser.newContext({viewport:{width:390,height:844}}), page=await context.newPage(), api=[];
  page.on('request',r=>{if(r.url().startsWith('https://api.ylm.co.il/'))api.push(r.url())});
  await page.goto(preview,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3400);
  const metrics=await page.evaluate(()=>{const f=document.querySelector('footer[data-simplyvibe-release]'),r=f?.getBoundingClientRect();return{footerCount:document.querySelectorAll('footer[data-simplyvibe-release]').length,footerVisible:!!r&&r.width>0&&r.height>0,footerText:f?.innerText,connection:document.querySelector('#connection-status')?.innerText,scroll:[document.documentElement.scrollWidth,document.documentElement.clientWidth]}});
  result.scenarios.push({name:'no-context',apiCalls:api.length,metrics}); await context.close();
}

result.executables=[...new Set(result.executables)]; result.blocked=[...new Set(result.blocked)];
await browser.close();
await fs.writeFile(new URL('./evidence/browser-results.json',import.meta.url),JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
