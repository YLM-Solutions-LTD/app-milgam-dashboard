import playwright from '/usr/local/lib/node_modules/@playwright/test/node_modules/playwright/index.js';
import fs from 'node:fs/promises';
import path from 'node:path';

const preview='https://8248a782.app-milgam-dashboard.pages.dev', head='1c5ebdae74cb6a1fae0f818b9f44997e43b8245c';
const host='https://milgam.ylm.co.il/controller-host-fixture/', fixtureRoot='/workspace/.simplyvibe/input/controller-host-harness';
const out=new URL('./evidence/',import.meta.url); await fs.mkdir(out,{recursive:true});
const equipment=Array.from({length:10000},(_,i)=>({EquipmentId:i+1,LocationEntityId:i%20,LocationEntityType:'Site',LocationPath:`Root/${i%20}`,EquipmentTypeId:1,IsActive:true,TreatmentDaysInterval:null,NextTreatmentDate:null,LastTreatmentEventId:null,LastTreatmentDate:null,LastTreatmentSeverityId:null,LastTreatmentStatus:null,TreatmentCategoryId:null,ValidTreatmentSeverityId:null,AsOf:'2026-10-26T09:00:00'}));
const fixtures={
 MilgamDashboardCurrentEvents:{Items:[{ScopeKey:'overall',TotalCount:'12',OpenCount:'5',AsOf:'2026-10-26T09:00:00'},{ScopeKey:'headquarters',TotalCount:'4',OpenCount:'2',AsOf:'2026-10-26T09:00:00'},{ScopeKey:'branches',TotalCount:'8',OpenCount:'3',AsOf:'2026-10-26T09:00:00'}],TotalCount:3},
 MilgamDashboardCurrentPermits:{Items:[{ValidCount:'7',MissingCount:'2',OverdueCount:'1',AsOf:'2026-10-26T09:00:00',ValueDate:'2026-10-26'}],TotalCount:1},
 MilgamDashboardCurrentEquipment:{Items:equipment,TotalCount:10000},
 MilgamDashboardByMonth:{Items:[{Year:2026,Month:10,Label:'10/26',EventCount:10}],TotalCount:1},
 MilgamDashboardByDivision:{Items:[{DivisionName:'General',EventCount:10}],TotalCount:1},
 MilgamDashboardSummary:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,EventCount:4,ClosedCount:2,EligibleDurationCount:2,InvalidDurationCount:0,AverageCloseDays:1},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,EventCount:6,ClosedCount:3,EligibleDurationCount:3,InvalidDurationCount:0,AverageCloseDays:1}],TotalCount:2},
 MilgamDashboardByCategory:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,CategoryName:'General',EventCount:4},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,CategoryName:'General',EventCount:6}],TotalCount:2},
 MilgamDashboardClosureByCategory:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,CategoryName:'General',ClosedCount:2,EligibleDurationCount:2,InvalidDurationCount:0,AverageCloseDays:1},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,CategoryName:'General',ClosedCount:3,EligibleDurationCount:3,InvalidDurationCount:0,AverageCloseDays:1}],TotalCount:2}
};
const keyFor=u=>Object.keys(fixtures).find(k=>u.includes(`/api/Entity/${k}/Search`));
const result={preview,head,browser:null,headers:{},scenarios:[],blocked:[],executables:[]};
const browser=await playwright.chromium.launch({executablePath:'/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell',headless:true,args:['--no-sandbox']}); result.browser=await browser.version();
const hc=await browser.newContext(); const hr=await hc.request.get(preview); result.headers=hr.headers(); await hc.close();
async function session({name,viewport={width:1440,height:900},dir='rtl'}={}){
 const context=await browser.newContext({viewport}),page=await context.newPage(),calls=[],console=[],pageErrors=[];
 page.on('console',m=>{if(m.type()==='error')console.push(m.text())}); page.on('pageerror',e=>pageErrors.push(String(e))); page.on('request',r=>{if(['script','worker'].includes(r.resourceType()))result.executables.push(r.url())});
 await page.route('**/*',route=>{const u=route.request().url();if(u.startsWith(preview)||u.startsWith(host)||u.startsWith('https://api.ylm.co.il/'))return route.continue();result.blocked.push(u);return route.abort('blockedbyclient')});
 await page.route('https://milgam.ylm.co.il/controller-host-fixture/**',async route=>{const rel=new URL(route.request().url()).pathname.replace('/controller-host-fixture/','')||'index.html',file=path.resolve(fixtureRoot,rel);if(!file.startsWith(fixtureRoot+path.sep))return route.abort();let body=await fs.readFile(file);if(rel==='host-fixture.js'&&dir==='ltr')body=Buffer.from(body.toString().replace('LanguageDirection: "rtl"','LanguageDirection: "ltr"').replace('LanguageCode: "he"','LanguageCode: "en"'));await route.fulfill({status:200,contentType:rel.endsWith('.js')?'text/javascript':'text/html',body})});
 await page.route('https://api.ylm.co.il/**',async route=>{const req=route.request(),key=keyFor(req.url());calls.push({key,body:req.postData(),method:req.method()});if(!key)return route.abort('blockedbyclient');await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(fixtures[key])})});
 await page.goto(`${host}index.html?preview=${encodeURIComponent(preview)}`,{waitUntil:'domcontentloaded'});let frame;for(let i=0;i<150;i++){frame=page.frames().find(f=>f.url().startsWith(preview));if(frame)break;await page.waitForTimeout(100)}if(!frame)throw Error('preview frame missing');await frame.locator('#snapshot-content').getByText('10,000').waitFor({timeout:30000});return{name,context,page,frame,calls,console,pageErrors};
}
for(const spec of [{name:'desktop-rtl',viewport:{width:1440,height:900},dir:'rtl'},{name:'desktop-ltr',viewport:{width:1440,height:900},dir:'ltr'},{name:'mobile-rtl',viewport:{width:390,height:844},dir:'rtl'},{name:'mobile-ltr',viewport:{width:390,height:844},dir:'ltr'},{name:'narrow-rtl',viewport:{width:320,height:844},dir:'rtl'}]){
 const x=await session(spec),initial=x.calls.length; const from=x.frame.locator('#from-date'),to=x.frame.locator('#to-date'),apply=x.frame.locator('#apply-range');
 await from.fill('2025-12-31');await to.fill('2026-01-01');await apply.click();await x.page.waitForTimeout(700);const rangeCalls=x.calls.slice(initial).filter(c=>c.key&&!c.key.startsWith('MilgamDashboardCurrent'));
 const invalidStart=x.calls.length;await from.fill('2026-02-02');await to.fill('2026-02-01');await apply.click();await x.page.waitForTimeout(200);
 const m=await x.frame.evaluate(()=>{const f=document.querySelector('footer[data-simplyvibe-release]'),r=f?.getBoundingClientRect();return{dir:document.documentElement.dir,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,footerCount:document.querySelectorAll('footer[data-simplyvibe-release]').length,footerText:f?.innerText,footerVisible:!!r&&r.width>0&&r.height>0,footerPosition:f&&getComputedStyle(f).position,footerAttrs:f&&Object.fromEntries([...f.attributes].map(a=>[a.name,a.value])),invalid:document.querySelector('#from-date')?.getAttribute('aria-invalid'),active:document.activeElement?.id,validation:document.querySelector('#range-validation')?.innerText||'',clipped:[...document.querySelectorAll('button,input,footer')].filter(e=>{const z=e.getBoundingClientRect();return z.left<0||z.right>innerWidth}).map(e=>e.id||e.tagName)}});
 await x.page.screenshot({path:new URL(`./evidence/${spec.name}.png`,import.meta.url).pathname,fullPage:true});result.scenarios.push({...spec,rangeCalls:rangeCalls.length,rangeBodies:rangeCalls.map(c=>c.body),invalidNewCalls:x.calls.length-invalidStart,metrics:m,console:x.console,pageErrors:x.pageErrors});await x.context.close();
}
{
 const x=await session({name:'rapid-apply'}),base=x.calls.length,from=x.frame.locator('#from-date'),to=x.frame.locator('#to-date'),apply=x.frame.locator('#apply-range');for(let i=1;i<=10;i++){await from.fill(`2026-01-${String(i).padStart(2,'0')}`);await to.fill(`2026-02-${String(i).padStart(2,'0')}`);await apply.click()}await x.page.waitForTimeout(1000);const n=x.calls.slice(base);result.scenarios.push({name:'rapid-apply',analytical:n.filter(c=>c.key&&!c.key.startsWith('MilgamDashboardCurrent')).length,snapshot:n.filter(c=>c.key?.startsWith('MilgamDashboardCurrent')).length,console:x.console,pageErrors:x.pageErrors});await x.context.close();
}
{
 const x=await session({name:'navigate'});await x.frame.locator('[data-permit]').first().click();await x.page.waitForTimeout(300);result.scenarios.push({name:'navigate',harness:await x.page.evaluate(()=>controllerHarness.state()),hash:await x.page.evaluate(()=>location.hash),console:x.console,pageErrors:x.pageErrors});await x.context.close();
}
result.executables=[...new Set(result.executables)];result.blocked=[...new Set(result.blocked)];await browser.close();await fs.writeFile(new URL('./evidence/browser-results.json',import.meta.url),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
