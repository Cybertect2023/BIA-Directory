# Eat & Drink: editorial guide and operations

## Purpose and visitor flow

This page is an editorial visitor landing page, not a duplicate of the searchable food directory. Its core job is to convert theatre audiences, weekend visitors, market shoppers and people exploring Stirling into customers for village food businesses.

The connecting routes are:

1. The existing homepage **Eat & Drink** tile -> `/eat-and-drink` (must be changed manually in Squarespace once this page exists).
2. The Explore & Enjoy hub, Things to Do, Farms & Local Food, Community Events and Local Stories -> the guide.
3. The Things to Do theatre section -> `/eat-and-drink?meal=dinner#find-your-table`, which applies the dinner filter automatically.
4. Each guide entry -> its individual BIA business profile and, where confirmed, a direct menu, phone number or directions.
5. The guide -> Farms & Local Food, theatre events, Shop Local, and the BIA calendar, giving visitors a reason to extend the outing.

## Squarespace page creation

Create a **regular Squarespace page** called **Eat & Drink** with the flat slug `eat-and-drink`, ideally in Not Linked while verifying. Add one Code Block set to HTML and paste the following. Its static heading, short explanation and six links serve as a useful fallback when JS is off, while the GitHub loader renders the full guide.

```html
<div id="bia-explore-page" data-explore-page="eat-and-drink">
  <h1>Eat &amp; Drink in Stirling-Rawdon</h1>
  <p>Explore downtown Stirling cafés, local restaurants, pizza, takeaway food,
     and ideas for dinner before a show at Stirling Festival Theatre.</p>
  <p>Find Farm Girl Cafe, The Firehall Cafe, Food Boutique Stirling,
     The Smokin' Barrel Bar &amp; Grill, Jimmy's Special Pizza &amp; Fish &amp; Chips,
     and Fresh &amp; Hot Pizza on Mill Street and West Front Street.</p>
</div>
<link rel="stylesheet" href="https://cybertect2023.github.io/BIA-Directory/assets/explore.css">
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/explore-loader.js"></script>
```

Squarespace settings:
- Page title: **Eat & Drink**
- URL slug: **eat-and-drink**
- SEO title: **Eat & Drink in Stirling-Rawdon | Cafés, Restaurants & Theatre Nights**
- SEO description: **Explore Stirling-Rawdon cafés, restaurants, pizza, local food and a special night at Stirling Festival Theatre. Find where to eat on Mill Street and West Front Street.**
- When tested and published, update the existing homepage Eat & Drink tile target to `/eat-and-drink`. Do not add more homepage card sections.

The GitHub loader dynamically injects the HTML content: crawlers without JavaScript may not see the full page. For highest SEO certainty, paste the static HTML from `pages/eat-and-drink.html` instead of the loader, at the cost of manual editing in Squarespace. The static heading and description above mitigate the risk but do not guarantee indexing of all dynamic copy.

## Editorial rules and source verification

- The current six restaurants are **not a ranked list** and are equally promoted, irrespective of commercial relationships or businesses purchasing services from any other party.
- Do not claim real-time openings, kitchen service, special offers, reservations, prices or menus unless supported by freshly confirmed operator data. Every card points visitors to an operator menu or direct contact where available.
- Never pretend a generic town photograph is a photograph of a restaurant's food. The hero uses existing BIA Squarespace image assets, marked decorative.
- `businesses.json` is the canonical BIA directory, with six records tagged `eat-local` as of October 2026. Adding another business to the directory **does not automatically add an editorial profile** to `pages/eat-and-drink.html`; the editorial guide should be updated too, once content and membership eligibility are confirmed.
- The mood filters are progressive enhancement in `assets/explore-loader.js`. All six entries are visible without a filter, and the dinner deep-link can be used in marketing. Filter categories describe food styles, **not open-now availability**.
- The Smokin' Barrel's current website lists weekday and weekend meal service starting around 11 a.m., whereas `businesses.json` retains a previous 6 p.m. to late-night schedule. Its own /contact page also has contradictory hours. The live business directory **needs its hours reconfirmed**; this guide intentionally omits exact hours.
- The Firehall Cafe also has conflicting hours and phone numbers across third-party directory sites; the guide links to the BIA's recorded `613-395-2855` and tells visitors to confirm hours. Contact the operator for the final accurate record.
- Feature the theatre's own pre-show dinners as a legitimate alternative to restaurants, and do not promise availability for every show.
- Historic collaborations may be referenced with a clear date. In September 2026, the theatre's production **Tea for Two & Two for Tee** identified Farm Girl Cafe as the supplier of a high tea menu. That is not an advertised standing offering.

## Key current sources (October 2026)

- [Farm Girl Cafe](https://farmgirlcafe.ca/) and [food menu](https://farmgirlcafe.ca/ourfood)
- [Hastings County: Food Boutique](https://www.hastings.ca/adventures/experiences/food-boutique), including a connection to The Smokin' Barrel's owners
- [The Smokin' Barrel website](https://www.smokinbarrel.ca/) and [current menu](https://www.smokinbarrel.ca/menu/menu)
- [Fresh & Hot Pizza](https://freshnhotpizza.ca/) and [Stirling store](https://freshnhotpizza.ca/locations/)
- [Stirling Festival Theatre performances](https://www.stirlingfestivaltheatre.com/whats-on), [pre-show dinner](https://www.stirlingfestivaltheatre.com/pre-show-dinner), and [parking](https://www.stirlingfestivaltheatre.com/parking)
- [The Firehall Cafe in BIA directory](https://www.visitstirlingrawdon.ca/business-directory)
- [Jimmy's Special Pizza in BIA directory](https://www.visitstirlingrawdon.ca/business-directory)

## Photograph and measurement next steps

Ask each business for a licensed, high-quality hero/food photograph and written permission for publication and promotion; store only approved image links. A clear photo and consistent listing will improve visitor trust more than adding decorative panels.

After Squarespace publishes and verifies the route, capture a baseline of:
- Landing-page views and traffic sources.
- Click-throughs to individual profiles.
- Menus, phone/directions and online ordering links.
- Click-throughs to theatre, farms, events, and shopping.

Set up attribution and analytics only with the BIA's approval and appropriate visitor privacy notices. Do not imply existing tracking when it has not been configured.

## Contribution and fairness

The BIA may formally acknowledge volunteer website development and maintenance contributions, including from CyberTECT, subject to board-approved transparency and conflict-of-interest practices. Business featuring decisions should be based on verifiable visitor value and equitable BIA policies, not conditioned on purchases from, or favours to, the developer. A documented in-kind contribution can support a public case study and future business introductions if the BIA approves it.
