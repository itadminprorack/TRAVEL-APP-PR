import assert from 'node:assert/strict';
import {buildSeed} from '../src/data.js';
import {mkdirSync,writeFileSync} from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const {default:AxeBuilder}=await import(process.env.AXE_MODULE||'@axe-core/playwright');
const browser=await chromium.launch({headless:true,channel:'chrome'}),results=[];
try{for(const width of [360,390,1440]){
 const context=await browser.newContext({viewport:{width,height:850},reducedMotion:'reduce'}),page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173');await page.evaluate(seed=>{localStorage.setItem('prorack-move-mvp-v2',JSON.stringify(seed));localStorage.setItem('prorack-move-demo-session-v2',JSON.stringify({userId:'usr-worker'}));},buildSeed());await page.reload();
 await page.locator('[data-nav="new"]:visible').click();await page.locator('[data-action="next-step"]').click();
 const open=name=>page.locator(`[data-time-field="${name}"] [data-open-time]`).click();
 await open('departTime');await page.locator('[data-clock-value="11"]').click();assert.equal(await page.locator('[data-clock-part="hour"]').inputValue(),'11');await page.locator('[data-clock-value="45"]').click();await page.locator('[data-period="PM"]').click();
 await page.keyboard.press('Tab');assert(await page.evaluate(()=>document.querySelector('.clock-picker').contains(document.activeElement)));
 mkdirSync('preview/ui-transformation/after',{recursive:true});await page.screenshot({path:`preview/ui-transformation/after/clock-picker-${width}.png`});
 const bounds=await page.locator('.clock-picker').boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=width);const axe=await new AxeBuilder({page}).include('.clock-picker').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>v.id),[]);
 await page.locator('.clock-confirm').click();assert.equal(await page.locator('[name="departTime"]').inputValue(),'23:45');assert.match(await page.locator('[data-time-field="departTime"]').textContent(),/11:45 PM/);
 await open('departTime');await page.locator('[data-clock-part="minute"]').fill('17');await page.keyboard.press('Escape');assert.equal(await page.locator('[name="departTime"]').inputValue(),'23:45');assert(await page.locator('[data-time-field="departTime"] [data-open-time]').evaluate(el=>el===document.activeElement));
 await open('returnTime');await page.locator('[data-clock-part="hour"]').fill('12');await page.locator('[data-clock-part="minute"]').fill('07');await page.locator('[data-period="AM"]').click();await page.locator('.clock-confirm').click();assert.equal(await page.locator('[name="returnTime"]').inputValue(),'00:07');
 await open('returnTime');await page.locator('[data-clock-clear]').click();assert.equal(await page.locator('[name="returnTime"]').inputValue(),'');
 await open('requiredArrival');await page.locator('[data-clock-part="hour"]').fill('13');await page.locator('.clock-confirm').click();assert(await page.locator('.clock-picker').isVisible());await page.locator('[data-clock-cancel]').click();assert.equal(await page.locator('[name="requiredArrival"]').inputValue(),'');assert.deepEqual(errors,[]);
 results.push({width,checks:'dial selection, AM/PM, exact minutes, midnight, cancel, clear, invalid entry, focus, axe'});await context.close();
}writeFileSync('preview/ui-transformation/clock-picker-qa.json',JSON.stringify(results,null,2));console.log(results);}finally{await browser.close();}
