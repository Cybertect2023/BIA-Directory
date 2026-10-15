# Stirling-Rawdon visitor map

## Activation

GitHub preview: https://cybertect2023.github.io/BIA-Directory/plan-your-visit/

Create a **Blank Page** in Squarespace 7.1. Start in **Not Linked**, enable it, set URL slug **plan-your-visit**, page title **Plan Your Visit to Stirling-Rawdon**, and navigation title **Plan Your Visit**. Use a full-width HTML Code Block with **Display Source off**. Give the Fluid Engine block enough vertical space to display the whole guide. This feature does not create that page or change the homepage.

Paste `launch/plan-your-visit-code-block.html`:

```html
<div id="bia-explore-page" data-explore-page="plan-your-visit"><a href="https://cybertect2023.github.io/BIA-Directory/plan-your-visit/">Open the visitor map and place list</a></div>
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/explore-loader.js"></script>
```

The loader adds the map CSS and imports the component only for this route. Existing guide routes do not request any map assets. View the saved public page outside the Squarespace editor; the editor can suppress embedded scripts.

Set the Squarespace SEO title to:

**Stirling-Rawdon Visitor Map | Restaurants, Shops & Things to Do**

Set its SEO description to:

**Explore Stirling-Rawdon with an interactive visitor map. Discover local restaurants, shops, Stirling Festival Theatre, farms, parks, attractions and places to visit.**

### Strongest Squarespace SEO / no-JavaScript option

Use `launch/plan-your-visit-static.html` as the Code Block instead of the short loader. It contains the real introduction, supporting content, guide links and a generated list of every place. Squarespace then serves this content in the initial HTML, and only the map interactions depend on JavaScript. This is preferable for crawlability and a complete same-page fallback. Re-paste the generated HTML when the canonical directory changes. Do not paste both activation options on one page, which would duplicate IDs and headings.

The short option retains a working link to the GitHub-hosted full HTML guide when JavaScript or the template fetch fails. Dynamic HTML alone is not a guarantee of Squarespace indexing. Do not add a canonical tag pointing to an unpublished Squarespace URL. After publishing, set the GitHub preview canonical to the live destination if desired. Squarespace manages its own page canonical. No LocalBusiness ratings, hours or unverifiable accessibility structured data are emitted.

### After the page exists

Verify `/plan-your-visit` in a signed-out browser. Then add contextual text links from the visitor guides: theatre feature → `?vm_experience=theatre`; farms guide → `?vm_experience=countryside`; dining guide → `?vm_category=eat`; shopping → `?vm_experience=stroll`. Test actual links before adding them. No links to the unpublished destination have been added to existing pages, and no homepage sections were added.

## Component reuse

For a map-only component on another visitor page:

```html
<div class="bia-visit"><div class="vm-wrap" data-visitor-map><a href="https://cybertect2023.github.io/BIA-Directory/plan-your-visit/">Open visitor map and place list</a></div></div>
<script type="module" src="https://cybertect2023.github.io/BIA-Directory/assets/visitor-map.js"></script>
```

The module auto-mounts existing hosts and exports `mount(host)` / `mountAll(container)` for fetched content. Mounting is idempotent. Use one map per page for a single, clear URL state; multiple hosts can render but share the page query and local saved-stop store.

## Sources and data maintenance

- `businesses.json` remains the single maintained source for business names, descriptions, addresses, telephone numbers, websites and profile URLs. **No changes to that file are required by this feature.**
- `explore/map-locations.json` stores business IDs, verified coordinates, point semantics, an address fingerprint and dated evidence; unresolved records have no coordinates. Independent destinations have their own sourced records because they are not in the business directory.
- A directory address change suppresses the old pin and directions automatically until the coordinate record is reviewed and its address fingerprint regenerated. Name/contact edits appear on the next page fetch.
- Keep `verification.sources`, `verification.date`, `verification.note` and `pointType` accurate. A mapped property is not a certified entrance. Do not turn an area centroid into a driving destination.
- Before mapping a business at a potentially residential address, verify that it intentionally receives visitors there. The CPA remains discoverable without republishing its address into this tourism guide.
- Review `explore/MAP-VERIFICATION.md` for conflicts and pending work. Correct canonical information only after resolving discrepancies. Coordinates for another tenant or a similarly named business are not sufficient evidence.
- Curated collections contain only IDs and editorial planning copy. Family and Shop & Stroll collections exclude cannabis and vape retail. All BIA businesses remain available through the full list and category search.
- Update the source template `scripts/visitor-map-page.html`, then run `npm run build:map`. Do not hand-edit the generated HTML pages or static Squarespace fallback. These are derived outputs, not separate business datasets.

For a newly verified directory pin, calculate its fingerprint from the exact canonical address:

```js
import {addressFingerprint} from './assets/visitor-map-core.js';
console.log(addressFingerprint(business.address));
```

Use the actual directory record, not a retyped address. `npm test` rejects mismatched fingerprints and uncovered IDs.

## Mapping dependencies and provider policy

Leaflet 1.9.4 and Leaflet.markercluster 1.5.3 are vendored under `assets/vendor/`, with their licenses. They load only when a desktop map is near the viewport or a mobile visitor asks for Map view. The list requires no mapping library, tile server, geocoder or API key. Marker icons are CSS shapes and do not fetch icon images or fonts.

`explore/map-config.json` controls tile URL, attribution text/link, maximum zoom and initial view. Change those fields to switch providers without rewriting the interface. The initial map centre is just a viewport, never a substitute business location.

Default provider policy: https://operations.osmfoundation.org/policies/tiles/

- Standard HTTPS OSM tile endpoint, visible attribution, normal browser cache handling and an explicit non-restrictive tile referrer policy.
- No offline downloads, prefetch/export, service-worker tile cache, background tile harvesting or public geocoding requests.
- Only viewport tiles are requested. Do not run automated pan/zoom tests against the public tile service; intercept tiles with fixtures for automated testing.
- OSM is best effort, without an SLA. Monitor traffic and move to a suitable provider if sustained traffic requires it. Keep attribution and the report-a-basemap-issue link visible.
- Geographic records derived from OSM are available under ODbL 1.0; the published JSON includes attribution and source references. Other records identify their operator sources.

## Interactions and privacy

Search matches names, visitor categories, descriptions and non-withheld addresses. Professional services appear after visitor destinations in the default alphabetical list. All Locations resets the category; **Show all** resets every filter. Collections show editorial stop order. Saved stops retain visitor-chosen ordering and can be moved, removed or cleared.

Share links use `vm_category`, `vm_experience`, `vm_q` and `vm_place`, retaining unrelated campaign parameters. Saved IDs are not shared. Native sharing falls back to clipboard, then a selectable link. Saved stops use localStorage under `stirling-visitor-stops-v1`; blocked storage falls back to the current page session and gives a notice. Saved stops are origin-specific (the preview and Squarespace do not share them).

There is no geolocation request, location tracking, analytics or route service. Nearby suggestions use straight-line distances between verified destination points, never walking times. Google/Apple directions open one destination at a time using its name and canonical address. No route line, optimized order, multi-stop routing or reservation is implied.

External mapping services receive their ordinary network requests. No private user location is sent by this application. Tile failure retains markers and the list; dependency failure retains the list and retry controls; JSON failure retains the generated static place list. User content is inserted as text and URLs are limited to HTTP(S), apart from explicitly constructed telephone links.

## Validation

```sh
npm ci --ignore-scripts
npm test
npm run test:dom
node --check assets/explore-loader.js
node --check assets/visitor-map.js
```

The data tests check canonical joins, evidence, coordinate bounds, address-change suppression, all filters and collections, saved-order semantics, URL state, safe links and directions. DOM tests exercise actual controls and vendored Leaflet/markercluster in JSDOM, including dependency/data failure, storage denial and cross-tab updates. JSDOM does not validate visual layout. See `explore/MAP-TESTING.md` for rendered-browser evidence and remaining deployment/activation limits.

When testing a new release, cover desktop and a narrow phone, filter during selection, save/remove/reorder/clear, revisit a shared URL, open the theatre collection, and disable tile/dependency/JSON requests individually. With JavaScript disabled, the generated HTML list must remain usable. Verify directory and existing guide assets have not changed except for the isolated new loader route.
