/* Render the private Member Resource Centre from GitHub Pages templates and editable data. */
(() => {
  "use strict";

  const host = document.getElementById("bia-member-resource-centre");
  if (!host || host.dataset.loaded === "true") return;
  host.dataset.loaded = "true";

  const root = "https://cybertect2023.github.io/BIA-Directory/";
  const template = host.dataset.biaMemberTemplate || "member-resource-centre.html";
  const safeUrl = value => {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value, window.location.origin);
      return ["http:", "https:"].includes(url.protocol) ? url : null;
    } catch (_) { return null; }
  };
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  };
  const link = (url, label) => {
    const target = safeUrl(url);
    if (!target) return null;
    const node = el("a", "", label);
    node.href = target.href;
    if (target.origin !== window.location.origin) {
      node.target = "_blank";
      node.rel = "noopener noreferrer";
    }
    return node;
  };
  const replace = (selector, nodes) => {
    const destination = host.querySelector(selector);
    if (destination) destination.replaceChildren(...nodes);
  };
  const addStyles = () => {
    if (document.querySelector('link[data-bia-member-centre-style]')) return;
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = root + "assets/member-resource-centre.css?v=member-seminars-20261017";
    style.dataset.biaMemberCentreStyle = "true";
    document.head.append(style);
  };
  const showEmpty = (selector, message) => replace(selector, [el("p", "bia-member__empty", message)]);

  const approved = (raw, type) => (Array.isArray(raw) ? raw : []).filter(item => {
    if (!item || typeof item !== "object") return false;
    if (type === "resources") return !item.status || item.status === "published";
    return item.status === "published" && item.audience === "public" &&
      (type !== "documents" || item.approvedForMemberDistribution === true);
  });
  const upcoming = raw => approved(raw, "workshops").filter(item => {
    const date = Date.parse(item.startsAt || "");
    return Number.isFinite(date) && date >= Date.now() && item.organizer && safeUrl(item.url);
  }).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  const fillSelect = (selector, values) => {
    const element = host.querySelector(selector);
    if (!element) return;
    const unique = [...new Set(values.map(value => String(value || "").trim()).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "en-CA"));
    unique.forEach(value => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      element.append(option);
    });
  };
  const installFilter = ({ cardSelector, searchSelector, selectPairs, countSelector, filterWrapper, items }) => {
    const cards = [...host.querySelectorAll(cardSelector)];
    const search = host.querySelector(searchSelector);
    const selectors = selectPairs.map(pair => host.querySelector(pair.selector));
    if (filterWrapper) {
      const wrapper = host.querySelector(filterWrapper);
      if (wrapper) wrapper.hidden = !cards.length;
    }
    selectPairs.forEach(pair => fillSelect(pair.selector, items.map(item => item[pair.key])));
    const display = () => {
      const query = (search?.value || "").trim().toLowerCase();
      let matches = 0;
      cards.forEach((card, index) => {
        const item = items[index] || {};
        const termMatches = card.textContent.toLowerCase().includes(query);
        const selectsMatch = selectPairs.every((pair, j) => !selectors[j]?.value ||
          String(item[pair.key] || "") === selectors[j].value);
        card.hidden = !(termMatches && selectsMatch);
        if (!card.hidden) matches++;
      });
      const count = host.querySelector(countSelector);
      if (count && cards.length) count.textContent = "Showing " + matches + " of " + cards.length;
      const noMatches = host.querySelector(cardSelector)?.parentElement?.querySelector(".bia-member__filter-empty");
      if (noMatches) noMatches.hidden = matches > 0;
    };
    if (cards.length) {
      const parent = cards[0].parentElement;
      const noMatches = el("p", "bia-member__empty bia-member__filter-empty", "No matching results. Try another search or filter.");
      noMatches.hidden = true;
      parent.append(noMatches);
    }
    search?.addEventListener("input", display);
    selectors.forEach(control => control?.addEventListener("change", display));
    display();
  };
  const setupFilters = data => {
    const seminars = upcoming(data.workshops);
    installFilter({
      cardSelector: "[data-member-workshops] > .bia-member__seminar",
      searchSelector: "[data-member-seminar-search]",
      selectPairs: [
        {selector:"[data-member-seminar-topic]", key:"topic"},
        {selector:"[data-member-seminar-format]", key:"format"}
      ],
      countSelector: "[data-member-seminar-count]",
      filterWrapper: "[data-member-seminar-filters]",
      items:seminars
    });
    const resources = approved(data.resources, "resources");
    installFilter({
      cardSelector: "[data-member-resources] > .bia-member__resource",
      searchSelector: "[data-member-resource-search]",
      selectPairs: [{selector:"[data-member-resource-category]", key:"category"}],
      countSelector:"[data-member-resource-count]",
      items:resources
    });
    const documents = approved(data.documents, "documents").sort((a,b) => String(b.date || "").localeCompare(String(a.date || "")));
    installFilter({
      cardSelector:"[data-member-documents] > .bia-member__document",
      searchSelector:"[data-member-document-search]",
      selectPairs:[{selector:"[data-member-document-type]",key:"type"}, {selector:"[data-member-document-year]",key:"year"}],
      countSelector:"[data-member-document-count]",
      filterWrapper:"[data-member-document-filters]",
      items:documents
    });
    const news = approved(data.news, "news").sort((a,b) => String(b.date || "").localeCompare(String(a.date || "")));
    installFilter({
      cardSelector:"[data-member-news] > .bia-member__news",
      searchSelector:"[data-member-news-search]",
      selectPairs:[{selector:"[data-member-news-category]",key:"category"}],
      countSelector:"[data-member-news-count]",
      filterWrapper:"[data-member-news-filters]",
      items:news
    });
  };

  const hydrate = data => {
    const announcement = data.announcement || {};
    const title = host.querySelector("[data-member-announcement-title]");
    const copy = host.querySelector("[data-member-announcement-copy]");
    const announcementLink = host.querySelector("[data-member-announcement-link]");
    if (title) title.textContent = announcement.title || "Member Resource Centre in development";
    if (copy) copy.textContent = announcement.copy || "This private member resource is being prepared.";
    const announcementUrl = safeUrl(announcement.url);
    if (announcementLink && announcementUrl && announcement.linkLabel) {
      announcementLink.href = announcementUrl.href;
      announcementLink.textContent = announcement.linkLabel;
      announcementLink.hidden = announcement.status !== "published" || announcement.audience !== "public";
    }

    const meeting = data.meeting || {};
    const meetingTitle = host.querySelector("[data-member-meeting-title]");
    const meetingCopy = host.querySelector("[data-member-meeting-copy]");
    if (meetingTitle) meetingTitle.textContent = meeting.title || "Schedule to be announced";
    if (meetingCopy) meetingCopy.textContent = meeting.copy || "Meeting notices and approved records will be posted here.";

    const resources = approved(data.resources, "resources");
    if (resources.length) {
      replace("[data-member-resources]", resources.map(resource => {
        const card = el("article", "bia-member__resource");
        card.append(el("p", "bia-member__resource-type", resource.category || "Business support"));
        card.append(el("h3", "", resource.name || "Business resource"));
        card.append(el("p", "", resource.description || ""));
        const destination = link(resource.url, resource.linkLabel || "Visit resource");
        if (destination) card.append(destination);
        return card;
      }));
    } else showEmpty("[data-member-resources]", "The business support directory is being prepared.");

    const workshops = upcoming(data.workshops);
    const workshopCount = host.querySelector("[data-member-workshop-count]");
    const workshopCopy = host.querySelector("[data-member-workshop-copy]");
    if (workshopCount) workshopCount.textContent = workshops.length
      ? workshops.length + " upcoming " + (workshops.length === 1 ? "seminar" : "seminars")
      : "New seminars being verified";
    if (workshopCopy) workshopCopy.textContent = workshops.length
      ? "Explore verified dates, official event artwork, and organizer registration pages."
      : "Upcoming events will appear here once dates and registration details are confirmed.";
    if (workshops.length) {
      replace("[data-member-workshops]", workshops.map(workshop => {
        const card = el("article", "bia-member__seminar");
        const cover = el("div", "bia-member__seminar-cover");
        const visual = el("div", "bia-member__seminar-visual");
        const posterUrl = safeUrl(workshop.imageUrl);
        if (posterUrl && posterUrl.protocol === "https:") {
          const poster = el("img", "bia-member__seminar-image");
          poster.src = posterUrl.href;
          poster.alt = "Event artwork: " + (workshop.title || "Business seminar");
          poster.loading = "lazy";
          poster.decoding = "async";
          const fallback = el("div", "bia-member__seminar-fallback", workshop.topic || "Business learning");
          fallback.hidden = true;
          poster.addEventListener("error", () => {
            poster.hidden = true;
            fallback.hidden = false;
          }, {once:true});
          visual.append(poster, fallback);
        } else {
          visual.append(el("div", "bia-member__seminar-fallback", workshop.topic || "Business learning"));
        }
        const imageLink = link(workshop.url, "");
        if (imageLink) {
          imageLink.className = "bia-member__seminar-image-link";
          imageLink.setAttribute("aria-label", "Event details: " + (workshop.title || "Business seminar"));
          imageLink.append(visual);
          cover.append(imageLink);
        } else cover.append(visual);

        const body = el("div", "bia-member__seminar-body");
        const labels = el("div", "bia-member__seminar-labels");
        if (workshop.topic) labels.append(el("span", "bia-member__seminar-topic", workshop.topic));
        labels.append(el("span", "bia-member__seminar-format", workshop.format || "Workshop"));
        body.append(labels);
        const date = el("time", "bia-member__seminar-date", workshop.dateLabel || "Date to be confirmed");
        if (workshop.startsAt) date.dateTime = workshop.startsAt;
        body.append(date);
        body.append(el("h3", "bia-member__seminar-title", workshop.title || "Business seminar"));
        if (workshop.organizer) body.append(el("p", "bia-member__seminar-organizer", "Presented by " + workshop.organizer));
        if (workshop.description) body.append(el("p", "bia-member__seminar-description", workshop.description));
        const destination = link(workshop.url, workshop.linkLabel || "Event information & registration");
        if (destination) {
          destination.className = "bia-member__seminar-action";
          const arrow = el("span", "", "↗");
          arrow.setAttribute("aria-hidden", "true");
          destination.append(arrow);
          body.append(destination);
        }
        card.append(cover, body);
        return card;
      }));
    } else showEmpty("[data-member-workshops]", "There are no currently confirmed upcoming seminars. New opportunities will be added after dates and registration pages are verified.");

    const documents = approved(data.documents, "documents").sort((a,b) => String(b.date || "").localeCompare(String(a.date || "")));
    if (documents.length) {
      replace("[data-member-documents]", documents.map(document => {
        const card = el("article", "bia-member__document");
        card.append(el("p", "bia-member__document-type", [document.type, document.year].filter(Boolean).join(" · ")));
        card.append(el("h3", "", document.title || "BIA document"));
        if (document.dateLabel) card.append(el("p", "", document.dateLabel));
        const destination = link(document.url, document.linkLabel || "Download PDF");
        if (destination) card.append(destination);
        return card;
      }));
    } else showEmpty("[data-member-documents]", "The document library is being organized for member access. Approved agendas, minutes, reports, policies, and AGM information will be added here.");

    const benefits = []; // Always withheld: private offers require a protected source, not GitHub Pages.
    if (benefits.length) {
      replace("[data-member-benefits]", benefits.map(benefit => {
        const card = el("article", "bia-member__benefit");
        card.append(el("p", "bia-member__benefit-business", benefit.business || "Participating business"));
        card.append(el("h3", "", benefit.title || "Member benefit"));
        if (benefit.description) card.append(el("p", "", benefit.description));
        if (benefit.terms) card.append(el("p", "", benefit.terms));
        if (benefit.instructions) card.append(el("p", "", benefit.instructions));
        return card;
      }));
    } else showEmpty("[data-member-benefits]", "There are no active member-to-member benefits. Governance approval and genuinely protected member storage are required before the directory can be activated.");

    const news = approved(data.news, "news").sort((a,b) => String(b.date || "").localeCompare(String(a.date || "")));
    if (news.length) {
      replace("[data-member-news]", news.map(item => {
        const card = el("article", "bia-member__news");
        card.append(el("p", "bia-member__news-date", item.dateLabel || "BIA update"));
        card.append(el("h3", "", item.title || "BIA update"));
        if (item.description) card.append(el("p", "", item.description));
        const destination = link(item.url, item.linkLabel || "Read update");
        if (destination) card.append(destination);
        return card;
      }));
    } else showEmpty("[data-member-news]", "BIA news and member notices will appear here after verification and approval.");
    setupFilters(data);
  };

  addStyles();
  fetch(root + template, {cache: "no-cache"})
    .then(response => {
      if (!response.ok) throw new Error("Member centre template HTTP " + response.status);
      return response.text();
    })
    .then(html => {
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const layout = parsed.querySelector(".bia-member");
      if (!layout) throw new Error("Member centre wrapper is missing");
      host.replaceChildren(document.importNode(layout, true));
      if (window.location.hostname.endsWith("github.io")) {
        host.querySelectorAll("[data-member-preview-path]").forEach(anchor => {
          anchor.href = root + "previews/" + anchor.dataset.memberPreviewPath;
        });
      }
      return fetch(root + "member-resource-data.json", {cache: "no-cache"});
    })
    .then(response => {
      if (!response.ok) throw new Error("Member centre data HTTP " + response.status);
      return response.json();
    })
    .then(hydrate)
    .catch(error => {
      console.error("Unable to load the Member Resource Centre:", error);
      host.replaceChildren(el("p", "bia-member__error", "The Member Resource Centre is temporarily unavailable. Please try again shortly."));
    });
})();
