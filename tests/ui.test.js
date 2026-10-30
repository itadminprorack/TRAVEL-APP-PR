import test from 'node:test';
import assert from 'node:assert/strict';
import {illustration} from '../src/art.js';
import {timeline} from '../src/ui.js';

test('illustrations keep persisted or supplied text out of asset paths and HTML attributes',()=>{
 const html=illustration('../missing" onerror="alert(1)','" onclick="alert(1)','<Travel & team>');
 assert.match(html,/generated\/empty-requests-v3\.png/);
 assert.match(html,/alt="&lt;Travel &amp; team&gt;"/);
 assert.doesNotMatch(html,/ onerror="| onclick="/);
});

test('exceptional request states explain the next step instead of implying normal progress',()=>{
 assert.match(timeline({status:'needs_info'}),/Update and resubmit/);
 assert.match(timeline({status:'rejected'}),/reason/);
 assert.match(timeline({status:'draft'}),/saved locally/);
 assert.match(timeline({status:'cancelled'}),/cancelled/);
 assert.doesNotMatch(timeline({status:'rejected'}),/Current stage/);
});

test('allocated journeys retain their actual progress indicator',()=>{
 const html=timeline({status:'allocated'});
 assert.match(html,/Transport allocated/);
 assert.equal((html.match(/Current stage/g)||[]).length,1);
 assert.match(html,/Trip completed/);
});
