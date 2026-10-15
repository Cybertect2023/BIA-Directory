# Explore & Enjoy: Squarespace implementation

This feature uses the existing Squarespace 7.1 + GitHub Pages + Code Block architecture. It is scoped under `.bia-explore`; it does not edit `businesses.json`, `assets/bia.css`, `assets/directory.js`, or `assets/profile.js`.

## Shared assets

- `assets/explore.css` — responsive editorial layout, scoped to the Explore & Enjoy component and inheriting the site's typography.
- `assets/explore-loader.js` — loads the visitor page template and, for Community Events, renders upcoming listings from `explore/events.json` with automatic expiry. `assets/explore.js` is a legacy compatibility script for older static Code Blocks.
- `explore/events.json` — curated verified event data (`schemaVersion: 2`) with dates, end times, sources and organizer links. Add new confirmed events here; expired entries automatically disappear from the "upcoming" list. The evergreen annual traditions and 2026 holiday showcases remain editorial HTML and require a periodic seasonal content review.

## Recommended small Code Block loader

For the visitor hub, its four supporting guides and the separate Eat & Drink guide (six pages total), use `assets/explore-loader.js` instead of pasting the large HTML templates into Squarespace. This keeps page content centrally editable in GitHub.

On the main page at `/explore-and-enjoy`, paste:

```html
<div id="bia-explore-page" data-explore-page="explore-and-enjoy">
  <h1>Explore &amp; Enjoy Stirling-Rawdon</h1>
  <p>Discover local farms, visitor experiences, community events, and local stories.</p>
</div>
<link rel="stylesheet" href="https://cybertect2023.github.io/BIA-Directory/assets/explore.css">
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/explore-loader.js"></script>
```

For the four supporting Explore pages, duplicate the Code Block and change `data-explore-page` to one of: `farms-local-food`, `things-to-do`, `community-events`, or `local-stories`. The **Eat & Drink** guide uses `data-explore-page="eat-and-drink"` with the same loader; see [DINING.md](./DINING.md) for its tested fallback snippet, editorial sources, SEO and homepage-link instructions.

**Do not add `pages/home-explore-section.html` below the existing homepage navigation cards**; it duplicates homepage discovery choices. Point the existing Explore & Enjoy button to `/explore-and-enjoy` after all four destination pages exist and have been tested.

The loader uses client-side JavaScript to fetch HTML from GitHub Pages. This is convenient for updates, but Squarespace/Google may not index every dynamically injected text section reliably. For strongest SEO, paste the static HTML from `pages/*.html` into the Squarespace page Code Block and keep shared styling in GitHub. The small-loader version includes a crawlable fallback heading and description.

## Squarespace Code Blocks

For each page, add one Code Block, paste the matching `pages/*.html` file, and add these shared asset tags at the top of the same Code Block:

```html
<link rel="stylesheet" href="https://cybertect2023.github.io/BIA-Directory/assets/explore.css">
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/explore.js"></script>
```

**Do not paste `home-explore-section.html` beneath the homepage's existing three category cards.** It would duplicate their purpose. Keep the three cards and update their destinations to published landing pages when available. Eat & Drink should eventually link to `/eat-and-drink`, not its older filtered-directory URL.

## Page setup and SEO

Create ordinary Squarespace pages with flat URLs. Keep them out of primary navigation until published and tested. The Explore & Enjoy hub is `/explore-and-enjoy`, and the new Eat & Drink guide is `/eat-and-drink`. Squarespace page nesting must not be assumed.

| Page | URL | SEO title | SEO description |
| --- | --- | --- | --- |
| Explore & Enjoy | `/explore-and-enjoy` | Explore & Enjoy Stirling-Rawdon \| Visit Stirling-Rawdon | Plan a visit to Stirling-Rawdon, Ontario. Find local farms and food, things to do, community events, and stories from the village and countryside. |
| Farms & Local Food | `/farms-local-food` | Farms & Local Food in Stirling-Rawdon \| Visit Stirling-Rawdon | Find Stirling-Rawdon's farmers' market, Cooney Farms Apple Store, Ontario Water Buffalo, alpaca farm visits, and local food experiences. |
| Things to Do | `/things-to-do` | Things to Do in Stirling-Rawdon, Ontario \| Visit Stirling-Rawdon | Plan a day in Stirling-Rawdon with live theatre, Farmtown Park, local shops and dining, parks, trails, and community heritage. |
| Community Events | `/community-events` | Community Events in Stirling-Rawdon \| Festivals, Markets & Local Traditions | Explore Stirling-Rawdon festivals, holiday markets, Farmtown Park’s tree and wreath displays, the Stirling Fair, theatre, and family events. Find dates and organizer links. |
| Woven Into Stirling | `/local-stories` | Woven Into Stirling \| Local Stories & Business Profiles | Meet the people behind Stirling Festival Theatre, Rawdon Creek Soap Co., and Blue Collar Therapy. Real local business stories shared with the Stirling-Rawdon BIA. |
| Eat & Drink | `/eat-and-drink` | Eat & Drink in Stirling-Rawdon \| Cafés, Restaurants & Theatre Nights | Explore Stirling-Rawdon cafés, restaurants, pizza, local food and a special night at Stirling Festival Theatre. Find where to eat on Mill Street and West Front Street. |

Set each page's slug and SEO fields in **Page Settings**. The full GitHub template supplies its own H1. Do not add a second H1 to the Squarespace section outside the Code Block. An initial fallback H1 inside the loader container is replaced at runtime.

## Page snippets

- `pages/home-explore-section.html` — homepage category section, four cards and hub link.
- `pages/explore-and-enjoy.html` — visitor hub and itinerary.
- `pages/farms-local-food.html` — seasonal food, farm experiences and agricultural heritage.
- `pages/things-to-do.html` — visitor guide, outdoor places, culture and sample day.
- `pages/community-events.html` — annual traditions, current event feature and calendar handoff.
- `pages/local-stories.html` — sourced story archive and verified-business directory route.
- `pages/eat-and-drink.html` — six BIA food profiles, coffee/lunch/dinner/takeout filters, theatre-night dining, two-street pocket guide, sample itinerary and farm-to-village links. See [DINING.md](./DINING.md).
- `story-template.html` — reusable editorial page structure for future features; replace every bracketed field before publishing.

## Community Events maintenance

- Squarespace page slug: `/community-events`; Code Block: `data-explore-page="community-events"` using the shared `assets/explore-loader.js`.
- Update `explore/events.json` for new confirmed events. Every event needs `id`, `category`, `title`, `dateLabel`, `startDate`, `endDate`, `location`, `description`, `url`, `linkLabel`, `source`. Use complete offset-aware ISO 8601 dates in the **Stirling, Ontario timezone**: `-04:00` in daylight time, `-05:00` in standard time. Don't reuse the old `-04:00` offset for November.
- Only list organizer-confirmed dates and link to official event details. The featured list is capped at six upcoming items and is automatically sorted by start date. It drops items as soon as their `endDate` passes.
- The permanent editorial sections are kept in `pages/community-events.html`: 2026 Holiday Market on November 6, Farmtown Park's **Deck the Halls** on November 19–22, and other annual traditions. **These dated 2026 editorials must be refreshed or recast for 2027**; the auto-expiration applies to upcoming feed cards only.
- The official Farmtown Park name for 2026 is **Deck the Halls**, featuring decorated trees and wreaths. A previous BIA article covering the festival of trees and Light the Night dates is from **2025**; do not use those 2025 dates as 2026 dates.
- Recurring activities are links to the official library, township, arena and theatre schedules, not one BIA calendar entry for each weekly occurrence.
- Verified 2026 sources include: [Hastings County Holiday Market](https://www.hastings.ca/adventures/events/holiday-market-village-downtown-stirling), [Farmtown Park Deck the Halls](https://www.farmtownpark.ca/events/wesc2ekhloe9cg6hl2grma02591gog), [StirlingFest](https://www.stirlingfest.com/index.html), [Stirling Festival Theatre](https://www.stirlingfestivaltheatre.com/), [Stirling-Rawdon Public Library](https://stirlinglibrary.com/programs/), [Township event calendar](https://www.stirling-rawdon.com/parks-recreation-culture/event-calendar/), and [Stirling Fair](https://www.stirlingfair.com/).

## Woven Into Stirling: editorial interview source and privacy

The Local Stories page (`pages/local-stories.html`) is based on three voluntary first-person submissions to the BIA's 2025 **Woven Into Stirling: Tell Us Your Idyllic Story** interview survey. Each source respondent explicitly checked the consent field granting the BIA permission to share their story and any submitted photos publicly. The archived ZIP includes no photo attachments.

Published features:
- Ken MacDougall / Stirling Festival Theatre (submitted 2025-06-02)
- Julie Amodeo / Rawdon Creek Soap Co. (submitted 2025-08-06)
- Brad Parsons / Parsons Therapy (submitted 2025-09-26), now presented under the verified Blue Collar Therapy name with the historical name and submission date disclosed.

**Privacy:** Do not commit or publish the raw submitted CSV/ZIP, respondent contact emails, full interview metadata, or unsolicited personal details. The public page contains edited feature copy, short verbatim attributed excerpts, interview month/year, current official business links and existing BIA profile URLs. The interviews are historical records, not claims that business details or planned events remain unchanged.

**Future updates:** Keep quotes faithful to the consented submissions. Verify current business branding and links, and seek consent for new interviews or portraits. Don't imply images supplied by the interviewees when none exist. The main public form URL has not been confirmed and therefore is not shown as a submission button.

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

The visitor guide pages generally use existing BIA Squarespace-hosted imagery as decoration when the precise subject is not documented; the theatre feature in Things to Do also currently embeds an auditorium image from the theatre's own website. Confirm reuse permission for external photography before a large public promotional launch. Do not present decorative town photography as a picture of a restaurant or menu item.

## Verification checklist

1. Wait for the GitHub Pages deployment and test `/assets/explore.css`, `/assets/explore.js`, and `/explore/events.json` at `https://cybertect2023.github.io/BIA-Directory/`.
2. Paste the page snippets and asset tags into Squarespace Code Blocks. Squarespace editor previews can suppress embedded scripts; confirm the public page in a private/incognito browser after saving.
3. Check every page at desktop and mobile widths. Verify card links, event link, page breadcrumbs, BIA calendar, directory filters, official links, focus outlines, and image loading.
4. Keep the existing three homepage navigation cards. After `/eat-and-drink` is publicly tested, change the homepage Eat & Drink button from the curated directory to `/eat-and-drink`. Leave the Shop Local destination as its curated directory until its own guide is published.
