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
