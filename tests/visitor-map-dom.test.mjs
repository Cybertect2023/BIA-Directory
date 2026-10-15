import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
const root=new URL('../',import.meta.url);
const html=await fs.readFile(new URL('pages/plan-your-visit.html',root),'utf8');
let moduleSerial=0;
async function fixture({storageBlocked=false,dataFails=false,dependenciesFail=false,url='https://www.visitstirlingrawdon.ca/plan-your-visit',mobile=false}={}){
 const dom=new JSDOM(html,{url,runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;
 w.matchMedia=query=>({matches:query.includes('650px')?mobile:false,addEventListener(){}});
 w.HTMLElement.prototype.scrollIntoView=function(){};
 Object.defineProperty(w.HTMLElement.prototype,'clientWidth',{get(){return this.classList.contains('vm-map-stage')?800:400;}});
 Object.defineProperty(w.HTMLElement.prototype,'clientHeight',{get(){return this.classList.contains('vm-map-stage')?520:300;}});
 if(storageBlocked)Object.defineProperty(w,'localStorage',{get(){throw new Error('Blocked');}});
 const append=w.document.head.append.bind(w.document.head);
 w.document.head.append=(...nodes)=>{append(...nodes);for(const n of nodes){
  if(n.tagName==='LINK')queueMicrotask(()=>n.dispatchEvent(new w.Event('load')));
  if(n.tagName==='SCRIPT')queueMicrotask(async()=>{if(dependenciesFail){n.onerror();return;}const path=new URL(n.src);w.eval(await fs.readFile(path,'utf8'));n.onload();});
 }};
 for(const key of ['window','document','history','localStorage','navigator'])Object.defineProperty(globalThis,key,{configurable:true,get:()=>w[key]});
 globalThis.requestAnimationFrame=w.requestAnimationFrame.bind(w);
 globalThis.CustomEvent=w.CustomEvent;
 globalThis.fetch=async url=>{
  if(dataFails)return {ok:false,status:503};
  return {ok:true,json:async()=>JSON.parse(await fs.readFile(url,'utf8'))};
 };
 await import('../assets/visitor-map.js?test='+ ++moduleSerial);
 const wait=async fn=>{for(let i=0;i<80;i++){if(fn())return;await new Promise(r=>setTimeout(r,10));}throw new Error('Condition timed out');};
 await wait(()=>w.document.querySelector('[data-vm-mounted="true"],[data-vm-mounted="error"]'));
 return {dom,w,doc:w.document,wait,close:()=>w.close()};
}
const click=(doc,selector)=>{const n=doc.querySelector(selector);assert.ok(n,selector);n.click();return n;};
const count=doc=>doc.querySelectorAll('.vm-results > .vm-card[data-place]').length;
test('real DOM: filters, collections, saved lifecycle, ordering, selection, links and sharing fallback',async()=>{
 const f=await fixture({mobile:true});const{doc,w}=f;
 assert.equal(count(doc),40);
 const input=doc.querySelector('.vm-search');input.value='farm girl';input.dispatchEvent(new w.Event('input'));await f.wait(()=>count(doc)===1);
 assert.equal(doc.querySelector('.vm-card').dataset.place,'farm-girl-cafe');
 click(doc,'.vm-card-actions button');assert.equal(JSON.parse(w.localStorage.getItem('stirling-visitor-stops-v1'))[0],'farm-girl-cafe');
 click(doc,'.vm-filter-row button');assert.equal(count(doc),40);
 click(doc,'[data-place="rustic-routes"] .vm-card-actions button');
 click(doc,'.vm-toolbar button');assert.equal(count(doc),2);
 assert.equal(doc.querySelector('.vm-card').dataset.place,'farm-girl-cafe');
 click(doc,'[data-place="rustic-routes"] [data-reorder="-1"]');assert.equal(doc.querySelector('.vm-card').dataset.place,'rustic-routes');
 assert.equal(doc.activeElement,doc.querySelector('[data-place="rustic-routes"] h3 button'),'reordering to the first position keeps focus on that stop');
 click(doc,'[data-place="rustic-routes"] h3 button');
 assert.equal(doc.querySelector('.vm-detail h3').textContent,'Rustic Routes');
 assert.equal(doc.querySelector('.vm-shell').dataset.view,'map');
 assert.ok(doc.querySelector('.vm-detail a[href="https://www.visitstirlingrawdon.ca/rustic-routes"]'));
 assert.ok(doc.querySelector('.vm-detail a[href^="tel:"]'));
 const provider=doc.querySelector('[aria-label="Directions map app"]');provider.value='apple';provider.dispatchEvent(new w.Event('change'));
 assert.ok(doc.querySelector('.vm-directions a').href.startsWith('https://maps.apple.com/'));
 click(doc,'.vm-toolbar button:last-child');await f.wait(()=>!doc.querySelector('.vm-share-field').hidden);assert.ok(doc.querySelector('.vm-share-field').value.includes('vm_place=rustic-routes'));
 click(doc,'[data-collection="theatre"]');assert.equal(count(doc),7);assert.equal(doc.querySelector('.vm-card:last-child').dataset.place,'stirling-festival-theatre');
 click(doc,'.vm-toolbar button');click(doc,'.vm-toolbar button:nth-child(2)');assert.equal(count(doc),0);assert.deepEqual(JSON.parse(w.localStorage.getItem('stirling-visitor-stops-v1')),[]);
 click(doc,'.vm-filter-row button');
 const category=doc.querySelector('.vm-filter-row select');category.value='eat';category.dispatchEvent(new w.Event('change'));assert.equal(count(doc),6);
 f.close();
});
test('actual Leaflet and markercluster load, markers select, clustering survives filters and overlapping places',async()=>{
 const f=await fixture({mobile:true});const{doc,w}=f;
 click(doc,'.vm-mobile-toggle button:last-child');await f.wait(()=>doc.querySelector('.leaflet-container')&&doc.querySelector('.vm-map-placeholder').hidden);
 assert.equal(w.L.version,'1.9.4');assert.ok(w.L.markerClusterGroup);
 assert.ok(doc.querySelectorAll('.leaflet-marker-icon').length>0);
 assert.ok(doc.querySelector('.leaflet-control-attribution').textContent.includes('OpenStreetMap'));
 click(doc,'[data-place="farm-girl-cafe"] h3 button');await f.wait(()=>doc.querySelector('.leaflet-popup'));
 assert.ok(doc.querySelector('.leaflet-popup').textContent.includes('Farm Girl Cafe'));
 assert.equal(doc.querySelector('.vm-detail h3').textContent,'Farm Girl Cafe');
 const otherMarker=doc.querySelector('.leaflet-marker-icon[title="Fresh & Hot Pizza"]');
 assert.ok(otherMarker);otherMarker.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
 assert.equal(doc.querySelector('.vm-detail h3').textContent,'Fresh & Hot Pizza','Enter selects a marker as well as opening its popup');
 click(doc,'.vm-filter-row button');
 const c=doc.querySelector('.vm-filter-row select');c.value='farms';c.dispatchEvent(new w.Event('change'));
 assert.equal(count(doc),4);assert.equal(doc.querySelector('.vm-results-meta').textContent,'4 places · 3 verified pins');
 click(doc,'.vm-map-controls button');
 // All requested tile images carry a referrer policy and are only viewport tiles. JSDOM never downloads them.
 const tiles=[...doc.querySelectorAll('.leaflet-tile')];assert.ok(tiles.length>0);assert.ok(tiles.every(t=>t.referrerPolicy==='strict-origin-when-cross-origin'));
 f.close();
});
test('storage denial, data outage and map-dependency outage retain usable paths',async()=>{
 let f=await fixture({storageBlocked:true,mobile:true});click(f.doc,'[data-place="farm-girl-cafe"] .vm-card-actions button');assert.ok(f.doc.querySelector('.vm-message').textContent.includes('this visit only'));click(f.doc,'.vm-toolbar button');assert.equal(count(f.doc),1);f.close();
 f=await fixture({dataFails:true});assert.ok(f.doc.querySelector('.vm-fallback'));assert.ok(f.doc.querySelector('.vm-notice').textContent.includes('could not load'));assert.ok(f.doc.querySelectorAll('.vm-fallback a').length>=29);f.close();
 f=await fixture({dependenciesFail:true,mobile:true});click(f.doc,'.vm-mobile-toggle button:last-child');await f.wait(()=>!f.doc.querySelector('.vm-notice').hidden);assert.equal(count(f.doc),40);click(f.doc,'.vm-mobile-toggle button');assert.equal(f.doc.querySelector('.vm-shell').dataset.view,'list');f.close();
});
test('selected-place URL, browser history, cross-tab saves and invalid storage recovery',async()=>{
 const f=await fixture({mobile:true,url:'https://www.visitstirlingrawdon.ca/plan-your-visit?vm_place=rawdon-creek-soap-co'});const{doc,w}=f;
 assert.equal(doc.querySelector('.vm-detail h3').textContent,'Rawdon Creek Soap Co.');assert.equal(doc.querySelector('.vm-directions'),null);
 w.history.pushState({},'','?vm_category=eat');w.dispatchEvent(new w.PopStateEvent('popstate'));assert.equal(count(doc),6);
 w.dispatchEvent(new w.StorageEvent('storage',{key:'stirling-visitor-stops-v1',newValue:'["farm-girl-cafe"]'}));assert.ok(doc.querySelector('.vm-toolbar button').textContent.includes('(1)'));
 click(doc,'.vm-toolbar button');assert.equal(count(doc),1);
 w.dispatchEvent(new w.StorageEvent('storage',{key:'stirling-visitor-stops-v1',newValue:'broken'}));assert.equal(count(doc),0);
 f.close();
});
