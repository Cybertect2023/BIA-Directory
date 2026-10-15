/* Render Explore & Enjoy page templates stored in GitHub Pages.
   Each Squarespace page needs only a short Code Block with data-explore-page.
   Existing business-directory scripts and styling are untouched. */
(() => {
  "use strict";

  const host = document.getElementById("bia-explore-page");
  if (!host || host.dataset.loaded === "true") return;
  host.dataset.loaded = "true";

  const rootUrl = "https://cybertect2023.github.io/BIA-Directory/";
  const templates = {
    "explore-and-enjoy": "pages/explore-and-enjoy.html",
    "farms-local-food": "pages/farms-local-food.html",
    "things-to-do": "pages/things-to-do.html",
    "community-events": "pages/community-events.html",
    "local-stories": "pages/local-stories.html"
  };

  const page = host.dataset.explorePage;
  if (!Object.prototype.hasOwnProperty.call(templates, page)) {
    host.append(document.createTextNode(" This visitor guide is not configured."));
    return;
  }

  const validateLink = (value) => {
    try {
      const u = new URL(value, window.location.origin);
      return ["http:", "https:"].includes(u.protocol);
    } catch (_) { return false; }
  };

  // Render a short upcoming-events list from GitHub data.
  // Expired events disappear automatically; no need to manually clear stale dates.
  // Legacy data-bia-event cards remain supported for older Squarespace snippets.
  const hydrateEvents = async (layout) => {
    const widgets = layout.querySelectorAll("[data-bia-event]");
    const list = layout.querySelector("[data-bia-event-list]");
    if (!widgets.length && !list) return;

    const element = (tag, className, content) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (typeof content === "string") node.textContent = content;
      return node;
    };

    try {
      const response = await fetch(rootUrl + "explore/events.json", {cache: "no-cache"});
      if (!response.ok) throw new Error("Event list HTTP " + response.status);
      const data = await response.json();
      const entries = Array.isArray(data.featuredEvents) ? data.featuredEvents : [];

      for (const event of entries) {
        if (!event || typeof event.id !== "string") continue;
        for (const card of widgets) {
          if (card.getAttribute("data-bia-event") !== event.id) continue;
          const title = card.querySelector("[data-event-title]");
          const desc = card.querySelector("[data-event-description]");
          const date = card.querySelector("[data-event-date-label]");
          const link = card.querySelector("[data-event-link]");
          if (title && typeof event.title === "string") title.textContent = event.title;
          if (desc && typeof event.description === "string") desc.textContent = event.description;
          if (date && typeof event.dateLabel === "string") date.textContent = event.dateLabel;
          if (date && typeof event.startDate === "string") date.setAttribute("datetime", event.startDate);
          if (link && typeof event.url === "string" && validateLink(event.url)) link.href = event.url;
          if (link && typeof event.linkLabel === "string") link.textContent = event.linkLabel;
        }
      }

      if (list) {
        const now = Date.now();
        const upcoming = entries
          .filter(event =>
            event &&
            typeof event.title === "string" &&
            typeof event.startDate === "string" &&
            typeof event.endDate === "string" &&
            Number.isFinite(Date.parse(event.startDate)) &&
            Date.parse(event.endDate) >= now &&
            typeof event.url === "string" &&
            validateLink(event.url)
          )
          .sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
          .slice(0, 6);
        if (!upcoming.length) {
          list.replaceChildren(element("p", "bia-events__empty", "No upcoming events have been added to this featured list yet. The BIA, Township, library and theatre calendars below have the latest organizer announcements."));
        } else {
          const cards = upcoming.map(event => {
            const card = element("article", "bia-events__listing");
            const top = element("div", "bia-events__listing-top");
            top.append(
              element("span", "bia-events__listing-type", event.category || "Community event"),
              element("span", "bia-events__listing-date", event.dateLabel || "")
            );
            const title = element("h3", "", event.title);
            const location = element("p", "bia-events__listing-location", event.location || "Stirling-Rawdon");
            const description = element("p", "bia-events__listing-description", event.description || "");
            const link = element("a", "", (event.linkLabel || "Event details") + " ↗");
            link.href = new URL(event.url, window.location.origin).href;
            if (new URL(link.href).origin !== window.location.origin) {
              link.target = "_blank";
              link.rel = "noopener noreferrer";
            }
            card.append(top, title, location, description, link);
            return card;
          });
          list.replaceChildren(...cards);
        }
      }
    } catch (error) {
      console.warn("Explore & Enjoy event details could not be refreshed:", error);
      if (list) {
        list.replaceChildren(element("p", "bia-events__empty", "The event list is temporarily unavailable. Check the BIA, Township, library or theatre calendars below for current details."));
      }
    } finally {
      if (list) list.setAttribute("aria-busy", "false");
    }
  };

  fetch(rootUrl + templates[page], { cache: "no-cache" })
    .then((response) => {
      if (!response.ok) throw new Error("Explore page HTTP " + response.status);
      return response.text();
    })
    .then((html) => {
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const layout = parsed.querySelector(".bia-explore");
      if (!layout) throw new Error("Explore page template is missing its wrapper");
      const imported = document.importNode(layout, true);
      host.replaceChildren(imported);
      void hydrateEvents(imported);
    })
    .catch((error) => {
      console.error("Unable to load Explore & Enjoy content:", error);
      const notice = document.createElement("p");
      notice.setAttribute("role", "status");
      notice.textContent = "The full visitor guide is temporarily unavailable. Please try again shortly.";
      host.append(notice);
    });
})();
