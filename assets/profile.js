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
      shield: [
        "M12 3 20 6v5c0 5.2-3.4 8.5-8 10-4.6-1.5-8-4.8-8-10V6l8-3Z",
        "m8.5 12 2.2 2.2 4.8-5"
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
      location: [
        "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z",
        "M12 12.6a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4Z"
      ],
      phone: [
        "M6 3.7 9.4 7l-2.1 2.6a14 14 0 0 0 7.1 7.1L17 14.6l3.3 3.4-1.4 2c-1.2 1.8-3.2 1.6-5.5.7A19 19 0 0 1 3.3 10.6C2.4 8.3 2.2 6.3 4 5.1l2-1.4Z"
      ],
      email: [
        "M4 6h16a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 18H4a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4 6Z",
        "m3 7 9 7 9-7"
      ],
      web: [
        "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
        "M12 3c-3 3-4.5 6-4.5 9S9 18 12 21",
        "M12 3c3 3 4.5 6 4.5 9S15 18 12 21",
        "M3 12h18"
      ],
      home: [
        "M3 11.5 12 4l9 7.5",
        "M5.5 10.5V21h13V10.5",
        "M10 21v-7h4v7",
        "M18 6c-2.5.3-3.8 1.9-3.6 4.1 2.1.2 3.8-1.1 3.6-4.1Z"
      ],
      auto: [
        "M5.5 11 7.3 6.7A2.5 2.5 0 0 1 9.6 5h4.8a2.5 2.5 0 0 1 2.3 1.7l1.8 4.3",
        "M4 11h16a2 2 0 0 1 2 2v5H2v-5a2 2 0 0 1 2-2Z",
        "M5 18v2",
        "M19 18v2",
        "M6.5 15.1h2",
        "M15.5 15.1h2"
      ],
      education: [
        "M12 6c-2.5-1.6-5.5-1.9-9-1.2V19c3.5-.7 6.5-.4 9 1.2",
        "M12 6c2.5-1.6 5.5-1.9 9-1.2V19c-3.5-.7-6.5-.4-9 1.2",
        "M12 6v14.2"
      ],
      community: [
        "M9 7a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z",
        "M4 20v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2",
        "M3 8a2 2 0 0 0 0 4",
        "M21 8a2 2 0 0 1 0 4"
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

  const categoryTheme = value => {
    const c = str(value).toLowerCase();
    if (/restaurant|bakery|food|dining|caf[eé]|coffee/.test(c)) return ["dining","EAT & DRINK","#f3ebe0","#865e42"];
    if (/health|medical|wellness|therapy|beauty|dental/.test(c)) return ["wellness","WELLNESS","#eee7eb","#865b6b"];
    if (/cyber|digital/.test(c)) return ["shield","DIGITAL RISK OVERSIGHT","#e5eee8","#315b43"];
    if (/professional|financial|legal|insurance|service/.test(c)) return ["services","PROFESSIONAL SERVICES","#e8edf4","#485e78"];
    if (/home|garden|hardware|construction|building suppl/.test(c)) return ["home","HOME & GARDEN","#e5ede4","#486853"];
    if (/automotive|auto repair|vehicle|powersport|collision/.test(c)) return ["auto","AUTOMOTIVE","#e5ebf2","#4c637b"];
    if (/education|learning|tutor|school/.test(c)) return ["education","EDUCATION & LEARNING","#f3ecdf","#856946"];
    if (/community|arts|organization|theatre|nonprofit/.test(c)) return ["community","COMMUNITY & ARTS","#ede9f2","#695b7f"];
    if (/recreation|sport|fitness/.test(c)) return ["active","ACTIVE LIVING","#e6ede5","#416c5e"];
    if (/farm|agricultur/.test(c)) return ["farm","LOCAL GROWN","#eeedde","#6f7042"];
    if (/shop|retail/.test(c)) return ["retail","SHOP LOCAL","#f0e7ee","#825a78"];
    if (/accommod|lodg|stay/.test(c)) return ["stay","STAY & EXPLORE","#e7eef0","#4d7280"];
    return ["general", str(value) || "LOCAL BUSINESS","#e8eee6","#46644f"];
  };
  function addContact(parent,label,value,href,symbol){
    if(!value)return;
    const r=el("div","bia-profile__contact-row");
    const contactIcon=el("span","bia-profile__contact-icon");contactIcon.append(makeLineIcon(symbol));r.append(contactIcon);
    const detail=el("div");detail.append(el("span","bia-profile__contact-label",label));
    detail.append(href?a(value,href,null,/^https?:\/\//.test(href)):el("span",null,value));
    r.append(detail);parent.append(r);
  }
  function render(b){
    root.replaceChildren();
    root.dataset.profileId=str(b.id);
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
    const symbol=el("span","bia-profile__art-symbol");symbol.append(makeLineIcon(icon));
    art.append(symbol,el("span","bia-profile__art-label",label));
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
        const deliveryHours=str(b.deliveryHours);
        if(deliveryHours){
          const row=el("div","bia-profile__hours-row");row.append(el("dt",null,"Delivery"),el("dd",null,deliveryHours));dl.append(row);
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
    const feature=b.highlightLink&&typeof b.highlightLink==="object"?b.highlightLink:null;
    const featureHref=url(feature&&feature.url);
    if(featureHref){
      const section=el("section","bia-profile__feature-link");
      const copy=el("div","bia-profile__feature-copy");
      copy.append(el("p","bia-profile__eyebrow",str(feature.eyebrow)||"Featured resource"));
      copy.append(el("h2",null,str(feature.title)||"Explore this resource"));
      if(str(feature.description))copy.append(el("p",null,str(feature.description)));
      section.append(copy);
      section.append(a(str(feature.label)||"Learn more ↗",featureHref,"bia-profile__button",true));
      root.append(section);
    }
    if(str(b.communityNote)){
      const section=el("section","bia-profile__community-note");
      section.append(el("p","bia-profile__eyebrow","Community contribution"));
      section.append(el("p","bia-profile__community-copy",b.communityNote));
      root.append(section);
    }
    const relatedLinks=Array.isArray(b.relatedLinks)?b.relatedLinks:[];
    const validRelatedLinks=relatedLinks.map(item=>({label:str(item&&item.label),href:url(item&&item.url)})).filter(item=>item.href);
    if(validRelatedLinks.length){
      const section=el("section","bia-profile__about");
      section.append(el("p","bia-profile__eyebrow","Explore more"),el("h2",null,"Related Links"));
      const links=el("div","bia-profile__buttons");
      for(const item of validRelatedLinks)links.append(a(item.label||"Learn more ↗",item.href,"bia-profile__button bia-profile__button--outline",true));
      section.append(links);root.append(section);
    }
    const contacts=el("div","bia-profile__contact-items");
    if(address)addContact(contacts,"Address",address,"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(address),"location");
    if(phone)addContact(contacts,"Phone",str(b.phone),"tel:"+phone,"phone");
    const email=str(b.email);
    if(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))addContact(contacts,"Email",email,"mailto:"+email,"email");
    if(website)addContact(contacts,"Website",new URL(website).hostname.replace(/^www\./,""),website,"web");
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