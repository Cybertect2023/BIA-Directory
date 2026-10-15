# Shop Local: editorial visitor guide and activation

## What this page does

Shop Local is a visitor-facing guide built to complement the existing `/business-directory?collection=shop-local` filter, rather than replicate its directory cards.

- Six independent visitor-shopping features, with all BIA profile URLs: **Stirling Book Company, Rawdon Creek Soap Co., Rustic Routes, The Vintage Junction, Blooms Flowers, and Food Boutique Stirling**.
- Accessible progressive-enhancement filters for all shops, thoughtful gifts, home and vintage, books, locally made goods, and food-loving gifts.
- A street-by-street **Shop & Stroll** guide connecting Mill Street, West Front Street, nearby cafés and Stirling Festival Theatre.
- Everyday shopping and service suggestions: **RONA Rollins Building Supplies, R & S Home Hardware, Pet Valu Creekside Centre, Kitchens by Paul Holden**.
- A three-part shopping, coffee and cultural outing itinerary, plus a gift-giving / market section.
- Direct links to individual BIA profiles and official store pages where verified.
- No new homepage card row, no separately maintained directory JSON, and no claims that stores are open right now.

The directory remains the source of business details, not the shopping landing page. A new business added to `businesses.json` does **not** automatically appear among the selected editorial features. Add it through a planned editorial update with verified business information and permission for any photography.

## Squarespace activation

Create a normal Squarespace page called **Shop Local**, slug `/shop-local`, preferably under **Not Linked** until tested.

Use one **HTML Code Block**, expanded to the full available section width:

```html
<div id="bia-explore-page" data-explore-page="shop-local">
  <h1>Shop Local in Stirling-Rawdon</h1>
  <p>Discover independent shops, books, vintage finds, flowers, local makers,
     specialty foods, home décor and everyday shopping in Stirling, Ontario.</p>
</div>
<link rel="stylesheet" href="https://cybertect2023.github.io/BIA-Directory/assets/explore.css">
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/explore-loader.js"></script>
```

Set the Squarespace SEO fields:
- Title: **Shop Local in Stirling-Rawdon | Boutiques, Books, Gifts & Vintage Finds**
- Description: **Explore independent shops in Stirling-Rawdon, Ontario. Discover books, handmade soaps, flowers, vintage finds, home décor, specialty foods and downtown shopping.**

The source is `pages/shop-local.html`. The loader reads this from GitHub Pages and replaces the fallback heading. JavaScript-driven page content may not all be indexed by crawlers; if full static indexing becomes a priority, consider embedding the complete HTML in Squarespace and retaining only styles/scripts in GitHub.

After Squarespace publication, verify desktop, tablet and mobile layouts in an incognito browser, shopping-interest filters, card links and direct anchor navigation.

## Link staging

Other page templates currently contain `data-launch-href="/shop-local"` attributes on some **existing directory links**. The active `href` remains the working `/business-directory?collection=shop-local` until the new route is published. This prevents users reaching a broken page while Squarespace setup is pending.

Likewise, links to Eat & Drink on the new Shop Local page carry future `data-launch-href="/eat-and-drink..."` destinations, but link to the published dining directory as a fallback until the Eat & Drink Squarespace page exists.

**After the specific destination page is live:** convert only the corresponding staged links, preserving query strings and hash fragments. For example:

Before:
```html
<a href="/business-directory?collection=shop-local" data-launch-href="/shop-local">Shop Local</a>
```
After:
```html
<a href="/shop-local">Shop Local</a>
```

When both new pages are live, update homepage's existing **Shop Local** card to `/shop-local` and existing **Eat & Drink** card to `/eat-and-drink`. Do **not** insert `pages/home-explore-section.html` on the homepage.

Do not bulk-convert every curated-directory link. The Shop Local page itself deliberately retains its "full BIA directory" action, as do some supporting pages.

## Location and contact research: 2026-10-14

### Updated canonical data

- **Stirling Book Company** moved to **22 Mill Street**, as stated prominently on its live website and its footer. We corrected `businesses.json` from the historical 36 Mill Street listing to 22 Mill Street. Its contact page still has an old "Visit Us" section listing 36 Mill Street, so refer to the current homepage and footer and reconfirm when the store can be contacted. Source: https://stirlingbookco.ca/
- **Rawdon Creek Soap Co.** uses **26 Mill Street** on product, accessories and wholesale pages, yet the company's homepage/About page currently lists **Unit 1, 127 North Street**, also supported by the Township's directory. That conflict must be resolved directly with the operator. We changed its `verificationStatus` to `needs-review` without guessing a replacement address. The Shop Local guide deliberately does **not** place it on a street-address map or list a storefront number. Sources: https://www.rawdoncreeksoap.com/ , https://www.rawdoncreeksoap.com/about-us , https://www.rawdoncreeksoap.com/shop , https://www.stirling-rawdon.com/business-development/business-directory/

### Confirmed online information

- **Blooms Flowers:** 17 West Front Street, phone 613-395-1353. https://www.yellowpages.ca/bus/Ontario/Stirling/Blooms-Flowers/5844263.html
- **Rustic Routes:** BIA listing places it at 20 Mill Street; third-party geographic information also confirms that address. Current hours vary across sources, so they are not shown on the editorial guide. https://www.waze.com/live-map/directions/ca/on/stirling/rustic-routes?to=place.ChIJ415gUTwg1okRBAvlSbxonmU
- **The Vintage Junction:** 25 Mill Street; shop's older brand listings and a 2026 local listing support that address. The guide avoids exact operating hours. https://mangopaintinc.com/locations/the-vintage-junction/
- **Food Boutique Stirling:** 27 West Front Street, specialty food, drinks, prepared meals and gift items; Hastings County confirms. https://www.hastings.ca/adventures/experiences/food-boutique
- **RONA Rollins Building Supplies:** 436 West Front Street; official franchise store page. https://www.rona.ca/en/store/ontario/stirling/rona-rollins-building-supplies-stirling-08133
- **R & S Home Hardware:** 9 Tuftsville Road, Unit A; official store page. https://www.homehardware.ca/en/store/10186
- **Pet Valu Creekside Centre:** 9 Tuftsville Road; official location page. https://store.petvalu.ca/location/2443/
- **Kitchens by Paul Holden:** 425 West Front Street, based on BIA's verified directory record; project service, **not** represented as a walk-in retail store.

## Editorial fairness, compliance and photos

The featured destinations are selected based on their value to the **general visitor shopping experience**, not a business relationship with the developer. The existing full directory retains additional specialized retail and professional service listings, including age-restricted categories. Age-restricted products should not be marketed in a general-audience family shopping guide. The directory can manage those through its own lawful category treatment.

No claim is made that all merchandise is locally manufactured: the page distinguishes **locally owned/operated** businesses from goods **made in Stirling**. A retailer selling books, flowers or imported home goods is not described as manufacturing those products.

Existing BIA village imagery is used as decorative background, **not** as a photograph of any specific store. Approved storefront and product images should be collected from the operators with reuse permission and inserted in a later photographic refresh.

The BIA can acknowledge volunteer website contributions and approve case-study recognition for CyberTECT through normal governance. Merchant placement and coverage should never be contingent on hiring or providing favours to the site developer.

## Final tests to perform after the Squarespace page is public

- Visit `/shop-local` as a logged-out visitor and make sure the fallback is replaced by the full page.
- Confirm every shop filter updates the six cards and the live-region summary; the "All shops" control restores all six.
- Direct-open `/shop-local?interest=home#discover-shops` and `/shop-local#shop-books`; check the correct position and visible merchant.
- Test small mobile widths around 360px and 390px as well as desktop widths of 1024px and 1440px.
- Verify business profiles, phones, shops' official URLs, accessibility, focus outlines and reduced-motion behaviour.
- Activate staged links only after the actual published `/shop-local` route exists; then update the existing homepage Shop Local tile.
