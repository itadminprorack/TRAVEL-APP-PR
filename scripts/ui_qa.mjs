/** Optional browser QA. Supply PLAYWRIGHT_MODULE and AXE_MODULE for external QA tools. */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {buildSeed} from '../src/data.js';
import {dateOffset} from '../src/logic.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const {default:AxeBuilder}=await import(process.env.AXE_MODULE||'@axe-core/playwright');
const browser=await chromium.launch({headless:true,channel:process.env.QA_BROWSER||'chrome'});
const report={pages:[],accessibility:[],errors:[],brokenImages:[],overflows:[]};
const output='preview/ui-transformation';
mkdirSync(`${output}/after`,{recursive:true});mkdirSync(`${output}/before`,{recursive:true});
let context=await browser.newContext({reducedMotion:'reduce',timezoneId:'Asia/Kolkata'});
let page=await context.newPage();
function observe(){page.on('pageerror',error=>report.errors.push(error.message));page.on('console',message=>{if(message.type()==='error')report.errors.push(message.text());});}
observe();
async function click(selector){await page.locator(selector).first().click();}
async function persona(id){
 await page.evaluate(({id,seed})=>{localStorage.setItem('prorack-move-demo-session-v2',JSON.stringify({userId:id}));if(!localStorage.getItem('prorack-move-mvp-v2'))localStorage.setItem('prorack-move-mvp-v2',JSON.stringify(seed));},{id,seed:buildSeed()});
 await page.reload();
}
async function navigate(view,width){
 if(view==='new'&&await page.locator('.side-nav [data-nav="dashboard"]').count()){await navigate('dashboard',width);await click('[data-action="new-request"]');return;}
 const desktop=width>850;
 if(desktop&&view==='help'&&await page.locator('.sidebar [data-nav="help"]').count()){await click('.sidebar [data-nav="help"]');return;}
 if(!desktop&&await page.locator(`.bottom-nav [data-nav="${view}"]`).count())await click(`.bottom-nav [data-nav="${view}"]`);
 else if(desktop&&await page.locator(`.side-nav [data-nav="${view}"]`).count())await click(`.side-nav [data-nav="${view}"]`);
 else if(view==='profile'){await click('[data-action="role-menu"]');await click('[data-nav="profile"]');}
 else if(view==='help'&&!desktop){await click('.bottom-nav [data-action="workspace-menu"]');await click('.mobile-menu [data-nav="help"]');}
 else if(!desktop){await click('.bottom-nav [data-action="workspace-menu"]');await click(`.mobile-menu [data-nav="${view}"]`);}
 else throw Error(`No navigation to ${view}`);
}
async function check(name,width,{axe=false}={}){
 await page.locator('body').evaluate(async()=>{await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
 const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,images:[...document.images].filter(img=>!img.complete||!img.naturalWidth).map(img=>img.getAttribute('src'))}));
 report.pages.push({name,width});if(state.overflow)report.overflows.push({name,width});if(state.images.length)report.brokenImages.push({name,width,images:state.images});
 if(width===390||width===1440)await page.screenshot({path:`${output}/after/${name}-${width}.png`,fullPage:!await page.locator('.modal-overlay,.notifications-popover,.profile-popover,.tour-card').count()});
 if(axe){const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();report.accessibility.push({name,width,violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary})).slice(0,12)}))});}
}
try{
 // The optional baseline server serves the untouched local checkpoint.
 if(process.env.QA_BASELINE){
  await page.goto(process.env.QA_BASELINE);for(const width of [390,1440]){await page.setViewportSize({width,height:1000});await page.evaluate(()=>localStorage.clear());await page.reload();await page.screenshot({path:`${output}/before/login-${width}.png`,fullPage:true});await click('[data-action="enter-demo"]');await page.screenshot({path:`${output}/before/home-${width}.png`,fullPage:true});}
 }
 await page.goto(process.env.QA_URL||'http://127.0.0.1:5173');
 for(const width of [360,390,768,1024,1440]){
  await context.close();context=await browser.newContext({reducedMotion:'reduce',timezoneId:'Asia/Kolkata'});page=await context.newPage();observe();await page.goto(process.env.QA_URL||'http://127.0.0.1:5173');
  await page.setViewportSize({width,height:1000});await page.evaluate(()=>localStorage.clear());await page.reload();
  await check('login',width,{axe:width===390||width===1440});
  await click('[data-action="enter-demo"]');await click('[data-action="role-menu"]');await check('role-switcher',width,{axe:width===390||width===1440});await page.keyboard.press('Escape');
  for(const view of ['home','requests','trips','help','profile','new']){if(view!=='home')await navigate(view,width);await check(`employee-${view}`,width,{axe:width===390||width===1440});}
  await navigate('requests',width);await click('[data-action="open-request"][data-id="TR-1001"]');await click('[data-action="cancel-request"]');await check('cancel-confirmation',width,{axe:width===390||width===1440});await page.keyboard.press('Escape');await navigate('new',width);
  // Complete each wizard screen using the real delegated UI handlers.
  await click('[data-action="next-step"]');await check('wizard-route',width,{axe:width===390||width===1440});
  await page.locator('[name="origin"]').fill('Kothur');await page.locator('[name="destination"]').fill('ProRack Kothur Plant');
  await page.locator('[name="departDate"]').fill(dateOffset(2));await page.locator('[data-time-field="departTime"] [data-time-part="hour"]').selectOption('08');await page.locator('[data-time-field="departTime"] [data-time-part="minute"]').selectOption('00');await page.locator('[data-time-field="departTime"] [data-time-part="period"]').selectOption('AM');
  await click('[data-action="next-step"]');assert.equal(await page.locator('.manager-preference').count(),0);
  await check('wizard-details',width,{axe:width===390||width===1440});await click('[data-action="next-step"]');await check('wizard-review',width,{axe:width===390||width===1440});
  await persona('usr-admin');
  for(const view of ['dashboard','admin-requests','planner','allocations','people','reports','settings','help','new']){if(view!=='dashboard')await navigate(view,width);await check(`admin-${view}`,width,{axe:width===390||width===1440});}
  await navigate('people',width);await click('[data-action="add-person"]');await check('add-person',width,{axe:width===390||width===1440});await page.keyboard.press('Escape');await navigate('settings',width);await click('[data-action="confirm-reset"]');await check('reset-confirmation',width,{axe:width===390||width===1440});await page.keyboard.press('Escape');await navigate('admin-requests',width);await click('[data-action="open-request"][data-id="TR-1003"]');await click('[data-action="status-action"][data-target="needs_info"]');await check('status-confirmation',width,{axe:width===390||width===1440});await page.keyboard.press('Escape');
  await navigate('admin-requests',width);await click('[data-action="open-request"][data-id="TR-1001"]');
  assert(await page.locator('.dialog').evaluate(el=>el===document.activeElement),'Dialog should receive focus');
  await page.keyboard.press('Shift+Tab');assert(await page.locator('.dialog').evaluate(el=>el.contains(document.activeElement)),'Focus remains in dialog');
  await check('request-drawer',width,{axe:width===390||width===1440});await page.keyboard.press('Escape');
  assert(await page.locator('[data-action="open-request"][data-id="TR-1001"]').evaluate(el=>el===document.activeElement),'Closing restores opener focus');
  await navigate('planner',width);assert(await page.locator('.pickup-sequence li').count()>=2);assert.equal(await page.evaluate(()=>scrollY),0);await click('[data-action="start-group-plan"]');await check('group-confirmation',width,{axe:width===390||width===1440});await click('[data-action="confirm-group-approval"]');await check('allocation-form',width,{axe:width===390||width===1440});
  assert.equal(await page.locator('.allocation-mode .transport-art').count(),6);await page.keyboard.press('Escape');
  await navigate('allocations',width);await click('[data-action="open-plan"][data-id="PL-2001"]');await check('transport-plan',width,{axe:width===390||width===1440});await click('[data-action="edit-plan"]');await check('allocation-edit',width,{axe:width===390||width===1440});await page.keyboard.press('Escape');
  await click('[data-action="open-plan"][data-id="PL-2001"]');await click('[data-action="view-pass"]');await check('itinerary',width,{axe:width===390||width===1440});
  await page.emulateMedia({media:'print'});assert.equal(await page.locator('.app-shell').isVisible(),false);assert(await page.locator('.printable-pass').isVisible());if(width===1440)await page.pdf({path:`${output}/itinerary-print.pdf`,format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});await page.keyboard.press('Escape');
  await click('[data-action="notifications"]');await check('notifications',width,{axe:width===390||width===1440});await page.keyboard.press('Escape');
  await click('[data-action="tour-start"]');await check('guided-tour',width,{axe:width===390||width===1440});await click('[data-action="tour-close"]');
  await persona('usr-manager');await navigate('new',width);await click('[data-action="next-step"]');await page.locator('[name="origin"]').fill('Hyderabad');await page.locator('[name="destination"]').fill('Mumbai');await click('[data-action="next-step"]');assert.equal(await page.locator('.manager-preference').count(),1);await check('manager-preferences',width,{axe:width===390||width===1440});
 }
 // Existing persisted records survive reload without migration.
 const stored=await page.evaluate(()=>localStorage.getItem('prorack-move-mvp-v2'));await page.reload();assert.equal(await page.evaluate(()=>localStorage.getItem('prorack-move-mvp-v2')),stored);
 // Reduced motion turns off transitions and page entrances.
 assert.equal(await page.locator('.page-content>*').first().evaluate(el=>getComputedStyle(el).animationName),'none');
 await page.emulateMedia({reducedMotion:'no-preference'});assert.notEqual(await page.locator('.page-content>*').first().evaluate(el=>getComputedStyle(el).animationName),'none');
 writeFileSync(`${output}/qa-report.json`,JSON.stringify(report,null,2));
 const violations=report.accessibility.flatMap(p=>p.violations);
 console.log(JSON.stringify({screens:report.pages.length,axeAudits:report.accessibility.length,overflows:report.overflows,brokenImages:report.brokenImages,consoleErrors:report.errors,accessibilityViolations:violations.map(v=>({id:v.id,impact:v.impact}))},null,2));
 assert.equal(report.overflows.length,0,'No page horizontal overflow');assert.equal(report.brokenImages.length,0,'All illustrations load');assert.equal(report.errors.length,0,'No console errors');assert.equal(violations.length,0,'WCAG A/AA automated checks');
}finally{writeFileSync(`${output}/qa-report.json`,JSON.stringify(report,null,2));await browser.close();}
