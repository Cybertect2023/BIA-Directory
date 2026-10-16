# Homepage: More to Explore, three existing cards

Updated 2026-10-16. **No new Squarespace pages or Code Blocks needed.**

The three cards in the native Squarespace Home page are not controlled by GitHub. Their destinations now have substantial content inside the existing GitHub-powered **Things to Do** guide at `/things-to-do`. Edit the existing Squarespace cards themselves, not the old News & Features articles. **Leave the images alone for now.**

## Exact homepage card copy and links

| Existing card title | Updated card description | Button label | Button link |
| --- | --- | --- | --- |
| Heritage & History | Explore Farmtown Park’s heritage village, the historic railway station, and the stories behind Stirling's streets. | Explore Local History | `/things-to-do#heritage-history` |
| Trails & Outdoors | Follow Rawdon Creek, discover the Heritage Trail, and find scenic places for a walk in Stirling-Rawdon. | Explore Trails & Walks | `/things-to-do#trails-outdoors` |
| Parks & Family Fun | Visit a creekside playground, browse the candy at Stirling General Mercantile, and stop for an ice cream in season. | Plan Family Fun | `/things-to-do#parks-family-fun` |

Do not introduce additional regional or "within 20 minutes" cards at this stage. Keep the existing **More to Explore** heading and three-card placement.

## Precisely where to edit

In Squarespace 7.1: **Website → Pages → Home → Edit**, scroll to **More to Explore**, edit each of the three current cards' descriptions and linked text/button destinations. Apply the exact paths above. Save the page. Don't delete the existing older News & Features blog articles, because the historical photo collection and original park guide remain useful context. The revised **Things to Do** guide links to relevant authoritative sources.

The GitHub HTML and CSS are centrally maintained and appear automatically in the existing `/things-to-do` Squarespace Code Block. Do **not** make duplicate Squarespace pages named Heritage & History, Trails & Outdoors or Parks & Family Fun. The page loader honours deep links after content loads.

## New guide sections

- `#heritage-history`: Farmtown Park seasonal museum, recreated 1930s/40s village, the old railway station, and the existing Then & Now historical photo article. The original `#dont-miss` anchor remains for backward compatibility.
- `#trails-outdoors`: Township-published village and former railway walks, Henry Street Park at 85 Henry Street, trail access near the old railway station at 122 North Street, and candid guidance for King's Mill Conservation Area. No unverified trailhead coordinate is invented.
- `#parks-family-fun`: Henry Street Park, Stirling General Mercantile (26 West Front), The Scoop (30 West Front, seasonal), optional Farmtown Park, other Township playgrounds and library programming. Links to Shop Local, Eat & Drink, and the interactive family-outing map.
- Existing theatre, countryside, downtown, yoga and golf sections remain as they were, apart from the visitor nav and lead-in.

## Source checks

1. [Township: parks and playgrounds](https://www.stirling-rawdon.com/parks-recreation-culture/parks-and-playgrounds/)
2. [Township: Healthy Living walking-route descriptions](https://www.stirling-rawdon.com/parks-recreation-culture/healthy-living/)
3. [Farmtown Park: tour](https://www.farmtownpark.ca/tour) and [visit information](https://www.farmtownpark.ca/visit-us)
4. [Visit Stirling-Rawdon: Then & Now](https://www.visitstirlingrawdon.ca/news-and-features/then-and-now)
5. [Visit Stirling-Rawdon: Keep the Kids Busy](https://www.visitstirlingrawdon.ca/news-and-features/keep-the-kids-busy-this-summer)
6. Business directory `businesses.json`, records `stirling-general-mercantile` and `the-scoop-ice-cream`.

Always check seasonal museum/ice-cream hours, schedules, current access, and trail conditions before travelling. Do not present a property pin as a verified trail entrance.

## Launch checklist

- [x] Three sections and deep-link IDs committed to `pages/things-to-do.html`.
- [x] Responsive CSS added to `assets/explore.css`. No existing images or approved fonts changed.
- [x] Automated internal-link tests extended for the new sections.
- [ ] **Squarespace homepage card copy and button links edited manually**.
- [ ] Public homepage audit confirms three buttons now lead to the new guide anchors.
