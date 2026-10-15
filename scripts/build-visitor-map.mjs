/* Regenerate crawlable HTML from canonical business data. Never maintain a second business dataset. */
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {buildPlaces,CATEGORIES,SITE,safeUrl} from '../assets/visitor-map-core.js';
const root=new URL('../',import.meta.url);
const read=async path=>readFile(new URL(path,root),'utf8');
const data=JSON.parse(await read('explore/map-locations.json'));
const places=buildPlaces(JSON.parse(await read('businesses.json')),data);
const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fallback='<ul>\n'+places.map(p=>{
 const url=p.profileUrl||p.website;
 return '<li>'+(url?'<a href="'+escape(url)+'">'+escape(p.name)+'</a>':escape(p.name))+'<small>'+escape(CATEGORIES[p.visitorCategory])+(p.hideAddress?' — Contact business to confirm location':p.address?' · '+escape(p.address):'')+'</small></li>';
}).join('\n')+'\n</ul>';
const restaurants=data.collections.find(c=>c.id==='theatre').ids.filter(id=>id!=='stirling-festival-theatre').map(id=>{
 const p=places.find(p=>p.id===id);return '<li><a href="'+escape(p.profileUrl||p.website)+'">'+escape(p.name)+' ↗</a></li>';
}).join('\n');
let content=(await read('scripts/visitor-map-page.html')).replace('<!-- GENERATED_PLACES -->',fallback).replace('<!-- GENERATED_RESTAURANTS -->',restaurants);
const title='Stirling-Rawdon Visitor Map | Restaurants, Shops & Things to Do';
const description='Explore Stirling-Rawdon with an interactive visitor map. Discover local restaurants, shops, Stirling Festival Theatre, farms, parks, attractions and places to visit.';
const html='<!doctype html>\n<html lang="en-CA">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<meta name="referrer" content="strict-origin-when-cross-origin">\n<title>'+escape(title)+'</title>\n<meta name="description" content="'+escape(description)+'">\n<link rel="stylesheet" href="../assets/visitor-map.css">\n<style>body{margin:0;background:#f7f5ef}</style>\n</head>\n<body>\n<main>'+content+'</main>\n<script type="module" src="../assets/visitor-map.js"></script>\n</body>\n</html>\n';
// Both directories have the same depth. The pages template also works as a standalone preview.
const outputs={'pages/plan-your-visit.html':html,'plan-your-visit/index.html':html,
 'launch/plan-your-visit-static.html':content+'\n<link rel="stylesheet" href="https://cybertect2023.github.io/BIA-Directory/assets/visitor-map.css">\n<script type="module" src="https://cybertect2023.github.io/BIA-Directory/assets/visitor-map.js"></script>\n'};
let changed=false;
for(const[path,value]of Object.entries(outputs)){
 let current='';try{current=await read(path);}catch{}
 if(current!==value){changed=true;if(process.argv.includes('--check')){console.error('Generated output is stale: '+path);process.exitCode=1;}else{await writeFile(new URL(path,root),value);console.log('Generated '+path);}}
}
if(!changed)console.log('Visitor-map HTML is current.');
