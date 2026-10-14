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

  const hydrateEvents = async (layout) => {
    const widgets = layout.querySelectorAll("[data-bia-event]");
    if (!widgets.length) return;
    try {
      const response = await fetch(rootUrl + "explore/events.json", {cache: "no-cache"});
      if (!response.ok) return;
      const data = await response.json();
      for (const event of data.featuredEvents || []) {
        if (!event || !event.id) continue;
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
    } catch (error) {
      // Keep the fallback event text embedded in the page template.
      console.warn("Explore & Enjoy event details could not be refreshed:", error);
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
