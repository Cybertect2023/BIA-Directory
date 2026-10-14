/* Stirling-Rawdon BIA shared profile renderer: edit only data-business-id in Squarespace. */
(() => {
  "use strict";
  const root=document.getElementById("bia-business-profile");
  if(!root || root.dataset.ready==="true")return;
  root.dataset.ready="true";
  const id=(root.dataset.businessId||"").trim();
  const DATA_URL="https://cybertect2023.github.io/BIA-Directory/businesses.json";
  const DIRECTORY_URL="/business-directory";
  const str=v=>typeof v==="string"?v.trim():"";
  const el=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n;};
  function url(v){try{const u=new URL(str(v));return ["https:","http:"].includes(u.protocol)?u.href:"";}catch(_){return "";}}
  function a(label,href,cls,external){const n=el("a",cls,label);n.href=href;if(external){n.target="_blank";n.rel="noopener noreferrer";}return n;}
  const days={monday:"Monday",tuesday:"Tuesday",wednesday:"Wednesday",thursday:"Thursday",friday:"Friday",saturday:"Saturday",sunday:"Sunday"};
  const categoryTheme=v=>{
    const c=str(v).toLowerCase();
    if(/restaurant|bakery|food|dining|caf[eé]|coffee/.test(c))return ["🍽️","EAT & DRINK","#f3ebe0","#865e42"];
    if(/health|medical|wellness|therapy/.test(c))return ["❤️","WELLNESS","#eee7eb","#865b6b"];
    if(/professional|financial|legal|insurance|service/.test(c))return ["💼","PROFESSIONAL SERVICES","#e8edf4","#485e78"];
    if(/recreation|sport|fitness/.test(c))return ["⚽","ACTIVE LIVING","#e6ede5","#416c5e"];
    if(/farm|agricultur/.test(c))return ["🌾","LOCAL GROWN","#eeedde","#6f7042"];
    if(/shop|retail/.test(c))return ["🛍️","SHOP LOCAL","#f0e7ee","#825a78"];
    if(/accommod|lodg|stay/.test(c))return ["🛏️","STAY & EXPLORE","#e7eef0","#4d7280"];
    return ["🏬","LOCAL BUSINESS","#e8eee6","#46644f"];
  };
  function addContact(parent,label,value,href,symbol){
    if(!value)return;
    const r=el("div","bia-profile__contact-row");
    r.append(el("span","bia-profile__contact-icon",symbol));
    const detail=el("div");detail.append(el("span","bia-profile__contact-label",label));
    detail.append(href?a(value,href,null,/^https?:\/\//.test(href)):el("span",null,value));
    r.append(detail);parent.append(r);
  }
  function render(b){
    root.replaceChildren();
    const name=str(b.name)||"Local Business";
    const [icon,label,wash,ink]=categoryTheme(b.category);
    root.style.setProperty("--profile-wash",wash);root.style.setProperty("--profile-ink",ink);
    const crumbs=el("nav","bia-profile__crumbs");crumbs.setAttribute("aria-label","Breadcrumb");
    crumbs.append(a("← Business Directory",DIRECTORY_URL),el("span",null,"/"),el("span",null,name));root.append(crumbs);
    const hero=el("section","bia-profile__hero");
    const copy=el("div","bia-profile__hero-copy");copy.append(el("p","bia-profile__eyebrow","Discover Stirling-Rawdon"));
    if(str(b.category))copy.append(el("span","bia-profile__category",b.category));
    copy.append(el("h1","bia-profile__title",name));
    if(str(b.description))copy.append(el("p","bia-profile__intro",b.description));
    const buttons=el("div","bia-profile__buttons");
    const website=url(b.website), address=str(b.address), phone=str(b.phone).replace(/[^+\d]/g,"");
    if(website)buttons.append(a("Visit Website ↗",website,"bia-profile__button",true));
    if(phone)buttons.append(a("Call Business","tel:"+phone,"bia-profile__button"+(website?" bia-profile__button--outline":"")));
    if(address)buttons.append(a("Get Directions ↗","https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(address),"bia-profile__button bia-profile__button--outline",true));
    if(buttons.children.length)copy.append(buttons);
    hero.append(copy);
    const art=el("div","bia-profile__art");
    art.append(el("span","bia-profile__art-symbol",icon),el("span","bia-profile__art-label",label));
    const photo=url(b.image), logo=url(b.logo);
    if(photo){const img=el("img","bia-profile__photo");img.src=photo;img.alt="";img.loading="lazy";img.addEventListener("error",()=>img.remove());art.append(img);}
    else if(logo){const img=el("img","bia-profile__logo");img.src=logo;img.alt="Logo for "+name;img.loading="lazy";img.addEventListener("error",()=>img.remove());art.replaceChildren(img);}
    hero.append(art);root.append(hero);
    const hours=b.hours&&typeof b.hours==="object"?b.hours:{};
    const hasHours=Object.keys(days).some(d=>str(hours[d]));
    const services=Array.isArray(b.services)?b.services.filter(s=>str(s)):[];
    if(hasHours||services.length){
      const columns=el("div","bia-profile__two-col");
      if(hasHours){
        const section=el("section","bia-profile__panel");section.append(el("h2",null,"Hours of Operation"));
        const dl=el("dl","bia-profile__hours");
        for(const [key,day] of Object.entries(days)){if(!str(hours[key]))continue;
          const row=el("div","bia-profile__hours-row");row.append(el("dt",null,day),el("dd",null,hours[key]));dl.append(row);
        }
        section.append(dl);columns.append(section);
      }
      if(services.length){
        const section=el("section","bia-profile__panel");section.append(el("h2",null,"Products & Services"));
        const list=el("ul","bia-profile__services");
        for(const service of services)list.append(el("li",null,service));
        section.append(list);columns.append(section);
      }
      root.append(columns);
    }
    if(str(b.about)){
      const section=el("section","bia-profile__about");
      section.append(el("p","bia-profile__eyebrow","Get to know us"),el("h2",null,"About "+name));
      for(const paragraph of str(b.about).split(/\n\s*\n/).filter(Boolean))section.append(el("p",null,paragraph));
      root.append(section);
    }
    const contacts=el("div","bia-profile__contact-items");
    if(address)addContact(contacts,"Address",address,"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(address),"📍");
    if(phone)addContact(contacts,"Phone",str(b.phone),"tel:"+phone,"☎");
    const email=str(b.email);
    if(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))addContact(contacts,"Email",email,"mailto:"+email,"✉");
    if(website)addContact(contacts,"Website",new URL(website).hostname.replace(/^www\./,""),website,"🌐");
    const socials=el("div","bia-profile__social");
    for(const [field,label]of [["facebook","Facebook ↗"],["instagram","Instagram ↗"]]){
      const href=url(b[field]);if(href)socials.append(a(label,href,null,true));
    }
    if(contacts.children.length||socials.children.length){
      const visit=el("section","bia-profile__visit");
      const info=el("div","bia-profile__visit-info");
      info.append(el("p","bia-profile__eyebrow","Visit or get in touch"),el("h2",null,"Find "+name),contacts);
      if(socials.children.length)info.append(socials);
      visit.append(info);
      if(address){
        const map=el("div","bia-profile__map"),frame=el("iframe");
        frame.src="https://www.google.com/maps?q="+encodeURIComponent(address)+"&output=embed";
        frame.loading="lazy";frame.referrerPolicy="no-referrer-when-downgrade";frame.title="Map for "+name;
        map.append(frame);visit.append(map);
      }
      root.append(visit);
    }
    const back=el("p","bia-profile__back");back.append(a("← Back to all businesses",DIRECTORY_URL));root.append(back);
    if(b.verificationStatus==="needs-review"){
      const note=el("p","bia-profile__review","Business information is pending confirmation.");
      note.style.cssText="font:400 .78rem/1.5 Arial,sans-serif;color:#78867b;margin-top:20px;";
      root.append(note);
    }
  }
  if(!id){root.textContent="Business ID missing. Set data-business-id on the Squarespace profile container.";return;}
  fetch(DATA_URL,{cache:"no-cache"})
    .then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json();})
    .then(data=>{
      const b=Array.isArray(data.businesses)?data.businesses.find(v=>v&&v.id===id):null;
      if(!b){root.textContent="This business profile is not available yet.";return;}
      render(b);
    })
    .catch(err=>{console.error("BIA profile:",err);root.textContent="We couldn't load this business profile. Please try again later.";});
})();