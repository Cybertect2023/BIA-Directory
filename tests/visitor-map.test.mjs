import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CATEGORIES,buildPlaces,filterPlaces,readState,stateUrl,readSaved,addressFingerprint,directionsUrl,nearbyPlaces,hasPoint,safeUrl} from '../assets/visitor-map-core.js';
const directory=JSON.parse(fs.readFileSync(new URL('../businesses.json',import.meta.url)));
const data=JSON.parse(fs.readFileSync(new URL('../explore/map-locations.json',import.meta.url)));
const places=buildPlaces(directory,data);
const base={q:'',category:'all',experience:'',selected:'',savedOnly:false};
test('all 29 businesses are accounted for once; every published pin has dated evidence',()=>{
 assert.equal(directory.businesses.length,29);
 const records=[...data.businessLocations,...data.unresolvedBusinesses];
 assert.equal(records.length,29);assert.equal(new Set(records.map(p=>p.businessId)).size,29);
 for(const b of directory.businesses)assert.ok(records.some(p=>p.businessId===b.id));
 assert.equal(new Set(places.map(p=>p.id)).size,places.length);
 for(const p of places.filter(hasPoint)){
  assert.ok(p.lat>43&&p.lat<45&&p.lon>-79&&p.lon<-76,p.name);
  assert.match(p.verification.date,/^\d{4}-\d{2}-\d{2}$/);assert.ok(p.verification.sources.length);
  for(const source of p.verification.sources)assert.ok(safeUrl(source));
 }
 assert.equal(places.filter(hasPoint).length,33);
});
test('business details remain canonical and stale coordinates fail closed',()=>{
 for(const b of directory.businesses){const p=places.find(p=>p.id===b.id);assert.equal(p.name,b.name);assert.equal(p.address,b.address);}
 const copy=structuredClone(directory);copy.businesses.find(b=>b.id==='farm-girl-cafe').address='Changed address';
 const p=buildPlaces(copy,data).find(p=>p.id==='farm-girl-cafe');assert.equal(p.status,'address-changed');assert.equal(hasPoint(p),false);assert.equal(directionsUrl(p),'');
 for(const m of data.businessLocations){for(const key of ['name','address','website','phone','profileUrl'])assert.equal(m[key],undefined);assert.equal(m.addressFingerprint,addressFingerprint(directory.businesses.find(b=>b.id===m.businessId).address));}
});
test('search, accent handling, categories, reset and empty results',()=>{
 assert.equal(filterPlaces(places,{...base,q:'FARM GIRL'},data.collections,[])[0].id,'farm-girl-cafe');
 assert.equal(filterPlaces(places,{...base,q:'cafÉ'},data.collections,[]).length>0,true);
 assert.equal(filterPlaces(places,{...base,category:'eat'},data.collections,[]).length,6);
 for(const category of Object.keys(CATEGORIES).filter(x=>x!=='all'))assert.ok(filterPlaces(places,{...base,category},data.collections,[]).every(p=>p.visitorCategory===category));
 assert.equal(filterPlaces(places,{...base,q:'zzzzunfindable'},data.collections,[]).length,0);
 assert.equal(filterPlaces(places,base,data.collections,[]).length,40);
 assert.equal(filterPlaces(places,base,data.collections,[]).at(-1).visitorCategory,'services');
});
test('all five curated collections resolve, in editorial order, with no adult retail in family/stroll',()=>{
 assert.equal(data.collections.length,5);
 for(const c of data.collections){const result=filterPlaces(places,{...base,experience:c.id},data.collections,[]);assert.deepEqual(result.map(p=>p.id),c.ids);}
 for(const id of ['family','stroll'])assert.ok(data.collections.find(c=>c.id===id).ids.every(id=>!['paradise-cannabis-stirling','the-vape-shop-stirling'].includes(id)));
 assert.equal(data.collections.find(c=>c.id==='theatre').ids.at(-1),'stirling-festival-theatre');
});
test('saved IDs tolerate invalid storage, remove duplicates and retain user ordering',()=>{
 const ids=new Set(places.map(p=>p.id));assert.deepEqual(readSaved('{',ids),[]);assert.deepEqual(readSaved('{}',ids),[]);
 assert.deepEqual(readSaved('["farm-girl-cafe","bad",null,"farm-girl-cafe","rustic-routes"]',ids),['farm-girl-cafe','rustic-routes']);
 assert.deepEqual(filterPlaces(places,{...base,savedOnly:true},data.collections,['rustic-routes','farm-girl-cafe']).map(p=>p.id),['rustic-routes','farm-girl-cafe']);
});
test('share links round-trip public state, retain unrelated parameters, and exclude private saves',()=>{
 const state={...base,category:'eat',q:'coffee & cafés',experience:'theatre',selected:'farm-girl-cafe',savedOnly:true};
 const url=stateUrl('https://example.com/visit?utm_source=bia#visitor-map',state);
 assert.equal(new URL(url).searchParams.get('utm_source'),'bia');
 assert.deepEqual(readState(url,data.collections,places),{...state,savedOnly:false});
 assert.deepEqual(readState('https://example.com/?vm_category=invalid&vm_place=bad&vm_experience=nope',data.collections,places),base);
 assert.ok(!url.includes('saved'));
});
test('directions use destination identities rather than centroids; unresolved pins do not route',()=>{
 const p=places.find(p=>p.id==='farm-girl-cafe');
 const google=new URL(directionsUrl(p,'google','walking'));assert.equal(google.searchParams.get('travelmode'),'walking');assert.ok(google.searchParams.get('destination').includes(p.address));assert.ok(!google.href.includes(String(p.lat)));
 const apple=new URL(directionsUrl(p,'apple','driving'));assert.equal(apple.searchParams.get('dirflg'),'d');
 for(const id of ['rawdon-creek-soap-co','jason-fornarolo-cpa']){const place=places.find(p=>p.id===id);assert.equal(place.hideAddress,true);assert.equal(directionsUrl(place),'');}
 assert.equal(safeUrl('javascript:alert(1)'), '');assert.equal(safeUrl('data:text/html,test'),'');
});
test('nearby discovery uses verified points and excludes current place and services',()=>{
 const p=places.find(p=>p.id==='farm-girl-cafe'),nearby=nearbyPlaces(places,p);
 assert.equal(nearby.length,3);assert.ok(nearby.every(n=>n.id!==p.id&&hasPoint(n)&&n.visitorCategory!=='services'));
 assert.deepEqual(nearbyPlaces(places,places.find(p=>p.id==='rawdon-creek-soap-co')),[]);
});
