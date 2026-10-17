/* Render the private Member Resource Centre from GitHub Pages templates and editable data. */
(() => {
  "use strict";

  const host = document.getElementById("bia-member-resource-centre");
  if (!host || host.dataset.loaded === "true") return;
  host.dataset.loaded = "true";

  const root = "https://cybertect2023.github.io/BIA-Directory/";
  const template = host.dataset.biaMemberTemplate || "member-resource-centre.html";
  const safeUrl = value => {
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
    style.href = root + "assets/member-resource-centre.css?v=streetscape";
    style.dataset.biaMemberCentreStyle = "true";
    document.head.append(style);
  };
  const showEmpty = (selector, message) => replace(selector, [el("p", "bia-member__empty", message)]);

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
      announcementLink.hidden = false;
    }

    const meeting = data.meeting || {};
    const meetingTitle = host.querySelector("[data-member-meeting-title]");
    const meetingCopy = host.querySelector("[data-member-meeting-copy]");
    if (meetingTitle) meetingTitle.textContent = meeting.title || "Schedule to be announced";
    if (meetingCopy) meetingCopy.textContent = meeting.copy || "Meeting notices and approved records will be posted here.";

    const resources = Array.isArray(data.resources) ? data.resources : [];
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

    const workshops = Array.isArray(data.workshops) ? data.workshops : [];
    const workshopCount = host.querySelector("[data-member-workshop-count]");
    const workshopCopy = host.querySelector("[data-member-workshop-copy]");
    if (workshopCount) workshopCount.textContent = workshops.length ? `${workshops.length} upcoming ${workshops.length === 1 ? "opportunity" : "opportunities"}` : "Listings being verified";
    if (workshopCopy) workshopCopy.textContent = workshops.length ? "Registration is handled directly by each organizer." : "Workshop details are being verified before publication.";
    if (workshops.length) {
      replace("[data-member-workshops]", workshops.slice(0, 6).map(workshop => {
        const card = el("article", "bia-member__workshop");
        const copyBlock = el("div", "");
        card.append(el("time", "bia-member__workshop-date", workshop.dateLabel || "Date to be confirmed"));
        copyBlock.append(el("h4", "", workshop.title || "Workshop"));
        copyBlock.append(el("p", "bia-member__workshop-meta", [workshop.organizer, workshop.format].filter(Boolean).join(" · ")));
        if (workshop.description) copyBlock.append(el("p", "", workshop.description));
        const destination = link(workshop.url, workshop.linkLabel || "Registration and details");
        if (destination) copyBlock.append(destination);
        card.append(copyBlock);
        return card;
      }));
    } else showEmpty("[data-member-workshops]", "Upcoming workshops are being verified. New listings will include the date, format, organizer, short description, and registration link.");

    const documents = Array.isArray(data.documents) ? data.documents : [];
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

    const benefits = Array.isArray(data.benefits) ? data.benefits : [];
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
    } else showEmpty("[data-member-benefits]", "The private benefits directory will be added after eligibility and program guidelines are finalized.");

    const news = Array.isArray(data.news) ? data.news : [];
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
    } else showEmpty("[data-member-news]", "BIA news and member notices will appear here as they are published.");
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
