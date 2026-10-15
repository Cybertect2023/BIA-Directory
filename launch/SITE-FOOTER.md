# Stirling-Rawdon BIA global Squarespace footer

A visitor-first, responsive sitewide footer designed to replace the old stacked links, small logo and floating Member Login button.

## Design

- Uses the existing **approved white Visit Stirling-Rawdon logo** hosted by Squarespace.
- Uses the approved BIA **heading and body fonts** by inheriting Squarespace variables `--heading-font-font-family` and `--body-font-font-family`. No Google Fonts or independent typography packages are added.
- Keeps the dark blue / blue-green palette and the existing rounded site buttons.
- Lead invitation: **Plan Your Visit** and **Explore & Enjoy**.
- Four balanced columns: BIA logo/contact, Discover, Explore & Plan, Our BIA.
- Correct links for `/events`, `/community-events`, `/plan-your-visit`, `/stirlingrawdon-bia-membership` and the existing protected member portal `/members-home`.
- Keeps the existing site credit to [CyberTECT](https://cybertect.ca/).
- Removes the old unmaintained **News** footer destination. It does **not** delete the News blog in Squarespace.

## Exactly how to install

1. In Squarespace 7.1, open any page, scroll down, hover the existing footer and choose **Edit Footer**.
2. **KEEP the functioning native Squarespace "Stay in the Loop" newsletter form.** Its First Name, Last Name, Email Address fields, submission and mailing-list connection should remain untouched. Do not convert it to an HTML form; the Github footer does **not** collect visitor data.
3. Below that signup, remove the **outdated separate blocks**: old white logo, the tall stack of Home/Business Directory/Membership/Events/News/Contact links, the floating **Member Login** button, and the old copyright and website-credit blocks. The new footer contains equivalent updated elements. Delete only the old blocks, **not the newsletter** or other approved Squarespace functionality.
4. Add a new **Blank Section** inside the same global footer, underneath the newsletter. Place **one Code Block** into it and stretch the block across the full available Fluid Engine width. Do not add a duplicate Code Block on individual pages.
5. Paste the full contents of [`launch/site-footer-code-block.html`](../launch/site-footer-code-block.html) into the new Code Block using **HTML** mode and **Display Source OFF**.
6. The new footer is dark blue-green itself, so use a coordinating section background and reduce its native **top and bottom spacing to minimum** to avoid double padding. The component already supplies its own responsive spacing.
7. Reduce the height/padding of the existing newsletter section as needed; keep its working Squarespace form and privacy message.
8. **Save** and inspect the public homepage and one interior page in a separate browser tab (not only the editor). Pages already in the site header do not need new duplicate navigation sections. The footer automatically appears sitewide.

The Code Block is only about 850 bytes, with live links as a fallback. The full design and link lists remain editable in GitHub.

### Squarespace Code Block

```html
<div id="sr-site-footer">
  <nav aria-label="Stirling-Rawdon footer links">
    <a href="/explore-and-enjoy">Explore &amp; Enjoy</a> ·
    <a href="/plan-your-visit">Plan Your Visit</a> ·
    <a href="/community-events">Community Events</a> ·
    <a href="/events">Events Calendar</a> ·
    <a href="/business-directory">Business Directory</a> ·
    <a href="/stirlingrawdon-bia-membership">Membership</a> ·
    <a href="/members-home">Member Login</a> ·
    <a href="/contact">Contact</a>
  </nav>
</div>
<link rel="stylesheet" href="https://cybertect2023.github.io/BIA-Directory/assets/site-footer.css">
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/site-footer.js"></script>
```

**Do not paste twice** and do not simultaneously keep the old footer blocks: duplicated logos, outdated News links and two credits would defeat the purpose.

## Files and visual review

- `pages/site-footer.html` is the source-of-truth HTML.
- `assets/site-footer.css` contains responsive, namespaced styling. No font files.
- `assets/site-footer.js` fetches the template, updates the year and gracefully keeps fallback links if the template is temporarily unavailable.
- `previews/site-footer.html` is the standalone visual preview (noindex). It does not simulate a functioning newsletter form or the rest of the Squarespace site.
- `scripts/render-site-footer.py` and the linked Actions workflow render desktop/mobile screenshot previews.
- Previews and audit (once generated): `previews/site-footer-desktop.jpg`, `previews/site-footer-mobile.jpg`, `previews/site-footer-report.json`.

## Validation after activation

- View the updated footer on the home page, `/explore-and-enjoy`, `/plan-your-visit`, `/events`, and a business profile. There should be **exactly one** sitewide footer everywhere.
- Check desktop, ~390-pixel smartphone, and narrow 320-pixel widths for layout overflow.
- Click Plan Your Visit, Explore & Enjoy, the Events Calendar, Membership and Member Login.
- Confirm the Squarespace newsletter actually submits to its existing audience; do not enter real personal information in automated smoke tests.
- Confirm keyboard focus outlines and accessible link names.
- Keep BIA-approved typography. Any future font change must be sitewide/brand-approved, not introduced by this component.
