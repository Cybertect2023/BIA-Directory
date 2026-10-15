/* Pure visitor-map data/state helpers. No DOM, network, geocoding or location tracking. */
export const CATEGORIES = Object.freeze({
  all: 'All Locations', eat: 'Eat & Drink', shop: 'Shop Local', arts: 'Arts & Culture',
  things: 'Things to Do', farms: 'Farms & Local Food', outdoors: 'Parks & Outdoors',
  services: 'Professional & Local Services'
});
export const SITE = 'https://www.visitstirlingrawdon.ca';
const categoryMap = {'Food & Dining':'eat','Shops & Retail':'shop','Home & Garden':'shop',
  'Community, Arts & Organizations':'arts','Sports & Recreation':'things'};
export function addressFingerprint(value = '') {
  let h = 2166136261;
  for (const c of value.trim().toLowerCase()) h = Math.imul(h ^ c.codePointAt(0), 16777619) >>> 0;
  return h.toString(16).padStart(8, '0');
}
export function safeUrl(value, base = SITE) {
  if (!value) return '';
  try { const url = new URL(value, base); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; }
  catch { return ''; }
}
export function hasPoint(p) {
  return Number.isFinite(p.lat) && Number.isFinite(p.lon) && p.lat >= -90 && p.lat <= 90 && p.lon >= -180 && p.lon <= 180;
}
export function buildPlaces(directory, data) {
  const locations = new Map((data.businessLocations || []).map(p => [p.businessId, p]));
  const unresolved = new Map((data.unresolvedBusinesses || []).map(p => [p.businessId, p]));
  const businesses = directory.businesses.map(b => {
    const mapping = locations.get(b.id);
    const stale = mapping && mapping.addressFingerprint !== addressFingerprint(b.address);
    const verified = mapping && !stale && hasPoint(mapping);
    const status = stale ? 'address-changed' : verified ? 'verified' : unresolved.get(b.id)?.status || 'needs-verification';
    const profileUnavailable = unresolved.get(b.id)?.profileStatus === 'unavailable';
    return {...b, visitorCategory: mapping?.visitorCategory || categoryMap[b.category] || 'services',
      description: mapping?.visitorDescription || b.description || b.summary || '',
      lat: verified ? mapping.lat : null, lon: verified ? mapping.lon : null,
      pointType: mapping?.pointType || '', verification: mapping?.verification,
      status, kind: 'business', website: safeUrl(b.website), profileUnavailable,
      profileUrl: safeUrl(profileUnavailable ? '/business-directory?category='+encodeURIComponent(b.category) : b.profileUrl),
      // Addresses identified as potentially private or conflicting are not promoted as destinations.
      hideAddress: b.id === 'jason-fornarolo-cpa' || ['address-conflict','address-changed'].includes(status),
      directionsAllowed: Boolean(verified)
    };
  });
  const places = (data.places || []).map(p => ({...p, website: safeUrl(p.website), profileUrl: '', kind:'place',
    status: hasPoint(p) ? 'verified' : 'needs-verification', directionsAllowed: hasPoint(p)}));
  return [...businesses, ...places];
}
export function normalize(text) { return (text || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); }
export function filterPlaces(places, state, collections, saved) {
  const collection = collections.find(c => c.id === state.experience);
  const query = normalize(state.q).trim();
  return places.filter(p => (!state.savedOnly || saved.includes(p.id)) &&
    (state.category === 'all' || p.visitorCategory === state.category) &&
    (!collection || collection.ids.includes(p.id)) &&
    (!query || normalize([p.name, p.hideAddress ? '' : p.address, CATEGORIES[p.visitorCategory], p.description].join(' ')).includes(query)))
    .sort((a,b) => state.savedOnly ? saved.indexOf(a.id)-saved.indexOf(b.id) : collection ? collection.ids.indexOf(a.id)-collection.ids.indexOf(b.id) :
      (a.visitorCategory === 'services')-(b.visitorCategory === 'services') || a.name.localeCompare(b.name, 'en-CA'));
}
export function readState(url, collections, places) {
  const p = new URL(url).searchParams;
  return {category: Object.hasOwn(CATEGORIES,p.get('vm_category')) ? p.get('vm_category') : 'all',
    q: (p.get('vm_q') || '').slice(0,120),
    experience: collections.some(c => c.id===p.get('vm_experience')) ? p.get('vm_experience') : '',
    selected: places.some(c => c.id===p.get('vm_place')) ? p.get('vm_place') : '', savedOnly:false};
}
export function stateUrl(url, state) {
  const u = new URL(url);
  for (const k of ['category','q','experience','place']) u.searchParams.delete('vm_'+k);
  if (state.category !== 'all') u.searchParams.set('vm_category', state.category);
  if (state.q) u.searchParams.set('vm_q',state.q);
  if (state.experience) u.searchParams.set('vm_experience',state.experience);
  if (state.selected) u.searchParams.set('vm_place',state.selected);
  return u.href;
}
export function readSaved(raw, validIds) {
  try { const v=JSON.parse(raw); return Array.isArray(v) ? [...new Set(v.filter(id => typeof id==='string' && validIds.has(id)))].slice(0,100) : []; }
  catch { return []; }
}
export function destination(p) {
  if (!p.directionsAllowed) return '';
  // Property centroids are never passed to a router as an entrance.
  return [p.name, p.address].filter(Boolean).join(', ');
}
export function directionsUrl(p, provider='google', mode='driving') {
  const d=destination(p); if (!d) return '';
  const walking=mode==='walking';
  if (provider==='apple') return 'https://maps.apple.com/?'+new URLSearchParams({daddr:d,dirflg:walking?'w':'d'});
  return 'https://www.google.com/maps/dir/?'+new URLSearchParams({api:'1',destination:d,travelmode:walking?'walking':'driving'});
}
export function distanceKm(a,b) {
  const r=Math.PI/180, dlat=(b.lat-a.lat)*r, dlon=(b.lon-a.lon)*r;
  const h=Math.sin(dlat/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dlon/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
}
export function nearbyPlaces(places, p, limit=3) {
  if (!hasPoint(p)) return [];
  return places.filter(x=>x.id!==p.id && hasPoint(x) && x.visitorCategory!=='services')
    .map(x=>({place:x,distance:distanceKm(p,x)})).filter(x=>x.distance<=5)
    .sort((a,b)=>a.distance-b.distance).slice(0,limit).map(x=>x.place);
}
