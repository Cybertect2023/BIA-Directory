/* Verify the GitHub-hosted visitor guides connect to live destination routes.
 * No network calls; the separate public route audit checks Squarespace availability.
 */
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';

const pages=new Map([
 ['/explore-and-enjoy','pages/explore-and-enjoy.html'],
 ['/farms-local-food','pages/farms-local-food.html'],
 ['/things-to-do','pages/things-to-do.html'],
 ['/community-events','pages/community-events.html'],
 ['/local-stories','pages/local-stories.html'],
 ['/eat-and-drink','pages/eat-and-drink.html'],
 ['/shop-local','pages/shop-local.html'],
 ['/plan-your-visit','pages/plan-your-visit.html']
]);
const publicSite='https://www.visitstirlingrawdon.ca';
const contents=new Map([...pages].map(([path,file])=>[path,readFileSync(file,'utf8')]));
let checked=0, crossLinks=0, mapLinks=0;

for(const [slug,html] of contents){
 assert(!html.includes('data-launch-href='),slug+' retains staged links');
 const anchors=new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]));
 const h1=[...html.matchAll(/<h1\b/g)];
 assert.equal(h1.length,1,slug+' must have exactly one H1');
 for(const match of html.matchAll(/\bhref="([^"]+)"/g)){
  const raw=match[1].replaceAll('&amp;','&');
  if(raw.startsWith('tel:')||raw.startsWith('mailto:'))continue;
  let url;try{url=new URL(raw,publicSite+slug)}catch{throw new Error(slug+' contains invalid URL '+raw)}
  if(url.origin!==publicSite)continue;
  checked++;
  if(!pages.has(url.pathname)){
   if(raw.startsWith('#'))assert(anchors.has(decodeURIComponent(url.hash.slice(1))),slug+' missing its anchor '+raw);
   continue;
  }
  crossLinks++;
  if(url.pathname==='/plan-your-visit')mapLinks++;
  if(url.hash){
   const target=contents.get(url.pathname);
   assert(target.includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'),slug+' points to a missing section: '+raw);
  }
 }
}
for(const [slug] of pages){
 if(slug==='/plan-your-visit')continue;
 const html=contents.get(slug);
 assert(html.includes('href="/plan-your-visit'),slug+' needs a direct map link');
}
assert(contents.get('/plan-your-visit').includes('href="https://www.visitstirlingrawdon.ca/shop-local"'),'map footer is missing Shop Local');
assert(contents.get('/explore-and-enjoy').includes('href="/eat-and-drink"'),'hub is missing dining');
assert(contents.get('/explore-and-enjoy').includes('href="/shop-local"'),'hub is missing shopping');
console.log(JSON.stringify({pages:pages.size,internalLinksChecked:checked,visitorGuideLinks:crossLinks,mapLinks,stagedLinks:0},null,2));
