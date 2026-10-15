import {CATEGORIES,SITE,safeUrl,hasPoint,buildPlaces,filterPlaces,readState,stateUrl,readSaved,directionsUrl,nearbyPlaces} from './visitor-map-core.js';

const ROOT = new URL('../', import.meta.url);
const STORAGE_KEY = 'stirling-visitor-stops-v1';
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let dependencyPromise;
let serial = 0;
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const button = (label, action, className) => {
  const node = el('button',className,label); node.type='button'; node.addEventListener('click',action); return node;
};
function link(label,url,className) {
  const node=el('a',className,label); node.href=url.startsWith('#') ? new URL(url,window.location.href).href : safeUrl(url);
  if (new URL(node.href).origin!==window.location.origin) {node.target='_blank';node.rel='noopener noreferrer';}
  return node;
}
function css(path) {
  const href=new URL(path,ROOT).href;
  const existing=[...document.querySelectorAll('link[rel=stylesheet]')].find(l=>l.href===href);
  if(existing?.sheet) return Promise.resolve();
  return new Promise((resolve,reject)=>{
    const node=existing || document.createElement('link');
    const timeout=setTimeout(()=>reject(new Error('Stylesheet timed out')),15000);
    node.addEventListener('load',()=>{clearTimeout(timeout);resolve();},{once:true});
    node.addEventListener('error',()=>{clearTimeout(timeout);node.remove();reject(new Error('Stylesheet unavailable'));},{once:true});
    if(!existing) {node.rel='stylesheet';node.href=href;document.head.append(node);}
  });
}
function script(path) {
  return new Promise((resolve,reject)=>{
    const node=document.createElement('script');node.src=new URL(path,ROOT).href;node.async=true;
    const timeout=setTimeout(()=>{node.remove();reject(new Error('Map dependency timed out'));},15000);
    node.onload=()=>{clearTimeout(timeout);resolve();};node.onerror=()=>{clearTimeout(timeout);node.remove();reject(new Error('Map dependency unavailable'));};
    document.head.append(node);
  });
}
function dependencies() {
  if(!dependencyPromise) dependencyPromise=(async()=>{
    await Promise.all([css('assets/vendor/leaflet.css'),css('assets/vendor/MarkerCluster.css')]);
    if(!window.L?.map) await script('assets/vendor/leaflet.js');
    if(!window.L?.markerClusterGroup) await script('assets/vendor/leaflet.markercluster.js');
    return window.L;
  })().catch(error=>{dependencyPromise=null;throw error;});
  return dependencyPromise;
}
async function json(path) {
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
  try {
    const response=await fetch(new URL(path,ROOT),{signal:controller.signal});
    if(!response.ok) throw new Error(path+' HTTP '+response.status);
    return await response.json();
  } finally {clearTimeout(timeout);}
}

export async function mount(host) {
  if(host.dataset.vmMounted) return;
  host.dataset.vmMounted='loading';
  const scope=host.closest('.bia-visit') || host;
  scope.classList.add('bia-visit');
  const styleReady=css('assets/visitor-map.css');styleReady.catch(()=>{});
  const fallback=[...host.childNodes];
  let directory,data;
  try {
    [directory,data]=await Promise.all([json('businesses.json'),json('explore/map-locations.json')]);
    if(!Array.isArray(directory.businesses)||data.schemaVersion!==1||!Array.isArray(data.collections)) throw new Error('Unsupported map data');
  } catch(error) {
    host.dataset.vmMounted='error';
    const notice=el('p','vm-notice','The interactive guide could not load. Use the links below or try again.');notice.setAttribute('role','status');
    host.prepend(notice,button('Try again',()=>{host.replaceChildren(...fallback);delete host.dataset.vmMounted;void mount(host);}));
    console.warn('Visitor guide unavailable:',error.message);return;
  }
  const places=buildPlaces(directory,data), byId=new Map(places.map(p=>[p.id,p]));
  const validIds=new Set(byId.keys()), collections=data.collections;
  let state=readState(window.location.href,collections,places), saved=[], storageAvailable=true;
  try {saved=readSaved(localStorage.getItem(STORAGE_KEY),validIds);} catch {storageAvailable=false;}
  let map, cluster, markers=new Map(), mapLoading=false, observer, tileErrors=0, mapConfig;
  let provider='google', travelMode='driving';
  const uid='vm-'+(++serial);
  const app=el('div','vm-app');
  const bar=el('div','vm-app-bar');bar.append(el('h2','','Find your next stop'));
  const toolbar=el('div','vm-toolbar');toolbar.setAttribute('aria-label','Your visitor plan');
  const savedButton=button('Saved stops',()=>{
    state.savedOnly=!state.savedOnly;state.category='all';state.experience='';state.q='';state.selected='';
    render();setView('list');
  });
  const clearButton=button('Clear saved stops',()=>{saved=[];persist();render();announce('Your saved stops have been cleared.');});
  const shareButton=button('Share this map',()=>void share());
  toolbar.append(savedButton,clearButton,shareButton);bar.append(toolbar);app.append(bar);
  const message=el('p','vm-message');message.setAttribute('role','status');message.setAttribute('aria-live','polite');app.append(message);
  const shareField=el('input','vm-share-field');shareField.readOnly=true;shareField.hidden=true;shareField.setAttribute('aria-label','Shareable map link; copy this address');app.append(shareField);
  const mobileToggle=el('div','vm-mobile-toggle');mobileToggle.setAttribute('aria-label','Visitor guide view');
  const listView=button('List view',()=>setView('list'));
  const mapView=button('Map view',()=>{setView('map');void startMap();});
  mobileToggle.append(listView,mapView);app.append(mobileToggle);
  const shell=el('div','vm-shell');shell.dataset.view='list';app.append(shell);
  const sidebar=el('div','vm-sidebar'), controls=el('div','vm-controls');shell.append(sidebar);sidebar.append(controls);
  const searchLabel=el('label','vm-label','Search places');searchLabel.htmlFor=uid+'-search';
  const search=el('input','vm-search');search.id=searchLabel.htmlFor;search.type='search';search.maxLength=120;search.placeholder='A café, a shop, a place…';
  let searchTimer;search.addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>{
    state.q=search.value;state.selected='';render();fitResults();
  },160);});controls.append(searchLabel,search);
  const filters=el('div','vm-filter-row');const categoryLabel=el('label');categoryLabel.append(el('span','vm-label','Explore by category'));
  const category=el('select');category.setAttribute('aria-label','Explore by category');
  for(const [id,name] of Object.entries(CATEGORIES)){const option=el('option','',name);option.value=id;category.append(option);}
  category.addEventListener('change',()=>{state.category=category.value;state.experience='';state.selected='';render();fitResults();});categoryLabel.append(category);
  const reset=button('Show all',()=>{clearTimeout(searchTimer);state={category:'all',q:'',experience:'',selected:'',savedOnly:false};render();fitResults();});
  filters.append(categoryLabel,reset);controls.append(filters);
  const experiences=el('details','vm-experiences');experiences.append(el('summary','','Ideas for your visit'));
  const collectionButtons=el('div','vm-collections');
  for(const c of collections){const b=button(c.name,()=>setExperience(c.id));b.dataset.collection=c.id;b.append(el('span','','↗'));collectionButtons.append(b);}
  experiences.append(collectionButtons);controls.append(experiences);
  const collectionNote=el('p','vm-collection-note');controls.append(collectionNote);
  const resultsMeta=el('div','vm-results-meta');resultsMeta.setAttribute('role','status');resultsMeta.setAttribute('aria-live','polite');sidebar.append(resultsMeta);
  const results=el('ul','vm-results');results.setAttribute('aria-label','Places to visit');sidebar.append(results);
  const column=el('div','vm-map-column');shell.append(column);
  const mapWrap=el('div','vm-map'), mapStage=el('div','vm-map-stage');mapStage.setAttribute('aria-label','Interactive map of Stirling-Rawdon. Use arrow keys to pan, plus and minus to zoom.');mapStage.setAttribute('role','region');
  const placeholder=el('div','vm-map-placeholder');placeholder.append(el('h3','','Stirling, at your fingertips.'),el('p','','Explore the list or load the map to see verified places around the village and countryside.'));
  const loadButton=button('Load interactive map',()=>void startMap(),'vm-button--primary');placeholder.append(loadButton);mapWrap.append(mapStage,placeholder);
  const mapControls=el('div','vm-map-controls');mapControls.hidden=true;
  mapControls.append(button('Fit results',()=>fitResults()),button('Downtown',()=>map?.setView([44.2966,-77.5482],16,{animate:!reducedMotion()})));
  mapWrap.append(mapControls);column.append(mapWrap);
  const detail=el('section','vm-detail');detail.tabIndex=-1;detail.setAttribute('aria-label','Selected place');column.append(detail);
  const mapNotice=el('p','vm-notice');mapNotice.hidden=true;mapNotice.setAttribute('role','status');app.append(mapNotice);
  const footer=el('div','vm-map-footer');
  const credit=el('span','','Place coordinates checked '+data.verifiedOn+'. ');
  credit.append(link('© OpenStreetMap contributors','https://www.openstreetmap.org/copyright'));
  footer.append(credit,link('Report a basemap issue','https://www.openstreetmap.org/fixthemap'),link('Full business directory',SITE+'/business-directory'));app.append(footer);
  host.replaceChildren(app);host.dataset.vmMounted='true';

  function announce(text){message.textContent=text;}
  function syncUrl(){try{history.replaceState(history.state,'',stateUrl(window.location.href,state));}catch{/* Read-only embeds keep working. */}}
  function persist(){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));storageAvailable=true;}
    catch{storageAvailable=false;announce('Stops are saved for this visit only. This browser is blocking local storage.');}
  }
  function toggleSave(id){
    const fromDetail=detail.contains(document.activeElement)||Boolean(document.activeElement?.closest('.leaflet-popup'));
    const removed=saved.includes(id);saved=removed?saved.filter(x=>x!==id):[...saved,id];persist();render();
    const focusTarget=(fromDetail?detail:results).querySelector('[data-save="'+id+'"]');
    (focusTarget||savedButton).focus({preventScroll:true});
    announce((removed?'Removed ':'Saved ')+byId.get(id).name+'.'+(!storageAvailable?' Available for this visit only.':''));
  }
  function reorder(id,offset){const index=saved.indexOf(id),to=index+offset;if(to<0||to>=saved.length)return;
    [saved[index],saved[to]]=[saved[to],saved[index]];persist();render();
    const card=results.querySelector('[data-place="'+id+'"]');
    // At either end, the just-used control becomes disabled. Keep keyboard focus
    // on this stop instead of dropping it back to the document body.
    (card.querySelector('[data-reorder="'+offset+'"]:not(:disabled)')||card.querySelector('h3 button')).focus();
    announce(byId.get(id).name+' moved '+(offset<0?'earlier':'later')+' in your saved list.');
  }
  function setView(view){
    shell.dataset.view=view;listView.setAttribute('aria-pressed',String(view==='list'));mapView.setAttribute('aria-pressed',String(view==='map'));
    if(view==='map')requestAnimationFrame(()=>{map?.invalidateSize();if(!map)void startMap();});
  }
  function setExperience(id){clearTimeout(searchTimer);state={category:'all',q:'',experience:id,selected:'',savedOnly:false};experiences.open=true;render();fitResults();}
  function visible(){return filterPlaces(places,state,collections,saved);}
  function saveControl(p){const b=button(saved.includes(p.id)?'Remove stop':'Save stop',()=>toggleSave(p.id));b.dataset.save=p.id;b.setAttribute('aria-pressed',String(saved.includes(p.id)));b.setAttribute('aria-label',(saved.includes(p.id)?'Remove ':'Save ')+p.name);return b;}
  function profileControl(p){return p.profileUrl?link(p.profileUnavailable?'BIA directory ↗':'BIA profile ↗',p.profileUrl):p.website?link('Official information ↗',p.website):null;}
  function select(p,{focus=true,centre=true}={}){
    const resetFilters=!visible().some(x=>x.id===p.id);
    if(resetFilters){state.category='all';state.experience='';state.q='';state.savedOnly=false;}
    state.selected=p.id;render(resetFilters);setView('map');
    if(map&&hasPoint(p)&&centre){
      const marker=markers.get(p.id);
      if(marker)focusMarker(marker);
    }
    if(focus){
      detail.focus({preventScroll:true});
      if(window.matchMedia('(max-width:650px)').matches)detail.scrollIntoView({block:'start',behavior:'auto'});
    }
  }
  function renderCard(p){
    const li=el('li','vm-card');li.dataset.place=p.id;li.dataset.selected=String(state.selected===p.id);
    li.append(el('span','vm-category',CATEGORIES[p.visitorCategory]));
    const title=el('h3');title.append(button(p.name,()=>select(p)));li.append(title);
    if(p.address&&!p.hideAddress)li.append(el('p','',p.address));
    if(!hasPoint(p))li.append(el('p','vm-pending',p.status==='address-conflict'||p.status==='address-changed'?'Address being checked · pin withheld':'Location pin awaiting verification'));
    const actions=el('div','vm-card-actions');actions.append(saveControl(p));const profile=profileControl(p);if(profile)actions.append(profile);
    if(state.savedOnly){
      for(const [offset,label]of[[-1,'Move earlier'],[1,'Move later']]){const b=button(label,()=>reorder(p.id,offset));b.dataset.reorder=offset;b.disabled=saved.indexOf(p.id)+offset<0||saved.indexOf(p.id)+offset>=saved.length;b.setAttribute('aria-label',label+': '+p.name);actions.append(b);}
    }
    li.append(actions);return li;
  }
  function renderDetail(){
    detail.replaceChildren();const p=byId.get(state.selected);
    if(!p){detail.append(el('span','vm-category','Make a day of it'),el('h3','','A few good stops. A day of your own.'),el('p','','Choose a place to see its details, find nearby stops and get directions. Save your favourites to build a list in the order you want to visit.'));
      detail.append(el('p','','Saved stops stay in this browser. Collections are suggestions, not timed or optimized routes.'));return;}
    detail.append(el('span','vm-category',CATEGORIES[p.visitorCategory]),el('h3','',p.name));
    if(p.address&&!p.hideAddress)detail.append(el('p','',p.address));
    if(p.description)detail.append(el('p','',p.description));
    if(!hasPoint(p))detail.append(el('p','vm-pending',p.hideAddress?'This address is being checked. Contact the business before travelling.':'The location pin is awaiting verification. Use the profile or operator information to plan your visit.'));
    const actions=el('div','vm-detail-actions');actions.append(saveControl(p));const profile=profileControl(p);if(profile)actions.append(profile);
    if(p.kind==='business'&&p.website)actions.append(link('Website ↗',p.website));
    if(p.kind==='business'&&!p.website&&safeUrl(p.facebook))actions.append(link('Business updates ↗',p.facebook));
    if(p.profileUnavailable)detail.append(el('p','vm-pending','The individual BIA profile is not available yet. The directory and business updates are linked below.'));
    const phone=String(p.phone||'').replace(/[^+\d]/g,'');
    if(phone.length>=7){const call=el('a','','Call '+p.phone);call.href='tel:'+phone;actions.append(call);}
    actions.append(button('Share place',()=>void share()));detail.append(actions);
    if(p.directionsAllowed){
      const directions=el('details','vm-directions');directions.append(el('summary','','Directions — choose your map app'));
      const row=el('div','vm-directions-row');const appLabel=el('label');appLabel.append(el('span','vm-label','Map app'));
      const appSelect=el('select');appSelect.setAttribute('aria-label','Directions map app');
      for(const [value,label]of[['google','Google Maps'],['apple','Apple Maps']]){const o=el('option','',label);o.value=value;appSelect.append(o);}appSelect.value=provider;appLabel.append(appSelect);
      const modeLabel=el('label');modeLabel.append(el('span','vm-label','Travel mode'));const modeSelect=el('select');modeSelect.setAttribute('aria-label','Directions travel mode');
      for(const[value,label]of[['driving','Driving'],['walking','Walking']]){const o=el('option','',label);o.value=value;modeSelect.append(o);}modeSelect.value=p.pointType==='bridge-end'?'walking':travelMode;modeLabel.append(modeSelect);
      const go=link('Open directions ↗',directionsUrl(p,provider,modeSelect.value),'vm-button vm-button--primary');
      const update=()=>{provider=appSelect.value;travelMode=modeSelect.value;go.href=directionsUrl(p,provider,travelMode);};appSelect.addEventListener('change',update);modeSelect.addEventListener('change',update);
      row.append(appLabel,modeLabel,go);directions.append(row,el('p','','Directions use the destination name and published address. Pins identify places; they do not certify an entrance, parking spot or accessible route.'));detail.append(directions);
    }
    if(p.id==='stirling-festival-theatre')detail.append(link('Current performances ↗','https://www.stirlingfestivaltheatre.com/whats-on'),document.createTextNode(' · '),link('Plan your theatre night','#theatre-night'));
    const nearby=nearbyPlaces(places,p);
    if(nearby.length){const group=el('div','vm-nearby');group.append(el('strong','','Also nearby'),el('p','','Ordered by straight-line proximity; walking access may differ.'));nearby.forEach(n=>group.append(button(n.name,()=>select(n))));detail.append(group);}
  }
  function render(updateMarkers=true){
    search.value=state.q;category.value=state.category;
    savedButton.textContent='Saved stops ('+saved.length+')';savedButton.setAttribute('aria-pressed',String(state.savedOnly));
    clearButton.hidden=!state.savedOnly||!saved.length;
    for(const b of collectionButtons.children)b.setAttribute('aria-pressed',String(b.dataset.collection===state.experience));
    collectionNote.textContent=state.savedOnly?'Your stops, in your chosen order. Move stops earlier or later; open directions for each destination.':collections.find(c=>c.id===state.experience)?.description||'';
    collectionNote.hidden=!collectionNote.textContent;
    const shown=visible(),pins=shown.filter(hasPoint).length;
    resultsMeta.textContent=shown.length+' '+(shown.length===1?'place':'places')+' · '+pins+' verified '+(pins===1?'pin':'pins');
    results.replaceChildren(...shown.map(renderCard));
    if(!shown.length){const empty=el('li','vm-card');empty.append(el('h3','',state.savedOnly?'Your day starts here.':'No places found.'),el('p','',state.savedOnly?'Save a few places from the list to build your visit.':'Try a different name or clear your filters.'),button('Show all places',()=>reset.click()));results.append(empty);}
    renderDetail();if(updateMarkers)renderMarkers();else updateMarkerStyles();syncUrl();shareField.hidden=true;
  }
  function icon(p){
    const symbols={eat:'E',shop:'S',arts:'A',things:'T',farms:'F',outdoors:'P',services:'•'};
    return window.L.divIcon({className:'vm-marker vm-marker--'+p.visitorCategory+(state.selected===p.id?' vm-marker--selected':''),html:'<span class="vm-marker-dot"><span aria-hidden="true">'+symbols[p.visitorCategory]+'</span></span>',iconSize:[34,38],iconAnchor:[17,35],popupAnchor:[0,-31]});
  }
  function popup(p){const box=el('div');box.append(el('strong','',p.name),el('p','',p.address||''),button('View place',()=>select(p,{centre:false})),saveControl(p));const profile=profileControl(p);if(profile)box.append(profile);return box;}
  function updateMarkerStyles(){for(const[id,marker]of markers){const p=byId.get(id);marker.setIcon(icon(p));marker.setPopupContent(popup(p));}}
  function renderMarkers(){
    if(!map)return;cluster.clearLayers();markers=new Map();
    for(const p of visible().filter(hasPoint)){
      const marker=window.L.marker([p.lat,p.lon],{title:p.name,alt:p.name,keyboard:true,riseOnHover:true,icon:icon(p)});
      marker.bindPopup(popup(p));marker.on('click',()=>{state.selected=p.id;render(false);});
      marker.on('add',()=>{const node=marker.getElement();if(node){node.setAttribute('aria-label',p.name);node.addEventListener('keydown',event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();marker.fire('click');marker.openPopup();}});}});
      markers.set(p.id,marker);cluster.addLayer(marker);
    }
  }
  function fitResults(){if(map&&markers.size){map.fitBounds(cluster.getBounds(),{padding:[40,40],maxZoom:16,animate:!reducedMotion()});}}
  function focusMarker(marker){
    // Synchronous selection avoids stale zoom callbacks when filters change rapidly.
    map.setView(marker.getLatLng(),map.getMaxZoom(),{animate:false});
    const parent=cluster.getVisibleParent(marker);
    if(parent!==marker&&parent?.spiderfy)parent.spiderfy();
    marker.openPopup();
  }
  async function startMap(){
    if(map||mapLoading)return;
    if(window.matchMedia('(max-width:650px)').matches&&shell.dataset.view!=='map')return;
    mapLoading=true;loadButton.disabled=true;loadButton.textContent='Loading map…';
    try{
      const [L,config]=await Promise.all([dependencies(),json('explore/map-config.json'),styleReady.catch(()=>css('assets/visitor-map.css'))]);
      const tileURL=safeUrl(config.tiles?.url),attributionURL=safeUrl(config.tiles?.attributionUrl);
      if(!tileURL||!attributionURL||!Array.isArray(config.initialView?.center))throw new Error('Invalid map configuration');
      mapConfig=config;
      map=L.map(mapStage,{scrollWheelZoom:false,zoomControl:false,fadeAnimation:!reducedMotion(),zoomAnimation:!reducedMotion(),markerZoomAnimation:!reducedMotion()}).setView(config.initialView.center,config.initialView.zoom);
      L.control.zoom({position:'topright'}).addTo(map);
      const attr=link(config.tiles.attributionText,attributionURL);
      L.tileLayer(config.tiles.url,{maxZoom:config.tiles.maxZoom||19,attribution:attr.outerHTML,referrerPolicy:'strict-origin-when-cross-origin',updateWhenIdle:true,keepBuffer:1}).on('tileerror',()=>{
        if(++tileErrors>=2){mapNotice.textContent='Background map tiles are unavailable. Place details, saved stops and directions still work; use List view to browse.';mapNotice.hidden=false;}
      }).addTo(map);
      cluster=L.markerClusterGroup({showCoverageOnHover:false,maxClusterRadius:45,spiderfyOnMaxZoom:true,animate:false,
        iconCreateFunction:g=>L.divIcon({html:'<span aria-label="'+g.getChildCount()+' places">'+g.getChildCount()+'</span>',className:'vm-cluster',iconSize:[40,40]})});
      map.addLayer(cluster);renderMarkers();placeholder.hidden=true;mapControls.hidden=false;
      requestAnimationFrame(()=>{map.invalidateSize();if(state.experience||state.q||state.category!=='all'||state.savedOnly)fitResults();const p=byId.get(state.selected);if(p&&markers.has(p.id))focusMarker(markers.get(p.id));});
      if(window.ResizeObserver)new ResizeObserver(()=>map?.invalidateSize({pan:false})).observe(mapWrap);
    }catch(error){
      if(map){map.remove();map=undefined;}placeholder.hidden=false;loadButton.textContent='Retry map';loadButton.disabled=false;
      mapNotice.textContent='The map could not load. The place list and saved stops are still available. Select List view or retry the map.';mapNotice.hidden=false;
      console.warn('Visitor map unavailable:',error.message);
    }finally{mapLoading=false;}
  }
  async function share(){
    // Saved IDs are intentionally not included: this action shares public filters/selection only.
    const url=stateUrl(window.location.href,state);const title=byId.get(state.selected)?.name||'Explore Stirling-Rawdon';
    try{if(navigator.share){await navigator.share({title,url});announce('Map shared.');return;}}
    catch(error){if(error.name==='AbortError')return;}
    try{await navigator.clipboard.writeText(url);announce('Map link copied.');}
    catch{shareField.value=url;shareField.hidden=false;shareField.focus();shareField.select();announce('Copy the selected link to share this map.');}
  }
  window.addEventListener('popstate',()=>{state=readState(window.location.href,collections,places);render();fitResults();});
  window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY){saved=readSaved(event.newValue,validIds);render();}});
  scope.querySelectorAll('[data-visitor-experience]').forEach(b=>b.addEventListener('click',()=>{
    setExperience(b.dataset.visitorExperience);host.scrollIntoView({behavior:reducedMotion()?'auto':'smooth',block:'start'});search.focus({preventScroll:true});
  }));
  const restaurantList=scope.querySelector('[data-theatre-restaurants]');
  if(restaurantList){const dining=collections.find(c=>c.id==='theatre');restaurantList.replaceChildren(...dining.ids.filter(id=>id!=='stirling-festival-theatre').map(id=>{
    const p=byId.get(id),li=el('li');if(p)li.append(profileControl(p)||el('span','',p.name));const a=li.querySelector('a');if(a)a.textContent=p.name+' ↗';return li;
  }));}
  render();setView(state.selected?'map':'list');
  if(!storageAvailable)announce('Saved stops will remain available for this visit only because browser storage is blocked.');
  if('IntersectionObserver'in window){observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){void startMap();observer.disconnect();}},{rootMargin:'150px'});observer.observe(host);}
  // Mobile map remains opt-in. Desktop lazy-loads only when the component is near the viewport.
  window.matchMedia('(max-width:650px)').addEventListener?.('change',()=>{if(!window.matchMedia('(max-width:650px)').matches)void startMap();});
  host.dispatchEvent(new CustomEvent('visitor-map:ready',{bubbles:true,detail:{places:places.length,pins:places.filter(hasPoint).length}}));
}
export function mountAll(root=document){root.querySelectorAll('[data-visitor-map]').forEach(host=>void mount(host));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mountAll(),{once:true});else mountAll();
