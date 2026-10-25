import playwright from '../../../tmp/playwright/node_modules/playwright-core/index.js';
import fs from 'node:fs/promises';
const {chromium}=playwright;
const preview='https://c9756759.app-milgam-dashboard.pages.dev';
const out=new URL('./evidence/',import.meta.url);
const browser=await chromium.launch({executablePath:'/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell',headless:true,args:['--no-sandbox']});
const observations={preview,expectedCommit:'50972d0b555115d3b1c9da90f7df0dc4790c6e8e',browser:await browser.version(),runs:[],executableRequests:[]};
const analytic={MilgamDashboardByMonth:{Items:[{Year:2026,Month:9,Label:'9/26',EventCount:10},{Year:2026,Month:10,Label:'10/26',EventCount:10}],TotalCount:2},MilgamDashboardByDivision:{Items:[{DivisionName:'אגף א',EventCount:10}],TotalCount:1},MilgamDashboardSummary:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,EventCount:4,ClosedCount:2,EligibleDurationCount:2,InvalidDurationCount:0,AverageCloseDays:1},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,EventCount:6,ClosedCount:3,EligibleDurationCount:3,InvalidDurationCount:0,AverageCloseDays:1}],TotalCount:2},MilgamDashboardByCategory:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,CategoryName:'כללי',EventCount:4},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,CategoryName:'כללי',EventCount:6}],TotalCount:2},MilgamDashboardClosureByCategory:{Items:[{ScopeKey:'headquarters',ScopeLabel:'מטה',ScopeOrder:1,CategoryName:'כללי',ClosedCount:2,EligibleDurationCount:2,InvalidDurationCount:0,AverageCloseDays:1},{ScopeKey:'branches',ScopeLabel:'סניפים',ScopeOrder:2,CategoryName:'כללי',ClosedCount:3,EligibleDurationCount:3,InvalidDurationCount:0,AverageCloseDays:1}],TotalCount:2}};
for(const spec of [{name:'desktop-rtl',viewport:{width:1440,height:900},dir:'rtl'},{name:'phone-rtl',viewport:{width:390,height:844},dir:'rtl'},{name:'desktop-ltr',viewport:{width:1440,height:900},dir:'ltr'}]){
 const context=await browser.newContext({viewport:spec.viewport}),page=await context.newPage(),requests=[],errors=[];
 await page.addInitScript(()=>{globalThis.SimplyVibeHostAdapter={ready:async()=>{},executeCommand:async()=>{},ToDisplayDate:v=>String(v)};});
 page.on('request',r=>{requests.push({url:r.url(),type:r.resourceType(),method:r.method(),body:r.postData()});if(['script','worker'].includes(r.resourceType()))observations.executableRequests.push(r.url());});
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://api.ylm.co.il/**',route=>{const u=route.request().url();const key=Object.keys(analytic).find(k=>u.includes(k));return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(analytic[key])});});
 const response=await page.goto(preview,{waitUntil:'domcontentloaded'});await page.evaluate(({dir})=>window.dispatchEvent(new MessageEvent('message',{data:{ApiAddress:'https://api.ylm.co.il',Token:{token_type:'Bearer',access_token:'synthetic-uat-token'},LanguageCode:dir==='ltr'?'en':'he',LanguageDirection:dir},origin:'https://milgam.ylm.co.il',source:window.parent})),{dir:spec.dir});
 await page.locator('#dashboard').waitFor({state:'visible',timeout:15000});await page.waitForTimeout(200);
 const status=await page.locator('#snapshot-status').innerText(),current=requests.filter(r=>r.url.includes('DashboardCurrent')),geometry=await page.evaluate(()=>({dir:document.documentElement.dir,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,domCount:document.querySelector('#snapshot-region').querySelectorAll('*').length}));
 observations.runs.push({...spec,status,currentRequests:current.length,refreshDisabled:await page.locator('#snapshot-refresh').isDisabled(),analyticalVisible:await page.locator('#dashboard').isVisible(),geometry,errors,responseCsp:response.headers()['content-security-policy']||null});
 await page.screenshot({path:new URL(`${spec.name}-disabled.png`,out).pathname,fullPage:true});await context.close();
}
{
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),api=[];page.on('request',r=>{if(r.url().includes('api.ylm.co.il'))api.push(r.url());});await page.goto(preview,{waitUntil:'domcontentloaded'});await page.waitForTimeout(3300);observations.runs.push({name:'direct-timeout',apiRequests:api.length,text:(await page.locator('#state-region').innerText()).trim()});await context.close();
}
observations.executableRequests=[...new Set(observations.executableRequests)];await browser.close();await fs.writeFile(new URL('observations.json',out),JSON.stringify(observations,null,2));console.log(JSON.stringify(observations,null,2));
