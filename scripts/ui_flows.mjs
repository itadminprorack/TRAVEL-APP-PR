/** Interactive regression checks in a fresh browser context containing only synthetic demo data. */
import assert from 'node:assert/strict';
import {buildSeed} from '../src/data.js';
import {dateOffset} from '../src/logic.js';
import {writeFileSync} from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:'chrome'});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage(),errors=[],checks=[];
page.on('pageerror',error=>errors.push(error.message));
const click=selector=>page.locator(selector).first().click();
async function setTime(name,value){const [h,m]=value.split(':');await page.locator(`[data-time-field="${name}"] [data-open-time]`).click();await page.locator('.clock-picker [data-clock-part="hour"]').fill(String(Number(h)%12||12));await page.locator('.clock-picker [data-clock-part="minute"]').fill(m);await page.locator(`.clock-picker [data-period="${Number(h)>=12?'PM':'AM'}"]`).click();await page.locator('.clock-confirm').click();}
const field=async(name,value)=>await page.locator(`[data-time-field="${name}"]`).count()?setTime(name,value):page.locator(`[name="${name}"]`).fill(value);
const db=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('prorack-move-mvp-v2')));
async function role(id){await click('[data-action="role-menu"]');await click(`[data-action="switch-persona"][data-id="${id}"]`);}
async function nav(view){await click(`.side-nav [data-nav="${view}"]`);}
async function request({priority='planned',notes='Browser UI regression request',destination='ProRack Kothur Plant',draft=false}={}){
 await nav('new');if(priority==='emergency')await click('[data-action="priority"][data-id="emergency"]');
 if(draft){await click('[data-action="save-draft"]');return;}
 await click('[data-action="next-step"]');await field('origin','Kothur');await field('destination',destination);await field('departDate',dateOffset(2));await field('departTime','18:10');await field('requiredArrivalDate',dateOffset(3));await field('requiredArrival','07:00');await click('[data-action="next-step"]');await field('notes',notes);
}
try{
 await page.goto('http://127.0.0.1:5173');
 await page.evaluate(seed=>{localStorage.setItem('prorack-move-mvp-v2',JSON.stringify(seed));localStorage.removeItem('prorack-move-demo-session-v2');},buildSeed());await page.reload();await click('[data-action="enter-demo"]');
 await request();await click('[data-action="next-step"]');await click('[data-action="submit-request"]');
 let state=await db();const created=state.requests.find(r=>r.notes==='Browser UI regression request');assert(created&&created.status==='submitted');assert.equal(created.requiredArrivalDate,dateOffset(3));assert.equal(created.requiredArrival,'07:00');await click(`[data-action="open-request"][data-id="${created.id}"]`);assert((await page.locator('.dialog').textContent()).includes('07:00 AM'));assert((await page.locator('.dialog').textContent()).includes('06:10 PM'));await page.keyboard.press('Escape');checks.push('Worker submission');
 await field('query',created.id);await page.locator('#employee-search-form button').click();assert.equal(await page.locator('.request-card').count(),1);assert((await page.locator('.request-card').textContent()).includes(created.id));checks.push('Employee search');
 await field('query','');await page.locator('#employee-search-form button').click();
 await request({draft:true});state=await db();const draft=state.requests.find(r=>r.status==='draft');assert(draft);await nav('requests');await click(`[data-action="open-request"][data-id="${draft.id}"]`);await click('[data-action="resume-draft"]');assert(await page.locator('#wizard-form').isVisible());checks.push('Draft save and resume');
 await request({priority:'emergency',notes:''});await click('[data-action="next-step"]');assert((await page.locator('.toast-error').textContent()).includes('Emergency'));await field('notes','Urgent inspection at site');await click('[data-action="next-step"]');await click('[data-action="submit-request"]');checks.push('Emergency validation and submission');
 await role('usr-admin');await nav('admin-requests');await click(`[data-action="open-request"][data-id="${created.id}"]`);await click('[data-action="approve-request"]');assert.equal((await db()).requests.find(r=>r.id===created.id).status,'approved');
 await click(`[data-action="open-request"][data-id="${created.id}"]`);await click('[data-action="single-plan"]');await field('capacity','0');await page.locator('#allocation-form [type="submit"]').click();assert(await page.locator('#allocation-form').isVisible());await field('capacity','4');await field('provider','Synthetic QA transport');await page.locator('#allocation-form [type="submit"]').click();state=await db();const plan=state.plans.find(p=>p.provider==='Synthetic QA transport');assert(plan);assert.equal(state.requests.find(r=>r.id===created.id).status,'allocated');checks.push('Approve and allocate with invalid capacity guard');
 await click(`[data-action="open-plan"][data-id="${plan.id}"]`);await click('[data-action="edit-plan"]');await field('pickup','Synthetic QA gate');await field('departureTime','00:00');await page.locator('#edit-allocation-form [type="submit"]').click();assert.equal((await db()).plans.find(p=>p.id===plan.id).pickup,'Synthetic QA gate');assert((await db()).plans.find(p=>p.id===plan.id).departure.endsWith('T00:00'));assert((await page.locator('.dialog').textContent()).includes('12:00 AM'));await page.keyboard.press('Escape');checks.push('Edit allocation');
 await role('usr-worker');await nav('trips');assert((await page.locator('.trip-grid').textContent()).includes('Synthetic QA gate'));await click(`[data-action="view-pass"][data-id="${plan.id}"]`);assert((await page.locator('.printable-pass').textContent()).includes('NOT A TICKET'));await page.keyboard.press('Escape');
 await click('[data-action="notifications"]');assert((await page.locator('.notifications-popover').textContent()).includes('updated'));await click('[data-action="mark-read"]');assert((await db()).notifications.filter(n=>n.userId==='usr-worker').every(n=>n.read));await page.keyboard.press('Escape');checks.push('Traveler itinerary and notifications');
 await role('usr-admin');await nav('admin-requests');await click('[data-action="open-request"][data-id="TR-1002"]');await click('[data-action="status-action"][data-target="needs_info"]');await field('reason','Please confirm the pickup gate.');await page.locator('#status-form [type="submit"]').click();assert.equal((await db()).requests.find(r=>r.id==='TR-1002').status,'needs_info');
 await click('[data-action="open-request"][data-id="TR-1003"]');await click('[data-action="status-action"][data-target="rejected"]');await field('reason','Synthetic QA rejection reason.');await page.locator('#status-form [type="submit"]').click();assert.equal((await db()).requests.find(r=>r.id==='TR-1003').status,'rejected');checks.push('Clarification and rejection');
 await nav('people');await click('[data-action="add-person"]');await field('name','Synthetic QA Person');await field('location','Hyderabad');await page.locator('#person-form [type="submit"]').click();assert((await db()).users.some(u=>u.name==='Synthetic QA Person'));checks.push('Demo person creation');
 await nav('reports');const download=page.waitForEvent('download');await click('[data-action="export-csv"]');assert((await download).suggestedFilename().endsWith('.csv'));checks.push('CSV export');
 await click('[data-action="tour-start"]');for(let i=0;i<6;i++)await click('[data-action="tour-next"]');assert((await page.locator('.tour-card').textContent()).includes('Travel reporting'));await click('[data-action="tour-close"]');checks.push('Seven-step guided tour');
 await role('usr-admin');await nav('settings');await click('[data-action="confirm-reset"]');await click('[data-action="reset-demo"]');state=await db();assert.equal(state.requests.length,buildSeed().requests.length);assert.equal(state.users.length,buildSeed().users.length);await page.reload();assert.equal((await db()).requests.length,state.requests.length);checks.push('Reset and persistence');
 assert.equal(errors.length,0);writeFileSync('preview/ui-transformation/flow-report.json',JSON.stringify({checks,errors},null,2));console.log(`Browser interaction checks passed: ${checks.join('; ')}.`);
}finally{await browser.close();}
