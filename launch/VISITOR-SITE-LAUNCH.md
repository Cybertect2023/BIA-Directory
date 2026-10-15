# Visitor-site launch: homepage and Squarespace finishing steps

**Audited:** 2026-10-15. Eight Squarespace visitor pages returned HTTP 200 with correct Code Block page keys. See [the live HTTP report](./live-pages-audit.json). This verifies route availability, not every browser interaction or mobile appearance.

**GitHub changes completed:** All 22 previously staged links between the eight visitor guides are live and now point to the correct published landing page rather than the older filtered directory. Each guide also links contextually to `/plan-your-visit`, and the map's footer includes Shop Local. The original business directory and events calendar URLs remain available and are not replaced.

## Three manual homepage link changes

**Do not add new category sections or duplicate cards.** Edit the three existing homepage discovery cards in Squarespace:

| Existing homepage card | Existing button | Set button link to |
| --- | --- | --- |
| Eat & Drink | Explore Dining | `/eat-and-drink` |
| Shop Local | Explore Shops | `/shop-local` |
| Explore & Enjoy | What's Happening → **Explore Stirling-Rawdon** | `/explore-and-enjoy` |

The standalone calendar remains at `/events`. Visitors will also reach it from the Community Events guide. The directory remains at `/business-directory`, including its curated filtered views.

Since this third card now opens the whole visitor hub instead of only events, also update its homepage description to: **Discover farms, live theatre, local attractions, community events and stories worth exploring in Stirling-Rawdon.** This helps the button and content accurately describe the destination.

Use the built-in Squarespace link editor on each button. Do not use JavaScript to override homepage links, and do not paste `pages/home-explore-section.html` into the homepage.

## Main navigation

Recommended minimal change: add **Explore & Enjoy** as a regular navigation link to the existing published page `/explore-and-enjoy`. Keep the other six destination pages under **Not Linked**; the hub, homepage and cross-links make them accessible. The map is prominently linked from every guide, so it does not need an additional main-navigation item unless the BIA wants it.

Consider adding `/plan-your-visit` as a footer text link labelled **Visitor Map / Plan Your Visit**. Prefer to keep the existing News, Events, Membership and Business Directory entries rather than remove them.

Squarespace **Not Linked** is not the same as disabled or password-protected. Make sure the **Enable Page** toggle stays on.

## Eight page SEO title checks

The titles below live in `explore/seo.json` as copy-ready values. They are **not automatically applied to Squarespace SEO settings** by the GitHub loader.

| Published page | Slug | Suggested SEO title |
| --- | --- | --- |
| [Explore & Enjoy](https://www.visitstirlingrawdon.ca/explore-and-enjoy) | `/explore-and-enjoy` | Explore & Enjoy Stirling-Rawdon \| Visit Stirling-Rawdon |
| [Farms & Local Food](https://www.visitstirlingrawdon.ca/farms-local-food) | `/farms-local-food` | Farms & Local Food in Stirling-Rawdon \| Visit Stirling-Rawdon |
| [Things to Do](https://www.visitstirlingrawdon.ca/things-to-do) | `/things-to-do` | Things to Do in Stirling-Rawdon, Ontario \| Visit Stirling-Rawdon |
| [Community Events](https://www.visitstirlingrawdon.ca/community-events) | `/community-events` | Community Events in Stirling-Rawdon \| Festivals, Markets & Local Traditions |
| [Local Stories](https://www.visitstirlingrawdon.ca/local-stories) | `/local-stories` | Woven Into Stirling \| Local Stories & Business Profiles |
| [Eat & Drink](https://www.visitstirlingrawdon.ca/eat-and-drink) | `/eat-and-drink` | Eat & Drink in Stirling-Rawdon \| Cafés, Restaurants & Theatre Nights |
| [Shop Local](https://www.visitstirlingrawdon.ca/shop-local) | `/shop-local` | Shop Local in Stirling-Rawdon \| Boutiques, Books, Gifts & Vintage Finds |
| [Plan Your Visit](https://www.visitstirlingrawdon.ca/plan-your-visit) | `/plan-your-visit` | Stirling-Rawdon Visitor Map \| Restaurants, Shops & Things to Do |

Set descriptions from [explore/seo.json](../explore/seo.json) in each page's **Settings → SEO**. The live audit saw generic document titles on most newly created pages, so this is worth finishing.

**Separate known issue:** The existing `/events` page returned HTTP 200 but its document title was `Appointments 3`. In Squarespace, correct the SEO title to something like **Stirling-Rawdon Events | Community Calendar & Festivals** and set its matching description. Leave its slug `events` intact.

## Updated connection flows

- Explore & Enjoy hub → dedicated Farms, Things to Do, Community Events and Local Stories pages; now also Eat & Drink, Shop Local and Plan Your Visit map.
- Things to Do → theatre feature → dinner-filtered local dining (`/eat-and-drink?meal=dinner#find-your-table`) → theatre outing on the visitor map (`?vm_experience=theatre`).
- Shop Local → books, independent makers, home goods → cafés and theatre → Shop & Stroll map (`?vm_experience=stroll`).
- Eat & Drink → individual food businesses, Farms & Local Food, Shop Local and dining pins (`?vm_category=eat`).
- Farms & Local Food → village dining, shopping and rural attraction map (`?vm_experience=countryside`).
- Community Events → current events calendar, shop and dining guides, visitor map.
- Local Stories → individual business profiles, makers, dining and visitor map.
- Visitor map → all major guides, individual businesses, directions, curated experiences and saved stops.

The GitHub directory remains the canonical business-data source. The map lists unverified-coordinate businesses without inventing pins.

## Final verification on a browser and phone

1. Visit the homepage **logged out** and open each of its three newly updated buttons.
2. Open `/explore-and-enjoy` and click each of the four editorial guide cards.
3. Open `/things-to-do` and choose a theatre dinner recommendation. It should open the dinner-filtered `/eat-and-drink` guide.
4. Open `/shop-local?interest=books#discover-shops` and confirm the filter controls work; open its Shop & Stroll visitor map.
5. Open `/plan-your-visit`, use a map category, select a place, save a stop, and test a map-directions handoff.
6. Repeat essential navigation on a narrow mobile screen, checking that cards, buttons and the map don't overflow.
7. Check all eight page SEO settings, the legacy `/events` title, and any image reuse permissions before a major promotion campaign.
8. Keep the BIA-approved typography unchanged. Make only responsive size/spacing adjustments where the site needs them.

**Caveat:** GitHub commits update the central templates but cannot directly change native Squarespace homepage buttons, page navigation positions or SEO settings. Those edits are intentionally listed here.
