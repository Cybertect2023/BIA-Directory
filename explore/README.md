# Explore & Enjoy: Squarespace implementation

This feature uses the existing Squarespace 7.1 + GitHub Pages + Code Block architecture. It is scoped under `.bia-explore`; it does not edit `businesses.json`, `assets/bia.css`, `assets/directory.js`, or `assets/profile.js`.

## Shared assets

- `assets/explore.css` — responsive editorial layout, scoped to the Explore & Enjoy component and inheriting the site's typography.
- `assets/explore.js` — progressively updates the featured community event from `explore/events.json`. The event copy remains present in Squarespace HTML as a crawlable fallback.
- `explore/events.json` — current featured-event data. Update this file and the matching fallback copy/date/link in `pages/community-events.html` when replacing a featured event.

## Recommended small Code Block loader

For the five dedicated Squarespace visitor pages, use the new `assets/explore-loader.js` instead of pasting the large HTML file into Squarespace. This preserves the ability to update all page content centrally in GitHub.

On the main page at `/explore-and-enjoy`, paste:

```html
<div id="bia-explore-page" data-explore-page="explore-and-enjoy">
  <h1>Explore &amp; Enjoy Stirling-Rawdon</h1>
  <p>Discover local farms, visitor experiences, community events, and local stories.</p>
</div>
<link rel="stylesheet" href="https://cybertect2023.github.io/BIA-Directory/assets/explore.css">
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/explore-loader.js"></script>
```

For the supporting pages, duplicate the Code Block and change only `data-explore-page` to one of: `farms-local-food`, `things-to-do`, `community-events`, or `local-stories`. Replace the fallback H1 and summary in each copied block with that page's own heading and summary.

**Do not add `pages/home-explore-section.html` below the existing homepage navigation cards**; it duplicates homepage discovery choices. Point the existing Explore & Enjoy button to `/explore-and-enjoy` after all four destination pages exist and have been tested.

The loader uses client-side JavaScript to fetch HTML from GitHub Pages. This is convenient for updates, but Squarespace/Google may not index every dynamically injected text section reliably. For strongest SEO, paste the static HTML from `pages/*.html` into the Squarespace page Code Block and keep shared styling in GitHub. The small-loader version includes a crawlable fallback heading and description.

## Squarespace Code Blocks

For each page, add one Code Block, paste the matching `pages/*.html` file, and add these shared asset tags at the top of the same Code Block:

```html
<link rel="stylesheet" href="https://cybertect2023.github.io/BIA-Directory/assets/explore.css">
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/explore.js"></script>
```

The `home-explore-section.html` snippet is one page section to insert on the homepage. Keep the current Shop Local and Eat & Drink cards and their curated directory URLs.

## Page setup and SEO

All new pages should be created as regular pages. Keep them out of the primary navigation until the BIA selects its final menu placement. The four visitor guide pages use flat Squarespace layout-page slugs (`/farms-local-food`, `/things-to-do`, `/community-events`, `/local-stories`). Keep the hub at `/explore-and-enjoy`. Ordinary Squarespace pages should not be assumed to support nested URLs.

| Page | URL | SEO title | SEO description |
| --- | --- | --- | --- |
| Explore & Enjoy | `/explore-and-enjoy` | Explore & Enjoy Stirling-Rawdon | Visit Stirling-Rawdon | Plan a visit to Stirling-Rawdon, Ontario. Find local farms and food, things to do, community events, and stories from the village and countryside. |
| Farms & Local Food | `/farms-local-food` | Farms & Local Food in Stirling-Rawdon | Visit Stirling-Rawdon | Discover Stirling-Rawdon farms, seasonal produce, the village farmers’ market, farm shops, and agricultural experiences in Hastings County. |
| Things to Do | `/things-to-do` | Things to Do in Stirling-Rawdon, Ontario | Visit Stirling-Rawdon | Plan a day in Stirling-Rawdon with live theatre, Farmtown Park, local shops and dining, parks, trails, and community heritage. |
| Community Events | `/community-events` | Stirling-Rawdon Community Events | Visit Stirling-Rawdon | Explore Stirling-Rawdon’s seasonal markets, annual fair, theatre and music traditions, and community celebrations. Check the BIA calendar for current dates. |
| Local Stories | `/local-stories` | Local Stories from Stirling-Rawdon | Visit Stirling-Rawdon | Read about Stirling-Rawdon’s local businesses, agricultural heritage, community traditions, and historic village places. |

Set each Squarespace page's URL slug and SEO title/description in **Page Settings → General / SEO**. Assign the hub H1 as the page heading and preserve the heading hierarchy in the Code Block. Do not create a second H1 outside the supplied content.

## Page snippets

- `pages/home-explore-section.html` — homepage category section, four cards and hub link.
- `pages/explore-and-enjoy.html` — visitor hub and itinerary.
- `pages/farms-local-food.html` — seasonal food, farm experiences and agricultural heritage.
- `pages/things-to-do.html` — visitor guide, outdoor places, culture and sample day.
- `pages/community-events.html` — annual traditions, current event feature and calendar handoff.
- `pages/local-stories.html` — sourced story archive and verified-business directory route.
- `story-template.html` — reusable editorial page structure for future features; replace every bracketed field before publishing.

## Research sources

- [Township parks and playgrounds](https://www.stirling-rawdon.com/parks-recreation-culture/parks-and-playgrounds/)
- [Township Farmtown Park](https://www.stirling-rawdon.com/parks-recreation-culture/farmtown-park/)
- [Stirling Festival Theatre: history](https://www.stirlingfestivaltheatre.com/history)
- [Stirling Festival Theatre](https://www.stirlingfestivaltheatre.com/)
- [Stirling-Rawdon Public Library programs](https://stirlinglibrary.com/programs/)
- [Stirling Farmers’ Market, Hastings County](https://www.hastingscounty.com/adventures/experiences/farmers-market-village-stirling)
- [Ontario Water Buffalo Farm, Hastings County](https://www.hastingscounty.com/adventures/experiences/ontario-water-buffalo-farm)
- [Alpaca Ridge Farms experience, Hastings County](https://www.hastingscounty.com/adventures/experiences/alpaca-barn-tour-and-hand-feeding)
- [Hastings County farm and agriculture guide](https://hastingscounty.com/adventures/farm-and-agriculture)
- [Stirling Fair](https://www.stirlingfair.com/)
- [Stirling Festival of Sacred Praise](https://www.stirlingfestival.com/)
- [Market in the Village organizer updates](https://www.facebook.com/marketinthevillagestirling/)
- [BIA market feature](https://www.visitstirlingrawdon.ca/news-and-features/market-in-the-village-stirlings-weekly-celebration-of-local-life)
- [BIA heritage feature](https://www.visitstirlingrawdon.ca/news-and-features/then-and-now)
- [BIA business directory](https://www.visitstirlingrawdon.ca/business-directory)

Photographs use existing BIA Squarespace-hosted images already used by the live site. The images are decorative where the photo's precise subject is not documented in the source page; the adjacent HTML carries the full meaning. No stock image is presented as a Stirling-Rawdon location.

## Verification checklist

1. Wait for the GitHub Pages deployment and test `/assets/explore.css`, `/assets/explore.js`, and `/explore/events.json` at `https://cybertect2023.github.io/BIA-Directory/`.
2. Paste the page snippets and asset tags into Squarespace Code Blocks. Squarespace editor previews can suppress embedded scripts; confirm the public page in a private/incognito browser after saving.
3. Check every page at desktop and mobile widths. Verify card links, event link, page breadcrumbs, BIA calendar, directory filters, official links, focus outlines, and image loading.
4. Keep current homepage Eat & Drink and Shop Local sections and their destinations unchanged.
