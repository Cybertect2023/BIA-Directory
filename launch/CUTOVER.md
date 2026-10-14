# Business Directory Launch — Stirling-Rawdon BIA

## Where things stand
- Existing live Squarespace blog directory: https://www.visitstirlingrawdon.ca/business-directory
- New coded staging directory: https://www.visitstirlingrawdon.ca/business-directory-update
- Central listing data: ../businesses.json
- Draft profile route manifest: launch-plan.json, with 29 proposed page slugs. **No individual Squarespace route has been confirmed in this manifest.**

## Deployment sequence
1. Create the individual Squarespace profile pages using the current short GitHub loader for `assets/profile.js`; set the element's `data-business-id` to the exact ID in `businesses.json`.
2. For each, verify that its actual Squarespace page URL resolves and shows the correct business, including contact details and responsive layout. The Squarespace slug does NOT have to equal the JSON ID, but the loader's `data-business-id` must equal it.
3. Once page URLs are confirmed, batch-update `businesses.json` `profileUrl` fields to the actual internal paths (e.g. `/creekside-yoga`). The directory will then make those cards clickable.
4. On the staging directory, test search, category filters, phone links, map/directions, every live profile link, and return-to-directory links. The profile renderer currently defaults to `/business-directory`, which intentionally points to the canonical URL after launch.
5. Preserve a copy of the existing blog directory content and list of its old blog post URLs so that permanent redirects can be mapped after replacement.
6. In Squarespace, move the existing blog directory to an archival/non-conflicting URL or otherwise free `/business-directory`. Change the NEW staging page slug from `/business-directory-update` to `/business-directory`. Make sure site navigation and the footer point to the canonical URL.
7. Add Squarespace **301 URL mappings** from the old blog post URLs to their new individual business profile page URLs; test each. Avoid forwarding all posts to just the directory where a matching business page exists.
8. Confirm search engine indexing and SEO title/description on each new Squarespace profile, check mobile rendering and contact details, and remove the staging path from navigation and indexing.

## Operational caveat
GitHub commits cannot create, rename, or publish Squarespace pages; those changes require the Squarespace interface or a separately authorized site-management integration. Do not populate unverified URLs into `businesses.json` because that activates dead links.

`businesses.json` includes an entry awaiting content review; verify that record before public promotion. Only publish approved contact data.
