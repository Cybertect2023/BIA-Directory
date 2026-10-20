# Stirling-Rawdon BIA Member Resource Centre: Squarespace page setup

Prepared 17 October 2026. The four GitHub HTML templates already exist. This file contains the **Code Blocks to paste into the corresponding Squarespace pages**, not changes to live Squarespace pages or existing member access.

## Current hub

Existing Squarespace URL: https://www.visitstirlingrawdon.ca/members-home

GitHub Pages preview: https://cybertect2023.github.io/BIA-Directory/previews/member-resource-centre.html

The hub has four clickable cards and a compact updates row. Do not add the four detailed resource sections onto the hub.

Its Code Block, when updating the existing hub **without changing its page or access settings**, is:

```html
<div id="bia-member-resource-centre">Loading the Member Resource Centre…</div>
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/member-resource-centre.js?v=member-seminar-alignment-20261020"></script>
```

## Individual page Code Blocks

Use one Code Block per target Squarespace page. Set the block type to HTML. The script automatically loads the matching template and scoped CSS from GitHub Pages. These snippets do not create or alter access plans.

### BIA Governance & Documents

- Intended Squarespace URL: `/bia-governance-documents`
- Suggested page SEO title: BIA Governance & Documents | Stirling-Rawdon BIA
- Suggested SEO description: Member access to approved Stirling-Rawdon BIA agendas, meeting minutes, governance documents and organizational information.
- Preview: https://cybertect2023.github.io/BIA-Directory/previews/member-governance.html

```html
<div id="bia-member-resource-centre" data-bia-member-template="member-governance.html">
  Loading member resources…
</div>
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/member-resource-centre.js?v=member-seminar-alignment-20261020"></script>
```

### Business Resources & Development

- Intended Squarespace URL: `/business-resources-development`
- Suggested page SEO title: Business Resources & Development | Stirling-Rawdon BIA
- Suggested SEO description: Business support organizations, practical resources and verified learning opportunities for Stirling-Rawdon BIA members.
- Preview: https://cybertect2023.github.io/BIA-Directory/previews/member-business-resources.html

```html
<div id="bia-member-resource-centre" data-bia-member-template="member-business-resources.html">
  Loading member resources…
</div>
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/member-resource-centre.js?v=member-seminar-alignment-20261020"></script>
```

### Member-to-Member Benefits

- Intended Squarespace URL: `/member-to-member-benefits`
- Suggested page SEO title: Member-to-Member Benefits | Stirling-Rawdon BIA
- Suggested SEO description: Information about the proposed private member-to-member benefits program, subject to Stirling-Rawdon BIA approval.
- Preview: https://cybertect2023.github.io/BIA-Directory/previews/member-benefits.html

```html
<div id="bia-member-resource-centre" data-bia-member-template="member-benefits.html">
  Loading member resources…
</div>
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/member-resource-centre.js?v=member-seminar-alignment-20261020"></script>
```

### BIA News & Communications

- Intended Squarespace URL: `/bia-news-communications`
- Suggested page SEO title: BIA News & Communications | Stirling-Rawdon BIA
- Suggested SEO description: Member notices, organizational updates, participation opportunities and Stirling-Rawdon BIA communications.
- Preview: https://cybertect2023.github.io/BIA-Directory/previews/member-news.html

```html
<div id="bia-member-resource-centre" data-bia-member-template="member-news.html">
  Loading member resources…
</div>
<script defer src="https://cybertect2023.github.io/BIA-Directory/assets/member-resource-centre.js?v=member-seminar-alignment-20261020"></script>
```

## Publishing and access safeguards

1. Create each Squarespace page as a **draft or otherwise unpublished** page first, using the exact URL slug listed above. Do not make a private-member destination publicly available while access controls are unresolved.
2. Place the Code Block on that page, test its visual layout and navigation, and keep it within the existing Squarespace site structure.
3. The GitHub previews are **public design previews**, not member access controls. Squarespace protection for the eventual member-facing routes must be separately reviewed and tested before launch.
4. **Critical:** GitHub Pages serves template HTML, CSS, JavaScript and `member-resource-data.json` publicly. Protecting a Squarespace page does **not** protect data or documents served directly from GitHub. Never add confidential board documents, private contact data, member-only offer details or other sensitive information to the public repository. The empty arrays for documents, workshops, benefits and news remain placeholders until approved, verified and stored through suitable access-controlled means.
5. Keep business workshop listings separate from the public community events calendar. Do not advertise individual members through these pages.
6. Do not delete or modify existing Squarespace members, paid plans, payment setup, or protected content as part of the visual build.
7. When the actual access arrangements are ready for review, inspect existing Squarespace member-plan dependencies before changing any settings.

## GitHub source of truth

- `member-resource-centre.html` = hub
- `member-governance.html` = governance
- `member-business-resources.html` = business support and workshops
- `member-benefits.html` = proposed private exchange; **not active**
- `member-news.html` = communications
- `assets/member-resource-centre.css` = shared scoped styles
- `assets/member-resource-centre.js` = shared loader
- `member-resource-data.json` = current public-safe placeholder data and general business support links

The hub card links already point to the four Squarespace slugs. On GitHub Pages previews, the loader automatically substitutes the matching preview destinations instead.

## Completed backend implementation

The hub and all four detail templates now share a publishing-aware JSON loader. The business directory supports search and category filtering. Documents and news support search/filtering once genuinely public-safe approved records exist. Workshops automatically hide past dates. The member-to-member benefits area stays a proposal and deliberately never loads offers from GitHub Pages.

**Maintenance and review instructions:** [Member Resource Centre backend guide](docs/member-resource-centre-maintenance.md).

**Automated checks:** `scripts/validate-member-resource-data.mjs`, `scripts/test-member-resource-data.mjs`, and `scripts/test-member-template-contracts.mjs`. Checks detect common publication and template mistakes, but do not authorize any confidential release.

**Important for the live hub:** The GitHub source now uses `member-seminar-alignment-20261020` as the cache tag. The Squarespace `/members-home` Code Block may still have an older script URL. Its snippet needs to be refreshed separately in Squarespace; changing GitHub files does not rewrite the Squarespace Code Block.

**Not completed here:** Creating the four actual Squarespace pages, establishing their protection, auditing current accounts/access plans/payment configuration, and implementing private record storage. Those changes remain deliberately untouched.
