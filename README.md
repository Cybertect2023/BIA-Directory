# Stirling-Rawdon BIA Business Directory

Public business-directory data and centrally maintained visual templates for the Squarespace website.

## Files

- `businesses.json`: source of business names, categories, contact information, hours, services, images and profile links.
- `assets/bia.css`: shared, Squarespace-scoped styling for directory and individual profiles.
- `assets/directory.js`: searchable directory, category filters and cards.
- `assets/profile.js`: reusable business profile renderer.
- `index.html`: GitHub Pages landing page.

These files are served at `https://cybertect2023.github.io/BIA-Directory/`.

## Squarespace: directory Code Block

Replace the old full-directory Code Block with:

```html
<div id="bia-directory" class="bia-dir">Loading business directory…</div>
<link rel="stylesheet" href="https://cybertect2023.github.io/BIA-Directory/assets/bia.css">
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/directory.js"></script>
```

## Squarespace: business profile Code Block

Replace the old full-profile Code Block with:

```html
<div id="bia-business-profile" class="bia-profile" data-business-id="brad-comeau-law-office">
  Loading business profile…
</div>
<link rel="stylesheet" href="https://cybertect2023.github.io/BIA-Directory/assets/bia.css">
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/profile.js"></script>
```

For each new Squarespace business page, change only `data-business-id` to the exact business `id` in `businesses.json`. The page URL, SEO title and meta description are configured separately within Squarespace.

Set the `profileUrl` field in `businesses.json` to the business's **confirmed Squarespace path**, such as `/brad-comeau-law-office`, after creating and testing that page. Until a `profileUrl` is present, the directory displays "Profile coming soon" instead of linking to a missing page.

## Updating business information

Edit only `businesses.json`; GitHub Pages republishes it, and Squarespace reloads the data. There can be a short GitHub Pages/CDN caching delay before visitors see an update.

Optional keys are `about` (multi-paragraph business background) and `logo` (public image URL). `image` is used as a photo; `logo` is used when no photo exists. Otherwise a category icon appears.

Only publish approved business information. Do not store passwords, internal BIA membership records, payment information or authentication tokens here. Historical entries remain marked `verificationStatus: "needs-review"` until confirmed.

## Publishing and testing

1. Wait for GitHub Pages deployment after commits.
2. Test `/assets/directory.js`, `/assets/profile.js`, `/assets/bia.css`, and `/businesses.json` under the published GitHub Pages URL.
3. Save the Squarespace Code Block and test the public page in a separate incognito window. Squarespace disables embedded scripts inside its editor.
4. Keep the original HTML templates as backups until the new loaders have been visually verified on desktop and mobile.

The GitHub files do not grant visitors access to GitHub credentials or write permissions.

## Interactive visitor map

The standalone GitHub Pages preview is `/plan-your-visit/`. Activation instructions, SEO options, maintenance and component reuse are in [explore/VISITOR-MAP.md](explore/VISITOR-MAP.md). Review [geographic verification](explore/MAP-VERIFICATION.md) and [test evidence](explore/MAP-TESTING.md) before publishing the Squarespace destination. The new loader route does not add homepage sections or links from existing visitor pages.


## Member Resource Centre

The protected Squarespace Member Site uses a short Code Block on the hub and each of its four section pages. The layout, styling, and editable content are maintained here:

- `member-resource-centre.html`: the Member Resource Centre hub.
- `member-governance.html`, `member-business-resources.html`, `member-benefits.html`, and `member-news.html`: the section templates.
- `assets/member-resource-centre.css`: scoped Member Resource Centre styling.
- `assets/member-resource-centre.js`: loader and safe rendering for structured data.
- `member-resource-data.json`: announcements, approved document links, support-provider listings, verified workshops, voluntary benefits, and BIA news.

### Members Home

```html
<div id="bia-member-resource-centre">Loading the Member Resource Centre…</div>
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/member-resource-centre.js"></script>
```

### Section pages

Create each page as restricted member content in Squarespace, then use the matching template name:

```html
<div id="bia-member-resource-centre" data-bia-member-template="member-governance.html">Loading…</div>
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/member-resource-centre.js"></script>
```

Use `member-business-resources.html`, `member-benefits.html`, or `member-news.html` for the other three pages. The hub links expect these Squarespace paths:

- `/bia-governance-documents`
- `/business-resources-development`
- `/member-to-member-benefits`
- `/bia-news-communications`

The loader adds its own scoped stylesheet. Do not put confidential board records, individual business promotions, membership-roster data, payment information, or access codes in `member-resource-data.json`. Add only approved member-facing information and direct document links that are appropriate for all verified members.
