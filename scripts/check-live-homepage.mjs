/* One-shot live homepage audit. The Squarespace homepage cards are native, not GitHub templates. */
import {mkdirSync,writeFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const origin='https://www.visitstirlingrawdon.ca';
const targets=[
 {name:'Eat & Drink',labels:['Explore Dining'],expected:'/eat-and-drink'},
 {name:'Shop Local',labels:['Explore Shops'],expected:'/shop-local'},
 {name:'Explore & Enjoy',labels:["What's Happening","Explore Stirling-Rawdon"],expected:'/explore-and-enjoy'}
];
async function get(path){
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),22000);
 try{const res=await fetch(origin+path,{headers:{'User-Agent':'StirlingRawdonBIA-Maintainer-Audit/1.0','Cache-Control':'no-cache'},signal:controller.signal,redirect:'follow'});return {status:res.status,finalUrl:res.url,html:await res.text()};}
 finally{clearTimeout(timer)}
}
const home=await get('/');
const doc=new JSDOM(home.html).window.document;
const hrefs=[...doc.querySelectorAll('a[href]')].map(a=>({text:a.textContent.replace(/\s+/g,' ').trim(),href:new URL(a.getAttribute('href'),origin).pathname+new URL(a.getAttribute('href'),origin).search}));
const cards=targets.map(c=>{
 let found=hrefs.find(a=>c.labels.some(label=>a.text.toLowerCase()===label.toLowerCase()));
 if(!found){
  const heading=[...doc.querySelectorAll('h2,h3,h4')].find(e=>e.textContent.replace(/\s+/g,' ').trim()===c.name);
  found=heading?.closest('article,section,div')?.querySelector('a[href]');
  if(found){const url=new URL(found.getAttribute('href'),origin);found={text:found.textContent.trim(),href:url.pathname+url.search};}
 }
 return {...c,found:found||null,pass:Boolean(found)&&found.href===c.expected};
});
const events=await get('/events');
const eventTitle=new JSDOM(events.html).window.document.title;
const result={checkedAt:new Date().toISOString(),homepage:{status:home.status,links:cards},events:{status:events.status,title:eventTitle,titleCorrected:eventTitle.toLowerCase().includes('stirling-rawdon events')},pass:cards.every(x=>x.pass)&&events.status===200&&home.status===200};
mkdirSync('launch',{recursive:true});
writeFileSync('launch/homepage-live-audit.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
