# Member Resource Centre: content & backend maintenance

**Project:** Stirling-Rawdon BIA  
**Code:** GitHub repository `Cybertect2023/BIA-Directory`  
**Prepared:** October 2026  
**Stage:** Design and content architecture complete; Squarespace permissions and membership access deferred.

## How it works

Squarespace pages load HTML templates and a shared JavaScript loader from GitHub Pages. The loader fetches `member-resource-data.json` and renders only the sections needed for that page. The hub is navigation, not an endless page of resource listings.

| Page | Template | Page data |
| --- | --- | --- |
| Member hub (`/members-home`) | `member-resource-centre.html` | `announcement`, `meeting`, workshop count |
| Governance (`/bia-governance-documents`) | `member-governance.html` | `documents` |
| Business resources (`/business-resources-development`) | `member-business-resources.html` | `resources`, `workshops` |
| Member benefits (`/member-to-member-benefits`) | `member-benefits.html` | Placeholder only. Secure backend needed before activation |
| Member news (`/bia-news-communications`) | `member-news.html` | `news` |

The corresponding GitHub preview wrappers are in `previews/`. Styling is controlled in `assets/member-resource-centre.css`; list rendering and filters are in `assets/member-resource-centre.js`.

**Critical privacy limitation:** GitHub Pages is public. Neither a protected Squarespace page nor a visually hidden listing makes its GitHub-hosted source private. The JSON file must contain **only information independently cleared for public internet access**. Never place confidential board records, names/emails from member lists, private benefits, unpublished notices, restricted download links, login details, financial information, or other private records in GitHub.

## Current data status

- The existing seven public business support organization links remain in the `resources` array. These are the pre-existing curated links; their current availability should be checked periodically.
- `workshops` now contains six organizer-sourced upcoming events (verified October 17, 2026), each with real event artwork, a dated listing, and a link to the corresponding organizer event page. Expired dates are automatically hidden by the frontend.
- `documents`, `benefits`, and `news` remain empty placeholders.
- `announcement` and `meeting` contain non-specific development placeholders, not published dates or event claims.
- `programStatus.memberToMemberBenefits` is `pending-approval`.
- No private data or actual member-only benefits are maintained in the public repository.

## Editing the content

Edit `member-resource-data.json` in GitHub. Keep the existing JSON structure and use valid double quotes. Do not edit the HTML pages to add routine listings. Once approved public-safe information is added to JSON, the shared loader renders it into its page.

The publishing checks run with Node.js 22:

```bash
node scripts/validate-member-resource-data.mjs
node --test scripts/test-member-resource-data.mjs
```

GitHub Actions also runs these checks when the JSON, validation script or tests change. A passed automated check **does not** replace manual approval, source verification, privacy review, or secure storage.

### Business resource records

The `resources` array is for external support organizations, not member advertisements. The currently published legacy records have `name`, `category`, `description`, `url` and optional `linkLabel`.

For **newly reviewed entries**, add a `sourceUrl`, `verifiedAt` (`YYYY-MM-DD`) and `status: "published"`. Update the verification date only after personally checking the provider's own site.

The resources page automatically supports keyword search and category filtering; categories come from JSON, not a hard-coded dropdown.

### Workshop records

Only list a workshop once its **event-specific** details have been verified directly with the organizer and any internal editorial approval is complete. Each workshop must be public-safe and use:

```json
{
  "title": "VERIFIED EVENT TITLE",
  "description": "Verified summary of the training",
  "organizer": "Verified organizer",
  "format": "Online or in person",
  "startsAt": "2027-02-10T13:00:00-05:00",
  "dateLabel": "February 10, 2027",
  "url": "https://organizer.example/events/confirmed-workshop",
  "linkLabel": "Event details and registration",
  "topic": "Marketing & e-commerce",
  "imageUrl": "https://organizer.example/assets/event-poster.jpg",
  "imageCredit": "Artwork displayed by the event organizer",
  "status": "published",
  "audience": "public",
  "verifiedAt": "2027-01-20",
  "sourceUrl": "https://organizer.example/events/confirmed-workshop"
}
```

This is a **field reference, not an actual event**. The `imageUrl` should point to the event-specific promotional artwork directly displayed by its organizer (not a random stock image). Display it from the organizer source with appropriate attribution and confirm permission to republish or hotlink before full public launch. Do not paste these example values as a listing. The loader shows only upcoming events with a valid start datetime and a plausible HTTP(S) event page URL. The card image uses a responsive poster frame and falls back to a designed category panel if the host image fails to load. Verification of link functionality and accuracy is a manual step.

Workshops are **not** inserted in the public community events calendar. The business page shows seminars ahead of the general resource directory, with the date, format, organizer and related artwork visible.

### Governance documents

Only add documents that have been explicitly approved for general member distribution **and** separately approved to be publicly accessible on the internet. Internal board access and general member access are different permissions. If a document is member-only, keep it OUT of GitHub and use a proper authenticated storage integration in the later access phase.

Public-safe document record fields are `title`, `type`, `year`, `date`, `dateLabel`, `url`, `linkLabel`, `sourceUrl`, `verifiedAt`, `status: "published"`, `audience: "public"`, `approvedForMemberDistribution: true`, and `publicReleaseApproved: true`. All flags must reflect actual authorization, not assumptions.

The governance page supports search, type, and year filters, automatically hidden when no documents are available.

### BIA news

Use `news` only for approved public-safe organizational communications, not advertising by individual members. The expected fields are `title`, `description`, `category`, `date`, optional `dateLabel` / `url` / `linkLabel`, `sourceUrl`, `verifiedAt`, `status: "published"`, and `audience: "public"`. News displays newest first and supports topic filtering once approved records exist.

For the hub's `announcement`, an active link requires `status: "published"`, `audience: "public"`, and a verified public URL. Keep unconfirmed meeting dates out of `meeting` until sourced and approved.

### Member-to-member benefits

Do **not** add entries to `benefits`. The array must stay empty. The published repository and its validation workflow explicitly block this data type. Program rules are **proposed**, not adopted. Future work requires governance approval, consistent eligibility terms, staff moderation, and a storage/API mechanism enforcing authenticated access before a private directory can be turned on.

## Operational checklist before a new publication

- Confirm the original authoritative source and record the date it was checked.
- Confirm the BIA's authorization to publish, including any third-party content rights.
- Ensure the content is safe to view directly in a public browser without signing in.
- Confirm the listing is not an advertisement for an individual BIA business.
- Confirm a workshop registration link points to the real organizer and the event is still upcoming.
- Run the validator, review the JSON changes and check the published page visually on mobile and desktop.
- Leave private records in separately protected systems. The public GitHub feed must never be treated as a private database.

## Separate Squarespace work still required

The HTML and Code Blocks are prepared in `member-resource-centre-squarespace-setup.md`. Four Squarespace destination pages must still be created and tested. Access plans, billing, current accounts and the existing member configuration must remain unchanged until a deliberate, separate access audit. The GitHub previews are design previews, not proof of member protection.

## Troubleshooting

If a preview fails to load, verify GitHub Pages deployment and the browser network response for its HTML template, shared JS/CSS and `member-resource-data.json`. The page loader displays an unavailable message if template/data fetching fails. Browsers can cache older JavaScript; update the cache tag used by the Squarespace Code Block and preview wrapper when deploying a new loader revision. Do not remove existing access restrictions to make a preview work.
