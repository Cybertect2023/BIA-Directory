# Visitor-map validation

## Automated checks

- Eight data/state tests pass: all 29 canonical IDs accounted for once; 26 sourced pins; address fingerprint mismatch suppresses stale pins; category/search/empty/reset behaviour; five complete collections; saved-stop order and corrupt storage; share URL round trips; safe HTTP(S) links; Google/Apple directions; nearby discovery.
- Four DOM integration tests pass using JSDOM and the actual vendored Leaflet 1.9.4 / markercluster 1.5.3: controls, collection activation, saved/remove/clear/reordering, selected-place content, phone/profile links, directions provider switching, clipboard fallback, marker popups, attribution, filtering markers, storage denial, failed JSON, failed dependencies, URL restoration, cross-tab saved updates.
- JSDOM does not request OSM tiles. Automated map tests do not harvest public tiles.
- An initially observed stale marker-zoom callback during rapid filtering was removed by synchronous marker selection and non-animated cluster transitions.
- Generated static HTML is checked against the source template and canonical JSON. Existing business directory, profiles and visitor-guide templates are not modified.

## HTTP profile checks (2026-10-14)

HTTP 200 with the profile component: Jimmy’s, Brad Comeau, Creekside Yoga, McCurdy Collision, Smokin’ Barrel, Blooms, Rawdon Creek Soap, Firehall Cafe, Stirling Festival Theatre, Paradise Cannabis, Fresh & Hot Pizza, RONA, R & S Home Hardware, Stirling Dental, Pet Valu, Back40 Powersports, Holmestown Barber, The Vape Shop.

HTTP 404: Food Boutique’s canonical profile and legacy source URL. The map routes this entry to the Food & Dining directory, with the business’s Facebook updates as a separate link.

HTTP 429, current status unverified: Farm Girl Cafe, Rustic Routes, Stirling Book Company, Vintage Junction, Blue Collar Therapy, CyberTECT, Lighthouse Tutoring, The Fairway Golf, Jason Fornarolo CPA, Kitchens by Paul Holden. Canonical URLs retained. This is a server rate limit, not proof those pages are missing.

## Rendered-browser review

Pending hosted-browser review after the first deployment. A JSDOM pass is not a claim of mobile visual verification.

## Activation limit

No Squarespace page was created or changed. GitHub Pages publication does not activate `https://www.visitstirlingrawdon.ca/plan-your-visit`. Use the supplied activation snippet and page settings. End-to-end Squarespace layout must be checked after that page is saved; the GitHub preview cannot reproduce the surrounding Squarespace theme/editor.
