const { chromium } = require('/usr/local/lib/node_modules/@playwright/test/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const preview = 'https://02ea3f16.app-milgam-dashboard.pages.dev/';
const commit = '3b3f8d4373ff90c2073fb4e884e1fe622a8595a0';
const hostOrigin = 'https://simplylog.ylm.co.il';
const hostBase = `${hostOrigin}/controller-host-fixture/`;
const fixtureDir = '/workspace/.simplyvibe/input/controller-host-harness';
const output = process.argv[2];
const fixtureFiles = {'index.html':'index.html','host-fixture.js':'host-fixture.js','vendor/guest-bridge.js':'vendor/guest-bridge.js','vendor/simplyvibe-client.js':'vendor/simplyvibe-client.js'};
async function run(browser, viewport) {
  const context = await browser.newContext({ viewport, ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const apiCalls=[], consoleErrors=[], pageErrors=[], failedRequests=[], executableRequests=[]; let csp=null;
  page.on('console', m => { if (m.type()==='error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => pageErrors.push(String(e)));
  page.on('requestfailed', r => failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
  page.on('request', r => { if(['script','stylesheet'].includes(r.resourceType())) executableRequests.push({url:r.url(),type:r.resourceType()}); if(new URL(r.url()).hostname==='api.ylm.co.il') apiCalls.push({url:r.url(),method:r.method(),body:r.postData()}); });
  page.on('response', r => { if(r.url()===preview) csp=r.headers()['content-security-policy']||null; });
  await page.route(`${hostBase}**`, route => {
    const relative = new URL(route.request().url()).pathname.slice('/controller-host-fixture/'.length) || 'index.html';
    const file = fixtureFiles[relative];
    if (!file) return route.abort('blockedbyclient');
    return route.fulfill({status:200,contentType:path.extname(file)==='.html'?'text/html':'application/javascript',body:fs.readFileSync(path.join(fixtureDir,file))});
  });
  await page.route('https://api.ylm.co.il/**', r => r.abort('blockedbyclient'));
  await page.route('https://mntapi.ylm.co.il/**', r => r.abort('blockedbyclient'));
  const started=Date.now();
  await page.goto(`${hostBase}index.html?preview=${encodeURIComponent(preview)}`,{waitUntil:'domcontentloaded'});
  const frame=await(await page.waitForSelector('#guest')).contentFrame();
  await page.waitForTimeout(3500);
  const state=await frame.evaluate(()=>({hasSimplyVibeClient:typeof globalThis.SimplyVibeClient==='function',hasInjectedAdapter:Boolean(globalThis.SimplyVibeHostAdapter),connectionText:document.querySelector('#connection-status')?.textContent?.trim()||null,snapshotStatus:document.querySelector('#snapshot-status')?.textContent?.trim()||null,refreshDisabled:document.querySelector('#snapshot-refresh')?.disabled??null,snapshotElements:document.querySelector('#snapshot-region')?.querySelectorAll('*').length??null,equipmentText:document.querySelector('.equipment-total strong')?.textContent||null,documentScrollWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth}));
  const harnessState=await page.evaluate(()=>globalThis.controllerHarness?.state?.()||null);
  await context.close();
  return {viewport,elapsedMs:Date.now()-started,state,harnessState,apiCalls,consoleErrors,pageErrors,failedRequests,executableRequests,csp};
}
(async()=>{const browser=await chromium.launch({executablePath:'/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell',headless:true,args:['--no-sandbox']});const results=[];for(const viewport of [{width:390,height:844},{width:1440,height:900}])results.push(await run(browser,viewport));fs.writeFileSync(output,JSON.stringify({measuredAt:new Date().toISOString(),preview,commit,browserVersion:await browser.version(),node:process.version,harness:'controller-owned real GuestBridge fixture; no injected guest adapter',results},null,2));await browser.close()})().catch(e=>{console.error(e);process.exit(1)});
