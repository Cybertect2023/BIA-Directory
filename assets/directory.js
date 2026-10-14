/* Stirling-Rawdon BIA directory: loaded by a tiny Squarespace Code Block. */
(() => {
  "use strict";
  const root = document.getElementById("bia-directory");
  if (!root || root.dataset.ready === "true") return;
  root.dataset.ready = "true";
  const DATA_URL = "https://cybertect2023.github.io/BIA-Directory/businesses.json";
  const text = v => typeof v === "string" ? v.trim() : "";
  const node = (tag, cls, value) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (value !== undefined) n.textContent = value;
    return n;
  };
  // Only allow navigable HTTP(S) URLs; business profile URLs must stay on this site.
  const imageUrl = value => {
    try { const u = new URL(text(value)); return ["https:", "http:"].includes(u.protocol) ? u.href : ""; }
    catch (_) { return ""; }
  };
  const profileUrl = value => {
    if (!text(value)) return "";
    try {
      const u = new URL(value, window.location.origin);
      return u.origin === location.origin && ["https:", "http:"].includes(u.protocol) ? u.href : "";
    } catch (_) { return ""; }
  };

  // Consistent, lightweight line artwork; no external icon library or emoji fonts.
  const makeLineIcon = kind => {
    const NS = "http://www.w3.org/2000/svg";
    const shapes = {
      dining: [
        "M4 3v7a3 3 0 0 0 6 0V3",
        "M7 3v18",
        "M18 3c-3 2.2-4 5.4-4 10h4V3",
        "M18 13v8"
      ],
      services: [
        "M5 8h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z",
        "M9 8V6a3 3 0 0 1 3-3 3 3 0 0 1 3 3v2",
        "M3 13h18",
        "M10 13v2h4v-2"
      ],
      wellness: [
        "M20.5 8.6c0 4.2-5.4 8.4-8.5 10.8C8.9 17 3.5 12.8 3.5 8.6a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2Z",
        "M12 8v6",
        "M9 11h6"
      ],
      active: [
        "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
        "M12 3c3 3 4.5 6 4.5 9S15 18 12 21",
        "M12 3c-3 3-4.5 6-4.5 9S9 18 12 21",
        "M3 12h18"
      ],
      farm: [
        "M12 22V4",
        "M12 10c0-4 2.5-6 6-7-.1 4-2.1 6.4-6 7Z",
        "M12 14c0-3.8-2.4-5.6-6-6.5.2 3.8 2.3 6.1 6 6.5Z",
        "M12 18c0-3.2 2.5-5 6-5.6-.2 3.5-2.3 5.6-6 5.6Z"
      ],
      retail: [
        "M5 9h14l-1 12H6L5 9Z",
        "M9 10V7a3 3 0 0 1 6 0v3"
      ],
      stay: [
        "M3 20V5",
        "M3 12h18v8",
        "M3 16h18",
        "M7.5 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
        "M10 12V9h7a4 4 0 0 1 4 4"
      ],
      general: [
        "M4 21h16",
        "M6 21V8l6-4 6 4v13",
        "M9 21v-6h6v6",
        "M9 10h.01",
        "M12 10h.01",
        "M15 10h.01"
      ]
    };
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.7");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    for (const d of shapes[kind] || shapes.general) {
      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", d);
      svg.append(path);
    }
    return svg;
  };

  const categoryStyle = value => {
    const c = text(value).toLowerCase();
    if (/restaurant|bakery|food|dining|caf[eé]|coffee/.test(c)) return ["dining","EAT & DRINK","#f3ebe0","#865e42"];
    if (/health|medical|wellness|therapy|dental/.test(c)) return ["wellness","WELLNESS","#eee7eb","#865b6b"];
    if (/professional|financial|legal|insurance|service/.test(c)) return ["services","SERVICES","#e8edf4","#485e78"];
    if (/recreation|sport|fitness/.test(c)) return ["active","ACTIVE LIVING","#e6ede5","#416c5e"];
    if (/farm|agricultur/.test(c)) return ["farm","LOCAL GROWN","#eeedde","#6f7042"];
    if (/shop|retail/.test(c)) return ["retail","SHOP LOCAL","#f0e7ee","#825a78"];
    if (/accommod|lodg|stay/.test(c)) return ["stay","STAY & EXPLORE","#e7eef0","#4d7280"];
    return ["general","STIRLING-RAWDON","#e8eee6","#46644f"];
  };
  root.replaceChildren();
  const header = node("header","bia-dir__heading");
  header.append(node("p","bia-dir__eyebrow","DISCOVER STIRLING-RAWDON"),node("h1",null,"Explore Local Businesses"),node("p",null,"Discover the people and places that make our community unique."));
  const tools = node("div","bia-dir__tools");
  const searchLabel = node("label","bia-dir__sr-only","Search businesses");
  searchLabel.htmlFor="bia-dir-search";
  const search=node("input","bia-dir__search");
  search.type="search";search.id="bia-dir-search";search.placeholder="Search businesses, services, or locations…";search.autocomplete="off";
  const categoryLabel=node("label","bia-dir__sr-only","Business category");categoryLabel.htmlFor="bia-dir-category";
  const category=node("select","bia-dir__category");category.id="bia-dir-category";
  category.append(node("option",null,"All categories"));category.options[0].value="";
  tools.append(searchLabel,search,categoryLabel,category);
  const count=node("p","bia-dir__summary","Loading local businesses…");count.setAttribute("role","status");count.setAttribute("aria-live","polite");
  const results=node("div","bia-dir__grid");
  const empty=node("div","bia-dir__empty");empty.hidden=true;
  empty.append(node("strong",null,"No businesses found"),node("p",null,"Try another search or category."));
  const reset=node("button",null,"Clear filters");reset.type="button";empty.append(reset);
  const notice=node("p","bia-dir__notice");notice.hidden=true;
  root.append(header,tools,count,results,empty,notice);
  let businesses=[];
  function card(b){
    const name=text(b.name)||"Local business", url=profileUrl(b.profileUrl);
    const box=node("article","bia-dir__card"+(url?" bia-dir__card--linked":""));
    const [symbol,label,wash,ink]=categoryStyle(b.category);
    box.style.setProperty("--card-wash",wash);box.style.setProperty("--card-ink",ink);
    const cover=node("div","bia-dir__cover");
    const icon=node("span","bia-dir__symbol");icon.setAttribute("aria-hidden","true");icon.append(makeLineIcon(symbol));
    cover.append(icon,node("span","bia-dir__cover-label",label));
    const image=imageUrl(b.image);
    const logo=imageUrl(b.logo);
    if(image){const img=node("img","bia-dir__photo");img.src=image;img.alt="";img.loading="lazy";img.addEventListener("error",()=>img.remove());cover.append(img);}
    else if(logo){const img=node("img","bia-dir__logo");img.src=logo;img.alt="";img.loading="lazy";img.addEventListener("error",()=>img.remove());cover.append(img);}
    box.append(cover);
    const body=node("div","bia-dir__body");
    if(text(b.category))body.append(node("span","bia-dir__tag",b.category));
    body.append(node("h2","bia-dir__title",name));
    if(text(b.description))body.append(node("p","bia-dir__description",b.description));
    if(text(b.address))body.append(node("p","bia-dir__location",b.address));
    const footer=node("div","bia-dir__footer");
    const view=node("span",url?"bia-dir__view":"bia-dir__pending",url?"View Business Profile →":"Profile coming soon");
    footer.append(view);
    const actions=node("div","bia-dir__actions");
    const phone=text(b.phone).replace(/[^+\d]/g,"");
    if(phone){const a=node("a","bia-dir__action","Call");a.href="tel:"+phone;a.setAttribute("aria-label","Call "+name);actions.append(a);}
    if(text(b.address)){const a=node("a","bia-dir__action","Directions ↗");a.href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(b.address);a.target="_blank";a.rel="noopener noreferrer";a.setAttribute("aria-label","Directions to "+name);actions.append(a);}
    footer.append(actions);body.append(footer);box.append(body);
    if(url){const a=node("a","bia-dir__card-link");a.href=url;a.setAttribute("aria-label","View business profile for "+name);box.append(a);}
    return box;
  }
  function render(){
    const needle=search.value.trim().toLocaleLowerCase("en-CA");
    const cat=category.value;
    const filtered=businesses.filter(b=>{
      if(cat && text(b.category)!==cat)return false;
      const haystack=[b.name,b.category,b.description,b.address,...(Array.isArray(b.services)?b.services:[])].map(text).join(" ").toLocaleLowerCase("en-CA");
      return haystack.includes(needle);
    });
    results.replaceChildren(...filtered.map(card));
    count.textContent=filtered.length+" "+(filtered.length===1?"business":"businesses")+" found";
    empty.hidden=filtered.length!==0;
  }
  search.addEventListener("input",render);
  category.addEventListener("change",render);
  reset.addEventListener("click",()=>{search.value="";category.value="";render();search.focus();});
  fetch(DATA_URL,{cache:"no-cache"})
    .then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json();})
    .then(data=>{
      if(!Array.isArray(data.businesses))throw new Error("Invalid businesses.json");
      businesses=data.businesses.filter(b=>b&&typeof b==="object"&&text(b.name)).sort((a,b)=>text(a.name).localeCompare(text(b.name),"en-CA"));
      for(const cat of [...new Set(businesses.map(b=>text(b.category)).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"en-CA"))){
        const option=node("option",null,cat);option.value=cat;category.append(option);
      }
      const unverified=businesses.filter(b=>b.verificationStatus==="needs-review").length;
      if(unverified){notice.hidden=false;notice.textContent="TEST DIRECTORY: "+unverified+" historical listings still need verification before public launch.";}
      render();
    })
    .catch(err=>{console.error("BIA directory:",err);count.textContent="Unable to load businesses.";notice.hidden=false;notice.textContent="The directory is temporarily unavailable. Please try again later.";});
})();