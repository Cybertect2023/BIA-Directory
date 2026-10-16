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

const shop=contents.get('/shop-local');
const things=contents.get('/things-to-do');
assert(shop.includes('id="shop-mercantile"'),'Shop Local must feature the downtown candy shop');
assert(shop.includes('href="https://www.facebook.com/StirlingGeneralMercantile/"'),'Candy shop feature needs a working official link while its BIA profile is unpublished');
assert(!shop.includes('href="/stirling-general-mercantile"'),'Do not link to the currently unpublished Mercantile profile');
assert(shop.includes('href="/a-spa-of-feathers-and-fur"'),'Shop Local must feature the downtown pet spa');
assert(shop.includes('href="/pet-valu-stirling"'),'Pet-care visitor information must preserve the Pet Valu link');
assert(things.includes('href="/shop-local#shop-mercantile"'),'Things to Do should connect families to the candy shop');
const merchantTotal=[...shop.matchAll(/class="bia-shop__merchant(?:\s|")/g)].length;
assert.equal(merchantTotal,7,'Shop Local should show seven featured independent shops');
assert(shop.includes('Showing all seven featured independent shops.'),'Initial Shop Local count must match the cards');
assert(readFileSync('assets/explore-loader.js','utf8').includes('"Showing all " + visible + " featured independent shops."'),'Shop Local filters must use dynamic counts');

// The three existing native Squarespace homepage cards should point to these
// visitor-focused destinations instead of the old News & Features blog posts.
// Their IDs must remain stable for Squarespace links and direct hash loading.
for(const [id,landmark] of [
 ['heritage-history','Farmtown Park'],
 ['trails-outdoors','Heritage Trail from North Street'],
 ['parks-family-fun','Stirling General Mercantile']
]){
 assert(things.includes('id="'+id+'"'),'Missing More to Explore destination: '+id);
 assert(things.includes(landmark),'More to Explore destination needs a real local stop: '+landmark);
}
assert(things.includes('href="/plan-your-visit?vm_experience=family#visitor-map"'),'Family guide must link to visitor map');
assert(things.includes('href="/shop-local#shop-mercantile"'),'Family guide must connect to candy-shop feature');
assert(things.includes('href="/the-scoop-ice-cream"'),'Family guide must mention seasonal ice cream');
assert(things.includes('href="/news-and-features/then-and-now"'),'Preserve historic Then & Now story as a supplementary resource');

console.log(JSON.stringify({pages:pages.size,internalLinksChecked:checked,visitorGuideLinks:crossLinks,mapLinks,stagedLinks:0},null,2));
