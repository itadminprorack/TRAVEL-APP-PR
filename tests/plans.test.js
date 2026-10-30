import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSeed } from '../src/data.js';
import { updatePlan, completePlan, createPlan } from '../src/store.js';

const admin = { id:'usr-admin',role:'admin' };
const planValues = plan => ({
 mode:plan.mode, capacity:plan.capacity, departure:plan.departure,
 pickup:plan.pickup, drop:plan.drop, provider:plan.provider,
 identifier:plan.identifier, bookingRef:plan.bookingRef, notes:plan.notes
});

test('Admin may edit an allocated plan and the assigned traveler is notified',()=>{
 const db=buildSeed(), old=db.plans.find(p=>p.id==='PL-2001'),before=db.notifications.length;
 const result=updatePlan(db,old.id,{...planValues(old),pickup:'Updated pickup at main gate'},admin);
 assert.equal(result.pickup,'Updated pickup at main gate');
 assert.ok(result.updatedAt);
 assert.ok(db.notifications.length>before);
 assert.ok(db.notifications.some(n=>n.userId==='usr-employee'&&n.text.includes('updated')));
 assert.ok(db.activity.some(a=>a.kind==='allocation_update'));
 assert.equal(db.requests.find(r=>r.id==='TR-1007').status,'allocated');
});

test('Editing rejects inadequate capacity, invalid mode and blank pickup without mutating plan',()=>{
 const db=buildSeed(),p=db.plans.find(p=>p.id==='PL-2001'),initial=structuredClone(p);
 assert.throws(()=>updatePlan(db,p.id,{...planValues(p),capacity:1},admin),/exceed/);
 assert.throws(()=>updatePlan(db,p.id,{...planValues(p),mode:'teleport'},admin),/supported/);
 assert.throws(()=>updatePlan(db,p.id,{...planValues(p),pickup:' '},admin),/pickup/);
 assert.throws(()=>updatePlan(db,p.id,{...planValues(p),departure:'yesterday'},admin),/valid departure/);
 assert.deepEqual(p,initial);
});

test('Worker cannot edit a plan, completed plans cannot be changed or completed twice',()=>{
 const db=buildSeed(), p=db.plans[0],vals={...planValues(p),provider:'New provider'};
 assert.throws(()=>updatePlan(db,p.id,vals,{id:'usr-worker',role:'worker'}),/Only the Travel Admin/);
 completePlan(db,p.id,admin);
 assert.throws(()=>updatePlan(db,p.id,vals,admin),/Completed plans/);
 assert.throws(()=>completePlan(db,p.id,admin),/Only allocated/);
});

test('New allocations reject unknown modes',()=>{
 const db=buildSeed(),p=db.requests.find(r=>r.id==='TR-1005');
 assert.equal(p.status,'approved');
 assert.throws(()=>createPlan(db,{requestIds:[p.id],mode:'magic',capacity:50,departure:p.departDate+'T09:00',pickup:'Hyderabad'},admin),/valid mode/);
 assert.equal(p.status,'approved');
});
